import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveLiveNavigationHref } from '../src/lib/liveNavigation.ts';

const pages = [
  { id: 'home', title: 'Fresh Crate', slug: '/', isHome: true },
  { id: 'shop', title: 'Shop', slug: '/shop' },
  { id: 'recipes', title: 'Recipes', slug: '/recipes' },
];

test('live navigation always stays on the selected storefront route', () => {
  assert.equal(
    resolveLiveNavigationHref({ target: { type: 'anchor', value: 'home-recipes' } }, pages, 'fresh-crate', false),
    '/live/fresh-crate#home-recipes',
  );
  assert.equal(
    resolveLiveNavigationHref({ target: { type: 'page', value: 'recipes' } }, pages, 'fresh-crate', false),
    '/live/fresh-crate/recipes',
  );
  assert.equal(
    resolveLiveNavigationHref({ target: { type: 'page', value: 'home' } }, pages, 'fresh-crate', true),
    '/live/fresh-crate?preview=1',
  );
});

test('external navigation targets remain external', () => {
  assert.equal(
    resolveLiveNavigationHref({ target: { type: 'url', value: 'https://example.com' } }, pages, 'fresh-crate', false),
    'https://example.com',
  );
});
