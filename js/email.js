/* =========================================================
   EMAIL — email tự động gửi cho học viên
   Demo không gửi email thật (trang tĩnh, không có máy chủ): email được "gửi" vào Hộp thư mô phỏng
   trên thanh demo. Hệ thống thật: máy chủ gọi confirmEmail(...) rồi gửi qua dịch vụ email
   (SMTP / SendGrid / Amazon SES…) ngay khi cổng thanh toán báo thành công.
   ========================================================= */

/* ---------- Email xác nhận đăng ký thành công (US-03.5, US-03.7 · FR-7, FR-8) ---------- */
// o: đơn đăng ký (S.order). opt.logo: đường dẫn logo (email thật cần URL đầy đủ https://…)
function confirmEmail(o,opt={}){
 const logo=opt.logo||'img/logo.png',url=opt.url||'#';
 const name=o.name||'anh/chị';
 const subject='Đăng ký khóa học AI for CEO thành công';
 const row=(k,v,strong)=>`<tr><td style="padding:9px 0;color:#5B6472;font-size:14px;border-top:1px solid #E6E8EC;width:44%">${k}</td><td style="padding:9px 0;font-size:14px;border-top:1px solid #E6E8EC;text-align:right;color:#141A26;${strong?'font-weight:800;font-size:16px;':'font-weight:600;'}">${v}</td></tr>`;
 const h=t=>`<h2 style="margin:28px 0 10px;font-size:16px;line-height:1.4;color:#141A26">${t}</h2>`;
 const p=t=>`<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2B3240">${t}</p>`;
 const steps=['Đăng nhập bằng email <b>'+esc(o.email)+'</b>','Vào <b>Khóa học của tôi</b>, chọn <b>AI for CEO</b>','Thực hiện <b>Onboarding</b> cùng Trợ lý lộ trình (khoảng 3 phút)','Cho biết mục tiêu, bối cảnh doanh nghiệp và thời gian muốn hoàn thành khóa','Nhận <b>lộ trình học cá nhân hóa</b> và bắt đầu bài học đầu tiên'];
 const invoice=o.invoice
  ?p(`Hóa đơn điện tử (VAT) sẽ được xuất cho <b>${esc(o.invName||o.company||'')}</b>${o.taxId?`, mã số thuế <b>${esc(o.taxId)}</b>`:''} và gửi tới email <b>${esc(o.email)}</b> trong vòng 24 giờ làm việc.`)+p(`Cần điều chỉnh thông tin hóa đơn, anh/chị gửi email tới <a href="mailto:${ACADEMY.billing}" style="color:#1747C9">${ACADEMY.billing}</a> kèm mã đơn <b>${esc(o.code)}</b>.`)
  :p(`Anh/chị chưa yêu cầu xuất hóa đơn công ty. Nếu cần hóa đơn VAT, anh/chị gửi tên công ty, mã số thuế, địa chỉ và mã đơn <b>${esc(o.code)}</b> tới <a href="mailto:${ACADEMY.billing}" style="color:#1747C9">${ACADEMY.billing}</a>.`);
 const html=`<div style="background:#F3F4F6;padding:24px 12px;font-family:'Be Vietnam Pro',Arial,Helvetica,sans-serif;color:#141A26">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">Thanh toán thành công. Khóa AI for CEO đã được kích hoạt, bước tiếp theo là Onboarding để nhận lộ trình cá nhân hóa.</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E8EC;border-radius:12px;border-collapse:separate">
<tr><td style="padding:24px 32px;border-bottom:1px solid #E6E8EC"><img src="${logo}" alt="${ACADEMY.name}" width="180" style="display:block;height:auto;max-width:180px"></td></tr>
<tr><td style="padding:32px 32px 8px">
 <span style="display:inline-block;background:#E6F4EC;color:#1B7F45;font-weight:700;font-size:13px;padding:6px 12px;border-radius:99px">✓ Đăng ký thành công</span>
 <h1 style="margin:16px 0 18px;font-size:24px;line-height:1.3;color:#141A26">Chào ${esc(name)},</h1>
 ${p(`Học viện Siêu Tăng Trưởng xác nhận anh/chị đã <b>thanh toán thành công</b> và <b>đăng ký chương trình AI for CEO</b>. Cảm ơn anh/chị đã tin tưởng đồng hành cùng Học viện.`)}
 ${h('Thông tin đăng ký')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  ${row('Chương trình','AI for CEO · Trọn khóa')}${row('Mã đơn',esc(o.code))}${row('Ngày đăng ký',esc(o.paidAt||''))}${row('Phương thức thanh toán',esc(PAY_METHODS[o.method]||''))}${row('Học phí',money(COURSE.list))}${row(esc(COURSE.promo),'−'+money(SAVE))}${row('Số tiền đã thanh toán',money(COURSE.price),true)}
 </table>
 ${h('Tài khoản học')}
 ${p(`Anh/chị học bằng tài khoản email <b>${esc(o.email)}</b>. Vui lòng đăng nhập đúng email này, vì khóa học được gắn với tài khoản đã đăng ký.`)}
 ${h('Quyền truy cập')}
 ${p(`Khóa học <b>AI for CEO</b> đã được <b>kích hoạt</b> trên tài khoản của anh/chị. Anh/chị có thể vào học ngay bây giờ.`)}
 ${h('Bước tiếp theo')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps.map((s,i)=>`<tr><td style="vertical-align:top;padding:6px 12px 6px 0;width:28px"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#EEF2FC;color:#1747C9;font-weight:700;font-size:13px">${i+1}</span></td><td style="padding:8px 0;font-size:15px;line-height:1.5;color:#2B3240">${s}</td></tr>`).join('')}</table>
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 8px"><tr><td align="center">
  <a href="${url}" ${opt.ctaAttr||''} style="display:inline-block;background:#1747C9;color:#FFFFFF;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:.04em;padding:15px 34px;border-radius:10px">TRUY CẬP KHÓA HỌC →</a>
 </td></tr></table>
 ${h('Hóa đơn')}
 ${invoice}
 ${h('Cần hỗ trợ?')}
 ${p(`Nếu gặp vấn đề khi đăng nhập, truy cập khóa học hoặc thanh toán, anh/chị liên hệ:`)}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7F9;border-radius:10px"><tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;color:#2B3240">
  Email: <a href="mailto:${ACADEMY.support}" style="color:#1747C9">${ACADEMY.support}</a><br>Hotline: <b>${ACADEMY.hotline}</b><br>Zalo: ${ACADEMY.zalo}<br><span style="color:#5B6472">Giờ hỗ trợ: ${ACADEMY.hours}. Vui lòng cung cấp mã đơn <b>${esc(o.code)}</b> khi liên hệ.</span>
 </td></tr></table>
 ${p('')}
</td></tr>
<tr><td style="padding:20px 32px 26px;border-top:1px solid #E6E8EC;font-size:12.5px;line-height:1.7;color:#5B6472">
 <b style="color:#141A26">${ACADEMY.name}</b><br>${ACADEMY.address}<br>${ACADEMY.web} · ${ACADEMY.hotline} · ${ACADEMY.support}<br>
 Đây là email tự động, vui lòng không trả lời trực tiếp email này.
</td></tr>
</table></div>`;
 // bản chữ thuần cho trình đọc email không hiển thị HTML (email thật nên gửi kèm)
 const text=[`Chào ${name},`,'',`Học viện Siêu Tăng Trưởng xác nhận anh/chị đã thanh toán thành công và đăng ký chương trình AI for CEO.`,'',
  'THÔNG TIN ĐĂNG KÝ',`Chương trình: AI for CEO · Trọn khóa`,`Mã đơn: ${o.code}`,`Ngày đăng ký: ${o.paidAt||''}`,`Phương thức thanh toán: ${PAY_METHODS[o.method]||''}`,`Số tiền đã thanh toán: ${money(COURSE.price)}`,'',
  `TÀI KHOẢN HỌC: ${o.email}`,'Khóa học đã được kích hoạt trên tài khoản này.','',
  'BƯỚC TIẾP THEO',...steps.map((s,i)=>`${i+1}. ${s.replace(/<[^>]+>/g,'')}`),'',`TRUY CẬP KHÓA HỌC: ${url}`,'',
  `HỖ TRỢ: ${ACADEMY.support} · Hotline ${ACADEMY.hotline} · ${ACADEMY.hours}`,'',ACADEMY.name,ACADEMY.address].join('\n');
 return {from:`${ACADEMY.name} <${ACADEMY.sender}>`,to:o.email,subject,html,text};
}

/* ---------- Hộp thư mô phỏng ---------- */
// Gọi khi thanh toán thành công: lưu email vào hộp thư của học viên (S.mails) và báo cho người dùng
function sendConfirmEmail(){
 const o=S.order;if(!o||!o.email)return;
 if(S.mails.some(m=>m.kind==='confirm'&&m.code===o.code))return; // mỗi đơn chỉ gửi 1 lần
 const m={id:'m'+Date.now(),kind:'confirm',code:o.code,to:o.email,at:nowStr(),read:false,order:{...o}};
 S.mails.unshift(m);
 if(realMailOn())sendRealEmail(m);else toast(`Đã gửi email xác nhận tới ${o.email}`);
}
/* ---------- Gửi email thật qua EmailJS ---------- */
const realMailOn=()=>!!(EMAILJS.serviceId&&EMAILJS.templateId&&EMAILJS.publicKey);
// Nạp thư viện EmailJS khi cần (chỉ khi đã cấu hình), không làm chậm lúc mở trang
function loadEmailJS(){
 if(window.emailjs)return Promise.resolve(window.emailjs);
 return new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload=()=>{window.emailjs.init({publicKey:EMAILJS.publicKey});ok(window.emailjs);};s.onerror=()=>fail(new Error('Không tải được thư viện gửi email'));document.head.appendChild(s);});
}
async function sendRealEmail(m){
 // email thật cần đường dẫn đầy đủ: logo và nút "Truy cập khóa học" trỏ về đúng trang demo đang chạy
 const base=location.href.split('#')[0].replace(/index\.html$/,'');
 const e=confirmEmail(m.order,{logo:new URL('img/logo.png',base).href,url:base});
 m.real='sending';render();
 try{
  const ej=await loadEmailJS();
  await ej.send(EMAILJS.serviceId,EMAILJS.templateId,{to_email:e.to,to_name:m.order.name||'',subject:e.subject,html:e.html,text:e.text,reply_to:ACADEMY.support,from_name:ACADEMY.name});
  m.real='sent';toast(`Đã gửi email xác nhận tới ${e.to}. Anh/chị kiểm tra hộp thư (cả mục Spam/Quảng cáo)`);
 }catch(err){
  m.real='failed';m.err=(err&&(err.text||err.message))||'lỗi không xác định';
  toast(`Chưa gửi được email tới ${e.to}. Email vẫn có trong Hộp thư mô phỏng`,'bad');
 }
 render();
}
// Gửi lại email thật (khi lần trước lỗi)
function resendRealEmail(id){const m=S.mails.find(x=>x.id===id);if(m&&realMailOn())sendRealEmail(m);}
const unreadMails=()=>S.mails.filter(m=>!m.read).length;
// Khung xem email: danh sách thư bên trái (nếu nhiều thư), nội dung thư bên phải
function mailView(){
 if(!T.mailOpen)return '';
 const m=S.mails.find(x=>x.id===T.mailOpen)||S.mails[0];if(!m)return '';
 const e=confirmEmail(m.order,{url:'#',ctaAttr:'data-a="mailCta"'});
 return `<div class="mail-ov" data-a="mailClose" data-self="1"><div class="mail" role="dialog" aria-modal="true" aria-label="Email: ${esc(e.subject)}">
  <div class="mail-bar"><span class="mail-app">${ic('mail',16)} Hộp thư của ${esc(m.to)} <small>(mô phỏng)</small></span><button class="x" data-a="mailClose" aria-label="Đóng">${ic('x')}</button></div>
  <div class="mail-head"><h2>${esc(e.subject)}</h2>
   <div class="mail-meta"><span class="av" aria-hidden="true">S</span><div><b>${esc(ACADEMY.name)}</b> <span>&lt;${esc(ACADEMY.sender)}&gt;</span><br><span>Đến: ${esc(m.to)} · ${esc(m.at)}</span></div></div></div>
  ${m.real?`<div class="mail-real ${m.real}">${m.real==='sent'?`${ic('check',15)} Đã gửi email thật tới <b>${esc(m.to)}</b>. Nếu chưa thấy, anh/chị xem mục Spam hoặc Quảng cáo.`:m.real==='sending'?'Đang gửi email thật…':`${ic('x',15)} Chưa gửi được email thật (${esc(m.err||'')}). <button class="btn-link" data-a="mailResend" data-v="${m.id}">Gửi lại</button>`}</div>`:''}
  <div class="mail-body">${e.html}</div>
 </div></div>`;
}
