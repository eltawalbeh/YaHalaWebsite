export default function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
      <span className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}
