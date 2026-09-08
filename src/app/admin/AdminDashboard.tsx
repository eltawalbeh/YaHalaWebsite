import { useState, useEffect, useId } from "react";
import { Link } from "react-router";
import { FileText, MessageSquare, Plane, Users, Clock, TrendingUp, Eye, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashStats {
  quotesToday: number;
  quotesWeek: number;
  unreadMessages: number;
  unreadQuotes: number;
  activeServices: number;
  activePartners: number;
  totalQuotes: number;
  totalMessages: number;
  activity?: { name: string; quotes: number; messages: number }[];
  response_time_ms?: number;
  audit_alerts?: { id: string; entity_type: string; entity_id: string; action: string; created_at: string }[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const { t, isAr } = useLanguage();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Unique IDs so Recharts gradient defs never collide with other SVG elements
  const uid = useId().replace(/:/g, "");
  const gradQ = `cQ-${uid}`;
  const gradM = `cM-${uid}`;

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  useEffect(() => {
    if (!token) return;
    Promise.all([
      adminApi.getDashboardStats(token),
      adminApi.getQuotes(token),
    ]).then(([dashStats, quotes]) => {
      setStats(dashStats);
      setRecentQuotes(quotes.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const statCards = [
    { icon: FileText, labelAr: "طلبات اليوم", labelEn: "Today's Quotes", value: stats?.quotesToday ?? 0, trend: "+12%", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", link: "/admin/quotes" },
    { icon: TrendingUp, labelAr: "طلبات الأسبوع", labelEn: "This Week", value: stats?.quotesWeek ?? 0, trend: "+5%", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", link: "/admin/quotes" },
    { icon: MessageSquare, labelAr: "رسائل غير مقروءة", labelEn: "Unread Messages", value: stats?.unreadMessages ?? 0, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", link: "/admin/messages" },
    { icon: Plane, labelAr: "الخدمات النشطة", labelEn: "Active Services", value: stats?.activeServices ?? 0, color: "text-teal-600", bg: "bg-teal-600/10", border: "border-teal-600/20", link: "/admin/services" },
  ];

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 border-blue-200",
    in_review: "bg-yellow-100 text-yellow-700 border-yellow-200",
    quoted: "bg-green-100 text-green-700 border-green-200",
    closed: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const statusLabels: Record<string, string> = {
    new: isAr ? "جديد" : "New",
    in_review: isAr ? "قيد المراجعة" : "In Review",
    quoted: isAr ? "تم التسعير" : "Quoted",
    closed: isAr ? "مغلق" : "Closed",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl font-bold text-foreground ${fontHead}`}>
            {isAr ? "لوحة التحكم" : "Dashboard Overview"}
          </h1>
          <p className={`text-muted-foreground text-xs mt-1 ${fontBody}`}>
            {isAr ? "مرحباً بك في لوحة تحكم يا هلا للسفر والسياحة" : "Welcome to Ya Hala Travel & Tourism admin panel"}
          </p>
        </div>
        <Link
          to="/admin/quotes"
          className={`inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm ${fontBody}`}
        >
          <Plus className="w-4 h-4" />
          {isAr ? "طلب جديد" : "New Quote"}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={card.link}
              className={`block bg-card border ${card.border} rounded-2xl p-5 hover:shadow-lg transition-all group h-full`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <Eye className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
              <div className={`text-2xl font-bold text-foreground mb-1 ${fontHead}`}>
                {card.value}
              </div>
              <div className="flex items-center justify-between">
                <div className={`text-muted-foreground text-xs font-medium ${fontBody}`}>
                  {isAr ? card.labelAr : card.labelEn}
                </div>
                {card.trend && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-en-body">
                    <ArrowUpRight className="w-3 h-3" />
                    {card.trend}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`text-base font-bold text-foreground ${fontHead}`}>
                {isAr ? "إحصائيات اللبات والرسائل" : "Requests & Messages Activity"}
              </h3>
              <p className={`text-xs text-muted-foreground mt-0.5 ${fontBody}`}>
                {isAr ? "نشاط الأسبوع الحالي" : "Current week activity"}
              </p>
            </div>
            <select className={`bg-muted/50 border border-border text-xs rounded-lg px-2.5 py-1.5 outline-none ${fontBody}`}>
              <option>{isAr ? "هذا الأسبوع" : "This Week"}</option>
              <option>{isAr ? "هذا الشهر" : "This Month"}</option>
            </select>
          </div>
          
          <div className="h-72 w-full font-en-body" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.activity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradQ} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-yahala-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-yahala-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id={gradM} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-yahala-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-yahala-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted-foreground)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted-foreground)', fontSize: 12}} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-foreground)' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Area key="quotes" type="monotone" dataKey="quotes" stroke="var(--color-yahala-primary)" strokeWidth={3} fillOpacity={1} fill={`url(#${gradQ})`} name="Quotes" />
                <Area key="messages" type="monotone" dataKey="messages" stroke="var(--color-yahala-accent)" strokeWidth={3} fillOpacity={1} fill={`url(#${gradM})`} name="Messages" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Quotes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-base font-bold text-foreground ${fontHead}`}>
              {isAr ? "أحدث الطلبات" : "Recent Quotes"}
            </h3>
            <Link to="/admin/quotes" className={`text-xs text-primary hover:text-accent font-medium ${fontBody}`}>
              {isAr ? "عرض الكل" : "View All"}
            </Link>
          </div>

          {recentQuotes.length > 0 ? (
            <div className="space-y-4 flex-1">
              {recentQuotes.map((quote) => (
                <Link
                  key={quote.id}
                  to={`/admin/quotes?id=${quote.id}`}
                  className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-xs font-bold text-foreground truncate ${fontBody}`}>
                        {quote.company_name}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusColors[quote.status || 'new']} ${fontBody}`}>
                        {statusLabels[quote.status || 'new']}
                      </span>
                    </div>
                    <p className={`text-[11px] text-muted-foreground truncate mb-1 ${fontBody}`}>
                      {quote.contact_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-en-body flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(quote.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center border-2 border-dashed border-border rounded-xl">
              <FileText className="w-8 h-8 mb-3 opacity-20" />
              <p className={`text-sm ${fontBody}`}>
                {isAr ? "لا توجد طلبات حديثة" : "No recent quotes"}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className={`text-xs text-muted-foreground mb-2 ${fontBody}`}>{isAr ? "زمن استجابة API" : "API Response Time"}</div>
          <div className="text-2xl font-bold text-foreground font-en-body">{stats?.response_time_ms ?? 0} ms</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className={`text-xs text-muted-foreground mb-2 ${fontBody}`}>{isAr ? "تنبيهات التدقيق خلال 24 ساعة" : "Audit Alerts · Last 24 Hours"}</div>
          <div className="text-2xl font-bold text-foreground font-en-body">{stats?.audit_alerts?.length ?? 0}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className={`text-xs text-muted-foreground mb-2 ${fontBody}`}>{isAr ? "حالة الإصدار" : "Release Marker"}</div>
          <div className="text-sm font-semibold text-foreground font-en-body">6.0.0-local</div>
        </div>
      </div>

      {stats?.audit_alerts && stats.audit_alerts.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className={`text-base font-bold text-foreground mb-4 ${fontHead}`}>{isAr ? "آخر أحداث التدقيق" : "Recent Audit Alerts"}</h3>
          <div className="space-y-2">
            {stats.audit_alerts.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-4 text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                <span className={`text-foreground ${fontBody}`}>{event.action} · {event.entity_type}</span>
                <span className="text-muted-foreground font-en-body">{new Date(event.created_at).toLocaleString(isAr ? "ar-SA" : "en-US")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}