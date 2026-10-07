/* =========================================================
   APP — trạng thái, lưu dữ liệu, điều hướng, xử lý nút bấm, khởi động
   File này nạp cuối cùng (sau data, planner, chatbot, screens).
   ========================================================= */

/* ---------- trạng thái ---------- */
// S: trạng thái lưu vào trình duyệt (localStorage). T: trạng thái tạm, mất khi tải lại trang.
const LS='aiceo-demo-v6';
const DEFAULT=()=>({screen:'landing',spent:{},account:null,loggedIn:false,eval:null,fit:null,nurture:false,order:null,pay:{status:null,method:'qr',sim:'success',support:false},enrolled:false,
 profile:{},ob:{flow:[],i:0,msgs:[],multi:[],done:false},plan:null,adjustLog:[],done:{},doneAt:{},subs:{},lesson:0,unit:null,
 expert:{id:null,msgs:[],unread:0,pending:false},mails:[],zalo:[],comm:{joined:false,posts:[],comments:{},likes:{},gotLikes:{},events:{}},remind:{...REMIND_DEFAULT},feedback:null,asst:[],completedAt:null,liveRemind:false,offline:false});
const T={vp:{vol:80,muted:false,speed:1,quality:"auto",cc:false},gen:null,ai:null,asstOpen:false,tab:"ai",expertDraft:"",expertTyping:false,mailOpen:null,share:null,shareCap:null,dashFilter:'all',fbDraft:null,fbEdit:false,remindOpen:false,commTab:'feed',commCat:'all',commPost:null,commWrite:false,commDraft:null,commQ:'',remindDraft:null,remindPreview:null,zaloOpen:false,asstBusy:false,obTyping:false,focus:null,err:{},ph:{},cx:{},lx:{},clAll:{},drawer:null};
function load(){try{const r=localStorage.getItem(LS);if(r){return Object.assign(DEFAULT(),JSON.parse(r));}}catch(e){}return DEFAULT();}
// chỉ ghi khi dữ liệu thật sự đổi (tránh 2 tab khóa học + cộng đồng ghi qua lại liên tục)
let lastSaved=null;
function save(){try{const j=JSON.stringify(S);if(j===lastSaved)return;localStorage.setItem(LS,j);lastSaved=j;}catch(e){}}
let S=load();

/* ---------- tiện ích chung ---------- */
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
const money=n=>n.toLocaleString('vi-VN')+'đ';
const hours=m=>(Math.round(m/6)/10).toLocaleString('vi-VN');
const firstName=()=>{const n=(S.profile.name||(S.order&&S.order.name)||SAMPLE_PROFILE.name).trim().split(/\s+/);return n[n.length-1];};
const goalsText=g=>(g||[]).map(x=>GOALS[x]).join(', ')||'chưa chọn';
const today=()=>new Date().toLocaleDateString('vi-VN');
const nowStr=()=>new Date().toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
const snapPace=m=>m>=45?60:m>=25?30:20;
const clip=(s,n)=>s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s;
const kb=n=>n>=1024*1024?(n/1024/1024).toFixed(1).replace('.',',')+' MB':Math.max(1,Math.round(n/1024))+' KB';

/* ---------- bài tập: nộp, nhận xét, xuất file ---------- */
const subsCount=()=>Object.keys(TASKS).filter(id=>S.subs[id]).length;
// Bài nộp = { text: câu trả lời dạng văn bản, files: [{name,size,type,data?}], at, v, feedback } — có văn bản, có tệp, hoặc cả hai
function subText(id){const s=S.subs[id];if(!s)return '';
 return [s.text||'',...(s.links||[]).map(u=>'Link: '+u),...(s.files||[]).map(f=>'Tệp đính kèm: '+f.name)].filter(Boolean).join('\n');}
// chuẩn hóa link: thiếu http(s) thì thêm https://; sai định dạng → null
const exUrl=u=>{u=String(u||'').trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;try{const x=new URL(u);return /\./.test(x.hostname)?x.href:null;}catch(e){return null;}};
const exHost=u=>{try{return new URL(u).hostname.replace(/^www\./,'');}catch(e){return u;}};
// đổi câu trả lời theo từng ô (mẫu gợi ý, bài nộp kiểu cũ) thành văn bản đánh số theo thứ tự câu trong đề bài
function answerText(id,v){const t=TASKS[id];
 if(t.kind==='uc')return (v||[]).map((r,i)=>`Use case ${i+1}: ${r.uc}\n   Phòng ban: ${GOALS[r.dept]||''} · Năng lực AI: ${r.cap}${r.why?`\n   Vì sao đáng thử: ${r.why}`:''}`).join('\n');
 return t.fields.map((f,i)=>{const x=String((v||{})[f.k]||'');return `Câu ${i+1}: ${x.includes('\n')?'\n'+x:x}`;}).join('\n\n');}
const sampleText=id=>answerText(id,TASKS[id].kind==='uc'?sampleUC(S.profile):TASKS[id].sample(S.profile));
// tệp đính kèm của bài đang làm (giữ tệp đã nộp, thêm/bỏ trước khi nộp)
const EX_MAX=5,EX_SIZE=20*1024*1024;
function exFiles(id){if(!T.exFiles||T.exFiles.id!==id)T.exFiles={id,list:((S.subs[id]&&S.subs[id].files)||[]).slice()};return T.exFiles.list;}
function exKeepDraft(id){const ta=document.getElementById('ex-text'),ls=[...document.querySelectorAll('.ex-link-i')].map(x=>x.value);T.draft={id,text:ta?ta.value:((T.draft&&T.draft.id===id&&T.draft.text)||''),links:ls.length?ls:null};}
const exDraftLinks=id=>T.draft&&T.draft.id===id&&T.draft.links?T.draft.links:((S.subs[id]&&S.subs[id].links)||[]).length?S.subs[id].links.slice():[''];
async function addExFiles(id,list){const cur=exFiles(id),errs=[];exKeepDraft(id);
 for(const f of [...list]){if(cur.length>=EX_MAX){errs.push(`Tối đa ${EX_MAX} tệp cho mỗi bài tập.`);break;}
  if(f.size>EX_SIZE){errs.push(`"${f.name}" lớn hơn 20 MB.`);continue;}
  if(cur.some(x=>x.name===f.name&&x.size===f.size))continue;
  cur.push(await readFile(f));}
 render();if(errs.length)toast(errs[0],'bad');else toast('Đã đính kèm tệp');}
function sampleUC(p){return (IND[p.industry]||IND['Khác']).uc.map(([uc,d,c],i)=>({uc,dept:d,cap:c,why:['Nhiều giờ công lặp lại, dữ liệu đã có sẵn','Ban giám đốc cần số liệu nhanh hơn','Giá trị lớn, làm thử được trong 4 tuần'][i]}));}
/* ---------- AI chấm bài tập ----------
   Kết quả: {score 0–10, pass, crit:[{k,name,score,note}], qs:[{st:'ok'|'short'|'miss'|'file'|'gen',note}], good:[], fix:[], ask, by:'ai'|'rule', at}
   Có LLM (sample) thì AI chấm theo đúng khung này; chạy local thì bộ luật exRuleReview mô phỏng. Hệ thống thật: AI đọc cả nội dung tệp đính kèm. */
const exQs=id=>{const t=TASKS[id];return [...(t.kind==='uc'?['Use case 1','Use case 2','Use case 3']:t.fields.map(f=>f.label)),...(t.linkTask?[t.linkTask]:[])];};
const exWords=x=>(x||'').split(/\s+/).filter(Boolean).length;
const exCount=(t,re)=>(t.match(re)||[]).length;
const clamp10=v=>Math.round(Math.max(0,Math.min(10,v))*2)/2;
// tách câu trả lời theo "Câu k:" / "Use case k:" (hoặc "k." nếu không có), trả về null nếu bài viết không đánh số
function exSplit(text,n,uc){
 let m=[...text.matchAll(uc?/(?:^|\n)\s*use\s*case\s*(\d{1,2})\s*[:.)\-–]?/gi:/(?:^|\n)\s*câu\s*(\d{1,2})\s*[:.)\-–]/gi)];
 if(!m.length)m=[...text.matchAll(/(?:^|\n)\s*(\d{1,2})[.)]\s/g)];
 if(!m.length)return null;
 const out=Array(n).fill('');m.forEach((x,i)=>{const k=+x[1]-1,end=i+1<m.length?m[i+1].index:text.length;if(k>=0&&k<n)out[k]+=(out[k]?'\n':'')+text.slice(x.index+x[0].length,end).trim();});return out;}
function exRuleReview(id){
 let n=0;const s=S.subs[id]||{},x=L[id],t=TASKS[id],text=s.text||'',files=s.files||[],links=s.links||[],qs=exQs(id),w=exWords(text),low=text.toLowerCase();
 n=qs.length-(t.linkTask?1:0);const parts=n===1?[text]:exSplit(text,n,t.kind==='uc');
 const qr=qs.map((q,i)=>{if(i>=n)return links.length?{st:'link',note:`Đã nộp link (${links.map(exHost).join(', ')}). AI mở link để xem bản dựng.`}:{st:'miss',note:'Chưa có link.'};if(!parts)return text?{st:'gen',note:'Bài viết chưa tách theo từng câu, AI chấm chung cả bài.'}:files.length?{st:'file',note:'Không có trong phần văn bản, AI đọc trong tệp đính kèm.'}:{st:'miss',note:'Chưa có câu trả lời.'};
  const ans=parts[i]||'',aw=exWords(ans);
  if(!aw)return files.length?{st:'file',note:'Không có trong phần văn bản, AI đọc trong tệp đính kèm.'}:{st:'miss',note:'Chưa thấy câu trả lời cho câu này.'};
  if(aw<6&&!(t.fields&&t.fields[i]&&t.fields[i].type!=='textarea'))return {st:'short',note:'Câu trả lời còn ngắn, nên thêm một ví dụ cụ thể.'};
  return {st:'ok',note:/\d/.test(ans)?'Rõ ràng, có số liệu cụ thể.':/phòng|bộ phận|crm|excel|drive|pos|ads|phần mềm|hệ thống|giám đốc|trưởng/i.test(ans)?'Rõ ràng, đã gắn với bộ phận hoặc hệ thống cụ thể.':'Đã trả lời. Có thể thêm một con số hoặc ví dụ để cụ thể hơn.'};});
 const val={ok:1,short:.6,file:.7,miss:0,gen:Math.min(1,w/(18*n))};
 val.link=1;const answered=qr.filter(q=>q.st!=='miss').length;
 const full=clamp10(10*qr.reduce((a,q)=>a+val[q.st],0)/qr.length);n=qr.length;
 const dig=exCount(text,/\d+/g),dept=exCount(low,/phòng|bộ phận|sales|bán hàng|marketing|kế toán|tài chính|cskh|chăm sóc khách|nhân sự|vận hành|kho|giám đốc|trưởng|đội/g),sys=exCount(low,/crm|erp|excel|drive|pos|zalo|facebook|meta|google|ads|website|email|phần mềm|hệ thống|misa|shopee|tiktok/g);
 const own=/phụ trách|chịu trách nhiệm|duyệt|trưởng|giám đốc|trợ lý|kế toán|ai sẽ|giao cho/.test(low),tm=/tuần|tháng|ngày|giờ|quý|bước|→|trước khi|sau khi|mỗi sáng|hằng/.test(low),out=/giảm|tăng|tiết kiệm|%|triệu|nhanh hơn|doanh thu|chi phí|kpi|giá trị/.test(low);
 const spec=!text&&(files.length||links.length)?6:clamp10(2+2*Math.min(dig,2)+1.5*Math.min(dept,2)+Math.min(sys,2)+(w>=60?1:0));
 const act=!text&&(files.length||links.length)?6:clamp10(3+(own?2.5:0)+(tm?2:0)+(out?2:0)+(w>=40?1:0));
 const crit=[{k:'full',score:full,note:answered===n&&full>=9?`Đã trả lời đủ ${n}/${n} câu.`:`Đã trả lời ${answered}/${n} câu${full<10&&answered===n?', một số câu còn ngắn':''}.`},
  {k:'spec',score:spec,note:spec>=8?'Có số liệu, bộ phận hoặc hệ thống cụ thể của công ty.':spec>=5?'Đã gắn với công ty, nên thêm số liệu (số giờ, chi phí, số người).':'Còn chung chung, chưa thấy số liệu hay bộ phận cụ thể.'},
  {k:'act',score:act,note:act>=8?'Đã có người phụ trách, mốc thời gian hoặc kết quả mong muốn.':act>=5?'Nên ghi rõ ai phụ trách và kết quả mong muốn.':'Chưa rõ ai làm, khi nào và đo kết quả thế nào.'}]
  .map(c=>({...c,name:EX_CRIT.find(e=>e[0]===c.k)[1]}));
 const score=Math.round((full*.4+spec*.3+act*.3)*10)/10;
 const good=[...(links.length?[`Đã nộp link bản làm: ${links.map(exHost).join(', ')}.`]:[]),...crit.filter(c=>c.score>=7).map(c=>c.note)];if(!good.length)good.push('Đã bắt đầu liên hệ nội dung bài học với công ty của anh/chị.');
 const fix=[];qr.forEach((q,i)=>{if(q.st==='miss')fix.push(i>=qs.length-(t.linkTask?1:0)&&t.linkTask?`Bổ sung câu ${i+1}: nộp link bản dựng thử để AI xem và chấm.`:`Bổ sung ${t.kind==='uc'?qs[i]:'câu '+(i+1)}: ${t.kind==='uc'?'việc, phòng ban, năng lực AI và lý do':qs[i]}`);else if(q.st==='short')fix.push(`Viết rõ hơn ${t.kind==='uc'?qs[i]:'câu '+(i+1)}.`);});
 if(spec<7)fix.push('Thêm 1 con số cụ thể: số giờ, chi phí hoặc số người liên quan.');
 if(act<7)fix.push('Ghi rõ ai phụ trách và kết quả muốn đạt sau 1 tháng.');
 if(!text&&(files.length||links.length))fix.push('Thêm vài dòng tóm tắt ý chính để đội ngũ đọc nhanh.');
 if(!parts&&n>1&&text)fix.push('Tách câu trả lời theo từng câu ("Câu 1: …") để dễ theo dõi.');
 return {score,pass:score>=EX_PASS,crit,qs:qr,good:good.slice(0,2),fix:fix.slice(0,3),ask:x.qs[1],by:'rule',at:nowStr()};}
async function feedbackFor(id){
 const s=S.subs[id];s.feedback={pending:true};render();
 const sample=await SAMPLE_P;let r=null;
 if(sample){try{const qs=exQs(id);
  const prompt=`Bạn là trợ giảng khóa AI for CEO. Chấm bài tập của một CEO ngành ${S.profile.industry||''}, tiếng Việt, gọi anh/chị, ngắn gọn, không dạy công cụ.
Chấm 3 tiêu chí thang 10 (bước 0,5): full = Trả lời đủ yêu cầu; spec = Cụ thể cho công ty (số liệu, bộ phận, hệ thống); act = Áp dụng được (ai phụ trách, mốc thời gian, kết quả).
Chỉ trả JSON: {"crit":[{"k":"full","score":0,"note":""},{"k":"spec","score":0,"note":""},{"k":"act","score":0,"note":""}],"qs":[{"st":"ok|short|miss","note":""}],"good":[""],"fix":[""],"ask":""}
qs có đúng ${qs.length} phần tử theo thứ tự câu hỏi; note tối đa 15 từ; good 1–2 ý, fix 1–3 ý; ask = 1 câu hỏi CEO nên hỏi đội ngũ.
Module: ${L[id].title}
Bài tập: ${TASKS[id].title}
Câu hỏi: ${qs.map((q,i)=>(i+1)+'. '+q).join(' | ')}
Bài làm:
${subText(id)}`;
  const o=sample.json?await sample.json(prompt,{cache:false,modelTier:'quick'}):JSON.parse((await sample(prompt,{cache:false,modelTier:'quick'})).text.replace(/^[^{]*|[^}]*$/g,''));
  if(o&&Array.isArray(o.crit)&&o.crit.length===3&&Array.isArray(o.qs)){const crit=EX_CRIT.map(([k,name])=>{const c=o.crit.find(c=>c.k===k)||{};return {k,name,score:clamp10(+c.score||0),note:String(c.note||'')};});
   const score=Math.round((crit[0].score*.4+crit[1].score*.3+crit[2].score*.3)*10)/10;
   r={score,pass:score>=EX_PASS,crit,qs:qs.map((_,i)=>({st:['ok','short','miss'].includes((o.qs[i]||{}).st)?o.qs[i].st:'ok',note:String((o.qs[i]||{}).note||'')})),good:(o.good||[]).slice(0,2).map(String),fix:(o.fix||[]).slice(0,3).map(String),ask:String(o.ask||L[id].qs[1]),by:'ai',at:nowStr()};}}catch(e){}}
 else await new Promise(r=>setTimeout(r,1400));
 s.feedback=r||exRuleReview(id);save();render();
 toast(`AI đã chấm xong: ${String(s.feedback.score).replace('.',',')}/10 · ${s.feedback.pass?'Đạt':'Cần bổ sung'}`);}
// Tệp ≤ 400 KB được lưu cả nội dung để tải lại; lớn hơn chỉ lưu tên (giới hạn của demo)
function readFile(file){return new Promise(res=>{if(!file||!file.name)return res(null);const meta={name:file.name,size:file.size,type:file.type};if(file.size>400*1024)return res(meta);const r=new FileReader();r.onload=()=>res({...meta,data:r.result});r.onerror=()=>res(meta);r.readAsDataURL(file);});}
function readUC(f){const fd=new FormData(f);return [0,1,2].map(i=>({uc:String(fd.get('uc'+i)||'').trim(),dept:fd.get('dept'+i),cap:fd.get('cap'+i),why:String(fd.get('why'+i)||'').trim()}));}

/* ---------- vẽ màn hình & điều hướng ---------- */
const $app=document.getElementById('app');
function render(){
 const scr=SCREENS[S.screen]||landing;
 // giữ chữ đang gõ dở trong ô chat chuyên gia khi màn hình vẽ lại (vd. chuyên gia vừa trả lời)
 const cmT=document.getElementById('cm-title'),cmB=document.getElementById('cm-body'),cmC=document.getElementById('cm-cat');if(cmT&&cmB&&T.commWrite)T.commDraft={title:cmT.value,body:cmB.value,cat:cmC?cmC.value:'ask'};
 const capEl=document.getElementById('share-cap');if(capEl)T.shareCap=capEl.value;
 const exIn=document.getElementById('ex-in'),exFocus=exIn&&document.activeElement===exIn;if(exIn)T.expertDraft=exIn.value;
 $app.innerHTML=demoBar()+header()+`<main>${scr()}</main>`+footer()+fab()+mailView()+shareView()+mediaViewer()+remindView()+zaloView()+drawerView();
 if(T.share)drawShare();
 if(document.getElementById('cert-cv'))drawCert();
 if(!T.syncing)save(); // vẽ lại do tab kia vừa lưu thì không lưu ngược lại
 // khả năng tiếp cận: vùng chat đọc được bằng trình đọc màn hình, lỗi có role=alert
 document.querySelectorAll('.chat-log').forEach(el=>{el.scrollTop=el.scrollHeight;el.setAttribute('role','log');el.setAttribute('aria-live','polite');});
 document.querySelectorAll('.err').forEach(el=>{el.setAttribute('role','alert');if(!el.querySelector('.ic'))el.insertAdjacentHTML('afterbegin',ic('x',16));});
 if(T.err.field){const f=document.getElementById(T.err.field);if(f){f.setAttribute('aria-invalid','true');f.focus({preventScroll:false});}}
 if(exFocus&&!T.focus)T.focus='expert';
 if(T.focus){const id={ob:'ob-in',asst:'asst-in',adj:'adj-in',expert:'ex-in'}[T.focus];const el=document.getElementById(id);if(el)el.focus({preventScroll:true});T.focus=null;}
}
// đánh dấu xong 1 phần (video/bài tập) và ghi lại ngày xong để Dashboard tính thời gian hoàn thành
function markDone(k){S.done[k]=true;if(!S.doneAt[k])S.doneAt[k]=Date.now();}
// Công cụ demo: giả lập đã học xong h bài đầu, mỗi ngày một bài (bài cuối xong hôm nay)
function simulateUpTo(h){
 const ls=lessons();h=Math.max(0,Math.min(h,ls.length));S.plan.start=dayStart(Date.now())-Math.max(0,h-1)*DAY;S.done={};S.doneAt={};
 S.spent={};ls.slice(0,h).forEach((ks,i)=>ks.forEach((k,j)=>{S.done[k]=true;S.doneAt[k]=planDay(i)+(8+i%4)*36e5+j*6e5;S.spent[k]=Math.round(U(k).m*(.9+((i*7+j*3)%6)/10)*10)/10;}));
 Object.keys(TASKS).forEach(id=>{const k='E:'+id;if(!S.done[k]){delete S.subs[id];return;}if(S.subs[id])return;const t=TASKS[id],at=new Date(S.doneAt[k]).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
  S.subs[id]={text:sampleText(id),files:[],at,v:1};S.subs[id].feedback={...exRuleReview(id),at};});
}
function go(to){if(to==='checkout'&&!S.loggedIn&&S.pay.status!=='success'){T.after='checkout';T.acTab=S.account?'login':'register';to='account';}S.screen=to;T.err={};T.draft=null;T.exFiles=null;render();hist();landScroll();}
// Lịch sử trình duyệt: nút Back của trình duyệt / vuốt quay lại trên điện thoại cũng quay về màn trước
function hist(replace){
 const cm=S.screen==='community',st={screen:S.screen,lesson:S.lesson,from:S.from||null,ci:cm?T.commId||null:null,ct:cm?T.commTab:null,cp:cm?T.commPost:null},cur=history.state;
 if(!replace&&cur&&cur.screen===st.screen&&cur.lesson===st.lesson&&cur.from===st.from&&cur.ct===st.ct&&cur.cp===st.cp&&cur.ci===st.ci)return;
 // tab cộng đồng giữ #community trên đường dẫn; rời cộng đồng thì bỏ, để tải lại trang không quay về cộng đồng
 const url=cm?'#community'+(T.commId?'-'+T.commId:''):location.pathname+location.search;
 try{history[replace?'replaceState':'pushState'](st,'',url);}catch(e){}
}
// Sau khi chuyển màn: về đầu trang, hoặc cuộn tới đúng mục vừa rời khỏi (bài học / thẻ bài tập)
function landScroll(){
 const i=T.focusLesson,id=T.focusEl;T.focusLesson=null;T.focusEl=null;
 const el=document.getElementById(id||(i!=null?'lr-learn-'+i:''));
 if(!el){window.scrollTo(0,0);return;}
 el.scrollIntoView({block:'center'});el.classList.add('flash');
 const b=el.querySelector('.cl-name,[data-a="openEx"]');if(b)b.focus({preventScroll:true});
}
// Trang bài học mở từ "Bài tập của tôi" thì quay lại đó, còn lại quay về danh sách bài học
function lessonBack(){return S.from==='outputs'?{a:'backToOutputs',t:'Bài tập của tôi'}:{a:'backToList',t:'Danh sách bài học'};}
// Phản hồi hệ thống: thông báo ngắn sau mỗi thao tác quan trọng
let toastTimer;
function toast(msg,kind='ok'){const el=document.getElementById('toast');if(!el)return;el.className=kind==='bad'?'bad':'';el.innerHTML=ic(kind==='bad'?'x':'check',18)+`<span>${esc(msg)}</span>`;requestAnimationFrame(()=>el.classList.add('show'));clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
// Khi nhảy thẳng tới một bước bằng thanh demo: tự nạp dữ liệu mẫu còn thiếu
function ensureFor(to){
 if(to==='outputs'||to==='dashboard')to='learn';
 const need=['mycourses','onboarding','syllabus','learn','complete'].includes(to);
 if(need&&!S.account)S.account={name:SAMPLE_PROFILE.name,phone:'0912 345 678',email:'long.nguyen@minhan.vn',createdAt:today()};
 if(need)S.loggedIn=true;
 if(need&&!S.enrolled){S.order=S.order||{code:'AICEO-'+Math.floor(100000+Math.random()*900000),name:S.account.name,phone:S.account.phone,email:S.account.email,company:SAMPLE_PROFILE.company,invoice:false,method:'qr',paidAt:today()};S.pay.status='success';S.enrolled=true;}
 if(to==='onboarding'&&!S.ob.flow.length&&!S.ob.done)startOb();
 if(['syllabus','learn','complete'].includes(to)&&!profileComplete(S.profile)){
  S.profile={...SAMPLE_PROFILE,...(S.eval?{industry:S.eval.industry,size:S.eval.size,level:S.eval.level,goals:S.eval.goals}:{}),name:S.order.name,company:S.order.company};
  S.ob={flow:[],i:0,msgs:[{role:'bot',text:'Hồ sơ mẫu đã được nạp cho demo.'}],multi:[],done:true};
 }
 if(['learn','complete'].includes(to)&&!S.plan){S.plan=rulePlan(S.profile);S.plan.accepted=true;S.plan.wasActive=true;}
}
// Sang phần tiếp theo trong bài; hết bài thì sang bài kế tiếp
function advance(){
 const ks=S.plan.lessons[S.lesson];const pos=ks.indexOf(S.unit);
 if(pos<ks.length-1){S.unit=ks[pos+1];render();window.scrollTo(0,0);return;}
 if(lessonDone(S.lesson))toast(`Hoàn thành Bài ${S.lesson+1}/${S.plan.lessons.length}`);
 const n=nextLesson();if(n<0){go('complete');return;}
 S.lesson=n;S.unit=null;S.from=null;render();hist();window.scrollTo(0,0);
}

/* ---------- xử lý nút bấm (data-a="…") ---------- */
const ACT={
 go:d=>{if(['mycourses','dashboard','learn','complete','syllabus','onboarding','outputs'].includes(d.to))ensureFor(d.to);T.editEx=null;go(d.to);},
 jump:d=>{ensureFor(d.to);go(d.to);},
 // tài khoản Học viện: bắt buộc có trước khi đăng ký mua khóa học
 acOpen:d=>{T.acTab=d.v;T.after=null;T.acDraft=null;go('account');},
 // ẩn/hiện mật khẩu: đổi trực tiếp, không vẽ lại để giữ chữ đang gõ
 pwToggle:(d,b)=>{const i=document.getElementById(d.v);if(!i)return;const show=i.type==='password';i.type=show?'text':'password';const l=show?'Ẩn mật khẩu':'Hiện mật khẩu';b.setAttribute('aria-label',l);b.title=l;b.setAttribute('aria-pressed',String(show));b.innerHTML=ic(show?'eyeoff':'eye',18);i.focus();},
 acForgot:()=>{const e=document.getElementById('l-email'),v=e&&e.value.trim();toast(v?`Đã gửi hướng dẫn đặt lại mật khẩu tới ${v} (mô phỏng)`:'Nhập email tài khoản rồi bấm Quên mật khẩu? để nhận hướng dẫn đặt lại',v?'ok':'bad');if(!v&&e)e.focus();},
 acTab:d=>{T.acTab=d.v;T.err={};render();},
 acSample:()=>{T.acDraft={name:SAMPLE_PROFILE.name,phone:'0912 345 678',email:'long.nguyen@minhan.vn'};T.err={};render();const p=document.getElementById('a-pass');if(p){p.value='matkhau123';p.focus();}},
 acSwitch:()=>{S.loggedIn=false;T.acDraft=null;toast('Đã đăng xuất. Đăng nhập hoặc tạo tài khoản khác');go('checkout');},
 // trang bài học → quay lại danh sách bài học, cuộn tới đúng bài đang xem
 // hộp thư mô phỏng: xem email tự động đã gửi cho học viên
 mailOpen:d=>{if(!d.v||d.v==='list'){if(!d.v){ensureSampleInvoice();ensureSampleReminders();}if(!S.mails.length){toast('Hộp thư chưa có email nào. Email xác nhận được gửi khi thanh toán thành công','bad');return;}T.mailOpen='list';T.asstOpen=false;render();return;}const m=S.mails.find(x=>x.id===d.v)||S.mails[0];if(!m)return;m.read=true;T.mailOpen=m.id;T.asstOpen=false;render();const b=document.querySelector('.gm-main');if(b)b.scrollTop=0;},
 mailResend:d=>{resendRealEmail(d.v);},
 invLookup:()=>{toast('Trang tra cứu hóa đơn điện tử thuộc nhà cung cấp hóa đơn, chưa có trong bản demo');},
 mailClose:()=>{T.mailOpen=null;render();},
 mailCta:()=>{T.mailOpen=null;ensureFor('mycourses');go('mycourses');toast('Đã mở khóa học từ email xác nhận');},
 backToList:()=>{T.focusLesson=S.lesson;S.from=null;T.editEx=null;go('learn');},
 // bài tập mở từ "Bài tập của tôi" → quay lại đó, cuộn tới đúng thẻ bài tập
 // Bài tập của tôi → danh sách bài học, cuộn tới bài đang học
 outputsBack:()=>{const n=nextLesson();T.focusLesson=n>=0?n:null;T.editEx=null;go('learn');},
 backToOutputs:()=>{T.focusEl='out-'+S.fromEx;S.from=null;T.editEx=null;go('outputs');},
 reset:()=>{S=DEFAULT();PREVIEW=null;Object.assign(T,{gen:null,asstOpen:false,tab:"ai",expertDraft:"",expertTyping:false,asstBusy:false,obTyping:false,err:{}});go('landing');toast('Đã làm lại demo từ đầu');},
 scrollTo:d=>{const el=document.getElementById(d.v);if(el)el.scrollIntoView({behavior:'smooth'});},
 // khóa học của tôi → vào đúng bước theo trạng thái
 openCourse:()=>{if(!S.ob.done){if(!S.ob.flow.length)startOb();go('onboarding');}else if(!S.plan||!(S.plan.accepted||S.plan.wasActive))go('syllabus');else go('learn');},
 // thanh toán
 invToggle:(d,el)=>{const b=document.getElementById('inv-box');if(b)b.hidden=!el.checked;},
 paySim:d=>{S.pay.sim=d.v;document.querySelectorAll('[data-a="paySim"]').forEach(b=>b.classList.toggle('on',b.dataset.v===d.v));save();},
 payRetry:()=>{S.pay.status='processing';S.pay.sim='success';render();setTimeout(()=>{S.pay.status='success';S.enrolled=true;S.order.paidAt=today();sendConfirmEmail();render();setTimeout(()=>{sendInvoiceEmail();render();},2600);},1300);},
 payChange:()=>{S.pay.status=null;S.pay.support=false;render();},
 paySupport:()=>{S.pay.support=true;render();},
 // onboarding
 startOnboarding:()=>{startOb();go('onboarding');},
 obChip:d=>{if(d.v==='__custom'){const el=document.getElementById('ob-in');if(el){el.focus();el.placeholder='Ví dụ: 10 ngày, 3 tuần…';}return;}obAnswer(d.v,d.l);},
 obToggle:d=>{const m=S.ob.multi;const i=m.indexOf(d.v);if(i>=0)m.splice(i,1);else if(m.length<3)m.push(d.v);render();},
 obGoalsDone:()=>{if(!S.ob.multi.length)return;const g=S.ob.multi.slice();S.ob.multi=[];obAnswer(g,g.map(x=>GOALS[x]).join(', '));},
 // lộ trình
 genPlan:()=>{go('syllabus');generate();},
 adjust:d=>{generate(d.q);},
 fixDays:d=>{const p0={...S.profile},was=!!(S.plan&&S.plan.wasActive);S.profile.days=+d.v;S.plan=rulePlan(S.profile);S.plan.wasActive=was;S.adjustLog.push({role:'bot',text:describeChanges(p0,S.profile)});render();},
 fixPace:d=>{const p0={...S.profile},was=!!(S.plan&&S.plan.wasActive);S.profile.minPerSession=+d.v;S.plan=rulePlan(S.profile);S.plan.wasActive=was;S.adjustLog.push({role:'bot',text:describeChanges(p0,S.profile)});render();},
 acceptPlan:()=>{if(!S.plan||S.plan.warning)return;T.drawer=null;const was=S.plan.wasActive;S.plan.accepted=true;S.plan.wasActive=true;go('learn');toast(was?'Đã lưu lộ trình mới':'Đã xác nhận lộ trình. Bắt đầu Bài 1 nhé!');},
 // học
 openLesson:d=>{if(!lessonOpen(+d.v)){toast(lockMsg(+d.v),'bad');return;}S.lesson=+d.v;S.unit=null;S.from=null;go('lesson');},
 selUnit:d=>{S.unit=d.v;render();},
 playUnit:()=>{if(U(S.unit).kind==='exercise')return;if(!S.done[S.unit])S.spent[S.unit]=(S.spent[S.unit]||0)+U(S.unit).m;markDone(S.unit);render();},
 // thanh điều khiển video (mô phỏng): sửa DOM trực tiếp qua vpSync(), không render() để giữ toàn màn hình
 vpMute:()=>{T.vp.muted=!T.vp.muted;if(!T.vp.muted&&!T.vp.vol)T.vp.vol=50;vpSync();},
 vpMenu:(d,a)=>{const m=document.querySelector('.vp-menu');if(!m)return;m.hidden=!m.hidden;a.setAttribute('aria-expanded',String(!m.hidden));if(!m.hidden){const c=m.querySelector('[aria-checked="true"]');if(c)c.focus();}},
 vpSet:d=>{const k=d.k,v=k==='speed'?+d.v:k==='cc'?d.v==='true':d.v;T.vp[k]=v;vpSync();const o=VP_OPTS[k].opts.find(x=>x[0]===v);toast(`${VP_OPTS[k].label}: ${o?o[1]:v}`);},
 vpPop:()=>{const p=document.querySelector('.player');const w=window.open('','aiceo-video','width=820,height=480');if(!w){toast('Trình duyệt đã chặn cửa sổ mới. Vui lòng cho phép cửa sổ bật lên.','bad');return;}
  const t=p?p.dataset.title:'',l=p?p.dataset.label:'';
  w.document.open();w.document.write(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${t} · AI for CEO</title><style>body{margin:0;height:100vh;display:grid;place-items:center;background:radial-gradient(120% 90% at 80% 0%,#22304F,#172033 60%);color:#fff;font-family:Roboto,system-ui,sans-serif;text-align:center}main{display:grid;gap:12px;justify-items:center;padding:24px}small{font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;color:#AEB6CA;font-weight:700}h1{font-size:22px;margin:0;max-width:32ch}p{color:#AEB6CA;font-size:13px;margin:0}</style></head><body><main><small>${l}</small><h1>${t}</h1><p>Video mô phỏng. Bản thật sẽ phát tiếp video ở đúng vị trí đang xem.</p></main></body></html>`);w.document.close();w.focus();},
 vpFull:()=>{const p=document.querySelector('.player');if(!p)return;if(document.fullscreenElement){document.exitFullscreen();return;}const f=p.requestFullscreen||p.webkitRequestFullscreen;if(!f){toast('Trình duyệt này chưa hỗ trợ toàn màn hình','bad');return;}const r=f.call(p);if(r&&r.catch)r.catch(()=>toast('Trình duyệt không cho phép toàn màn hình','bad'));},
 markNext:()=>{markDone(S.unit);advance();},
 asstLesson:()=>{T.asstOpen=true;T.tab="ai";askAssistant('Giải thích phần này theo góc nhìn CEO và công ty tôi có thể dùng ở đâu?');},
 // bài tập
 exSample:d=>{const el=document.getElementById('ex-text');if(el){el.value=sampleText(d.v);el.focus();}},
 exPick:()=>{const el=document.getElementById('ex-file');if(el)el.click();},
 exFileRm:d=>{exKeepDraft(d.id);exFiles(d.id).splice(+d.v,1);render();},
 exLinkAdd:d=>{exKeepDraft(d.id);const ls=exDraftLinks(d.id);if(ls.length<EX_LINKS)ls.push('');T.draft.links=ls;render();const el=document.getElementById('ex-link'+(ls.length-1));if(el)el.focus();},
 exLinkRm:d=>{exKeepDraft(d.id);const ls=exDraftLinks(d.id);ls.splice(+d.v,1);if(!ls.length)ls.push('');T.draft.links=ls;render();},
 editEx:d=>{T.editEx=d.v;T.err={};T.exFiles=null;T.draft=null;render();},
 cancelEdit:()=>{T.editEx=null;T.err={};T.draft=null;T.exFiles=null;render();},
 openEx:d=>{const li=lessonOfUnit('E:'+d.v);if(li<0)return;if(!S.subs[d.v]&&!lessonOpen(li)){toast(lockMsg(li),'bad');return;}S.lesson=li;S.unit='E:'+d.v;S.from='outputs';S.fromEx=d.v;T.editEx=null;go('lesson');},
 // công cụ demo
 simulateAll:d=>{simulateUpTo(lessons().length);go(d&&d.v==='dash'?'dashboard':'complete');toast('Đã mô phỏng học xong và nộp đủ bài tập');},
 simulateHalf:()=>{simulateUpTo(Math.ceil(lessons().length/2));render();toast('Đã mô phỏng học xong một nửa khóa');},
 policy:()=>{toast('Trang Điều khoản & Bảo mật chưa có trong bản demo');},
 // cộng đồng: luôn mở ở tab trình duyệt riêng (index.html#community)
 openCommunity:d=>{const id=(d&&d.v)||null;if(S.screen==='community'){T.commId=id;T.commTab='feed';T.commPost=null;render();hist();window.scrollTo(0,0);return;}
  T.commId=id;const w=window.open(location.href.split('#')[0]+'#community'+(id?'-'+id:''),'_blank');if(!w){go('community');toast('Trình duyệt chặn mở tab mới, cộng đồng được mở ngay tại đây');}},
 commJoin:()=>{const c=document.getElementById('cm-agree');if(!c||!c.checked){T.err={cm:'Anh/chị đánh dấu ô "Tôi đồng ý với quy tắc cộng đồng" để tham gia.',field:'cm-agree'};render();return;}S.comm.joined=true;T.err={};T.commTab='feed';render();window.scrollTo(0,0);toast(`Chào mừng anh/chị đến ${COMM.name}!`);},
 commHub:()=>{T.commId=null;T.commPost=null;T.err={};render();hist();window.scrollTo(0,0);},
 commEnter:d=>{T.commId=d.v;T.commTab='feed';T.commPost=null;T.err={};render();hist();window.scrollTo(0,0);},
 commAuth:d=>{T.acTab=d.v;T.after='community';T.acDraft=null;T.err={};S.screen='account';render();hist();window.scrollTo(0,0);},
 commTab:d=>{T.commTab=d.v;T.commPost=null;T.commMod=null;T.commVid=0;render();hist();window.scrollTo(0,0);},
 commMod:d=>{T.commMod=d.v||null;T.commVid=0;render();window.scrollTo(0,0);},
 commVid:d=>{T.commVid=+d.v||0;render();const p=document.querySelector('.cl-player');if(p)p.scrollIntoView({block:'nearest'});},
 commWatch:d=>{S.comm.watched=S.comm.watched||{};if(!S.comm.watched[d.v]){S.comm.watched[d.v]=true;save();toast('Đã đánh dấu xem xong video');}render();},
 commCat:d=>{T.commCat=d.v;render();},
 cmFileRm:d=>{(T.commFiles||[]).splice(+d.v,1);render();},
 mediaView:(d,b,e)=>{if(e)e.stopPropagation();T.mediaView={pid:d.v,i:+d.i||0};render();},
 mediaNav:d=>{const p=commPosts().find(x=>x.id===T.mediaView.pid),n=(p&&p.media||[]).length;if(!n)return;T.mediaView.i=(T.mediaView.i+ +d.v+n)%n;render();},
 mediaClose:()=>{T.mediaView=null;render();},
 commOpen:d=>{T.commPost=d.v;render();hist();window.scrollTo(0,0);},
 commBack:()=>{T.commPost=null;render();hist();},
 commLike:d=>{const L=S.comm.likes;if(L[d.v])delete L[d.v];else L[d.v]=true;render();},
 commWrite:d=>{T.commWrite=d.v==='1';T.err={};if(!T.commWrite){T.commDraft=null;T.commFiles=[];}render();if(T.commWrite){const el=document.getElementById('cm-title');if(el)el.focus();}},
 commEvent:d=>{S.comm.events[d.v]=true;sendEventEmail(+d.v);render();toast(`Đã đăng ký: ${COMM_EVENTS[d.v].title}. Email xác nhận đã gửi, xem trong Hộp thư`);},
 // nhắc lịch học (Email + Zalo OA)
 remindOpen:()=>{T.remindOpen=true;T.remindDraft={...S.remind,on:true,days:[1,2,3,4,5,6,0]};T.remindPreview=null;T.asstOpen=false;render();},
 remindClose:()=>{T.remindOpen=false;T.remindDraft=null;render();},
 remindLater:()=>{S.remind.asked=true;render();toast('Anh/chị có thể bật nhắc lịch học bất cứ lúc nào ở thẻ chuỗi ngày học');},
 remindSave:()=>{const d=T.remindDraft||S.remind;if(d.on&&!d.email&&!d.zalo){toast('Chọn ít nhất một kênh: Email hoặc Zalo','bad');return;}if(d.on&&!(d.days||[]).length){toast('Chọn ít nhất một ngày trong tuần','bad');return;}S.remind={...d,asked:true};T.remindOpen=false;T.remindDraft=null;render();toast(S.remind.on?`Đã lưu lịch nhắc: ${S.remind.time}, ${daysText(S.remind.days)}`:'Đã tắt nhắc lịch học');},
 remindTest:()=>{const d=T.remindDraft||S.remind;const keep=S.remind;S.remind={...d};const ok=sendReminder(T.remindPreview||remindKind());if(!ok)S.remind=keep;else{S.remind={...d,asked:true};}render();},
 zaloOpen:()=>{ensureSampleReminders();T.zaloOpen=true;S.zalo.forEach(m=>m.read=true);T.asstOpen=false;render();},
 zaloClose:()=>{T.zaloOpen=false;render();},
 zaloCta:d=>{T.zaloOpen=false;T.mailOpen=null;T.remindOpen=false;const to=d.v||'learn';if(to==='learn'){const n=nextLesson();if(n>=0){ensureFor('learn');S.lesson=n;S.unit=null;S.from=null;go('lesson');return;}}ensureFor(to);go(to);},
 // chứng nhận hoàn thành
 certDownload:async()=>{if(await certDownload())toast('Đã tải chứng nhận về máy');},
 certPrint:()=>{certPrint();},
 certShare:()=>{T.share='cert';T.shareCap=null;T.asstOpen=false;render();},
 // góp ý sau khóa học
 fbEdit:()=>{T.fbEdit=true;T.fbDraft=null;T.err={};render();const el=document.getElementById('feedback');if(el)el.scrollIntoView({block:'start'});},
 fbCancel:()=>{T.fbEdit=false;T.fbDraft=null;T.err={};render();const el=document.getElementById('feedback');if(el)el.scrollIntoView({block:'start'});},
 goFeedback:()=>{T.focusEl='feedback';go('complete');},
 // Dashboard & chia sẻ
 dashFilter:d=>{T.dashFilter=d.v;render();},
 jmVer:d=>{T.jmVer=+d.v;render();},
 // danh sách bài theo chương: mở/thu chương, mở chi tiết 1 bài; ngăn trượt Vì sao / Điều chỉnh
 cxToggle:d=>{const a=T.cx[d.k]||[],v=+d.v;T.cx[d.k]=a.includes(v)?a.filter(x=>x!==v):[...a,v];render();},
 lxToggle:d=>{if(T.clAll[d.k]){T.clAll[d.k]=false;T.lx[d.k]=null;}else T.lx[d.k]=T.lx[d.k]===+d.v?null:+d.v;render();},
 // mở hết chương + chi tiết mọi bài, hoặc thu gọn tất cả
 clAll:d=>{const on=!T.clAll[d.k];T.clAll[d.k]=on;T.lx[d.k]=null;T.cx[d.k]=on?chapters().map(c=>c.pi):[];render();},
 drawerOpen:d=>{T.drawer=d.v;T.asstOpen=false;render();if(d.v==='adjust'){const el=document.getElementById('adj-in');if(el)el.focus();}},
 drawerClose:()=>{T.drawer=null;render();},
 shareOpen:d=>{T.share=d.v;T.shareCap=null;T.asstOpen=false;render();},
 shareClose:()=>{T.share=null;render();},
 shareDownload:async()=>{if(await shareDownload())toast('Đã tải ảnh về máy');},
 // mở cửa sổ Facebook ngay trong lúc bấm (tránh bị chặn popup), rồi tải ảnh + sao chép nội dung
 shareFb:async()=>{const cap=(document.getElementById('share-cap')||{}).value||shareCaption(T.share);const url=location.href.split('#')[0];
  if(navigator.clipboard)navigator.clipboard.writeText(cap).catch(()=>{});
  window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url),'fbshare','width=640,height=640');
  const ok=await shareDownload();toast(ok?'Đã tải ảnh và sao chép nội dung. Dán nội dung vào Facebook rồi đính kèm ảnh':'Đã sao chép nội dung, mở Facebook để đăng');},
 shareNative:async()=>{const b=await shareBlob();if(!b)return;const file=new File([b],shareFileName(),{type:'image/png'});const cap=(document.getElementById('share-cap')||{}).value||'';
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],text:cap});toast('Đã mở chia sẻ');}catch(e){}}else{await shareDownload();toast('Thiết bị không hỗ trợ chia sẻ ảnh trực tiếp, ảnh đã được tải về');}},
 // sự kiện
 evReg:d=>{const i=EVENTS.findIndex(x=>x.id===d.v||String(EVENTS.indexOf(x))===String(d.v));if(i>=0)ACT.commEvent({v:String(i)});},
 liveRemind:()=>ACT.commEvent({v:String(EVENTS.findIndex(x=>x.k==='live'))}),
 offline:()=>ACT.commEvent({v:String(EVENTS.findIndex(x=>x.k==='offline'))}),
 // AI Assistant & hỗ trợ
 asstToggle:()=>{T.asstOpen=!T.asstOpen;if(T.asstOpen)ACT.chatTab({v:T.tab});else render();},
 // mở khung chat đúng tab; bấm lại nút đang mở thì đóng
 openChat:d=>{if(T.asstOpen&&T.tab===d.v){T.asstOpen=false;render();return;}T.asstOpen=true;ACT.chatTab(d);},
 chatTab:d=>{T.tab=d.v;if(d.v==='expert')S.expert.unread=0;T.focus=d.v==='expert'?'expert':'asst';render();},
 // Trợ lý AI chưa trả lời được → sang tab chuyên gia, điền sẵn câu hỏi gần nhất để anh/chị sửa rồi gửi
 toExpert:()=>{const last=[...S.asst].reverse().find(m=>m.role==='user');T.expertDraft=last?last.text:'';T.asstOpen=true;ACT.chatTab({v:'expert'});},
 expertAsk:d=>{expertSend(d.q);},
 asstAsk:d=>{askAssistant(d.q);},
 
};

/* ---------- xử lý form (data-f="…") ---------- */
const FORMS={
 checkoutSubmit:f=>{if(!S.loggedIn||!S.account){go('checkout');return;}const fd=new FormData(f);const o=Object.fromEntries(fd.entries());o.invoice=!!fd.get('invoice');o.email=S.account.email;
  S.order={...(S.order||{}),...o};
  if(!o.name.trim()){T.err={checkout:'Chưa có họ và tên. Nhập họ tên người học.',field:'c-name'};render();return;}
  if(!o.phone.trim()){T.err={checkout:'Chưa có số điện thoại / Zalo. Nhập số để Học viện liên hệ hỗ trợ.',field:'c-phone'};render();return;}
  if(!/^[0-9+\s().-]{9,}$/.test(o.phone.trim())){T.err={checkout:'Số điện thoại chưa đúng. Nhập ít nhất 9 chữ số, ví dụ: 0912 345 678.',field:'c-phone'};render();return;}
  if(!/^\S+@\S+\.\S+$/.test(o.email)){T.err={checkout:'Email chưa đúng định dạng. Ví dụ đúng: ten@congty.vn.',field:'c-email'};render();return;}
  if(o.invoice&&!String(o.taxId||'').trim()){T.err={checkout:'Chưa có mã số thuế. Nhập mã số thuế, hoặc bỏ chọn "Xuất hóa đơn cho công ty".',field:'c-tax'};render();return;}
  if(o.invoice&&!String(o.invName||'').trim()){T.err={checkout:'Chưa có tên công ty trên hóa đơn. Nhập tên công ty, hoặc bỏ chọn "Xuất hóa đơn cho công ty".',field:'c-invname'};render();return;}
  if(o.invoice&&!String(o.invAddr||'').trim()){T.err={checkout:'Chưa có địa chỉ công ty. Nhập địa chỉ ghi trên hóa đơn, hoặc bỏ chọn "Xuất hóa đơn cho công ty".',field:'c-invaddr'};render();return;}
  if(o.invoice&&!/^\S+@\S+\.\S+$/.test(String(o.invEmail||'').trim())){T.err={checkout:'Email nhận hóa đơn công ty chưa đúng. Nhập email kế toán, ví dụ: ketoan@congty.vn, hoặc bỏ chọn "Xuất hóa đơn cho công ty".',field:'c-invemail'};render();return;}
  T.err={};S.pay.method=o.method;S.order={...o,code:(S.order&&S.order.code)||'AICEO-'+Math.floor(100000+Math.random()*900000)};S.profile.name=o.name;S.profile.company=o.company;
  S.pay.status='processing';S.pay.support=false;render();window.scrollTo(0,0);
  setTimeout(()=>{if(S.pay.sim==='fail'){S.pay.status='failed';toast('Thanh toán chưa thành công','bad');}else{S.pay.status='success';S.enrolled=true;S.order.paidAt=today();toast('Thanh toán thành công, khóa học đã được kích hoạt');setTimeout(()=>{sendConfirmEmail();render();setTimeout(()=>{sendInvoiceEmail();render();},2600);},1800);}render();},1400);},
 acRegister:f=>{const fd=new FormData(f),v=k=>String(fd.get(k)||'').trim(),d={name:v('name'),phone:v('phone'),email:v('email').toLowerCase()};T.acDraft=d;
  const bad=(m,field)=>{T.err={ac:m,field};render();};
  if(!d.name)return bad('Chưa có họ và tên.','a-name');
  if(!d.phone)return bad('Chưa có số điện thoại / Zalo.','a-phone');
  if(!/^[0-9+\s().-]{9,}$/.test(d.phone))return bad('Số điện thoại chưa đúng. Nhập ít nhất 9 chữ số, ví dụ: 0912 345 678.','a-phone');
  if(!d.email)return bad('Chưa có email.','a-email');
  if(!/^\S+@\S+\.\S+$/.test(d.email))return bad('Email chưa đúng định dạng. Ví dụ đúng: ten@congty.vn.','a-email');
  if(S.account&&S.account.email===d.email)return bad('Email này đã có tài khoản. Chọn "Đăng nhập" để vào tài khoản.','a-email');
  if(v('pass').length<6)return bad('Mật khẩu cần ít nhất 6 ký tự.','a-pass');
  S.account={...d,createdAt:today()};S.loggedIn=true;T.err={};T.acDraft=null;if(!S.enrolled)S.order=null;toast('Đã tạo tài khoản Học viện');const to=T.after||'landing';T.after=null;go(to);},
 acLogin:f=>{const fd=new FormData(f),email=String(fd.get('email')||'').trim().toLowerCase(),pass=String(fd.get('pass')||'');T.acDraft={email};
  const bad=(m,field)=>{T.err={ac:m,field};render();};
  if(!/^\S+@\S+\.\S+$/.test(email))return bad('Email chưa đúng định dạng. Ví dụ đúng: ten@congty.vn.','l-email');
  if(!S.account||S.account.email!==email)return bad('Email này chưa có tài khoản Học viện. Chọn "Tạo tài khoản" để đăng ký.','l-email');
  if(!pass)return bad('Chưa nhập mật khẩu.','l-pass');
  S.loggedIn=true;T.err={};T.acDraft=null;toast('Đăng nhập thành công');const to=T.after||'landing';T.after=null;go(to);},
 obSend:f=>{const t=f.t.value.trim();if(!t)return;obText(t);},
 adjSend:f=>{const q=f.q.value.trim();if(!q)return;generate(q);},
 exSubmit:f=>{
  const id=f.dataset.id,prev=S.subs[id],t=TASKS[id],m=exMode(t),lab=submitLabel(t).main.toLowerCase(),files=exFiles(id).slice();
  const text=m.allow.includes('text')&&f.elements.text?String(f.elements.text.value||'').trim():'';
  const raw=[...f.querySelectorAll('.ex-link-i')].map(x=>x.value);const links=[];
  const keep=()=>{T.draft={id,text,links:raw.length?raw:null};render();};
  for(let i=0;i<raw.length;i++){if(!raw[i].trim())continue;const u=exUrl(raw[i]);if(!u){T.err={ex:`Link số ${i+1} chưa đúng định dạng. Dán đầy đủ địa chỉ, ví dụ https://congty.vn/trang-thu`,field:'ex-link'+i};keep();return;}if(!links.includes(u))links.push(u);}
  const has={text:!!text,file:files.length>0,link:links.length>0},FOC={text:'ex-text',file:'ex-drop',link:'ex-link0'},MSG={text:'Chưa nhập bài làm.',file:'Chưa đính kèm tệp.',link:'Chưa dán link.'};
  const lack=m.need.find(k=>!has[k]);
  if(lack){T.err={ex:`${MSG[lack]} Đề bài yêu cầu ${joinVi(m.need.map(k=>EX_PART[k]),'và')}.`,field:FOC[lack]};keep();return;}
  if(m.one&&!m.allow.some(k=>has[k])){T.err={ex:`Chưa có bài làm. Anh/chị ${lab}.`,field:FOC[m.allow[0]]};keep();return;}
  T.draft=null;T.err={};T.editEx=null;T.exFiles=null;S.subs[id]={text,files,links,at:nowStr(),v:prev?(prev.v||1)+1:1};markDone('E:'+id);
  save();
  // localStorage đầy thì chỉ giữ tên tệp (giới hạn của demo)
  if(files.some(x=>x.data)){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){S.subs[id].files=files.map(({data,...m})=>m);save();}}
  toast(prev?'Đã nộp lại bài tập. AI đang chấm…':'Đã nộp bài tập. AI đang chấm…');
  feedbackFor(id);},
 asstSend:f=>{const q=f.q.value.trim();if(!q)return;askAssistant(q);},
 // góp ý: bắt buộc chấm sao 5 mục + điểm giới thiệu; thiếu thì báo rõ mục nào, giữ lại những gì đã chọn
 fbSubmit:f=>{const fd=new FormData(f),ratings={},tags={};
  FEEDBACK_ASPECTS.forEach(x=>{const v=+fd.get('r_'+x.k)||0;if(v)ratings[x.k]=v;tags[x.k]=fd.getAll('t_'+x.k);});
  const npsRaw=fd.get('nps'),nps=npsRaw===null?undefined:+npsRaw;
  const data={ratings,tags,nps,good:(fd.get('good')||'').trim(),improve:(fd.get('improve')||'').trim(),quote:!!fd.get('quote')};
  const miss=FEEDBACK_ASPECTS.filter(x=>!ratings[x.k]).map(x=>x.k);if(nps===undefined)miss.push('nps');
  if(miss.length){T.fbDraft=data;const names=miss.map(k=>k==='nps'?'Khả năng giới thiệu':FEEDBACK_ASPECTS.find(x=>x.k===k).label);
   T.err={fb:`Còn thiếu: ${names.join(', ')}. Anh/chị chấm từ 1 đến 5 sao cho mỗi mục và chọn một điểm giới thiệu từ 0 đến 10.`,fbMiss:miss,field:'fbq-'+miss[0]};render();return;}
  S.feedback={...data,at:nowStr()};T.fbDraft=null;T.fbEdit=false;T.err={};render();
  const el=document.getElementById('feedback');if(el)el.scrollIntoView({block:'start'});toast('Cảm ơn anh/chị đã góp ý cho khóa học');},
 // cộng đồng: đăng bài, bình luận, tìm thành viên
 commPost:f=>{const title=f.title.value.trim(),body=f.body.value.trim(),cat=f.cat.value;T.commDraft={title,body,cat};
  if(!title){T.err={cmPost:'Bài viết chưa có tiêu đề. Nhập một câu ngắn nói rõ nội dung chính.',field:'cm-title'};render();return;}
  const files=T.commFiles||[];
  const id='u'+Date.now(),media=files.map(f=>({id:f.id,type:f.type,name:f.name}));files.forEach(f=>mediaPut(f.id,f.blob));S.comm.posts.unshift({id,by:meId,cat,title,body,at:Date.now(),likes:0,comments:[],media});T.commWrite=false;T.commDraft=null;T.commFiles=[];T.err={};T.commCat='all';render();toast(`Đã đăng bài lên cộng đồng · +${POST_PTS} điểm`);commReact(id,false);},
 commComment:f=>{const t=f.t.value.trim();if(!t)return;const id=f.dataset.id;(S.comm.comments[id]=S.comm.comments[id]||[]).push({by:meId,at:Date.now(),text:t});render();toast('Đã gửi bình luận');commReact(id,true);},
 commSearch:f=>{T.commQ=f.q.value.trim();render();},
 expertSend:f=>{const q=f.q.value.trim();if(!q)return;f.q.value='';expertSend(q);T.focus='expert';render();}
};

/* ---------- gắn sự kiện ---------- */
document.addEventListener('click',e=>{if(e.target.classList&&e.target.classList.contains('mail-ov')){T.mediaView=null;T.mailOpen=null;T.share=null;T.remindOpen=false;T.zaloOpen=false;T.drawer=null;render();return;}const a=e.target.closest('[data-a]');if(!a||a.disabled)return;const fn=ACT[a.dataset.a];if(!fn)return;if(a.tagName!=='INPUT')e.preventDefault();fn(a.dataset,a,e);});
// phần tử không phải nút nhưng bấm được (role=button + data-a): Enter / Space cũng kích hoạt như bấm chuột
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const t=e.target;if(t&&t.tagName!=='BUTTON'&&t.getAttribute&&t.getAttribute('role')==='button'&&t.dataset&&t.dataset.a){e.preventDefault();t.click();}});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-f]');if(!f)return;e.preventDefault();const fn=FORMS[f.dataset.f];if(fn)fn(f);});
// Dashboard: tooltip của biểu đồ khi rê chuột / dùng phím Tab
['pointermove','focusin'].forEach(t=>document.addEventListener(t,e=>{if(S.screen==='dashboard')chartTip(e);}));
window.addEventListener('scroll',()=>{const t=document.getElementById('ch-tip');if(t)t.hidden=true;},{passive:true});
window.addEventListener('popstate',e=>{
 const st=e.state;if(!st||!SCREENS[st.screen])return;
 if(st.screen==='lesson'&&!(S.plan&&S.plan.lessons[st.lesson]&&lessonOpen(st.lesson)))return;
 if(S.screen==='lesson'&&st.screen==='learn')T.focusLesson=S.lesson;
 if(S.screen==='lesson'&&st.screen==='outputs'&&S.from==='outputs')T.focusEl='out-'+S.fromEx;
 if(st.screen==='community'){T.commId=st.ci||null;T.commTab=st.ct||'feed';T.commPost=st.cp||null;}
 S.from=st.from||null;S.screen=st.screen;if(st.screen==='lesson'&&st.lesson!==S.lesson){S.lesson=st.lesson;S.unit=null;}
 T.err={};T.draft=null;T.editEx=null;render();landScroll();
});
// video: kéo âm lượng, đóng menu cài đặt khi bấm ra ngoài, cập nhật nút khi vào/thoát toàn màn hình
function vpSync(){const p=document.querySelector('.player');if(!p)return;const c=p.querySelector('.vp-ctl'),fa=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.a;
 if(c){const exp=c.querySelector('[data-a="vpMenu"]').getAttribute('aria-expanded');c.outerHTML=vpControls();p.querySelector('[data-a="vpMenu"]').setAttribute('aria-expanded',exp);if(fa&&fa!=='vpSet'){const b=p.querySelector(`.vp-ctl [data-a="${fa}"]`);if(b)b.focus();}}
 p.querySelectorAll('.vp-menu [data-k]').forEach(b=>{const k=b.dataset.k,v=k==='speed'?+b.dataset.v:k==='cc'?b.dataset.v==='true':b.dataset.v;b.setAttribute('aria-checked',String(T.vp[k]===v));});
 const cc=p.querySelector('.vp-cc');if(T.vp.cc&&!cc)p.insertAdjacentHTML('beforeend',`<p class="vp-cc">${esc(p.dataset.title)}</p>`);else if(!T.vp.cc&&cc)cc.remove();
 const sp=p.querySelector('.vp-speed');if(sp){sp.hidden=T.vp.speed===1;sp.textContent=String(T.vp.speed).replace('.',',')+'×';}}
const vpCloseMenu=()=>{const m=document.querySelector('.vp-menu:not([hidden])');if(!m)return false;m.hidden=true;const b=document.querySelector('[data-a="vpMenu"]');if(b){b.setAttribute('aria-expanded','false');b.focus();}return true;};
document.addEventListener('input',e=>{const t=e.target;if(!t.classList||!t.classList.contains('vp-vol'))return;const v=+t.value;T.vp.vol=v;T.vp.muted=v===0;t.style.setProperty('--v',v+'%');t.setAttribute('aria-valuetext',`Âm lượng ${v}%`);const b=t.previousElementSibling;if(b){b.innerHTML=ic(vpVolIc(),19);const l=T.vp.muted?'Bật tiếng':'Tắt tiếng';b.setAttribute('aria-label',l);b.title=l;}});
document.addEventListener('click',e=>{if(!e.target.closest('.vp-menu,[data-a="vpMenu"]')){const m=document.querySelector('.vp-menu:not([hidden])');if(m){m.hidden=true;const b=document.querySelector('[data-a="vpMenu"]');if(b)b.setAttribute('aria-expanded','false');}}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&vpCloseMenu())e.stopImmediatePropagation();},true);
['fullscreenchange','webkitfullscreenchange'].forEach(t=>document.addEventListener(t,vpSync));
// góp ý: hiện chữ mô tả ngay khi chọn số sao
document.addEventListener('change',e=>{
 if(e.target.id==='cm-file'&&e.target.files&&e.target.files.length){addCommFiles(e.target.files);e.target.value='';return;}
 if(e.target.id==='ex-file'&&e.target.files&&e.target.files.length){addExFiles(e.target.dataset.id,e.target.files);e.target.value='';return;}
 // cài đặt nhắc lịch: cập nhật bản nháp và phần xem trước
 const rk=e.target.dataset&&e.target.dataset.rm;if(rk&&T.remindOpen){if(rk==='preview')T.remindPreview=e.target.value;else if(rk==='day'){const cur=(T.remindDraft||S.remind).days||[],v=+e.target.value;T.remindDraft={...(T.remindDraft||S.remind),days:e.target.checked?[...new Set([...cur,v])]:cur.filter(x=>x!==v)};}else T.remindDraft={...(T.remindDraft||S.remind),[rk]:e.target.type==='checkbox'?e.target.checked:e.target.value};render();return;}
 const n=e.target.name||'';if(n.startsWith('r_')){const s=document.querySelector(`.star-txt[data-for="${n}"]`);if(s)s.textContent=STAR_LABEL[+e.target.value];const fs=e.target.closest('.fb-q');if(fs)fs.classList.remove('bad');}if(n==='nps'){const fs=e.target.closest('.fb-q');if(fs)fs.classList.remove('bad');}});
document.addEventListener('keydown',e=>{if(T.mediaView){if(e.key==='Escape'){T.mediaView=null;render();return;}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ACT.mediaNav({v:e.key==='ArrowLeft'?-1:1});return;}}if(e.key==='Escape'&&(T.mailOpen||T.share||T.remindOpen||T.zaloOpen||T.drawer)){T.mailOpen=null;T.share=null;T.remindOpen=false;T.zaloOpen=false;T.drawer=null;render();return;}if(e.key==='Escape'&&T.asstOpen){T.asstOpen=false;render();}});

/* ---------- khởi động ---------- */
// dọn dữ liệu cũ còn lưu trong trình duyệt từ các phiên bản demo trước
if(S.pay.status==='processing')S.pay.status=null;
if(!S.spent)S.spent={};
// đã bỏ chọn ngày trong tuần ở Nhắc lịch học (theo yêu cầu user): luôn nhắc mỗi ngày
if(S.remind)S.remind.days=[1,2,3,4,5,6,0];
// đơn cũ chỉ có 1 email xác nhận (trước khi tách 2 email) → bổ sung email "Khóa học đã được kích hoạt"
(S.mails||[]).filter(m=>m.kind==='confirm').forEach(m=>{if(!S.mails.some(x=>x.kind==='access'&&x.code===m.code))S.mails.splice(S.mails.indexOf(m),0,{...m,id:m.id+'a',kind:'access'});if(m.order)sendEnrollZalo(m.order,m.at);});
(S.zalo||[]).filter(z=>z.kind==='enroll'&&z.msg).forEach(z=>{const cm=S.mails.find(m=>m.kind==='confirm'&&m.code===z.code),o=(cm&&cm.order)||(S.order&&S.order.code===z.code?S.order:null);if(!o)return;const ms=enrollZaloMsgs(o);z.msg=z.msg.icon==='🔓'?ms[1]:ms[0];});
// bài nộp kiểu cũ (trả lời theo từng ô, 1 tệp) → văn bản + danh sách tệp
Object.keys(S.subs||{}).forEach(id=>{const s=S.subs[id];if(!s||!TASKS[id])return;if(s.text==null&&(s.fields||s.rows)){s.text=answerText(id,s.rows||s.fields);delete s.fields;delete s.rows;}if(s.text==null)s.text='';if(!s.files){s.files=s.file?[s.file]:[];delete s.file;}if(!s.links)s.links=[];if(s.feedback&&s.feedback.score==null)s.feedback=exRuleReview(id);});
// kéo thả tệp vào ô đính kèm bài tập
['dragenter','dragover'].forEach(t=>document.addEventListener(t,e=>{const z=e.target.closest&&e.target.closest('.ex-drop');if(!z)return;e.preventDefault();z.classList.add('over');}));
document.addEventListener('dragleave',e=>{const z=e.target.closest&&e.target.closest('.ex-drop');if(z&&!z.contains(e.relatedTarget))z.classList.remove('over');});
document.addEventListener('drop',e=>{const z=e.target.closest&&e.target.closest('.ex-drop');if(!z)return;e.preventDefault();z.classList.remove('over');if(e.dataTransfer&&e.dataTransfer.files.length)addExFiles(z.dataset.id,e.dataTransfer.files);});
Object.keys(S.done||{}).forEach(k=>{if(S.done[k]&&S.spent[k]==null){try{S.spent[k]=U(k).m;}catch(e){}}});
// thời gian thực học: đếm thời gian đang mở trang bài tập (tab đang hiện), 5 giây một lần; lưu mỗi 30 giây
let spentTick=0;setInterval(()=>{if(S.screen!=='lesson'||!S.unit||document.visibilityState!=='visible')return;const u=U(S.unit);if(!u||u.kind!=='exercise')return;S.spent[S.unit]=(S.spent[S.unit]||0)+5/60;if(++spentTick%6===0)save();},5000);
// cộng đồng: chủ đề "Thắng lợi AI" đã bỏ, bài cũ chuyển sang "Chia sẻ use case"
if(S.comm&&Array.isArray(S.comm.posts))S.comm.posts.forEach(p=>{if(p.cat==='win')p.cat='usecase';});
// sự kiện: chuyển trạng thái cũ (liveRemind/offline) sang S.evReg
// sự kiện: danh sách đã gộp (EVENTS), trạng thái đăng ký chỉ còn S.comm.events; chuyển trạng thái cũ của trang Khóa học sang (mỗi đơn 1 lần)
if(!S.evMerged){S.comm=S.comm||{};S.comm.events=S.comm.events||{};const r=S.evReg||{},li=EVENTS.findIndex(x=>x.k==='live'),oi=EVENTS.findIndex(x=>x.k==='offline');if(r['live-2610']||S.liveRemind)S.comm.events[li]=true;if(r['off-2611']||S.offline)S.comm.events[oi]=true;S.evMerged=true;}
// thư trùng mã (bản trước tạo nhiều thư trong cùng 1 mili giây) → đổi mã cho khác nhau, để bấm vào thư nào mở đúng thư đó
if(Array.isArray(S.mails)){const seen=new Set();S.mails.forEach(m=>{if(seen.has(m.id))m.id=mailId('d');seen.add(m.id);});}
// sự kiện cộng đồng đã đăng ký trước khi có email xác nhận: bổ sung email (mỗi sự kiện 1 lần)
if(S.comm&&S.comm.events&&Array.isArray(S.mails))Object.keys(S.comm.events).forEach(i=>{if(S.comm.events[i])sendEventEmail(+i);});
if(!PAY_METHODS[S.pay.method])S.pay.method='qr';
// tài khoản Học viện: dữ liệu cũ đã đăng ký khóa thì tạo tài khoản từ đơn hàng
if(S.enrolled&&!S.account&&S.order){S.account={name:S.order.name,phone:S.order.phone,email:S.order.email,createdAt:S.order.paidAt||today()};S.loggedIn=true;}
if(!SCREENS[S.screen])S.screen='landing';
if(!S.ob.flow.length&&!S.ob.done)S.eval=null; // bước Đánh giá đã bỏ: onboarding tự hỏi ngành, quy mô, mức AI, phòng ban
try{fixOb();}catch(e){S.ob={flow:[],i:0,msgs:[],multi:[],done:false};}
if(S.profile&&S.profile.days&&!S.profile.minPerSession)S.profile.minPerSession=30;
if(S.screen==='lesson'&&!(S.plan&&S.plan.lessons[S.lesson]))S.screen='learn';
S.asst=S.asst.filter(m=>!m.pending);
S.remind={...REMIND_DEFAULT,...(S.remind||{})};
S.comm={joined:false,posts:[],comments:{},likes:{},gotLikes:{},events:{},...(S.comm||{})};
// tab cộng đồng: mở bằng index.html#community
if(location.hash.indexOf('#community')===0){S.screen='community';T.commId=location.hash.slice(11)||null;}
else if(S.screen==='community'){S.screen=S.enrolled?'mycourses':'landing';}
// 2 tab (khóa học + cộng đồng) dùng chung dữ liệu: tab kia lưu thì nạp lại, giữ màn hình của tab này
window.addEventListener('storage',e=>{if(e.key!==LS||!e.newValue)return;const keep={screen:S.screen,lesson:S.lesson,unit:S.unit,from:S.from};try{S={...DEFAULT(),...JSON.parse(e.newValue),...keep};}catch(err){return;}T.syncing=true;try{render();}finally{T.syncing=false;}});if(!Array.isArray(S.zalo))S.zalo=[];
// bản lưu cũ: yêu cầu hỗ trợ dạng ticket → chuyển sang khung chat chuyên gia
if(!S.expert||!Array.isArray(S.expert.msgs))S.expert={id:null,msgs:[],unread:0,pending:false};
if(S.tickets){S.tickets.forEach(t=>{if(!S.expert.id)S.expert.id=t.id;S.expert.msgs.push({role:'user',text:t.q});if(t.reply)S.expert.msgs.push({role:'expert',text:t.reply});});delete S.tickets;}
scheduleExpert();
// biết có AI hay không thì cập nhật chấm trạng thái trên thanh demo
SAMPLE_P.then(s=>{T.ai=!!s;document.querySelectorAll('[data-ai]').forEach(el=>el.outerHTML=aiDot());});
render();hist(true);
