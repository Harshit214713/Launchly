import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { createSiteDocument, makeSection } from '../src/lib/siteDocument.ts';
import { exportSiteDocumentZip } from '../src/lib/siteZipExport.ts';

test('site export includes editable pages, SEO routes, and local uploaded media', async () => {
  const document = createSiteDocument({
    id: 'sample',
    name: 'Sample Site',
    templateId: 'sample',
    theme: { primaryColor: '#ff5588' },
    sections: [{ id: 'hero', name: 'Hero', type: 'hero', content: { title: 'Welcome' } }],
    hero: { title: 'Welcome', description: 'Home page' },
    features: [],
    testimonials: [],
    cta: { title: 'Start', desc: 'Now', buttonText: 'Go' },
    pages: [{ id: 'about', title: 'About', description: 'About page' }],
    logoUrl: 'data:image/png;base64,aGVsbG8=',
  });
  document.pages[1].sections = [makeSection('faq', 'about-faq', 'Questions', {}, { heading: 'Questions', items: [{ question: 'What?', answer: 'This.' }] })];

  const blob = await exportSiteDocumentZip(document);
  const zip = await JSZip.loadAsync(new Uint8Array(await blob.arrayBuffer()));
  assert.ok(zip.file('sample-site/src/app/page.tsx'));
  assert.ok(zip.file('sample-site/src/app/about/page.tsx'));
  assert.ok(zip.file('sample-site/src/app/sitemap.ts'));
  assert.ok(zip.file('sample-site/src/app/robots.ts'));
  assert.ok(zip.file('sample-site/public/assets/media-1.png'));
  const data = await zip.file('sample-site/src/site-data.json').async('string');
  assert.match(data, /"title": "About"/);
  assert.doesNotMatch(data, /data:image\/png;base64/);
});
