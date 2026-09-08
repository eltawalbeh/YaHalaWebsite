import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronRight, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { trackPublicEvent } from "../lib/analytics";

const QUOTE_HERO = "https://images.unsplash.com/photo-1759614581731-4c7090648de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80";

const serviceOptions = [
  { val: "flights", ar: "تذاكر الطيران", en: "Flight Tickets" },
  { val: "hotels", ar: "حجوزات الفنادق", en: "Hotel Reservations" },
  { val: "ground-transport", ar: "السيارات والقطارات", en: "Car & Train" },
  { val: "mice", ar: "المؤتمرات والفعاليات (MICE)", en: "MICE" },
  { val: "honeymoon", ar: "باقات شهر العسل", en: "Honeymoon Packages" },
  { val: "cruises", ar: "رحلات الكروز", en: "Cruise Packages" },
  { val: "therapeutic-educational", ar: "السياحة العلاجية والتعليمية", en: "Therapeutic & Educational" },
  { val: "vip", ar: "الطيران الخاص VIP", en: "VIP & Private Flights" },
  { val: "visa-insurance", ar: "التأشيرات والتأمين", en: "Visa & Insurance" },
  { val: "corporate", ar: "حلول الأعمال المؤسسية", en: "Business Solutions" },
];

export default function QuotePage() {
  const { t, isAr } = useLanguage();
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get("service") || "";

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>(defaultService ? [defaultService] : []);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const { register: registerStep1, handleSubmit: handleStep1, formState: { errors: errors1 } } = useForm();
  const { register: registerStep2, handleSubmit: handleStep2 } = useForm();
  const { register: registerStep3, handleSubmit: handleStep3 } = useForm();

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const toggleService = (val: string) => {
    setSelectedServices((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const onStep1 = (data: any) => {
    trackPublicEvent("quote_start");
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2 = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data, services: selectedServices }));
    setStep(3);
  };

  const onStep3 = async (data: any) => {
    const finalData = { ...formData, ...data, services: selectedServices };
    setSubmitting(true);
    try {
      await api.submitQuote(finalData);
      trackPublicEvent("quote_submit", { service_count: String(selectedServices.length) });
      setSubmitted(true);
    } catch (e) {
      alert(t("حدث خطأ. يرجى المحاولة مرة أخرى.", "An error occurred. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, ar: "معلومات الشركة", en: "Company Info" },
    { num: 2, ar: "متطلبات السفر", en: "Travel Requirements" },
    { num: 3, ar: "تفاصيل إضافية", en: "Additional Details" },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={QUOTE_HERO} alt="Quote" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4 font-en-body">
            <Link to="/" className="hover:text-accent transition-colors">{t("الرئيسية", "Home")}</Link>
            <ChevronRight className={`w-4 h-4 rtl:rotate-180`} />
            <span className="text-white">{t("طلب عرض أسعار", "Request a Quote")}</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold text-white ${fontHead}`}>
            {t("طلب عرض أسعار", "Request a Quote")}
          </h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {submitted ? (
            <div className="bg-card rounded-3xl p-12 text-center shadow-lg border border-border">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className={`text-3xl font-bold text-card-foreground mb-4 ${fontHead}`}>
                {t("تم إرسال طلبك بنجاح!", "Quote Request Submitted!")}
              </h2>
              <p className={`text-muted-foreground mb-4 leading-relaxed ${fontBody}`}>
                {t(
                  "شكراً لتواصلك مع يا هلا للسفر والسياحة. سيقوم فريقنا المتخصص بمراجعة طلبك والتواصل معك خلال 24 ساعة.",
                  "Thank you for contacting Ya Hala Travel & Tourism. Our specialized team will review your request and contact you within 24 hours."
                )}
              </p>
              <p className="text-accent font-semibold font-en-body tracking-wider" dir="ltr">+966 11 26 33 000</p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/"
                  className={`bg-accent hover:bg-[#b8943d] text-white font-semibold px-8 py-3 rounded-full transition-colors ${fontBody}`}
                >
                  {t("العودة للرئيسية", "Back to Home")}
                </Link>
                <button
                  onClick={() => { setSubmitted(false); setStep(1); setFormData({}); setSelectedServices([]); }}
                  className={`border border-border text-muted-foreground hover:bg-muted font-semibold px-8 py-3 rounded-full transition-colors ${fontBody}`}
                >
                  {t("طلب آخر", "New Request")}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="mb-12">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 inset-x-0 h-0.5 bg-muted z-0">
                    <div
                      className="h-full bg-primary transition-all duration-500 origin-left rtl:origin-right"
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                  </div>
                  {steps.map((s) => (
                    <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 font-en-body shadow-sm ${
                          s.num < step
                            ? "bg-primary text-white"
                            : s.num === step
                            ? "bg-primary text-white ring-4 ring-primary/20"
                            : "bg-card border-2 border-border text-muted-foreground"
                        }`}
                      >
                        {s.num < step ? <CheckCircle className="w-5 h-5" /> : s.num}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-semibold hidden sm:block ${s.num === step ? "text-primary" : "text-muted-foreground"} ${fontBody}`}
                      >
                        {isAr ? s.ar : s.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-xl border border-border">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? 20 : -20 }}
                      onSubmit={handleStep1(onStep1)}
                      className="space-y-6"
                    >
                      <h3 className={`text-2xl font-bold text-card-foreground mb-6 ${fontHead}`}>
                        {t("معلومات الشركة", "Company Info")}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                            {t("اسم الشركة", "Company Name")} *
                          </label>
                          <input
                            {...registerStep1("company_name", { required: true })}
                            className={`w-full bg-background border ${errors1.company_name ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                            placeholder={t("أدخل اسم الشركة", "Enter company name")}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                            {t("رقم السجل التجاري (اختياري)", "Commercial Registration (Optional)")}
                          </label>
                          <input
                            {...registerStep1("cr_number")}
                            className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                            {t("اسم المسؤول", "Contact Person Name")} *
                          </label>
                          <input
                            {...registerStep1("contact_name", { required: true })}
                            className={`w-full bg-background border ${errors1.contact_name ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                            {t("المسمى الوظيفي", "Job Title")}
                          </label>
                          <input
                            {...registerStep1("job_title")}
                            className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                            {t("البريد الإلكتروني", "Email Address")} *
                          </label>
                          <input
                            type="email"
                            {...registerStep1("email", { required: true, pattern: /^\S+@\S+$/i })}
                            className={`w-full bg-background border ${errors1.email ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                            {t("رقم الجوال", "Phone Number")} *
                          </label>
                          <input
                            type="tel"
                            {...registerStep1("phone", { required: true })}
                            className={`w-full bg-background border ${errors1.phone ? 'border-destructive' : 'border-border'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                            dir="ltr"
                            placeholder="+966 5X XXX XXXX"
                          />
                        </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button
                          type="submit"
                          className={`bg-primary hover:bg-[#004f59] text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${fontBody}`}
                        >
                          {t("التالي", "Next")}
                          <ArrowRight className={`w-4 h-4 rtl:-scale-x-100`} />
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? 20 : -20 }}
                      onSubmit={handleStep2(onStep2)}
                      className="space-y-6"
                    >
                      <h3 className={`text-2xl font-bold text-card-foreground mb-2 ${fontHead}`}>
                        {t("متطلبات السفر", "Travel Requirements")}
                      </h3>
                      <p className={`text-muted-foreground text-sm mb-6 ${fontBody}`}>
                        {t("اختر الخدمات التي ترغب في الحصول على عرض أسعار لها (يمكنك اختيار أكثر من خدمة)", "Select the services you'd like a quote for (you can select multiple)")}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {serviceOptions.map((s) => {
                          const isSelected = selectedServices.includes(s.val);
                          return (
                            <div
                              key={s.val}
                              onClick={() => toggleService(s.val)}
                              className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all duration-200 ${
                                isSelected 
                                  ? "border-primary bg-primary/5 shadow-sm" 
                                  : "border-border hover:border-primary/40 bg-background"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isSelected ? "border-primary bg-primary" : "border-border"
                              }`}>
                                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`font-medium ${isSelected ? "text-primary" : "text-card-foreground"} ${fontBody}`}>
                                {isAr ? s.ar : s.en}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-8 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className={`text-muted-foreground hover:text-foreground font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-colors ${fontBody}`}
                        >
                          <ArrowLeft className={`w-4 h-4 rtl:-scale-x-100`} />
                          {t("السابق", "Previous")}
                        </button>
                        <button
                          type="submit"
                          disabled={selectedServices.length === 0}
                          className={`bg-primary hover:bg-[#004f59] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${fontBody}`}
                        >
                          {t("التالي", "Next")}
                          <ArrowRight className={`w-4 h-4 rtl:-scale-x-100`} />
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {step === 3 && (
                    <motion.form
                      key="step3"
                      initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? 20 : -20 }}
                      onSubmit={handleStep3(onStep3)}
                      className="space-y-6"
                    >
                      <h3 className={`text-2xl font-bold text-card-foreground mb-6 ${fontHead}`}>
                        {t("تفاصيل إضافية", "Additional Details")}
                      </h3>

                      <div>
                        <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                          {t("الميزانية التقديرية (اختياري)", "Estimated Budget (Optional)")}
                        </label>
                        <select
                          {...registerStep3("budget")}
                          className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                        >
                          <option value="">{t("اختر الميزانية", "Select budget")}</option>
                          <option value="under_50k">{t("أقل من 50,000 ريال", "Under 50,000 SAR")}</option>
                          <option value="50k_to_200k">{t("50,000 - 200,000 ريال", "50,000 - 200,000 SAR")}</option>
                          <option value="200k_to_500k">{t("200,000 - 500,000 ريال", "200,000 - 500,000 SAR")}</option>
                          <option value="above_500k">{t("أكثر من 500,000 ريال", "Above 500,000 SAR")}</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold text-card-foreground mb-2 ${fontBody}`}>
                          {t("ملاحظات إضافية", "Additional Notes")}
                        </label>
                        <textarea
                          {...registerStep3("notes")}
                          rows={5}
                          className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none ${fontBody}`}
                          placeholder={t("أضف أي تفاصيل أخرى عن متطلباتك...", "Add any other details about your requirements...")}
                        />
                      </div>

                      <div className="pt-8 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className={`text-muted-foreground hover:text-foreground font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-colors ${fontBody}`}
                        >
                          <ArrowLeft className={`w-4 h-4 rtl:-scale-x-100`} />
                          {t("السابق", "Previous")}
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`bg-accent hover:bg-[#b8943d] disabled:opacity-70 text-white font-semibold px-10 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:shadow-accent/30 ${fontBody}`}
                        >
                          {submitting ? t("جاري الإرسال...", "Submitting...") : t("إرسال الطلب", "Submit Request")}
                          {!submitting && <CheckCircle className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}