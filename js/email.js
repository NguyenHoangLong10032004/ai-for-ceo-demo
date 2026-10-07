/* =========================================================
   EMAIL — email tự động gửi cho học viên
   Demo không gửi email thật (trang tĩnh, không có máy chủ): email được "gửi" vào Hộp thư mô phỏng
   trên thanh demo. Hệ thống thật: máy chủ gọi confirmEmail(...) rồi gửi qua dịch vụ email
   (SMTP / SendGrid / Amazon SES…) ngay khi cổng thanh toán báo thành công.
   ========================================================= */

/* ---------- Chân email dùng chung (mọi email tự động) ----------
   Gọn, style inline để hiển thị đúng trên Gmail/Outlook/điện thoại: logo nhỏ, 1 dòng liên hệ (Hotline · Email · Website),
   1 dòng địa chỉ + giờ làm việc, lý do nhận email + bản quyền (chữ nhỏ) */
function emailFooter(opt={}){
 const logo=opt.logo||'img/logo.png',web='https://'+ACADEMY.web,y=new Date().getFullYear();
 const a=(v,h)=>`<a href="${h}" style="color:#2B3240;font-weight:600;text-decoration:none">${v}</a>`,dot='<span style="color:#C3CAD5">&nbsp;·&nbsp;</span>';
 return `<tr><td align="center" style="padding:18px 32px 16px;border-top:1px solid #E6E8EC;background:#F7F9FC;border-radius:0 0 12px 12px;font-size:12.5px;line-height:1.6;color:#5B6472">
  <img src="${logo}" alt="${ACADEMY.name}" width="110" style="display:block;height:auto;max-width:110px;margin:0 auto 10px">
  Hotline ${a(ACADEMY.hotline,'tel:'+ACADEMY.hotline.replace(/\s/g,''))}${dot}${a(ACADEMY.support,'mailto:'+ACADEMY.support)}${dot}${a(ACADEMY.web,web)}<br>
  ${ACADEMY.address}${dot}${ACADEMY.workDays}, ${ACADEMY.workTime}
  <div style="margin-top:10px;padding-top:10px;border-top:1px solid #E3E8F0;font-size:11.5px;line-height:1.6;color:#8A93A3">${opt.reason||`Anh/chị nhận email này vì đã đăng ký tài khoản tại ${ACADEMY.name}.`}<br>Email tự động, vui lòng không trả lời. © ${y} ${ACADEMY.name}.</div>
 </td></tr>`;
}
/* ---------- Email khi đăng ký thành công (US-03.5, US-03.7 · FR-7, FR-8) ----------
   Gửi đồng thời 2 email (theo yêu cầu user), email nào cũng có phần "Cần hỗ trợ?":
   1. part='confirm' — Đăng ký khóa học AI for CEO thành công: lời chào, xác nhận đăng ký + thanh toán, thông tin đăng ký, hóa đơn
   2. part='access'  — Khóa học đã được kích hoạt: tài khoản học, quyền truy cập, bước tiếp theo, nút TRUY CẬP KHÓA HỌC */
// o: đơn đăng ký (S.order). opt.logo: đường dẫn logo (email thật cần URL đầy đủ https://…)
const CONFIRM_SUBJECT='Đăng ký khóa học AI for CEO thành công';
const ACCESS_SUBJECT='Khóa học AI for CEO đã được kích hoạt · Hướng dẫn bắt đầu học';
function confirmEmail(o,opt={}){
 const logo=opt.logo||'img/logo.png',url=opt.url||'#',part=opt.part||'confirm';
 const name=o.name||'anh/chị';
 const subject=part==='access'?ACCESS_SUBJECT:CONFIRM_SUBJECT;
 const row=(k,v,strong)=>`<tr><td style="padding:9px 0;color:#5B6472;font-size:14px;border-top:1px solid #E6E8EC;width:44%">${k}</td><td style="padding:9px 0;font-size:14px;border-top:1px solid #E6E8EC;text-align:right;color:#141A26;${strong?'font-weight:800;font-size:16px;':'font-weight:600;'}">${v}</td></tr>`;
 const h=t=>`<h2 style="margin:28px 0 10px;font-size:16px;line-height:1.4;color:#141A26">${t}</h2>`;
 const p=t=>`<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2B3240">${t}</p>`;
 const steps=['Truy cập khóa học bằng nút bên dưới','Đăng nhập bằng email <b>'+esc(o.email)+'</b>','Vào <b>Khóa học của tôi</b>, chọn <b>AI for CEO</b>','Thực hiện <b>Onboarding</b> cùng Trợ lý lộ trình (khoảng 3 phút)','Cho biết mục tiêu, bối cảnh doanh nghiệp và thời gian muốn hoàn thành khóa','Nhận <b>lộ trình học cá nhân hóa</b> và bắt đầu bài học đầu tiên'];
 const invoice=o.invoice
  ?p(`Hóa đơn điện tử (VAT) sẽ được xuất cho <b>${esc(o.invName||o.company||'')}</b>${o.taxId?`, mã số thuế <b>${esc(o.taxId)}</b>`:''} và gửi bằng email riêng tới <b>${esc(o.invEmail||o.email)}</b>.`)+p(`Cần điều chỉnh thông tin hóa đơn, anh/chị gửi email tới <a href="mailto:${ACADEMY.billing}" style="color:#1747C9">${ACADEMY.billing}</a> kèm mã đơn <b>${esc(o.code)}</b>.`)
  :p(`Anh/chị chưa yêu cầu xuất hóa đơn công ty. Nếu cần hóa đơn VAT, anh/chị gửi tên công ty, mã số thuế, địa chỉ và mã đơn <b>${esc(o.code)}</b> tới <a href="mailto:${ACADEMY.billing}" style="color:#1747C9">${ACADEMY.billing}</a>.`);
 const pre=part==='access'?'Khóa AI for CEO đã được kích hoạt. Truy cập khóa học và làm Onboarding để nhận lộ trình cá nhân hóa.':'Anh/chị đã đăng ký và thanh toán thành công khóa học AI for CEO.';
 const body=part==='access'?`
 ${p(`Khóa học <b>AI for CEO</b> của anh/chị đã sẵn sàng. Dưới đây là thông tin tài khoản và các bước để bắt đầu học.`)}
 ${h('Tài khoản học')}
 ${p(`Anh/chị học bằng tài khoản email <b>${esc(o.email)}</b>. Vui lòng đăng nhập đúng email này, vì khóa học được gắn với tài khoản đã đăng ký.`)}
 ${h('Quyền truy cập')}
 ${p(`Khóa học <b>AI for CEO</b> đã được <b>kích hoạt</b> trên tài khoản của anh/chị. Anh/chị có thể vào học ngay bây giờ.`)}
 ${h('Bước tiếp theo')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps.map((s,i)=>`<tr><td style="vertical-align:top;padding:6px 12px 6px 0;width:28px"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:50%;background:#EEF2FC;color:#1747C9;font-weight:700;font-size:13px">${i+1}</span></td><td style="padding:8px 0;font-size:15px;line-height:1.5;color:#2B3240">${s}</td></tr>`).join('')}</table>
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 8px"><tr><td align="center">
  <a href="${url}" ${opt.ctaAttr||''} style="display:inline-block;background:#1747C9;color:#FFFFFF;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:.04em;padding:15px 34px;border-radius:10px">TRUY CẬP KHÓA HỌC →</a>
 </td></tr></table>`:`
 ${p(`Học viện Siêu Tăng Trưởng xác nhận anh/chị đã <b>đăng ký và thanh toán thành công</b> khóa học <b>AI for CEO</b>. Cảm ơn anh/chị đã tin tưởng đồng hành cùng Học viện.`)}
 ${h('Thông tin đăng ký')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  ${row('Khóa học','AI for CEO · Trọn khóa')}${row('Mã đơn',esc(o.code))}${row('Ngày đăng ký',esc(o.paidAt||''))}${row('Phương thức thanh toán',esc(PAY_METHODS[o.method]||''))}${row('Học phí',money(COURSE.list))}${row(esc(COURSE.promo),'−'+money(SAVE))}${row('Số tiền đã thanh toán',money(COURSE.price),true)}
 </table>`;
 const html=`<div style="background:#F3F4F6;padding:24px 12px;font-family:Roboto,Arial,Helvetica,sans-serif;color:#141A26">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${pre}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E8EC;border-radius:12px;border-collapse:separate">
<tr><td style="padding:24px 32px;border-bottom:1px solid #E6E8EC"><img src="${logo}" alt="${ACADEMY.name}" width="180" style="display:block;height:auto;max-width:180px"></td></tr>
<tr><td style="padding:32px 32px 8px">
 <h1 style="margin:0 0 18px;font-size:24px;line-height:1.3;color:#141A26">Chào ${esc(name)},</h1>
 ${body}
 ${h('Cần hỗ trợ?')}
 ${p(`Nếu gặp vấn đề khi đăng nhập, truy cập khóa học hoặc thanh toán, anh/chị liên hệ:`)}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F7F9;border-radius:10px"><tr><td style="padding:14px 18px;font-size:14px;line-height:1.8;color:#2B3240">
  Email: <a href="mailto:${ACADEMY.support}" style="color:#1747C9">${ACADEMY.support}</a><br>Hotline: <b>${ACADEMY.hotline}</b><br>Zalo: ${ACADEMY.zalo}<br><span style="color:#5B6472">Giờ hỗ trợ: ${ACADEMY.hours}. Vui lòng cung cấp mã đơn <b>${esc(o.code)}</b> khi liên hệ.</span>
 </td></tr></table>
 ${p('')}
</td></tr>
${emailFooter({logo,url:opt.url,reason:`Anh/chị nhận email này vì đã đăng ký khóa học AI for CEO (mã đơn ${esc(o.code)}) tại ${ACADEMY.name}.`})}
</table></div>`;
 // bản chữ thuần cho trình đọc email không hiển thị HTML (email thật nên gửi kèm)
 const support=['CẦN HỖ TRỢ?',`Email: ${ACADEMY.support} · Hotline: ${ACADEMY.hotline} · Zalo: ${ACADEMY.zalo}`,`Giờ hỗ trợ: ${ACADEMY.hours}. Vui lòng cung cấp mã đơn ${o.code} khi liên hệ.`,'',ACADEMY.name,ACADEMY.address];
 const text=(part==='access'
  ?[`Chào ${name},`,'','Khóa học AI for CEO của anh/chị đã sẵn sàng.','',`TÀI KHOẢN HỌC: ${o.email}`,'Vui lòng đăng nhập đúng email này, vì khóa học được gắn với tài khoản đã đăng ký.','',
    'QUYỀN TRUY CẬP: khóa học AI for CEO đã được kích hoạt, anh/chị có thể vào học ngay.','',
    'BƯỚC TIẾP THEO',...steps.map((s,i)=>`${i+1}. ${s.replace(/<[^>]+>/g,'')}`),'',`TRUY CẬP KHÓA HỌC: ${url}`,'']
  :[`Chào ${name},`,'',`Học viện Siêu Tăng Trưởng xác nhận anh/chị đã đăng ký và thanh toán thành công khóa học AI for CEO. Cảm ơn anh/chị đã tin tưởng đồng hành cùng Học viện.`,'',
    'THÔNG TIN ĐĂNG KÝ',`Khóa học: AI for CEO · Trọn khóa`,`Mã đơn: ${o.code}`,`Ngày đăng ký: ${o.paidAt||''}`,`Phương thức thanh toán: ${PAY_METHODS[o.method]||''}`,`Học phí: ${money(COURSE.list)}`,`${COURSE.promo}: −${money(SAVE)}`,`Số tiền đã thanh toán: ${money(COURSE.price)}`,'',
    '']).concat(support).join('\n');
 return {from:`${ACADEMY.name} <${ACADEMY.sender}>`,to:o.email,subject,html,text};
}
// tin Zalo OA đi kèm 2 email (cùng nội dung, dạng ngắn; nút bấm dẫn vào khóa học)
function enrollZaloMsgs(o){
 // nội dung đầy đủ như 2 email (theo yêu cầu user), chia khối: intro · sections [{h, p, rows, steps}] · help (Cần hỗ trợ?)
 const help={lines:[['Email',ACADEMY.support],['Hotline',ACADEMY.hotline],['Zalo',ACADEMY.zalo]],note:`Giờ hỗ trợ: ${ACADEMY.hours}. Vui lòng cung cấp mã đơn ${o.code} khi liên hệ.`,
  intro:'Nếu gặp vấn đề khi đăng nhập, truy cập khóa học hoặc thanh toán, anh/chị liên hệ:'};
 const inv=o.invoice
  ?`Hóa đơn điện tử (VAT) sẽ được xuất cho ${o.invName||o.company||''}${o.taxId?`, mã số thuế ${o.taxId}`:''} và gửi bằng email riêng tới ${o.invEmail||o.email}. Cần điều chỉnh thông tin hóa đơn, anh/chị gửi email tới ${ACADEMY.billing} kèm mã đơn ${o.code}.`
  :`Anh/chị chưa yêu cầu xuất hóa đơn công ty. Nếu cần hóa đơn VAT, anh/chị gửi tên công ty, mã số thuế, địa chỉ và mã đơn ${o.code} tới ${ACADEMY.billing}.`;
 return [{icon:'✅',title:CONFIRM_SUBJECT,intro:`Chào ${o.name||'anh/chị'},\nHọc viện Siêu Tăng Trưởng xác nhận anh/chị đã đăng ký và thanh toán thành công khóa học AI for CEO. Cảm ơn anh/chị đã tin tưởng đồng hành cùng Học viện.`,
   sections:[{h:'Thông tin đăng ký',rows:[['Khóa học','AI for CEO · Trọn khóa'],['Mã đơn',o.code],['Ngày đăng ký',o.paidAt||''],['Phương thức thanh toán',PAY_METHODS[o.method]||''],['Học phí',money(COURSE.list)],[COURSE.promo,'−'+money(SAVE)],['Số tiền đã thanh toán',money(COURSE.price),1]]},
    ],help,cta:'Xem khóa học của tôi',ctaTo:'mycourses'},
  {icon:'🔓',title:ACCESS_SUBJECT,intro:`Chào ${o.name||'anh/chị'},\nKhóa học AI for CEO của anh/chị đã sẵn sàng. Dưới đây là thông tin tài khoản và các bước để bắt đầu học.`,
   sections:[{h:'Tài khoản học',p:`Anh/chị học bằng tài khoản email ${o.email}. Vui lòng đăng nhập đúng email này, vì khóa học được gắn với tài khoản đã đăng ký.`},
    {h:'Quyền truy cập',p:'Khóa học AI for CEO đã được kích hoạt trên tài khoản của anh/chị. Anh/chị có thể vào học ngay bây giờ.'},
    {h:'Bước tiếp theo',steps:['Truy cập khóa học bằng nút bên dưới',`Đăng nhập bằng email ${o.email}`,'Vào Khóa học của tôi, chọn AI for CEO','Thực hiện Onboarding cùng Trợ lý lộ trình (khoảng 3 phút)','Cho biết mục tiêu, bối cảnh doanh nghiệp và thời gian muốn hoàn thành khóa','Nhận lộ trình học cá nhân hóa và bắt đầu bài học đầu tiên']}],
   help,cta:'Truy cập khóa học',ctaTo:'mycourses'}];
}
/* ---------- Hộp thư mô phỏng ---------- */
// Gọi khi thanh toán thành công: lưu email vào hộp thư của học viên (S.mails) và báo cho người dùng
function sendConfirmEmail(){
 const o=S.order;if(!o||!o.email)return;
 if(S.mails.some(m=>m.kind==='confirm'&&m.code===o.code))return; // mỗi đơn chỉ gửi 1 lần
 const at=nowStr(),t=Date.now();
 const m1={id:'m'+t,kind:'confirm',code:o.code,to:o.email,at,read:false,order:{...o}},m2={id:'m'+t+'a',kind:'access',code:o.code,to:o.email,at,read:false,order:{...o}};
 S.mails.unshift(m1,m2);
 // Zalo OA: gửi tới số điện thoại / Zalo của đơn (hệ thống thật: ZNS, cần OA đã xác thực và mẫu tin đã duyệt)
 if(realMailOn()){sendRealEmail(m1);sendRealEmail(m2);}
 const ph=sendEnrollZalo(o,at);
 toast(`Đã gửi 2 email tới ${o.email}${ph?` và 2 tin Zalo OA tới ${ph}`:''}`);
}
// gửi 2 tin Zalo OA khi đăng ký thành công (mỗi đơn 1 lần); số Zalo = số điện thoại của đơn, thiếu thì lấy của tài khoản
function sendEnrollZalo(o,at){const ph=o.phone||(S.account&&S.account.phone);if(!ph||(S.zalo||[]).some(z=>z.kind==='enroll'&&z.code===o.code))return ph;
 enrollZaloMsgs(o).forEach((msg,i)=>S.zalo.unshift({id:'z'+Date.now()+i,at:at||nowStr(),read:false,msg,kind:'enroll',code:o.code}));return ph;}
/* ---------- Email hóa đơn điện tử (đề xuất mới, US-03.4 · FR-6): gửi tới Email nhận hóa đơn công ty ----------
   Chỉ gửi khi học viên chọn "Xuất hóa đơn cho công ty". Số hóa đơn, ký hiệu, mã tra cứu, MST bên bán là minh họa;
   hệ thống thật lấy từ nhà cung cấp hóa đơn điện tử (VNPT/Viettel/MISA…) và đính kèm tệp PDF + XML. */
function invoiceEmail(o,opt={}){
 const logo=opt.logo||'img/logo.png',inv=o.inv||{};
 const subject=`Hóa đơn điện tử số ${inv.no||''} · Khóa học AI for CEO`;
 const row=(k,v,strong)=>`<tr><td style="padding:8px 0;color:#5B6472;font-size:14px;border-top:1px solid #E6E8EC;width:42%">${k}</td><td style="padding:8px 0;font-size:14px;border-top:1px solid #E6E8EC;text-align:right;color:#141A26;${strong?'font-weight:800;font-size:16px':''}">${v}</td></tr>`;
 const h=t=>`<h2 style="margin:24px 0 8px;font-size:16px;line-height:1.4;color:#141A26">${t}</h2>`;
 const p=t=>`<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2B3240">${t}</p>`;
 const html=`<div style="background:#F3F4F6;padding:24px 12px;font-family:Roboto,Arial,Helvetica,sans-serif;color:#141A26">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E6E8EC;border-radius:12px;border-collapse:separate">
<tr><td style="padding:24px 32px;border-bottom:1px solid #E6E8EC"><img src="${logo}" alt="${ACADEMY.name}" width="180" style="display:block;height:auto;max-width:180px"></td></tr>
<tr><td style="padding:28px 32px 8px">
 <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#141A26">Kính gửi ${esc(o.invName||o.company||'Quý khách hàng')},</h1>
 ${p(`${ACADEMY.name} gửi Quý công ty hóa đơn điện tử cho đơn đăng ký khóa học <b>AI for CEO</b> của học viên <b>${esc(o.name||'')}</b> (mã đơn <b>${esc(o.code)}</b>).`)}
 ${h('Thông tin hóa đơn')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Ký hiệu',esc(inv.series||''))}${row('Số hóa đơn',esc(inv.no||''))}${row('Ngày lập',esc(inv.date||''))}${row('Mã tra cứu',esc(inv.lookup||''))}</table>
 ${h('Đơn vị mua hàng')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Tên công ty',esc(o.invName||''))}${row('Mã số thuế',esc(o.taxId||''))}${row('Địa chỉ',esc(o.invAddr||''))}${row('Người mua hàng',esc(o.name||''))}${row('Hình thức thanh toán','Chuyển khoản')}</table>
 ${h('Nội dung')}
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Khóa học AI for CEO · Trọn khóa (1 học viên)',money(COURSE.list))}${row(esc(COURSE.promo),'−'+money(SAVE))}${row('Tổng tiền thanh toán',money(COURSE.price),true)}</table>
 <p style="margin:8px 0 20px;font-size:12.5px;color:#5B6472">Thuế GTGT áp dụng theo quy định hiện hành. Số liệu trong bản demo là minh họa.</p>
 ${p(`Tệp đính kèm: hóa đơn bản PDF và XML. Cần điều chỉnh thông tin hóa đơn, Quý công ty vui lòng phản hồi tới <a href="mailto:${ACADEMY.billing}" style="color:#1747C9">${ACADEMY.billing}</a> kèm số hóa đơn.`)}
</td></tr>
${emailFooter({logo,reason:`Quý công ty nhận email này vì là đơn vị mua hàng trên hóa đơn của đơn ${esc(o.code)}.`})}</table></div>`;
 const text=[`Kính gửi ${o.invName||'Quý khách hàng'},`,'',`${ACADEMY.name} gửi hóa đơn điện tử cho đơn ${o.code} (khóa AI for CEO, học viên ${o.name||''}).`,'',
  `Ký hiệu: ${inv.series}`,`Số hóa đơn: ${inv.no}`,`Ngày lập: ${inv.date}`,`Mã tra cứu: ${inv.lookup}`,'',
  `Đơn vị mua: ${o.invName} · MST ${o.taxId}`,`Địa chỉ: ${o.invAddr}`,`Tổng tiền thanh toán: ${money(COURSE.price)}`,'',`Điều chỉnh hóa đơn: ${ACADEMY.billing}`,'',ACADEMY.name].join('\n');
 return {from:`${ACADEMY.name} <${ACADEMY.sender}>`,to:o.invEmail||o.email,subject,html,text};
}
// Gọi sau khi thanh toán thành công (nếu có yêu cầu xuất hóa đơn): xuất hóa đơn và gửi tới email công ty
function sendInvoiceEmail(){
 const o=S.order;if(!o||!o.invoice||!o.invEmail)return;
 if(S.mails.some(m=>m.kind==='invoice'&&!m.sample&&m.code===o.code))return; // mỗi đơn 1 hóa đơn
 const n=String(Math.floor(100+Math.random()*900)).padStart(8,'0');
 o.inv={series:'1C26TST',no:n,date:today(),lookup:'STT'+o.code.replace(/\D/g,'')};
 const m={id:'m'+Date.now()+'i',kind:'invoice',code:o.code,to:o.invEmail,at:nowStr(),read:false,order:{...o}};
 S.mails.unshift(m);
 if(realMailOn())sendRealEmail(m);else toast(`Đã xuất hóa đơn điện tử và gửi tới ${o.invEmail}`);
}
// Email hóa đơn mẫu trong Hộp thư (để xem mẫu dù đơn không chọn xuất hóa đơn): lấy thông tin đơn/tài khoản nếu có, thiếu thì dùng dữ liệu mẫu
function ensureSampleInvoice(){
 if(S.mails.some(m=>m.kind==='invoice'))return;
 const b=S.order||{},ac=S.account||{};
 const o={code:b.code||'AICEO-000000',name:b.name||ac.name||SAMPLE_PROFILE.name,email:b.email||ac.email||'long.nguyen@minhan.vn',company:b.company||SAMPLE_PROFILE.company,invoice:true,
  invName:b.invName||b.company||SAMPLE_PROFILE.company,taxId:b.taxId||'0312345678',invAddr:b.invAddr||'125 Nguyễn Văn Linh, Quận 7, TP.HCM',invEmail:b.invEmail||'ketoan@minhan.vn'};
 o.inv={series:'1C26TST',no:'00000001',date:b.paidAt||today(),lookup:'STT'+o.code.replace(/\D/g,'')};
 S.mails.push({id:'m'+Date.now()+'s',kind:'invoice',sample:true,code:o.code,to:o.invEmail,at:nowStr(),read:false,order:o});
}
const mailSubject=x=>x.kind==='remind'?x.msg.title:x.kind==='invoice'?`Hóa đơn điện tử số ${(x.order.inv||{}).no||''}`:x.kind==='access'?ACCESS_SUBJECT:CONFIRM_SUBJECT;
// nội dung 1 email trong hộp thư: xác nhận đăng ký, hóa đơn hoặc nhắc lịch học
function mailContent(m,opt){return m.kind==='remind'?{...remindEmail(m.msg,opt),to:m.to}:m.kind==='invoice'?invoiceEmail(m.order,opt):confirmEmail(m.order,{...opt,part:m.kind==='access'?'access':'confirm'});}
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
 const e=mailContent(m,{logo:new URL('img/logo.png',base).href,url:base});
 m.real='sending';render();
 try{
  const ej=await loadEmailJS();
  await ej.send(EMAILJS.serviceId,EMAILJS.templateId,{to_email:e.to,to_name:(S.order&&S.order.name)||'',subject:e.subject,html:e.html,text:e.text,reply_to:ACADEMY.support,from_name:ACADEMY.name});
  m.real='sent';if(m.kind!=='remind')toast(`Đã gửi ${m.kind==='invoice'?'email hóa đơn':m.kind==='access'?'email kích hoạt khóa học':'email xác nhận'} tới ${e.to}. Anh/chị kiểm tra hộp thư (cả mục Spam/Quảng cáo)`);
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
/* Hộp thư mô phỏng theo giao diện Gmail: thanh trên (menu, logo, ô tìm kiếm, ảnh đại diện), cột trái (Soạn thư, Hộp thư đến…),
   danh sách thư (T.mailOpen==='list') và trang đọc thư (T.mailOpen = id). Chỉ để mô phỏng, các nút ngoài mở/đóng thư không có tác dụng. */
const GM_IC={menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/>',inbox:'<path d="M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',send:'<path d="M3 11 21 3l-8 18-2-8z"/>',file:'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>',back:'<path d="M19 12H5M12 5l-7 7 7 7"/>',
 archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',more:'<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
 reply:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v4"/>',fwd:'<path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0-6 6v4"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',
 refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',box:'<rect x="4" y="4" width="16" height="16" rx="2"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',caret:'<path d="m7 10 5 5 5-5"/>'};
const gmIc=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GM_IC[n]}</svg>`;
const GM_LOGO='<svg width="30" height="22" viewBox="0 0 48 36" aria-hidden="true"><path fill="#4285F4" d="M3.3 36h7.6V17.5L0 9.4v23.3A3.3 3.3 0 0 0 3.3 36z"/><path fill="#34A853" d="M37.1 36h7.6a3.3 3.3 0 0 0 3.3-3.3V9.4l-10.9 8.1z"/><path fill="#FBBC04" d="M37.1 3.4v14.1L48 9.4V5c0-4-4.6-6.3-7.8-3.9z"/><path fill="#EA4335" d="M10.9 17.5V3.4L24 13.2l13.1-9.8v14.1L24 27.3z"/><path fill="#C5221F" d="M0 5v4.4l10.9 8.1V3.4L7.8 1.1C4.6-1.3 0 1 0 5z"/></svg>';
// giờ hiển thị kiểu Gmail: hôm nay → "14:11", ngày khác → "6 thg 10"
function gmTime(at){const m=String(at||'').match(/(\d{1,2}:\d{2})\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(!m)return esc(at||'');const d=new Date(),same=+m[2]===d.getDate()&&+m[3]===d.getMonth()+1&&+m[4]===d.getFullYear();return same?m[1]:`${+m[2]} thg ${+m[3]}`;}
function mailView(){
 if(!T.mailOpen)return '';
 const list=T.mailOpen==='list',m=list?null:(S.mails.find(x=>x.id===T.mailOpen)||S.mails[0]);if(!list&&!m)return '';
 const me=(S.account&&S.account.email)||(S.order&&S.order.email)||(m&&m.to)||'',av=((S.account&&S.account.name)||(S.order&&S.order.name)||'A').trim().split(/\s+/).pop().charAt(0).toUpperCase();
 const unread=S.mails.filter(x=>!x.read).length,n=S.mails.length;
 const nav=[['inbox','Hộp thư đến',unread||''],['star','Có gắn dấu sao',''],['clock','Đã tạm ẩn',''],['send','Đã gửi',''],['file','Thư nháp','']];
 const side=`<aside class="gm-side"><button class="gm-compose" type="button" tabindex="-1">${gmIc('pen',20)} Soạn thư</button>
  <nav>${nav.map(([i,l,c],k)=>`<span class="gm-nav${k?'':' on'}">${gmIc(i,19)}<span>${l}</span><b>${c}</b></span>`).join('')}</nav></aside>`;
 const top=`<div class="gm-top"><span class="gm-ib">${gmIc('menu',22)}</span><span class="gm-logo">${GM_LOGO}<span>Gmail</span><small>mô phỏng</small></span>
  <div class="gm-search">${gmIc('search',20)}<span>Tìm kiếm trong thư</span></div>
  <span class="gm-ib gm-hide">${gmIc('help',22)}</span><span class="gm-ib gm-hide">${gmIc('gear',22)}</span><span class="gm-av" title="${esc(me)}">${esc(av)}</span>
  <button class="gm-x" data-a="mailClose" aria-label="Đóng hộp thư mô phỏng" title="Đóng">${gmIc('x',22)}</button></div>`;
 let main;
 if(list){
  const rows=S.mails.map(x=>{const c=mailContent(x,{url:'#'}),t0=String(c.text||'').replace(/\s+/g,' ').trim(),sn=(t0.startsWith(c.subject)?t0.slice(c.subject.length):t0).trim().slice(0,140);
   return `<button class="gm-row${x.read?'':' unread'}" data-a="mailOpen" data-v="${x.id}"><span class="gm-ck">${gmIc('box',18)}</span><span class="gm-st">${gmIc('star',18)}</span>
    <span class="gm-from">${esc(ACADEMY.name)}</span><span class="gm-sum"><span class="gm-sj">${esc(mailSubject(x))}</span><span class="gm-sn"> - ${esc(sn)}</span></span><span class="gm-t">${gmTime(x.at)}</span></button>`;}).join('');
  main=`<div class="gm-tools"><span class="gm-ib sm">${gmIc('box',18)}</span><span class="gm-ib sm">${gmIc('refresh',18)}</span><span class="gm-ib sm">${gmIc('more',18)}</span><span class="gm-count">1–${n} trong số ${n}</span></div>
   <div class="gm-tabs"><span class="on">${gmIc('inbox',18)} Chính</span><span>Quảng cáo</span><span>Mạng xã hội</span></div>
   <div class="gm-rows" role="list">${rows||'<p class="gm-empty">Không có thư nào trong Hộp thư đến.</p>'}</div>`;
 }else{
  const e=mailContent(m,{url:'#',ctaAttr:m.kind==='remind'?`data-a="zaloCta" data-v="${m.msg.ctaTo}"`:m.kind==='invoice'?'data-a="invLookup"':'data-a="mailCta"'}),k=S.mails.indexOf(m);
  main=`<div class="gm-tools"><button class="gm-ib sm" data-a="mailOpen" data-v="list" aria-label="Quay lại Hộp thư đến" title="Quay lại Hộp thư đến">${gmIc('back',18)}</button><span class="gm-ib sm">${gmIc('archive',18)}</span><span class="gm-ib sm">${gmIc('trash',18)}</span><span class="gm-ib sm">${gmIc('more',18)}</span>
    <span class="gm-count">${k+1} trong số ${n}</span>${k>0?`<button class="gm-ib sm" data-a="mailOpen" data-v="${S.mails[k-1].id}" aria-label="Thư mới hơn">${gmIc('left',18)}</button>`:`<span class="gm-ib sm off">${gmIc('left',18)}</span>`}${k<n-1?`<button class="gm-ib sm" data-a="mailOpen" data-v="${S.mails[k+1].id}" aria-label="Thư cũ hơn">${gmIc('right',18)}</button>`:`<span class="gm-ib sm off">${gmIc('right',18)}</span>`}</div>
   <div class="gm-read"><div class="gm-subj"><h2>${esc(e.subject)}</h2><span class="gm-lbl">Hộp thư đến <i>×</i></span></div>
    <div class="gm-from-row"><span class="gm-sav" aria-hidden="true">S</span><div class="gm-who"><div><b>${esc(ACADEMY.name)}</b> <span>&lt;${esc(ACADEMY.sender)}&gt;</span></div><div class="gm-to">đến tôi ${gmIc('caret',14)}</div></div>
     <div class="gm-meta"><span>${esc(m.at)}</span><span class="gm-ib sm">${gmIc('star',18)}</span><span class="gm-ib sm">${gmIc('reply',18)}</span><span class="gm-ib sm">${gmIc('more',18)}</span></div></div>
    ${m.real?`<div class="mail-real ${m.real}">${m.real==='sent'?`${ic('check',15)} Đã gửi email thật tới <b>${esc(m.to)}</b>. Nếu chưa thấy, anh/chị xem mục Spam hoặc Quảng cáo.`:m.real==='sending'?'Đang gửi email thật…':`${ic('x',15)} Chưa gửi được email thật (${esc(m.err||'')}). <button class="btn-link" data-a="mailResend" data-v="${m.id}">Gửi lại</button>`}</div>`:''}
    <div class="gm-body mail-body">${e.html}</div>
    ${m.kind==='invoice'?(()=>{const no=(m.order.inv||{}).no||'00000001';return `<div class="gm-att"><b>2 tệp đính kèm</b><div class="gm-att-l">${[['pdf','#D93025'],['xml','#1A73E8']].map(([x,c])=>`<span class="gm-file"><span class="gm-file-ic" style="background:${c}">${x.toUpperCase()}</span><span class="gm-file-n">HoaDon_${esc(no)}.${x}</span></span>`).join('')}</div></div>`;})():''}<div class="gm-actions"><span class="gm-pill">${gmIc('reply',18)} Trả lời</span><span class="gm-pill">${gmIc('fwd',18)} Chuyển tiếp</span></div></div>`;
 }
 return `<div class="mail-ov" role="presentation"><div class="gm" role="dialog" aria-modal="true" aria-label="${list?'Hộp thư đến':'Email: '+esc(mailSubject(m))} (Gmail mô phỏng)">${top}<div class="gm-wrap">${side}<main class="gm-main">${main}</main></div></div></div>`;
}
