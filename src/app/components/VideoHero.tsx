import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const HERO_VIDEO = "https://cdn.sceneai.art/Hero%20Section%20Video/01d1f8de-fec0-4bf5-8b48-9fc2dbc8c6b0.mp4";
const HERO_POSTER = "https://images.unsplash.com/photo-1714601344981-75e003bc5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80";

export default function VideoHero() {
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
        poster={HERO_POSTER}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" aria-hidden="true" />
      <div className="absolute inset-0 bg-secondary/20" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl"
        >
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="mb-5 text-sm font-medium tracking-[0.18em] text-white/90 uppercase"
          >
            Ya Hala Travel &amp; Tourism
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className={`text-[38px] font-medium leading-[1.1] tracking-tight text-white sm:text-[56px] ${isAr ? "font-ar-head" : "font-en-head"}`}
          >
            {isAr ? (
              <>
                سافروا حول العالم
                <br />
                بلا عناء
              </>
            ) : (
              <>
                Travel the World
                <br />
                Without Any Stress
              </>
            )}
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.6 }}
            className={`mx-auto mt-6 max-w-2xl text-[15px] leading-7 text-white/80 sm:text-[18px] ${isAr ? "font-ar-body" : "font-en-body"}`}
          >
            {t(
              "دعوا التخطيط علينا واستمتعوا بتجارب سفر ذات معنى مصممة خصيصاً لكم.",
              "Let us take care of the planning while you enjoy meaningful travel experiences crafted just for you."
            )}
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/services"
              className={`rounded-full bg-white px-[26px] py-3 text-[15px] font-medium text-black shadow-lg shadow-black/20 transition-transform hover:scale-105 hover:shadow-xl ${isAr ? "font-ar-body" : "font-en-body"}`}
            >
              {t("ابدأ الاستكشاف", "Start Exploring")}
            </Link>
            <Link
              to="/quote"
              className={`rounded-full border border-white/80 bg-white/5 px-6 py-3 text-[15px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black ${isAr ? "font-ar-body" : "font-en-body"}`}
            >
              {t("طلب عرض أسعار", "Request a Quote")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
