import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function TermsPage() {
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
            <span className="text-white font-medium">{t("الشروط والأحكام", "Terms and Conditions")}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${fontHead}`}>
              {t("الشروط والأحكام", "Terms and Conditions")}
            </h1>
            <p className={`text-white/80 text-lg max-w-2xl ${fontBody}`}>
              {t(
                "يرجى قراءة هذه الشروط بعناية قبل استخدام خدمات يا هلا للسفر والسياحة.",
                "Please read these terms carefully before using Ya Hala Travel & Tourism services."
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
              {t("آخر تحديث: 11 مارس 2026", "Last Updated: March 11, 2026")}
            </p>

            <div className="space-y-12">
              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("1. قبول الشروط", "1. Acceptance of Terms")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "باستخدامك لموقع وخدمات يا هلا للسفر والسياحة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك استخدام خدماتنا.",
                    "By accessing and using Ya Hala Travel & Tourism's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our services."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("2. تقديم الخدمات", "2. Provision of Services")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t(
                    "نحن نقدم حلول سفر متكاملة للشركات تشمل ولا تقتصر على: حجز رحلات الطيران، الإقامة، المواصلات البرية، وتنظيم الفعاليات (MICE). جميع الخدمات تخضع للتوفر وشروط مزودي الخدمة التابعين لنا.",
                    "We provide comprehensive corporate travel solutions including but not limited to: flight bookings, accommodation, ground transportation, and MICE. All services are subject to availability and the terms of our third-party service providers."
                  )}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:ml-0 rtl:mr-4">
                  <li>{t("يجب تقديم طلبات الأسعار من خلال القنوات الرسمية أو عبر الموقع الإلكتروني.", "Quote requests must be submitted through official channels or the website.")}</li>
                  <li>{t("عروض الأسعار صالحة للفترة المحددة في العرض فقط.", "Quotes are valid only for the period specified in the document.")}</li>
                  <li>{t("الأسعار قابلة للتغيير بناءً على أسعار الصرف أو توفر المقاعد/الغرف قبل تأكيد الحجز النهائي.", "Prices are subject to change based on exchange rates or availability before final booking confirmation.")}</li>
                </ul>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("3. الدفع والإلغاء والاسترجاع", "3. Payment, Cancellation, and Refunds")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t(
                    "تخضع سياسات الدفع والإلغاء للشروط الخاصة بكل خدمة محجوزة. يجب دفع الرسوم بالكامل أو حسب ما يتم الاتفاق عليه في عقد الشركة.",
                    "Payment and cancellation policies are subject to the specific terms of each booked service. Fees must be paid in full or as agreed upon in the corporate contract."
                  )}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:ml-0 rtl:mr-4">
                  <li>{t("تطبق رسوم الإلغاء الخاصة بشركات الطيران والفنادق.", "Airline and hotel cancellation fees apply.")}</li>
                  <li>{t("تستغرق عملية الاسترجاع (إن وجدت) من 14 إلى 30 يوم عمل.", "Refund processing (if applicable) takes 14 to 30 business days.")}</li>
                </ul>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("4. حدود المسؤولية", "4. Limitation of Liability")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "يا هلا للسفر والسياحة تعمل كوكيل لمزودي الخدمات ولا تتحمل أي مسؤولية عن أي تأخير، أو إلغاء، أو أضرار تنتج عن أفعال أو أخطاء هؤلاء المزودين (مثل شركات الطيران أو الفنادق).",
                    "Ya Hala Travel & Tourism acts as an agent for service providers and assumes no liability for any delay, cancellation, or damages resulting from the actions or omissions of these providers (such as airlines or hotels)."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("5. القوة القاهرة", "5. Force Majeure")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "لا نتحمل المسؤولية عن أي إخفاق أو تأخير في تنفيذ التزاماتنا إذا كان ذلك ناتجاً عن أحداث خارجة عن إرادتنا المعقولة (مثل الكوارث الطبيعية، الحروب، الإضرابات، أو التغيرات في القوانين الحكومية).",
                    "We are not liable for any failure or delay in performing our obligations if such failure or delay is caused by events beyond our reasonable control (e.g., natural disasters, wars, strikes, or changes in government laws)."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("6. القانون المطبق", "6. Governing Law")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين المملكة العربية السعودية. وأي نزاع ينشأ عن أو يتعلق بهذه الشروط سيكون خاضعاً للاختصاص القضائي الحصري لمحاكم المملكة العربية السعودية.",
                    "These terms and conditions are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the Saudi courts."
                  )}
                </p>
              </div>

              <div>
                <h2 className={`text-2xl font-bold text-foreground mb-4 ${fontHead}`}>
                  {t("7. التعديلات على الشروط", "7. Changes to Terms")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تحديث تاريخ المراجعة. استمرارك في استخدام الموقع بعد نشر التعديلات يعني قبولك لها.",
                    "We reserve the right to modify these terms and conditions at any time. Changes will be posted on this page with an updated revision date. Your continued use of the site following the posting of changes constitutes your acceptance."
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
