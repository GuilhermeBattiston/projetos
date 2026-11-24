import { chromium, expect } from "playwright/test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TAPIOCA_TEST_URL || "http://127.0.0.1:5175/";
const artifacts = new URL("./artifacts/", import.meta.url);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.setDefaultTimeout(15000);
console.log("Verificando catálogo");
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("request", (r) => {
  assert.ok(
    !r.url().startsWith("https://wa.me/"),
    "O teste não deve abrir o WhatsApp",
  );
});
const money = async (value) =>
  expect(page.getByTestId("subtotal")).toHaveText(value);
const open = async () => page.locator(".cart-toggle").click();
async function add(name, quantity = 1, semTempero = false, notes = "") {
  await page
    .getByRole("button", { name: "Escolher " + name, exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let i = 1; i < quantity; i++)
    await page
      .getByRole("button", { name: "Aumentar quantidade", exact: true })
      .click();
  if (semTempero)
    await page.getByRole("checkbox", { name: "Solicitar sem tempero" }).check();
  if (notes)
    await page
      .getByRole("textbox", { name: "Observações do produto" })
      .fill(notes);
  await page.getByRole("button", { name: /^Adicionar ·/ }).click();
}
try {
  assert.equal(
    (await page.goto(base, { waitUntil: "networkidle" })).status(),
    200,
  );
  await expect(page).toHaveTitle("Estação da Tapioca | Cardápio e Delivery");
  assert.equal(await page.locator(".product-card").count(), 27);
  assert.equal(await page.locator(".menu-category").count(), 5);
  for (const [name, count] of [
    ["Tapiocas tradicionais", 4],
    ["Tapiocas especiais", 12],
    ["Tapiocas doces", 3],
    ["Sanduíches", 2],
    ["Bebidas", 6],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    assert.equal(await page.locator(".product-card").count(), count);
  }
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Buscar por nome ou ingrediente" })
    .fill("orégano");
  assert.equal(await page.locator(".product-card").count(), 7);
  await page.getByRole("button", { name: "Limpar busca" }).click();
  console.log("Montando pedido R$63");
  await add("Tapioca na manteiga", 2);
  await add("Charque com mussarela", 1, true, "Bem quente");
  await add("Frango com catupiry");
  await add("Perfeitinha");
  await add("Misto quente");
  await add("Coca-Cola lata — 350 ml", 2);
  await open();
  await money("R$ 63,00");
  assert.deepEqual(await page.locator(".cart-group h3").allTextContents(), [
    "Tapiocas tradicionais",
    "Tapiocas especiais",
    "Tapiocas doces",
    "Sanduíches",
    "Bebidas",
  ]);
  assert.equal(await page.locator(".category-subtotal").count(), 5);
  await page
    .getByRole("button", { name: "Aumentar Tapioca na manteiga", exact: true })
    .click();
  await money("R$ 68,00");
  await page
    .getByRole("button", { name: "Diminuir Tapioca na manteiga", exact: true })
    .click();
  await money("R$ 63,00");
  await page
    .getByRole("button", { name: "Continuar pedido", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Revisar pedido", exact: true })
    .click();
  assert.equal(await page.locator(".order-review").count(), 0);
  await page
    .getByRole("textbox", { name: "Seu nome", exact: true })
    .fill("Maria Teste");
  await page
    .getByRole("button", { name: "Revisar pedido", exact: true })
    .click();
  assert.equal(await page.locator(".order-review").count(), 0);
  await page.getByRole("textbox", { name: "Rua", exact: true }).fill("   ");
  await page.getByRole("textbox", { name: "Número", exact: true }).fill("10");
  await page
    .getByRole("textbox", { name: "Bairro", exact: true })
    .fill("Centro");
  await page
    .getByRole("button", { name: "Revisar pedido", exact: true })
    .click();
  assert.equal(await page.locator(".order-review").count(), 0);
  await page
    .getByRole("textbox", { name: "Rua", exact: true })
    .fill("Rua de Teste");
  await page
    .getByRole("textbox", { name: "Observações gerais" })
    .fill("Teste de revisão & acentuação");
  await page
    .getByRole("button", { name: "Revisar pedido", exact: true })
    .click();
  console.log("Validando revisão");
  const message = await page
    .getByRole("textbox", { name: "Mensagem para WhatsApp" })
    .inputValue();
  for (const text of [
    "Estação da Tapioca",
    "R$ 63,00",
    "Sem tempero",
    "Bem quente",
    "Rua de Teste",
    "Centro",
    "Taxa de entrega a confirmar pelo atendimento.",
    "Teste de revisão & acentuação",
  ])
    assert.ok(message.replace(/[\u00a0\u202f]/g, " ").includes(text), text);
  const link = await page
    .getByRole("link", { name: "Continuar no WhatsApp" })
    .getAttribute("href");
  assert.equal(new URL(link).pathname, "/5587988619978");
  assert.equal(new URL(link).searchParams.get("text"), message);
  await page
    .getByRole("button", { name: "Copiar mensagem", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Mensagem copiada." }),
  ).toBeVisible();
  const clipboard = await page.evaluate(() =>
    Promise.race([
      navigator.clipboard.readText(),
      new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
    ]),
  );
  if (clipboard !== null)
    assert.equal(clipboard.replace(/\r\n/g, "\n"), message);
  console.log(
    "Cópia testada",
    clipboard === null ? "leitura indisponível" : "conteúdo conferido",
  );
  await writeFile(new URL("mensagem-exemplo.txt", artifacts), message);
  await page.screenshot({
    path: fileURLToPath(new URL("revisao.png", artifacts)),
  });
  await page.getByRole("button", { name: "Voltar", exact: true }).click();
  await page
    .getByRole("radio", { name: "Retirada (demonstrativa)", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Revisar pedido", exact: true })
    .click();
  assert.ok(
    !(
      await page
        .getByRole("textbox", { name: "Mensagem para WhatsApp" })
        .inputValue()
    ).includes("Rua de Teste"),
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".cart-toggle")).toBeFocused();
  await page.reload({ waitUntil: "networkidle" });
  await open();
  await money("R$ 63,00");
  await page
    .getByRole("button", { name: "Continuar pedido", exact: true })
    .click();
  await expect(page.getByRole("textbox", { name: "Seu nome" })).toHaveValue("");
  await page.keyboard.press("Escape");
  await add("Bauru", 1, true, "Sem tomate");
  await add("Bauru");
  await open();
  assert.equal(
    await page
      .locator(".cart-lines li")
      .filter({
        has: page.getByRole("heading", { name: "Bauru", exact: true }),
      })
      .count(),
    2,
  );
  await page
    .getByRole("button", { name: "Remover Bauru sem tempero", exact: true })
    .click();
  await money("R$ 72,00");
  await page
    .getByRole("button", { name: "Remover Bauru", exact: true })
    .click();
  await money("R$ 63,00");
  await page.keyboard.press("Tab");
  assert.ok(
    await page.evaluate(() =>
      document.querySelector("dialog").contains(document.activeElement),
    ),
  );
  await page.keyboard.press("Escape");
  const widths = [];
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    console.log("Viewport", width);
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow da página em ${width}`,
    );
    if (width < 760) {
      await page
        .getByRole("button", { name: "Abrir menu", exact: true })
        .click();
      await page
        .getByRole("navigation", { name: "Navegação principal" })
        .getByRole("link", { name: "Cardápio", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Abrir menu", exact: true }),
      ).toBeVisible();
    }
    for (const image of await page.locator(".product-photo img").all())
      await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page.evaluate(() =>
          Array.from(document.images).every(
            (i) => i.complete && i.naturalWidth > 0,
          ),
        ),
      )
      .toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: fileURLToPath(new URL(`tela-${width}.png`, artifacts)),
      fullPage: true,
    });
    await open();
    assert.ok(
      await page.evaluate(() => {
        const d = document.querySelector("dialog");
        return d.scrollWidth <= d.clientWidth;
      }),
      `Overflow do carrinho em ${width}`,
    );
    await money("R$ 63,00");
    await page.screenshot({
      path: fileURLToPath(new URL(`carrinho-${width}.png`, artifacts)),
    });
    await page.keyboard.press("Escape");
    widths.push(width);
  }
  await open();
  await page
    .getByRole("button", { name: "Limpar pedido", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await money("R$ 63,00");
  await page
    .getByRole("button", { name: "Limpar pedido", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirmar limpeza", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Vamos escolher um sabor?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload({ waitUntil: "networkidle" });
  await open();
  await expect(
    page.getByRole("heading", { name: "Vamos escolher um sabor?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify(
      {
        result: "PASS",
        products: 27,
        categories: 5,
        totalExample: 6300,
        widths,
        consoleErrors: errors,
        whatsappSent: false,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(error);
  throw error;
} finally {
  await context.close();
  await browser.close();
}
