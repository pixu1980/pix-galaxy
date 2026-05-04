// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeVariant } from "../src/components/PixButton/pix-button.utils.js";

test("normalizeVariant returns 'primary' for null", () => {
  assert.equal(normalizeVariant(null), "primary");
});

test("normalizeVariant returns 'primary' for undefined", () => {
  assert.equal(normalizeVariant(undefined), "primary");
});

test("normalizeVariant returns 'primary' for empty string", () => {
  assert.equal(normalizeVariant(""), "primary");
});

test("normalizeVariant returns 'primary' for unknown value", () => {
  assert.equal(normalizeVariant("danger"), "primary");
});

test("normalizeVariant returns 'secondary' for 'secondary'", () => {
  assert.equal(normalizeVariant("secondary"), "secondary");
});

test("normalizeVariant returns 'ghost' for 'ghost'", () => {
  assert.equal(normalizeVariant("ghost"), "ghost");
});

test("normalizeVariant returns 'primary' for 'PRIMARY' (case-sensitive)", () => {
  assert.equal(normalizeVariant("PRIMARY"), "primary");
});