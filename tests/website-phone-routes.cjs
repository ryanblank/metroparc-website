const {registerHooks}=require('node:module');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=process.cwd();
const ts=require(root+'/node_modules/typescript');
const ensureTs=p=>fs.existsSync(p+'.ts')?p+'.ts':p;
registerHooks({
 resolve(specifier,context,next) {
  if(specifier.startsWith('@/')) return next(ensureTs(path.join(root,'src',specifier.slice(2))),context);
  if(specifier.startsWith('.') && context.parentURL?.startsWith('file://'+root+'/src/')) {
    const resolved=new URL(specifier,context.parentURL).pathname;
    if(fs.existsSync(resolved+'.ts')) return next(resolved+'.ts',context);
  }
  return next(specifier,context);
 },
 load(url,context,next) {
  if(url.startsWith('file://'+root+'/src/')&&url.endsWith('.ts')) {
   return {format:'commonjs',shortCircuit:true,source:ts.transpileModule(fs.readFileSync(new URL(url),'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText};
  }
  return next(url,context);
 }
});
process.env.FUNNEL_ENABLED = "false";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://phone-qa.invalid";
process.env.METROPARC_BUILDING_ID = "86be9efb-5aa2-466e-b502-9a1234858971";
const {POST:lead}=require(root+'/src/app/api/lead/route.ts');
const {POST:book}=require(root+'/src/app/api/booking/route.ts');
const {easternSlot}=require(root+'/src/lib/tour-slot.ts');
const {formatPhone,isCompletePhone}=require(root+'/src/lib/format-phone.ts');
const unit='2a89f800-1f95-4ad9-a856-a51e774f8570';
const realNow=Date.now;
Date.now=()=>Date.parse(require(root+'/src/data/nanpa.json').retrievedAt)+60_000;
const start=easternSlot(new Date(Date.now()+86400000*3)).slice(0,10)+'T13:00:00';
let calls=[];
let capturedPhone;
global.fetch=async(url,init)=>{
 const p=new URL(url).pathname;
 calls.push(p);
 if(p.endsWith('/get-listings')) return Response.json({buildings:[{id:process.env.METROPARC_BUILDING_ID,units:[{id:unit}]}]});
 if(p.endsWith('/available-times')) return Response.json({available_times:[start]});
 if(p.endsWith('/capture-lead')) { capturedPhone=JSON.parse(init.body).phone; return Response.json({activity_id:'stub'}); }
 throw Error('Unexpected outbound request');
};
const routes=['general_inquiry','contact','floor_plan','video_tour','3d_tour','book_tour'];
async function check(route,phone,expected){
 calls=[];
 const booking=route==='book_tour';
 const handler=booking?book:lead;
 const body={firstName:'Local',lastName:'Fixture',email:'phone@example.test',phone,...(booking?{start}:{formType:route,unitId:unit})};
 const r=await handler(new Request('http://localhost/api/test',{method:'POST',body:JSON.stringify(body)}));
 assert.equal(r.status,expected,route+' '+phone);
 if(expected===400) assert.deepEqual(calls,[]);
 else {
  assert.ok(calls.includes('/functions/v1/capture-lead'));
  assert.equal(capturedPhone,typeof phone === 'string' ? phone.trim() || undefined : undefined);
 }
}
const fixtures=require("./nanpa-phone-fixtures.json");
const {rejectedBlank,accepted}=fixtures;
const rejected=[...fixtures.rejectedStructure,...fixtures.rejectedMembership];
(async()=>{
 let cases=0;
 for(const route of routes){
  for(const phone of rejected){
   await check(route,phone,400); cases++;
  }
  for(const phone of accepted){
   await check(route,phone,route==='book_tour'?207:201); cases++;
  }
  for(const phone of rejectedBlank){
   await check(route,phone,400); cases++;
  }
 }
 for(const route of routes) await check(route,undefined,400);
 for(const phone of fixtures.accepted) assert.equal(isCompletePhone(formatPhone(phone)),true,phone);
 for(const phone of fixtures.rejectedStructure) assert.equal(isCompletePhone(phone),false,phone);
 for(const phone of fixtures.rejectedMembership) assert.equal(isCompletePhone(phone),true,phone);
 const formatterCorrections=fixtures.rejectedStructure.filter(phone=>isCompletePhone(formatPhone(phone)));
 assert.deepEqual(formatterCorrections,["(2125550123","+1 (212)  555-0123","212)5550123"]);
 console.log("Verified only the three existing cosmetic formatter repairs; unsupported prefixes/extensions/extra digits stay rejected.");
 for(const phone of fixtures.rejectedMembership){
  for(const route of routes) await check(route,formatPhone(phone),400);
 }
 assert.equal(formatPhone('+13055550123'),'(305) 555-0123');
 console.log('PASS six variants, '+cases+' route cases; invalid phones made zero outbound calls; valid/required semantics verified');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{Date.now=realNow;});
