export const HERO_MODE = "auto" as const;

export const EVENT_HERO_START = "2026-09-18T00:00:00+03:00";
export const EVENT_HERO_END = "2026-09-26T00:00:00+03:00";

export function getActiveHeroMode(now = new Date()) {
  if (HERO_MODE === "event") return "event" as const;
  if (HERO_MODE === "video") return "video" as const;

  const timestamp = now.getTime();
  const startsAt = new Date(EVENT_HERO_START).getTime();
  const endsAt = new Date(EVENT_HERO_END).getTime();

  return timestamp >= startsAt && timestamp < endsAt ? "event" as const : "video" as const;
}
