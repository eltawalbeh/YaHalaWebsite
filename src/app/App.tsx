import React, { Component, ReactNode } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { reportError } from "./lib/errorMonitoring";
import { AnalyticsConsent } from "./components/AnalyticsConsent";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportError(error);
    console.error("App ErrorBoundary caught:", error.name, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D0F1A", color: "white", fontFamily: "sans-serif", padding: "2rem", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Something went wrong</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", maxWidth: "400px", textAlign: "center" }}>An unexpected error occurred. Please try again</div>
          <button
            onClick={() => this.setState({ hasError: false, error: "" })}
            style={{ marginTop: "1rem", padding: "0.5rem 1.5rem", background: "#005F6B", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <AnalyticsConsent />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}