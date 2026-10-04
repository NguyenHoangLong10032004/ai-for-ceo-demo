/* =========================================================
   CỘNG ĐỒNG — CEO AI Community kiểu Skool (FR-46, US-09.5)
   Mở ở tab trình duyệt riêng (index.html#community). Gồm: Bảng tin (bài viết, bình luận, thích, ghim, chủ đề),
   Lớp học (dẫn về khóa), Lịch sự kiện, Thành viên, Bảng xếp hạng (điểm & cấp độ).
   Demo: dữ liệu mẫu bên dưới là MINH HỌA (người và công ty không có thật); bài/bình luận của học viên lưu ở S.comm.
   Hệ thống thật: cần máy chủ lưu bài viết, thông báo, kiểm duyệt (Admin) và đồng bộ giữa các thành viên.
   ========================================================= */

/* ---------- dữ liệu mẫu ---------- */
const COMM={name:'CEO AI Community',tagline:'Nơi các CEO học viên AI for CEO chia sẻ use case, hỏi đáp và cập nhật AI mỗi tháng',
 members:428,online:23,
 rules:['Chia sẻ thật, cụ thể: bài toán, cách làm, kết quả','Không quảng cáo, không bán hàng trong bài viết','Tôn trọng thông tin của doanh nghiệp khác, không chia sẻ dữ liệu khách hàng']};
const COMM_CATS=[['all','Tất cả'],['ask','Hỏi đáp'],['usecase','Chia sẻ use case'],['win','Thắng lợi AI'],['res','Tài nguyên'],['news','Thông báo']];
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
  body:'Đây là nơi dành riêng cho học viên khóa AI for CEO. Ba việc nên làm ngay:\n1. Giới thiệu bản thân ở phần bình luận: công ty, ngành, bài toán đang muốn dùng AI.\n2. Chia sẻ 3 use case anh/chị chọn sau Module 12 để nhận góp ý.\n3. Đăng ký Live Zoom "AI đến đâu rồi?" hằng tháng ở tab Lịch.\nMỗi lượt thích bài viết hoặc bình luận của anh/chị được cộng 1 điểm. Lên cấp để mở thêm tài nguyên.',
  comments:[{by:'dt',ago:200,text:'Chào cả nhà, Duy bên chuỗi điện máy 32 cửa hàng. Đang muốn tự động hóa báo cáo tồn kho.'},{by:'nv',ago:150,text:'Vy, trung tâm Anh ngữ ở Đà Nẵng. Bài toán của mình là tư vấn tuyển sinh ngoài giờ.'}]},
 {id:'p2',by:'mt',cat:'news',ago:30,likes:41,title:'Live Zoom tháng 10: AI đến đâu rồi?',
  body:'Thời gian: 20:00, thứ Năm 15/10. Chủ đề tháng này: AI Agent đã làm được gì trong vận hành doanh nghiệp vừa và nhỏ, kèm 3 demo trực tiếp. Gửi câu hỏi trước ở phần bình luận, Học viện sẽ chọn câu hỏi để trả lời trong buổi.',
  comments:[{by:'pk',ago:20,text:'Mong buổi này có demo agent đọc đơn hàng email rồi nhập vào ERP.'}]},
 {id:'p3',by:'dt',cat:'win',ago:9,likes:57,title:'Báo cáo doanh thu sáng thứ Hai: từ 6 giờ xuống 15 phút',
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
function commMe(){const n=S.profile.name||(S.order&&S.order.name)||'Học viên';return {name:n,role:`CEO · ${S.profile.company||(S.order&&S.order.company)||'Học viên AI for CEO'}`,c:'#1747C9',online:true};}
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
function myPoints(){const C=S.comm;return Object.values(C.gotLikes).reduce((s,v)=>s+v,0);}

/* ---------- giao diện ---------- */
const avatar=(id,size=40)=>{const p=person(id);const ini=p.name.trim().split(/\s+/).pop()[0]||'?';const lv=id===meId?commLevel(myPoints()):commLevel(p.pts);
 return `<span class="cm-av ${size<=30?'sm':''}" style="--c:${p.c};width:${size}px;height:${size}px;font-size:${Math.round(size*.4)}px">${esc(ini)}<i class="lv" title="Cấp ${lv}">${lv}</i>${p.online?'<i class="on" aria-label="Đang trực tuyến"></i>':''}</span>`;};
function community(){
 if(!S.enrolled)return `<section class="wrap narrow page"><div class="card pad cm-gate"><span class="cm-gate-ico">${ic('users',28)}</span><h2 class="h2">${COMM.name}</h2><p class="sub">Cộng đồng dành riêng cho học viên khóa AI for CEO: ${COMM.members} CEO đang chia sẻ use case và cập nhật AI mỗi tháng.</p><button class="btn btn-primary btn-lg" data-a="go" data-to="landing">Tìm hiểu khóa AI for CEO ${ic('arrow')}</button></div></section>`;
 const C=S.comm;
 if(!C.joined)return `<section class="wrap narrow page"><div class="card cm-join"><div class="cm-cover"><span>${ic('users',30)}</span></div><div class="pad" style="display:grid;gap:14px">
  <span class="eyebrow">Dành cho học viên AI for CEO</span><h2 class="h2">${COMM.name}</h2><p class="sub" style="max-width:none">${COMM.tagline}.</p>
  <div class="cm-stats"><span><b>${COMM.members}</b> thành viên</span><span><i class="dot-on"></i><b>${COMM.online}</b> đang trực tuyến</span><span><b>${COMM_EVENTS.length}</b> sự kiện sắp tới</span></div>
  <div class="cm-rules"><b>Quy tắc cộng đồng</b><ol>${COMM.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ol></div>
  <label class="opt" for="cm-agree"><input type="checkbox" id="cm-agree"><span>Tôi đồng ý với quy tắc cộng đồng</span></label>
  ${T.err.cm?`<p class="err">${esc(T.err.cm)}</p>`:''}
  <div><button class="btn btn-primary btn-lg" data-a="commJoin">Tham gia cộng đồng ${ic('arrow')}</button></div></div></div></section>`;
 const tab=T.commTab||'feed';
 const tabs=[['feed','Cộng đồng'],['class','Lớp học'],['calendar','Lịch'],['members','Thành viên'],['leaders','Bảng xếp hạng'],['about','Giới thiệu']];
 const head=`<div class="cm-head"><div class="wrap"><div class="cm-title"><span class="cm-logo">${ic('users',20)}</span><div><b>${COMM.name}</b><small>${COMM.members+1} thành viên · ${COMM.online} đang trực tuyến</small></div></div>
  <nav class="cm-tabs" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${tab===k}" class="${tab===k?'on':''}" data-a="commTab" data-v="${k}">${l}</button>`).join('')}</nav></div></div>`;
 const body=tab==='calendar'?commCalendar():tab==='members'?commMembers():tab==='leaders'?commLeaders():tab==='about'?commAbout():tab==='class'?commClass():(T.commPost?commPostView(T.commPost):commFeed());
 return `${head}<section class="wrap page cm">${body}</section>`;
}
// thẻ bên phải: giới thiệu nhanh + cấp độ của tôi + top 5
function commSide(){
 const pts=myPoints(),lv=commLevel(pts),next=COMM_LEVELS[lv]||pts,prev=COMM_LEVELS[lv-1];
 const top=Object.entries(COMM_PEOPLE).sort((a,b)=>b[1].pts-a[1].pts).filter(([,p])=>!p.admin).slice(0,5);
 return `<aside class="cm-side">
  <div class="card cm-card"><div class="cm-cover sm"><span>${ic('users',22)}</span></div><div class="pad" style="display:grid;gap:10px"><b>${COMM.name}</b><p class="hint">${COMM.tagline}.</p>
   <div class="cm-stats"><span><b>${COMM.members+1}</b> thành viên</span><span><i class="dot-on"></i><b>${COMM.online}</b> trực tuyến</span></div></div></div>
  <div class="card pad cm-card"><div class="cm-me">${avatar(meId,46)}<div><b>Cấp ${lv} · ${COMM_LEVEL_NAME[lv]}</b><span class="hint">${pts} điểm${lv<9?` · còn ${next-pts} điểm lên cấp ${lv+1}`:''}</span></div></div><i class="meter" style="--c:#1747C9"><i style="width:${lv<9?Math.round((pts-prev)/(next-prev)*100):100}%"></i></i><p class="hint">Mỗi lượt thích bài viết hoặc bình luận của anh/chị được cộng 1 điểm.</p></div>
  <div class="card pad cm-card"><div style="display:flex;justify-content:space-between;align-items:center"><b>Bảng xếp hạng 30 ngày</b><button class="btn-link" data-a="commTab" data-v="leaders">Xem tất cả</button></div>
   <ol class="cm-top">${top.map(([id,p],i)=>`<li><span class="rk">${i+1}</span>${avatar(id,30)}<span class="n">${esc(p.name)}</span><b>+${Math.round(p.pts/6)}</b></li>`).join('')}</ol></div>
  <div class="card pad cm-card"><b>Sự kiện sắp tới</b>${commEventRow(COMM_EVENTS[0])}</div></aside>`;
}
function commEventRow(e){const i=COMM_EVENTS.indexOf(e),on=S.comm.events[i];return `<div class="cm-ev"><span class="d"><b>${e.d.split('/')[0]}</b><small>Th${e.d.split('/')[1]}</small></span><div><b>${esc(e.title)}</b><span class="hint">${esc(e.t)} · ${esc(e.len)}</span></div>${on?`<span class="pill ok">${ic('check',12)} Đã đăng ký</span>`:`<button class="btn btn-line btn-sm" data-a="commEvent" data-v="${i}">Tham gia</button>`}</div>`;}
// bảng tin
function commFeed(){
 const cat=T.commCat||'all',posts=commPosts().filter(p=>cat==='all'||p.cat===cat).sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||a.ago-b.ago);
 const d=T.commDraft||{};
 const compose=T.commWrite?`<form class="card pad cm-compose open" data-f="commPost">${avatar(meId,40)}<div style="display:grid;gap:10px;min-width:0">
   <input class="inp" id="cm-title" name="title" value="${esc(d.title||'')}" placeholder="Tiêu đề bài viết" aria-label="Tiêu đề">
   <textarea class="inp" id="cm-body" name="body" rows="5" placeholder="Chia sẻ use case, kết quả, hoặc đặt câu hỏi cho cộng đồng…" aria-label="Nội dung">${esc(d.body||'')}</textarea>
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
  <h3>${esc(p.title)}</h3><p class="cm-ex">${esc(p.body)}</p>
  <div class="cm-post-f"><button class="cm-like ${p.liked?'on':''}" data-a="commLike" data-v="${p.id}" aria-pressed="${p.liked}">${ic('thumb',16)} ${p.likes}</button><span class="cm-cc">${ic('chat',16)} ${p.comments.length}</span>
   ${last.length?`<span class="cm-faces">${last.map(c=>avatar(c.by,24)).join('')}<span class="hint">Bình luận mới ${timeAgo(p.comments[p.comments.length-1].ago)}</span></span>`:''}</div></article>`;
}
function commPostView(id){
 const p=commPosts().find(x=>x.id===id);if(!p){T.commPost=null;return commFeed();}
 const a=person(p.by);
 return `<div class="cm-grid"><div class="cm-main"><div><button class="btn btn-line btn-sm" data-a="commBack">${ic('back',15)} Quay lại bảng tin</button></div>
  <article class="card pad cm-detail"><div class="cm-post-h">${avatar(p.by,46)}<div><b>${esc(a.name)}${a.admin?'<span class="cm-admin">Quản trị</span>':''}</b><span class="hint">${esc(a.role)} · ${timeAgo(p.ago)} · <span class="cm-cat" style="--c:${CAT_COLOR[p.cat]}">${catLabel(p.cat)}</span></span></div></div>
   <h2 class="h3">${esc(p.title)}</h2><div class="cm-body">${fmt(p.body)}</div>
   <div class="cm-post-f"><button class="cm-like ${p.liked?'on':''}" data-a="commLike" data-v="${p.id}" aria-pressed="${p.liked}">${ic('thumb',16)} ${p.likes} lượt thích</button><span class="cm-cc">${ic('chat',16)} ${p.comments.length} bình luận</span></div>
   <div class="cm-comments">${p.comments.map(c=>{const u=person(c.by);return `<div class="cm-cmt">${avatar(c.by,34)}<div class="cm-bub"><b>${esc(u.name)}</b>${u.admin?'<span class="cm-admin">Quản trị</span>':''}<span class="hint"> · ${timeAgo(c.ago)}</span><p>${fmt(c.text)}</p></div></div>`;}).join('')||'<p class="hint">Chưa có bình luận. Hãy là người đầu tiên!</p>'}</div>
   <form class="cm-reply" data-f="commComment" data-id="${p.id}">${avatar(meId,34)}<input class="inp" id="cm-cmt" name="t" autocomplete="off" placeholder="Viết bình luận…" aria-label="Bình luận"><button class="btn btn-primary btn-sm">Gửi</button></form>
  </article></div>${commSide()}</div>`;
}
function commClass(){
 const st=planStats(),ni=nextLesson();
 return `<div class="cm-grid"><div class="cm-main"><article class="card cm-course"><div class="cm-cover"><span>${ic('spark',30)}</span></div><div class="pad" style="display:grid;gap:12px"><span class="eyebrow">Lớp học</span><h2 class="h3">AI for CEO · 12 năng lực AI</h2>
  <p class="hint">Khóa học chính của cộng đồng. Học theo lộ trình cá nhân, mỗi ngày một bài.</p><i class="meter" style="--c:#1747C9"><i style="width:${st.pct}%"></i></i><span class="hint">${st.lessonsDone}/${st.n} bài · ${st.pct}% hoàn thành</span>
  <div><button class="btn btn-primary" data-a="${ni>=0?'openLesson':'go'}" data-v="${ni}" data-to="complete">${ni>=0?`Học tiếp Bài ${ni+1}`:'Xem chứng nhận'} ${ic('arrow')}</button></div></div></article></div>${commSide()}</div>`;
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
