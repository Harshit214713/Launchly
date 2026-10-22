import assert from 'node:assert/strict';
import test from 'node:test';
import { editorCatalog } from '../src/lib/editorCatalog.ts';
import { createEditorWidgetContent, getEditorWidgetDefinitions, getEditorWidgetExportCode } from '../src/lib/editorWidgetRegistry.ts';

test('all 591 Element Library entries have a unique widget definition', () => {
  const definitions = getEditorWidgetDefinitions();
  assert.equal(editorCatalog.length, 591);
  assert.equal(definitions.length, editorCatalog.length);
  assert.equal(new Set(definitions.map((widget) => widget.id)).size, definitions.length);
  assert.ok(definitions.every((widget) => widget.kind));
  assert.ok(definitions.every((widget) =>
    widget.renderer === 'catalog-widget' &&
    widget.propertySchema.length > 0 &&
    widget.thumbnail.label === widget.label &&
    widget.exportCode({ title: '<Store>' }).includes('&lt;Store&gt;')
  ));
});

test('every Element Library entry creates editable default content', () => {
  for (const widget of editorCatalog) {
    const content = createEditorWidgetContent(widget.id);
    assert.ok(content, `${widget.id} should resolve a widget definition`);
    assert.equal(content.blockType, widget.id);
    assert.equal(typeof content.title, 'string');
    assert.equal(typeof content.description, 'string');
    assert.ok(Array.isArray(content.items));
    if (!['layout'].includes(String(content.widgetKind))) {
      assert.ok(content.items.length > 0, `${widget.id} should have editable starting content`);
    }
  }
});

test('widget export helpers emit safe semantic markup for every catalog entry', () => {
  for (const widget of editorCatalog) {
    const result = getEditorWidgetExportCode(widget.id, { title: '<script>alert(1)</script>', description: 'A & B' });
    assert.ok(result?.startsWith('<section '), `${widget.id} should emit a section`);
    assert.ok(!result.includes('<script>'), `${widget.id} must escape markup`);
    assert.ok(result.includes('A &amp; B'), `${widget.id} must escape text content`);
  }
});
