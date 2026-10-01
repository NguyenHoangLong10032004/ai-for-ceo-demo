/* =========================================================
   SCREENS — dựng giao diện từng màn hình (trả về chuỗi HTML)
   Mỗi màn hình là 1 hàm, đăng ký trong SCREENS ở cuối file.
   ========================================================= */

/* ---------- thành phần dùng chung ---------- */
function demoBar(){
 const cur=S.screen==='lesson'?'learn':S.screen;
 return `<div class="demo"><div class="wrap"><span class="demo-tag">Demo</span>
 <nav class="demo-steps" aria-label="Các bước trong luồng">${STAGES.map(([k,l],i)=>`<button class="${cur===k?'on':''}" data-a="jump" data-to="${k}"><b>${i+1}</b>${l}</button>`).join('')}</nav>
 ${aiDot()}<button class="demo-reset" data-a="reset">${ic('refresh',13)} Làm lại</button></div></div>`;
}
function header(){
 const name=S.enrolled?(S.profile.name||(S.order&&S.order.name)||''):'';
 const inCourse=['mycourses','onboarding','syllabus','learn','lesson','complete','outputs'].includes(S.screen);
 return `<header class="hdr"><div class="wrap">
 <button class="logo" data-a="go" data-to="landing" aria-label="Trang chủ"><img class="logo-img" src="img/logo.png" onerror="this.onerror=null;this.src='../Logo.png'" alt="Siêu Tăng Trưởng" width="1725" height="237"></button>
 <nav class="nav"><button class="${!inCourse?'on':''}" data-a="go" data-to="landing">AI for CEO</button><button data-a="go" data-to="landing">Khóa học</button><button data-a="go" data-to="landing">Thử thách</button><button data-a="go" data-to="landing">Blog / Tin tức</button>${S.enrolled?`<button class="${inCourse?'on':''}" data-a="go" data-to="mycourses">Khóa học của tôi</button>`:''}</nav>
 <div class="hdr-r">${name?`<button class="me" data-a="go" data-to="mycourses"><span class="avatar">${esc(name.trim().split(/\s+/).pop()[0]||'N')}</span><span class="n">${esc(name)}</span></button>`:`<button class="btn btn-ghost btn-sm" data-a="go" data-to="checkout">Đăng nhập</button><button class="btn btn-primary btn-sm" data-a="go" data-to="checkout">Đăng ký</button>`}</div>
 </div></header>`;
}
function secHead(eyebrow,title,sub){return `<div class="sec-head"><span class="eyebrow">${eyebrow}</span><h2 class="h2">${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div>`;}
function footer(){return `<footer class="ftr"><div class="wrap"><span>© Học viện Siêu Tăng Trưởng · Bản demo prototype luồng AI for CEO do BlueBolt thực hiện.</span><span>Case và dữ liệu trong demo là minh họa.</span></div></footer>`;}
function priceTag(){return `<span class="tnum" style="font-weight:800;font-size:28px;letter-spacing:-.02em">${money(COURSE.price)}</span><span class="strike tnum">${money(COURSE.list)}</span><span class="promo">${ic('tag',13)} ${COURSE.promo} · −${OFF}%</span>`;}
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

<section class="band" id="modules"><div class="wrap sec">${secHead('12 module · 12 năng lực','Mỗi module là một năng lực, mỗi năng lực có demo thật','Mỗi module gồm 4 video ngắn (mở vấn đề, demo năng lực, giải thích cho CEO, CEO takeaway) và 1 bài tập áp dụng cho công ty. Các module được chia thành bài học theo lịch anh/chị chọn.')}
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
 const o=S.order||{name:SAMPLE_PROFILE.name,phone:'0912 345 678',email:'long.nguyen@minhan.vn',company:SAMPLE_PROFILE.company,invoice:true,taxId:'0312345678',invName:SAMPLE_PROFILE.company,invAddr:'125 Nguyễn Văn Linh, Quận 7, TP.HCM'};
 const st=S.pay.status;
 const steps=['Xác nhận','Thông tin','Thanh toán','Hoàn tất'];const at=st==='success'?3:st?2:1;
 const stepper=`<div class="stepper">${steps.map((s,i)=>`<span class="${i<at?'ok':i===at?'on':''}"><i>${i<at?'✓':i+1}</i>${s}</span>`).join('')}</div>`;
 const summary=`<aside class="card pad sticky"><h3 class="h3" style="margin-bottom:10px">Đơn đăng ký</h3>
  <div class="sum-row"><span class="k">Chương trình</span><span class="v">AI for CEO · Trọn khóa</span></div>
  <div class="sum-row"><span class="k">Học phí</span><span class="v tnum">${money(COURSE.list)}</span></div>
  <div class="sum-row disc"><span class="k">${COURSE.promo}</span><span class="v tnum">−${money(SAVE)}</span></div>
  <div class="sum-row" style="align-items:center"><span class="k">Tổng thanh toán</span><span class="v total tnum">${money(COURSE.price)}</span></div>
  <ul class="promise" style="margin-top:16px;font-size:13.5px;gap:10px">${COURSE.perks.slice(0,4).map(x=>`<li>${ic('check',15)}<span>${x}</span></li>`).join('')}</ul></aside>`;
 let main;
 if(st==='processing')main=`<div class="card status"><div class="spin" role="status" aria-label="Đang xử lý"></div><h3 class="h3">Đang xử lý giao dịch…</h3><p class="muted">Vui lòng không đóng trang.</p></div>`;
 else if(st==='failed')main=`<div class="card status"><span class="big bad">${ic('x',28)}</span><h3 class="h3">Giao dịch chưa thành công</h3><p class="muted" style="max-width:46ch">Ngân hàng từ chối giao dịch (mô phỏng). Tiền chưa bị trừ. Anh/chị có thể thử lại, đổi phương thức, hoặc nhờ hỗ trợ.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-primary" data-a="payRetry">Thử lại</button><button class="btn btn-line" data-a="payChange">Đổi phương thức</button><button class="btn btn-line" data-a="paySupport">${ic('headset',16)} Cần hỗ trợ</button></div>
  ${S.pay.support?`<div class="callout info" style="text-align:left"><b>Hỗ trợ thanh toán</b><span>Đội CSKH đã nhận yêu cầu và sẽ gọi lại trong 15 phút (mô phỏng). Hotline minh họa: <b class="tnum">1900 0000</b>. Mã đơn: <b>${esc(S.order.code)}</b>.</span></div>`:''}</div>`;
 else if(st==='success')main=`<div class="card status"><span class="big ok">${ic('check',30)}</span><h3 class="h2" style="font-size:28px">Đăng ký thành công</h3><p class="muted" style="max-width:50ch">Thanh toán đã được ghi nhận và quyền truy cập khóa AI for CEO đã được kích hoạt cho <b>${esc(S.order.email)}</b>.${S.order.invoice?' Hóa đơn điện tử sẽ được xuất theo thông tin công ty đã cung cấp.':''}</p>
  <div style="width:100%;max-width:420px;text-align:left;border-top:1px solid var(--line)"><div class="sum-row"><span class="k">Mã đơn</span><span class="v tnum">${esc(S.order.code)}</span></div><div class="sum-row"><span class="k">Học viên</span><span class="v">${esc(S.order.name)}</span></div><div class="sum-row"><span class="k">Đã thanh toán</span><span class="v tnum">${money(COURSE.price)}</span></div><div class="sum-row"><span class="k">Trạng thái</span><span class="v"><span class="pill ok">Đã kích hoạt</span></span></div></div>
  <button class="btn btn-primary btn-lg" data-a="go" data-to="mycourses">Vào khóa học ${ic('arrow')}</button></div>`;
 else main=`<form class="card form" data-f="checkoutSubmit">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3 class="h3">Thông tin người học</h3><span class="sample-tag">Dữ liệu mẫu, sửa tùy ý</span></div>
  <div class="row2"><div class="field"><label for="c-name">Họ và tên</label><input class="inp" id="c-name" name="name" value="${esc(o.name)}"></div><div class="field"><label for="c-phone">Số điện thoại / Zalo</label><input class="inp" id="c-phone" name="phone" value="${esc(o.phone)}"></div></div>
  <div class="row2"><div class="field"><label for="c-email">Email nhận tài khoản</label><input class="inp" id="c-email" name="email" type="email" value="${esc(o.email)}"></div><div class="field"><label for="c-company">Công ty</label><input class="inp" id="c-company" name="company" value="${esc(o.company)}"></div></div>
  <label class="opt" for="c-inv" style="justify-self:start"><input type="checkbox" id="c-inv" name="invoice" ${o.invoice?'checked':''} data-a="invToggle"><span>Xuất hóa đơn cho công ty</span></label>
  <div class="row2" id="inv-box" ${o.invoice?'':'hidden'}><div class="field"><label for="c-tax">Mã số thuế</label><input class="inp" id="c-tax" name="taxId" value="${esc(o.taxId||'')}"></div><div class="field"><label for="c-invname">Tên công ty trên hóa đơn</label><input class="inp" id="c-invname" name="invName" value="${esc(o.invName||'')}"></div><div class="field" style="grid-column:1/-1"><label for="c-invaddr">Địa chỉ</label><input class="inp" id="c-invaddr" name="invAddr" value="${esc(o.invAddr||'')}"></div></div>
  <fieldset><legend>Phương thức thanh toán</legend><div class="opt-grid">${[['qr','Chuyển khoản QR (VietQR)'],['vnpay','VNPay: ATM, ví điện tử'],['card','Thẻ Visa/Mastercard'],['company','Chuyển khoản công ty theo hóa đơn']].map(([v,l],i)=>`<label class="opt" for="pm-${i}"><input type="radio" id="pm-${i}" name="method" value="${v}" ${S.pay.method===v?'checked':''}><span>${l}</span></label>`).join('')}</div></fieldset>
  <div class="demo-box"><span class="t">Mô phỏng cổng thanh toán</span><div class="seg" role="group" aria-label="Kết quả mô phỏng"><button type="button" class="${S.pay.sim==='success'?'on':''}" data-a="paySim" data-v="success">Thành công</button><button type="button" class="${S.pay.sim==='fail'?'on':''}" data-a="paySim" data-v="fail">Thất bại</button></div></div>
  ${T.err.checkout?`<p class="err">${T.err.checkout}</p>`:''}
  <div class="form-foot"><span class="hint">Bấm thanh toán là anh/chị đồng ý với điều khoản khóa học.</span><button class="btn btn-primary btn-lg">Thanh toán ${money(COURSE.price)}</button></div></form>`;
 return `<section class="wrap page"><div class="crumbs"><button data-a="go" data-to="landing">AI for CEO</button><span>/</span><span>Đăng ký & thanh toán</span></div>${stepper}<div class="two"><div>${main}</div>${summary}</div></section>`;
}

/* ---------- 3. Khóa học của tôi ---------- */
function mycourses(){
 const started=S.ob.done&&S.plan&&(S.plan.accepted||S.plan.wasActive);const st=started?planStats():null;
 const fresh=!S.ob.flow.length&&!S.ob.done;
 const status=fresh?['Chưa bắt đầu','wait']:!S.ob.done?['Đang onboarding','blue']:!started?['Chờ xác nhận lộ trình','blue']:st.lessonsDone===st.n&&subsCount()===Object.keys(TASKS).length?['Đã hoàn thành','ok']:['Đang học','blue'];
 const cta=fresh?'Bắt đầu khóa học':!S.ob.done?'Tiếp tục onboarding':!started?'Xem & xác nhận lộ trình':'Học tiếp';
 const ni=started?nextLesson():-1;
 return `<section class="wrap page">
 <div class="page-head"><span class="eyebrow">Tài khoản học viên</span><h2 class="h2">Khóa học của tôi</h2><p class="sub">Các khóa học anh/chị đã đăng ký tại Học viện Siêu Tăng Trưởng.</p></div>
 <div class="grid g2" style="align-items:start">
  <article class="card course"><button class="course-thumb" data-a="openCourse" aria-label="Mở khóa AI for CEO"><span class="k">Khóa học trọng tâm</span><span class="n">AI for <b>CEO</b></span><span class="s">12 module · 12 bài tập · Live Zoom hằng tháng</span></button>
   <div class="pad" style="display:grid;gap:14px">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3 class="h3">AI for CEO</h3><span class="pill ${status[1]}">${status[0]}</span></div>
    ${started?`<div style="display:grid;gap:6px"><div class="bar"><i style="width:${st.pct}%"></i></div><span class="hint tnum">${st.lessonsDone}/${st.n} bài học · ${subsCount()}/${Object.keys(TASKS).length} bài tập${ni>=0?` · Tiếp theo: Bài ${ni+1}`:''}</span></div>`
     :`<p class="hint">${fresh?'Bước đầu tiên: trò chuyện 2 phút với Trợ lý lộ trình để chia khóa thành bài học theo lịch của anh/chị.':'Anh/chị đang dở phần onboarding với Trợ lý lộ trình.'}</p>`}
    <div class="kv"><div><span>Kích hoạt</span><b>${esc((S.order&&S.order.paidAt)||today())}</b></div><div><span>Mã đơn</span><b class="tnum">${esc((S.order&&S.order.code)||'')}</b></div><div><span>Thời hạn truy cập</span><b>Trọn đời</b></div></div>
    <button class="btn btn-primary btn-lg btn-block" data-a="openCourse">${cta} ${ic('arrow')}</button>
   </div></article>
  <article class="card pad" style="display:grid;gap:10px;align-content:start;border-style:dashed"><h3 class="h3">Khám phá thêm</h3><p class="muted">Các chương trình khác của Học viện: thử thách 3 ngày, khóa chuyên đề, cộng đồng.</p><div><button class="btn btn-line btn-sm" data-a="go" data-to="landing">Xem khóa học ${ic('arrow',15)}</button></div></article>
 </div></section>`;
}

/* ---------- 4. Onboarding (chatbot lộ trình) ---------- */
function onboarding(){
 if(!S.ob.flow.length&&!S.ob.done)startOb();
 if(S.ob.flow.some(s=>!Q[s]))fixOb();
 if(!S.ob.done&&S.ob.i>=S.ob.flow.length&&!T.obTyping)finishOb();
 const p=S.profile;const st=S.ob.flow[S.ob.i];const fromEval=!!S.eval;
 const rows=[['Ngành',p.industry,fromEval],['Quy mô nhân sự',p.size,fromEval],['Hiện trạng sử dụng AI',p.level?LEVELS[p.level]:'',fromEval],['Phòng ban quan tâm',p.goals&&p.goals.length?goalsText(p.goals):'',fromEval],['Bài toán muốn giải',p.problem,false],['Thời gian hoàn thành',p.days?`${p.days} ngày`:'',false],['Thời gian mỗi ngày',p.minPerSession?p.minPerSession+' phút':'',false],['Số bài học',profileComplete(p)?lessonsOf(p)+' bài, mỗi ngày 1 bài':'',false]];
 const need=[p.industry,p.size,p.level,p.goals&&p.goals.length,p.days,p.minPerSession];const pct=Math.round(need.filter(Boolean).length/need.length*100);
 let chips='';
 if(st&&!T.obTyping){const q=Q[st];chips=q.chips(p).map(([v,l])=>q.multi?`<button class="chip ${S.ob.multi.includes(v)?'on':''}" data-a="obToggle" data-v="${esc(v)}">${esc(l)}</button>`:`<button class="chip" data-a="obChip" data-v="${esc(v)}" data-l="${esc(l)}">${esc(l)}</button>`).join('')+(q.multi?`<button class="chip cta" data-a="obGoalsDone" ${S.ob.multi.length?'':'disabled'}>Xong</button>`:'');}
 if(S.ob.done)chips=`<button class="chip cta" data-a="genPlan">${ic('spark',14)} Tạo lộ trình cá nhân</button>`;
 return `<section class="wrap page">
 <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><span>AI for CEO</span><span>/</span><span>Onboarding</span></div>
 <div class="page-head"><span class="eyebrow">AI for CEO · Onboarding</span><h2 class="h2">Chào mừng anh/chị ${esc(firstName())}</h2><p class="sub" style="max-width:none">12 module đi qua 5 chương, từ "AI biết" đến "AI tự thực hiện công việc". Trợ lý lộ trình sẽ chia khóa thành bài học theo số ngày anh/chị muốn hoàn thành.</p>
 <div class="phases">${PHASES.map((x,i)=>`<span><b>${i+1}</b>${x.name}</span>`).join('')}</div></div>
 <div class="two"><div class="card chat">
  <div class="chat-h"><span class="bot-av">${ic('bot')}</span><div><b>Trợ lý lộ trình</b><span>Cá nhân hóa lộ trình theo hồ sơ của anh/chị</span></div><span class="step-count" aria-live="polite">${S.ob.done?`${ic('check',14)} Hồ sơ đã đủ`:`Câu ${Math.min(S.ob.i+1,S.ob.flow.length)}/${S.ob.flow.length}`}</span></div>
  <div class="chat-log" id="ob-log">${S.ob.msgs.map(m=>`<div class="msg ${m.role}">${fmt(m.text)}</div>`).join('')}${T.obTyping?'<div class="msg bot typing">Đang soạn…</div>':''}</div>
  <div class="chips">${chips}</div>
  <form class="chat-in" data-f="obSend"><input class="inp" id="ob-in" name="t" autocomplete="off" placeholder="${st==='days'?'Ví dụ: 10 ngày, 3 tuần…':st==='problem'?'Mô tả bài toán của công ty…':'Hoặc gõ câu trả lời…'}"><button class="send" aria-label="Gửi">${ic('send')}</button></form>
 </div>
 <aside class="card pad prof sticky"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h3>Hồ sơ học viên</h3><b class="tnum">${pct}%</b></div><div class="bar" style="margin-bottom:10px"><i style="width:${pct}%"></i></div>
  ${rows.map(([k,v,ev])=>`<div class="prof-row"><span class="k">${k}</span><span class="v ${v?'':'empty'}">${v?esc(v):k==='Bài toán muốn giải'&&S.ob.done?'Không nêu':'Chưa trả lời'}${v&&ev?'<small>Từ bài đánh giá</small>':''}</span></div>`).join('')}</aside></div></section>`;
}

/* ---------- danh sách bài học dùng chung (Lộ trình + Khóa học) ---------- */
// Nhóm bài theo chương; mỗi chương thu gọn/mở ra được, mặc định chỉ mở chương đang học
function lessonListHTML(active,opt={}){
 const P=S.plan,ni=nextLesson();
 const groups=[];P.lessons.forEach((ks,i)=>{const ph=L[U(ks[0]).id].phase;let g=groups[groups.length-1];if(!g||g.ph!==ph){g={ph,idx:[]};groups.push(g);}g.idx.push(i);});
 const phName=ph=>PHASES.find(x=>x.id===ph).name,phNo=ph=>PHASES.findIndex(x=>x.id===ph)+1;
 const range=idx=>idx.length>1?`Ngày ${idx[0]+1}–${idx[idx.length-1]+1}`:`Ngày ${idx[0]+1}`;
 const row=i=>{const ks=P.lessons[i],done=lessonDone(i),cur=i===ni&&active;
  const mods=[...new Set(ks.map(k=>U(k).id))].map(id=>L[id]);
  const firsts=ks.filter(k=>{const u=U(k);return (u.kind==='video'&&u.part===0)||u.kind==='extra';});
  const rs=opt.why?reasonsFor(firsts):[];const vd=ks.filter(k=>S.done[k]).length;
  const title=esc(lessonTitle(ks,i,P.lessons));
  const locked=active&&!lessonOpen(i);
  const status=done?`<span class="pill ok">Đã học</span>`:cur?`<span class="pill blue">Hôm nay</span>`:locked?`<span class="pill lock" title="${esc(lockMsg(i))}">${ic('lock',11)} Chưa mở</span>`:vd?`<span class="pill wait tnum">${vd}/${ks.length} phần</span>`:'';
  return `<li class="lrow ${done?'done':''} ${cur?'cur':''} ${locked?'locked':''}" id="lr-${opt.key||'list'}-${i}">
   <span class="dot" aria-hidden="true">${i+1}${done?`<i class="tick">${ic('check',10)}</i>`:''}</span>
   <div class="lbody">
    <div class="lmeta"><span class="tnum">Ngày ${i+1} · ${esc(dayDate(i))}</span>${mods.map(x=>`<span class="mt">${x.type==='module'?`Module ${modNo(x)}`:TYPE_LABEL[x.type]}</span>`).join('')}</div>
    <div class="tt">${active&&!locked?`<button data-a="openLesson" data-v="${i}">${title}</button>`:title}</div>
    <ul class="lcontent">${ks.map(k=>{const u=U(k),l=unitLine(u);return `<li class="${S.done[k]?'done':''}">${ic(S.done[k]?'check':l.icon,14)}<span>${esc(l.t)}</span><span class="m tnum">${u.m} phút</span></li>`;}).join('')}</ul>
    ${rs.length?`<p class="why">${ic('spark',13)}<span>${esc(rs.join(' · '))}</span></p>`:''}
   </div>
   <div class="mn"><span class="tnum">${lessonMin(ks)} phút</span>${status}${active&&opt.open&&cur?`<button class="btn btn-primary btn-sm" data-a="openLesson" data-v="${i}">${vd?'Học tiếp':'Bắt đầu'}</button>`:''}</div>
  </li>`;};
 const key=opt.key||'list',curG=Math.max(0,groups.findIndex(g=>g.idx.includes(ni)));
 if(!T.ph[key])T.ph[key]=[curG];
 // vừa quay lại từ một bài: mở sẵn chương chứa bài đó
 if(T.focusLesson!=null){const fg=groups.findIndex(g=>g.idx.includes(T.focusLesson));if(fg>=0&&!T.ph[key].includes(fg))T.ph[key]=[...T.ph[key],fg];}
 const open=T.ph[key];
 return `<div class="ph-tools"><span class="hint">${groups.length} chương · ${P.lessons.length} bài</span><div><button class="btn btn-ghost btn-sm" data-a="phAll" data-k="${key}" data-v="1" ${open.length===groups.length?'disabled':''}>Mở tất cả</button><button class="btn btn-ghost btn-sm" data-a="phAll" data-k="${key}" data-v="0" ${open.length?'':'disabled'}>Thu gọn tất cả</button></div></div>
 <div class="phases-list">${groups.map((g,gi)=>{const isOpen=open.includes(gi),dn=g.idx.filter(i=>lessonDone(i)).length,pct=Math.round(dn/g.idx.length*100),isCur=g.idx.includes(ni);
  return `<section class="phase ${isOpen?'open':''} ${isCur?'cur':''} ${dn===g.idx.length?'done':''}">
   <button class="ph-head" data-a="phToggle" data-k="${key}" data-v="${gi}" aria-expanded="${isOpen}">
    <span class="chev">${ic('chev',16)}</span>
    <span class="ph-t"><small>Chương ${phNo(g.ph)}${isCur?' · đang học':dn===g.idx.length?' · đã xong':''}</small><b>${esc(phName(g.ph))}</b></span>
    <span class="ph-r tnum">${range(g.idx)}<span class="ph-bar"><i style="width:${pct}%"></i></span>${dn}/${g.idx.length} bài</span>
   </button>
   ${isOpen?`<ol class="lessons">${g.idx.map(row).join('')}</ol>`:''}
  </section>`;}).join('')}</div>`;
}

/* ---------- 5. Lộ trình cá nhân ---------- */
function syllabus(){
 const p=S.profile;
 if(T.gen)return `<section class="wrap narrow page"><div class="card gen"><div class="spin" role="status" aria-label="Đang tạo"></div><h2 class="h3">${esc(T.gen.msg)}</h2>
  <ol><li>${ic('check',16)} Đọc hồ sơ: ${esc(p.industry||'')}, quan tâm ${esc(goalsText(p.goals))}</li><li>${ic('check',16)} Giữ đủ 12 module theo thứ tự năng lực</li><li>${ic('check',16)} Chọn case bổ trợ theo phòng ban và mức AI</li><li>${ic('check',16)} Chia thành ${lessonsOf(p)} bài học, mỗi ngày học một bài</li></ol></div></section>`;
 if(!S.plan)return `<section class="wrap narrow page"><div class="card gen"><h2 class="h3">Hồ sơ đã sẵn sàng</h2><p class="muted">Bấm để Trợ lý lộ trình chia khóa thành bài học theo lịch của anh/chị.</p>${T.err.gen?`<p class="err">${esc(T.err.gen)}</p>`:''}<button class="btn btn-primary btn-lg" data-a="genPlan">${ic('spark')} Tạo lộ trình cá nhân</button></div></section>`;
 const P=S.plan,st=planStats(),active=P.accepted||P.wasActive;
 const main=`<article class="card pad" style="padding:28px">
  <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:14px"><span class="src">${ic('spark',13)} ${P.source==='ai'?'Cá nhân hóa bởi AI':'Cá nhân hóa theo bộ luật'}</span><span class="hint">Phiên bản ${P.version}${P.accepted?' · đang hoạt động':''}</span></div>
  <p style="font-size:16.5px;margin-bottom:20px;color:var(--ink-2)">${fmt(P.summary)}</p>
  ${P.note?`<p class="hint" style="margin-bottom:14px">${esc(P.note)}</p>`:''}
  <div class="stats"><div><b class="tnum">${st.n} bài học</b><span>mỗi ngày 1 bài, trong ${P.profile.days} ngày</span></div><div><b class="tnum">~${Math.round(st.min/st.n)} phút</b><span>mỗi ngày</span></div><div><b class="tnum">${st.mods} module</b><span>12 năng lực AI</span></div><div><b class="tnum">${Object.keys(TASKS).length} bài tập</b><span>áp dụng cho công ty</span></div></div>
  ${P.warning?`<div class="callout warn" style="margin-top:18px"><b>Mỗi bài sẽ dài khoảng ${P.warning.perLesson} phút</b><span>Với ${P.profile.minPerSession} phút mỗi ngày, ${st.n} bài học chưa đủ để xem hết 12 module mà không vượt thời gian anh/chị có. Em không bỏ module nào, anh/chị chọn một phương án:</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-a="fixDays" data-v="${Math.min(P.warning.needDays,MAX_DAYS)}">Hoàn thành trong ${Math.min(P.warning.needDays,MAX_DAYS)} ngày</button>${P.warning.needMin?`<button class="btn btn-line btn-sm" data-a="fixPace" data-v="${P.warning.needMin}">Học ${P.warning.needMin} phút mỗi ngày</button>`:''}</div></div>`:''}
  ${lessonListHTML(active,{why:true,full:true,key:'syl'})}
  ${P.skipped.length?`<details class="skipped"><summary>Case chưa đưa vào lộ trình (${P.skipped.length}) và lý do</summary><ul>${P.skipped.map(s=>`<li><b>${esc(L[s.id].title)}</b>: ${esc(s.reason)}</li>`).join('')}</ul></details>`:''}
 </article>`;
 const side=`<aside class="sticky" style="display:grid;gap:16px">
  <div class="card pad prof"><h3 style="margin-bottom:6px">Hồ sơ học viên</h3>${[['Ngành',p.industry],['Quy mô nhân sự',p.size],['Hiện trạng sử dụng AI',LEVELS[p.level]],['Phòng ban quan tâm',goalsText(p.goals)],['Thời gian học',`${p.days} ngày · ${p.minPerSession} phút/ngày`]].map(([k,v])=>`<div class="prof-row"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join('')}</div>
  <div class="card chat" style="height:auto"><div class="chat-h"><span class="bot-av">${ic('refresh')}</span><div><b>Điều chỉnh lộ trình</b><span>Nói với Trợ lý bằng lời của anh/chị</span></div></div>
   ${S.adjustLog.length?`<div class="chat-log" id="adj-log" style="max-height:220px">${S.adjustLog.map(m=>`<div class="msg ${m.role}">${fmt(m.text)}</div>`).join('')}</div>`:''}
   <div class="chips" style="padding-top:14px">${['Hoàn thành trong 7 ngày','Hoàn thành trong 1 tháng','Thêm ví dụ cho Sales','Học 1 giờ mỗi ngày'].map(c=>`<button class="chip" data-a="adjust" data-q="${c}">${c}</button>`).join('')}</div>
   <form class="chat-in" data-f="adjSend"><input class="inp" id="adj-in" name="q" autocomplete="off" placeholder="Ví dụ: hoàn thành trong 10 ngày…"><button class="send" aria-label="Gửi">${ic('send')}</button></form></div>
  <button class="btn btn-primary btn-lg btn-block" data-a="acceptPlan" ${P.warning?'disabled':''}>${P.wasActive?'Lưu lộ trình mới':'Xác nhận & bắt đầu học'} ${ic('arrow')}</button>
  ${P.warning?'<p class="hint" style="text-align:center">Chọn một phương án ở phần cảnh báo để xác nhận.</p>':''}
 </aside>`;
 return `<section class="wrap page"><div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="go" data-to="${S.plan&&S.plan.wasActive?'learn':'onboarding'}">AI for CEO</button><span>/</span><span>Lộ trình cá nhân</span></div>
 <div class="page-head"><span class="eyebrow">Lộ trình cá nhân</span><h2 class="h2">${st.n} bài học của anh/chị ${esc(firstName())}</h2><p class="sub" style="max-width:none">Mỗi ngày học một bài. Mỗi bài có danh sách video riêng và lý do đề xuất. Điều chỉnh đến khi thấy vừa rồi xác nhận.</p></div>
 <div class="two">${main}${side}</div></section>`;
}

/* ---------- 6. Trang khóa học (học) ---------- */
function learn(){
 const P=S.plan,st=planStats(),ni=nextLesson();const C=2*Math.PI*34;
 const todayKs=ni>=0?P.lessons[ni]:[];
 return `<section class="wrap page">
 <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><span>AI for CEO</span></div>
 <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap"><div style="display:grid;gap:8px"><span class="eyebrow">AI for CEO</span><h2 class="h2">Chào anh/chị ${esc(firstName())}</h2></div>
 <button class="btn btn-ghost" data-a="go" data-to="syllabus">${ic('refresh',16)} Điều chỉnh lộ trình</button></div>
 <div class="two"><div style="display:grid;gap:18px">
  ${ni>=0?`<div class="today"><span class="lbl">Bài hôm nay · Bài ${ni+1}/${st.n} · ${dayLabel(ni,P.profile)}</span><h2>${esc(lessonTitle(todayKs))}</h2>
  <ul>${todayKs.map(k=>{const u=U(k),l=unitLine(u);return `<li class="${S.done[k]?'done':''}">${ic(S.done[k]?'check':l.icon,16)}<span>${esc(l.t)}</span><span class="m">${u.m} phút</span></li>`;}).join('')}</ul>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" data-a="openLesson" data-v="${ni}">${todayKs.some(k=>S.done[k])?'Học tiếp bài '+(ni+1):'Bắt đầu bài '+(ni+1)} ${ic('arrow')}</button></div></div>`
  :`<div class="today"><span class="lbl">Đã học hết ${st.n} bài</span><h2>Anh/chị đã hoàn thành các bài học</h2><p class="muted">Kiểm tra điều kiện hoàn thành để nhận certificate.</p><div><button class="btn btn-primary" data-a="go" data-to="complete">Kiểm tra điều kiện hoàn thành ${ic('arrow')}</button></div></div>`}
  <section><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap"><h3 class="h3">Danh sách bài học</h3><span class="hint tnum">${st.lessonsDone}/${st.n} bài đã học · mỗi ngày 1 bài</span></div>
  ${lessonListHTML(true,{open:true,key:'learn'})}</section>
  <div class="demo-box"><span class="t">Công cụ demo</span><span class="hint">Bỏ qua phần xem video để đến nhanh bước Hoàn thành.</span><div><button class="btn btn-line btn-sm" data-a="simulateAll">Mô phỏng: học xong toàn bộ và chọn 3 use case</button></div></div>
 </div>
 <aside class="sticky" style="display:grid;gap:16px">
  <div class="card pad"><div class="ring"><svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="34" fill="none" stroke="var(--bg-2)" stroke-width="8"/><circle cx="42" cy="42" r="34" fill="none" stroke="var(--blue)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-st.pct/100)}" transform="rotate(-90 42 42)"/></svg><div><b class="tnum">${st.lessonsDone}/${st.n}</b><span class="muted">bài học đã hoàn thành</span></div></div>
  <div class="kv" style="margin-top:18px"><div><span>Module năng lực</span><b class="tnum">${st.modsDone}/${st.mods}</b></div><div><span>Bài tập đã nộp</span><b class="tnum">${subsCount()}/${Object.keys(TASKS).length}</b></div></div>
  <div style="display:grid;gap:6px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line)"><button class="btn btn-line btn-sm btn-block" data-a="go" data-to="outputs">${ic('file',15)} Bài tập của tôi</button><button class="btn btn-ghost btn-sm btn-block" data-a="go" data-to="complete">${ic('award',15)} Điều kiện hoàn thành</button></div></div>
  <div class="card pad event"><span class="tag">Live Zoom hằng tháng</span><h3>${LIVE.title}</h3><p>${LIVE.when} · ${LIVE.len}. Năng lực mới, demo mới và hỏi đáp CEO.</p><div>${S.liveRemind?`<span class="pill ok">${ic('check',12)} Đã đặt nhắc lịch (mô phỏng)</span>`:`<button class="btn btn-line btn-sm" data-a="liveRemind">${ic('bell',15)} Nhắc tôi</button>`}</div></div>
  <div class="card pad event"><span class="tag">Tùy chọn</span><h3>Offline Executive Briefing</h3><p>Nửa ngày, số lượng giới hạn.</p><div>${S.offline?`<span class="pill ok">${ic('check',12)} Đã ghi nhận quan tâm</span>`:`<button class="btn btn-ghost btn-sm" data-a="offline">Đăng ký quan tâm ${ic('arrow',14)}</button>`}</div></div>
 </aside></div></section>`;
}

/* ---------- 7. Trang bài học ---------- */
// Nội dung hiển thị theo từng phần: video A–D, bài tập, ôn tập, case
function unitContent(u){
 const p=S.profile,x=L[u.id];
 if(u.kind==='review')return `<div class="take"><span class="t">Ôn tập Module ${modNo(x)} · ${esc(x.cap)}</span><p class="big">${esc(x.take)}</p><div><b style="font-size:14px">Mang 3 câu hỏi này vào cuộc họp tuần với đội ngũ</b><ol style="margin-top:8px">${x.qs.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div><p class="hint">Ở công ty ${esc(String(p.industry||'').toLowerCase())}, năng lực này thường được thử trước ở việc ${esc((IND[p.industry]||IND['Khác']).general)}.</p></div>`;
 if(u.kind==='extra')return `<p class="hook">${esc(x.hook)}</p><div class="block"><span class="t">Nội dung video</span><p style="font-size:16px;line-height:1.7">${esc(x.demo)}</p></div><div class="block"><span class="t">Giải thích cho CEO</span><div class="prose">${x.body.map(b=>`<p>${esc(b)}</p>`).join('')}</div></div><div class="take"><span class="t">CEO takeaway</span><p class="big">${esc(x.take)}</p></div>`;
 if(u.part===0)return `<div class="block"><span class="t">Câu hỏi mở vấn đề</span><p class="hook">${esc(x.hook)}</p></div><p class="hint">Video tiếp theo sẽ cho anh/chị xem AI giải bài toán này như thế nào.</p>`;
 if(u.part===1)return `<div class="block"><span class="t">Demo: AI làm gì</span><p style="font-size:16.5px;line-height:1.75">${esc(x.demo)}</p></div>`;
 if(u.part===2)return `<div class="block"><span class="t">Giải thích cho CEO</span><div class="prose">${x.body.map(b=>`<p>${esc(b)}</p>`).join('')}</div></div>
  <div class="block"><span class="t">Ví dụ doanh nghiệp</span><ul class="exs">${x.ex.slice().sort((a,b)=>((p.goals||[]).includes(b[0])?1:0)-((p.goals||[]).includes(a[0])?1:0)).map(([d,t])=>`<li class="${(p.goals||[]).includes(d)?'hit':''}"><span class="d">${GOALS[d]}${(p.goals||[]).includes(d)?' · anh/chị quan tâm':''}</span><span>${esc(t)}</span></li>`).join('')}</ul></div>`;
 if(u.kind==='exercise')return exerciseView(u.id);
 return `<div class="take"><span class="t">CEO takeaway</span><p class="big">${esc(x.take)}</p><div><b style="font-size:14px">3 câu hỏi mang về công ty</b><ol style="margin-top:8px">${x.qs.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div><p class="hint">Bước tiếp theo trong bài: bài tập áp dụng cho công ty của anh/chị.</p></div>`;
}
// Bài tập: form nộp (lần đầu / sửa) hoặc kết quả đã nộp + nhận xét
function exerciseView(id){
 const t=TASKS[id],s0=S.subs[id],edit=!s0||T.editEx===id;
 // giữ lại những gì học viên đã nhập khi form báo lỗi
 const s=T.draft&&T.draft.id===id?{...(s0||{}),...T.draft,draft:true}:s0;
 const fb=s&&s.feedback?`<div class="fb ${s.feedback.pending?'typing':''}"><span class="t">${s.feedback.pending?'Đang nhận xét…':`Nhận xét ${s.feedback.by==='ai'?'bởi AI':'tự động'} · ${esc(s.feedback.at||'')}`}</span>${s.feedback.text?`<p>${fmt(s.feedback.text)}</p>`:''}</div>`:'';
 if(!edit)return `<div class="ex card"><div class="ex-h"><div><span class="t">Bài tập · Module ${modNo(L[id])}</span><h3 class="h3">${esc(t.title)}</h3></div><span class="pill ok">${ic('check',12)} Đã nộp ${esc(s.at)}${s.v>1?` · lần ${s.v}`:''}</span></div>
  <div class="ex-out">${t.kind==='uc'?`<div class="tbl-wrap"><table class="uct"><thead><tr><th>Use case</th><th>Phòng ban</th><th>Năng lực AI</th></tr></thead><tbody>${s.rows.map(r=>`<tr><td><b>${esc(r.uc)}</b>${r.why?`<div class="hint">${esc(r.why)}</div>`:''}</td><td>${esc(GOALS[r.dept]||'')}</td><td>${esc(r.cap)}</td></tr>`).join('')}</tbody></table></div>`:t.fields.map(f=>`<div><span class="lab">${esc(f.label)}</span><p>${fmt(s.fields[f.k]||'')}</p></div>`).join('')}
  ${s.file?`<div class="file">${ic('file',16)} ${s.file.data?`<a href="${s.file.data}" download="${esc(s.file.name)}">${esc(s.file.name)}</a>`:esc(s.file.name)} <span class="hint">${kb(s.file.size)}${s.file.data?'':' · demo chỉ lưu tên tệp lớn hơn 400 KB'}</span></div>`:''}</div>
  ${fb}<div class="form-foot"><span class="hint">Bài làm được lưu trong mục "Bài tập của tôi".</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-line btn-sm" data-a="editEx" data-v="${id}">Sửa & nộp lại</button><button class="btn btn-ghost btn-sm" data-a="go" data-to="outputs">Xem tất cả bài tập</button></div></div></div>`;
 const body=t.kind==='uc'?(()=>{const rows=(s&&s.rows)||[{},{},{}];return `<div class="uc">${[0,1,2].map(i=>{const r=rows[i]||{};return `<div class="uc-row"><span class="n">${i+1}</span><div class="field"><label for="uc${i}">Use case</label><input class="inp" id="uc${i}" name="uc${i}" value="${esc(r.uc||'')}" placeholder="Việc muốn AI làm"></div><div class="field"><label for="dept${i}">Phòng ban</label><select class="inp" id="dept${i}" name="dept${i}">${Object.entries(GOALS).map(([k,v])=>`<option value="${k}" ${r.dept===k?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label for="cap${i}">Năng lực AI</label><select class="inp" id="cap${i}" name="cap${i}">${CAPS.map(c=>`<option ${r.cap===c?'selected':''}>${c}</option>`).join('')}</select></div><div class="field why"><label for="why${i}">Vì sao đáng thử</label><input class="inp" id="why${i}" name="why${i}" value="${esc(r.why||'')}" placeholder="Giá trị, dữ liệu sẵn có, ai phụ trách…"></div></div>`;}).join('')}</div>`;})()
  :t.fields.map(f=>{const v=s?s.fields[f.k]||'':'';const idf=`ex-${f.k}`;return `<div class="field"><label for="${idf}">${esc(f.label)}</label>${f.type==='select'?`<select class="inp" id="${idf}" name="${f.k}">${f.opts.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select>`:f.type==='text'?`<input class="inp" id="${idf}" name="${f.k}" value="${esc(v)}">`:`<textarea class="inp" id="${idf}" name="${f.k}" rows="4">${esc(v)}</textarea>`}</div>`;}).join('');
 return `<form class="ex card" data-f="exSubmit" data-id="${id}"><div class="ex-h"><div><span class="t">Bài tập · Module ${modNo(L[id])} · khoảng ${t.min} phút</span><h3 class="h3">${esc(t.title)}</h3><p class="hint" style="margin-top:4px">${t.kind==='uc'?'Không cần biết cách triển khai. Chỉ cần chọn việc gì, ở phòng ban nào, dùng năng lực AI nào, và vì sao.':'Trả lời cho chính công ty của anh/chị. Không có đáp án đúng sai.'}</p></div>${s0?`<span class="pill wait">Đang sửa bài đã nộp</span>`:''}</div>
  ${body}
  <div class="field"><label for="ex-file">Đính kèm tệp (không bắt buộc)</label><input class="inp" type="file" id="ex-file" name="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt">${s0&&s0.file?`<span class="hint">Tệp hiện tại: ${esc(s0.file.name)}. Chọn tệp mới để thay.</span>`:''}</div>
  ${T.err.ex?`<p class="err">${T.err.ex}</p>`:''}
  <div class="form-foot"><button type="button" class="btn-link" data-a="exSample" data-v="${id}">Điền gợi ý theo công ty của tôi</button><div style="display:flex;gap:8px">${s0?`<button type="button" class="btn btn-ghost" data-a="cancelEdit">Hủy</button>`:''}<button class="btn btn-primary">${ic('send',15)} ${s0?'Nộp lại':'Nộp bài tập'}</button></div></div></form>`;
}
function lesson(){
 const P=S.plan;if(P&&!lessonOpen(S.lesson)){S.lesson=nextLesson();S.unit=null;}
 const li=S.lesson;const ks=P&&P.lessons[li];if(!ks){S.screen='learn';return learn();}
 if(!S.unit||!ks.includes(S.unit))S.unit=ks.find(k=>!S.done[k])||ks[0];
 const u=U(S.unit),x=L[u.id],pos=ks.indexOf(S.unit),doneN=ks.filter(k=>S.done[k]).length;
 const needArt=u.kind==='exercise'&&!S.subs[u.id];
 const isLast=pos===ks.length-1,back=lessonBack();
 const player=u.kind==='exercise'?'':`<div class="player"><div class="center"><button class="play" data-a="playUnit" aria-label="Phát video">${ic('play',26)}</button><span class="t">${esc(unitLabel(u))}</span><h3>${esc(u.kind==='video'?x.title:u.kind==='review'?'Ôn tập & liên hệ công ty':x.title)}</h3></div><div class="bottom"><span>${S.done[S.unit]?'Đã xem':'0:00'}</span><span class="track"><i style="width:${S.done[S.unit]?100:0}%"></i></span><span class="tnum">${u.m}:00</span></div></div>`;
 const list=`<div class="ulist">${ks.map((k,i)=>{const v=U(k);return `<button class="${k===S.unit?'on':''} ${S.done[k]?'done':''}" data-a="selUnit" data-v="${k}"><span class="st">${ic('check',12)}</span><span><small>${esc(v.kind==='video'?`Module ${modNo(L[v.id])} · Video ${'ABCD'[v.part]}`:v.kind==='exercise'?`Module ${modNo(L[v.id])} · Bài tập`:v.kind==='review'?'Ôn tập':TYPE_LABEL[L[v.id].type])}</small><b>${esc(v.kind==='video'?PARTS[v.part]:v.kind==='exercise'?TASKS[v.id].title:v.kind==='review'?'Liên hệ công ty: Module '+modNo(L[v.id]):L[v.id].title)}</b></span><span class="mn tnum">${v.m}′</span></button>`;}).join('')}</div>`;
 const nextBtn=needArt?`<p class="hint">Nộp bài tập ở trên để hoàn thành phần này.</p>`:
  `<button class="btn btn-primary btn-lg" data-a="markNext">${S.done[S.unit]&&isLast?`${lessonDone(li)?'Sang bài tiếp theo':'Hoàn thành bài '+(li+1)}`:isLast?`${u.kind==='exercise'?'Tiếp tục':'Đã xem xong'} · Hoàn thành bài ${li+1}`:`${u.kind==='exercise'?'Tiếp tục':'Đã xem xong · Video tiếp theo'}`} ${ic('arrow')}</button>`;
 return `<section class="wrap page lesson">
 <div class="lsn-top"><button class="btn btn-line btn-sm" data-a="${back.a}">${ic('back',15)} ${back.t}</button>
  <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="backToList">AI for CEO</button><span>/</span>${S.from==='outputs'?`<button data-a="backToOutputs">Bài tập của tôi</button><span>/</span>`:''}<span>Bài ${li+1}</span></div></div>
 <div style="display:grid;gap:12px;margin-bottom:24px"><div class="meta"><span class="ty">Bài ${li+1}/${P.lessons.length} · ${dayLabel(li,P.profile)}</span><span>${ic('video',14)} ${ks.filter(k=>U(k).kind!=='exercise').length} video${ks.some(k=>U(k).kind==='exercise')?` · ${ks.filter(k=>U(k).kind==='exercise').length} bài tập`:''}</span><span>${ic('clock',14)} ${lessonMin(ks)} phút</span><span class="tnum">${doneN}/${ks.length} đã xem</span></div><h1>${esc(lessonTitle(ks))}</h1><div class="bar" style="max-width:420px"><i style="width:${Math.round(doneN/ks.length*100)}%"></i></div></div>
 <div class="lsn">
  <div style="display:grid;gap:24px">${player}${unitContent(u)}<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">${nextBtn}<button class="btn btn-line" data-a="asstLesson">${ic('chat',16)} Hỏi AI về phần này</button></div></div>
  <aside class="sticky" style="display:grid;gap:14px"><div><b style="font-size:14px">Trong bài ${li+1}</b><p class="hint">${ks.length} video · ${lessonMin(ks)} phút</p></div>${list}
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
 <div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap"><div style="display:grid;gap:8px"><span class="eyebrow">Bài tập của tôi</span><h2 class="h2">${n}/${ids.length} bài tập đã nộp</h2><p class="sub">Mọi bài làm và nhận xét được lưu tại đây. Đây là bộ output anh/chị mang về công ty sau khóa học.</p></div></div>
 <div class="bar" style="max-width:520px;margin-bottom:24px"><i style="width:${Math.round(n/ids.length*100)}%"></i></div>
 <div class="grid g2">${ids.map(id=>{const s=S.subs[id],t=TASKS[id],li=lessonOfUnit('E:'+id);const prev=s?clip(subText(id).replace(/\n+/g,' · '),170):'';
  return `<article class="card pad out" id="out-${id}"><div class="ex-h"><div><span class="t">Module ${modNo(L[id])} · ${esc(L[id].cap)}${li>=0?` · Bài ${li+1}`:''}</span><h3 class="h3">${esc(t.title)}</h3></div>${s?`<span class="pill ok">Đã nộp</span>`:`<span class="pill wait">Chưa nộp</span>`}</div>
  ${s?`<p class="prev">${esc(prev)}</p><p class="hint">${ic('clock',13)} ${esc(s.at)}${s.v>1?` · nộp lần ${s.v}`:''}${s.file?` · ${ic('file',13)} ${esc(s.file.name)}`:''}${s.feedback&&s.feedback.text?' · có nhận xét':''}</p>`:`<p class="prev muted">Bài tập nằm cuối Module ${modNo(L[id])}${li>=0?`, trong Bài ${li+1} của lộ trình`:''}.</p>`}
  <div>${li<0?'':s||lessonOpen(li)?`<button class="btn ${s?'btn-line':'btn-primary'} btn-sm" data-a="openEx" data-v="${id}">${s?'Xem & sửa':'Làm bài tập'} ${ic('arrow',15)}</button>`:`<span class="hint">${ic('lock',13)} Mở khi anh/chị học tới Bài ${li+1}</span>`}</div></article>`;}).join('')}</div>
 </section>`;
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
 const p=S.profile;const rows=S.subs.M12.rows;
 return `<section class="wrap page">${head}
 <div class="cert"><span class="seal">${ic('award',28)}</span><span class="t">Chứng nhận hoàn thành</span><span class="name">${esc(p.name||'')}</span><p class="muted">đã hoàn thành chương trình <b style="color:var(--ink)">AI for CEO</b> · Học viện Siêu Tăng Trưởng</p><span class="code">Mã chứng nhận STT-AICEO-${esc(((S.order&&S.order.code)||'000000').replace(/\D/g,'').slice(-6))} · ${esc(S.completedAt)}</span></div>
 <div class="grid g2" style="margin-top:24px;align-items:start">
  <article class="card pad"><h3 class="h3" style="margin-bottom:12px">3 use case anh/chị chọn</h3><div class="tbl-wrap"><table class="uct"><thead><tr><th>Use case</th><th>Phòng ban</th><th>Năng lực AI</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r.uc)}</b>${r.why?`<div class="hint">${esc(r.why)}</div>`:''}</td><td>${esc(GOALS[r.dept]||'')}</td><td>${esc(r.cap)}</td></tr>`).join('')}</tbody></table></div>
   <div class="kv" style="margin-top:16px"><div><span>Bài học</span><b class="tnum">${st.lessonsDone}/${st.n}</b></div><div><span>Bài tập đã nộp</span><b class="tnum">${subsCount()}/${Object.keys(TASKS).length}</b></div><div><span>Thời gian học</span><b class="tnum">${hours(st.min)} giờ</b></div></div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn btn-line btn-sm" data-a="go" data-to="outputs">${ic('file',15)} Xem bộ bài tập</button></div></article>
  <div style="display:grid;gap:16px">${checkCard}
   <article class="card pad event"><span class="tag">Live Zoom tiếp theo</span><h3>${LIVE.title}</h3><p>${LIVE.when}. Học viên đã hoàn thành vẫn tham gia các buổi cập nhật hằng tháng.</p><div>${S.liveRemind?`<span class="pill ok">${ic('check',12)} Đã đặt nhắc lịch</span>`:`<button class="btn btn-line btn-sm" data-a="liveRemind">${ic('bell',15)} Nhắc tôi</button>`}</div></article></div>
 </div>
 <div class="bigq" style="margin-top:24px"><span>Câu hỏi mở cho chặng tiếp theo</span><p>"Nếu AI đã có những năng lực này, doanh nghiệp của tôi nên được thiết kế lại như thế nào?"</p></div>
 <div style="margin-top:24px">${secHead('Khi anh/chị sẵn sàng','Hành trình tiếp theo trong hệ sinh thái','Không bắt buộc. Mỗi bước giúp đi từ "hiểu" sang "áp dụng".')}
  <div class="eco">${[['Academy','Hiểu AI đang làm được gì',true],['CEO Self-reflection','Doanh nghiệp mình có cơ hội ở đâu?'],['DX Check-up / Blueprint','Map doanh nghiệp, xác định bài toán và ưu tiên'],['BlueBolt Software','Thiết kế, triển khai hệ thống AI và automation']].map(([t,d,h])=>`<div class="${h?'here':''}"><b>${t}${h?' · Anh/chị đang ở đây':''}</b><p>${d}</p></div>`).join('')}</div></div>
 <div class="grid g2" style="margin-top:16px"><article class="card pad" style="display:grid;gap:10px;align-content:start"><h3 class="h3">CEO AI Community</h3><p class="muted">Trao đổi use case, case study và kinh nghiệm với các CEO khác.</p><div><button class="btn btn-line">${ic('users',16)} Vào cộng đồng</button></div></article>
 <article class="card pad" style="display:grid;gap:10px;align-content:start"><h3 class="h3">Offline Executive Briefing</h3><p class="muted">Xem demo live và thảo luận 3 use case của anh/chị cùng chuyên gia.</p><div>${S.offline?`<span class="pill ok">${ic('check',12)} Đã ghi nhận quan tâm</span>`:`<button class="btn btn-line" data-a="offline">Đăng ký quan tâm</button>`}</div></article></div>
 </section>`;
}

/* ---------- đăng ký màn hình ---------- */
const SCREENS={landing,checkout,mycourses,onboarding,syllabus,learn,lesson,complete,outputs};
