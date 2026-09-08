import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight, MapPin, Phone, Mail, Globe, CheckCircle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";
import { trackPublicEvent } from "../lib/analytics";

const CONTACT_HERO = "https://images.unsplash.com/photo-1714601344981-75e003bc5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBidWlsZGluZyUyMGlsbGFtJTIwcmVmbGVjdGlvbnxlbnwxfHx8fDE3NzMxODc2NzN8MA&ixlib=rb-4.1.0&q=80&w=1920";

export default function ContactPage() {
  const { t, isAr } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await api.submitMessage(data);
      trackPublicEvent("contact_submit");
      setSubmitted(true);
      reset();
    } catch (e) {
      alert(t("حدث خطأ. يرجى المحاولة مرة أخرى.", "An error occurred. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={CONTACT_HERO} alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/85 backdrop-blur-[1px]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--color-yahala-accent) 0, var(--color-yahala-accent) 1px, transparent 0, transparent 40px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4 font-en-body tracking-wide">
              <Link to="/" className="hover:text-accent transition-colors">{t("الرئيسية", "Home")}</Link>
              <ChevronRight className={`w-4 h-4 rtl:rotate-180`} />
              <span className="text-white font-medium">{t("تواصل معنا", "Contact Us")}</span>
            </div>
            <h1 className={`text-4xl sm:text-5xl font-bold text-white ${fontHead}`}>
              {t("تواصل معنا", "Contact Us")}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Map + Info */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Map Placeholder */}
              <div className="rounded-3xl overflow-hidden h-[300px] mb-10 bg-primary/5 relative shadow-inner border border-border">
                <a
                  href="https://maps.app.goo.gl/KYNWNJeQP3qMQ65t7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full relative group"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.9!2d46.6667!3d24.7833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ3JzAwLjAiTiA0NsKwNDAnMDAuMCJF!5e0!3m2!1sen!2ssa!4v1620000000000!5m2!1sen!2ssa"
                    width="100%"
                    height="100%"
                    style={{ border: 0, pointerEvents: 'none' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-accent/5 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-xl">
                      {t("فتح في خرائط جوجل", "Open in Google Maps")}
                    </div>
                  </div>
                </a>
              </div>

              {/* Contact Details */}
              <div className="bg-background rounded-3xl p-8 lg:p-10 shadow-lg border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className={`text-2xl font-bold text-foreground mb-8 relative z-10 ${fontHead}`}>
                  {t("معلومات التواصل", "Contact Information")}
                </h3>
                <div className="space-y-8 relative z-10">
                  {[
                    {
                      icon: MapPin,
                      labelAr: "المقر الرئيسي",
                      labelEn: "Headquarters",
                      valueAr: "طريق الأمير محمد بن سعد بن عبدالعزيز، الملقا، الرياض",
                      valueEn: "Prince Muhammad Ibn Saad Rd, Al Malqa, Riyadh",
                      link: "https://maps.app.goo.gl/KYNWNJeQP3qMQ65t7",
                    },
                    { icon: Phone, labelAr: "هاتف موحد", labelEn: "Unified Number", valueAr: "+966 11 26 33 000", valueEn: "+966 11 26 33 000", link: "tel:+966112633000" },
                    { icon: Mail, labelAr: "البريد الإلكتروني", labelEn: "Email Address", valueAr: "corporate@yahala.co", valueEn: "corporate@yahala.co", link: "mailto:corporate@yahala.co" },
                    { icon: Globe, labelAr: "الموقع الإلكتروني", labelEn: "Website", valueAr: "www.yahala.co", valueEn: "www.yahala.co", link: "https://www.yahala.co" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5 group">
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                        <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <div className={`text-sm text-muted-foreground mb-1 font-medium ${fontBody}`}>{isAr ? item.labelAr : item.labelEn}</div>
                        {item.link ? (
                          <a 
                            href={item.link} 
                            target={item.icon === MapPin || item.icon === Globe ? "_blank" : undefined}
                            rel={item.icon === MapPin || item.icon === Globe ? "noopener noreferrer" : undefined}
                            className={`text-foreground font-semibold hover:text-accent transition-colors ${item.icon !== MapPin ? "font-en-body tracking-wide" : fontBody}`} 
                            dir={item.icon !== MapPin ? "ltr" : "auto"}
                          >
                            {isAr ? item.valueAr : item.valueEn}
                          </a>
                        ) : (
                          <div className={`text-foreground font-semibold leading-relaxed ${fontBody}`}>
                            {isAr ? item.valueAr : item.valueEn}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-background rounded-3xl p-8 lg:p-12 shadow-xl border border-border h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
                
                {submitted ? (
                  <div className="text-center py-16 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className={`text-3xl font-bold text-foreground mb-4 ${fontHead}`}>
                      {t("تم إرسال رسالتك بنجاح", "Message Sent Successfully")}
                    </h3>
                    <p className={`text-muted-foreground mb-8 text-lg ${fontBody}`}>
                      {t("شكراً لتواصلك معنا. سيقوم أحد ممثلي خدمة العملاء بالرد عليك قريباً.", "Thank you for contacting us. A customer service representative will reply shortly.")}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className={`bg-accent hover:bg-[#b8943d] text-white font-semibold px-8 py-3 rounded-full transition-colors ${fontBody}`}
                    >
                      {t("إرسال رسالة أخرى", "Send Another Message")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-0.5 bg-accent" />
                        <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                          {t("راسلنا", "Send a Message")}
                        </span>
                      </div>
                      <h2 className={`text-3xl font-bold text-foreground ${fontHead}`}>
                        {t("نحن هنا لخدمتك", "We Are Here to Serve You")}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                          {t("الاسم الكامل", "Full Name")} *
                        </label>
                        <input
                          {...register("name", { required: true })}
                          className={`w-full bg-card border ${errors.name ? 'border-destructive' : 'border-border'} rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          placeholder={t("الاسم الكامل", "Full Name")}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                          {t("اسم الشركة (اختياري)", "Company Name (Optional)")}
                        </label>
                        <input
                          {...register("company")}
                          className={`w-full bg-card border border-border rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          placeholder={t("اسم الشركة", "Company Name")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                          {t("البريد الإلكتروني", "Email Address")} *
                        </label>
                        <input
                          type="email"
                          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                          className={`w-full bg-card border ${errors.email ? 'border-destructive' : 'border-border'} rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          dir="ltr"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                          {t("رقم الهاتف", "Phone Number")} *
                        </label>
                        <input
                          type="tel"
                          {...register("phone", { required: true })}
                          className={`w-full bg-card border ${errors.phone ? 'border-destructive' : 'border-border'} rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                          dir="ltr"
                          placeholder="+966 5X XXX XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                        {t("الرسالة", "Message")} *
                      </label>
                      <textarea
                        {...register("message", { required: true })}
                        rows={5}
                        className={`w-full bg-card border ${errors.message ? 'border-destructive' : 'border-border'} rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none ${fontBody}`}
                        placeholder={t("كيف يمكننا مساعدتك؟", "How can we help you?")}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full sm:w-auto bg-primary hover:bg-[#004f59] disabled:opacity-70 text-white font-semibold px-10 py-4 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${fontBody}`}
                      >
                        {submitting ? t("جاري الإرسال...", "Sending...") : t("إرسال الرسالة", "Send Message")}
                        {!submitting && <Send className={`w-5 h-5 rtl:-scale-x-100`} />}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
