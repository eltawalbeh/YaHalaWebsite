import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Image as ImageIcon, Layout, CheckCircle, GripVertical } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { useForm } from "react-hook-form";

export default function AdminMedia() {
  const { token } = useAuth();
  const { t, isAr } = useLanguage();
  const [hero, setHero] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!token) return;
    Promise.all([
      adminApi.getHero(token),
      adminApi.getStats(token),
    ]).then(([heroData, statsData]) => {
      setHero(heroData);
      setStats(statsData.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)));
      reset(heroData);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const onSaveHero = async (data: any) => {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateHero(token, data);
      setHero(updated);
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } catch (e) {
      alert(String(e));
    } finally {
      setSaving(false);
    }
  };

  const addStat = async () => {
    if (!token) return;
    const newStat = await adminApi.createStat(token, {
      value: "0+",
      label_ar: "تسمية",
      label_en: "Label",
      icon_name: "Star",
      order_index: stats.length,
      is_active: true,
    });
    setStats((prev) => [...prev, newStat]);
  };

  const updateStat = (id: string, field: string, value: any) => {
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteStat = async (id: string) => {
    if (!token || !confirm(isAr ? "هل تريد حذف هذه الإحصائية؟" : "Delete this stat?")) return;
    await adminApi.deleteStat(token, id).then(() => {
      setStats((prev) => prev.filter((s) => s.id !== id));
    }).catch(console.error);
  };

  const saveAllStats = async () => {
    if (!token) return;
    setSavingStats(true);
    try {
      await Promise.all(stats.map((s, index) => adminApi.updateStat(token, s.id, { ...s, order_index: index })));
      setStatsSaved(true);
      setTimeout(() => setStatsSaved(false), 3000);
    } catch (e) {
      alert(String(e));
    } finally {
      setSavingStats(false);
    }
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newStats = [...stats];
      [newStats[index - 1], newStats[index]] = [newStats[index], newStats[index - 1]];
      setStats(newStats);
    } else if (direction === 'down' && index < stats.length - 1) {
      const newStats = [...stats];
      [newStats[index + 1], newStats[index]] = [newStats[index], newStats[index + 1]];
      setStats(newStats);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <ImageIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold text-foreground ${fontHead}`}>
            {isAr ? "إدارة الوسائط والواجهة" : "Media & Hero Settings"}
          </h1>
          <p className={`text-muted-foreground text-sm mt-1 ${fontBody}`}>
            {isAr ? "تخصيص الصور والنصوص للصفحة الرئيسية والإحصائيات" : "Customize homepage images, text, and statistics"}
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-primary" />
            <h2 className={`text-lg font-bold text-foreground ${fontHead}`}>
              {isAr ? "القسم الرئيسي (Hero)" : "Hero Section"}
            </h2>
          </div>
          {heroSaved && (
            <span className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
              <CheckCircle className="w-4 h-4" />
              {isAr ? "تم الحفظ بنجاح" : "Saved successfully"}
            </span>
          )}
        </div>

        <div className="p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSaveHero)} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "العنوان الرئيسي (عربي)" : "Main Title (Arabic)"}
                  </label>
                  <input
                    {...register("title_ar")}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                    placeholder="نص العنوان هنا..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "النص الفرعي (عربي)" : "Subtitle (Arabic)"}
                  </label>
                  <textarea
                    {...register("subtitle_ar")}
                    rows={3}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${fontBody}`}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "العنوان الرئيسي (إنجليزي)" : "Main Title (English)"}
                  </label>
                  <input
                    {...register("title_en")}
                    dir="ltr"
                    className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                    placeholder="Main title text here..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "النص الفرعي (إنجليزي)" : "Subtitle (English)"}
                  </label>
                  <textarea
                    {...register("subtitle_en")}
                    dir="ltr"
                    rows={3}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${fontBody}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div>
                <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                  {isAr ? "رابط فيديو الخلفية (اختياري)" : "Background Video URL (Optional)"}
                </label>
                <input
                  {...register("video_url")}
                  dir="ltr"
                  placeholder="https://..."
                  className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                />
                <p className={`text-xs text-muted-foreground mt-2 ${fontBody}`}>
                  {isAr ? "يجب أن يكون رابط مباشر لملف MP4" : "Must be a direct link to an MP4 file"}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                  {isAr ? "صورة الخلفية (Fallback)" : "Fallback Background Image"}
                </label>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1 w-full">
                    <input
                      {...register("image_url")}
                      dir="ltr"
                      placeholder="https://images.unsplash.com/..."
                      className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                    />
                  </div>
                  {hero?.image_url && (
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden border border-border shadow-sm shrink-0 relative">
                      <img src={hero.image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-secondary/20" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm ${saving ? 'opacity-70 cursor-not-allowed' : ''} ${fontBody}`}
              >
                <Save className="w-5 h-5" />
                {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التغييرات" : "Save Changes")}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border bg-muted/20 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className={`text-lg font-bold text-foreground ${fontHead}`}>
                {isAr ? "إحصائيات الإنجازات" : "Achievement Stats"}
              </h2>
              <p className={`text-xs text-muted-foreground mt-0.5 ${fontBody}`}>
                {isAr ? "تعرض في الصفحة الرئيسية، يمكنك تغيير الترتيب والتعديل" : "Displayed on homepage, you can reorder and edit"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {statsSaved && (
              <span className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
                <CheckCircle className="w-4 h-4" />
                {isAr ? "تم الحفظ" : "Saved"}
              </span>
            )}
            <button
              onClick={addStat}
              className={`flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors ${fontBody}`}
            >
              <Plus className="w-4 h-4" />
              {isAr ? "إضافة إحصائية" : "Add Stat"}
            </button>
            <button
              onClick={saveAllStats}
              disabled={savingStats}
              className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm ${savingStats ? 'opacity-70' : ''} ${fontBody}`}
            >
              <Save className="w-4 h-4" />
              {isAr ? "حفظ الكل" : "Save All"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={stat.id} className="flex flex-col xl:flex-row gap-4 bg-background border border-border rounded-xl p-4 transition-all hover:border-primary/30 group">
                <div className="flex items-center gap-2 text-muted-foreground/30 px-2 cursor-ns-resize xl:flex-col justify-center">
                  <button onClick={() => moveStat(index, 'up')} disabled={index === 0} className="hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground/30">
                     <GripVertical className="w-5 h-5 rotate-90 xl:rotate-0" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                  <div>
                    <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${fontBody}`}>{isAr ? "القيمة (مثال: 500+)" : "Value (e.g. 500+)"}</label>
                    <input
                      value={stat.value || ''}
                      onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                      className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${fontBody}`}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${fontBody}`}>{isAr ? "التسمية (عربي)" : "Label (Arabic)"}</label>
                    <input
                      value={stat.label_ar || ''}
                      onChange={(e) => updateStat(stat.id, 'label_ar', e.target.value)}
                      className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${fontBody}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${fontBody}`}>{isAr ? "التسمية (إنجليزي)" : "Label (English)"}</label>
                    <input
                      value={stat.label_en || ''}
                      onChange={(e) => updateStat(stat.id, 'label_en', e.target.value)}
                      className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${fontBody}`}
                      dir="ltr"
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className={`block text-xs font-semibold text-muted-foreground mb-1.5 ${fontBody}`}>{isAr ? "الحالة" : "Status"}</label>
                      <label className="flex items-center gap-2 h-[38px] px-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stat.is_active !== false}
                          onChange={(e) => updateStat(stat.id, 'is_active', e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background cursor-pointer"
                        />
                        <span className={`text-sm ${fontBody}`}>{isAr ? "ظاهر" : "Visible"}</span>
                      </label>
                    </div>
                    <button
                      onClick={() => deleteStat(stat.id)}
                      className="w-[38px] h-[38px] flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20 shrink-0"
                      title={isAr ? "حذف" : "Delete"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {stats.length === 0 && (
              <div className="text-center py-8 bg-muted/20 border border-dashed border-border rounded-xl">
                <p className={`text-muted-foreground ${fontBody}`}>
                  {isAr ? "لا توجد إحصائيات مضافة" : "No stats added yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
