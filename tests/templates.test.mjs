import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CATEGORIES, DEFAULT_TEMPLATE, getTemplateById, getTemplatesByCategory, searchTemplates, TEMPLATES } from '../src/lib/templates.ts';

test('catalog contains the two ecommerce starters', () => {
  assert.deepEqual(TEMPLATES.map(({ id }) => id), ['fresh-crate', 'volt-gear']);
  assert.deepEqual(CATEGORIES, ['All', 'Ecommerce']);
  assert.equal(getTemplatesByCategory('All').length, 2);
  assert.equal(getTemplatesByCategory('Ecommerce').length, 2);
  assert.equal(searchTemplates('').length, 2);
  assert.equal(searchTemplates('grocer').map(({ id }) => id).join(','), 'fresh-crate');
  assert.equal(getTemplateById('fresh-crate')?.products.length, 12);
  assert.equal(getTemplateById('volt-gear')?.products.length, 12);
  assert.ok(getTemplateById('fresh-crate')?.products.some((product) => product.variants?.length));
  assert.ok(getTemplateById('volt-gear')?.products.some((product) => product.variants?.length));
  assert.equal(getTemplateById('fresh-crate')?.pages.length, 20);
  assert.equal(getTemplateById('volt-gear')?.pages.length, 21);
  for (const id of ['fresh-crate', 'volt-gear']) {
    const png = readFileSync(new URL(`../public/templates/${id}.png`, import.meta.url));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 800);
  }
});

test('blank editor starter remains available alongside templates', () => {
  assert.equal(DEFAULT_TEMPLATE.id, 'blank');
  assert.equal(DEFAULT_TEMPLATE.name, 'My Website');
  assert.deepEqual(DEFAULT_TEMPLATE.pages, ['Home']);
  assert.ok(DEFAULT_TEMPLATE.description);
  assert.ok(DEFAULT_TEMPLATE.bgColor);
  assert.ok(DEFAULT_TEMPLATE.textColor);
  assert.equal(DEFAULT_TEMPLATE.previewUrl, '/editor');
});
