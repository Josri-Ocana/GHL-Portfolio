import test from "node:test";
import assert from "node:assert/strict";
import { returnPosition } from "../src/lib/navigationScroll";

test("scroll restoration accepts matching entries including section offsets", () => {
  const entry = { url: "/", x: 0, y: 14000, section: 4, offset: 1200 };
  assert.deepEqual(returnPosition(entry, "/"), entry);
  assert.deepEqual(returnPosition({ url: "/work?category=CRM", x: 0, y: 840 }, "/work?category=CRM"), { url: "/work?category=CRM", x: 0, y: 840 });
});

test("scroll restoration ignores older, stale or malformed history metadata", () => {
  for (const value of [undefined, null, {}, { url: "/", x: 0, y: NaN }, { url: "/", x: 0, y: -1 }, { url: "/", x: Infinity, y: 4 }, { url: "/", x: 0, y: 10, section: 1.5, offset: 0 }, { url: "/", x: 0, y: 10, section: 1 }]) {
    assert.equal(returnPosition(value, "/"), null);
  }
  assert.equal(returnPosition({ url: "/work?category=CRM", x: 0, y: 840 }, "/work"), null);
});
