import type { SiteDocument } from '@/lib/siteDocument';
import type { SiteVersion } from '@/store/editorStore';

const databaseName = 'launchly-editor-v1';
const databaseVersion = 1;
const imageMarker = '__launchly_embedded_media__';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB is unavailable.'));
    const request = indexedDB.open(databaseName, databaseVersion);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('drafts')) database.createObjectStore('drafts');
      if (!database.objectStoreNames.contains('versions')) database.createObjectStore('versions');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open editor storage.'));
  });
}

async function readValue<T>(store: 'drafts' | 'versions', key: string): Promise<T | null> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(store, 'readonly').objectStore(store).get(key);
    request.onsuccess = () => { database.close(); resolve((request.result as T | undefined) ?? null); };
    request.onerror = () => { database.close(); reject(request.error || new Error('Could not read editor storage.')); };
  });
}

async function writeValue(store: 'drafts' | 'versions', key: string, value: unknown): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, 'readwrite');
    transaction.objectStore(store).put(value, key);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error || new Error('Could not write editor storage.')); };
    transaction.onabort = () => { database.close(); reject(transaction.error || new Error('Editor storage transaction was aborted.')); };
  });
}

function compact(value: unknown): unknown {
  if (typeof value === 'string' && value.startsWith('data:image/')) return imageMarker;
  if (Array.isArray(value)) return value.map(compact);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, compact(child)]));
  return value;
}

function restoreEmbeddedMedia(snapshot: unknown, current: unknown): unknown {
  if (snapshot === imageMarker && typeof current === 'string' && current.startsWith('data:image/')) return current;
  if (Array.isArray(snapshot)) return snapshot.map((item, index) => restoreEmbeddedMedia(item, Array.isArray(current) ? current[index] : undefined));
  if (snapshot && typeof snapshot === 'object') {
    const currentRecord = current && typeof current === 'object' ? current as Record<string, unknown> : {};
    return Object.fromEntries(Object.entries(snapshot).map(([key, value]) => [key, restoreEmbeddedMedia(value, currentRecord[key])]));
  }
  return snapshot;
}

export async function loadEditorDraft(id: string): Promise<unknown | null> {
  try {
    const saved = await readValue<unknown>('drafts', id);
    if (saved) return saved;
  } catch { /* Fall back to older local drafts if IndexedDB is blocked. */ }
  try {
    const raw = localStorage.getItem(`launchly_site_${id}`);
    return raw ? JSON.parse(raw) as unknown : null;
  } catch { return null; }
}

export async function saveEditorDraft(id: string, document: SiteDocument): Promise<void> {
  try {
    await writeValue('drafts', id, document);
    try {
      localStorage.removeItem(`launchly_site_${id}`);
      localStorage.removeItem(`launchly_site_${document.settings.subdomain}`);
    } catch { /* Legacy browser storage can be unavailable. */ }
    return;
  }
  catch { /* IndexedDB fallback below is size-capped and best-effort. */ }
  try {
    const withoutLargeMedia = compact(document) as SiteDocument;
    const serialized = JSON.stringify(withoutLargeMedia);
    if (serialized.length <= 1_500_000) localStorage.setItem(`launchly_site_${id}`, serialized);
  } catch { /* Report the draft as offline in the caller; do not throw from autosave. */ }
}

export async function loadEditorVersions(id: string): Promise<SiteVersion[]> {
  try {
    const versions = await readValue<SiteVersion[]>('versions', id);
    if (versions) return versions.slice(-8);
  } catch { /* Fall through to the compact localStorage backup. */ }
  try {
    const raw = localStorage.getItem(`launchly_versions_${id}`);
    return raw ? (JSON.parse(raw) as SiteVersion[]).slice(-3) : [];
  } catch { return []; }
}

export async function saveEditorVersions(id: string, versions: SiteVersion[]): Promise<boolean> {
  const limited = versions.slice(-8);
  try {
    await writeValue('versions', id, limited.map((version) => ({ ...version, document: compact(version.document) as SiteDocument })));
    try { localStorage.removeItem(`launchly_versions_${id}`); } catch { /* Old quota-full entries are best-effort cleanup. */ }
    return true;
  }
  catch { /* Keep the fallback compact enough for browser storage quotas. */ }
  try {
    for (let count = Math.min(3, limited.length); count >= 0; count -= 1) {
      try {
        const selection = count === 0 ? [] : limited.slice(-count);
        localStorage.setItem(`launchly_versions_${id}`, JSON.stringify(selection.map((version) => ({ ...version, document: compact(version.document) }))));
        return true;
      } catch {
        localStorage.removeItem(`launchly_versions_${id}`);
      }
    }
  } catch { /* Storage may be disabled altogether. */ }
  return false;
}

export function hydrateVersionDocument(version: SiteVersion, current: SiteDocument): SiteDocument {
  return restoreEmbeddedMedia(version.document, current) as SiteDocument;
}
