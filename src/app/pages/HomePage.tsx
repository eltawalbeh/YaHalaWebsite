import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowDown, Award, Building2, Globe, Headphones,
  ChevronRight, Shield, Network, Zap,
  CheckCircle, ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import { defaultServices } from "../content/services";
import VideoHero from "../components/VideoHero";
import EventHero from "../components/EventHero";
import { getActiveHeroMode } from "../lib/heroConfig";

const HERO_IMAGE = "https://images.unsplash.com/photo-1714601344981-75e003bc5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBidWlsZGluZyUyMGlsbGFzJTIwcmVmbGVjdGlvbnxlbnwxfHx8fDE3NzMxODc2NzN8MA&ixlib=rb-4.1.0&q=80&w=1920";
const DESERT_IMAGE = "https://images.unsplash.com/photo-1671398995061-63138e8344a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkZXNlcnQlMjBob3RlbCUyMHNhdWRpJTIwYXJhYmlhfGVufDF8fHx8MTc3MzE4NzY2OXww&ixlib=rb-4.1.0&q=80&w=900";

const defaultStats = [
  { id: "s1", value: "20+", label_ar: "سنة خبرة", label_en: "Years Experience", icon_name: "Award" },
  { id: "s2", value: "500+", label_ar: "عميل مؤسسي", label_en: "Corporate Clients", icon_name: "Building2" },
  { id: "s3", value: "50+", label_ar: "شريك عالمي", label_en: "Global Partners", icon_name: "Globe" },
  { id: "s4", value: "24/7", label_ar: "دعم متواصل", label_en: "Continuous Support", icon_name: "Headphones" },
];


const valueProps = [
  { icon: Award, titleAr: "خبرة تتجاوز 20 عاماً", titleEn: "20+ Years of Experience", descAr: "نمتلك تاريخاً طويلاً في خدمة الشركات الكبرى والمؤسسات الحكومية", descEn: "A long history serving major corporations and government institutions" },
  { icon: Zap, titleAr: "تقنية متقدمة", titleEn: "Advanced Technology", descAr: "نظام حجز متكامل وذكي يضمن أسرع وأفضل الحلول لعملائنا", descEn: "Integrated smart booking system ensuring the fastest solutions" },
  { icon: Network, titleAr: "شبكة شركاء عالمية", titleEn: "Global Partner Network", descAr: "شراكات مع أكبر شركات الطيران والفنادق والخدمات حول العالم", descEn: "Partnerships with top airlines, hotels, and services worldwide" },
  { icon: Headphones, titleAr: "دعم على مدار الساعة", titleEn: "24/7 Support", descAr: "فريق متخصص متاح في جميع الأوقات لخدمتكم وحل استفساراتكم", descEn: "Dedicated team available at all times to serve you" },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

export default function HomePage() {
  const { t, isAr } = useLanguage();
  const [services, setServices] = useState(defaultServices);
  const [stats, setStats] = useState(defaultStats);

  const statsReveal = useScrollReveal();
  const whyReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();

  useEffect(() => {
    api.getServices().then((data) => { if (Array.isArray(data) && data.length > 0) setServices(data); }).catch(() => {});
    api.getStats().then((data) => { if (Array.isArray(data) && data.length > 0) setStats(data); }).catch(() => {});
  }, []);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  return (
    <div className="bg-background">
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      {getActiveHeroMode() === "event" ? <EventHero /> : <VideoHero />}

      {/* ─── STATS BAR ────────────────────────────────────────────────────── */}
      <section ref={statsReveal.ref} className="bg-primary py-16 relative overflow-hidden border-y border-primary-foreground/10">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 20px)", backgroundSize: "20px 20px" }} />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={statsReveal.visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center px-4 border-e border-e-white/10 last:border-e-0"
              >
                <div className={`text-4xl lg:text-5xl font-bold text-accent mb-3 ${fontHead}`}>
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className={`text-white/90 text-sm md:text-base font-medium uppercase tracking-wide ${fontBody}`}>
                  {isAr ? stat.label_ar : stat.label_en}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY YA HALA ──────────────────────────────────────────────────── */}
      <section ref={whyReveal.ref} className="py-24 lg:py-32 overflow-hidden bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? 40 : -40 }}
              animate={whyReveal.visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className={`relative ${isAr ? "lg:order-2" : ""}`}
            >
              <div className="relative h-[350px] md:h-[480px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img src={DESERT_IMAGE} alt="Corporate Travel Saudi Arabia" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                <div className="absolute bottom-8 ltr:left-8 rtl:right-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className={`text-white font-bold text-lg mb-1 ${fontHead}`}>
                        {t("شريكك الموثوق", "Your Trusted Partner")}
                      </div>
                      <div className={`text-accent text-sm ${fontBody}`}>
                        {t("معتمد من كبرى المؤسسات", "Certified by leading institutions")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 ltr:-right-8 rtl:-left-8 w-32 h-32 opacity-10 hidden md:block">
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full text-primary">
                  <rect width="36" height="36" rx="4" fill="currentColor" />
                  <rect x="44" width="36" height="36" rx="4" fill="currentColor" />
                  <rect y="44" width="36" height="36" rx="4" fill="currentColor" />
                  <rect x="44" y="44" width="36" height="36" rx="4" fill="currentColor" />
                </svg>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: isAr ? -40 : 40 }}
              animate={whyReveal.visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={isAr ? "lg:order-1" : ""}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-accent" />
                <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                  {t("لماذا يا هلا", "Why Ya Hala")}
                </span>
              </div>
              <h2 className={`text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight ${fontHead}`}>
                {t("الشريك الاستراتيجي لسفر شركتك", "The Strategic Partner for Your Corporate Travel")}
              </h2>
              <p className={`text-muted-foreground text-lg mb-12 leading-relaxed ${fontBody}`}>
                {t(
                  "نحن لسنا مجرد وكالة سفر — نحن شركاء استراتيجيون يفهمون متطلبات الأعمال ويقدمون حلولاً متكاملة تناسب الشركات الصغيرة والمتوسطة والكبيرة.",
                  "We're not just a travel agency — we're strategic partners who understand business requirements and deliver comprehensive solutions for enterprises of all sizes."
                )}
              </p>
              <div className="space-y-8">
                {valueProps.map((prop, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={whyReveal.visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                      <prop.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-foreground text-lg mb-2 ${fontHead}`}>
                        {isAr ? prop.titleAr : prop.titleEn}
                      </h3>
                      <p className={`text-muted-foreground text-base leading-relaxed ${fontBody}`}>
                        {isAr ? prop.descAr : prop.descEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID ────────────────────────────────────────────────── */}
      <section ref={servicesReveal.ref} className="py-24 bg-white border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-accent" />
                <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                  {t("خدماتنا", "Our Services")}
                </span>
              </div>
              <h2 className={`text-3xl lg:text-4xl font-bold text-foreground mb-4 ${fontHead}`}>
                {t("حلول سفر شاملة لعملك", "Comprehensive Travel Solutions")}
              </h2>
              <p className={`text-muted-foreground text-lg ${fontBody}`}>
                {t(
                  "من تذاكر الطيران إلى تنظيم المؤتمرات الكبرى — نغطي كل احتياجات سفرك المؤسسي",
                  "From flight tickets to major conference planning — we cover all your corporate travel needs"
                )}
              </p>
            </div>
            <Link
              to="/services"
              className={`hidden md:inline-flex items-center gap-2 bg-secondary hover:bg-primary text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 ${fontBody}`}
            >
              {t("عرض جميع الخدمات", "View All Services")}
              <ChevronRight className={`w-4 h-4 rtl:rotate-180`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesReveal.visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group block relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={service.cover_image_url}
                    alt={isAr ? service.name_ar : service.name_en}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-90" />
                  <div className="absolute inset-0 border border-white/10 group-hover:border-accent rounded-3xl transition-all duration-300" />

                  <div className="absolute bottom-0 inset-x-0 p-8 transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className={`text-white font-bold text-2xl mb-2 ${fontHead}`}>
                      {isAr ? service.name_ar : service.name_en}
                    </h3>
                    <p className={`text-white/70 text-sm mb-4 leading-relaxed line-clamp-2 ${fontBody}`}>
                      {isAr ? service.short_description_ar : service.short_description_en}
                    </p>
                    <div className="flex items-center gap-2 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={fontBody}>{t("اعرف المزيد", "Learn more")}</span>
                      <ArrowRight className={`w-4 h-4 rtl:-scale-x-100`} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/services"
              className={`inline-flex items-center gap-2 bg-secondary hover:bg-primary text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 w-full justify-center ${fontBody}`}
            >
              {t("عرض جميع الخدمات", "View All Services")}
              <ChevronRight className={`w-5 h-5 rtl:rotate-180`} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CORPORATE SOLUTIONS ──────────────────────────────────────────── */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--color-yahala-accent) 0, var(--color-yahala-accent) 1px, transparent 0, transparent 30px)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-wider uppercase font-en-body">
                {t("حلول مؤسسية", "Corporate Solutions")}
              </span>
              <div className="w-8 h-0.5 bg-accent" />
            </div>
            <h2 className={`text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight ${fontHead}`}>
              {t("باقات متكاملة تناسب حجم أعمالك", "Integrated Packages for Every Business Size")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {[
              {
                icon: Building2,
                titleAr: "الشركات الصغيرة",
                titleEn: "Small Business",
                descAr: "باقات مرنة تناسب احتياجات الشركات الناشئة والصغيرة.",
                descEn: "Flexible packages tailored for startups and small businesses.",
                features: [t("حجوزات مرنة", "Flexible bookings"), t("أسعار تنافسية", "Competitive pricing"), t("دعم متخصص", "Dedicated support")],
              },
              {
                icon: Globe,
                titleAr: "الشركات المتوسطة",
                titleEn: "Corporate",
                descAr: "إدارة سفر شاملة مع مدير حساب ونظام حجز ذكي.",
                descEn: "Comprehensive travel management with an account manager.",
                features: [t("مدير حساب مخصص", "Dedicated account manager"), t("نظام حجز متكامل", "Integrated booking system"), t("تقارير مفصلة", "Detailed reports")],
                featured: true,
              },
              {
                icon: Award,
                titleAr: "الشركات الكبيرة",
                titleEn: "Enterprise",
                descAr: "حلول مخصصة للمؤسسات الكبرى والجهات الحكومية.",
                descEn: "Custom solutions for large institutions and government.",
                features: [t("حلول مخصصة", "Custom solutions"), t("اتفاقية SLA مضمونة", "Guaranteed SLA"), t("تكامل مع الأنظمة", "System integration")],
              },
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-3xl p-8 lg:p-10 transition-all duration-300 relative ${
                  tier.featured
                    ? "bg-primary border border-accent/40 shadow-2xl shadow-primary/40 transform md:-translate-y-4 z-10"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                {tier.featured && (
                  <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                    <span className={`bg-accent text-secondary text-sm font-bold px-6 py-1.5 rounded-full shadow-lg ${fontBody}`}>
                      {t("الأكثر طلباً", "Most Popular")}
                    </span>
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${tier.featured ? "bg-white/10" : "bg-primary/30"}`}>
                  <tier.icon className={`w-8 h-8 ${tier.featured ? "text-accent" : "text-primary"}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-4 text-white ${fontHead}`}>
                  {isAr ? tier.titleAr : tier.titleEn}
                </h3>
                <p className={`text-base leading-relaxed mb-8 min-h-[60px] ${tier.featured ? "text-white/90" : "text-white/60"} ${fontBody}`}>
                  {isAr ? tier.descAr : tier.descEn}
                </p>
                <ul className="space-y-4 mb-10">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 shrink-0 ${tier.featured ? "text-accent" : "text-primary"}`} />
                      <span className={`text-base ${tier.featured ? "text-white" : "text-white/70"} ${fontBody}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/quote"
                  className={`flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full transition-all duration-300 text-base w-full ${
                    tier.featured
                      ? "bg-accent text-white hover:bg-[#b8943d]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  } ${fontBody}`}
                >
                  {t("تواصل معنا", "Get in Touch")}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAYMENT METHODS ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-bold text-foreground mb-3 ${fontHead}`}>
              {t("طرق الدفع المعتمدة", "Accepted Payment Methods")}
            </h2>
            <p className={`text-muted-foreground text-sm ${fontBody}`}>
              {t("جميع المدفوعات آمنة ومشفرة", "All payments are secure and encrypted")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {[
              { key: "visa", labelAr: "فيزا", labelEn: "Visa", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/visa.svg" },
              { key: "mastercard", labelAr: "ماستركارد", labelEn: "Mastercard", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/mastercard.svg" },
              { key: "mada", labelAr: "مدى", labelEn: "Mada", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/mada.svg" },
              { key: "apple-pay", labelAr: "Apple Pay", labelEn: "Apple Pay", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/apple-pay.svg" },
              { key: "stc-pay", labelAr: "STC Pay", labelEn: "STC Pay", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/stc-pay.svg" },
              { key: "bank-transfer", labelAr: "تحويل بنكي", labelEn: "Bank Transfer", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/bank-transfer.svg" },
              { key: "moyasar", labelAr: "ميسر", labelEn: "Moyasar", src: "https://cdn.jsdelivr.net/gh/eltawalbeh/YaHalaWebsite@2e7e08380b1c40d4cbafe34a2f7911e457129cbb/public/payment-methods/moyasar.svg" },
            ].map((method) => (
              <div key={method.key} className="bg-background border border-border rounded-xl px-6 py-4 flex items-center justify-center min-w-[168px] hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <img
                  src={method.src}
                  alt={isAr ? method.labelAr : method.labelEn}
                  className="h-10 w-[120px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}