const { test, expect } = require('@playwright/test');

const SITE_PAGES = [
  '/',
  '/features.html',
  '/pricing.html',
  '/blog.html',
  '/blog-dceb-framework.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
];

function shouldSkipLink(href) {
  return (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:')
  );
}

test.describe('site links', () => {
  test('public pages load and important links resolve', async ({ page, request, baseURL }) => {
    const discoveredUrls = new Set();
    const checkedHosts = new Set([
      new URL(baseURL).hostname,
      'app.podtrackerpro.com',
    ]);

    for (const path of SITE_PAGES) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response, `expected ${path} to return a response`).not.toBeNull();
      expect(response.status(), `expected ${path} to load successfully`).toBeLessThan(400);

      const pageLinks = await page.locator('a[href]').evaluateAll((anchors, currentUrl) => {
        return anchors.map((anchor) => {
          const href = anchor.getAttribute('href') || '';
          return { href, resolved: new URL(href, currentUrl).href };
        });
      }, new URL(path, baseURL).href);

      for (const { href, resolved } of pageLinks) {
        if (shouldSkipLink(href)) {
          continue;
        }

        const url = new URL(resolved);
        if (checkedHosts.has(url.hostname)) {
          discoveredUrls.add(url.href);
        }
      }
    }

    expect(discoveredUrls.size, 'expected to discover at least one navigable link').toBeGreaterThan(0);

    for (const url of discoveredUrls) {
      const response = await request.get(url, {
        failOnStatusCode: false,
        maxRedirects: 10,
      });

      expect(
        response.status(),
        `expected ${url} to resolve without a client/server error`
      ).toBeLessThan(400);
    }
  });
});
