import test from "node:test";
import assert from "node:assert/strict";
import {
  FIRST_PROJECT_HOLD,
  wheelActive,
  wheelProgress,
  wheelRingLabelOpacity,
  wheelScrollUnits,
  wheelTurn,
} from "../src/lib/worksWheel";

test("ring label exits early with exact endpoints and deterministic reverse restoration", () => {
  for (const progress of [0, 0.04, 0.08]) assert.equal(wheelRingLabelOpacity(progress), 1);
  for (const progress of [0.2, 0.49, 0.85, 1, 7]) assert.equal(wheelRingLabelOpacity(progress), 0);
  assert.ok(Math.abs(wheelRingLabelOpacity(0.14) - 0.5) < 1e-10);
  const forward = [0, 0.08, 0.1, 0.14, 0.18, 0.2, 1].map(wheelRingLabelOpacity);
  assert.deepEqual(
    [1, 0.2, 0.18, 0.14, 0.1, 0.08, 0].map(wheelRingLabelOpacity),
    forward.toReversed(),
  );
});

test("01 opens fully and holds before later rotation; mapping is reversible", () => {
  const units = wheelScrollUnits(7);
  for (const travel of [1, 1.1, 1.3, 1 + FIRST_PROJECT_HOLD]) {
    assert.equal(wheelTurn(travel / units, 7), 1);
  }
  for (const turn of [0, 0.5, 1, 1.2, 2, 4, 7]) {
    assert.ok(Math.abs(wheelTurn(wheelProgress(turn, 7), 7) - turn) < 1e-10);
  }
  const forward = Array.from({ length: 101 }, (_, i) => wheelTurn(i / 100, 7));
  assert.deepEqual(
    forward.toReversed(),
    Array.from({ length: 101 }, (_, i) => wheelTurn((100 - i) / 100, 7)),
  );
});

test("selection resists midpoint noise but follows genuine reversal and large jumps", () => {
  let active = 0;
  const states = [0.49, 0.51, 0.48, 0.59, 0.61, 0.51, 0.49, 0.41, 0.39].map((position) => {
    active = wheelActive(position, active, 6);
    return active;
  });
  assert.deepEqual(states, [0, 0, 0, 0, 1, 1, 1, 1, 0]);
  assert.equal(wheelActive(6, 0, 6), 6);
  assert.equal(wheelActive(0, 6, 6), 0);
});
