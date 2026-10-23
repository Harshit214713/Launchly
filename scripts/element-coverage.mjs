import assert from 'node:assert/strict';
import { editorCatalog } from '../src/lib/editorCatalog.ts';
import { createStorefrontPages } from '../src/lib/templateContent.ts';

const pages = createStorefrontPages('volt-gear', ['Home', 'Components']);
const componentPage = pages.find((page) => page.id === 'components');
assert.ok(componentPage, 'Volt Gear must include its Components style-guide page.');

const usedIds = new Set(
  componentPage.sections.flatMap((section) =>
    (section.columns || []).flatMap((column) =>
      column.elements.map((element) => element.content.blockType).filter((id) => typeof id === 'string')
    )
  )
);
const missing = editorCatalog.map((item) => item.id).filter((id) => !usedIds.has(id));
assert.deepEqual(missing, [], `Element Library entries missing from the showcase: ${missing.join(', ')}`);

console.log(`Element coverage passed: all ${editorCatalog.length} library widgets appear on Volt Gear's Components page.`);
