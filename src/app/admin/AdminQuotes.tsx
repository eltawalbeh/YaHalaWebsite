import { useState, useEffect } from "react";
import { Search, Filter, Trash2, Eye, Download, Printer, X, ChevronDown, Calendar, Building, Phone, Mail, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { paginate } from "../lib/pagination";
import { filterRecords, printPdf } from "../lib/adminTableTools";

const statusOptions = ["new", "in_review", "quoted", "closed"];
const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  in_review: "bg-yellow-100 text-yellow-700 border-yellow-200",
  quoted: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-700 border-gray-200",
};
const auditActionLabels: Record<string, { ar: string; en: string }> = {
  create: { ar: "إنشاء الطلب", en: "Quote created" },
  update: { ar: "تعديل الطلب", en: "Quote updated" },
  status_change: { ar: "تغيير الحالة", en: "Status changed" },
  archive: { ar: "أرشفة الطلب", en: "Quote archived" },
};

export default function AdminQuotes() {
  const { token } = useAuth();
  const { t, isAr } = useLanguage();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [auditHistory, setAuditHistory] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  useEffect(() => {
    if (!token || !selectedQuote?.id) return;
    setAuditLoading(true);
    adminApi.getAudit(token, "quote", selectedQuote.id)
      .then((events) => setAuditHistory(Array.isArray(events) ? events : []))
      .catch(() => setAuditHistory([]))
      .finally(() => setAuditLoading(false));
  }, [token, selectedQuote?.id]);

  const statusLabels: Record<string, { ar: string; en: string }> = {
    new: { ar: "جديد", en: "New" },
    in_review: { ar: "قيد المراجعة", en: "In Review" },
    quoted: { ar: "تم التسعير", en: "Quoted" },
    closed: { ar: "مغلق", en: "Closed" },
  };

  useEffect(() => {
    if (!token) return;
    adminApi.getQuotes(token).then(setQuotes).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const filteredQuotes = filterRecords(quotes, { search: searchQuery, status: filterStatus, from: fromDate, to: toDate }, ["company_name", "contact_person", "email"]);
  const pagedQuotes = paginate(filteredQuotes, page, pageSize);

  useEffect(() => {
    setPage(1);
  }, [filterStatus, searchQuery, fromDate, toDate]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const updated = await adminApi.updateQuote(token, id, { status, is_read: true });
      setQuotes((prev) => prev.map((q) => q.id === id ? updated : q));
      if (selectedQuote?.id === id) setSelectedQuote(updated);
    } catch (e) { console.error(e); }
  };

  const markRead = async (id: string) => {
    if (!token) return;
    await adminApi.updateQuote(token, id, { is_read: true }).then((updated) => {
      setQuotes((prev) => prev.map((q) => q.id === id ? updated : q));
    }).catch(console.error);
  };

  const deleteQuote = async (id: string) => {
    if (!token || !confirm(isAr ? "هل تريد حذف هذا الطلب؟" : "Delete this quote?")) return;
    await adminApi.deleteQuote(token, id).then(() => {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
    }).catch(console.error);
  };

  const saveNotes = async () => {
    if (!token || !selectedQuote) return;
    setSavingNotes(true);
    await adminApi.updateQuote(token, selectedQuote.id, { internal_notes: notes }).then((updated) => {
      setQuotes((prev) => prev.map((q) => q.id === updated.id ? updated : q));
      setSelectedQuote(updated);
    }).catch(console.error).finally(() => setSavingNotes(false));
  };

  const exportCSV = () => {
    const rows = [
      ["Date", "Company", "Contact", "Email", "Phone", "Services", "Status"],
      ...filteredQuotes.map((q) => [
        new Date(q.created_at).toLocaleDateString(),
        q.company_name,
        q.contact_person,
        q.email,
        q.phone,
        (q.services || []).join(" | "),
        q.status,
      ]),
    ];
    const csv = rows.map((r) => `"${r.join('","')}"`).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm print:hidden">
        <div>
          <h1 className={`text-2xl font-bold text-foreground ${fontHead}`}>
            {isAr ? "طلبات الأسعار" : "Quote Requests"}
          </h1>
          <p className={`text-muted-foreground text-sm mt-1 ${fontBody}`}>
            {isAr ? `إجمالي الطلبات: ${quotes.length}` : `Total quotes: ${quotes.length}`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={isAr ? "بحث..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-background border border-border rounded-xl ltr:pl-9 rtl:pr-9 ltr:pr-4 rtl:pl-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64 transition-all ${fontBody}`}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer ${fontBody}`}
          >
            <option value="all">{isAr ? "جميع الحالات" : "All Status"}</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{isAr ? statusLabels[opt].ar : statusLabels[opt].en}</option>
            ))}
          </select>

          <input type="date" aria-label="From date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input type="date" aria-label="To date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm" />

          <button
            onClick={exportCSV}
            className={`flex items-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-xl hover:bg-primary transition-colors text-sm font-medium ${fontBody}`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? "تصدير" : "Export"}</span>
          </button>
          <button onClick={printPdf} className={`flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm font-medium ${fontBody}`}>
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? "PDF" : "Export PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "الشركة" : "Company"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "التاريخ" : "Date"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "الخدمات" : "Services"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "الحالة" : "Status"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-end ${fontBody}`}>{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQuotes.length > 0 ? (
                pagedQuotes.items.map((quote) => (
                  <tr 
                    key={quote.id} 
                    className={`hover:bg-muted/30 transition-colors ${!quote.is_read ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${!quote.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                        <div>
                          <div className={`font-bold text-foreground text-sm ${fontBody}`}>{quote.company_name}</div>
                          <div className={`text-muted-foreground text-xs ${fontBody}`}>{quote.contact_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground font-en-body">
                        {new Date(quote.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                      </div>
                      <div className="text-xs text-muted-foreground font-en-body">
                        {new Date(quote.created_at).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(quote.services || []).slice(0, 2).map((s: string, i: number) => (
                          <span key={i} className={`bg-muted text-foreground px-2 py-1 rounded text-[10px] whitespace-nowrap font-medium ${fontBody}`}>
                            {s}
                          </span>
                        ))}
                        {(quote.services || []).length > 2 && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-[10px] font-en-body font-medium">
                            +{(quote.services || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[quote.status || 'new']} ${fontBody}`}>
                        {isAr ? statusLabels[quote.status || 'new'].ar : statusLabels[quote.status || 'new'].en}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setNotes(quote.internal_notes || "");
                            if (!quote.is_read) markRead(quote.id);
                          }}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title={isAr ? "عرض التفاصيل" : "View Details"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuote(quote.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title={isAr ? "حذف" : "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className={`text-muted-foreground ${fontBody}`}>
                      {isAr ? "لا توجد طلبات تطابق بحثك" : "No quotes match your search"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagedQuotes.total > 0 && (
        <div className="flex items-center justify-between gap-4 px-2">
          <span className={`text-sm text-muted-foreground ${fontBody}`}>
            {isAr ? `صفحة ${pagedQuotes.page} من ${pagedQuotes.totalPages}` : `Page ${pagedQuotes.page} of ${pagedQuotes.totalPages}`}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={pagedQuotes.page <= 1} onClick={() => setPage((value) => value - 1)} className="px-3 py-2 border border-border rounded-lg text-sm disabled:opacity-40">
              {isAr ? "السابق" : "Previous"}
            </button>
            <button type="button" disabled={pagedQuotes.page >= pagedQuotes.totalPages} onClick={() => setPage((value) => value + 1)} className="px-3 py-2 border border-border rounded-lg text-sm disabled:opacity-40">
              {isAr ? "التالي" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:relative print:p-0 print:inset-auto print:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuote(null)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm print:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col h-[min(90dvh,900px)] max-h-[calc(100dvh-2rem)] print:h-auto print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none"
            >
              {/* Screen UI - Hidden on Print */}
              <div className="print:hidden flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
                <h3 className={`text-xl font-bold text-foreground ${fontHead}`}>
                  {isAr ? "تفاصيل الطلب" : "Quote Details"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">{isAr ? "طباعة / PDF" : "Print PDF"}</span>
                  </button>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-muted-foreground hover:text-foreground bg-background hover:bg-muted p-2 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-6 pb-10 overscroll-contain">
                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <div className={`text-sm text-muted-foreground mb-1 ${fontBody}`}>{isAr ? "اسم الشركة" : "Company Name"}</div>
                      <div className={`font-bold text-lg text-foreground flex items-center gap-2 ${fontBody}`}>
                        <Building className="w-4 h-4 text-primary" />
                        {selectedQuote.company_name}
                      </div>
                      {selectedQuote.cr_number && (
                        <div className="text-xs text-muted-foreground mt-1 font-en-body">CR: {selectedQuote.cr_number}</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-sm text-muted-foreground mb-1 ${fontBody}`}>{isAr ? "معلومات التواصل" : "Contact Info"}</div>
                      <div className={`font-semibold text-foreground mb-2 ${fontBody}`}>
                        {selectedQuote.contact_name} {selectedQuote.job_title && <span className="text-muted-foreground font-normal">({selectedQuote.job_title})</span>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <a href={`mailto:${selectedQuote.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline font-en-body" dir="ltr">
                          <Mail className="w-4 h-4" /> {selectedQuote.email}
                        </a>
                        <a href={`tel:${selectedQuote.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline font-en-body" dir="ltr">
                          <Phone className="w-4 h-4" /> {selectedQuote.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className={`text-sm text-muted-foreground mb-2 ${fontBody}`}>{isAr ? "تغيير الحالة" : "Change Status"}</div>
                      <select
                        value={selectedQuote.status || 'new'}
                        onChange={(e) => updateStatus(selectedQuote.id, e.target.value)}
                        className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/30 outline-none text-sm font-semibold transition-all ${statusColors[selectedQuote.status || 'new']} ${fontBody}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt} className="text-foreground bg-background">
                            {isAr ? statusLabels[opt].ar : statusLabels[opt].en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className={`text-sm text-muted-foreground mb-2 ${fontBody}`}>{isAr ? "الخدمات المطلوبة" : "Requested Services"}</div>
                      <div className="flex flex-wrap gap-2">
                        {(selectedQuote.services || []).map((s: string, i: number) => (
                          <span key={i} className={`bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-sm font-medium ${fontBody}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {selectedQuote.budget && (
                       <div>
                         <div className={`text-sm text-muted-foreground mb-1 ${fontBody}`}>{isAr ? "الميزانية المقترحة" : "Estimated Budget"}</div>
                         <div className={`font-semibold text-foreground ${fontBody}`}>{selectedQuote.budget}</div>
                       </div>
                    )}
                  </div>
                </div>

                {selectedQuote.notes && (
                  <div className="mb-8">
                    <div className={`text-sm text-muted-foreground mb-2 ${fontBody}`}>{isAr ? "ملاحظات العميل" : "Client Notes"}</div>
                    <div className={`bg-muted/50 p-4 rounded-xl text-sm leading-relaxed border border-border text-foreground ${fontBody}`}>
                      {selectedQuote.notes}
                    </div>
                  </div>
                )}

                <div className="mb-8 bg-muted/30 border border-border rounded-xl p-5">
                  <div className={`text-sm font-semibold text-foreground mb-1 ${fontBody}`}>{isAr ? "سجل التعديلات" : "Audit History"}</div>
                  <div className={`text-xs text-muted-foreground mb-4 ${fontBody}`}>{isAr ? "العمليات المسجلة على هذا الطلب" : "Recorded activity for this quote"}</div>
                  {auditLoading ? <div className={`text-sm text-muted-foreground ${fontBody}`}>{isAr ? "جاري التحميل..." : "Loading history..."}</div> : auditHistory.length === 0 ? <div className={`text-sm text-muted-foreground ${fontBody}`}>{isAr ? "لا يوجد سجل تعديلات" : "No history yet"}</div> : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pe-1">
                      {auditHistory.map((event) => { const label = auditActionLabels[event.action] || { ar: "تحديث", en: "Updated" }; return <div key={event.id} className={`flex items-center justify-between gap-4 rounded-lg bg-background/70 border border-border/60 px-3 py-2 text-xs ${fontBody}`}><span className="font-medium text-foreground">{isAr ? label.ar : label.en}</span><span className="text-muted-foreground whitespace-nowrap" dir="ltr">{new Date(event.created_at).toLocaleString(isAr ? "ar-SA" : "en-US", { dateStyle: "medium", timeStyle: "short" })}</span></div>; })}
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-6">
                  <div className={`text-sm font-semibold text-foreground mb-3 flex items-center gap-2 ${fontBody}`}>
                    <FileText className="w-4 h-4 text-primary" />
                    {isAr ? "ملاحظات الإدارة (داخلية)" : "Admin Internal Notes"}
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder={isAr ? "أضف ملاحظات داخلية حول هذا الطلب..." : "Add internal notes about this request..."}
                    className={`w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none ${fontBody}`}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className={`bg-secondary hover:bg-primary disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors ${fontBody}`}
                    >
                      {savingNotes ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ الملاحظات" : "Save Notes")}
                    </button>
                  </div>
                </div>
              </div>
              </div>

              {/* Print Only UI */}
              <div className="hidden print:block w-full bg-white text-black p-8" dir={isAr ? "rtl" : "ltr"}>
                <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "Arial, sans-serif" }}>Ya Hala Travel & Tourism</h1>
                    <p className="text-sm text-gray-500">{isAr ? "وثيقة تفاصيل طلب تسعير" : "Quote Request Details Document"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Ref: #QT-{selectedQuote.id.substring(0,6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(selectedQuote.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">{isAr ? "معلومات العميل" : "Client Information"}</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-bold">{isAr ? "الشركة:" : "Company:"}</span> {selectedQuote.company_name}</p>
                      {selectedQuote.cr_number && <p><span className="font-bold">{isAr ? "سجل تجاري:" : "CR Number:"}</span> {selectedQuote.cr_number}</p>}
                      <p><span className="font-bold">{isAr ? "الاسم:" : "Name:"}</span> {selectedQuote.contact_name} {selectedQuote.job_title ? `(${selectedQuote.job_title})` : ''}</p>
                      <p><span className="font-bold">{isAr ? "هاتف:" : "Phone:"}</span> <span dir="ltr">{selectedQuote.phone}</span></p>
                      <p><span className="font-bold">{isAr ? "إيميل:" : "Email:"}</span> {selectedQuote.email}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">{isAr ? "تفاصيل الطلب" : "Request Details"}</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-bold">{isAr ? "الحالة:" : "Status:"}</span> {isAr ? statusLabels[selectedQuote.status || 'new'].ar : statusLabels[selectedQuote.status || 'new'].en}</p>
                      {selectedQuote.budget && <p><span className="font-bold">{isAr ? "الميزانية:" : "Budget:"}</span> {selectedQuote.budget}</p>}
                      <div>
                        <span className="font-bold block mb-1">{isAr ? "الخدمات المطلوبة:" : "Requested Services:"}</span>
                        <ul className="list-disc list-inside px-4 text-gray-700">
                          {(selectedQuote.services || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedQuote.notes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">{isAr ? "ملاحظات العميل" : "Client Notes"}</h3>
                    <div className="bg-gray-50 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
                      {selectedQuote.notes}
                    </div>
                  </div>
                )}

                {selectedQuote.internal_notes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-2 mb-4">{isAr ? "ملاحظات الإدارة" : "Admin Notes"}</h3>
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
                      {selectedQuote.internal_notes}
                    </div>
                  </div>
                )}
                
                <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center text-gray-400 text-xs">
                  <p>Ya Hala Travel & Tourism • Premium Corporate Services</p>
                  <p className="mt-1">This document is confidential and generated directly from the Ya Hala platform.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
