import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.mjs';
import { smtpConfig, attachmentName, validateAttachment, MAX_FILE_SIZE, MAX_TOTAL_SIZE } from '../server/contact.mjs';

const origin = 'https://www.hellweg.eu';
const config = { PUBLIC_ORIGIN: origin, SMTP_HOST: 'smtp.strato.de', SMTP_PORT: '465', SMTP_USER: 'test@example.com', SMTP_PASS: 'test-only-secret', CONTACT_EMAIL: 'info@hellweg.eu' };
const pdf = Buffer.from('%PDF-1.7\nTEST DOCUMENT\n%%EOF\n');
function docxFixture(extraEntry) {
  const files = [
    ['[Content_Types].xml', '<Types><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ['word/document.xml', '<document>Test only</document>'],
    ...(extraEntry ? [[extraEntry, 'test']] : [])
  ];
  const locals = [], central = []; let offset = 0;
  for (const [name, value] of files) {
    const filename = Buffer.from(name), data = Buffer.from(value), local = Buffer.alloc(30), directory = Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50); local.writeUInt16LE(20, 4); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(filename.length, 26);
    directory.writeUInt32LE(0x02014b50); directory.writeUInt16LE(20, 4); directory.writeUInt16LE(20, 6); directory.writeUInt32LE(data.length, 20); directory.writeUInt32LE(data.length, 24); directory.writeUInt16LE(filename.length, 28); directory.writeUInt32LE(offset, 42);
    locals.push(local, filename, data); central.push(directory, filename); offset += local.length + filename.length + data.length;
  }
  const table = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(table.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, table, end]);
}
function payload(overrides = {}, files = []) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ type: 'rfq', name: 'Test person', email: 'request@example.com', message: 'TEST only: requirements', ...overrides })) form.append(key, value);
  for (const file of files) form.append('documents', new Blob([file.content], { type: file.type || 'application/pdf' }), file.name || 'specification.pdf');
  return form;
}
async function running(t, options = {}) {
  const messages = [];
  const transport = options.transport || { async sendMail(message) { messages.push({ ...message, attachments: message.attachments.map(a => ({ ...a, content: Buffer.from(a.content) })) }); return { accepted: ['info@hellweg.eu'] }; } };
  const app = createApp({ env: config, transport, publicDir: new URL('../dist/', import.meta.url).pathname, ...options });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const address = `http://127.0.0.1:${server.address().port}`;
  const submit = (body = payload(), headers = {}) => fetch(`${address}/api/contact`, { method: 'POST', headers: { Origin: origin, ...headers }, body });
  return { address, submit, messages };
}

test('SMTP configuration supports existing variable aliases and rejects absent or placeholder credentials', () => {
  assert.equal(smtpConfig({ ...config, SMTP_USER: '', SMTP_USERNAME: 'alias@example.com', SMTP_PASS: '', SMTP_PASSWORD: 'test-secret' }).from, 'alias@example.com');
  assert.equal(smtpConfig({ SMTP_USER: 'test@example.com', SMTP_PASS: 'replace-in-railway-only' }), null);
  assert.equal(smtpConfig({ ...config, MAIL_FROM: 'test@example.com\r\nBcc: attacker@example.com' }), null);
  assert.equal(smtpConfig({ ...config, SMTP_PORT: '587' }).options.requireTLS, true);
  assert.equal(smtpConfig(config).options.secure, true);
});

test('Valid multipart enquiry is accepted only after the configured recipient is accepted by SMTP', async t => {
  const h = await running(t);
  const response = await h.submit(payload({ lang: 'en', organisation: 'TEST organisation', model: 'Glock 17', quantity: '100', delivery: '2028-02-29', website: '' }, [{ name: 'specification.pdf', content: pdf }]));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(h.messages.length, 1);
  assert.equal(h.messages[0].to, 'info@hellweg.eu');
  assert.equal(h.messages[0].from, 'test@example.com');
  assert.equal(h.messages[0].replyTo.address, 'request@example.com');
  assert.equal(h.messages[0].attachments[0].content.toString(), pdf.toString());
  assert.match(h.messages[0].text, /Stückzahl: 100/);
  assert.equal(h.messages[0].disableFileAccess, true);
});

test('A delayed SMTP acknowledgement delays the success response', async t => {
  let resolveMail, started;
  const entered = new Promise(resolve => { started = resolve; });
  const gate = new Promise(resolve => { resolveMail = resolve; });
  const h = await running(t, { transport: { async sendMail() { started(); await gate; return { accepted: ['info@hellweg.eu'] }; } } });
  let received = false;
  const pending = h.submit().then(response => { received = true; return response; });
  await entered;
  assert.equal(received, false);
  resolveMail();
  assert.equal((await pending).status, 200);
});

test('Missing SMTP configuration returns 503 without pretending to send', async t => {
  const h = await running(t, { env: { PUBLIC_ORIGIN: origin } });
  const response = await h.submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'mail_not_configured');
  const health = await (await fetch(`${h.address}/healthz`)).json();
  assert.deepEqual(health, { ok: true, contactReady: false });
  assert.equal(h.messages.length, 0);
});

test('SMTP rejection and errors return a controlled failure without secret or enquiry details', async t => {
  const h = await running(t, { transport: { async sendMail() { throw new Error('SECRET test-only-secret request@example.com'); } } });
  const response = await h.submit();
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, code: 'mail_unavailable' });
  const rejected = await running(t, { transport: { async sendMail() { return { accepted: ['other@example.com'], rejected: ['info@hellweg.eu'] }; } } });
  assert.equal((await rejected.submit()).status, 502);
});

test('Cross-site and missing-origin posts are rejected before mail delivery', async t => {
  const h = await running(t);
  assert.equal((await h.submit(payload(), { Origin: 'https://attacker.example' })).status, 403);
  assert.equal((await h.submit(payload(), { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
  assert.equal((await fetch(`${h.address}/api/contact`, { method: 'POST', body: payload() })).status, 403);
  assert.equal((await h.submit(payload(), { Origin: 'null' })).status, 403);
  assert.equal(h.messages.length, 0);
});

test('Both form languages are accepted; a configured alternate origin must still be same-site', async t => {
  const h = await running(t, { env: { ...config, CONTACT_ALLOWED_ORIGINS: 'https://hellweg.eu' } });
  assert.equal((await h.submit(payload({ lang: 'de' }))).status, 200);
  assert.equal((await h.submit(payload({ lang: 'en' }), { Origin: 'https://hellweg.eu', 'Sec-Fetch-Site': 'same-origin' })).status, 200);
  assert.equal((await h.submit(payload({ lang: 'en' }), { Origin: 'https://hellweg.eu', 'Sec-Fetch-Site': 'cross-site' })).status, 403);
  assert.equal(h.messages.length, 2);
});

test('Malformed multipart bodies return a controlled 400 without attempting delivery', async t => {
  const h = await running(t);
  for (const [body, type] of [
    ['truncated body', 'multipart/form-data'],
    ['--example\r\nContent-Disposition: form-data; name="type"\r\n\r\nrfq', 'multipart/form-data; boundary=example'],
    ['anything', `multipart/form-data; boundary=${'x'.repeat(71)}`]
  ]) {
    const response = await h.submit(body, { 'Content-Type': type });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { ok: false, code: 'invalid_request' });
  }
  assert.equal(h.messages.length, 0);
});

test('Invalid fields, duplicate values and honeypot are rejected', async t => {
  const h = await running(t, { rateLimit: 30 });
  for (const values of [{ email: 'invalid' }, { name: '   ' }, { type: 'unknown' }, { lang: 'fr' }, { delivery: '2027-02-29' }, { delivery: '2026-13-01' }, { website: 'spam' }, { name: 'Test\r\nBcc: attacker@example.com' }, { quantity: '-1' }, { message: 'a'.repeat(5001) }]) assert.equal((await h.submit(payload(values))).status, 422);
  const duplicate = payload(); duplicate.append('email', 'other@example.com');
  assert.equal((await h.submit(duplicate)).status, 422);
  assert.equal(h.messages.length, 0);
});

test('Unsupported MIME, executable content and excessive attachment count are rejected', async t => {
  const h = await running(t);
  for (const file of [{ name: 'executable.pdf', content: Buffer.from('MZ exe') }, { name: 'document.exe', content: pdf }, { name: 'specification.pdf', type: 'text/plain', content: pdf }]) assert.equal((await h.submit(payload({}, [file]))).status, 422);
  const response = await h.submit(payload({}, Array.from({ length: 4 }, () => ({ content: pdf }))));
  assert.equal(response.status, 422);
  assert.equal(h.messages.length, 0);
});

test('Per-file and aggregate limits are enforced before mail delivery', async t => {
  const h = await running(t);
  assert.equal((await h.submit(payload({}, [{ content: Buffer.alloc(MAX_FILE_SIZE + 1) }]))).status, 413);
  const many = Array.from({ length: 3 }, () => ({ content: Buffer.alloc(Math.floor(MAX_TOTAL_SIZE / 3) + 1) }));
  assert.equal((await h.submit(payload({}, many))).status, 413);
  assert.equal(h.messages.length, 0);
});

test('Attachment filenames cannot contain path or header injection characters', () => {
  assert.equal(attachmentName('../../../../secret.pdf'), 'secret.pdf');
  assert.equal(attachmentName('C:\\private\\name.pdf'), 'name.pdf');
  assert.equal(attachmentName('\r\n../my<file>.pdf'), 'my_file_.pdf');
  assert.throws(() => validateAttachment({ originalname: 'fake.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: Buffer.from('PK not an actual document') }));
});

test('DOCX metadata requires a Word document and excludes macros and traversal entries', () => {
  const sample = { originalname: 'test.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  assert.equal(validateAttachment({ ...sample, buffer: docxFixture() }).filename, 'test.docx');
  assert.throws(() => validateAttachment({ ...sample, buffer: docxFixture('word/vbaProject.bin') }));
  assert.throws(() => validateAttachment({ ...sample, buffer: docxFixture('../outside.xml') }));
});

test('Rate limit returns retry information and no extra emails', async t => {
  const h = await running(t, { rateLimit: 1 });
  assert.equal((await h.submit()).status, 200);
  const response = await h.submit();
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get('retry-after')) > 0);
  assert.equal(h.messages.length, 1);
});

test('Website routes redirect to canonical paths; unknown routes/assets are actual 404s', async t => {
  const h = await running(t);
  const response = await fetch(`${h.address}/products?model=test`, { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), '/produkte/?model=test');
  assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
  assert.match(response.headers.get('content-security-policy'), /form-action 'self'/);
  for (const pathname of ['/invented-test-route', '/assets/nonexistent.js']) assert.equal((await fetch(h.address + pathname)).status, 404);
  assert.equal((await fetch(`${h.address}/api/contact`)).status, 405);
  const wrongType = await h.submit(JSON.stringify({ name: 'Test' }), { 'Content-Type': 'application/json' });
  assert.equal(wrongType.status, 415);
});
