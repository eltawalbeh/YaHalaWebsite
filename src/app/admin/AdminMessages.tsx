import { useState, useEffect } from "react";
import { Search, Trash2, Eye, X, MailOpen, Mail, Phone, Building, Calendar, Download, Printer } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { paginate } from "../lib/pagination";
import { filterRecords, printPdf } from "../lib/adminTableTools";

export default function AdminMessages() {
  const { token } = useAuth();
  const { t, isAr } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  useEffect(() => {
    if (!token) return;
    adminApi.getMessages(token).then(setMessages).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const filteredMessages = filterRecords(messages, { search: searchQuery, from: fromDate, to: toDate }, ["name", "email", "company", "message"])
    .filter((m) => filterRead === "all" || (filterRead === "unread" ? !m.is_read : m.is_read));
  const pagedMessages = paginate(filteredMessages, page, pageSize);

  useEffect(() => {
    setPage(1);
  }, [filterRead, searchQuery, fromDate, toDate]);

  const markRead = async (id: string, is_read: boolean) => {
    if (!token) return;
    const updated = await adminApi.updateMessage(token, id, { is_read }).catch(() => null);
    if (updated) {
      setMessages((prev) => prev.map((m) => m.id === id ? updated : m));
      if (selectedMessage?.id === id) setSelectedMessage(updated);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!token || !confirm(isAr ? "هل أنت متأكد من حذف هذه الرسالة؟" : "Are you sure you want to delete this message?")) return;
    await adminApi.deleteMessage(token, id).then(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }).catch(console.error);
  };

  const openMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.is_read) markRead(msg.id, true);
  };

  const exportCSV = () => {
    const rows = [
      ["Date", "Name", "Company", "Email", "Phone", "Message"],
      ...filteredMessages.map((m) => [
        new Date(m.created_at).toLocaleDateString(),
        m.name,
        m.company || "",
        m.email,
        m.phone,
        `"${m.message.replace(/"/g, '""')}"`
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl font-bold text-foreground ${fontHead}`}>
              {isAr ? "الرسائل الواردة" : "Inbox Messages"}
            </h1>
            {unreadCount > 0 && (
              <span className={`bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full ${fontBody}`}>
                {isAr ? `${unreadCount} غير مقروءة` : `${unreadCount} unread`}
              </span>
            )}
          </div>
          <p className={`text-muted-foreground text-sm mt-1 ${fontBody}`}>
            {isAr ? `إجمالي الرسائل: ${messages.length}` : `Total messages: ${messages.length}`}
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
          
          <div className={`flex bg-background border border-border rounded-xl p-1 ${fontBody}`}>
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRead === f ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? (isAr ? "الكل" : "All") : f === "unread" ? (isAr ? "غير مقروءة" : "Unread") : (isAr ? "مقروءة" : "Read")}
              </button>
            ))}
          </div>

          <input type="date" aria-label="From date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input type="date" aria-label="To date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm" />

          <button
            onClick={exportCSV}
            className={`flex items-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-xl hover:bg-primary transition-colors text-sm font-medium ${fontBody}`}
          >
            <Download className="w-4 h-4" />
          </button>
          <button onClick={printPdf} aria-label="Export PDF" className="flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12 ${fontBody}`}></th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "المرسل" : "Sender"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "الرسالة" : "Message"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "التاريخ" : "Date"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-end ${fontBody}`}>{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMessages.length > 0 ? (
                pagedMessages.items.map((msg) => (
                  <tr 
                    key={msg.id} 
                    className={`hover:bg-muted/30 transition-colors group cursor-pointer ${!msg.is_read ? "bg-primary/5" : ""}`}
                    onClick={() => openMessage(msg)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {msg.is_read ? (
                        <MailOpen className="w-5 h-5 text-muted-foreground/50" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-bold text-foreground text-sm mb-0.5 ${fontBody} ${!msg.is_read ? 'text-primary' : ''}`}>
                        {msg.name}
                      </div>
                      <div className={`text-muted-foreground text-xs ${fontBody}`}>
                        {msg.company || msg.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs xl:max-w-md">
                      <p className={`text-sm text-muted-foreground truncate ${fontBody} ${!msg.is_read ? 'font-medium text-foreground' : ''}`}>
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground font-en-body">
                        {new Date(msg.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(msg.id, !msg.is_read); }}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title={msg.is_read ? (isAr ? "تحديد كغير مقروء" : "Mark Unread") : (isAr ? "تحديد كمقروء" : "Mark Read")}
                        >
                          {msg.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
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
                    <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className={`text-muted-foreground ${fontBody}`}>
                      {isAr ? "لا توجد رسائل مطابقة" : "No matching messages found"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagedMessages.total > 0 && (
        <div className="flex items-center justify-between gap-4 px-2">
          <span className={`text-sm text-muted-foreground ${fontBody}`}>
            {isAr ? `صفحة ${pagedMessages.page} من ${pagedMessages.totalPages}` : `Page ${pagedMessages.page} of ${pagedMessages.totalPages}`}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={pagedMessages.page <= 1} onClick={() => setPage((value) => value - 1)} className="px-3 py-2 border border-border rounded-lg text-sm disabled:opacity-40">{isAr ? "السابق" : "Previous"}</button>
            <button type="button" disabled={pagedMessages.page >= pagedMessages.totalPages} onClick={() => setPage((value) => value + 1)} className="px-3 py-2 border border-border rounded-lg text-sm disabled:opacity-40">{isAr ? "التالي" : "Next"}</button>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
                <h3 className={`text-xl font-bold text-foreground flex items-center gap-3 ${fontHead}`}>
                  <MailOpen className="w-5 h-5 text-primary" />
                  {isAr ? "الرسالة الواردة" : "Incoming Message"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    title={isAr ? "حذف" : "Delete"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-muted-foreground hover:text-foreground bg-background hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold border border-primary/20 font-en-head">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={`font-bold text-lg text-foreground ${fontBody}`}>{selectedMessage.name}</div>
                      {selectedMessage.company && (
                        <div className={`text-sm text-muted-foreground flex items-center gap-1.5 ${fontBody}`}>
                          <Building className="w-3.5 h-3.5" />
                          {selectedMessage.company}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground font-en-body flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedMessage.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-background border border-border p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-xs text-muted-foreground mb-0.5 ${fontBody}`}>{isAr ? "البريد الإلكتروني" : "Email Address"}</div>
                      <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block font-en-body" dir="ltr">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="bg-background border border-border p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-xs text-muted-foreground mb-0.5 ${fontBody}`}>{isAr ? "رقم الهاتف" : "Phone Number"}</div>
                      <a href={`tel:${selectedMessage.phone}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block font-en-body" dir="ltr">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className={`text-xs font-semibold text-primary uppercase tracking-wider mb-3 ${fontBody}`}>
                    {isAr ? "نص الرسالة" : "Message Content"}
                  </div>
                  <div className={`bg-muted/30 border border-border p-6 rounded-2xl text-foreground leading-loose whitespace-pre-wrap text-[15px] ${fontBody}`}>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Enquiry to Ya Hala&body=\n\n\n--- \nOn ${new Date(selectedMessage.created_at).toLocaleString()}, ${selectedMessage.name} wrote:\n\n${selectedMessage.message}`}
                  className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm ${fontBody}`}
                >
                  <Mail className="w-4 h-4" />
                  {isAr ? "الرد عبر البريد" : "Reply via Email"}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
