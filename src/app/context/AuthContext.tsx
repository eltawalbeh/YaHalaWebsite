import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabase: SupabaseClient = createClient(supabaseUrl, publicAnonKey);

interface AuthContextType {
  token: string | null;
  adminEmail: string | null;
  adminName: string | null;
  adminRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  adminEmail: null,
  adminName: null,
  adminRole: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({}),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        setAdminEmail(session.user.email || null);
        setAdminName(session.user.user_metadata?.name || null);
        setAdminRole(session.user.user_metadata?.role || null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setAdminEmail(session.user.email || null);
        setAdminName(session.user.user_metadata?.name || null);
        setAdminRole(session.user.user_metadata?.role || null);
      } else {
        setToken(null);
        setAdminEmail(null);
        setAdminName(null);
        setAdminRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          // Try to create the user via setup (first-time super admin provisioning)
          try {
            const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d8dd152e/auth/setup`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${publicAnonKey}` },
              body: JSON.stringify({ email, password, name: "Super Admin" }),
            });
            const setupData = await res.json();
            if (setupData.success) {
              // Newly created — retry login
              const retry = await supabase.auth.signInWithPassword({ email, password });
              if (retry.error) return { error: retry.error.message };
              return {};
            }
            // If exists:true the password is simply wrong
          } catch (e) {
            // Network or parse error — fall through to original error
          }
        }
        return { error: error.message };
      }
      return {};
    } catch (e: any) {
      return { error: e.message || "Network error. Please try again." };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        adminEmail,
        adminName,
        adminRole,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);