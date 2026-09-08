import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronRight, ExternalLink, Search } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../lib/api";

const PARTNERS_HERO = "https://images.unsplash.com/photo-1771147372627-7fffe86cf00b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80";

const defaultPartners = [
  { id: "ptn-1", name_en: "Al Naifat", name_ar: "النيفات", category: "corporate", is_featured: true },
  { id: "ptn-2", name_en: "CCC by STC", name_ar: "CCC بواسطة STC", category: "corporate", is_featured: true },
  { id: "ptn-3", name_en: "Mira Food Group", name_ar: "مجموعة ميرا للأغذية", category: "corporate", is_featured: true },
  { id: "ptn-4", name_en: "Ansaldua Logistics", name_ar: "أنسالدوا لوجستيك", category: "logistics", is_featured: true },
  { id: "ptn-5", name_en: "Shadid Insurance", name_ar: "شديد للتأمين", category: "corporate", is_featured: false },
  { id: "ptn-6", name_en: "Al Akkad Holding", name_ar: "العقاد القابضة", category: "corporate", is_featured: true },
  { id: "ptn-7", name_en: "Abanmi Investment", name_ar: "أبانمي للاستثمار", category: "corporate", is_featured: false },
  { id: "ptn-8", name_en: "Ghad Medical Colleges", name_ar: "كليات الغد الطبية", category: "education", is_featured: true },
  { id: "ptn-9", name_en: "Atlas Pharmaceutical", name_ar: "أطلس للأدوية", category: "medical", is_featured: true },
  { id: "ptn-10", name_en: "Gulf Systems (Al Hoshan)", name_ar: "أنظمة الخليج", category: "corporate", is_featured: false },
  { id: "ptn-11", name_en: "Italian Embassy", name_ar: "السفارة الإيطالية", category: "embassy", is_featured: true },
  { id: "ptn-12", name_en: "KACST", name_ar: "مدينة الملك عبدالعزيز للعلوم", category: "government", is_featured: true },
  { id: "ptn-13", name_en: "Embassy of South Africa", name_ar: "سفارة جنوب أفريقيا", category: "embassy", is_featured: false },
  { id: "ptn-14", name_en: "Embassy of Tanzania", name_ar: "سفارة تنزانيا", category: "embassy", is_featured: false },
  { id: "ptn-15", name_en: "Mellor Entertainment", name_ar: "ميلور للترفيه", category: "corporate", is_featured: false },
  { id: "ptn-16", name_en: "Jerash Pharmaceuticals", name_ar: "جرش للأدوية", category: "medical", is_featured: false },
  { id: "ptn-17", name_en: "Areic Holding", name_ar: "أريك القابضة", category: "corporate", is_featured: false },
  { id: "ptn-18", name_en: "Digital Cooperation Organization (DCO)", name_ar: "منظمة التعاون الرقمي", category: "government", is_featured: true },
  { id: "ptn-19", name_en: "Ministry of Agriculture (Aquaculture)", name_ar: "وزارة الزراعة", category: "government", is_featured: false },
  { id: "ptn-20", name_en: "Accolade Livestock GCC", name_ar: "أكولاد للثروة الحيوانية", category: "corporate", is_featured: false },
];

const categoryColors: Record<string, string> = {
  government: "bg-blue-100 text-blue-800",
  corporate: "bg-teal-100 text-teal-800",
  medical: "bg-red-100 text-red-800",
  logistics: "bg-orange-100 text-orange-800",
  embassy: "bg-purple-100 text-purple-800",
  education: "bg-green-100 text-green-800",
  other: "bg-gray-100 text-gray-800",
};

const categoryLabels: Record<string, { ar: string; en: string }> = {
  government: { ar: "حكومي", en: "Government" },
  corporate: { ar: "مؤسسي", en: "Corporate" },
  medical: { ar: "طبي", en: "Medical" },
  logistics: { ar: "لوجستي", en: "Logistics" },
  embassy: { ar: "سفارات", en: "Embassies" },
  education: { ar: "تعليمي", en: "Education" },
  other: { ar: "أخرى", en: "Other" },
};

export default function PartnersPage() {
  const { t, isAr } = useLanguage();
  const [partners, setPartners] = useState(defaultPartners);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  useEffect(() => {
    api.getPartners().then((data) => {
      if (Array.isArray(data) && data.length > 0) setPartners(data);
    }).catch(() => {});
  }, []);

  const categories = ["all", "government", "corporate", "medical", "logistics", "embassy", "education"];

  const filteredPartners = partners.filter((p: any) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery ||
      p.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_ar?.includes(searchQuery);
    return matchCat && matchSearch && p.is_active !== false;
  });

  const getInitials = (nameEn: string, nameAr: string) => {
    const name = isAr ? nameAr : nameEn;
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  const getCategoryColor = (category: string) =>
    categoryColors[category] || categoryColors.other;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-80 sm:h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={PARTNERS_HERO} alt="Partners" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1A1A2E]/70" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className={`flex items-center gap-2 text-white/50 text-sm mb-4 ${fontBody}`}>
            <Link to="/" className="hover:text-white transition-colors">{t("الرئيسية", "Home")}</Link>
            <ChevronRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
            <span className="text-white">{t("شركاؤنا", "Partners")}</span>
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold text-white ${fontHead}`}>
            {t("شركاؤنا في النجاح", "Our Partners in Success")}
          </h1>
          <p className={`text-white/70 mt-3 max-w-xl ${fontBody}`}>
            {t("نفخر بشراكاتنا مع أكثر من 20 مؤسسة حكومية وخاصة وسفارة", "We are proud of our partnerships with over 20 government, private, and diplomatic institutions")}
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-10 bg-white sticky top-20 z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${fontBody} ${
                    activeCategory === cat
                      ? "bg-[#005F6B] text-white"
                      : "bg-[#F8F7F4] text-[#6B7280] hover:bg-[#005F6B]/10"
                  }`}
                >
                  {cat === "all" ? t("الكل", "All") : isAr ? categoryLabels[cat]?.ar : categoryLabels[cat]?.en}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("بحث عن شريك...", "Search partner...")}
                className={`ps-9 pe-4 py-2.5 bg-[#F8F7F4] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005F6B] w-full sm:w-64 ${fontBody}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-[#6B7280] ${fontBody}`}>
                {t("لا توجد نتائج", "No results found")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPartners.map((partner: any, i) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 5) * 0.05 }}
                  onClick={() => setSelectedPartner(partner)}
                  className="bg-white rounded-2xl p-5 text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#005F6B]/20"
                >
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={partner.name_en}
                      className="w-16 h-16 object-contain mx-auto mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#005F6B]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className={`text-[#005F6B] font-bold text-lg font-en-body`}>
                        {getInitials(partner.name_en, partner.name_ar)}
                      </span>
                    </div>
                  )}
                  <div className={`font-semibold text-[#1A1A2E] text-sm leading-tight mb-2 ${fontBody}`}>
                    {isAr ? partner.name_ar : partner.name_en}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium font-en-body ${getCategoryColor(partner.category)}`}>
                    {isAr ? categoryLabels[partner.category]?.ar : categoryLabels[partner.category]?.en}
                  </span>
                  {partner.is_featured && (
                    <div className="mt-2">
                      <span className={`text-xs text-[#C9A84C] font-medium ${fontBody}`}>★ {t("شريك مميز", "Featured")}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedPartner(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              {selectedPartner.logo_url ? (
                <img src={selectedPartner.logo_url} alt={selectedPartner.name_en} className="w-20 h-20 object-contain mx-auto mb-4" />
              ) : (
                <div className="w-20 h-20 bg-[#005F6B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className={`text-[#005F6B] font-bold text-2xl font-en-body`}>
                    {getInitials(selectedPartner.name_en, selectedPartner.name_ar)}
                  </span>
                </div>
              )}
              <h3 className={`text-xl font-bold text-[#1A1A2E] mb-1 ${fontHead}`}>
                {isAr ? selectedPartner.name_ar : selectedPartner.name_en}
              </h3>
              <span className={`text-xs px-3 py-1 rounded-full font-medium font-en-body ${getCategoryColor(selectedPartner.category)}`}>
                {isAr ? categoryLabels[selectedPartner.category]?.ar : categoryLabels[selectedPartner.category]?.en}
              </span>
            </div>
            {(selectedPartner.description_ar || selectedPartner.description_en) && (
              <p className={`text-[#6B7280] text-sm leading-relaxed mb-6 text-center ${fontBody}`}>
                {isAr ? selectedPartner.description_ar : selectedPartner.description_en}
              </p>
            )}
            <div className="flex gap-3">
              {selectedPartner.website_url && (
                <a
                  href={selectedPartner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 bg-[#005F6B] text-white py-3 rounded-xl text-sm font-medium ${fontBody}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("زيارة الموقع", "Visit Website")}
                </a>
              )}
              <button
                onClick={() => setSelectedPartner(null)}
                className={`flex-1 bg-[#F8F7F4] text-[#6B7280] py-3 rounded-xl text-sm font-medium ${fontBody}`}
              >
                {t("إغلاق", "Close")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}