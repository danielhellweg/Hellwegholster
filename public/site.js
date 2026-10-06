'use strict';
(() => {
 const legacy = {'#produkte':'/produkte/#models','#galerie':'/produkte/#custom','#individualisierung':'/produkte/#custom','#geschichte':'/fertigung/','#manufaktur':'/fertigung/','#kontakt':'/kontakt/'};
 if(location.pathname === '/' && legacy[location.hash]) { location.replace(legacy[location.hash]); return; }
 const header = document.querySelector('.site-header');
 const toggle = document.querySelector('.menu-toggle');
 if(header && toggle) {
  const close = () => { header.classList.remove('nav-open'); toggle.setAttribute('aria-expanded','false'); };
  toggle.addEventListener('click', () => { const open = header.classList.toggle('nav-open'); toggle.setAttribute('aria-expanded',String(open)); });
  document.addEventListener('keydown', event => { if(event.key === 'Escape') { close(); toggle.focus(); } });
  document.querySelectorAll('#main-nav a').forEach(a => a.addEventListener('click',close));
 }
 const form = document.querySelector('#rfq-form');
 if(!form) return;
 const en = form.dataset.lang === 'en';
 const status = form.querySelector('.form-status');
 const submit = form.querySelector('button[type="submit"]');
 const type = form.elements.namedItem('type');
 const params = new URLSearchParams(location.search);
 const kinds = new Set([...type.options].map(o => o.value));
 const intent = params.get('type');
 if(kinds.has(intent)) type.value = intent;
 const model = params.get('model');
 if(model && model.length <= 180 && !/[\r\n<>]/.test(model)) form.elements.namedItem('model').value = model;
 const syncLanguage = () => document.querySelectorAll('.language-switch a').forEach(a => {
  const url = new URL(a.href,location.href);
  url.searchParams.set('type',type.value);
  a.href = url.pathname + url.search;
 });
 syncLanguage();
 type.addEventListener('change',syncLanguage);
 document.querySelectorAll('[data-intent]').forEach(a => a.addEventListener('click', event => {
  if(!kinds.has(a.dataset.intent)) return;
  event.preventDefault(); type.value = a.dataset.intent; syncLanguage();
  form.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto':'smooth',block:'start'});
  type.focus({preventScroll:true});
 }));
 const errors = en ? {
  invalid_fields:'Please check your name, email and requirements.', invalid_attachment:'An attachment could not be accepted. Please use a valid PDF, JPG, PNG or DOCX file.',
  upload_limit:'Use up to 3 files, no larger than 5 MB each.', attachments_too_large:'Attachments may not exceed 10 MB in total.',
  too_many_requests:'Too many enquiries. Please try again later or email info@hellweg.eu.',
  mail_not_configured:'Delivery is not available yet. Please email info@hellweg.eu directly.',
  mail_unavailable:'Delivery could not be confirmed. Please contact info@hellweg.eu before submitting again.',
  temporarily_unavailable:'The service is busy. Please try again later.', origin_not_allowed:'This preview is not enabled for sending. Please email info@hellweg.eu.',
  unknown:'Delivery could not be confirmed. Your entries are still here. Please contact info@hellweg.eu before submitting again.'
 } : {
  invalid_fields:'Bitte prüfen Sie Name, E-Mail und Anforderungen.', invalid_attachment:'Ein Anhang konnte nicht angenommen werden. Bitte eine gültige PDF-, JPG-, PNG- oder DOCX-Datei verwenden.',
  upload_limit:'Bitte höchstens 3 Dateien mit jeweils maximal 5 MB auswählen.', attachments_too_large:'Anhänge dürfen insgesamt höchstens 10 MB groß sein.',
  too_many_requests:'Zu viele Anfragen. Bitte später versuchen oder an info@hellweg.eu schreiben.',
  mail_not_configured:'Der Versand ist noch nicht eingerichtet. Bitte schreiben Sie direkt an info@hellweg.eu.',
  mail_unavailable:'Der Versand konnte nicht bestätigt werden. Bitte kontaktieren Sie info@hellweg.eu, bevor Sie erneut senden.',
  temporarily_unavailable:'Der Dienst ist gerade ausgelastet. Bitte später erneut versuchen.', origin_not_allowed:'Diese Vorschau ist nicht für den Versand freigeschaltet. Bitte an info@hellweg.eu schreiben.',
  unknown:'Der Versand konnte nicht bestätigt werden. Ihre Angaben bleiben erhalten. Bitte kontaktieren Sie info@hellweg.eu, bevor Sie erneut senden.'
 };
 let sending = false;
 form.addEventListener('submit',async event => {
  event.preventDefault();
  if(sending) return;
  [...form.querySelectorAll('input[required], textarea[required]')].forEach(field => field.setCustomValidity(field.value.trim() ? '' : (en?'Please enter a value.':'Bitte einen Wert eingeben.')));
  if(!form.reportValidity()) return;
  const files = [...form.elements.namedItem('documents').files];
  const size = files.reduce((total,file) => total + file.size,0);
  const code = files.length > 3 || files.some(f => f.size > 5*1024*1024) ? 'upload_limit' : size > 10*1024*1024 ? 'attachments_too_large' : files.some(f => !/\.(pdf|jpe?g|png|docx)$/i.test(f.name)) ? 'invalid_attachment' : null;
  status.dataset.state = '';
  if(code) { status.textContent = errors[code]; status.dataset.state = 'error'; status.focus(); return; }
  const data = new FormData(form);
  // Browser FormData contains a zero-byte unnamed file when no attachment is chosen.
  if(!files.length) data.delete('documents');
  sending = true; submit.disabled = true; form.setAttribute('aria-busy','true');
  status.textContent = en?'Sending your enquiry…':'Ihre Anfrage wird übermittelt…';
  try {
   const response = await fetch('/api/contact',{method:'POST',body:data,headers:{Accept:'application/json'}});
   const result = await response.json();
   if(!response.ok || result.ok !== true) throw new Error(result.code || 'unknown');
   status.textContent = en?'Thank you. The mail server has accepted your enquiry for HELLWEG.':'Vielen Dank. Der Mailserver hat Ihre Anfrage für HELLWEG angenommen.';
   status.dataset.state = 'success'; form.reset(); syncLanguage();
  } catch(error) {
   status.textContent = Object.hasOwn(errors,error.message) ? errors[error.message] : errors.unknown;
   status.dataset.state = 'error';
  } finally {
   sending = false; submit.disabled = false; form.removeAttribute('aria-busy'); status.focus();
  }
 });
 form.addEventListener('input',event => { if(event.target.setCustomValidity) event.target.setCustomValidity(''); });
})();
