import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { company, whatsappUrl } from '../src/config.js';
import { services, gallery } from '../src/content.js';

test('WhatsApp uses supplied contact and preserves accents and special characters', () => {
  const link = new URL(whatsappUrl('reforma de cozinha & adequações'));
  assert.equal(link.origin, 'https://wa.me');
  assert.equal(link.pathname, '/5541998175073');
  assert.equal(link.searchParams.get('text'), 'Olá! Conheci a Lucas Construções e Reformas pelo site e gostaria de conversar sobre um orçamento. Tenho interesse em reforma de cozinha & adequações.');
  assert.equal([...link.searchParams.keys()].length, 1);
});
test('every suggested category has an individual conversation message', () => {
  for (const service of services) assert.ok(new URL(whatsappUrl(service.subject)).searchParams.get('text').includes(service.subject));
  assert.ok(!new URL(whatsappUrl()).searchParams.get('text').includes('Tenho interesse em'));
});
test('reference gallery files are local and explicitly illustrative', () => {
  for (const item of gallery) {
    assert.ok(existsSync(new URL(`../public/images/${item.image}`, import.meta.url)));
    assert.match(item.description, /não representa uma obra da empresa/);
  }
  assert.equal(new URL(company.maps).searchParams.get('cid'), '14687284506171798171');
});
test('portal account points to the registered project', () => {
  const registry = JSON.parse(readFileSync(new URL('../../webforge/prototypes.json', import.meta.url)));
  const accounts = JSON.parse(readFileSync(new URL('../../webforge/pages/access.json', import.meta.url)));
  const account = accounts.find(a => a.username === 'lucas');
  assert.ok(account);
  assert.ok(registry.some(item => item.slug === account.project && item.source === 'lucas-construcoes'));
});
