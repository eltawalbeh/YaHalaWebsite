import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const EVENT_MP4 = "/events/saudind-hero.mp4";
const EVENT_WEBM = "/events/saudind-hero.webm";
const EVENT_EMAIL = "info@yahala.co";

export default function EventHero() {
  const { t, isAr } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-secondary pt-20">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={EVENT_WEBM} type="video/webm" />
        <source src={EVENT_MP4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/55" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl"
        >
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="mb-5 text-sm font-medium tracking-[0.18em] text-white/90 uppercase"
          >
            {t("18–25 سبتمبر 2026", "18–25 September 2026")}
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className={`text-[38px] font-medium leading-[1.1] tracking-tight text-white sm:text-[56px] ${isAr ? "font-ar-head" : "font-en-head"}`}
          >
            {t("عزنا في طبعنا", "Our Pride Lies in Our Nature")}
          </motion.h1>
          <motion.a
            href={`mailto:${EVENT_EMAIL}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.6 }}
            className={`mt-9 inline-flex rounded-full bg-white px-[26px] py-3 text-[15px] font-medium text-black shadow-lg shadow-black/20 transition-transform hover:scale-105 hover:shadow-xl ${isAr ? "font-ar-body" : "font-en-body"}`}
          >
            {t("عزنا في طبعنا", "Our Pride Lies in Our Nature")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
