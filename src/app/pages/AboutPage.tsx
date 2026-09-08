import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, Target, Eye, Heart, Lightbulb, Scale, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import LogoHFull from "../../imports/LogoHFull";
import LogoVFull from "../../imports/LogoVFull";

const ABOUT_HERO = "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80";
const ABOUT_IMG2 = "https://images.unsplash.com/photo-1649542929388-1d42db0b5cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80";
const CORPORATE_IMG = "https://images.unsplash.com/photo-1714601344981-75e003bc5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80";

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

export default function AboutPage() {
  const { t, isAr } = useLanguage();
  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const statsReveal = useScrollReveal();
  const valuesReveal = useScrollReveal();

  const values = [
    { icon: ShieldCheck, titleAr: "الجودة", titleEn: "Quality", descAr: "نلتزم بتقديم أعلى معايير الجودة في جميع خدماتنا", descEn: "We commit to the highest quality standards in all our services" },
    { icon: Scale, titleAr: "النزاهة", titleEn: "Integrity", descAr: "نتعامل بشفافية وأمانة تامة مع جميع عملائنا وشركائنا", descEn: "We operate with full transparency and honesty with all clients" },
    { icon: Eye, titleAr: "الشفافية", titleEn: "Transparency", descAr: "أسعار واضحة وتواصل صريح بدون رسوم خفية", descEn: "Clear pricing and direct communication with no hidden fees" },
    { icon: Target, titleAr: "التنوع", titleEn: "Diversity", descAr: "نخدم جميع القطاعات: الحكومي، الخاص، والدبلوماسي", descEn: "We serve all sectors: government, private, and diplomatic" },
    { icon: Lightbulb, titleAr: "الابتكار", titleEn: "Innovation", descAr: "نستخدم أحدث التقنيات لتقديم حلول سفر مبتكرة ومتطورة", descEn: "We use the latest technologies to deliver innovative travel solutions" },
  ];

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={ABOUT_HERO} alt="About Ya Hala" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--color-yahala-accent) 0, var(--color-yahala-accent) 1px, transparent 0, transparent 40px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6 font-en-body tracking-wide">
              <Link to="/" className="hover:text-accent transition-colors">{t("الرئيسية", "Home")}</Link>
              <ChevronRight className={`w-4 h-4 rtl:rotate-180`} />
              <span className="text-white font-medium">{t("من نحن", "About Us")}</span>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 ${fontHead}`}>
              {t("من نحن", "About Us")}
            </h1>
            <p className={`text-white/80 max-w-xl text-lg leading-relaxed ${fontBody}`}>
              {t("نحن شركاء سفرك الإستراتيجيون في تقديم حلول سفر متكاملة للشركات والمؤسسات.", "We are your strategic travel partners providing comprehensive corporate travel solutions.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: isAr ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={isAr ? "lg:order-2" : ""}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-accent" />
                <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                  {t("قصتنا", "Our Story")}
                </span>
              </div>
              <h2 className={`text-3xl lg:text-5xl font-bold text-foreground mb-8 leading-tight ${fontHead}`}>
                {t("يا هلا — أكثر من مجرد وكالة سفر", "Ya Hala — More Than a Travel Agency")}
              </h2>
              <div className={`space-y-6 text-muted-foreground text-lg leading-relaxed ${fontBody}`}>
                <p>
                  {t(
                    "تأسست شركة يا هلا للسفر والسياحة في الرياض، المملكة العربية السعودية، بهدف تقديم خدمات سفر مؤسسية متكاملة تلبي احتياجات الشركات والمؤسسات الحكومية والبعثات الدبلوماسية في منطقة الخليج.",
                    "Ya Hala Travel & Tourism was founded in Riyadh, Saudi Arabia, with the goal of providing comprehensive corporate travel services that meet the needs of companies, government institutions, and diplomatic missions across the Gulf region."
                  )}
                </p>
                <p>
                  {t(
                    "بخبرة تتجاوز 20 عاماً، أصبحنا الشريك الموثوق لأكثر من 500 شركة ومؤسسة في المملكة العربية السعودية والخليج، مقدمين حلولاً شاملة تشمل تذاكر الطيران وحجوزات الفنادق وتنظيم الفعاليات والمؤتمرات والطيران الخاص وخدمات التأشيرات والتأمين.",
                    "With over 20 years of experience, we have become the trusted partner for more than 500 companies and institutions in Saudi Arabia and the Gulf, providing comprehensive solutions including flight tickets, hotel reservations, event and conference organization, private aviation, and visa and insurance services."
                  )}
                </p>
              </div>
              <div className="mt-10 flex gap-4">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex-1 text-center">
                  <div className={`text-3xl font-bold text-primary mb-2 ${fontHead}`}>20+</div>
                  <div className={`text-sm text-muted-foreground ${fontBody}`}>{t("سنة خبرة", "Years Experience")}</div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex-1 text-center">
                  <div className={`text-3xl font-bold text-primary mb-2 ${fontHead}`}>500+</div>
                  <div className={`text-sm text-muted-foreground ${fontBody}`}>{t("عميل مؤسسي", "Corporate Clients")}</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isAr ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`relative ${isAr ? "lg:order-1" : ""}`}
            >
              <div className="relative h-[350px] md:h-[480px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img src={CORPORATE_IMG} alt="Corporate Travel" className="w-full h-full object-cover" />
                <div className="absolute inset-0 border border-white/20 rounded-3xl" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-8 rtl:-right-8 ltr:-left-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -top-8 rtl:-left-8 ltr:-right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-secondary text-white rounded-3xl p-10 lg:p-14 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <h3 className={`text-3xl font-bold mb-6 ${fontHead}`}>{t("رؤيتنا", "Our Vision")}</h3>
                <p className={`text-white/80 text-lg leading-relaxed ${fontBody}`}>
                  {t(
                    "أن نكون الشركة الرائدة الأولى في تقديم حلول السفر والسياحة المؤسسية في المملكة العربية السعودية والشرق الأوسط، وأن نضع معايير جديدة للتميز والابتكار في هذا القطاع.",
                    "To be the premier leader in providing corporate travel and tourism solutions in Saudi Arabia and the Middle East, setting new standards for excellence and innovation in the sector."
                  )}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary text-white rounded-3xl p-10 lg:p-14 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                  <Target className="w-8 h-8 text-accent" />
                </div>
                <h3 className={`text-3xl font-bold mb-6 ${fontHead}`}>{t("مهمتنا", "Our Mission")}</h3>
                <p className={`text-white/80 text-lg leading-relaxed ${fontBody}`}>
                  {t(
                    "تقديم خدمات سفر متكاملة ومصممة خصيصاً لتلبية احتياجات عملائنا من الشركات والمؤسسات، مع التركيز على الجودة، الموثوقية، والقيمة المضافة، من خلال فريق عمل محترف وشراكات استراتيجية عالمية.",
                    "To provide comprehensive travel services tailored to meet the needs of our corporate clients, focusing on quality, reliability, and added value, through a professional team and global strategic partnerships."
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Identity */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
              {t("هويتنا البصرية", "Brand Identity")}
            </span>
            <div className="w-8 h-0.5 bg-accent" />
          </div>

          <div className="bg-[#F8F7F4] rounded-3xl p-10 lg:p-16 flex items-center justify-center border border-border">
            {/* Desktop: full horizontal logo at its native pixel dimensions */}
            <div className="hidden md:block">
              <div className="relative w-[768px] h-[86px]">
                <LogoHFull />
              </div>
            </div>

            {/* Mobile: vertical logo */}
            <div className="block md:hidden">
              <div className="relative h-[140px] w-[250px]">
                <LogoVFull />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesReveal.ref} className="py-24 bg-card border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-accent" />
              <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                {t("قيمنا", "Our Values")}
              </span>
              <div className="w-8 h-0.5 bg-accent" />
            </div>
            <h2 className={`text-3xl lg:text-4xl font-bold text-foreground mb-6 ${fontHead}`}>
              {t("المبادئ التي تقودنا", "The Principles That Guide Us")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesReveal.visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-border hover:border-primary/30 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 mx-auto bg-primary/5 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                  <v.icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className={`text-xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {isAr ? v.titleAr : v.titleEn}
                </h3>
                <p className={`text-muted-foreground text-sm leading-relaxed ${fontBody}`}>
                  {isAr ? v.descAr : v.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}