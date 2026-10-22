import assert from 'node:assert/strict';
import test from 'node:test';
import { getElementAccessibilityProps } from '../src/lib/elementAccessibility.ts';

test('element accessibility settings are mapped to rendered attributes', () => {
  const props = getElementAccessibilityProps({
    id: 'hero',
    type: 'text',
    content: {},
    anchorId: 'our-story',
    a11y: {
      role: 'region',
      title: 'Our story',
      ariaLabel: 'About the company',
      ariaLabelledby: 'story-heading',
      ariaDescribedby: 'story-summary',
      ariaHidden: false,
      ariaLive: 'polite',
      tabIndex: 0,
      lang: 'en',
    },
    advanced: {
      customAttributes: {
        'data-tracking-id': 'story',
        onclick: 'alert(1)',
        'data-long': 'x'.repeat(501),
      },
    },
  });

  assert.deepEqual(props, {
    id: 'our-story',
    role: 'region',
    title: 'Our story',
    'aria-label': 'About the company',
    'aria-labelledby': 'story-heading',
    'aria-describedby': 'story-summary',
    'aria-hidden': false,
    'aria-live': 'polite',
    tabIndex: 0,
    lang: 'en',
    'data-tracking-id': 'story',
  });
});
