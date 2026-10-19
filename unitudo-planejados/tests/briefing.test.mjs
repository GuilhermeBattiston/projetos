import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  initialBriefing,
  validateBriefing,
  buildBriefing,
  fieldStep,
} from "../src/utils/briefing.ts";
import { environments, needs, styles, gallery } from "../src/content.ts";
import { company, mapSearch } from "../src/config.ts";
const values = {
  ...initialBriefing,
  environment: "cozinha",
  need: "organizar",
  style: "natural",
  name: " Ana & João ",
  location: " Curitiba — PR ",
  measurements: " 2,80 × 3 m ",
  notes: "Armários & prateleiras.\nReferência: tons claros?",
};
test("empty fields and whitespace cannot generate a briefing", () => {
  assert.deepEqual(
    Object.keys(
      validateBriefing({ ...initialBriefing, name: " ", location: "\n" }),
    ),
    ["environment", "need", "style", "name", "location"],
  );
  assert.throws(() => buildBriefing(initialBriefing));
});
test("each step checks its own required values and final review checks all values", () => {
  assert.deepEqual(Object.keys(validateBriefing(initialBriefing, 0)), [
    "environment",
  ]);
  assert.deepEqual(Object.keys(validateBriefing(initialBriefing, 1)), ["need"]);
  assert.deepEqual(Object.keys(validateBriefing(initialBriefing, 2)), [
    "style",
  ]);
  assert.deepEqual(Object.keys(validateBriefing(initialBriefing, 3)), [
    "name",
    "location",
  ]);
  assert.equal(fieldStep("location"), 3);
  assert.equal(fieldStep("environment"), 0);
});
test("unknown selection values are rejected", () => {
  for (const field of ["environment", "need", "style"]) {
    assert.ok(validateBriefing({ ...values, [field]: "unknown" })[field]);
    assert.throws(() => buildBriefing({ ...values, [field]: "unknown" }));
  }
});
test("all selectable options map to their actual Portuguese label", () => {
  for (const [field, choices, label] of [
    ["environment", environments, "Ambiente"],
    ["need", needs, "Necessidade"],
    ["style", styles, "Estilo"],
  ])
    for (const item of choices)
      assert.ok(
        buildBriefing({ ...values, [field]: item.id }).message.includes(
          `${label}: ${item.label}`,
        ),
      );
});
test("WhatsApp message preserves accents, newlines, measurements and special characters in one query value", () => {
  const { message, url } = buildBriefing(values);
  const link = new URL(url);
  assert.equal(link.origin, "https://wa.me");
  assert.equal(link.pathname, "/5541995935907");
  assert.equal(link.searchParams.get("text"), message);
  assert.equal([...link.searchParams.keys()].length, 1);
  assert.ok(message.includes("Nome: Ana & João\nAmbiente: Cozinha"));
  assert.ok(message.includes("Medidas: 2,80 × 3 m"));
  assert.ok(
    message.includes("Armários & prateleiras.\nReferência: tons claros?"),
  );
});
test("optional fields use honest fallbacks", () => {
  const { message } = buildBriefing({
    ...values,
    notes: " ",
    measurements: "",
  });
  assert.ok(message.includes("Medidas: Ainda não informadas"));
  assert.ok(
    message.includes("Observações: Prefiro conversar sobre os detalhes."),
  );
});
test("provided contacts stay intact and Maps is explicitly an address search", () => {
  assert.equal(company.phone, "5541995935907");
  assert.equal(
    company.instagram,
    "https://www.instagram.com/unitudo.planejados/",
  );
  const url = new URL(mapSearch);
  assert.equal(url.pathname, "/maps/search/");
  assert.equal(
    url.searchParams.get("query"),
    "Rua Olivio Domingos Leonardi, 89, Curitiba, PR",
  );
  assert.ok(!url.searchParams.has("cid"));
});
test("gallery references have local images and illustration descriptions", () => {
  for (const item of gallery) {
    assert.ok(
      existsSync(
        new URL(`../public/images/${item.image}.webp`, import.meta.url),
      ),
    );
    assert.match(item.alt, /ilustrativ/);
  }
  assert.ok(
    existsSync(new URL("../public/images/fallback.svg", import.meta.url)),
  );
});
test("Unitudo is registered for the authorized portal release", () => {
  const builds = JSON.parse(
    readFileSync(new URL("../../webforge/prototypes.json", import.meta.url)),
  );
  const accounts = JSON.parse(
    readFileSync(new URL("../../webforge/pages/access.json", import.meta.url)),
  );
  assert.equal(
    builds.find((item) => item.slug === "unitudo-planejados").source,
    "unitudo-planejados",
  );
  assert.equal(accounts.filter((item) => item.project === "unitudo-planejados").length, 1);
  assert.equal(accounts.find((item) => item.project === "unitudo-planejados").username, "unitudo");
});
