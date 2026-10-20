import assert from 'node:assert/strict';
import test from 'node:test';
import { createSiteDocument, makeSection, migrateSiteDocument } from '../src/lib/siteDocument.ts';
import { createEditorStore } from '../src/store/editorStore.ts';

function fixture() {
  return createSiteDocument({
    id: 'test-site', name: 'Test Site', templateId: 'test',
    theme: { primaryColor: '#ff5588', bgColor: '#fff', textColor: '#111', fontFamily: 'Inter, sans-serif', borderRadius: '16px' },
    sections: [makeSection('hero', 'hero', 'Hero'), makeSection('features', 'features', 'Features')],
    hero: { title: 'Hello', description: 'Intro' }, features: [], testimonials: [],
    cta: { title: 'Next', desc: 'Start', buttonText: 'Go' },
  });
}

test('document edits are undoable and redoable', () => {
  const store = createEditorStore(fixture());
  store.getState().setTheme({ ...store.getState().document.theme, primaryColor: '#123456' });
  assert.equal(store.getState().document.theme.primaryColor, '#123456');
  store.getState().undo();
  assert.equal(store.getState().document.theme.primaryColor, '#ff5588');
  store.getState().redo();
  assert.equal(store.getState().document.theme.primaryColor, '#123456');
});

test('sections can be duplicated, reordered, and removed', () => {
  const store = createEditorStore(fixture());
  store.getState().duplicateSection('home', 'hero');
  let sections = store.getState().document.pages[0].sections;
  assert.equal(sections.length, 3);
  const duplicateId = sections[1].id;
  store.getState().reorderSection('home', duplicateId, 2);
  sections = store.getState().document.pages[0].sections;
  assert.equal(sections[2].id, duplicateId);
  store.getState().removeSection('home', duplicateId);
  assert.equal(store.getState().document.pages[0].sections.length, 2);
});

test('page CRUD enforces unique slugs and keeps a home page', () => {
  const store = createEditorStore(fixture());
  const firstId = store.getState().addPage('About', [makeSection('hero', 'about-hero')]);
  const secondId = store.getState().addPage('About', [makeSection('hero', 'about-hero-2')]);
  assert.notEqual(store.getState().document.pages.find((page) => page.id === firstId)?.slug, store.getState().document.pages.find((page) => page.id === secondId)?.slug);
  assert.equal(store.getState().setPageSlug(firstId, 'pricing'), '/pricing');
  assert.equal(store.getState().setPageSlug(secondId, 'pricing'), '/pricing-2');
  assert.equal(store.getState().removePage('home'), false);
  assert.equal(store.getState().removePage(firstId), true);
});

test('changing the home page preserves both pages and updates navigation targets', () => {
  const store = createEditorStore(fixture());
  const aboutId = store.getState().addPage('About', [makeSection('hero', 'about-hero')]);
  store.getState().setHomePage(aboutId);
  const doc = store.getState().document;
  const home = doc.pages.find((page) => page.isHome);
  const oldHome = doc.pages.find((page) => page.id === aboutId);
  assert.equal(home?.id, 'home');
  assert.equal(home?.title, 'About');
  assert.equal(oldHome?.isHome, false);
  assert.equal(oldHome?.slug, '/home-page');
  assert.ok(doc.menu.some((item) => item.target.type === 'page' && item.target.value === aboutId));
});

test('legacy drafts migrate content, section order, spacing, assets, and pages', () => {
  const migrated = migrateSiteDocument({
    siteName: 'Old Store', templateId: 'legacy',
    sections: [{ id: 'hero', name: 'Hero', type: 'hero' }],
    sectionSpacing: { hero: { top: 24, bottom: 32 } },
    heroContent: { title: 'Old headline', description: 'Saved copy' },
    assetUrl: 'data:image/png;base64,AA==',
    sitePages: [{ id: 'home', title: 'Home', description: 'Welcome' }, { id: 'about', title: 'About', description: 'Our story' }],
  }, fixture());
  assert.equal(migrated.version, 1);
  assert.equal(migrated.name, 'Old Store');
  assert.equal(migrated.content.hero.title, 'Old headline');
  assert.equal(migrated.pages[0].sections[0].style.padding?.top, 24);
  assert.equal(migrated.pages[1].slug, '/about');
  assert.equal(migrated.assets[0].src, 'data:image/png;base64,AA==');
});

test('versioned documents load without losing page and theme data', () => {
  const original = fixture();
  original.pages[0].title = 'Landing';
  original.theme.primaryColor = '#336699';
  const migrated = migrateSiteDocument(original, fixture());
  assert.equal(migrated.pages[0].title, 'Landing');
  assert.equal(migrated.theme.primaryColor, '#336699');
});
