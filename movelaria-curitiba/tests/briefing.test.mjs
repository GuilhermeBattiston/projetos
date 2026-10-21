import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  initialValues,
  validate,
  buildBriefing,
  stepOf,
} from "../src/utils/briefing.ts";
import {
  environments,
  projectTypes,
  priorities,
  gallery,
} from "../src/content.ts";
const valid = () => ({
  ...initialValues,
  environment: "cozinha",
  type: "novo",
  priorities: ["organizacao", "estetica"],
  name: " Ana ",
  location: " Curitiba / Água Verde ",
  description: "Armário & painel.\nReferência: madeira.",
});
test("empty and whitespace fields cannot pass review or create a WhatsApp link", () => {
  assert.equal(Object.keys(validate(initialValues)).length, 6);
  assert.throws(() => buildBriefing(initialValues));
  for (const name of ["name", "location", "description"])
    assert.ok(validate({ ...valid(), [name]: " " })[name]);
});
test("steps validate only their fields, final review validates all fields", () => {
  assert.deepEqual(Object.keys(validate(initialValues, 0)), ["environment"]);
  assert.deepEqual(Object.keys(validate(initialValues, 1)), ["type"]);
  assert.deepEqual(Object.keys(validate(initialValues, 2)), ["priorities"]);
  assert.deepEqual(Object.keys(validate(initialValues, 3)), [
    "name",
    "location",
    "description",
  ]);
  assert.deepEqual(validate(valid()), {});
});
test("unknown category, type and priorities cannot be sent", () => {
  for (const [field, value] of [
    ["environment", "unknown"],
    ["type", "unknown"],
    ["priorities", ["unknown"]],
    ["priorities", []],
  ])
    assert.ok(validate({ ...valid(), [field]: value })[field]);
});
test("all choices produce correct Portuguese labels", () => {
  for (const environment of environments)
    for (const type of projectTypes) {
      const text = buildBriefing({
        ...valid(),
        environment: environment.id,
        type: type.id,
      }).message;
      assert.ok(text.includes(`Ambiente: ${environment.label}`));
      assert.ok(text.includes(`Tipo de projeto: ${type.label}`));
    }
  for (const priority of priorities)
    assert.ok(
      buildBriefing({ ...valid(), priorities: [priority.id] }).message.includes(
        `Prioridades: ${priority.label}`,
      ),
    );
});
test("multiple priorities remain in deterministic content order without duplicates", () => {
  const text = buildBriefing({
    ...valid(),
    priorities: ["personalizacao", "espaco", "espaco"],
  }).message;
  assert.ok(
    text.includes("Prioridades: Aproveitamento de espaço, Personalização"),
  );
});
test("WhatsApp is correctly encoded with accents, newlines and special characters", () => {
  const { url, message } = buildBriefing({
    ...valid(),
    measurements: "2,80 × 3 m + 1%",
  });
  const parsed = new URL(url);
  assert.equal(parsed.origin, "https://wa.me");
  assert.equal(parsed.pathname, "/5541996152584");
  assert.equal([...parsed.searchParams].length, 1);
  assert.equal(parsed.searchParams.get("text"), message);
  assert.ok(message.includes("Nome: Ana\n"));
  assert.ok(message.includes("2,80 × 3 m + 1%"));
  assert.ok(message.includes("Armário & painel.\nReferência: madeira."));
});
test("optional measurements use an honest fallback and invalid field maps to correct step", () => {
  assert.ok(
    buildBriefing(valid()).message.includes("Medidas: Ainda não informadas"),
  );
  assert.deepEqual(
    [
      "environment",
      "type",
      "priorities",
      "name",
      "location",
      "description",
    ].map(stepOf),
    [0, 1, 2, 3, 3, 3],
  );
});
test("gallery has unique references and local assets with illustrative alt text", () => {
  assert.equal(new Set(gallery.map((x) => x.image)).size, gallery.length);
  for (const item of gallery) {
    assert.match(item.alt, /ilustrativ/);
    assert.ok(
      existsSync(
        new URL(`../public/images/${item.image}.webp`, import.meta.url),
      ),
    );
  }
  assert.ok(
    existsSync(new URL("../public/images/fallback.svg", import.meta.url)),
  );
});
test("authorized portal release has a single registered account", () => {
  const registry = JSON.parse(
    readFileSync(new URL("../../webforge/prototypes.json", import.meta.url)),
  );
  const accounts = JSON.parse(
    readFileSync(new URL("../../webforge/pages/access.json", import.meta.url)),
  );
  assert.equal(
    registry.find((x) => x.slug === "movelaria-curitiba").source,
    "movelaria-curitiba",
  );
  assert.equal(accounts.filter((x) => x.project === "movelaria-curitiba").length, 1);
  assert.equal(accounts.find((x) => x.project === "movelaria-curitiba").username, "movelaria");
});
