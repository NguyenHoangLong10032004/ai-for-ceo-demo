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
 if(typeof commInside==='function'&&commInside())return commHeader(); // đang ở trong 1 cộng đồng: thanh đầu trang riêng của cộng đồng
 const name=S.enrolled?(S.profile.name||(S.order&&S.order.name)||''):S.loggedIn&&S.account?S.account.name:'';
 const inCourse=['mycourses','onboarding','syllabus','learn','lesson','complete','outputs','dashboard'].includes(S.screen);
 return `<header class="hdr"><div class="wrap">
 <button class="logo" data-a="go" data-to="home" aria-label="Trang chủ"><img class="logo-img" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"></button>
 <nav class="nav">${HIDE_LANDING?'':`<button class="${!inCourse&&!['community','courses'].includes(S.screen)?'on':''}" data-a="go" data-to="landing">AI for CEO</button>`}${V2?'':`<button class="${['courses','course'].includes(S.screen)?'on':''}" data-a="go" data-to="courses"><span class="nav-ic">${ic('bookopen',15)}</span>Khóa học</button>`}<button class="${S.screen==='community'?'on':''}" data-a="openCommunity"><span class="nav-ic">${ic('users',15)}</span>Cộng đồng</button><button class="${S.screen==='challenges'?'on':''}" data-a="go" data-to="challenges"><span class="nav-ic">${ic('trophy',15)}</span>Thử thách</button><button class="${S.screen==='library'?'on':''}" data-a="go" data-to="library"><span class="nav-ic">${ic('news',15)}</span>Thư viện</button>${S.enrolled?`<button class="${inCourse?'on':''}" data-a="go" data-to="mycourses"><span class="nav-ic">${ic('book',15)}</span>Khóa học của tôi</button>`:''}</nav>
 <div class="hdr-r">${name?`<button class="me" data-a="go" data-to="${S.enrolled?'mycourses':'landing'}"><span class="avatar">${esc(name.trim().split(/\s+/).pop()[0]||'N')}</span><span class="n">${esc(name)}</span></button>`:`<button class="btn btn-ghost btn-sm" data-a="acOpen" data-v="login">Đăng nhập</button><button class="btn btn-primary btn-sm" data-a="acOpen" data-v="register">Đăng ký</button>`}</div>
 </div></header>`;
}
function secHead(eyebrow,title,sub){return `<div class="sec-head"><span class="eyebrow">${eyebrow}</span><h2 class="h2">${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div>`;}
// chân trang theo mẫu website Siêu Tăng Trưởng: giới thiệu · Khám phá · Liên hệ · Giờ làm việc + Chính sách
function footer(){const y=new Date().getFullYear();return `<footer class="ftr"><div class="wrap"><div class="ftr-grid">
 <div class="ftr-brand"><img class="ftr-logo" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"><p>${esc(ACADEMY.tagline)}</p></div>
 <div><h4>Khám phá</h4><ul><li><button data-a="go" data-to="challenges">Thử thách</button></li><li><button data-a="openCommunity">Cộng đồng</button></li><li><button data-a="go" data-to="library">Thư viện</button></li><li><button data-a="openChat" data-v="expert">Hỗ trợ & Tư vấn</button></li></ul></div>
 <div><h4>Liên hệ</h4><ul class="ftr-contact"><li><span>Hotline:</span> <a href="tel:${ACADEMY.hotline.replace(/s/g,'')}">${esc(ACADEMY.hotline)}</a></li><li><span>Email:</span> <a href="mailto:${ACADEMY.support}">${esc(ACADEMY.support)}</a></li><li><span>Địa chỉ:</span> ${esc(ACADEMY.address)}</li></ul></div>
 <div><h4>Giờ làm việc</h4><p class="ftr-hours">${esc(ACADEMY.workDays)}<br>${esc(ACADEMY.workTime)}</p><h4 class="mt">Chính sách</h4><ul><li><button data-a="policy">Điều khoản & Bảo mật</button></li></ul></div>
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
 const ac=S.account||{},o=S.order||{name:ac.name||'',phone:ac.phone||'',email:ac.email||'',company:'',invoice:true,taxId:'0312345678',invName:SAMPLE_PROFILE.company,invEmail:'ketoan@minhan.vn',invAddr:'125 Nguyễn Văn Linh, Quận 7, TP.HCM'};
 const st=S.pay.status;
 const steps=['Xác nhận thông tin','Thanh toán','Hoàn tất'];const at=st==='success'?2:st?1:0; // 3 bước (theo đề xuất user): gộp Xác nhận + Thông tin
 const stepper=`<div class="stepper">${steps.map((s,i)=>`<span class="${i<at?'ok':i===at?'on':''}"><i>${i<at?'✓':i+1}</i>${s}</span>`).join('')}</div>`;
 const summary=`<aside class="card pad sticky"><h3 class="h3" style="margin-bottom:10px">Thông tin đơn hàng</h3>
  <div class="sum-item"><div class="sum-thumb" aria-hidden="true">${COURSE.cover?`<img src="${esc(COURSE.cover)}" alt="">`:`<span>AI for <b>CEO</b></span>`}</div><div class="sum-item-t"><b>AI for CEO</b><span class="q">Số lượng: 1</span></div></div>
  <div class="sum-row"><span class="k">Khóa học</span><span class="v">AI for CEO</span></div>
  <div class="sum-row"><span class="k">Học phí</span><span class="v tnum">${money(COURSE.list)}</span></div>
  <div class="sum-row disc"><span class="k">Ưu đãi</span><span class="v tnum">−${money(SAVE)}</span></div>
  <div class="sum-row" style="align-items:center"><span class="k">Tổng thanh toán</span><span class="v total tnum">${money(COURSE.price)}</span></div>
  <p class="hint sum-vat">Giá đã bao gồm VAT ${VAT_RATE}%</p>
  </aside>`;
 let main;
 if(st==='await')main=payView();
 else if(st==='processing')main=`<div class="card status"><div class="spin" role="status" aria-label="Đang xử lý"></div><h3 class="h3">Đang xử lý giao dịch…</h3><p class="muted">Vui lòng không đóng trang.</p></div>`;
 else if(st==='failed')main=`<div class="card status"><span class="big bad">${ic('x',28)}</span><h3 class="h3">Chưa nhận được thanh toán</h3><p class="muted" style="max-width:48ch">Hệ thống chưa nhận được tiền chuyển khoản cho đơn <b>${esc(S.order.code)}</b> (mô phỏng). Anh/chị kiểm tra lại số tài khoản, số tiền, nội dung chuyển khoản rồi thử lại, hoặc nhờ hỗ trợ.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-primary" data-a="payRetry">Xem lại thông tin chuyển khoản</button><button class="btn btn-line" data-a="payChange">Sửa thông tin</button><button class="btn btn-line" data-a="paySupport">${ic('headset',16)} Cần hỗ trợ</button></div>
  ${S.pay.support?`<div class="callout info" style="text-align:left"><b>Hỗ trợ thanh toán</b><span>Đội CSKH đã nhận yêu cầu và sẽ gọi lại trong 15 phút (mô phỏng). Hotline minh họa: <b class="tnum">1900 0000</b>. Mã đơn: <b>${esc(S.order.code)}</b>.</span></div>`:''}</div>`;
 else if(st==='success')main=`<div class="card status"><span class="big ok">${ic('check',30)}</span><h3 class="h2" style="font-size:30px">Đăng ký thành công</h3><p class="muted" style="max-width:50ch">Thanh toán đã được ghi nhận<br>Quyền truy cập khóa học <b>AI for CEO</b> đã được kích hoạt.</p>
  <div style="width:100%;max-width:420px;text-align:left;border-top:1px solid var(--line)"><div class="sum-row"><span class="k">Mã đơn</span><span class="v tnum">${esc(S.order.code)}</span></div><div class="sum-row"><span class="k">Học viên</span><span class="v">${esc(S.order.name)}</span></div><div class="sum-row"><span class="k">Đã thanh toán</span><span class="v tnum">${money(COURSE.price)}</span></div><div class="sum-row"><span class="k">Trạng thái</span><span class="v"><span class="pill ok">Đã kích hoạt</span></span></div></div>
  <button class="btn btn-primary btn-lg" data-a="go" data-to="mycourses">Vào khóa học ${ic('arrow')}</button>
  <div class="note-wrap">${(cm=>cm?`<p class="hint mail-note">${ic('mail',14)} Vui lòng kiểm tra email và Zalo để xem xác nhận đăng ký và hướng dẫn truy cập khóa học.</p>`:`<p class="hint mail-note">${ic('mail',14)} Đang gửi email xác nhận tới <b>${esc(S.order.email)}</b>…</p>`)(S.mails.find(m=>m.kind==='confirm'&&m.code===S.order.code))}${(o=>!o.invoice?(o.invConfirmed&&S.mails.some(m=>m.kind==='invoice'&&!m.sample&&m.code===o.code)
   ?`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Đã xuất hóa đơn điện tử</b><span>Hóa đơn số <b>${esc((o.inv||{}).no||'')}</b> đã được gửi tới <b>${esc(o.email)}</b>.</span><div><button type="button" class="btn btn-line btn-sm inv-open" data-a="invView">${ic('eye',15)} Xem hóa đơn</button></div></div></div>`
   :`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Đang xuất hóa đơn điện tử…</b><span>Hóa đơn sẽ được gửi tới <b>${esc(o.email)}</b>.</span></div></div>`)
  :o.invConfirmed
   ?`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Đã xuất hóa đơn điện tử</b><span>Hóa đơn số <b>${esc((o.inv||{}).no||'')}</b> cho ${esc(o.invName||'')} đã được gửi tới <b>${esc(o.invEmail)}</b>.</span><div><button type="button" class="btn btn-line btn-sm inv-open" data-a="invView">${ic('eye',15)} Xem hóa đơn</button></div></div></div>`
   :`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>Xác nhận thông tin hóa đơn</b><span>Vui lòng kiểm tra thông tin hóa đơn của <b>${esc(o.invName||'')}</b> trước khi xác nhận.</span><span>Sau khi xác nhận, hóa đơn điện tử sẽ được gửi đến <b>${esc(o.invEmail)}</b>.</span><div><button type="button" class="btn btn-line btn-sm inv-open" data-a="invView">${ic('eye',15)} Xem và xác nhận hóa đơn</button></div></div></div>`)(S.order)}</div></div>`;
 else main=`<form class="card form" data-f="checkoutSubmit" novalidate>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3 class="h3">Thông tin thanh toán</h3></div>
  <div class="row2"><div class="field"><label for="c-name">Họ và tên <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-name" name="name" value="${esc(o.name)}" required aria-required="true" autocomplete="name"></div><div class="field"><label for="c-phone">Số điện thoại / Zalo <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-phone" name="phone" type="tel" value="${esc(o.phone)}" required aria-required="true" autocomplete="tel"></div></div>
  <div class="row2"><div class="field"><label for="c-email">Email nhận tài khoản <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-email" name="email" type="email" value="${esc(ac.email||o.email)}" readonly aria-readonly="true" aria-describedby="c-email-h"></div><div class="field"><label for="c-company">Công ty</label><input class="inp" id="c-company" name="company" autocomplete="organization" placeholder="Nhập tên công ty" value="${esc(o.company===SAMPLE_PROFILE.company?'':(o.company||''))}"></div></div>
  <p class="hint ck-acc" id="c-email-h"><button type="button" class="btn-link" data-a="acSwitch">Dùng tài khoản khác</button></p>
  <label class="opt" for="c-inv" style="justify-self:start"><input type="checkbox" id="c-inv" name="invoice" ${o.invoice?'checked':''} data-a="invToggle"><span>Xuất hóa đơn doanh nghiệp</span></label>
  <div class="row2" id="inv-box" ${o.invoice?'':'hidden'}><div class="field"><label for="c-tax">Mã số thuế doanh nghiệp <span class="req" aria-hidden="true">*</span></label><div class="tax-in"><input class="inp" id="c-tax" name="taxId" aria-required="true" inputmode="numeric" placeholder="Nhập mã số thuế" aria-describedby="c-tax-st" value="${esc(o.taxId||'')}"><button type="button" class="tax-btn" data-a="taxLookup">${ic('search',16)} Kiểm tra</button></div><p class="hint tax-st" id="c-tax-st" role="status" aria-live="polite">Nhập mã số thuế rồi bấm Kiểm tra, tên và địa chỉ doanh nghiệp sẽ tự điền.</p></div><div class="field"><label for="c-invname">Tên doanh nghiệp <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invname" name="invName" aria-required="true" value="${esc(o.invName||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invaddr">Địa chỉ doanh nghiệp <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invaddr" name="invAddr" aria-required="true" value="${esc(o.invAddr||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invemail">Email nhận hóa đơn <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invemail" name="invEmail" aria-required="true" type="email" value="${esc(o.invEmail||'')}" placeholder="Nhập email nhận hóa đơn" autocomplete="email"></div></div>
  <fieldset><legend>Phương thức thanh toán</legend><div class="opt-grid">${Object.entries(PAY_METHODS).map(([v,l],i)=>`<label class="opt" for="pm-${i}"><input type="radio" id="pm-${i}" name="method" value="${v}" ${S.pay.method===v?'checked':''}><span>${l}</span></label>`).join('')}<label class="opt opt-off" for="pm-card" aria-disabled="true"><input type="radio" id="pm-card" name="method" value="card" disabled><span class="opt-txt"><span>Thẻ thanh toán</span><small>Tạm thời chưa hỗ trợ</small></span><span class="card-brands" aria-hidden="true"><i class="cb-visa">VISA</i><i class="cb-mc"><b></b><b></b></i><i class="cb-jcb">JCB</i><i class="cb-amex">AMEX</i></span></label></div></fieldset>
  <div class="ck-terms"><label class="ck-agree" for="c-agree"><input type="checkbox" id="c-agree" name="agree" ${o.agree?'checked':''} aria-required="true" ${T.err.field==='c-agree'?'aria-invalid="true"':''}><span>Tôi đã đọc và đồng ý với <button type="button" class="btn-link" data-a="policy">Điều khoản &amp; quy định</button>. <span class="req" aria-hidden="true">*</span></span></label></div>
  ${T.err.checkout?`<p class="err">${T.err.checkout}</p>`:''}
  <div class="form-foot"><span></span><button class="btn btn-primary btn-lg">Tiếp tục thanh toán ${ic('arrow')}</button></div></form>`;
 return `<section class="wrap page"><div class="crumbs"><button data-a="go" data-to="courses">Khóa học</button><span>/</span><button data-a="crsOpen" data-v="aiceo">AI for CEO</button><span>/</span><span>Đăng ký & thanh toán</span></div>${stepper}<div class="two"><div>${main}</div>${summary}</div></section>`;
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
  <div class="iv-foot"><p class="hint">${ic('info',14)} ${o.invoice?'Kiểm tra tên đơn vị, mã số thuế, địa chỉ.':'Kiểm tra họ tên người mua.'} Cần điều chỉnh, anh/chị gửi email tới <b>${ACADEMY.billing}</b> kèm mã đơn <b>${esc(o.code)}</b>.</p>${ok?'':`<div class="iv-foot-act"><button class="btn btn-primary" data-a="invConfirm">${ic('check',16)} Xác nhận hóa đơn</button></div>`}</div></div></div>`;
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
 const cp=(k,label,val)=>`<button type="button" class="pay-cp" data-a="payCopy" data-v="${k}" data-c="${esc(val)}" aria-label="Sao chép ${label}" title="Sao chép">${ic('copy',16)}</button>`;
 const row=(label,val,copy,cls='')=>`<div class="pay-row${cls}"><span class="k">${label}</span><b class="v tnum">${val}</b>${copy||'<span></span>'}</div>`;
 const qr=BANK.real?`<img class="qr-svg" src="${bankQR(amt,note)}" alt="Mã VietQR tài khoản ${esc(BANK.name)} của ${esc(ACADEMY.name)}">`:fakeQR(o.code);
 return `<div class="card pad pay">
  <div class="pay-h"><h3 class="h3">Thanh toán</h3><span class="pay-timer${left?'':' end'}" role="timer" aria-label="Thời gian giữ mã thanh toán">${ic('clock',18)} <b class="tnum" id="pay-left">${fmtLeft(left)}</b></span></div>
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
     ${row('Mã đơn (BẮT BUỘC)',esc(note),cp('note','mã đơn',note),' must')}
     ${row('Ngân hàng',esc(BANK.name))}
     ${row('Số tài khoản',esc(BANK.acc.replace(/\s/g,'')),cp('acc','số tài khoản',BANK.acc.replace(/\s/g,'')))}
     ${row('Chủ tài khoản',esc(BANK.holder),'',' holder')}
    </div>
    <p class="pay-warn"><span aria-hidden="true">⚠️</span> <span>Nội dung chuyển khoản PHẢI có mã <b>${esc(note)}</b>. Hệ thống tự xác nhận sau 30 giây - 2 phút.</span></p>
   </div>
  </div>
  <div class="pay-foot"><button type="button" class="btn-link" data-a="payChange">← Sửa thông tin thanh toán</button><button type="button" class="btn-link" data-a="paySupport">${ic('headset',15)} Cần hỗ trợ thanh toán</button></div>
  ${S.pay.support?`<div class="callout info"><b>Hỗ trợ thanh toán</b><span>Nếu anh/chị gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ <b class="tnum">${ACADEMY.hotline}</b> để được hỗ trợ. Mã đơn: <b>${esc(o.code)}</b></span></div>`:''}
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
  ${inp('a-name','name','Họ và tên','text',d.name,true,'autocomplete="name" placeholder="Nhập Họ và tên"')}
  ${inp('a-phone','phone','Số điện thoại / Zalo','tel',d.phone,true,'autocomplete="tel" inputmode="tel" placeholder="Nhập Số điện thoại / Zalo"')}
  ${inp('a-email','email','Email','email',d.email,true,'autocomplete="email" placeholder="Nhập Email"')}
  ${inp('a-pass','pass','Mật khẩu','password','',true,'autocomplete="new-password" minlength="6" placeholder="Ít nhất 6 ký tự"')}
  ${e?`<p class="err">${e}</p>`:''}
  <button class="btn btn-primary btn-lg btn-block">Đăng ký</button>
  <p class="ac-terms">Khi đăng ký, bạn đồng ý với <button type="button" class="btn-link" data-a="policy">Điều khoản &amp; Chính sách bảo mật</button> của chúng tôi.</p>
  <p class="ac-alt">Đã có tài khoản? <button type="button" class="btn-link" data-a="acTab" data-v="login">Đăng nhập</button></p>
  </form>`;
 const login=`<form class="ac-form" data-f="acLogin" novalidate>
  ${inp('l-email','email','Email','email',d.email||(S.account&&S.account.email),true,'autocomplete="email" placeholder="Email tài khoản Học viện"')}
  ${inp('l-pass','pass','Mật khẩu','password','',true,'autocomplete="current-password" placeholder="Nhập mật khẩu"')}
  ${e?`<p class="err">${e}</p>`:''}
  <button class="btn btn-primary btn-lg btn-block">Đăng nhập</button>
  <p class="ac-forgot"><button type="button" class="btn-link" data-a="acForgot">Quên mật khẩu?</button></p>
  <p class="ac-alt">Chưa có tài khoản? <button type="button" class="btn-link" data-a="acTab" data-v="register">Đăng ký miễn phí</button></p></form>`;
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
 const head=listHead('pur','book','Khóa học của tôi','Tiếp tục hành trình học AI của anh/chị','Các khóa học anh/chị đã đăng ký tại Học viện Siêu Tăng Trưởng.');
 // chưa đăng ký khóa nào (vào từ thẻ Khóa học của tôi ở trang chủ)
 // chưa mua nhưng đã học thử Chương 0: thẻ "Đang học thử" (PLAN_Onboarding.md mục 3)
 if(!S.enrolled&&c0Started()){const n=C0_KEYS().filter(k=>S.done[k]).length,N=C0_KEYS().length,dn=c0Done();
  return `<section class="wrap page crs list-page">${head}<div class="grid g2" style="align-items:start"><article class="card course"><button class="course-thumb" data-a="trialStart" aria-label="Mở Chương 0 khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${LIB.length} chương · ${ALL_BAI.length} bài</span></button>
   <div class="pad" style="display:grid;gap:14px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3 class="h3">AI for CEO</h3><span class="pill wait">Đang học thử</span></div>
    <div style="display:grid;gap:6px"><div style="display:flex;align-items:center;gap:10px"><div class="bar" style="flex:1"><i style="width:${Math.round(n/N*100)}%"></i></div><b class="tnum" style="font-size:14px;color:var(--blue)">${n}/${N}</b></div><p class="crs-meta">${ic('bookopen',15)} Chương 0 miễn phí · ${N} bài</p></div>
    ${dn?`<button class="btn btn-primary btn-lg btn-block" data-a="go" data-to="checkout">Đăng ký để học tiếp ${ic('arrow')}</button><button class="btn btn-line btn-block" data-a="trialStart">Xem lộ trình của anh/chị</button>`:`<button class="btn btn-primary btn-lg btn-block" data-a="trialStart">Tiếp tục Chương 0 ${ic('arrow')}</button>`}</div></article></div></section>`;}
 if(!S.enrolled)return `<section class="wrap page crs list-page">${head}<div class="card my-empty"><span class="my-empty-ic">${ic('book',26)}</span><h2>Anh/chị chưa đăng ký khóa học nào</h2><p>Chọn một khóa học để bắt đầu hành trình học AI cùng Học viện.</p><button class="btn btn-primary" data-a="go" data-to="courses">Xem các khóa học ${ic('arrow',16)}</button></div></section>`;
 return `<section class="wrap page crs list-page">${head}
 <div class="grid g2" style="align-items:start">
  <article class="card course"><button class="course-thumb" data-a="openCourse" aria-label="Mở khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${LIB.length} chương · ${ALL_BAI.length} bài</span></button>
   <div class="pad" style="display:grid;gap:14px">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3 class="h3">AI for CEO</h3><span class="pill ${status[1]}">${status[0]}</span></div>
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
 if(!T.cx[key]){const c=ch.find(c=>c.ks.includes(cu));T.cx[key]=key==='learn'&&c?[c.pi]:[];}
 // vừa quay lại từ 1 bài: mở sẵn chương chứa bài đó để cuộn tới
 if(T.focusLesson!=null){const fc=ch.find(c=>c.ks.includes(T.focusLesson));if(fc&&!T.cx[key].includes(fc.pi))T.cx[key]=[...T.cx[key],fc.pi];}
 const open=T.cx[key],lx=T.lx[key];
 return `<div class="cl">${ch.map(c=>{const isOpen=open.includes(c.pi),min=c.ks.reduce((s,k)=>s+U(k).m,0),nEx=c.ks.filter(k=>U(k).kind==='exercise').length;
  const st=c.state,rs=why&&S.plan?(S.plan.items.find(i=>i.id===c.x.id)||{}).reason:'';
  return `<section class="cl-ch ${st} ${isOpen?'open':''}" style="--c:${PHASE_COLOR[c.x.id]}">
   <button class="cl-head" data-a="cxToggle" data-k="${key}" data-v="${c.pi}" aria-expanded="${isOpen}">
    <span class="cl-ico">${ic(st==='done'?'check':st==='cur'?'arrow':'lock',16)}</span>
    <span class="cl-t"><small>${chLabel(c.x)}</small><b>${esc(c.x.title)}</b></span>
    <span class="cl-meta">${c.ks.length} bài${nEx?` · ${nEx} bài tập`:''} · ${min} phút</span>
    <span class="cl-prog"><i style="width:${Math.round(c.dn/c.ks.length*100)}%"></i></span><span class="cl-n">${c.dn}/${c.ks.length}</span>
    <span class="chev">${ic('chev',16)}</span></button>
   ${isOpen?`${rs?`<p class="cl-why cl-chwhy">${ic('spark',13)}<span>${esc(rs)}</span></p>`:''}<ol class="cl-ls">${c.ks.map(k=>unitRow(k,key,{cta,openDetail:T.clAll[key]||lx===k})).join('')}</ol>`:''}</section>`;}).join('')}</div>`;
}
// nút "Xem chi tiết tất cả / Thu gọn tất cả" cho danh sách chương
const clToggleBtn=key=>`<button class="btn btn-ghost btn-sm cl-all" data-a="clAll" data-k="${key}" aria-pressed="${!!T.clAll[key]}">${ic(T.clAll[key]?'x':'chev',14)} ${T.clAll[key]?'Thu gọn tất cả':key==='learn'?'Mở tất cả chương':'Xem chi tiết tất cả'}</button>`;
// 1 dòng bài: số bài · loại (Video / Bài tập) · số phút · ngày học, tên bài, trạng thái; bấm vào mở chi tiết (mục tiêu, năng lực, đầu ra, nút học)
function unitRow(k,key,{cta,openDetail}){
 const direct=key==='learn';if(direct)openDetail=false; // trang vào học: bấm là vào bài luôn
 const u=U(k),s=unitState(k),b=u.b,isEx=u.kind==='exercise',d=lessonOfUnit(k);
 const lk=s==='locked'||s==='paid',rowCta=cta||chOf(k)==='C0';
 const right=`<span class="cl-st ${s}" ${lk?`title="${esc(unitLockMsg(k))}"`:''}>${s==='done'?ic('check',12)+' ':lk?ic('lock',12)+' ':''}${STATE_LABEL[s]}</span>`;
 const detail=openDetail?`<div class="cl-detail">
   <dl class="cl-kv">${b?`<div><dt>Mục tiêu</dt><dd>${esc(b.goal)}</dd></div><div><dt>Năng lực AI</dt><dd>${esc(capName(b.cap))}</dd></div><div><dt>${isEx?'Bài tập':'Đầu ra'}</dt><dd>${esc(b.out)}</dd></div>`:`<div><dt>Nội dung</dt><dd>Nhìn lại các đầu ra của ${esc(chLabel(L[u.id]))} và liên hệ với công ty.</dd></div>`}</dl>
   ${!lk&&rowCta?`<div><button class="btn btn-line btn-sm" data-a="openUnit" data-v="${k}">${s==='done'?'Xem lại':isEx?(S.subs[u.id]?'Xem bài tập':'Làm bài tập'):'Xem video'} ${ic('arrow',14)}</button></div>`:''}</div>`:'';
 return `<li class="cl-l ${s} ${openDetail?'open':''} ${isEx?'is-ex':''}" id="lr-${key}-${k}"><div class="cl-row">
  <span class="cl-dot">${b?b.i+1:'·'}</span>
  <button class="cl-name" ${direct?`data-a="openUnit" data-v="${k}"`:`data-a="lxToggle" data-k="${key}" data-v="${k}" aria-expanded="${!!openDetail}"`}><small><span class="cl-ty ${isEx?'isx':u.kind==='text'?'ist':''}">${ic(unitIcon(u),12)} ${unitType(u)}</span> · ${b?'Bài '+(b.i+1)+' · ':''}${u.m} phút · ${esc(dayLabel(d))}</small><b>${esc(unitTitle(u))}</b></button>
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
 const head=`<section class="card cl-hero"><div class="cl-hero-l">
   <h1>Lộ trình của anh/chị</h1>
   <p class="cl-sum">${st.units} bài · ${st.n} ngày · ~${perDay} bài, ${avg} phút mỗi ngày</p>
   <p class="cl-sub">${ic('spark',14)} <button class="btn-link" data-a="drawerOpen" data-v="why">Vì sao tôi nhận lộ trình này?</button></p>
   <div class="cl-bar"><span><i style="width:${st.upct}%"></i></span><b>${st.upct}% hoàn thành</b></div>${!S.enrolled?`<p class="cl-free">${ic('lock',13)} Anh/chị đã học xong Chương 0 miễn phí. ${S.loggedIn?'Đăng ký khóa học để mở Chương 1 → Kết theo lộ trình này.':'Tạo tài khoản miễn phí để lưu lộ trình, rồi đăng ký khóa học để học tiếp.'}</p>`:''}</div>
  <div class="cl-hero-r">${cta}<button class="btn btn-line" data-a="drawerOpen" data-v="adjust">${ic('refresh',15)} Điều chỉnh lộ trình</button></div></section>`;
 const warn=P.warning?`<div class="callout warn cl-warn"><b>Mỗi bài khoảng ${P.warning.perLesson} phút, vượt ${P.profile.minPerSession} phút/ngày</b><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-a="fixDays" data-v="${Math.min(P.warning.needDays,MAX_DAYS)}">Học trong ${Math.min(P.warning.needDays,MAX_DAYS)} ngày</button>${P.warning.needMin?`<button class="btn btn-line btn-sm" data-a="fixPace" data-v="${P.warning.needMin}">Học ${P.warning.needMin} phút/ngày</button>`:''}</div></div>`:'';
 const cards=[[st.units,'Bài học','var(--blue)','book'],[CAP_MAP.length,'Năng lực AI','var(--teal)','spark'],[Object.keys(TASKS).length,'Bài tập','var(--purple)','file'],[`${st.n} ngày`,'Lộ trình','var(--orange)','cal']];
 const cardHTML=`<div class="dh-kpis cl-kpis">${cards.map(([v,l,c,i])=>`<div class="dh-kpi" style="--c:${c}"><span class="ico">${ic(i,18)}</span><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
 return `<section class="wrap page cl-page"><div class="crumbs">${S.enrolled?`<button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="go" data-to="${P.wasActive?'learn':'onboarding'}">AI for CEO</button>`:`<button data-a="go" data-to="home">Trang chủ</button><span>/</span><span>AI for CEO</span>`}<span>/</span><span>Lộ trình</span></div>
 ${head}${warn}${cardHTML}<section class="cl-sec"><div class="cl-sec-h"><h2 class="h3">Lộ trình của anh/chị</h2><div class="cl-sec-r"><span class="hint">${LIB.length} chương · ${st.units} bài</span>${clToggleBtn('syl')}</div></div>${courseList('syl',{cta:!!(P.accepted||P.wasActive),why:true})}</section></section>`;
}

/* ---------- 6. Khóa học AI for CEO (Học) ---------- */
function learn(){
 const P=S.plan,st=planStats(),ni=nextLesson(),cu=curUnit();
 const head=`<section class="cl-top"><div><h1>AI for CEO</h1><p class="cl-sum">${st.unitsDone}/${st.units} bài đã hoàn thành</p><div class="cl-bar"><span><i style="width:${st.upct}%"></i></span><b>${st.upct}%</b></div></div>
  <div class="cl-top-r"><button class="btn btn-line btn-sm" data-a="go" data-to="dashboard">${ic('chart',15)} Dashboard</button><button class="btn btn-ghost btn-sm" data-a="go" data-to="syllabus">${ic('refresh',15)} Điều chỉnh lộ trình</button></div></section>`;
 let next;
 // khối bài đang học: chữ bên trái, nút bên phải (gọn, không để trống)
 // khối bài đang học: bài đầu tiên chưa xong; kèm tiến độ của ngày học chứa bài đó
 if(cu){const u=U(cu),d=lessonOfUnit(cu),ks=P.lessons[d],dn=ks.filter(k=>S.done[k]).length;
  next=`<section class="cl-next"><div class="cl-next-b"><span class="cl-next-l">Đang học</span><h2>${esc(unitTitle(u))}</h2>
   <span class="cl-next-m">${esc(unitLabel(u))} · ${unitType(u)} · ${u.m} phút</span>
${(c=>c?`<button class="cl-dec" data-a="decOpen" data-v="${c}">${ic('chat',14)} ${esc(chLabel(L[c]))}: xem lại quyết định 30 ngày</button>`:'')(decPending())}</div>
   <button class="btn btn-primary btn-lg" data-a="openUnit" data-v="${cu}">${st.unitsDone===0&&subsCount()===0?'Bắt đầu học':'Học tiếp'} ${ic('arrow',16)}</button></section>`;}
 else next=`<section class="cl-next done"><div class="cl-next-b"><span class="cl-next-l">Hoàn thành</span><h2>Anh/chị đã học hết ${st.units} bài</h2></div><button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button></section>`;
 const side=`<aside class="sticky cl-side">
  <div class="card pad cl-links cl-panel"><div class="rm-card cl-panel-rm">${remindRow()}</div><b>Lối tắt</b>
   <button data-a="go" data-to="outputs">${ic('file',16)}<span>Bài tập của tôi</span><small>${subsCount()}/${Object.keys(TASKS).length}</small></button>
   <button data-a="go" data-to="dashboard">${ic('chart',16)}<span>Dashboard</span></button>
   <button data-a="openCommunity" data-v="aiceo">${ic('users',16)}<span>Cộng đồng</span></button>
   <button data-a="go" data-to="complete">${ic('award',16)}<span>Điều kiện hoàn thành</span></button></div>
  ${eventsCard()}</aside>`;
 return `<section class="wrap page cl-page"><div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><span>AI for CEO</span></div>
 ${head}<div class="two"><div style="display:grid;gap:20px;align-content:start">${next}
  <section class="cl-sec"><div class="cl-sec-h"><h2 class="h3">Danh sách bài học</h2><div class="cl-sec-r"><span class="hint">${LIB.length} chương · ${st.units} bài</span>${clToggleBtn('learn')}</div></div>${courseList('learn')}</section>
  <div class="demo-box"><span class="t">Công cụ demo</span><div><button class="btn btn-line btn-sm" data-a="simulateAll">Mô phỏng: học xong toàn bộ</button></div></div></div>${side}</div></section>`;
}

/* ---------- 7. Trang bài học ---------- */
// Nội dung bài: video → mục tiêu, năng lực AI, đầu ra; bài tập → đề bài + nộp bài; ôn tập → đầu ra của chương
function unitContent(u){
 const p=S.profile,x=L[u.id],b=u.b;
 if(u.kind==='review')return `<div class="take"><span class="t">Ôn tập ${esc(chLabel(x))}</span><p class="big">${esc(x.take)}</p><div><b style="font-size:15px">Nhìn lại các đầu ra của chương và liên hệ với công ty</b><ol style="margin-top:8px">${x.items.map(i=>`<li>${esc(i.out)}</li>`).join('')}</ol></div><p class="hint">Ở công ty ${esc(String(p.industry||'').toLowerCase())}, anh/chị có thể bắt đầu từ việc ${esc((IND[p.industry]||IND['Khác']).general)}.</p></div>`;
 if(u.kind==='exercise')return exerciseView(u.id);
 const tb=u.kind==='text'&&TEXT_BODY[u.key];
 return `${tb?`<article class="ls-read"><p class="ls-lead">${esc(tb.lead)}</p>${tb.secs.map(x=>`<h3>${esc(x.h)}</h3><p>${esc(x.p)}</p>`).join('')}<div class="ls-chk"><b>${ic('check',16)} ${esc(tb.list.h)}</b><ul>${tb.list.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div></article>`:''}<div class="ls-info">
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
// Kết quả AI chấm: điểm tổng + Đạt/Cần bổ sung, 3 tiêu chí, nhận xét từng câu, điểm tốt / nên bổ sung, câu hỏi cho đội ngũ
const exScore=v=>String(v).replace('.',',');
function reviewHTML(id,f){
 if(f.pending)return `<section class="rv pending" aria-live="polite"><div class="rv-h"><span class="t">${ic('spark',15)} AI đang chấm bài…</span></div><div class="rv-sk" aria-hidden="true"><i></i><i></i><i></i></div></section>`;
 if(f.score==null)return f.text?`<div class="fb"><span class="t">Nhận xét</span><p>${fmt(f.text)}</p></div>`:'';
 const t=TASKS[id],qs=t.kind==='uc'?['Use case 1','Use case 2','Use case 3',...(t.linkTask?['Link']:[])]:exBrief(t).items.map((_,i,a)=>'Câu '+(i+1));
 const QI={link:['link','blue'],ok:['check','ok'],short:['alert','warn'],miss:['x','bad'],file:['clip','blue'],gen:['alert','warn']};
 return `<section class="rv" aria-live="polite">
  <div class="rv-h"><div><span class="t">${ic('spark',15)} Kết quả chấm · AI chấm tự động</span><small>Chấm lúc ${esc(f.at||'')}</small></div>
   <div class="rv-score ${f.pass?'ok':'warn'}"><b class="tnum">${exScore(f.score)}</b><small>/10</small><span class="pill ${f.pass?'ok':'wait'}">${f.pass?'Đạt':'Cần bổ sung'}</span></div></div>
  <div class="rv-crit">${f.crit.map(c=>`<div class="rv-c"><div class="rv-cl"><b>${esc(c.name)}</b><span>${esc(c.note)}</span></div><span class="rv-bar ${c.score>=7?'ok':c.score>=5?'warn':'bad'}"><i style="width:${c.score*10}%"></i></span><b class="tnum rv-cs">${exScore(c.score)}</b></div>`).join('')}</div>
  <div class="rv-q"><h5>Nhận xét từng câu</h5><ul>${f.qs.map((q,i)=>{const [icn,cl]=QI[q.st]||QI.ok;return `<li><span class="rv-st ${cl}">${icn==='alert'?'!':ic(icn,12)}</span><b>${qs[i]||'Câu '+(i+1)}</b><span>${esc(q.note)}</span></li>`;}).join('')}</ul></div>
  <div class="rv-2"><div class="rv-good"><h5>Điểm tốt</h5><ul>${f.good.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>${f.fix.length?`<div class="rv-fix"><h5>Nên bổ sung</h5><ul>${f.fix.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}</div>
  ${f.ask?`<p class="rv-ask">${ic('chat',15)}<span><b>Câu hỏi nên hỏi đội ngũ:</b> ${esc(f.ask)}</span></p>`:''}</section>`;}
function exerciseView(id){
 if(OB_SEG[id])return obExView(id);
 const t=TASKS[id],s0=S.subs[id],edit=!s0||T.editEx===id,b=exBrief(t),m=exMode(t),sl=submitLabel(t),req=k=>m.need.includes(k)?' <span class="req">*</span>':'';
 const brief=`<section class="ex-brief" aria-labelledby="exb-${id}"><h4 id="exb-${id}">${ic('file',17)} Đề bài</h4><p>${esc(b.intro)}</p><ol>${b.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
  <dl class="ex-req"><div><dt>${ic('upload',15)} Hình thức nộp</dt><dd>${sl.main}${sl.opt?`<small>${sl.opt}</small>`:''}${t.linkHint&&m.allow.includes('link')?`<small>Link: ${esc(t.linkHint)}</small>`:''}${t.fileHint&&m.allow.includes('file')?`<small>Tệp: ${esc(t.fileHint)}</small>`:''}</dd></div><div><dt>${ic('spark',15)} Cách chấm</dt><dd>AI chấm tự động, thang 10 điểm, từ ${EX_PASS} điểm là Đạt<small>Tiêu chí: ${EX_CRIT.map(c=>c[1]).join(' · ')}. Có nhận xét từng câu.</small></dd></div></dl></section>`;
 const head=`<div class="ex-h"><div><span class="t">Bài tập · ${esc(chLabel(L[id]))} · Bài ${t.i+1} · khoảng ${t.min} phút</span><h3 class="h3">${esc(t.title)}</h3></div>${s0&&!edit?`<span class="pill ok">${ic('check',12)} Đã nộp ${esc(s0.at)}${s0.v>1?` · lần ${s0.v}`:''}</span>`:s0?'<span class="pill wait">Đang sửa bài đã nộp</span>':''}</div>`;
 const fb=s0&&s0.feedback&&!edit?reviewHTML(id,s0.feedback):'';
 if(!edit)return `<div class="ex card">${head}${brief}
  <section class="ex-ans"><h4>${ic('check',17)} Bài làm của anh/chị</h4>
   ${(s0.links||[]).length?`<ul class="ex-files ex-links">${s0.links.map(u=>`<li>${ic('link',16)}<span class="nm"><a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a></span><small>Mở ↗</small></li>`).join('')}</ul>`:''}
   ${s0.text?`<div class="ex-text">${fmt(s0.text)}</div>`:''}
   ${(s0.files||[]).length?`<ul class="ex-files">${s0.files.map(f=>`<li>${exFileLink(f)}${f.data?'':'<small class="hint">demo chỉ lưu tên tệp &gt; 400 KB</small>'}</li>`).join('')}</ul>`:''}</section>
  ${fb}<div class="form-foot"><span class="hint">Bài làm được lưu trong mục "Bài tập của tôi".</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-line btn-sm" data-a="editEx" data-v="${id}">Sửa & nộp lại</button><button class="btn btn-ghost btn-sm" data-a="go" data-to="outputs">Xem tất cả bài tập</button></div></div></div>`;
 const text=T.draft&&T.draft.id===id?T.draft.text:(s0&&s0.text)||'',files=exFiles(id),bad=T.err.field==='ex-text',links=exDraftLinks(id);
 return `<form class="ex card" data-f="exSubmit" data-id="${id}" novalidate>${head}${brief}
  <section class="ex-ans"><h4>${ic('send',17)} Nộp bài làm</h4>
   ${m.allow.includes('link')?`<div class="field"><span class="ex-lab"><span class="lab">Link bài làm${req('link')}</span><small class="hint">${t.linkHint?esc(t.linkHint):'Trang web, tài liệu online, video…'}</small></span>
    <div class="ex-linkl">${links.map((u,i)=>`<div class="ex-link">${ic('link',17)}<input class="inp ex-link-i" id="ex-link${i}" type="url" inputmode="url" autocomplete="url" value="${esc(u)}" placeholder="https://…" aria-label="Link số ${i+1}"${T.err.field==='ex-link'+i?' aria-invalid="true" aria-describedby="ex-err"':''}>${links.length>1?`<button type="button" class="ex-x" data-a="exLinkRm" data-id="${id}" data-v="${i}" aria-label="Bỏ link số ${i+1}" title="Bỏ link">${ic('x',15)}</button>`:''}</div>`).join('')}
    ${links.length<EX_LINKS?`<button type="button" class="btn-link ex-addl" data-a="exLinkAdd" data-id="${id}">+ Thêm link</button>`:''}</div></div>`:''}
   ${m.allow.includes('text')?`<div class="field"><div class="ex-lab"><label for="ex-text">Trả lời bằng văn bản${req('text')}</label><button type="button" class="btn-link" data-a="exSample" data-v="${id}">Điền gợi ý theo công ty của tôi</button></div>
    <textarea class="inp" id="ex-text" name="text" rows="8" placeholder="${t.kind==='uc'?'Use case 1: …&#10;Use case 2: …&#10;Use case 3: …':t.fields.map((_,i)=>`Câu ${i+1}: …`).join('&#10;')}"${bad?' aria-invalid="true" aria-describedby="ex-err"':''}>${esc(text)}</textarea></div>`:''}
   ${m.allow.includes('file')?`<div class="field"><span class="ex-lab"><span class="lab">Đính kèm tệp từ máy${req('file')}</span><small class="hint">${files.length}/${EX_MAX} tệp</small></span>
    <button type="button" class="ex-drop${T.err.field==='ex-drop'?' bad':''}" id="ex-drop" data-a="exPick" data-id="${id}"${files.length>=EX_MAX?' disabled':''}>${ic('upload',22)}<span><b>Kéo thả tệp vào đây</b> hoặc <u>chọn tệp từ máy</u></span><small>PDF, Word, Excel, PowerPoint, ảnh · tối đa ${EX_MAX} tệp, mỗi tệp ≤ 20 MB</small></button>
    <input type="file" id="ex-file" data-id="${id}" multiple hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.csv">
    ${files.length?`<ul class="ex-files">${files.map((f,i)=>`<li>${exFileLink(f)}<button type="button" class="ex-x" data-a="exFileRm" data-id="${id}" data-v="${i}" aria-label="Bỏ tệp ${esc(f.name)}" title="Bỏ tệp">${ic('x',15)}</button></li>`).join('')}</ul>`:''}</div>`:''}
   <p class="hint">${sl.main}${sl.opt?' · '+sl.opt.toLowerCase():''}.${m.need.length?' Mục có dấu * là bắt buộc.':''} Nộp xong, AI chấm và nhận xét ngay.</p></section>
  ${T.err.ex?`<p class="err" id="ex-err" role="alert">${T.err.ex}</p>`:''}
  <div class="form-foot"><span></span><div style="display:flex;gap:8px">${s0?`<button type="button" class="btn btn-ghost" data-a="cancelEdit">Hủy</button>`:''}<button class="btn btn-primary">${ic('send',15)} ${s0?'Nộp lại':'Nộp bài tập'}</button></div></div></form>`;
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
 return `<div class="c0-wrap">${content}<div class="ex card ob-ex"><div class="ex-h"><div><span class="t">Bài tập · Chương 0 · Bài ${t.i+1} · trò chuyện với Trợ lý lộ trình · khoảng ${t.min} phút</span><h3 class="h3">${esc(t.title)}</h3></div>${done?`<span class="pill ok">${ic('check',12)} Đã hoàn thành</span>`:''}</div>
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
 const player=isEx||u.kind==='text'?'':`<div class="player" data-title="${esc(vt)}" data-label="${esc(lab)}"><div class="center"><button class="play" data-a="playUnit" aria-label="Phát video">${ic('play',26)}</button><span class="t">${esc(lab)}</span><h3>${esc(vt)}</h3></div><div class="bottom"><span>${S.done[k]?'Đã xem':'0:00'}</span><span class="track"><i style="width:${S.done[k]?100:0}%"></i></span><span class="tnum">${u.m}:00</span><span class="vp-speed" ${T.vp.speed===1?'hidden':''}>${String(T.vp.speed).replace('.',',')}×</span>${vpControls()}</div>${vpMenu()}${T.vp.cc?`<p class="vp-cc">${esc(vt)}</p>`:''}</div>`;
 // cột phải: các bài của chương đang học
 const cks=all.filter(x=>chOf(x)===ch.id),cdn=cks.filter(x=>S.done[x]).length;
 const list=`<div class="ulist">${cks.map(x=>{const v=U(x),st=unitState(x),lock=st==='locked'||st==='paid';return `<button class="${x===k?'on':''} ${S.done[x]?'done':''} ${lock?'locked':''}" ${lock?`disabled title="${esc(unitLockMsg(x))}"`:`data-a="openUnit" data-v="${x}"`}>${lock?`<span class="st">${ic('lock',12)}</span>`:v.kind==='exercise'?`<span class="st" title="${S.done[x]?'Bài tập hoàn thành khi đã nộp bài':'Nộp bài tập để hoàn thành'}">${ic('check',12)}</span>`:`<span class="st st-tick" role="button" tabindex="0" data-a="unitTick" data-v="${x}" title="${S.done[x]?'Bỏ đánh dấu hoàn thành':'Đánh dấu hoàn thành'}" aria-label="${S.done[x]?'Bỏ đánh dấu hoàn thành':'Đánh dấu hoàn thành'}: ${esc(unitTitle(v))}">${ic('check',12)}</span>`}<span><small>${v.b?'Bài '+(v.b.i+1)+' · ':''}${unitType(v)} · ${esc(dayLabel(lessonOfUnit(x)))}</small><b>${esc(unitTitle(v))}</b></span><span class="mn tnum">${v.m}′</span></button>`;}).join('')}</div>`;
 const nextOpen=next&&unitOpen(next)&&!paidLock(next);
 const c0End=ch.id==='C0'&&(!next||chOf(next)!=='C0'); // bài cuối Chương 0 → sang trang Lộ trình
 const nextBtn=needArt?`<p class="hint">${OB_SEG[u.id]?'Trả lời Trợ lý lộ trình ở trên để hoàn thành bài này.':'Nộp bài tập ở trên để hoàn thành bài này.'}</p>`:
  `<button class="btn btn-primary btn-lg" data-a="markNext">${c0End?'Xem lộ trình của anh/chị':!next?(S.done[k]?'Xem kết quả hoàn thành':'Hoàn thành khóa học'):S.done[k]?'Bài tiếp theo':isEx?'Tiếp tục · Bài tiếp theo':'Hoàn thành · Bài tiếp theo'} ${ic('arrow')}</button>`;
 return `<section class="wrap page lesson">
 <div class="lsn-top"><button class="btn btn-line btn-sm" data-a="${back.a}">${ic('back',15)} ${back.t}</button>
  <div class="crumbs">${S.enrolled?`<button data-a="go" data-to="mycourses">Khóa học của tôi</button>`:`<button data-a="go" data-to="home">Trang chủ</button>`}<span>/</span><button data-a="backToList">AI for CEO</button><span>/</span>${S.from==='outputs'?`<button data-a="backToOutputs">Bài tập của tôi</button><span>/</span>`:''}<span>${esc(lab)}</span></div></div>
 <div style="display:grid;gap:12px;margin-bottom:24px"><div class="meta"><span class="ty">${esc(lab)}/${ch.items.length}</span><span class="ls-type ${isEx?'isx':u.kind==='text'?'ist':''}">${ic(u.kind==='video'?'video':unitIcon(u),14)} ${unitType(u)}</span><span>${ic('clock',14)} ${u.m} phút</span><span>${ic('cal',14)} ${esc(dayLabel(li))} · ${ddn}/${dks.length} bài</span></div><h1>${esc(vt)}</h1>${!S.enrolled&&ch.id==='C0'?`<p class="c0-free">${ic('spark',14)} <b>Chương 0 miễn phí</b> · ${cks.length} bài · khoảng ${cks.reduce((s,x)=>s+U(x).m,0)} phút</p>`:''}</div>
 <div class="lsn">
  <div style="display:grid;gap:24px">${player}${unitContent(u)}<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${nextBtn}<button class="btn btn-line" data-a="asstLesson">${ic('bot',16)} Hỏi Trợ lý AI</button></div>${lessonDecHTML(k,ch,u)}</div>
  <aside class="sticky" style="display:grid;gap:14px"><div><small class="hint">${esc(chLabel(ch))}</small><b style="font-size:15px;display:block">${esc(ch.title)}</b><p class="hint">${cdn}/${cks.length} bài đã hoàn thành</p></div>${list}
   <div style="display:flex;justify-content:space-between;gap:8px">${prev?`<button class="btn btn-ghost btn-sm" data-a="openUnit" data-v="${prev}">${ic('back',15)} Bài trước</button>`:'<span></span>'}${next?(nextOpen?`<button class="btn btn-ghost btn-sm" data-a="openUnit" data-v="${next}">Bài tiếp theo ${ic('arrow',15)}</button>`:`<button class="btn btn-ghost btn-sm" disabled title="${esc(unitLockMsg(next))}">${ic('lock',14)} Bài tiếp theo</button>`):''}</div>
   ${next&&!nextOpen&&!c0End?`<p class="hint">${ic('lock',13)} Bài tiếp theo thuộc ${esc(chLabel(L[chOf(next)]))}, mở sau khi anh/chị học xong ${esc(chLabel(ch))}.</p>`:''}</aside>
 </div></section>`;
}

/* ---------- 8. Bài tập của tôi ---------- */
function outputs(){
 const ids=Object.keys(TASKS),n=subsCount();
 return `<section class="wrap page">
 <div class="lsn-top"><button class="btn btn-line btn-sm" data-a="outputsBack">${ic('back',15)} Danh sách bài học</button>
  <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="outputsBack">AI for CEO</button><span>/</span><span>Bài tập của tôi</span></div></div>
 <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap"><div style="display:grid;gap:8px"><span class="eyebrow">Bài tập của tôi</span><h2 class="h2">${n}/${ids.length} bài tập đã nộp</h2><p class="sub">Bài làm và nhận xét của anh/chị.</p></div></div>
 <div class="bar" style="max-width:520px;margin-bottom:24px"><i style="width:${Math.round(n/ids.length*100)}%"></i></div>
 <div class="grid g2">${ids.map(id=>{const s=S.subs[id],t=TASKS[id],li=lessonOfUnit('E:'+id);const prev=s?clip(subText(id).replace(/\n+/g,' · '),170):'';
  return `<article class="card pad out" id="out-${id}"><div class="ex-h"><div><span class="t">${esc(chLabel(L[id]))} · Bài ${t.i+1}${li>=0?` · ${esc(dayLabel(li))}`:''}</span><h3 class="h3">${esc(t.title)}</h3></div>${s?`<span class="pill ok">Đã nộp</span>`:`<span class="pill wait">Chưa nộp</span>`}</div>
  ${s?`<p class="prev">${esc(prev)}</p><p class="hint">${ic('clock',13)} ${esc(s.at)}${s.v>1?` · nộp lần ${s.v}`:''}${(s.links||[]).length?` · ${ic('link',13)} ${s.links.length} link`:''}${(s.files||[]).length?` · ${ic('clip',13)} ${s.files.length} tệp`:''}${s.feedback&&s.feedback.score!=null?` · <b class="${s.feedback.pass?'ok-t':'warn-t'}">${exScore(s.feedback.score)}/10 ${s.feedback.pass?'Đạt':'Cần bổ sung'}</b>`:''}</p>`:`<p class="prev muted">Bài tập là Bài ${t.i+1} của ${esc(chLabel(L[id]))}${li>=0?`, học vào ${esc(dayLabel(li))}`:''}.</p>`}
  <div>${li<0?'':s||lessonOpen(li)?`<button class="btn ${s?'btn-line':'btn-primary'} btn-sm" data-a="openEx" data-v="${id}">${s?'Xem & sửa':'Làm bài tập'} ${ic('arrow',15)}</button>`:`<span class="hint">${ic('lock',13)} Mở khi anh/chị học tới ${esc(dayLabel(li))}</span>`}</div></article>`;}).join('')}</div>
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
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn btn-line btn-sm" data-a="go" data-to="outputs">${ic('file',15)} Xem bộ bài tập</button><button class="btn btn-line btn-sm" data-a="go" data-to="dashboard">${ic('map',15)} Xem bản đồ hành trình</button></div></article>
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
function courses(){
 return `<section class="wrap page crs">
 <div class="page-head crs-head"><span class="crs-tagline">${ic('bookopen',15)} Khóa học</span><h1 class="h2">Học AI thực tiễn, ứng dụng hiệu quả</h1><p class="sub">Các chương trình học được thiết kế để giúp bạn đưa AI vào công việc và hoạt động doanh nghiệp.</p></div>
 ${courseCards()}
 </section>`;
}
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
 const name=isAI?'AI for CEO':oc.title,crumbs=`<div class="crumbs"><button data-a="go" data-to="courses">Khóa học</button><span>/</span><span>${esc(name)}</span></div>`;
 const thumb=isAI?`<div class="crs-thumb cd-thumb">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${LIB.length} chương · ${CAP_MAP.length} năng lực AI</span></div>`
  :`<div class="crs-thumb cd-thumb" style="background:${oc.bg}">${oc.cover?`<img class="crs-cover" src="${esc(oc.cover)}" alt="">`:''}<span class="k">${oc.k}</span><span class="n">${oc.n}</span></div>`;
 // thẻ mua
 const stt=isAI?cdState():{main:`<button class="btn btn-lg btn-block crs-buy" data-a="crsDemo">${ic('cart',18)} MUA KHÓA</button>`,sub:'',note:'',price:true};
 const priceHTML=!stt.price?'':isAI?`<div class="cd-price"><b class="tnum">${money(COURSE.price)}</b><span class="strike tnum">${money(COURSE.list)}</span><span class="crs-off">−${OFF}%</span></div>`:`<div class="cd-price"><b class="tnum">${money(oc.price)}</b></div>`;
 const buyCard=`<aside class="cd-buy"><div class="card cd-buy-c">${thumb}<div class="cd-buy-b">${priceHTML}${stt.note}<div class="cd-btns">${stt.main}${stt.sub}</div>
  ${isAI?`<div class="cd-inc"><b>Khóa học bao gồm</b><ul>${COURSE_INFO.includes.map(x=>`<li>${ic('check',14)}<span>${esc(x)}</span></li>`).join('')}</ul></div>
  <p class="cd-small">Giá đã bao gồm VAT ${VAT_RATE}% · Có xuất hóa đơn doanh nghiệp</p>`:''}<p class="cd-small">${ic('headset',14)} Cần tư vấn: <b>${esc(ACADEMY.hotline)}</b></p></div></div></aside>`;
 const mbar=`<div class="cd-mbar">${stt.price?`<div class="cd-mbar-p"><b class="tnum">${money(isAI?COURSE.price:oc.price)}</b>${isAI?`<span class="strike tnum">${money(COURSE.list)}</span>`:''}</div>`:''}<div class="cd-mbar-b">${stt.main}</div></div>`;
 // đầu trang
 const CI=COURSE_INFO,stats=isAI?[[LIB.length,'chương'],[ALL_BAI.length,'bài học'],[`${String(CI.rating).replace('.',',')}<i class="cd-star" aria-hidden="true">★</i>`,`${CI.ratings.toLocaleString('vi-VN')} đánh giá`,`Điểm đánh giá ${String(CI.rating).replace('.',',')}/5 từ ${CI.ratings} đánh giá`],[CI.students.toLocaleString('vi-VN'),'học viên']]:[[oc.lessons,'bài học']];
 const head=`<section class="card cd-head"><span class="cd-pill"><i></i>KHÓA HỌC${isAI&&typeof OPEN_DATE!=='undefined'?` · Khai giảng ${OPEN_DATE}`:''}</span>
  <h1>${esc(isAI?COURSE.name:oc.title)}</h1>
  <p class="cd-desc">${esc(isAI?COURSE.desc:oc.desc||'Khóa học minh họa. Thông tin chi tiết sẽ được cập nhật.')}</p>
  <div class="cd-stats">${stats.map(([n,l,t])=>`<div${t?` title="${t}"`:''}><b class="tnum">${n}</b><span>${l}</span></div>`).join('')}</div></section>`;
 if(!isAI)return `<section class="wrap page cd">${crumbs}<div class="cd-grid"><div class="cd-main">${head}</div>${buyCard}</div>${mbar}</section>`;
 // "Anh/chị sẽ học được gì" (tham khảo khối What you'll learn của Coursera)
 const learn=`<section class="cd-sec cd-learn"><h2 class="cd-t">Anh/chị sẽ học được gì?</h2><ul class="cd-learn-l">${COURSE_INFO.learn.map(x=>`<li>${ic('check',18)}<span>${esc(x)}</span></li>`).join('')}</ul></section>`;
 // nội dung khóa học
 const open=T.cdOpen||(T.cdOpen=['C0']),all=open.length===LIB.length;
 const chs=LIB.map((x,pi)=>{const items=x.items||[],nEx=items.filter(b=>b.ex).length,min=items.reduce((a,b)=>a+(b.ex?((TASKS[b.ex]||{}).min||5):b.m||0),0),isOpen=open.includes(x.id),free=HAS_C0&&x.id==='C0'&&!S.enrolled;
  const st='cur'; // trang chi tiết chỉ để xem: không đánh dấu hoàn thành, chưa mua cũng không hiện khóa
  return `<section class="cl-ch ${st} ${isOpen?'open':''}" style="--c:${PHASE_COLOR[x.id]}">
   <button class="cl-head" data-a="cdCh" data-v="${x.id}" aria-expanded="${isOpen}">
    <span class="cl-ico cd-no" aria-hidden="true">${ic('bookopen',18)}</span>
    <span class="cl-t"><small>${esc(chLabel(x))}</small><b>${esc(x.title)}</b></span>
    <span class="cl-meta">${items.length} bài${nEx?` · ${nEx} bài tập`:''} · ${min} phút</span>
    <span class="chev">${ic('chev',16)}</span></button>
   ${isOpen?`<ol class="cl-ls">${items.map(b=>{const isEx=!!b.ex,m=isEx?((TASKS[b.ex]||{}).min||5):b.m,s2='next';
     const right=''; // đã bỏ nhãn "Học thử miễn phí" và link "Xem thử" (theo user 22/10/2026)
     return `<li class="cl-l ${s2} ${isEx?'is-ex':''}"><div class="cl-row"><span class="cl-dot">${b.i+1}</span>
      <div class="cl-name cd-name"><small><span class="cl-ty ${isEx?'isx':b.text?'ist':''}">${ic(isEx?'file':b.text?'news':'play',12)} ${isEx?'Bài tập':b.text?'Văn bản':'Video'}</span> · Bài ${b.i+1} · ${m} phút</small><b>${esc(b.t)}</b></div>${right}</div></li>`;}).join('')}</ol>`:''}</section>`;}).join('');
 const content=`<section class="cl-sec"><div class="cl-sec-h"><h2 class="h3">Nội dung khóa học</h2><div class="cl-sec-r"><span class="hint">${LIB.length} chương · ${ALL_BAI.length} bài</span><button class="btn btn-ghost btn-sm cl-all" data-a="cdAll" aria-pressed="${!!all}">${ic(all?'x':'chev',14)} ${all?'Thu gọn tất cả':'Mở tất cả chương'}</button></div></div><div class="cl">${chs}</div></section>`;
 // đã bỏ mục "Cách học" và 2 ô Dành cho / Chưa phù hợp (theo user 22/10/2026)
 const faq=`<section class="cd-sec"><h2 class="cd-t">Câu hỏi thường gặp</h2><div class="cd-faq">${COURSE_INFO.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
 return `<section class="wrap page cd">${crumbs}<div class="cd-grid"><div class="cd-main">${head}${learn}${content}${faq}</div>${buyCard}</div>${mbar}</section>`;
}
function courseCards(){
 const enr=S.enrolled;
 // đã mua khóa: chỉ còn nút "Vào học" ở cuối thẻ (rộng hết thẻ); chưa mua: giá + nút "Đăng ký"
 const cta=enr?`<button class="btn btn-primary btn-lg" data-a="openCourse">Vào học ${ic('arrow')}</button>`
  :`<button class="btn btn-lg crs-buy" data-a="go" data-to="checkout">${ic('cart',18)} MUA KHÓA</button>`;
 return `<div class="crs-grid"><article class="card crs-feat">
  <button class="crs-thumb" data-a="crsOpen" data-v="aiceo" aria-label="Xem chi tiết khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${LIB.length} chương · ${CAP_MAP.length} năng lực</span></button>
  <div class="crs-body">
   
   <h2 class="crs-name"><button class="crs-name-l" data-a="crsOpen" data-v="aiceo">${esc(COURSE.name)}</button></h2>
   <p class="crs-desc">${esc(COURSE.desc)}</p>
   <p class="crs-meta">${ic('bookopen',15)} ${ALL_BAI.length} bài học</p>
   ${enr?'':`<button class="btn-link crs-try" data-a="trialStart">${ic('play',13)} ${c0Done()&&S.plan?'Xem lộ trình của anh/chị':c0Started()?'Tiếp tục Chương 0 miễn phí':'Học thử Chương 0 miễn phí'}</button>`}
   <div class="crs-foot${enr?' enr':''}">
    ${enr?''
     :`<div class="crs-price" title="${esc(COURSE.promo)}"><b class="tnum">${money(COURSE.price)}</b><span class="crs-old"><span class="strike tnum">${money(COURSE.list)}</span><span class="crs-off">−${OFF}%</span></span></div>`}
    <div class="crs-cta">${cta}</div>
   </div>
  </div>
 </article>${(V2?[]:OTHER_COURSES).map((c,ci)=>`<article class="card crs-feat crs-oth">
  <button class="crs-thumb" data-a="crsOpen" data-v="${ci}" style="background:${c.bg}" aria-label="${esc(c.title)}">${c.cover?`<img class="crs-cover" src="${esc(c.cover)}" alt="">`:''}<span class="k">${c.k}</span><span class="n">${c.n}</span></button>
  <div class="crs-body">
   <div class="crs-oh"><h2 class="crs-name" title="${esc(c.title)}"><button class="crs-name-l" data-a="crsOpen" data-v="${ci}">${esc(c.title)}</button></h2><span class="crs-medal" title="Có chứng nhận hoàn thành">${ic('medal',16)}</span></div>
   ${c.desc?`<p class="crs-desc">${esc(c.desc)}</p>`:''}
   <p class="crs-meta">${ic('bookopen',15)} ${c.lessons} bài học</p>
   <div class="crs-foot"><div class="crs-price"><b class="tnum">${money(c.price)}</b></div><div class="crs-cta"><button class="btn btn-lg crs-buy" data-a="crsDemo">${ic('cart',18)} MUA KHÓA</button></div></div>
  </div>
 </article>`).join('')}</div>`;
}

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
 // Trang chủ làm đẹp lại (theo user 10/2026), GIỮ BỐ CỤC CŨ: [Khóa học của tôi | Cộng đồng CEO] → khối AI for CEO (2 cột: lời mời + khung minh họa lộ trình) → Thử thách → Thư viện (đầu mục căn giữa)
 const login=S.loggedIn&&S.account,enr=S.enrolled,st=enr&&S.plan?planStats():null,obDone=S.ob&&S.ob.done;
 const myDesc=enr?'Tiếp tục các khóa học anh/chị đã đăng ký':'Các khóa học và tiến độ học của anh/chị';
 const myAct='data-a="myCourses"'; // luôn mở trang Khóa học của tôi (chưa đăng nhập thì đăng nhập trước), theo user 10/2026
 // 2 thẻ lối tắt cao (bố cục user gửi): thêm hình nền mờ bên phải + hàng thông tin ở đáy để bớt khoảng trắng
 const tile=(act,icon,cls,t,d,foot,go)=>`<button class="card hm-tile ${cls}" ${act}><span class="hm-tile-art" aria-hidden="true">${ic(icon,120)}</span><span class="hm-tile-ic ${cls}">${ic(icon,20)}</span><span class="hm-tile-t"><b>${t}</b><small>${d}</small></span><span class="hm-tile-foot">${foot}<span class="hm-tile-link">${go} ${ic('arrow',15)}</span></span></button>`;
 // đáy thẻ: ô bìa nhỏ các khóa xếp chồng (giống ảnh đại diện thẻ Cộng đồng). Đã mua = các khóa của tôi + số đang học / đã hoàn thành (dùng chung khi có nhiều khóa); chưa mua = các khóa đang mở đăng ký
 const crsStack=(cs,txt)=>`<span class="hm-avs hm-crs">${cs.map(c=>`<span style="background:${c.bg}${c.muted?';color:#64748B':''}">${c.t.startsWith('icon:')?ic(c.t.slice(5),14):c.t}</span>`).join('')}<small>${txt}</small></span>`;
 const mine=enr?[{bg:'linear-gradient(135deg,#1D4ED8,#7C3AED)',t:'AI',done:!!(st&&st.unitsDone===st.units&&subsCount()===Object.keys(TASKS).length)}]:[];
 const nDone=mine.filter(c=>c.done).length;
 const myFoot=enr?crsStack(mine,`${mine.length-nDone} khóa đang học · ${nDone} đã hoàn thành`)
  :login&&c0Started()?crsStack([{bg:'linear-gradient(135deg,#1D4ED8,#7C3AED)',t:'AI'}],`Đang học thử AI for CEO · Chương 0 ${C0_KEYS().filter(k=>S.done[k]).length}/${C0_KEYS().length}`)
  :login?crsStack([{bg:'#E2E8F0',t:'icon:book',muted:1}],'Chưa có khóa học nào · chọn khóa để bắt đầu')
  :crsStack([{bg:'#E2E8F0',t:'icon:lock',muted:1}],'Đăng nhập để xem các khóa học của anh/chị');
 const AV=[['MT','#2563EB'],['HL','#0891B2'],['QA','#7C3AED'],['TN','#F97316']];
 const commFoot=`<span class="hm-avs">${AV.map(([n,c])=>`<span style="background:${c}">${n}</span>`).join('')}<small>+${COMM.members} thành viên</small></span>`;
 const tiles=`<div class="hm-tiles">${tile(myAct,'book','blu','Khóa học của tôi',esc(myDesc),myFoot,login?'Xem khóa học của tôi':'Đăng nhập')}${tile('data-a="openCommunity" data-v="aiceo"','users','grn','Cộng đồng CEO','Cộng đồng chia sẻ use case AI dành cho CEO và Chủ doanh nghiệp',commFoot,'Vào cộng đồng')}</div>`;
 const cta=enr?`<button class="btn hm-btn" data-a="openCourse">Vào học ${ic('arrow',16)}</button>`
  :`<button class="btn hm-btn" data-a="trialStart">${c0Done()&&S.plan?'Xem lộ trình của anh/chị':c0Started()?'Tiếp tục Chương 0':'Trải nghiệm miễn phí'} ${ic('arrow',16)}</button><button class="btn hm-btn-line" data-a="crsOpen" data-v="aiceo">Xem khóa học</button>`;
 // khung bên phải khối AI for CEO (theo user 10/2026):
 // chưa mua → minh họa "Trò chuyện 3 phút với Trợ lý → Lộ trình 30 ngày" (đúng những gì xảy ra khi bấm Trải nghiệm miễn phí)
 // đã mua → tiến độ THẬT theo chương
 let mock;
 if(enr&&S.plan){const all=planUnits(),cu=curUnit();
  const chs=LIB.map(x=>{const ks=all.filter(k=>chOf(k)===x.id),dn=ks.filter(k=>S.done[k]).length;return {x,ks,dn,k:ks.length&&dn===ks.length?'ok':ks.includes(cu)?'cur':'lock'};}).filter(c=>c.ks.length);
  const ci=Math.max(0,chs.findIndex(c=>c.k==='cur')),from=Math.max(0,Math.min(ci-1,chs.length-4));
  const rows=chs.slice(from,from+4).map(c=>`<li class="hm-r ${c.k}"><span class="hm-r-ic">${c.k==='ok'?ic('check',13):c.k==='cur'?ic('play',12):ic('lock',12)}</span><span class="hm-r-t"><small>${esc(chLabel(c.x))} · ${c.dn}/${c.ks.length} bài</small><b>${esc(c.x.title)}</b></span>${c.k==='cur'?'<em>Đang học</em>':''}</li>`).join('');
  mock=`<div class="hm-mock" aria-hidden="true"><div class="hm-mock-card"><div class="hm-mock-h"><span class="hm-bot">${ic('bot',18)}</span><div><b>Lộ trình của anh/chị</b><small>${S.plan.lessons.length} ngày · ${S.profile.minPerSession||20} phút/ngày</small></div></div>
   <div class="hm-mock-p"><span>Tiến độ</span><b>${st.upct}%</b></div><div class="hm-mock-bar"><i style="width:${st.upct}%"></i></div>
   <ul class="hm-rows">${rows}</ul></div></div>`;}
 else{
  // chưa mua: thẻ "Bản đồ cơ hội AI" theo landing page sieutangtruong.com/lp/ai-for-ceo (user 10/2026; hệ thống thật chưa có onboarding nên hình nói về đầu ra khóa học)
  const steps=[['01','Nhận diện cơ hội','Bài toán doanh nghiệp × năng lực AI'],['02','Lựa chọn 3 use case','Đánh giá theo giá trị và tính khả thi'],['03','Chuẩn bị bước thử nghiệm','Mục tiêu, dữ liệu, điểm kiểm soát']];
  mock=`<div class="hm-mock hm-opp" aria-hidden="true"><div class="hm-mock-card">
   <div class="hm-opp-bar"><span class="dots"><i></i><i></i><i></i></span><span>Từ năng lực đến quyết định</span></div>
   <div class="hm-opp-b"><small class="hm-opp-k">Bản đồ cơ hội AI</small><h3 class="hm-opp-t">Doanh nghiệp nên bắt đầu từ đâu?</h3>
    <ol class="hm-opp-l">${steps.map(([n,t,d],i)=>`<li class="${i===2?'last':''}"><span class="no">${n}</span><span><b>${t}</b><small>${d}</small></span></li>`).join('')}</ol>
    <div class="hm-opp-goal"><small>Đích đến</small><b>Có cơ sở để quyết định việc đáng làm tiếp theo.</b></div></div>
  </div></div>`;
  }
 const stats=[[LIB.length,'chương'],[ALL_BAI.length,'bài học'],[CAP_MAP.length,'năng lực AI'],[3,'use case']].map(([n,l])=>`<div><b>${n}</b><span>${l}</span></div>`).join('');
 const sparks=[1,4].map(i=>`<span class="hm-spark s${i}" aria-hidden="true">${ic('spark',18)}</span>`).join('');
 const hero=`<section class="hm-hero">${HM_DECO}<div class="hm-hero-b">
  <span class="hm-eyebrow">${ic('spark',14)} ${enr?'Khóa học của anh/chị':'Khóa học'}</span>
  <div class="hm-brand"><b>AI for <em>CEO</em></b></div>
  <h1 class="hm-h1s">${enr?'Tiếp tục hành trình học AI theo lộ trình của anh/chị':'Hiểu AI đủ sâu để <span>ra quyết định</span><br>cho doanh nghiệp'}</h1>
  <p>${enr?'Học tiếp theo lộ trình cá nhân hóa của anh/chị, mỗi ngày một ít.':'Dành 3 phút trò chuyện cùng Trợ lý lộ trình AI để khám phá lộ trình học phù hợp với mục tiêu, bối cảnh doanh nghiệp và quỹ thời gian của anh/chị. Bắt đầu ngay, chưa cần thanh toán.'}</p>
  <div class="hm-cta">${cta}</div>
  <div class="hm-stats">${stats}</div></div>${mock}</section>`;
 const head=(cls,icon,label,title,sub)=>`<div class="hm-head"><span class="home-pill ${cls}">${ic(icon,14)} ${label}</span><h2>${title}</h2><p>${sub}</p></div>`;
 const more=(to,t)=>`<div class="hm-more-row"><button class="hm-more" data-a="go" data-to="${to}">${t} ${ic('arrow',15)}</button></div>`;
 const chal=`<section class="hm-sec" id="home-challenges">${head('yel','trophy','Thử thách','Vượt qua thử thách, nhận thưởng lớn','Hoàn thành thử thách, nhận phần thưởng vô cùng hấp dẫn.')}
  <div class="home-grid">${CHALLENGES.slice(0,3).map(chalCard).join('')}</div>${more('challenges','Xem tất cả thử thách')}</section>`;
 const lib=`<section class="hm-sec" id="home-library">${head('blu','news','Thư viện','Bài viết & kiến thức mới nhất','Xu hướng AI, hướng dẫn thực chiến và case study từ cộng đồng.')}
  <div class="home-grid">${ARTICLES.slice(0,3).map(artCard).join('')}</div>${more('library','Xem tất cả bài viết')}</section>`;
 return `<section class="wrap page home hm">${tiles}${hero}${chal}${lib}</section>`;
}

/* ---------- Trang Thử thách & Thư viện (đề xuất mới theo yêu cầu user 10/2026, cả 2 bản) ----------
   Cùng kiểu trang Khóa học: đầu trang căn trái (nhãn pill + tiêu đề + mô tả), bộ lọc dạng chip, lưới 3 thẻ/hàng (dùng chung chalCard / artCard với Trang chủ).
   Dữ liệu minh họa: CHALLENGES, ARTICLES (data.js); bấm thẻ chỉ hiện thông báo. */
const listHead=(cls,icon,label,title,sub)=>`<div class="page-head crs-head list-head"><span class="crs-tagline ${cls}">${ic(icon,15)} ${label}</span><h1 class="h2">${title}</h1><p class="sub">${sub}</p></div>`;
const chips=(key,opts)=>{const v=T[key]||'all';return `<div class="list-chips" role="tablist">${opts.map(([k,l,n])=>`<button role="tab" aria-selected="${v===k}" class="${v===k?'on':''}" data-a="listFilter" data-k="${key}" data-v="${k}">${l}<small>${n}</small></button>`).join('')}</div>`;};
function challenges(){
 const list=CHALLENGES;
 return `<section class="wrap page crs list-page">${listHead('yel','trophy','Thử thách','Tham gia thử thách, nhận phần thưởng lớn','Hoàn thành thử thách ngắn ngày để áp dụng AI ngay vào công việc và nhận phần thưởng hấp dẫn.')}
  <div class="home-grid">${list.map(chalCard).join('')}</div></section>`;
}
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
 const tab=T.libTab||'know',f=T.libF||'all',q=(T.libQ||'').trim().toLowerCase();
 const SRC={know:ARTICLES,docs:DOCS,cases:CASES},txt={know:a=>a.title+' '+a.desc,docs:d=>d.title+' '+d.desc+' '+d.kind,cases:c=>[c.co,c.ind,c.problem,c.solution,c.metricL].join(' ')};
 const cats=[...new Set([...ARTICLES,...DOCS,...CASES].map(a=>a.cat))].sort((x,y)=>(LIB_ORDER.indexOf(x)+99)%99-(LIB_ORDER.indexOf(y)+99)%99);
 const list=SRC[tab].filter(a=>(f==='all'||a.cat===f)&&(!q||(txt[tab](a)+' '+a.cat).toLowerCase().includes(q)));
 const tabs=[['know','Kiến thức','bookopen'],['docs','Tài liệu','download'],['cases','Case study','chart']].map(([k,l,i])=>`<button class="lib-tab${tab===k?' on':''}" data-a="listFilter" data-k="libTab" data-v="${k}" role="tab" aria-selected="${tab===k}">${ic(i,17)} ${l} <span>${SRC[k].length}</span></button>`).join('');
 const chip=(v,l,cls)=>`<button class="lib-chip ${cls}${f===v?' on':''}" data-a="listFilter" data-k="libF" data-v="${esc(v)}" aria-pressed="${f===v}">${esc(l)}</button>`;
 let body='';
 if(!list.length)body='<p class="list-empty">Không tìm thấy nội dung phù hợp.</p>';
 else if(tab==='know'){const feat=list[0];
  body=`<article class="card lib-feat cat-${ART_CAT[feat.cat]||'x'}" data-a="homeDemo" role="button" tabindex="0" aria-label="${esc(feat.title)}">${feat.cover?`<div class="lib-feat-img"><img src="${feat.cover}" alt="" loading="lazy"></div>`:`<div class="lib-feat-img ph">${ic('news',30)}</div>`}
  <div class="lib-feat-b"><span class="home-cat">${esc(feat.cat)}</span><h2>${esc(feat.title)}</h2><p>${esc(feat.desc)}</p><div class="home-meta2">${esc(feat.date)} <span class="dot">·</span> ${ic('eye',14)} ${feat.views||0}</div></div></article>
  ${list.length>1?`<div class="home-grid lib-grid">${list.slice(1).map(artCard).join('')}</div>`:''}`;}
 else if(tab==='docs')body=`${S.loggedIn?'':`<p class="lib-note">${ic('lock',15)} Tài liệu miễn phí cho tài khoản Học viện. Anh/chị đăng nhập để tải về.</p>`}<div class="lib-docs">${list.map(docCard).join('')}</div>`;
 else body=`<div class="lib-cases">${list.map(caseCard).join('')}</div>`;
 return `<div class="lib-band"><div class="wrap"><label class="lib-search">${ic('search',18)}<input id="lib-q" type="search" placeholder="Tìm bài viết, tài liệu, case study..." value="${esc(T.libQ||'')}" aria-label="Tìm trong Thư viện"></label>
  <div class="lib-tabs" role="tablist" aria-label="Loại nội dung">${tabs}</div></div></div>
 <section class="wrap page lib-page"><div class="lib-chips" role="group" aria-label="Lọc theo chủ đề">${chip('all','Tất cả','all')}${cats.map(c=>chip(c,libLabel(c),'cat cat-'+(ART_CAT[c]||'x'))).join('')}</div>${body}</section>`;
}
function obRedirect(){S.screen='lesson';S.unit=curUnitC0();S.lesson=0;return lesson();}
const SCREENS={home,course,challenges,library,courses,landing,account,checkout,mycourses,onboarding:obRedirect,syllabus,learn,lesson,complete,outputs,dashboard,community};
