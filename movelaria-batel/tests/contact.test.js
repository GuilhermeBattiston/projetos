import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { company, whatsappUrl } from "../src/config.js";
import { environments, inspirations } from "../src/content.js";

test("WhatsApp preserves supplied number and Portuguese text including special characters", () => {
  const link = new URL(whatsappUrl("cozinha & integração"));
  assert.equal(link.origin, "https://wa.me");
  assert.equal(link.pathname, "/5541996318510");
  assert.equal(
    link.searchParams.get("text"),
    "Olá! Conheci a Movelaria Batel pelo site e gostaria de conversar sobre móveis planejados. Tenho interesse em cozinha & integração.",
  );
  assert.equal([...link.searchParams.keys()].length, 1);
});
test("each suggested environment prepares its own conversation", () => {
  for (const item of environments)
    assert.ok(
      new URL(whatsappUrl(item.subject)).searchParams
        .get("text")
        .includes(item.subject),
    );
  assert.equal(
    new URL(whatsappUrl()).searchParams.get("text"),
    "Olá! Conheci a Movelaria Batel pelo site e gostaria de conversar sobre móveis planejados.",
  );
});
test("all environment and gallery references have local imagery; source contact remains intact", () => {
  for (const item of [...environments, ...inspirations])
    assert.ok(
      existsSync(
        new URL(`../public/images/${item.image}.webp`, import.meta.url),
      ),
    );
  assert.ok(environments.every((item) => /ilustrativa/.test(item.alt)));
  assert.equal(
    new URL(company.maps).searchParams.get("cid"),
    "14432097110645917681",
  );
  assert.equal(company.address, "Avenida Sete de Setembro, 4682");
});
test("Batel presentation account points to a registered build source", () => {
  const registry = JSON.parse(
    readFileSync(new URL("../../webforge/prototypes.json", import.meta.url)),
  );
  const accounts = JSON.parse(
    readFileSync(new URL("../../webforge/pages/access.json", import.meta.url)),
  );
  const account = accounts.find((item) => item.username === "batel");
  assert.ok(account);
  assert.ok(
    registry.some(
      (item) =>
        item.slug === account.project && item.source === "movelaria-batel",
    ),
  );
});
