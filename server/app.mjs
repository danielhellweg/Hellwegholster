import express from 'express';
import path from 'node:path';
import { ContactError, MAX_TOTAL_SIZE, createUpload, smtpConfig, validateFields, sendContact } from './contact.mjs';

const pagePaths = ['/', '/en/', '/produkte/', '/en/products/', '/government/', '/en/government/', '/fertigung/', '/en/manufacturing/', '/oem-distribution/', '/en/oem-distribution/', '/kontakt/', '/en/contact/', '/impressum/', '/en/legal/', '/datenschutz/', '/en/privacy/'];
const legacy = { '/products': '/produkte/', '/contact': '/kontakt/', '/manufacturing': '/fertigung/', '/legal': '/impressum/', '/privacy': '/datenschutz/' };

export function createApp({ env = process.env, transport, publicDir = path.resolve('dist'), rateLimit = 12, rateWindow = 15 * 60000 } = {}) {
  const app = express(), config = smtpConfig(env), upload = createUpload(), visitors = new Map();
  const configuredOrigins = [env.PUBLIC_ORIGIN || 'https://www.hellweg.eu', ...(env.CONTACT_ALLOWED_ORIGINS || '').split(',')];
  const origins = new Set(configuredOrigins.filter(Boolean).map(value => new URL(value.trim()).origin));
  let inFlight = 0;
  app.disable('x-powered-by');
  app.set('trust proxy', Number(env.TRUST_PROXY || 1));
  app.use((_req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'" });
    next();
  });
  app.get('/healthz', (_req, res) => res.set('Cache-Control', 'no-store').json({ ok: true, contactReady: Boolean(config) }));
  app.post('/api/contact', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const origin = req.get('Origin');
    if (!origin || !origins.has(origin) || (req.get('Sec-Fetch-Site') && !['same-origin', 'none'].includes(req.get('Sec-Fetch-Site')))) return next(new ContactError(403, 'origin_not_allowed'));
    if (!req.is('multipart/form-data')) return next(new ContactError(415, 'multipart_required'));
    const boundary = /;\s*boundary=(?:"([^"]+)"|([^;\s]+))/i.exec(req.get('Content-Type'));
    if (!boundary || (boundary[1] || boundary[2]).length > 70 || /[^\x20-\x7e]/.test(boundary[1] || boundary[2])) return next(new ContactError(400, 'invalid_request'));
    const now = Date.now(), ip = req.ip || 'unknown';
    if (visitors.size >= 5000) for (const [key, value] of visitors) { if (value.until <= now) visitors.delete(key); }
    const recent = visitors.get(ip);
    if (!recent || recent.until <= now) visitors.set(ip, { count: 1, until: now + rateWindow });
    else if (++recent.count > rateLimit) { res.set('Retry-After', String(Math.ceil((recent.until - now) / 1000))); return next(new ContactError(429, 'too_many_requests')); }
    if (visitors.size > 5000 || inFlight >= 8) return next(new ContactError(503, 'temporarily_unavailable'));
    if (!config) return next(new ContactError(503, 'mail_not_configured'));
    if (Number(req.get('Content-Length') || 0) > MAX_TOTAL_SIZE + 128 * 1024) return next(new ContactError(413, 'attachments_too_large'));
    inFlight++;
    let released = false, processing = false;
    const release = () => { if (!released) { inFlight--; released = true; } };
    res.once('close', () => { if (!processing) release(); });
    upload(req, res, async error => {
      processing = true;
      try {
        if (error) throw error instanceof ContactError || String(error.code || '').startsWith('LIMIT_') ? error : new ContactError(400, 'invalid_request');
        const data = validateFields(req.body);
        await sendContact({ data, files: req.files || [], config, transport });
        res.status(200).json({ ok: true, message: 'Anfrage vom Mailserver angenommen.' });
      } catch (error) { next(error); }
      finally { for (const file of req.files || []) { file.buffer?.fill(0); delete file.buffer; } release(); }
    });
  });
  app.all('/api/contact', (_req, res) => res.set('Allow', 'POST').status(405).json({ ok: false, code: 'method_not_allowed' }));
  app.use('/api', (_req, res) => res.status(404).json({ ok: false, code: 'not_found' }));
  app.use((req, res, next) => {
    if (!['GET', 'HEAD'].includes(req.method)) return next();
    const target = legacy[req.path.replace(/\/+$/, '')] || (pagePaths.includes(req.path + '/') ? req.path + '/' : null);
    if (target) return res.redirect(308, target + req.url.slice(req.path.length));
    next();
  });
  app.use(express.static(publicDir, { index: 'index.html', redirect: false, dotfiles: 'deny', maxAge: '1h', setHeaders(res, file) { if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); } }));
  app.use((_req, res) => { res.status(404).set('X-Robots-Tag', 'noindex, follow').sendFile(path.join(publicDir, '404.html')); });
  app.use((error, _req, res, _next) => {
    if (res.headersSent) return res.end();
    const uploadError = String(error.code || '').startsWith('LIMIT_');
    const status = error instanceof ContactError ? error.status : uploadError ? (error.code === 'LIMIT_FILE_SIZE' ? 413 : 422) : error.status === 400 ? 400 : 502;
    const code = error instanceof ContactError ? error.code : uploadError ? 'upload_limit' : error.status === 400 ? 'invalid_request' : 'mail_unavailable';
    res.status(status).set('Cache-Control', 'no-store').json({ ok: false, code });
  });
  return app;
}
