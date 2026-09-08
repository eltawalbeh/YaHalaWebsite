import { Link } from "react-router";
import { Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import LogoVFull from "../../../imports/LogoVFull";

export default function Footer() {
  const { t, isAr } = useLanguage();

  const services = [
    { slug: "flights", ar: "تذاكر الطيران", en: "Flight Tickets" },
    { slug: "hotels", ar: "حجوزات الفنادق", en: "Hotel Reservations" },
    { slug: "mice", ar: "المؤتمرات والفعاليات", en: "MICE" },
    { slug: "vip", ar: "الطيران الخاص", en: "VIP & Private Flights" },
    { slug: "visa-insurance", ar: "التأشيرات والتأمين", en: "Visa & Insurance" },
    { slug: "corporate", ar: "حلول الأعمال", en: "Business Solutions" },
  ];

  const quickLinks = [
    { href: "/", ar: "الرئيسية", en: "Home" },
    { href: "/about", ar: "من نحن", en: "About Us" },
    { href: "/services", ar: "خدماتنا", en: "Services" },
    { href: "/partners", ar: "شركاؤنا", en: "Partners" },
    { href: "/contact", ar: "تواصل معنا", en: "Contact" },
    { href: "/quote", ar: "طلب عرض أسعار", en: "Request a Quote" },
  ];

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  return (
    <footer className="bg-secondary text-white border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:pe-8">
            <Link to="/" className="inline-block mb-6">
              <div
                className="relative h-[112px] w-[200px]"
                style={{ '--fill-0': 'white' } as React.CSSProperties}
              >
                <LogoVFull />
              </div>
            </Link>
            <p className={`text-white/60 text-sm leading-relaxed mb-8 ${fontBody}`}>
              {t(
                "شريككم الموثوق في تقديم حلول السفر المتكاملة للشركات والمؤسسات في المملكة العربية السعودية والخليج.",
                "Your trusted partner in comprehensive travel solutions for corporations and institutions across Saudi Arabia and the Gulf."
              )}
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-accent hover:bg-white/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-white font-bold text-base mb-6 relative inline-block ${fontHead}`}>
              {t("روابط سريعة", "Quick Links")}
              <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-accent/50 rounded-full" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-white/60 hover:text-accent hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all text-sm ${fontBody}`}
                  >
                    {isAr ? link.ar : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-white font-bold text-base mb-6 relative inline-block ${fontHead}`}>
              {t("خدماتنا", "Our Services")}
              <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-accent/50 rounded-full" />
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className={`text-white/60 hover:text-accent hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all text-sm ${fontBody}`}
                  >
                    {isAr ? service.ar : service.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-white font-bold text-base mb-6 relative inline-block ${fontHead}`}>
              {t("معلومات التواصل", "Contact Info")}
              <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-accent/50 rounded-full" />
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-white/60 group">
                <MapPin className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="https://maps.app.goo.gl/KYNWNJeQP3qMQ65t7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm leading-relaxed hover:text-accent transition-colors ${fontBody}`}
                >
                  {t("الرياض، المملكة العربية السعودية", "Riyadh, Saudi Arabia")}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 group">
                <Phone className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-en-body tracking-wide" dir="ltr">
                  +966 11 26 33 000
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/60 group">
                <Mail className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:info@yahala.co" className="text-sm font-en-body hover:text-accent transition-colors">
                  info@yahala.co
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 group">
                <Globe className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-en-body">
                  www.yahala.co
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={`text-white/50 text-sm ${fontBody}`}>
              <p>
                {t("© 2026 يا هلا للسفر والسياحة. جميع الحقوق محفوظة.", "© 2026 Ya Hala Travel & Tourism. All rights reserved.")}
              </p>
              <p className="mt-2 text-xs leading-relaxed" dir={isAr ? "rtl" : "ltr"}>
                {t(
                  "شركة ياهلا للسفر والسياحة شخص واحد س.ت. (1010878990) ترخيص (73104278)",
                  "Ya Hala Travel & Tourism C.R. (1010878990) T.R. (73104278)"
                )}
              </p>
            </div>
            <div className={`flex items-center gap-6 text-sm text-white/50 ${fontBody}`}>
              <Link to="/privacy" className="hover:text-white transition-colors">
                {t("سياسة الخصوصية", "Privacy Policy")}
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                {t("الشروط والأحكام", "Terms of Service")}
              </Link>
              <Link to="/admin" className="hover:text-white transition-colors">
                {t("دخول الإدارة", "Admin Login")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}