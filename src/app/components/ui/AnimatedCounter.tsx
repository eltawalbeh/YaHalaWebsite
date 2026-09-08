import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const numericPart = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericPart * 10) / 10;
            setDisplayed(current % 1 === 0 ? current.toFixed(0) : current.toFixed(1));
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplayed(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated, numericPart]);

  if (numericPart === 0) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {hasAnimated ? displayed : "0"}
      {hasAnimated ? "" : suffix}
    </span>
  );
}
