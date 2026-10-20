import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveButtonHref } from '../src/lib/elementActions.ts';

const pages = [
  { id: 'home', slug: '/', isHome: true },
  { id: 'about', slug: '/about-us', isHome: false },
];

test('button target mapping resolves page, anchor, email, phone, and URL actions', () => {
  assert.equal(resolveButtonHref('page', 'about', pages), '/about-us');
  assert.equal(resolveButtonHref('page', 'home', pages, '/live/store'), '/live/store');
  assert.equal(resolveButtonHref('anchor', '#contact', pages), '#contact');
  assert.equal(resolveButtonHref('email', 'team@example.com', pages), 'mailto:team@example.com');
  assert.equal(resolveButtonHref('phone', '+1 555 123', pages), 'tel:+1 555 123');
  assert.equal(resolveButtonHref('url', 'example.com', pages), 'https://example.com');
  assert.equal(resolveButtonHref('url', 'javascript:alert(1)', pages), '#');
});
