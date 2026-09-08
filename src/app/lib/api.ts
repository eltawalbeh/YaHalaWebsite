import { projectId, publicAnonKey } from "/utils/supabase/info";

export const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-d8dd152e`;

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string | null
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Always use publicAnonKey for Supabase gateway auth
    Authorization: `Bearer ${publicAnonKey}`,
    ...(options.headers as Record<string, string>),
  };

  // Pass admin session token separately so Supabase gateway doesn't reject it
  if (token) {
    headers["X-Admin-Token"] = token;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Public API (no auth required)
export const api = {
  health: () => apiFetch("/health"),
  getServices: () => apiFetch("/services"),
  getService: (slug: string) => apiFetch(`/services/${slug}`),
  getPartners: () => apiFetch("/partners"),
  getHero: () => apiFetch("/hero"),
  getStats: () => apiFetch("/stats"),
  getSettings: () => apiFetch("/settings"),
  submitQuote: (data: any) =>
    apiFetch("/quotes", { method: "POST", body: JSON.stringify(data) }),
  submitMessage: (data: any) =>
    apiFetch("/messages", { method: "POST", body: JSON.stringify(data) }),
};

// Admin API (auth required)
export const adminApi = {
  getAudit: (token: string, entityType: string, entityId: string) =>
    apiFetch(`/audit/${entityType}/${entityId}`, {}, token),
  // Dashboard
  getDashboardStats: (token: string) => apiFetch("/dashboard/stats", {}, token),
  // Services
  getServices: (token: string) => apiFetch("/services", {}, token),
  createService: (token: string, data: any) =>
    apiFetch("/services", { method: "POST", body: JSON.stringify(data) }, token),
  updateService: (token: string, id: string, data: any) =>
    apiFetch(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  deleteService: (token: string, id: string) =>
    apiFetch(`/services/${id}`, { method: "DELETE" }, token),
  // Partners
  getPartners: (token: string) => apiFetch("/partners", {}, token),
  createPartner: (token: string, data: any) =>
    apiFetch("/partners", { method: "POST", body: JSON.stringify(data) }, token),
  updatePartner: (token: string, id: string, data: any) =>
    apiFetch(`/partners/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  deletePartner: (token: string, id: string) =>
    apiFetch(`/partners/${id}`, { method: "DELETE" }, token),
  // Quotes
  getQuotes: (token: string) => apiFetch("/quotes", {}, token),
  updateQuote: (token: string, id: string, data: any) =>
    apiFetch(`/quotes/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  deleteQuote: (token: string, id: string) =>
    apiFetch(`/quotes/${id}`, { method: "DELETE" }, token),
  // Messages
  getMessages: (token: string) => apiFetch("/messages", {}, token),
  updateMessage: (token: string, id: string, data: any) =>
    apiFetch(`/messages/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  deleteMessage: (token: string, id: string) =>
    apiFetch(`/messages/${id}`, { method: "DELETE" }, token),
  // Hero
  getHero: (token: string) => apiFetch("/hero", {}, token),
  updateHero: (token: string, data: any) =>
    apiFetch("/hero", { method: "PUT", body: JSON.stringify(data) }, token),
  // Stats
  getStats: (token: string) => apiFetch("/stats", {}, token),
  createStat: (token: string, data: any) =>
    apiFetch("/stats", { method: "POST", body: JSON.stringify(data) }, token),
  updateStat: (token: string, id: string, data: any) =>
    apiFetch(`/stats/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  deleteStat: (token: string, id: string) =>
    apiFetch(`/stats/${id}`, { method: "DELETE" }, token),
  // Settings
  getSettings: (token: string) => apiFetch("/settings", {}, token),
  updateSettings: (token: string, data: any) =>
    apiFetch("/settings", { method: "PUT", body: JSON.stringify(data) }, token),
  // Admin Users
  getAdminUsers: (token: string) => apiFetch("/admin/users", {}, token),
  createAdminUser: (token: string, data: any) =>
    apiFetch("/admin/users", { method: "POST", body: JSON.stringify(data) }, token),
  deleteAdminUser: (token: string, id: string) =>
    apiFetch(`/admin/users/${id}`, { method: "DELETE" }, token),
  updateAdminUserRole: (token: string, id: string, data: any) =>
    apiFetch(`/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify(data) }, token),
};