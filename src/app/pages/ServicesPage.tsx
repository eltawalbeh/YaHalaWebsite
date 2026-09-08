import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";
import { servicesCache } from "../lib/servicesCache";
import { defaultServices } from "../content/services";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SERVICES_HERO = "https://images.unsplash.com/photo-1769945967065-ec805ecc7e6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80";


// ─── ServiceLink: top-level component (NOT inside ServicesPage) ────────────────
// Defined here so React never recreates it on ServicesPage re-renders.
// • external_url set  → opens the external URL in a new tab immediately (no internal navigation)
// • external_url unset → React Router Link to the internal service detail page
function ServiceLink({
  service,
  className,
  children,
}: {
  service: any;
  className: string;
  children: React.ReactNode;
}) {
  if (service.external_url) {
    return (
      <a
        href={service.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={`/services/${service.slug}`} className={className}>
      {children}
    </Link>
  );
}

export default function ServicesPage() {
  const { t, isAr } = useLanguage();
  const [services, setServices] = useState(defaultServices as any[]);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  useEffect(() => {
    api.getServices().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        // ── Populate the module-level cache so ServiceDetailPage can
        //    redirect synchronously without a second API round-trip ──
        data.forEach((s: any) => servicesCache.set(s.slug, s));
        setServices(data);
      }
    }).catch(() => {});
  }, []);

  const activeServices = services.filter((s: any) => s.is_active !== false);
  const featuredServices = activeServices.filter((s: any) => s.is_featured);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    rtl: isAr,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={SERVICES_HERO} alt="Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[2px]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, var(--color-yahala-accent) 0, var(--color-yahala-accent) 1px, transparent 0, transparent 40px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6 font-en-body tracking-wide">
              <Link to="/" className="hover:text-accent transition-colors">{t("الرئيسية", "Home")}</Link>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              <span className="text-white font-medium">{t("خدماتنا", "Services")}</span>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 ${fontHead}`}>
              {t("خدماتنا", "Our Services")}
            </h1>
            <p className={`text-white/80 max-w-xl text-lg leading-relaxed ${fontBody}`}>
              {t("حلول سفر شاملة ومتكاملة تناسب احتياجات شركتك بمعايير عالمية", "Comprehensive travel solutions tailored to your company's needs with global standards")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Services Carousel */}
      {featuredServices.length > 0 && (
        <section className="py-20 bg-background border-b border-border overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-accent" />
                <span className="text-primary text-sm font-semibold tracking-wider uppercase font-en-body">
                  {t("الخدمات المميزة", "Featured Services")}
                </span>
              </div>
              <h2 className={`text-3xl font-bold text-foreground ${fontHead}`}>
                {t("الأكثر طلباً", "Most Popular")}
              </h2>
            </div>

            <div className="mx-[-10px] slick-custom-dots">
              <Slider {...sliderSettings}>
                {featuredServices.map((service: any) => (
                  <div key={service.id} className="px-[10px] pb-10">
                    <ServiceLink
                      service={service}
                      className="group block relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <img
                        src={service.cover_image_url}
                        alt={isAr ? service.name_ar : service.name_en}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                      <div className="absolute top-6 rtl:right-6 ltr:left-6">
                        <span className={`bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg ${fontBody}`}>
                          {t("مميز", "Featured")}
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-8">
                        <h3 className={`text-white font-bold text-2xl mb-3 ${fontHead}`}>
                          {isAr ? service.name_ar : service.name_en}
                        </h3>
                        <p className={`text-white/80 text-sm mb-4 leading-relaxed line-clamp-2 ${fontBody}`}>
                          {isAr ? service.short_description_ar : service.short_description_en}
                        </p>
                        <div className="flex items-center gap-2 text-accent text-sm font-semibold">
                          <span className={fontBody}>{t("عرض التفاصيل", "View Details")}</span>
                          <ArrowRight className="w-4 h-4 rtl:-scale-x-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </ServiceLink>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>
      )}

      {/* All Services Grid */}
      <section className="py-24 bg-card">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className={`text-3xl font-bold text-foreground mb-4 ${fontHead}`}>
              {t("جميع الخدمات", "All Services")}
            </h2>
            <p className={`text-muted-foreground ${fontBody}`}>
              {t("نقدم مجموعة واسعة من الخدمات المصممة لتلبية كافة متطلباتك المحددة", "We offer a wide range of services designed to meet all your specific requirements")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {activeServices.map((service: any, i: number) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
              >
                <ServiceLink
                  service={service}
                  className="group flex flex-col bg-background rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 h-full"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img
                      src={service.cover_image_url}
                      alt={isAr ? service.name_ar : service.name_en}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className={`text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${fontHead}`}>
                      {isAr ? service.name_ar : service.name_en}
                    </h3>
                    <p className={`text-muted-foreground text-sm leading-relaxed mb-6 flex-1 ${fontBody}`}>
                      {isAr ? service.short_description_ar : service.short_description_en}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:text-accent transition-colors mt-auto">
                      <span className={`text-sm ${fontBody}`}>{t("المزيد", "More")}</span>
                      <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                    </div>
                  </div>
                </ServiceLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS overrides for slick dots */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slick-custom-dots .slick-dots li button:before {
            color: var(--color-yahala-primary);
            opacity: 0.25;
            font-size: 10px;
          }
          .slick-custom-dots .slick-dots li.slick-active button:before {
            color: var(--color-yahala-accent);
            opacity: 1;
          }
        `,
      }} />
    </div>
  );
}
