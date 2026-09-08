import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Star, Eye, EyeOff, GripVertical, ExternalLink, Search, Printer } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { paginate } from "../lib/pagination";
import { filterRecords, printPdf } from "../lib/adminTableTools";
import { useForm } from "react-hook-form";

export default function AdminServices() {
  const { token } = useAuth();
  const { isAr } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!token) return;
    adminApi.getServices(token).then(setServices).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const filteredServices = filterRecords(services, { search: searchQuery, from: fromDate, to: toDate }, ["name_ar", "name_en", "slug", "external_url"]);
  const sortedServices = [...filteredServices].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const pagedServices = paginate(sortedServices, page, pageSize);

  const openAdd = () => {
    setEditingService(null);
    reset({ is_featured: false, is_active: true, order_index: services.length + 1, external_url: "" });
    setShowForm(true);
  };

  const openEdit = (service: any) => {
    setEditingService(service);
    reset(service);
    setShowForm(true);
  };

  const onSubmit = async (data: any) => {
    if (!token) return;
    setSaving(true);
    try {
      if (editingService) {
        const updated = await adminApi.updateService(token, editingService.id, data);
        setServices((prev) => prev.map((s) => s.id === editingService.id ? updated : s));
      } else {
        const newService = await adminApi.createService(token, {
          ...data,
          slug: data.slug || data.name_en?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
        setServices((prev) => [...prev, newService]);
      }
      setShowForm(false);
    } catch (e) {
      alert(String(e));
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!token || !confirm(isAr ? "هل تريد أرشفة هذه الخدمة؟" : "Archive this service?")) return;
    await adminApi.deleteService(token, id).then(() => {
      setServices((prev) => prev.map((s) => s.id === id ? { ...s, is_active: false, lifecycle_status: "archived" } : s));
    }).catch((e) => alert(String(e)));
  };

  const toggleFeatured = async (service: any) => {
    if (!token) return;
    const updated = await adminApi.updateService(token, service.id, { is_featured: !service.is_featured });
    setServices((prev) => prev.map((s) => s.id === service.id ? updated : s));
  };

  const toggleActive = async (service: any) => {
    if (!token) return;
    const updated = await adminApi.updateService(token, service.id, { is_active: !service.is_active });
    setServices((prev) => prev.map((s) => s.id === service.id ? updated : s));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className={`text-xl font-bold text-foreground ${fontHead}`}>
          {isAr ? "إدارة الخدمات" : "Services Manager"}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input aria-label="Search services" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} placeholder={isAr ? "بحث..." : "Search..."} className="w-44 bg-background border border-border rounded-xl ltr:pl-9 rtl:pr-9 py-2 text-sm" />
          </div>
          <input type="date" aria-label="From date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="bg-background border border-border rounded-xl px-2 py-2 text-sm" />
          <input type="date" aria-label="To date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="bg-background border border-border rounded-xl px-2 py-2 text-sm" />
          <button onClick={printPdf} aria-label="Export PDF" className="p-2 border border-border rounded-xl"><Printer className="w-4 h-4" /></button>
          <button onClick={openAdd} className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors ${fontBody}`}><Plus className="w-4 h-4" />{isAr ? "إضافة خدمة" : "Add Service"}</button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {filteredServices.length === 0 ? (
          <div className={`text-center py-16 text-muted-foreground ${fontBody}`}>
            {isAr ? "لا توجد خدمات" : "No services yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  {["", isAr ? "الاسم" : "Name", isAr ? "الرابط" : "Slug", isAr ? "رابط خارجي" : "Ext. URL", isAr ? "مميز" : "Featured", isAr ? "نشط" : "Active", isAr ? "الترتيب" : "Order", ""].map((col, i) => (
                    <th key={i} className={`text-start text-muted-foreground text-xs font-semibold p-4 ${fontBody}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedServices.items.map((service) => (
                  <tr key={service.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pe-0">
                      <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {service.cover_image_url && (
                          <img src={service.cover_image_url} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div>
                          <div className={`text-foreground font-medium text-sm ${fontBody}`}>
                            {isAr ? service.name_ar : service.name_en}
                          </div>
                          <div className="text-muted-foreground text-xs">{isAr ? service.name_en : service.name_ar}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs font-en-body" dir="ltr">
                      {service.slug}
                    </td>
                    {/* External URL indicator */}
                    <td className="p-4">
                      {service.external_url ? (
                        <a
                          href={service.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors font-en-body"
                          title={service.external_url}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {isAr ? "رابط خارجي" : "External"}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/40 font-en-body">
                          {isAr ? "صفحة داخلية" : "Internal page"}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleFeatured(service)}>
                        <Star className={`w-4 h-4 transition-colors ${service.is_featured ? "text-accent fill-current" : "text-muted-foreground/30 hover:text-accent"}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleActive(service)}>
                        {service.is_active ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </button>
                    </td>
                    <td className={`p-4 text-muted-foreground text-sm ${fontBody}`}>{service.order_index}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(service)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteService(service.id)} title={isAr ? "أرشفة الخدمة" : "Archive service"} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagedServices.total > 0 && (
        <div className="flex items-center justify-between gap-4 px-2">
          <span className={`text-sm text-muted-foreground ${fontBody}`}>{isAr ? `صفحة ${pagedServices.page} من ${pagedServices.totalPages}` : `Page ${pagedServices.page} of ${pagedServices.totalPages}`}</span>
          <div className="flex gap-2">
            <button type="button" disabled={pagedServices.page <= 1} onClick={() => setPage((value) => value - 1)} className="px-3 py-2 border border-border rounded-lg text-sm disabled:opacity-40">{isAr ? "السابق" : "Previous"}</button>
            <button type="button" disabled={pagedServices.page >= pagedServices.totalPages} onClick={() => setPage((value) => value + 1)} className="px-3 py-2 border border-border rounded-lg text-sm disabled:opacity-40">{isAr ? "التالي" : "Next"}</button>
          </div>
        </div>
      )}

      {/* Add/Edit Drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="h-full w-full max-w-xl bg-card border-s border-border overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                <h3 className={`text-foreground font-bold text-base ${fontHead}`}>
                  {editingService ? (isAr ? "تعديل الخدمة" : "Edit Service") : (isAr ? "إضافة خدمة" : "Add Service")}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>
                      {isAr ? "الاسم عربي *" : "Name (Arabic) *"}
                    </label>
                    <input
                      {...register("name_ar", { required: true })}
                      className={`w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors ${fontBody}`}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>
                      {isAr ? "الاسم إنجليزي *" : "Name (English) *"}
                    </label>
                    <input
                      {...register("name_en", { required: true })}
                      className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-en-body"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>Slug</label>
                  <input
                    {...register("slug")}
                    className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-en-body"
                    dir="ltr"
                    placeholder="service-name"
                  />
                </div>

                {/* External URL */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <label className={`text-sm font-bold text-foreground ${fontBody}`}>
                      {isAr ? "رابط خارجي (اختياري)" : "External URL (Optional)"}
                    </label>
                  </div>
                  <input
                    {...register("external_url")}
                    className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-en-body"
                    dir="ltr"
                    placeholder="https://example.com/service"
                  />
                  <p className={`text-xs text-muted-foreground ${fontBody}`}>
                    {isAr
                      ? "إذا أدخلت رابطاً، سيتم توجيه الزوار إليه مباشرةً بدلاً من فتح صفحة الخدمة الداخلية."
                      : "If a URL is entered, visitors will be redirected to it instead of opening the internal service page."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>
                      {isAr ? "وصف قصير عربي" : "Short Desc (Arabic)"}
                    </label>
                    <textarea
                      {...register("short_description_ar")}
                      rows={3}
                      className={`w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm resize-none focus:outline-none focus:border-primary transition-colors ${fontBody}`}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>
                      {isAr ? "وصف قصير إنجليزي" : "Short Desc (English)"}
                    </label>
                    <textarea
                      {...register("short_description_en")}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm resize-none focus:outline-none focus:border-primary transition-colors font-en-body"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>
                    {isAr ? "رابط صورة الغلاف" : "Cover Image URL"}
                  </label>
                  <input
                    {...register("cover_image_url")}
                    className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-en-body"
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>
                    {isAr ? "رابط صورة الهيرو" : "Hero Image URL"}
                  </label>
                  <input
                    {...register("hero_image_url")}
                    className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-en-body"
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-1.5 ${fontBody}`}>Order</label>
                    <input
                      {...register("order_index", { valueAsNumber: true })}
                      type="number"
                      className="w-full px-3 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:border-primary transition-colors font-en-body"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register("is_featured")} type="checkbox" className="w-4 h-4 rounded accent-amber-500" />
                      <span className={`text-sm text-foreground ${fontBody}`}>{isAr ? "مميز" : "Featured"}</span>
                    </label>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register("is_active")} type="checkbox" className="w-4 h-4 rounded accent-primary" defaultChecked />
                      <span className={`text-sm text-foreground ${fontBody}`}>{isAr ? "نشط" : "Active"}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors ${fontBody}`}
                  >
                    {saving ? "..." : editingService ? (isAr ? "حفظ التعديلات" : "Save Changes") : (isAr ? "إضافة الخدمة" : "Add Service")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
