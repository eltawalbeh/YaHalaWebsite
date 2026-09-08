import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useForm } from "react-hook-form";
import LogoMini from "../../imports/LogoMini";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { t, isAr } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated, navigate]);

  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const onSubmit = async (data: any) => {
    setError("");
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    if (result.error) {
      setError(isAr ? "بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى." : result.error);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 40px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#005F6B]/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div
              className="relative h-[56px] w-[136px]"
              style={{ "--fill-0": "white" } as React.CSSProperties}
            >
              <LogoMini />
            </div>
          </div>
          <h1 className={`text-2xl font-bold text-white mb-1 ${fontHead}`}>
            {t("لوحة التحكم", "Admin Dashboard")}
          </h1>
          <p className={`text-white/40 text-sm ${fontBody}`}>
            {t("تسجيل الدخول للمتابعة", "Sign in to continue")}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#13162A]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-400 text-sm ${fontBody}`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium text-white/60 mb-2 ${fontBody}`}>
                {t("البريد الإلكتروني", "Email Address")}
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#005F6B] focus:ring-2 focus:ring-[#005F6B]/20 transition-all text-sm font-en-body`}
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium text-white/60 mb-2 ${fontBody}`}>
                {t("كلمة المرور", "Password")}
              </label>
              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#005F6B] focus:ring-2 focus:ring-[#005F6B]/20 transition-all text-sm pe-12 font-en-body`}
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-3 flex items-center text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#005F6B] hover:bg-[#004d57] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#005F6B]/20 hover:shadow-[#005F6B]/40 ${fontBody}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t("تسجيل الدخول", "Sign In")}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className={`text-center text-white/20 text-xs mt-6 ${fontBody}`}>
          Ya Hala Travel & Tourism © 2026
        </p>
      </motion.div>
    </div>
  );
}
