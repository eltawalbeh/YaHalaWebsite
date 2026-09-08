import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Settings as SettingsIcon, Mail, Lock, CheckCircle, Smartphone, Globe, Building } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";
import { useForm } from "react-hook-form";
import LogoMini from "../../imports/LogoMini";

export default function AdminSettings() {
  const { token, adminEmail } = useAuth();
  const { t, isAr } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [savingSite, setSavingSite] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [siteSaved, setSiteSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const { register: regSite, handleSubmit: handleSite, reset: resetSite } = useForm();
  const { register: regPw, handleSubmit: handlePw, reset: resetPw } = useForm();

  useEffect(() => {
    if (!token) return;
    adminApi.getSettings(token).then((settings) => {
      resetSite(settings);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const onSaveSite = async (data: any) => {
    if (!token) return;
    setSavingSite(true);
    try {
      await adminApi.updateSettings(token, data);
      setSiteSaved(true);
      setTimeout(() => setSiteSaved(false), 3000);
    } catch (e) {
      alert(String(e));
    } finally {
      setSavingSite(false);
    }
  };

  const onChangePassword = async (data: any) => {
    if (!token) return;
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError(isAr ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    setPasswordError("");
    setSavingPassword(true);
    try {
      const { supabase } = await import("../context/AuthContext");
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      setPasswordSaved(true);
      resetPw();
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (e: any) {
      setPasswordError(e.message || String(e));
    } finally {
      setSavingPassword(false);
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
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold text-foreground ${fontHead}`}>
            {isAr ? "الإعدادات العامة" : "General Settings"}
          </h1>
          <p className={`text-muted-foreground text-sm mt-1 ${fontBody}`}>
            {isAr ? "تكوين معلومات الموقع، التنبيهات، والأمان" : "Configure site info, notifications, and security"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Site Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className={`text-lg font-bold text-foreground ${fontHead}`}>
                  {isAr ? "إعدادات الموقع" : "Site Settings"}
                </h2>
              </div>
              {siteSaved && (
                <span className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {isAr ? "تم الحفظ" : "Saved"}
                </span>
              )}
            </div>

            <div className="p-6">
              <form onSubmit={handleSite(onSaveSite)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                      {isAr ? "اسم الموقع (عربي)" : "Site Name (Arabic)"}
                    </label>
                    <div className="relative">
                      <Building className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        {...regSite("site_name_ar")}
                        className={`w-full bg-background border border-border rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                      {isAr ? "اسم الموقع (إنجليزي)" : "Site Name (English)"}
                    </label>
                    <div className="relative">
                      <Building className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        {...regSite("site_name_en")}
                        dir="ltr"
                        className={`w-full bg-background border border-border rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                      {isAr ? "الشعار (عربي)" : "Tagline (Arabic)"}
                    </label>
                    <input
                      {...regSite("tagline_ar")}
                      className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fontBody}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                      {isAr ? "الشعار (إنجليزي)" : "Tagline (English)"}
                    </label>
                    <input
                      {...regSite("tagline_en")}
                      dir="ltr"
                      className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                      {isAr ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        {...regSite("phone")}
                        dir="ltr"
                        className={`w-full bg-background border border-border rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                      {isAr ? "البريد الإلكتروني للإدارة" : "Admin Email"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <input
                        {...regSite("email")}
                        dir="ltr"
                        className={`w-full bg-background border border-border rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={savingSite}
                    className={`flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm ${savingSite ? 'opacity-70 cursor-not-allowed' : ''} ${fontBody}`}
                  >
                    <Save className="w-5 h-5" />
                    {savingSite ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ إعدادات الموقع" : "Save Site Settings")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Email Template Preview Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className={`text-lg font-bold text-foreground ${fontHead}`}>
                  {isAr ? "قالب إشعارات البريد (معاينة)" : "Email Notification Template (Preview)"}
                </h2>
              </div>
            </div>
            <div className="p-6 bg-muted/30">
              <p className={`text-sm text-muted-foreground mb-4 ${fontBody}`}>
                {isAr ? "هذا هو القالب الذي سيتم إرساله إليك عند استلام طلب تسعير جديد من قبل العميل." : "This is the template sent to you when a new quote request is submitted by a client."}
              </p>
              
              {/* HTML Email Mockup */}
              <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden max-w-xl mx-auto" dir="rtl" style={{ fontFamily: 'Arial, sans-serif' }}>
                <div className="bg-[#1A1A2E] p-6 text-center border-b-4 border-[#C9A84C]">
                  {/* Real company logo — white fill on dark header */}
                  <div
                    className="relative h-[48px] w-[116px] mx-auto mb-3"
                    style={{ '--fill-0': 'white' } as React.CSSProperties}
                  >
                    <LogoMini />
                  </div>
                  <h1 className="text-white text-xl font-bold m-0">طلب تسعير جديد</h1>
                </div>
                
                <div className="p-6 text-gray-800">
                  <p className="text-lg font-bold mb-4 text-[#1A1A2E]">مرحباً الإدارة،</p>
                  <p className="mb-6 leading-relaxed">لقد استلمت طلب تسعير جديد من موقع يا هلا للسفر والسياحة. يرجى مراجعة التفاصيل أدناه:</p>
                  
                  <div className="bg-[#F8F7F4] rounded-lg p-5 mb-6 border border-[#E5E5E5]">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-2 text-gray-500 w-1/3 font-bold">اسم الشركة:</td>
                          <td className="py-2 font-semibold">شركة الأمثلة التقنية المحدودة</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-500 w-1/3 font-bold">الشخص المسؤول:</td>
                          <td className="py-2 font-semibold">أحمد محمد</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-500 w-1/3 font-bold">رقم الهاتف:</td>
                          <td className="py-2 font-semibold" dir="ltr">+966 50 123 4567</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-500 w-1/3 font-bold">البريد الإلكتروني:</td>
                          <td className="py-2 font-semibold" dir="ltr">ahmed@example.com</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-500 w-1/3 font-bold align-top">الخدمات المطلوبة:</td>
                          <td className="py-2 font-semibold">تذاكر الطيران، حجوزات الفنادق، المواصلات</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center">
                    <a href="#" className="inline-block bg-[#005F6B] hover:bg-[#004f59] text-white font-bold py-3 px-6 rounded-lg no-underline transition-colors">
                      عرض الطلب في لوحة التحكم
                    </a>
                  </div>
                </div>

                <div className="bg-[#F8F7F4] p-4 text-center text-gray-400 text-xs border-t border-[#E5E5E5]">
                  <p className="m-0">هذه رسالة تلقائية من نظام يا هلا للسفر والسياحة. يرجى عدم الرد المباشر عليها.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Settings Sidebar */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className={`text-lg font-bold text-foreground ${fontHead}`}>
                  {isAr ? "الأمان والمرور" : "Security"}
                </h2>
              </div>
              {passwordSaved && (
                <span className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="p-6">
              <form onSubmit={handlePw(onChangePassword)} className="space-y-5">
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "كلمة المرور الحالية" : "Current Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      {...regPw("currentPassword", { required: true })}
                      dir="ltr"
                      className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "كلمة المرور الجديدة" : "New Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      {...regPw("newPassword", { required: true, minLength: 6 })}
                      dir="ltr"
                      className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
                  </label>
                  <input
                    type={showNewPw ? "text" : "password"}
                    {...regPw("confirmPassword", { required: true })}
                    dir="ltr"
                    className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-en-body`}
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center">
                    {passwordError}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className={`w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${savingPassword ? 'opacity-70 cursor-not-allowed' : ''} ${fontBody}`}
                  >
                    <Lock className="w-4 h-4" />
                    {savingPassword ? (isAr ? "جاري التحديث..." : "Updating...") : (isAr ? "تحديث كلمة المرور" : "Update Password")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}