import test from 'node:test';
import assert from 'node:assert/strict';
import {cp,mkdtemp,readFile,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

test('Production build excludes private review, enables deliberate indexing and contains all language pages',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'hellweg-production-test-'));
 try {
  const root=path.resolve(new URL('..',import.meta.url).pathname);
  await Promise.all(['scripts','content','public'].map(name=>cp(path.join(root,name),path.join(temp,name),{recursive:true})));
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:temp,env:{...process.env,HELLWEG_PREVIEW:'disabled',HELLWEG_INDEXING:'enabled',HELLWEG_PUBLIC_ORIGIN:'https://www.hellweg.eu'}});
  await assert.rejects(access(path.join(temp,'dist/review/index.html')));
  const home=await readFile(path.join(temp,'dist/index.html'),'utf8');
  assert.doesNotMatch(home,/review-banner|\/review\//);
  assert.match(home,/content="index,follow"/);assert.match(home,/rel="canonical" href="https:\/\/www\.hellweg\.eu\/"/);
  const organisation=JSON.parse(home.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  assert.equal(organisation.name,'Hellweg GmbH');assert.equal(organisation.email,'info@hellweg.eu');
  const robots=await readFile(path.join(temp,'dist/robots.txt'),'utf8');assert.match(robots,/Allow: \/\n/);assert.match(robots,/Disallow: \/review\//);
  const form=await readFile(path.join(temp,'dist/en/contact/index.html'),'utf8');
  assert.match(form,/action="\/api\/contact"/);assert.match(form,/enctype="multipart\/form-data"/);assert.doesNotMatch(form,/Preview: delivery requires/);
  const privacy=await readFile(path.join(temp,'dist/datenschutz/index.html'),'utf8');
  assert.match(privacy,/Railway Corporation/);assert.match(privacy,/Amsterdam/);assert.match(privacy,/STRATO GmbH/);
  assert.doesNotMatch(privacy,/Freigabe-Entwurf|vor dem öffentlichen Start zu bestätigen|müssen für den öffentlichen Betrieb festgelegt/);
 } finally { await rm(temp,{recursive:true,force:true}); }
});

test('Visitor copy is persuasive without audit narration or fabricated proof',async()=>{
 const {pages}=await import('../content/pages.mjs');
 for(const key of ['home','products','government','manufacturing','oem']) {
  for(const lang of ['de','en']) {
   const content=pages[key](lang,{preview:true});
   assert.doesNotMatch(content,/bestehende Website|Bestandsseite|belegten Ausgangspunkt|nicht ausreichend dokumentiert|existing website|unverified capacity|not sufficiently documented/i);
   assert.doesNotMatch(content,/garantierte Liefer|guaranteed delivery|ISO.?9001|Made in Germany|NATO certified/i);
   assert.match(content,/href="\/(?:en\/contact|kontakt)\/\?type=/);
  }
 }
});

test('Both homepages focus the original duty photo while other product imagery stays unchanged',async()=>{
 const {pages}=await import('../content/pages.mjs');
 for(const lang of ['de','en']) {
  const home=pages.home(lang,{preview:true});
  assert.match(home,/<div class="duty-focus"><img src="\/assets\/duty-hero.webp" alt="[^"]+" fetchpriority="high"/);
  assert.equal((home.match(/class="duty-focus"/g)||[]).length,1);
  assert.doesNotMatch(pages.products(lang,{preview:true}),/class="duty-focus"/);
 }
 const css=await readFile(new URL('../public/site.css',import.meta.url),'utf8');
 assert.match(css,/aspect-ratio: 1140 \/ 900/);
 assert.match(css,/margin-left: -40\.26316%/);
});

test('Forms contain the complete optional procurement brief with low-friction required fields',async()=>{
 const {pages}=await import('../content/pages.mjs');const html=pages.contact('de',{preview:true});
 for(const name of ['type','name','email','organisation','country','phone','product','model','quantity','tender','reference','delivery','message','documents']) assert.match(html,new RegExp(`name="${name}"`));
 for(const name of ['organisation','country','phone','product','model','quantity','reference','delivery']) {
  const tag=html.match(new RegExp(`<input[^>]+name="${name}"[^>]*>`))[0];assert.doesNotMatch(tag,/\brequired\b/);
 }
 assert.match(html,/name="message" required/);assert.match(html,/name="name"[^>]+required/);assert.match(html,/name="email"[^>]+required/);
 assert.doesNotMatch(html,/download-request|request-summary|kein Upload|not uploaded/);
});
