// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVariant } from "../src/components/PixCard/pix-card.utils.js";

test("normalizeVariant returns 'default' for null", () => {
  assert.equal(normalizeVariant(null), "default");
});

test("normalizeVariant returns 'default' for undefined", () => {
  assert.equal(normalizeVariant(undefined), "default");
});

test("normalizeVariant returns 'default' for empty string", () => {
  assert.equal(normalizeVariant(""), "default");
});

test("normalizeVariant returns 'default' for unknown value", () => {
  assert.equal(normalizeVariant("primary"), "default");
});

test("normalizeVariant returns 'outlined' for 'outlined'", () => {
  assert.equal(normalizeVariant("outlined"), "outlined");
});

test("normalizeVariant returns 'elevated' for 'elevated'", () => {
  assert.equal(normalizeVariant("elevated"), "elevated");
});

test("normalizeVariant returns 'default' for 'DEFAULT' (case-sensitive)", () => {
  assert.equal(normalizeVariant("DEFAULT"), "default");
});
