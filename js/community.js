/* =========================================================
   CỘNG ĐỒNG — CEO AI Community kiểu Skool (FR-46, US-09.5)
   Mở ở tab trình duyệt riêng (index.html#community). Gồm: Bảng tin (bài viết, bình luận, thích, ghim, chủ đề),
   Lớp học (dẫn về khóa), Lịch sự kiện, Thành viên, Bảng xếp hạng (điểm & cấp độ).
   Demo: dữ liệu mẫu bên dưới là MINH HỌA (người và công ty không có thật); bài/bình luận của học viên lưu ở S.comm.
   Hệ thống thật: cần máy chủ lưu bài viết, thông báo, kiểm duyệt (Admin) và đồng bộ giữa các thành viên.
   ========================================================= */

/* ---------- dữ liệu mẫu ---------- */
const COMM={name:'CEO AI Community',tagline:'Nơi các CEO chia sẻ use case, hỏi đáp và cập nhật AI mỗi tháng',
 members:428,online:23,
 // ảnh bìa (để trống = nền màu): đặt đường dẫn ảnh, vd. 'img/cover-aiceo.jpg'. Kích thước gợi ý 1500×500 (tỉ lệ 3:1)
 cover:'',
 rules:['Chia sẻ thật, cụ thể: bài toán, cách làm, kết quả','Không quảng cáo, không bán hàng trong bài viết','Tôn trọng thông tin của doanh nghiệp khác, không chia sẻ dữ liệu khách hàng']};
const COMM_CATS=[['all','Tất cả'],['res','Bài viết'],['ask','Hỏi đáp'],['usecase','Chia sẻ use case'],['news','Thông báo']];
const CAT_COLOR={ask:'#1747C9',usecase:'#7C3AED',win:'#15803D',res:'#0E7490',news:'#EA580C'};
const COMM_PEOPLE={
 mt:{name:'Minh Thư',role:'Quản trị cộng đồng · Học viện',pts:2140,admin:true,online:true,c:'#15803D'},
 dt:{name:'Trần Quốc Duy',role:'CEO · Chuỗi bán lẻ điện máy',pts:612,online:true,c:'#1747C9'},
 lh:{name:'Lê Thu Hà',role:'Founder · Dịch vụ kế toán B2B',pts:384,online:true,c:'#DB2777'},
 pk:{name:'Phạm Minh Khoa',role:'Giám đốc · Nhà máy bao bì',pts:241,online:false,c:'#EA580C'},
 nv:{name:'Ngô Thanh Vy',role:'CEO · Trung tâm Anh ngữ',pts:167,online:true,c:'#7C3AED'},
 hb:{name:'Hoàng Gia Bảo',role:'CEO · Chuỗi cà phê',pts:96,online:false,c:'#0E7490'},
 tl:{name:'Đỗ Thị Lan',role:'COO · Công ty logistics',pts:58,online:false,c:'#B45309'},
 qa:{name:'Vũ Quang Anh',role:'Founder · Agency marketing',pts:23,online:true,c:'#DC2626'}};
// ago: số giờ trước; likes: số lượt thích có sẵn
const COMM_SEED=[
 {id:'p1',by:'mt',cat:'news',pin:true,ago:240,likes:86,title:'👋 Chào mừng đến CEO AI Community: đọc trước khi đăng bài',
  body:'Đây là nơi dành riêng cho học viên khóa AI for CEO. Ba việc nên làm ngay:\n1. Giới thiệu bản thân ở phần bình luận: công ty, ngành, bài toán đang muốn dùng AI.\n2. Chia sẻ 3 use case anh/chị chọn sau Module 12 để nhận góp ý.\n3. Đăng ký Live Zoom "AI đến đâu rồi?" hằng tháng ở tab Lịch.\nMỗi bài đăng được cộng 2 điểm, mỗi lượt thích bài viết hoặc bình luận của anh/chị được cộng 1 điểm. Lên cấp để mở thêm tài nguyên.',
  comments:[{by:'dt',ago:200,text:'Chào cả nhà, Duy bên chuỗi điện máy 32 cửa hàng. Đang muốn tự động hóa báo cáo tồn kho.'},{by:'nv',ago:150,text:'Vy, trung tâm Anh ngữ ở Đà Nẵng. Bài toán của mình là tư vấn tuyển sinh ngoài giờ.'}]},
 {id:'p2',by:'mt',cat:'news',ago:30,likes:41,title:'Live Zoom tháng 10: AI đến đâu rồi?',
  body:'Thời gian: 20:00, thứ Năm 15/10. Chủ đề tháng này: AI Agent đã làm được gì trong vận hành doanh nghiệp vừa và nhỏ, kèm 3 demo trực tiếp. Gửi câu hỏi trước ở phần bình luận, Học viện sẽ chọn câu hỏi để trả lời trong buổi.',
  comments:[{by:'pk',ago:20,text:'Mong buổi này có demo agent đọc đơn hàng email rồi nhập vào ERP.'}]},
 {id:'p3',by:'dt',cat:'usecase',ago:9,likes:57,media:[{id:'seed-p3a',type:'image',alt:'Báo cáo doanh thu tự động',src:"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'600'%20height%3D'600'%20viewBox%3D'0%200%20600%20600'%3E%3Crect%20width%3D'600'%20height%3D'600'%20fill%3D'%23F4F7FF'%2F%3E%3Ctext%20x%3D'36'%20y%3D'64'%20font-family%3D'Arial'%20font-size%3D'30'%20font-weight%3D'700'%20fill%3D'%23172033'%3EDoanh%20thu%20tu%E1%BA%A7n%3C%2Ftext%3E%3Ctext%20x%3D'36'%20y%3D'100'%20font-family%3D'Arial'%20font-size%3D'22'%20fill%3D'%235B6472'%3EB%C3%A1o%20c%C3%A1o%20t%E1%BB%B1%20%C4%91%E1%BB%99ng%207%3A00%20th%E1%BB%A9%20Hai%3C%2Ftext%3E%3Crect%20x%3D'44'%20y%3D'390'%20width%3D'52'%20height%3D'150'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.45'%2F%3E%3Crect%20x%3D'120'%20y%3D'320'%20width%3D'52'%20height%3D'220'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.53'%2F%3E%3Crect%20x%3D'196'%20y%3D'350'%20width%3D'52'%20height%3D'190'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.61'%2F%3E%3Crect%20x%3D'272'%20y%3D'260'%20width%3D'52'%20height%3D'280'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.69'%2F%3E%3Crect%20x%3D'348'%20y%3D'290'%20width%3D'52'%20height%3D'250'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.77'%2F%3E%3Crect%20x%3D'424'%20y%3D'200'%20width%3D'52'%20height%3D'340'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.8500000000000001'%2F%3E%3Crect%20x%3D'500'%20y%3D'170'%20width%3D'52'%20height%3D'370'%20rx%3D'8'%20fill%3D'%231747C9'%20opacity%3D'0.9299999999999999'%2F%3E%3Cline%20x1%3D'30'%20y1%3D'540'%20x2%3D'570'%20y2%3D'540'%20stroke%3D'%23C9D1DD'%20stroke-width%3D'2'%2F%3E%3C%2Fsvg%3E"},{id:'seed-p3b',type:'image',alt:'Thời gian làm báo cáo',src:"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'600'%20height%3D'600'%20viewBox%3D'0%200%20600%20600'%3E%3Crect%20width%3D'600'%20height%3D'600'%20fill%3D'%23F4F7FF'%2F%3E%3Ctext%20x%3D'36'%20y%3D'64'%20font-family%3D'Arial'%20font-size%3D'30'%20font-weight%3D'700'%20fill%3D'%23172033'%3ETh%E1%BB%9Di%20gian%20l%C3%A0m%20b%C3%A1o%20c%C3%A1o%3C%2Ftext%3E%3Ctext%20x%3D'36'%20y%3D'100'%20font-family%3D'Arial'%20font-size%3D'22'%20fill%3D'%235B6472'%3EPh%C3%BAt%20m%E1%BB%97i%20tu%E1%BA%A7n%3C%2Ftext%3E%3Crect%20x%3D'44'%20y%3D'160'%20width%3D'52'%20height%3D'380'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.45'%2F%3E%3Crect%20x%3D'120'%20y%3D'220'%20width%3D'52'%20height%3D'320'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.53'%2F%3E%3Crect%20x%3D'196'%20y%3D'320'%20width%3D'52'%20height%3D'220'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.61'%2F%3E%3Crect%20x%3D'272'%20y%3D'430'%20width%3D'52'%20height%3D'110'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.69'%2F%3E%3Crect%20x%3D'348'%20y%3D'490'%20width%3D'52'%20height%3D'50'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.77'%2F%3E%3Crect%20x%3D'424'%20y%3D'515'%20width%3D'52'%20height%3D'25'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.8500000000000001'%2F%3E%3Crect%20x%3D'500'%20y%3D'522'%20width%3D'52'%20height%3D'18'%20rx%3D'8'%20fill%3D'%2322A06B'%20opacity%3D'0.9299999999999999'%2F%3E%3Cline%20x1%3D'30'%20y1%3D'540'%20x2%3D'570'%20y2%3D'540'%20stroke%3D'%23C9D1DD'%20stroke-width%3D'2'%2F%3E%3C%2Fsvg%3E"}],title:'Báo cáo doanh thu sáng thứ Hai: từ 6 giờ xuống 15 phút',
  body:'Sau Module 08 (Tự động hóa), mình cho đội IT nối dữ liệu bán hàng của 32 cửa hàng vào một quy trình tự động. 7 giờ sáng thứ Hai, ban giám đốc nhận email tóm tắt: doanh thu, cửa hàng tụt, mặt hàng sắp hết. Trước đây kế toán mất gần 6 giờ để làm việc này.\nBài học: bắt đầu từ một báo cáo cả công ty đều cần, không cần phức tạp.',
  comments:[{by:'lh',ago:7,text:'Rất thực tế. Anh dùng công cụ gì để gửi email tự động vậy?'},{by:'dt',ago:6,text:'Bên mình dùng công cụ tự động hóa có sẵn, đội IT 2 người làm trong 1 tuần.'},{by:'mt',ago:5,text:'Cảm ơn anh Duy, Học viện ghim bài này vào mục Thắng lợi AI tháng 10 nhé!'}]},
 {id:'p4',by:'lh',cat:'ask',ago:5,likes:23,title:'Có nên cho nhân viên dùng chatbot AI miễn phí với tài liệu của khách hàng?',
  body:'Đội kế toán bên mình đang tự dùng chatbot bản miễn phí để tóm tắt hợp đồng của khách. Mình lo về bảo mật. Các anh chị đang đặt quy định thế nào?',
  comments:[{by:'pk',ago:4,text:'Bên mình cấm dùng bản miễn phí với dữ liệu khách hàng, chuyển sang gói doanh nghiệp có cam kết không dùng dữ liệu để huấn luyện.'},{by:'mt',ago:3,text:'Module 11 có phần quy tắc dùng AI an toàn. Học viện sẽ chia sẻ mẫu quy định nội bộ trong mục Tài nguyên tuần này.'}]},
 {id:'p5',by:'nv',cat:'usecase',ago:3,likes:15,title:'3 use case mình chọn sau Module 12, nhờ cả nhà góp ý',
  body:'1. Trợ lý trả lời tin nhắn tư vấn tuyển sinh ngoài giờ (CSKH, Kết nối hệ thống).\n2. Soạn bài tập, đề kiểm tra từ giáo trình (Vận hành, Tạo nội dung).\n3. Phân tích lý do học viên bỏ học từ phiếu khảo sát (Ban giám đốc, Nghiên cứu & phân tích).\nMình định thử số 1 trước vì tháng nào cũng mất học viên tiềm năng nhắn tin buổi tối.',
  comments:[{by:'hb',ago:2,text:'Đồng ý làm số 1 trước. Bên mình làm cho đặt bàn, sau 1 tháng tăng 18% lượt đặt buổi tối.'}]},
 {id:'p6',by:'mt',cat:'res',ago:28,likes:64,title:'Tài nguyên: Checklist chọn nhà cung cấp AI cho doanh nghiệp',
  body:'12 câu hỏi CEO nên hỏi trước khi ký với nhà cung cấp AI: dữ liệu lưu ở đâu, ai được xem, chi phí theo lượt dùng, cách đo hiệu quả trong 30 ngày đầu… Tải file trong phần đính kèm (minh họa).',
  comments:[]},
];
// cấp độ theo điểm (giống Skool): điểm = lượt thích nhận được trên bài viết và bình luận
const COMM_LEVELS=[0,5,20,65,155,515,2015,8015,33015];
const COMM_LEVEL_NAME=['','Người mới','Thành viên','Tích cực','Người chia sẻ','Chuyên gia','Người truyền cảm hứng','Đại sứ','Huyền thoại','Biểu tượng'];
const COMM_EVENTS=[
 {d:'15/10',t:'20:00 · Thứ Năm',title:'Live Zoom: AI đến đâu rồi? · Tháng 10',desc:'Năng lực mới, 3 demo trực tiếp về AI Agent, hỏi đáp CEO.',len:'75 phút · Zoom',k:'live'},
 {d:'22/10',t:'12:00 · Thứ Năm',title:'Hỏi đáp nhanh cùng chuyên gia: Chọn use case đầu tiên',desc:'30 phút giờ trưa, mang 3 use case của anh/chị đến để được góp ý.',len:'30 phút · Zoom',k:'ama'},
 {d:'08/11',t:'08:30 · Thứ Bảy',title:'Offline Executive Briefing tại TP.HCM',desc:'Nửa ngày xem demo live và thảo luận theo nhóm ngành. Số lượng giới hạn.',len:'4 giờ · Trực tiếp',k:'offline'}];

/* ---------- số liệu ---------- */
const commLevel=pts=>{let l=1;COMM_LEVELS.forEach((v,i)=>{if(pts>=v)l=i+1;});return l;};
const timeAgo=h=>h<1?'vừa xong':h<24?`${Math.round(h)} giờ trước`:h<24*30?`${Math.round(h/24)} ngày trước`:`${Math.round(h/24/30)} tháng trước`;
const meId='me';
function commMe(){const n=S.profile.name||(S.order&&S.order.name)||(S.account&&S.account.name)||'Thành viên';return {name:n,role:`CEO · ${S.profile.company||(S.order&&S.order.company)||(S.enrolled?'Học viên AI for CEO':'Thành viên cộng đồng')}`,c:'#1747C9',online:true};}
const person=id=>id===meId?commMe():COMM_PEOPLE[id];
// tất cả bài: bài mẫu + bài của học viên; tuổi bài của học viên tính từ lúc đăng
function commPosts(){
 const C=S.comm,now=Date.now();
 const mine=C.posts.map(p=>({...p,ago:(now-p.at)/36e5,mine:true}));
 return [...mine,...COMM_SEED].map(p=>{const extra=C.comments[p.id]||[];return {...p,
  comments:[...(p.comments||[]).map(c=>({...c,ago:c.at?(now-c.at)/36e5:c.ago})),...extra.map(c=>({...c,ago:(now-c.at)/36e5}))],
  likes:(p.likes||0)+(C.likes[p.id]?1:0)+(C.gotLikes[p.id]||0),liked:!!C.likes[p.id]};});
}
// điểm của học viên = lượt thích nhận được trên bài và bình luận của mình
// điểm cộng đồng: mỗi bài đăng +POST_PTS, mỗi lượt thích bài viết/bình luận nhận được +1
const POST_PTS=2;
function myPoints(){const C=S.comm;return (C.posts||[]).filter(p=>p.by===meId).length*POST_PTS+Object.values(C.gotLikes).reduce((s,v)=>s+v,0);}

/* ---------- giao diện ---------- */
const avatar=(id,size=40)=>{const p=person(id);const ini=p.name.trim().split(/\s+/).pop()[0]||'?';const lv=id===meId?commLevel(myPoints()):commLevel(p.pts);
 return `<span class="cm-av ${size<=30?'sm':''}" style="--c:${p.c};width:${size}px;height:${size}px;font-size:${Math.round(size*.4)}px">${esc(ini)}<i class="lv" title="Cấp ${lv}">${lv}</i>${p.online?'<i class="on" aria-label="Đang trực tuyến"></i>':''}</span>`;};
/* ---------- Trang chủ Cộng đồng (đề xuất mới): Học viện có nhiều cộng đồng, CEO AI Community là một trong số đó ----------
   Demo chỉ có CEO AI Community hoạt động đầy đủ; các cộng đồng khác là minh họa "Sắp ra mắt" (tên, số liệu chưa có thật). */
const COMMUNITIES=[
 {id:'aiceo',cover:COMM.cover,name:'CEO AI Community',desc:'Nơi các CEO chia sẻ use case, hỏi đáp và cập nhật AI mỗi tháng.',topic:'AI cho lãnh đạo',members:COMM.members,from:'#1747C9',to:'#DB2777',icon:'users',live:true},
 {id:'growth',name:'Cộng đồng Siêu Tăng Trưởng',desc:'Chủ doanh nghiệp trao đổi chiến lược tăng trưởng, bán hàng và vận hành.',topic:'Tăng trưởng doanh nghiệp',from:'#0E7490',to:'#22A06B',icon:'chart'},
 {id:'mkt',name:'Marketing & Bán hàng',desc:'Chia sẻ chiến dịch, kênh bán hàng và cách đo hiệu quả.',topic:'Marketing',from:'#EA580C',to:'#F5B942',icon:'pen'},
 {id:'challenge',name:'Thử thách 30 ngày',desc:'Cùng nhau hoàn thành thử thách, báo cáo tiến độ mỗi ngày.',topic:'Thử thách',from:'#7C3AED',to:'#3874FF',icon:'flag'}];
const commOf=id=>COMMUNITIES.find(x=>x.id===id);
const commBack=()=>`<button class="cm-back" data-a="commHub">${ic('back',16)} Tất cả cộng đồng</button>`;
function commHub(){
 const login=S.loggedIn&&S.account;
 const cards=COMMUNITIES.map(x=>{const joined=x.id==='aiceo'&&login&&S.comm.joined,ico=ic(x.icon,26)||ic('users',26);
  const badge=!x.live?'<span class="pill wait">Sắp ra mắt</span>':joined?`<span class="pill ok">${ic('check',12)} Đã tham gia</span>`:'<span class="pill">Đang mở</span>';
  
  return `<article class="card cmh-card${x.live?'':' soon'}"${x.live?` data-a="commEnter" data-v="${x.id}" role="button" tabindex="0" aria-label="${joined?'Vào':'Xem và tham gia'} ${esc(x.name)}"`:''}><div class="cmh-cover" style="background:${x.cover?`center/cover no-repeat url(${x.cover}),`:''}linear-gradient(135deg,${x.from},${x.to})">${x.cover?'':`<span class="cmh-ico">${ico}</span>`}</div>
   <div class="cmh-body"><div class="cmh-top">${badge}</div><h3 class="h3">${esc(x.name)}</h3><p class="muted">${esc(x.desc)}</p>
    <p class="cmh-meta">${x.live?`${ic('users',15)} ${x.members+(joined?1:0)} thành viên`:`${ic('clock',15)} Đang chuẩn bị`}</p>${x.note?`<p class="cmh-note">${esc(x.note)}</p>`:''}</div></article>`;}).join('');
 return `<section class="wrap page cmh"><div class="page-head"><span class="eyebrow">Cộng đồng</span><h2 class="h2">Cộng đồng Học viện Siêu Tăng Trưởng</h2></div>
  ${login?'':`<div class="callout info cmh-login"><span>${ic('users',18)}</span><div><b>Đăng nhập để tham gia cộng đồng</b><span>Dùng tài khoản Học viện. Chưa có tài khoản thì đăng ký miễn phí.</span></div><div class="cmh-login-b"><button class="btn btn-primary" data-a="commAuth" data-v="login">Đăng nhập</button><button class="btn btn-line" data-a="commAuth" data-v="register">Đăng ký</button></div></div>`}
  <div class="cmh-grid">${cards}</div></section>`;
}
function community(){
 if(!T.commId||!commOf(T.commId)||!commOf(T.commId).live)return commHub();
 // cộng đồng mở cho mọi tài khoản Học viện; riêng tab Lớp học chỉ dành cho học viên đã đăng ký khóa AI for CEO
 if(!S.loggedIn||!S.account)return `<section class="wrap narrow page">${commBack()}<div class="card pad cm-gate"><span class="cm-gate-ico">${ic('users',28)}</span><h2 class="h2">${COMM.name}</h2><p class="sub">Đăng nhập tài khoản Học viện để tham gia cộng đồng ${COMM.members} CEO chia sẻ use case và cập nhật AI mỗi tháng.</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-primary btn-lg" data-a="commAuth" data-v="login">Đăng nhập</button><button class="btn btn-line btn-lg" data-a="commAuth" data-v="register">Đăng ký</button></div></div></section>`;
 const C=S.comm;
 if(!C.joined)return `<section class="wrap narrow page">${commBack()}<div class="card cm-join"><div class="cm-cover"${COMM.cover?` style="background:center/cover no-repeat url(${COMM.cover})"`:''}>${COMM.cover?'':`<span>${ic('users',30)}</span>`}</div><div class="pad" style="display:grid;gap:14px">
  <h2 class="h2">${COMM.name}</h2><p class="sub" style="max-width:none">${COMM.tagline}.</p>
  <div class="cm-stats"><span><b>${COMM.members}</b> thành viên</span><span><i class="dot-on"></i><b>${COMM.online}</b> đang trực tuyến</span><span><b>${COMM_EVENTS.length}</b> sự kiện sắp tới</span></div>
  <div class="cm-rules"><b>Quy tắc cộng đồng</b><ol>${COMM.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ol></div>
  <label class="opt" for="cm-agree"><input type="checkbox" id="cm-agree"><span>Tôi đồng ý với quy tắc cộng đồng</span></label>
  ${T.err.cm?`<p class="err">${esc(T.err.cm)}</p>`:''}
  <div><button class="btn btn-primary btn-lg" data-a="commJoin">Tham gia cộng đồng ${ic('arrow')}</button></div></div></div></section>`;
 const tab=T.commTab||'feed';
 const tabs=[['feed','Cộng đồng'],['class','Lớp học'],['calendar','Sự kiện'],['members','Thành viên'],['leaders','Bảng xếp hạng'],['about','Giới thiệu']];
 const head=`<div class="cm-head"><div class="wrap"><button class="cm-hubbtn" data-a="commHub" aria-label="Tất cả cộng đồng" title="Tất cả cộng đồng">${ic('back',18)}</button><div class="cm-title"><span class="cm-logo">${ic('users',20)}</span><div><b>${COMM.name}</b><small>${COMM.members+1} thành viên · ${COMM.online} đang trực tuyến</small></div></div>
  <nav class="cm-tabs" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${tab===k}" class="${tab===k?'on':''}" data-a="commTab" data-v="${k}">${k==='class'&&!S.enrolled?`${ic('lock',13)} `:''}${l}</button>`).join('')}</nav></div></div>`;
 const body=tab==='calendar'?commCalendar():tab==='members'?commMembers():tab==='leaders'?commLeaders():tab==='about'?commAbout():tab==='class'?(S.enrolled?commClass():commClassLocked()):(T.commPost?commPostView(T.commPost):commFeed());
 return `${head}<section class="wrap page cm">${body}</section>`;
}
// thẻ bên phải: giới thiệu nhanh + cấp độ của tôi + top 5
function commSide(){
 const pts=myPoints(),lv=commLevel(pts),next=COMM_LEVELS[lv]||pts,prev=COMM_LEVELS[lv-1];
 const top=Object.entries(COMM_PEOPLE).sort((a,b)=>b[1].pts-a[1].pts).filter(([,p])=>!p.admin).slice(0,5);
 return `<aside class="cm-side">
  <div class="card cm-card"><div class="cm-cover sm"${COMM.cover?` style="background:center/cover no-repeat url(${COMM.cover})"`:''}>${COMM.cover?'':`<span>${ic('users',22)}</span>`}</div><div class="pad" style="display:grid;gap:10px"><b>${COMM.name}</b><p class="hint">${COMM.tagline}.</p>
   <div class="cm-stats"><span><b>${COMM.members+1}</b> thành viên</span><span><i class="dot-on"></i><b>${COMM.online}</b> trực tuyến</span></div></div></div>
  <div class="card pad cm-card"><div class="cm-me">${avatar(meId,46)}<div><b>Cấp ${lv} · ${COMM_LEVEL_NAME[lv]}</b><span class="hint">${pts} điểm${lv<9?` · còn ${next-pts} điểm lên cấp ${lv+1}`:''}</span></div></div><i class="meter" style="--c:#1747C9"><i style="width:${lv<9?Math.round((pts-prev)/(next-prev)*100):100}%"></i></i><ul class="cm-pts"><li><span>Đăng 1 bài viết</span><b>+${POST_PTS} điểm</b></li><li><span>Mỗi lượt thích bài viết hoặc bình luận của anh/chị</span><b>+1 điểm</b></li></ul></div>
  <div class="card pad cm-card"><div style="display:flex;justify-content:space-between;align-items:center"><b>Bảng xếp hạng 30 ngày</b><button class="btn-link" data-a="commTab" data-v="leaders">Xem tất cả</button></div>
   <ol class="cm-top">${top.map(([id,p],i)=>`<li><span class="rk">${i+1}</span>${avatar(id,30)}<span class="n">${esc(p.name)}</span><b>+${Math.round(p.pts/6)}</b></li>`).join('')}</ol></div>
  <div class="card pad cm-card"><b>Sự kiện sắp tới</b>${commEventRow(COMM_EVENTS[0])}</div></aside>`;
}
function commEventRow(e){const i=COMM_EVENTS.indexOf(e),on=S.comm.events[i];return `<div class="cm-ev"><span class="d"><b>${e.d.split('/')[0]}</b><small>Th${e.d.split('/')[1]}</small></span><div><b>${esc(e.title)}</b><span class="hint">${esc(e.t)} · ${esc(e.len)}</span></div>${on?`<span class="pill ok">${ic('check',12)} Đã đăng ký</span>`:`<button class="btn btn-line btn-sm" data-a="commEvent" data-v="${i}">Tham gia</button>`}</div>`;}
/* ---------- Ảnh / video trong bài viết (giống Facebook) ----------
   Tệp lưu trong IndexedDB của trình duyệt (MEDIA_DB), bài viết chỉ giữ {id,type,name}; mở tab mới vẫn đọc lại được.
   Ảnh được thu nhỏ còn cạnh dài tối đa 1600px trước khi lưu; video tối đa 50 MB; tối đa 10 tệp/bài.
   Hệ thống thật: tải lên máy chủ/CDN (S3, Cloudflare…), nén video, kiểm duyệt nội dung. */
const MEDIA_MAX=10,VIDEO_MAX_MB=50,IMG_MAX_PX=1600;
const MEDIA_URL={},MEDIA_MISS={};let MEDIA_DBP=null;
function mediaDb(){return MEDIA_DBP||(MEDIA_DBP=new Promise((ok,no)=>{try{const r=indexedDB.open('aiceo-media',1);r.onupgradeneeded=()=>r.result.createObjectStore('m');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}catch(e){no(e);}}));}
function mediaPut(id,blob){MEDIA_URL[id]=URL.createObjectURL(blob);return mediaDb().then(db=>new Promise(ok=>{const tx=db.transaction('m','readwrite');tx.objectStore('m').put(blob,id);tx.oncomplete=()=>ok(true);tx.onerror=()=>ok(false);})).catch(()=>false);}
// đọc các tệp chưa có URL rồi vẽ lại (bất đồng bộ, không gọi lại cho tệp đã biết là thiếu)
function mediaLoad(ids){
 const need=ids.filter(id=>!MEDIA_URL[id]&&!MEDIA_MISS[id]&&!mediaLoad.busy[id]);if(!need.length)return;
 need.forEach(id=>mediaLoad.busy[id]=1);
 const done=()=>{need.forEach(id=>delete mediaLoad.busy[id]);render();};
 mediaDb().then(db=>{const st=db.transaction('m').objectStore('m');let n=need.length;need.forEach(id=>{const r=st.get(id);r.onsuccess=()=>{if(r.result)MEDIA_URL[id]=URL.createObjectURL(r.result);else MEDIA_MISS[id]=1;if(!--n)done();};r.onerror=()=>{MEDIA_MISS[id]=1;if(!--n)done();};});})
  .catch(()=>{need.forEach(id=>MEDIA_MISS[id]=1);done();});
}
mediaLoad.busy={};
const mediaSrc=m=>m.src||MEDIA_URL[m.id];
// ảnh lớn: thu nhỏ qua canvas (JPEG), ảnh nhỏ/GIF giữ nguyên
function shrinkImage(file){
 return new Promise(ok=>{if(/gif$/i.test(file.type)){ok(file);return;}const u=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{const k=Math.min(1,IMG_MAX_PX/Math.max(im.width,im.height));if(k>=1&&file.size<1.5e6){URL.revokeObjectURL(u);ok(file);return;}
   const cv=document.createElement('canvas');cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);cv.toBlob(b=>ok(b||file),'image/jpeg',.85);};
  im.onerror=()=>{URL.revokeObjectURL(u);ok(file);};im.src=u;});
}
// thêm tệp người dùng chọn vào bài đang viết (T.commFiles)
async function addCommFiles(list){
 const files=[...list],cur=T.commFiles||(T.commFiles=[]),errs=[];
 for(const f of files){
  if(cur.length>=MEDIA_MAX){errs.push(`Mỗi bài tối đa ${MEDIA_MAX} ảnh/video.`);break;}
  const isV=/^video\//.test(f.type),isI=/^image\//.test(f.type);
  if(!isV&&!isI){errs.push(`"${f.name}" không phải ảnh hoặc video.`);continue;}
  if(isV&&f.size>VIDEO_MAX_MB*1048576){errs.push(`Video "${f.name}" lớn hơn ${VIDEO_MAX_MB} MB.`);continue;}
  const blob=isI?await shrinkImage(f):f;
  cur.push({id:'md'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),type:isV?'video':'image',name:f.name,blob,url:URL.createObjectURL(blob)});
 }
 T.err=errs.length?{cmPost:errs[0]}:{};render();
}
// lưới ảnh/video: 1 tệp to; 2 tệp 2 cột; 3 tệp 1 to + 2 nhỏ; 4 tệp 2×2; ≥5 tệp 2 + 3, ô cuối "+N"
function mediaGrid(list,pid){
 if(!list||!list.length)return '';
 mediaLoad(list.filter(m=>!m.src).map(m=>m.id));
 const show=list.slice(0,5),more=list.length-show.length;
 return `<div class="cm-media n${show.length}">${show.map((m,i)=>{const u=mediaSrc(m);
  const inner=!u?`<span class="cm-mph">${MEDIA_MISS[m.id]?'Tệp không còn trên trình duyệt này':'Đang tải…'}</span>`:m.type==='video'?`<video src="${u}" preload="metadata" muted playsinline></video><span class="cm-play">${ic('play',22)}</span>`:`<img src="${u}" alt="${esc(m.alt||m.name||'Ảnh')}" loading="lazy">`;
  return `<button type="button" class="cm-m" data-a="mediaView" data-v="${pid}" data-i="${i}" aria-label="Xem ${m.type==='video'?'video':'ảnh'} ${i+1}/${list.length}">${inner}${i===4&&more?`<span class="cm-more">+${more}</span>`:''}</button>`;}).join('')}</div>`;
}
// trình xem ảnh/video lớn (bấm ra ngoài, Esc để đóng; ← → để chuyển)
function mediaViewer(){
 if(!T.mediaView)return '';
 const p=commPosts().find(x=>x.id===T.mediaView.pid),list=p&&p.media;if(!list||!list.length)return '';
 const i=Math.max(0,Math.min(T.mediaView.i,list.length-1)),m=list[i],u=mediaSrc(m);
 return `<div class="mail-ov mv-ov" role="presentation"><div class="mv" role="dialog" aria-modal="true" aria-label="Xem ảnh/video ${i+1}/${list.length}">
  <div class="mv-bar"><span>${esc(p.title)} · ${i+1}/${list.length}</span><button class="x" data-a="mediaClose" aria-label="Đóng">${ic('x')}</button></div>
  <div class="mv-stage">${list.length>1?`<button class="mv-nav l" data-a="mediaNav" data-v="-1" aria-label="Ảnh trước">${ic('back',20)}</button>`:''}
   ${!u?'<span class="cm-mph">Đang tải…</span>':m.type==='video'?`<video src="${u}" controls autoplay playsinline></video>`:`<img src="${u}" alt="${esc(m.alt||m.name||'Ảnh')}">`}
   ${list.length>1?`<button class="mv-nav r" data-a="mediaNav" data-v="1" aria-label="Ảnh sau">${ic('arrow',20)}</button>`:''}</div></div></div>`;
}
// bảng tin
function commFeed(){
 const cat=T.commCat||'all',posts=commPosts().filter(p=>cat==='all'||p.cat===cat).sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||a.ago-b.ago);
 const d=T.commDraft||{};
 const compose=T.commWrite?`<form class="card pad cm-compose open" data-f="commPost">${avatar(meId,40)}<div class="cm-compose-b">
   <input class="inp" id="cm-title" name="title" value="${esc(d.title||'')}" placeholder="Tiêu đề bài viết" aria-label="Tiêu đề">
   <textarea class="inp" id="cm-body" name="body" rows="5" placeholder="Chia sẻ use case, kết quả, hoặc đặt câu hỏi cho cộng đồng…" aria-label="Nội dung">${esc(d.body||'')}</textarea>
   ${(T.commFiles||[]).length?`<div class="cm-up">${T.commFiles.map((f,i)=>`<div class="cm-up-i">${f.type==='video'?`<video src="${f.url}" muted preload="metadata"></video><span class="cm-up-v">${ic('play',12)} Video</span>`:`<img src="${f.url}" alt="${esc(f.name)}">`}<button type="button" class="cm-up-x" data-a="cmFileRm" data-v="${i}" aria-label="Bỏ ${esc(f.name)}">${ic('x',14)}</button></div>`).join('')}</div>`:''}
   <div class="cm-add"><span>Thêm vào bài viết</span><label class="cm-add-b" for="cm-file" title="Thêm ảnh hoặc video">${ic('image',18)} Ảnh/Video</label><input type="file" id="cm-file" accept="image/*,video/*" multiple hidden><span class="hint">${(T.commFiles||[]).length}/${MEDIA_MAX}</span></div>
   <div class="cm-compose-f"><label class="hint" for="cm-cat">Chủ đề</label><select class="inp" id="cm-cat" name="cat">${COMM_CATS.filter(([k])=>k!=='all'&&k!=='news').map(([k,l])=>`<option value="${k}" ${d.cat===k?'selected':''}>${l}</option>`).join('')}</select>
    <span style="flex:1"></span><button type="button" class="btn btn-ghost" data-a="commWrite" data-v="0">Hủy</button><button class="btn btn-primary">${ic('send',15)} Đăng bài</button></div>
   ${T.err.cmPost?`<p class="err">${esc(T.err.cmPost)}</p>`:''}</div></form>`
  :`<button class="card pad cm-compose" data-a="commWrite" data-v="1">${avatar(meId,40)}<span>Viết điều gì đó cho cộng đồng…</span></button>`;
 return `<div class="cm-grid"><div class="cm-main">${compose}
  <div class="cm-cats" role="group" aria-label="Lọc theo chủ đề">${COMM_CATS.map(([k,l])=>`<button class="${cat===k?'on':''}" data-a="commCat" data-v="${k}">${l}</button>`).join('')}</div>
  ${posts.length?posts.map(commPostCard).join(''):`<div class="card pad hint" style="text-align:center">Chưa có bài viết trong chủ đề này.</div>`}</div>${commSide()}</div>`;
}
const catLabel=k=>(COMM_CATS.find(c=>c[0]===k)||[,''])[1];
function commPostCard(p){
 const a=person(p.by),last=p.comments.slice(-3);
 return `<article class="card cm-post ${p.pin?'pin':''}"><button class="cm-post-hit" data-a="commOpen" data-v="${p.id}" aria-label="Mở bài: ${esc(p.title)}"></button>
  <div class="cm-post-h">${avatar(p.by,40)}<div><b>${esc(a.name)}${a.admin?'<span class="cm-admin">Quản trị</span>':''}</b><span class="hint">${timeAgo(p.ago)} · <span class="cm-cat" style="--c:${CAT_COLOR[p.cat]}">${catLabel(p.cat)}</span></span></div>${p.pin?`<span class="cm-pin">${ic('flag',13)} Đã ghim</span>`:''}</div>
  <h3>${esc(p.title)}</h3>${p.body?`<p class="cm-ex">${esc(p.body)}</p>`:''}${mediaGrid(p.media,p.id)}
  <div class="cm-post-f"><button class="cm-like ${p.liked?'on':''}" data-a="commLike" data-v="${p.id}" aria-pressed="${p.liked}">${ic('thumb',16)} ${p.likes}</button><span class="cm-cc">${ic('chat',16)} ${p.comments.length}</span>
   ${last.length?`<span class="cm-faces">${last.map(c=>avatar(c.by,24)).join('')}<span class="hint">Bình luận mới ${timeAgo(p.comments[p.comments.length-1].ago)}</span></span>`:''}</div></article>`;
}
function commPostView(id){
 const p=commPosts().find(x=>x.id===id);if(!p){T.commPost=null;return commFeed();}
 const a=person(p.by);
 return `<div class="cm-grid"><div class="cm-main"><div><button class="btn btn-line btn-sm" data-a="commBack">${ic('back',15)} Quay lại bảng tin</button></div>
  <article class="card pad cm-detail"><div class="cm-post-h">${avatar(p.by,46)}<div><b>${esc(a.name)}${a.admin?'<span class="cm-admin">Quản trị</span>':''}</b><span class="hint">${esc(a.role)} · ${timeAgo(p.ago)} · <span class="cm-cat" style="--c:${CAT_COLOR[p.cat]}">${catLabel(p.cat)}</span></span></div></div>
   <h2 class="h3">${esc(p.title)}</h2>${p.body?`<div class="cm-body">${fmt(p.body)}</div>`:''}${mediaGrid(p.media,p.id)}
   <div class="cm-post-f"><button class="cm-like ${p.liked?'on':''}" data-a="commLike" data-v="${p.id}" aria-pressed="${p.liked}">${ic('thumb',16)} ${p.likes} lượt thích</button><span class="cm-cc">${ic('chat',16)} ${p.comments.length} bình luận</span></div>
   <div class="cm-comments">${p.comments.map(c=>{const u=person(c.by);return `<div class="cm-cmt">${avatar(c.by,34)}<div class="cm-bub"><b>${esc(u.name)}</b>${u.admin?'<span class="cm-admin">Quản trị</span>':''}<span class="hint"> · ${timeAgo(c.ago)}</span><p>${fmt(c.text)}</p></div></div>`;}).join('')||'<p class="hint">Chưa có bình luận. Hãy là người đầu tiên!</p>'}</div>
   <form class="cm-reply" data-f="commComment" data-id="${p.id}">${avatar(meId,34)}<input class="inp" id="cm-cmt" name="t" autocomplete="off" placeholder="Viết bình luận…" aria-label="Bình luận"><button class="btn btn-primary btn-sm">Gửi</button></form>
  </article></div>${commSide()}</div>`;
}
// Lớp học khi chưa đăng ký khóa: khóa, mời đăng ký
function commClassLocked(){
 return `<div class="cm-grid"><div class="cm-main"><article class="card pad cm-lock"><span class="cm-lock-ico">${ic('lock',26)}</span>
  <h2 class="h3">Lớp học dành riêng cho học viên khóa AI for CEO</h2>
  <p class="muted">Đăng ký khóa học để mở khóa</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-primary" data-a="go" data-to="checkout">Đăng ký khóa học ${ic('arrow',15)}</button><button class="btn btn-line" data-a="go" data-to="landing">Xem giới thiệu khóa</button></div></article></div>${commSide()}</div>`;
}
/* ---------- Lớp học (kiểu Skool Classroom): video do Admin tải lên riêng cho cộng đồng ----------
   Không lấy từ các module của khóa học. Admin tạo chủ đề và tải video lên (hệ thống thật: trang quản trị cộng đồng).
   Dữ liệu dưới đây là minh họa. Lưới thẻ chủ đề → bấm vào: trình phát video + danh sách video. Đã xem lưu ở S.comm.watched. */
const CLASS_LIB=[
 {id:'live',title:'Live Zoom "AI đến đâu rồi?"',color:'#1747C9',videos:[
  {t:'Tháng 10/2026: Agent bắt đầu làm việc thật trong doanh nghiệp',m:62,d:'Ghi hình buổi Live Zoom tháng 10: các bản cập nhật AI đáng chú ý trong tháng, demo agent tự xử lý đơn hàng và phần hỏi đáp với học viên.'},
  {t:'Tháng 09/2026: AI đọc hiểu tài liệu nội bộ',m:55,d:'Ghi hình buổi Live Zoom tháng 9: cách các công ty đưa tài liệu nội bộ cho AI đọc, những lỗi thường gặp và cách kiểm soát dữ liệu.'},
  {t:'Tháng 08/2026: Video và hình ảnh do AI tạo cho marketing',m:48,d:'Ghi hình buổi Live Zoom tháng 8: so sánh chi phí sản xuất nội dung trước và sau khi dùng AI, kèm 3 case doanh nghiệp.'}]},
 {id:'case',title:'Case doanh nghiệp ứng dụng AI',color:'#0F766E',videos:[
  {t:'Chuỗi bán lẻ: báo cáo doanh thu tự động mỗi sáng',m:14,d:'CEO một chuỗi 40 cửa hàng chia sẻ cách AI tổng hợp số liệu bán hàng và gửi báo cáo cho ban giám đốc trước 8 giờ sáng.'},
  {t:'Công ty logistics: trả lời khách hàng ngoài giờ',m:12,d:'Trợ lý AI trả lời tin nhắn tra cứu đơn hàng ngoài giờ làm việc, chuyển ca khó cho nhân viên vào sáng hôm sau.'},
  {t:'Nhà máy: biên bản giao ban và việc cần làm',m:11,d:'AI ghi lại cuộc họp giao ban, tách việc cần làm cho từng tổ trưởng và nhắc hạn hoàn thành.'},
  {t:'Trường đào tạo: soạn đề và chấm bài tập',m:13,d:'Đội học thuật dùng AI soạn đề kiểm tra từ giáo trình và chấm sơ bộ bài tập trước khi giáo viên duyệt.'}]},
 {id:'qa',title:'Hỏi đáp cùng chuyên gia',color:'#7C3AED',videos:[
  {t:'Dữ liệu công ty đưa cho AI có an toàn không?',m:18,d:'Chuyên gia trả lời các câu hỏi thường gặp về bảo mật dữ liệu, gói doanh nghiệp và chính sách nội bộ khi dùng AI.'},
  {t:'Nên thuê ngoài hay tự làm dự án AI đầu tiên?',m:21,d:'Tiêu chí chọn giữa tự làm, thuê ngoài hoặc mua công cụ có sẵn, kèm ước tính chi phí và thời gian.'},
  {t:'Đo hiệu quả một dự án AI thế nào?',m:16,d:'Cách đặt chỉ số trước khi làm, đo sau 4 tuần và quyết định dừng, cải tiến hay mở rộng.'}]},
 {id:'start',title:'Bắt đầu với cộng đồng',color:'#EA580C',videos:[
  {t:'Giới thiệu CEO AI Community',m:4,d:'Cộng đồng dành cho ai, có những hoạt động gì và cách tận dụng tốt nhất trong tháng đầu.'},
  {t:'Cách đặt câu hỏi để nhận được câu trả lời tốt',m:5,d:'Mô tả bối cảnh, bài toán và điều đã thử để cộng đồng và chuyên gia trả lời nhanh, đúng trọng tâm.'}]}];
const vSeen=k=>!!(S.comm.watched||{})[k];
const vKey=(id,i)=>id+'#'+i;
const topicMin=x=>x.videos.reduce((n,v)=>n+v.m,0);
function commClass(){
 const cur=CLASS_LIB.find(x=>x.id===T.commMod);if(cur)return commClassMod(cur);
 const total=CLASS_LIB.reduce((n,x)=>n+x.videos.length,0),seen=CLASS_LIB.reduce((n,x)=>n+x.videos.filter((_,i)=>vSeen(vKey(x.id,i))).length,0),mins=CLASS_LIB.reduce((n,x)=>n+topicMin(x),0);
 const cards=CLASS_LIB.map((x,ti)=>{const n=x.videos.length,k=x.videos.filter((_,i)=>vSeen(vKey(x.id,i))).length,col=x.color;
  return `<article class="card cr-mod" data-a="commMod" data-v="${x.id}" role="button" tabindex="0" aria-label="${esc(x.title)}, đã xem ${k}/${n} video">
   <div class="cr-cover" style="background:linear-gradient(135deg,${col},color-mix(in srgb,${col} 55%,#172033))"><span class="cr-no">${n} VIDEO</span><span class="cr-play">${ic('play',20)}</span></div>
   <div class="cr-body"><b>${esc(x.title)}</b><span class="hint">${n} video · ${fmtMinVi(topicMin(x))}</span><i class="meter" style="--c:${col}"><i style="width:${Math.round(k/n*100)}%"></i></i><span class="cr-pg">${k===n?`${ic('check',13)} Đã xem hết`:`Đã xem ${k}/${n}`}</span></div></article>`;}).join('');
 return `<div class="cr"><div class="cr-head"><div><span class="eyebrow">Lớp học</span><h2 class="h3">Video của cộng đồng</h2><p class="hint">${CLASS_LIB.length} chủ đề · ${total} video · khoảng ${String(Math.round(mins/60*10)/10).replace('.',',')} giờ</p></div>
  <div class="cr-sum"><b class="tnum">${seen}/${total}</b><span>video đã xem</span><i class="meter" style="--c:#1747C9"><i style="width:${Math.round(seen/total*100)}%"></i></i></div></div>
  <div class="cr-grid">${cards}</div></div>`;
}
const fmtMinVi=m=>m>=60?`${Math.floor(m/60)} giờ ${m%60?m%60+' phút':''}`.trim():m+' phút';
function commClassMod(x){
 const n=x.videos.length,i=Math.min(Math.max(0,T.commVid||0),n-1),v=x.videos[i],k=vKey(x.id,i),col=x.color,seen=vSeen(k);
 const list=x.videos.map((vv,j)=>{const kk=vKey(x.id,j);return `<button class="cr-v${j===i?' on':''}${vSeen(kk)?' done':''}" data-a="commVid" data-v="${j}"><span class="cr-v-st">${vSeen(kk)?ic('check',13):j+1}</span><span class="cr-v-t"><small>Video ${j+1}</small><b>${esc(vv.t)}</b></span><span class="cr-v-m tnum">${vv.m}′</span></button>`;}).join('');
 return `<div class="cr"><button class="cm-back" data-a="commMod" data-v="">${ic('back',16)} Tất cả chủ đề</button>
  <div class="cr-wrap"><div class="cr-main">
   <div class="player cr-player" data-title="${esc(v.t)}" data-label="${esc(x.title)}"><div class="center"><button class="play" data-a="commWatch" data-v="${k}" aria-label="Phát video">${ic('play',26)}</button><span class="t">${esc(x.title)} · Video ${i+1}/${n}</span><h3>${esc(v.t)}</h3></div><div class="bottom"><span>${seen?'Đã xem':'0:00'}</span><span class="track"><i style="width:${seen?100:0}%"></i></span><span class="tnum">${v.m>=60?Math.floor(v.m/60)+':'+String(v.m%60).padStart(2,'0'):v.m}:00</span><span class="vp-speed" ${T.vp.speed===1?'hidden':''}>${String(T.vp.speed).replace('.',',')}×</span>${vpControls()}</div>${vpMenu()}${T.vp.cc?`<p class="vp-cc">${esc(v.t)}</p>`:''}</div>
   <div class="card pad cr-info"><span class="eyebrow" style="color:${col}">${esc(x.title)}</span><h2 class="h3">${esc(v.t)}</h2><p>${esc(v.d)}</p>
    <div class="cr-act">${seen?`<span class="pill ok">${ic('check',12)} Đã xem</span>`:`<button class="btn btn-line" data-a="commWatch" data-v="${k}">${ic('check',15)} Đánh dấu đã xem</button>`}${i<n-1?`<button class="btn btn-primary" data-a="commVid" data-v="${i+1}">Video tiếp theo ${ic('arrow')}</button>`:''}</div></div></div>
  <aside class="card cr-list"><div class="cr-list-h"><b>${esc(x.title)}</b><span class="hint">${x.videos.filter((_,j)=>vSeen(vKey(x.id,j))).length}/${n} video đã xem</span></div>${list}</aside></div></div>`;
}
function commCalendar(){return `<div class="cm-grid"><div class="cm-main"><div class="card pad" style="display:grid;gap:4px"><h2 class="h3">Sự kiện sắp tới</h2><p class="hint">Học viên được tham gia miễn phí. Bấm "Tham gia" để nhận link và lời nhắc qua email.</p>${COMM_EVENTS.map(e=>`${commEventRow(e)}<p class="hint cm-ev-d">${esc(e.desc)}</p>`).join('')}</div></div>${commSide()}</div>`;}
function commMembers(){
 const q=(T.commQ||'').toLowerCase(),list=[[meId,commMe()],...Object.entries(COMM_PEOPLE)].filter(([,p])=>!q||p.name.toLowerCase().includes(q)||p.role.toLowerCase().includes(q));
 return `<div class="cm-grid"><div class="cm-main"><div class="card pad" style="display:grid;gap:14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><h2 class="h3">Thành viên <span class="hint">(${COMM.members+1})</span></h2>
  <form data-f="commSearch" class="cm-search"><input class="inp" name="q" value="${esc(T.commQ||'')}" placeholder="Tìm theo tên, ngành…" aria-label="Tìm thành viên"><button class="btn btn-line btn-sm">${ic('search',15)} Tìm</button></form></div>
  <div class="cm-members">${list.map(([id,p])=>`<div class="cm-mem">${avatar(id,48)}<div><b>${esc(p.name)}${id===meId?' (bạn)':''}</b><span class="hint">${esc(p.role)}</span><span class="hint">${p.online?'<i class="dot-on"></i> Đang trực tuyến':'Hoạt động gần đây'}</span></div></div>`).join('')||'<p class="hint">Không tìm thấy thành viên phù hợp.</p>'}</div>
  <p class="hint">Danh sách minh họa ${Object.keys(COMM_PEOPLE).length+1}/${COMM.members+1} thành viên.</p></div></div>${commSide()}</div>`;
}
function commLeaders(){
 const pts=myPoints(),lv=commLevel(pts);
 const rank=[...Object.entries(COMM_PEOPLE).filter(([,p])=>!p.admin).map(([id,p])=>({id,p:p.pts})),{id:meId,p:pts}].sort((a,b)=>b.p-a.p);
 const col=(t,div)=>`<div class="card pad"><b>${t}</b><ol class="cm-top">${rank.slice(0,6).map((r,i)=>`<li class="${r.id===meId?'me':''}"><span class="rk">${i+1}</span>${avatar(r.id,30)}<span class="n">${esc(person(r.id).name)}</span><b>+${Math.round(r.p/div)}</b></li>`).join('')}</ol></div>`;
 const myRank=rank.findIndex(r=>r.id===meId)+1;
 return `<div class="card pad cm-levels"><div class="cm-me">${avatar(meId,64)}<div><b style="font-size:20px">${esc(commMe().name)}</b><span>Cấp ${lv} · ${COMM_LEVEL_NAME[lv]} · ${pts} điểm · Hạng ${myRank}/${rank.length} trong danh sách</span></div></div>
  <div class="cm-lvl-list">${COMM_LEVELS.map((v,i)=>`<div class="${lv===i+1?'on':lv>i+1?'done':''}"><b>Cấp ${i+1}</b><span>${COMM_LEVEL_NAME[i+1]}</span><small>${v} điểm</small></div>`).join('')}</div></div>
  <div class="cm-lead">${col('7 ngày qua',24)}${col('30 ngày qua',6)}${col('Mọi lúc',1)}</div>`;
}
function commAbout(){return `<div class="cm-grid"><div class="cm-main"><div class="card pad" style="display:grid;gap:12px"><h2 class="h3">Giới thiệu</h2><p>${COMM.tagline}. Cộng đồng do Học viện Siêu Tăng Trưởng quản lý, mở cho mọi học viên đã đăng ký khóa AI for CEO, kể cả sau khi học xong.</p>
 <div class="cm-rules"><b>Quy tắc cộng đồng</b><ol>${COMM.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ol></div><p class="hint">Dữ liệu trong cộng đồng demo là minh họa. Người và công ty trong các bài viết mẫu không có thật.</p></div></div>${commSide()}</div>`;}
// sau khi học viên đăng bài/bình luận: mô phỏng thành viên khác thích và trả lời
function commReact(postId,isComment){
 setTimeout(()=>{const C=S.comm;C.gotLikes[postId]=(C.gotLikes[postId]||0)+(isComment?1:2);
  if(!isComment){(C.comments[postId]=C.comments[postId]||[]).push({by:'mt',at:Date.now(),text:`Cảm ơn anh/chị ${firstName()} đã chia sẻ! Bài viết rất cụ thể. Mời các thành viên cùng ngành vào góp ý thêm nhé.`});}
  toast(isComment?'Bình luận của anh/chị vừa được thích (+1 điểm)':'Minh Thư đã bình luận bài viết của anh/chị (+2 điểm)');render();},3500);
}
