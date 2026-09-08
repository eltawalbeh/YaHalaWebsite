import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { validateContactPayload, validateQuotePayload, createRateLimiter, pickContactPayload, pickQuotePayload } from "./input-validation.js";
import { canTransitionQuote, validateServicePayload, archiveRecord } from "./lifecycle.js";
import {
  canManageInbox,
  canManagePublicContent,
  canManageUsers,
  isSupportedRole,
} from "./rbac.js";

const app = new Hono();

app.use('*', logger(console.log));
const allowedOrigins = new Set([
  "https://yahala.co",
  "https://www.yahala.co",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

app.use("/*", cors({
  origin: (origin) => !origin || allowedOrigins.has(origin) ? origin || "https://yahala.co" : "https://yahala.co",
  allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// ─── Helpers ───────────────────────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID();
}

async function recordAudit(entityType: string, entityId: string, action: string, before: any, after: any, c: any) {
  const actor = c.get('user') as any;
  const event = {
    id: generateId(), entity_type: entityType, entity_id: entityId, action,
    actor_id: actor?.id || 'system', actor_email: actor?.email || null,
    before: before || null, after: after || null, created_at: new Date().toISOString(),
  };
  await kv.set(`audit:${entityType}:${entityId}:${event.id}`, event);
  return event;
}

function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );
}

function authMiddleware() {
  return async (c: any, next: any) => {
    const token = c.req.header('X-Admin-Token');
    if (!token) return c.json({ error: 'Unauthorized' }, 401);

    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = user.user_metadata?.role;
    if (!isSupportedRole(role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    c.set('user', user);
    c.set('role', role);
    await next();
  };
}

function requireCapability(capability: (role: string) => boolean) {
  return async (c: any, next: any) => {
    const role = c.get('role') as string | undefined;
    if (!role || !capability(role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}

const requireUserManagement = requireCapability(canManageUsers);
const requirePublicContentManagement = requireCapability(canManagePublicContent);
const requireInboxManagement = requireCapability(canManageInbox);
const intakeLimiter = createRateLimiter({ limit: 10, windowMs: 60_000 });

function publicClientKey(c: any): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
}

function guardIntake(c: any, validator: (body: any) => { ok: boolean; error?: string }, body: any) {
  const contentLength = Number(c.req.header('content-length') || 0);
  if (contentLength > 32_000) return c.json({ error: 'Invalid request' }, 413);
  if (!intakeLimiter.allow(publicClientKey(c)).allowed) return c.json({ error: 'Too many requests' }, 429);
  const result = validator(body);
  return result.ok ? null : c.json({ error: 'Invalid request' }, 400);
}

// ─── Health ────────────────────────────────────────────────────────────────
app.get("/make-server-d8dd152e/health", (c) => c.json({
  status: "ok",
  service: "Ya Hala Travel & Tourism API",
  release: "6.0.0-local",
  checked_at: new Date().toISOString(),
}));

// ─── Admin User Management ─────────────────────────────────────────────────
app.get("/make-server-d8dd152e/admin/users", authMiddleware(), requireUserManagement, async (c) => {
  try {
    const supabase = getSupabase();
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    const safe = (users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || '',
      role: u.user_metadata?.role || 'moderator',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));
    return c.json(safe);
  } catch (e) {
    console.log("List users error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.post("/make-server-d8dd152e/admin/users", authMiddleware(), requireUserManagement, async (c) => {
  try {
    const supabase = getSupabase();
    const { email, password, name, role } = await c.req.json();
    if (!email || !password) return c.json({ error: "Email and password required" }, 400);
    if (!isSupportedRole(role || 'moderator')) return c.json({ error: "Invalid role" }, 400);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email, role: role || 'moderator' },
      email_confirm: true
    });
    if (error) throw error;
    return c.json({ success: true, user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name, role: data.user.user_metadata?.role, created_at: data.user.created_at } }, 201);
  } catch (e) {
    console.log("Create user error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.delete("/make-server-d8dd152e/admin/users/:id", authMiddleware(), requireUserManagement, async (c) => {
  try {
    const supabase = getSupabase();
    const requestingUser = c.get('user') as any;

    const id = c.req.param('id');
    if (id === requestingUser.id) return c.json({ error: 'Cannot delete yourself' }, 400);
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete user error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/admin/users/:id/role", authMiddleware(), requireUserManagement, async (c) => {
  try {
    const supabase = getSupabase();
    const requestingUser = c.get('user') as any;
    const id = c.req.param('id');
    const { role, name } = await c.req.json();
    if (!isSupportedRole(role)) return c.json({ error: "Invalid role" }, 400);
    if (id === requestingUser.id && role !== 'super_admin') {
      return c.json({ error: 'Cannot remove your own Super Admin role' }, 400);
    }
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { name, role }
    });
    if (error) throw error;
    return c.json({ success: true });
  } catch (e) {
    console.log("Update user role error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Services ──────────────────────────────────────────────────────────────
const defaultServices = [
  { id: "svc-flights", slug: "flights", name_ar: "تذاكر الطيران", name_en: "Flight Tickets", short_description_ar: "حجز تذاكر طيران بأفضل الأسعار لجميع الوجهات العالمية", short_description_en: "Book flight tickets at the best prices to all global destinations", is_featured: true, is_active: true, order_index: 1, cover_image_url: "https://images.unsplash.com/photo-1769945967065-ec805ecc7e6b?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1769945967065-ec805ecc7e6b?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-hotels", slug: "hotels", name_ar: "حجوزات الفنادق", name_en: "Hotel Reservations", short_description_ar: "فنادق فاخرة ومميزة في جميع أنحاء العالم", short_description_en: "Luxury and distinguished hotels worldwide", is_featured: true, is_active: true, order_index: 2, cover_image_url: "https://images.unsplash.com/photo-1743510605761-a53505d68c09?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1743510605761-a53505d68c09?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-ground", slug: "ground-transport", name_ar: "السيارات والقطارات", name_en: "Car & Train", short_description_ar: "خدمات النقل البري المتكاملة للشركات", short_description_en: "Comprehensive ground transport services for businesses", is_featured: true, is_active: true, order_index: 3, cover_image_url: "https://images.unsplash.com/photo-1771775751121-3091d79073d4?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1771775751121-3091d79073d4?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-mice", slug: "mice", name_ar: "المؤتمرات والفعاليات (MICE)", name_en: "MICE", short_description_ar: "تنظيم الاجتماعات والمؤتمرات والمعارض والفعاليات المؤسسية", short_description_en: "Organizing meetings, conferences, exhibitions and corporate events", is_featured: true, is_active: true, order_index: 4, cover_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-honeymoon", slug: "honeymoon", name_ar: "باقات شهر العسل", name_en: "Honeymoon Packages", short_description_ar: "رحلات شهر عسل استثنائية لبداية حياة مثالية", short_description_en: "Exceptional honeymoon trips for a perfect start", is_featured: false, is_active: true, order_index: 5, cover_image_url: "https://images.unsplash.com/photo-1766735325665-9e7dea46f9cc?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1766735325665-9e7dea46f9cc?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-cruises", slug: "cruises", name_ar: "رحلات الكروز", name_en: "Cruise Packages", short_description_ar: "إبحار فاخر في أجمل البحار والمحيطات حول العالم", short_description_en: "Luxury sailing on the most beautiful seas worldwide", is_featured: false, is_active: true, order_index: 6, cover_image_url: "https://images.unsplash.com/photo-1741962839137-01e0c297a281?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1741962839137-01e0c297a281?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-therapeutic", slug: "therapeutic-educational", name_ar: "السياحة العلاجية والتعليمية", name_en: "Therapeutic & Educational", short_description_ar: "رحلات متخصصة للعلاج والتعليم في أفضل المراكز العالمية", short_description_en: "Specialized trips for treatment and education at top global centers", is_featured: false, is_active: true, order_index: 7, cover_image_url: "https://images.unsplash.com/photo-1654762930571-dcf2ebc11542?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1654762930571-dcf2ebc11542?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-vip", slug: "vip", name_ar: "الطيران الخاص وخدمات VIP", name_en: "VIP & Private Flights", short_description_ar: "تجربة سفر استثنائية مع خدمات الطيران الخاص وكبار الشخصيات", short_description_en: "Exceptional travel experience with private jets and VIP services", is_featured: true, is_active: true, order_index: 8, cover_image_url: "https://images.unsplash.com/photo-1759614581731-4c7090648de0?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1759614581731-4c7090648de0?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-visa", slug: "visa-insurance", name_ar: "التأشيرات والتأمين", name_en: "Visa & Insurance", short_description_ar: "خدمات استخراج التأشيرات وتأمين السفر لجميع الوجهات", short_description_en: "Visa processing and travel insurance services for all destinations", is_featured: false, is_active: true, order_index: 9, cover_image_url: "https://images.unsplash.com/photo-1655722725332-9925c96dd627?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1655722725332-9925c96dd627?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "svc-corporate", slug: "corporate", name_ar: "حلول الأعمال المؤسسية", name_en: "Business Solutions", short_description_ar: "حلول سفر متكاملة مصممة خصيصاً للشركات والمؤسسات", short_description_en: "Comprehensive travel solutions designed specifically for businesses", is_featured: true, is_active: true, order_index: 10, cover_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=800&q=80", hero_image_url: "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?w=1200&q=80", features_json: [], process_steps_json: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

async function ensureDefaultServices() {
  const existing = await kv.getByPrefix("service:");
  if (existing && existing.length > 0) return;
  for (const svc of defaultServices) {
    await kv.set(`service:${svc.id}`, svc);
  }
}

app.get("/make-server-d8dd152e/services", async (c) => {
  try {
    await ensureDefaultServices();
    const services = await kv.getByPrefix("service:");
    const sorted = (services || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
    return c.json(sorted);
  } catch (e) {
    console.log("Get services error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.get("/make-server-d8dd152e/services/:slug", async (c) => {
  try {
    await ensureDefaultServices();
    const slug = c.req.param('slug');
    const services = await kv.getByPrefix("service:");
    const service = (services || []).find((s: any) => s.slug === slug || s.id === slug);
    if (!service) return c.json({ error: "Service not found" }, 404);
    return c.json(service);
  } catch (e) {
    console.log("Get service error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.post("/make-server-d8dd152e/services", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const body = await c.req.json();
    const validation = validateServicePayload(body);
    if (!validation.valid) return c.json({ error: "Validation failed", fields: validation.errors }, 400);
    const id = generateId();
    const now = new Date().toISOString();
    const service = { ...body, id, lifecycle_status: body.lifecycle_status || "published", created_at: now, updated_at: now };
    await kv.set(`service:${id}`, service);
    await recordAudit('service', id, 'create', null, service, c);
    return c.json(service, 201);
  } catch (e) {
    console.log("Create service error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/services/:id", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`service:${id}`) as any;
    if (!existing) return c.json({ error: "Not found" }, 404);
    const validation = validateServicePayload(body, existing);
    if (!validation.valid) return c.json({ error: "Validation failed", fields: validation.errors }, 400);
    const updated = { ...existing, ...body, id, updated_at: new Date().toISOString() };
    await kv.set(`service:${id}`, updated);
    await recordAudit('service', id, 'update', existing, updated, c);
    return c.json(updated);
  } catch (e) {
    console.log("Update service error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.delete("/make-server-d8dd152e/services/:id", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const id = c.req.param('id');
    const existing = await kv.get(`service:${id}`) as any;
    if (!existing) return c.json({ error: "Not found" }, 404);
    const archived = archiveRecord(existing);
    await kv.set(`service:${id}`, archived);
    await recordAudit('service', id, 'archive', existing, archived, c);
    return c.json(archived);
  } catch (e) {
    console.log("Delete service error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.get("/make-server-d8dd152e/audit/:entityType/:entityId", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const { entityType, entityId } = c.req.param();
    const events = await kv.getByPrefix(`audit:${entityType}:${entityId}:`);
    return c.json((events || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  } catch (e) {
    console.log("Get audit history error:", e);
    return c.json({ error: "Unable to load audit history" }, 500);
  }
});

// ─── Partners ──────────────────────────────────────────────────────────────
const defaultPartners = [
  { id: "ptn-1", name_en: "Al Naifat", name_ar: "النيفات", category: "corporate", is_featured: true, is_active: true, order_index: 1, logo_url: "", website_url: "", description_en: "Corporate partner", description_ar: "شريك مؤسسي", created_at: new Date().toISOString() },
  { id: "ptn-2", name_en: "CCC by STC", name_ar: "CCC بواسطة STC", category: "corporate", is_featured: true, is_active: true, order_index: 2, logo_url: "", website_url: "", description_en: "Telecommunications partner", description_ar: "شريك اتصالات", created_at: new Date().toISOString() },
  { id: "ptn-3", name_en: "Mira Food Group", name_ar: "مجموعة ميرا للأغذية", category: "corporate", is_featured: true, is_active: true, order_index: 3, logo_url: "", website_url: "", description_en: "Food industry partner", description_ar: "شريك في صناعة الغذاء", created_at: new Date().toISOString() },
  { id: "ptn-4", name_en: "Ansaldua Logistics", name_ar: "أنسالدوا لوجستيك", category: "logistics", is_featured: true, is_active: true, order_index: 4, logo_url: "", website_url: "", description_en: "Logistics partner", description_ar: "شريك لوجستي", created_at: new Date().toISOString() },
  { id: "ptn-5", name_en: "Shadid Insurance", name_ar: "شديد للتأمين", category: "corporate", is_featured: false, is_active: true, order_index: 5, logo_url: "", website_url: "", description_en: "Insurance partner", description_ar: "شريك تأمين", created_at: new Date().toISOString() },
  { id: "ptn-6", name_en: "Al Akkad Holding", name_ar: "العقاد القابضة", category: "corporate", is_featured: true, is_active: true, order_index: 6, logo_url: "", website_url: "", description_en: "Holding company partner", description_ar: "شركة قابضة", created_at: new Date().toISOString() },
  { id: "ptn-7", name_en: "Abanmi Investment", name_ar: "أبانمي للاستثمار", category: "corporate", is_featured: false, is_active: true, order_index: 7, logo_url: "", website_url: "", description_en: "Investment partner", description_ar: "شريك استثماري", created_at: new Date().toISOString() },
  { id: "ptn-8", name_en: "Ghad Medical Colleges", name_ar: "كليات الغد الطبية", category: "education", is_featured: true, is_active: true, order_index: 8, logo_url: "", website_url: "", description_en: "Medical education partner", description_ar: "شريك تعليم طبي", created_at: new Date().toISOString() },
  { id: "ptn-9", name_en: "Atlas Pharmaceutical", name_ar: "أطلس للأدوية", category: "medical", is_featured: true, is_active: true, order_index: 9, logo_url: "", website_url: "", description_en: "Pharmaceutical partner", description_ar: "شريك صيدلاني", created_at: new Date().toISOString() },
  { id: "ptn-10", name_en: "Gulf Systems (Al Hoshan)", name_ar: "أنظمة الخليج (الحوشان)", category: "corporate", is_featured: false, is_active: true, order_index: 10, logo_url: "", website_url: "", description_en: "Technology partner", description_ar: "شريك تقني", created_at: new Date().toISOString() },
  { id: "ptn-11", name_en: "Italian Embassy", name_ar: "السفارة الإيطالية", category: "embassy", is_featured: true, is_active: true, order_index: 11, logo_url: "", website_url: "", description_en: "Embassy partner", description_ar: "شريك سفارة", created_at: new Date().toISOString() },
  { id: "ptn-12", name_en: "KACST", name_ar: "مدينة الملك عبدالعزيز للعلوم والتقنية", category: "government", is_featured: true, is_active: true, order_index: 12, logo_url: "", website_url: "", description_en: "Government research partner", description_ar: "شريك حكومي للبحث", created_at: new Date().toISOString() },
  { id: "ptn-13", name_en: "Embassy of South Africa", name_ar: "سفارة جنوب أفريقيا", category: "embassy", is_featured: false, is_active: true, order_index: 13, logo_url: "", website_url: "", description_en: "Embassy partner", description_ar: "شريك سفارة", created_at: new Date().toISOString() },
  { id: "ptn-14", name_en: "Embassy of Tanzania", name_ar: "سفارة تنزانيا", category: "embassy", is_featured: false, is_active: true, order_index: 14, logo_url: "", website_url: "", description_en: "Embassy partner", description_ar: "شريك سفارة", created_at: new Date().toISOString() },
  { id: "ptn-15", name_en: "Mellor Entertainment", name_ar: "ميلور للترفيه", category: "corporate", is_featured: false, is_active: true, order_index: 15, logo_url: "", website_url: "", description_en: "Entertainment partner", description_ar: "شريك ترفيه", created_at: new Date().toISOString() },
  { id: "ptn-16", name_en: "Jerash Pharmaceuticals", name_ar: "جرش للأدوية", category: "medical", is_featured: false, is_active: true, order_index: 16, logo_url: "", website_url: "", description_en: "Pharmaceutical partner", description_ar: "شريك صيدلاني", created_at: new Date().toISOString() },
  { id: "ptn-17", name_en: "Areic Holding", name_ar: "أريك القابضة", category: "corporate", is_featured: false, is_active: true, order_index: 17, logo_url: "", website_url: "", description_en: "Holding company", description_ar: "شركة قابضة", created_at: new Date().toISOString() },
  { id: "ptn-18", name_en: "Digital Cooperation Organization (DCO)", name_ar: "منظمة التعاون الرقمي", category: "government", is_featured: true, is_active: true, order_index: 18, logo_url: "", website_url: "", description_en: "International digital organization", description_ar: "منظمة رقمية دولية", created_at: new Date().toISOString() },
  { id: "ptn-19", name_en: "Ministry of Agriculture (Aquaculture)", name_ar: "وزارة الزراعة (الأحياء المائية)", category: "government", is_featured: false, is_active: true, order_index: 19, logo_url: "", website_url: "", description_en: "Government ministry partner", description_ar: "وزارة حكومية", created_at: new Date().toISOString() },
  { id: "ptn-20", name_en: "Accolade Livestock GCC", name_ar: "أكولاد للثروة الحيوانية خليج", category: "corporate", is_featured: false, is_active: true, order_index: 20, logo_url: "", website_url: "", description_en: "Livestock industry partner", description_ar: "شريك ثروة حيوانية", created_at: new Date().toISOString() },
];

async function ensureDefaultPartners() {
  const existing = await kv.getByPrefix("partner:");
  if (existing && existing.length > 0) return;
  for (const p of defaultPartners) {
    await kv.set(`partner:${p.id}`, p);
  }
}

app.get("/make-server-d8dd152e/partners", async (c) => {
  try {
    await ensureDefaultPartners();
    const partners = await kv.getByPrefix("partner:");
    const sorted = (partners || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
    return c.json(sorted);
  } catch (e) {
    console.log("Get partners error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.post("/make-server-d8dd152e/partners", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const partner = { ...body, id, created_at: new Date().toISOString() };
    await kv.set(`partner:${id}`, partner);
    return c.json(partner, 201);
  } catch (e) {
    console.log("Create partner error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/partners/:id", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`partner:${id}`) as any;
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, ...body, id };
    await kv.set(`partner:${id}`, updated);
    return c.json(updated);
  } catch (e) {
    console.log("Update partner error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.delete("/make-server-d8dd152e/partners/:id", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`partner:${id}`);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete partner error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Quote Requests ────────────────────────────────────────────────────────
app.get("/make-server-d8dd152e/quotes", authMiddleware(), requireInboxManagement, async (c) => {
  try {
    const quotes = await kv.getByPrefix("quote:");
    const sorted = (quotes || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json(sorted);
  } catch (e) {
    console.log("Get quotes error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.post("/make-server-d8dd152e/quotes", async (c) => {
  try {
    const body = await c.req.json();
    const rejected = guardIntake(c, validateQuotePayload, body);
    if (rejected) return rejected;
    const safeBody = pickQuotePayload(body);
    const id = generateId();
    const quote = { ...safeBody, id, status: "new", is_read: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    await kv.set(`quote:${id}`, quote);
    return c.json(quote, 201);
  } catch (e) {
    console.log("Create quote error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/quotes/:id", authMiddleware(), requireInboxManagement, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`quote:${id}`) as any;
    if (!existing) return c.json({ error: "Not found" }, 404);
    if (body.status && !canTransitionQuote(existing.status || "new", body.status)) {
      return c.json({ error: "Invalid quote status transition" }, 400);
    }
    const updated = { ...existing, ...body, id, updated_at: new Date().toISOString() };
    await kv.set(`quote:${id}`, updated);
    await recordAudit('quote', id, body.status ? 'status_change' : 'update', existing, updated, c);
    return c.json(updated);
  } catch (e) {
    console.log("Update quote error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.delete("/make-server-d8dd152e/quotes/:id", authMiddleware(), requireUserManagement, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`quote:${id}`);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete quote error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Contact Messages ──────────────────────────────────────────────────────
app.get("/make-server-d8dd152e/messages", authMiddleware(), requireInboxManagement, async (c) => {
  try {
    const messages = await kv.getByPrefix("message:");
    const sorted = (messages || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json(sorted);
  } catch (e) {
    console.log("Get messages error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.post("/make-server-d8dd152e/messages", async (c) => {
  try {
    const body = await c.req.json();
    const rejected = guardIntake(c, validateContactPayload, body);
    if (rejected) return rejected;
    const safeBody = pickContactPayload(body);
    const id = generateId();
    const message = { ...safeBody, id, is_read: false, created_at: new Date().toISOString() };
    await kv.set(`message:${id}`, message);
    return c.json(message, 201);
  } catch (e) {
    console.log("Create message error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/messages/:id", authMiddleware(), requireInboxManagement, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`message:${id}`) as any;
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, ...body, id };
    await kv.set(`message:${id}`, updated);
    return c.json(updated);
  } catch (e) {
    console.log("Update message error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.delete("/make-server-d8dd152e/messages/:id", authMiddleware(), requireUserManagement, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`message:${id}`);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete message error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Hero Content ──────────────────────────────────────────────────────────
const defaultHero = {
  headline_ar: "شريككم في السفر الاحترافي",
  headline_en: "Your Partner in Professional Travel",
  subheadline_ar: "نقدم حلول سفر متكاملة للشركات والمؤسسات في المملكة العربية السعودية والخليج",
  subheadline_en: "We provide comprehensive travel solutions for corporations and institutions across Saudi Arabia and the Gulf",
  cta1_text_ar: "طلب عرض أسعار",
  cta1_text_en: "Request a Quote",
  cta2_text_ar: "استكشف خدماتنا",
  cta2_text_en: "Explore Services",
  background_image_url: "https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=1920&q=90",
  background_video_url: "",
  is_active: true,
  updated_at: new Date().toISOString(),
};

app.get("/make-server-d8dd152e/hero", async (c) => {
  try {
    let hero = await kv.get("hero:main");
    if (!hero) {
      await kv.set("hero:main", defaultHero);
      hero = defaultHero;
    }
    return c.json(hero);
  } catch (e) {
    console.log("Get hero error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/hero", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const body = await c.req.json();
    const existing = await kv.get("hero:main") || defaultHero;
    const updated = { ...existing, ...body, updated_at: new Date().toISOString() };
    await kv.set("hero:main", updated);
    return c.json(updated);
  } catch (e) {
    console.log("Update hero error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Stats ─────────────────────────────────────────────────────────────────
const defaultStats = [
  { id: "stat-1", value: "20+", label_ar: "سنة خبرة", label_en: "Years Experience", icon_name: "Award", order_index: 1, is_active: true },
  { id: "stat-2", value: "500+", label_ar: "عميل مؤسسي", label_en: "Corporate Clients", icon_name: "Building2", order_index: 2, is_active: true },
  { id: "stat-3", value: "50+", label_ar: "شريك عالمي", label_en: "Global Partners", icon_name: "Globe", order_index: 3, is_active: true },
  { id: "stat-4", value: "24/7", label_ar: "دعم متواصل", label_en: "Continuous Support", icon_name: "Headphones", order_index: 4, is_active: true },
];

async function ensureDefaultStats() {
  const existing = await kv.getByPrefix("stat:");
  if (existing && existing.length > 0) return;
  for (const s of defaultStats) {
    await kv.set(`stat:${s.id}`, s);
  }
}

app.get("/make-server-d8dd152e/stats", async (c) => {
  try {
    await ensureDefaultStats();
    const stats = await kv.getByPrefix("stat:");
    const sorted = (stats || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
    return c.json(sorted);
  } catch (e) {
    console.log("Get stats error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.post("/make-server-d8dd152e/stats", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const stat = { ...body, id };
    await kv.set(`stat:${id}`, stat);
    return c.json(stat, 201);
  } catch (e) {
    console.log("Create stat error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/stats/:id", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`stat:${id}`) as any;
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, ...body, id };
    await kv.set(`stat:${id}`, updated);
    return c.json(updated);
  } catch (e) {
    console.log("Update stat error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.delete("/make-server-d8dd152e/stats/:id", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`stat:${id}`);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete stat error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Settings ──────────────────────────────────────────────────────────────
const defaultSettings = {
  site_name_ar: "يا هلا للسفر والسياحة",
  site_name_en: "Ya Hala Travel & Tourism",
  tagline_ar: "شريككم في السفر الاحترافي",
  tagline_en: "Your Partner in Professional Travel",
  address: "RH7X+7FJ, Prince Muhammad Ibn Saad Ibn Abdulaziz Rd, Al Malqa, Riyadh 13324",
  phone: "+966 11 263 3000",
  email: "info@yahala.co",
  website: "www.yahala.co",
  instagram: "https://instagram.com/yahalatravel",
  twitter: "https://twitter.com/yahalatravel",
  linkedin: "https://linkedin.com/company/yahalatravel",
  facebook: "https://facebook.com/yahalatravel",
  footer_text_ar: "© 2026 يا هلا للسفر والسياحة. جميع الحقوق محفوظة.",
  footer_text_en: "© 2026 Ya Hala Travel & Tourism. All rights reserved.",
  updated_at: new Date().toISOString(),
};

app.get("/make-server-d8dd152e/settings", async (c) => {
  try {
    let settings = await kv.get("settings:main");
    if (!settings) {
      await kv.set("settings:main", defaultSettings);
      settings = defaultSettings;
    }
    return c.json(settings);
  } catch (e) {
    console.log("Get settings error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

app.put("/make-server-d8dd152e/settings", authMiddleware(), requirePublicContentManagement, async (c) => {
  try {
    const body = await c.req.json();
    const existing = await kv.get("settings:main") || defaultSettings;
    const updated = { ...existing, ...body, updated_at: new Date().toISOString() };
    await kv.set("settings:main", updated);
    return c.json(updated);
  } catch (e) {
    console.log("Update settings error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// ─── Dashboard Stats ───────────────────────────────────────────────────────
app.get("/make-server-d8dd152e/dashboard/stats", authMiddleware(), requireInboxManagement, async (c) => {
      const requestStartedAt = Date.now();
      try {
    const quotes = await kv.getByPrefix("quote:") || [];
    const messages = await kv.getByPrefix("message:") || [];
    const services = await kv.getByPrefix("service:") || [];
    const partners = await kv.getByPrefix("partner:") || [];
    const audits = await kv.getByPrefix("audit:") || [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const quotesToday = quotes.filter((q: any) => new Date(q.created_at) >= today).length;
    const quotesWeek = quotes.filter((q: any) => new Date(q.created_at) >= weekAgo).length;
    const unreadMessages = messages.filter((m: any) => !m.is_read).length;
    const unreadQuotes = quotes.filter((q: any) => !q.is_read).length;
    const activeServices = services.filter((s: any) => s.is_active).length;
    const activePartners = partners.filter((p: any) => p.is_active).length;
    const activity = Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - (6 - index));
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const inDay = (record: any) => {
        const created = new Date(record.created_at);
        return created >= day && created < nextDay;
      };
      return {
        name: day.toLocaleDateString("en-US", { weekday: "short" }),
        quotes: quotes.filter(inDay).length,
        messages: messages.filter(inDay).length,
      };
    });
    const auditAlerts = audits
      .filter((event: any) => new Date(event.created_at).getTime() >= Date.now() - 24 * 60 * 60 * 1000)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((event: any) => ({ id: event.id, entity_type: event.entity_type, entity_id: event.entity_id, action: event.action, created_at: event.created_at }));
    return c.json({ quotesToday, quotesWeek, unreadMessages, unreadQuotes, activeServices, activePartners, totalQuotes: quotes.length, totalMessages: messages.length, activity, audit_alerts: auditAlerts, response_time_ms: Date.now() - requestStartedAt });
  } catch (e) {
    console.log("Dashboard stats error:", e);
    return c.json({ error: String(e) }, 500);
  }
});

Deno.serve(app.fetch);