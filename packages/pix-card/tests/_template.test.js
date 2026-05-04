// @ts-check
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("pix-card uses the shared decorator architecture", async () => {
  const componentJs = await readFile(new URL("../src/components/PixCard/pix-card.js", import.meta.url), "utf8");
  const templateJs = await readFile(new URL("../src/components/PixCard/pix-card.template.js", import.meta.url), "utf8");

  assert.match(componentJs, /static styles = styles/);
  assert.match(componentJs, /componentDecorator\(this\)/);
  assert.match(componentJs, /partitionSlotNodes/);
  assert.doesNotMatch(componentJs, /attachShadow|shadowRoot|<template>/);
  assert.match(templateJs, /new TemplateEngine\(/);
  assert.match(templateJs, /HEADER_PART/);
  assert.match(templateJs, /FOOTER_PART/);
});
