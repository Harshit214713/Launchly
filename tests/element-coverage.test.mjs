import assert from 'node:assert/strict';
import test from 'node:test';
import { editorCatalog } from '../src/lib/editorCatalog.ts';
import { createStorefrontPages } from '../src/lib/templateContent.ts';
import { getEditorWidgetDefinition } from '../src/lib/editorWidgetRegistry.ts';

test('every Element Library widget is registered and showcased in Volt Gear', () => {
  const pages = createStorefrontPages('volt-gear', ['Home', 'Components']);
  const componentPage = pages.find((page) => page.id === 'components');
  assert.ok(componentPage);

  const usedIds = new Set(
    componentPage.sections.flatMap((section) =>
      (section.columns || []).flatMap((column) =>
        column.elements.map((element) => element.content.blockType).filter((id) => typeof id === 'string')
      )
    )
  );

  for (const widget of editorCatalog) {
    assert.ok(getEditorWidgetDefinition(widget.id), `${widget.id} must have a registry definition`);
    assert.ok(usedIds.has(widget.id), `${widget.id} must appear on the Components page`);
  }
});
