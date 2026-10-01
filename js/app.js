/* =========================================================
   APP — trạng thái, lưu dữ liệu, điều hướng, xử lý nút bấm, khởi động
   File này nạp cuối cùng (sau data, planner, chatbot, screens).
   ========================================================= */

/* ---------- trạng thái ---------- */
// S: trạng thái lưu vào trình duyệt (localStorage). T: trạng thái tạm, mất khi tải lại trang.
const LS='aiceo-demo-v6';
const DEFAULT=()=>({screen:'landing',eval:null,fit:null,nurture:false,order:null,pay:{status:null,method:'qr',sim:'success',support:false},enrolled:false,
 profile:{},ob:{flow:[],i:0,msgs:[],multi:[],done:false},plan:null,adjustLog:[],done:{},subs:{},lesson:0,unit:null,
 expert:{id:null,msgs:[],unread:0,pending:false},asst:[],completedAt:null,liveRemind:false,offline:false});
const T={gen:null,ai:null,asstOpen:false,tab:"ai",expertDraft:"",expertTyping:false,asstBusy:false,obTyping:false,focus:null,err:{},ph:{}};
function load(){try{const r=localStorage.getItem(LS);if(r){return Object.assign(DEFAULT(),JSON.parse(r));}}catch(e){}return DEFAULT();}
function save(){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}}
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
function subText(id){const t=TASKS[id],s=S.subs[id];if(!s)return '';
 if(t.kind==='uc')return s.rows.map((r,i)=>`${i+1}. ${r.uc} | ${GOALS[r.dept]||''} | ${r.cap}${r.why?` | ${r.why}`:''}`).join('\n');
 return t.fields.map(f=>`${f.label}\n${s.fields[f.k]||''}`).join('\n\n');}
function sampleUC(p){return (IND[p.industry]||IND['Khác']).uc.map(([uc,d,c],i)=>({uc,dept:d,cap:c,why:['Nhiều giờ công lặp lại, dữ liệu đã có sẵn','Ban giám đốc cần số liệu nhanh hơn','Giá trị lớn, làm thử được trong 4 tuần'][i]}));}
function ruleFeedback(id,text){const x=L[id];const words=text.split(/\s+/).filter(Boolean).length;
 const a=words<25?'Câu trả lời còn ngắn. Anh/chị thử thêm một con số cụ thể (bộ phận, số giờ, số tiền) để dễ giao việc cho đội ngũ.':'Câu trả lời đã có ví dụ cụ thể, đủ để mang vào cuộc họp với đội ngũ.';
 return `${a}\nCâu hỏi nên hỏi tiếp: ${x.qs[1]}`;}
async function feedbackFor(id){
 const text=subText(id);const s=S.subs[id];s.feedback={text:'',by:'',pending:true};render();
 const sample=await SAMPLE_P;let out=null,by='rule';
 if(sample){try{const r=await sample(`Bạn là trợ giảng khóa AI for CEO. Nhận xét bài tập của một CEO ngành ${S.profile.industry||''} bằng tiếng Việt, xưng em, gọi anh/chị, tối đa 70 từ: 1 điểm tốt, 1 gợi ý cụ thể để áp dụng trong công ty, 1 câu hỏi nên hỏi đội ngũ. Không dạy công cụ.\n\nModule: ${L[id].title}\nBài tập: ${TASKS[id].title}\nBài làm:\n${text}`,{cache:false,modelTier:'quick'});out=r.text;by='ai';}catch(e){}}
 else await new Promise(r=>setTimeout(r,600));
 s.feedback={text:out||ruleFeedback(id,text),by,at:nowStr()};render();}
// Tệp ≤ 400 KB được lưu cả nội dung để tải lại; lớn hơn chỉ lưu tên (giới hạn của demo)
function readFile(file){return new Promise(res=>{if(!file||!file.name)return res(null);const meta={name:file.name,size:file.size,type:file.type};if(file.size>400*1024)return res(meta);const r=new FileReader();r.onload=()=>res({...meta,data:r.result});r.onerror=()=>res(meta);r.readAsDataURL(file);});}
function readUC(f){const fd=new FormData(f);return [0,1,2].map(i=>({uc:String(fd.get('uc'+i)||'').trim(),dept:fd.get('dept'+i),cap:fd.get('cap'+i),why:String(fd.get('why'+i)||'').trim()}));}

/* ---------- vẽ màn hình & điều hướng ---------- */
const $app=document.getElementById('app');
function render(){
 const scr=SCREENS[S.screen]||landing;
 // giữ chữ đang gõ dở trong ô chat chuyên gia khi màn hình vẽ lại (vd. chuyên gia vừa trả lời)
 const exIn=document.getElementById('ex-in'),exFocus=exIn&&document.activeElement===exIn;if(exIn)T.expertDraft=exIn.value;
 $app.innerHTML=demoBar()+header()+`<main>${scr()}</main>`+footer()+fab();
 save();
 // khả năng tiếp cận: vùng chat đọc được bằng trình đọc màn hình, lỗi có role=alert
 document.querySelectorAll('.chat-log').forEach(el=>{el.scrollTop=el.scrollHeight;el.setAttribute('role','log');el.setAttribute('aria-live','polite');});
 document.querySelectorAll('.err').forEach(el=>{el.setAttribute('role','alert');if(!el.querySelector('.ic'))el.insertAdjacentHTML('afterbegin',ic('x',16));});
 if(T.err.field){const f=document.getElementById(T.err.field);if(f){f.setAttribute('aria-invalid','true');f.focus({preventScroll:false});}}
 if(exFocus&&!T.focus)T.focus='expert';
 if(T.focus){const id={ob:'ob-in',asst:'asst-in',adj:'adj-in',expert:'ex-in'}[T.focus];const el=document.getElementById(id);if(el)el.focus({preventScroll:true});T.focus=null;}
}
function go(to){S.screen=to;T.err={};T.draft=null;render();hist();landScroll();}
// Lịch sử trình duyệt: nút Back của trình duyệt / vuốt quay lại trên điện thoại cũng quay về màn trước
function hist(replace){
 const st={screen:S.screen,lesson:S.lesson,from:S.from||null},cur=history.state;
 if(!replace&&cur&&cur.screen===st.screen&&cur.lesson===st.lesson&&cur.from===st.from)return;
 try{history[replace?'replaceState':'pushState'](st,'');}catch(e){}
}
// Sau khi chuyển màn: về đầu trang, hoặc cuộn tới đúng mục vừa rời khỏi (bài học / thẻ bài tập)
function landScroll(){
 const i=T.focusLesson,id=T.focusEl;T.focusLesson=null;T.focusEl=null;
 const el=document.getElementById(id||(i!=null?'lr-learn-'+i:''));
 if(!el){window.scrollTo(0,0);return;}
 el.scrollIntoView({block:'center'});el.classList.add('flash');
 const b=el.querySelector('.tt button,[data-a="openEx"]');if(b)b.focus({preventScroll:true});
}
// Trang bài học mở từ "Bài tập của tôi" thì quay lại đó, còn lại quay về danh sách bài học
function lessonBack(){return S.from==='outputs'?{a:'backToOutputs',t:'Bài tập của tôi'}:{a:'backToList',t:'Danh sách bài học'};}
// Phản hồi hệ thống: thông báo ngắn sau mỗi thao tác quan trọng
let toastTimer;
function toast(msg,kind='ok'){const el=document.getElementById('toast');if(!el)return;el.className=kind==='bad'?'bad':'';el.innerHTML=ic(kind==='bad'?'x':'check',18)+`<span>${esc(msg)}</span>`;requestAnimationFrame(()=>el.classList.add('show'));clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
// Khi nhảy thẳng tới một bước bằng thanh demo: tự nạp dữ liệu mẫu còn thiếu
function ensureFor(to){
 if(to==='outputs')to='learn';
 const need=['mycourses','onboarding','syllabus','learn','complete'].includes(to);
 if(need&&!S.enrolled){S.order=S.order||{code:'AICEO-'+Math.floor(100000+Math.random()*900000),name:SAMPLE_PROFILE.name,phone:'0912 345 678',email:'long.nguyen@minhan.vn',company:SAMPLE_PROFILE.company,invoice:false,method:'qr',paidAt:today()};S.pay.status='success';S.enrolled=true;}
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
 go:d=>{if(['mycourses','learn','complete','syllabus','onboarding','outputs'].includes(d.to))ensureFor(d.to);T.editEx=null;go(d.to);},
 jump:d=>{ensureFor(d.to);go(d.to);},
 // trang bài học → quay lại danh sách bài học, cuộn tới đúng bài đang xem
 backToList:()=>{T.focusLesson=S.lesson;S.from=null;T.editEx=null;go('learn');},
 // bài tập mở từ "Bài tập của tôi" → quay lại đó, cuộn tới đúng thẻ bài tập
 // Bài tập của tôi → danh sách bài học, cuộn tới bài đang học
 outputsBack:()=>{const n=nextLesson();T.focusLesson=n>=0?n:null;T.editEx=null;go('learn');},
 backToOutputs:()=>{T.focusEl='out-'+S.fromEx;S.from=null;T.editEx=null;go('outputs');},
 reset:()=>{S=DEFAULT();PREVIEW=null;Object.assign(T,{gen:null,asstOpen:false,tab:"ai",expertDraft:"",expertTyping:false,asstBusy:false,obTyping:false,err:{}});go('landing');toast('Đã làm lại demo từ đầu');},
 scrollTo:d=>{const el=document.getElementById(d.v);if(el)el.scrollIntoView({behavior:'smooth'});},
 // danh sách bài học: thu gọn / mở ra chương
 phToggle:d=>{const a=T.ph[d.k]||[];const v=+d.v;T.ph[d.k]=a.includes(v)?a.filter(x=>x!==v):[...a,v];render();},
 phAll:d=>{const n=document.querySelectorAll(`[data-a="phToggle"][data-k="${d.k}"]`).length;T.ph[d.k]=d.v==='1'?[...Array(n).keys()]:[];render();},
 // khóa học của tôi → vào đúng bước theo trạng thái
 openCourse:()=>{if(!S.ob.done){if(!S.ob.flow.length)startOb();go('onboarding');}else if(!S.plan||!(S.plan.accepted||S.plan.wasActive))go('syllabus');else go('learn');},
 // thanh toán
 invToggle:(d,el)=>{const b=document.getElementById('inv-box');if(b)b.hidden=!el.checked;},
 paySim:d=>{S.pay.sim=d.v;document.querySelectorAll('[data-a="paySim"]').forEach(b=>b.classList.toggle('on',b.dataset.v===d.v));save();},
 payRetry:()=>{S.pay.status='processing';S.pay.sim='success';render();setTimeout(()=>{S.pay.status='success';S.enrolled=true;render();},1300);},
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
 acceptPlan:()=>{if(!S.plan||S.plan.warning)return;const was=S.plan.wasActive;S.plan.accepted=true;S.plan.wasActive=true;go('learn');toast(was?'Đã lưu lộ trình mới':'Đã xác nhận lộ trình. Bắt đầu Bài 1 nhé!');},
 // học
 openLesson:d=>{if(!lessonOpen(+d.v)){toast(lockMsg(+d.v),'bad');return;}S.lesson=+d.v;S.unit=null;S.from=null;go('lesson');},
 selUnit:d=>{S.unit=d.v;render();},
 playUnit:()=>{if(U(S.unit).kind==='exercise')return;S.done[S.unit]=true;render();},
 markNext:()=>{S.done[S.unit]=true;advance();},
 asstLesson:()=>{T.asstOpen=true;T.tab="ai";askAssistant('Giải thích phần này theo góc nhìn CEO và công ty tôi có thể dùng ở đâu?');},
 // bài tập
 exSample:d=>{const id=d.v,t=TASKS[id];if(t.kind==='uc'){ACT.ucSample();return;}const v=t.sample(S.profile);t.fields.forEach(f=>{const el=document.getElementById('ex-'+f.k);if(el&&v[f.k]!=null)el.value=v[f.k];});},
 ucSample:()=>{sampleUC(S.profile).forEach((r,i)=>{const s=(n,v)=>{const el=document.getElementById(n+i);if(el)el.value=v;};s('uc',r.uc);s('dept',r.dept);s('cap',r.cap);s('why',r.why);});},
 editEx:d=>{T.editEx=d.v;T.err={};render();},
 cancelEdit:()=>{T.editEx=null;T.err={};T.draft=null;render();},
 openEx:d=>{const li=lessonOfUnit('E:'+d.v);if(li<0)return;if(!S.subs[d.v]&&!lessonOpen(li)){toast(lockMsg(li),'bad');return;}S.lesson=li;S.unit='E:'+d.v;S.from='outputs';S.fromEx=d.v;T.editEx=null;go('lesson');},
 // công cụ demo
 simulateAll:()=>{lessons().flat().forEach(k=>S.done[k]=true);const at=nowStr();
  Object.keys(TASKS).forEach(id=>{if(S.subs[id])return;const t=TASKS[id];S.subs[id]=t.kind==='uc'?{rows:sampleUC(S.profile),at,v:1}:{fields:t.sample(S.profile),at,v:1};S.subs[id].feedback={text:ruleFeedback(id,subText(id)),by:'rule',at};});go('complete');toast('Đã mô phỏng học xong và nộp đủ bài tập');},
 // sự kiện
 liveRemind:()=>{S.liveRemind=true;render();toast('Đã đặt nhắc lịch buổi Live Zoom');},
 offline:()=>{S.offline=true;render();toast('Đã ghi nhận quan tâm Offline Executive Briefing');},
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
 checkoutSubmit:f=>{const fd=new FormData(f);const o=Object.fromEntries(fd.entries());o.invoice=!!fd.get('invoice');
  S.order={...(S.order||{}),...o};
  if(!o.name.trim()){T.err={checkout:'Chưa có họ và tên. Nhập họ tên để tạo tài khoản học.',field:'c-name'};render();return;}
  if(!/^[0-9+\s().-]{9,}$/.test(o.phone.trim())){T.err={checkout:'Số điện thoại chưa đúng. Nhập ít nhất 9 chữ số, ví dụ: 0912 345 678.',field:'c-phone'};render();return;}
  if(!/^\S+@\S+\.\S+$/.test(o.email)){T.err={checkout:'Email chưa đúng định dạng. Ví dụ đúng: ten@congty.vn.',field:'c-email'};render();return;}
  if(o.invoice&&!String(o.taxId||'').trim()){T.err={checkout:'Chưa có mã số thuế. Nhập mã số thuế, hoặc bỏ chọn "Xuất hóa đơn cho công ty".',field:'c-tax'};render();return;}
  if(o.invoice&&!String(o.invName||'').trim()){T.err={checkout:'Chưa có tên công ty trên hóa đơn. Nhập tên công ty, hoặc bỏ chọn "Xuất hóa đơn cho công ty".',field:'c-invname'};render();return;}
  T.err={};S.pay.method=o.method;S.order={...o,code:(S.order&&S.order.code)||'AICEO-'+Math.floor(100000+Math.random()*900000)};S.profile.name=o.name;S.profile.company=o.company;
  S.pay.status='processing';S.pay.support=false;render();window.scrollTo(0,0);
  setTimeout(()=>{if(S.pay.sim==='fail'){S.pay.status='failed';toast('Thanh toán chưa thành công','bad');}else{S.pay.status='success';S.enrolled=true;S.order.paidAt=today();toast('Thanh toán thành công, khóa học đã được kích hoạt');}render();},1400);},
 obSend:f=>{const t=f.t.value.trim();if(!t)return;obText(t);},
 adjSend:f=>{const q=f.q.value.trim();if(!q)return;generate(q);},
 exSubmit:async f=>{
  const id=f.dataset.id,t=TASKS[id],prev=S.subs[id];let data;
  if(t.kind==='uc'){const rows=readUC(f);const miss=rows.findIndex(r=>!r.uc);if(miss>=0){T.err={ex:`Use case số ${miss+1} còn trống. Điền đủ 3 use case, hoặc bấm "Điền gợi ý theo công ty của tôi".`,field:'uc'+miss};T.draft={id,rows};render();return;}data={rows};}
  else{const fd=new FormData(f);const fields={};t.fields.forEach(f2=>fields[f2.k]=String(fd.get(f2.k)||'').trim());
   const empty=t.fields.filter(f2=>f2.type!=='select'&&!fields[f2.k]);if(empty.length){T.err={ex:`Phần "${empty[0].label}" còn trống. Điền câu trả lời, hoặc bấm "Điền gợi ý theo công ty của tôi".`,field:'ex-'+empty[0].k};T.draft={id,fields};render();return;}data={fields};}
  T.draft=null;
  const fileEl=f.querySelector('input[type=file]');const file=fileEl&&fileEl.files&&fileEl.files[0]?await readFile(fileEl.files[0]):(prev&&prev.file)||null;
  T.err={};T.editEx=null;S.subs[id]={...data,file,at:nowStr(),v:prev?(prev.v||1)+1:1};S.done['E:'+id]=true;
  save();
  if(file&&file.data){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){S.subs[id].file={name:file.name,size:file.size,type:file.type};}}
  toast(prev?'Đã nộp lại bài tập. Đang nhận xét…':'Đã nộp bài tập. Đang nhận xét…');
  feedbackFor(id);},
 asstSend:f=>{const q=f.q.value.trim();if(!q)return;askAssistant(q);},
 expertSend:f=>{const q=f.q.value.trim();if(!q)return;f.q.value='';expertSend(q);T.focus='expert';render();}
};

/* ---------- gắn sự kiện ---------- */
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a||a.disabled)return;const fn=ACT[a.dataset.a];if(!fn)return;if(a.tagName!=='INPUT')e.preventDefault();fn(a.dataset,a,e);});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-f]');if(!f)return;e.preventDefault();const fn=FORMS[f.dataset.f];if(fn)fn(f);});
window.addEventListener('popstate',e=>{
 const st=e.state;if(!st||!SCREENS[st.screen])return;
 if(st.screen==='lesson'&&!(S.plan&&S.plan.lessons[st.lesson]&&lessonOpen(st.lesson)))return;
 if(S.screen==='lesson'&&st.screen==='learn')T.focusLesson=S.lesson;
 if(S.screen==='lesson'&&st.screen==='outputs'&&S.from==='outputs')T.focusEl='out-'+S.fromEx;
 S.from=st.from||null;S.screen=st.screen;if(st.screen==='lesson'&&st.lesson!==S.lesson){S.lesson=st.lesson;S.unit=null;}
 T.err={};T.draft=null;T.editEx=null;render();landScroll();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&T.asstOpen){T.asstOpen=false;render();}});

/* ---------- khởi động ---------- */
// dọn dữ liệu cũ còn lưu trong trình duyệt từ các phiên bản demo trước
if(S.pay.status==='processing')S.pay.status=null;
if(!SCREENS[S.screen])S.screen='landing';
if(!S.ob.flow.length&&!S.ob.done)S.eval=null; // bước Đánh giá đã bỏ: onboarding tự hỏi ngành, quy mô, mức AI, phòng ban
try{fixOb();}catch(e){S.ob={flow:[],i:0,msgs:[],multi:[],done:false};}
if(S.profile&&S.profile.days&&!S.profile.minPerSession)S.profile.minPerSession=30;
if(S.screen==='lesson'&&!(S.plan&&S.plan.lessons[S.lesson]))S.screen='learn';
S.asst=S.asst.filter(m=>!m.pending);
// bản lưu cũ: yêu cầu hỗ trợ dạng ticket → chuyển sang khung chat chuyên gia
if(!S.expert||!Array.isArray(S.expert.msgs))S.expert={id:null,msgs:[],unread:0,pending:false};
if(S.tickets){S.tickets.forEach(t=>{if(!S.expert.id)S.expert.id=t.id;S.expert.msgs.push({role:'user',text:t.q});if(t.reply)S.expert.msgs.push({role:'expert',text:t.reply});});delete S.tickets;}
scheduleExpert();
// biết có AI hay không thì cập nhật chấm trạng thái trên thanh demo
SAMPLE_P.then(s=>{T.ai=!!s;document.querySelectorAll('[data-ai]').forEach(el=>el.outerHTML=aiDot());});
render();hist(true);
