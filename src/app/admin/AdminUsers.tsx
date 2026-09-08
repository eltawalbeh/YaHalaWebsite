import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserCog, Plus, Trash2, Shield, User, Crown,
  Mail, Calendar, X, Eye, EyeOff, AlertCircle, CheckCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { adminApi } from "../lib/api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "moderator";
  created_at: string;
  last_sign_in_at?: string;
}

export default function AdminUsers() {
  const { token, adminRole, adminEmail } = useAuth();
  const { t, isAr } = useLanguage();
  const fontHead = isAr ? "font-ar-head" : "font-en-head";
  const fontBody = isAr ? "font-ar-body" : "font-en-body";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "moderator" });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminApi.getAdminUsers(token);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      showToast(e.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [token]);

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.name) {
      showToast(isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.createAdminUser(token!, form);
      showToast(isAr ? "تم إنشاء المستخدم بنجاح" : "User created successfully");
      setShowModal(false);
      setForm({ name: "", email: "", password: "", role: "moderator" });
      loadUsers();
    } catch (e: any) {
      showToast(e.message || "Failed to create user", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteAdminUser(token!, id);
      showToast(isAr ? "تم حذف المستخدم" : "User deleted");
      setDeleteConfirm(null);
      loadUsers();
    } catch (e: any) {
      showToast(e.message || "Failed to delete user", "error");
    }
  };

  const roleLabel = (role: string) =>
    role === "super_admin"
      ? isAr ? "مدير عام" : "Super Admin"
      : isAr ? "مشرف" : "Moderator";

  const roleBadge = (role: string) =>
    role === "super_admin"
      ? "bg-accent/15 text-amber-600 border-amber-300/40"
      : "bg-primary/10 text-primary border-primary/20";

  const isSuperAdmin = adminRole === "super_admin";

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Shield className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h2 className={`text-xl font-bold text-foreground mb-2 ${fontHead}`}>
          {isAr ? "غير مصرح" : "Access Restricted"}
        </h2>
        <p className={`text-muted-foreground ${fontBody}`}>
          {isAr ? "هذه الصفحة متاحة للمدير العام فقط." : "This page is only accessible to Super Admins."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto sm:w-96 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border font-en-body text-sm ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span className="flex-1">{toast.msg}</span>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold text-foreground ${fontHead}`}>
            {isAr ? "إدارة المستخدمين والأدوار" : "Users & Roles"}
          </h1>
          <p className={`text-muted-foreground text-sm mt-1 ${fontBody}`}>
            {isAr ? "إدارة حسابات المديرين والمشرفين" : "Manage admin accounts and permissions"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm ${fontBody}`}
        >
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة مستخدم" : "Add User"}
        </button>
      </div>

      {/* Role Legend */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            icon: Crown,
            role: "super_admin",
            titleAr: "المدير العام (Super Admin)",
            titleEn: "Super Admin",
            descAr: "وصول كامل لجميع الصفحات وإدارة المستخدمين",
            descEn: "Full access to all pages including user management",
            color: "border-amber-300/40 bg-amber-50/50",
            iconColor: "text-amber-500",
          },
          {
            icon: User,
            role: "moderator",
            titleAr: "المشرف (Moderator)",
            titleEn: "Moderator",
            descAr: "إدارة المحتوى فقط — لا يمكنه إدارة المستخدمين",
            descEn: "Content management only — cannot manage users",
            color: "border-primary/20 bg-primary/5",
            iconColor: "text-primary",
          },
        ].map((item) => (
          <div key={item.role} className={`flex items-start gap-4 p-5 rounded-2xl border ${item.color}`}>
            <div className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm`}>
              <item.icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <div>
              <div className={`font-bold text-foreground mb-1 ${fontBody}`}>
                {isAr ? item.titleAr : item.titleEn}
              </div>
              <div className={`text-muted-foreground text-sm ${fontBody}`}>
                {isAr ? item.descAr : item.descEn}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className={`px-6 py-4 border-b border-border flex items-center gap-3 ${fontHead}`}>
          <UserCog className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground text-lg">
            {isAr ? `المستخدمون (${users.length})` : `All Users (${users.length})`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <User className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className={fontBody}>{isAr ? "لا يوجد مستخدمون" : "No users found"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {[
                    isAr ? "الاسم" : "Name",
                    isAr ? "البريد الإلكتروني" : "Email",
                    isAr ? "الدور" : "Role",
                    isAr ? "تاريخ الإنشاء" : "Created",
                    isAr ? "الإجراءات" : "Actions",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`px-6 py-3.5 text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider ${fontBody}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                          user.role === "super_admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-semibold text-foreground text-sm ${fontBody}`}>
                          {user.name || "—"}
                          {user.email === adminEmail && (
                            <span className="ms-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-en-body">
                              {isAr ? "أنت" : "You"}
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-sm font-en-body">{user.email}</span>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${roleBadge(user.role)} font-en-body`}
                      >
                        {user.role === "super_admin" ? (
                          <Crown className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    {/* Created */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-en-body">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {new Date(user.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      {user.email !== adminEmail ? (
                        deleteConfirm === user.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className={`text-xs bg-destructive text-white px-3 py-1.5 rounded-lg hover:bg-destructive/90 transition-colors font-semibold ${fontBody}`}
                            >
                              {isAr ? "تأكيد الحذف" : "Confirm"}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className={`text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted/80 transition-colors ${fontBody}`}
                            >
                              {isAr ? "إلغاء" : "Cancel"}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                            title={isAr ? "حذف المستخدم" : "Delete user"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      ) : (
                        <span className={`text-xs text-muted-foreground/50 ${fontBody}`}>—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold text-foreground ${fontHead}`}>
                  {isAr ? "إضافة مستخدم جديد" : "Add New User"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "الاسم الكامل" : "Full Name"} *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                    placeholder={isAr ? "الاسم الكامل" : "Full Name"}
                  />
                </div>
                {/* Email */}
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "البريد الإلكتروني" : "Email Address"} *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-en-body`}
                    placeholder="user@yahala.co"
                    dir="ltr"
                  />
                </div>
                {/* Password */}
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "كلمة المرور" : "Password"} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className={`w-full bg-background border border-border rounded-xl px-4 py-3 pe-11 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-en-body`}
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {/* Role */}
                <div>
                  <label className={`block text-sm font-semibold text-foreground mb-2 ${fontBody}`}>
                    {isAr ? "الدور الوظيفي" : "Role"}
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className={`w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${fontBody}`}
                  >
                    <option value="moderator">{isAr ? "مشرف (Moderator)" : "Moderator"}</option>
                    <option value="super_admin">{isAr ? "مدير عام (Super Admin)" : "Super Admin"}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className={`flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${fontBody}`}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {isAr ? "إنشاء المستخدم" : "Create User"}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`px-6 py-3 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors ${fontBody}`}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
