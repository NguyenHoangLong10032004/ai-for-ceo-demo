/* =========================================================
   NHẮC LỊCH HỌC — kiểu Duolingo, qua Email và Zalo OA (đề xuất mới, mở rộng US-06.2 "Hôm nay học gì")
   Demo: cài đặt, chuỗi ngày học, nội dung nhắc theo tình huống, hộp thư Email + Zalo mô phỏng, gửi thử.
   Hệ thống thật: máy chủ chạy hẹn giờ mỗi phút, tìm học viên đến giờ nhắc mà hôm nay chưa học,
   gọi remindMessage() để chọn nội dung rồi gửi qua dịch vụ email và Zalo OA (ZNS). Trang tĩnh không tự gửi theo giờ được.
   ========================================================= */

// khung giờ nhắc chia theo buổi; ngoài ra có ô chọn giờ khác bất kỳ
const REMIND_SLOTS=[['Sáng',['06:00','06:30','07:00','07:30','08:00','09:00']],['Trưa',['11:30','12:00','12:30','13:00']],['Chiều',['15:00','16:00','17:00','17:30']],['Tối',['19:00','19:30','20:00','20:30','21:00','21:30','22:00']]];
const REMIND_TIMES=REMIND_SLOTS.flatMap(g=>g[1]);
// ngày trong tuần theo Date.getDay(): 1 = thứ Hai … 0 = Chủ nhật
const WEEKDAYS=[[1,'T2'],[2,'T3'],[3,'T4'],[4,'T5'],[5,'T6'],[6,'T7'],[0,'CN']];
const REMIND_DEFAULT={on:false,asked:false,time:'20:00',days:[1,2,3,4,5,6,0],email:true,zalo:true};
const daysText=d=>!d||d.length===7?'mỗi ngày':d.length===5&&[1,2,3,4,5].every(x=>d.includes(x))?'T2–T6':WEEKDAYS.filter(([k])=>d.includes(k)).map(([,l])=>l).join(', ');
const dayKey=t=>{const d=new Date(t);return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();};

/* ---------- chuỗi ngày học liên tiếp (streak) ---------- */
// 1 ngày được tính khi học xong ít nhất 1 phần (video/bài tập) trong ngày đó
function streakInfo(){
 const days=new Set(Object.values(S.doneAt||{}).map(dayKey)),today=dayStart(Date.now());
 const doneToday=days.has(dayKey(today));
 let n=0,t=doneToday?today:today-DAY;while(days.has(dayKey(t))){n++;t-=DAY;}
 // số ngày đã bỏ lỡ kể từ lần học gần nhất (0 = hôm qua có học hoặc hôm nay đã học)
 const all=Object.values(S.doneAt||{});const last=all.length?dayStart(Math.max(...all)):null;
 const missed=doneToday||last===null?0:Math.max(0,Math.round((today-last)/DAY)-1);
 return {streak:n,doneToday,missed,last};
}

/* ---------- chọn nội dung nhắc theo tình huống ---------- */
// kind: start (chưa học bài nào) · today (nhắc thường) · missed3 (bỏ lỡ 3+ ngày) · done. Hai trạng thái nội bộ không gửi tin: learned (đã học hôm nay), offday (ngày không chọn nhắc)
function remindKind(){
 const s=streakInfo(),ni=nextLesson();
 if(ni<0)return 'done';
 if(s.doneToday)return 'learned';
 if(S.remind.on&&S.remind.days&&!S.remind.days.includes(new Date().getDay()))return 'offday';
 if(s.last===null)return 'start';
 if(s.missed>=3)return 'missed3';
 // đã bỏ tình huống "Bỏ lỡ 1 ngày" (missed1) theo yêu cầu user: quá giờ nhắc mà chưa học thì gửi tin nhắc hằng ngày
 // đã bỏ tình huống "Giữ nhịp học" (risk) theo yêu cầu user: còn chuỗi ngày học thì nhắc như thường ngày
 return 'today';
}
function remindMessage(kind){
 kind=kind||remindKind();
 const s=streakInfo(),ni=Math.max(0,nextLesson()),ks=lessons()[ni]||[],name=firstName(),st=planStats();
 const lesson={no:ni+1,n:lessons().length,title:ks.length?lessonTitle(ks,ni,lessons()):'',min:ks.length?lessonMin(ks):0};
 // khi xem trước một tình huống chưa xảy ra, dùng số minh họa hợp lý (ví dụ chuỗi ít nhất 2 ngày, nghỉ ít nhất 3 ngày)
 const sk=kind==='risk'?Math.max(2,s.streak):s.streak,off=Math.max(3,s.missed);
 // nội dung theo bảng user duyệt (10/2026): title = tiêu đề Gmail, body dùng chung cho Gmail & Zalo OA
 const nm=(S.profile&&S.profile.name)||(S.order&&S.order.name)||'anh/chị',first=lessons()[0]?lessonTitle(lessons()[0],0,lessons()):'';
 const M={
  start:{icon:'🚀',title:'Khóa học AI for CEO của bạn đã sẵn sàng',body:`Chào ${nm}, khóa học AI for CEO của bạn đã sẵn sàng. Bắt đầu với “${first}” và khởi động hành trình học của bạn.`,cta:'Bắt đầu học'},
  today:{icon:'📚',title:'Bài học hôm nay của bạn',body:`Chào ${nm}, bài học tiếp theo trong lộ trình của bạn là “${lesson.title}”. Tiếp tục học để duy trì tiến độ nhé.`,cta:'Học ngay'},
  missed3:{icon:'🗓️',title:'Tiếp tục khóa học AI for CEO của bạn',body:`Chào ${nm}, bạn đã tạm dừng khóa học vài ngày. Bài tiếp theo là “${lesson.title}”. Bạn có thể tiếp tục ngay từ vị trí đã dừng.`,cta:'Tiếp tục học'},
  done:{icon:'🏆',title:'Chúc mừng bạn đã hoàn thành AI for CEO',body:`Chúc mừng ${nm}, bạn đã hoàn thành khóa học AI for CEO. Hãy xem lại hành trình, kết quả và những gì bạn đã đạt được trong suốt khóa học.`,cta:'Xem tổng kết',ctaTo:'dashboard'}};
 // đã học hôm nay / ngày không nhắc: không gửi tin; xem trước thì dùng tin nhắc hằng ngày
 if(!M[kind])kind=nextLesson()<0?'done':'today';
 const m=M[kind],cut=m.body.indexOf(', '),greet=m.body.slice(0,cut+1),text=m.body.slice(cut+2).replace(/^./,c=>c.toUpperCase());
 const rows=kind==='done'?[['Bài học',`${st.lessonsDone}/${st.n} bài`],['Bài tập',`${subsCount()}/${Object.keys(TASKS).length} bài`]]
  :kind==='start'&&lessons()[0]?[['Bài học',`Bài 1/${lesson.n}`],['Tên bài',first],['Thời lượng',`${lessonMin(lessons()[0])} phút`],['Tiến độ',`0/${st.n} bài đã hoàn thành`]]:lesson.title?[['Bài học',`Bài ${lesson.no}/${lesson.n}`],['Tên bài',lesson.title],['Thời lượng',`${lesson.min} phút`],['Tiến độ',`${st.lessonsDone}/${st.n} bài đã hoàn thành`]]:[];
 return {kind,...m,greet,text,intro:greet+'\n'+text,sections:rows.length?[{rows}]:[],lesson,streak:0,ctaTo:m.ctaTo||'learn'};
}
const REMIND_KIND_LABEL={start:'Chưa bắt đầu',today:'Nhắc hằng ngày',missed3:'Bỏ lỡ 3+ ngày',done:'Đã hoàn thành'};

/* ---------- email nhắc học ---------- */
function remindEmail(msg,opt={}){
 const logo=opt.logo||'img/logo.png',url=opt.url||'#';
 const html=`<div style="background:#F3F4F6;padding:24px 12px;font-family:Roboto,Arial,Helvetica,sans-serif;color:#141A26">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E8EC;border-radius:12px;border-collapse:separate">
<tr><td style="padding:22px 28px;border-bottom:1px solid #E6E8EC"><img src="${logo}" alt="${ACADEMY.name}" width="160" style="display:block;height:auto;max-width:160px"></td></tr>
<tr><td style="padding:28px 32px 12px">
 <h1 style="margin:0 0 16px;font-size:22px;line-height:1.35;color:#141A26">${esc(msg.title)}</h1>
 <p style="margin:0 0 6px;font-size:15px;line-height:1.65;color:#141A26;font-weight:600">${esc(msg.greet||'')}</p>
 <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#2B3240">${esc(msg.text||msg.body)}</p>
 ${(msg.sections&&msg.sections[0]&&msg.sections[0].rows||[]).length?`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F8FC;border:1px solid #E6EAF0;border-radius:10px;margin:0 0 24px"><tr><td style="padding:6px 18px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${msg.sections[0].rows.map(([k,v],i)=>`<tr><td style="padding:10px 0;font-size:14px;color:#5B6472;width:38%;${i?'border-top:1px solid #E6EAF0;':''}">${esc(k)}</td><td style="padding:10px 0;font-size:14px;color:#141A26;font-weight:600;text-align:right;${i?'border-top:1px solid #E6EAF0;':''}">${esc(v)}</td></tr>`).join('')}</table></td></tr></table>`:''}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px"><tr><td align="center">
  <a href="${url}" ${opt.ctaAttr||''} style="display:inline-block;background:#1747C9;color:#FFFFFF;text-decoration:none;font-weight:800;font-size:15px;padding:14px 34px;border-radius:10px">${esc(msg.cta)} →</a>
 </td></tr></table>
</td></tr>
${emailFooter({logo,url,reason:`Anh/chị nhận email này vì đã đặt lịch nhắc lúc ${esc(S.remind.time)}, ${daysText(S.remind.days)}. Đổi giờ hoặc tắt nhắc trong mục <b>Nhắc lịch học</b> của trang Khóa học.`})}</table></div>`;
 return {from:`${ACADEMY.name} <${ACADEMY.sender}>`,subject:msg.title,html,text:`${msg.title}\n\n${msg.greet?msg.greet+'\n'+msg.text:msg.body}\n\n${(msg.sections&&msg.sections[0]?msg.sections[0].rows.map(([k,v])=>k+': '+v).join('\n')+'\n\n':'')}${msg.cta}: ${url}`};
}

/* ---------- gửi nhắc (mô phỏng) ---------- */
function sendReminder(kind){
 const msg=remindMessage(kind),r=S.remind,sent=[];
 if(r.email&&S.order&&S.order.email){const m={id:'m'+Date.now(),kind:'remind',to:S.order.email,at:nowStr(),read:false,msg};S.mails.unshift(m);sent.push('email');if(realMailOn())sendRealEmail(m);}
 if(r.zalo){S.zalo.unshift({id:'z'+Date.now(),at:nowStr(),read:false,msg});sent.push('Zalo');}
 if(!sent.length){toast('Anh/chị chưa chọn kênh nhắc nào. Chọn Email hoặc Zalo rồi thử lại','bad');return false;}
 toast(`Đã gửi nhắc học qua ${sent.join(' và ')}: ${msg.title}`);return true;
}
// Hộp thư và Zalo mô phỏng luôn có đủ 4 mẫu tin nhắc lịch học (Chưa bắt đầu, Nhắc hằng ngày, Bỏ lỡ 3+ ngày, Đã hoàn thành)
// để xem hết các mẫu; tin mẫu đánh dấu sample, mỗi tình huống 1 tin, không thêm lại nếu đã có
const REMIND_SAMPLE_KINDS=['start','today','missed3','done'];
function ensureSampleReminders(){
 if(!S.plan||!lessons().length)return;const to=(S.order&&S.order.email)||(S.account&&S.account.email)||'';
 REMIND_SAMPLE_KINDS.forEach((kd,i)=>{let msg;try{msg=remindMessage(kd);}catch(e){return;}const at=nowStr();
  // mẫu Đã hoàn thành: hiện số liệu khi đã học xong toàn khóa
  if(kd==='done'){const n=lessons().length,nt=Object.keys(TASKS).length;msg={...msg,sections:[{rows:[['Bài học',n+'/'+n+' bài'],['Bài tập',nt+'/'+nt+' bài']]}]};}
  if(to&&!S.mails.some(m=>m.kind==='remind'&&m.sample&&m.msg&&m.msg.kind===kd))S.mails.push({id:'mr'+kd+Date.now(),kind:'remind',sample:true,to,at,read:false,msg});
  if(!S.zalo.some(z=>z.sample&&z.msg&&z.msg.kind===kd))S.zalo.unshift({id:'zr'+kd+Date.now(),sample:true,at,read:false,msg});});
}
const unreadZalo=()=>S.zalo.filter(m=>!m.read).length;

/* ---------- giao diện ---------- */
// 7 ngày của tuần hiện tại, bắt đầu từ thứ Hai (T2 → CN)
function weekDays(){
 const today=dayStart(Date.now()),mon=today-((new Date(today).getDay()+6)%7)*DAY,learned=new Set(Object.values(S.doneAt||{}).map(dayKey));
 return ['T2','T3','T4','T5','T6','T7','CN'].map((lb,i)=>{const t=mon+i*DAY;return {t,lb,on:learned.has(dayKey(t)),today:t===today,future:t>today};});
}
// thẻ trên trang Khóa học: trạng thái nhắc lịch học (đã bỏ phần chuỗi ngày học theo yêu cầu user)
function remindCard(){
 const r=S.remind;
 return `<div class="card pad rm-card"><div class="rm-state">${ic('bell',18)}<span><b>Nhắc lịch học</b><small>${r.on?`${r.time} · ${daysText(r.days)} · ${[r.email&&'Email',r.zalo&&'Zalo'].filter(Boolean).join(' + ')}`:'Chưa đặt lịch nhắc'}</small></span><button class="btn btn-line btn-sm" data-a="remindOpen">${r.on?'Sửa':'Đặt lịch'}</button></div></div>`;
}
// lời mời bật nhắc (hiện 1 lần ở trang Khóa học, giống Duolingo hỏi sau khi đặt mục tiêu)
function remindAsk(){
 if(S.remind.asked||S.remind.on)return '';
 return `<div class="callout info rm-ask"><span class="rm-ask-ico">${ic('bell',20)}</span><div><b>Nhắc lịch học</b><span>Chọn thời gian phù hợp để duy trì tiến độ.</span></div><div class="rm-ask-act"><button class="btn btn-line btn-sm" data-a="remindOpen">Đặt lịch nhắc</button><button class="btn btn-ghost btn-sm" data-a="remindLater">Để sau</button></div></div>`;
}
// hộp cài đặt
function remindView(){
 if(!T.remindOpen)return '';
 const r=T.remindDraft||S.remind;
 return `<div class="mail-ov" role="presentation"><div class="mail rm-modal" role="dialog" aria-modal="true" aria-label="Nhắc lịch học">
  <div class="mail-bar"><span class="mail-app">${ic('bell',16)} Nhắc lịch học</span><button class="x" data-a="remindClose" aria-label="Đóng">${ic('x')}</button></div>
  <div class="rm-body"><div class="rm-set">
   <label class="rm-switch"><input type="checkbox" data-rm="on" ${r.on?'checked':''}><span class="sw" aria-hidden="true"></span><span><b>Nhắc lịch học</b><small>Chọn thời gian phù hợp để duy trì tiến độ.</small></span></label>
   <fieldset class="rm-f"><legend>Giờ nhắc</legend><div class="rm-slots">${REMIND_SLOTS.map(([g,ts])=>`<div class="rm-slot"><span class="rm-slot-l">${g}</span><div class="rm-times">${ts.map(t=>`<label class="chk-chip"><input type="radio" name="rm-time" data-rm="time" value="${t}" ${r.time===t?'checked':''}><span>${t}</span></label>`).join('')}</div></div>`).join('')}</div></fieldset>
   <fieldset class="rm-f"><legend>Kênh</legend>
    <label class="opt"><input type="checkbox" data-rm="email" ${r.email?'checked':''}><span>${ic('mail',16)} Email · <b>${esc((S.order&&S.order.email)||'chưa có email')}</b></span></label>
    <label class="opt"><input type="checkbox" data-rm="zalo" ${r.zalo?'checked':''}><span class="zalo-ico">Z</span><span>Zalo OA Siêu Tăng Trưởng · <b>${esc((S.order&&S.order.phone)||'chưa có số điện thoại')}</b></span></label></fieldset>
   <div class="rm-rules"><b>Nhắc thông minh</b><ul><li>Đến giờ nhắc mà chưa học thì nhắc.</li><li>Đã học trước giờ nhắc thì không nhắc.</li><li>Tối đa 1 tin mỗi ngày.</li><li>Nghỉ lâu thì đề xuất điều chỉnh lộ trình.</li></ul></div>
  </div>
  </div>
  <div class="rm-foot"><button class="btn btn-primary" data-a="remindSave">Lưu lịch nhắc</button></div>
 </div></div>`;
}
/* ---------- Zalo OA mô phỏng: giao diện giống ứng dụng Zalo thật ----------
   Thanh trạng thái + header xanh Zalo (#0068FF): quay lại, ảnh đại diện OA, tên + dấu xác thực, "Official Account", nút gọi / menu.
   Nền chat xanh xám, mốc thời gian ở giữa, tin của OA là thẻ trắng (kiểu tin ZNS): tiêu đề đậm, nội dung, bảng thông tin,
   nút bấm nền xanh nhạt, giờ gửi ở góc dưới. Ảnh đại diện chỉ hiện ở tin đầu của mỗi nhóm. Cuối màn hình là ô soạn tin. */
const ZL_IC={back:'<path d="M15 5l-7 7 7 7"/>',call:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',smile:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
 more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 img:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>'};
const zlIc=(n,s=22)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ZL_IC[n]}</svg>`;
const zlAv=sm=>`<span class="zl-av${sm?' sm':''}" aria-hidden="true">S</span>`;
const zlTime=at=>(String(at||'').match(/\d{1,2}:\d{2}/)||[''])[0];
const zlRows=rows=>`<dl class="zl-rows">${rows.map(([k,v,st])=>`<div${st?' class="tot"':''}><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
// nội dung 1 tin (thẻ ZNS)
function zaloBubble(msg,at){
 const sec=s=>`<div class="zl-sec">${s.h?`<span class="zl-h">${esc(s.h)}</span>`:''}${s.p?`<p>${esc(s.p)}</p>`:''}${(s.rows||[]).length?zlRows(s.rows):''}${(s.steps||[]).length?`<ol class="zl-ol">${s.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:''}</div>`;
 const help=msg.help&&msg.help.lines?sec({h:'Cần hỗ trợ?',p:msg.help.intro,rows:msg.help.lines})+`<p class="zl-note">${esc(msg.help.note)}</p>`
  :Array.isArray(msg.help)&&msg.help.length?`<p class="zl-note">Cần hỗ trợ: ${msg.help.map(esc).join(' · ')}</p>`:'';
 return `<div class="zl-card"><div class="zl-brand"><img src="img/logo.png" alt="Siêu Tăng Trưởng" onerror="this.onerror=null;this.src='../Logo.png'"></div><b class="zl-title">${esc(msg.title)}</b>
  ${msg.intro?`<p>${esc(msg.intro)}</p>`:''}${msg.body&&!msg.intro?`<p>${esc(msg.body)}</p>`:''}
  ${(msg.sections||[]).map(sec).join('')}${(msg.rows||[]).length?zlRows(msg.rows):''}${(msg.steps||[]).length?sec({h:'Bước tiếp theo',steps:msg.steps}):''}
  ${help}${msg.streak>0?`<span class="zl-streak">🔥 Chuỗi ${msg.streak} ngày</span>`:''}
  <button class="zl-btn" data-a="zaloCta" data-v="${msg.ctaTo}">${esc(msg.cta)}</button>
  <span class="zl-at">${esc(zlTime(at))}</span></div>`;
}
// hộp thư Zalo mô phỏng (khung điện thoại)
function zaloView(){
 if(!T.zaloOpen)return '';
 const list=S.zalo.slice().reverse();let prev=null;
 const log=list.map((m,i)=>{const day=String(m.at||'');const sep=day!==prev;prev=day;
  return `${sep?`<div class="zl-sep"><span>${esc(day)}</span></div>`:''}<div class="zl-msg">${sep?zlAv():'<span class="zl-av-gap"></span>'}${zaloBubble(m.msg,m.at)}</div>`;}).join('');
 const now=new Date(),clock=`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
 return `<div class="mail-ov" role="presentation"><div class="zl-phone" role="dialog" aria-modal="true" aria-label="Zalo: Siêu Tăng Trưởng (mô phỏng)">
  <div class="zl-head">
   <div class="zl-status" aria-hidden="true"><b>${clock}</b><span>▂▄▆ 4G ▮</span></div>
   <div class="zl-top"><button class="x" data-a="zaloClose" aria-label="Đóng">${zlIc('back',24)}</button>${zlAv(1)}
    <div class="zl-name"><b>Siêu Tăng Trưởng <span class="zl-verified" title="Tài khoản đã xác thực">✓</span></b><small>Official Account</small></div>
    <span class="zl-tb" aria-hidden="true">${zlIc('call')}</span><span class="zl-tb" aria-hidden="true">${zlIc('menu')}</span></div>
  </div>
  <div class="zl-log" role="log" aria-label="Tin nhắn">${list.length?log:'<p class="zl-empty">Chưa có tin nhắn. Tin xác nhận đăng ký và nhắc lịch học sẽ hiện ở đây.</p>'}</div>
  <div class="zl-input" aria-hidden="true">${zlIc('smile',24)}<span class="ph">Tin nhắn</span>${zlIc('more',24)}${zlIc('mic',24)}${zlIc('img',24)}</div>
 </div></div>`;
}
