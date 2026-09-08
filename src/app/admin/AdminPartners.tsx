import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Star, Search, Filter, Image as ImageIcon, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { useForm } from "react-hook-form";

const categoryOptions = ["government", "corporate", "medical", "logistics", "embassy", "education", "other"];
const categoryLabels: Record<string, { ar: string; en: string }> = {
  government: { ar: "حكومي", en: "Government" },
  corporate: { ar: "مؤسسي", en: "Corporate" },
  medical: { ar: "طبي", en: "Medical" },
  logistics: { ar: "لوجستي", en: "Logistics" },
  embassy: { ar: "سفارة", en: "Embassy" },
  education: { ar: "تعليمي", en: "Education" },
  other: { ar: "أخرى", en: "Other" },
};

export default function AdminPartners() {
  const { token } = useAuth();
  const { t, isAr } = useLanguage();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!token) return;
    adminApi.getPartners(token).then(setPartners).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const openAdd = () => {
    setEditingPartner(null);
    reset({ is_featured: false, is_active: true, category: 'corporate' });
    setShowForm(true);
  };

  const openEdit = (partner: any) => {
    setEditingPartner(partner);
    reset(partner);
    setShowForm(true);
  };

  const onSubmit = async (data: any) => {
    if (!token) return;
    setSaving(true);
    try {
      if (editingPartner) {
        const updated = await adminApi.updatePartner(token, editingPartner.id, data);
        setPartners((prev) => prev.map((p) => p.id === editingPartner.id ? updated : p));
      } else {
        const newPartner = await adminApi.createPartner(token, data);
        setPartners((prev) => [...prev, newPartner]);
      }
      setShowForm(false);
    } catch (e) {
      alert(String(e));
    } finally {
      setSaving(false);
    }
  };

  const deletePartner = async (id: string) => {
    if (!token || !confirm(isAr ? "هل أنت متأكد من حذف هذا الشريك؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this partner? This cannot be undone.")) return;
    await adminApi.deletePartner(token, id).then(() => {
      setPartners((prev) => prev.filter((p) => p.id !== id));
    }).catch((e) => alert(String(e)));
  };

  const toggleFeatured = async (partner: any) => {
    if (!token) return;
    const updated = await adminApi.updatePartner(token, partner.id, { is_featured: !partner.is_featured });
    setPartners((prev) => prev.map((p) => p.id === partner.id ? updated : p));
  };

  const filteredPartners = partners.filter((p) => {
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    const matchSearch = !searchQuery || 
      p.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.name_en?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
          <h1 className={`text-2xl font-bold text-foreground ${fontHead}`}>
            {isAr ? "إدارة الشركاء والعملاء" : "Partners & Clients Manager"}
          </h1>
          <p className={`text-muted-foreground text-sm mt-1 ${fontBody}`}>
            {isAr ? `إجمالي الشركاء: ${partners.length}` : `Total partners: ${partners.length}`}
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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer ${fontBody}`}
          >
            <option value="all">{isAr ? "جميع التصنيفات" : "All Categories"}</option>
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>{isAr ? categoryLabels[opt].ar : categoryLabels[opt].en}</option>
            ))}
          </select>

          <button
            onClick={openAdd}
            className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm ${fontBody}`}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? "إضافة شريك" : "Add Partner"}</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "الشريك" : "Partner"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}>{isAr ? "التصنيف" : "Category"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center ${fontBody}`}>{isAr ? "مميز" : "Featured"}</th>
                <th className={`px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-end ${fontBody}`}>{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {partner.logo_url ? (
                            <img src={partner.logo_url} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Briefcase className="w-5 h-5 text-muted-foreground/30" />
                          )}
                        </div>
                        <div>
                          <div className={`font-bold text-foreground text-sm ${fontBody}`}>{isAr ? partner.name_ar : partner.name_en}</div>
                          <div className={`text-muted-foreground text-xs ${fontBody}`} dir="ltr">{isAr ? partner.name_en : partner.name_ar}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-foreground border border-border ${fontBody}`}>
                        {categoryLabels[partner.category || 'other']?.[isAr ? 'ar' : 'en'] || partner.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleFeatured(partner)}
                        className={`p-2 rounded-full transition-colors ${partner.is_featured ? 'text-accent hover:bg-accent/10' : 'text-muted-foreground/30 hover:text-muted-foreground hover:bg-muted'}`}
                      >
                        <Star className={`w-5 h-5 ${partner.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(partner)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title={isAr ? "تعديل" : "Edit"}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePartner(partner.id)}
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
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className={`text-muted-foreground ${fontBody}`}>
                      {isAr ? "لا يوجد شركاء متطابقين" : "No partners match your search"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
                <h3 className={`text-xl font-bold text-foreground ${fontHead}`}>
                  {editingPartner ? (isAr ? "تعديل شريك" : "Edit Partner") : (isAr ? "إضافة شريك جديد" : "Add New Partner")}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground bg-background hover:bg-muted p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form id="partnerForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>{isAr ? "الاسم بالعربية" : "Name (Arabic)"} *</label>
                      <input
                        {...register("name_ar", { required: true })}
                        className={`w-full bg-background border ${errors.name_ar ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>{isAr ? "الاسم بالإنجليزية" : "Name (English)"} *</label>
                      <input
                        {...register("name_en", { required: true })}
                        dir="ltr"
                        className={`w-full bg-background border ${errors.name_en ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>{isAr ? "التصنيف" : "Category"} *</label>
                    <select
                      {...register("category", { required: true })}
                      className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none ${fontBody}`}
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt} value={opt}>{isAr ? categoryLabels[opt].ar : categoryLabels[opt].en}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>{isAr ? "رابط الشعار (URL)" : "Logo URL"}</label>
                    <div className="flex gap-4">
                      <input
                        {...register("logo_url")}
                        dir="ltr"
                        placeholder="https://..."
                        className={`flex-1 bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                      />
                      <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center shrink-0">
                         <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                    </div>
                    {/* Logo size guidance */}
                    <div className={`mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1 ${fontBody}`}>
                      <p className="text-xs font-bold text-amber-800">
                        {isAr ? "📐 مواصفات الشعار المثالية:" : "📐 Recommended logo specs:"}
                      </p>
                      <ul className="text-xs text-amber-700 space-y-0.5 list-none">
                        <li>{isAr ? "• الأبعاد: 300 × 120 بكسل (عرض × ارتفاع)" : "• Dimensions: 300 × 120 px (W × H)"}</li>
                        <li>{isAr ? "• التنسيق: PNG بخلفية شفافة (مفضّل) أو SVG" : "• Format: PNG with transparent background (preferred) or SVG"}</li>
                        <li>{isAr ? "• الحجم الأقصى: 500 كيلوبايت" : "• Max file size: 500 KB"}</li>
                        <li>{isAr ? "• نسبة العرض إلى الارتفاع: 2.5 : 1 أو أقرب إليها" : "• Aspect ratio: ~2.5:1 (landscape)"}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-6 pt-2 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" {...register("is_featured")} className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer" />
                      <span className={`text-sm font-medium text-foreground group-hover:text-primary transition-colors ${fontBody}`}>{isAr ? "عرض في الصفحة الرئيسية (مميز)" : "Show on homepage (Featured)"}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" {...register("is_active")} className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer" />
                      <span className={`text-sm font-medium text-foreground group-hover:text-primary transition-colors ${fontBody}`}>{isAr ? "نشط" : "Active"}</span>
                    </label>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-background transition-colors text-sm font-medium ${fontBody}`}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  form="partnerForm"
                  disabled={saving}
                  className={`bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${saving ? 'opacity-70 cursor-not-allowed' : ''} ${fontBody}`}
                >
                  {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save Partner")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}