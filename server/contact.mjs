import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_TOTAL_SIZE = 10 * 1024 * 1024;
export class ContactError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
const singleEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>;,\r\n]+@[^\s@<>;,\r\n]+\.[^\s@<>;,\r\n]+$/.test(value);
const placeholder = value => /^(?:replace|change.?me|your[_ -]|example|placeholder)/i.test(value || '');

export function smtpConfig(env) {
  const user = env.SMTP_USER || env.SMTP_USERNAME;
  const pass = env.SMTP_PASS || env.SMTP_PASSWORD;
  const host = env.SMTP_HOST || 'smtp.strato.de';
  const port = Number(env.SMTP_PORT || 465);
  const to = env.CONTACT_EMAIL || 'info@hellweg.eu';
  const from = env.MAIL_FROM || user;
  if (!singleEmail(user) || !pass || placeholder(user) || placeholder(pass) || !singleEmail(to) || !singleEmail(from) || !/^[a-z\d.-]+$/i.test(host) || !Number.isInteger(port) || port < 1 || port > 65535) return null;
  return { to, from, options: { host, port, secure: port === 465, requireTLS: port !== 465,
    auth: { user, pass }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false } };
}

const mimeByExtension = { '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
export function attachmentName(originalname) {
  const clean = path.posix.basename(String(originalname).replaceAll('\\', '/')).replace(/[^\p{L}\p{N}._ -]/gu, '_').replace(/^\.+/, '').trim();
  const ext = path.extname(clean).toLowerCase();
  return `${path.basename(clean, path.extname(clean)).slice(0, 80) || 'document'}${ext}`;
}

function validDocx(buffer) {
  // Inspect bounded ZIP metadata and the document content type; never extract onto disk.
  let end = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50 && i + 22 + buffer.readUInt16LE(i + 20) === buffer.length) { end = i; break; }
  }
  if (end < 0 || buffer.readUInt16LE(end + 4) || buffer.readUInt16LE(end + 6)) return false;
  const count = buffer.readUInt16LE(end + 10), size = buffer.readUInt32LE(end + 12), offset = buffer.readUInt32LE(end + 16);
  if (!count || count > 500 || offset + size !== end) return false;
  let cursor = offset, inflatedTotal = 0;
  const entries = new Map();
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > end || buffer.readUInt32LE(cursor) !== 0x02014b50) return false;
    const flags = buffer.readUInt16LE(cursor + 8), method = buffer.readUInt16LE(cursor + 10), packed = buffer.readUInt32LE(cursor + 20), unpacked = buffer.readUInt32LE(cursor + 24);
    const nameSize = buffer.readUInt16LE(cursor + 28), extraSize = buffer.readUInt16LE(cursor + 30), commentSize = buffer.readUInt16LE(cursor + 32);
    const next = cursor + 46 + nameSize + extraSize + commentSize;
    if (next > end || flags & 1 || ![0, 8].includes(method)) return false;
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameSize).toString('utf8');
    inflatedTotal += unpacked;
    if (inflatedTotal > 50 * 1024 * 1024 || /(^\/|\\|(^|\/)\.\.(\/|$)|vbaProject\.bin$)/i.test(name) || entries.has(name)) return false;
    entries.set(name, { method, packed, unpacked, local: buffer.readUInt32LE(cursor + 42) });
    cursor = next;
  }
  if (cursor !== end || !entries.has('word/document.xml')) return false;
  const content = entries.get('[Content_Types].xml');
  if (!content || content.unpacked > 32768 || content.local + 30 > offset || buffer.readUInt32LE(content.local) !== 0x04034b50) return false;
  const start = content.local + 30 + buffer.readUInt16LE(content.local + 26) + buffer.readUInt16LE(content.local + 28);
  if (start + content.packed > offset) return false;
  const packed = buffer.subarray(start, start + content.packed);
  const xml = (content.method === 8 ? inflateRawSync(packed, { maxOutputLength: 32768 }) : packed).toString('utf8');
  return xml.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml') && !/macroEnabled/i.test(xml);
}

export function validateAttachment(file) {
  const extension = path.extname(file.originalname).toLowerCase(), mime = mimeByExtension[extension], b = file.buffer;
  if (!mime || file.mimetype !== mime || !b?.length || b.length > MAX_FILE_SIZE) throw new ContactError(422, 'invalid_attachment');
  let valid = false;
  try {
    if (extension === '.pdf') valid = b.subarray(0, 5).toString() === '%PDF-' && b.subarray(Math.max(0, b.length - 1024)).includes(Buffer.from('%%EOF'));
    else if (extension === '.jpg' || extension === '.jpeg') valid = b.length > 4 && b[0] === 255 && b[1] === 216 && b[2] === 255 && b[b.length - 2] === 255 && b[b.length - 1] === 217;
    else if (extension === '.png') valid = b.length >= 32 && b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && b.subarray(12, 16).toString() === 'IHDR' && b.subarray(b.length - 8, b.length - 4).toString() === 'IEND';
    else if (extension === '.docx') valid = validDocx(b);
  } catch { valid = false; }
  if (!valid) throw new ContactError(422, 'invalid_attachment');
  return { filename: attachmentName(file.originalname), content: b, contentType: mime, contentDisposition: 'attachment' };
}

export function createUpload() {
  // The custom storage bounds total bytes during streaming, before Buffer.concat.
  const storage = {
    _handleFile(req, file, callback) {
      const chunks = []; let size = 0, finished = false;
      const fail = error => { if (finished) return; finished = true; chunks.length = 0; callback(error); };
      file.stream.on('data', chunk => {
        if (finished) return;
        size += chunk.length; req.attachmentBytes = (req.attachmentBytes || 0) + chunk.length;
        if (req.attachmentBytes > MAX_TOTAL_SIZE) return fail(new ContactError(413, 'attachments_too_large'));
        chunks.push(chunk);
      });
      file.stream.on('error', fail);
      file.stream.on('end', () => { if (!finished) { finished = true; callback(null, { buffer: Buffer.concat(chunks), size }); } });
    },
    _removeFile(_req, file, callback) { file.buffer?.fill(0); delete file.buffer; callback(null); }
  };
  return multer({ storage, limits: { fileSize: MAX_FILE_SIZE, files: 3, fields: 18, fieldSize: 6000, fieldNameSize: 40, parts: 21, headerPairs: 100 },
    fileFilter(_req, file, callback) { const mime = mimeByExtension[path.extname(file.originalname).toLowerCase()]; callback(mime && file.mimetype === mime ? null : new ContactError(422, 'invalid_attachment'), Boolean(mime && file.mimetype === mime)); }
  }).array('documents', 3);
}

const kinds = { rfq: 'RFQ / RFI', information: 'Beschaffungsinformationen', technical: 'Technische Dokumentation', samples: 'Muster', partner: 'OEM / Distribution', custom: 'Individuelles Holster' };
const labels = { organisation: 'Organisation', country: 'Land', name: 'Kontakt', email: 'E-Mail', phone: 'Telefon', product: 'Produkt', model: 'Waffen-/Gerätemodell', quantity: 'Stückzahl', tender: 'Ausschreibung vorhanden', reference: 'Referenz', delivery: 'Liefertermin', message: 'Anforderungen' };
export function validateFields(body) {
  const values = {};
  for (const [key, value] of Object.entries(body || {})) {
    if (!['type', 'lang', 'website', 'consent', ...Object.keys(labels)].includes(key) || typeof value !== 'string') throw new ContactError(422, 'invalid_fields');
    values[key] = value.trim();
    if (values[key].length > (key === 'message' ? 5000 : 254) || (key !== 'message' && /[\r\n\u0000]/.test(values[key])) || values[key].includes('\u0000')) throw new ContactError(422, 'invalid_fields');
  }
  if (values.website) throw new ContactError(422, 'invalid_fields');
  if (values.lang && !['de', 'en'].includes(values.lang)) throw new ContactError(422, 'invalid_fields');
  if (!kinds[values.type] || !values.name || !values.message || !singleEmail(values.email)) throw new ContactError(422, 'invalid_fields');
  if (values.quantity && (!/^\d+$/.test(values.quantity) || Number(values.quantity) < 1 || Number(values.quantity) > 100000000)) throw new ContactError(422, 'invalid_fields');
  if (values.delivery && (!/^\d{4}-\d{2}-\d{2}$/.test(values.delivery) || !Number.isFinite(new Date(values.delivery).getTime()) || new Date(values.delivery).toISOString().slice(0, 10) !== values.delivery)) throw new ContactError(422, 'invalid_fields');
  if (values.tender && !['yes', 'no'].includes(values.tender)) throw new ContactError(422, 'invalid_fields');
  return values;
}

export async function sendContact({ data, files, config, transport }) {
  const attachments = files.map(validateAttachment);
  const text = [`HELLWEG — ${kinds[data.type]}`, '', ...Object.entries(labels).filter(([key]) => data[key]).map(([key, label]) => `${label}: ${data[key]}`)].join('\n');
  const sender = transport || nodemailer.createTransport(config.options);
  const info = await sender.sendMail({ from: config.from, to: config.to, replyTo: { name: data.name, address: data.email },
    subject: `HELLWEG ${kinds[data.type]} — ${(data.organisation || data.name).slice(0, 120)}`, text, attachments,
    disableFileAccess: true, disableUrlAccess: true });
  const accepted = (info.accepted || []).map(item => typeof item === 'string' ? item.toLowerCase() : String(item.address).toLowerCase());
  if (!accepted.includes(config.to.toLowerCase())) throw new ContactError(502, 'mail_unavailable');
}
