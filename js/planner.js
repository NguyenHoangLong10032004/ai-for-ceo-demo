/* =========================================================
   PLANNER — chia bài học & cá nhân hóa lộ trình
   - Số bài học = số ngày muốn hoàn thành (học mỗi ngày 1 bài)
   - Guardrail: luôn giữ đủ 12 module theo thứ tự, không vượt quỹ thời gian
   - Có AI thì AI chọn nội dung + lý do; không có AI thì dùng bộ luật (rulePlan)
   ========================================================= */

/* ---------- hồ sơ ---------- */
// Mặc định học mỗi ngày: số bài học = số ngày muốn hoàn thành
function lessonsOf(p){return p.days;}
function dayLabel(i){return `Ngày ${i+1}`;}
function weekOf(i){return Math.floor(i/7);}
function profileComplete(p){return !!(p.industry&&p.size&&p.level&&p.goals&&p.goals.length&&p.days&&p.minPerSession);}

/* ---------- đơn vị nội dung (video / bài tập / ôn tập / case) ---------- */
// key: "M05:2" = Module 05 video C; "E:M05" = bài tập Module 05; "R:M05" = bài ôn tập Module 05; "X2" = case/live
function U(key){
 if(key.startsWith('R:')){const id=key.slice(2);return {key,id,kind:'review',m:REVIEW_MIN};}
 if(key.startsWith('E:')){const id=key.slice(2);return {key,id,kind:'exercise',m:TASKS[id].min};}
 const [id,p]=key.split(':');const x=L[id];
 if(p!==undefined)return {key,id,kind:'video',part:+p,m:x.parts[+p]};
 return {key,id,kind:'extra',m:x.min};
}
function unitLabel(u){return u.kind==='video'?`Video ${'ABCD'[u.part]} · ${PARTS[u.part]}`:u.kind==='exercise'?'Bài tập':u.kind==='review'?'Ôn tập & liên hệ công ty':TYPE_LABEL[L[u.id].type];}
function unitTitle(u){const x=L[u.id];return u.kind==='video'?`Module ${modNo(x)} · ${PARTS[u.part]}`:u.kind==='exercise'?`Bài tập: ${TASKS[u.id].title}`:u.kind==='review'?`Ôn tập Module ${modNo(x)}`:x.title;}
function unitLine(u){const x=L[u.id];
 if(u.kind==='video')return {icon:'video',t:`Video: ${PARTS[u.part]}`};
 if(u.kind==='exercise')return {icon:'file',t:`Bài tập: ${TASKS[u.id].title}`};
 if(u.kind==='review')return {icon:'book',t:'Ôn tập & liên hệ với công ty'};
 return {icon:'video',t:`${TYPE_LABEL[x.type]}: ${x.title}`};}
function unitsOf(items){const u=[];items.forEach(it=>{const x=L[it.id];if(x.type==='module'){x.parts.forEach((m,i)=>u.push(U(x.id+':'+i)));u.push(U('E:'+x.id));}else u.push(U(x.id));});return u;}
// Số ngày nhiều hơn số phần nội dung: chèn bài "Ôn tập & liên hệ công ty" để mỗi ngày vẫn có 1 bài
function addReviews(units,N){
 const need=N-units.length;if(need<=0)return units;
 const mods=units.filter(u=>u.kind==='exercise').map(u=>u.id);const k=Math.min(need,mods.length);
 const pick=new Set();for(let i=0;i<k;i++)pick.add(mods[Math.floor((i+0.5)*mods.length/k)]);
 const out=[];units.forEach(u=>{out.push(u);if(u.kind==='exercise'&&pick.has(u.id))out.push(U('R:'+u.id));});return out;
}
// Chia dãy nội dung thành đúng N bài, cân bằng số phút, ưu tiên cắt ở ranh giới module
function partition(units,N){
 N=Math.max(1,Math.min(N,units.length));
 const total=units.reduce((a,u)=>a+u.m,0);const groups=[];let cur=[],sum=0,closed=0;
 for(let i=0;i<units.length;i++){
  const u=units[i];cur.push(u);sum+=u.m;
  const groupsAfter=N-groups.length-1,unitsLeft=units.length-i-1;
  if(groupsAfter<=0)continue;
  const target=(total-closed)/(N-groups.length),next=units[i+1];
  const boundary=u.kind!=='video';
  const want=sum>=target||(boundary&&sum>=target*0.75)||(next&&sum+next.m>target*1.25&&sum>=target*0.6);
  if(unitsLeft===groupsAfter||(want&&unitsLeft>=groupsAfter)){groups.push(cur);closed+=sum;cur=[];sum=0;}
 }
 if(cur.length)groups.push(cur);
 return groups;
}
// Một module có thể trải qua nhiều bài: trả về "phần k trên n"
function modSplit(id,li,all){const idx=[];all.forEach((ks,i)=>{if(ks.some(k=>U(k).id===id&&U(k).kind!=='review'))idx.push(i);});return {k:idx.indexOf(li)+1,n:idx.length};}
function lessonTitle(keys,li,all){
 all=all||(S.plan&&S.plan.lessons)||[keys];if(li==null)li=all.indexOf(keys);
 const us=keys.map(U);const ids=[...new Set(us.map(u=>u.id))];
 if(us.length===1&&us[0].kind==='review')return `Ôn tập: ${L[us[0].id].title}`;
 return ids.map(id=>{const x=L[id];if(x.type!=='module'||li<0)return x.title;const sp=modSplit(id,li,all);return x.title+(sp.n>1?` · Phần ${sp.k}/${sp.n}`:'');}).join(' + ');
}
function dayDate(i){const d=new Date((S.plan&&S.plan.start)||Date.now());d.setDate(d.getDate()+i);return d.toLocaleDateString('vi-VN',{weekday:'short',day:'2-digit',month:'2-digit'});}
const lessonMin=keys=>keys.reduce((a,k)=>a+U(k).m,0);

/* ---------- bộ luật cá nhân hóa (guardrail) ---------- */
function dedupe(a){const s=new Set();return a.filter(x=>!s.has(x.id)&&s.add(x.id));}
function modReason(x,p){const m=(x.ex||[]).find(e=>(p.goals||[]).includes(e[0]));return x.why+(m?` · có ví dụ cho ${GOALS[m[0]]}`:'');}
function itemDone(id){const x=L[id];return x.type==='module'?x.parts.every((_,i)=>S.done[id+':'+i])&&!!S.done['E:'+id]:!!S.done[id];}
function rulePlan(p){
 const items=[],skipped=[];
 LIB.filter(x=>x.req).forEach(x=>items.push({id:x.id,reason:modReason(x,p)}));
 let used=items.reduce((a,i)=>a+L[i.id].min,0);const B=lessonsOf(p)*p.minPerSession;const opt=[];
 LIB.filter(x=>!x.req).forEach(x=>{
  if(itemDone(x.id)){items.push({id:x.id,reason:'Anh/chị đã xem phần này'});used+=x.min;return;}
  if(x.skipIfLevel&&p.level>=x.skipIfLevel){skipped.push({id:x.id,reason:`Anh/chị đã ở mức "${LEVELS[p.level]}", không cần phần ôn này`});return;}
  const m=x.tags.filter(t=>(p.goals||[]).includes(t));let score=m.length?3:0;let reason=m.length?'Anh/chị quan tâm '+m.map(t=>GOALS[t]).join(', '):'';
  if(x.skipIfLevel&&p.level<x.skipIfLevel){score+=4;reason='Giúp nắm nhanh nền tảng trước khi xem demo';}
  if(x.adv&&p.level>=3){score+=2;reason=reason||'Anh/chị đã dùng AI thường xuyên, cần cập nhật năng lực mới nhất';}
  if(x.bigOrg&&SIZES.indexOf(p.size)>=2){score+=1;reason=reason||`Công ty ${p.size} cần chuẩn bị quyền truy cập từ đầu`;}
  opt.push({x,score,reason});
 });
 opt.sort((a,b)=>b.score-a.score);
 opt.forEach(o=>{if(o.score>0&&used+o.x.min<=B){items.push({id:o.x.id,reason:o.reason});used+=o.x.min;}else skipped.push({id:o.x.id,reason:o.score>0?'Chưa đủ thời gian trong lộ trình, có thể xem thêm sau khóa':'Không nằm trong phòng ban anh/chị quan tâm'});});
 return finalize(p,items,skipped,'','rule','');
}
function summaryRule(p,N,total){
 return `Em chia khóa thành ${N} bài học, mỗi ngày một bài, mỗi bài khoảng ${Math.round(total/N)} phút. Lộ trình đi đủ 12 năng lực AI theo thứ tự, ví dụ được ưu tiên cho ${goalsText(p.goals)}.${p.problem?` Bài toán anh/chị nêu ("${p.problem}") sẽ được nhắc lại ở các bài liên quan.`:''} Bài cuối cùng anh/chị chọn 3 use case đáng thử cho công ty.`;
}
// Áp guardrail, chia bài, cảnh báo nếu thời gian mỗi ngày không đủ
function finalize(p,items,skipped,summary,source,reply){
 const N=lessonsOf(p),cap=N*p.minPerSession;const ord=id=>LIB.findIndex(x=>x.id===id);
 items=dedupe(items).sort((a,b)=>ord(a.id)-ord(b.id));
 const sum=a=>a.reduce((s,i)=>s+L[i.id].min,0);
 while(sum(items)>cap){const c=[...items].reverse().find(i=>!L[i.id].req&&!itemDone(i.id));if(!c)break;items=items.filter(i=>i!==c);skipped.push({id:c.id,reason:'Chưa đủ thời gian trong lộ trình, có thể xem thêm sau khóa'});}
 const total=sum(items);
 let warning=null;
 if(total>cap*1.2){const needLessons=Math.ceil(total/p.minPerSession);
  warning={needDays:needLessons,needMin:PACES.find(m=>m>p.minPerSession&&total<=N*m*1.2)||null,perLesson:Math.round(total/N)};}
 const units=addReviews(unitsOf(items),N);
 const lessons=partition(units,N).map(g=>g.map(u=>u.key));
 const lt=lessonMin(lessons.flat());
 skipped=dedupe(skipped).filter(s=>!items.find(i=>i.id===s.id));
 return {items,skipped,lessons,summary:summary||summaryRule(p,lessons.length,lt),source,reply:reply||'',warning,note:'',start:(S.plan&&S.plan.start)||Date.now(),profile:{days:p.days,minPerSession:p.minPerSession},version:((S.plan&&S.plan.version)||0)+1,accepted:false};
}

/* ---------- hiểu yêu cầu điều chỉnh bằng lời ---------- */
function applyChanges(p,c){
 if(!c||typeof c!=='object')return p;const q={...p};
 const d=parseInt(c.days);if(d>=3&&d<=MAX_DAYS)q.days=d;
 const m=parseInt(c.minPerSession);if(m>=10&&m<=180)q.minPerSession=snapPace(m);
 if(Array.isArray(c.goals)){const g=c.goals.filter(x=>GOALS[x]);if(g.length)q.goals=g;}
 return q;
}
function parseDays(s){s=String(s).toLowerCase();let m=s.match(/(\d+)\s*(ngày|tuần|tháng)/);if(m){const n=+m[1];return m[2]==='ngày'?n:m[2]==='tuần'?n*7:n*30;}
 if(/một tháng/.test(s))return 30;if(/nửa tháng/.test(s))return 15;if(/hai tuần/.test(s))return 14;if(/một tuần/.test(s))return 7;m=s.match(/^\s*(\d+)\s*$/);if(m)return +m[1];return null;}
function parseAdjust(t,p){
 const s=t.toLowerCase();const c={};const d=parseDays(s);if(d)c.days=d;
 let m=s.match(/(\d+(?:[.,]\d+)?)\s*(giờ|tiếng)/);if(m)c.minPerSession=Math.round(parseFloat(m[1].replace(',','.'))*60);
 m=s.match(/(\d+)\s*phút/);if(m)c.minPerSession=+m[1];
 const map={sales:/sales|bán hàng|kinh doanh/,marketing:/marketing|quảng cáo|nội dung/,cs:/cskh|chăm sóc khách|hỗ trợ khách/,hr:/nhân sự|tuyển dụng|đào tạo/,finance:/tài chính|kế toán|báo cáo/,ops:/vận hành|quy trình|sản xuất|kho/,ceo:/văn phòng ceo|ban giám đốc|chiến lược/};
 const g=Object.keys(map).filter(k=>map[k].test(s));if(g.length)c.goals=/thêm|cả/.test(s)?[...new Set([...(p.goals||[]),...g])]:g;
 return c;
}
function describeChanges(a,b){const out=[];
 if(a.days!==b.days)out.push(`thời gian ${a.days} → ${b.days} ngày`);
 if(a.minPerSession!==b.minPerSession)out.push(`${a.minPerSession} → ${b.minPerSession} phút mỗi ngày học`);
 if(goalsText(a.goals)!==goalsText(b.goals))out.push(`phòng ban quan tâm: ${goalsText(b.goals)}`);
 return out.length?`Em đã cập nhật ${out.join('; ')}. Khóa giờ gồm ${lessonsOf(b)} bài học. Các video anh/chị đã xem được giữ nguyên.`:'Em đã sắp xếp lại lộ trình theo yêu cầu.';}

/* ---------- AI (chạy trên claude.ai thì có AI; chạy local thì dùng bộ luật) ---------- */
const SAMPLE_P=(async()=>{try{if(!window.claude||!window.claude.use)return null;return await window.claude.use('sample');}catch(e){return null;}})();
function aiDot(){return `<span class="ai-dot ${T.ai?'on':''}" data-ai><i></i><span>${T.ai===null?'Đang kiểm tra AI…':T.ai?'AI đang bật':'Chạy local · bộ luật'}</span></span>`;}
function buildPrompt(p,request){
 const lib=LIB.map(x=>`${x.id} | ${TYPE_LABEL[x.type]} | ${x.title} | ${x.min} phút | ${x.req?'BẮT BUỘC':'tùy chọn'} | tags: ${(x.tags||[]).join(',')||'-'}${x.skipIfLevel?` | ôn nền tảng, bỏ được nếu mức AI >= ${x.skipIfLevel}`:''}${x.adv?' | nâng cao':''}`).join('\n');
 return `Bạn là "Trợ lý lộ trình" của khóa AI for CEO (Học viện Siêu Tăng Trưởng). Khóa demo-first, 12 module = 12 năng lực AI; không dạy tool, không dạy prompt. Hãy chọn nội dung cho CEO dưới đây; hệ thống sẽ tự chia thành ${lessonsOf(p)} bài học.

HỒ SƠ
- Ngành: ${p.industry}; quy mô: ${p.size}
- Hiện trạng sử dụng AI (1-4): ${p.level} = ${LEVELS[p.level]}
- Phòng ban quan tâm: ${(p.goals||[]).map(g=>g+' ('+GOALS[g]+')').join(', ')}
- Bài toán: ${p.problem||'(chưa nêu)'}
- Muốn hoàn thành trong ${p.days} ngày, học mỗi ngày, ${p.minPerSession} phút mỗi ngày → ${lessonsOf(p)} bài, tổng ${lessonsOf(p)*p.minPerSession} phút.

THƯ VIỆN:
${lib}

GUARDRAIL: chỉ dùng id có trong thư viện; luôn giữ đủ 12 module bắt buộc; tổng phút không vượt quỹ thời gian; chọn case/live khớp phòng ban, bài toán và mức AI.
${request?`
YÊU CẦU ĐIỀU CHỈNH: "${request}". Nếu yêu cầu đổi thời gian, nhịp học hoặc phòng ban thì ghi vào "changes".`:''}

Trả lời CHỈ bằng một JSON:
{"summary":"2-3 câu tiếng Việt, xưng em, gọi anh/chị, nói khóa được chia thành bao nhiêu bài và trọng tâm, nhắc tới ngành hoặc bài toán",
 "items":[{"id":"M01","reason":"lý do, tối đa 18 từ"}],
 "skipped":[{"id":"X1","reason":"lý do, tối đa 12 từ"}],
 "changes":{"days":null,"minPerSession":null,"goals":null},
 "reply":"1 câu phản hồi yêu cầu điều chỉnh, để trống nếu không có"}
days tối đa ${MAX_DAYS}; minPerSession chỉ nhận 20, 30 hoặc 60; goals là mảng key trong: ${Object.keys(GOALS).join(', ')}.`;
}
// Kết quả AI luôn đi qua guardrail (finalize) trước khi dùng
function fromAI(p,r){
 let items=(Array.isArray(r.items)?r.items:[]).filter(i=>i&&L[i.id]).map(i=>({id:i.id,reason:String(i.reason||L[i.id].why||'').slice(0,180)}));
 LIB.filter(x=>x.req).forEach(x=>{if(!items.find(i=>i.id===x.id))items.push({id:x.id,reason:modReason(x,p)});});
 LIB.forEach(x=>{if(!x.req&&itemDone(x.id)&&!items.find(i=>i.id===x.id))items.push({id:x.id,reason:'Anh/chị đã xem phần này'});});
 let skipped=(Array.isArray(r.skipped)?r.skipped:[]).filter(s=>s&&L[s.id]).map(s=>({id:s.id,reason:String(s.reason||'')}));
 LIB.forEach(x=>{if(!items.find(i=>i.id===x.id)&&!skipped.find(s=>s.id===x.id))skipped.push({id:x.id,reason:'Không nằm trong trọng tâm lộ trình này'});});
 return finalize(p,items,skipped,String(r.summary||''),'ai',String(r.reply||''));
}
async function generate(request){
 if(T.gen)return;const p0={...S.profile};let p=p0,plan=null,note='';
 T.gen={msg:request?'Đang điều chỉnh lộ trình theo yêu cầu…':'Đang chia khóa thành bài học theo lịch của anh/chị…'};
 if(request)S.adjustLog.push({role:'user',text:request});
 render();
 try{
  if(!profileComplete(p0)){['industry','size','level','goals','days','minPerSession'].forEach(k=>{if(p0[k]==null||(Array.isArray(p0[k])&&!p0[k].length))p0[k]=SAMPLE_PROFILE[k];});p=p0;}
  const sample=await SAMPLE_P;
  if(sample){try{const r=await sample.json(buildPrompt(p0,request),{cache:false});p=applyChanges(p0,r.changes);plan=fromAI(p,r);}
   catch(e){note=e&&e.code==='not_granted'?'Anh/chị chưa cho phép dùng AI nên hệ thống dùng bộ luật cá nhân hóa.':'AI tạm thời không phản hồi nên hệ thống dùng bộ luật cá nhân hóa.';}}
  else await new Promise(r=>setTimeout(r,1400));
  if(!plan){if(request){const c=parseAdjust(request,p0);p=applyChanges(p0,c);plan=rulePlan(p);plan.reply=Object.keys(c).length?describeChanges(p0,p):'Em chưa nhận ra thay đổi cụ thể. Anh/chị thử: "hoàn thành trong 10 ngày", "thêm ví dụ Sales" hoặc "1 giờ mỗi ngày".';}else plan=rulePlan(p);}
  plan.note=note;plan.wasActive=!!(S.plan&&(S.plan.accepted||S.plan.wasActive));
  S.profile=p;S.plan=plan;
  if(request)S.adjustLog.push({role:'bot',text:plan.reply||describeChanges(p0,p)});
  toast(request?`Đã cập nhật lộ trình: ${plan.lessons.length} bài học`:`Đã tạo lộ trình ${plan.lessons.length} bài học`);
 }catch(e){
  console.error('Tạo lộ trình lỗi:',e);
  if(request)S.adjustLog.push({role:'bot',text:'Em chưa điều chỉnh được lộ trình. Anh/chị thử lại với yêu cầu khác nhé.'});
  else T.err.gen='Chưa tạo được lộ trình. Anh/chị bấm "Tạo lộ trình cá nhân" để thử lại, hoặc bấm "Làm lại" trên thanh demo.';
 }finally{T.gen=null;render();}
}

/* ---------- tiến độ theo lộ trình ---------- */
const lessons=()=>S.plan?S.plan.lessons:[];
const lessonDone=i=>lessons()[i].every(k=>S.done[k]);
function nextLesson(){const i=lessons().findIndex((_,j)=>!lessonDone(j));return i;}
// Học tuần tự: chỉ mở các bài đã học và bài đang học; bài sau mở khi học xong bài trước
function lessonOpen(i){const n=nextLesson();return n<0||i<=n;}
const lockMsg=i=>`Bài ${i+1} sẽ mở sau khi anh/chị học xong Bài ${nextLesson()+1}.`;
function lessonOfUnit(key){return lessons().findIndex(ks=>ks.includes(key));}
function reasonsFor(keys){const ids=[...new Set(keys.map(k=>U(k).id))];return ids.map(id=>{const it=S.plan.items.find(i=>i.id===id);return it?it.reason:'';}).filter(Boolean);}
function planStats(){const ls=lessons();const all=ls.flat();const mods=LIB.filter(x=>x.type==='module');
 return {n:ls.length,lessonsDone:ls.filter((_,i)=>lessonDone(i)).length,units:all.length,unitsDone:all.filter(k=>S.done[k]).length,mods:mods.length,modsDone:mods.filter(x=>itemDone(x.id)).length,min:lessonMin(all),pct:ls.length?Math.round(ls.filter((_,i)=>lessonDone(i)).length/ls.length*100):0};}
