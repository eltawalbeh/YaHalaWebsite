import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import LogoMini from "../../../imports/LogoMini";

export default function Navbar() {
  const { t, lang, setLang, isAr } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
    { href: "/services", labelAr: "خدماتنا", labelEn: "Services" },
    { href: "/about", labelAr: "من نحن", labelEn: "About" },
    { href: "/partners", labelAr: "شركاؤنا", labelEn: "Partners" },
    { href: "/contact", labelAr: "تواصل معنا", labelEn: "Contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-secondary/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent pt-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <div
                className="relative h-[56px] w-[136px]"
                style={{ '--fill-0': 'white' } as React.CSSProperties}
              >
                <LogoMini />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative group ${
                    isActive(link.href) ? "text-accent" : "text-white/80 hover:text-white"
                  } ${isAr ? "font-ar-body" : "font-en-body"}`}
                >
                  {isAr ? link.labelAr : link.labelEn}
                  <span
                    className={`absolute -bottom-1 inset-x-0 h-0.5 bg-accent transition-transform duration-200 origin-left ${
                      isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
              >
                <Globe className="w-4 h-4" />
                <span className="font-en-body pt-0.5">{lang === "ar" ? "EN" : "AR"}</span>
              </button>
              <Link
                to="/quote"
                className={`bg-accent hover:bg-[#b8943d] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 ${isAr ? "font-ar-body" : "font-en-body"}`}
              >
                {t("طلب عرض أسعار", "Request a Quote")}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-2"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96 border-t border-white/10" : "max-h-0"} bg-secondary/95 backdrop-blur-md`}>
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href) ? "bg-accent/10 text-accent" : "text-white/80 hover:bg-white/5"
                } ${isAr ? "font-ar-body" : "font-en-body"}`}
              >
                {isAr ? link.labelAr : link.labelEn}
              </Link>
            ))}
            <div className="pt-4 flex items-center gap-4 px-4">
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                <span className="font-en-body pt-0.5">{lang === "ar" ? "English" : "العربية"}</span>
              </button>
              <Link
                to="/quote"
                className={`flex-1 text-center bg-accent hover:bg-[#b8943d] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors ${isAr ? "font-ar-body" : "font-en-body"}`}
              >
                {t("طلب عرض أسعار", "Request a Quote")}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}