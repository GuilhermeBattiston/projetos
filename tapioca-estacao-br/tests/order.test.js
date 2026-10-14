import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCart,
  orderLines,
  subtotal,
  buildMessage,
  whatsappUrl,
} from "../src/utils/order.js";
import { products } from "../src/data/products.js";
test("cart rejects invalid products and quantities and caps large values", () => {
  assert.deepEqual(
    normalizeCart(
      {
        frango: 3,
        caprese: -1,
        carne: Infinity,
        banana: 3.5,
        cafe: 100,
        unknown: 2,
      },
      products,
    ),
    { frango: 3, cafe: 99 },
  );
  assert.deepEqual(normalizeCart(null, products), {});
  assert.deepEqual(normalizeCart([], products), {});
});
test("totals use integer cents across multiple quantities", () => {
  const lines = orderLines({ frango: 2, cafe: 1 }, products);
  assert.equal(subtotal(lines), 5270);
  assert.equal(subtotal([]), 0);
});
test("delivery message preserves accents, line items, address, notes and totals", () => {
  const message = buildMessage(
    {
      name: " Ana ",
      method: "delivery",
      address: "Rua São João, 10",
      notes: "Sem tomate & bem quente",
    },
    orderLines({ frango: 2, cafe: 1 }, products),
  );
  assert.match(message, /Nome: Ana/);
  assert.match(message, /2x Frango & queijo/);
  assert.match(message, /52,70/);
  assert.match(message, /Endereço: Rua São João, 10/);
  assert.match(message, /Sem tomate & bem quente/);
  const url = whatsappUrl("5511999999999", message);
  assert.equal(new URL(url).hostname, "wa.me");
  assert.equal(new URL(url).searchParams.get("text"), message);
});
test("pickup omits address; unconfigured or malformed phone blocks sending", () => {
  const message = buildMessage(
    { name: "Ana", method: "pickup", address: "old address", notes: "" },
    orderLines({ frango: 1 }, products),
  );
  assert.doesNotMatch(message, /Endereço/);
  assert.match(message, /Retirada/);
  for (const phone of ["", "123", "phone", "+5511999999999"])
    assert.equal(whatsappUrl(phone, message), null);
});
