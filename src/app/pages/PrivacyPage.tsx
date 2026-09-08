import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPage() {
  const { t, isAr } = useLanguage();
  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  return (
    <div className="bg-background min-h-screen pt-20">
      {/* Header */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6 font-en-body tracking-wide">
            <Link to="/" className="hover:text-accent transition-colors">{t("الرئيسية", "Home")}</Link>
            <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            <span className="text-white font-medium">{t("سياسة الخصوصية", "Privacy Policy")}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${fontHead}`}>
              {t("سياسة الخصوصية", "Privacy Policy")}
            </h1>
            <p className={`text-white/80 text-lg max-w-2xl ${fontBody}`}>
              {t(
                "نحن في يا هلا نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية والمهنية.",
                "At Ya Hala, we value your privacy and are committed to protecting your personal and professional data."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`prose prose-lg dark:prose-invert max-w-none text-foreground ${fontBody}`}
          >
            <p className="text-muted-foreground mb-8">
              {t("تاريخ السريان: 11 مارس 2026", "Effective Date: March 11, 2026")}
            </p>

            <div className="space-y-12">
              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("1. مقدمة", "1. Introduction")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "توضح سياسة الخصوصية هذه كيف تقوم شركة يا هلا للسفر والسياحة بجمع واستخدام وحماية البيانات الشخصية لعملائنا، والزوار، والشركاء التجاريين، بما يتوافق مع أنظمة حماية البيانات المعمول بها في المملكة العربية السعودية.",
                    "This Privacy Policy explains how Ya Hala Travel & Tourism collects, uses, and protects the personal data of our clients, visitors, and business partners, in compliance with applicable data protection regulations in the Kingdom of Saudi Arabia."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("2. البيانات التي نجمعها", "2. Data We Collect")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t(
                    "قد نقوم بجمع الأنواع التالية من المعلومات عند استخدام خدماتنا:",
                    "We may collect the following types of information when you use our services:"
                  )}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:ml-0 rtl:mr-4">
                  <li>{t("معلومات الاتصال: الاسم، رقم الهاتف، عنوان البريد الإلكتروني.", "Contact Information: Name, phone number, email address.")}</li>
                  <li>{t("معلومات الشركات: اسم الشركة، السجل التجاري، تفاصيل الموظفين والركاب.", "Corporate Information: Company name, CR number, employees and passenger details.")}</li>
                  <li>{t("تفاصيل السفر: جوازات السفر، التأشيرات، التفضيلات الخاصة (مثل الوجبات والمقاعد).", "Travel Details: Passports, visas, special preferences (e.g., meals, seating).")}</li>
                  <li>{t("البيانات التقنية: عنوان IP، نوع المتصفح، وسلوك التصفح على موقعنا.", "Technical Data: IP address, browser type, and browsing behavior on our site.")}</li>
                </ul>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("3. كيف نستخدم بياناتك", "3. How We Use Your Data")}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:ml-0 rtl:mr-4">
                  <li>{t("لإتمام وإدارة حجوزات السفر الخاصة بك.", "To process and manage your travel bookings.")}</li>
                  <li>{t("للتواصل معك بشأن طلباتك واستفساراتك وتزويدك بعروض الأسعار.", "To communicate with you regarding requests, inquiries, and provide quotes.")}</li>
                  <li>{t("لتحسين جودة خدماتنا وتجربة المستخدم على منصاتنا.", "To improve the quality of our services and user experience on our platforms.")}</li>
                  <li>{t("للامتثال للمتطلبات القانونية والتنظيمية.", "To comply with legal and regulatory requirements.")}</li>
                </ul>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("4. مشاركة البيانات", "4. Data Sharing")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "نحن لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك بياناتك فقط مع مزودي الخدمات الموثوقين (مثل شركات الطيران، الفنادق، ووكالات التأشيرات) بالقدر اللازم لإتمام الحجوزات والخدمات المطلوبة. كما قد يتم الإفصاح عن البيانات إذا طلب ذلك بموجب القانون.",
                    "We do not sell your personal data to any third parties. We may share your data only with trusted service providers (e.g., airlines, hotels, and visa agencies) strictly to the extent necessary to fulfill your requested bookings and services. Data may also be disclosed if required by law."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("5. أمن البيانات", "5. Data Security")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "نتخذ تدابير أمنية تقنية وتنظيمية صارمة لحماية بياناتك من الوصول غير المصرح به، التعديل، الإفصاح، أو الإتلاف. بياناتك مخزنة في بيئات آمنة وفقاً لمعايير الصناعة.",
                    "We implement strict technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. Your data is stored in secure environments according to industry standards."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("6. حقوقك", "6. Your Rights")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "يحق لك طلب الوصول إلى بياناتك الشخصية، أو تصحيحها، أو حذفها. كما يمكنك سحب موافقتك على استخدام البيانات لأغراض تسويقية في أي وقت من خلال التواصل معنا.",
                    "You have the right to request access to, correction of, or deletion of your personal data. You may also withdraw your consent for marketing uses at any time by contacting us."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("7. اتصل بنا", "7. Contact Us")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني: info@yahala.co",
                    "If you have any questions or concerns regarding this Privacy Policy, please contact us via email at: info@yahala.co"
                  )}
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
