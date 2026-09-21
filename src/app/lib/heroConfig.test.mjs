import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const config = await readFile(new URL("./heroConfig.ts", import.meta.url), "utf8");
const home = await readFile(new URL("../pages/HomePage.tsx", import.meta.url), "utf8");
const eventHero = await readFile(new URL("../components/EventHero.tsx", import.meta.url), "utf8");

test("event hero configuration is date-bounded and falls back to video", () => {
  assert.match(config, /2026-09-18T00:00:00\+03:00/);
  assert.match(config, /2026-09-26T00:00:00\+03:00/);
  assert.match(config, /timestamp >= startsAt && timestamp < endsAt/);
  assert.match(home, /getActiveHeroMode\(\) === "event"/);
  assert.match(home, /<EventHero \/> : <VideoHero \/>/);
});

test("event hero uses local fallback video assets and the approved email CTA", () => {
  assert.match(eventHero, /\/events\/saudind-hero\.webm/);
  assert.match(eventHero, /\/events\/saudind-hero\.mp4/);
  assert.match(eventHero, /info@yahala\.co/);
  assert.match(eventHero, /عزنا في طبعنا/);
  assert.match(eventHero, /Our Pride Lies in Our Nature/);
});
