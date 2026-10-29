/* =========================================================
   SCREENS — dựng giao diện từng màn hình (trả về chuỗi HTML)
   Mỗi màn hình là 1 hàm, đăng ký trong SCREENS ở cuối file.
   ========================================================= */

/* ---------- thành phần dùng chung ---------- */
function demoBar(){
 const cur=S.screen==='course'?'courses':S.screen==='lesson'?(S.unit&&chOf(S.unit)==='C0'?'onboarding':'learn'):S.screen==='account'?'checkout':S.screen;
 return `<div class="demo"><div class="wrap"><span class="demo-tag">Demo</span>
 <nav class="demo-steps" aria-label="Các bước trong luồng">${STAGES.map(([k,l],i)=>`<button class="${cur===k?'on':''}" data-a="jump" data-to="${k}"><b>${i+1}</b>${l}</button>`).join('')}</nav>
 <button class="demo-reset demo-mail" data-a="mailOpen" aria-label="Hộp thư mô phỏng${unreadMails()?`, ${unreadMails()} email chưa đọc`:''}">${ic('mail',13)} Hộp thư${unreadMails()?`<span class="cnt">${unreadMails()}</span>`:''}</button><button class="demo-reset demo-mail" data-a="zaloOpen" aria-label="Zalo mô phỏng${unreadZalo()?`, ${unreadZalo()} tin chưa đọc`:''}"><span class="zalo-ico sm">Z</span> Zalo${unreadZalo()?`<span class="cnt">${unreadZalo()}</span>`:''}</button>${aiDot()}<button class="demo-reset" data-a="reset">${ic('refresh',13)} Làm lại</button></div></div>`;
}
function header(){
 if(typeof commInside==='function'&&commInside())return commHeader();
 const name=S.enrolled?(S.profile.name||(S.order&&S.order.name)||''):S.loggedIn&&S.account?S.account.name:'';
 const inCourse=['mycourses','onboarding','syllabus','learn','lesson','complete','outputs','dashboard'].includes(S.screen);
 return `<header class="hdr"><div class="wrap">
 <button class="logo" data-a="go" data-to="home" aria-label="Trang chủ"><img class="logo-img" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"></button>
 <nav class="nav${T.navOpen?' open':''}" id="main-nav" aria-label="Menu chính">${HIDE_LANDING?'':`<button class="${!inCourse&&!['community','courses'].includes(S.screen)?'on':''}" data-a="go" data-to="landing">AI for CEO</button>`}${V2?'':`<button class="${['courses','course'].includes(S.screen)?'on':''}" data-a="go" data-to="courses">Khóa học</button>`}<button class="${S.screen==='community'?'on':''}" data-a="openCommunity">Cộng đồng</button><button class="${S.screen==='challenges'?'on':''}" data-a="go" data-to="challenges">Thử thách</button><button class="${S.screen==='library'?'on':''}" data-a="go" data-to="library">Thư viện</button>${S.enrolled?`<button class="${inCourse?'on':''}" data-a="go" data-to="mycourses">Khóa học của tôi</button>`:''}${name?'':'<button class="nav-m" data-a="acOpen" data-v="login">Đăng nhập</button>'}</nav>
 <div class="hdr-r">${name?`<button class="me" data-a="go" data-to="${S.enrolled?'mycourses':'landing'}"><span class="avatar">${esc(name.trim().split(/\s+/).pop()[0]||'N')}</span><span class="n">${esc(name)}</span></button>`:`<button class="btn btn-ghost btn-sm" data-a="acOpen" data-v="login">Đăng nhập</button><button class="btn btn-primary btn-sm" data-a="acOpen" data-v="register">Đăng ký</button>`}</div>
 <button class="nav-tg" data-a="navTg" aria-expanded="${!!T.navOpen}" aria-controls="main-nav" aria-label="${T.navOpen?'Đóng menu':'Mở menu'}">${ic(T.navOpen?'x':'menu',22)}</button>
 </div></header>`;
}
function secHead(eyebrow,title,sub){return `<div class="sec-head"><span class="eyebrow">${eyebrow}</span><h2 class="h2">${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div>`;}
// chân trang theo mẫu website Siêu Tăng Trưởng: giới thiệu · Khám phá · Liên hệ · Giờ làm việc + Chính sách
function footer(){const y=new Date().getFullYear();return `<footer class="ftr"><div class="wrap"><div class="ftr-grid">
 <div class="ftr-brand"><img class="ftr-logo" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"><p>${esc(ACADEMY.tagline)}</p></div>
 <div><h2>Khám phá</h2><ul><li><button data-a="go" data-to="challenges">Thử thách</button></li><li><button data-a="openCommunity">Cộng đồng</button></li><li><button data-a="go" data-to="library">Thư viện</button></li><li><button data-a="openChat" data-v="expert">Hỗ trợ & Tư vấn</button></li></ul></div>
 <div><h2>Liên hệ</h2><ul class="ftr-contact"><li><span>Hotline:</span> <a href="tel:${ACADEMY.hotline.replace(/s/g,'')}">${esc(ACADEMY.hotline)}</a></li><li><span>Email:</span> <a href="mailto:${ACADEMY.support}">${esc(ACADEMY.support)}</a></li><li><span>Địa chỉ:</span> ${esc(ACADEMY.address)}</li></ul></div>
 <div><h2>Giờ làm việc</h2><p class="ftr-hours">${esc(ACADEMY.workDays)}<br>${esc(ACADEMY.workTime)}</p><h2 class="mt">Chính sách</h2><ul><li><button data-a="policy">Điều khoản & Bảo mật</button></li></ul></div>
</div><div class="ftr-bottom"><span>© ${y} Siêu Tăng Trưởng. Mọi quyền được bảo lưu.</span><span>Made with care · ${ACADEMY.footerWeb}</span></div></div></footer>`;}
function priceTag(){return `<span class="tnum" style="font-weight:800;font-size:30px;letter-spacing:-.02em">${money(COURSE.price)}</span><span class="strike tnum">${money(COURSE.list)}</span><span class="promo">${ic('tag',13)} ${COURSE.promo} · −${OFF}%</span>`;}
// Khung chat nổi góc phải dưới: 2 tab tách riêng, Trợ lý AI (trả lời ngay) và Chuyên gia (người thật)
function fab(){
 const E=S.expert,unread=E.unread||0,learnMode=S.enrolled;
 let panel='';
 if(T.asstOpen){
  const isAI=T.tab!=='expert';
  const tabs=`<div class="chat-tabs" role="tablist" aria-label="Chọn người trò chuyện">
   <button role="tab" aria-selected="${isAI}" class="${isAI?'on':''}" data-a="chatTab" data-v="ai">${ic('bot',16)} Trợ lý AI</button>
   <button role="tab" aria-selected="${!isAI}" class="${!isAI?'on':''}" data-a="chatTab" data-v="expert">${ic('headset',16)} Chuyên gia${unread&&isAI?`<span class="cnt">${unread}</span>`:''}</button>
   <button class="x" data-a="asstToggle" aria-label="Đóng">${ic('x')}</button></div>`;
  let body;
  if(isAI){
   // [nhãn ngắn hiển thị, câu hỏi đầy đủ gửi cho AI]
   const chips=learnMode?[['Giải thích theo góc nhìn CEO','Giải thích phần này theo góc nhìn CEO'],['Áp dụng cho công ty tôi','Năng lực này áp dụng gì cho công ty tôi?'],['Bài tiếp theo','Bài tiếp theo là gì?']]:[['Có phù hợp với tôi?','Khóa học có phù hợp với tôi không?'],['Có dạy prompt không?','Có dạy dùng ChatGPT, viết prompt không?'],['Học phí & ưu đãi','Học phí và ưu đãi thế nào?']];
   const msgs=S.asst.length?S.asst:[{role:'bot',text:learnMode?`Chào anh/chị ${firstName()}! Em là Trợ lý AI của khóa học. Em trả lời ngay, dựa trên nội dung chính thức của khóa học và hồ sơ công ty anh/chị.${S.profile&&S.profile.decision30?` Em nhớ quyết định anh/chị đang theo đuổi: "${DEC_PREFIX} ${S.profile.decision30}."`:''}`:'Chào anh/chị! Em là Trợ lý AI, có thể giải đáp ngay về khóa AI for CEO: nội dung, cách học, thời gian và học phí.'}];
   body=`<div class="chat-h"><span class="bot-av">${ic('bot')}</span><div><b>Trợ lý AI</b><span>Trả lời ngay · ${T.ai?'bằng AI, dựa trên nội dung chính thức':'theo nội dung soạn sẵn của khóa học'}</span></div></div>
   <div class="chat-log" id="asst-log">${msgs.map((m,i)=>`<div class="msg ${m.role==='user'?'user':'bot'} ${m.pending?'typing':''}" id="am-${i}">${m.pending&&!m.text?'Đang soạn câu trả lời…':fmt(m.text)}</div>${m.handoff?`<div><button class="chip" data-a="toExpert">${ic('headset',14)} Nhắn chuyên gia câu này</button></div>`:''}`).join('')}</div>
   <div class="chips">${chips.map(([t,q])=>`<button class="chip" data-a="asstAsk" data-q="${esc(q)}" title="${esc(q)}">${esc(t)}</button>`).join('')}</div>
   <form class="chat-in" data-f="asstSend"><input class="inp" id="asst-in" name="q" autocomplete="off" placeholder="Hỏi Trợ lý AI về nội dung khóa học…" aria-label="Câu hỏi cho Trợ lý AI" ${T.asstBusy?'disabled':''}><button class="send" aria-label="Gửi cho Trợ lý AI" ${T.asstBusy?'disabled':''}>${ic('send')}</button></form>
   <div class="asst-foot"><span>AI chưa trả lời được?</span><button class="btn-link" data-a="toExpert">Nhắn chuyên gia ${ic('arrow',13)}</button></div>`;
  }else{
   const msgs=[{role:'expert',text:expertHello()},...E.msgs];
   body=`<div class="chat-h expert-h"><span class="bot-av ex-av" aria-hidden="true">${EXPERT.name.split(' ').map(w=>w[0]).join('')}</span><div><b>${EXPERT.name} · ${learnMode?EXPERT.role:'Tư vấn viên'}</b><span><i class="online"></i>Người thật · trả lời trong giờ làm việc${E.id?` · Yêu cầu #${E.id}`:''}</span></div></div>
   <div class="chat-log" id="ex-log">${msgs.map(m=>m.role==='sys'?`<div class="msg sys">${esc(m.text)}</div>`:`<div class="msg ${m.role==='user'?'user':'expert'}">${m.role==='expert'?`<small>${esc(EXPERT.name)}${m.at?` · ${m.at}`:''}</small>`:''}${fmt(m.text)}${m.role==='user'&&m.at?`<small class="r">${m.at}</small>`:''}</div>`).join('')}${T.expertTyping?`<div class="msg expert typing">${esc(EXPERT.name)} đang soạn tin…</div>`:''}</div>
   ${E.msgs.length?'':`<div class="chips">${(learnMode?['Hỏi về bài tập của tôi','Hóa đơn & thanh toán','Đổi lịch học']:['Tư vấn học phí cho doanh nghiệp','Hình thức thanh toán']).map(c=>`<button class="chip" data-a="expertAsk" data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>`}
   <form class="chat-in" data-f="expertSend"><input class="inp" id="ex-in" name="q" autocomplete="off" value="${esc(T.expertDraft||'')}" placeholder="Nhắn cho chuyên gia…" aria-label="Tin nhắn cho chuyên gia"><button class="send" aria-label="Gửi cho chuyên gia">${ic('send')}</button></form>
   <div class="asst-foot"><span>Cần câu trả lời ngay?</span><button class="btn-link" data-a="chatTab" data-v="ai">Hỏi Trợ lý AI ${ic('arrow',13)}</button></div>`;
  }
  panel=`<div class="asst" role="dialog" aria-label="${isAI?'Trò chuyện với Trợ lý AI':'Trò chuyện với chuyên gia'}"><div class="card chat ${isAI?'':'is-expert'}">${tabs}${body}</div></div>`;
 }
 if(HIDE_FAB)return panel; // tạm ẩn 2 nút nổi góc phải dưới (theo user 10/2026); khung chat vẫn mở được từ link khác
 return `${panel}<div class="fab"><button class="main" data-a="openChat" data-v="ai" aria-label="Hỏi Trợ lý AI" title="Hỏi Trợ lý AI">${ic('bot',22)}</button><button data-a="openChat" data-v="expert" aria-label="Nhắn chuyên gia${unread?`, ${unread} tin chưa đọc`:''}" title="Nhắn chuyên gia">${ic('headset',20)}${unread?`<span class="dot">${unread}</span>`:''}</button></div>`;
}

/* ---------- 1. Landing ---------- */
let PREVIEW=null;
function preview(){if(!PREVIEW){const saved=S.done;S.done={};PREVIEW=rulePlan({...SAMPLE_PROFILE,goals:['marketing'],days:7,minPerSession:30,rhythm:'daily'});S.done=saved;}return PREVIEW;}
function landing(){
 const mods=LIB.filter(x=>x.type==='module');const pv=preview();const avg=Math.round(lessonMin(pv.lessons.flat())/pv.lessons.length);
 return `
<section class="wrap hero">
 <div>
  <span class="eyebrow">Khóa học trọng tâm của Học viện</span>
  <h1>AI for <span>CEO</span></h1>
  <p class="hero-kicker">Khóa cập nhật năng lực AI dành cho CEO qua các ví dụ thực tế.</p>
  <p class="hero-lead">Không học tool. Không học prompt. Tận mắt thấy AI hiện tại đã làm được gì, và từ đó nhìn ra doanh nghiệp mình có thể làm gì.</p>
  <div class="hero-price">${priceTag()}</div>
  <div class="hero-cta"><button class="btn btn-primary btn-lg" data-a="go" data-to="checkout">Đăng ký với ưu đãi ${ic('arrow')}</button><button class="btn btn-line btn-lg" data-a="scrollTo" data-v="modules">Xem 12 module</button></div>
  <ul class="hero-facts"><li>${ic('video',16)} ${ALL_BAI.length} bài học · ${LIB.length} chương</li><li>${ic('cal',16)} Tự chọn hoàn thành trong 7–30 ngày</li><li>${ic('user',16)} Dành cho CEO, Founder, quản lý cấp cao</li></ul>
 </div>
 <div class="card hero-card" aria-label="Ví dụ lộ trình cá nhân hóa">
  <div class="hc-top"><span>Trợ lý lộ trình</span><span class="src">${ic('spark',13)} Cá nhân hóa</span></div>
  <div class="hc-chat"><div class="bub me">Tôi muốn hoàn thành trong 7 ngày, mỗi ngày 30 phút. Quan tâm nhất là Marketing.</div><div class="bub bot">Em chia khóa thành 7 bài, mỗi ngày một bài khoảng ${avg} phút, ví dụ ưu tiên cho Marketing.</div></div>
  <ol class="hc-plan">${pv.lessons.map((ks,i)=>`<li><span class="d">Ngày ${i+1}</span><span>${esc(lessonTitle(ks,i,pv.lessons))}</span><span class="m">${lessonMin(ks)}′</span></li>`).join('')}</ol>
 </div>
</section>

<section class="band"><div class="wrap sec">${secHead('Big idea','Một chương trình khai thông nhận thức cho người ra quyết định','Từ "biết AI quan trọng nhưng mơ hồ" sang "đã thấy năng lực thật và biết nên đặt câu hỏi gì".')}
 <div class="grid g2 isnot">
  <div class="card pad yes"><h3 class="h3">Khóa này là</h3><ul>${['Một "AI executive briefing" có chiều sâu','Hành trình khám phá các năng lực AI hiện tại','Demo trước, giải thích sau','Luôn gắn AI với bài toán vận hành và tăng trưởng','Được cập nhật khi AI thay đổi'].map(x=>`<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul></div>
  <div class="card pad no"><h3 class="h3">Khóa này không phải</h3><ul>${['Khóa prompt engineering','Khóa ChatGPT / Claude / Gemini','Khóa học code','Khóa automation cầm tay chỉ việc','Khóa đào tạo chuyên gia AI hay lý thuyết hàn lâm'].map(x=>`<li>${ic('x')}<span>${x}</span></li>`).join('')}</ul></div>
 </div>
 <p class="oneliner"><span>Nói gọn trong một câu</span>Khóa học giúp CEO hiểu AI hiện tại làm được gì bằng cách cho họ xem AI làm thật, sau đó dẫn họ liên hệ sang doanh nghiệp của mình.</p>
</div></section>

<section class="wrap sec">${secHead('Hành trình năng lực','Từ "AI biết" đến "AI tự thực hiện công việc"','')}
 <div class="chain">${['AI biết','AI hiểu','AI tạo','AI suy luận','AI xây','AI dùng công cụ','AI hành động','AI tự thực hiện công việc'].map((x,i,a)=>`<span>${x}</span>${i<a.length-1?ic('arrow',16):''}`).join('')}</div>
 <ul class="aha">${['"AI không còn chỉ là chatbot."','"AI có thể hiểu dữ liệu của tôi, tạo sản phẩm số, dùng công cụ và tham gia quy trình."','"AI đang trở thành một lớp trí tuệ nằm trên các hệ thống doanh nghiệp."','"Vấn đề không còn là có nên dùng AI hay không, mà là nên đưa AI vào đâu trước."'].map(x=>`<li>${x}</li>`).join('')}</ul>
</section>

<section class="band" id="modules"><div class="wrap sec">${secHead(`${LIB.length} chương · ${ALL_BAI.length} bài`,'10 năng lực AI, mỗi năng lực có demo thật','Mỗi bài là 1 video ngắn hoặc 1 bài tập áp dụng cho công ty. Trợ lý lộ trình chia các bài theo lịch anh/chị chọn.')}
 <div class="grid g4">${mods.map(x=>`<article class="card mod"><span class="no">${chLabel(x).toUpperCase()}</span><h3>${esc(x.title)}</h3><p>${esc(clip(x.demo,120))}</p></article>`).join('')}</div>
</div></section>

<section class="wrap sec">${secHead('Case xuyên suốt','Một bài toán quảng cáo đi qua 6 năng lực AI','CEO hỏi: "Tại sao tuần này chi phí mỗi khách hàng (CPA) tăng 28%?"')}
 <div class="adsflow">${[['Kết nối','AI truy cập Meta Ads, Google Ads qua connector, API hoặc MCP.'],['Hiểu dữ liệu','Đọc Spend, Revenue, CPL, CPA, ROAS, hiệu quả từng creative.'],['Suy luận','Tìm nguyên nhân CPA tăng và giải thích bằng số liệu.'],['Xây','Tạo prototype dashboard theo dõi theo yêu cầu của CEO.'],['Tự động hóa','Mỗi sáng, nếu CPA vượt ngưỡng, AI gửi cảnh báo kèm lý do.'],['Agent','Tự thu thập, phân tích, báo cáo và tạo task cho team Marketing.']].map(([t,d],i)=>`<div><b>${i+1}. ${t}</b><p>${d}</p></div>`).join('')}</div>
</section>

<section class="band"><div class="wrap sec">${secHead('Cách học','Show, don\'t tell','Mỗi bài đi theo cùng một nhịp. Không sa vào nút bấm, setup tool, prompt dài hay code.')}
 <ol class="formula">${[['Nó làm được gì?','Mở bằng một bài toán thật CEO đang gặp.'],['Show demo','Cho xem AI làm thật, hạn chế slide lý thuyết.'],['Ví dụ doanh nghiệp','Sales, Marketing, HR, Finance, Vận hành dùng ở đâu.'],['CEO cần hiểu gì?','Bản chất năng lực, vì sao giờ mới khả thi, giới hạn ở đâu.'],['Công ty mình dùng ở đâu?','3 câu hỏi mang về để giao bài toán cho đội ngũ.']].map(([t,d],i)=>`<li><span class="n">BƯỚC ${i+1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
 <div class="ratio" role="img" aria-label="75% demo và case, 25% giải thích"><div class="a">70–80% demo, case, hình ảnh</div><div class="b">20–30% giải thích</div></div>
</div></section>

<section class="wrap sec">${secHead('Hình thức học','Video online là lõi, live giữ khóa luôn mới','CEO khó theo một lịch cố định, và demo AI live dễ gặp lỗi. Video quay sẵn giữ trải nghiệm ổn định; lớp live cập nhật khi AI thay đổi.')}
 <div class="grid g3">
  <article class="card layer core"><span class="tag">Lớp 1 · Sản phẩm lõi</span><h3>Video online</h3><p>${ALL_BAI.length} bài trong ${LIB.length} chương, mỗi bài 5–10 phút. Trợ lý lộ trình chia bài theo số ngày anh/chị muốn hoàn thành.</p></article>
  <article class="card layer"><span class="tag">Lớp 2 · Giữ khóa luôn mới</span><h3>Live Zoom "AI đến đâu rồi?"</h3><p>Hằng tháng, 60–90 phút: năng lực mới, demo mới, hỏi đáp CEO. Nội dung hay được cắt bổ sung vào khóa.</p></article>
  <article class="card layer"><span class="tag">Lớp 3 · Tùy chọn</span><h3>Offline Executive Briefing</h3><p>Nửa ngày hoặc một ngày, số lượng giới hạn: demo live, thảo luận use case theo doanh nghiệp, kết nối.</p></article>
 </div>
</section>

<section class="band"><div class="wrap sec"><div class="grid g2" style="gap:56px">
 <div>${secHead('Lời hứa sau khóa','CEO hiểu AI đủ sâu để ra quyết định','Không cần trở thành người dùng AI giỏi.')}
  <ul class="promise">${['Hiểu AI hiện tại đã phát triển đến đâu.','Biết AI làm được những nhóm việc nào: hiểu dữ liệu, tạo nội dung, xây phần mềm, dùng công cụ, tự động hóa, agent.','Nhìn ra khả năng áp dụng vào doanh nghiệp mình, dù chưa cần biết tự triển khai.','Phân biệt "AI hype" với năng lực đã dùng được thực tế.','Đủ hiểu biết để đặt câu hỏi, giao bài toán và ra quyết định đầu tư AI.'].map(x=>`<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul></div>
 <div class="ba">${[['Trước khóa','"Tôi biết AI quan trọng nhưng không thật sự biết nó đang làm được đến đâu."'],['Trong khóa','"Tôi đang tận mắt thấy AI đọc, tạo, phân tích, xây, kết nối và hành động."'],['Sau khóa','"Tôi nhìn ra doanh nghiệp mình có thể dùng AI ở đâu và nên hỏi team điều gì."']].map(([t,d])=>`<div><b>${t}</b><p>${d}</p></div>`).join('')}</div>
</div></div></section>

<section class="wrap sec"><div class="price-wrap">
 <div>${secHead('Học phí','Một khóa, một lộ trình của riêng anh/chị','Ưu đãi áp dụng cho học viên đăng ký trong tháng đầu ra mắt.')}
  <ul class="promise">${COURSE.perks.map(x=>`<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul></div>
 <div class="card price-box">
  <span class="promo" style="justify-self:start">${ic('tag',13)} ${COURSE.promo}</span>
  <div class="price-row"><span class="price-now tnum">${money(COURSE.price)}</span><span class="strike tnum">${money(COURSE.list)}</span></div>
  <p class="hint">Tiết kiệm ${money(SAVE)} (−${OFF}%). Hỗ trợ xuất hóa đơn công ty.</p>
  <div class="kv" style="padding-block:10px;border-block:1px solid var(--line)"><div><span>Hình thức</span><b>Video online + Live Zoom</b></div><div><span>Nội dung</span><b>${LIB.length} chương, ${ALL_BAI.length} bài, ${Object.keys(TASKS).length} bài tập</b></div><div><span>Lịch học</span><b>Tự chọn 7–30 ngày</b></div></div>
  <button class="btn btn-primary btn-lg btn-block" data-a="go" data-to="checkout">Đăng ký ngay ${ic('arrow')}</button>
  <button class="btn btn-ghost btn-block" data-a="asstToggle">${ic('chat',16)} Hỏi thêm về khóa học</button>
 </div>
</div></section>

<section class="wrap" style="padding-bottom:88px"><div class="cta-band"><div><h2>"À, hóa ra AI bây giờ đã làm được tới mức này rồi."</h2><p>${COURSE.promo}: ${money(COURSE.price)} thay vì ${money(COURSE.list)}.</p></div><button class="btn btn-lg" data-a="go" data-to="checkout">Đăng ký với ưu đãi ${ic('arrow')}</button></div></section>`;
}

/* ---------- 2. Đăng ký & thanh toán ---------- */
function checkout(){
 const ac=S.account||{},o=S.order||{name:ac.name||'',phone:ac.phone||'',email:ac.email||'',company:'',invoice:false,taxId:'',invName:'',invEmail:'',invAddr:''};
 const st=S.pay.status;
 const steps=['Xác nhận thông tin','Thanh toán','Hoàn tất'];const at=st==='success'?2:st?1:0; // 3 bước (theo đề xuất user): gộp Xác nhận + Thông tin
 const stepper=`<div class="stepper">${steps.map((s,i)=>`<span class="${i<at?'ok':i===at?'on':''}"><i>${i<at?'✓':i+1}</i>${s}</span>`).join('')}</div>`;
 const summary=`<aside class="card pad sticky${st==='success'?' sum-done':''}"><h2 class="h3" style="margin-bottom:10px">Thông tin đơn hàng</h2>
  <div class="sum-item"><div class="sum-thumb" aria-hidden="true">${COURSE.cover?`<img src="${esc(COURSE.cover)}" alt="">`:`<span>AI for <b>CEO</b></span>`}</div><div class="sum-item-t"><b>AI for CEO</b><span class="q">Số lượng: 1</span></div></div>
  <div class="sum-row"><span class="k">Học phí</span><span class="v tnum">${money(COURSE.list)}</span></div>
  <div class="sum-row disc"><span class="k">Ưu đãi</span><span class="v tnum">−${money(SAVE)}</span></div>
  <div class="sum-row" style="align-items:center"><span class="k">Tổng thanh toán</span><span class="v total tnum">${money(COURSE.price)}</span></div>
  <p class="hint sum-vat">Giá đã bao gồm VAT ${VAT_RATE}%</p>
  <p class="sum-sec">${ic('lock',15)} Thanh toán bảo mật qua VietQR, hệ thống tự xác nhận khi nhận được tiền</p>
  </aside>`;
 let main;
 if(st==='await')main=payView();
 else if(st==='processing')main=`<div class="card status"><div class="spin" role="status" aria-label="Đang xử lý"></div><h2 class="h3">Đang xử lý giao dịch…</h2><p class="muted">Vui lòng không đóng trang.</p></div>`;
 else if(st==='failed')main=`<div class="card status"><span class="big bad">${ic('x',28)}</span><h2 class="h3">Chưa nhận được thanh toán</h2><p class="muted" style="max-width:48ch">Hệ thống chưa nhận được tiền chuyển khoản cho đơn <b>${esc(transferNote(S.order))}</b> (mô phỏng). Anh/chị kiểm tra lại số tài khoản, số tiền, nội dung chuyển khoản rồi thử lại, hoặc nhờ hỗ trợ.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-primary" data-a="payRetry">Xem lại thông tin chuyển khoản</button><button class="btn btn-line" data-a="payChange">Sửa thông tin</button><button class="btn btn-line" data-a="paySupport">${ic('headset',16)} Cần hỗ trợ</button></div>
  ${S.pay.support?`<div class="callout info" style="text-align:left"><b>Hỗ trợ thanh toán</b><span>Đội CSKH đã nhận yêu cầu và sẽ gọi lại trong 15 phút (mô phỏng). Hotline minh họa: <b class="tnum">1900 0000</b>. Mã đơn: <b>${esc(transferNote(S.order))}</b>.</span></div>`:''}</div>`;
 else if(st==='success')main=`<div class="card status"><span class="big ok">${ic('check',30)}</span><h2 class="h2" style="font-size:30px">Đăng ký thành công</h2><p class="muted" style="max-width:50ch">Thanh toán đã được ghi nhận<br>Quyền truy cập khóa học <b>AI for CEO</b> đã được kích hoạt.</p>
  <div style="width:100%;max-width:420px;text-align:left;border-top:1px solid var(--line)"><div class="sum-row"><span class="k">Mã đơn</span><span class="v tnum">${esc(transferNote(S.order))}</span></div><div class="sum-row"><span class="k">Học viên</span><span class="v">${esc(S.order.name)}</span></div><div class="sum-row"><span class="k">Đã thanh toán</span><span class="v tnum">${money(COURSE.price)}</span></div><div class="sum-row"><span class="k">Trạng thái</span><span class="v"><span class="pill ok">Đã kích hoạt</span></span></div></div>
  <button class="btn btn-primary btn-lg" data-a="go" data-to="mycourses">Vào khóa học ${ic('arrow')}</button>
  <div class="note-wrap">${(cm=>cm?`<p class="hint mail-note">${ic('mail',14)} Vui lòng kiểm tra email và Zalo để xem xác nhận đăng ký và hướng dẫn truy cập khóa học.</p>`:`<p class="hint mail-note">${ic('mail',14)} Đang gửi email xác nhận tới <b>${esc(S.order.email)}</b>…</p>`)(S.mails.find(m=>m.kind==='confirm'&&m.code===S.order.code))}${(o=>!o.invoice?(o.invConfirmed&&S.mails.some(m=>m.kind==='invoice'&&!m.sample&&m.code===o.code)
   ?`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Đã xuất hóa đơn điện tử</b><span>Hóa đơn số <b>${esc((o.inv||{}).no||'')}</b> đã được gửi tới <b>${esc(o.email)}</b>.</span><div><button type="button" class="btn btn-line btn-sm inv-open" data-a="invView">${ic('eye',15)} Xem hóa đơn</button></div></div></div>`
   :`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Đang xuất hóa đơn điện tử…</b><span>Hóa đơn sẽ được gửi tới <b>${esc(o.email)}</b>.</span></div></div>`)
  :o.invConfirmed
   ?`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Đã xuất hóa đơn điện tử</b><span>Hóa đơn số <b>${esc((o.inv||{}).no||'')}</b> cho ${esc(o.invName||'')} đã được gửi tới <b>${esc(o.invEmail)}</b>.</span><div><button type="button" class="btn btn-line btn-sm inv-open" data-a="invView">${ic('eye',15)} Xem hóa đơn</button></div></div></div>`
   :`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Xác nhận thông tin hóa đơn</b><span>Vui lòng kiểm tra thông tin hóa đơn của <b>${esc(o.invName||'')}</b> trước khi xác nhận.</span><span>Sau khi xác nhận, hóa đơn điện tử sẽ được gửi đến <b>${esc(o.invEmail)}</b>.</span><div><button type="button" class="btn btn-line btn-sm inv-open" data-a="invView">${ic('eye',15)} Xem và xác nhận hóa đơn</button></div></div></div>`)(S.order)}</div></div>`;
 else main=`<form class="card form" id="ck-form" data-f="checkoutSubmit" novalidate>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2 class="h3">Thông tin thanh toán</h2></div>
  <div class="row2"><div class="field"><label for="c-name">Họ và tên <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-name" name="name" value="${esc(o.name)}" required aria-required="true" autocomplete="name"></div><div class="field"><label for="c-phone">Số điện thoại / Zalo <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-phone" name="phone" type="tel" value="${esc(o.phone)}" required aria-required="true" autocomplete="tel"></div></div>
  <div class="row2"><div class="field"><label for="c-email">Email nhận tài khoản <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-email" name="email" type="email" value="${esc(ac.email||o.email)}" readonly aria-readonly="true" aria-describedby="c-email-h"></div><div class="field"><label for="c-company">Công ty</label><input class="inp" id="c-company" name="company" autocomplete="organization" placeholder="Nhập tên công ty" value="${esc(o.company===SAMPLE_PROFILE.company?'':(o.company||''))}"></div></div>
  <p class="hint ck-acc" id="c-email-h"><button type="button" class="btn-link" data-a="acSwitch">Dùng tài khoản khác</button></p>
  <label class="opt" for="c-inv" style="justify-self:start"><input type="checkbox" id="c-inv" name="invoice" ${o.invoice?'checked':''} data-a="invToggle"><span>Xuất hóa đơn doanh nghiệp</span></label>
  <div class="row2" id="inv-box" ${o.invoice?'':'hidden'}><div class="field"><label for="c-tax">Mã số thuế doanh nghiệp <span class="req" aria-hidden="true">*</span></label><div class="tax-in"><input class="inp" id="c-tax" name="taxId" aria-required="true" inputmode="numeric" placeholder="Nhập mã số thuế" aria-describedby="c-tax-st" value="${esc(o.taxId||'')}"><button type="button" class="tax-btn" data-a="taxLookup">${ic('search',16)} Kiểm tra</button></div><p class="hint tax-st" id="c-tax-st" role="status" aria-live="polite">Nhập mã số thuế rồi bấm Kiểm tra, tên và địa chỉ doanh nghiệp sẽ tự điền.</p></div><div class="field"><label for="c-invname">Tên doanh nghiệp <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invname" name="invName" aria-required="true" value="${esc(o.invName||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invaddr">Địa chỉ doanh nghiệp <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invaddr" name="invAddr" aria-required="true" value="${esc(o.invAddr||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invemail">Email nhận hóa đơn <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invemail" name="invEmail" aria-required="true" type="email" value="${esc(o.invEmail||'')}" placeholder="Nhập email nhận hóa đơn" autocomplete="email"></div></div>
  <fieldset><legend>Phương thức thanh toán</legend><div class="opt-grid">${Object.entries(PAY_METHODS).map(([v,l],i)=>`<label class="opt" for="pm-${i}"><input type="radio" id="pm-${i}" name="method" value="${v}" ${S.pay.method===v?'checked':''}><span>${l}</span></label>`).join('')}<label class="opt opt-off" for="pm-card" aria-disabled="true"><input type="radio" id="pm-card" name="method" value="card" disabled><span class="opt-txt"><span>Thẻ thanh toán</span><small>Tạm thời chưa hỗ trợ</small></span><span class="card-brands" aria-hidden="true"><i class="cb-visa">VISA</i><i class="cb-mc"><b></b><b></b></i><i class="cb-jcb">JCB</i><i class="cb-amex">AMEX</i></span></label></div></fieldset>
  <div class="ck-terms"><label class="ck-agree" for="c-agree"><input type="checkbox" id="c-agree" name="agree" ${o.agree?'checked':''} aria-required="true" ${T.err.field==='c-agree'?'aria-invalid="true"':''}><span>Tôi đã đọc và đồng ý với <button type="button" class="btn-link" data-a="policy">Điều khoản &amp; quy định</button>. <span class="req" aria-hidden="true">*</span></span></label></div>
  ${T.err.checkout?`<p class="err">${T.err.checkout}</p>`:''}
  <div class="form-foot"><span></span><button class="btn btn-primary btn-lg">Tiếp tục thanh toán ${ic('arrow')}</button></div></form>
  <div class="ck-mbar"><div><small>Tổng thanh toán</small><b class="tnum">${money(COURSE.price)}</b></div><button class="btn btn-primary" type="submit" form="ck-form">Tiếp tục thanh toán</button></div>`;
 return `<section class="wrap page"><div class="crumbs"><button data-a="go" data-to="courses">Khóa học</button><span>/</span><button data-a="crsOpen" data-v="aiceo">AI for CEO</button><span>/</span><span>Đăng ký & thanh toán</span></div>${stepper}<div class="two${st==='success'?' ck-done':''}"><div>${main}</div>${st==='success'?'':summary}</div></section>`;
}

/* ---------- Màn thanh toán: chuyển khoản ngân hàng (theo yêu cầu user) ----------
   2 cách song song: (1) quét mã QR, mã điền sẵn số tài khoản + số tiền + nội dung; (2) chuyển khoản thủ công, mỗi dòng
   số tài khoản / số tiền / nội dung có nút Sao chép riêng. Demo: mã QR chỉ là hình minh họa (không quét được, tránh chuyển nhầm
   tiền vào tài khoản có thật); nút "Mô phỏng: ngân hàng báo đã nhận tiền" thay cho việc hệ thống tự đối soát. */
/* ---------- Xem trước hóa đơn GTGT (đề xuất mới theo yêu cầu user 10/2026, theo "Mẫu hóa đơn đăng ký.pdf") ----------
   Hiện khi thanh toán thành công và đơn có chọn "Xuất hóa đơn doanh nghiệp". Dữ liệu lấy từ đơn hàng; số hóa đơn có sau khi phát hành
   (trước đó ghi "Chưa cấp số"). Thuế suất GTGT chưa chốt nên để trống. Hệ thống thật: lấy bản hóa đơn từ nhà cung cấp hóa đơn điện tử. */
function invoicePaper(o){
 const inv=o.inv||{},d=(inv.date||o.paidAt||today()).split('/'),amt=COURSE.price,rows=9;
 const ln=(k,en,v,cls='')=>`<div class="iv-ln ${cls}"><span>${k} <i>(${en})</i>:</span><b>${v||''}</b></div>`;
 return `<article class="iv-paper" aria-label="Hóa đơn giá trị gia tăng">
 <span class="iv-c tl"></span><span class="iv-c tr"></span><span class="iv-c bl"></span><span class="iv-c br"></span>
 
 <header class="iv-top"><div class="iv-title"><h2>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h2><p class="iv-en">(VAT INVOICE)</p><p class="iv-date">Ngày <i>(Date)</i> <u>${d[0]||''}</u> tháng <i>(month)</i> <u>${d[1]||''}</u> năm <i>(year)</i> <u>${d[2]||''}</u></p></div>
  <div class="iv-serial"><p>Ký hiệu <i>(Serial)</i>: ${SELLER.series}</p><p>Số <i>(No.)</i>: <b class="iv-no">${inv.no?esc(inv.no):'Chưa cấp số'}</b></p></div></header>
 <section class="iv-seller"><div>${ln('Đơn vị bán hàng','Seller',`<span class="iv-red">${SELLER.name}</span>`)}${ln('Mã số thuế','Tax code',`<span class="iv-tax">${SELLER.taxId.split('').join(' ')}</span>`)}${ln('Địa chỉ','Address',SELLER.address)}</div></section>
 <section class="iv-buyer">${ln('Họ tên người mua hàng','Buyer',esc(o.name||''),'dot')}${ln('Tên đơn vị','Company name',esc(o.invoice?(o.invName||o.company||''):''),'dot')}${ln('Mã số thuế','Tax code',esc(o.invoice?(o.taxId||''):''),'dot')}${ln('Địa chỉ','Address',esc(o.invoice?(o.invAddr||''):''),'dot')}
  <div class="iv-2">${ln('Hình thức thanh toán','Payment method','Chuyển khoản','dot')}${ln('Số tài khoản','A/C No.','','dot')}</div></section>
 <table class="iv-tb"><thead><tr><th>STT<br><i>(No.)</i></th><th>Tên hàng hóa, dịch vụ<br><i>(Name of goods, services)</i></th><th>Đơn vị tính<br><i>(Unit)</i></th><th>Số lượng<br><i>(Quantity)</i></th><th>Đơn giá<br><i>(Unit price)</i></th><th>Thành tiền<br><i>(Amount)</i></th></tr>
  <tr class="iv-no-r"><td>(1)</td><td>(2)</td><td>(3)</td><td>(4)</td><td>(5)</td><td>(6)=(4)x(5)</td></tr></thead>
  <tbody><tr><td>1</td><td class="l">Khóa học AI for CEO</td><td>Khóa</td><td>1</td><td class="r">${VAT.net.toLocaleString('vi-VN')}</td><td class="r">${VAT.net.toLocaleString('vi-VN')}</td></tr>${'<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(rows-1)}</tbody>
  <tfoot><tr><td colspan="3" class="l nbr">Tỷ giá <i>(Exchange rate)</i>:</td><td colspan="2" class="r nbl">Cộng tiền hàng <i>(Sub total)</i>:</td><td class="r">${VAT.net.toLocaleString('vi-VN')}</td></tr>
   <tr><td colspan="3" class="l nbr">Thuế suất GTGT <i>(VAT rate)</i>: ${VAT_RATE}%</td><td colspan="2" class="r nbl">Tiền thuế GTGT <i>(VAT amount)</i>:</td><td class="r">${VAT.vat.toLocaleString('vi-VN')}</td></tr>
   <tr><td colspan="5" class="r">Tổng cộng tiền thanh toán <i>(Total payment)</i>:</td><td class="r"><b>${amt.toLocaleString('vi-VN')}</b></td></tr>
   <tr><td colspan="6" class="l">Số tiền viết bằng chữ <i>(Amount in words)</i>: <b>${vnMoneyWords(amt)}</b></td></tr></tfoot></table>
 <section class="iv-sign"><div><b>Người mua hàng <i>(Buyer)</i></b></div><div><b>Người bán hàng <i>(Seller)</i></b><div class="iv-stamp"><b>${o.invConfirmed?'Signature Valid':'Mẫu:'}</b><span>Ký bởi: ${SELLER.name}</span><span>Ký ngày: ${o.invConfirmed?esc(inv.date||''):''}</span></div></div></section>
 <p class="iv-check">(Cần kiểm tra, đối chiếu khi lập, giao, nhận hóa đơn)</p>
 <p class="iv-prov">${SELLER.provider}</p></article>`;
}
function invoiceView(){
 if(!T.invView||!S.order)return '';
 const o=S.order,ok=!!o.invConfirmed,oo=o,to=invTo(o);
 return `<div class="mail-ov iv-ov" role="presentation"><div class="iv-dlg" role="dialog" aria-modal="true" aria-label="Xem trước hóa đơn">
  <div class="iv-bar"><div><b>${ok?'Hóa đơn GTGT':'Xác nhận thông tin hóa đơn'}</b><span>${ok?`Hóa đơn số ${esc((o.inv||{}).no||'')} đã gửi tới ${esc(to)}`:`Kiểm tra thông tin rồi bấm Xác nhận. Hóa đơn sẽ được gửi tới ${esc(to)}`}</span></div>
   <div class="iv-act"><button class="btn btn-line btn-sm" data-a="invPrint">${ic('download',15)} In / Lưu PDF</button><button class="x" data-a="invClose" aria-label="Đóng">${ic('x')}</button></div></div>
  <div class="iv-scroll">${invoicePaper(oo)}</div>
  <div class="iv-foot"><p class="hint">${ic('info',14)} ${o.invoice?'Kiểm tra tên đơn vị, mã số thuế, địa chỉ.':'Kiểm tra họ tên người mua.'} Cần điều chỉnh, anh/chị gửi email tới <b>${ACADEMY.billing}</b> kèm mã đơn <b>${esc(transferNote(o))}</b>.</p>${ok?'':`<div class="iv-foot-act"><button class="btn btn-primary" data-a="invConfirm">${ic('check',16)} Xác nhận hóa đơn</button></div>`}</div></div></div>`;
}
function fakeQR(seed){
 const n=29,cell=(x,y)=>{let h=2166136261;const k=seed+'|'+x+'|'+y;for(let i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)%100<47;};
 const fin=(x,y)=>[[0,0],[n-7,0],[0,n-7]].some(([a,b])=>x>=a&&x<a+7&&y>=b&&y<b+7),finOn=(x,y)=>{for(const [a,b] of [[0,0],[n-7,0],[0,n-7]]){const i=x-a,j=y-b;if(i>=0&&i<7&&j>=0&&j<7)return i===0||i===6||j===0||j===6||(i>=2&&i<=4&&j>=2&&j<=4);}return false;};
 const sep=(x,y)=>[[0,0],[n-8,0],[0,n-8]].some(([a,b])=>x>=a&&x<a+8&&y>=b&&y<b+8);
 let r='';for(let y=0;y<n;y++)for(let x=0;x<n;x++){const on=fin(x,y)?finOn(x,y):sep(x,y)?false:(x>11&&x<17&&y>11&&y<17)?false:cell(x,y);if(on)r+=`M${x},${y}h1v1h-1z`;}
 return `<svg class="qr-svg" viewBox="-2 -2 ${n+4} ${n+4}" role="img" aria-label="Mã QR chuyển khoản (minh họa)"><rect x="-2" y="-2" width="${n+4}" height="${n+4}" fill="#fff"/><path d="${r}" fill="#111827"/></svg>`;
}
// thời gian giữ mã thanh toán (đếm ngược ở góc phải); hết giờ thì tạo lại mã
const PAY_HOLD=30*60*1000;
const payLeft=()=>Math.max(0,(S.pay.until||0)-Date.now());
const fmtLeft=ms=>{const t=Math.ceil(ms/1000);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');};
function payView(){
 const o=S.order,note=transferNote(o),amt=COURSE.price,left=payLeft();
 const cp=(k,label,val)=>`<button type="button" class="pay-cp" ${left?'':'disabled '}data-a="payCopy" data-v="${k}" data-c="${esc(val)}" aria-label="Sao chép ${label}" title="Sao chép">${ic('copy',16)}</button>`;
 const row=(label,val,copy,cls='')=>`<div class="pay-row${cls}"><span class="k">${label}</span><b class="v tnum">${val}</b>${copy||'<span></span>'}</div>`;
 const qr=BANK.real?`<img class="qr-svg" src="${bankQR(amt,note)}" alt="Mã VietQR tài khoản ${esc(BANK.name)} của ${esc(ACADEMY.name)}">`:fakeQR(o.code);
 return `<div class="card pad pay${left?'':' expired'}">
  <div class="pay-h"><h2 class="h3">Thanh toán</h2><span class="pay-timer${left?'':' end'}" role="timer" aria-label="Thời gian giữ mã thanh toán">${ic('clock',18)} <span class="pay-timer-l">${left?'Mã còn hiệu lực':'Mã đã hết hạn'}</span> <b class="tnum" id="pay-left">${fmtLeft(left)}</b></span></div>
  ${left?'':`<div class="callout warn"><b>Mã thanh toán đã hết hạn</b><span>Anh/chị tạo mã mới để tiếp tục chuyển khoản. Nếu đã chuyển khoản, hệ thống vẫn ghi nhận theo nội dung ${esc(note)}.</span><div><button type="button" class="btn btn-line btn-sm" data-a="payRenew">${ic('refresh',15)} Tạo lại mã thanh toán</button></div></div>`}
  <div class="pay-grid">
   <figure class="pay-qr">
    ${BANK.real?`<div class="vqr-img"><img src="${bankQR(amt,note,'compact2')}" alt="Mã VietQR: ${esc(BANK.holder)}, ${esc(BANK.name)} ${esc(BANK.acc.replace(/\s/g,''))}, số tiền ${amt.toLocaleString('vi-VN')} VND" onerror="this.parentNode.classList.add('err')"></div>`:''}
    <div class="vqr">
     <div class="vqr-brand" aria-hidden="true"><span class="v1">VIET</span><span class="v2">QR</span></div>
     <div class="vqr-code">${qr}${BANK.real?'':'<span class="vqr-mid" aria-hidden="true">V</span>'}</div>
     <div class="vqr-partners" aria-hidden="true"><span class="napas">napas <i>247</i></span><span class="sep"></span><span class="tpb">${esc(BANK.name)}</span></div>
     <div class="vqr-info"><b>${esc(BANK.holder)}</b><span class="tnum">${esc(BANK.acc.replace(/\s/g,''))}</span><span>Số tiền: <span class="tnum">${amt.toLocaleString('vi-VN')}</span> VND</span></div>
    </div>
    <figcaption>Quét QR bằng app ngân hàng</figcaption>
   </figure>
   <div class="pay-side">
    <div class="pay-rows">
     ${row('Số tiền',money(amt),cp('amt','số tiền',String(amt)))}
     ${row('Nội dung chuyển khoản',esc(note),cp('note','nội dung chuyển khoản',note),' must')}
     ${row('Ngân hàng',esc(BANK.name))}
     ${row('Số tài khoản',esc(BANK.acc.replace(/\s/g,'')),cp('acc','số tài khoản',BANK.acc.replace(/\s/g,'')))}
     ${row('Chủ tài khoản',esc(BANK.holder),'',' holder')}
    </div>
    <p class="pay-warn"><span aria-hidden="true">⚠️</span> <span>Nội dung chuyển khoản PHẢI có mã <b>${esc(note)}</b>. Hệ thống tự xác nhận sau 30 giây - 2 phút.</span></p>${left?`<p class="pay-wait" role="status" aria-live="polite"><i aria-hidden="true"></i><span><b>Đang chờ thanh toán</b> · Trang tự chuyển sang bước Hoàn tất khi Học viện nhận được tiền.</span></p>`:''}
   </div>
  </div>
  <div class="pay-foot"><button type="button" class="btn-link" data-a="payChange">← Sửa thông tin thanh toán</button><button type="button" class="btn-link" data-a="paySupport">${ic('headset',15)} Cần hỗ trợ thanh toán</button></div>
  ${S.pay.support?`<div class="callout info"><b>Hỗ trợ thanh toán</b><span>Nếu anh/chị gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ <b class="tnum">${ACADEMY.hotline}</b> để được hỗ trợ. Mã đơn: <b>${esc(transferNote(o))}</b></span></div>`:''}
 </div>
  <div class="demo-box pay-sim"><span class="t">Mô phỏng ngân hàng</span><div class="seg" role="group" aria-label="Kết quả mô phỏng"><button type="button" class="${S.pay.sim==='success'?'on':''}" data-a="paySim" data-v="success">Nhận đủ tiền</button><button type="button" class="${S.pay.sim==='fail'?'on':''}" data-a="paySim" data-v="fail">Chưa nhận được</button></div><button type="button" class="btn btn-primary btn-sm" data-a="payDone">Mô phỏng: ngân hàng báo có tiền</button></div>`;
}

/* ---------- 2a. Tài khoản Học viện (đề xuất mới, US-03.2): bắt buộc có tài khoản trước khi đăng ký mua khóa học ----------
   Tạo tài khoản: Họ và tên, Số điện thoại / Zalo, Email, Mật khẩu → đăng nhập luôn. Đăng nhập: Email + Mật khẩu.
   Email của tài khoản là "Email nhận tài khoản" ở form đăng ký khóa học (khóa, không sửa được). Demo không lưu mật khẩu. */
function account(){
 const tab=T.acTab||'register',d=T.acDraft||{},e=T.err.ac,f=T.err.field,need=T.after==='checkout';
 const inp=(id,name,label,type,val,req=true,extra='')=>`<div class="field"><label for="${id}">${label}${req?' <span class="req" aria-hidden="true">*</span>':''}</label>${type==='password'?'<div class="pw">':''}<input class="inp ${f===id?'bad':''}" id="${id}" name="${name}" type="${type}" value="${esc(val||'')}" ${req?'required aria-required="true"':''} ${f===id?'aria-invalid="true"':''} ${extra}>${type==='password'?`<button type="button" class="pw-t" data-a="pwToggle" data-v="${id}" aria-label="Hiện mật khẩu" aria-pressed="false" title="Hiện mật khẩu">${ic('eye',18)}</button></div>`:''}</div>`;
 const reg=`<form class="ac-form" data-f="acRegister" novalidate>
  ${inp('a-name','name','Họ và tên','text',d.name,true,'autocomplete="name" placeholder="Nhập họ và tên"')}
  ${inp('a-phone','phone','Số điện thoại / Zalo','tel',d.phone,true,'autocomplete="tel" inputmode="tel" placeholder="Nhập số điện thoại / Zalo"')}
  ${inp('a-email','email','Email','email',d.email,true,'autocomplete="email" placeholder="Nhập email"')}
  ${inp('a-pass','pass','Mật khẩu','password','',true,'autocomplete="new-password" minlength="6" placeholder="Nhập mật khẩu" aria-describedby="a-pass-h"')}<p class="hint ac-pw-h" id="a-pass-h">Ít nhất 6 ký tự.</p>
  ${e?`<p class="err">${e}</p>`:''}
  <button class="btn btn-primary btn-lg btn-block">Tạo tài khoản</button>
  <p class="ac-terms">Khi tạo tài khoản, anh/chị đồng ý với <button type="button" class="btn-link" data-a="policy">Điều khoản &amp; Chính sách bảo mật</button> của Học viện.</p>
  <p class="ac-alt">Đã có tài khoản? <button type="button" class="btn-link" data-a="acTab" data-v="login">Đăng nhập</button></p>
  </form>`;
 const login=`<form class="ac-form" data-f="acLogin" novalidate>
  ${inp('l-email','email','Email','email',d.email||(S.account&&S.account.email),true,'autocomplete="email" placeholder="Email tài khoản Học viện"')}
  ${inp('l-pass','pass','Mật khẩu','password','',true,'autocomplete="current-password" placeholder="Nhập mật khẩu"')}
  ${e?`<p class="err">${e}</p>`:''}
  <button class="btn btn-primary btn-lg btn-block">Đăng nhập</button>
  <p class="ac-forgot"><button type="button" class="btn-link" data-a="acForgot">Quên mật khẩu?</button></p>
  <p class="ac-alt">Chưa có tài khoản? <button type="button" class="btn-link" data-a="acTab" data-v="register">Tạo tài khoản</button></p></form>`;
 return `<section class="wrap page ac-page"><div class="card ac">
  <div class="ac-h"><img class="logo-img" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"></div>
  <div class="seg ac-tabs" role="tablist" aria-label="Tài khoản"><button role="tab" aria-selected="${tab==='register'}" class="${tab==='register'?'on':''}" data-a="acTab" data-v="register">Tạo tài khoản</button><button role="tab" aria-selected="${tab==='login'}" class="${tab==='login'?'on':''}" data-a="acTab" data-v="login">Đăng nhập</button></div>
  ${tab==='login'?login:reg}</div></section>`;
}

// Ô "Sự kiện sắp tới" (danh sách gộp EVENTS, chung với tab Sự kiện của cộng đồng): chỉ hiện sự kiện chưa diễn ra, không có thì ẩn cả ô
const upcomingEvents=()=>EVENTS.filter(e=>new Date(e.end).getTime()>Date.now());
const evOn=e=>!!((S.comm&&S.comm.events)||{})[EVENTS.indexOf(e)];
const evWhen=e=>{const [t,wd]=e.t.split(' · ');return `${t}, ${wd.toLowerCase()} ${e.d}/${EV_YEAR} · ${e.len}`;};
// nút đăng ký sự kiện dùng chung: chưa đăng ký → "Tham gia" (gửi email xác nhận), đã đăng ký → nhãn xanh
const evBtn=(e,cls='btn-sm')=>evOn(e)?`<span class="pill ok">${ic('check',12)} Đã đăng ký</span>`:`<button class="btn btn-line ${cls}" data-a="commEvent" data-v="${EVENTS.indexOf(e)}">${ic('cal',14)} Tham gia</button>`;
function eventsCard(){
 const ev=upcomingEvents();if(!ev.length)return '';
 return `<div class="card pad ev-card"><b class="ev-h">${ic('cal',16)} Sự kiện sắp tới</b><ul class="ev-list">${ev.map(e=>{
  return `<li class="ev-${e.k}"><span class="ev-ico">${ic(e.icon,16)}</span><div><span class="tag">${e.type}</span><b>${esc(e.title)}</b><span class="hint">${esc(evWhen(e))}</span>
   <div>${evBtn(e)}</div></div></li>`;}).join('')}</ul></div>`;
}

/* ---------- 3. Khóa học của tôi ---------- */
function mycourses(){
 const started=S.ob.done&&S.plan&&(S.plan.accepted||S.plan.wasActive);const st=started?planStats():null;
 const fresh=!c0Started();
 const status=fresh?['Chưa bắt đầu','wait']:!S.ob.done?['Đang học Chương 0','blue']:!started?['Chờ xác nhận lộ trình','blue']:st.unitsDone===st.units&&subsCount()===Object.keys(TASKS).length?['Đã hoàn thành','ok']:['Đang học','blue'];
 const cta=fresh?'Bắt đầu Chương 0':!S.ob.done?'Tiếp tục Chương 0':!started?'Xem lộ trình của anh/chị':st.unitsDone===0&&subsCount()===0?'Bắt đầu học':'Học tiếp'; // 0 bài học + 0 bài tập = Bắt đầu học, từ 1 bài trở đi = Học tiếp (theo yêu cầu user)
 const cu=started?curUnit():null;
 const head=`<header class="my-hd"><h1>Khóa học của tôi</h1><p>Các khóa học anh/chị đã đăng ký tại Học viện Siêu Tăng Trưởng.</p></header>`; // bỏ nhãn tím Khóa học của tôi (user 28/10/2026)
 // chưa đăng ký khóa nào (vào từ thẻ Khóa học của tôi ở trang chủ)
 // chưa mua nhưng đã học thử Chương 0: thẻ "Đang học thử" (PLAN_Onboarding.md mục 3)
 if(!S.enrolled&&c0Started()){const n=C0_KEYS().filter(k=>S.done[k]).length,N=C0_KEYS().length,dn=c0Done();
  return `<section class="wrap page crs list-page">${head}<h2 class="sr-only">Khóa học đã đăng ký</h2><div class="grid g2" style="align-items:start"><article class="card course"><button class="course-thumb" data-a="trialStart" aria-label="Mở Chương 0 khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${LIB.length} chương · ${ALL_BAI.length} bài</span></button>
   <div class="pad" style="display:grid;gap:14px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h2 class="h3">AI for CEO</h2><span class="pill wait">Đang học thử</span></div>
    <div style="display:grid;gap:6px"><div style="display:flex;align-items:center;gap:10px"><div class="bar" style="flex:1"><i style="width:${Math.round(n/N*100)}%"></i></div><b class="tnum" style="font-size:14px;color:var(--blue)">${n}/${N}</b></div><p class="crs-meta">${ic('bookopen',15)} Chương 0 miễn phí · ${N} bài</p></div>
    ${dn?`<button class="btn btn-primary btn-lg btn-block" data-a="go" data-to="checkout">Đăng ký để học tiếp ${ic('arrow')}</button><button class="btn btn-line btn-block" data-a="trialStart">Xem lộ trình của anh/chị</button>`:`<button class="btn btn-primary btn-lg btn-block" data-a="trialStart">Tiếp tục Chương 0 ${ic('arrow')}</button>`}</div></article></div></section>`;}
 if(!S.enrolled)return `<section class="wrap page crs list-page">${head}<div class="card my-empty"><span class="my-empty-ic">${ic('book',26)}</span><h2>Anh/chị chưa đăng ký khóa học nào</h2><p>Chọn một khóa học để bắt đầu hành trình học AI cùng Học viện.</p><button class="btn btn-primary" data-a="go" data-to="courses">Xem các khóa học ${ic('arrow',16)}</button></div></section>`;
 return `<section class="wrap page crs list-page">${head}
 <div class="grid g2" style="align-items:start">
  <article class="card course"><button class="course-thumb" data-a="openCourse" aria-label="Mở khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${LIB.length} chương · ${ALL_BAI.length} bài</span></button>
   <div class="pad" style="display:grid;gap:14px">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h2 class="h3">AI for CEO</h2><span class="pill ${status[1]}">${status[0]}</span></div>
    ${(pc=>`<div style="display:grid;gap:6px"><div style="display:flex;align-items:center;gap:10px"><div class="bar" style="flex:1"><i style="width:${pc}%"></i></div><b class="tnum" style="font-size:14px;color:var(--blue)">${pc}%</b></div><p class="crs-meta">${ic('bookopen',15)} ${ALL_BAI.length} bài học</p></div>`)(started?st.upct:0)}
    <div class="kv"><div><span>Ngày kích hoạt</span><b>${esc((S.order&&S.order.paidAt)||today())}</b></div><div><span>Mã đơn</span><b class="tnum">${esc((S.order&&S.order.code)||'')}</b></div><div><span>Thời hạn truy cập</span><b>1 năm</b></div></div>
    <button class="btn btn-primary btn-lg btn-block" data-a="openCourse">${cta} ${ic('arrow')}</button>
   </div></article>
 </div></section>`;
}

/* ---------- 4. Onboarding (chatbot lộ trình) ---------- */
function onboarding(){
 if(!S.ob.flow.length&&!S.ob.done)startOb();
 if(S.ob.flow.some(s=>!Q[s]))fixOb();
 if(!S.ob.done&&S.ob.i>=S.ob.flow.length&&!T.obTyping)finishOb();
 const p=S.profile;const st=S.ob.flow[S.ob.i];const fromEval=!!S.eval;
 const rows=[['Ngành',p.industry,fromEval],['Quy mô nhân sự',p.size,fromEval],['Hiện trạng sử dụng AI',p.level?LEVELS[p.level]:'',fromEval],['Phòng ban quan tâm',p.goals&&p.goals.length?goalsText(p.goals):'',fromEval],['Bài toán muốn giải',p.problem,false],['Thời gian hoàn thành',p.days?`${p.days} ngày`:'',false],['Thời gian học mỗi ngày',p.minPerSession?p.minPerSession+' phút':'',false],['Số bài học',profileComplete(p)?lessonsOf(p)+' bài, mỗi ngày 1 bài':'',false]];
 const need=[p.industry,p.size,p.level,p.goals&&p.goals.length,p.days,p.minPerSession];const pct=Math.round(need.filter(Boolean).length/need.length*100);
 let chips='';
 if(st&&!T.obTyping){const q=Q[st];chips=q.chips(p).map(([v,l])=>q.multi?`<button class="chip ${S.ob.multi.includes(v)?'on':''}" data-a="obToggle" data-v="${esc(v)}">${esc(l)}</button>`:`<button class="chip" data-a="obChip" data-v="${esc(v)}" data-l="${esc(l)}">${esc(l)}</button>`).join('')+(q.multi?`<button class="chip cta" data-a="obGoalsDone" ${S.ob.multi.length?'':'disabled'}>Xong</button>`:'');}
 if(S.ob.done)chips=`<button class="chip cta" data-a="genPlan">${ic('spark',14)} Tạo lộ trình cá nhân</button>`;
 return `<section class="wrap page">
 <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><span>AI for CEO</span><span>/</span><span>Onboarding</span></div>
 <div class="page-head"><span class="eyebrow">AI for CEO · Onboarding</span><h2 class="h2">Chào mừng anh/chị ${esc(firstName())}</h2><p class="sub" style="max-width:none">Trả lời vài câu hỏi để nhận lộ trình riêng.</p></div>
 <div class="two"><div class="card chat">
  <div class="chat-h"><span class="bot-av">${ic('bot')}</span><div><b>Trợ lý lộ trình</b><span>Cá nhân hóa lộ trình theo hồ sơ của anh/chị</span></div><span class="step-count" aria-live="polite">${S.ob.done?`${ic('check',14)} Hồ sơ đã đủ`:`Câu ${Math.min(S.ob.i+1,S.ob.flow.length)}/${S.ob.flow.length}`}</span></div>
  <div class="chat-log" id="ob-log">${S.ob.msgs.map(m=>`<div class="msg ${m.role}">${fmt(m.text)}</div>`).join('')}${T.obTyping?'<div class="msg bot typing">Đang soạn…</div>':''}</div>
  <div class="chips">${chips}</div>
  <form class="chat-in" data-f="obSend"><input class="inp" id="ob-in" name="t" autocomplete="off" placeholder="${st==='days'?'Ví dụ: 10 ngày, 3 tuần…':st==='problem'?'Mô tả bài toán của công ty…':'Hoặc gõ câu trả lời…'}"><button class="send" aria-label="Gửi">${ic('send')}</button></form>
 </div>
 <aside class="card pad prof sticky"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3>Hồ sơ học viên</h3><b class="tnum">${pct}%</b></div><div class="bar" style="margin-bottom:10px"><i style="width:${pct}%"></i></div>
  ${rows.map(([k,v,ev])=>`<div class="prof-row"><span class="k">${k}</span><span class="v ${v?'':'empty'}">${v?esc(v):k==='Bài toán muốn giải'&&S.ob.done?'Không nêu':'Chưa trả lời'}${v&&ev?'<small>Từ bài đánh giá</small>':''}</span></div>`).join('')}</aside></div></section>`;
}

/* ---------- danh sách bài theo chương (dùng chung cho Lộ trình & Khóa học) ---------- */
// Theo ai_for_ceo_lo_trinh_khoa_hoc_ui_redesign.md: chương thu gọn mặc định; mỗi bài chỉ hiện tên, thời lượng, năng lực, trạng thái, CTA.
// Bấm vào bài mới mở chi tiết (nội dung video/bài tập, ngày học, vì sao phù hợp). Logic mở khóa bài giữ nguyên (lessonOpen).
function lessonState(i){const ni=nextLesson();if(lessonDone(i))return 'done';if(i===ni)return 'doing';/* bài hiện tại luôn là "Đang học", kể cả chưa bắt đầu */return lessonOpen(i)?'next':'locked';}
const STATE_LABEL={done:'Hoàn thành',doing:'Đang học',next:'Chưa học',locked:'Chưa mở',paid:'Mở khi đăng ký khóa học'};
// năng lực chính của 1 bài (module đầu tiên trong bài) → tên + màu
function lessonCap(ks){const m=ks.map(k=>L[U(k).id]).find(x=>x.type==='module')||L[U(ks[0]).id];const ci=CAP_MAP.findIndex(c=>c.id===m.id);return {name:m.cap||m.title,color:ci>=0?CAP_MAP[ci].color:PHASE_COLOR[m.phase],label:ci>=0?`Năng lực ${capNo(ci)}`:m.cap};}
// năng lực AI của 1 bài: bỏ mã số đầu ("01 + 02 — Hiểu…" → "Hiểu…")
const capName=c=>String(c||'').replace(/^[\d\s+–-]+—\s*/,'');
function courseList(key,{cta=true,why=false}={}){ // cta: cho phép mở bài (lộ trình đã xác nhận)
 const cu=curUnit(),all=planUnits();
 const ch=LIB.map((x,pi)=>{const ks=all.filter(k=>chOf(k)===x.id),dn=ks.filter(k=>S.done[k]).length;
  return {x,pi,ks,dn,state:ks.length&&dn===ks.length?'done':(ks.includes(cu)&&!paidLock(cu))||ks.some(k=>!S.done[k]&&unitOpen(k)&&!paidLock(k))?'cur':'locked'};}).filter(c=>c.ks.length);
 if(!T.cx[key]){const c=ch.find(c=>c.ks.includes(cu));T.cx[key]=(key==='learn'||key==='syl')&&c?[c.pi]:[];}
 // vừa quay lại từ 1 bài: mở sẵn chương chứa bài đó để cuộn tới
 if(T.focusLesson!=null){const fc=ch.find(c=>c.ks.includes(T.focusLesson));if(fc&&!T.cx[key].includes(fc.pi))T.cx[key]=[...T.cx[key],fc.pi];}
 const open=T.cx[key],lx=T.lx[key];
 return `<div class="cl">${ch.map(c=>{const isOpen=open.includes(c.pi),min=c.ks.reduce((s,k)=>s+U(k).m,0),nEx=c.ks.filter(k=>U(k).kind==='exercise').length;
  const st=c.state,rs=why&&S.plan?(S.plan.items.find(i=>i.id===c.x.id)||{}).reason:'';
  return `<section class="cl-ch ${st} ${isOpen?'open':''}" style="--c:${PHASE_COLOR[c.x.id]}">
   <button class="cl-head" data-a="cxToggle" data-k="${key}" data-v="${c.pi}" aria-expanded="${isOpen}">
    <span class="cl-ico">${ic(st==='done'?'check':st==='cur'?'arrow':'lock',16)}</span>
    <span class="cl-t"><b>${chLabel(c.x)}: ${esc(c.x.title)}</b></span>
    <span class="cl-meta">${c.ks.length} bài</span>
    <span class="cl-prog"><i style="width:${Math.round(c.dn/c.ks.length*100)}%"></i></span><span class="cl-n">${c.dn}/${c.ks.length}</span>
    <span class="chev">${ic('chev',16)}</span></button>
   ${isOpen?`${rs?`<p class="cl-why cl-chwhy">${ic('spark',13)}<span>${esc(rs)}</span></p>`:''}<ol class="cl-ls">${c.ks.map(k=>unitRow(k,key,{cta,openDetail:T.clAll[key]||lx===k})).join('')}</ol>`:''}</section>`;}).join('')}</div>`;
}
// nút "Xem chi tiết tất cả / Thu gọn tất cả" cho danh sách chương
const clToggleBtn=key=>`<button class="btn btn-ghost btn-sm cl-all" data-a="clAll" data-k="${key}" aria-pressed="${!!T.clAll[key]}">${ic(T.clAll[key]?'x':'chev',14)} ${T.clAll[key]?'Thu gọn tất cả':'Mở tất cả'}</button>`;
// 1 dòng bài: số bài · loại (Video / Bài tập) · số phút · ngày học, tên bài, trạng thái; bấm vào mở chi tiết (mục tiêu, năng lực, đầu ra, nút học)
function unitRow(k,key,{cta,openDetail}){
 const direct=key==='learn'||key==='syl';if(direct)openDetail=false; // trang vào học: bấm là vào bài luôn
 const u=U(k),s=unitState(k),b=u.b,isEx=u.kind==='exercise',d=lessonOfUnit(k);
 const lk=s==='locked'||s==='paid',rowCta=cta||chOf(k)==='C0';
 const right=`<span class="cl-st ${s}" ${lk?`title="${esc(unitLockMsg(k))}"`:''}>${s==='done'?ic('check',12)+' ':lk?ic('lock',12)+' ':''}${STATE_LABEL[s]}</span>`;
 const detail=openDetail?`<div class="cl-detail">
   <dl class="cl-kv">${b?`<div><dt>Mục tiêu</dt><dd>${esc(b.goal)}</dd></div><div><dt>Năng lực AI</dt><dd>${esc(capName(b.cap))}</dd></div><div><dt>${isEx?'Bài tập':'Đầu ra'}</dt><dd>${esc(b.out)}</dd></div>`:`<div><dt>Nội dung</dt><dd>Nhìn lại các đầu ra của ${esc(chLabel(L[u.id]))} và liên hệ với công ty.</dd></div>`}</dl>
   ${!lk&&rowCta?`<div><button class="btn btn-line btn-sm" data-a="openUnit" data-v="${k}">${s==='done'?'Xem lại':isEx?(S.subs[u.id]?'Xem bài tập':'Làm bài tập'):'Xem video'} ${ic('arrow',14)}</button></div>`:''}</div>`:'';
 return `<li class="cl-l ${s} ${openDetail?'open':''} ${isEx?'is-ex':''}" id="lr-${key}-${k}"><div class="cl-row">
  <span class="cl-dot">${b?b.i+1:'·'}</span>
  <button class="cl-name" ${direct?`data-a="openUnit" data-v="${k}"`:`data-a="lxToggle" data-k="${key}" data-v="${k}" aria-expanded="${!!openDetail}"`}><b>${esc(unitTitle(u))}</b><small><span class="cl-ty ${isEx?'isx':u.kind==='text'?'ist':''}">${ic(unitIcon(u),13)} ${unitType(u)}</span><span aria-hidden="true">·</span><span>${u.m} phút</span></small></button>
  ${right}</div>${detail}</li>`;
}

/* ---------- ngăn trượt (drawer): Vì sao tôi nhận lộ trình này? · Điều chỉnh lộ trình ---------- */
function drawerView(){
 if(!T.drawer||!S.plan)return '';
 const P=S.plan,p=S.profile;let title,body;
 if(T.drawer==='why'){
  title='Vì sao tôi nhận lộ trình này?';
  const mods=P.items.filter(it=>L[it.id].type==='module'&&it.reason),extras=P.items.filter(it=>L[it.id].type!=='module');
  body=`<div class="dw-sec"><h4>Dựa trên</h4><dl class="dw-kv">${(p.role||p.decision30||p.aiNow?[...c0Parts().map(([a,b])=>[a,b||'Cần bổ sung']),['Lịch học',`${p.days} ngày · ${p.minPerSession} phút/ngày`]]:[['Mục tiêu học tập',goalsText(p.goals)],['Mức độ AI hiện tại',LEVELS[p.level]],['Bối cảnh doanh nghiệp',[p.industry,p.size,p.problem].filter(Boolean).join(' · ')],['Quỹ thời gian',`${p.days} ngày · ${p.minPerSession} phút/ngày`],['Nhịp học','Học mỗi ngày']]).map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v||'—')}</dd></div>`).join('')}</dl></div>
   <div class="dw-sec"><h4>Hệ thống đã điều chỉnh</h4><p>${fmt(P.summary)}</p>
    <ul class="dw-list"><li><b>Thứ tự bài học</b><span>Giữ đủ ${LIB.length} chương, ${ALL_BAI.length} bài, đúng thứ tự</span></li><li><b>Bài tập</b><span>${Object.keys(TASKS).length} bài áp dụng cho công ty</span></li><li><b>Lịch học</b><span>${lessons().length} ngày · khoảng ${Math.max(1,Math.round(planUnits().length/lessons().length))} bài, ${Math.round(planStats().min/lessons().length)} phút mỗi ngày</span></li></ul></div>
   ${mods.length?`<div class="dw-sec"><h4>Nội dung từng chương</h4><ul class="dw-why">${mods.map(it=>`<li><span class="no">${modNo(L[it.id])}</span><div><b>${esc(chLabel(L[it.id])+': '+L[it.id].title)}</b><span>${esc(it.reason)}</span></div></li>`).join('')}</ul></div>`:''}
   ${P.skipped.length?`<details class="dw-sec skipped"><summary>Case chưa đưa vào (${P.skipped.length})</summary><ul>${P.skipped.map(s=>`<li><b>${esc(L[s.id].title)}</b>: ${esc(s.reason)}</li>`).join('')}</ul></details>`:''}
   <p class="hint">${P.source==='ai'?'Cá nhân hóa bởi AI':'Cá nhân hóa theo bộ luật'} · Phiên bản ${P.version}</p>`;
 }else{
  title='Điều chỉnh lộ trình';
  body=`<p class="hint">Nói với Trợ lý bằng lời của anh/chị. Tiến độ đã học được giữ nguyên.</p>
   <div class="card chat dw-chat">${S.adjustLog.length?`<div class="chat-log" id="adj-log">${S.adjustLog.map(m=>`<div class="msg ${m.role}">${fmt(m.text)}</div>`).join('')}</div>`:''}
   <div class="chips" style="padding-top:14px">${['Hoàn thành trong 7 ngày','Hoàn thành trong 1 tháng','Thêm ví dụ cho Sales','Học 1 giờ mỗi ngày'].map(c=>`<button class="chip" data-a="adjust" data-q="${c}">${c}</button>`).join('')}</div>
   <form class="chat-in" data-f="adjSend"><input class="inp" id="adj-in" name="q" autocomplete="off" placeholder="Ví dụ: hoàn thành trong 10 ngày…"><button class="send" aria-label="Gửi">${ic('send')}</button></form></div>`;
 }
 return `<div class="mail-ov dw-ov" role="presentation"><aside class="dw" role="dialog" aria-modal="true" aria-label="${title}"><div class="dw-h"><b>${title}</b><button class="x" data-a="drawerClose" aria-label="Đóng">${ic('x')}</button></div><div class="dw-b">${body}</div></aside></div>`;
}

// ---- Trang Lộ trình cập nhật theo tiến độ (đề xuất 27/10/2026): câu trạng thái so với kế hoạch, bài tiếp theo, 2 thanh Đã học / Kế hoạch, 4 số liệu, lịch 7 ngày ----
const rmDate=t=>{const d=new Date(t);return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0");};
const rmWd=t=>['CN','T2','T3','T4','T5','T6','T7'][new Date(t).getDay()];
function rmState(P,st){
 const ls=lessons(),n=ls.length,N=st.units,done=st.unitsDone,today=dayStart(Date.now()),start=planDay(0),end=planDay(n-1);
 const live=!!(S.enrolled&&P.accepted),fin=N>0&&done>=N;
 const di=Math.max(0,Math.min(n-1,Math.round((today-start)/DAY)));
 const planNow=ls.slice(0,di+1).flat().length,planPrev=ls.slice(0,di).flat().length;
 const late=live&&!fin?Math.max(0,planPrev-done):0,ahead=live&&!fin?Math.max(0,done-planNow):0;
 const perDay=Math.max(1,N/n),ats=Object.values(S.doneAt||{});
 const eta=fin?(ats.length?Math.max(...ats):today):Math.max(today,start)+Math.max(0,Math.ceil((N-done)/perDay)-1)*DAY;
 const kind=fin?'done':!live?'pre':late?'late':ahead?'ahead':'ok';
 return {ls,n,N,done,today,start,end,live,fin,di,planNow,late,ahead,eta,kind};
}
function rmTop(P,st,cta,free){
 const R=rmState(P,st),avg=Math.round(st.min/R.n),cu=curUnit(),u=cu?U(cu):null,nT=Object.keys(TASKS).length,caps=CAP_MAP.filter(c=>itemDone(c.id)).length;
 const tKs=R.live&&!R.fin?R.ls[R.di]:[],tLeft=tKs.filter(k=>!S.done[k]).length;
 const hT=S.enrolled?'h2':'h1',head=`<div class="rp-head"><div><${hT}>Lộ trình của anh/chị</${hT}><p>${R.n} ngày · ${R.N} bài · ~${avg} phút mỗi ngày</p></div>
  <div class="rp-head-r"><button class="btn-link rp-why" data-a="drawerOpen" data-v="why">${ic('spark',15)} Vì sao tôi nhận lộ trình này?</button><button class="btn btn-line" data-a="drawerOpen" data-v="adjust">${ic('refresh',15)} Điều chỉnh lộ trình</button></div></div>`;
 // 1 câu trạng thái dễ hiểu
 const B={
  ok:['check','Anh/chị đang học đúng kế hoạch',tLeft?`Hôm nay còn ${tLeft} bài để giữ nhịp.`:'Hôm nay anh/chị đã học đủ bài.'],
  ahead:['zap',`Anh/chị đang nhanh hơn kế hoạch ${R.ahead} bài`,`Giữ nhịp này, anh/chị về đích khoảng ngày ${rmDate(R.eta)}.`],
  late:['clock',`Anh/chị đang chậm ${R.late} bài so với kế hoạch`,`Học thêm ${R.late} bài để bắt kịp, hoặc giãn lộ trình. Dự kiến về đích ${rmDate(R.eta)} (kế hoạch ${rmDate(R.end)}).`],
  pre:['flag','Lộ trình đã sẵn sàng',`Bắt đầu từ bài đầu tiên, mỗi ngày khoảng ${avg} phút.`],
  done:['check','Anh/chị đã hoàn thành lộ trình',`Về đích ngày ${rmDate(R.eta)}. Nhận chứng nhận để lưu lại kết quả.`]}[R.kind];
 const ban=`<div class="rp-ban ${R.kind}" role="status"><span class="rp-ban-ic" aria-hidden="true">${ic(B[0],20)}</span><div class="rp-ban-t"><b>${B[1]}</b><span>${B[2]}</span></div>${R.late?`<button class="btn btn-line btn-sm" data-a="drawerOpen" data-v="adjust">Giãn lộ trình</button>`:''}</div>`;
 const next=`<div class="rp-next"><p class="rp-k">${R.fin?'Hoàn thành':R.live?`Ngày ${R.di+1}/${R.n} · ${R.done?'Bài tiếp theo':'Bài đầu tiên'}`:R.done?'Bài tiếp theo':'Bài đầu tiên'}</p>
   <h2>${R.fin?`Đã học xong ${R.N}/${R.N} bài`:esc(unitTitle(u))}</h2>
   ${R.fin?'':`<p class="rp-m">${esc(chLabel(L[chOf(cu)]))} · ${unitType(u)} · ${u.m} phút</p>`}
   <div class="rp-act">${cta}</div>${free||''}</div>`;
 const cmp=`<div class="rp-cmp"><p class="rp-k">Tiến độ hoàn thành</p><div class="rp-pct"><b class="tnum">${st.upct}%</b><span>${R.done}/${R.N} bài</span></div><span class="rp-track" role="progressbar" aria-valuenow="${st.upct}" aria-valuemin="0" aria-valuemax="100" aria-label="Tiến độ hoàn thành"><i style="width:${st.upct}%"></i></span></div>`;
 const mini=(v,t)=>`<span class="rp-mini" aria-hidden="true"><i style="width:${t?Math.round(v/t*100):0}%"></i></span>`;
 const kpi=[['book','Bài đã học',R.done,R.N],['write','Bài tập đã nộp',subsCount(),nT],['aichip','Năng lực AI đã chinh phục',caps,CAP_MAP.length],R.fin?['cal','Ngày về đích',rmDate(R.eta),0]:['cal','Ngày đã đi qua',R.live?R.di+1:0,R.n]];
 const kpis=`<ul class="rp-stats">${kpi.map(([i,l,v,t],j)=>`<li class="a${j+1}"><span class="rp-st-l"><span class="rp-st-ic" aria-hidden="true">${ic(i,16)}</span>${l}</span><b class="tnum">${v}${t?`<small>/${t}</small>`:''}</b>${t?mini(v,t):''}</li>`).join('')}</ul>`;
 let week='';
 if(R.live&&!R.fin){const w0=Math.max(0,Math.min(R.di-3,R.n-7)),idx=[...Array(Math.min(7,R.n)).keys()].map(j=>w0+j);
  const cell=i=>{const ks=R.ls[i],dn=ks.filter(k=>S.done[k]).length,t=planDay(i),s=dn===ks.length?'done':i<R.di?'miss':i===R.di?'today':'next',td=i===R.di;
   const tx={done:'Đã học',miss:'Chưa học',today:'Hôm nay',next:'Sắp tới'}[s];
   return `<li class="rp-c s-${s}${td?' is-today':''}" aria-label="Ngày ${i+1}, ${rmDate(t)}: đã học ${dn}/${ks.length} bài, ${td?'hôm nay':tx.toLowerCase()}"><span class="wd">${td?`<span class="rp-lg">Hôm nay</span><span class="rp-sm">Nay</span>`:rmWd(t)}</span><span class="num tnum">${new Date(t).getDate()}</span><span class="st">${dn}/${ks.length}<span class="rp-lg"> bài</span></span></li>`;};
  week=`<section class="rp-week" aria-labelledby="rp-wk-h"><div class="rp-week-h"><h2 id="rp-wk-h">Lịch học 7 ngày</h2><p class="rp-key"><span class="k-done">Đã học</span><span class="k-today">Hôm nay</span><span class="k-miss">Chưa học</span><span class="k-next">Sắp tới</span></p></div><ol class="rp-cal">${idx.map(cell).join('')}</ol></section>`;}
 const sim=S.enrolled&&P.accepted?`<div class="demo-box rp-sim"><b>Mô phỏng tiến độ</b><span>Xem trang Lộ trình thay đổi theo tiến độ học:</span><div><button class="btn btn-line btn-sm" data-a="rmSim" data-v="ok">Đúng kế hoạch</button><button class="btn btn-line btn-sm" data-a="rmSim" data-v="late">Chậm 3 ngày</button><button class="btn btn-line btn-sm" data-a="rmSim" data-v="ahead">Nhanh 2 ngày</button><button class="btn btn-line btn-sm" data-a="rmSim" data-v="done">Học xong</button></div></div>`:'';
 return {top:`${head}<section class="rp-card" aria-label="Tiến độ hôm nay">${ban}<div class="rp-body">${next}${cmp}</div></section>${kpis}${week}`,sim};
}

/* ---------- 5. Lộ trình cá nhân ---------- */
function syllabus(){
 const p=S.profile;
 if(T.gen)return `<section class="wrap narrow page"><div class="card gen"><div class="spin" role="status" aria-label="Đang tạo"></div><h2 class="h3">${esc(T.gen.msg)}</h2>
  <ol><li>${ic('check',16)} Đọc hồ sơ của anh/chị</li><li>${ic('check',16)} Giữ đủ ${LIB.length} chương, ${ALL_BAI.length} bài</li><li>${ic('check',16)} Chia bài vào ${lessonsOf(p)} ngày học</li></ol></div></section>`;
 if(!S.plan)return `<section class="wrap narrow page"><div class="card gen"><h2 class="h3">Hồ sơ đã sẵn sàng</h2>${T.err.gen?`<p class="err">${esc(T.err.gen)}</p>`:''}<button class="btn btn-primary btn-lg" data-a="genPlan">${ic('spark')} Tạo lộ trình</button></div></section>`;
 const P=S.plan,st=planStats(),ni=nextLesson(),cu=curUnit(),avg=Math.round(st.min/st.n),perDay=Math.max(1,Math.round(st.units/st.n));
 const cta=!S.enrolled?(!c0Done()?`<button class="btn btn-primary btn-lg" data-a="trialStart">Tiếp tục Chương 0 ${ic('arrow',16)}</button>`:!S.loggedIn?`<button class="btn btn-primary btn-lg" data-a="saveRoute">Lưu lộ trình ${ic('arrow',16)}</button>`:`<button class="btn btn-primary btn-lg" data-a="go" data-to="checkout">Đăng ký để học tiếp ${ic('arrow',16)}</button>`)
  :!P.accepted?`<button class="btn btn-primary btn-lg" data-a="acceptPlan" ${P.warning?'disabled':''}>${P.wasActive?'Lưu lộ trình':c0Done()?'Bắt đầu Chương 1':'Bắt đầu học'} ${ic('arrow',16)}</button>`
  :cu?`<button class="btn btn-primary btn-lg" data-a="openUnit" data-v="${cu}">${st.unitsDone===0&&subsCount()===0?'Bắt đầu học':'Học tiếp'} ${ic('arrow',16)}</button>`:`<button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button>`;
 const RM=rmTop(P,st,cta,!S.enrolled&&c0Done()?`<p class="rm-free">${ic('lock',14)} Anh/chị đã học xong Chương 0 miễn phí. ${S.loggedIn?'Đăng ký khóa học để mở Chương 1 → Kết theo lộ trình này.':'Tạo tài khoản miễn phí để lưu lộ trình, rồi đăng ký khóa học để học tiếp.'}</p>`:'');
 const warn=P.warning?`<div class="callout warn cl-warn"><b>Mỗi bài khoảng ${P.warning.perLesson} phút, vượt ${P.profile.minPerSession} phút/ngày</b><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-a="fixDays" data-v="${Math.min(P.warning.needDays,MAX_DAYS)}">Học trong ${Math.min(P.warning.needDays,MAX_DAYS)} ngày</button>${P.warning.needMin?`<button class="btn btn-line btn-sm" data-a="fixPace" data-v="${P.warning.needMin}">Học ${P.warning.needMin} phút/ngày</button>`:''}</div></div>`:'';
 const body=`${RM.top}${warn}<section class="cl-sec"><div class="cl-sec-h"><h2 class="h3">Nội dung khóa học</h2><div class="cl-sec-r"><span class="hint">${LIB.length} chương · ${st.units} bài</span>${clToggleBtn('syl')}</div></div><div class="rp-cl">${courseList('syl',{cta:!!(P.accepted||P.wasActive)})}</div></section>${RM.sim}`;
 if(S.enrolled)return `<section class="wrap page cl-page has-band">${courseBand('Lộ trình')}<div class="lx-syl">${body}</div></section>`;
 return `<section class="wrap page cl-page"><div class="crumbs"><button data-a="go" data-to="home">Trang chủ</button><span>/</span><span>AI for CEO</span><span>/</span><span>Lộ trình</span></div>${body}</section>`;
}

/* ---------- 6. Khóa học AI for CEO (Học) ---------- */
// ---- Khung trang khóa học (bản 1, 27/10/2026), tham khảo Coursera (menu dọc bên trái của khóa học), DataCamp (nút Tiếp tục + tiến độ), Udemy (tiến độ ở đầu trang) ----
// Dùng chung cho trang vào học và trang Lộ trình: dải navy gọn + menu dọc (máy tính) / thanh tab (điện thoại)
const COURSE_NAV=()=>[['learn','book','Bài học',''],['syllabus','cal','Lộ trình',''],['outputs','write','Bài tập',''],['dashboard','chart','Dashboard',''],['complete','award','Chứng nhận hoàn thành','']];
function courseTabs(on){if(on==='lesson')on='learn';return `<nav class="lx-tabs" aria-label="Các mục của khóa học">${COURSE_NAV().map(([sc,,t,n])=>`<button class="lx-tab${sc===on?' on':''}" data-a="go" data-to="${sc}"${sc===on?' aria-current="page"':''}>${sc==='complete'?`<span class="lx-lg">${t}</span><span class="lx-sm">Chứng nhận</span>`:t}${n?`<small class="tnum">${n}</small>`:''}</button>`).join('')}<span class="lx-tabs-r">${bandX()}</span></nav>`;}
function courseNav(on){
 const it=([sc,i,t,n],x)=>`<li><button class="lx-ni${sc===on?' on':''}" ${x||`data-a="go" data-to="${sc}"`}${sc===on?' aria-current="page"':''}><span class="lx-ni-ic" aria-hidden="true">${ic(i,18)}</span><span>${t}</span>${n?`<small class="tnum">${n}</small>`:''}</button></li>`;
 return `<nav class="lx-nav" aria-label="Các mục của khóa học"><ul>${COURSE_NAV().map(x=>it(x)).join('')}</ul><ul class="lx-nav2">${it(['community','users','Cộng đồng',''],'data-a="openCommunity" data-v="aiceo"')}${it(['complete','award','Điều kiện hoàn thành',''])}</ul></nav>`;
}
// 2 ô gọn trên dải navy: Nhắc lịch học + sự kiện gần nhất
function bandX(){const r=S.remind,ev=upcomingEvents()[0];
 return `<button class="lx-pill" data-a="remindOpen">${ic('bell',15)}<span>Nhắc lịch học: <b>${r.on?esc(r.time):'Chưa đặt'}</b></span></button>${ev?`<button class="lx-pill lx-pev" data-a="evList" aria-haspopup="dialog">${ic('cal',15)}<span class="lx-pev-t">Sự kiện sắp tới <b class="lx-pev-n">${upcomingEvents().length}</b></span></button>`:''}<!-- tạm ẩn ô Cộng đồng (user 27/10/2026) -->`;}
function evListView(){if(!T.evList)return '';const ev=upcomingEvents();
 return `<div class="mail-ov" role="presentation"><div class="mail lx-evm" role="dialog" aria-modal="true" aria-labelledby="lx-evm-h"><div class="lx-evm-h"><h2 id="lx-evm-h">${ic('cal',18)} Sự kiện sắp tới <span>${ev.length}</span></h2><button class="x" data-a="evListClose" aria-label="Đóng">${ic('x')}</button></div>
  <ul class="lx-evm-l">${ev.map(e=>`<li><span class="lx-evm-d" aria-hidden="true"><small>Th${e.d.split('/')[1]}</small><b>${e.d.split('/')[0]}</b></span><div class="lx-evm-b"><small>${esc(e.type)}</small><b>${esc(e.title)}</b><span>${esc(evWhen(e))}</span>${e.desc?`<p>${esc(e.desc)}</p>`:''}</div><div class="lx-evm-a">${evBtn(e)}</div></li>`).join('')}</ul></div></div>`;}
function courseBand(last,h="h1"){
 const st=planStats(),avg=Math.round(st.min/Math.max(1,st.n));
 return `<section class="lx-hero lx-band">
  <div class="lx-hero-g"><div class="lx-hero-t"><${h} class="lx-title">AI for CEO</${h}></div>
   <div class="lx-bp"><div class="lx-bp-h"><span><b class="tnum">${st.unitsDone}/${st.units}</b> bài đã hoàn thành</span></div><div class="lx-bp-r"><span class="lx-track" role="progressbar" aria-valuenow="${st.upct}" aria-valuemin="0" aria-valuemax="100" aria-label="Tiến độ khóa học"><i style="width:${st.upct}%"></i></span><b class="lx-pct tnum">${st.upct}%</b></div></div></div>
  <div class="lx-x-m">${bandX()}</div>${courseTabs(S.screen)}</section>`;
}
function learn(){
 // Trang vào học: thẻ "Tiếp tục học" → danh sách bài học; cột phải: nhắc lịch học, sự kiện sắp tới
 const st=planStats(),cu=curUnit(),started=st.unitsDone>0||subsCount()>0;
 let next;
 if(cu){const u=U(cu),c=chOf(cu),cks=planUnits().filter(k=>chOf(k)===c),idx=cks.indexOf(cu)+1,dec=decPending();
  next=`<section class="lx-next" aria-labelledby="lx-next-h"><div class="lx-thumb" aria-hidden="true">${COURSE.cover?`<img src="${esc(COURSE.cover)}" alt="" loading="lazy">`:''}<span class="lx-play">${ic(u.kind==='video'?'play':unitIcon(u),22)}</span></div>
   <div class="lx-next-b"><p class="lx-k">${started?'Tiếp tục học':'Bắt đầu học'}</p><h2 id="lx-next-h">${esc(unitTitle(u))}</h2>
    <p class="lx-m"><span>${esc(chLabel(L[c]))} · Bài ${idx}/${cks.length}</span><span aria-hidden="true">·</span><span>${unitType(u)} · ${u.m} phút</span></p>
    ${dec?`<button class="lx-dec" data-a="decOpen" data-v="${dec}">${ic('chat',14)} ${esc(chLabel(L[dec]))}: xem lại quyết định 30 ngày</button>`:''}</div>
   <div class="lx-next-a"><button class="btn btn-primary btn-lg" data-a="openUnit" data-v="${cu}">${started?'Học tiếp':'Bắt đầu học'} ${ic('arrow',16)}</button></div></section>`;}
 else next=`<section class="lx-next done" aria-labelledby="lx-next-h"><div class="lx-thumb is-done" aria-hidden="true"><span class="lx-play">${ic('award',24)}</span></div><div class="lx-next-b"><p class="lx-k">Hoàn thành</p><h2 id="lx-next-h">Anh/chị đã học hết ${st.units} bài</h2><p class="lx-m"><span>Nhận chứng nhận để lưu lại kết quả</span></p></div><div class="lx-next-a"><button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button></div></section>`;
 const side=`<aside class="lx-side"><div class="lx-card lx-rm">${remindRow()}</div>${eventsCard()}</aside>`;
 return `<section class="wrap page lx-page">${courseBand('')}<div class="lx-shell">${courseNav('learn')}<div class="lx-grid"><div class="lx-main">${next}
  <section class="cl-sec lx-list"><div class="cl-sec-h"><h2 class="h3">Danh sách bài học</h2><div class="cl-sec-r"><span class="hint">${LIB.length} chương · ${st.units} bài</span>${clToggleBtn('learn')}</div></div>${courseList('learn')}</section>
  <div class="demo-box"><span class="t">Công cụ demo</span><div><button class="btn btn-line btn-sm" data-a="simulateAll">Mô phỏng: học xong toàn bộ</button></div></div></div>${side}</div></div></section>`;
}

/* ---------- 7. Trang bài học ---------- */
// Nội dung bài: video → mục tiêu, năng lực AI, đầu ra; bài tập → đề bài + nộp bài; ôn tập → đầu ra của chương
function unitContent(u){
 const p=S.profile,x=L[u.id],b=u.b;
 if(u.kind==='review')return `<div class="take"><span class="t">Ôn tập ${esc(chLabel(x))}</span><p class="big">${esc(x.take)}</p><div><b style="font-size:15px">Nhìn lại các đầu ra của chương và liên hệ với công ty</b><ol style="margin-top:8px">${x.items.map(i=>`<li>${esc(i.out)}</li>`).join('')}</ol></div><p class="hint">Ở công ty ${esc(String(p.industry||'').toLowerCase())}, anh/chị có thể bắt đầu từ việc ${esc((IND[p.industry]||IND['Khác']).general)}.</p></div>`;
 if(u.kind==='exercise')return exerciseView(u.id);
 const tb=u.kind==='text'&&TEXT_BODY[u.key];
 return `${tb?`<article class="ls-read"><p class="ls-lead">${esc(tb.lead)}</p>${tb.secs.map(x=>`<h2>${esc(x.h)}</h2><p>${esc(x.p)}</p>`).join('')}<div class="ls-chk"><b>${ic('check',16)} ${esc(tb.list.h)}</b><ul>${tb.list.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></article>`:''}<div class="ls-info">
  <div class="block"><span class="t">Mục tiêu bài học</span><p class="ls-goal">${esc(b.goal)}</p></div>
  <div class="ls-2"><div class="block"><span class="t">Năng lực AI</span><p><span class="ls-cap" style="--c:${PHASE_COLOR[b.ch]}">${esc(capName(b.cap))}</span></p></div>
   <div class="block"><span class="t">Đầu ra</span><p>${esc(b.out)}</p></div></div>
  <p class="hint">Loại bài: ${esc(b.lt)}</p></div>`;
}
// Bài tập: form nộp (lần đầu / sửa) hoặc kết quả đã nộp + nhận xét
// Đề bài: lời dẫn + các câu cần trả lời (lấy từ TASKS)
function exBrief(t){return t.kind==='uc'
 ?{intro:'Đánh giá các cơ hội đã gom ở bài trước theo giá trị kinh doanh, mức độ khả thi, dữ liệu sẵn có, rủi ro và mức độ sẵn sàng của tổ chức; chọn 3 cơ hội đáng ưu tiên nhất. Với mỗi cơ hội, ghi:',items:['Việc muốn AI làm','Phòng ban thực hiện','Năng lực AI sẽ dùng','Vì sao đáng ưu tiên: giá trị, dữ liệu sẵn có, ai phụ trách']}
 :{intro:((bai('E:'+Object.keys(TASKS).find(k=>TASKS[k]===t))||{}).goal||'')+' Trả lời cho chính công ty của anh/chị.',items:[...t.fields.map(f=>f.label+(f.type==='select'?` (chọn 1: ${f.opts.join(' · ')})`:'')),...(t.linkTask?[t.linkTask]:[])]};}
const exFileLink=f=>`${ic('file',16)}<span class="nm">${f.data?`<a href="${f.data}" download="${esc(f.name)}">${esc(f.name)}</a>`:esc(f.name)}</span><small>${kb(f.size||0)}</small>`;
// Kết quả AI chấm: điểm tổng + Đạt/Chưa đạt, 3 tiêu chí, nhận xét từng câu, điểm tốt / nên bổ sung, câu hỏi cho đội ngũ
const exScore=v=>String(v).replace('.',',');
function reviewHTML(id,f){
 if(f.pending)return `<section class="rv pending" aria-live="polite"><div class="rv-h"><span class="t">${ic('spark',15)} AI đang chấm bài…</span></div><div class="rv-sk" aria-hidden="true"><i></i><i></i><i></i></div></section>`;
 if(f.score==null)return f.text?`<div class="fb"><span class="t">Nhận xét</span><p>${fmt(f.text)}</p></div>`:'';
 const t=TASKS[id],qs=t.kind==='uc'?['Use case 1','Use case 2','Use case 3',...(t.linkTask?['Link']:[])]:exBrief(t).items.map((_,i,a)=>'Câu '+(i+1));
 const QI={link:['link','blue'],ok:['check','ok'],short:['alert','warn'],miss:['x','bad'],file:['clip','blue'],gen:['alert','warn']};
 return `<section class="rv" aria-live="polite">
  <div class="rv-h"><div><span class="t">${ic('spark',15)} Kết quả chấm · AI chấm tự động</span><small>Chấm lúc ${esc(f.at||'')}</small></div>
   <div class="rv-score ${f.pass?'ok':'warn'}"><b class="tnum">${exScore(f.score)}</b><small>/10</small><span class="pill ${f.pass?'ok':'wait'}">${f.pass?'Đạt':'Chưa đạt'}</span></div></div>
  <div class="rv-crit">${f.crit.map(c=>`<div class="rv-c"><div class="rv-cl"><b>${esc(c.name)}</b><span>${esc(c.note)}</span></div><span class="rv-bar ${c.score>=7?'ok':c.score>=5?'warn':'bad'}"><i style="width:${c.score*10}%"></i></span><b class="tnum rv-cs">${exScore(c.score)}</b></div>`).join('')}</div>
  <div class="rv-q"><h5>Nhận xét từng câu</h5><ul>${f.qs.map((q,i)=>{const [icn,cl]=QI[q.st]||QI.ok;return `<li><span class="rv-st ${cl}">${icn==='alert'?'!':ic(icn,12)}</span><b>${qs[i]||'Câu '+(i+1)}</b><span>${esc(q.note)}</span></li>`;}).join('')}</ul></div>
  <div class="rv-2"><div class="rv-good"><h5>Điểm tốt</h5><ul>${f.good.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>${f.fix.length?`<div class="rv-fix"><h5>Nên bổ sung</h5><ul>${f.fix.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}</div>
  ${f.ask?`<p class="rv-ask">${ic('chat',15)}<span><b>Câu hỏi nên hỏi đội ngũ:</b> ${esc(f.ask)}</span></p>`:''}</section>`;}
function exerciseView(id){
 // Bài tập (làm lại 28/10/2026 theo bố cục user gửi): "ĐỀ BÀI" phẳng ở trên → khung "Nộp bài" (Cần nộp: … · Bài làm * có đếm ký tự · Link bài làm * · Tệp) → nút Nộp bài
 if(OB_SEG[id])return obExView(id);
 const t=TASKS[id],s0=S.subs[id],edit=!s0||T.editEx===id,b=exBrief(t),m=exMode(t),req=k=>m.need.includes(k)?' <span class="req">*</span>':'';
 const KIND={text:'Văn bản',link:'Link URL',file:'Tệp đính kèm'},need=(m.need.length?m.need:m.allow).map(k=>KIND[k]).join(' + ');
 const brief=`<section class="exv-brief" aria-labelledby="exb-${id}"><h2 class="exv-eye" id="exb-${id}">Đề bài</h2><p>${esc(b.intro)}</p><ol>${b.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`;
 const sub=`AI chấm theo tiêu chí của giảng viên và trả nhận xét ngay. Chưa đạt thì sửa và nộp lại.`;
 const fb=s0&&s0.feedback&&!edit?reviewHTML(id,s0.feedback):'';
 if(!edit)return `<div class="exv">${brief}
  <section class="exv-card" aria-labelledby="exa-${id}"><div class="exv-h"><h2 id="exa-${id}">Bài làm của anh/chị</h2><span class="exv-need">${ic('check',13)} Đã nộp ${esc(s0.at)}${s0.v>1?` · lần ${s0.v}`:''}</span></div>
   ${s0.text?`<div class="exv-lab">Bài làm</div><div class="ex-text exv-text">${fmt(s0.text)}</div>`:''}
   ${(s0.links||[]).length?`<div class="exv-lab">Link bài làm</div><ul class="ex-files ex-links">${s0.links.map(u=>`<li>${ic('link',16)}<span class="nm"><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></span><small>Mở ↗</small></li>`).join('')}</ul>`:''}
   ${(s0.files||[]).length?`<div class="exv-lab">Tệp đính kèm</div><ul class="ex-files">${s0.files.map(f=>`<li>${exFileLink(f)}${f.data?'':'<small class="hint">demo chỉ lưu tên tệp &gt; 400 KB</small>'}</li>`).join('')}</ul>`:''}
   <div class="exv-act"><button class="btn btn-line" data-a="editEx" data-v="${id}">Sửa & nộp lại</button><button class="btn btn-ghost" data-a="go" data-to="outputs">Xem tất cả bài tập</button></div></section>
  ${fb}</div>`;
 const text=T.draft&&T.draft.id===id?T.draft.text:(s0&&s0.text)||'',files=exFiles(id),bad=T.err.field==='ex-text',links=exDraftLinks(id);
 return `<form class="exv" data-f="exSubmit" data-id="${id}" novalidate>${brief}
  <section class="exv-card" aria-labelledby="exa-${id}"><div class="exv-h"><h2 id="exa-${id}">${s0?'Sửa bài làm':'Nộp bài'}</h2><span class="exv-need">Cần nộp: ${need}</span></div><p class="exv-sub">${sub}</p>
   ${m.allow.includes('text')?`<div class="field exv-f"><div class="exv-lrow"><label for="ex-text">Bài làm${req('text')}</label></div>
    <textarea class="inp exv-ta" id="ex-text" name="text" rows="8" maxlength="10000" placeholder="Nhập bài làm của bạn..."${bad?' aria-invalid="true" aria-describedby="ex-err"':''}>${esc(text)}</textarea><div class="exv-count" id="ex-count" aria-live="polite">${text.length.toLocaleString('vi-VN')}/10.000</div></div>`:''}
   ${m.allow.includes('link')?`<div class="field exv-f"><span class="exv-lrow"><span class="lab">Link bài làm${req('link')}</span></span>
    <div class="ex-linkl">${links.map((u,i)=>`<div class="ex-link exv-link"><input class="inp ex-link-i" id="ex-link${i}" type="url" inputmode="url" autocomplete="url" value="${esc(u)}" placeholder="https://..." aria-label="Link số ${i+1}"${T.err.field==='ex-link'+i?' aria-invalid="true" aria-describedby="ex-err"':''}>${links.length>1?`<button type="button" class="ex-x" data-a="exLinkRm" data-id="${id}" data-v="${i}" aria-label="Bỏ link số ${i+1}" title="Bỏ link">${ic('x',15)}</button>`:''}</div>`).join('')}
    ${links.length<EX_LINKS?`<button type="button" class="btn-link ex-addl" data-a="exLinkAdd" data-id="${id}">+ Thêm link</button>`:''}</div>
    <p class="exv-hint">${t.linkHint?esc(t.linkHint)+'. ':''}Link cần mở công khai (ai có link đều xem được) để giảng viên xem.</p></div>`:''}
   ${m.allow.includes('file')?`<div class="field exv-f"><span class="exv-lrow"><span class="lab">Tệp đính kèm${req('file')}</span><small class="hint">${files.length}/${EX_MAX} tệp</small></span>
    <button type="button" class="ex-drop${T.err.field==='ex-drop'?' bad':''}" id="ex-drop" data-a="exPick" data-id="${id}"${files.length>=EX_MAX?' disabled':''}>${ic('upload',22)}<span><b>Kéo thả tệp vào đây</b> hoặc <u>chọn tệp từ máy</u></span><small>PDF, Word (.docx), ảnh JPG / PNG / WebP · tối đa 10MB / tệp · tối đa ${EX_MAX} tệp</small></button>
    <input type="file" id="ex-file" data-id="${id}" multiple hidden accept=".pdf,.docx,.jpg,.jpeg,.png,.webp">
    ${files.length?`<ul class="ex-files">${files.map((f,i)=>`<li>${exFileLink(f)}<button type="button" class="ex-x" data-a="exFileRm" data-id="${id}" data-v="${i}" aria-label="Bỏ tệp ${esc(f.name)}" title="Bỏ tệp">${ic('x',15)}</button></li>`).join('')}</ul>`:''}${t.fileHint?`<p class="exv-hint">${esc(t.fileHint)}</p>`:''}</div>`:''}
   ${T.err.ex?`<p class="err" id="ex-err" role="alert">${T.err.ex}</p>`:''}
   <div class="exv-act"><button class="btn btn-primary">${s0?'Nộp lại':'Nộp bài'}</button>${s0?`<button type="button" class="btn btn-ghost" data-a="cancelEdit">Hủy</button>`:''}</div></section></form>`;
}
// Bài tập Chương 0 (bản 2, PLAN_Onboarding.md): nội dung bài ở trên, khung trò chuyện với Trợ lý lộ trình ở dưới
const c0Chip=(k,v,l,m)=>{const f=T.c0f||{},on=m?(f[k]||[]).includes(v):f[k]===v;return `<button type="button" class="chip ${on?'on':''}" data-a="c0Pick" data-k="${k}" data-v="${esc(v)}"${m?` data-m="${m}"`:''} aria-pressed="${on}">${esc(l)}</button>`;};
const c0Row=(lab,html,req)=>`<div class="c0-row"><span class="c0-lab">${lab}${req?' <span class="req">*</span>':''}</span><div class="chips">${html}</div></div>`;
const c0In=(n,lab,ph)=>`<label class="c0-row"><span class="c0-lab">${lab}</span><input class="inp" name="${n}" value="${esc((T.c0f||{})['_'+n]||'')}" placeholder="${esc(ph)}" autocomplete="off"></label>`;
// giá trị sẵn có khi vào 1 nhóm (để sửa lại từ bản tổng hợp)
function c0Prefill(g){const p=S.profile;return ({1:{industry:p.industry,model:p.model,size:p.size,_products:p.products||'',_customers:p.customers||'',_branches:p.branches||''},2:{role:p.role,roleMode:p.roleMode,roleDepts:(p.roleDepts||[]).slice()},3:{depts:(p.depts||[]).slice(),focus:p.focusDept},
 4:{problems:(p.problems||[]).filter(x=>OB_PROBLEMS.includes(x)),_other:(p.problems||[]).filter(x=>!OB_PROBLEMS.includes(x)).join('; ')},5:{aiNow:p.aiNow},6:{keep:p.decision30?null:'adj',_dec:p.decision30||''},7:{limits:(p.limits||[]).slice()},9:{days:String(p.days&&[15,30].includes(p.days)?p.days:p.days?'custom':30),_custom:p.days&&![15,30].includes(p.days)?String(p.days):'',min:String(p.minPerSession||20)}})[g]||{};}
function c0GroupForm(g){
 if(T.c0fG!==g){T.c0f=c0Prefill(g);T.c0fG=g;}const f=T.c0f;let body='';
 if(g===1)body=c0Row('Ngành',INDUSTRIES.map(x=>c0Chip('industry',x,x)).join(''),1)+c0Row('Mô hình kinh doanh',OB_MODELS.map(x=>c0Chip('model',x,x)).join(''),1)+c0Row('Quy mô nhân sự',SIZES.map(x=>c0Chip('size',x,x)).join(''),1)
  +`<div class="c0-2">${c0In('products','Sản phẩm/dịch vụ chính','Ví dụ: hàng tiêu dùng nhanh')}${c0In('customers','Khách hàng chính','Ví dụ: đại lý, người tiêu dùng')}</div>${c0In('branches','Số chi nhánh / địa điểm (nếu có)','Ví dụ: 3')}`;
 if(g===2)body=c0Row('Vai trò',OB_ROLES.map(x=>c0Chip('role',x,x)).join(''),1)+c0Row('Cách anh/chị điều hành',OB_ROLEMODES.map(x=>c0Chip('roleMode',x,x)).join(''),1)+c0Row('Bộ phận anh/chị đang theo sát nhất',Object.entries(DEPTS).map(([k,v])=>c0Chip('roleDepts',k,v,9)).join(''));
 if(g===3)body=c0Row('Doanh nghiệp có những bộ phận nào?',Object.entries(DEPTS).map(([k,v])=>c0Chip('depts',k,v,9)).join(''),1)+c0Row('Bộ phận đang khiến anh/chị quan tâm nhất',(f.depts||[]).length?f.depts.map(k=>c0Chip('focus',k,DEPTS[k])).join(''):'<span class="hint">Chọn các bộ phận ở trên trước</span>',1);
 if(g===4)body=c0Row(`Chọn tối đa 3 vấn đề (${(f.problems||[]).length}/3)`,OB_PROBLEMS.map(x=>c0Chip('problems',x,x,3)).join(''),1)+c0In('other','Vấn đề khác (không bắt buộc)','Mô tả ngắn, cách nhau bằng dấu ;');
 if(g===5)body=c0Row('Hiện trạng AI',Object.entries(OB_AINOW).map(([k,v])=>c0Chip('aiNow',k,v[0])).join(''),1);
 if(g===6)body=(S.profile.decision30?c0Row('Quyết định của anh/chị',c0Chip('keep','keep','Giữ nguyên')+c0Chip('keep','adj','Điều chỉnh'),1):'')
  +(!S.profile.decision30||f.keep==='adj'?`<label class="c0-row"><span class="c0-lab dec-pre">${DEC_PREFIX}…</span><textarea class="inp" name="dec" rows="2" placeholder="Ví dụ: đâu là ba quy trình đầu tiên đáng thử nghiệm AI">${esc(f._dec||'')}</textarea></label>`:'');
 if(g===7)body=c0Row('Giới hạn, điều kiện cần lưu ý',OB_LIMITS.map(x=>c0Chip('limits',x,x,9)).join('')+c0Chip('limits','__none','Chưa có giới hạn đặc biệt',9),1);
 if(g===9)body=c0Row('Hoàn thành chương trình trong',[['30','30 ngày'],['15','15 ngày'],['custom','Tự nhập']].map(([v,l])=>c0Chip('days',v,l)).join(''),1)+(f.days==='custom'?c0In('custom','Số ngày (từ 7 đến '+MAX_DAYS+')','Ví dụ: 45'):'')+c0Row('Mỗi ngày khoảng',[['20','20 phút'],['30','30 phút'],['60','1 giờ']].map(([v,l])=>c0Chip('min',v,l)).join(''),1);
 return `<form class="c0-form" id="c0-form" data-f="${g===9?'c0Sched':'c0Group'}" novalidate>${body}${T.err.c0?`<p class="err" role="alert">${esc(T.err.c0)}</p>`:''}<div class="c0-acts"><button class="btn btn-primary">${g===9?`${ic('spark',15)} Tạo lộ trình`:S.ob.b5.edit.length||S.ob.b5.fromSum?'Lưu và quay lại bản tổng hợp':g===7?'Xem bản tổng hợp':'Tiếp tục'} ${ic('arrow',15)}</button></div></form>`;}
// bảng hồ sơ 6 phần (+ lịch học); có nút Sửa từng phần
function c0PartsHTML(edit){const p=S.profile,n=(p.decHist||[]).filter(h=>h.act==='edit').length;
 return `<dl class="ob-sum c0-parts">${c0Parts().map(([a,b,g])=>`<div class="${b?'':'need'}"><dt>${a}${edit?`<button class="btn-link" data-a="c0Edit" data-v="${g}">Sửa</button>`:''}</dt><dd>${b?esc(b):'Cần bổ sung'}${a.startsWith('Quyết định')&&n?`<small>Đã điều chỉnh ${n} lần</small>`:''}</dd></div>`).join('')}
  ${p.days?`<div><dt>Lịch học${edit&&S.done['E:C0-5']?`<button class="btn-link" data-a="c0Edit" data-v="9">Sửa</button>`:''}</dt><dd>${p.days} ngày · ${p.minPerSession} phút/ngày</dd></div>`:''}</dl>`;}
function obExView(id){
 if(!S.ob||S.ob.v!==2)startOb();
 const t=TASKS[id],done=!!S.done['E:'+id],body=C0_BODY[id],b4=S.ob.b4,b5=S.ob.b5;
 if(id==='C0-4')c0Start4();else c0Start5();
 const msgs=S.ob.msgs.filter(m=>m.seg===id);
 const content=body?`<details class="card c0-body"${done?'':' open'}><summary>${ic('book',16)} Nội dung bài · ${body.read}</summary><div class="c0-body-in"><p class="c0-intro">${esc(body.intro)}</p><ol>${body.points.map(([h,x])=>`<li><b>${esc(h)}</b><span>${esc(x)}</span></li>`).join('')}</ol><div class="c0-rem">${ic('spark',15)}<span><b>CEO cần ghi nhớ.</b> ${esc(body.remember)}</span></div></div></details>`:'';
 // giống khung trò chuyện onboarding cũ: tin nhắn, lựa chọn nhanh, ô gõ + nút gửi
 let chips='',input=false,ph='Hoặc gõ câu trả lời…',step='',extra='';
 if(id==='C0-4'){
  step=b4.step==='done'?`${ic('check',14)} Đã xong`:'Câu quyết định';
  if(b4.step==='ask'){chips=DEC_SAMPLES.map(([l],i)=>`<button class="chip" data-a="c4Pick" data-v="${i}">${esc(l)}</button>`).join('');input=true;ph='Gõ tiếp câu: …quyết định điều gì?';}
  if(b4.step==='review'){chips=`<button class="chip cta" data-a="c0UseSugg">Dùng câu gợi ý</button><button class="chip" data-a="c0KeepMine">Giữ câu của tôi</button><button class="chip" data-a="c0DecEdit">Sửa lại</button>`;input=true;ph='Hoặc gõ lại câu của anh/chị…';}
 }else{
  const st=c5Cur(),q=st&&Q5[st];
  step=b5.ph==='done'?`${ic('check',14)} Đã xong`:b5.ph==='sum'?'Tổng hợp hồ sơ':st==='days'||st==='min'?'Lịch học':q?`Nhóm ${q.g}/7`:'';
  if(q&&!T.obTyping){chips=q.chips().map(([v,l])=>q.multi?`<button class="chip ${b5.multi.includes(v)?'on':''}" data-a="c5Toggle" data-v="${esc(v)}" aria-pressed="${b5.multi.includes(v)}">${esc(l)}</button>`:`<button class="chip" data-a="c5Chip" data-v="${esc(v)}" data-l="${esc(l)}">${esc(l)}</button>`).join('')+(q.multi?`<button class="chip cta" data-a="c5Done" ${b5.multi.length?'':'disabled'}>Xong${b5.multi.length?` (${b5.multi.length})`:''}</button>`:'');input=true;ph=q.ph||'Hoặc gõ câu trả lời…';}
  if(b5.ph==='sum'){extra=`<div class="msg bot c0-summsg">${c0PartsHTML(true)}</div>`;if(!T.obTyping){chips=`<button class="chip cta" data-a="c0Confirm">${ic('check',14)} Xác nhận hồ sơ</button>`;input=true;ph='Hoặc nhắn cho em điều cần chỉnh…';}}
 }
 const sum=id==='C0-4'&&b4.step==='done'&&S.profile.decision30?`<div class="c0-done"><div class="c0-done-h"><b>Quyết định mục tiêu 30 ngày</b><button class="btn-link" data-a="c0DecEdit">Sửa</button></div><p class="c0-dec">${DEC_PREFIX} ${esc(S.profile.decision30)}.</p></div>`
  :id==='C0-5'&&b5.ph==='done'?`<div class="c0-done"><div class="c0-done-h"><b>Hồ sơ CEO & doanh nghiệp</b><span class="hint">Đã xác nhận · sửa được bất cứ lúc nào</span></div>${c0PartsHTML(true)}</div>`:'';
 return `<div class="c0-wrap">${content}<div class="ex card ob-ex"><div class="ex-h"><div><span class="t">Bài tập · Chương 0 · Bài ${t.i+1} · trò chuyện với Trợ lý lộ trình · khoảng ${t.min} phút</span><h2 class="h3">${esc(t.title)}</h2></div>${done?`<span class="pill ok">${ic('check',12)} Đã hoàn thành</span>`:''}</div>
  <div class="card chat ob-chat"><div class="chat-h"><span class="bot-av">${ic('bot')}</span><div><b>Trợ lý lộ trình</b><span>AI Support của khóa học</span></div><span class="step-count" aria-live="polite">${step}</span></div>
   <div class="chat-log" id="ob-log" role="log">${msgs.map(m=>`<div class="msg ${m.role}">${fmt(m.text)}</div>`).join('')}${extra}${T.obTyping?'<div class="msg bot typing">Đang soạn…</div>':''}</div>
   ${chips?`<div class="chips">${chips}</div>`:''}
   ${input?`<form class="chat-in" data-f="${id==='C0-4'?'c4Send':'c5Send'}"><input class="inp" id="ob-in" name="t" autocomplete="off" aria-label="Tin nhắn cho Trợ lý lộ trình" placeholder="${esc(ph)}"><button class="send" aria-label="Gửi tin nhắn">${ic('send')}</button></form>`:''}
  </div>${sum}</div></div>`;
}
/* ---------- Hỏi lại quyết định 30 ngày cuối Chương 1 → 6 (PLAN_Onboarding.md mục 2.4) ---------- */
const DEC_CH=['C1','C2','C3','C4','C5','C6'];
const chKeys=id=>planUnits().filter(x=>chOf(x)===id);
const chLastUnit=id=>{const ks=chKeys(id);return ks[ks.length-1];};
const chAllDone=id=>{const ks=chKeys(id);return ks.length>0&&ks.every(x=>S.done[x]);};
const decAnswered=id=>((S.profile&&S.profile.decHist)||[]).some(h=>h.ch===id);
// chương mới nhất đã học xong mà chưa trả lời (chỉ nhắc khi chương sau chưa xong, không nhắc dồn)
function decPending(){for(let i=DEC_CH.length-1;i>=0;i--){const c=DEC_CH[i];if(chAllDone(c))return decAnswered(c)?null:c;}return null;}
const DEC_ACT={keep:'Giữ nguyên',edit:'Điều chỉnh',note:'Ghi lại suy nghĩ'};
const decHistHTML=()=>{const h=(S.profile.decHist||[]);return h.length?`<ol class="dec-hist">${h.map(x=>`<li><b>${x.ch==='C0'?'Chương 0':esc(chLabel(L[x.ch]))}</b><span>${DEC_ACT[x.act]||''}${x.act==='edit'?`: "${esc(x.after)}"`:x.note?`: ${esc(x.note)}`:''}</span><small>${esc(x.at||'')}</small></li>`).join('')}</ol>`:'';};
function decCard(ch){const p=S.profile,x=L[ch],m=(T.decMode||{})[ch];
 const head=`<div class="dec-h"><span class="bot-av">${ic('bot',16)}</span><div><b>Trợ lý AI</b><small>AI Support của khóa học</small></div><button class="btn-link" data-a="decLater" data-v="${ch}">Để sau</button></div>`;
 if(!p.decision30)return `<section class="card dec-card" id="dec-${ch}">${head}<p>Anh/chị vừa học xong <b>${esc(chLabel(x))}: ${esc(x.title)}</b>. Anh/chị chưa có quyết định mục tiêu 30 ngày, viết luôn bây giờ nhé:</p><form class="c0-form" data-f="decSave" data-ch="${ch}" data-m="new" novalidate><label class="c0-row"><span class="c0-lab dec-pre">${DEC_PREFIX}…</span><textarea class="inp" name="t" rows="2"></textarea></label><div class="c0-acts"><button class="btn btn-primary btn-sm">Lưu quyết định</button></div></form></section>`;
 return `<section class="card dec-card" id="dec-${ch}">${head}<p>Anh/chị vừa học xong <b>${esc(chLabel(x))}: ${esc(x.title)}</b>. Quyết định anh/chị đang theo đuổi:</p><blockquote>${DEC_PREFIX} ${esc(p.decision30)}.</blockquote><p>Những gì vừa học có làm anh/chị nhìn quyết định này khác đi không?</p>
  ${m==='edit'?`<form class="c0-form" data-f="decSave" data-ch="${ch}" data-m="edit" novalidate><label class="c0-row"><span class="c0-lab dec-pre">${DEC_PREFIX}…</span><textarea class="inp" name="t" rows="2">${esc(p.decision30)}</textarea></label><div class="c0-acts"><button type="button" class="btn btn-ghost btn-sm" data-a="decMode" data-v="${ch}" data-k="">Hủy</button><button class="btn btn-primary btn-sm">Lưu quyết định mới</button></div></form>`
  :m==='note'?`<form class="c0-form" data-f="decSave" data-ch="${ch}" data-m="note" novalidate><label class="c0-row"><span class="c0-lab">Suy nghĩ của anh/chị sau chương này</span><textarea class="inp" name="t" rows="2" placeholder="Ví dụ: dữ liệu bán hàng chưa sẵn sàng, cần chuẩn bị trước"></textarea></label><div class="c0-acts"><button type="button" class="btn btn-ghost btn-sm" data-a="decMode" data-v="${ch}" data-k="">Hủy</button><button class="btn btn-primary btn-sm">Lưu ghi chú</button></div></form>`
  :`<div class="c0-acts dec-acts"><button class="btn btn-line btn-sm" data-a="decKeep" data-v="${ch}">${ic('check',14)} Vẫn giữ nguyên</button><button class="btn btn-line btn-sm" data-a="decMode" data-v="${ch}" data-k="edit">Điều chỉnh quyết định</button><button class="btn btn-line btn-sm" data-a="decMode" data-v="${ch}" data-k="note">Ghi lại suy nghĩ</button></div>`}</section>`;}
// trên trang bài học: thẻ cuối chương (bài cuối Chương 1–6) + nhắc lại quyết định ở đầu Chương Kết
function lessonDecHTML(k,ch,u){
 if(DEC_CH.includes(ch.id)&&k===chLastUnit(ch.id)&&chAllDone(ch.id)&&!decAnswered(ch.id)&&!((S.decLater||{})[ch.id]))return decCard(ch.id);
 if(ch.id==='CK'&&u.b&&u.b.i===0&&S.profile.decision30)return `<section class="card dec-card dec-recap"><div class="dec-h"><span class="bot-av">${ic('flag',16)}</span><div><b>Quyết định anh/chị mang theo suốt chương trình</b><small>Dùng khi chọn cơ hội ưu tiên ở chương này</small></div></div><blockquote>${DEC_PREFIX} ${esc(S.profile.decision30)}.</blockquote>${decHistHTML()}</section>`;
 return '';}
/* ---------- thanh điều khiển video (mô phỏng)/* ---------- thanh điều khiển video (mô phỏng): âm lượng, cài đặt, cửa sổ riêng, toàn màn hình ----------
   thao tác sửa DOM trực tiếp (vpSync), không render() lại, để không bị thoát toàn màn hình */
const VP_OPTS={speed:{label:'Tốc độ phát',opts:[[0.5,'0,5×'],[0.75,'0,75×'],[1,'Bình thường'],[1.25,'1,25×'],[1.5,'1,5×'],[2,'2×']]},
 quality:{label:'Chất lượng',opts:[['auto','Tự động'],['1080','1080p'],['720','720p'],['480','480p']]},
 cc:{label:'Phụ đề',opts:[[false,'Tắt'],[true,'Tiếng Việt']]}};
const vpVolIc=()=>T.vp.muted||!T.vp.vol?'mute':'vol';
const vpControls=()=>{const v=T.vp,vol=v.muted?0:v.vol,fs=!!document.fullscreenElement;return `<div class="vp-ctl">
 <button class="vp-b" data-a="vpMute" aria-label="${v.muted?'Bật tiếng':'Tắt tiếng'}" title="${v.muted?'Bật tiếng':'Tắt tiếng'}">${ic(vpVolIc(),19)}</button>
 <input class="vp-vol" type="range" min="0" max="100" step="5" value="${vol}" style="--v:${vol}%" aria-label="Âm lượng" aria-valuetext="Âm lượng ${vol}%">
 <button class="vp-b" data-a="vpMenu" aria-label="Cài đặt video" title="Cài đặt" aria-haspopup="true" aria-expanded="false">${ic('gear',19)}</button>
 <button class="vp-b" data-a="vpPop" aria-label="Mở video ở cửa sổ riêng" title="Mở ở cửa sổ riêng">${ic('popout',19)}</button>
 <button class="vp-b" data-a="vpFull" aria-label="${fs?'Thoát toàn màn hình':'Toàn màn hình'}" title="${fs?'Thoát toàn màn hình':'Toàn màn hình'}">${ic(fs?'fullx':'full',19)}</button></div>`;};
const vpMenu=()=>`<div class="vp-menu" role="menu" aria-label="Cài đặt video" hidden>${Object.entries(VP_OPTS).map(([k,g])=>`<div class="vp-g"><small>${g.label}</small><div>${g.opts.map(([val,l])=>`<button role="menuitemradio" aria-checked="${T.vp[k]===val}" data-a="vpSet" data-k="${k}" data-v="${val}">${l}</button>`).join('')}</div></div>`).join('')}</div>`;
function lesson(){
 const P={lessons:lessons()};
 const all=planUnits();let k=S.unit;
 if(!k||!all.includes(k))k=(P.lessons[S.lesson]||[]).find(x=>!S.done[x])||(P.lessons[S.lesson]||[])[0]||curUnit()||all[0];
 if(!unitOpen(k))k=curUnit()||all[0];
 if(paidLock(k))k=curUnitC0(); // chưa mua: chỉ mở được Chương 0
 S.unit=k;S.lesson=lessonOfUnit(k);
 const u=U(k),b=u.b,li=S.lesson,isEx=u.kind==='exercise',ch=L[chOf(k)],pos=all.indexOf(k),prev=all[pos-1],next=all[pos+1];
 const dks=P.lessons[li],ddn=dks.filter(x=>S.done[x]).length,needArt=isEx&&!S.subs[u.id],back=lessonBack();
 const vt=unitTitle(u),lab=unitLabel(u);
 const player=isEx||u.kind==='text'?'':`<div class="player" data-title="${esc(vt)}" data-label="${esc(lab)}"><div class="center"><button class="play" data-a="playUnit" aria-label="Phát video">${ic('play',26)}</button><span class="t">${esc(lab)}</span><h2>${esc(vt)}</h2></div><div class="bottom"><span>${S.done[k]?'Đã xem':'0:00'}</span><span class="track"><i style="width:${S.done[k]?100:0}%"></i></span><span class="tnum">${u.m}:00</span><span class="vp-speed" ${T.vp.speed===1?'hidden':''}>${String(T.vp.speed).replace('.',',')}×</span>${vpControls()}</div>${vpMenu()}${T.vp.cc?`<p class="vp-cc">${esc(vt)}</p>`:''}</div>`;
 // cột phải: các bài của chương đang học
 const cks=all.filter(x=>chOf(x)===ch.id),cdn=cks.filter(x=>S.done[x]).length;
 const urow=x=>{const v=U(x),st=unitState(x),lock=st==='locked'||st==='paid';return `<button class="${x===k?'on':''} ${S.done[x]?'done':''} ${lock?'locked':''}" ${lock?`disabled title="${esc(unitLockMsg(x))}"`:`data-a="openUnit" data-v="${x}"`}>${lock?`<span class="st">${ic('lock',12)}</span>`:v.kind==='exercise'?`<span class="st" title="${S.done[x]?'Bài tập hoàn thành khi đã nộp bài':'Nộp bài tập để hoàn thành'}">${ic('check',12)}</span>`:`<span class="st st-tick" role="button" tabindex="0" data-a="unitTick" data-v="${x}" title="${S.done[x]?'Bỏ đánh dấu hoàn thành':'Đánh dấu hoàn thành'}" aria-label="${S.done[x]?'Bỏ đánh dấu hoàn thành':'Đánh dấu hoàn thành'}: ${esc(unitTitle(v))}">${ic('check',12)}</span>`}<span><small class="u-meta"><span class="cl-ty ${v.kind==='exercise'?'isx':v.kind==='text'?'ist':''}">${ic(unitIcon(v),12)} ${unitType(v)}</span><span aria-hidden="true">·</span><span>${v.m} phút</span></small><b>${esc(unitTitle(v))}</b></span></button>`;};
 const list=`<div class="ulist">${cks.map(urow).join('')}</div>`;
 const nextOpen=next&&unitOpen(next)&&!paidLock(next);
 const c0End=ch.id==='C0'&&(!next||chOf(next)!=='C0'); // bài cuối Chương 0 → sang trang Lộ trình
 const nextBtn=needArt?(OB_SEG[u.id]?`<p class="hint">Trả lời Trợ lý lộ trình ở trên để hoàn thành bài này.</p>`:''):
  `<button class="btn btn-primary btn-lg" data-a="markNext">${c0End?'Xem lộ trình của anh/chị':!next?(S.done[k]?'Xem kết quả hoàn thành':'Hoàn thành khóa học'):S.done[k]?'Bài tiếp theo':isEx?'Tiếp tục · Bài tiếp theo':'Hoàn thành & Tiếp tục'} ${ic('arrow')}</button>`;
 const lTop=`<div class="lsn-top"><button class="btn btn-line btn-sm" data-a="${back.a}">${ic('back',15)} ${back.t}</button>
  <div class="crumbs">${S.enrolled?`<button data-a="go" data-to="mycourses">Khóa học của tôi</button>`:`<button data-a="go" data-to="home">Trang chủ</button>`}<span>/</span><button data-a="backToList">AI for CEO</button><span>/</span>${S.from==='outputs'?`<button data-a="backToOutputs">Bài tập của tôi</button><span>/</span>`:''}<span>${esc(lab)}</span></div></div>`,lHead=`<div style="display:grid;gap:12px;margin-bottom:24px"><div class="meta"><span class="ty-ch">${esc(chLabel(ch))}: ${esc(ch.title)}</span><span class="ty">${u.b?`Bài ${u.b.i+1}`:esc(lab)}/${ch.items.length}</span><span class="ls-type ${isEx?'isx':u.kind==='text'?'ist':''}">${ic(unitIcon(u),14)} ${unitType(u)}</span><span>${ic('clock',14)} ${u.m} phút</span></div><h1>${esc(vt)}</h1>${!S.enrolled&&ch.id==='C0'?`<p class="c0-free">${ic('spark',14)} <b>Chương 0 miễn phí</b> · ${cks.length} bài · khoảng ${cks.reduce((s,x)=>s+U(x).m,0)} phút</p>`:''}</div>`,lMain=`<div style="display:grid;gap:24px">${player}${unitContent(u)}<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${nextBtn}</div>${lessonDecHTML(k,ch,u)}</div>`,lNav=`<div style="display:flex;justify-content:space-between;gap:8px">${prev?`<button class="btn btn-ghost btn-sm" data-a="openUnit" data-v="${prev}">${ic('back',15)} Bài trước</button>`:'<span></span>'}${next?(nextOpen?`<button class="btn btn-ghost btn-sm" data-a="openUnit" data-v="${next}">Bài tiếp theo ${ic('arrow',15)}</button>`:`<button class="btn btn-ghost btn-sm" disabled title="${esc(unitLockMsg(next))}">${ic('lock',14)} Bài tiếp theo</button>`):''}</div>
   ${next&&!nextOpen&&!c0End?`<p class="hint">${ic('lock',13)} Bài tiếp theo thuộc ${esc(chLabel(L[chOf(next)]))}, mở sau khi anh/chị học xong ${esc(chLabel(ch))}.</p>`:''}`;
 if(!S.enrolled)return `<section class="wrap page lesson">\n ${lTop}${lHead}<div class="lsn">${lMain}<aside class="sticky" style="display:grid;gap:14px"><div><small class="hint">${esc(chLabel(ch))}</small><b style="font-size:15px;display:block">${esc(ch.title)}</b><p class="hint">${cdn}/${cks.length} bài đã hoàn thành</p></div>${list}${lNav}</aside></div></section>`;
 const cur=chOf(k);
 const curri=`<section class="pl-cur" aria-labelledby="pl-cur-h"><div class="pl-cur-h"><h2 id="pl-cur-h">Nội dung khóa học</h2><span class="tnum">${all.filter(x=>S.done[x]).length}/${all.length} bài</span></div>${planChs().map(id=>{const ks=all.filter(x=>chOf(x)===id),dn=ks.filter(x=>S.done[x]).length;return `<details class="pl-ch${dn===ks.length?' done':''}${id===cur?' cur':''}"${id===cur?' open':''}><summary><span class="pl-ch-t"><b>${esc(chLabel(L[id]))}: ${esc(L[id].title)}</b><small class="tnum">${dn}/${ks.length} bài · ${ks.reduce((t,x)=>t+U(x).m,0)} phút</small></span><span class="pl-chev" aria-hidden="true">${ic('chev',16)}</span></summary><div class="ulist">${ks.map(urow).join('')}</div></details>`;}).join('')}</section>`;
 return `<section class="wrap page lx-page pl-page lesson">${courseBand('','div')}<div class="pl-grid"><div class="pl-main">${lHead}${lMain}<div class="pl-nav">${lNav}</div></div><aside class="pl-side">${curri}</aside></div></section>`;
}

/* ---------- 8. Bài tập của tôi ---------- */
function outputs(){
 const ids=Object.keys(TASKS),n=subsCount(),N=ids.length,f=T.exF||'all';
 const info=id=>{const t=TASKS[id],k='E:'+id,s=S.subs[id],fb=s&&s.feedback,ch=chOf(k),open=!!s||unitOpen(k);
  return {id,t,k,s,fb,open,c0:ch==='C0',where:`${chLabel(L[id])}: ${L[id].title}`,lock:open?'':capVi(chLockText(ch))};};
 const all=ids.map(info),todo=all.filter(x=>!x.s),done=all.filter(x=>x.s);
 const list=f==='todo'?todo:f==='done'?done:all;
 // khối "Bài tập tiếp theo": một việc chính của trang
 const nx=todo[0];
 const next=nx?`<section class="exl-next" aria-labelledby="exl-next-t"><div class="exl-next-b"><span class="exl-eye">Bài tập tiếp theo</span><h3 id="exl-next-t">${esc(nx.t.title)}</h3>
   <p class="exl-next-m"><span>${esc(nx.where)}</span><span>Khoảng ${nx.t.min} phút</span><span>Cần nộp: ${esc(submitLabel(nx.t).main.toLowerCase())}</span></p>${nx.open?'':`<p class="exl-next-l">${ic('lock',14)} ${esc(nx.lock)}.</p>`}</div>
   ${nx.open?`<button class="btn btn-primary" data-a="openEx" data-v="${nx.id}">Làm bài tập ${ic('arrow',16)}</button>`:`<button class="btn btn-primary" data-a="openUnit" data-v="${curUnit()}">Tiếp tục học ${ic('arrow',16)}</button>`}</section>`
  :`<section class="exl-next is-done"><div class="exl-next-b"><span class="exl-eye">Hoàn thành</span><h3>Anh/chị đã nộp đủ ${N} bài tập</h3><p class="exl-next-m"><span>Xem lại bài làm và nhận xét bất cứ lúc nào.</span></p></div><button class="btn btn-line" data-a="go" data-to="complete">Xem chứng nhận</button></section>`;
 const tab=(v,l,c)=>`<button class="exl-tab${f===v?' on':''}" data-a="exF" data-v="${v}" aria-pressed="${f===v}">${l} <span>${c}</span></button>`;
 const st=x=>x.s?`<span class="exl-pill ok">Đã nộp</span>`:x.open?`<span class="exl-pill wait">Chưa nộp</span>`:`<span class="exl-pill off" title="${esc(x.lock)}">${ic('lock',12)} Chưa mở</span>`;
 const grade=x=>{if(!x.s)return '<span class="exl-na">—</span>';if(x.c0)return '<span class="exl-na">Không chấm điểm</span>';
  if(!x.fb||x.fb.score==null)return '<span class="exl-na">Đang chấm…</span>';
  return `<span class="exl-score ${x.fb.pass?'pass':'fix'}"><b>${exScore(x.fb.score)}</b>/10 · ${x.fb.pass?'Đạt':'Chưa đạt'}</span>`;};
 const when=x=>x.s?`<span class="exl-at">${esc(String(x.s.at).split(' ').pop())}${x.s.v>1?` · lần ${x.s.v}`:''}</span>`:'<span class="exl-na">—</span>';
 const act=x=>x.s?`<button class="btn btn-line btn-sm" data-a="openEx" data-v="${x.id}">Xem bài làm</button>`:x.open?`<button class="btn btn-line btn-sm" data-a="openEx" data-v="${x.id}">Làm bài</button>`:'';
 const row=(x,i)=>`<li class="exl-row${x.open?'':' locked'}">
   <span class="exl-no${x.s?' done':''}" aria-hidden="true">${ids.indexOf(x.id)+1}</span>
   <div class="exl-t"><small>${esc(x.where)}</small><b>${esc(x.t.title)}</b></div>
   <div class="exl-c" data-l="Trạng thái">${st(x)}</div><div class="exl-c" data-l="Nhận xét AI">${grade(x)}</div><div class="exl-c" data-l="Ngày nộp">${when(x)}</div><div class="exl-a">${act(x)}</div></li>`;
 return `<section class="wrap page exl">
 <div class="lsn-top"><button class="btn btn-line btn-sm" data-a="outputsBack">${ic('back',15)} Danh sách bài học</button>
  <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="outputsBack">AI for CEO</button><span>/</span><span>Bài tập của tôi</span></div></div>
 <header class="exl-hd"><div><h2>Bài tập của anh/chị</h2><p>${N} bài tập áp dụng cho chính doanh nghiệp của anh/chị. AI nhận xét ngay sau khi nộp.</p></div>
  <div class="exl-prog" role="img" aria-label="Đã nộp ${n} trên ${N} bài tập"><span><b>${n}/${N}</b> đã nộp</span><i><i style="width:${Math.round(n/N*100)}%"></i></i></div></header>
 ${next}
 <div class="exl-bar"><div class="exl-tabs" role="group" aria-label="Lọc bài tập">${tab('all','Tất cả',N)}${tab('todo','Chưa nộp',todo.length)}${tab('done','Đã nộp',done.length)}</div></div>
 ${list.length?`<div class="exl-list"><div class="exl-head" aria-hidden="true"><span></span><span>Bài tập</span><span>Trạng thái</span><span>Nhận xét AI</span><span>Ngày nộp</span><span></span></div><ul>${list.map(row).join('')}</ul></div>`
  :`<p class="exl-empty">${f==='done'?'Anh/chị chưa nộp bài tập nào.':'Anh/chị đã nộp đủ bài tập.'}</p>`}
 </section>`;
}

/* ---------- Góp ý sau khóa học (đề xuất mới) ---------- */
// Hiện ở trang Hoàn thành khi đã đủ điều kiện. Chưa gửi / đang sửa → form; đã gửi → bản tóm tắt
const starsView=(n,size=16)=>`<span class="stars-view" aria-label="${n} trên 5 sao">${[1,2,3,4,5].map(i=>`<i class="${i<=Math.round(n)?'on':''}">${ic('star',size)}</i>`).join('')}</span>`;
function feedbackSection(){
 const f=S.feedback;
 if(f&&!T.fbEdit){
  const avg=FEEDBACK_ASPECTS.reduce((s,a)=>s+f.ratings[a.k],0)/FEEDBACK_ASPECTS.length;
  return `<section class="card pad cfb" id="feedback"><div class="fb-head"><div><span class="eyebrow">Góp ý của anh/chị</span><h2 class="h3">Cảm ơn anh/chị đã góp ý cho khóa học</h2><p class="hint">Gửi lúc ${esc(f.at)}. Học viện dùng góp ý này để cải thiện nội dung và dịch vụ cho các khóa sau.</p></div>
   <div class="fb-avg"><div><b>${avg.toFixed(1).replace('.',',')}</b><span>/5</span></div>${starsView(avg,18)}</div></div>
   <div class="fb-sum">${FEEDBACK_ASPECTS.map(a=>`<div class="fb-row"><span class="k">${esc(a.label)}</span>${starsView(f.ratings[a.k])}<span class="v">${STAR_LABEL[f.ratings[a.k]]}</span>${(f.tags[a.k]||[]).length?`<span class="fb-chips">${f.tags[a.k].map(t=>`<span class="pill">${esc(t)}</span>`).join('')}</span>`:''}</div>`).join('')}
    <div class="fb-row"><span class="k">Khả năng giới thiệu cho CEO khác</span><b class="tnum">${f.nps}/10</b></div></div>
   ${f.good?`<div class="fb-quote"><span class="t">Điều anh/chị thấy giá trị nhất</span><p>${fmt(f.good)}</p></div>`:''}
   ${f.improve?`<div class="fb-quote"><span class="t">Học viện nên cải thiện</span><p>${fmt(f.improve)}</p></div>`:''}
   <div class="form-foot"><span class="hint">${f.quote?`${ic('check',13)} Đồng ý công khai tên`:'Gửi ẩn danh'}</span><button class="btn btn-line btn-sm" data-a="fbEdit">Sửa góp ý</button></div></section>`;
 }
 const v=T.fbDraft||f||{ratings:{},tags:{}},miss=(T.err.fbMiss||[]);
 const q=a=>{const r=v.ratings[a.k]||0,tg=v.tags[a.k]||[];
  return `<fieldset class="fb-q ${miss.includes(a.k)?'bad':''}" id="fbq-${a.k}" tabindex="-1"><legend><b>${esc(a.label)}</b><span class="hint">${esc(a.hint)}</span></legend>
   <div class="fb-rate"><div class="stars">${[5,4,3,2,1].map(n=>`<input type="radio" id="r-${a.k}-${n}" name="r_${a.k}" value="${n}" ${r===n?'checked':''}><label for="r-${a.k}-${n}" title="${STAR_LABEL[n]}"><span class="sr">${n} sao: ${STAR_LABEL[n]}</span>${ic('star',26)}</label>`).join('')}</div>
    <span class="star-txt" data-for="r_${a.k}">${r?STAR_LABEL[r]:'Chưa chấm điểm'}</span></div>
   </fieldset>`;};
 const nps=v.nps;
 return `<section class="card pad cfb" id="feedback"><form data-f="fbSubmit" novalidate>
  <div class="fb-head"><div><span class="eyebrow">Góp ý về khóa học</span><h2 class="h3">Anh/chị đánh giá khóa AI for CEO thế nào?</h2><p class="hint">Khoảng 2 phút.</p></div></div>
  ${FEEDBACK_ASPECTS.map(q).join('')}
  <fieldset class="fb-q ${miss.includes('nps')?'bad':''}" id="fbq-nps" tabindex="-1"><legend><b>Anh/chị có sẵn lòng giới thiệu khóa học cho một CEO khác không?</b><span class="hint">0 = chắc chắn không, 10 = chắc chắn có</span></legend>
   <div class="nps">${[...Array(11)].map((_,n)=>`<input type="radio" id="nps-${n}" name="nps" value="${n}" ${nps===n?'checked':''}><label for="nps-${n}">${n}</label>`).join('')}</div>
   <div class="nps-ends"><span>Chắc chắn không</span><span>Chắc chắn có</span></div></fieldset>
  <div class="row2"><div class="field"><label for="fb-good">Điều anh/chị thấy giá trị nhất (không bắt buộc)</label><textarea class="inp" id="fb-good" name="good" rows="3" placeholder="Ví dụ: phần demo Agent giúp tôi hình dung được việc tự động hóa báo cáo…">${esc(v.good||'')}</textarea></div>
   <div class="field"><label for="fb-improve">Học viện nên cải thiện điều gì (không bắt buộc)</label><textarea class="inp" id="fb-improve" name="improve" rows="3" placeholder="Nội dung, hệ thống, hỗ trợ… điều gì làm anh/chị chưa hài lòng?">${esc(v.improve||'')}</textarea></div></div>
  <label class="opt" for="fb-quote" style="justify-self:start"><input type="checkbox" id="fb-quote" name="quote" ${v.quote?'checked':''}><span>Đồng ý công khai tên tôi cùng góp ý này</span></label>
  ${T.err.fb?`<p class="err">${esc(T.err.fb)}</p>`:''}
  <div class="form-foot"><span class="hint">Không chọn thì góp ý được gửi ẩn danh.</span><div style="display:flex;gap:8px">${f?`<button type="button" class="btn btn-ghost" data-a="fbCancel">Hủy</button>`:''}<button class="btn btn-primary">${ic('send',15)} ${f?'Cập nhật góp ý':'Gửi góp ý'}</button></div></div>
 </form></section>`;
}

/* ---------- 9. Hoàn thành ---------- */
function complete(){
 const st=planStats();
 const checks=[[`Hoàn thành ${st.units} bài học`,`${st.unitsDone}/${st.units}`,st.unitsDone===st.units],[`Nộp ${Object.keys(TASKS).length} bài tập`,`${subsCount()}/${Object.keys(TASKS).length}`,subsCount()===Object.keys(TASKS).length]];
 const ok=checks.every(c=>c[2]);if(ok&&!S.completedAt){S.completedAt=today();save();}
 const missing=planUnits().filter(k=>!S.done[k]);
 const head=`<div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="go" data-to="learn">AI for CEO</button><span>/</span><span>Hoàn thành chương trình</span></div>`;
 const checkCard=`<article class="card pad"><h3 class="h3" style="margin-bottom:8px">Điều kiện hoàn thành</h3><ul class="checks">${checks.map(([l,v,d])=>`<li><span class="st ${d?'ok':'no'}">${ic(d?'check':'x',12)}</span><span>${l}</span><b class="tnum">${v}</b></li>`).join('')}</ul></article>`;
 if(!ok)return `<section class="wrap narrow page">${head}<div class="page-head"><span class="eyebrow">Hoàn thành</span><h2 class="h2">Anh/chị còn thiếu một vài bước</h2><p class="sub">Học hết các bài và nộp đủ bài tập để nhận certificate.</p></div><div style="display:grid;gap:18px">${checkCard}
  ${missing.length?`<article class="card pad"><h3 class="h3" style="margin-bottom:12px">Bài học chưa xong (${missing.length})</h3><ul class="promise">${missing.slice(0,8).map(k=>unitOpen(k)?`<li>${ic('arrow')}<button class="btn-link" style="text-align:left" data-a="openUnit" data-v="${k}">${esc(unitLabel(U(k)))}: ${esc(unitTitle(U(k)))}</button></li>`:`<li class="muted">${ic('lock')}<span>${esc(unitLabel(U(k)))}: ${esc(unitTitle(U(k)))}</span></li>`).join('')}${missing.length>8?`<li class="muted"><span>… và ${missing.length-8} bài khác</span></li>`:''}</ul></article>`:''}
  <div><button class="btn btn-primary btn-lg" data-a="go" data-to="learn">Tiếp tục học ${ic('arrow')}</button></div></div></section>`;
 const p=S.profile;const uc=S.subs[UC_TASK]||{};
 return `<section class="wrap page">${head}
 <div class="cert-wrap"><canvas id="cert-cv" width="2000" height="1414" role="img" aria-label="Chứng nhận hoàn thành AI for CEO của ${esc(p.name||'')}, mã ${certCode()}"></canvas>
  <div class="cert-act"><button class="btn btn-primary" data-a="certDownload">${ic('download',16)} Tải chứng nhận (PNG)</button><button class="btn btn-line" data-a="certPrint">${ic('file',16)} In / Lưu PDF</button><button class="btn dh-btn-fb solid" data-a="certShare">${ic('fb',16)} Chia sẻ lên Facebook</button><span class="hint">Mã chứng nhận ${certCode()} · cấp ngày ${esc(certDate())}</span></div></div>
 <div style="margin-top:24px">${feedbackSection()}</div>
 <div class="grid g2" style="margin-top:24px;align-items:start">
  <article class="card pad"><h3 class="h3" style="margin-bottom:12px">3 cơ hội AI ưu tiên anh/chị chọn</h3>${uc.text?`<div class="ex-text">${fmt(uc.text)}</div>`:''}${(uc.files||[]).length?`<ul class="ex-files">${uc.files.map(f=>`<li>${exFileLink(f)}</li>`).join('')}</ul>`:''}
   <div class="kv" style="margin-top:16px"><div><span>Bài học</span><b class="tnum">${st.unitsDone}/${st.units}</b></div><div><span>Bài tập đã nộp</span><b class="tnum">${subsCount()}/${Object.keys(TASKS).length}</b></div><div><span>Thời gian học</span><b class="tnum">${dashStats().studyDays} ngày</b></div></div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn btn-line btn-sm" data-a="go" data-to="outputs">${ic('write',15)} Xem bộ bài tập</button><button class="btn btn-line btn-sm" data-a="go" data-to="dashboard">${ic('map',15)} Xem bản đồ hành trình</button></div></article>
  <div style="display:grid;gap:16px">${checkCard}
   ${(()=>{const e=upcomingEvents().find(x=>x.k==='live');return e?`<article class="card pad event"><span class="tag">Live Zoom tiếp theo</span><h3>${esc(e.title)}</h3><p>${esc(evWhen(e))}. Học viên đã hoàn thành vẫn tham gia các buổi cập nhật hằng tháng.</p><div>${evBtn(e)}</div></article>`:'';})()}</div>
 </div>
 <div class="bigq" style="margin-top:24px"><span>Câu hỏi mở cho chặng tiếp theo</span><p>"Nếu AI đã có những năng lực này, doanh nghiệp của tôi nên được thiết kế lại như thế nào?"</p></div>
 <div style="margin-top:24px">${secHead('Khi anh/chị sẵn sàng','Hành trình tiếp theo trong hệ sinh thái','Không bắt buộc. Mỗi bước giúp đi từ "hiểu" sang "áp dụng".')}
  <div class="eco">${[['Academy','Hiểu AI đang làm được gì',true],['CEO Self-reflection','Doanh nghiệp mình có cơ hội ở đâu?'],['DX Check-up / Blueprint','Map doanh nghiệp, xác định bài toán và ưu tiên'],['BlueBolt Software','Thiết kế, triển khai hệ thống AI và automation']].map(([t,d,h])=>`<div class="${h?'here':''}"><b>${t}${h?' · Anh/chị đang ở đây':''}</b><p>${d}</p></div>`).join('')}</div></div>
 <div class="grid g2" style="margin-top:16px"><article class="card pad" style="display:grid;gap:10px;align-content:start"><h3 class="h3">CEO AI Community</h3><p class="muted">Trao đổi use case, case study và kinh nghiệm với các CEO khác.</p><div><button class="btn btn-line" data-a="openCommunity" data-v="aiceo">${ic('users',16)} Vào cộng đồng</button></div></article>
 <article class="card pad" style="display:grid;gap:10px;align-content:start"><h3 class="h3">Offline Executive Briefing</h3><p class="muted">Xem demo live và thảo luận 3 use case của anh/chị cùng chuyên gia.</p>${(()=>{const e=upcomingEvents().find(x=>x.k==='offline');return e?`<p class="hint">${esc(evWhen(e))}</p><div>${evBtn(e,'')}</div>`:'<p class="hint">Chưa có lịch buổi tiếp theo.</p>';})()}</article></div>
 </section>`;
}

/* ---------- đăng ký màn hình ---------- */
/* ---------- Trang Khóa học (danh sách khóa học của Học viện, đề xuất mới theo yêu cầu user 10/2026) ----------
   Hiện có 1 khóa: AI for CEO, thẻ dọc trong lưới 3 thẻ/hàng (ảnh bìa 16:9). Thêm khóa sau này: thêm thẻ
   vào lưới crs-grid. Nội dung thẻ lấy từ dữ liệu sẵn có (COURSE, trang giới thiệu), không thêm cam kết mới. */
/* courses() mới: xem courseCard / aiFeatCard bên dưới */
// lưới thẻ khóa học: AI for CEO + các khóa minh họa
/* ---------- Trang Chi tiết khóa học (PLAN_Chi tiet Khoa hoc.md, 22/10/2026) ----------
   Dùng lại giao diện sẵn có: đầu trang kiểu khối AI for CEO trang chủ, thẻ "Bản đồ cơ hội AI", lưới 10 năng lực, thẻ chương, thẻ mua giống trang Khóa học.
   Mọi khóa dùng chung 1 mẫu; khối nào chưa có dữ liệu thì ẩn (2 khóa minh họa chỉ có đầu trang + thẻ mua). */
const HAS_C0=typeof c0Started==='function'; // bản 1: onboarding = Chương 0 học thử; bản 2: onboarding cũ
function cdState(){ // nút theo trạng thái người xem (PLAN mục 5)
 const st=S.enrolled&&S.plan?planStats():null,learnTxt=st&&(st.unitsDone>0||subsCount()>0)?'Học tiếp':'Vào học';
 if(S.enrolled)return {main:`<button class="btn btn-primary btn-lg btn-block" data-a="openCourse">${learnTxt} ${ic('arrow')}</button>`,sub:'',note:`<p class="cd-own">${ic('check',15)} Anh/chị đã sở hữu khóa học này</p>`,price:false};
 const buy=l=>`<button class="btn btn-lg btn-block crs-buy" data-a="go" data-to="checkout">${ic('cart',18)} ${l}</button>`;
 if(HAS_C0){
  if(c0Done()&&S.plan)return {main:buy('ĐĂNG KÝ ĐỂ HỌC TIẾP'),sub:`<button class="btn btn-line btn-block" data-a="go" data-to="syllabus">Xem lộ trình của anh/chị</button>`,note:`<p class="cd-own">${ic('spark',15)} Lộ trình ${S.plan.lessons.length} ngày của anh/chị đã sẵn sàng</p>`,price:true};
  if(c0Started())return {main:buy('MUA KHÓA'),sub:`<button class="btn btn-line btn-block" data-a="trialStart">${ic('play',14)} HỌC THỬ MIỄN PHÍ</button>`,note:'',price:true};
  return {main:buy('MUA KHÓA'),sub:`<button class="btn btn-line btn-block" data-a="trialStart">${ic('play',14)} HỌC THỬ MIỄN PHÍ</button>`,note:'',price:true};}
 const obDone=S.ob&&S.ob.done;
 return {main:buy('MUA KHÓA'),sub:`<button class="btn btn-line btn-block" data-a="trialStart">${ic(obDone?'spark':'play',14)} ${obDone?'Xem lộ trình của anh/chị':'HỌC THỬ MIỄN PHÍ'}</button>`,note:'',price:true};}
function course(){
 const id=T.crsId==null?'aiceo':T.crsId,isAI=id==='aiceo',oc=isAI?null:OTHER_COURSES[+id];
 if(!isAI&&!oc){S.screen='courses';return courses();}
 const name=isAI?COURSE.name:oc.title,desc=isAI?COURSE.desc:(oc.desc||'Khóa học minh họa. Thông tin chi tiết sẽ được cập nhật.');
 const ocProg=!isAI&&S.loggedIn&&oc.demoOwned;
 const stt=isAI?cdState():ocProg?{main:`<button class="btn btn-primary btn-lg btn-block" data-a="crsDemo">${oc.demoDone?'Tiếp tục học':'Bắt đầu học'} ${ic('arrow')}</button>`,sub:'',note:`<p class="cd-own">${ic('check',15)} Anh/chị đã đăng ký khóa học này${oc.demoDone?` · ${oc.demoDone}/${oc.lessons} bài`:''}</p>`,price:false}
  :oc.free?{main:`<button class="btn btn-primary btn-lg btn-block" data-a="crsDemo">Bắt đầu học</button>`,sub:'',note:'',price:true}
  :oc.price!=null?{main:`<button class="btn btn-lg btn-block crs-buy" data-a="crsDemo">${ic('cart',18)} MUA KHÓA</button>`,sub:'',note:'',price:true}
  :{main:`<button class="btn btn-primary btn-lg btn-block" data-a="crsDemo">Nhận tư vấn</button>`,sub:'',note:'',price:false};
 const CI=COURSE_INFO,price=isAI?COURSE.price:oc.price;
 // ---- dải navy đầu trang ----
 const facts=isAI?[`${LIB.length} chương`,`${ALL_BAI.length} bài học`,`${CAP_MAP.length} năng lực AI`]:[((CRS_CATS.find(x=>x[0]===oc.cat)||[])[1]||'Khóa học'),`${oc.lessons} bài học`,oc.free?'Miễn phí':'Học online'];
 const hero=`<section class="cdx-hero"><svg class="cdx-net" viewBox="0 0 1400 360" preserveAspectRatio="none" aria-hidden="true"><g stroke="#9DB7E8" stroke-width="1" fill="none" opacity=".22"><path d="M700 40 960 90 1180 30 1400 80"/><path d="M960 90 1040 260 1260 220 1400 300"/><path d="M820 330 1040 260"/><path d="M1180 30 1260 220" stroke-dasharray="4 6"/></g><g fill="#7FA6E8" opacity=".55"><circle cx="700" cy="40" r="2.5"/><circle cx="960" cy="90" r="3"/><circle cx="1180" cy="30" r="2.5"/><circle cx="1260" cy="220" r="3"/><circle cx="820" cy="330" r="2.5"/></g><g fill="#FE9B0E" opacity=".8"><circle cx="1040" cy="260" r="3"/></g></svg>
  <nav class="cdx-crumbs" aria-label="Đường dẫn"><button data-a="go" data-to="courses">Khóa học</button><span aria-hidden="true">/</span><span>${esc(name)}</span></nav>
  ${isAI&&typeof OPEN_DATE!=='undefined'?`<p class="cdx-eyebrow">Khai giảng ${OPEN_DATE}</p>`:''}
  <h1>${esc(name)}</h1>
  <p class="cdx-lead">${esc(desc)}</p>
  ${isAI&&CI.trustReal?`<p class="cdx-trust" title="Số liệu minh họa"><span><span class="cdx-stars" role="img" aria-label="Đánh giá ${String(CI.rating).replace('.',',')} trên 5"><span style="width:${Math.round(CI.rating/5*100)}%">★★★★★</span>★★★★★</span> <b>${String(CI.rating).replace('.',',')}</b> (${CI.ratings.toLocaleString('vi-VN')} đánh giá)</span><span class="cdx-stu">${ic('users',17)}<b>${CI.students.toLocaleString('vi-VN')}</b> học viên</span></p>`:''}
  ${isAI?`<p class="cdx-meta"><span>Phát triển bởi <b>Học viện Siêu Tăng Trưởng</b></span><span>Cập nhật ${esc(CI.updated||'')}</span><span>Tiếng Việt</span></p>`:''}<ul class="cdx-facts">${facts.map(f=>`<li>${f}</li>`).join('')}</ul>
 </section>`;
 // ---- hộp mua (dính, chồng lên dải navy) ----
 const cover=isAI?(COURSE.cover?`<img src="${esc(COURSE.cover)}" alt="${esc(name)}">`:`<span class="cdx-ph"><b>AI for <em>CEO</em></b></span>`)
  :(oc.cover?`<img src="${esc(oc.cover)}" alt="${esc(name)}">`:`<span class="cdx-ph" style="background:${oc.bg}"><b>${oc.n}</b></span>`);
 const priceRow=stt.price?`<div class="cdx-price"><b class="tnum">${!isAI&&oc.free?'Miễn phí':money(price)}</b>${isAI?`<s class="tnum">${money(COURSE.list)}</s><span class="cdx-off">−${OFF}%</span>`:''}</div>`:'';
 const tel=String(ACADEMY.hotline).replace(/\D/g,'');
 const aside=`<aside class="cdx-aside"><div class="cdx-card">
  ${isAI?`<button class="cdx-cover cdx-cover-btn" data-a="${S.enrolled?'openCourse':'trialStart'}" aria-label="${S.enrolled?'Vào học':'Học thử Chương 0 miễn phí'}">${cover}<span class="cdx-play" aria-hidden="true"><span>${ic('play',20)}</span><b>${S.enrolled?'Vào học':'Học thử Chương 0'}</b></span></button>`:`<div class="cdx-cover">${cover}</div>`}
  <div class="cdx-card-b">${priceRow}${stt.note}<div class="cdx-btns">${stt.main}${stt.sub}</div>${isAI&&!S.enrolled&&!(HAS_C0&&c0Done()&&S.plan)?`<p class="cdx-assure">${ic('check',14)} Học thử Chương 0 trước, chưa cần thanh toán</p>`:''}
   ${isAI?`<div class="cdx-inc"><b>Khóa học bao gồm</b><ul>${CI.includes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
   <p class="cdx-small">${isAI?`Giá đã gồm VAT ${VAT_RATE}% · Xuất hóa đơn doanh nghiệp<br>`:''}Cần tư vấn: <a href="tel:${tel}">${esc(ACADEMY.hotline)}</a></p>
  </div></div></aside>`;
 const mbar=`<div class="cdx-mbar">${stt.price?`<div class="cdx-mbar-p"><b class="tnum">${!isAI&&oc.free?'Miễn phí':money(price)}</b>${isAI?`<s class="tnum">${money(COURSE.list)}</s>`:''}</div>`:''}<div class="cdx-mbar-b">${stt.main}</div></div>`;
 if(!isAI)return `<div class="cdx"><div class="cdx-grid">${hero}${aside}<div class="cdx-main"></div></div>${mbar}</div>`;
 // ---- "Anh/chị sẽ học được gì?" ----
 const learn=`<section class="cdx-sec"><div class="cdx-box"><h2>Anh/chị sẽ học được gì?</h2><ul class="cdx-learn">${CI.learn.map(x=>`<li><span class="cdx-tick" aria-hidden="true">${ic('check',14)}</span><span>${esc(x)}</span></li>`).join('')}</ul></div></section>`;
 // ---- đề cương: mỗi chương 1 thẻ, chương đầu mở; bài = loại · tên ----
 const open=T.cdOpen||(T.cdOpen=['C0']),all=open.length===LIB.length;
 const TY={video:['play','Video'],text:['file','Văn bản'],ex:['write','Bài tập']};
 const chs=LIB.map(x=>{const items=x.items||[],isOpen=open.includes(x.id);
  return `<section class="cdx-ch${isOpen?' open':''}">
   <button class="cdx-ch-h" data-a="cdCh" data-v="${x.id}" aria-expanded="${isOpen}"><span class="cdx-ch-t"><b>${esc(chLabel(x))}: ${esc(x.title)}</b></span><span class="cdx-ch-m">${items.length} bài</span><span class="cdx-chev" aria-hidden="true">${ic('chev',18)}</span></button>
   ${isOpen?`<ol class="cdx-ls">${items.map(b=>{const t=b.ex?'ex':b.text?'text':'video';return `<li class="cdx-l ${t}"><span class="cdx-l-ic" aria-hidden="true">${ic(TY[t][0],16)}</span><span class="cdx-l-t">${esc(b.t)}</span><span class="cdx-l-k">${TY[t][1]}</span></li>`;}).join('')}</ol>`:''}
  </section>`;}).join('');
 const content=`<section class="cdx-sec"><h2>Nội dung khóa học</h2><div class="cdx-sum"><span>${LIB.length} chương · ${ALL_BAI.length} bài</span><button class="cdx-link" data-a="cdAll" aria-pressed="${all}">${all?'Thu gọn tất cả':'Mở tất cả'}</button></div><div class="cdx-chs">${chs}</div></section>`;
 // ---- câu hỏi thường gặp ----
 const faq=`<section class="cdx-sec"><h2>Câu hỏi thường gặp</h2><div class="cdx-faq">${CI.faq.map(([q,a])=>`<details><summary><span>${esc(q)}</span><span class="cdx-chev" aria-hidden="true">${ic('chev',18)}</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
 return `<div class="cdx"><div class="cdx-grid">${hero}${aside}<div class="cdx-main">${learn}${content}${faq}</div></div>${mbar}</div>`;
}
// ---- Bộ lọc trang Khóa học (bản 1, 28/10/2026), tham khảo Udemy/Coursera: nhóm thu gọn được, ô tích chọn nhiều, số lượng theo bộ lọc khác,
//      dải "Đang lọc" có thể bỏ từng mục, sắp xếp; điện thoại: ngăn bộ lọc toàn màn hình + nút "Xem x khóa học" ----
const CRS_FG=[
 ['cat','Chủ đề',()=>CRS_CATS.map(([k,l])=>[k,l,x=>x.cat===k])],
 ['price','Học phí',()=>[['free','Miễn phí',x=>x.free],['paid','Có phí',x=>!x.free]]],
 ['own','Trạng thái',()=>S.loggedIn?[['own','Đã đăng ký',x=>x.own],['not','Chưa đăng ký',x=>!x.own]]:[]]];
const CRS_SORT=[['def','Mới nhất'],['priceAsc','Giá thấp đến cao'],['priceDesc','Giá cao đến thấp'],['lessons','Nhiều bài học nhất']];
function crsF(){if(!T.crsF)T.crsF={cat:[],price:[],len:[],own:[]};if(T.crsCat&&T.crsCat!=='all'){T.crsF.cat=[T.crsCat];}T.crsCat=null;return T.crsF;}
function courses(){
 const F=crsF(),sort=T.crsSort||'def',closed=T.crsFClosed||{};
 const all=[{ai:true,cat:'ceo',free:false,own:!!S.enrolled,n:ALL_BAI.length,p:COURSE.price},...(V2?[]:OTHER_COURSES).map((c,i)=>({c,i,cat:c.cat,free:!!c.free,own:!!(S.loggedIn&&c.demoOwned),n:c.lessons,p:c.free?0:(c.price||0)}))];
 const groups=CRS_FG.map(([k,t,fn])=>({k,t,opts:fn().filter(([v,,m])=>all.some(m)||F[k].includes(v))})).filter(g=>g.opts.length);
 const pass=(x,skip)=>groups.every(g=>g.k===skip||!F[g.k].length||g.opts.some(([v,,m])=>F[g.k].includes(v)&&m(x)));
 let list=all.filter(x=>pass(x));
 if(sort==='priceAsc')list=list.slice().sort((a,b)=>a.p-b.p);else if(sort==='priceDesc')list=list.slice().sort((a,b)=>b.p-a.p);else if(sort==='lessons')list=list.slice().sort((a,b)=>b.n-a.n);
 const nOn=groups.reduce((t,g)=>t+F[g.k].length,0);
 const sec=g=>{const open=!closed[g.k],sel=F[g.k].length;return `<section class="ckf-g"><h3><button class="ckf-gh" data-a="crsFSec" data-v="${g.k}" aria-expanded="${open}" aria-controls="ckf-${g.k}"><span>${g.t}${sel?`<span class="ckf-gn tnum">${sel}</span>`:''}</span><span class="ckf-chev" aria-hidden="true">${ic('chev',18)}</span></button></h3>
  <ul class="ckf-ul" id="ckf-${g.k}"${open?'':' hidden'}>${g.opts.map(([v,l,m])=>{const on=F[g.k].includes(v),n=all.filter(x=>pass(x,g.k)&&m(x)).length;
   return `<li><button class="ckf-o" role="checkbox" aria-checked="${on}" data-a="crsF" data-k="${g.k}" data-v="${v}"${!n&&!on?' aria-disabled="true"':''}><span class="ckf-box" aria-hidden="true">${ic('check',13)}</span><span class="ckf-l">${esc(l)}</span><span class="ckf-n tnum">${n}</span></button></li>`;}).join('')}</ul></section>`;};
 const side=`<aside class="ckf${T.crsFOpen?' open':''}" id="ckf" aria-label="Bộ lọc khóa học"${T.crsFOpen?' role="dialog" aria-modal="true"':''}>
  <div class="ckf-top"><h2>Bộ lọc</h2>${nOn?`<button class="ckf-clr" data-a="crsFReset">Xóa tất cả</button>`:''}<button class="ckf-close" data-a="crsFTg" aria-label="Đóng bộ lọc">${ic('x',20)}</button></div>
  <div class="ckf-body">${groups.map(sec).join('')}</div>
  <div class="ckf-foot"><button class="btn ck-btn ck-line" data-a="crsFReset"${nOn?'':' disabled'}>Xóa bộ lọc</button><button class="btn ck-btn ck-blue" data-a="crsFTg">Xem ${list.length} khóa học</button></div></aside>`;
 const label=(k,v)=>{const g=groups.find(g=>g.k===k),o=g&&g.opts.find(o=>o[0]===v);return o?o[1]:v;};
 const chips=nOn?`<div class="ckf-chips" aria-label="Bộ lọc đang chọn">${groups.flatMap(g=>F[g.k].map(v=>`<button class="ckf-chip" data-a="crsF" data-k="${g.k}" data-v="${v}" aria-label="Bỏ lọc ${esc(label(g.k,v))}">${esc(label(g.k,v))}${ic('x',14)}</button>`)).join('')}<button class="ckf-clr" data-a="crsFReset">Xóa tất cả</button></div>`:'';
 CK2=true;const cardsH=list.map(x=>x.ai?aiCard():courseCard(x.c,x.i)).join('');CK2=false;
 const grid=list.length?`<div class="ck-grid">${cardsH}</div>`
  :`<div class="ckf-empty"><b>Chưa có khóa học phù hợp</b><p>Thử bỏ bớt một vài bộ lọc.</p><button class="btn ck-btn ck-line" data-a="crsFReset">Xóa bộ lọc</button></div>`;
 return `<div class="ck-page ckf-page"><section class="ck-wrap">
  <header class="ck-head"><h1>Khóa học</h1><p>Các khóa học giúp doanh nghiệp ứng dụng AI vào thực tiễn, tối ưu quy trình vận hành, nâng cao năng suất và tạo ra giá trị tăng trưởng bền vững.</p></header>
  <div class="ckf-lay">${side}${T.crsFOpen?'<div class="ckf-ov" data-a="crsFTg" aria-hidden="true"></div>':''}<div class="ckf-main">
   <div class="ckf-bar"><button class="ckf-tg" data-a="crsFTg" aria-expanded="${!!T.crsFOpen}" aria-controls="ckf">${ic('filter',18)}<span>Bộ lọc</span>${nOn?`<span class="ckf-gn tnum">${nOn}</span>`:''}</button>
    <p class="ckf-res" aria-live="polite"><b class="tnum">${list.length}</b> khóa học</p>
    <label class="ckf-sort"><span>Sắp xếp</span><select id="crs-sort">${CRS_SORT.map(([v,l])=>`<option value="${v}"${v===sort?' selected':''}>${l}</option>`).join('')}</select></label></div>
   <h2 class="sr-only">Danh sách khóa học</h2>${grid}</div></div>
 </section></div>`;
}
// Thẻ trang Khóa học (bản 1, 28/10/2026, theo mẫu user): số bài có biểu tượng · đường kẻ · hàng giá (giá cam to · giá gạch · −%) · hàng nút (Học thử viền xanh + Mua khóa cam, rộng bằng nhau)
let CK2=false;
const ck2Try=act=>`<button class="btn ck-btn ck-out" ${act}><span class="ck-pc" aria-hidden="true">${ic('play',9)}</span> Học thử</button>`;
const ck2Foot=(top,btns)=>`<div class="ck-f ck-f2"><div class="ck-pr">${top}</div><div class="ck-bt">${btns}</div></div>`;
const ck2Own=(done,total,act)=>ck2Foot(done>0?`<div class="ck-prog"><span class="ck-bar"><i style="width:${Math.round(done/total*100)}%"></i></span><span>${done}/${total} bài</span></div>`:`<span class="ck-own">Đã đăng ký · Chưa bắt đầu</span>`,`<button class="btn ck-btn ck-blue" ${act}>${done>0?'Tiếp tục học':'Bắt đầu học'}</button>`);
const ck2Meta=n=>`<p class="ck-m ck-m2">${ic('bookopen',15)} ${n} bài học</p>`;
// hàng cuối thẻ khi đã mua: đang học dở → tiến độ + "k/N bài" + Tiếp tục học; chưa học → "Đã đăng ký · Chưa bắt đầu" + Bắt đầu học
const ownedFoot=(done,total,act)=>done>0
 ?`<div class="ck-prog"><span class="ck-bar"><i style="width:${Math.round(done/total*100)}%"></i></span><span>${done}/${total} bài</span></div><button class="btn ck-btn ck-blue" ${act}>Tiếp tục học</button>`
 :`<span class="ck-own">Đã đăng ký · Chưa bắt đầu</span><button class="btn ck-btn ck-blue" ${act}>Bắt đầu học</button>`;
// thẻ AI for CEO: cùng kiểu thẻ với các khóa khác, đứng đầu lưới
function aiCard(){
 const enr=S.enrolled,st=enr&&S.plan?planStats():null;
 const img=COURSE.cover?`<img src="${esc(COURSE.cover)}" alt="">`:`<span class="ck-ph" style="background:linear-gradient(135deg,#00327A,#004AAD)"><b>AI for <em>CEO</em></b></span>`;
 const foot=enr?ownedFoot(st?st.unitsDone:0,st?st.units:ALL_BAI.length,'data-a="openCourse"')
  :`<div class="ck-price"><b class="tnum">${money(COURSE.price)}</b><s class="tnum">${money(COURSE.list)}</s><span class="ck-off">−${OFF}%</span></div><button class="btn ck-btn ck-buy" data-a="go" data-to="checkout">${ic('cart',16)} Mua khóa</button>`;
 return `<article class="ck">
  <button class="ck-img" data-a="crsOpen" data-v="aiceo" aria-label="Xem khóa ${esc(COURSE.name)}">${img}</button>
  <div class="ck-b">
   <h3 class="ck-t"><button data-a="crsOpen" data-v="aiceo">${esc(COURSE.name)}</button></h3>
   <p class="ck-d">${esc(COURSE.desc)}</p>
   ${CK2?ck2Meta(ALL_BAI.length)+(enr?ck2Own(st?st.unitsDone:0,st?st.units:ALL_BAI.length,'data-a="openCourse"'):ck2Foot(`<div class="ck-price"><b class="tnum">${money(COURSE.price)}</b><s class="tnum">${money(COURSE.list)}</s><span class="ck-off">−${OFF}%</span></div>`,ck2Try('data-a="trialStart"')+`<button class="btn ck-btn ck-buy" data-a="go" data-to="checkout">${ic('cart',16)} Mua khóa</button>`)):`<p class="ck-m">${ALL_BAI.length} bài học</p>
   <div class="ck-f">${foot}</div>`}
  </div></article>`;
}
// thẻ khóa học: ảnh · tên (2 dòng) · mô tả (2 dòng) · số bài · hàng cuối theo trạng thái + đúng 1 nút
function courseCard(c,i){
 const owned=S.loggedIn&&c.demoOwned;
 if(CK2){const f2=owned?ck2Own(c.demoDone||0,c.lessons,'data-a="crsDemo"')
   :c.free?ck2Foot('<b class="ck-free">Miễn phí</b>','<button class="btn ck-btn ck-blue" data-a="crsDemo">Bắt đầu học</button>')
   :c.price!=null?ck2Foot(`<div class="ck-price"><b class="tnum">${money(c.price)}</b></div>`,(c.trial?ck2Try('data-a="crsDemo"'):'')+`<button class="btn ck-btn ck-buy" data-a="crsDemo">${ic('cart',16)} Mua khóa</button>`)
   :ck2Foot('',`<button class="btn ck-btn ck-line" data-a="crsOpen" data-v="${i}">Xem khóa học</button>`);
  return cardShell(c,i,f2,true);}
 if(owned)return cardShell(c,i,ownedFoot(c.demoDone||0,c.lessons,'data-a="crsDemo"'));
 const left=c.free?`<b class="ck-free">Miễn phí</b>`:c.price!=null?`<div class="ck-price"><b class="tnum">${money(c.price)}</b></div>`:'<span></span>';
 const btn=c.free?`<button class="btn ck-btn ck-blue" data-a="crsDemo">Bắt đầu học</button>`
  :c.price!=null?`<button class="btn ck-btn ck-buy" data-a="crsDemo">${ic('cart',16)} Mua khóa</button>`
  :`<button class="btn ck-btn ck-line" data-a="crsOpen" data-v="${i}">Xem khóa học</button>`;
 return cardShell(c,i,left+btn);
}
function cardShell(c,i,foot,full){
 const img=c.cover?`<img src="${esc(c.cover)}" alt="" loading="lazy">`:`<span class="ck-ph" style="background:${c.bg}"><b>${c.n}</b></span>`;
 return `<article class="ck">
  <button class="ck-img" data-a="crsOpen" data-v="${i}" aria-label="Xem khóa ${esc(c.title)}">${img}</button>
  <div class="ck-b">
   <h3 class="ck-t"><button data-a="crsOpen" data-v="${i}" title="${esc(c.title)}">${esc(c.title)}</button></h3>
   ${c.desc?`<p class="ck-d">${esc(c.desc)}</p>`:''}
   ${full?ck2Meta(c.lessons)+foot:`<p class="ck-m">${c.lessons} bài học</p>
   <div class="ck-f">${foot}</div>`}
  </div></article>`;
}
// dùng chung cho tab Khóa học trong cộng đồng (bản cũ)
function courseCards(){return `<div class="ck-grid">${aiCard()}${(V2?[]:OTHER_COURSES).map((c,i)=>courseCard(c,i)).join('')}</div>`;}

/* ---------- Trang chủ (đề xuất mới theo bố cục user gửi 10/2026, cả 2 bản) ----------
   Bấm logo Siêu Tăng Trưởng → trang này. Thứ tự: [Khóa học của tôi | Cộng đồng CEO] → AI for CEO (trải nghiệm onboarding
   miễn phí, chưa cần thanh toán) → Thử thách → Thư viện (bài viết). Thử thách, bài viết là minh họa (CHALLENGES, ARTICLES trong data.js). */
const homeHead=(cls,icon,label,title,sub)=>`<div class="home-head"><span class="home-pill ${cls}">${ic(icon,15)} ${label}</span><h2>${title}</h2><p>${sub}</p></div>`;
const chalCard=c=>`<article class="card home-card" data-a="homeDemo" role="button" tabindex="0" aria-label="${esc(c.title)}">${c.cover?`<div class="home-cover has-img"><img src="${c.cover}" alt="" loading="lazy"></div>`:`<div class="home-cover" style="background:${c.bg}"><span class="k">${c.k}</span><span class="n">${c.n}</span></div>`}
   <div class="home-body"><h3 class="home-t2">${esc(c.title)}</h3><div class="home-meta"><span>${ic('clock',14)} ${c.days} ngày</span><b class="home-price">${money(c.price)}</b></div>
    <span class="home-join">${ic('trophy',15)} Tham gia thử thách ${ic('arrow',14)}</span></div></article>`;
const ART_CAT={'AI quản lý dự án':'pm','AI marketing':'mkt','AI Website':'web','AI bán hàng':'sales','AI cho CEO':'ceo','AI vận hành':'ops'}; // màu theo chủ đề bài viết (trang chủ)
const artCard=a=>`<article class="card home-card cat-${ART_CAT[a.cat]||'x'}" data-a="homeDemo" role="button" tabindex="0" aria-label="${esc(a.title)}">${a.cover?`<div class="home-cover art has-img"><img src="${a.cover}" alt="" loading="lazy"></div>`:`<div class="home-cover art"><span class="k">Blog guide</span><span class="n">${a.n}</span></div>`}
   <div class="home-body"><span class="home-cat">${esc(a.cat)}</span><h3 class="home-t2">${esc(a.title)}</h3><p class="home-desc">${esc(a.desc)}</p><div class="home-meta2">${esc(a.date)} <span class="dot">·</span> ${ic('eye',14)} ${a.views||0}</div></div></article>`;
// Nền khối AI for CEO: theo phong cách landing page sieutangtruong.com/lp/ai-for-ceo (user 10/2026): nền sáng, chòm sao mờ xanh + vài chấm cam
const HM_DECO=(()=>{ // chòm sao thưa (theo user 21/10/2026: giảm mật độ, rồi tăng lại 20%: 17 chấm · 14 đường), chủ yếu ở viền khối, tránh vùng chữ
 const N=[[40,40],[230,70],[440,30],[660,20],[900,60],[1150,30],[1290,120],[1300,420],[1240,600],[960,620],[700,600],[420,620],[150,600],[30,330],[620,170],[720,360],[560,600]];
 const ORG=[3,13];
 const E=[[0,1],[1,2],[3,4],[4,5],[5,6],[7,8],[8,9],[10,11],[11,12],[12,13],[3,14],[14,15],[15,10],[16,10]];
 const lines=E.map(([i,j])=>`<line x1="${N[i][0]}" y1="${N[i][1]}" x2="${N[j][0]}" y2="${N[j][1]}"/>`).join('');
 const dots=N.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${ORG.includes(i)?3.5:2.6}"${ORG.includes(i)?' class="org"':''}/>`).join('');
 return `<svg class="hm-deco" viewBox="0 0 1320 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="hm-net">${lines}</g><g class="hm-nodes">${dots}</g></svg>`;})();
function home(){
 // Trang chủ theo bố cục user chốt (26/10/2026): Banner to AI FOR CEO → Cộng đồng CEO AI → Khóa học → Thử thách → Thư viện
 // Hệ thiết kế STT Learn + kiểm tra ui-ux-pro-max
 const enr=S.enrolled,st=enr&&S.plan?planStats():null,obDone=S.ob&&S.ob.done;
 const others=V2?[]:OTHER_COURSES;
 const trialLbl=HAS_C0?(c0Done()&&S.plan?'Xem lộ trình của anh/chị':c0Started()?'Tiếp tục Chương 0':'Trải nghiệm miễn phí'):(obDone?'Xem lộ trình của anh/chị':'Trải nghiệm miễn phí');
 const started=st&&(st.unitsDone>0||subsCount()>0);
 const EYE={'hp-crs-h':'Học AI thực chiến','hp-ch-h':'Áp dụng ngay','hp-lib-h':'Kiến thức mới'};
 const head=(id,t,d,act,more,extra='')=>`<div class="hp-h"><div>${EYE[id]?`<p class="lp-eye"><i aria-hidden="true"></i>${EYE[id]}</p>`:''}<h2 id="${id}">${t}</h2>${d?`<p>${d}</p>`:''}</div><div class="hp-h-r">${extra}${act?`<button class="hp-all" ${act}>${more} <span aria-hidden="true">→</span></button>`:''}</div></div>`;
 // ---- 1. Banner to: AI FOR CEO ----
 const pct=Math.round((1-COURSE.price/COURSE.list)*100);
 const bnCta=enr?`<button class="btn lp-cta" data-a="openCourse">${started?'Tiếp tục học':'Vào học'} ${ic('arrow',18)}</button><button class="lp-link" data-a="crsOpen" data-v="aiceo">Xem khóa học ${ic('arrow',16)}</button>`
   :`<button class="btn lp-cta" data-a="trialStart">${trialLbl} ${ic('arrow',18)}</button><button class="lp-link" data-a="crsOpen" data-v="aiceo">Xem chi tiết khóa học ${ic('arrow',16)}</button>`;
 const bnStrip=`<ul class="lp-strip">${[[LIB.length,'Chương'],[ALL_BAI.length,'Bài học'],[CAP_MAP.length,'Năng lực AI']].map(([n,l])=>`<li><b class="tnum">${n}</b><span>${l}</span></li>`).join('')}${enr&&st?`<li class="nv"><b class="tnum">${st.upct}%</b><span>${st.unitsDone}/${st.units} bài đã học</span></li>`:`<li class="nv"><b class="tnum">${money(COURSE.price)}</b><span>Học phí ra mắt <s class="tnum">${money(COURSE.list)}</s></span></li>`}</ul>`;
  const bnInfo=enr&&st?`<div class="bn-prog"><div class="hp-prog"><span class="hp-bar"><i style="width:${st.upct}%"></i></span><small>${st.unitsDone}/${st.units} bài · ${st.upct}%</small></div></div>`
  :`<p class="bn-price"><b class="tnum">${money(COURSE.price)}</b><s class="tnum">${money(COURSE.list)}</s><span>−${pct}%</span><em>Chương 0 học thử miễn phí</em></p>`;
 const banner=`<section class="bn lp-bn" aria-labelledby="bn-h"><svg class="lp-net" viewBox="0 0 1400 520" preserveAspectRatio="none" aria-hidden="true"><g stroke="#9DB7E8" stroke-width="1" fill="none" opacity=".55"><path d="M40 90 330 40 560 120 840 60 1120 110 1360 40"/><path d="M560 120 640 300 900 250 1160 330 1380 260"/><path d="M90 420 330 470 640 300"/><path d="M1120 110 1160 330 1300 470" stroke-dasharray="4 5"/><path d="M840 60 900 250" stroke-dasharray="4 5"/></g><g fill="#5B8DEF"><circle cx="40" cy="90" r="3"/><circle cx="330" cy="40" r="2.5"/><circle cx="560" cy="120" r="3"/><circle cx="1120" cy="110" r="3"/><circle cx="1360" cy="40" r="2.5"/><circle cx="900" cy="250" r="3"/><circle cx="1160" cy="330" r="3"/><circle cx="330" cy="470" r="2.5"/><circle cx="1300" cy="470" r="2.5"/></g><g fill="#F28C28"><circle cx="840" cy="60" r="3.5"/><circle cx="640" cy="300" r="3"/></g></svg><div class="hp-in bn-g">
  <div class="bn-l">
       <p class="lp-eye"><i aria-hidden="true"></i>${enr?'Khóa học của anh/chị':typeof OPEN_DATE!=='undefined'?`Khai giảng <b>${OPEN_DATE}</b>`:'Khóa học trọng tâm'}</p>
    <h1 id="bn-h">AI FOR CEO</h1>
    <p class="bn-sub"><span class="a">Hiểu AI đủ sâu để</span> <span class="b">ra quyết định cho doanh nghiệp.</span></p>
    <p class="bn-desc">Hiểu năng lực AI để lựa chọn hướng ứng dụng cho doanh nghiệp: tăng trưởng kinh doanh, tối ưu chi phí và nâng cao hiệu quả vận hành.</p>
    <div class="hp-cta">${bnCta}</div>
    ${bnStrip}
  </div>
  <button class="bn-r" data-a="crsOpen" data-v="aiceo" aria-label="Xem khóa ${esc(COURSE.name)}">${COURSE.cover?`<img src="${esc(COURSE.cover)}" alt="">`:''}<span class="bn-badge">${ic('check',14)} Lộ trình riêng trong 3 phút</span></button>
 </div></section>`;
 // ---- 2. Cộng đồng CEO AI (làm lại 27/10/2026 theo kiểu đầu trang nhóm Skool/Facebook Group): ảnh bìa rộng → biểu tượng + tên + thành viên + nút → "Đang thảo luận" | "Sự kiện sắp tới"
 // Ảnh bìa: COMM.cover (community.js); chưa có thì tạm dùng ảnh bìa AI for CEO (minh họa)
 const ppl=typeof COMM_PEOPLE!=='undefined'?COMM_PEOPLE:{};
 const catName=k=>((typeof COMM_CATS!=='undefined'?COMM_CATS:[]).find(c=>c[0]===k)||['',''])[1];
 const catCol=k=>(typeof CAT_COLOR!=='undefined'&&CAT_COLOR[k])||'#004AAD';
 const posts=(typeof COMM_SEED!=='undefined'?COMM_SEED:[]).filter(p=>!p.pin).slice().sort((a,b)=>a.ago-b.ago).slice(0,3);
 const evs=upcomingEvents().slice(0,2);
 const AV=Object.values(ppl).slice(0,5);
 const ini=n=>esc(n.trim().split(/\s+/).pop()[0]||'');
 // chưa có ảnh cộng đồng (COMM.cover) → mảng ảnh đại diện thành viên trên nền navy
 const cmWall=()=>{const P=Object.values(ppl);if(!P.length)return '';let h='';for(let i=0;i<54;i++){const p=P[(i*5+Math.floor(i/9))%P.length];h+=`<span style="background:${p.c};--d:${(i%7)*0.6}s">${ini(p.name)}</span>`;}return `<span class="cm3-wall" aria-hidden="true">${h}</span>`;};
 const cmPost=p=>{const a=ppl[p.by]||{name:'Thành viên',role:'',c:'#64748B'};return `<li><button class="cm2-post" data-a="openCommunity" data-v="aiceo">
   <span class="cm2-av" style="background:${a.c}" aria-hidden="true">${ini(a.name)}</span>
   <span class="cm2-pb"><span class="cm2-pm"><b>${esc(a.name)}</b><span>${esc((a.role||'').split('·').pop().trim())}</span><span aria-hidden="true">·</span><span>${timeAgo(p.ago)}</span></span>
    <span class="cm2-pt">${esc(p.title)}</span>
    <span class="cm2-pf"><span class="cm2-tag" style="--c:${catCol(p.cat)}">${esc(catName(p.cat))}</span><span>${ic('thumb',14)} ${p.likes}</span><span>${ic('chat',14)} ${(p.comments||[]).length}</span></span></span></button></li>`;};
 const cmEv=ev=>`<div class="cm2-ev"><span class="cm2-ev-d"><small>Th${ev.d.split('/')[1]}</small><b>${ev.d.split('/')[0]}</b></span><span class="cm2-ev-b"><small>${esc(ev.type||'Sự kiện')}</small><b>${esc(ev.title)}</b><span>${esc(ev.t)}${ev.len?` · ${esc(ev.len)}`:''}</span></span><span class="cm2-ev-a">${evBtn(ev)}</span></div>`;
 const comm=`<section class="hp-sec" aria-labelledby="hp-cm-h"><div class="hp-in"><div class="cm3">
  <button class="cm3-cover" data-a="openCommunity" data-v="aiceo" aria-label="Vào ${esc(COMM.name)}">${COMM.cover?`<img src="${esc(COMM.cover)}" alt="" loading="lazy">`:cmWall()}<span class="cm3-live"><i aria-hidden="true"></i>${COMM.online} đang trực tuyến</span></button>
  <div class="cm3-head">
   <span class="cm3-logo" aria-hidden="true">${ic('users',30)}</span>
   <div class="cm3-id"><p class="hp-eye">Cộng đồng</p><h2 id="hp-cm-h">${esc(COMM.name)}</h2><p>${esc(COMM.tagline)} · Live Zoom "AI đến đâu rồi?" hằng tháng.</p></div>
   <div class="cm3-act"><div class="cm2-mem"><span class="cm2-avs" aria-hidden="true">${AV.map(p=>`<span style="background:${p.c}">${ini(p.name)}</span>`).join('')}<span class="more">+${Math.max(0,COMM.members-AV.length)}</span></span><p><b>${COMM.members.toLocaleString('vi-VN')}</b> thành viên</p></div><button class="btn hp-btn hp-btn-b" data-a="openCommunity" data-v="aiceo">Vào cộng đồng ${ic('arrow',18)}</button></div>
  </div>
  <div class="cm3-body">
   <div><div class="cm2-rh"><h3>Đang thảo luận</h3><button class="hp-all" data-a="openCommunity" data-v="aiceo">Xem tất cả <span aria-hidden="true">→</span></button></div><ul class="cm2-feed">${posts.map(cmPost).join('')}</ul></div>
   ${evs.length?`<div><div class="cm2-rh"><h3>Sự kiện sắp tới</h3></div><div class="cm3-evs">${evs.map(cmEv).join('')}</div></div>`:''}
  </div>
 </div></div></section>`;
 // ---- 3. Khóa học: lọc theo nhóm ----
 const catCount=k=>(k==='ceo'&&!V2?1:0)+others.filter(c=>c.cat===k).length;
 const pop=CRS_CATS.filter(([k])=>catCount(k));
 const cat='all'; // đã bỏ hàng chip lọc nhóm ở trang chủ (user 28/10/2026)
 CK2=true; // thẻ khóa học trang chủ dùng chung kiểu thẻ trang Khóa học (user 28/10/2026)
 const cards=((cat==='all'||cat==='ceo')&&!V2?[aiCard()]:[]).concat(others.map((c,i)=>({c,i})).filter(o=>cat==='all'||o.c.cat===cat).map(o=>courseCard(o.c,o.i)));
 CK2=false;
 const tabs=`<div class="hp-tabs" role="toolbar" aria-label="Lọc khóa học theo nhóm">${[['all','Tất cả']].concat(pop).map(([k,l])=>`<button data-a="hpCat" data-v="${k}" aria-pressed="${cat===k}">${esc(l)}</button>`).join('')}</div>`;
 const crs=`<section class="hp-sec" aria-labelledby="hp-crs-h"><div class="hp-in">${head('hp-crs-h','Khóa học','Khóa ngắn, làm theo từng bước, có sản phẩm thật sau mỗi khóa.','data-a="go" data-to="courses"',`Xem tất cả ${others.length+(V2?0:1)} khóa học`)}
  <div class="ckf-main hp-crs"><div class="ck-grid hp-crs4">${cards.slice(0,8).join('')}</div></div></div></section>`;
 // ---- 4. Thử thách ----
 const chal=`<section class="hp-sec" aria-labelledby="hp-ch-h"><div class="hp-in">${head('hp-ch-h','Thử thách','Mỗi ngày một nhiệm vụ, áp dụng AI ngay vào công việc.','data-a="go" data-to="challenges"','Xem tất cả thử thách')}
  <div class="ck-grid hp-g4">${CHALLENGES.slice(0,4).map(chalCardX).join('')}</div></div></section>`;
 // ---- 5. Thư viện: bài nổi bật + danh sách ----
 const A=ARTICLES,f=A[0],rest=A.slice(1,5),tone=c=>ART_CAT[c]||'x';
 const lib=`<section class="hp-sec" aria-labelledby="hp-lib-h"><div class="hp-in">${head('hp-lib-h','Thư viện','Bài viết, hướng dẫn và case study về ứng dụng AI cho doanh nghiệp.','data-a="go" data-to="library"','Xem thư viện')}
  <div class="hp-lib">
   <article class="hp-feat" data-a="homeDemo" role="button" tabindex="0" aria-label="${esc(f.title)}"><span class="hp-feat-img">${f.cover?`<img src="${esc(f.cover)}" alt="" loading="lazy">`:''}</span>
    <div class="hp-feat-b"><span class="lb-badge t-${tone(f.cat)}">${esc(libLabel(f.cat))}</span><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p><small>${esc(f.date)} · ${(f.views||0).toLocaleString('vi-VN')} lượt xem</small></div></article>
   <ul class="hp-alist">${rest.map(a=>`<li><button class="hp-arow" data-a="homeDemo"><span class="hp-arow-img">${a.cover?`<img src="${esc(a.cover)}" alt="" loading="lazy">`:''}</span><span class="hp-arow-b"><small class="t-${tone(a.cat)}">${esc(libLabel(a.cat))}</small><b>${esc(a.title)}</b><em>${esc(a.date)} · ${(a.views||0).toLocaleString('vi-VN')} lượt xem</em></span></button></li>`).join('')}</ul>
  </div></div></section>`;
 return `<div class="hp h3">${banner}${comm}${crs}${chal}${lib}</div>`;
}
// thẻ bài viết (cùng kiểu thẻ khóa học): ảnh · chủ đề · tên · mô tả · ngày · lượt xem; bấm cả thẻ
const ART_TONE={pm:'#15803D',mkt:'#B45309',web:'#004AAD'};
const artCardX=a=>{const k=ART_CAT[a.cat]||'x';return `<article class="ck hx-art" data-a="homeDemo" role="button" tabindex="0" aria-label="${esc(a.title)}">
  <span class="ck-img">${a.cover?`<img src="${esc(a.cover)}" alt="" loading="lazy">`:`<span class="ck-ph" style="background:#004AAD"><b>${a.n}</b></span>`}</span>
  <div class="ck-b"><p class="hx-cat" style="color:${ART_TONE[k]||'#0E7490'}">${esc(libLabel(a.cat))}</p><h3 class="ck-t">${esc(a.title)}</h3><p class="ck-d">${esc(a.desc)}</p>
   <p class="ck-m hx-art-m">${esc(a.date)} · ${(a.views||0).toLocaleString('vi-VN')} lượt xem</p></div></article>`;};

/* ---------- Trang Thử thách & Thư viện (đề xuất mới theo yêu cầu user 10/2026, cả 2 bản) ----------
   Cùng kiểu trang Khóa học: đầu trang căn trái (nhãn pill + tiêu đề + mô tả), bộ lọc dạng chip, lưới 3 thẻ/hàng (dùng chung chalCard / artCard với Trang chủ).
   Dữ liệu minh họa: CHALLENGES, ARTICLES (data.js); bấm thẻ chỉ hiện thông báo. */
const listHead=(cls,icon,label,title,sub)=>`<div class="page-head crs-head list-head"><span class="crs-tagline ${cls}">${ic(icon,15)} ${label}</span><h1 class="h2">${title}</h1><p class="sub">${sub}</p></div>`;
const chips=(key,opts)=>{const v=T[key]||'all';return `<div class="list-chips" role="tablist">${opts.map(([k,l,n])=>`<button role="tab" aria-selected="${v===k}" class="${v===k?'on':''}" data-a="listFilter" data-k="${key}" data-v="${k}">${l}<small>${n}</small></button>`).join('')}</div>`;};
function challenges(){
 return `<div class="ck-page"><section class="ck-wrap">
  <header class="ck-head"><h1>Thử thách</h1><p>Thử thách ngắn ngày, mỗi ngày một nhiệm vụ, để áp dụng AI ngay vào công việc.</p></header>
  <h2 class="sr-only">Danh sách thử thách</h2><div class="ck-grid ck-grid-top">${CHALLENGES.map(chalCardX).join('')}</div>
 </section></div>`;
}
// thẻ thử thách (cùng kiểu thẻ khóa học): ảnh · tên 2 dòng · mô tả 2 dòng · "x ngày · y nhiệm vụ (· z người tham gia)" · giá/Miễn phí + 1 nút
const chalCardX=c=>{const free=!c.price,meta=[`${c.days} ngày`,`${c.tasks} nhiệm vụ`].concat(c.joined>=JOINED_MIN?[`${c.joined.toLocaleString('vi-VN')} người tham gia`]:[]).join(' · ');
 const img=c.cover?`<img src="${esc(c.cover)}" alt="" loading="lazy">`:`<span class="ck-ph" style="background:${c.bg}"><b>${c.n}</b></span>`;
 return `<article class="ck">
  <button class="ck-img" data-a="chalDemo" aria-label="Xem thử thách ${esc(c.title)}">${img}</button>
  <div class="ck-b">
   <h3 class="ck-t"><button data-a="chalDemo" title="${esc(c.title)}">${esc(c.title)}</button></h3>
   <p class="ck-d">${esc(c.desc)}</p>
   <p class="ck-m">${meta}</p>
   <div class="ck-f">${free?'<b class="ck-free">Miễn phí</b>':`<div class="ck-price"><b class="tnum">${money(c.price)}</b></div>`}<button class="btn ck-btn ${free?'ck-blue':'ck-buy'}" data-a="chalDemo">Tham gia</button></div>
  </div></article>`;};
// Trang Thư viện (user duyệt 21/10/2026): 3 tab Kiến thức · Tài liệu · Case study, ô tìm kiếm + lọc chủ đề dùng chung; mỗi tab một kiểu thẻ
const LIB_ORDER=['AI Website','AI quản lý dự án','AI marketing'];
const libLabel=c=>c.replace('AI quản lý dự án','AI Quản lý dự án').replace('AI marketing','AI Marketing');
const DOC_IC={PDF:['#DC2626','PDF'],Excel:['#15803D','XLS'],Word:['#1D4ED8','DOC'],Slide:['#EA580C','PPT']};
const docCard=d=>`<article class="card lib-doc"><span class="lib-doc-ic" style="--c:${DOC_IC[d.kind][0]}">${ic('file',22)}<b>${DOC_IC[d.kind][1]}</b></span>
 <div class="lib-doc-b"><span class="home-cat cat-${ART_CAT[d.cat]||'x'}">${esc(d.cat)}</span><h3>${esc(d.title)}</h3><p>${esc(d.desc)}</p><small>${d.kind} · ${d.pages} trang · ${ic('download',13)} ${d.dl} lượt tải</small></div>
 <button class="btn ${S.loggedIn?'btn-primary':'btn-line'} btn-sm lib-dl" data-a="${S.loggedIn?'libDl':'acOpen'}" data-v="${S.loggedIn?'':'login'}">${ic(S.loggedIn?'download':'lock',15)} ${S.loggedIn?'Tải về':'Đăng nhập để tải'}</button></article>`;
const caseCard=c=>`<article class="card lib-case" style="--c:${c.color}" data-a="homeDemo" role="button" tabindex="0" aria-label="${esc(c.co)}">
 <div class="lib-case-h"><span class="lib-case-av">${esc(c.co.split(' ').slice(-2).map(w=>w[0]).join(''))}</span><div><b>${esc(c.co)}</b><small>${esc(c.ind)} · ${esc(c.size)}</small></div><span class="home-cat cat-${ART_CAT[c.cat]||'x'}">${esc(c.cat)}</span></div>
 <div class="lib-case-m"><b>${esc(c.metric)}</b><span>${esc(c.metricL)}</span></div>
 <dl class="lib-case-s"><div><dt>Bài toán</dt><dd>${esc(c.problem)}</dd></div><div><dt>Giải pháp AI</dt><dd>${esc(c.solution)}</dd></div></dl>
 <span class="lib-case-go">Xem chi tiết ${ic('arrow',14)}</span></article>`;
function library(){
 // Thư viện theo trang thật của Học viện (user gửi ảnh 25/10/2026) + hệ thiết kế STT Learn: ô tìm kiếm · chip chủ đề | chip loại bài · số kết quả + sắp xếp · bài nổi bật · lưới 3 thẻ
 const f=T.libF||'all',ty=T.libT||'all',q=(T.libQ||'').trim().toLowerCase(),sort=T.libSort||'new';
 const TOPICS=['AI Website','AI quản lý dự án','AI marketing'],TYPES=['Hướng dẫn','Case study','Tin tức','Tài liệu'];
 const items=[...ARTICLES.map((a,i)=>({k:'art',o:a,i,cat:a.cat,type:a.type||'Hướng dẫn',title:a.title,desc:a.desc,pop:a.views||0})),
  ...(typeof CASES!=='undefined'?CASES:[]).map((c,i)=>({k:'case',o:c,i,cat:c.cat,type:'Case study',title:c.co,desc:c.problem+' '+c.solution,pop:0})),
  ...(typeof DOCS!=='undefined'?DOCS:[]).map((d,i)=>({k:'doc',o:d,i,cat:d.cat,type:'Tài liệu',title:d.title,desc:d.desc,pop:d.dl||0}))];
 const match=(it,ff,tt)=>(ff==='all'||it.cat===ff)&&(tt==='all'||it.type===tt)&&(!q||(it.title+' '+it.desc+' '+it.cat+' '+it.type).toLowerCase().includes(q));
 let list=items.filter(it=>match(it,f,ty));
 if(sort==='pop')list=list.slice().sort((a,b)=>b.pop-a.pop);
 const n=(ff,tt)=>items.filter(it=>match(it,ff,tt)).length;
 const tone=c=>ART_CAT[c]||'x';
 const badge=c=>`<span class="lb-badge t-${tone(c)}">${esc(libLabel(c))}</span>`;
 const meta=it=>it.k==='art'?`${esc(it.o.date)} <span aria-hidden="true">·</span> ${ic('eye',14)} ${(it.o.views||0).toLocaleString('vi-VN')} lượt xem`
  :it.k==='doc'?`${esc(it.o.kind)} · ${it.o.pages} trang · ${ic('download',14)} ${it.o.dl} lượt tải`:`${esc(it.o.ind)} · ${esc(it.o.size)}`;
 const DK={PDF:'PDF',Excel:'XLS',Word:'DOC',Slide:'PPT'};
 const media=it=>it.k==='art'?(it.o.cover?`<img src="${esc(it.o.cover)}" alt="" loading="lazy">`:'')
  :it.k==='case'?`<span class="lb-ph lb-ph-case t-${tone(it.cat)}"><b class="tnum">${esc(it.o.metric)}</b><small>${esc(it.o.metricL)}</small></span>`
  :`<span class="lb-ph lb-ph-doc t-${tone(it.cat)}"><b>${DK[it.o.kind]||'DOC'}</b><small>Tài liệu miễn phí</small></span>`;
 const act=it=>it.k==='doc'?(S.loggedIn?'data-a="libDl"':'data-a="acOpen" data-v="login"'):'data-a="homeDemo"';
 const card=it=>`<article class="lb-card">
  <button class="lb-img" ${act(it)} tabindex="-1" aria-hidden="true">${media(it)}</button>
  <div class="lb-b">${badge(it.cat)}<span class="lb-type">${esc(it.type)}</span>
   <h3><button ${act(it)}>${esc(it.title)}</button></h3>
   <p class="lb-d">${esc(it.k==='case'?it.o.problem:it.desc)}</p>
   <p class="lb-m">${meta(it)}</p>
   ${it.k==='doc'?`<button class="btn lb-dl" ${act(it)}>${ic('download',16)} ${S.loggedIn?'Tải về':'Đăng nhập để tải'}</button>`:''}
  </div></article>`;
 const featOn=f==='all'&&ty==='all'&&!q&&sort==='new'&&list[0]&&list[0].k==='art';
 const feat=featOn?list[0]:null,rest=featOn?list.slice(1):list;
 const featHTML=feat?`<article class="lb-feat">
  <button class="lb-feat-img" data-a="homeDemo" tabindex="-1" aria-hidden="true">${media(feat)}</button>
  <div class="lb-feat-b"><div>${badge(feat.cat)}<span class="lb-type">Bài nổi bật</span></div>
   <h2><button data-a="homeDemo">${esc(feat.title)}</button></h2><p class="lb-d">${esc(feat.desc)}</p><p class="lb-m">${meta(feat)}</p>
   <button class="btn lb-read" data-a="homeDemo">Đọc bài viết <span aria-hidden="true">→</span></button></div></article>`:'';
 const chip=(key,v,l,cnt,cls='')=>`<button class="lb-chip ${cls}" data-a="listFilter" data-k="${key}" data-v="${esc(v)}" aria-pressed="${(key==='libF'?f:ty)===v}">${esc(l)}<small>${cnt}</small></button>`;
 const filtered=f!=='all'||ty!=='all'||q;
 const empty=`<div class="lb-empty"><h2>${ty==='Tin tức'&&!q?'Chưa có tin tức':'Không tìm thấy nội dung phù hợp'}</h2><p>${ty==='Tin tức'&&!q?'Học viện sẽ cập nhật tin tức về AI cho doanh nghiệp sớm.':'Thử từ khóa khác hoặc bỏ bớt bộ lọc.'}</p><button class="btn lb-read" data-a="libReset">Xóa bộ lọc</button></div>`;
 return `<div class="lb">
 <section class="lb-top"><div class="lb-in">
  <div class="lb-head"><div><h1>Thư viện</h1><p>Bài viết, hướng dẫn, case study và tài liệu về ứng dụng AI cho doanh nghiệp.</p></div>
   <label class="lb-search">${ic('search',18)}<input id="lib-q" type="search" placeholder="Tìm bài viết theo tiêu đề, mô tả, chủ đề..." value="${esc(T.libQ||'')}" aria-label="Tìm trong Thư viện"></label></div>
  <div class="lb-filters">
   <div class="lb-chips" role="group" aria-label="Lọc theo chủ đề">${chip('libF','all','Tất cả chủ đề',n('all',ty))}${TOPICS.map(c=>chip('libF',c,libLabel(c),n(c,ty),'t-'+tone(c))).join('')}</div>
   <div class="lb-chips" role="group" aria-label="Lọc theo loại">${chip('libT','all','Tất cả loại',n(f,'all'))}${TYPES.map(t=>chip('libT',t,t,n(f,t))).join('')}</div>
  </div></div></section>
 <section class="lb-in lb-body" aria-live="polite">
  <div class="lb-bar"><p><b>${list.length}</b> kết quả${filtered?` <button class="lb-clear" data-a="libReset">Xóa bộ lọc</button>`:''}</p>
   <div class="lb-sort" role="group" aria-label="Sắp xếp"><button data-a="listFilter" data-k="libSort" data-v="new" aria-pressed="${sort==='new'}">Mới nhất</button><button data-a="listFilter" data-k="libSort" data-v="pop" aria-pressed="${sort==='pop'}">Xem nhiều</button></div></div>
  ${list.length?`${featHTML}${rest.length?`<h2 class="sr-only">Danh sách nội dung</h2><div class="lb-grid">${rest.map(card).join('')}</div>`:''}`:empty}
 </section></div>`;
}
function obRedirect(){S.screen='lesson';S.unit=curUnitC0();S.lesson=0;return lesson();}
// Bài tập và Dashboard hiện trong cùng khung khóa học (dải navy + menu trái) như Bài học, Lộ trình (bản 1; nội dung 2 trang giữ nguyên)
const inCourse=(fn,label,h)=>()=>S.enrolled&&S.plan?`<section class="wrap page lx-page">${courseBand(label,h)}<div class="lx-embed">${fn()}</div></section>`:fn();
const SCREENS={home,course,challenges,library,courses,landing,account,checkout,mycourses,onboarding:obRedirect,syllabus,learn,lesson,complete:inCourse(complete,"Chứng nhận hoàn thành"),outputs:inCourse(outputs,"Bài tập"),dashboard:inCourse(dashboard,"Dashboard","div"),community};
