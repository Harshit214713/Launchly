import { createStore, type StoreApi } from 'zustand/vanilla';
import type { Column, Device, MenuItem, Section, SectionContent, SiteDocument, SiteElement, SitePage, Theme } from '@/lib/siteDocument';

export type SelectedElementPath = { sectionId: string; columnId: string; elementId: string };

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'offline' | 'error';
export type SiteVersion = { id: string; label: string; createdAt: string; document: SiteDocument };
export type EditorStoreState = {
  document: SiteDocument;
  past: SiteDocument[];
  future: SiteDocument[];
  versions: SiteVersion[];
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  // UI state kept in the store so undo/redo can reliably restore the full visual state
  deviceMode: Device;
  activePageId: string;
  selectedSectionId: string | null;
  selectedElementPath: SelectedElementPath | null;
  isRestoring: boolean;
  // Actions
  setDeviceMode: (mode: Device) => void;
  setActivePageId: (id: string) => void;
  setSelectedSectionId: (id: string | null) => void;
  setSelectedElementPath: (path: SelectedElementPath | null) => void;
  updateDocument: (update: (document: SiteDocument) => SiteDocument, group?: string) => void;
  replaceDocument: (document: SiteDocument) => void;
  setTheme: (theme: Theme) => void;
  addSection: (pageId: string, section: Section, index?: number) => void;
  duplicateSection: (pageId: string, sectionId: string) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  moveSection: (pageId: string, sectionId: string, direction: -1 | 1) => void;
  reorderSection: (pageId: string, sectionId: string, targetIndex: number) => void;
  updateSection: (pageId: string, sectionId: string, update: (section: Section) => Section, group?: string) => void;
  insertSection: (pageId: string, section: Section, index: number) => void;
  updateSectionContent: (pageId: string, sectionId: string, content: SectionContent, group?: string) => void;
  insertColumn: (pageId: string, sectionId: string, column: Column, index: number) => void;
  moveColumn: (pageId: string, sectionId: string, columnId: string, targetIndex: number) => void;
  resizeColumn: (pageId: string, sectionId: string, columnId: string, device: Device, width: number) => void;
  insertElement: (pageId: string, sectionId: string, columnId: string, element: SiteElement, index: number) => void;
  moveElement: (pageId: string, fromSectionId: string, fromColumnId: string, elementId: string, toSectionId: string, toColumnId: string, targetIndex: number) => void;
  duplicateElement: (pageId: string, sectionId: string, columnId: string, elementId: string) => void;
  deleteElement: (pageId: string, sectionId: string, columnId: string, elementId: string) => void;
  updateElement: (pageId: string, sectionId: string, columnId: string, elementId: string, update: (element: SiteElement) => SiteElement, group?: string) => void;
  addPage: (title: string, sections: Section[]) => string;
  duplicatePage: (pageId: string) => string | null;
  renamePage: (pageId: string, title: string) => void;
  setPageSlug: (pageId: string, slug: string) => string;
  removePage: (pageId: string) => boolean;
  reorderPage: (pageId: string, targetIndex: number) => void;
  setHomePage: (pageId: string) => void;
  setMenu: (menu: MenuItem[]) => void;
  setSaveStatus: (status: SaveStatus, lastSavedAt?: string) => void;
  setVersions: (versions: SiteVersion[]) => void;
  captureVersion: (label: string, document?: SiteDocument) => SiteVersion;
  restoreVersion: (versionId: string) => boolean;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

const makeSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'page';
const reservedSlugs = new Set(['api', 'live', 'editor', 'login', 'signup', 'dashboard', 'checkout', 'cart', 'account', '404', 'home']);
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function cloneSection(section: Section): Section {
  const copy = structuredClone(section);
  copy.id = makeId(section.type);
  copy.columns = (copy.columns || []).map((column) => ({
    ...column,
    id: makeId('column'),
    elements: column.elements.map((element) => ({ ...element, id: makeId(element.type) })),
  }));
  return copy;
}

function mapSection(document: SiteDocument, pageId: string, sectionId: string, update: (section: Section) => Section): SiteDocument {
  if (!document.pages.some((page) => page.id === pageId && page.sections.some((section) => section.id === sectionId))) return document;
  return { ...document, pages: document.pages.map((page) => page.id !== pageId ? page : {
    ...page,
    sections: page.sections.map((section) => section.id === sectionId ? update(section) : section),
  }) };
}

function mapColumn(document: SiteDocument, pageId: string, sectionId: string, columnId: string, update: (column: Column) => Column): SiteDocument {
  if (!document.pages.some((page) => page.id === pageId && page.sections.some((section) => section.id === sectionId && section.columns?.some((column) => column.id === columnId)))) return document;
  return mapSection(document, pageId, sectionId, (section) => ({ ...section, columns: (section.columns || []).map((column) => column.id === columnId ? update(column) : column) }));
}

function uniqueSlug(value: string, pages: SitePage[], excludeId?: string): string {
  const base = makeSlug(value);
  const safeBase = reservedSlugs.has(base) ? `${base}-page` : base;
  let slug = safeBase;
  let suffix = 2;
  while (pages.some((page) => page.id !== excludeId && page.slug.replace(/^\//, '') === slug)) slug = `${safeBase}-${suffix++}`;
  return slug;
}

export function createEditorStore(initial: SiteDocument): StoreApi<EditorStoreState> {
  let lastGroup = '';
  let lastEditAt = 0;
  const commit = (set: StoreApi<EditorStoreState>['setState'], get: StoreApi<EditorStoreState>['getState'], update: (document: SiteDocument) => SiteDocument, group = '') => {
    const current = get().document;
    const next = update(current);
    if (next === current) return;
    const grouped = group !== '' && group === lastGroup && Date.now() - lastEditAt < 800;
    lastGroup = group;
    lastEditAt = Date.now();
    set((state) => ({ document: next, past: grouped ? state.past : [...state.past, current].slice(-50), future: [], saveStatus: 'unsaved' }));
  };

  return createStore<EditorStoreState>((set, get) => ({
    document: initial,
    past: [],
    future: [],
    versions: [],
    saveStatus: 'saved',
    lastSavedAt: null,
    deviceMode: 'desktop',
    activePageId: initial.pages.find((p) => p.isHome)?.id || initial.pages[0]?.id || 'home',
    selectedSectionId: null,
    selectedElementPath: null,
    isRestoring: false,
    setDeviceMode: (mode) => set({ deviceMode: mode }),
    setActivePageId: (id) => set({ activePageId: id }),
    setSelectedSectionId: (id) => set({ selectedSectionId: id }),
    setSelectedElementPath: (path) => set({ selectedElementPath: path }),
    updateDocument: (update, group) => commit(set, get, update, group),
    replaceDocument: (document) => { lastGroup = ''; lastEditAt = 0; set({ document, past: [], future: [], saveStatus: 'saved', isRestoring: false }); },
    setTheme: (theme) => commit(set, get, (document) => ({ ...document, theme })),
    addSection: (pageId, section, index) => commit(set, get, (document) => ({ ...document, pages: document.pages.map((page) => {
      if (page.id !== pageId) return page;
      const sections = [...page.sections];
      sections.splice(Math.max(0, Math.min(index ?? sections.length, sections.length)), 0, section);
      return { ...page, sections };
    }) })),
    duplicateSection: (pageId, sectionId) => commit(set, get, (document) => ({ ...document, pages: document.pages.map((page) => {
      if (page.id !== pageId) return page;
      const index = page.sections.findIndex((section) => section.id === sectionId);
      if (index < 0) return page;
      const original = page.sections[index];
      const duplicate: Section = { ...cloneSection(original), name: `${original.name} copy` };
      const sections = [...page.sections]; sections.splice(index + 1, 0, duplicate);
      return { ...page, sections };
    }) })),
    removeSection: (pageId, sectionId) => commit(set, get, (document) => ({ ...document, pages: document.pages.map((page) => page.id === pageId ? { ...page, sections: page.sections.filter((section) => section.id !== sectionId) } : page) })),
    moveSection: (pageId, sectionId, direction) => {
      const page = get().document.pages.find((item) => item.id === pageId);
      if (!page) return;
      const index = page.sections.findIndex((section) => section.id === sectionId);
      get().reorderSection(pageId, sectionId, index + direction);
    },
    reorderSection: (pageId, sectionId, targetIndex) => commit(set, get, (document) => ({ ...document, pages: document.pages.map((page) => {
      if (page.id !== pageId) return page;
      const sections = [...page.sections];
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0 || targetIndex < 0 || targetIndex >= sections.length || index === targetIndex) return page;
      const [section] = sections.splice(index, 1); sections.splice(targetIndex, 0, section);
      return { ...page, sections };
    }) })),
    updateSection: (pageId, sectionId, update, group) => commit(set, get, (document) => mapSection(document, pageId, sectionId, update), group),
    insertSection: (pageId, section, index) => commit(set, get, (document) => ({ ...document, pages: document.pages.map((page) => {
      if (page.id !== pageId) return page;
      const sections = [...page.sections];
      sections.splice(Math.max(0, Math.min(index, sections.length)), 0, structuredClone(section));
      return { ...page, sections };
    }) })),
    updateSectionContent: (pageId, sectionId, content, group) => commit(set, get, (document) => mapSection(document, pageId, sectionId, (section) => ({
      ...section, content,
      columns: section.columns?.map((column, columnIndex) => columnIndex === 0 ? { ...column, elements: column.elements.map((element, elementIndex) => element.type === 'block' && elementIndex === 0 ? { ...element, content: { blockType: section.type, ...structuredClone(content) } } : element) } : column),
    })), group),
    insertColumn: (pageId, sectionId, column, index) => commit(set, get, (document) => mapSection(document, pageId, sectionId, (section) => {
      const columns = [...(section.columns || [])];
      columns.splice(Math.max(0, Math.min(index, columns.length)), 0, structuredClone(column));
      return { ...section, columns };
    })),
    moveColumn: (pageId, sectionId, columnId, targetIndex) => commit(set, get, (document) => mapSection(document, pageId, sectionId, (section) => {
      const columns = [...(section.columns || [])];
      const from = columns.findIndex((column) => column.id === columnId);
      if (from < 0 || targetIndex < 0 || targetIndex >= columns.length || from === targetIndex) return section;
      const [column] = columns.splice(from, 1); columns.splice(targetIndex, 0, column);
      return { ...section, columns };
    })),
    resizeColumn: (pageId, sectionId, columnId, device, width) => commit(set, get, (document) => mapColumn(document, pageId, sectionId, columnId, (column) => ({ ...column, width: { ...column.width, [device]: Math.max(1, Math.min(12, Math.round(width))) } }))),
    insertElement: (pageId, sectionId, columnId, element, index) => commit(set, get, (document) => mapColumn(document, pageId, sectionId, columnId, (column) => {
      const elements = [...column.elements];
      elements.splice(Math.max(0, Math.min(index, elements.length)), 0, structuredClone(element));
      return { ...column, elements };
    })),
    moveElement: (pageId, fromSectionId, fromColumnId, elementId, toSectionId, toColumnId, targetIndex) => commit(set, get, (document) => {
      const page = document.pages.find((entry) => entry.id === pageId);
      const fromSection = page?.sections.find((section) => section.id === fromSectionId);
      const toSection = page?.sections.find((section) => section.id === toSectionId);
      if (!page || !fromSection || !toSection) return document;
      const fromColumn = fromSection.columns?.find((column) => column.id === fromColumnId);
      const toColumn = toSection.columns?.find((column) => column.id === toColumnId);
      const elementIndex = fromColumn?.elements.findIndex((element) => element.id === elementId) ?? -1;
      if (!fromColumn || !toColumn || elementIndex < 0) return document;
      const element = fromColumn.elements[elementIndex];
      if (fromSectionId === toSectionId) {
        const columns = (fromSection.columns || []).map((column) => ({ ...column, elements: [...column.elements] }));
        const from = columns.find((column) => column.id === fromColumnId);
        const to = columns.find((column) => column.id === toColumnId);
        if (!from || !to) return document;
        const [moved] = from.elements.splice(elementIndex, 1);
        to.elements.splice(Math.max(0, Math.min(targetIndex, to.elements.length)), 0, moved);
        return { ...document, pages: document.pages.map((entry) => entry.id !== pageId ? entry : { ...entry, sections: entry.sections.map((section) => section.id === fromSectionId ? { ...section, columns } : section) }) };
      }
      const pages = document.pages.map((entry) => {
        if (entry.id !== pageId) return entry;
        return { ...entry, sections: entry.sections.map((section) => {
          if (section.id === fromSectionId) return { ...section, columns: (section.columns || []).map((column) => column.id === fromColumnId ? { ...column, elements: column.elements.filter((_, index) => index !== elementIndex) } : column) };
          if (section.id === toSectionId) return { ...section, columns: (section.columns || []).map((column) => column.id === toColumnId ? { ...column, elements: [...column.elements.slice(0, Math.max(0, targetIndex)), element, ...column.elements.slice(Math.max(0, targetIndex))] } : column) };
          return section;
        }) };
      });
      return { ...document, pages };
    }),
    duplicateElement: (pageId, sectionId, columnId, elementId) => commit(set, get, (document) => mapColumn(document, pageId, sectionId, columnId, (column) => {
      const index = column.elements.findIndex((element) => element.id === elementId);
      if (index < 0) return column;
      const elements = [...column.elements];
      const element = structuredClone(elements[index]);
      element.id = makeId(element.type);
      elements.splice(index + 1, 0, element);
      return { ...column, elements };
    })),
    deleteElement: (pageId, sectionId, columnId, elementId) => commit(set, get, (document) => mapColumn(document, pageId, sectionId, columnId, (column) => ({ ...column, elements: column.elements.filter((element) => element.id !== elementId) }))),
    updateElement: (pageId, sectionId, columnId, elementId, update, group) => commit(set, get, (document) => mapSection(document, pageId, sectionId, (section) => {
      const column = section.columns?.find((entry) => entry.id === columnId);
      const currentElement = column?.elements.find((entry) => entry.id === elementId);
      if (!currentElement) return section;
      const nextElement = update(currentElement);
      const columns = (section.columns || []).map((entry) => entry.id !== columnId ? entry : ({ ...entry, elements: entry.elements.map((element) => element.id === elementId ? nextElement : element) }));
      const isSectionRendererElement = section.type !== 'custom' && section.columns?.[0]?.id === columnId && column?.elements[0]?.id === elementId && currentElement.type === 'block';
      if (!isSectionRendererElement) return { ...section, columns };
      const content = { ...nextElement.content };
      delete content.blockType;
      return { ...section, content, columns };
    }), group),
    addPage: (title, sections) => {
      const current = get().document;
      const slug = uniqueSlug(title, current.pages);
      const id = `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      commit(set, get, (document) => ({ ...document, pages: [...document.pages, { id, slug: `/${slug}`, title, isHome: false, showInMenu: true, seo: { title, description: '', ogImage: '', noindex: false }, sections: structuredClone(sections), elements: [], useSharedHeader: true, useSharedFooter: true, oldSlugs: [] }], menu: [...document.menu, { id: `menu-${id}`, label: title, target: { type: 'page', value: id }, newTab: false }] }));
      return id;
    },
    duplicatePage: (pageId) => {
      const current = get().document;
      const source = current.pages.find((page) => page.id === pageId);
      if (!source) return null;
      const id = `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const title = `${source.title} copy`;
      const slug = uniqueSlug(title, current.pages);
      commit(set, get, (document) => ({ ...document, pages: [...document.pages, { ...structuredClone(source), id, slug: `/${slug}`, title, isHome: false, oldSlugs: [] }], menu: source.showInMenu ? [...document.menu, { id: `menu-${id}`, label: title, target: { type: 'page', value: id }, newTab: false }] : document.menu }));
      return id;
    },
    renamePage: (pageId, title) => commit(set, get, (document) => ({ ...document, pages: document.pages.map((page) => page.id === pageId ? { ...page, title, seo: { ...page.seo, title: page.seo.title === page.title ? title : page.seo.title } } : page), menu: document.menu.map((item) => item.target.type === 'page' && item.target.value === pageId ? { ...item, label: title } : item) })),
    setPageSlug: (pageId, rawSlug) => {
      const current = get().document;
      const page = current.pages.find((entry) => entry.id === pageId);
      if (!page || page.isHome) return page?.slug || '/';
      const slug = uniqueSlug(rawSlug, current.pages, pageId);
      commit(set, get, (document) => ({ ...document, pages: document.pages.map((entry) => entry.id === pageId ? { ...entry, slug: `/${slug}`, oldSlugs: entry.slug === `/${slug}` ? entry.oldSlugs : [...entry.oldSlugs, entry.slug] } : entry) }));
      return `/${slug}`;
    },
    removePage: (pageId) => {
      const current = get().document;
      if (current.pages.length <= 1 || current.pages.find((page) => page.id === pageId)?.isHome) return false;
      commit(set, get, (document) => ({ ...document, pages: document.pages.filter((page) => page.id !== pageId), menu: document.menu.filter((item) => item.target.type !== 'page' || item.target.value !== pageId) }));
      return true;
    },
    reorderPage: (pageId, targetIndex) => commit(set, get, (document) => {
      const pages = [...document.pages];
      const index = pages.findIndex((page) => page.id === pageId);
      if (index < 0 || targetIndex < 0 || targetIndex >= pages.length || index === targetIndex) return document;
      const [page] = pages.splice(index, 1); pages.splice(targetIndex, 0, page);
      return { ...document, pages };
    }),
    setHomePage: (pageId) => commit(set, get, (document) => {
      const home = document.pages.find((page) => page.id === pageId);
      if (!home) return document;
      const oldHome = document.pages.find((page) => page.isHome);
      if (!oldHome || oldHome.id === pageId) return document;
      const oldHomeId = oldHome.id;
      const newHomeSlug = uniqueSlug(oldHome.slug.replace(/^\//, '') || oldHome.title, document.pages, pageId);
      const pages = document.pages.map((page) => page.id === pageId
        ? { ...page, id: oldHomeId, isHome: true, slug: '/', showInMenu: false }
        : page.id === oldHomeId
          ? { ...page, id: pageId, isHome: false, slug: `/${newHomeSlug}`, showInMenu: true }
          : page);
      const menu = document.menu
        .filter((item) => item.target.type !== 'page' || item.target.value !== pageId)
        .map((item) => item.target.type === 'page' && item.target.value === oldHomeId
          ? { ...item, target: { ...item.target, value: pageId }, label: oldHome.title }
          : item);
      if (!menu.some((item) => item.target.type === 'page' && item.target.value === pageId)) {
        menu.push({ id: `menu-${pageId}`, label: oldHome.title, target: { type: 'page', value: pageId }, newTab: false });
      }
      return { ...document, pages, menu };
    }),
    setMenu: (menu: MenuItem[]) => commit(set, get, (document) => ({
      ...document,
      menu,
      pages: document.pages.map((page) => page.isHome ? page : ({ ...page, showInMenu: menu.some((item) => item.target.type === 'page' && item.target.value === page.id) })),
    })),
    setSaveStatus: (saveStatus, lastSavedAt) => set((state) => ({ ...state, saveStatus, lastSavedAt: lastSavedAt ?? state.lastSavedAt })),
    setVersions: (versions) => set({ versions: versions.slice(-20) }),
    captureVersion: (label, document = get().document) => {
      const version: SiteVersion = { id: `version-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label, createdAt: new Date().toISOString(), document: structuredClone(document) };
      set((state) => ({ versions: [...state.versions, version].slice(-20) }));
      return version;
    },
    restoreVersion: (versionId) => {
      const version = get().versions.find((entry) => entry.id === versionId);
      if (!version) return false;
      lastGroup = ''; lastEditAt = 0;
      commit(set, get, () => structuredClone(version.document));
      return true;
    },
    undo: () => { lastGroup = ''; lastEditAt = 0; set((state) => {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      // isRestoring=true prevents the sync useEffect in the editor from re-committing the restored state as a new undo step
      return { document: previous, past: state.past.slice(0, -1), future: [state.document, ...state.future], saveStatus: 'unsaved', isRestoring: true };
    }); },
    redo: () => { lastGroup = ''; lastEditAt = 0; set((state) => {
      if (!state.future.length) return state;
      const [next, ...future] = state.future;
      return { document: next, past: [...state.past, state.document].slice(-50), future, saveStatus: 'unsaved', isRestoring: true };
    }); },
    clearRestoring: () => set({ isRestoring: false }),
    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,
  }));
}

export type EditorStore = ReturnType<typeof createEditorStore>;
