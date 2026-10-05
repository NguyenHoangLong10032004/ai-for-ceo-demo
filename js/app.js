/* =========================================================
   APP — trạng thái, lưu dữ liệu, điều hướng, xử lý nút bấm, khởi động
   File này nạp cuối cùng (sau data, planner, chatbot, screens).
   ========================================================= */

/* ---------- trạng thái ---------- */
// S: trạng thái lưu vào trình duyệt (localStorage). T: trạng thái tạm, mất khi tải lại trang.
const LS='aiceo-demo-v6';
const DEFAULT=()=>({screen:'landing',account:null,loggedIn:false,eval:null,fit:null,nurture:false,order:null,pay:{status:null,method:'qr',sim:'success',support:false},enrolled:false,
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
 const cmT=document.getElementById('cm-title'),cmB=document.getElementById('cm-body'),cmC=document.getElementById('cm-cat');if(cmT&&cmB&&T.commWrite)T.commDraft={title:cmT.value,body:cmB.value,cat:cmC?cmC.value:'ask'};
 const capEl=document.getElementById('share-cap');if(capEl)T.shareCap=capEl.value;
 const exIn=document.getElementById('ex-in'),exFocus=exIn&&document.activeElement===exIn;if(exIn)T.expertDraft=exIn.value;
 $app.innerHTML=demoBar()+header()+`<main>${scr()}</main>`+footer()+fab()+mailView()+shareView()+remindView()+zaloView()+drawerView();
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
 ls.slice(0,h).forEach((ks,i)=>ks.forEach((k,j)=>{S.done[k]=true;S.doneAt[k]=planDay(i)+(8+i%4)*36e5+j*6e5;}));
 Object.keys(TASKS).forEach(id=>{const k='E:'+id;if(!S.done[k]){delete S.subs[id];return;}if(S.subs[id])return;const t=TASKS[id],at=new Date(S.doneAt[k]).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
  S.subs[id]=t.kind==='uc'?{rows:sampleUC(S.profile),at,v:1}:{fields:t.sample(S.profile),at,v:1};S.subs[id].feedback={text:ruleFeedback(id,subText(id)),by:'rule',at};});
}
function go(to){if(to==='checkout'&&!S.loggedIn&&S.pay.status!=='success'){T.after='checkout';T.acTab=S.account?'login':'register';to='account';}S.screen=to;T.err={};T.draft=null;render();hist();landScroll();}
// Lịch sử trình duyệt: nút Back của trình duyệt / vuốt quay lại trên điện thoại cũng quay về màn trước
function hist(replace){
 const cm=S.screen==='community',st={screen:S.screen,lesson:S.lesson,from:S.from||null,ct:cm?T.commTab:null,cp:cm?T.commPost:null},cur=history.state;
 if(!replace&&cur&&cur.screen===st.screen&&cur.lesson===st.lesson&&cur.from===st.from&&cur.ct===st.ct&&cur.cp===st.cp)return;
 // tab cộng đồng giữ #community trên đường dẫn; rời cộng đồng thì bỏ, để tải lại trang không quay về cộng đồng
 const url=cm?'#community':location.pathname+location.search;
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
 mailOpen:d=>{if(!d.v)ensureSampleInvoice();const m=S.mails.find(x=>x.id===d.v)||S.mails[0];if(!m){toast('Hộp thư chưa có email nào. Email xác nhận được gửi khi thanh toán thành công','bad');return;}m.read=true;T.mailOpen=m.id;T.asstOpen=false;render();},
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
 playUnit:()=>{if(U(S.unit).kind==='exercise')return;markDone(S.unit);render();},
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
 exSample:d=>{const id=d.v,t=TASKS[id];if(t.kind==='uc'){ACT.ucSample();return;}const v=t.sample(S.profile);t.fields.forEach(f=>{const el=document.getElementById('ex-'+f.k);if(el&&v[f.k]!=null)el.value=v[f.k];});},
 ucSample:()=>{sampleUC(S.profile).forEach((r,i)=>{const s=(n,v)=>{const el=document.getElementById(n+i);if(el)el.value=v;};s('uc',r.uc);s('dept',r.dept);s('cap',r.cap);s('why',r.why);});},
 editEx:d=>{T.editEx=d.v;T.err={};render();},
 cancelEdit:()=>{T.editEx=null;T.err={};T.draft=null;render();},
 openEx:d=>{const li=lessonOfUnit('E:'+d.v);if(li<0)return;if(!S.subs[d.v]&&!lessonOpen(li)){toast(lockMsg(li),'bad');return;}S.lesson=li;S.unit='E:'+d.v;S.from='outputs';S.fromEx=d.v;T.editEx=null;go('lesson');},
 // công cụ demo
 simulateAll:d=>{simulateUpTo(lessons().length);go(d&&d.v==='dash'?'dashboard':'complete');toast('Đã mô phỏng học xong và nộp đủ bài tập');},
 simulateHalf:()=>{simulateUpTo(Math.ceil(lessons().length/2));render();toast('Đã mô phỏng học xong một nửa khóa');},
 policy:()=>{toast('Trang Điều khoản & Bảo mật chưa có trong bản demo');},
 // cộng đồng: luôn mở ở tab trình duyệt riêng (index.html#community)
 openCommunity:()=>{if(S.screen==='community'){T.commTab='feed';T.commPost=null;render();window.scrollTo(0,0);return;}
  const w=window.open(location.href.split('#')[0]+'#community','_blank');if(!w){go('community');toast('Trình duyệt chặn mở tab mới, cộng đồng được mở ngay tại đây');}},
 commJoin:()=>{const c=document.getElementById('cm-agree');if(!c||!c.checked){T.err={cm:'Anh/chị đánh dấu ô "Tôi đồng ý với quy tắc cộng đồng" để tham gia.',field:'cm-agree'};render();return;}S.comm.joined=true;T.err={};T.commTab='feed';render();window.scrollTo(0,0);toast(`Chào mừng anh/chị đến ${COMM.name}!`);},
 commTab:d=>{T.commTab=d.v;T.commPost=null;render();hist();window.scrollTo(0,0);},
 commCat:d=>{T.commCat=d.v;render();},
 commOpen:d=>{T.commPost=d.v;render();hist();window.scrollTo(0,0);},
 commBack:()=>{T.commPost=null;render();hist();},
 commLike:d=>{const L=S.comm.likes;if(L[d.v])delete L[d.v];else L[d.v]=true;render();},
 commWrite:d=>{T.commWrite=d.v==='1';T.err={};if(!T.commWrite)T.commDraft=null;render();if(T.commWrite){const el=document.getElementById('cm-title');if(el)el.focus();}},
 commEvent:d=>{S.comm.events[d.v]=true;render();toast(`Đã đăng ký: ${COMM_EVENTS[d.v].title}. Link tham gia sẽ gửi qua email`);},
 // nhắc lịch học (Email + Zalo OA)
 remindOpen:()=>{T.remindOpen=true;T.remindDraft={...S.remind,on:true};T.remindPreview=null;T.asstOpen=false;render();},
 remindClose:()=>{T.remindOpen=false;T.remindDraft=null;render();},
 remindLater:()=>{S.remind.asked=true;render();toast('Anh/chị có thể bật nhắc lịch học bất cứ lúc nào ở thẻ chuỗi ngày học');},
 remindSave:()=>{const d=T.remindDraft||S.remind;if(d.on&&!d.email&&!d.zalo){toast('Chọn ít nhất một kênh: Email hoặc Zalo','bad');return;}if(d.on&&!(d.days||[]).length){toast('Chọn ít nhất một ngày trong tuần','bad');return;}S.remind={...d,asked:true};T.remindOpen=false;T.remindDraft=null;render();toast(S.remind.on?`Đã lưu lịch nhắc: ${S.remind.time}, ${daysText(S.remind.days)}`:'Đã tắt nhắc lịch học');},
 remindTest:()=>{const d=T.remindDraft||S.remind;const keep=S.remind;S.remind={...d};const ok=sendReminder(T.remindPreview||remindKind());if(!ok)S.remind=keep;else{S.remind={...d,asked:true};}render();},
 zaloOpen:()=>{T.zaloOpen=true;S.zalo.forEach(m=>m.read=true);T.asstOpen=false;render();},
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
 exSubmit:async f=>{
  const id=f.dataset.id,t=TASKS[id],prev=S.subs[id];let data;
  if(t.kind==='uc'){const rows=readUC(f);const miss=rows.findIndex(r=>!r.uc);if(miss>=0){T.err={ex:`Use case số ${miss+1} còn trống. Điền đủ 3 use case, hoặc bấm "Điền gợi ý theo công ty của tôi".`,field:'uc'+miss};T.draft={id,rows};render();return;}data={rows};}
  else{const fd=new FormData(f);const fields={};t.fields.forEach(f2=>fields[f2.k]=String(fd.get(f2.k)||'').trim());
   const empty=t.fields.filter(f2=>f2.type!=='select'&&!fields[f2.k]);if(empty.length){T.err={ex:`Phần "${empty[0].label}" còn trống. Điền câu trả lời, hoặc bấm "Điền gợi ý theo công ty của tôi".`,field:'ex-'+empty[0].k};T.draft={id,fields};render();return;}data={fields};}
  T.draft=null;
  const fileEl=f.querySelector('input[type=file]');const file=fileEl&&fileEl.files&&fileEl.files[0]?await readFile(fileEl.files[0]):(prev&&prev.file)||null;
  T.err={};T.editEx=null;S.subs[id]={...data,file,at:nowStr(),v:prev?(prev.v||1)+1:1};markDone('E:'+id);
  save();
  if(file&&file.data){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){S.subs[id].file={name:file.name,size:file.size,type:file.type};}}
  toast(prev?'Đã nộp lại bài tập. Đang nhận xét…':'Đã nộp bài tập. Đang nhận xét…');
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
  if(body.length<10){T.err={cmPost:'Nội dung còn quá ngắn. Viết thêm vài câu để cộng đồng hiểu bài toán của anh/chị.',field:'cm-body'};render();return;}
  const id='u'+Date.now();S.comm.posts.unshift({id,by:meId,cat,title,body,at:Date.now(),likes:0,comments:[]});T.commWrite=false;T.commDraft=null;T.err={};T.commCat='all';render();toast('Đã đăng bài lên cộng đồng');commReact(id,false);},
 commComment:f=>{const t=f.t.value.trim();if(!t)return;const id=f.dataset.id;(S.comm.comments[id]=S.comm.comments[id]||[]).push({by:meId,at:Date.now(),text:t});render();toast('Đã gửi bình luận');commReact(id,true);},
 commSearch:f=>{T.commQ=f.q.value.trim();render();},
 expertSend:f=>{const q=f.q.value.trim();if(!q)return;f.q.value='';expertSend(q);T.focus='expert';render();}
};

/* ---------- gắn sự kiện ---------- */
document.addEventListener('click',e=>{if(e.target.classList&&e.target.classList.contains('mail-ov')){T.mailOpen=null;T.share=null;T.remindOpen=false;T.zaloOpen=false;T.drawer=null;render();return;}const a=e.target.closest('[data-a]');if(!a||a.disabled)return;const fn=ACT[a.dataset.a];if(!fn)return;if(a.tagName!=='INPUT')e.preventDefault();fn(a.dataset,a,e);});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-f]');if(!f)return;e.preventDefault();const fn=FORMS[f.dataset.f];if(fn)fn(f);});
// Dashboard: tooltip của biểu đồ khi rê chuột / dùng phím Tab
['pointermove','focusin'].forEach(t=>document.addEventListener(t,e=>{if(S.screen==='dashboard')chartTip(e);}));
window.addEventListener('scroll',()=>{const t=document.getElementById('ch-tip');if(t)t.hidden=true;},{passive:true});
window.addEventListener('popstate',e=>{
 const st=e.state;if(!st||!SCREENS[st.screen])return;
 if(st.screen==='lesson'&&!(S.plan&&S.plan.lessons[st.lesson]&&lessonOpen(st.lesson)))return;
 if(S.screen==='lesson'&&st.screen==='learn')T.focusLesson=S.lesson;
 if(S.screen==='lesson'&&st.screen==='outputs'&&S.from==='outputs')T.focusEl='out-'+S.fromEx;
 if(st.screen==='community'){T.commTab=st.ct||'feed';T.commPost=st.cp||null;}
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
 // cài đặt nhắc lịch: cập nhật bản nháp và phần xem trước
 const rk=e.target.dataset&&e.target.dataset.rm;if(rk&&T.remindOpen){if(rk==='preview')T.remindPreview=e.target.value;else if(rk==='day'){const cur=(T.remindDraft||S.remind).days||[],v=+e.target.value;T.remindDraft={...(T.remindDraft||S.remind),days:e.target.checked?[...new Set([...cur,v])]:cur.filter(x=>x!==v)};}else T.remindDraft={...(T.remindDraft||S.remind),[rk]:e.target.type==='checkbox'?e.target.checked:e.target.value};render();return;}
 const n=e.target.name||'';if(n.startsWith('r_')){const s=document.querySelector(`.star-txt[data-for="${n}"]`);if(s)s.textContent=STAR_LABEL[+e.target.value];const fs=e.target.closest('.fb-q');if(fs)fs.classList.remove('bad');}if(n==='nps'){const fs=e.target.closest('.fb-q');if(fs)fs.classList.remove('bad');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(T.mailOpen||T.share||T.remindOpen||T.zaloOpen||T.drawer)){T.mailOpen=null;T.share=null;T.remindOpen=false;T.zaloOpen=false;T.drawer=null;render();return;}if(e.key==='Escape'&&T.asstOpen){T.asstOpen=false;render();}});

/* ---------- khởi động ---------- */
// dọn dữ liệu cũ còn lưu trong trình duyệt từ các phiên bản demo trước
if(S.pay.status==='processing')S.pay.status=null;
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
if(location.hash==='#community'){S.screen='community';}
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
