// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVariant } from "../src/normalize-variant.js";

test("default variant is 'default'", () => {
  assert.equal(normalizeVariant(null), "default");
});

test("variant 'outlined' is preserved", () => {
  assert.equal(normalizeVariant("outlined"), "outlined");
});

test("variant 'elevated' is preserved", () => {
  assert.equal(normalizeVariant("elevated"), "elevated");
});
