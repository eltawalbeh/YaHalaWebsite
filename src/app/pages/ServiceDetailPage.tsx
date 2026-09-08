import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import { servicesCache } from "../lib/servicesCache";
import { serviceBySlug } from "../content/services";
import { trackPublicEvent } from "../lib/analytics";
import { applyServiceSeo, clearServiceSeo } from "../lib/serviceSeo";


const serviceFeatures: Record<string, { ar: string; en: string }[]> = {
  flights: [
    { ar: "تذاكر الدرجة الأولى وبزنس والاقتصادية", en: "First, business, and economy class tickets" },
    { ar: "حجوزات مفتوحة ومرنة للشركات", en: "Open and flexible bookings for companies" },
    { ar: "أسعار مخصصة للشركات والمجموعات", en: "Special rates for companies and groups" },
    { ar: "خدمة تغيير وإلغاء مرنة", en: "Flexible change and cancellation service" },
    { ar: "خدمة المطار VIP للمسافرين المميزين", en: "Airport VIP service for premium travelers" },
    { ar: "تتبع الرحلات وتنبيهات فورية", en: "Flight tracking and instant alerts" },
  ],
};

const defaultFeatures = [
  { ar: "حجوزات مضمونة بأفضل الأسعار", en: "Guaranteed bookings at best prices" },
  { ar: "دعم متخصص على مدار الساعة", en: "24/7 specialized support" },
  { ar: "إدارة شاملة لجميع الاحتياجات", en: "Comprehensive management of all needs" },
  { ar: "تقارير ومتابعة دورية", en: "Regular reports and follow-up" },
];

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t, isAr } = useLanguage();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  // ── Fast-path: check the in-memory cache that ServicesPage populated.
  // If we already know this service has an external_url, redirect right
  // now — synchronously, before any React rendering happens — so the
  // user never sees the internal page at all.
  const cachedExternal = servicesCache.get(slug || "")?.external_url;
  if (cachedExternal) {
    window.location.replace(cachedExternal);
    return null as any;
  }

  useEffect(() => {
    if (slug) trackPublicEvent("service_view", { service_slug: slug });
    setLoading(true);
    api.getService(slug || "").then((data) => {
      // Fallback redirect: cache was empty (direct URL access / cold load)
      // but the API confirmed this service has an external_url.
      if (data?.external_url) {
        // Populate cache for future navigations on this session
        servicesCache.set(slug || "", data);
        window.location.replace(data.external_url);
        return;
      }
      setService(data);
      applyServiceSeo({ slug: data.slug || slug || "", nameAr: data.name_ar, nameEn: data.name_en, descriptionAr: data.short_description_ar, descriptionEn: data.short_description_en, image: data.hero_image_url, locale: isAr ? "ar" : "en" });
      setNotFound(false);
    }).catch(() => {
      const fallback = slug ? serviceBySlug(slug) : undefined;
      if (fallback) { setService(fallback); applyServiceSeo({ slug: fallback.slug, nameAr: fallback.name_ar, nameEn: fallback.name_en, descriptionAr: fallback.short_description_ar, descriptionEn: fallback.short_description_en, image: fallback.hero_image_url, locale: isAr ? "ar" : "en" }); setNotFound(false); }
      else { setService(null); setNotFound(true); }
    }).finally(() => setLoading(false));
    return () => clearServiceSeo();
  }, [slug, isAr]);

  // Fallback for services not in the map

  const displayService = service || (slug ? serviceBySlug(slug) : undefined);

  if (!loading && (notFound || !displayService)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className={`text-3xl font-bold text-foreground ${fontHead}`}>{t("الخدمة غير موجودة", "Service Not Found")}</h1>
        <p className={`text-muted-foreground ${fontBody}`}>{t("الخدمة المطلوبة غير متاحة أو لم تعد موجودة", "The requested service is unavailable or does not exist")}</p>
        <Link to="/services" className={`bg-primary text-white px-6 py-3 rounded-full ${fontBody}`}>{t("العودة إلى الخدمات", "Back to Services")}</Link>
      </div>
    );
  }
  const features = service?.features_json?.length > 0
    ? service.features_json
    : (serviceFeatures[slug || ""] || defaultFeatures);

  const processSteps = [
    { num: "01", titleAr: "التواصل والاستشارة", titleEn: "Contact & Consultation", descAr: "تواصل معنا وأخبرنا باحتياجاتك", descEn: "Contact us and tell us your needs" },
    { num: "02", titleAr: "تقديم العرض", titleEn: "Proposal Submission", descAr: "نقدم لك عرضاً مخصصاً وتنافسياً", descEn: "We present you a customized competitive offer" },
    { num: "03", titleAr: "التأكيد والحجز", titleEn: "Confirmation & Booking", descAr: "نؤكد الحجز وندير جميع التفاصيل", descEn: "We confirm the booking and manage all details" },
    { num: "04", titleAr: "الدعم أثناء السفر", titleEn: "Travel Support", descAr: "فريقنا متاح طوال رحلتك لمساعدتك", descEn: "Our team is available throughout your trip" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={displayService.hero_image_url} alt="Service" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/85 backdrop-blur-[1px]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--color-yahala-accent) 0, var(--color-yahala-accent) 1px, transparent 0, transparent 40px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4 font-en-body tracking-wide">
              <Link to="/" className="hover:text-accent transition-colors">{t("الرئيسية", "Home")}</Link>
              <ChevronRight className={`w-4 h-4 rtl:rotate-180`} />
              <Link to="/services" className="hover:text-accent transition-colors">{t("خدماتنا", "Services")}</Link>
              <ChevronRight className={`w-4 h-4 rtl:rotate-180`} />
              <span className="text-white font-medium">{isAr ? displayService.name_ar : displayService.name_en}</span>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 ${fontHead}`}>
              {isAr ? displayService.name_ar : displayService.name_en}
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/quote?service=${slug}`}
                className={`bg-accent hover:bg-[#b8943d] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent/20 ${fontBody}`}
              >
                {t("طلب عر أسعار لهذه الخدمة", "Request Quote for this Service")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-0.5 bg-accent" />
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                    {t("عن الخدمة", "About the Service")}
                  </span>
                </div>
                <h2 className={`text-3xl font-bold text-foreground mb-8 ${fontHead}`}>
                  {isAr ? displayService.short_description_ar : displayService.short_description_en}
                </h2>
                <div className={`prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-12 ${fontBody}`}>
                  <p>
                    {isAr 
                      ? (displayService.long_description_ar || "نقدم خدمات متميزة ومصممة خصيصاً لتلبية احتياجات عملائنا بأعلى معايير الجودة والاحترافية. فريقنا المتخصص يعمل على توفير حلول مبتكرة تضمن لك تجربة سفر سلسة ومريحة.")
                      : (displayService.long_description_en || "We provide outstanding services tailored specifically to meet our clients' needs with the highest standards of quality and professionalism. Our specialized team works to provide innovative solutions ensuring a seamless and comfortable travel experience.")
                    }
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3 className={`text-2xl font-bold text-foreground mb-8 ${fontHead}`}>
                  {t("مميزات الخدمة", "Service Features")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {features.map((f: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors">
                      <div className="mt-0.5 shrink-0">
                        <CheckCircle className="w-6 h-6 text-accent" />
                      </div>
                      <span className={`text-foreground font-medium leading-relaxed ${fontBody}`}>{isAr ? f.ar : f.en}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar / CTA */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-primary rounded-3xl p-8 lg:p-10 sticky top-32 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h3 className={`text-2xl font-bold mb-4 relative z-10 ${fontHead}`}>
                  {t("هل أنت مستعد للبدء؟", "Ready to start?")}
                </h3>
                <p className={`text-white/80 mb-8 leading-relaxed relative z-10 ${fontBody}`}>
                  {t(
                    "تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعر مخصص لاحتياجات شركتك.",
                    "Contact us today for a free consultation and a custom quote for your company's needs."
                  )}
                </p>
                <Link
                  to={`/quote?service=${slug}`}
                  className={`block w-full bg-accent hover:bg-[#b8943d] text-white text-center font-semibold px-6 py-4 rounded-full transition-all duration-300 mb-4 shadow-lg relative z-10 ${fontBody}`}
                >
                  {t("اطلب عرض أسعار", "Request a Quote")}
                </Link>
                <Link
                  to="/contact"
                  className={`block w-full border border-white/30 hover:bg-white/10 text-white text-center font-semibold px-6 py-4 rounded-full transition-all duration-300 relative z-10 ${fontBody}`}
                >
                  {t("تواصل معنا", "Contact Us")}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className={`text-3xl font-bold text-foreground mb-4 ${fontHead}`}>
              {t("كيف نعمل", "How It Works")}
            </h2>
            <p className={`text-muted-foreground ${fontBody}`}>
              {t("خطوات بسيطة وواضحة لضمان حصولك على أفضل خدمة", "Simple and clear steps to ensure you get the best service")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < processSteps.length - 1 && (
                  <div className="hidden xl:block absolute top-10 ltr:left-[60%] rtl:right-[60%] w-full h-0.5 bg-border z-0" />
                )}
                <div className="relative z-10 bg-background">
                  <div className={`w-20 h-20 bg-card border-2 border-primary/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-sm mx-auto font-en-body`}>
                    {step.num}
                  </div>
                  <div className="text-center px-4">
                    <h4 className={`text-xl font-bold text-foreground mb-3 ${fontHead}`}>
                      {isAr ? step.titleAr : step.titleEn}
                    </h4>
                    <p className={`text-muted-foreground text-sm leading-relaxed ${fontBody}`}>
                      {isAr ? step.descAr : step.descEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}