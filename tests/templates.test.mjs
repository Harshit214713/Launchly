import assert from 'node:assert/strict';
import test from 'node:test';
import { CATEGORIES, getTemplateById, getTemplatesByCategory, TEMPLATES } from '../src/lib/templates.ts';

test('every template category has an available starter template', () => {
  for (const category of CATEGORIES.filter((item) => item !== 'All')) {
    assert.ok(getTemplatesByCategory(category).length > 0, `Expected an available ${category} template`);
  }
});

test('starter templates have unique IDs and usable content', () => {
  const ids = new Set(TEMPLATES.map((template) => template.id));
  assert.equal(ids.size, TEMPLATES.length);

  for (const template of TEMPLATES) {
    assert.ok(getTemplateById(template.id));
    assert.ok(template.description.trim());
    assert.ok(template.pages.length > 0);
    assert.ok(template.features.length > 0);
    assert.ok(template.accent);
  }
});
