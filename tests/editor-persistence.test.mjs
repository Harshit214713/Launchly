import assert from 'node:assert/strict';
import test from 'node:test';
import { loadEditorDraft, saveEditorDraft } from '../src/lib/editorPersistence.ts';

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

function overrideGlobal(name, value) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  return () => {
    if (previous) Object.defineProperty(globalThis, name, previous);
    else delete globalThis[name];
  };
}

test('draft fallback preserves media and reports when browser storage fails', async () => {
  const storage = new MemoryStorage();
  const restoreStorage = overrideGlobal('localStorage', storage);
  const restoreIndexedDb = overrideGlobal('indexedDB', undefined);
  const document = {
    version: 4,
    settings: { subdomain: 'fresh-crate' },
    assets: [{ id: 'hero', src: 'data:image/png;base64,full-image-data' }],
  };

  try {
    assert.equal(await saveEditorDraft('fresh-crate', document), 'localstorage');
    assert.deepEqual(await loadEditorDraft('fresh-crate'), document);

    storage.setItem = () => { throw new Error('QuotaExceededError'); };
    await assert.rejects(
      saveEditorDraft('fresh-crate', document),
      /draft could not be saved to browser storage.*QuotaExceededError/i,
    );
  } finally {
    restoreIndexedDb();
    restoreStorage();
  }
});
