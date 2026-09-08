import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { denyAnalyticsConsent, grantAnalyticsConsent } from "../lib/analytics";

const CONSENT_KEY = "yahala.analytics_consent";

export function AnalyticsConsent() {
  const { isAr } = useLanguage();
  const [visible, setVisible] = useState(() => {
    try {
      return window.localStorage.getItem(CONSENT_KEY) === null;
    } catch {
      return false;
    }
  });

  if (!visible) return null;

  const choose = (accepted: boolean) => {
    if (accepted) grantAnalyticsConsent();
    else denyAnalyticsConsent();
    setVisible(false);
  };

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      aria-label={isAr ? "خيارات تحليلات الموقع" : "Website analytics choices"}
      className="fixed bottom-4 inset-x-4 z-[100] mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#171a2b] p-5 text-white shadow-2xl"
    >
      <h2 className="mb-2 text-base font-bold">{isAr ? "تحليلات الموقع" : "Website analytics"}</h2>
      <p className="text-sm leading-6 text-white/80">
        {isAr
          ? "نستخدم تحليلات مجهّلة لتحسين الخدمات ونماذج الطلب. لا نرسل بيانات الاتصال أو تفاصيل الطلب إلى Google Analytics."
          : "We use anonymized analytics to improve services and request forms. Contact details and request details are never sent to Google Analytics."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose(true)} className="rounded-lg bg-[#c9a548] px-4 py-2 text-sm font-semibold text-[#171a2b]">
          {isAr ? "السماح بالتحليلات" : "Allow analytics"}
        </button>
        <button type="button" onClick={() => choose(false)} className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white">
          {isAr ? "رفض" : "Decline"}
        </button>
      </div>
    </section>
  );
}
