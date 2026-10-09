/* =========================================================
   DASHBOARD — bảng tiến độ của học viên (đề xuất mới, mở rộng FR-27 Xem tiến độ)
   Gồm: tổng quan, bản đồ 10 năng lực AI, bài học & bài tập (đã/chưa hoàn thành, thời gian),
   bản đồ hành trình, chia sẻ lên Facebook (ảnh vẽ bằng canvas).
   ========================================================= */

/* ---------- số liệu ---------- */
const DAY=864e5;
const dayStart=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime();};
const fmtDate=t=>new Date(t).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
const fmtShort=t=>new Date(t).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'});
const planDay=i=>dayStart((S.plan&&S.plan.start)||Date.now())+i*DAY;
// ngày hoàn thành một bài = ngày xong phần cuối cùng của bài (null nếu chưa xong / dữ liệu cũ không có ngày)
function lessonDoneAt(i){const ks=lessons()[i];if(!ks.every(k=>S.done[k]))return null;const ts=ks.map(k=>S.doneAt[k]).filter(Boolean);return ts.length?Math.max(...ts):null;}
function moduleDoneAt(id){if(!itemDone(id))return null;const ts=[...L[id].parts.map((_,i)=>S.doneAt[id+':'+i]),S.doneAt['E:'+id]].filter(Boolean);return ts.length?Math.max(...ts):null;}
// số thứ tự năng lực trên bản đồ: 01 → 10 (khác số module, vì năng lực 1 = Module 02)
const capNo=i=>String(i+1).padStart(2,'0');
const modUnits=id=>[...L[id].parts.map((_,i)=>id+':'+i),'E:'+id];
const modPct=id=>{const u=modUnits(id);return Math.round(u.filter(k=>S.done[k]).length/u.length*100);};
// trạng thái 1 năng lực: done (đã chinh phục) / doing (đang học) / open (đã mở, chưa học) / locked (chưa tới)
function capState(id){
 if(itemDone(id))return 'done';
 if(modUnits(id).some(k=>S.done[k]))return 'doing';
 const li=lessonOfUnit(id+':0');return li>=0&&lessonOpen(li)?'open':'locked';
}
function dashStats(){
 const ls=lessons(),N=ls.length,st=planStats(),all=ls.flat();
 const minDone=all.filter(k=>S.done[k]).reduce((s,k)=>s+U(k).m,0),minAll=lessonMin(all);
 const caps=CAP_MAP.filter(c=>itemDone(c.id)).length;
 const start=planDay(0),end=planDay(N-1),today=dayStart(Date.now());
 const elapsed=Math.max(1,Math.min(N,Math.round((today-start)/DAY)+1));
 const ahead=st.lessonsDone-elapsed; // >0: nhanh hơn kế hoạch
 const allDone=st.lessonsDone===N;const lastAt=allDone?Math.max(...ls.map((_,i)=>lessonDoneAt(i)||0)):0;
 const took=allDone&&lastAt?Math.round((dayStart(lastAt)-start)/DAY)+1:null;
 // số ngày thực học: số ngày khác nhau có học ít nhất 1 phần, tính từ lúc bắt đầu đến khi hoàn thành
 const studyDays=new Set(Object.values(S.doneAt||{}).map(dayStart)).size;
 return {...st,N,minDone,minAll,caps,subs:subsCount(),start,end,ahead,allDone,took,studyDays};
}
const hm=m=>m>=60?`${Math.floor(m/60)} giờ${m%60?` ${m%60} phút`:''}`:`${m} phút`;
// lời động viên theo tiến độ
function cheer(p){
 if(p>=100)return 'Chúc mừng! Anh/chị đã đi hết hành trình 10 năng lực AI.';
 if(p>=75)return 'Chỉ còn vài bước nữa là về đích. Giữ nhịp này nhé!';
 if(p>=50)return 'Đã qua nửa chặng đường. Bức tranh AI cho doanh nghiệp đang rõ dần.';
 if(p>0)return 'Khởi đầu rất tốt. Mỗi ngày một bài, anh/chị sẽ thấy AI làm được gì cho công ty mình.';
 return 'Mọi hành trình bắt đầu từ bài đầu tiên. Hôm nay mình bắt đầu nhé!';
}

// trạng thái năng lực theo % (theo brief): Chưa bắt đầu · Đang phát triển · Đã hình thành · Thành thạo
const capLevel=pc=>pc>=100?'Thành thạo':pc>=50?'Đã hình thành':pc>0?'Đang phát triển':'Chưa bắt đầu';
// số bài học có chứa nội dung của 1 module
const capLessons=id=>lessons().filter(ks=>ks.some(k=>U(k).id===id)).length;
// thời gian thực học (phút) của một nhóm phần; hiển thị phút/giờ
const spentOf=keys=>keys.reduce((t,k)=>t+((S.spent||{})[k]||0),0);
const fmtMin=m=>{m=Math.round(m);return m>=60?hmShort(m):m+'′';};
const hmShort=m=>m>=60?`${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}m`:`${m}m`;
// chuỗi ngày học dài nhất từ trước đến nay
function bestStreak(){const days=[...new Set(Object.values(S.doneAt||{}).map(dayStart))].sort((a,b)=>a-b);let best=0,run=0,prev=null;days.forEach(d=>{run=prev!==null&&Math.round((d-prev)/DAY)===1?run+1:1;best=Math.max(best,run);prev=d;});return best;}
// thành tích (gamification nhẹ)
function achievements(){
 const d=dashStats(),best=bestStreak();
 return [
  {k:'first',icon:'play',t:'Khởi động',d:'Xong bài đầu tiên',on:d.lessonsDone>=1},
  {k:'streak',icon:'flame',t:'3 ngày liên tiếp',d:'Học 3 ngày liền',on:best>=3},
  {k:'cap5',icon:'spark',t:'5 năng lực',d:'Mở khóa 5 năng lực',on:d.caps>=5},
  {k:'ex6',icon:'file',t:'Người thực hành',d:'Nộp 6 bài tập',on:d.subs>=6},
  {k:'comm',icon:'users',t:'Kết nối',d:'Tham gia cộng đồng',on:!!(S.comm&&S.comm.joined)},
  {k:'finish',icon:'award',t:'Về đích',d:'Hoàn thành khóa học',on:d.allDone}];
}

/* ---------- màn hình Dashboard ---------- */
function dashboard(){
 const d=dashStats(),ni=nextLesson(),p=d.pct,C=2*Math.PI*46,s=streakInfo();
 const head=`<div class="lsn-top"><button class="btn btn-line btn-sm" data-a="outputsBack">${ic('back',15)} Bài học</button>
  <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="outputsBack">AI for CEO</button><span>/</span><span>Dashboard</span></div></div>`;
 const pace=d.allDone?`${ic('award',14)} Hoàn thành sau ${d.took||d.N} ngày`:d.ahead>0?`${ic('zap',14)} Nhanh hơn ${d.ahead} bài`:d.ahead===0?`${ic('check',14)} Đúng tiến độ`:`${ic('clock',14)} Còn ${-d.ahead} bài để bắt kịp`;
 // 1. hero
 const hero=`<section class="dh-hero">
  <div class="dh-ring"><svg width="116" height="116" viewBox="0 0 116 116" aria-hidden="true"><defs><linearGradient id="dh-rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3874FF"/><stop offset="1" stop-color="#7C5CFC"/></linearGradient></defs><circle cx="58" cy="58" r="46" fill="none" stroke="var(--blue-soft)" stroke-width="12"/><circle cx="58" cy="58" r="46" fill="none" stroke="url(#dh-rg)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p/100)}" transform="rotate(-90 58 58)"/></svg><div><b>${p}%</b><span>hành trình</span></div></div>
  <div class="dh-intro"><h1>Chào anh/chị ${esc(firstName())} 👋</h1><p>Anh/chị đã hoàn thành <b>${p}% hành trình</b>.</p>
   <div class="dh-tags"><span class="dh-tag">${ic('flag',14)} ${d.allDone?'Đã về đích':'Về đích '+fmtShort(d.end)}</span></div></div>
  <div class="dh-cta">${ni>=0?`<button class="btn btn-primary btn-lg" data-a="openLesson" data-v="${ni}">${d.lessonsDone===0&&subsCount()===0?'Bắt đầu học':'Học tiếp'} ${ic('arrow',16)}</button>`:`<button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button>`}<button class="btn btn-accent" data-a="shareOpen" data-v="dash">${ic('share',15)} Chia sẻ Dashboard</button></div>
 </section>`;
 // 2. 4 thẻ số liệu
 const cards=[['chart','Tiến độ',`${p}%`,p/100,'var(--blue)'],['check','Bài hoàn thành',`${d.lessonsDone}/${d.N}`,d.lessonsDone/d.N,'var(--green)'],['spark','Năng lực AI',`${d.caps}/${CAP_MAP.length}`,d.caps/CAP_MAP.length,'var(--teal)'],['clock','Thời gian học',`${d.studyDays} ngày`,d.N?Math.min(1,d.studyDays/d.N):0,'var(--orange)']];
 const cardHTML=`<div class="dh-kpis">${cards.map(([i,l,v,f,c])=>`<div class="dh-kpi" style="--c:${c}"><span class="ico">${ic(i,18)}</span><b>${v}</b><span>${l}</span><i class="meter"><i style="width:${Math.round(f*100)}%"></i></i></div>`).join('')}</div>`;
 // 4. Capacity Map: 10 thẻ năng lực
 const capHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><div><span class="eyebrow">Bản đồ năng lực</span><h2 class="h3">${CAP_MAP.length} năng lực AI anh/chị đang chinh phục</h2></div><span class="dh-big">${d.caps}<small>/${CAP_MAP.length}</small></span></div>
  <div class="cap-wrap"><div class="cap-grid">${CAP_MAP.map((c,ci)=>{const x=L[c.id],pc=modPct(c.id),locked=capState(c.id)==="locked"&&!pc;
   const st=pc>=100?`${ic("check",13)} Đã chinh phục`:pc>0?`Đang học · ${pc}%`:locked?"Chưa mở":"Sẵn sàng học";
   return `<div class="cap ${pc>=100?"done":pc>0?"doing":locked?"locked":"ready"}" style="--c:${c.color}" title="${esc(capLevel(pc)+" · "+capLessons(c.id)+" bài liên quan")}"><div class="cap-top"><span class="cap-ico">${ic(locked?"lock":c.icon,16)}</span><b>${esc(x.cap)}</b><span class="cap-no">${capNo(ci)}</span></div>
    <span class="cap-st">${st}</span>${pc>0?`<i class="meter"><i style="width:${pc}%"></i></i>`:""}</div>`;}).join("")}</div></div></section>`;
 // 5. Journey roadmap theo chương
 const jHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><div><span class="eyebrow">Bản đồ hành trình</span><h2 class="h3">Chặng đường anh/chị đã đi qua</h2></div><div class="j-head-r"><div class="seg" role="group" aria-label="Kiểu bản đồ">${J_VERS.map(([k,l])=>`<button class="${(T.jmVer||1)===k?"on":""}" data-a="jmVer" data-v="${k}" aria-pressed="${(T.jmVer||1)===k}">Kiểu ${k} · ${l}</button>`).join("")}</div><button class="btn btn-accent" data-a="shareOpen" data-v="journey">${ic("share",15)} Chia sẻ Hành trình</button></div></div>${journeyHTML()}</section>`;
 // 6. danh sách bài học + bài tập
 const workHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><h2 class="h3">Bài học & bài tập</h2>
  <div class="seg dh-seg" role="group" aria-label="Lọc">${[['all','Tất cả'],['done','Đã hoàn thành'],['todo','Chưa hoàn thành']].map(([k,l])=>`<button class="${(T.dashFilter||'all')===k?'on':''}" data-a="dashFilter" data-v="${k}">${l}</button>`).join('')}</div></div>${workList()}</section>`;
 const ask=d.allDone&&!S.feedback?`<div class="callout info fb-ask"><span class="fb-ask-ico">${ic('star',20)}</span><div><b>Góp ý về khóa học</b><span>2 phút để Học viện làm tốt hơn.</span></div><button class="btn btn-primary btn-sm" data-a="goFeedback">Góp ý ${ic('arrow',15)}</button></div>`:'';
 const demo=`<div class="demo-box"><span class="t">Công cụ demo</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-line btn-sm" data-a="simulateHalf">Mô phỏng: học một nửa</button><button class="btn btn-line btn-sm" data-a="simulateAll" data-v="dash">Mô phỏng: học xong</button></div></div>`;
 return `<section class="wrap page dash">${head}${hero}${ask}${cardHTML}${capHTML}${chartsHTML(d)}${jHTML}${demo}</section>`;
}
// biểu đồ radar 10 năng lực (1 chuỗi: mức hoàn thành của học viên)
function radar(){
 const n=CAP_MAP.length,cx=170,cy=160,R=110,pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];};
 const ring=f=>CAP_MAP.map((_,i)=>pt(i,R*f).join(',')).join(' ');
 const vals=CAP_MAP.map(c=>modPct(c.id)/100),poly=vals.map((v,i)=>pt(i,R*Math.max(v,.03)).join(',')).join(' ');
 return `<figure class="radar"><svg viewBox="0 0 340 330" role="img" aria-label="Biểu đồ radar 10 năng lực: ${CAP_MAP.map(c=>`${L[c.id].cap} ${modPct(c.id)}%`).join(', ')}">
  ${[.25,.5,.75,1].map(f=>`<polygon points="${ring(f)}" fill="none" stroke="var(--line)" stroke-width="1"/>`).join('')}
  ${CAP_MAP.map((_,i)=>{const [x,y]=pt(i,R);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`;}).join('')}
  <polygon points="${poly}" fill="var(--blue)" fill-opacity=".14" stroke="var(--blue)" stroke-width="2" stroke-linejoin="round"/>
  ${CAP_MAP.map((c,i)=>{const [x,y]=pt(i,R*Math.max(vals[i],.03));return `<circle class="ch-hit" cx="${x}" cy="${y}" r="5" fill="${c.color}" stroke="var(--surface)" stroke-width="2" tabindex="0" data-tip="${tip(L[c.id].cap,modPct(c.id)+'% · '+capLevel(modPct(c.id)))}"/>`;}).join('')}
  ${CAP_MAP.map((c,i)=>{const [x,y]=pt(i,R+22);return `<text x="${x}" y="${y+4}" text-anchor="middle" class="rd-lbl">${capNo(i)}</text>`;}).join('')}
 </svg><figcaption class="hint">Số trên biểu đồ ứng với số của thẻ năng lực.</figcaption></figure>`;
}
const PHASE_ICON={P1:'eye',P2:'pen',P3:'code',P4:'zap',P5:'flag'};
function chapters(){
 const ls=lessons(),ni=nextLesson();
 return PHASES.map((ph,pi)=>{const idx=ls.map((ks,i)=>i).filter(i=>L[U(ls[i][0]).id].phase===ph.id),dn=idx.filter(i=>lessonDone(i)).length;
  return {ph,pi,idx,dn,state:idx.length&&dn===idx.length?'done':idx.includes(ni)?'cur':'todo'};}).filter(c=>c.idx.length);
}
// danh sách bài học + bài tập (bài tập nằm ngay sau bài học chứa nó)
function workList(){
 const f=T.dashFilter||'all',ls=lessons(),ni=nextLesson(),items=[];
 ls.forEach((ks,i)=>{
  const done=lessonDone(i),mods=[...new Set(ks.map(k=>U(k).id))].filter(id=>L[id].type==='module');
  items.push({type:'Bài học',title:`Bài ${i+1} · ${lessonTitle(ks,i,ls)}`,done,cur:i===ni,open:lessonOpen(i),min:lessonMin(ks),cap:mods.map(id=>L[id].cap).join(' + '),a:'openLesson',v:i,cta:done?'Xem lại':'Học tiếp'});
  ks.filter(k=>U(k).kind==='exercise').forEach(k=>{const id=U(k).id,s=!!S.subs[id];items.push({type:'Bài tập',title:TASKS[id].title,done:s,cur:!s&&i===ni,open:s||lessonOpen(i),min:TASKS[id].min,cap:L[id].cap,a:'openEx',v:id,cta:s?'Xem lại':'Làm bài',ex:true});});
 });
 const show=items.filter(x=>f==='all'||(f==='done'?x.done:!x.done));
 if(!show.length)return `<p class="hint" style="text-align:center;padding:18px">Không có mục nào.</p>`;
 return `<ul class="wk">${show.map(x=>`<li class="${x.done?'done':x.cur?'cur':''} ${x.open?'':'locked'}"><span class="wk-ico ${x.ex?'is-ex':''}">${ic(x.done?'check':x.ex?'file':'play',15)}</span>
  <div class="wk-b"><b>${esc(x.title)}</b><span><span class="wk-type ${x.ex?'is-ex':''}">${x.type}</span>${x.cap?` · ${esc(x.cap)}`:''} · ${x.min} phút</span></div>
  <span class="wk-st">${x.done?'Hoàn thành':x.cur?'Đang học':x.open?'Chưa học':'Chưa mở'}</span>
  ${x.open?`<button class="btn ${x.done?'btn-ghost':'btn-primary'} btn-sm" data-a="${x.a}" data-v="${x.v}">${x.cta}</button>`:`<span class="pill lock">${ic('lock',11)}</span>`}</li>`).join('')}</ul>`;
}

/* ---------- biểu đồ (SVG tự vẽ, có tooltip khi rê chuột / focus bàn phím) ---------- */
// màu: bài học = xanh, bài tập = hồng, thời gian = cam (khớp 4 chỉ số)
const CH={lesson:'#22A06B',doing:'#A3DCC2',ex:'#DB2777',time:'#EF8426'};
const tip=(...lines)=>esc(lines.filter(Boolean).join('|'));
// Biểu đồ vòng: phần trăm đã xong (ở giữa) + các phần, cách nhau 2px
function donut(parts,total,center,sub){
 const r=54,C=2*Math.PI*r,gap=total>1?2:0;let off=0;
 const segs=parts.filter(p=>p.v>0).map(p=>{const len=Math.max(0,p.v/total*C-gap);const s=`<circle class="ch-hit" cx="70" cy="70" r="${r}" fill="none" stroke="${p.c}" stroke-width="18" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)" tabindex="0" data-tip="${tip(p.l+': '+p.v,Math.round(p.v/total*100)+'%')}"/>`;off+=p.v/total*C;return s;}).join('');
 return `<svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="${esc(sub+': '+center)}"><circle cx="70" cy="70" r="${r}" fill="none" stroke="var(--bg-2)" stroke-width="18"/>${segs}<text x="70" y="70" text-anchor="middle" class="ch-big">${esc(center)}</text><text x="70" y="90" text-anchor="middle" class="ch-sub">${esc(sub)}</text></svg>`;
}
const legend=items=>`<div class="ch-legend">${items.map(([c,l,line])=>`<span><i class="${line?'ln':''}" style="background:${c}"></i>${esc(l)}</span>`).join('')}</div>`;
// 1. Vòng: bài học (hoàn thành / đang học / chưa học) và bài tập (đã nộp / chưa nộp)
function chartDonuts(d){
 const ni=nextLesson(),doing=ni>=0&&lessons()[ni].some(k=>S.done[k])?1:0,todo=d.N-d.lessonsDone-doing,nt=Object.keys(TASKS).length;
 return `<div class="ch-card"><h3 class="ch-t">Bài học</h3><p class="ch-s">${d.lessonsDone}/${d.N} bài đã hoàn thành</p>
   ${donut([{v:d.lessonsDone,c:CH.lesson,l:'Hoàn thành'},{v:doing,c:CH.doing,l:'Đang học'},{v:todo,c:'transparent',l:'Chưa học'}],d.N,Math.round(d.lessonsDone/d.N*100)+'%','hoàn thành')}
   ${legend([[CH.lesson,`Hoàn thành · ${d.lessonsDone}`],[CH.doing,`Đang học · ${doing}`],['var(--bg-2)',`Chưa học · ${todo}`]])}</div>
  <div class="ch-card"><h3 class="ch-t">Bài tập</h3><p class="ch-s">${d.subs}/${nt} bài tập đã nộp</p>
   ${donut([{v:d.subs,c:CH.ex,l:'Đã nộp'},{v:nt-d.subs,c:'transparent',l:'Chưa nộp'}],nt,Math.round(d.subs/nt*100)+'%','đã nộp')}
   ${legend([[CH.ex,`Đã nộp · ${d.subs}`],['var(--bg-2)',`Chưa nộp · ${nt-d.subs}`]])}</div>`;
}
// 3. Cột: thời gian thực học (phút) của từng bài; bài chưa học hiện thời lượng dự kiến (xám)
function chartLessonTime(){
 const ls=lessons(),N=ls.length,ni=nextLesson(),W=1000,H=200,m={l:44,r:6,t:14,b:28},iw=W-m.l-m.r,ih=H-m.t-m.b;
 const act=ls.map(ks=>spentOf(ks)),val=act;
 const max=Math.max(10,Math.ceil(Math.max(...val)/10)*10),band=iw/N,bw=Math.max(8,Math.min(100,band*.72));
 const Y=v=>m.t+ih-(v/max)*ih,every=N<=30?1:2; // hiện đủ số thứ tự từng bài (theo yêu cầu user); lộ trình > 30 bài thì cách 1 số cho khỏi chồng chữ
 const bars=ls.map((ks,i)=>{const done=lessonDone(i),cur=i===ni,at=lessonDoneAt(i);
  const x=m.l+i*band+(band-bw)/2,y=Math.min(Y(val[i]),m.t+ih-(val[i]>0?6:0)),c=done?CH.lesson:cur?CH.doing:'var(--line-2)';
  const t=tip(`Bài ${i+1} · ${lessonTitle(ks,i,ls)}`,done||act[i]>0?`Thực học ${fmtMin(act[i])}`:'Chưa học',done?`Hoàn thành ${at?fmtShort(at):''}`:cur?'Đang học':'');
  return `${val[i]>0?`<path d="M${x},${m.t+ih}V${y+4}a4,4 0 0 1 4,-4h${bw-8}a4,4 0 0 1 4,4V${m.t+ih}Z" fill="${c}"/>`:''}<rect class="ch-hit" x="${m.l+i*band}" y="${m.t}" width="${band}" height="${ih}" fill="transparent" tabindex="0" data-tip="${t}"/>${i%every===0||i===N-1?`<text x="${x+bw/2}" y="${H-8}" text-anchor="middle" class="ch-ax">${i+1}</text>`:''}`;}).join('');
 return `<div class="ch-card wide"><h3 class="ch-t">Thời gian học từng bài</h3><p class="ch-s">Số phút thực học mỗi bài.</p>
  <div class="ch-wrap"><svg viewBox="0 0 ${W} ${H}" class="ch-svg" role="img" aria-label="Thời gian thực học từng bài">
   ${[0,max/2,max].map(v=>`<line x1="${m.l}" x2="${m.l+iw}" y1="${Y(v)}" y2="${Y(v)}" class="ch-grid"/><text x="${m.l-8}" y="${Y(v)+4}" text-anchor="end" class="ch-ax">${v}′</text>`).join('')}${bars}
  </svg></div>${legend([[CH.lesson,'Đã hoàn thành'],[CH.doing,'Đang học']])}</div>`;
}
// 4. Thanh ngang: số ngày thực học của từng chương = số ngày khác nhau có học ít nhất 1 phần trong chương
function chartChapterTime(){
 const ls=lessons(),rows=chapters().map(c=>{const ks=c.idx.flatMap(i=>ls[i]);return {ph:c.ph,done:new Set(ks.map(k=>(S.doneAt||{})[k]).filter(Boolean).map(dayStart)).size};});
 const max=Math.max(1,...rows.map(r=>r.done));
 return `<div class="ch-card"><h3 class="ch-t">Thời gian học theo chương</h3><p class="ch-s">Số ngày thực học của từng chương.</p>
  <div class="ch-bars">${rows.map(r=>{return `<div class="ch-bar ch-hit" tabindex="0" data-tip="${tip(`Chương ${PHASES.indexOf(r.ph)+1} · ${r.ph.name}`,r.done?`Thực học ${r.done} ngày`:'Chưa học')}"><span class="l">Chương ${PHASES.indexOf(r.ph)+1}<small>${esc(r.ph.name)}</small></span>
   <span class="t" style="width:100%"><i style="width:${r.done/max*100}%;background:${CH.time}"></i></span><b class="v">${r.done} ngày</b></div>`;}).join('')}</div>
</div>`;
}
function chartsHTML(d){
 return `<section class="card pad dh-sec"><div class="dh-sec-h"><div><span class="eyebrow">Biểu đồ tiến độ</span><h2 class="h3">Đã hoàn thành bao nhiêu, mất bao lâu</h2></div></div>
  <div class="ch-grid2">${chartDonuts(d)}${chartChapterTime()}</div>
  ${chartLessonTime()}</section>`;
}
// tooltip dùng chung: đọc data-tip (các dòng cách nhau "|"), chèn bằng textContent
function chartTip(e){
 const el=e.target.closest&&e.target.closest('.ch-hit');let t=document.getElementById('ch-tip');
 if(!el){if(t)t.hidden=true;return;}
 if(!t){t=document.createElement('div');t.id='ch-tip';t.setAttribute('role','tooltip');document.body.appendChild(t);}
 t.textContent='';el.dataset.tip.split('|').forEach((l,i)=>{const s=document.createElement(i?'span':'b');s.textContent=l;t.appendChild(s);});
 t.hidden=false;
 const r=el.getBoundingClientRect(),px=e.clientX||r.left+r.width/2,py=e.clientY||r.top;
 t.style.left=Math.min(window.innerWidth-t.offsetWidth-8,Math.max(8,px+14))+'px';t.style.top=Math.max(8,py-t.offsetHeight-12)+'px';
}

/* ---------- chia sẻ lên Facebook ---------- */
// Facebook không cho website tự đính ảnh vào bài đăng → vẽ sẵn ảnh để tải/chia sẻ, kèm mở hộp chia sẻ link
function shareCaption(kind){
 const d=dashStats();
 if(kind==='cert')return `Tôi vừa hoàn thành khóa AI for CEO tại Học viện Siêu Tăng Trưởng: ${d.N} bài học, ${Object.keys(TASKS).length} bài tập áp dụng cho doanh nghiệp, ${d.caps}/${CAP_MAP.length} năng lực AI. #AIforCEO #SieuTangTruong`;
 return kind==='journey'
  ?`Hành trình AI for CEO của tôi: đã đi qua ${d.lessonsDone}/${d.N} bài, chinh phục ${d.caps}/${CAP_MAP.length} năng lực AI cùng Học viện Siêu Tăng Trưởng. #AIforCEO #SieuTangTruong`
  :`Tôi đã hoàn thành ${d.pct}% khóa AI for CEO: ${d.lessonsDone}/${d.N} bài học, ${d.subs} bài tập áp dụng cho doanh nghiệp, ${d.caps}/${CAP_MAP.length} năng lực AI. #AIforCEO #SieuTangTruong`;
}
function shareView(){
 if(!T.share)return '';
 const k=T.share,canShareFile=!!(navigator.canShare&&window.File);
 return `<div class="mail-ov" role="presentation"><div class="mail share" role="dialog" aria-modal="true" aria-label="Chia sẻ lên Facebook">
  <div class="mail-bar"><span class="mail-app">${ic('fb',16)} Chia sẻ</span><button class="x" data-a="shareClose" aria-label="Đóng">${ic('x')}</button></div>
  <div class="share-body">
   <div class="seg" role="group" aria-label="Chọn ảnh chia sẻ"><button class="${k==='dash'?'on':''}" data-a="shareOpen" data-v="dash">Dashboard</button><button class="${k==='journey'?'on':''}" data-a="shareOpen" data-v="journey">Hành trình</button>${dashStats().allDone?`<button class="${k==='cert'?'on':''}" data-a="shareOpen" data-v="cert">Chứng nhận</button>`:''}</div>
   <canvas id="share-cv" width="1200" height="630" aria-label="Ảnh xem trước"></canvas>
   <label class="hint" for="share-cap">Nội dung bài đăng</label>
   <textarea class="inp" id="share-cap" rows="3">${esc(T.shareCap||shareCaption(k))}</textarea>
   <div class="share-act">${canShareFile?`<button class="btn btn-primary" data-a="shareNative">${ic('share',16)} Chia sẻ ảnh</button>`:''}<button class="btn dh-btn-fb solid" data-a="shareFb">${ic('fb',16)} Đăng Facebook</button><button class="btn btn-line" data-a="shareDownload">${ic('download',16)} Tải ảnh</button></div>
   <p class="hint">Facebook chỉ nhận link: ảnh được tải về và nội dung được sao chép để anh/chị đính kèm vào bài đăng.</p>
  </div></div></div>`;
}
// vẽ ảnh 1200×630 (khung chuẩn ảnh chia sẻ Facebook)
async function drawShare(){
 const cv=document.getElementById('share-cv');if(!cv)return;
 try{await document.fonts.load('800 40px Inter');await document.fonts.load('600 20px Inter');}catch(e){}
 // ảnh Dashboard: khung chuẩn 1200×630; ảnh hành trình: cao theo số bài
 if(T.share==='cert'){cv.width=2000;cv.height=1414;await drawCert(cv);return;}
 const JL=T.share==='journey'?jShareLayout():null;if(JL){cv.width=JL.W*2;cv.height=JL.H*2;}else{cv.width=DC.W*2;cv.height=DC.H*2;}
 const g=cv.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.scale(2,2);
 await (JL?drawJourneyCard(g,JL):drawDashCard(g));
}
const F=(w,s)=>`${w} ${s}px Inter, Arial, sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
// xuống dòng tối đa n dòng trong bề rộng max
function wrapText(g,t,max,n){const w=String(t).split(' '),out=[];let line='';for(const x of w){const tryL=line?line+' '+x:x;if(g.measureText(tryL).width<=max||!line)line=tryL;else{out.push(line);line=x;}}if(line)out.push(line);if(out.length>n){out.length=n;out[n-1]=fitText(g,out[n-1]+' …',max);}return out;}
function fitText(g,t,max){if(g.measureText(t).width<=max)return t;while(t.length>1&&g.measureText(t+'…').width>max)t=t.slice(0,-1);return t+'…';}
function brand(g,dark){g.font=F(800,22);g.fillStyle=dark?'#1747C9':'#fff';g.textBaseline='alphabetic';g.fillText('Siêu Tăng Trưởng',60,64);g.font=F(600,16);g.fillStyle=dark?'#5B6472':'rgba(255,255,255,.75)';g.fillText('AI for CEO · sieutangtruong.vn',60,90);}
// thẻ chia sẻ Dashboard (khổ ngang 1600×1000 = 8:5, xuất gấp đôi cho nét): logo Siêu Tăng Trưởng, tên học viên,
// ô tổng quan (vòng % + 3 số liệu) và **Biểu đồ tiến độ** giống trên trang: vòng Bài học, vòng Bài tập,
// thời gian học theo chương (số ngày thực học), thời gian học từng bài (số phút thực học)
const DC={W:1600,H:1000};
async function drawDashCard(g){
 const d=dashStats(),{W,H}=DC,name=S.profile.name||'Học viên',ls=lessons(),nt=Object.keys(TASKS).length,logo=await certLogo();
 const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#F4F7FF');bg.addColorStop(1,'#F6F1FF');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(56,116,255,.07)';g.beginPath();g.arc(W-40,20,220,0,7);g.fill();
 const card=(x,y,w,h)=>{g.fillStyle='#fff';rr(g,x,y,w,h,20);g.fill();g.strokeStyle='#E6EAF0';g.lineWidth=1.5;g.stroke();};
 // logo + học viên (1 hàng)
 if(logo){const lh=48,lw=logo.width*lh/logo.height;g.drawImage(logo,48,40,lw,lh);}else{g.fillStyle='#1747C9';g.font=F(800,28);g.fillText('Siêu Tăng Trưởng',48,76);}
 g.textAlign='right';g.fillStyle='#667085';g.font=F(600,19);g.fillText('AI for CEO · Dashboard học tập',W-48,72);g.textAlign='left';
 g.fillStyle='#3874FF';g.beginPath();g.arc(80,150,30,0,7);g.fill();g.fillStyle='#fff';g.font=F(700,26);g.textAlign='center';g.fillText(name.trim().split(/\s+/).pop()[0]||'L',80,159);g.textAlign='left';
 g.fillStyle='#172033';g.font=F(800,34);g.fillText(fitText(g,name,900),126,148);g.fillStyle='#667085';g.font=F(500,18);g.fillText('Học viên AI for CEO',126,176);
 // cột trái: tổng quan
 card(48,210,560,330);
 const cx=170,cy=375,R=92;g.lineCap='round';g.lineWidth=20;g.strokeStyle='#E6EDFF';g.beginPath();g.arc(cx,cy,R,0,Math.PI*2);g.stroke();
 const rg=g.createLinearGradient(cx-R,cy-R,cx+R,cy+R);rg.addColorStop(0,'#3874FF');rg.addColorStop(1,'#7C5CFC');g.strokeStyle=rg;if(d.pct>0){g.beginPath();g.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*d.pct/100);g.stroke();}
 g.textAlign='center';g.fillStyle='#172033';g.font=F(800,46);g.fillText(d.pct+'%',cx,cy+12);g.fillStyle='#667085';g.font=F(500,16);g.fillText('hoàn thành',cx,cy+40);g.textAlign='left';
 [[`${d.studyDays} ngày`,'Thời gian học','#EF8426'],[`${d.lessonsDone}/${d.N}`,'Bài hoàn thành','#22A06B'],[`${d.caps}/${CAP_MAP.length}`,'Năng lực AI','#18A999']].forEach(([v,l,c],i)=>{const y=290+i*88;g.fillStyle=c;rr(g,310,y-32,8,54,4);g.fill();g.fillStyle='#172033';g.font=F(800,34);g.fillText(v,334,y);g.fillStyle='#667085';g.font=F(500,16);g.fillText(l,334,y+24);});
 // cột trái dưới: 2 vòng
 const ni=nextLesson(),doing=ni>=0&&ls[ni]&&ls[ni].some(k=>S.done[k])?1:0,todo=d.N-d.lessonsDone-doing;
 const donut=(x,y,w,title,sub,parts,total,big,legend)=>{card(x,y,w,380);g.fillStyle='#172033';g.font=F(700,19);g.fillText(title,x+24,y+40);g.fillStyle='#667085';g.font=F(500,15);g.fillText(sub,x+24,y+64);
  const ox=x+w/2,oy=y+170,r=66;g.lineCap='butt';g.lineWidth=22;g.strokeStyle='#EEF1F6';g.beginPath();g.arc(ox,oy,r,0,7);g.stroke();let a0=-Math.PI/2;
  parts.forEach(([v,c])=>{if(!v)return;const a1=a0+Math.PI*2*v/total;g.strokeStyle=c;g.beginPath();g.arc(ox,oy,r,a0,a1);g.stroke();a0=a1;});
  g.textAlign='center';g.fillStyle='#172033';g.font=F(800,26);g.fillText(big,ox,oy+9);g.textAlign='left';
  legend.forEach(([c,l],k)=>{const ly=y+282+k*28;g.fillStyle=c;rr(g,x+28,ly-12,14,14,4);g.fill();g.fillStyle='#344054';g.font=F(500,15);g.fillText(l,x+50,ly);});};
 donut(48,560,270,'Bài học',`${d.lessonsDone}/${d.N} bài đã hoàn thành`,[[d.lessonsDone,CH.lesson],[doing,CH.doing]],d.N,Math.round(d.lessonsDone/d.N*100)+'%',[[CH.lesson,`Hoàn thành · ${d.lessonsDone}`],[CH.doing,`Đang học · ${doing}`],['#E6EAF0',`Chưa học · ${todo}`]]);
 donut(338,560,270,'Bài tập',`${d.subs}/${nt} bài tập đã nộp`,[[d.subs,CH.ex]],nt,Math.round(d.subs/nt*100)+'%',[[CH.ex,`Đã nộp · ${d.subs}`],['#E6EAF0',`Chưa nộp · ${nt-d.subs}`]]);
 // cột phải: tiêu đề biểu đồ + thời gian học theo chương + từng bài
 const X=640,RW=W-48-X;
 g.fillStyle='#3874FF';g.font=F(800,14);g.fillText('BIỂU ĐỒ TIẾN ĐỘ',X,226);g.fillStyle='#172033';g.font=F(800,24);g.fillText('Đã hoàn thành bao nhiêu, mất bao lâu',X,258);
 const rows=chapters().map(c=>{const ks=c.idx.flatMap(i=>ls[i]);return {pi:PHASES.indexOf(c.ph),name:c.ph.name,v:new Set(ks.map(k=>(S.doneAt||{})[k]).filter(Boolean).map(dayStart)).size};}),mx=Math.max(1,...rows.map(r=>r.v));
 card(X,280,RW,280);g.fillStyle='#172033';g.font=F(700,19);g.fillText('Thời gian học theo chương',X+24,318);g.fillStyle='#667085';g.font=F(500,15);g.fillText('Số ngày thực học của từng chương',X+24,342);
 rows.forEach((r,k)=>{const y=384+k*36;g.fillStyle='#344054';g.font=F(600,16);g.fillText(fitText(g,`Chương ${r.pi+1} · ${r.name}`,320),X+24,y+5);if(r.v){g.fillStyle=CH.time;rr(g,X+360,y-9,(RW-480)*r.v/mx,16,4);g.fill();}g.fillStyle='#172033';g.font=F(700,16);g.textAlign='right';g.fillText(r.v+' ngày',X+RW-24,y+5);g.textAlign='left';});
 card(X,580,RW,360);g.fillStyle='#172033';g.font=F(700,19);g.fillText('Thời gian học từng bài',X+24,618);g.fillStyle='#667085';g.font=F(500,15);g.fillText('Số phút thực học mỗi bài',X+24,642);
 const mins=ls.map(ks=>spentOf(ks)),mm=Math.max(10,Math.ceil(Math.max(...mins)/10)*10),N=ls.length,x0=X+64,x1=X+RW-24,y0=900,hh=220,band=(x1-x0)/N,bw=Math.max(4,Math.min(56,band*.72));
 g.strokeStyle='#EEF1F6';g.lineWidth=1;[0,.5,1].forEach(f=>{const y=y0-hh*f;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();g.fillStyle='#98A2B3';g.font=F(500,13);g.textAlign='right';g.fillText(Math.round(mm*f)+'′',x0-8,y+4);});
 const every=N<=30?1:2;
 mins.forEach((m,i)=>{const x=x0+i*band+(band-bw)/2;if(m>0){g.fillStyle=lessonDone(i)?CH.lesson:CH.doing;const h=Math.max(3,hh*m/mm);rr(g,x,y0-h,bw,h,Math.min(4,bw/2));g.fill();}
  if(i%every===0||i===N-1){g.fillStyle='#667085';g.font=F(500,13);g.textAlign='center';g.fillText(i+1,x+bw/2,y0+20);}});
 g.textAlign='center';g.fillStyle='#667085';g.font=F(500,16);g.fillText('sieutangtruong.vn · #AIforCEO',W/2,978);g.textAlign='left';
}
// thẻ chia sẻ Hành trình: các chặng đã đi qua, chặng hiện tại, năng lực mở khóa, tổng bài học / bài tập
// thẻ chia sẻ Hành trình: khổ dọc 1080×1350 (4:5), vẽ đúng kiểu bản đồ đang chọn (T.jmVer), đi từ dưới lên
const JC={W:1600,H:1000}; // khổ ngang 8:5 (giống ảnh Dashboard), xuất gấp đôi cho nét
function journeyLayout(){return {W:JC.W,H:JC.H};}
// Kiểu 1 & 2: dùng đúng hình SVG của bản đồ trên trang (gắn sẵn style đã tính) để ảnh chia sẻ khớp 100% với trang
const SVG_PROPS=['fill','fill-opacity','stroke','stroke-width','stroke-dasharray','stroke-linecap','stroke-linejoin','stroke-opacity','opacity','font-size','font-weight','letter-spacing','paint-order','text-anchor','display','stop-color','stop-opacity'];
function svgInline(html,P=70){
 const box=document.createElement('div');box.className='dash';box.style.cssText='position:fixed;left:-99999px;top:0;width:1100px;visibility:hidden';box.innerHTML=html;document.body.appendChild(box);
 const sv=box.querySelector('svg');if(!sv){box.remove();return null;}
 const src=[sv,...sv.querySelectorAll('*')],cl=sv.cloneNode(true),dst=[cl,...cl.querySelectorAll('*')];
 src.forEach((el,k)=>{const cs=getComputedStyle(el),o=dst[k];if(o.tagName==='title'){o.remove();return;}let st='';SVG_PROPS.forEach(p=>{const v=cs.getPropertyValue(p);if(v)st+=p+':'+v+';';});st+="font-family:Inter,Arial,sans-serif;";o.setAttribute('style',st);o.removeAttribute('class');});
 box.remove();
 const vb=(cl.getAttribute('viewBox')||'0 0 1000 1000').split(/\s+/).map(Number);
 vb[0]-=P;vb[2]+=2*P;cl.setAttribute('viewBox',vb.join(' '));
 cl.setAttribute('xmlns','http://www.w3.org/2000/svg');cl.setAttribute('width',vb[2]);cl.setAttribute('height',vb[3]);
 return {svg:new XMLSerializer().serializeToString(cl),w:vb[2],h:vb[3]};
}
function jcSvg(g,html,R={x:40,y:220,w:1000,h:960},P=70){
 const r=svgInline(html,P);if(!r)return Promise.resolve();
 return new Promise(ok=>{const im=new Image();im.onload=()=>{const k=Math.min(R.w/r.w,R.h/r.h),w=r.w*k,h=r.h*k;g.drawImage(im,R.x+(R.w-w)/2,R.y+(R.h-h)/2,w,h);ok();};im.onerror=()=>ok();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(r.svg);});
}
// ảnh chia sẻ Hành trình: kích thước ảnh tính theo tỉ lệ bản đồ để ít khoảng trắng
//  - bản đồ dọc (Kiểu 1 Con đường): chữ ở cột trái hẹp, bản đồ cao hết ảnh, bề ngang ảnh co theo bản đồ
//  - bản đồ ngang (Kiểu 2 Leo núi, Kiểu 3 Đường gấp khúc): chữ thành 1 hàng trên cùng, bản đồ rộng hết ảnh bên dưới
function jShareLayout(){
 const v=T.jmVer||1,J=jData(),r=v===1?svgInline(jRoad(J,{wide:true}),12):svgInline(v===2?jMountain(J):jSnake(J),40);
 const asp=r?r.w/r.h:1;
 if(asp<1.05){const H=Math.round(Math.min(1400,Math.max(1000,r.h*.72+80))),mh=H-80,mw=Math.round(mh*asp),W=Math.max(1100,480+mw+40);return {mode:'side',W,H,r,map:{x:W-40-mw,y:40,w:mw,h:mh}};}
 const W=1600,mw=W-112,mh=Math.min(1100,Math.round(mw/asp)),H=Math.max(760,190+mh+64);return {mode:'top',W,H,r,map:{x:56,y:190,w:mw,h:mh}};
}
async function drawJourneyCard(g,Lay){
 Lay=Lay||jShareLayout();
 const d=dashStats(),{W,H}=Lay,name=S.profile.name||'Học viên',logo=await certLogo();
 const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#F4F7FF');bg.addColorStop(1,'#FFF6EE');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.fillStyle='#fff';rr(g,24,24,W-48,H-48,22);g.fill();g.strokeStyle='#E6EAF0';g.lineWidth=1.5;g.stroke();
 const logoAt=(x,y,h)=>{if(logo){const lw=logo.width*h/logo.height;g.drawImage(logo,x,y,lw,h);}else{g.fillStyle='#1747C9';g.font=F(800,26);g.fillText('Siêu Tăng Trưởng',x,y+h-10);}};
 if(Lay.mode==='side'){
  logoAt(64,64,42);
  g.fillStyle='#3874FF';g.font=F(800,16);g.fillText('BẢN ĐỒ HÀNH TRÌNH',64,190);
  g.fillStyle='#172033';g.font=F(800,48);g.fillText('Hành trình',64,246);g.fillText('AI for CEO',64,302);
  g.fillStyle='#172033';g.font=F(700,24);g.fillText(fitText(g,name,380),64,358);g.fillStyle='#667085';g.font=F(500,20);g.fillText(`${d.caps}/${CAP_MAP.length} năng lực AI đã chinh phục`,64,390);
  g.fillStyle='#667085';g.font=F(500,15);g.fillText('sieutangtruong.vn · #AIforCEO',64,H-60);
 }else{
  logoAt(64,62,42);
  g.textAlign='right';g.fillStyle='#3874FF';g.font=F(800,15);g.fillText('BẢN ĐỒ HÀNH TRÌNH',W-64,74);
  g.fillStyle='#172033';g.font=F(800,34);g.fillText('Hành trình AI for CEO',W-64,114);
  g.fillStyle='#667085';g.font=F(500,19);g.fillText(fitText(g,`${name} · ${d.caps}/${CAP_MAP.length} năng lực AI đã chinh phục`,700),W-64,146);
  g.font=F(500,15);g.fillText('sieutangtruong.vn · #AIforCEO',W-64,H-50);g.textAlign='left';
 }
 g.lineCap='round';g.lineJoin='round';
 const r=Lay.r,R=Lay.map;if(!r)return;
 await new Promise(ok=>{const im=new Image();im.onload=()=>{const k=Math.min(R.w/r.w,R.h/r.h),w=r.w*k,h=r.h*k;g.drawImage(im,R.x+(R.w-w)/2,R.y+(R.h-h)/2,w,h);ok();};im.onerror=()=>ok();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(r.svg);});
}
function shareBlob(){return new Promise(ok=>{const cv=document.getElementById('share-cv');if(!cv)return ok(null);try{cv.toBlob(b=>ok(b),'image/png');}catch(e){ok(null);}});}
function shareFileName(){return T.share==='cert'?`chung-nhan-ai-for-ceo-${certCode()}.png`:T.share==='journey'?'hanh-trinh-ai-for-ceo.png':'dashboard-ai-for-ceo.png';}
async function shareDownload(){
 const b=await shareBlob();if(!b){toast('Chưa tạo được ảnh. Anh/chị thử mở demo bằng link GitHub thay vì mở file trên máy','bad');return false;}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=shareFileName();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);return true;
}

/* ---------- Chứng nhận hoàn thành (ảnh A4 ngang 2000×1414, tải PNG hoặc in/lưu PDF) ---------- */
const certCode=()=>'STT-AICEO-'+((S.order&&S.order.code)||'000000').replace(/\D/g,'').slice(-6);
// ngày cấp dạng 01/10/2026 (thêm số 0 cho ngày/tháng 1 chữ số)
const certDate=()=>String(S.completedAt||today()).replace(/^(\d)\//,'0$1/').replace(/\/(\d)\//,'/0$1/');
let CERT_LOGO=null; // logo nhúng sẵn (LOGO_DATA trong data.js) nên vẽ được cả khi mở file trực tiếp mà ảnh vẫn tải về được
function certLogo(){
 if(CERT_LOGO)return Promise.resolve(CERT_LOGO);
 return new Promise(ok=>{const i=new Image();i.onload=()=>{CERT_LOGO=i;ok(i);};i.onerror=()=>ok(null);i.src=LOGO_DATA;});
}
async function drawCert(target){
 const cv=target||document.getElementById('cert-cv');if(!cv)return;
 try{await document.fonts.load('800 60px Inter');await document.fonts.load('600 30px Inter');await document.fonts.load('500 30px Inter');}catch(e){}
 const logo=await certLogo(),g=cv.getContext('2d'),W=2000,H=1414,cx=W/2,d=dashStats(),p=S.profile;
 // nền + khung
 g.fillStyle='#FFFDF8';g.fillRect(0,0,W,H);
 const grad=g.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#1747C9');grad.addColorStop(.55,'#6D3BE0');grad.addColorStop(1,'#DB2777');
 g.fillStyle=grad;g.beginPath();g.moveTo(0,0);g.lineTo(520,0);g.lineTo(0,380);g.closePath();g.fill();g.beginPath();g.moveTo(W,H);g.lineTo(W-520,H);g.lineTo(W,H-380);g.closePath();g.fill();
 g.globalAlpha=.08;g.beginPath();g.moveTo(W,0);g.lineTo(W-300,0);g.lineTo(W,220);g.closePath();g.fill();g.beginPath();g.moveTo(0,H);g.lineTo(300,H);g.lineTo(0,H-220);g.closePath();g.fill();g.globalAlpha=1;
 g.strokeStyle='#1747C9';g.lineWidth=6;rr(g,60,60,W-120,H-120,26);g.stroke();
 g.strokeStyle='#C9A227';g.lineWidth=2;rr(g,84,84,W-168,H-168,18);g.stroke();
 g.fillStyle='#FFFDF8';rr(g,90,90,W-180,H-180,16);g.fill();
 g.textAlign='center';g.textBaseline='alphabetic';
 // logo
 if(logo){const lw=440,lh=lw*logo.height/logo.width;g.drawImage(logo,cx-lw/2,170,lw,lh);}else{g.fillStyle='#0A4AAD';g.font=F(800,46);g.fillText('Siêu Tăng Trưởng',cx,220);}
 // tiêu đề
 g.fillStyle='#141A26';g.font=F(800,84);g.fillText('CHỨNG NHẬN HOÀN THÀNH',cx,380);
 g.fillStyle='#8A6D1D';g.font=F(600,32);g.fillText('C E R T I F I C A T E   O F   C O M P L E T I O N',cx,442);
 g.fillStyle='#5B6472';g.font=F(500,40);g.fillText('Học viện Siêu Tăng Trưởng trân trọng chúc mừng',cx,545);
 // tên học viên
 g.fillStyle='#1747C9';g.font=F(800,104);g.fillText(fitText(g,p.name||'Học viên',1500),cx,665);
 g.strokeStyle='#C9A227';g.lineWidth=2;g.beginPath();g.moveTo(cx-460,705);g.lineTo(cx+460,705);g.stroke();
 g.fillStyle='#5B6472';g.font=F(500,40);g.fillText('đã hoàn thành chương trình',cx,792);
 g.fillStyle='#141A26';g.font=F(800,68);g.fillText('AI for CEO',cx,880);
 // con dấu
 const sx=cx,sY=1115;g.fillStyle='#C9A227';g.beginPath();for(let k=0;k<24;k++){const a=k/24*Math.PI*2,r=k%2?125:140;g.lineTo(sx+Math.cos(a)*r,sY+Math.sin(a)*r);}g.closePath();g.fill();
 g.fillStyle='#E9C65A';g.beginPath();g.arc(sx,sY,110,0,7);g.fill();g.strokeStyle='#8A6D1D';g.lineWidth=2.5;g.beginPath();g.arc(sx,sY,97,0,7);g.stroke();
 g.fillStyle='#6B5212';g.font=F(800,25);g.fillText('SIÊU TĂNG',sx,sY-16);g.fillText('TRƯỞNG',sx,sY+16);g.font=F(800,17);g.fillText('★ AI FOR CEO ★',sx,sY+50);
 // ngày, mã, chữ ký
 g.textAlign='left';g.fillStyle='#5B6472';g.font=F(500,30);g.fillText('Ngày cấp',220,1092);g.fillStyle='#141A26';g.font=F(700,40);g.fillText(certDate(),220,1142);
 g.fillStyle='#5B6472';g.font=F(500,28);g.fillText('Mã chứng nhận: '+certCode(),220,1192);
 g.textAlign='center';g.strokeStyle='#2B3240';g.lineWidth=1.5;g.beginPath();g.moveTo(1410,1126);g.lineTo(1810,1126);g.stroke();
 g.fillStyle='#141A26';g.font=F(700,32);g.fillText('Đại diện Học viện',1610,1172);g.fillStyle='#5B6472';g.font=F(500,28);g.fillText('Học viện Siêu Tăng Trưởng',1610,1212);
 g.textAlign='left';
}
function certBlob(){return new Promise(ok=>{const cv=document.getElementById('cert-cv');if(!cv)return ok(null);try{cv.toBlob(b=>ok(b),'image/png');}catch(e){ok(null);}});}
async function certDownload(){
 const b=await certBlob();if(!b){toast('Chưa tạo được ảnh chứng nhận. Anh/chị thử lại sau vài giây','bad');return false;}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`chung-nhan-ai-for-ceo-${certCode()}.png`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);return true;
}
// In / lưu PDF: chỉ in tấm chứng nhận, khổ A4 ngang
function certPrint(){
 const cv=document.getElementById('cert-cv');if(!cv)return;let url;try{url=cv.toDataURL('image/png');}catch(e){toast('Chưa tạo được bản in. Anh/chị dùng nút Tải ảnh','bad');return;}
 let box=document.getElementById('cert-print');if(!box){box=document.createElement('div');box.id='cert-print';document.body.appendChild(box);}
 box.innerHTML=`<img src="${url}" alt="Chứng nhận hoàn thành AI for CEO">`;document.body.classList.add('printing-cert');
 const done=()=>{document.body.classList.remove('printing-cert');window.removeEventListener('afterprint',done);};window.addEventListener('afterprint',done);
 setTimeout(()=>window.print(),150);
}

/* ---------- Bản đồ hành trình (đi từ dưới lên, Về đích ở trên): 3 kiểu để chọn ----------
   Theo yêu cầu user (10/2026): bản đồ KHÔNG còn hiện từng bài học, mà hiện **10 năng lực AI** (CAP_MAP = Module 02–11)
   và **output của từng năng lực** (CAP_MAP.out = sản phẩm CEO làm ra ở bài tập của module). Xuất phát = Module 01, Về đích = Module 12.
   jData(): mỗi năng lực = {i, id, title, out, st: done|cur|locked, pi (chương), color}; J.fin = đã về đích (xong cả Module 12).
   1 Con đường uốn lượn (jRoad) · 2 Leo núi (jMountain) · 3 Đường gấp khúc (jSnake) */
const J_VERS=[[1,'Con đường'],[2,'Leo núi'],[3,'Đường gấp khúc']];
const J_ST={done:'Đã chinh phục',cur:'Đang chinh phục',locked:'Chưa mở'};
function jData(){
 const J=CAP_MAP.map((c,i)=>{const m=L[c.id];return {i,id:c.id,title:m.cap,out:c.out||'',s:capState(c.id),pi:PHASES.findIndex(p=>p.id===m.phase),color:c.color};});
 const ci=J.findIndex(j=>j.s!=='done');
 J.forEach((j,k)=>{j.st=j.s==='done'?'done':k===ci?'cur':'locked';});
 J.fin=ci<0&&itemDone('M12');
 return J;
}
function journeyHTML(){
 const v=T.jmVer||1,J=jData();
 return v===2?jMountain(J):v===3?jSnake(J):jRoad(J);
}
const jTip=j=>`Năng lực ${capNo(j.i)} · ${j.title} · Output: ${j.out} · ${J_ST[j.st]}`;
const jDone=J=>J.filter(j=>j.st==='done').length;
const jAria=J=>`Bản đồ hành trình: ${jDone(J)}/${J.length} năng lực AI đã chinh phục`;
// nhóm năng lực theo chương (dùng cho vùng chương ở Kiểu 1)
function jGroups(J){const g=[];J.forEach((j,k)=>{let x=g.find(y=>y.pi===j.pi);if(!x)g.push(x={pi:j.pi,idx:[]});x.idx.push(k);});
 g.forEach(x=>{x.dn=x.idx.filter(k=>J[k].st==='done').length;x.state=x.dn===x.idx.length?'done':x.idx.some(k=>J[k].st!=='locked')?'doing':'todo';});return g;}
// Về đích: tên 3 use case học viên đã nộp ở bài tập Module 12 (theo yêu cầu user); chưa nộp thì trả [] và hiện "Chọn 3 use case cho doanh nghiệp"
function jUseCases(){const s=S.subs&&S.subs.M12;if(!s||!s.text)return [];const p=exSplit(s.text,3,true)||[];
 return p.map(t=>String(t||'').split('\n')[0].replace(/^[\s:.\-–]+/,'').trim()).filter(Boolean).slice(0,3);}
const jCut=(t,n)=>t.length>n?t.slice(0,Math.max(1,n-1)).trim()+'…':t;
// đường cong mượt qua các điểm (tiếp tuyến đứng ở mỗi điểm)
const jCurve=pts=>pts.map((p,k)=>k?`C${pts[k-1][0]},${(pts[k-1][1]+p[1])/2} ${p[0]},${(pts[k-1][1]+p[1])/2} ${p[0]},${p[1]}`:`M${p[0]},${p[1]}`).join(' ');

/* Kiểu 1: con đường uốn lượn đi từ dưới lên; mỗi chương là một vùng nền nhạt màu chương có nhãn "CHƯƠNG k · TÊN · x/y";
   mỗi năng lực là một mốc tròn trên đường (đã chinh phục: màu năng lực + ✓ · đang chinh phục: viền cam + vầng sáng + "BẠN ĐANG Ở ĐÂY" · chưa mở: trắng viền xám);
   thẻ nhãn 2 dòng: "01  Tên năng lực" + "Output: …". Màn hình hẹp dùng khung 600 để chữ đủ to. */
function jRoad(J,opt={}){
 const share=!!opt.share,N=J.length,narrow=!share&&!opt.wide&&typeof innerWidth!=='undefined'&&innerWidth<700,W=share?1000:narrow?600:1000,CX=W/2,A=share?115:narrow?110:100,RH=narrow?128:100,GAP=46,TOP=196,BOT=104;
 const ci=J.findIndex(j=>j.st==='cur'),fin=!!J.fin,all3=ci<0,chs=jGroups(J),uc=jUseCases();
 // máy tính: mốc lệch trái/phải xen kẽ (về phía thẻ của nó) + lệch nhẹ ngẫu nhiên → đường quanh co chữ S (theo yêu cầu user)
 // máy tính: mốc xen kẽ trái/phải nhưng độ lệch và khoảng cách dọc KHÔNG đều (khúc cua gắt, khúc thoải) → đường quanh co tự nhiên; thẻ xen kẽ 2 bên, cùng bề rộng, xếp thẳng cột sát mép → chữ phân bổ đều 2 bên (theo yêu cầu user)
 const wide=!share&&!narrow,J_OFF=[110,-40,-140,-35,145,35,-120,-150,15,135],J_DY=[100,126,92,134,96,120,104,130,94],xs=J.map((_,i)=>wide?CX+J_OFF[i%10]:CX+A*Math.sin(i*2*Math.PI/6.5+.35));let y=0;const ys=J.map((j,i)=>{if(i)y+=(wide?J_DY[(i-1)%9]:RH)+(j.pi!==J[i-1].pi?GAP:0);return y;});
 const span=y,H=TOP+span+BOT,Y=i=>H-BOT-ys[i];
 const P=J.map((_,i)=>[xs[i],Y(i)]),start=[xs[0],H-40],goal=[CX,TOP-118];
 const curve=pts=>jCurve(pts);
 const bands=chs.map(c=>{const f=c.idx[0],l=c.idx[c.idx.length-1],y0=Y(f)+72,y1=Y(l)-52,col=PHASE_COLOR[PHASES[c.pi].id]||'#3874FF',lock=c.state==='todo';
  const txt=`CHƯƠNG ${c.pi+1} · ${PHASES[c.pi].name.toUpperCase()}`,cnt=`${c.dn}/${c.idx.length}`;
  const right=xs[f]<CX,tw=Math.min(W-48,txt.length*(narrow?10:9)+cnt.length*(narrow?10:9)+50),cx0=right?W-24-tw:24,cy=y0-38;
  return [`<rect x="0" y="${y1}" width="${W}" height="${y0-y1}" rx="22" fill="${lock?'#98A2B3':col}" fill-opacity="${lock?.04:.06}"/>`,`<g class="jr3-band"><rect x="${cx0}" y="${cy}" width="${tw}" height="32" rx="16" fill="#fff"/><rect x="${cx0}" y="${cy}" width="${tw}" height="32" rx="16" fill="${lock?'#EEF1F6':col}" fill-opacity="${lock?1:.14}"/>
   <text x="${cx0+16}" y="${cy+21}" class="jr3-chip" fill="${lock?'#8A94A6':col}">${esc(txt)}</text><text x="${cx0+tw-16}" y="${cy+21}" text-anchor="end" class="jr3-cnt" fill="${lock?'#8A94A6':col}">${cnt}</text></g>`];});
 const all=[start,...P,goal];
 const road=`<path d="${curve(all)}" class="jr3-edge"/><path d="${curve(all)}" class="jr3-road"/>`;
 const segs=P.map((p,i)=>{const prev=i?P[i-1]:start,on=all3||i<=ci;return on?`<path d="${curve([prev,p])}" class="jr3-on" stroke="${J[i].color}"/>`:'';}).join('')+(fin?`<path d="${curve([P[N-1],goal])}" class="jr3-on" stroke="#F5B942"/>`:'');
 const lane=`<path d="${curve(all)}" class="jr3-lane"/>`;
 const nodes=J.map((j,i)=>{const [x,yy]=P[i],cur=j.st==='cur',lock=j.st==='locked',col=j.color;
  // máy tính: đường gần giữa, thẻ xen kẽ trái/phải và rộng đều tới mép để 2 bên cân đối (theo yêu cầu user); điện thoại: thẻ đặt phía còn nhiều chỗ
  const right=narrow?W-x>=x:i%2===0,full=!narrow,room=full?CX-24-140-42:(right?W-x:x)-48,k=capNo(i),kw=k.length*(narrow?10:9.6)+10,chw=narrow?10:9,ochw=narrow?7.8:6.4,pad=32;
  const nm=jCut(j.title,Math.max(4,Math.floor((room-kw-pad)/chw))),ot=jCut('Output: '+j.out,Math.max(6,Math.floor((room-pad)/ochw)));
  const cw=full?room:Math.max(kw+nm.length*chw,ot.length*ochw)+pad,hh=narrow?66:60,R=21;
  let cx0=full?(right?W-24-cw:24):(right?x+R+17:x-R-17-cw);cx0=Math.max(10,Math.min(W-10-cw,cx0));const cy0=yy-hh/2,lx=right?cx0:cx0+cw;
  return `<g class="jr3-n ${j.st}" role="img" aria-label="${esc(jTip(j))}"><title>${esc(jTip(j))}</title>
   <line x1="${right?x+R+3:x-R-3}" y1="${yy}" x2="${lx}" y2="${yy}" class="jr3-lead" stroke="${lock?'#D5DCE6':cur?'#EF8426':col}"/>
   <rect x="${cx0}" y="${cy0}" width="${cw}" height="${hh}" rx="12" class="jr3-card ${j.st}" stroke="${cur?'#EF8426':lock?'#E3E8F0':col}" stroke-opacity="${cur||lock?1:.35}"/>
   ${cur?(()=>{const pw=narrow?176:150,ph=30,px0=Math.max(6,Math.min(W-6-pw,right?x-R-14-pw:x+R+14)),tip=right?`M${px0+pw},${yy-7} L${px0+pw+8},${yy} L${px0+pw},${yy+7}Z`:`M${px0},${yy-7} L${px0-8},${yy} L${px0},${yy+7}Z`;return `<g class="jr3-here"><rect x="${px0}" y="${yy-ph/2}" width="${pw}" height="${ph}" rx="${ph/2}"/><path d="${tip}"/><text x="${px0+pw/2}" y="${yy+5}" text-anchor="middle" class="jr3-here-t">BẠN ĐANG Ở ĐÂY</text></g>`;})():''}
   <text x="${cx0+14}" y="${cy0+(narrow?27:24)}" class="jr3-line"><tspan class="jr3-k" fill="${lock?'#98A2B3':cur?'#EF8426':col}">${k}</tspan><tspan class="jr3-t ${j.st}" dx="8">${esc(nm)}</tspan></text>
   <text x="${cx0+14}" y="${cy0+(narrow?52:46)}" class="jr3-o ${j.st}">${esc(ot)}</text>
   ${cur?`<circle cx="${x}" cy="${yy}" r="${R+13}" fill="#EF8426" opacity=".16"/>`:''}
   <circle cx="${x}" cy="${yy}" r="${R}" fill="${j.st==='done'?col:'#fff'}" stroke="${j.st==='done'?'#fff':cur?'#EF8426':'#A9B4C6'}" stroke-width="${j.st==='done'?4:4.5}"/>
   ${j.st==='done'?`<circle cx="${x}" cy="${yy}" r="${R+3}" fill="none" stroke="${col}" stroke-width="2"/>`:''}
   <text x="${x}" y="${yy+6.5}" text-anchor="middle" class="jr3-num" fill="${j.st==='done'?'#fff':cur?'#EF8426':'#667085'}">${j.st==='done'?'✓':i+1}</text></g>`;}).join('');
 const [sx,sy]=start,[gx,gy]=goal;
 const startEl=`<g><rect x="${sx-66}" y="${sy-4}" width="132" height="32" rx="16" class="jr3-startb"/><text x="${sx}" y="${sy+17}" text-anchor="middle" class="jr3-start">XUẤT PHÁT</text></g>`;
 const goalEl=`<g class="jr3-goal"><circle cx="${gx}" cy="${gy}" r="44" fill="${fin?'#F5B942':'#FFF6E0'}" stroke="#F5B942" stroke-width="4"/><text x="${gx}" y="${gy+13}" text-anchor="middle" class="jr3-star" fill="${fin?'#fff':'#E0A21B'}">🏆</text>
  <text x="${gx}" y="${gy-62}" text-anchor="middle" class="jr3-gt">${fin?'ĐÃ VỀ ĐÍCH':'VỀ ĐÍCH'}</text>${uc.length?(()=>{const cx0=gx+62,cw=W-cx0-12,n=Math.floor((cw-40)/(narrow?8.6:7.4)),h=34+uc.length*24;return `<rect x="${cx0}" y="${gy-h/2}" width="${cw}" height="${h}" rx="12" class="jr3-uc"/><text x="${cx0+16}" y="${gy-h/2+24}" class="jr3-uch">3 USE CASE CỦA ANH/CHỊ</text>${uc.map((u,k)=>`<text x="${cx0+16}" y="${gy-h/2+50+k*24}" class="jr3-ucl"><tspan class="jr3-ucn">${k+1}</tspan><tspan dx="8">${esc(jCut(u,n))}</tspan><title>${esc(u)}</title></text>`).join('')}`;})():`<text x="${gx}" y="${gy+72}" text-anchor="middle" class="jr3-gs">Chọn 3 use case cho doanh nghiệp</text>`}</g>`;
 return `<div class="jr3"><svg viewBox="0 0 ${W} ${H}" class="${narrow?'nar':''}" role="img" aria-label="${jAria(J)}">${bands.map(b=>b[0]).join('')}${road}${segs}${lane}${startEl}${goalEl}${nodes}</svg></div>`;
}

/* Kiểu 2: leo núi: đường mòn zigzag từ chân núi lên đỉnh, mỗi chấm là một năng lực; nhãn năng lực + output ở mép trái/phải
   có đường gióng tới chấm (nhãn cùng phía tự giãn cách để không chồng nhau) */
function jMountain(J){
 const N=J.length,P=[[250,492],[560,432],[270,362],[522,292],[322,222],[470,162],[382,104],[400,62]];
 const seg=P.slice(1).map((p,k)=>Math.hypot(p[0]-P[k][0],p[1]-P[k][1])),tot=seg.reduce((a,b)=>a+b,0);
 const at=t=>{let d=t*tot;for(let k=0;k<seg.length;k++){if(d<=seg[k]){const f=d/seg[k];return [P[k][0]+(P[k+1][0]-P[k][0])*f,P[k][1]+(P[k+1][1]-P[k][1])*f];}d-=seg[k];}return P[P.length-1];};
 const pos=J.map(j=>at((j.i+1)/(N+1))),ci=J.findIndex(j=>j.st==='cur'),fin=!!J.fin,tReach=ci<0?(fin?1:N/(N+1)):(ci+1)/(N+1);
 const walked=[P[0]];{let d=tReach*tot;for(let k=0;k<seg.length;k++){if(d<=seg[k]){walked.push(at(tReach));break;}walked.push(P[k+1]);d-=seg[k];}}
 const ln=a=>a.map((p,k)=>(k?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
 // vị trí nhãn: mỗi phía xếp từ trên xuống, cách nhau tối thiểu 42 đơn vị
 const ly=J.map((_,k)=>pos[k][1]);
 ['L','R'].forEach(sd=>{const ks=J.map((_,k)=>k).filter(k=>(pos[k][0]<400)===(sd==='L')).sort((p,q)=>ly[p]-ly[q]);
  for(let m=1;m<ks.length;m++)if(ly[ks[m]]-ly[ks[m-1]]<42)ly[ks[m]]=ly[ks[m-1]]+42;
  const over=ks.length?ly[ks[ks.length-1]]-520:0;if(over>0)ks.forEach(k=>{ly[k]-=over;});});
 const labels=J.map((j,k)=>{const [px,py]=pos[k],left=px<400,tx=left?14:786,lock=j.st==='locked',cur=j.st==='cur';
  const w=Math.max((capNo(j.i)+'  '+j.title).length*8.6,('Output: '+j.out).length*6.6),lx=left?Math.min(px-14,tx+w+10):Math.max(px+14,tx-w-10),yy=ly[k];
  return `<g class="jm-cap ${j.st}"><path d="M${px},${py} L${lx},${yy-6} L${left?tx+w+4:tx-w-4},${yy-6}" fill="none" stroke="${lock?'#C9D1DD':j.color}" stroke-width="1.3" stroke-dasharray="3 4"/>
   <text x="${tx}" y="${yy-10}" text-anchor="${left?'start':'end'}" class="jm-ct ${j.st}"><tspan class="jm-ch" fill="${lock?'#98A2B3':cur?'var(--orange)':j.color}">${capNo(j.i)}</tspan><tspan dx="6">${esc(j.title)}</tspan></text>
   <text x="${tx}" y="${yy+8}" text-anchor="${left?'start':'end'}" class="jm-o ${j.st}">Output: ${esc(j.out)}</text></g>`;}).join('');
 const dots=J.map((j,k)=>{const [px,py]=pos[k],r=j.st==='cur'?13:9;
  return `<g class="jm-dot ${j.st}" role="img" aria-label="${esc(jTip(j))}"><title>${esc(jTip(j))}</title><circle cx="${px}" cy="${py}" r="${r}" fill="${j.st==='done'?j.color:'var(--surface)'}" stroke="${j.st==='locked'?'var(--line-2)':j.color}" stroke-width="${j.st==='cur'?4:2}"/>${j.st==='cur'?`<text x="${px}" y="${py+4}" text-anchor="middle" class="jm-n" fill="${j.color}">${j.i+1}</text>`:j.st==='done'?`<text x="${px}" y="${py+4}" text-anchor="middle" class="jm-n" fill="#fff">✓</text>`:''}</g>`;}).join('');
 const cur=ci>=0?(()=>{const [px,py]=pos[ci];return `<g class="jm-here"><rect x="${px-70}" y="${py+20}" width="140" height="30" rx="15"/><text x="${px}" y="${py+40}" text-anchor="middle">Bạn đang ở đây</text></g>`;})():'';
 return `<div class="jm"><figure class="jm-fig"><svg viewBox="0 0 800 548" role="img" aria-label="${jAria(J)}">
  <defs><linearGradient id="jmG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="jm-s1"/><stop offset="1" class="jm-s2"/></linearGradient></defs>
  <path class="jm-back" d="M0,500 L170,250 L300,380 L560,150 L800,470 L800,500Z"/>
  <path d="M30,500 L400,40 L770,500Z" fill="url(#jmG)"/><path class="jm-snow" d="M400,40 L452,105 L428,96 L408,116 L384,98 L352,106Z"/>
  <path class="jm-trail" d="${ln(P)}"/><path class="jm-trail walked" d="${ln(walked)}"/>
  <g class="jm-top ${fin?'done':''}"><line x1="400" y1="58" x2="400" y2="14" stroke="var(--ink)" stroke-width="2.5"/><path d="M400,14 l26,9 l-26,9z" fill="var(--orange)"/><text x="436" y="30" class="jm-t"><tspan class="jm-ch" fill="var(--orange)">Về đích</tspan>${(()=>{const uc=jUseCases();return uc.length?uc.map((u,k)=>`<tspan x="436" dy="${k?17:19}" class="jm-uc">${k+1}. ${esc(jCut(u,50))}</tspan>`).join(''):'<tspan x="436" dy="18">Chọn 3 use case</tspan>';})()}</text></g>
  ${labels}${dots}${cur}
  <text x="252" y="524" text-anchor="end" class="jm-t">Xuất phát</text></svg></figure></div>`;
}

/* Kiểu 3: đường gấp khúc dạng lưới, đi từ dưới lên (hàng dưới trái → phải, quay đầu chữ U lên hàng trên…), kết thúc ở cúp Về đích.
   Mỗi năng lực là một nút tròn (đã chinh phục = màu năng lực + ✓, đang chinh phục = vầng sáng + "Bạn đang ở đây", chưa mở = trắng viền xám);
   nhãn dưới nút: tên năng lực + "Output: …". Chip "CHƯƠNG k" trên nút đầu chương. */
function jSnake(J){
 const N=J.length,COLS=(typeof innerWidth!=='undefined'&&innerWidth<700)?3:5,R=Math.ceil(N/COLS),W=1000,RH=235,TOP=200,H=TOP+R*RH+10,uc=jUseCases();
 const ci=J.findIndex(j=>j.st==='cur'),fin=!!J.fin;
 const cx=c=>110+c*(780/(COLS-1)),pos=i=>{const r=Math.floor(i/COLS),p=i%COLS,c=r%2?COLS-1-p:p;return [cx(c),TOP+(R-1-r)*RH+50];};
 const wrap=(t,n=20)=>{const w=t.split(' '),o=[];let l='';for(const x of w){if((l+' '+x).trim().length>n&&l){o.push(l);l=x;}else l=(l+' '+x).trim();}if(l)o.push(l);if(o.length>2){o.length=2;o[1]=jCut(o[1],n);}return o;};
 const seg=(p,q)=>{if(p[1]===q[1])return `M${p[0]},${p[1]} L${q[0]},${q[1]}`;const out=p[0]>W/2?1:-1,k=130*out;return `M${p[0]},${p[1]} C${p[0]+k},${p[1]} ${q[0]+k},${q[1]} ${q[0]},${q[1]}`;};
 const P=J.map(j=>pos(j.i));
 const last=P[N-1],goalAt=[last[0],TOP-80];
 const lines=J.slice(0,-1).map((j,k)=>{const on=ci<0||k+1<=ci,col=J[k+1].color;return `<path d="${seg(P[k],P[k+1])}" class="jg-ln ${on?'on':''}" ${on?`style="stroke:${col}"`:''}/>`;}).join('')
  +`<path d="M${last[0]},${last[1]} L${goalAt[0]},${goalAt[1]+34}" class="jg-ln ${fin?'on':''}" ${fin?'style="stroke:#F5B942"':''}/>`;
 const firstOf=new Set(PHASES.map((_,p)=>J.findIndex(j=>j.pi===p)).filter(k=>k>=0));
 const nodes=J.map((j,k)=>{const [x,y]=P[k],col=j.color,cur=j.st==='cur',nm=wrap(j.title,22),ot=wrap('Output: '+j.out,22);
  const chip=firstOf.has(j.i)?(()=>{const t='CHƯƠNG '+(j.pi+1),w=t.length*9+26,yy=y-(cur?92:58);return `<rect x="${x-w/2}" y="${yy}" width="${w}" height="26" rx="13" fill="${j.st==='locked'?'#EEF1F6':col}" fill-opacity="${j.st==='locked'?1:.14}"/><text x="${x}" y="${yy+18}" text-anchor="middle" class="jg-chip" fill="${j.st==='locked'?'#98A2B3':col}">${t}</text>`;})():'';
  const here=cur?`<g class="jg-here"><rect x="${x-74}" y="${y-62}" width="148" height="28" rx="8"/><path d="M${x-6},${y-34} L${x},${y-28} L${x+6},${y-34}Z"/><text x="${x}" y="${y-43}" text-anchor="middle">Bạn đang ở đây</text></g>`:'';
  let ty=y+50;const txt=nm.map(l=>{const t=`<text x="${x}" y="${ty}" text-anchor="middle" class="jg-b ${j.st}">${esc(l)}</text>`;ty+=21;return t;}).join('')+ot.map(l=>{const t=`<text x="${x}" y="${ty}" text-anchor="middle" class="jg-s ${j.st}">${esc(l)}</text>`;ty+=19;return t;}).join('');
  return `<g class="jg-n ${j.st}" role="img" aria-label="${esc(jTip(j))}"><title>${esc(jTip(j))}</title>
   ${cur?`<circle cx="${x}" cy="${y}" r="34" fill="${col}" opacity=".16"/>`:''}
   <circle cx="${x}" cy="${y}" r="24" fill="${j.st==='done'?col:'#fff'}" stroke="${j.st==='locked'?'#D5DCE6':j.st==='done'?'#fff':col}" stroke-width="${j.st==='done'?4:3.5}"/>
   ${j.st==='done'?`<circle cx="${x}" cy="${y}" r="27" fill="none" stroke="${col}" stroke-width="2"/>`:''}
   <text x="${x}" y="${y+7}" text-anchor="middle" class="jg-num" fill="${j.st==='done'?'#fff':j.st==='locked'?'#98A2B3':col}">${j.st==='done'?'✓':j.i+1}</text>
   ${txt}${here}</g>`;}).join('');
 const [gx,gy]=goalAt;
 const goal=`<g class="jg-goal ${fin?'done':''}"><circle cx="${gx}" cy="${gy}" r="30" fill="${fin?'#F5B942':'#FFF6E0'}" stroke="#F5B942" stroke-width="3"/><text x="${gx}" y="${gy+10}" text-anchor="middle" class="jg-star" fill="${fin?'#fff':'#E0A21B'}">★</text>
  ${(()=>{const tx=gx+(gx>W/2?-44:44),an=gx>W/2?'end':'start';return uc.length?`<text x="${tx}" y="${gy-30}" text-anchor="${an}" class="jg-b">Về đích · 3 use case của anh/chị</text>${uc.map((u,k)=>`<text x="${tx}" y="${gy-8+k*21}" text-anchor="${an}" class="jg-s jg-uc">${k+1}. ${esc(jCut(u,48))}<title>${esc(u)}</title></text>`).join('')}`:`<text x="${tx}" y="${gy-2}" text-anchor="${an}" class="jg-b">Về đích</text><text x="${tx}" y="${gy+18}" text-anchor="${an}" class="jg-s">Chọn 3 use case cho doanh nghiệp</text>`;})()}</g>`;
 const p0=P[0],start=`<g><rect x="${p0[0]-62}" y="${p0[1]+136}" width="124" height="30" rx="8" class="jg-startb"/><text x="${p0[0]}" y="${p0[1]+156}" text-anchor="middle" class="jg-start">XUẤT PHÁT</text></g>`;
 return `<div class="jg"><svg viewBox="0 0 ${W} ${H+70}" role="img" aria-label="${jAria(J)}">${lines}${goal}${nodes}${start}</svg></div>`;
}
