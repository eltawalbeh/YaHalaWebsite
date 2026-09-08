import { createBrowserRouter } from "react-router";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import HydrateFallback from "./components/layout/HydrateFallback";

const load = (loader: () => Promise<Record<string, unknown>>, component: string) => async () => ({
  Component: (await loader())[component] as React.ComponentType,
});

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    HydrateFallback,
    children: [
      { index: true, lazy: load(() => import("./pages/HomePage"), "default") },
      { path: "about", lazy: load(() => import("./pages/AboutPage"), "default") },
      { path: "services", lazy: load(() => import("./pages/ServicesPage"), "default") },
      { path: "services/:slug", lazy: load(() => import("./pages/ServiceDetailPage"), "default") },
      { path: "partners", lazy: load(() => import("./pages/PartnersPage"), "default") },
      { path: "contact", lazy: load(() => import("./pages/ContactPage"), "default") },
      { path: "quote", lazy: load(() => import("./pages/QuotePage"), "default") },
      { path: "terms", lazy: load(() => import("./pages/TermsPage"), "default") },
      { path: "privacy", lazy: load(() => import("./pages/PrivacyPage"), "default") },
    ],
  },
  { path: "/admin/login", lazy: load(() => import("./admin/AdminLoginPage"), "default"), HydrateFallback },
  {
    path: "/admin",
    Component: AdminLayout,
    HydrateFallback,
    children: [
      { index: true, lazy: load(() => import("./admin/AdminDashboard"), "default") },
      { path: "dashboard", lazy: load(() => import("./admin/AdminDashboard"), "default") },
      { path: "services", lazy: load(() => import("./admin/AdminServices"), "default") },
      { path: "partners", lazy: load(() => import("./admin/AdminPartners"), "default") },
      { path: "quotes", lazy: load(() => import("./admin/AdminQuotes"), "default") },
      { path: "messages", lazy: load(() => import("./admin/AdminMessages"), "default") },
      { path: "media", lazy: load(() => import("./admin/AdminMedia"), "default") },
      { path: "settings", lazy: load(() => import("./admin/AdminSettings"), "default") },
      { path: "users", lazy: load(() => import("./admin/AdminUsers"), "default") },
    ],
  },
]);
