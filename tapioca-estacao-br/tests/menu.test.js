import { test } from "node:test";
import assert from "node:assert/strict";
import { products, categories, categoryInfo } from "../src/data/products.js";
import { business } from "../src/config.js";

test("nome comercial oficial, contatos centralizados e marca original configurada", () => {
  assert.equal(business.name, "Estação da Tapioca");
  assert.equal(business.whatsapp, "5587988619978");
  assert.equal(business.whatsappSecondary, "5587981810168");
  assert.equal(business.whatsappConfirmed, false);
  assert.equal(business.deliveryFee, null);
  for (const key of [
    "logo",
    "logoHero",
    "logoFooter",
    "logoOriginal",
    "favicon",
    "ogImage",
  ])
    assert.match(business[key], /^\/brand\//);
});
test("27 produtos ativos nas cinco categorias e na ordem do cardápio fornecido", () => {
  assert.equal(products.length, 27);
  assert.equal(products.filter((p) => p.available).length, 27);
  assert.deepEqual(categories, [
    "Todos",
    "Tapiocas tradicionais",
    "Tapiocas especiais",
    "Tapiocas doces",
    "Sanduíches",
    "Bebidas",
  ]);
  assert.deepEqual(
    categories
      .slice(1)
      .map((c) => products.filter((p) => p.category === c).length),
    [4, 12, 3, 2, 6],
  );
  assert.deepEqual(Object.keys(categoryInfo), categories.slice(1));
});
test("preços individuais iguais ao briefing; soma aritmética é R$ 237,00, não R$ 231,00", () => {
  assert.deepEqual(
    products.map((p) => p.price),
    [
      500, 700, 900, 900, 900, 1500, 1400, 1400, 1100, 1400, 900, 1500, 1000,
      1000, 1000, 1000, 800, 1000, 900, 700, 800, 300, 350, 300, 600, 600, 250,
    ],
  );
  assert.equal(
    products.reduce((sum, p) => sum + p.price, 0),
    23700,
  );
  assert.equal(products[0].price * 2, 1000);
  assert.equal(
    products.find((p) => p.id === "agua-com-gas-500ml").price * 3,
    1050,
  );
  assert.equal(products.find((p) => p.id === "cafe").price * 2, 500);
});
test("IDs, slugs e imagens individuais exclusivos; nenhuma opção paga inventada", () => {
  assert.equal(new Set(products.map((p) => p.id)).size, 27);
  assert.equal(new Set(products.map((p) => p.slug)).size, 27);
  assert.equal(new Set(products.map((p) => p.image)).size, 27);
  for (const p of products) {
    assert.ok(Number.isInteger(p.price) && p.price > 0);
    assert.match(p.image, /^\/images\/menu\/[a-z0-9-]+\.webp$/);
    assert.equal(p.customizable, p.category.startsWith("Tapiocas"));
    assert.equal(p.options.semTempero, p.customizable);
    assert.equal(p.options.notes, true);
    assert.equal(p.illustrative, true);
    assert.ok(p.alt.includes("imagem ilustrativa"));
  }
  assert.equal(products.find((p) => p.id === "misto-quente").number, "01");
  assert.equal(products.find((p) => p.id === "misto-frango").number, "02");
});
test("não atribui queijo, sabor ou volume não informados", () => {
  assert.equal(
    products.find((p) => p.id === "tapioca-coco-queijo-leite-condensado")
      .description,
    "Tapioca com coco, queijo e leite condensado.",
  );
  const suco = products.find((p) => p.id === "suco-da-fruta");
  assert.doesNotMatch(suco.name + " " + suco.description, /laranja|300|500/);
  assert.doesNotMatch(
    products.find((p) => p.id === "cafe").description,
    /ml|litro/,
  );
});
