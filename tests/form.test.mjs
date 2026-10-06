import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/site.js',import.meta.url),'utf8');
function harness({lang='en',search='?type=rfq&model=Glock%2017',response={ok:true},status=200,networkError=false,pending=false}={}) {
 const values = {type:'information',name:'Test buyer',email:'test@example.com',message:'Test requirements',model:''};
 const elements = Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{value,validationMessage:'',setCustomValidity(v){this.validationMessage=v;},addEventListener(type,fn){this.listener=fn;}}]));
 elements.type.options = ['information','rfq','partner','custom'].map(value=>({value}));
 elements.documents = {files:[]};
 const state = {textContent:'',dataset:{},focus(){this.focused=true;}};
 const button = {disabled:false};
 const events = {}, calls = [], deleted=[];
 const links = [{href:'http://localhost/kontakt/'},{href:'http://localhost/en/contact/'}];
 const form = {dataset:{lang},elements:{namedItem:key=>elements[key]},querySelector:selector=>selector==='.form-status'?state:button,
  querySelectorAll:()=>['name','email','message'].map(key=>elements[key]),addEventListener(type,fn){events[type]=fn;},reportValidity(){return !Object.values(elements).some(e=>e.validationMessage);},
  setAttribute(){},removeAttribute(){},reset(){this.wasReset=true;elements.type.value='information';},scrollIntoView(){} };
 let resolveFetch;
 vm.runInNewContext(source,{document:{querySelector:s=>s==='#rfq-form'?form:null,querySelectorAll:s=>s==='.language-switch a'?links:[]},window:{matchMedia:()=>({matches:true})},
  location:{pathname:'/en/contact/',hash:'',search,href:'http://localhost/en/contact/'+search},URL,URLSearchParams,FormData:class{constructor(){this.values={...values};}delete(key){deleted.push(key);}},
  fetch:async(url,options)=>{calls.push({url,options});if(networkError)throw Error('offline');if(pending)await new Promise(resolve=>{resolveFetch=resolve;});return {ok:status>=200&&status<300,json:async()=>response};}});
 return {elements,state,button,form,links,calls,deleted,submit:()=>events.submit({preventDefault(){}}),resolve:()=>resolveFetch()};
}

test('Intent and product model are carried into the contact form and language switch',()=>{
 const h=harness(); assert.equal(h.elements.type.value,'rfq');assert.equal(h.elements.model.value,'Glock 17');assert.ok(h.links.every(a=>a.href.endsWith('?type=rfq')));
});
test('Success is shown only after the API confirms SMTP acceptance',async()=>{
 const h=harness();await h.submit();assert.equal(h.calls[0].url,'/api/contact');assert.equal(h.calls[0].options.method,'POST');assert.equal(h.calls[0].options.headers.Accept,'application/json');
 assert.equal(h.state.dataset.state,'success');assert.match(h.state.textContent,/mail server has accepted/);assert.equal(h.form.wasReset,true);assert.equal(h.button.disabled,false);assert.deepEqual(h.deleted,['documents']);
});
test('An HTTP success without explicit acknowledgement never becomes a false success',async()=>{
 const h=harness({response:{message:'unknown'}});await h.submit();assert.equal(h.state.dataset.state,'error');assert.equal(h.form.wasReset,undefined);
});
test('Unconfigured SMTP is explained and entries are preserved',async()=>{
 const h=harness({lang:'de',status:503,response:{ok:false,code:'mail_not_configured'}});await h.submit();assert.match(h.state.textContent,/noch nicht eingerichtet/);assert.equal(h.form.wasReset,undefined);assert.equal(h.elements.name.value,'Test buyer');
});
test('Network ambiguity does not report delivery or clear entered details',async()=>{
 const h=harness({networkError:true});await h.submit();assert.match(h.state.textContent,/could not be confirmed/);assert.equal(h.form.wasReset,undefined);assert.equal(h.state.dataset.state,'error');
});
test('Empty required fields, excessive files and wrong extensions do not reach the server',async()=>{
 for(const changes of [h=>h.elements.name.value='   ',h=>h.elements.documents.files=Array.from({length:4},()=>({name:'brief.pdf',size:5})),h=>h.elements.documents.files=[{name:'run.exe',size:5}],h=>h.elements.documents.files=[{name:'huge.pdf',size:6*1024*1024}]]) {
  const h=harness();changes(h);await h.submit();assert.equal(h.calls.length,0);assert.equal(h.form.wasReset,undefined);
 }
});
test('Repeated clicks cannot send duplicate enquiries while the request is pending',async()=>{
 const h=harness({pending:true});const first=h.submit();assert.equal(h.button.disabled,true);await h.submit();assert.equal(h.calls.length,1);h.resolve();await first;assert.equal(h.button.disabled,false);
});
test('Unsupported URL parameters cannot enter model or inquiry type fields',()=>{
 const h=harness({search:'?type=bogus&model=%3Cscript%3E'});assert.equal(h.elements.type.value,'information');assert.equal(h.elements.model.value,'');
});
