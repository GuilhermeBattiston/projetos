import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  initialPreferences,
  validatePreferences,
  buildPreferences,
} from "../src/utils/preferences.js";
import { layouts, styles, priorities, references } from "../src/content.js";
import { company } from "../src/config.js";
const values = {
  layout: "l",
  style: "natural",
  priority: "armazenamento",
  location: " Centro, Curitiba ",
  name: " Ana & João ",
  description: "Armários & espaço para café.\nUma referência: tons naturais?",
};
test("empty and whitespace-only preferences cannot prepare a message", () => {
  assert.deepEqual(
    Object.keys(
      validatePreferences({ ...initialPreferences, name: " ", location: "\n" }),
    ),
    ["layout", "style", "priority", "location", "name"],
  );
  assert.throws(() => buildPreferences(initialPreferences));
});
test("steps validate only their own required choices", () => {
  assert.deepEqual(Object.keys(validatePreferences(initialPreferences, 0)), [
    "layout",
    "style",
  ]);
  assert.deepEqual(Object.keys(validatePreferences(initialPreferences, 1)), [
    "priority",
    "location",
  ]);
  assert.deepEqual(Object.keys(validatePreferences(initialPreferences, 2)), [
    "name",
  ]);
});
test("unrecognized choices are rejected, rather than passed as official categories", () => {
  for (const field of ["layout", "style", "priority"]) {
    assert.ok(validatePreferences({ ...values, [field]: "unknown" })[field]);
    assert.throws(() => buildPreferences({ ...values, [field]: "unknown" }));
  }
});
test("message preserves accents, line breaks and special characters in one encoded query value", () => {
  const { message, url } = buildPreferences(values);
  const link = new URL(url);
  assert.equal(link.origin, "https://wa.me");
  assert.equal(link.pathname, "/5541984172689");
  assert.equal(link.searchParams.get("text"), message);
  assert.equal([...link.searchParams.keys()].length, 1);
  assert.ok(
    message.includes(
      "Nome: Ana & João\nTipo de cozinha: Em L\nEstilo: Natural",
    ),
  );
  assert.ok(message.includes("Localização: Centro, Curitiba"));
  assert.ok(
    message.includes("espaço para café.\nUma referência: tons naturais?"),
  );
});
test("all selectable labels are mapped correctly and unknown layout is an honest valid choice", () => {
  for (const [field, choices, label] of [
    ["layout", layouts, "Tipo de cozinha"],
    ["style", styles, "Estilo"],
    ["priority", priorities, "Prioridade"],
  ])
    for (const choice of choices)
      assert.ok(
        buildPreferences({ ...values, [field]: choice.id }).message.includes(
          `${label}: ${choice.label}`,
        ),
      );
});
test("optional observations have a clear fallback without inventing project details", () => {
  assert.ok(
    buildPreferences({ ...values, description: " " }).message.endsWith(
      "Observações: Prefiro conversar sobre os detalhes.",
    ),
  );
});
test("gallery presets reference real choices and local illustrative images", () => {
  for (const item of references) {
    assert.ok(layouts.some((choice) => choice.id === item.layout));
    assert.ok(styles.some((choice) => choice.id === item.style));
    assert.ok(
      existsSync(
        new URL(`../public/images/${item.image}.webp`, import.meta.url),
      ),
    );
    assert.match(item.alt, /ilustrativ/);
  }
});
test("source contacts and new portal destination remain intact", () => {
  assert.equal(company.phone, "5541984172689");
  assert.equal(
    new URL(company.maps).searchParams.get("cid"),
    "17027054168084007393",
  );
  const accounts = JSON.parse(
    readFileSync(new URL("../../webforge/pages/access.json", import.meta.url)),
  );
  const registry = JSON.parse(
    readFileSync(new URL("../../webforge/prototypes.json", import.meta.url)),
  );
  const account = accounts.find((item) => item.username === "planejados");
  assert.ok(account);
  assert.ok(
    registry.some(
      (item) =>
        item.slug === account.project && item.source === "planejados-curitiba",
    ),
  );
});
