export type SafeErrorEvent = {
  name: string;
  message: string;
  route: string;
  release: string;
  timestamp: string;
};

function safeMessage(error: Error): string {
  return error.message
    .replace(/https?:\/\/[^\s]+/gi, "[URL]")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[EMAIL]")
    .slice(0, 500);
}

export function buildSafeErrorEvent(error: Error): SafeErrorEvent {
  return {
    name: error.name || "Error",
    message: safeMessage(error),
    route: typeof window === "undefined" ? "server" : window.location.pathname,
    release: "6.0.0-local",
    timestamp: new Date().toISOString(),
  };
}

export function reportError(error: Error): SafeErrorEvent {
  const event = buildSafeErrorEvent(error);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("yahala:error", { detail: event }));
  }
  return event;
}
