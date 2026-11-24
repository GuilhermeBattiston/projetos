import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCart,
  orderLines,
  subtotal,
  groupLines,
  buildMessage,
  whatsappUrl,
  CATEGORY_ORDER,
  CART_VERSION,
} from "../src/utils/order.js";
import { products } from "../src/data/products.js";
const product = (name) => {
  const found = products.find((p) => p.name === name);
  assert.ok(found, `Produto oficial ausente: ${name}`);
  return found;
};
const item = (name, quantity = 1, custom = {}) => ({
  id: `${product(name).id}-${quantity}-${custom.semTempero ? "sem" : "padrao"}-${custom.notes ?? ""}`,
  productId: product(name).id,
  quantity,
  semTempero: false,
  notes: "",
  ...custom,
});
const linesFor = (items) =>
  orderLines({ version: CART_VERSION, items }, products);
test("catálogo oficial tem IDs exclusivos, cinco categorias e os 27 preços indicados", () => {
  assert.equal(products.length, 27);
  assert.equal(new Set(products.map((p) => p.id)).size, 27);
  assert.deepEqual(
    CATEGORY_ORDER.map((c) => products.filter((p) => p.category === c).length),
    [4, 12, 3, 2, 6],
  );
  const expected = [
    500, 700, 900, 900, 900, 1500, 1400, 1400, 1100, 1400, 900, 1500, 1000,
    1000, 1000, 1000, 800, 1000, 900, 700, 800, 300, 350, 300, 600, 600, 250,
  ];
  assert.deepEqual(
    products.map((p) => p.price),
    expected,
  );
});
test("migração descarta objetos v1 e versões desconhecidas para impedir produtos fictícios", () => {
  assert.deepEqual(
    normalizeCart({ frango: 3, cafe: 4, caprese: 2 }, products),
    [],
  );
  assert.deepEqual(
    normalizeCart({ version: 1, items: [item("Café")] }, products),
    [],
  );
  assert.deepEqual(
    normalizeCart({ version: 3, items: [item("Café")] }, products),
    [],
  );
  assert.deepEqual(normalizeCart(null, products), []);
});
test("normaliza dados persistidos: remove produtos inexistentes, rejeita quantidades e limita em 99", () => {
  const raw = [
    item("Café", 2),
    item("Café", -2, { notes: "negativo" }),
    item("Café", 2.5, { notes: "fracionário" }),
    item("Café", Infinity, { notes: "infinito" }),
    item("Água com gás — 500 ml", 100),
    { id: "unknown", productId: "caprese", quantity: 1 },
  ];
  const cart = normalizeCart({ version: 2, items: raw }, products);
  assert.equal(cart.length, 2);
  assert.deepEqual(
    cart.map((p) => p.quantity),
    [2, 99],
  );
});
test("mesmo produto com personalizações distintas permanece em linhas diferentes", () => {
  const regular = item("Bauru", 1);
  const without = item("Bauru", 2, { semTempero: true });
  const note = item("Bauru", 1, { notes: "Sem tomate" });
  const cart = normalizeCart(
    [regular, without, note, { ...without, id: "segunda", quantity: 1 }],
    products,
  );
  assert.equal(cart.length, 3);
  assert.deepEqual(
    cart.map((p) => p.quantity),
    [1, 3, 1],
  );
  assert.notEqual(cart[0].id, cart[1].id);
});
test("preços persistidos são ignorados e opções irrelevantes de bebida são removidas", () => {
  const line = linesFor([
    {
      ...item("Café", 2, { semTempero: true }),
      price: 1,
      name: "Preço antigo",
    },
  ])[0];
  assert.equal(line.price, 250);
  assert.equal(line.name, "Café");
  assert.equal(line.semTempero, false);
  assert.equal(subtotal([line]), 500);
});
test("quantidades e dinheiro usam centavos: manteiga, águas com gás e cafés", () => {
  assert.equal(subtotal(linesFor([item("Tapioca na manteiga", 2)])), 1000);
  assert.equal(subtotal(linesFor([item("Água com gás — 500 ml", 3)])), 1050);
  assert.equal(subtotal(linesFor([item("Café", 2)])), 500);
});
test("pedido oficial de exemplo agrupa cinco categorias e totaliza R$63", () => {
  const lines = linesFor([
    item("Coca-Cola lata — 350 ml", 2),
    item("Perfeitinha"),
    item("Charque com mussarela"),
    item("Tapioca na manteiga", 2),
    item("Frango com catupiry"),
    item("Misto quente"),
  ]);
  assert.equal(subtotal(lines), 6300);
  const groups = groupLines(lines);
  assert.deepEqual(
    groups.map((g) => g.category),
    CATEGORY_ORDER,
  );
  assert.deepEqual(
    groups.map((g) => g.subtotal),
    [1000, 2500, 900, 700, 1200],
  );
  assert.deepEqual(
    groups.map((g) => g.quantity),
    [2, 2, 1, 1, 2],
  );
});
test("uma unidade de cada preço fornecido soma R$237, sem alterar preços para forçar R$231", () => {
  assert.equal(
    subtotal(
      orderLines(
        products.map((p, i) => ({
          id: "all-" + i,
          productId: p.id,
          quantity: 1,
        })),
        products,
      ),
    ),
    23700,
  );
});
test("persistência JSON mantém personalizações e não recupera preços antigos", () => {
  const original = normalizeCart(
    [item("Bauru", 2, { semTempero: true, notes: "Sem tomate & bem quente" })],
    products,
  );
  assert.deepEqual(
    normalizeCart(
      JSON.parse(JSON.stringify({ version: 2, items: original })),
      products,
    ),
    original,
  );
  assert.equal(Object.hasOwn(original[0], "price"), false);
});
test("mensagem oficial preserva categoria, preço unitário, personalização, endereço e acentos", () => {
  const lines = linesFor([
    item("Bauru", 2, { semTempero: true, notes: "Sem tomate & quente" }),
    item("Café", 2),
  ]);
  const message = buildMessage(
    {
      name: " Ana ",
      method: "delivery",
      address: {
        street: "Rua São João",
        number: "10",
        neighborhood: "Centro",
        complement: "",
        reference: "Próximo à estação",
      },
      notes: "Bater à porta",
    },
    lines,
  );
  assert.match(message, /Estação da Tapioca/);
  assert.doesNotMatch(message, /Tapioca Estação BR/);
  assert.match(message, /Nome: Ana/);
  assert.match(message, /2x Bauru/);
  assert.match(message, /9,00 cada/);
  assert.match(message, /Sem tempero/);
  assert.match(message, /Sem tomate & quente/);
  assert.match(message, /23,00/);
  assert.match(message, /Taxa de entrega a confirmar/);
  assert.match(message, /Rua: Rua São João/);
  assert.match(message, /Número: 10/);
  assert.match(message, /Bairro: Centro/);
  assert.doesNotMatch(message, /Complemento:/);
  assert.match(message, /Referência: Próximo à estação/);
  assert.ok(
    message.indexOf("*TAPIOCAS ESPECIAIS*") < message.indexOf("*BEBIDAS*"),
  );
  assert.doesNotMatch(message, /TAPIOCAS TRADICIONAIS/);
  const url = whatsappUrl("5587988619978", message);
  assert.equal(new URL(url).searchParams.get("text"), message);
});
test("retirada demonstrativa omite endereço e campos vazios; telefone inválido bloqueia URL", () => {
  const message = buildMessage(
    {
      name: "Ana",
      method: "pickup",
      address: { street: "Rua antiga" },
      notes: "",
    },
    linesFor([item("Café")]),
  );
  assert.match(message, /Retirada \(demonstrativa/);
  assert.doesNotMatch(
    message,
    /ENDEREÇO|Rua antiga|OBSERVAÇÕES GERAIS|Taxa de entrega/,
  );
  for (const phone of ["", "123", "+5587988619978", "texto"])
    assert.equal(whatsappUrl(phone, message), null);
});
