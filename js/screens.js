/* =========================================================
   SCREENS — dựng giao diện từng màn hình (trả về chuỗi HTML)
   Mỗi màn hình là 1 hàm, đăng ký trong SCREENS ở cuối file.
   ========================================================= */

/* ---------- thành phần dùng chung ---------- */
function demoBar(){
 const cur=S.screen==='lesson'?'learn':S.screen==='account'?'checkout':S.screen;
 return `<div class="demo"><div class="wrap"><span class="demo-tag">Demo</span>
 <nav class="demo-steps" aria-label="Các bước trong luồng">${STAGES.map(([k,l],i)=>`<button class="${cur===k?'on':''}" data-a="jump" data-to="${k}"><b>${i+1}</b>${l}</button>`).join('')}</nav>
 <button class="demo-reset demo-mail" data-a="mailOpen" aria-label="Hộp thư mô phỏng${unreadMails()?`, ${unreadMails()} email chưa đọc`:''}">${ic('mail',13)} Hộp thư${unreadMails()?`<span class="cnt">${unreadMails()}</span>`:''}</button><button class="demo-reset demo-mail" data-a="zaloOpen" aria-label="Zalo mô phỏng${unreadZalo()?`, ${unreadZalo()} tin chưa đọc`:''}"><span class="zalo-ico sm">Z</span> Zalo${unreadZalo()?`<span class="cnt">${unreadZalo()}</span>`:''}</button>${aiDot()}<button class="demo-reset" data-a="reset">${ic('refresh',13)} Làm lại</button></div></div>`;
}
function header(){
 const name=S.enrolled?(S.profile.name||(S.order&&S.order.name)||''):S.loggedIn&&S.account?S.account.name:'';
 const inCourse=['mycourses','onboarding','syllabus','learn','lesson','complete','outputs','dashboard'].includes(S.screen);
 return `<header class="hdr"><div class="wrap">
 <button class="logo" data-a="go" data-to="landing" aria-label="Trang chủ"><img class="logo-img" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"></button>
 <nav class="nav"><button class="${!inCourse&&!['community','courses'].includes(S.screen)?'on':''}" data-a="go" data-to="landing">AI for CEO</button><button class="${S.screen==='courses'?'on':''}" data-a="go" data-to="courses">Khóa học</button><button data-a="go" data-to="landing">Thử thách</button><button class="${S.screen==='community'?'on':''}" data-a="openCommunity" title="Mở cộng đồng ở tab mới">Cộng đồng</button><button data-a="go" data-to="landing">Blog / Tin tức</button>${S.enrolled?`<button class="${inCourse?'on':''}" data-a="go" data-to="mycourses">Khóa học của tôi</button>`:''}</nav>
 <div class="hdr-r">${name?`<button class="me" data-a="go" data-to="${S.enrolled?'mycourses':'landing'}"><span class="avatar">${esc(name.trim().split(/\s+/).pop()[0]||'N')}</span><span class="n">${esc(name)}</span></button>`:`<button class="btn btn-ghost btn-sm" data-a="acOpen" data-v="login">Đăng nhập</button><button class="btn btn-primary btn-sm" data-a="acOpen" data-v="register">Đăng ký</button>`}</div>
 </div></header>`;
}
function secHead(eyebrow,title,sub){return `<div class="sec-head"><span class="eyebrow">${eyebrow}</span><h2 class="h2">${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div>`;}
// chân trang theo mẫu website Siêu Tăng Trưởng: giới thiệu · Khám phá · Liên hệ · Giờ làm việc + Chính sách
function footer(){const y=new Date().getFullYear();return `<footer class="ftr"><div class="wrap"><div class="ftr-grid">
 <div class="ftr-brand"><img class="ftr-logo" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"><p>${esc(ACADEMY.tagline)}</p></div>
 <div><h4>Khám phá</h4><ul><li><button data-a="go" data-to="landing">Thử thách</button></li><li><button data-a="openCommunity">Cộng đồng</button></li><li><button data-a="go" data-to="landing">Blog / Tin tức</button></li><li><button data-a="openChat" data-v="expert">Hỗ trợ & Tư vấn</button></li></ul></div>
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
   const msgs=S.asst.length?S.asst:[{role:'bot',text:learnMode?`Chào anh/chị ${firstName()}! Em là Trợ lý AI của khóa học. Em trả lời ngay, dựa trên nội dung chính thức của khóa học và hồ sơ công ty anh/chị.`:'Chào anh/chị! Em là Trợ lý AI, có thể giải đáp ngay về khóa AI for CEO: nội dung, cách học, thời gian và học phí.'}];
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
  <ul class="hero-facts"><li>${ic('video',16)} 12 module video demo</li><li>${ic('cal',16)} Tự chọn hoàn thành trong 7–30 ngày</li><li>${ic('user',16)} Dành cho CEO, Founder, quản lý cấp cao</li></ul>
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

<section class="band" id="modules"><div class="wrap sec">${secHead('12 module · 10 năng lực','10 năng lực AI, mỗi năng lực có demo thật','Mỗi module gồm 4 video ngắn (mở vấn đề, demo năng lực, giải thích cho CEO, CEO takeaway) và 1 bài tập áp dụng cho công ty. Các module được chia thành bài học theo lịch anh/chị chọn.')}
 <div class="grid g4">${mods.map(x=>`<article class="card mod"><span class="no">MODULE ${modNo(x)}</span><h3>${esc(x.title)}</h3><p>${esc(clip(x.demo,120))}</p></article>`).join('')}</div>
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
  <article class="card layer core"><span class="tag">Lớp 1 · Sản phẩm lõi</span><h3>Video online</h3><p>12 module, video ngắn 6–15 phút. Trợ lý lộ trình chia thành bài học theo số ngày anh/chị muốn hoàn thành.</p></article>
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
  <div class="kv" style="padding-block:10px;border-block:1px solid var(--line)"><div><span>Hình thức</span><b>Video online + Live Zoom</b></div><div><span>Nội dung</span><b>12 module, 48 video, 12 bài tập</b></div><div><span>Lịch học</span><b>Tự chọn 7–30 ngày</b></div></div>
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
  <div class="sum-row"><span class="k">Khóa học</span><span class="v">AI for CEO · Trọn khóa</span></div>
  <div class="sum-row"><span class="k">Học phí</span><span class="v tnum">${money(COURSE.list)}</span></div>
  <div class="sum-row disc"><span class="k">Ưu đãi</span><span class="v tnum">−${money(SAVE)}</span></div>
  <div class="sum-row" style="align-items:center"><span class="k">Tổng thanh toán</span><span class="v total tnum">${money(COURSE.price)}</span></div>
  </aside>`;
 let main;
 if(st==='await')main=payView();
 else if(st==='processing')main=`<div class="card status"><div class="spin" role="status" aria-label="Đang xử lý"></div><h3 class="h3">Đang xử lý giao dịch…</h3><p class="muted">Vui lòng không đóng trang.</p></div>`;
 else if(st==='failed')main=`<div class="card status"><span class="big bad">${ic('x',28)}</span><h3 class="h3">Chưa nhận được thanh toán</h3><p class="muted" style="max-width:48ch">Hệ thống chưa nhận được tiền chuyển khoản cho đơn <b>${esc(S.order.code)}</b> (mô phỏng). Anh/chị kiểm tra lại số tài khoản, số tiền, nội dung chuyển khoản rồi thử lại, hoặc nhờ hỗ trợ.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-primary" data-a="payRetry">Xem lại thông tin chuyển khoản</button><button class="btn btn-line" data-a="payChange">Sửa thông tin</button><button class="btn btn-line" data-a="paySupport">${ic('headset',16)} Cần hỗ trợ</button></div>
  ${S.pay.support?`<div class="callout info" style="text-align:left"><b>Hỗ trợ thanh toán</b><span>Đội CSKH đã nhận yêu cầu và sẽ gọi lại trong 15 phút (mô phỏng). Hotline minh họa: <b class="tnum">1900 0000</b>. Mã đơn: <b>${esc(S.order.code)}</b>.</span></div>`:''}</div>`;
 else if(st==='success')main=`<div class="card status"><span class="big ok">${ic('check',30)}</span><h3 class="h2" style="font-size:30px">Đăng ký thành công</h3><p class="muted" style="max-width:50ch">Thanh toán đã được ghi nhận<br>Quyền truy cập khóa <b>AI for CEO</b> đã được kích hoạt cho <b>${esc(S.order.email)}</b>.</p>
  <div style="width:100%;max-width:420px;text-align:left;border-top:1px solid var(--line)"><div class="sum-row"><span class="k">Mã đơn</span><span class="v tnum">${esc(S.order.code)}</span></div><div class="sum-row"><span class="k">Học viên</span><span class="v">${esc(S.order.name)}</span></div><div class="sum-row"><span class="k">Đã thanh toán</span><span class="v tnum">${money(COURSE.price)}</span></div><div class="sum-row"><span class="k">Trạng thái</span><span class="v"><span class="pill ok">Đã kích hoạt</span></span></div></div>
  <button class="btn btn-primary btn-lg" data-a="go" data-to="mycourses">Vào khóa học ${ic('arrow')}</button>
  ${(cm=>cm?`<p class="hint mail-note">${ic('mail',14)} Vui lòng kiểm tra email <b>${esc(S.order.email)}</b>${S.order.phone?` và Zalo <b>${esc(S.order.phone)}</b>`:''} để xem xác nhận đăng ký và hướng dẫn truy cập khóa học.</p>`:`<p class="hint mail-note">${ic('mail',14)} Đang gửi email xác nhận tới <b>${esc(S.order.email)}</b>…</p>`)(S.mails.find(m=>m.kind==='confirm'&&m.code===S.order.code))}${S.order.invoice?(im=>`<div class="callout info inv-note" role="status"><span class="inv-ico">${ic('file',18)}</span><div><b>${im?'Đã xuất hóa đơn điện tử':'Đang xuất hóa đơn điện tử…'}</b><span>${im?`Hóa đơn số <b>${esc((im.order.inv||{}).no||'')}</b> cho ${esc(S.order.invName||'')} đã được gửi tới <b>${esc(S.order.invEmail)}</b>.`:`Hóa đơn cho ${esc(S.order.invName||'')} sẽ được gửi tới <b>${esc(S.order.invEmail)}</b>.`}</span></div></div>`)(S.mails.find(m=>m.kind==='invoice'&&!m.sample&&m.code===S.order.code)):''}</div>`;
 else main=`<form class="card form" data-f="checkoutSubmit" novalidate>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3 class="h3">Thông tin người học</h3></div>
  <div class="row2"><div class="field"><label for="c-name">Họ và tên <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-name" name="name" value="${esc(o.name)}" required aria-required="true" autocomplete="name"></div><div class="field"><label for="c-phone">Số điện thoại / Zalo <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-phone" name="phone" type="tel" value="${esc(o.phone)}" required aria-required="true" autocomplete="tel"></div></div>
  <div class="row2"><div class="field"><label for="c-email">Email nhận tài khoản <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-email" name="email" type="email" value="${esc(ac.email||o.email)}" readonly aria-readonly="true" aria-describedby="c-email-h"></div><div class="field"><label for="c-company">Công ty</label><input class="inp" id="c-company" name="company" autocomplete="organization" placeholder="Ví dụ: Công ty CP ABC" value="${esc(o.company===SAMPLE_PROFILE.company?'':(o.company||''))}"></div></div>
  <p class="hint ck-acc" id="c-email-h"><button type="button" class="btn-link" data-a="acSwitch">Dùng tài khoản khác</button></p>
  <label class="opt" for="c-inv" style="justify-self:start"><input type="checkbox" id="c-inv" name="invoice" ${o.invoice?'checked':''} data-a="invToggle"><span>Xuất hóa đơn doanh nghiệp</span></label>
  <div class="row2" id="inv-box" ${o.invoice?'':'hidden'}><div class="field"><label for="c-tax">Mã số thuế doanh nghiệp <span class="req" aria-hidden="true">*</span></label><div class="tax-in"><input class="inp" id="c-tax" name="taxId" aria-required="true" inputmode="numeric" placeholder="Ví dụ: 0100109106" aria-describedby="c-tax-st" value="${esc(o.taxId||'')}"><button type="button" class="tax-btn" data-a="taxLookup">${ic('search',16)} Kiểm tra</button></div><p class="hint tax-st" id="c-tax-st" role="status" aria-live="polite">Nhập mã số thuế rồi bấm Kiểm tra, tên và địa chỉ doanh nghiệp sẽ tự điền.</p></div><div class="field"><label for="c-invname">Tên doanh nghiệp <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invname" name="invName" aria-required="true" value="${esc(o.invName||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invaddr">Địa chỉ doanh nghiệp <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invaddr" name="invAddr" aria-required="true" value="${esc(o.invAddr||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invemail">Email nhận hóa đơn <span class="req" aria-hidden="true">*</span></label><input class="inp" id="c-invemail" name="invEmail" aria-required="true" type="email" value="${esc(o.invEmail||'')}" placeholder="Ví dụ: ketoan@congty.vn" autocomplete="email"></div></div>
  <fieldset><legend>Phương thức thanh toán</legend><div class="opt-grid">${Object.entries(PAY_METHODS).map(([v,l],i)=>`<label class="opt" for="pm-${i}"><input type="radio" id="pm-${i}" name="method" value="${v}" ${S.pay.method===v?'checked':''}><span>${l}</span></label>`).join('')}<label class="opt opt-off" for="pm-card" aria-disabled="true"><input type="radio" id="pm-card" name="method" value="card" disabled><span class="opt-txt"><span>Thẻ thanh toán</span><small>Tạm thời chưa hỗ trợ</small></span><span class="card-brands" aria-hidden="true"><i class="cb-visa">VISA</i><i class="cb-mc"><b></b><b></b></i><i class="cb-jcb">JCB</i><i class="cb-amex">AMEX</i></span></label></div></fieldset>
  <div class="ck-terms"><label class="ck-agree" for="c-agree"><input type="checkbox" id="c-agree" name="agree" ${o.agree?'checked':''} aria-required="true" ${T.err.field==='c-agree'?'aria-invalid="true"':''}><span>Tôi đã đọc và đồng ý với <button type="button" class="btn-link" data-a="policy">Điều khoản &amp; quy định</button>. <span class="req" aria-hidden="true">*</span></span></label></div>
  ${T.err.checkout?`<p class="err">${T.err.checkout}</p>`:''}
  <div class="form-foot"><span class="hint"><span class="req">*</span> Thông tin bắt buộc.</span><button class="btn btn-primary btn-lg">Tiếp tục thanh toán ${ic('arrow')}</button></div></form>`;
 return `<section class="wrap page"><div class="crumbs"><button data-a="go" data-to="landing">AI for CEO</button><span>/</span><span>Đăng ký & thanh toán</span></div>${stepper}<div class="two"><div>${main}</div>${summary}</div></section>`;
}

/* ---------- Màn thanh toán: chuyển khoản ngân hàng (theo yêu cầu user) ----------
   2 cách song song: (1) quét mã QR, mã điền sẵn số tài khoản + số tiền + nội dung; (2) chuyển khoản thủ công, mỗi dòng
   số tài khoản / số tiền / nội dung có nút Sao chép riêng. Demo: mã QR chỉ là hình minh họa (không quét được, tránh chuyển nhầm
   tiền vào tài khoản có thật); nút "Mô phỏng: ngân hàng báo đã nhận tiền" thay cho việc hệ thống tự đối soát. */
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
  <div class="demo-box"><span class="t">Mô phỏng ngân hàng</span><div class="seg" role="group" aria-label="Kết quả mô phỏng"><button type="button" class="${S.pay.sim==='success'?'on':''}" data-a="paySim" data-v="success">Nhận đủ tiền</button><button type="button" class="${S.pay.sim==='fail'?'on':''}" data-a="paySim" data-v="fail">Chưa nhận được</button></div><button type="button" class="btn btn-primary btn-sm" data-a="payDone">Mô phỏng: ngân hàng báo có tiền</button></div>
  <div class="pay-foot"><button type="button" class="btn-link" data-a="payChange">← Sửa thông tin đăng ký</button><button type="button" class="btn-link" data-a="paySupport">${ic('headset',15)} Cần hỗ trợ thanh toán</button></div>
  ${S.pay.support?`<div class="callout info"><b>Hỗ trợ thanh toán</b><span>Đội CSKH đã nhận yêu cầu và sẽ gọi lại trong 15 phút (mô phỏng). Hotline: <b class="tnum">${ACADEMY.hotline}</b>. Mã đơn: <b>${esc(o.code)}</b>.</span></div>`:''}
 </div>`;
}

/* ---------- 2a. Tài khoản Học viện (đề xuất mới, US-03.2): bắt buộc có tài khoản trước khi đăng ký mua khóa học ----------
   Tạo tài khoản: Họ và tên, Số điện thoại / Zalo, Email, Mật khẩu → đăng nhập luôn. Đăng nhập: Email + Mật khẩu.
   Email của tài khoản là "Email nhận tài khoản" ở form đăng ký khóa học (khóa, không sửa được). Demo không lưu mật khẩu. */
function account(){
 const tab=T.acTab||'register',d=T.acDraft||{},e=T.err.ac,f=T.err.field,need=T.after==='checkout';
 const inp=(id,name,label,type,val,req=true,extra='')=>`<div class="field"><label for="${id}">${label}${req?' <span class="req" aria-hidden="true">*</span>':''}</label>${type==='password'?'<div class="pw">':''}<input class="inp ${f===id?'bad':''}" id="${id}" name="${name}" type="${type}" value="${esc(val||'')}" ${req?'required aria-required="true"':''} ${f===id?'aria-invalid="true"':''} ${extra}>${type==='password'?`<button type="button" class="pw-t" data-a="pwToggle" data-v="${id}" aria-label="Hiện mật khẩu" aria-pressed="false" title="Hiện mật khẩu">${ic('eye',18)}</button></div>`:''}</div>`;
 const reg=`<form class="ac-form" data-f="acRegister" novalidate>
  ${inp('a-name','name','Họ và tên','text',d.name,true,'autocomplete="name" placeholder="Ví dụ: Nguyễn Văn An"')}
  ${inp('a-phone','phone','Số điện thoại / Zalo','tel',d.phone,true,'autocomplete="tel" inputmode="tel" placeholder="Ví dụ: 0912 345 678"')}
  ${inp('a-email','email','Email','email',d.email,true,'autocomplete="email" placeholder="Ví dụ: ten@congty.vn"')}
  ${inp('a-pass','pass','Mật khẩu','password','',true,'autocomplete="new-password" minlength="6" placeholder="Ít nhất 6 ký tự"')}
  <p class="hint">Email này dùng để đăng nhập và nhận khóa học. <span class="req">*</span> Thông tin bắt buộc.</p>
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
 const fresh=!S.ob.flow.length&&!S.ob.done;
 const status=fresh?['Chưa bắt đầu','wait']:!S.ob.done?['Đang onboarding','blue']:!started?['Chờ xác nhận lộ trình','blue']:st.lessonsDone===st.n&&subsCount()===Object.keys(TASKS).length?['Đã hoàn thành','ok']:['Đang học','blue'];
 const cta=fresh?'Bắt đầu khóa học':!S.ob.done?'Tiếp tục onboarding':!started?'Xem & xác nhận lộ trình':st.lessonsDone===0&&subsCount()===0?'Bắt đầu học':'Học tiếp'; // 0 bài học + 0 bài tập = Bắt đầu học, từ 1 bài trở đi = Học tiếp (theo yêu cầu user)
 const ni=started?nextLesson():-1;
 return `<section class="wrap page">
 <div class="page-head"><span class="eyebrow">Tài khoản học viên</span><h2 class="h2">Khóa học của tôi</h2><p class="sub">Khóa học đã đăng ký.</p></div>
 <div class="grid g2" style="align-items:start">
  <article class="card course"><button class="course-thumb" data-a="openCourse" aria-label="Mở khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">12 module · 12 bài tập</span></button>
   <div class="pad" style="display:grid;gap:14px">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3 class="h3">AI for CEO</h3><span class="pill ${status[1]}">${status[0]}</span></div>
    ${started?`<div style="display:grid;gap:6px"><div class="bar"><i style="width:${st.pct}%"></i></div><span class="hint tnum">${st.lessonsDone}/${st.n} bài học · ${subsCount()}/${Object.keys(TASKS).length} bài tập${ni>=0?` · Tiếp theo: Bài ${ni+1}`:''}</span></div>`
     :''}
    <div class="kv"><div><span>Ngày kích hoạt</span><b>${esc((S.order&&S.order.paidAt)||today())}</b></div><div><span>Mã đơn</span><b class="tnum">${esc((S.order&&S.order.code)||'')}</b></div><div><span>Thời hạn truy cập</span><b>1 năm</b></div></div>
    <button class="btn btn-primary btn-lg btn-block" data-a="openCourse">${cta} ${ic('arrow')}</button>
   </div></article>
  <article class="card pad" style="display:grid;gap:10px;align-content:start;border-style:dashed"><h3 class="h3">Khám phá thêm</h3><p class="muted">Thử thách, khóa chuyên đề, cộng đồng.</p><div><button class="btn btn-line btn-sm" data-a="go" data-to="courses">Xem khóa học ${ic('arrow',15)}</button></div></article>
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
const STATE_LABEL={done:'Hoàn thành',doing:'Đang học',next:'Tiếp theo',locked:'Chưa mở'};
// năng lực chính của 1 bài (module đầu tiên trong bài) → tên + màu
function lessonCap(ks){const m=ks.map(k=>L[U(k).id]).find(x=>x.type==='module')||L[U(ks[0]).id];const ci=CAP_MAP.findIndex(c=>c.id===m.id);return {name:m.cap||m.title,color:ci>=0?CAP_MAP[ci].color:PHASE_COLOR[m.phase],label:ci>=0?`Năng lực ${capNo(ci)}`:m.cap};}
function courseList(key,{cta=true,why=false}={}){ // cta: cho phép mở bài (lộ trình đã xác nhận)
 const ch=chapters(),ni=nextLesson(),cur=ch.find(c=>c.idx.includes(ni));
 if(!T.cx[key])T.cx[key]=key==='learn'&&cur?[cur.pi]:[];
 // vừa quay lại từ 1 bài: mở sẵn chương chứa bài đó để cuộn tới
 if(T.focusLesson!=null){const fc=ch.find(c=>c.idx.includes(T.focusLesson));if(fc&&!T.cx[key].includes(fc.pi))T.cx[key]=[...T.cx[key],fc.pi];}
 const open=T.cx[key],lx=T.lx[key];
 return `<div class="cl">${ch.map(c=>{const isOpen=open.includes(c.pi),min=c.idx.reduce((s,i)=>s+lessonMin(lessons()[i]),0);
  const st=c.state==='done'?'done':c.state==='cur'?'cur':'locked';
  return `<section class="cl-ch ${st} ${isOpen?'open':''}" style="--c:${PHASE_COLOR[c.ph.id]}">
   <button class="cl-head" data-a="cxToggle" data-k="${key}" data-v="${c.pi}" aria-expanded="${isOpen}">
    <span class="cl-ico">${ic(st==='done'?'check':st==='cur'?'arrow':'lock',16)}</span>
    <span class="cl-t"><small>Chương ${c.pi+1}</small><b>${esc(c.ph.name)}</b></span>
    <span class="cl-meta">${c.idx.length} bài · ${min} phút</span>
    <span class="cl-prog"><i style="width:${Math.round(c.dn/c.idx.length*100)}%"></i></span><span class="cl-n">${c.dn}/${c.idx.length}</span>
    <span class="chev">${ic('chev',16)}</span></button>
   ${isOpen?`<ol class="cl-ls">${c.idx.map(i=>lessonRow(i,key,{cta,why,openDetail:T.clAll[key]||lx===i})).join('')}</ol>`:''}</section>`;}).join('')}</div>`;
}
// nút "Xem chi tiết tất cả / Thu gọn tất cả" cho danh sách chương
const clToggleBtn=key=>`<button class="btn btn-ghost btn-sm cl-all" data-a="clAll" data-k="${key}" aria-pressed="${!!T.clAll[key]}">${ic(T.clAll[key]?'x':'chev',14)} ${T.clAll[key]?'Thu gọn tất cả':'Xem chi tiết tất cả'}</button>`;
function lessonRow(i,key,{cta,why,openDetail}){
 const ks=lessons()[i],s=lessonState(i),title=lessonTitle(ks,i,lessons());
 const right=s==='done'?`<span class="cl-st done">${ic('check',12)} Hoàn thành</span>`:false?'':`<span class="cl-st ${s}" ${s==='locked'?`title="${esc(lockMsg(i))}"`:''}>${s==='locked'?ic('lock',12)+' ':''}${STATE_LABEL[s]}</span>`;
 const firsts=ks.filter(k=>{const u=U(k);return (u.kind==='video'&&u.part===0)||u.kind==='extra';}),rs=why?reasonsFor(firsts):[];
 const detail=openDetail?`<div class="cl-detail">
   <ul>${ks.map(k=>{const u=U(k),l=unitLine(u);return `<li class="${S.done[k]?'done':''}">${ic(S.done[k]?'check':l.icon,14)}<span>${esc(l.t)}</span><span class="m">${u.m} phút</span></li>`;}).join('')}</ul>
   ${rs.length?`<p class="cl-why">${ic('spark',13)}<span>${esc(rs.join(' · '))}</span></p>`:''}
   ${s!=='locked'&&cta?`<div><button class="btn btn-line btn-sm" data-a="openLesson" data-v="${i}">${s==='done'?'Xem lại':ks.some(k=>S.done[k])?'Học tiếp':'Bắt đầu học'} ${ic('arrow',14)}</button></div>`:''}</div>`:'';
 return `<li class="cl-l ${s} ${openDetail?'open':''}" id="lr-${key}-${i}"><div class="cl-row">
  <span class="cl-dot">${s==='done'?ic('check',12):s==='locked'?ic('lock',12):i+1}</span>
  <button class="cl-name" data-a="lxToggle" data-k="${key}" data-v="${i}" aria-expanded="${!!openDetail}"><small>Bài ${i+1} · ${esc(dayLabel(i))}</small><b>${esc(title)}</b></button>
  ${right}</div>${detail}</li>`;
}

/* ---------- ngăn trượt (drawer): Vì sao tôi nhận lộ trình này? · Điều chỉnh lộ trình ---------- */
function drawerView(){
 if(!T.drawer||!S.plan)return '';
 const P=S.plan,p=S.profile;let title,body;
 if(T.drawer==='why'){
  title='Vì sao tôi nhận lộ trình này?';
  const mods=P.items.filter(it=>L[it.id].type==='module'&&it.reason),extras=P.items.filter(it=>L[it.id].type!=='module');
  body=`<div class="dw-sec"><h4>Dựa trên</h4><dl class="dw-kv">${[['Mục tiêu học tập',goalsText(p.goals)],['Mức độ AI hiện tại',LEVELS[p.level]],['Bối cảnh doanh nghiệp',[p.industry,p.size,p.problem].filter(Boolean).join(' · ')],['Quỹ thời gian',`${p.days} ngày · ${p.minPerSession} phút/ngày`],['Nhịp học','Mỗi ngày 1 bài']].map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v||'—')}</dd></div>`).join('')}</dl></div>
   <div class="dw-sec"><h4>Hệ thống đã điều chỉnh</h4><p>${fmt(P.summary)}</p>
    <ul class="dw-list"><li><b>Thứ tự bài học</b><span>Giữ đủ 12 module, đúng thứ tự năng lực</span></li><li><b>Case thực tế</b><span>${extras.length?extras.map(it=>esc(L[it.id].title)).join(' · '):'Không thêm case'}</span></li><li><b>Bài tập</b><span>${Object.keys(TASKS).length} bài áp dụng cho công ty</span></li><li><b>Thời lượng</b><span>${lessons().length} bài · khoảng ${Math.round(planStats().min/lessons().length)} phút/bài</span></li></ul></div>
   ${mods.length?`<div class="dw-sec"><h4>Nội dung từng module</h4><ul class="dw-why">${mods.map(it=>`<li><span class="no">${modNo(L[it.id])}</span><div><b>${esc(L[it.id].cap)}</b><span>${esc(it.reason)}</span></div></li>`).join('')}</ul></div>`:''}
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
  <ol><li>${ic('check',16)} Đọc hồ sơ của anh/chị</li><li>${ic('check',16)} Giữ đủ 12 module</li><li>${ic('check',16)} Chia thành ${lessonsOf(p)} bài học</li></ol></div></section>`;
 if(!S.plan)return `<section class="wrap narrow page"><div class="card gen"><h2 class="h3">Hồ sơ đã sẵn sàng</h2>${T.err.gen?`<p class="err">${esc(T.err.gen)}</p>`:''}<button class="btn btn-primary btn-lg" data-a="genPlan">${ic('spark')} Tạo lộ trình</button></div></section>`;
 const P=S.plan,st=planStats(),ni=nextLesson(),avg=Math.round(st.min/st.n);
 const cta=!P.accepted?`<button class="btn btn-primary btn-lg" data-a="acceptPlan" ${P.warning?'disabled':''}>${P.wasActive?'Lưu lộ trình':'Bắt đầu học'} ${ic('arrow',16)}</button>`
  :ni>=0?`<button class="btn btn-primary btn-lg" data-a="openLesson" data-v="${ni}">${st.lessonsDone===0&&subsCount()===0?'Bắt đầu học':'Học tiếp'} ${ic('arrow',16)}</button>`:`<button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button>`;
 const head=`<section class="card cl-hero"><div class="cl-hero-l">
   <h1>Lộ trình của anh/chị</h1>
   <p class="cl-sum">${st.n} bài · ${P.profile.days} ngày · ~${avg} phút/ngày</p>
   <p class="cl-sub">${ic('spark',14)} <button class="btn-link" data-a="drawerOpen" data-v="why">Vì sao tôi nhận lộ trình này?</button></p>
   <div class="cl-bar"><span><i style="width:${st.pct}%"></i></span><b>${st.pct}% hoàn thành</b></div></div>
  <div class="cl-hero-r">${cta}<button class="btn btn-line" data-a="drawerOpen" data-v="adjust">${ic('refresh',15)} Điều chỉnh lộ trình</button></div></section>`;
 const warn=P.warning?`<div class="callout warn cl-warn"><b>Mỗi bài khoảng ${P.warning.perLesson} phút, vượt ${P.profile.minPerSession} phút/ngày</b><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-a="fixDays" data-v="${Math.min(P.warning.needDays,MAX_DAYS)}">Học trong ${Math.min(P.warning.needDays,MAX_DAYS)} ngày</button>${P.warning.needMin?`<button class="btn btn-line btn-sm" data-a="fixPace" data-v="${P.warning.needMin}">Học ${P.warning.needMin} phút/ngày</button>`:''}</div></div>`:'';
 const cards=[[st.n,'Bài học','var(--blue)','book'],[CAP_MAP.length,'Năng lực AI','var(--teal)','spark'],[Object.keys(TASKS).length,'Bài tập','var(--purple)','file'],[`${P.profile.days} ngày`,'Lộ trình','var(--orange)','cal']];
 const cardHTML=`<div class="dh-kpis cl-kpis">${cards.map(([v,l,c,i])=>`<div class="dh-kpi" style="--c:${c}"><span class="ico">${ic(i,18)}</span><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
 return `<section class="wrap page cl-page"><div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="go" data-to="${P.wasActive?'learn':'onboarding'}">AI for CEO</button><span>/</span><span>Lộ trình</span></div>
 ${head}${warn}${cardHTML}<section class="cl-sec"><div class="cl-sec-h"><h2 class="h3">Lộ trình của anh/chị</h2>${clToggleBtn('syl')}</div>${courseList('syl',{cta:!!(P.accepted||P.wasActive),why:true})}</section></section>`;
}

/* ---------- 6. Khóa học AI for CEO (Học) ---------- */
function learn(){
 const P=S.plan,st=planStats(),ni=nextLesson();
 const head=`<section class="cl-top"><div><h1>AI for CEO</h1><p class="cl-sum">${st.lessonsDone}/${st.n} bài đã hoàn thành</p><div class="cl-bar"><span><i style="width:${st.pct}%"></i></span><b>${st.pct}%</b></div></div>
  <div class="cl-top-r"><button class="btn btn-line btn-sm" data-a="go" data-to="dashboard">${ic('chart',15)} Dashboard</button><button class="btn btn-ghost btn-sm" data-a="go" data-to="syllabus">${ic('refresh',15)} Điều chỉnh lộ trình</button></div></section>`;
 let next;
 // khối bài đang học: chữ bên trái, nút bên phải (gọn, không để trống)
 if(ni>=0){const ks=P.lessons[ni],dn=ks.filter(k=>S.done[k]).length;
  next=`<section class="cl-next"><div class="cl-next-b"><span class="cl-next-l">Đang học</span><h2>${esc(lessonTitle(ks,ni,P.lessons))}</h2>
   <span class="cl-next-m">Bài ${ni+1} · ${esc(dayLabel(ni))} · ${lessonMin(ks)} phút${dn?` · ${dn}/${ks.length} phần`:''}</span></div>
   <button class="btn btn-primary btn-lg" data-a="openLesson" data-v="${ni}">${dn?'Học tiếp':'Bắt đầu học'} ${ic('arrow',16)}</button></section>`;}
 else next=`<section class="cl-next done"><div class="cl-next-b"><span class="cl-next-l">Hoàn thành</span><h2>Anh/chị đã học hết ${st.n} bài</h2></div><button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button></section>`;
 const side=`<aside class="sticky cl-side">${remindCard()}
  <div class="card pad cl-links"><b>Lối tắt</b>
   <button data-a="go" data-to="outputs">${ic('file',16)}<span>Bài tập của tôi</span><small>${subsCount()}/${Object.keys(TASKS).length}</small></button>
   <button data-a="go" data-to="dashboard">${ic('chart',16)}<span>Dashboard</span></button>
   <button data-a="openCommunity" data-v="aiceo">${ic('users',16)}<span>Cộng đồng</span></button>
   <button data-a="go" data-to="complete">${ic('award',16)}<span>Điều kiện hoàn thành</span></button></div>
  ${eventsCard()}</aside>`;
 return `<section class="wrap page cl-page"><div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><span>AI for CEO</span></div>
 ${head}<div class="two"><div style="display:grid;gap:20px;align-content:start">${remindAsk()}${next}
  <section class="cl-sec"><div class="cl-sec-h"><h2 class="h3">Lộ trình của tôi</h2><div class="cl-sec-r"><span class="hint">${chapters().length} chương · ${st.n} bài</span>${clToggleBtn('learn')}</div></div>${courseList('learn')}</section>
  <div class="demo-box"><span class="t">Công cụ demo</span><div><button class="btn btn-line btn-sm" data-a="simulateAll">Mô phỏng: học xong toàn bộ</button></div></div></div>${side}</div></section>`;
}

/* ---------- 7. Trang bài học ---------- */
// Nội dung hiển thị theo từng phần: video A–D, bài tập, ôn tập, case
function unitContent(u){
 const p=S.profile,x=L[u.id];
 if(u.kind==='review')return `<div class="take"><span class="t">Ôn tập Module ${modNo(x)} · ${esc(x.cap)}</span><p class="big">${esc(x.take)}</p><div><b style="font-size:15px">Mang 3 câu hỏi này vào cuộc họp tuần với đội ngũ</b><ol style="margin-top:8px">${x.qs.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div><p class="hint">Ở công ty ${esc(String(p.industry||'').toLowerCase())}, năng lực này thường được thử trước ở việc ${esc((IND[p.industry]||IND['Khác']).general)}.</p></div>`;
 if(u.kind==='extra')return `<p class="hook">${esc(x.hook)}</p><div class="block"><span class="t">Nội dung video</span><p style="font-size:17px;line-height:1.7">${esc(x.demo)}</p></div><div class="block"><span class="t">Giải thích cho CEO</span><div class="prose">${x.body.map(b=>`<p>${esc(b)}</p>`).join('')}</div></div><div class="take"><span class="t">CEO takeaway</span><p class="big">${esc(x.take)}</p></div>`;
 if(u.part===0)return `<div class="block"><span class="t">Câu hỏi mở vấn đề</span><p class="hook">${esc(x.hook)}</p></div><p class="hint">Tiếp theo: xem AI giải bài toán này.</p>`;
 if(u.part===1)return `<div class="block"><span class="t">Demo: AI làm gì</span><p style="font-size:17.5px;line-height:1.75">${esc(x.demo)}</p></div>`;
 if(u.part===2)return `<div class="block"><span class="t">Giải thích cho CEO</span><div class="prose">${x.body.map(b=>`<p>${esc(b)}</p>`).join('')}</div></div>
  <div class="block"><span class="t">Ý nghĩa với doanh nghiệp</span><ul class="exs">${x.ex.slice().sort((a,b)=>((p.goals||[]).includes(b[0])?1:0)-((p.goals||[]).includes(a[0])?1:0)).map(([d,t])=>`<li class="${(p.goals||[]).includes(d)?'hit':''}"><span class="d">${GOALS[d]}${(p.goals||[]).includes(d)?' · anh/chị quan tâm':''}</span><span>${esc(t)}</span></li>`).join('')}</ul></div>`;
 if(u.kind==='exercise')return exerciseView(u.id);
 return `<div class="take"><span class="t">CEO takeaway</span><p class="big">${esc(x.take)}</p><div><b style="font-size:15px">3 câu hỏi mang về công ty</b><ol style="margin-top:8px">${x.qs.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div><p class="hint">Tiếp theo: bài tập cho công ty.</p></div>`;
}
// Bài tập: form nộp (lần đầu / sửa) hoặc kết quả đã nộp + nhận xét
// Đề bài: lời dẫn + các câu cần trả lời (lấy từ TASKS)
function exBrief(t){return t.kind==='uc'
 ?{intro:'Chọn 3 việc trong công ty anh/chị muốn thử giao cho AI trước. Không cần biết cách triển khai. Với mỗi việc, ghi:',items:['Việc muốn AI làm','Phòng ban thực hiện','Năng lực AI sẽ dùng','Vì sao đáng thử: giá trị, dữ liệu sẵn có, ai phụ trách']}
 :{intro:'Trả lời cho chính công ty của anh/chị.',items:[...t.fields.map(f=>f.label+(f.type==='select'?` (chọn 1: ${f.opts.join(' · ')})`:'')),...(t.linkTask?[t.linkTask]:[])]};}
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
 const t=TASKS[id],s0=S.subs[id],edit=!s0||T.editEx===id,b=exBrief(t),m=exMode(t),sl=submitLabel(t),req=k=>m.need.includes(k)?' <span class="req">*</span>':'';
 const brief=`<section class="ex-brief" aria-labelledby="exb-${id}"><h4 id="exb-${id}">${ic('file',17)} Đề bài</h4><p>${esc(b.intro)}</p><ol>${b.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
  <dl class="ex-req"><div><dt>${ic('upload',15)} Hình thức nộp</dt><dd>${sl.main}${sl.opt?`<small>${sl.opt}</small>`:''}${t.linkHint&&m.allow.includes('link')?`<small>Link: ${esc(t.linkHint)}</small>`:''}${t.fileHint&&m.allow.includes('file')?`<small>Tệp: ${esc(t.fileHint)}</small>`:''}</dd></div><div><dt>${ic('spark',15)} Cách chấm</dt><dd>AI chấm tự động, thang 10 điểm, từ ${EX_PASS} điểm là Đạt<small>Tiêu chí: ${EX_CRIT.map(c=>c[1]).join(' · ')}. Có nhận xét từng câu.</small></dd></div></dl></section>`;
 const head=`<div class="ex-h"><div><span class="t">Bài tập · Module ${modNo(L[id])} · khoảng ${t.min} phút</span><h3 class="h3">${esc(t.title)}</h3></div>${s0&&!edit?`<span class="pill ok">${ic('check',12)} Đã nộp ${esc(s0.at)}${s0.v>1?` · lần ${s0.v}`:''}</span>`:s0?'<span class="pill wait">Đang sửa bài đã nộp</span>':''}</div>`;
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
/* ---------- thanh điều khiển video (mô phỏng): âm lượng, cài đặt, cửa sổ riêng, toàn màn hình ----------
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
 const P=S.plan;if(P&&!lessonOpen(S.lesson)){S.lesson=nextLesson();S.unit=null;}
 const li=S.lesson;const ks=P&&P.lessons[li];if(!ks){S.screen='learn';return learn();}
 if(!S.unit||!ks.includes(S.unit))S.unit=ks.find(k=>!S.done[k])||ks[0];
 const u=U(S.unit),x=L[u.id],pos=ks.indexOf(S.unit),doneN=ks.filter(k=>S.done[k]).length;
 const needArt=u.kind==='exercise'&&!S.subs[u.id];
 const isLast=pos===ks.length-1,back=lessonBack();
 const vt=u.kind==='review'?'Ôn tập & liên hệ công ty':x.title;
 const player=u.kind==='exercise'?'':`<div class="player" data-title="${esc(vt)}" data-label="${esc(unitLabel(u))}"><div class="center"><button class="play" data-a="playUnit" aria-label="Phát video">${ic('play',26)}</button><span class="t">${esc(unitLabel(u))}</span><h3>${esc(vt)}</h3></div><div class="bottom"><span>${S.done[S.unit]?'Đã xem':'0:00'}</span><span class="track"><i style="width:${S.done[S.unit]?100:0}%"></i></span><span class="tnum">${u.m}:00</span><span class="vp-speed" ${T.vp.speed===1?'hidden':''}>${String(T.vp.speed).replace('.',',')}×</span>${vpControls()}</div>${vpMenu()}${T.vp.cc?`<p class="vp-cc">${esc(vt)}</p>`:''}</div>`;
 const list=`<div class="ulist">${ks.map((k,i)=>{const v=U(k);return `<button class="${k===S.unit?'on':''} ${S.done[k]?'done':''}" data-a="selUnit" data-v="${k}"><span class="st">${ic('check',12)}</span><span><small>${esc(v.kind==='video'?`Module ${modNo(L[v.id])} · Video ${'ABCD'[v.part]}`:v.kind==='exercise'?`Module ${modNo(L[v.id])} · Bài tập`:v.kind==='review'?'Ôn tập':TYPE_LABEL[L[v.id].type])}</small><b>${esc(v.kind==='video'?PARTS[v.part]:v.kind==='exercise'?TASKS[v.id].title:v.kind==='review'?'Liên hệ công ty: Module '+modNo(L[v.id]):L[v.id].title)}</b></span><span class="mn tnum">${v.m}′</span></button>`;}).join('')}</div>`;
 const nextBtn=needArt?`<p class="hint">Nộp bài tập ở trên để hoàn thành phần này.</p>`:
  `<button class="btn btn-primary btn-lg" data-a="markNext">${S.done[S.unit]&&isLast?`${lessonDone(li)?'Bài tiếp theo':'Hoàn thành bài '+(li+1)}`:isLast?`${u.kind==='exercise'?'Tiếp tục · ':''}Hoàn thành bài ${li+1}`:`${u.kind==='exercise'?'Tiếp tục':'Hoàn thành · Video tiếp theo'}`} ${ic('arrow')}</button>`;
 return `<section class="wrap page lesson">
 <div class="lsn-top"><button class="btn btn-line btn-sm" data-a="${back.a}">${ic('back',15)} ${back.t}</button>
  <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="backToList">AI for CEO</button><span>/</span>${S.from==='outputs'?`<button data-a="backToOutputs">Bài tập của tôi</button><span>/</span>`:''}<span>Bài ${li+1}</span></div></div>
 <div style="display:grid;gap:12px;margin-bottom:24px"><div class="meta"><span class="ty">Bài ${li+1}/${P.lessons.length} · ${dayLabel(li,P.profile)}</span><span>${ic('video',14)} ${ks.filter(k=>U(k).kind!=='exercise').length} video${ks.some(k=>U(k).kind==='exercise')?` · ${ks.filter(k=>U(k).kind==='exercise').length} bài tập`:''}</span><span>${ic('clock',14)} ${lessonMin(ks)} phút</span><span class="tnum">${doneN}/${ks.length} đã hoàn thành</span></div><h1>${esc(lessonTitle(ks))}</h1><div class="bar" style="max-width:420px"><i style="width:${Math.round(doneN/ks.length*100)}%"></i></div></div>
 <div class="lsn">
  <div style="display:grid;gap:24px">${player}${unitContent(u)}<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${nextBtn}<button class="btn btn-line" data-a="asstLesson">${ic('bot',16)} Hỏi Trợ lý AI</button></div></div>
  <aside class="sticky" style="display:grid;gap:14px"><div><b style="font-size:15px">Trong bài ${li+1}</b><p class="hint">${ks.length} video · ${lessonMin(ks)} phút</p></div>${list}
   <div style="display:flex;justify-content:space-between;gap:8px">${li>0?`<button class="btn btn-ghost btn-sm" data-a="openLesson" data-v="${li-1}">${ic('back',15)} Bài ${li}</button>`:'<span></span>'}${li<P.lessons.length-1?(lessonOpen(li+1)?`<button class="btn btn-ghost btn-sm" data-a="openLesson" data-v="${li+1}">Bài ${li+2} ${ic('arrow',15)}</button>`:`<button class="btn btn-ghost btn-sm" disabled title="${esc(lockMsg(li+1))}">${ic('lock',14)} Bài ${li+2}</button>`):''}</div>
   ${li<P.lessons.length-1&&!lessonOpen(li+1)?`<p class="hint">${ic('lock',13)} Bài ${li+2} mở sau khi anh/chị học xong bài này.</p>`:''}</aside>
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
  return `<article class="card pad out" id="out-${id}"><div class="ex-h"><div><span class="t">Module ${modNo(L[id])} · ${esc(L[id].cap)}${li>=0?` · Bài ${li+1}`:''}</span><h3 class="h3">${esc(t.title)}</h3></div>${s?`<span class="pill ok">Đã nộp</span>`:`<span class="pill wait">Chưa nộp</span>`}</div>
  ${s?`<p class="prev">${esc(prev)}</p><p class="hint">${ic('clock',13)} ${esc(s.at)}${s.v>1?` · nộp lần ${s.v}`:''}${(s.links||[]).length?` · ${ic('link',13)} ${s.links.length} link`:''}${(s.files||[]).length?` · ${ic('clip',13)} ${s.files.length} tệp`:''}${s.feedback&&s.feedback.score!=null?` · <b class="${s.feedback.pass?'ok-t':'warn-t'}">${exScore(s.feedback.score)}/10 ${s.feedback.pass?'Đạt':'Cần bổ sung'}</b>`:''}</p>`:`<p class="prev muted">Bài tập nằm cuối Module ${modNo(L[id])}${li>=0?`, trong Bài ${li+1} của lộ trình`:''}.</p>`}
  <div>${li<0?'':s||lessonOpen(li)?`<button class="btn ${s?'btn-line':'btn-primary'} btn-sm" data-a="openEx" data-v="${id}">${s?'Xem & sửa':'Làm bài tập'} ${ic('arrow',15)}</button>`:`<span class="hint">${ic('lock',13)} Mở khi anh/chị học tới Bài ${li+1}</span>`}</div></article>`;}).join('')}</div>
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
 const checks=[[`Hoàn thành ${st.n} bài học`,`${st.lessonsDone}/${st.n}`,st.lessonsDone===st.n],[`Nộp ${Object.keys(TASKS).length} bài tập`,`${subsCount()}/${Object.keys(TASKS).length}`,subsCount()===Object.keys(TASKS).length]];
 const ok=checks.every(c=>c[2]);if(ok&&!S.completedAt){S.completedAt=today();save();}
 const missing=lessons().map((ks,i)=>i).filter(i=>!lessonDone(i));
 const head=`<div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="go" data-to="learn">AI for CEO</button><span>/</span><span>Hoàn thành chương trình</span></div>`;
 const checkCard=`<article class="card pad"><h3 class="h3" style="margin-bottom:8px">Điều kiện hoàn thành</h3><ul class="checks">${checks.map(([l,v,d])=>`<li><span class="st ${d?'ok':'no'}">${ic(d?'check':'x',12)}</span><span>${l}</span><b class="tnum">${v}</b></li>`).join('')}</ul></article>`;
 if(!ok)return `<section class="wrap narrow page">${head}<div class="page-head"><span class="eyebrow">Hoàn thành</span><h2 class="h2">Anh/chị còn thiếu một vài bước</h2><p class="sub">Học hết các bài và nộp đủ bài tập để nhận certificate.</p></div><div style="display:grid;gap:18px">${checkCard}
  ${missing.length?`<article class="card pad"><h3 class="h3" style="margin-bottom:12px">Bài học chưa xong</h3><ul class="promise">${missing.map(i=>lessonOpen(i)?`<li>${ic('arrow')}<button class="btn-link" style="text-align:left" data-a="openLesson" data-v="${i}">Bài ${i+1}: ${esc(lessonTitle(lessons()[i]))}</button></li>`:`<li class="muted">${ic('lock')}<span>Bài ${i+1}: ${esc(lessonTitle(lessons()[i]))}</span></li>`).join('')}</ul></article>`:''}
  <div><button class="btn btn-primary btn-lg" data-a="go" data-to="learn">Tiếp tục học ${ic('arrow')}</button></div></div></section>`;
 const p=S.profile;const uc=S.subs.M12||{};
 return `<section class="wrap page">${head}
 <div class="cert-wrap"><canvas id="cert-cv" width="2000" height="1414" role="img" aria-label="Chứng nhận hoàn thành AI for CEO của ${esc(p.name||'')}, mã ${certCode()}"></canvas>
  <div class="cert-act"><button class="btn btn-primary" data-a="certDownload">${ic('download',16)} Tải chứng nhận (PNG)</button><button class="btn btn-line" data-a="certPrint">${ic('file',16)} In / Lưu PDF</button><button class="btn dh-btn-fb solid" data-a="certShare">${ic('fb',16)} Chia sẻ lên Facebook</button><span class="hint">Mã chứng nhận ${certCode()} · cấp ngày ${esc(certDate())}</span></div></div>
 <div style="margin-top:24px">${feedbackSection()}</div>
 <div class="grid g2" style="margin-top:24px;align-items:start">
  <article class="card pad"><h3 class="h3" style="margin-bottom:12px">3 use case anh/chị chọn</h3>${uc.text?`<div class="ex-text">${fmt(uc.text)}</div>`:''}${(uc.files||[]).length?`<ul class="ex-files">${uc.files.map(f=>`<li>${exFileLink(f)}</li>`).join('')}</ul>`:''}
   <div class="kv" style="margin-top:16px"><div><span>Bài học</span><b class="tnum">${st.lessonsDone}/${st.n}</b></div><div><span>Bài tập đã nộp</span><b class="tnum">${subsCount()}/${Object.keys(TASKS).length}</b></div><div><span>Thời gian học</span><b class="tnum">${dashStats().studyDays} ngày</b></div></div>
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
 const mods=LIB.filter(x=>x.type==='module').length,enr=S.enrolled;
 // đã mua khóa: chỉ còn nút "Vào học" ở cuối thẻ (rộng hết thẻ); chưa mua: giá + nút "Đăng ký"
 const cta=enr?`<button class="btn btn-primary btn-lg" data-a="openCourse">Vào học ${ic('arrow')}</button>`
  :`<button class="btn btn-primary btn-lg" data-a="go" data-to="checkout">Đăng ký ${ic('arrow')}</button>`;
 return `<section class="wrap page crs">
 <div class="page-head"><span class="eyebrow">Học viện Siêu Tăng Trưởng</span><h1 class="h2">Khóa học</h1></div>
 <div class="crs-grid"><article class="card crs-feat">
  <button class="crs-thumb" data-a="go" data-to="landing" aria-label="Xem giới thiệu khóa AI for CEO">${COURSE.cover?`<img class="crs-cover" src="${esc(COURSE.cover)}" alt="">`:''}<span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">${mods} module · ${CAP_MAP.length} năng lực</span></button>
  <div class="crs-body">
   
   <h2 class="crs-name">AI for CEO</h2>
   <p class="crs-desc">Khóa cập nhật năng lực AI dành cho CEO qua các ví dụ thực tế. Không học tool, không học prompt: tận mắt thấy AI đã làm được gì.</p>
   <div class="crs-foot${enr?' enr':''}">
    ${enr?''
     :`<div class="crs-price" title="${esc(COURSE.promo)}"><b class="tnum">${money(COURSE.price)}</b><span class="crs-old"><span class="strike tnum">${money(COURSE.list)}</span><span class="crs-off">−${OFF}%</span></span></div>`}
    <div class="crs-cta">${cta}</div>
   </div>
  </div>
 </article></div>
 <p class="crs-more">${ic('spark',15)} Các khóa học khác của Học viện sẽ sớm được cập nhật tại đây.</p>
 </section>`;
}

const SCREENS={courses,landing,account,checkout,mycourses,onboarding,syllabus,learn,lesson,complete,outputs,dashboard,community};
