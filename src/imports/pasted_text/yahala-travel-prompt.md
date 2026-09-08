Ya Hala Travel & Tourism — Full Figma Make Prompt
B2B Corporate Website with Supabase CMS + Admin Dashboard

🎯 PROJECT OVERVIEW
Build a full-stack, modern corporate travel website for Ya Hala Travel & Tourism (yahala.co), a Saudi Arabia-based B2B travel agency headquartered in Riyadh. The site targets corporate clients (small, medium, and large companies), government entities, and diplomatic missions across the GCC. 90% of their business is B2B. They offer flight ticketing, hotel reservations, MICE (Meetings, Incentives, Conferences & Exhibitions), VIP/private jets, visa services, and corporate travel management.
The website must be bilingual (Arabic RTL + English LTR), feel like a luxury corporate platform (think Bloomberg Corporate + luxury airline aesthetics), and include a full Admin CMS Dashboard powered by Supabase (PostgreSQL + Auth + Storage + Realtime).

🎨 DESIGN DIRECTION
Aesthetic: "Refined Arabian Corporate Luxury"

Tone: Premium, authoritative, global — not a generic travel booking site.
Color Palette:

Primary: #005F6B (Ya Hala deep teal — from brand)
Secondary: #1A1A2E (midnight navy for depth)
Accent: #C9A84C (warm gold — premium Saudi market)
Surface: #F8F7F4 (off-white, warm parchment feel)
Text: #1C1C1C and #6B7280
White: #FFFFFF


Typography:

Arabic: Noto Kufi Arabic (headers), IBM Plex Arabic (body)
English: Canela or Freight Display Pro (headers — editorial luxury), Söhne or Neue Haas Grotesk (body — precise corporate)
Font import via Google Fonts: use Noto Kufi Arabic + Playfair Display + DM Sans as fallback trio


Layout: Grid-breaking asymmetric sections, generous whitespace, overlapping image-text blocks, full-width hero with cinematic photography.
Animations: Smooth page transitions, staggered card reveals on scroll (Intersection Observer), parallax hero, counter animations for stats, hover states with gold accent underlines.
Visual Language: Subtle geometric grid patterns inspired by the Ya Hala brand squares motif, grain texture overlays on dark sections, large typographic numbers for stats.


🗂️ SITE STRUCTURE (Pages)
Public-Facing Pages

Home (/)
About (/about)
Services (/services)

Flight Tickets (/services/flights)
Hotel Reservations (/services/hotels)
Car & Train (/services/ground-transport)
MICE (/services/mice)
Honeymoon Packages (/services/honeymoon)
Cruise Packages (/services/cruises)
Therapeutic & Educational (/services/therapeutic-educational)
VIP & Private Flights (/services/vip)
Visa & Insurance (/services/visa-insurance)
Business Solutions (/services/corporate)


Partners (/partners)
Contact (/contact)
Request a Quote (/quote)

Admin Dashboard Pages (Protected, /admin/*)

Admin Login (/admin/login)
Dashboard Home (/admin/dashboard)
Services Manager (/admin/services)
Partners Manager (/admin/partners)
Quote Requests (/admin/quotes)
Contact Messages (/admin/messages)
Hero & Media Manager (/admin/media)
Settings (/admin/settings)


🏠 PAGE 1: HOME (/)
Section 1.1 — Navigation Bar

Fixed top nav, blur-on-scroll glassmorphism effect
Left: Ya Hala logo (SVG, teal + green)
Center (desktop): Nav links — Home | Services | About | Partners | Contact
Right: Language toggle (AR | EN) + "Request a Quote" CTA button (gold, rounded pill)
Mobile: Hamburger menu with full-screen overlay slide-in
Supabase: site_settings table controls logo URL, nav links, CTA text

Section 1.2 — Hero

Full-viewport cinematic hero with video background (or high-quality image fallback)
Parallax scroll effect on background
Overlay: dark gradient from bottom-left
Main headline (Arabic): "شريككم في السفر الاحترافي" | (English): "Your Partner in Professional Travel"
Subheadline: "نقدم حلول سفر متكاملة للشركات والمؤسسات في المملكة العربية السعودية والخليج"
Two CTA buttons: "Request a Quote" (gold solid) + "Explore Services" (outline white)
Animated scroll indicator (bouncing arrow)
Supabase: hero_content table (headline_ar, headline_en, subheadline_ar, subheadline_en, cta1_text, cta2_text, background_video_url, background_image_url)

Section 1.3 — Marquee Stats Bar

Full-width dark teal band
Animated counter numbers: 20+ سنة خبرة, 500+ عميل مؤسسي, 50+ شريك عالمي, 24/7 دعم متواصل
Horizontal scrolling marquee on mobile
Supabase: stats table (label_ar, label_en, value, icon)

Section 1.4 — "Why Ya Hala" (Value Props)

2-column asymmetric layout: left side large editorial image (desert/Saudi landscape), right side 4 value props stacked
Each value prop: icon (line art, gold) + title + 1-line description
Props: Experience | Technology | Network | 24/7 Support
Supabase: value_props table (title_ar, title_en, description_ar, description_en, icon_name)

Section 1.5 — Services Grid

Section title: "خدماتنا" | "Our Services"
Masonry or asymmetric CSS grid of service cards (3-4 visible, "View All" loads more)
Each card: full-bleed background image, gradient overlay, service name, short description, arrow link
Hover: scale up, gold border accent
Supabase: services table (name_ar, name_en, slug, description_ar, description_en, cover_image_url, is_featured, order_index)

Section 1.6 — Corporate Solutions CTA Strip

Dark navy full-width section
Headline: "حلول متكاملة للشركات الصغيرة والمتوسطة والكبيرة"
3 horizontal cards: Small Business | Corporate | Enterprise
Each with icon, brief description, "Learn More" link
Supabase: corporate_tiers table

Section 1.7 — Payment & Settlement Methods

White section with headline: "طرق الدفع المعتمدة" | "Accepted Payment Methods"
Icons/logos displayed in a horizontal row with subtle card styling:

Visa | Mastercard | Mada (Saudi debit network) | Apple Pay | STC Pay
BNPL/Settlement: Tamara | Tabby | Muyassar


Small note: "جميع المدفوعات آمنة ومشفرة" | "All payments are secure and encrypted"
Supabase: payment_methods table (name, logo_url, is_active, category: card|bnpl|wallet)

Section 1.8 — Featured Partners Carousel

Section: "شركاؤنا في النجاح" | "Our Partners in Success"
Infinite auto-scrolling logo carousel (pause on hover)
2 rows of logos on desktop, 1 row on mobile
Supabase: partners table (name, logo_url, website_url, is_featured, category)

Section 1.9 — Quote Request Form (Floating CTA)

Split section: left dark teal background with headline + bullet benefits, right white card with form
Form fields:

Company Name (text)
Contact Person (text)
Phone (tel, with Saudi +966 prefix)
Email (email)
Service Type (multi-select dropdown: Flights | Hotels | MICE | VIP | Visa | Other)
Travel Dates (date range picker)
Number of Travelers (number)
Message/Requirements (textarea)
Submit button (gold)


On submit: insert to Supabase quote_requests table + send email notification via Supabase Edge Function (Resend API)
Success state: animated checkmark + confirmation message
Supabase: quote_requests table (id, company_name, contact_person, phone, email, services[], travel_dates, num_travelers, message, status: new|in_review|quoted|closed, created_at)

Section 1.10 — Footer

4-column grid: Logo + tagline | Quick Links | Services | Contact Info
Bottom bar: Copyright | Privacy Policy | Terms
Social icons: Instagram, Twitter/X, LinkedIn, TikTok, Facebook
Supabase: footer_content table


📄 PAGE 2: ABOUT (/about)
Sections:

Hero — Full-width image, breadcrumb, page title
Who We Are — 2-col: text left, image mosaic right. Rich text from Supabase pages table (slug: 'about', content_ar, content_en)
Our Mission — Dark background, centered large serif headline + supporting paragraph
Our Values — 5 values in horizontal card row with icons (Quality | Integrity | Transparency | Diversity | Innovation). Supabase: values table
Our Team — Headline + description. Optional team member cards if populated. Supabase: team_members table (name, role_ar, role_en, photo_url, bio_ar, bio_en)
Stats Bar — Same animated counters as homepage


🛠️ PAGE 3: SERVICES (Parent + Sub-pages)
/services — Services Hub

Masonry grid of all 9 service cards (larger version than homepage)
Each card links to individual service detail page

Service Detail Template (used for all 9 sub-pages)

Hero: Large image + service name overlay + breadcrumb
Description: Rich text (2 columns: text + supporting image)
Features List: Icon + title + description cards (3–6 items)
Process Steps: Numbered step-by-step horizontal timeline
CTA: "Request This Service" → pre-fills service type in quote form
Supabase: services table extended with (long_description_ar, long_description_en, features_json, process_steps_json, hero_image_url)


🤝 PAGE 4: PARTNERS (/partners)

Hero with title
Filter tabs: All | Government | Corporate | Medical | Logistics | Embassies
Responsive grid of partner cards (logo + name + category badge)
Click to expand: company description modal (optional)
Supabase: partners table (name_ar, name_en, logo_url, category, description_ar, description_en, is_featured)
Pre-populate with all partners from company profile:

Al Naifat, CCC by STC, Mira Food Group, Ansaldua Logistics, Shadid Insurance, Al Akkad Holding, Abanmi Investment, Ghad Medical Colleges, Atlas Pharmaceutical, Gulf Systems (Al Hoshan), Italian Embassy, KACST, Embassy of South Africa, Embassy of Tanzania, Mellor Entertainment, Jerash Pharmaceuticals, Areic Holding, Digital Cooperation Organization (DCO), Ministry of Agriculture (Aquaculture), Areic Pharmaceutical, Accolade Livestock GCC




📞 PAGE 5: CONTACT (/contact)

Split layout: left = map embed (Google Maps — Riyadh Al Malqa location) + contact details, right = contact form
Contact details:

Address: RH7X+7FJ, Prince Muhammad Ibn Saad Ibn Abdulaziz Rd, Al Malqa, Riyadh 13324
Phone: +966 11 263 3000
Email: info@yahala.co
Website: www.yahala.co


Form: Name | Company | Phone | Email | Subject | Message | Submit
Supabase: contact_messages table (id, name, company, phone, email, subject, message, is_read, created_at)
Trigger: send email notification on new submission via Edge Function


📋 PAGE 6: QUOTE REQUEST (/quote)

Expanded version of homepage quote form
Multi-step form wizard (3 steps):

Step 1: Company Info (name, contact, phone, email, company size)
Step 2: Travel Requirements (service type multi-select, dates, travelers, destinations)
Step 3: Additional Details (notes, preferred contact time, how did you hear about us)


Progress indicator at top
Supabase: same quote_requests table as homepage form, with additional fields


🔐 ADMIN DASHBOARD (/admin/*)
Auth System

Supabase Auth (email + password)
RLS (Row Level Security) on all admin tables
Protected routes: redirect to /admin/login if not authenticated
Session persistence with Supabase onAuthStateChange

Admin Login (/admin/login)

Centered card on dark navy background
Ya Hala logo
Email + password form
Supabase Auth signInWithPassword
Error handling (invalid credentials, rate limiting)

Admin Dashboard Home (/admin/dashboard)

Stats overview cards:

New Quote Requests (today / this week)
Unread Contact Messages
Active Services count
Active Partners count


Recent quote requests table (5 rows, "View All" link)
Quick action buttons: Add Service | Add Partner | View Messages
Real-time updates via Supabase Realtime subscriptions

Services Manager (/admin/services)

Table: Name (AR/EN) | Slug | Featured | Order | Status | Actions
"Add Service" button → slide-over drawer with full form:

Name AR/EN, Slug (auto-generated), Short Description AR/EN
Long Description AR/EN (rich text editor)
Features (dynamic JSON array: icon + title + description)
Process Steps (dynamic JSON array: step number + title + description)
Cover Image (upload to Supabase Storage bucket: service-images)
Hero Image (upload to Supabase Storage)
Is Featured toggle, Order index number, Is Active toggle


Edit / Delete existing services
Drag-to-reorder (updates order_index in Supabase)

Partners Manager (/admin/partners)

Grid view of all partner logos + name + category
"Add Partner" → form: Name AR/EN, Logo upload (Supabase Storage: partner-logos), Category dropdown, Website URL, Featured toggle, Description AR/EN
Edit / Delete
Toggle featured status inline

Quote Requests (/admin/quotes)

Full table with columns: Date | Company | Contact | Services | Status | Actions
Status dropdown inline: New → In Review → Quoted → Closed
Click row → detail panel: all submitted fields + internal notes text area
Export to CSV button
Filter by status, date range
Unread badge on nav item

Contact Messages (/admin/messages)

Similar table: Date | Name | Company | Subject | Read | Actions
Click → message detail modal
Mark as read / delete
Unread badge

Hero & Media Manager (/admin/media)

Hero content form: Edit headline AR/EN, subheadline AR/EN, CTA button texts
Background media: upload new video or image (Supabase Storage: hero-media)
Stats editor: Add/edit/delete stat items (label AR/EN + value)
Payment methods: toggle active/inactive for each payment option, reorder
Site settings: Logo upload, contact info, social links, footer text

Settings (/admin/settings)

Admin profile (name, email, password change)
Site metadata (SEO title, meta description for each page)
Email notification settings (toggle: receive email on new quote, new contact message)


🗃️ SUPABASE SCHEMA
Tables
sql-- Site configuration
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value_text TEXT,
  value_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Hero content
CREATE TABLE hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline_ar TEXT,
  headline_en TEXT,
  subheadline_ar TEXT,
  subheadline_en TEXT,
  cta1_text_ar TEXT,
  cta1_text_en TEXT,
  cta2_text_ar TEXT,
  cta2_text_en TEXT,
  background_video_url TEXT,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  short_description_ar TEXT,
  short_description_en TEXT,
  long_description_ar TEXT,
  long_description_en TEXT,
  features_json JSONB DEFAULT '[]',
  process_steps_json JSONB DEFAULT '[]',
  cover_image_url TEXT,
  hero_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Partners
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT,
  name_en TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  category TEXT CHECK (category IN ('government','corporate','medical','logistics','embassy','energy','education','other')),
  description_ar TEXT,
  description_en TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quote requests
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  company_size TEXT,
  services TEXT[] DEFAULT '{}',
  travel_date_from DATE,
  travel_date_to DATE,
  num_travelers INTEGER,
  destinations TEXT,
  message TEXT,
  preferred_contact_time TEXT,
  referral_source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_review','quoted','closed')),
  internal_notes TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stats
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_ar TEXT,
  label_en TEXT,
  value TEXT,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Value propositions
CREATE TABLE value_props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0
);

-- Payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT CHECK (category IN ('card','bnpl','wallet','bank')),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- Pages (for rich text CMS)
CREATE TABLE pages (
  slug TEXT PRIMARY KEY,
  title_ar TEXT,
  title_en TEXT,
  content_ar TEXT,
  content_en TEXT,
  meta_description_ar TEXT,
  meta_description_en TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  role_ar TEXT,
  role_en TEXT,
  bio_ar TEXT,
  bio_en TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
Row Level Security Policies
sql-- Public tables: allow anon read
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active partners" ON partners FOR SELECT USING (is_active = true);

-- Quote requests: anon insert only, admin full access
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit quote" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access" ON quote_requests USING (auth.role() = 'authenticated');

-- Contact messages: same
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send message" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access" ON contact_messages USING (auth.role() = 'authenticated');

-- All other tables: authenticated admin only for write
Storage Buckets
service-images     (public read, auth write)
partner-logos      (public read, auth write)
hero-media         (public read, auth write)
team-photos        (public read, auth write)
Edge Functions
send-quote-notification   (Resend API — email admin on new quote submission)
send-contact-notification (Resend API — email admin on new contact message)

⚙️ TECHNICAL STACK

Framework: React 18 + Vite (or Next.js 14 App Router)
Styling: Tailwind CSS v3 with custom design tokens
Supabase: @supabase/supabase-js v2 (Auth + Database + Storage + Realtime)
Routing: React Router v6 (or Next.js App Router)
State: Zustand for global state (auth, language, theme)
Forms: React Hook Form + Zod validation
Animations: Framer Motion (page transitions, scroll reveals, counters)
Rich Text: TipTap editor (admin CMS only)
File Uploads: Supabase Storage with drag-and-drop via react-dropzone
Icons: Lucide React + custom SVG icons for payment methods
Date Picker: react-datepicker (RTL-compatible)
Carousel: Embla Carousel (partner logos, mobile services)
i18n: react-i18next (AR/EN, RTL/LTR switching via dir attribute on <html>)
Toast notifications: react-hot-toast


🌐 INTERNATIONALIZATION (i18n)

Toggle button in nav: switches between Arabic (RTL) and English (LTR)
HTML dir attribute switches dynamically: document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
All content served from Supabase with _ar and _en field variants
Number formatting: Arabic-Indic numerals option for Arabic mode
Phone number input: default country Saudi Arabia (+966) with country code selector
Default language: Arabic


📱 RESPONSIVE BREAKPOINTS

Mobile: 320px–767px (single column, hamburger nav)
Tablet: 768px–1023px (2-column, collapsible sidebar in admin)
Desktop: 1024px–1279px (full layout)
Wide: 1280px+ (max-width 1440px container, centered)


🎯 CRITICAL REQUIREMENTS CHECKLIST

 Bilingual Arabic (RTL) + English (LTR) with instant language switch
 Payment logos section: Visa, Mastercard, Mada, Apple Pay, STC Pay
 BNPL/Settlement logos: Tamara, Tabby, Muyassar (all three)
 Quote request form with Supabase insert + email notification
 Admin dashboard with Supabase Auth (email + password)
 Full CRUD for Services (with image upload to Supabase Storage)
 Full CRUD for Partners (with logo upload)
 Quote requests management with status workflow
 Contact messages inbox with read/unread state
 Hero content editable from admin (text + media)
 Stats editable from admin
 Payment methods toggle (active/inactive) from admin
 Site is SEO-ready (meta tags, Open Graph, Arabic hreflang)
 Accessible (ARIA labels, focus states, color contrast WCAG AA)
 Performance: lazy load images, code splitting per route
 Mobile-first responsive across all breakpoints


📌 DESIGN NOTES FOR FIGMA MAKE

Do NOT make this look like a generic travel booking website. This is a corporate services company. No search bars for flights on the homepage. No "Book Now" for individual tickets. The focus is lead generation (quote requests) and brand credibility.
The homepage hero should feel cinematic — think Saudi Vision 2030 government campaigns or Emirates airline brand.
The admin dashboard should feel like a clean SaaS tool — inspired by Linear or Vercel's dashboard. Dark sidebar, clean data tables, smooth transitions.
Use the Ya Hala geometric squares motif (from the company profile document) as a subtle background pattern element in section dividers and dark panels.
The gold accent (#C9A84C) should be used sparingly — only on primary CTAs, hover states, and key stat numbers. This maintains its premium feel.
Payment section is non-negotiable and must appear on both the homepage and the quote/contact pages. Saudi users expect to see familiar payment options upfront.
The quote request form is the primary conversion point — make it prominent, trustworthy, and easy to fill on mobile.


Built for Ya Hala Travel & Tourism — Riyadh, Saudi Arabia — yahala.co
Version: 2026 | Stack: React + Supabase | Design: Refined Arabian Corporate Luxury