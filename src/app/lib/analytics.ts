export type PublicEventName = "service_view" | "quote_start" | "quote_submit" | "contact_submit";

type AnalyticsEvent = { name: PublicEventName; metadata: Record<string, string> };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const ANALYTICS_CONSENT_KEY = "yahala.analytics_consent";
const pendingEvents: AnalyticsEvent[] = [];

function readConsent() {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    return null;
  }
}

function emitEvent({ name, metadata }: AnalyticsEvent) {
  const analyticsWindow = window as AnalyticsWindow;
  window.dispatchEvent(new CustomEvent("yahala:analytics", { detail: { name, ...metadata } }));
  if (Array.isArray(analyticsWindow.dataLayer)) analyticsWindow.dataLayer.push({ event: name, ...metadata });
  if (typeof analyticsWindow.gtag === "function") analyticsWindow.gtag("event", name, metadata);
}

function flushPendingEvents() {
  while (pendingEvents.length) emitEvent(pendingEvents.shift()!);
}

export function grantAnalyticsConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, "granted");
  const analyticsWindow = window as AnalyticsWindow;
  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("consent", "update", { analytics_storage: "granted" });
  }
  flushPendingEvents();
}

export function denyAnalyticsConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, "denied");
  pendingEvents.length = 0;
  const analyticsWindow = window as AnalyticsWindow;
  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

/** Ya Hala-only, privacy-safe GA4 boundary. */
export function trackPublicEvent(name: PublicEventName, metadata: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const safeKeys = new Set(["service_slug", "service_count"]);
  const safeMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key, value]) => safeKeys.has(key) && value.length <= 100),
  );
  const event = { name, metadata: safeMetadata };
  const consent = readConsent();
  if (consent === "granted") emitEvent(event);
  else if (consent !== "denied") pendingEvents.push(event);
}
