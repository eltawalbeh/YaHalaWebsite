import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const home = await readFile(new URL("../pages/HomePage.tsx", import.meta.url), "utf8");
const names = ["visa", "mastercard", "mada", "apple-pay", "stc-pay", "bank-transfer", "moyasar"];

test("homepage payment methods render seven consistent logo assets", async () => {
  assert.equal((home.match(/src: "/g) || []).filter(Boolean).length >= 7, true);
  for (const name of names) {
    assert.match(home, new RegExp(`/payment-methods/${name}\\.svg`));
    const svg = await readFile(new URL(`../../../public/payment-methods/${name}.svg`, import.meta.url), "utf8");
    assert.match(svg, /viewBox="0 0 240 80"/);
  }
  assert.match(home, /h-10 w-\[120px\] object-contain/);
  assert.match(home, /min-w-\[168px\]/);
});