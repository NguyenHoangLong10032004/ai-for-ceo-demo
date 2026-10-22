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
/* ---------- Chương 0 bản 2 (PLAN_Onboarding.md, user duyệt 21/10/2026) ----------
   Chỉ Bài 4 (quyết định 30 ngày) và Bài 5 (hồ sơ 7 nhóm → tổng hợp 6 phần → xác nhận → lịch học) có bài tập, làm bằng trò chuyện với Trợ lý lộ trình */
const OB_SEG={'C0-4':1,'C0-5':1};
const OB_FLOW=[];
const segOf=()=>null;
const DEC_PREFIX='Sau 30 ngày, tôi muốn có đủ cơ sở để quyết định';
const DEC_SAMPLES=[['Có nên đầu tư AI','liệu doanh nghiệp có nên bắt đầu đầu tư nghiêm túc vào AI trong 6 tháng tới hay không'],['Bộ phận ưu tiên','bộ phận nào nên là nơi đầu tiên doanh nghiệp đầu tư AI một cách có hệ thống trong 6 tháng tới'],['3 quy trình đáng thử','đâu là ba quy trình đầu tiên đáng thử nghiệm AI'],['Tự xây hay mua','doanh nghiệp nên tự xây một công cụ AI nội bộ cho đội Sales hay tiếp tục dùng các công cụ có sẵn'],['AI hỗ trợ hay Agent','quy trình chăm sóc khách hàng nên để AI hỗ trợ con người hay giao cho Agent tự xử lý một phần'],['Chuẩn bị dữ liệu & con người','doanh nghiệp cần chuẩn bị dữ liệu, con người và cơ chế quản trị như thế nào trước khi mở rộng AI']];
const DEPTS={...GOALS,product:'Sản phẩm',tech:'Công nghệ'};
const OB_MODELS=['B2B','B2C','Cả B2B và B2C'];
const OB_ROLES=['Founder','CEO','Chủ doanh nghiệp','Vai trò điều hành tương đương'];
const OB_ROLEMODES=['Trực tiếp tham gia vận hành hằng ngày','Chủ yếu chiến lược, quản trị qua đội ngũ'];
const OB_PROBLEMS=['Báo cáo chậm','Dữ liệu nằm rải rác nhiều nơi','Công việc phụ thuộc nhiều vào con người','Nhiều thao tác lặp lại','Chăm sóc khách hàng chưa kịp thời','Tạo nội dung mất nhiều thời gian','Quy trình khó kiểm soát','Ra quyết định thiếu thông tin','Các hệ thống chưa kết nối với nhau'];
const OB_AINOW={none:['Doanh nghiệp chưa sử dụng AI',1],ceo:['Chỉ CEO tự sử dụng',2],staff:['Một số nhân sự đang sử dụng',2],depts:['Một vài bộ phận đã đưa AI vào công việc',3],sys:['Đã có chatbot, tự động hóa, phần mềm tích hợp AI hoặc Agent',4]};
const OB_LIMITS=['Có dữ liệu nhạy cảm','Ngành có yêu cầu pháp lý, kiểm soát cao','Không muốn AI tự thực hiện một số hành động','Ngân sách hạn chế','Ít nhân sự kỹ thuật','Hệ thống hiện tại cũ, khó tích hợp','Dữ liệu chưa được chuẩn hóa','Một số quyết định bắt buộc con người phê duyệt'];
const OB_GROUPS=['Doanh nghiệp','Vai trò của anh/chị','Các bộ phận','Vấn đề, điểm nghẽn','Hiện trạng AI','Quyết định 30 ngày','Giới hạn cần lưu ý'];
const OB_GQ={1:()=>'Doanh nghiệp của anh/chị hoạt động trong ngành nào, theo mô hình nào, quy mô ra sao? Anh/chị ghi thêm sản phẩm/dịch vụ chính và nhóm khách hàng chính nếu muốn.',
 2:()=>'Vai trò của anh/chị trong doanh nghiệp là gì? Anh/chị trực tiếp vận hành hằng ngày hay chủ yếu quản trị qua đội ngũ?',
 3:()=>'Doanh nghiệp đang vận hành qua những bộ phận nào? Sau đó chọn giúp em **bộ phận đang khiến anh/chị quan tâm nhất**.',
 4:()=>'Hiện tại, có **3 vấn đề** nào đang khiến anh/chị mất nhiều thời gian, chi phí hoặc sự chú ý nhất?',
 5:()=>'AI đã xuất hiện ở đâu trong công việc hoặc doanh nghiệp của anh/chị? Không có câu trả lời nào tốt hơn hay kém hơn, em chỉ cần hiểu thực tế.',
 6:()=>S.profile.decision30?`Ở Bài 4, anh/chị đã chọn: "${DEC_PREFIX} ${S.profile.decision30}." Sau khi nhìn lại bối cảnh doanh nghiệp, anh/chị muốn **giữ nguyên** hay **điều chỉnh** quyết định này?`:`Anh/chị hoàn thành giúp em câu "${DEC_PREFIX}…" bằng một quyết định thật của doanh nghiệp nhé.`,
 7:()=>'Cuối cùng: doanh nghiệp có giới hạn hoặc điều kiện nào em cần biết khi gợi ý về AI không?'};
function c0Fresh(){return {v:2,flow:[],i:0,msgs:[],multi:[],done:false,b4:{step:'ask'},b5:{flow:[],i:0,ph:'new',multi:[]}};}
const c0Msg=(seg,role,text)=>S.ob.msgs.push({seg,role,text});
// hồ sơ mới → các trường bộ luật lộ trình đang dùng (level, goals, problem)
function c0Sync(){const p=S.profile;if(p.aiNow&&OB_AINOW[p.aiNow])p.level=OB_AINOW[p.aiNow][1];
 const g=[...new Set([p.focusDept,...(p.depts||[])].filter(k=>k&&GOALS[k]))].slice(0,3);if(g.length)p.goals=g;else if(!p.goals||!p.goals.length)p.goals=['ceo'];
 if(p.problems&&p.problems.length)p.problem=p.problems[0];}
// hồ sơ 6 phần: [tên phần, nội dung, nhóm cần sửa]
function c0Parts(){const p=S.profile,dn=k=>DEPTS[k]||k;return [
 ['Doanh nghiệp',[p.industry,p.model,p.size,p.branches?p.branches+' chi nhánh/địa điểm':'',p.products?'Sản phẩm/dịch vụ: '+p.products:'',p.customers?'Khách hàng: '+p.customers:''].filter(Boolean).join(' · '),'1'],
 ['Vai trò CEO',[p.role,p.roleMode,(p.roleDepts||[]).length?'Theo sát: '+p.roleDepts.map(dn).join(', '):''].filter(Boolean).join(' · '),'2'],
 ['Các vấn đề ưu tiên',[p.focusDept?'Quan tâm nhất: '+dn(p.focusDept):'',(p.problems||[]).join('; ')].filter(Boolean).join(' · '),'3,4'],
 ['Hiện trạng AI',p.aiNow&&OB_AINOW[p.aiNow]?OB_AINOW[p.aiNow][0]:'','5'],
 ['Quyết định mục tiêu 30 ngày',p.decision30?`${DEC_PREFIX} ${p.decision30}.`:'','6'],
 ['Giới hạn và điều kiện',(p.limits||[]).length?p.limits.join('; '):p.limitsNone?'Chưa có giới hạn đặc biệt':'','7']];}
const c0PartsText=()=>c0Parts().map(([a,b])=>a+': '+(b||'Cần bổ sung')).join('\n')+(S.profile.days?`\nLịch học: ${S.profile.days} ngày · ${S.profile.minPerSession} phút/ngày`:'');
/* --- Bài 4 --- */
function c0Start4(){if(!S.ob.msgs.some(m=>m.seg==='C0-4'))c0Msg('C0-4','bot',`Chào anh/chị ${firstName()}! Em là Trợ lý lộ trình. Anh/chị hoàn thành giúp em câu sau bằng **một quyết định thật** của doanh nghiệp mình nhé:\n**${DEC_PREFIX}…**`);}
// kiểm tra nhanh theo 4 đặc điểm của Bài 4 (chạy local: bộ luật đơn giản; có AI thì để AI nhận xét)
function decCheck(t){const s=t.toLowerCase(),out=[];
 const tech=/chatgpt|gemini|copilot|claude|enterprise|chatbot|\btool\b|mua (phần mềm|công cụ|giải pháp)/.test(s);
 const ai=/\bai\b|trí tuệ nhân tạo|tự động|agent|chatbot|công cụ|chatgpt/.test(s);
 const concrete=/bộ phận|phòng|sales|marketing|cskh|chăm sóc|khách hàng|vận hành|nhân sự|tài chính|kho|bán hàng|quy trình|báo cáo|ngân sách|\d|tháng|quý|ưu tiên|cơ hội|dữ liệu|tự xây|có sẵn/.test(s);
 const broad=t.length<28||/(ứng dụng|dùng|sử dụng) ai (nhiều hơn|vào doanh nghiệp|cho doanh nghiệp)\s*\.?$|biết thêm|hiểu (thêm )?(về )?ai/.test(s);
 if(broad||!concrete)out.push('Câu còn khá rộng, chưa rõ quyết định cụ thể (bộ phận, bài toán hoặc mốc thời gian).');
 if(tech)out.push('Câu đang bắt đầu từ công nghệ; mình thử bắt đầu từ quyết định kinh doanh phía sau nhé.');
 if(!ai)out.push('Câu chưa thấy liên quan tới AI.');
 return out;}
function decSuggest(){const p=S.profile,d=(p.focusDept&&DEPTS[p.focusDept])||(p.goals&&p.goals[0]&&GOALS[p.goals[0]]);
 return d?`liệu doanh nghiệp có nên ưu tiên ứng dụng AI vào ${d} trong 6 tháng tới hay không, và nếu có thì nên bắt đầu từ bài toán nào`:'bộ phận nào nên là nơi đầu tiên doanh nghiệp đầu tư AI một cách có hệ thống trong 6 tháng tới, và nên bắt đầu từ bài toán nào';}
const decClean=t=>String(t||'').trim().replace(/^sau 30 ngày,?\s*tôi muốn có đủ cơ sở để quyết định\s*/i,'').replace(/^[….\s]+/,'').replace(/[.\s]+$/,'');
function c0Dec(t){t=decClean(t);if(!t)return;const b4=S.ob.b4;c0Msg('C0-4','user',`${DEC_PREFIX} ${t}.`);
 const is=decCheck(t);
 if(!is.length){c0Msg('C0-4','bot','Câu này tốt: đủ quan trọng, đủ cụ thể, có liên quan tới AI và câu trả lời vẫn còn để mở. Em lưu lại làm **quyết định mục tiêu 30 ngày** của anh/chị.');c0SetDec(t);return;}
 Object.assign(b4,{step:'review',mine:t,sugg:decSuggest()});
 c0Msg('C0-4','bot',`${is.join(' ')}\nGợi ý cụ thể hơn: **${DEC_PREFIX} ${b4.sugg}.**\nAnh/chị dùng câu gợi ý, giữ câu của mình hoặc sửa lại nhé. Không có câu nào là sai.`);}
// lưu quyết định 30 ngày: bài nộp C0-4 + hồ sơ (+ lịch sử nếu đổi)
function c0SetDec(t,ch){const p=S.profile,before=p.decision30;p.decision30=decClean(t);if(S.ob&&S.ob.b4)S.ob.b4={step:'done'};
 S.subs['C0-4']={text:`${DEC_PREFIX} ${p.decision30}.`,files:[],links:[],at:nowStr(),v:((S.subs['C0-4']&&S.subs['C0-4'].v)||0)+1,feedback:null,chat:true};
 if(before&&before!==p.decision30)(p.decHist=p.decHist||[]).push({ch:ch||'C0',act:'edit',before,after:p.decision30,at:nowStr()});
 if(!S.done['E:C0-4']){markDone('E:C0-4');toast('Đã hoàn thành bài tập: '+TASKS['C0-4'].title);if(!ch)c0Msg('C0-4','bot','Anh/chị giữ câu này xuyên suốt chương trình nhé. Bấm **Bài tiếp theo** để sang Bài 5.');}
 else if(!ch)toast('Đã cập nhật quyết định 30 ngày');}
/* --- Bài 5: Trợ lý lộ trình hỏi TỪNG CÂU như trò chuyện (theo user 21/10/2026), vẫn theo 7 nhóm của nội dung chính thức --- */
const C5_MAIN=['industry','model','size','products','customers','role','roleMode','depts','focus','problems','aiNow','dec','limits'];
const C5_PART={'1':['industry','model','size','products','customers'],'2':['role','roleMode'],'3,4':['depts','focus','problems'],'5':['aiNow'],'6':['dec'],'7':['limits'],'9':['days','min']};
const Q5={
 industry:{g:1,q:()=>'Doanh nghiệp của anh/chị hoạt động trong ngành nào?',chips:()=>INDUSTRIES.map(x=>[x,x]),text:1,set:v=>{S.profile.industry=v;}},
 model:{g:1,q:()=>'Mô hình kinh doanh của doanh nghiệp là B2B, B2C hay cả hai?',chips:()=>OB_MODELS.map(x=>[x,x]),set:v=>{S.profile.model=v;}},
 size:{g:1,q:()=>'Quy mô nhân sự hiện tại khoảng bao nhiêu?',chips:()=>SIZES.map(x=>[x,x]),set:v=>{S.profile.size=v;}},
 products:{g:1,q:()=>'Sản phẩm hoặc dịch vụ chính của doanh nghiệp là gì? Anh/chị gõ ngắn gọn giúp em.',chips:()=>[['__skip','Bỏ qua']],text:1,ph:'Ví dụ: bao bì giấy cho ngành thực phẩm',set:v=>{S.profile.products=v==='__skip'?'':v;}},
 customers:{g:1,q:()=>'Nhóm khách hàng chính của doanh nghiệp là ai?',chips:()=>[['__skip','Bỏ qua']],text:1,ph:'Ví dụ: chuỗi siêu thị, nhà phân phối',set:v=>{S.profile.customers=v==='__skip'?'':v;}},
 role:{g:2,q:()=>'Vai trò của anh/chị trong doanh nghiệp là gì?',chips:()=>OB_ROLES.map(x=>[x,x]),set:v=>{S.profile.role=v;}},
 roleMode:{g:2,q:()=>'Anh/chị trực tiếp tham gia vận hành hằng ngày, hay chủ yếu quản trị qua đội ngũ?',chips:()=>OB_ROLEMODES.map(x=>[x,x]),set:v=>{S.profile.roleMode=v;}},
 depts:{g:3,multi:9,q:()=>'Doanh nghiệp đang vận hành qua những bộ phận nào? Anh/chị chọn các bộ phận rồi bấm "Xong".',chips:()=>Object.entries(DEPTS),set:v=>{S.profile.depts=v;if(!v.includes(S.profile.focusDept))S.profile.focusDept=null;}},
 focus:{g:3,q:()=>'Trong các bộ phận đó, bộ phận nào đang khiến anh/chị **quan tâm nhất**?',chips:()=>(S.profile.depts||[]).map(k=>[k,DEPTS[k]]),set:v=>{S.profile.focusDept=v;}},
 problems:{g:4,multi:3,text:1,ph:'Hoặc gõ vấn đề khác, cách nhau bằng dấu ;',q:()=>'Hiện tại, có **3 vấn đề** nào đang khiến anh/chị mất nhiều thời gian, chi phí hoặc sự chú ý nhất? Chọn tối đa 3 rồi bấm "Xong", hoặc gõ vấn đề khác.',chips:()=>OB_PROBLEMS.map(x=>[x,x]),set:v=>{S.profile.problems=v;}},
 aiNow:{g:5,q:()=>'AI đã xuất hiện ở đâu trong công việc hoặc doanh nghiệp của anh/chị? Không có câu trả lời nào tốt hơn hay kém hơn, em chỉ cần hiểu thực tế.',chips:()=>Object.entries(OB_AINOW).map(([k,v])=>[k,v[0]]),set:v=>{S.profile.aiNow=v;}},
 dec:{g:6,q:()=>OB_GQ[6](),chips:()=>S.profile.decision30?[['keep','Giữ nguyên'],['adj','Điều chỉnh']]:[],text:()=>!S.profile.decision30,ph:'Gõ tiếp: …quyết định điều gì?',set:v=>{const b5=S.ob.b5;if(v==='adj')b5.flow.splice(b5.i+1,0,'decText');else if(v!=='keep')c0SetDec(v,'C0');}},
 decText:{g:6,q:()=>`Anh/chị viết lại giúp em phần còn lại của câu: "${DEC_PREFIX}…"`,chips:()=>[],text:1,ph:'Ví dụ: đâu là ba quy trình đầu tiên đáng thử nghiệm AI',set:v=>{c0SetDec(v,'C0');}},
 limits:{g:7,multi:9,q:()=>OB_GQ[7]()+' Anh/chị chọn các mục phù hợp rồi bấm "Xong".',chips:()=>[...OB_LIMITS.map(x=>[x,x]),['__none','Chưa có giới hạn đặc biệt']],set:v=>{S.profile.limits=v.filter(x=>x!=='__none');S.profile.limitsNone=v.includes('__none');}},
 days:{q:()=>'Bước cuối: anh/chị muốn hoàn thành chương trình trong bao lâu? Em sẽ chia lộ trình theo lịch này.',chips:()=>[['30','30 ngày'],['15','15 ngày'],['__custom','Tự nhập…']],text:1,ph:'Ví dụ: 45 ngày, 6 tuần…',set:v=>{S.profile.days=+v;}},
 min:{q:()=>'Mỗi ngày anh/chị dành được khoảng bao nhiêu phút?',chips:()=>[['20','20 phút'],['30','30 phút'],['60','1 giờ']],text:1,ph:'Ví dụ: 45 phút',set:v=>{S.profile.minPerSession=+v;}}};
const c5Cur=()=>{const b5=S.ob.b5;return b5.ph==='q'?b5.flow[b5.i]||null:null;};
// hỏi câu tiếp theo; hết câu thì sang bản tổng hợp (hoặc hoàn tất nếu vừa trả lời lịch học)
function c5Ask(){const b5=S.ob.b5,st=b5.flow[b5.i];
 if(!st){const sched=b5.flow.includes('days');b5.flow=[];b5.i=0;
  if(sched){if(S.done['E:C0-5']){b5.ph='done';c0Msg('C0-5','bot','Em đã cập nhật lịch học và chia lại lộ trình.');c0Regen();}else c0Complete();return;}
  b5.ph='sum';c0Msg('C0-5','bot','Em tổng hợp lại cách em đang hiểu doanh nghiệp của anh/chị. Thông tin dưới đây đã phản ánh đúng bối cảnh hiện tại chưa? Có phần nào cần chỉnh, anh/chị bấm **Sửa** ở phần đó nhé.');return;}
 const q=Q5[st],prev=b5.flow[b5.i-1],head=q.g&&(!prev||!Q5[prev]||Q5[prev].g!==q.g)?`**Nhóm ${q.g}/7 · ${OB_GROUPS[q.g-1]}**\n`:'';
 b5.ph='q';b5.multi=[];c0Msg('C0-5','bot',head+q.q());}
function c0Start5(){const b5=S.ob.b5;if(b5.ph!=='new')return;
 c0Msg('C0-5','bot',`Em là Trợ lý lộ trình. Em hỏi anh/chị từng câu ngắn theo **7 nhóm** để hiểu bối cảnh doanh nghiệp (khoảng 5–8 phút). Không cần số liệu nhạy cảm, chỉ cần mô tả chung.${S.loggedIn?'':'\nHồ sơ đang lưu tạm trên trình duyệt này. Anh/chị tạo tài khoản ở cuối Chương 0 để giữ lại.'}`);
 b5.flow=C5_MAIN.slice();b5.i=0;c5Ask();}
function c5Answer(v,label){const b5=S.ob.b5,st=b5.flow[b5.i];if(!st)return;
 c0Msg('C0-5','user',label);Q5[st].set(v);c0Sync();b5.i++;
 T.obTyping=true;T.focus='ob';render();setTimeout(()=>{T.obTyping=false;c5Ask();T.focus='ob';render();},450);}
// học viên gõ tự do thay vì bấm lựa chọn
function c5Text(t){const b5=S.ob.b5,st=c5Cur();
 if(b5.ph==='sum'){c0Msg('C0-5','user',t);if(/đúng|xác nhận|\bok\b|ổn|chuẩn/i.test(t)){ACT.c0Confirm();return;}c0Msg('C0-5','bot','Anh/chị bấm **Sửa** ở phần cần chỉnh, hoặc bấm **Xác nhận hồ sơ** nếu thông tin đã đúng nhé.');T.focus='ob';render();return;}
 if(!st)return;const q=Q5[st],allow=typeof q.text==='function'?q.text():!!q.text;
 if(st==='days'){const d=parseDays(t);if(d&&d>=7&&d<=MAX_DAYS){c5Answer(String(d),t);return;}}
 else if(st==='min'){const m=parseInt(t);if(m>=10&&m<=180){c5Answer(String(snapPace(m)),t);return;}}
 else if(st==='problems'){const a=[...b5.multi,...t.split(';').map(x=>x.trim()).filter(Boolean)].slice(0,3);c5Answer(a,a.join('; '));return;}
 else if(st==='decText'||(st==='dec'&&allow)){const c=decClean(t);if(c.length>=8){c5Answer(c,`${DEC_PREFIX} ${c}.`);return;}}
 else if(allow){c5Answer(t,t);return;}
 const hit=q.chips().find(([v,l])=>!String(v).startsWith('__')&&(l.toLowerCase().includes(t.toLowerCase())||t.toLowerCase().includes(l.toLowerCase())));
 if(hit&&!q.multi){c5Answer(hit[0],t);return;}
 c0Msg('C0-5','user',t);c0Msg('C0-5','bot',st==='days'?`Anh/chị nhập giúp em số ngày, từ 7 đến ${MAX_DAYS} ngày, ví dụ "45 ngày" hoặc "6 tuần" nhé.`:st==='min'?'Anh/chị nhập số phút mỗi ngày, ví dụ "45 phút" nhé.':st==='dec'||st==='decText'?'Anh/chị viết cụ thể hơn một chút giúp em nhé.':'Anh/chị chọn giúp em một lựa chọn bên dưới nhé.');T.focus='ob';render();}
function c0Regen(){c0Sync();if(S.plan){const keep={accepted:S.plan.accepted,wasActive:S.plan.wasActive,start:S.plan.start};S.plan={...rulePlan(S.profile),...keep};}
 S.subs['C0-5']={...(S.subs['C0-5']||{files:[],links:[],v:0}),text:c0PartsText(),at:nowStr(),v:((S.subs['C0-5']&&S.subs['C0-5'].v)||0)+1,feedback:null,chat:true};toast('Đã cập nhật hồ sơ'+(S.plan?' và lộ trình':''));}
function c0Complete(){c0Sync();S.subs['C0-5']={text:c0PartsText(),files:[],links:[],at:nowStr(),v:1,feedback:null,chat:true};
 if(!S.done['E:C0-5']){markDone('E:C0-5');toast('Đã hoàn thành bài tập: '+TASKS['C0-5'].title);}S.ob.b5.ph='done';finishOb();}
// thanh demo nhảy bước / người dùng cũ: tính cả Chương 0 là đã học; hồ sơ thiếu phần nào thì ghi "Cần bổ sung"
function obMarkC0Done(){const p=S.profile;if(!p.aiNow)p.aiNow=({1:'none',2:'ceo',3:'staff',4:'sys'})[p.level]||'ceo';if(!p.depts&&p.goals)p.depts=p.goals.slice();if(!p.focusDept&&p.goals)p.focusDept=p.goals[0];if(!p.problems&&p.problem)p.problems=[p.problem];
 S.ob={...c0Fresh(),done:true,b4:{step:p.decision30?'done':'ask'},b5:{flow:[],i:0,ph:'done',multi:[]}};
 if(!S.subs['C0-4'])S.subs['C0-4']={text:p.decision30?`${DEC_PREFIX} ${p.decision30}.`:'Cần bổ sung quyết định mục tiêu 30 ngày',files:[],links:[],at:nowStr(),v:1,feedback:null,chat:true};
 if(!S.subs['C0-5'])S.subs['C0-5']={text:c0PartsText(),files:[],links:[],at:nowStr(),v:1,feedback:null,chat:true};
 C0_KEYS().forEach(k=>{if(!S.done[k]){if(U(k).kind==='video')S.spent[k]=S.spent[k]||U(k).m;markDone(k);}});}
// khởi động: dữ liệu onboarding cũ (7 câu / bản xem trước 3 bài tập) → Chương 0 bản 2
function c0Migrate(){if(S.subs)delete S.subs['C0-3'];if(S.done)delete S.done['E:C0-3'];if(S.doneAt)delete S.doneAt['E:C0-3'];
 if(S.ob&&S.ob.v===2){const b5=S.ob.b5||{};if(!b5.ph)S.ob.b5=b5.g===10?{flow:[],i:0,ph:'done',multi:[]}:c0Fresh().b5;
  // tin nhắn của bản hỏi theo nhóm (trước khi đổi sang hỏi từng câu): chưa xong thì làm lại Bài 5 từ đầu, đã xong thì bỏ lời chào cũ
  const old=m=>m.seg==='C0-5'&&/mỗi nhóm một lượt/.test(m.text);if(S.ob.msgs.some(old)){if(S.ob.b5.ph!=='done'){S.ob.msgs=S.ob.msgs.filter(m=>m.seg!=='C0-5');S.ob.b5=c0Fresh().b5;}else S.ob.msgs=S.ob.msgs.filter(m=>!old(m));}
  return;}
 if(S.ob&&S.ob.done&&profileComplete(S.profile)){delete S.subs['C0-4'];delete S.subs['C0-5'];obMarkC0Done();}
 else{const name=S.profile&&S.profile.name,company=S.profile&&S.profile.company;S.ob=c0Fresh();['C0-4','C0-5'].forEach(id=>{delete S.subs[id];delete S.done['E:'+id];});}}
function startOb(){
 if(S.ob&&S.ob.v===2)return;
 S.ob=c0Fresh();
 S.profile={name:(S.order&&S.order.name)||S.profile.name||SAMPLE_PROFILE.name,company:(S.order&&S.order.company)||S.profile.company||SAMPLE_PROFILE.company};
}
// Bỏ các bước không còn tồn tại (vd. câu hỏi nhịp học cũ còn lưu trong trình duyệt)
function fixOb(){const ob=S.ob;if(!ob||!Array.isArray(ob.flow))return;const before=ob.flow.slice(0,ob.i).filter(s=>Q[s]).length;ob.flow=ob.flow.filter(s=>Q[s]);ob.i=Math.min(before,ob.flow.length);
 if(!ob.done&&ob.flow.length&&ob.i>=ob.flow.length&&profileComplete(S.profile))finishOb();}
function askOb(){fixOb();const st=S.ob.flow[S.ob.i];if(!st){if(!S.ob.done)finishOb();return;}S.ob.msgs.push({role:'bot',seg:segOf(st),text:Q[st].q(S.profile)});}
function finishOb(){
 // xác nhận hồ sơ + lịch học xong: thiết lập trợ lý đồng hành, tạo lộ trình (chờ trang vẽ xong để không chạy generate giữa lúc khởi động)
 S.ob.done=true;
 c0Msg('C0-5','bot','Hồ sơ đã được xác nhận. Trợ lý đồng hành đã có bối cảnh doanh nghiệp của anh/chị. Em đang chia lộ trình…');
 if(!S.plan)setTimeout(()=>{if(!S.plan&&!T.gen)generate();},0);else c0Regen();
}
function obAnswer(v,label){
 const st=S.ob.flow[S.ob.i];if(!st)return;
 const seg=segOf(st);S.ob.msgs.push({role:'user',seg,text:label});Q[st].set(v);S.ob.i++;
 T.obTyping=true;T.focus='ob';render();
 setTimeout(()=>{T.obTyping=false;obAfterAnswer(seg);T.focus='ob';render();},450);
}
// sau mỗi câu trả lời: hết câu của bài → hoàn thành bài tập; còn câu thì hỏi tiếp trong bài
function obAfterAnswer(seg){if(seg&&obSegDone(seg)){obCompleteSeg(seg);if(seg==='C0-5')finishOb();return;}askOb();}
// Học viên gõ tự do thay vì bấm lựa chọn
function obText(t){
 const st=S.ob.flow[S.ob.i];
 if(!st){S.ob.msgs.push({role:'user',seg:'C0-5',text:t});S.ob.msgs.push({role:'bot',seg:'C0-5',text:'Hồ sơ đã xong rồi ạ. Muốn đổi thời gian hay phòng ban, anh/chị bấm "Điều chỉnh lộ trình" trên trang Lộ trình.'});T.focus='ob';render();return;}
 if(st==='problem'){obAnswer(t,t);return;}
 if(st==='days'){const d=parseDays(t);if(d&&d>=3&&d<=MAX_DAYS){obAnswer(String(d),t);return;}}
 if(st==='pace'){const c=parseAdjust(t,S.profile);if(c.minPerSession){obAnswer(String(snapPace(c.minPerSession)),t);return;}}
 if(st==='confirm'){if(/đúng|ok|chuẩn|rồi|vâng/i.test(t)){obAnswer('ok',t);return;}if(/sửa|sai|chưa/i.test(t)){obAnswer('edit',t);return;}}
 if(st==='goals'){const c=parseAdjust(t,{goals:[]});if(c.goals){S.profile.goals=c.goals.slice(0,3);S.ob.msgs.push({role:'user',seg:'C0-4',text:t});S.ob.i++;T.obTyping=true;render();setTimeout(()=>{T.obTyping=false;obAfterAnswer('C0-4');T.focus='ob';render();},450);return;}}
 const hit=Q[st].chips(S.profile).find(([v,l])=>l.toLowerCase().includes(t.toLowerCase())||t.toLowerCase().includes(l.toLowerCase()));
 if(hit&&!String(hit[0]).startsWith('__')){obAnswer(hit[0],t);return;}
 S.ob.msgs.push({role:'user',seg:segOf(st),text:t});S.ob.msgs.push({role:'bot',seg:segOf(st),text:st==='days'?`Anh/chị nhập giúp em số ngày, từ 3 đến ${MAX_DAYS} ngày, ví dụ "10 ngày" hoặc "3 tuần" nhé.`:'Anh/chị chọn giúp em một lựa chọn bên dưới nhé.'});T.focus='ob';render();
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
THÔNG TIN KHÓA: 8 chương, 37 bài (mỗi bài là 1 video hoặc 1 bài tập, 11 bài tập), chia vào số ngày học học viên chọn; Live Zoom "AI đến đâu rồi?" hằng tháng; Offline Executive Briefing tùy chọn. Học phí ${money(COURSE.list)}, ${COURSE.promo.toLowerCase()} còn ${money(COURSE.price)}. Mỗi module có 1 bài tập áp dụng cho công ty (Module 12: chọn 3 use case); bài làm được lưu ở mục "Bài tập của tôi". Hoàn thành khi học hết các bài và nộp đủ 11 bài tập.
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
  if(/áp dụng|doanh nghiệp|công ty/.test(s)){const x=cur||L.C0;const e=(x.ex||[]).find(e=>(p.goals||[]).includes(e[0]))||(x.ex||[])[0];return `${x.take}${e?` Ví dụ cho ${GOALS[e[0]]}: ${e[1]}.`:''} Ở công ty ${String(p.industry||'').toLowerCase()}, AI thường được thử trước ở việc ${(IND[p.industry]||IND['Khác']).general}.`;}
  if(/giải thích|chưa hiểu|nghĩa là/.test(s)){const x=cur||L.C0;return `Nói ngắn gọn về "${x.title}": ${(x.body||[''])[0]}`;}
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
