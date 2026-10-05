/* =========================================================
   NHẮC LỊCH HỌC — kiểu Duolingo, qua Email và Zalo OA (đề xuất mới, mở rộng US-06.2 "Hôm nay học gì")
   Demo: cài đặt, chuỗi ngày học, nội dung nhắc theo tình huống, hộp thư Email + Zalo mô phỏng, gửi thử.
   Hệ thống thật: máy chủ chạy hẹn giờ mỗi phút, tìm học viên đến giờ nhắc mà hôm nay chưa học,
   gọi remindMessage() để chọn nội dung rồi gửi qua dịch vụ email và Zalo OA (ZNS). Trang tĩnh không tự gửi theo giờ được.
   ========================================================= */

const REMIND_TIMES=['06:30','07:30','12:00','20:00','21:30'];
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
// kind: start (chưa học bài nào) · today (nhắc thường) · risk (đang giữ nhịp) · missed1 · missed3 (bỏ lỡ 3+ ngày) · done. Hai trạng thái nội bộ không gửi tin: learned (đã học hôm nay), offday (ngày không chọn nhắc)
function remindKind(){
 const s=streakInfo(),ni=nextLesson();
 if(ni<0)return 'done';
 if(s.doneToday)return 'learned';
 if(S.remind.on&&S.remind.days&&!S.remind.days.includes(new Date().getDay()))return 'offday';
 if(s.last===null)return 'start';
 if(s.missed>=3)return 'missed3';
 if(s.missed>=1)return 'missed1';
 if(s.streak>=2)return 'risk';
 return 'today';
}
function remindMessage(kind){
 kind=kind||remindKind();
 const s=streakInfo(),ni=Math.max(0,nextLesson()),ks=lessons()[ni]||[],name=firstName(),st=planStats();
 const lesson={no:ni+1,n:lessons().length,title:ks.length?lessonTitle(ks,ni,lessons()):'',min:ks.length?lessonMin(ks):0};
 // khi xem trước một tình huống chưa xảy ra, dùng số minh họa hợp lý (ví dụ chuỗi ít nhất 2 ngày, nghỉ ít nhất 3 ngày)
 const sk=kind==='risk'?Math.max(2,s.streak):s.streak,off=Math.max(3,s.missed);
 const M={
  start:{icon:'🚀',title:'Lộ trình của anh/chị đã sẵn sàng',body:`Hôm nay: Bài 1 · ${lesson.min} phút.`,cta:'Bắt đầu'},
  today:{icon:'📚',title:`Hôm nay: ${lesson.title} · ${lesson.min} phút`,body:`Bài ${lesson.no}/${lesson.n} trong lộ trình của anh/chị.`,cta:'Học tiếp'},
  risk:{icon:'⏰',title:'Đến giờ học AI rồi.',body:`Anh/chị đang học ${sk} ngày liên tiếp. Hôm nay: Bài ${lesson.no} · ${lesson.min} phút.`,cta:'Học tiếp'},
  missed1:{icon:'📚',title:`Tiếp tục với Bài ${lesson.no}`,body:`${lesson.title} · ${lesson.min} phút. Một bài hôm nay là bắt kịp lộ trình.`,cta:'Học tiếp'},
  missed3:{icon:'🗓️',title:'Điều chỉnh lộ trình cho vừa lịch?',body:`Tiến độ ${st.lessonsDone}/${st.n} bài vẫn được giữ. Có thể giãn thêm ngày hoặc rút ngắn mỗi bài.`,cta:'Điều chỉnh',ctaTo:'syllabus'},
  done:{icon:'🏆',title:'Anh/chị đã hoàn thành AI for CEO',body:'Hệ thống dừng nhắc học hằng ngày.',cta:'Xem chứng nhận',ctaTo:'complete'}};
 // đã học hôm nay / ngày không nhắc: không gửi tin; xem trước thì dùng tin nhắc hằng ngày
 if(!M[kind])kind=nextLesson()<0?'done':'today';
 return {kind,...M[kind],lesson,streak:kind==='risk'?sk:s.streak,ctaTo:M[kind].ctaTo||'learn'};
}
const REMIND_KIND_LABEL={start:'Chưa bắt đầu',today:'Nhắc hằng ngày',risk:'Giữ nhịp học',missed1:'Bỏ lỡ 1 ngày',missed3:'Bỏ lỡ 3+ ngày',done:'Đã hoàn thành'};

/* ---------- email nhắc học ---------- */
function remindEmail(msg,opt={}){
 const logo=opt.logo||'img/logo.png',url=opt.url||'#';
 const html=`<div style="background:#F3F4F6;padding:24px 12px;font-family:Roboto,Arial,Helvetica,sans-serif;color:#141A26">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E8EC;border-radius:12px;border-collapse:separate">
<tr><td style="padding:22px 28px;border-bottom:1px solid #E6E8EC"><img src="${logo}" alt="${ACADEMY.name}" width="160" style="display:block;height:auto;max-width:160px"></td></tr>
<tr><td style="padding:30px 28px 10px;text-align:center">
 <div style="font-size:44px;line-height:1">${msg.icon}</div>
 <h1 style="margin:14px 0 10px;font-size:22px;line-height:1.35;color:#141A26">${esc(msg.title)}</h1>
 <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#2B3240">${esc(msg.body)}</p>
 ${msg.streak>0?`<p style="margin:0 0 18px"><span style="display:inline-block;background:#FFF1E6;color:#C2410C;font-weight:800;font-size:14px;padding:6px 14px;border-radius:99px">🔥 Chuỗi ${msg.streak} ngày học</span></p>`:''}
 ${msg.lesson.title&&['start','today','risk','missed1'].includes(msg.kind)?`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2FC;border-radius:10px;margin:0 0 20px"><tr><td style="padding:14px 18px;text-align:left"><div style="font-size:12px;font-weight:700;letter-spacing:.06em;color:#1747C9">BÀI ${msg.lesson.no}/${msg.lesson.n} · ${msg.lesson.min} PHÚT</div><div style="font-size:15px;font-weight:700;margin-top:4px;color:#141A26">${esc(msg.lesson.title)}</div></td></tr></table>`:''}
 <a href="${url}" ${opt.ctaAttr||''} style="display:inline-block;background:#1747C9;color:#FFFFFF;text-decoration:none;font-weight:800;font-size:15px;padding:14px 30px;border-radius:10px">${esc(msg.cta)} →</a>
</td></tr>
<tr><td style="padding:22px 28px 24px;font-size:12.5px;line-height:1.7;color:#5B6472;text-align:center">
 Anh/chị nhận email này vì đã đặt lịch nhắc lúc ${esc(S.remind.time)}, ${daysText(S.remind.days)}.<br>Đổi giờ hoặc tắt nhắc trong mục <b>Nhắc lịch học</b> của trang Khóa học.<br><b style="color:#141A26">${ACADEMY.name}</b> · ${ACADEMY.web}
</td></tr></table></div>`;
 return {from:`${ACADEMY.name} <${ACADEMY.sender}>`,subject:`${msg.icon} ${msg.title}`,html,text:`${msg.title}\n\n${msg.body}\n\n${msg.cta}: ${url}`};
}

/* ---------- gửi nhắc (mô phỏng) ---------- */
function sendReminder(kind){
 const msg=remindMessage(kind),r=S.remind,sent=[];
 if(r.email&&S.order&&S.order.email){const m={id:'m'+Date.now(),kind:'remind',to:S.order.email,at:nowStr(),read:false,msg};S.mails.unshift(m);sent.push('email');if(realMailOn())sendRealEmail(m);}
 if(r.zalo){S.zalo.unshift({id:'z'+Date.now(),at:nowStr(),read:false,msg});sent.push('Zalo');}
 if(!sent.length){toast('Anh/chị chưa chọn kênh nhắc nào. Chọn Email hoặc Zalo rồi thử lại','bad');return false;}
 toast(`Đã gửi nhắc học qua ${sent.join(' và ')}: ${msg.title}`);return true;
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
 const r=T.remindDraft||S.remind,pk=T.remindPreview||remindMessage().kind,msg=remindMessage(pk);
 return `<div class="mail-ov" role="presentation"><div class="mail rm-modal" role="dialog" aria-modal="true" aria-label="Nhắc lịch học">
  <div class="mail-bar"><span class="mail-app">${ic('bell',16)} Nhắc lịch học</span><button class="x" data-a="remindClose" aria-label="Đóng">${ic('x')}</button></div>
  <div class="rm-body"><div class="rm-set">
   <label class="rm-switch"><input type="checkbox" data-rm="on" ${r.on?'checked':''}><span class="sw" aria-hidden="true"></span><span><b>Nhắc lịch học</b><small>Chọn thời gian phù hợp để duy trì tiến độ.</small></span></label>
   <fieldset class="rm-f"><legend>Ngày trong tuần</legend><div class="rm-times">${WEEKDAYS.map(([k,l])=>`<label class="chk-chip"><input type="checkbox" data-rm="day" value="${k}" ${(r.days||[]).includes(k)?'checked':''}><span>${l}</span></label>`).join('')}</div></fieldset>
   <fieldset class="rm-f"><legend>Giờ nhắc</legend><div class="rm-times">${REMIND_TIMES.map(t=>`<label class="chk-chip"><input type="radio" name="rm-time" data-rm="time" value="${t}" ${r.time===t?'checked':''}><span>${t}</span></label>`).join('')}</div></fieldset>
   <fieldset class="rm-f"><legend>Kênh</legend>
    <label class="opt"><input type="checkbox" data-rm="email" ${r.email?'checked':''}><span>${ic('mail',16)} Email · <b>${esc((S.order&&S.order.email)||'chưa có email')}</b></span></label>
    <label class="opt"><input type="checkbox" data-rm="zalo" ${r.zalo?'checked':''}><span class="zalo-ico">Z</span><span>Zalo OA Siêu Tăng Trưởng · <b>${esc((S.order&&S.order.phone)||'chưa có số điện thoại')}</b></span></label></fieldset>
   <div class="rm-rules"><b>Nhắc thông minh</b><ul><li>Đã học trong ngày thì không nhắc.</li><li>Tối đa 1 tin mỗi ngày.</li><li>Nghỉ lâu thì đề xuất điều chỉnh lộ trình.</li></ul></div>
  </div>
  <div class="rm-prev"><div class="rm-prev-h"><b>Xem trước</b><select class="inp" data-rm="preview" aria-label="Chọn tình huống">${Object.entries(REMIND_KIND_LABEL).map(([k,l])=>`<option value="${k}" ${pk===k?'selected':''}>${l}${k===remindMessage().kind?' (hiện tại)':''}</option>`).join('')}</select></div>
   ${zaloBubble(msg)}
   <p class="hint">Email có cùng nội dung.</p></div></div>
  <div class="rm-foot"><button class="btn btn-line" data-a="remindTest">${ic('send',15)} Gửi thử</button><button class="btn btn-primary" data-a="remindSave">Lưu lịch nhắc</button></div>
 </div></div>`;
}
// 1 tin nhắn Zalo OA (dạng thẻ có nút bấm)
function zaloBubble(msg,at){
 return `<div class="zl-msg"><span class="zl-av">S</span><div class="zl-card"><span class="zl-oa">Siêu Tăng Trưởng <i>OA</i>${at?` · ${esc(at)}`:''}</span><b>${msg.icon} ${esc(msg.title)}</b><p>${esc(msg.body)}</p>${msg.streak>0?`<span class="zl-streak">🔥 Chuỗi ${msg.streak} ngày</span>`:''}<button class="zl-btn" data-a="zaloCta" data-v="${msg.ctaTo}">${esc(msg.cta)}</button></div></div>`;
}
// hộp thư Zalo mô phỏng (giống màn hình điện thoại)
function zaloView(){
 if(!T.zaloOpen)return '';
 return `<div class="mail-ov" role="presentation"><div class="zl-phone" role="dialog" aria-modal="true" aria-label="Zalo mô phỏng">
  <div class="zl-top"><button class="x" data-a="zaloClose" aria-label="Đóng">${ic('back',18)}</button><span class="zl-av sm">S</span><div><b>Siêu Tăng Trưởng</b><small>Official Account · mô phỏng</small></div></div>
  <div class="zl-log">${S.zalo.length?S.zalo.slice().reverse().map(m=>zaloBubble(m.msg,m.at)).join(''):'<p class="hint" style="text-align:center;padding:30px 10px">Chưa có tin nhắn. Bật nhắc lịch học rồi bấm "Gửi thử tin này".</p>'}</div>
 </div></div>`;
}
