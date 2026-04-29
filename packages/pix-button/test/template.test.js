// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVariant } from "../src/normalize-variant.js";

test("default variant is primary", () => {
  assert.equal(normalizeVariant(null), "primary");
});

test("variant 'secondary' is preserved", () => {
  assert.equal(normalizeVariant("secondary"), "secondary");
});

test("variant 'ghost' is preserved", () => {
  assert.equal(normalizeVariant("ghost"), "ghost");
});
