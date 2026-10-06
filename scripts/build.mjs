import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, routes, t, esc, route, image, button, request } from '../content/pages.mjs';

// Always rebuild this project's generated output, even when invoked from another cwd.
process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const origin = (process.env.HELLWEG_PUBLIC_ORIGIN || 'https://www.hellweg.eu').replace(/\/$/, '');
if (new URL(origin).protocol !== 'https:') throw new Error('Public origin must use HTTPS');
const indexing = process.env.HELLWEG_INDEXING === 'enabled';
const preview = process.env.HELLWEG_PREVIEW !== 'disabled';
const brand = lang => `<a class="brand" href="${route('home', lang)}" aria-label="HELLWEG — ${t(lang, 'Startseite', 'Home')}">${image('hellweg-h.png', '', true)}<span class="brand-word"><strong>HELLWEG</strong><small>Protect tomorrow, secure today.</small></span></a>`;
const navLabels = { products: ['Produkte', 'Products'], government: ['Law Enforcement & Defence', 'Law Enforcement & Defence'], manufacturing: ['Fertigung', 'Manufacturing'], oem: ['OEM & Distribution', 'OEM & Distribution'] };
const header = (key, lang) => `<a class="skip-link" href="#main">${t(lang, 'Zum Inhalt', 'Skip to content')}</a>
${preview ? `<div class="review-banner">${t(lang, 'Relaunch-Vorschau · noch nicht auf hellweg.eu veröffentlicht', 'Relaunch preview · not yet published on hellweg.eu')} <a href="/review/">${t(lang, 'Interne Freigabe', 'Internal review (DE)')}</a></div>` : ''}
<header class="site-header"><div class="shell header-inner">${brand(lang)}<button class="menu-toggle" aria-controls="main-nav" aria-expanded="false">${t(lang, 'Menü', 'Menu')}</button><nav id="main-nav" aria-label="${t(lang, 'Hauptnavigation', 'Main navigation')}"><div class="nav-links">${Object.entries(navLabels).map(([page, labels]) => `<a href="${route(page, lang)}"${key === page ? ' class="active" aria-current="page"' : ''}>${esc(labels[lang === 'de' ? 0 : 1])}</a>`).join('')}<a class="nav-cta${key === 'contact' ? ' active' : ''}" href="${route('contact', lang)}"${key === 'contact' ? ' aria-current="page"' : ''}>${t(lang, 'Kontakt', 'Contact')} ↗</a></div><div class="language-switch" aria-label="${t(lang, 'Sprache', 'Language')}">${['de', 'en'].map(l => `<a lang="${l}" hreflang="${l}" href="${route(key, l)}" ${lang === l ? 'class="active" aria-current="true"' : ''}>${l.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>')}</div></nav></div></header>`;
const footer = lang => `<footer class="site-footer"><div class="shell footer-grid"><div class="footer-brand">${brand(lang)}<p>${t(lang, 'Modellgenaue Holster und Tragesysteme. Individuelle Fertigung. Direkte Abstimmung.', 'Model-specific holsters and carrying systems. Individual manufacturing. Direct consultation.')}</p></div><div class="footer-column"><h3>${t(lang, 'Entdecken', 'Explore')}</h3><a href="${route('products', lang)}">${t(lang, 'Produkte & Kompatibilität', 'Products & compatibility')}</a><a href="${route('government', lang)}">Law Enforcement &amp; Defence</a><a href="${route('manufacturing', lang)}">${t(lang, 'Fertigung & Unternehmen', 'Manufacturing & company')}</a><a href="${route('oem', lang)}">OEM &amp; Distribution</a></div><div class="footer-column"><h3>${t(lang, 'Direkter Kontakt', 'Direct contact')}</h3><a href="mailto:info@hellweg.eu">info@hellweg.eu</a><a href="${request(lang, 'rfq')}">${t(lang, 'Beschaffung / RFQ', 'Procurement / RFQ')}</a><a href="${request(lang, 'custom')}">${t(lang, 'Individuelles Holster', 'Custom holster')}</a><p>Hellweg GmbH<br>Auelsweg 22<br>53797 Lohmar · Germany</p></div><div class="footer-column"><h3>${t(lang, 'Informationen', 'Information')}</h3><a href="${route('legal', lang)}">${t(lang, 'Impressum', 'Legal notice')}</a><a href="${route('privacy', lang)}">${t(lang, 'Datenschutz', 'Privacy')}</a><span>${t(lang, 'Deutsch / English', 'English / Deutsch')}</span></div></div><div class="shell footer-bottom"><span>© ${new Date().getFullYear()} Hellweg GmbH · HELLWEG®</span><span>${t(lang, 'Produktabbildungen zeigen Beispielkonfigurationen.', 'Product photographs show example configurations.')}</span></div></footer>`;
const titles = {
 home: ['HELLWEG – Individuelle Holster & Tragesysteme', 'HELLWEG — Custom Holsters & Carrying Systems'],
 products: ['Holster, Dienstsysteme & Magazinhalter | HELLWEG', 'Holsters, Duty Systems & Magazine Carriers | HELLWEG'],
 government: ['Behördenholster & Beschaffung | HELLWEG', 'Law Enforcement & Government Procurement | HELLWEG'],
 manufacturing: ['Individuelle Holsterfertigung & Unternehmen | HELLWEG', 'Individual Holster Manufacturing & Company | HELLWEG'],
 oem: ['OEM & Distribution – Partneranfragen | HELLWEG', 'OEM & Distribution — Partnership Enquiries | HELLWEG'],
 contact: ['Kontakt – Ausschreibung, RFQ & Holsteranfrage | HELLWEG', 'Contact — Tender, RFQ & Holster Enquiries | HELLWEG'],
 legal: ['Impressum | HELLWEG', 'Legal Notice | HELLWEG'], privacy: ['Datenschutz | HELLWEG', 'Privacy | HELLWEG']
};
const descriptions = {
 home: ['Individuell gefertigte Holster und Magazinhalter von HELLWEG. Persönliche Abstimmung für Behörden, Ausrüster und individuelle Anwender.', 'Custom holsters and magazine carriers from HELLWEG. Direct consultation for government agencies, equipment suppliers and individual users.'],
 products: ['Holster für Glock, Walther, SIG Sauer, CZ und weitere Modelle. Entdecken Sie Duty-Systeme, individuelle Gestaltungen und Magazinhalter.', 'Holsters for Glock, Walther, SIG Sauer, CZ and other models. Explore duty systems, custom finishes and magazine carriers.'],
 government: ['Holster für Law Enforcement, Defence und Government. Klären Sie Modell, Ausstattung und Beschaffungsbedarf direkt mit HELLWEG.', 'Holsters for law enforcement, defence and government. Discuss model, equipment and procurement requirements directly with HELLWEG.'],
 manufacturing: ['Modellgenaue Holsterfertigung und persönliche Konfiguration. Lernen Sie Hellweg GmbH und die Familientradition kennen.', 'Model-specific holster manufacturing and personal configuration. Discover Hellweg GmbH and its family tradition.'],
 oem: ['Partneranfragen für OEM und Distribution: Holster, Tragesysteme, Zielmärkte und Projektanforderungen mit HELLWEG besprechen.', 'OEM and distribution enquiries: discuss holsters, carrying systems, target markets and project requirements with HELLWEG.'],
 contact: ['Ihr direkter Kontakt zu HELLWEG für Beschaffung, technische Informationen, Partnerprojekte und individuelle Holster.', 'Your direct contact to HELLWEG for procurement, technical information, partnerships and custom holsters.'],
 legal: ['Unternehmens- und Kontaktangaben der Hellweg GmbH.', 'Company and contact details for Hellweg GmbH.'],
 privacy: ['Informationen zur Verarbeitung personenbezogener Daten und Kontaktanfragen bei HELLWEG.', 'Information about personal data processing and contact enquiries at HELLWEG.']
};

// dist is disposable generated output. Owner review must never enter a public build.
await rm(path.resolve('dist'), { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true, filter: source => preview || !source.split(path.sep).includes('review') });
for (const [key, render] of Object.entries(pages)) {
 for (const lang of ['de', 'en']) {
  const i = lang === 'de' ? 0 : 1;
  const location = route(key, lang);
  const organisation = key === 'home' ? `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'Hellweg GmbH',url:origin,email:'info@hellweg.eu',logo:origin+'/assets/hellweg-h.png',address:{'@type':'PostalAddress',streetAddress:'Auelsweg 22',postalCode:'53797',addressLocality:'Lohmar',addressCountry:'DE'}}).replaceAll('<', '\\u003c')}</script>` : '';
  const html = `<!doctype html>\n<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="${indexing ? 'index,follow' : 'noindex,nofollow'}"><title>${esc(titles[key][i])}</title><meta name="description" content="${esc(descriptions[key][i])}"><link rel="canonical" href="${origin}${location}"><link rel="alternate" hreflang="de" href="${origin}${route(key, 'de')}"><link rel="alternate" hreflang="en" href="${origin}${route(key, 'en')}"><link rel="alternate" hreflang="x-default" href="${origin}${route(key, 'de')}"><meta property="og:title" content="${esc(titles[key][i])}"><meta property="og:description" content="${esc(descriptions[key][i])}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${location}"><meta property="og:image" content="${origin}/assets/duty-hero.webp"><meta property="og:locale" content="${lang === 'de' ? 'de_DE' : 'en_GB'}"><meta name="theme-color" content="#101a17"><link rel="icon" type="image/png" href="/assets/hellweg-h.png"><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script>${organisation}</head><body>${header(key, lang)}<main id="main">${render(lang, { preview })}</main>${footer(lang)}</body></html>`;
  const dir = path.join('dist', location);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
 }
}
await writeFile('dist/robots.txt', indexing ? `User-agent: *\nAllow: /\nDisallow: /review/\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(routes).flat().map(p => `<url><loc>${esc(origin+p)}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/404.html', `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><title>Seite nicht gefunden | HELLWEG</title><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head><body>${header('home', 'de')}<main id="main"><section class="shell page-intro"><span class="eyebrow">404 / NOT FOUND</span><h1>Diese Seite gibt es nicht.</h1><p class="page-lede">This page could not be found.</p><div class="actions">${button('Zur Startseite', '/')}${button('English home', '/en/', true)}</div></section></main>${footer('de')}</body></html>`);
console.log(`Built ${Object.keys(pages).length*2} bilingual pages. Preview: ${preview}. Indexing: ${indexing}.`);
