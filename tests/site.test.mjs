import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(projectDirectory, 'dist');
const routePairs = [
  ['/', '/en/'],
  ['/produkte/', '/en/products/'],
  ['/government/', '/en/government/'],
  ['/fertigung/', '/en/manufacturing/'],
  ['/oem-distribution/', '/en/oem-distribution/'],
  ['/kontakt/', '/en/contact/'],
  ['/impressum/', '/en/legal/'],
  ['/datenschutz/', '/en/privacy/'],
];
const siteRoutes = routePairs.flat();
const documentFor = (route) => join(outputDirectory, route.slice(1), 'index.html');
const read = (file) => readFileSync(file, 'utf8');
const attributesOf = (tag) => Object.fromEntries(
  [...tag.matchAll(/\b([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((match) => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]]),
);
const tagAttributes = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))]
  .map((match) => attributesOf(match[0]));
const filesIn = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? filesIn(path) : [path];
});
const unescape = (value) => value.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');

function localTarget(value, sourceFile) {
  if (!value || value.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return null;
  const pathname = decodeURIComponent(unescape(value).split(/[?#]/, 1)[0]);
  if (!pathname) return null;
  const path = pathname.startsWith('/')
    ? resolve(outputDirectory, `.${pathname}`)
    : resolve(dirname(sourceFile), pathname);
  assert.ok(path === outputDirectory || path.startsWith(`${outputDirectory}${sep}`), `Local reference leaves dist: ${value}`);
  if (existsSync(path) && statSync(path).isDirectory()) return join(path, 'index.html');
  return path;
}

test('The complete German and English route set is built', () => {
  assert.ok(existsSync(outputDirectory), 'dist is missing; run the build before this test suite');
  for (const route of [...siteRoutes, '/review/']) {
    assert.ok(existsSync(documentFor(route)), `Expected route missing: ${route}`);
  }
});

for (const [german, english] of routePairs) {
  for (const [route, counterpart, language] of [[german, english, 'de'], [english, german, 'en']]) {
    test(`${route} has accessible document metadata and one page heading`, () => {
      const html = read(documentFor(route));
      assert.match(html, /^\s*<!doctype html>/i, 'Use the HTML5 doctype');
      const htmlAttributes = tagAttributes(html, 'html')[0];
      assert.equal(htmlAttributes?.lang, language, `Expected lang=${language}`);
      assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, 'Every page needs exactly one h1');
      assert.match(html, /<title>[^<]+<\/title>/i, 'A meaningful title is required');
      assert.match(html, /Protect tomorrow, secure today\./, 'Keep the user-approved slogan');
      assert.doesNotMatch(html, /Protect today, secure tomorrow\./i, 'Do not invert the approved slogan');
      const viewport = tagAttributes(html, 'meta').find((meta) => meta.name === 'viewport');
      assert.ok(viewport?.content?.includes('width=device-width'), 'Responsive viewport is required');
      assert.doesNotMatch(viewport.content, /maximum-scale|user-scalable\s*=\s*no/i, 'Do not prevent zooming');
      const robots = tagAttributes(html, 'meta').filter((meta) => /^(?:robots|googlebot)$/i.test(meta.name ?? ''));
      assert.ok(robots.some((meta) => /\bnoindex\b/i.test(meta.content ?? '')), 'This private review site must use noindex');
    });

    test(`${route} points to its exact German and English counterpart`, () => {
      const html = read(documentFor(route));
      const alternatives = tagAttributes(html, 'link').filter((link) =>
        /\balternate\b/i.test(link.rel ?? '') && ['de', 'en'].includes(link.hreflang),
      );
      assert.equal(alternatives.filter((link) => link.hreflang === 'de').length, 1, 'Exactly one DE hreflang link expected');
      assert.equal(alternatives.filter((link) => link.hreflang === 'en').length, 1, 'Exactly one EN hreflang link expected');
      const paths = alternatives.map((link) => [link.hreflang, new URL(unescape(link.href), 'https://preview.invalid').pathname]);
      assert.ok(paths.some(([lang, path]) => lang === 'de' && path === german), `Missing German counterpart ${german}`);
      assert.ok(paths.some(([lang, path]) => lang === 'en' && path === english), `Missing English counterpart ${english}`);
      const navigationLinks = tagAttributes(html, 'a');
      assert.ok(navigationLinks.some((link) => link.href && new URL(unescape(link.href), 'https://preview.invalid').pathname === counterpart), 'The language switch must link to the equivalent page');
    });

    test(`${route} does not make unverified manufacturing or certification claims`, () => {
      const html = read(documentFor(route));
      const content = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html)
        .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)>/gi, '')
        .replace(/<[^>]+>/g, ' ');
      assert.doesNotMatch(content, /\bMade\s+in\s+Germany\b/i, 'Manufacturing origin requires explicit evidence');
      assert.doesNotMatch(content, /\bISO\s*[- ]?\s*9001\b/i, 'ISO 9001 must not be claimed without evidence');
      assert.doesNotMatch(content, /\bLevel\s*[- ]?\s*3\b/i, 'A retention level must not be claimed without evidence');
    });
  }
}

test('Every HTML link and image points to a complete local file or a meaningful external destination', () => {
  const htmlFiles = filesIn(outputDirectory).filter((file) => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = read(file);
    for (const tag of tagAttributes(html, '(?:a|link|script|img|source)')) {
      const reference = tag.href ?? tag.src;
      if (reference === undefined) continue;
      assert.notEqual(reference.trim(), '', `Empty reference in ${file}`);
      assert.notEqual(reference.trim(), '#', `Placeholder reference in ${file}`);
      assert.doesNotMatch(reference, /^javascript:/i, `JavaScript URL in ${file}`);
      const target = localTarget(reference, file);
      if (target) assert.ok(existsSync(target) && statSync(target).isFile(), `${file}: missing ${reference}`);
    }
    for (const image of tagAttributes(html, 'img')) {
      assert.ok(Object.hasOwn(image, 'alt'), `Every image needs alt text, including empty alt for decoration: ${file}`);
      assert.ok(image.src, `Every image needs a src: ${file}`);
    }
  }
});

test('Private preview robots.txt prevents crawling', () => {
  const robots = read(join(outputDirectory, 'robots.txt'));
  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Disallow:\s*\/\s*(?:\r?\n|$)/i);
  assert.doesNotMatch(robots, /^Allow:\s*\/\s*$/im);
});

test('The sitemap is XML and enumerates both language route sets', () => {
  const sitemap = read(join(outputDirectory, 'sitemap.xml'));
  assert.match(sitemap, /^\s*<\?xml\s+version=["']1\.0["']/i);
  assert.match(sitemap, /<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i);
  assert.match(sitemap, /<\/urlset>\s*$/i);
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => unescape(match[1]));
  assert.equal(new Set(locations).size, locations.length, 'Sitemap entries must be unique');
  for (const route of siteRoutes) {
    assert.ok(locations.some((location) => new URL(location).pathname === route), `Sitemap misses ${route}`);
  }
  assert.ok(locations.every((location) => /^https:\/\//.test(location)), 'Sitemap URLs must use HTTPS');
  assert.ok(locations.every((location) => !new URL(location).pathname.startsWith('/review/')), 'The internal review must not appear in sitemap');
});

test('Preview returns a real 404 for missing assets when SITE_TEST_URL is provided', {
  skip: !process.env.SITE_TEST_URL,
}, async () => {
  const missingAsset = new URL('/assets/hellweg-test-does-not-exist.js', process.env.SITE_TEST_URL);
  const response = await fetch(missingAsset, { signal: AbortSignal.timeout(8000), redirect: 'manual' });
  assert.equal(response.status, 404, 'Missing files must not fall through to an HTML page with 200');
});
