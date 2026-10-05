/* =========================================================
   CHATBOT
   1. Trợ lý lộ trình (onboarding): hỏi hồ sơ → chốt số bài học
   2. AI Learning Assistant: hỏi đáp trong lúc học, chuyển cho chuyên gia khi cần
   ========================================================= */

/* ---------- 1. Trợ lý lộ trình (onboarding) ---------- */
// Mỗi bước: câu hỏi (q), lựa chọn gợi ý (chips), cách lưu câu trả lời (set)
const Q={
 confirm:{q:p=>`Em đã có thông tin anh/chị trả lời ở bước đánh giá:\n• Ngành: **${p.industry}**\n• Quy mô nhân sự: **${p.size}**\n• Hiện trạng sử dụng AI: **${LEVELS[p.level]}**\n• Phòng ban quan tâm: **${goalsText(p.goals)}**\nThông tin này còn đúng không ạ?`,
  chips:()=>[['ok','Đúng rồi'],['edit','Cần sửa lại']],set:v=>{if(v==='edit')S.ob.flow.splice(S.ob.i+1,0,'industry','size','level','goals');}},
 industry:{q:()=>'Công ty của anh/chị thuộc ngành nào?',chips:()=>INDUSTRIES.map(x=>[x,x]),set:v=>{S.profile.industry=v;}},
 size:{q:()=>'Quy mô nhân sự hiện tại là bao nhiêu?',chips:()=>SIZES.map(x=>[x,x]),set:v=>{S.profile.size=v;}},
 level:{q:()=>'Hiện trạng sử dụng AI của anh/chị và công ty đang ở mức nào?',chips:()=>Object.entries(LEVELS).map(([k,v])=>[k,v]),set:v=>{S.profile.level=+v;}},
 goals:{multi:true,q:()=>'Anh/chị muốn thấy ví dụ AI ở phòng ban nào nhất? Chọn 1 đến 3 rồi bấm "Xong".',chips:()=>Object.entries(GOALS),set:v=>{S.profile.goals=v;}},
 problem:{q:()=>'Anh/chị muốn AI giải bài toán gì cho doanh nghiệp? Ví dụ: "Vì sao chi phí quảng cáo tuần này tăng?". Anh/chị gõ bên dưới hoặc chọn gợi ý.',
  chips:p=>{const o=(IND[p.industry]||IND['Khác']).uc;return [[o[0][0],o[0][0]],[o[2][0],o[2][0]],['__skip','Bỏ qua bước này']];},set:v=>{S.profile.problem=v==='__skip'?'':v;}},
 days:{q:()=>'Anh/chị muốn học và hoàn thành khóa trong bao lâu?',chips:()=>[['7','7 ngày'],['15','15 ngày'],['30','1 tháng'],['__custom','Tự nhập…']],set:v=>{S.profile.days=+v;}},
 pace:{q:()=>'Mỗi ngày học, anh/chị dành được khoảng bao nhiêu thời gian?',chips:()=>[['20','20 phút'],['30','30 phút'],['60','1 giờ']],set:v=>{S.profile.minPerSession=+v;}}};
function startOb(){
 const e=S.eval;S.ob={flow:e?['confirm','problem','days','pace']:['industry','size','level','goals','problem','days','pace'],i:0,msgs:[],multi:[],done:false};
 S.profile={name:(S.order&&S.order.name)||S.profile.name||SAMPLE_PROFILE.name,company:(S.order&&S.order.company)||S.profile.company||SAMPLE_PROFILE.company};
 if(e)Object.assign(S.profile,{industry:e.industry,size:e.size,level:e.level,goals:e.goals.slice()});
 S.ob.msgs.push({role:'bot',text:`Chào anh/chị ${firstName()}! Em là Trợ lý lộ trình của AI for CEO. Khóa này không dạy tool hay prompt: anh/chị sẽ xem AI làm thật qua 12 năng lực. Em hỏi vài câu (khoảng 2 phút) để chia khóa thành các bài học vừa với lịch của anh/chị.`});
 askOb();
}
// Bỏ các bước không còn tồn tại (vd. câu hỏi nhịp học cũ còn lưu trong trình duyệt)
function fixOb(){const ob=S.ob;if(!ob||!Array.isArray(ob.flow))return;const before=ob.flow.slice(0,ob.i).filter(s=>Q[s]).length;ob.flow=ob.flow.filter(s=>Q[s]);ob.i=Math.min(before,ob.flow.length);
 if(!ob.done&&ob.flow.length&&ob.i>=ob.flow.length&&profileComplete(S.profile))finishOb();}
function askOb(){fixOb();const st=S.ob.flow[S.ob.i];if(!st){if(!S.ob.done)finishOb();return;}S.ob.msgs.push({role:'bot',text:Q[st].q(S.profile)});}
function finishOb(){
 const p=S.profile;S.ob.done=true;const N=lessonsOf(p);
 S.ob.msgs.push({role:'bot',text:`Hồ sơ đã đủ để cá nhân hóa:\n• Ngành: ${p.industry}\n• Quy mô nhân sự: ${p.size}\n• Hiện trạng sử dụng AI: ${LEVELS[p.level]}\n• Phòng ban quan tâm: ${goalsText(p.goals)}${p.problem?`\n• Bài toán: ${p.problem}`:''}\n• Hoàn thành trong ${p.days} ngày, khoảng ${p.minPerSession} phút mỗi ngày\nEm sẽ chia khóa thành **${N} bài học**, mỗi ngày học một bài. Anh/chị bấm "Tạo lộ trình cá nhân" nhé.`});
}
function obAnswer(v,label){
 const st=S.ob.flow[S.ob.i];if(!st)return;
 S.ob.msgs.push({role:'user',text:label});Q[st].set(v);S.ob.i++;
 T.obTyping=true;T.focus='ob';render();
 setTimeout(()=>{T.obTyping=false;askOb();T.focus='ob';render();},450);
}
// Học viên gõ tự do thay vì bấm lựa chọn
function obText(t){
 const st=S.ob.flow[S.ob.i];
 if(!st){S.ob.msgs.push({role:'user',text:t});S.ob.msgs.push({role:'bot',text:'Hồ sơ đã xong rồi ạ. Anh/chị bấm "Tạo lộ trình cá nhân" nhé. Muốn đổi thời gian hay phòng ban thì anh/chị điều chỉnh được ngay trên màn hình lộ trình.'});T.focus='ob';render();return;}
 if(st==='problem'){obAnswer(t,t);return;}
 if(st==='days'){const d=parseDays(t);if(d&&d>=3&&d<=MAX_DAYS){obAnswer(String(d),t);return;}}
 if(st==='pace'){const c=parseAdjust(t,S.profile);if(c.minPerSession){obAnswer(String(snapPace(c.minPerSession)),t);return;}}
 if(st==='confirm'){if(/đúng|ok|chuẩn|rồi|vâng/i.test(t)){obAnswer('ok',t);return;}if(/sửa|sai|chưa/i.test(t)){obAnswer('edit',t);return;}}
 if(st==='goals'){const c=parseAdjust(t,{goals:[]});if(c.goals){S.profile.goals=c.goals.slice(0,3);S.ob.msgs.push({role:'user',text:t});S.ob.i++;T.obTyping=true;render();setTimeout(()=>{T.obTyping=false;askOb();T.focus='ob';render();},450);return;}}
 const hit=Q[st].chips(S.profile).find(([v,l])=>l.toLowerCase().includes(t.toLowerCase())||t.toLowerCase().includes(l.toLowerCase()));
 if(hit&&!String(hit[0]).startsWith('__')){obAnswer(hit[0],t);return;}
 S.ob.msgs.push({role:'user',text:t});S.ob.msgs.push({role:'bot',text:st==='days'?`Anh/chị nhập giúp em số ngày, từ 3 đến ${MAX_DAYS} ngày, ví dụ "10 ngày" hoặc "3 tuần" nhé.`:'Anh/chị chọn giúp em một lựa chọn bên dưới nhé.'});T.focus='ob';render();
}

/* ---------- 2. AI Learning Assistant ---------- */
function curItem(){if(S.screen==='lesson'&&S.unit)return L[U(S.unit).id];const i=nextLesson();return S.plan&&i>=0?L[U(lessons()[i].find(k=>!S.done[k])).id]:null;}
// Chỉ dẫn + kho kiến thức chính thức gửi kèm mỗi câu hỏi cho AI
function asstRules(){
 const p=S.profile,cur=curItem();const ni=S.plan?nextLesson():-1;
 const kb=LIB.map(x=>`[${x.id}] ${x.title}. Câu hỏi mở: ${x.hook} Demo: ${x.demo} Giải thích: ${(x.body||[]).join(' ')} Takeaway: ${x.take}${x.ex?' Ví dụ: '+x.ex.map(e=>GOALS[e[0]]+': '+e[1]).join('; '):''}`).join('\n');
 return `Bạn là AI Learning Assistant của khóa AI for CEO, Học viện Siêu Tăng Trưởng. Khóa demo-first cho CEO, không dạy tool, không dạy prompt. Trả lời bằng tiếng Việt, xưng "em", gọi "anh/chị", tối đa 120 từ, bằng ngôn ngữ kinh doanh, không hype. Nếu được hỏi cách dùng công cụ cụ thể, nói rõ khóa không dạy thao tác và đưa về năng lực AI tương ứng. Chỉ dựa vào NỘI DUNG CHÍNH THỨC bên dưới. Nếu câu hỏi nằm ngoài nội dung, cần tư vấn riêng, hoặc liên quan thanh toán, hoàn tiền, hóa đơn thì nói ngắn gọn rằng em sẽ chuyển cho chuyên gia và kết thúc bằng đúng chuỗi [CHUYEN_CHUYEN_GIA]. Không dùng tiêu đề markdown.
${S.enrolled&&p.industry?`HỒ SƠ HỌC VIÊN: ngành ${p.industry}, quy mô ${p.size}, mức hiểu biết AI: ${LEVELS[p.level]}, phòng ban quan tâm: ${goalsText(p.goals)}, bài toán: ${p.problem||'chưa nêu'}.
ĐANG XEM: ${cur?cur.id+' '+cur.title:'(không có)'}
BÀI TIẾP THEO: ${ni>=0?`Bài ${ni+1}/${lessons().length}: ${lessonTitle(lessons()[ni])}`:'đã học hết, cần kiểm tra điều kiện hoàn thành'}`:'NGƯỜI HỎI chưa đăng ký. Tư vấn trung thực về khóa học và ưu đãi ra mắt.'}
THÔNG TIN KHÓA: 12 module video demo (mỗi module 4 video: mở vấn đề, demo, giải thích, takeaway), chia thành số bài học đúng bằng số ngày học học viên chọn; Live Zoom "AI đến đâu rồi?" hằng tháng; Offline Executive Briefing tùy chọn. Học phí ${money(COURSE.list)}, ${COURSE.promo.toLowerCase()} còn ${money(COURSE.price)}. Mỗi module có 1 bài tập áp dụng cho công ty (Module 12: chọn 3 use case); bài làm được lưu ở mục "Bài tập của tôi". Hoàn thành khi học hết các bài và nộp đủ 12 bài tập.
NỘI DUNG CHÍNH THỨC:
${kb}`;
}
// Câu trả lời soạn sẵn khi không có AI (chạy local)
function cannedAnswer(q){
 const s=q.toLowerCase(),p=S.profile,cur=curItem();const ni=S.plan?nextLesson():-1;
 if(/prompt|tool|công cụ|chatgpt|claude code|codex|cách dùng/.test(s))return 'Khóa này không dạy thao tác công cụ hay viết prompt. Công cụ chỉ là bằng chứng cho năng lực AI. Mục tiêu là anh/chị hiểu AI làm được gì để đặt câu hỏi, giao bài toán và ra quyết định đầu tư tốt hơn.';
 if(!S.enrolled){
  if(/phù hợp|hợp với/.test(s))return 'Khóa dành cho CEO, Founder, chủ doanh nghiệp và quản lý cấp cao muốn hiểu AI hiện tại làm được gì, không cần nền kỹ thuật. Sau khi đăng ký, Trợ lý lộ trình sẽ hỏi về công ty và lịch của anh/chị để chia khóa thành bài học phù hợp.';
  if(/bao lâu|thời gian|mỗi ngày/.test(s))return 'Anh/chị tự chọn muốn hoàn thành trong bao lâu, ví dụ 7, 15 hoặc 30 ngày. Trợ lý lộ trình chia khóa thành đúng số bài học tương ứng, mỗi ngày học một bài. Mỗi tháng có thêm một buổi Live Zoom cập nhật.';
  if(/học phí|giá|chi phí|gồm|ưu đãi/.test(s))return `Học phí ${money(COURSE.list)}. ${COURSE.promo} chỉ còn **${money(COURSE.price)}** (tiết kiệm ${money(SAVE)}). Bao gồm:\n• `+COURSE.perks.join('\n• ');
 } else {
  if(/hôm nay|tiếp theo|làm gì|xem gì/.test(s))return ni>=0?`Tiếp theo là **Bài ${ni+1}/${lessons().length}: ${lessonTitle(lessons()[ni])}** (${lessonMin(lessons()[ni])} phút).`:'Anh/chị đã học hết các bài. Bước tiếp theo là kiểm tra điều kiện hoàn thành.';
  if(/áp dụng|doanh nghiệp|công ty/.test(s)){const x=cur||L.M01;const e=(x.ex||[]).find(e=>(p.goals||[]).includes(e[0]))||(x.ex||[])[0];return `${x.take}${e?` Ví dụ cho ${GOALS[e[0]]}: ${e[1]}.`:''} Ở công ty ${String(p.industry||'').toLowerCase()}, AI thường được thử trước ở việc ${(IND[p.industry]||IND['Khác']).general}.`;}
  if(/giải thích|chưa hiểu|nghĩa là/.test(s)){const x=cur||L.M01;return `Nói ngắn gọn về "${x.title}": ${(x.body||[''])[0]}`;}
 }
 return 'Câu hỏi này nằm ngoài nội dung em được cung cấp. Em có thể chuyển cho chuyên gia của Học viện để trả lời anh/chị. [CHUYEN_CHUYEN_GIA]';
}
async function askAssistant(q){
 if(T.asstBusy)return;T.asstBusy=true;
 S.asst.push({role:'user',text:q});const msg={role:'bot',text:'',pending:true};S.asst.push(msg);render();
 const idx=S.asst.length-1;const upd=()=>{const el=document.getElementById('am-'+idx);if(el){el.classList.remove('typing');el.innerHTML=fmt(msg.text.replace('[CHUYEN_CHUYEN_GIA]','').trim());const log=el.closest('.chat-log');if(log)log.scrollTop=log.scrollHeight;}};
 const sample=await SAMPLE_P;let ok=false;
 if(sample){try{const hist=S.asst.slice(0,-1).filter(m=>m.text&&!m.pending).slice(-8).map(m=>({role:m.role==='user'?'user':'assistant',content:m.text}));
   const turns=[{role:'user',content:asstRules()},...hist];
   const r=await sample(turns,{cache:false,modelTier:'quick',onText:({text})=>{msg.text=text;upd();}});msg.text=r.text;ok=true;}catch(e){if(e&&e.text){msg.text=e.text;ok=true;}}}
 else await new Promise(r=>setTimeout(r,700));
 if(!ok)msg.text=cannedAnswer(q);
 msg.handoff=msg.text.includes('[CHUYEN_CHUYEN_GIA]');msg.text=msg.text.replace('[CHUYEN_CHUYEN_GIA]','').trim();delete msg.pending;
 T.asstBusy=false;T.focus='asst';render();
}
/* ---------- Chat với chuyên gia hỗ trợ (người thật, mô phỏng) ---------- */
// Tách riêng khỏi AI: tab "Chuyên gia" trong khung chat. Tin nhắn đầu tiên tạo mã yêu cầu hỗ trợ.
const EXPERT={name:'Minh Thư',role:'Chuyên gia hỗ trợ học viên',hours:'8:00–18:00, thứ Hai đến thứ Bảy'};
const expertTime=()=>new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
// Lời chào khi chưa có tin nhắn nào
function expertHello(){
 return S.enrolled?`Chào anh/chị ${firstName()}, em là ${EXPERT.name}, ${EXPERT.role.toLowerCase()} của Học viện. Anh/chị nhắn trực tiếp cho em về nội dung bài học, bài tập, lịch học, thanh toán hoặc hóa đơn. Em trả lời trong giờ làm việc (${EXPERT.hours}).`
  :`Chào anh/chị, em là ${EXPERT.name}, tư vấn viên của Học viện. Anh/chị cần tư vấn về khóa AI for CEO, học phí hay hình thức thanh toán cho doanh nghiệp thì nhắn em ở đây.`;
}
// Câu trả lời mô phỏng của chuyên gia (hệ thống thật: CSKH trả lời từ trang quản trị, FR-31–32)
function expertAnswer(q){
 const s=q.toLowerCase(),cur=S.enrolled&&S.screen==='lesson'&&S.plan?`Bài ${S.lesson+1}`:'';
 if(/hóa đơn|vat|xuất|thanh toán|chuyển khoản|hoàn tiền/.test(s))return `Dạ em đã chuyển yêu cầu sang bộ phận kế toán. Hóa đơn VAT được gửi qua email trong 24 giờ làm việc. Nếu cần sửa thông tin công ty trên hóa đơn, anh/chị nhắn em tên công ty và mã số thuế đúng nhé.`;
 if(/bài tập|nộp|nhận xét|chấm/.test(s))return `Dạ em đã xem bài tập của anh/chị${cur?` ở ${cur}`:''}. Chuyên gia nội dung sẽ góp ý chi tiết ngay trong khung chat này trước 17:00 hôm nay. Anh/chị cứ học tiếp bài sau, không cần chờ.`;
 if(/lịch|bận|dời|đổi ngày|live|zoom/.test(s))return `Dạ được ạ. Buổi Live Zoom gần nhất là ${LIVE.when}, em sẽ gửi link vào email trước 1 ngày. Nếu anh/chị muốn đổi số ngày học, anh/chị vào "Điều chỉnh lộ trình", tiến độ đã học vẫn được giữ.`;
 if(/học phí|giá|ưu đãi|doanh nghiệp|nhiều người|tập thể/.test(s))return `Dạ học phí hiện là ${money(COURSE.price)} (${COURSE.promo.toLowerCase()}). Doanh nghiệp đăng ký từ 3 người trở lên có giá riêng, anh/chị để lại số điện thoại, em gọi tư vấn trong hôm nay.`;
 return `Dạ em đã nhận câu hỏi${cur?` về ${cur}`:''}. Em đang chuyển cho chuyên gia nội dung và sẽ trả lời anh/chị ngay trong khung chat này trong hôm nay. Nếu cần gấp, anh/chị để lại số điện thoại, em gọi lại ạ.`;
}
function expertSend(q){
 const E=S.expert;
 if(!E.id){E.id='HT-'+(1024+Math.floor(Math.random()*900));E.msgs.push({role:'sys',text:`Đã tạo yêu cầu hỗ trợ #${E.id}. Chuyên gia trả lời ngay trong khung chat này.`});}
 E.msgs.push({role:'user',text:q,at:expertTime()});E.pending=true;T.expertDraft='';
 render();toast(`Đã gửi tin nhắn cho chuyên gia · #${E.id}`);scheduleExpert();
}
// Mô phỏng: chuyên gia "đang soạn tin" rồi trả lời; khung chat đang đóng thì tăng số tin chưa đọc
function scheduleExpert(){
 const E=S.expert;if(!E.pending)return;
 setTimeout(()=>{T.expertTyping=true;render();
  setTimeout(()=>{const last=[...E.msgs].reverse().find(m=>m.role==='user');T.expertTyping=false;E.pending=false;
   E.msgs.push({role:'expert',text:expertAnswer(last?last.text:''),at:expertTime()});
   if(!(T.asstOpen&&T.tab==='expert')){E.unread=(E.unread||0)+1;toast(`${EXPERT.name} vừa trả lời tin nhắn của anh/chị`);}
   render();},3000);},1500);
}
