import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Settings, Users, FileText, MessageSquare,
  Image, LogOut, Menu, X, ChevronRight, Bell, Plane, Shield, UserCog
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { adminApi } from "../../lib/api";
import LogoMini from "../../../imports/LogoMini";

export default function AdminLayout() {
  const { isAuthenticated, isLoading, logout, token, adminName, adminRole } = useAuth();
  const { t, isAr, setLang, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoggingOut = useRef(false);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingOut.current) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (token) {
      adminApi.getDashboardStats(token).then((stats) => {
        setUnreadCount((stats.unreadQuotes || 0) + (stats.unreadMessages || 0));
      }).catch(() => {});
    }
  }, [token, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    isLoggingOut.current = true;
    await logout();
    navigate("/");
  };

  const navItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
    { path: "/admin/services", icon: Plane, labelAr: "إدارة الخدمات", labelEn: "Services", superAdminOnly: true },
    { path: "/admin/partners", icon: Users, labelAr: "إدارة الشركاء", labelEn: "Partners", superAdminOnly: true },
    { path: "/admin/quotes", icon: FileText, labelAr: "طلبات الأسعار", labelEn: "Quote Requests", badge: true },
    { path: "/admin/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages", badge: true },
    { path: "/admin/media", icon: Image, labelAr: "الوسائط والإعدادات", labelEn: "Media & Hero", superAdminOnly: true },
    { path: "/admin/users", icon: UserCog, labelAr: "إدارة المستخدمين", labelEn: "Users & Roles", superAdminOnly: true },
    { path: "/admin/settings", icon: Settings, labelAr: "الإعدادات", labelEn: "Settings", superAdminOnly: true },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-secondary border-r border-white/5">
      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin/dashboard">
          <div
            className="relative h-[48px] w-[116px]"
            style={{ "--fill-0": "white" } as React.CSSProperties}
          >
            <LogoMini />
          </div>
        </Link>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-white/50 hover:text-white lg:hidden font-en-body text-sm">
          {lang === 'ar' ? 'EN' : 'AR'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className={`text-xs font-semibold text-white/30 uppercase tracking-wider mb-4 px-4 mt-2 ${fontBody}`}>
          {t("القائمة الرئيسية", "Main Menu")}
        </div>
        {navItems.filter((item: any) => !item.superAdminOnly || adminRole === 'super_admin').map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-accent" : "text-white/50 group-hover:text-white"}`} />
              <span className={`text-sm font-medium flex-1 ${fontBody}`}>
                {isAr ? item.labelAr : item.labelEn}
              </span>
              {(item as any).badge && unreadCount > 0 && (
                <span className="bg-destructive text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-en-body shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {active && <ChevronRight className={`w-4 h-4 text-white/40 rtl:-scale-x-100`} />}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div className="overflow-hidden">
              <div className={`text-white text-sm font-bold truncate ${fontBody}`}>{adminName || "Admin"}</div>
              <div className={`text-white/40 text-[10px] truncate font-en-body`}>
                {adminRole === 'super_admin' ? (isAr ? 'مدير عام' : 'Super Admin') : (isAr ? 'مشرف' : 'Moderator')}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive text-destructive hover:text-white flex items-center justify-center transition-colors shrink-0"
            title={t("تسجيل الخروج", "Logout")}
          >
            <LogOut className="w-4 h-4 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 ltr:left-0 rtl:right-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen 
          ? "translate-x-0" 
          : "ltr:-translate-x-full rtl:translate-x-full"
      }`}>
        <div className="absolute top-4 ltr:-right-12 rtl:-left-12">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ps-72">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-foreground hover:bg-muted p-2 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className={`text-xl font-bold text-foreground hidden sm:block ${fontHead}`}>
              {navItems.find(i => isActive(i.path))?.[isAr ? 'labelAr' : 'labelEn'] || t("لوحة التحكم", "Dashboard")}
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted border border-transparent hover:border-border"
            >
              <span className="font-en-body">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            <Link to="/" target="_blank" className={`hidden sm:block text-sm text-primary hover:text-accent font-medium transition-colors ${fontBody}`}>
              {t("زيارة الموقع", "View Site")}
            </Link>

            <div className="h-6 w-px bg-border hidden sm:block" />

            <Link to="/admin/messages" className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/5">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card"></span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}