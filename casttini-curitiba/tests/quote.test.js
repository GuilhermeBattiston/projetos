import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { buildQuote, validateQuote } from "../src/utils/quote.js";
import { company, whatsappUrl } from "../src/config.js";
import { environments, inspirations } from "../src/content.js";
const values = {
  name: "  Ana & João  ",
  environment: "cozinha",
  location: " Batel, Curitiba ",
  description:
    "Armários, bancada e iluminação.\nReferência: madeira & tons claros?",
};
test("empty and whitespace-only fields are invalid", () => {
  assert.deepEqual(
    Object.keys(
      validateQuote({
        name: " ",
        environment: "",
        location: "\n",
        description: " ",
      }),
    ),
    ["name", "environment", "location", "description"],
  );
});
test("unknown environment cannot generate a message", () => {
  assert.ok(validateQuote({ ...values, environment: "unknown" }).environment);
  assert.throws(() => buildQuote({ ...values, environment: "unknown" }));
});
test("message trims fields and preserves accents, line breaks and special characters", () => {
  const { message, url } = buildQuote(values);
  const link = new URL(url);
  assert.equal(link.origin, "https://wa.me");
  assert.equal(link.pathname, "/554130422121");
  assert.equal(link.searchParams.get("text"), message);
  assert.equal([...link.searchParams.keys()].length, 1);
  assert.ok(
    message.includes(
      "Nome: Ana & João\nAmbiente: Cozinhas\nLocalização: Batel, Curitiba\nDescrição: Armários",
    ),
  );
  assert.ok(message.includes("madeira & tons claros?"));
});
test("each configured category has the correct message label", () => {
  for (const item of environments)
    assert.ok(
      buildQuote({ ...values, environment: item.id }).message.includes(
        `Ambiente: ${item.name}`,
      ),
    );
});
test("the supplied phone and Maps destinations remain intact", () => {
  assert.equal(company.phone, "554130422121");
  assert.equal(new URL(whatsappUrl()).pathname, "/554130422121");
  assert.equal(
    new URL(company.maps).searchParams.get("cid"),
    "15415016691241166023",
  );
});
test("each reference has an illustration description and a local image", () => {
  for (const item of [...environments, ...inspirations]) {
    assert.ok(
      existsSync(
        new URL(`../public/images/${item.image}.webp`, import.meta.url),
      ),
    );
    assert.match(item.alt, /ilustrativ/);
  }
});
test("the new presentation account maps to a registered source", () => {
  const registry = JSON.parse(
    readFileSync(new URL("../../webforge/prototypes.json", import.meta.url)),
  );
  const accounts = JSON.parse(
    readFileSync(new URL("../../webforge/pages/access.json", import.meta.url)),
  );
  const account = accounts.find((a) => a.username === "casttini");
  assert.ok(account);
  assert.ok(
    registry.some(
      (p) => p.slug === account.project && p.source === "casttini-curitiba",
    ),
  );
});
