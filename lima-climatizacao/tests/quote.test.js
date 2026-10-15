import test from "node:test";
import assert from "node:assert/strict";
import { buildQuote, validateQuote, whatsappUrl } from "../src/utils/quote.js";
import { business, asset } from "../src/config.js";
test("quote encodes accents, line breaks and special characters without sending", () => {
  const details = {
    name: " Ana ",
    service: "Instalação de ar-condicionado",
    location: "Curitiba — Água Verde",
    description: "Sala 20 m² & equipamento com ruído?",
  };
  const message = buildQuote(details);
  assert.match(message, /Nome: Ana\n/);
  assert.match(message, /Localização: Curitiba — Água Verde/);
  assert.match(message, /Sala 20 m² & equipamento com ruído\?/);
  const url = new URL(whatsappUrl(business.phone, message));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/5541999927966");
  assert.equal(url.searchParams.get("text"), message);
});
test("validation requires all fields and rejects whitespace", () => {
  assert.deepEqual(Object.keys(validateQuote({})), [
    "name",
    "service",
    "location",
    "description",
  ]);
  assert.deepEqual(
    Object.keys(
      validateQuote({
        name: " ",
        service: "Orientação",
        location: "Curitiba",
        description: "\n",
      }),
    ),
    ["name", "description"],
  );
  assert.deepEqual(
    validateQuote({
      name: "Ana",
      service: "Orientação",
      location: "Curitiba",
      description: "Equipamento com ruído",
    }),
    {},
  );
});
test("malformed phone never becomes a WhatsApp destination", () => {
  for (const phone of ["", "123", "+5541999927966", "text"])
    assert.equal(whatsappUrl(phone, "Mensagem"), null);
});
test("assets work outside Vite and source data matches supplied contact", () => {
  assert.equal(asset('images/hero.webp'),'/images/hero.webp');
 assert.equal(business.phoneDisplay, "(41) 99992-7966");
  assert.equal(business.hours.length, 3);
  assert.equal(business.city, "Curitiba");
});
