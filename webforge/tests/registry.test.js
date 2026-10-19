import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectBuilds } from '../scripts/registry.js';
test('draft prototypes are excluded by default and require explicit boolean opt-in',()=>{
 const registry=[{slug:'published'},{slug:'draft',draft:true}];
 assert.deepEqual(selectBuilds(registry).map(e=>e.slug),['published']);
 assert.deepEqual(selectBuilds(registry,false).map(e=>e.slug),['published']);
 assert.deepEqual(selectBuilds(registry,'false').map(e=>e.slug),['published']);
 assert.deepEqual(selectBuilds(registry,true).map(e=>e.slug),['published','draft']);
 assert.equal(registry.length,2);
});
