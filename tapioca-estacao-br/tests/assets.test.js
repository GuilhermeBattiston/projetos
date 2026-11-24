import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { products } from "../src/data/products.js";
const root = new URL("../", import.meta.url);
test("logotipo original preservado byte a byte e derivados disponíveis", () => {
  const original = readFileSync(
    new URL("public/brand/logo-original.jpeg", root),
  );
  assert.equal(
    createHash("sha256").update(original).digest("hex"),
    "5f5ac15303eb4187da81ee38fbcba fbf65f80ef50b67dc89f436509811c607d9".replaceAll(
      " ",
      "",
    ),
  );
  for (const name of [
    "logo.webp",
    "logo-header.webp",
    "logo-footer.webp",
    "favicon.png",
    "og-image.webp",
    "cardapio-original.jpeg",
  ])
    assert.ok(readFileSync(new URL("public/brand/" + name, root)).length > 100);
});
test("27 fotografias individuais com variantes responsivas locais em WebP", () => {
  const hashes = new Set();
  for (const p of products) {
    for (const suffix of ["", "-360"]) {
      const file = readFileSync(
        new URL(`public/images/menu/${p.slug}${suffix}.webp`, root),
      );
      assert.equal(file.toString("ascii", 0, 4), "RIFF");
      assert.equal(file.toString("ascii", 8, 12), "WEBP");
      assert.ok(file.length < 180 * 1024);
      if (!suffix) hashes.add(createHash("sha256").update(file).digest("hex"));
    }
  }
  assert.equal(hashes.size, 27);
});
test("identidade comercial e metadados não recuperam o nome anterior", () => {
  const html = readFileSync(new URL("index.html", root), "utf8");
  assert.ok(html.includes("Estação da Tapioca | Cardápio e Delivery"));
  assert.ok(html.includes("%BASE_URL%brand/og-image.webp"));
  assert.ok(html.includes("noindex"));
  const components = readdirSync(new URL("src/components/", root))
    .filter((n) => n.endsWith(".jsx"))
    .map((n) => readFileSync(new URL("src/components/" + n, root), "utf8"))
    .join("\n");
  assert.doesNotMatch(
    components + html,
    /Tapioca Estação(?: BR)?|Tapioca Station|Estação Tapioca/,
  );
});
