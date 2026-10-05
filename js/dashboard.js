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
 return {...st,N,minDone,minAll,caps,subs:subsCount(),start,end,ahead,allDone,took};
}
const hm=m=>m>=60?`${Math.floor(m/60)} giờ${m%60?` ${m%60} phút`:''}`:`${m} phút`;
// lời động viên theo tiến độ
function cheer(p){
 if(p>=100)return 'Chúc mừng! Anh/chị đã đi hết hành trình 12 năng lực AI.';
 if(p>=75)return 'Chỉ còn vài bước nữa là về đích. Giữ nhịp này nhé!';
 if(p>=50)return 'Đã qua nửa chặng đường. Bức tranh AI cho doanh nghiệp đang rõ dần.';
 if(p>0)return 'Khởi đầu rất tốt. Mỗi ngày một bài, anh/chị sẽ thấy AI làm được gì cho công ty mình.';
 return 'Mọi hành trình bắt đầu từ bài đầu tiên. Hôm nay mình bắt đầu nhé!';
}

// trạng thái năng lực theo % (theo brief): Chưa bắt đầu · Đang phát triển · Đã hình thành · Thành thạo
const capLevel=pc=>pc>=100?'Thành thạo':pc>=50?'Đã hình thành':pc>0?'Đang phát triển':'Chưa bắt đầu';
// số bài học có chứa nội dung của 1 module
const capLessons=id=>lessons().filter(ks=>ks.some(k=>U(k).id===id)).length;
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
   <div class="dh-tags"><span class="dh-tag">${pace}</span>${s.streak?`<span class="dh-tag y">${ic('flame',14)} ${s.streak} ngày liên tiếp</span>`:''}<span class="dh-tag">${ic('flag',14)} ${d.allDone?'Đã về đích':'Về đích '+fmtShort(d.end)}</span></div></div>
  <div class="dh-cta">${ni>=0?`<button class="btn btn-primary btn-lg" data-a="openLesson" data-v="${ni}">Học tiếp ${ic('arrow',16)}</button>`:`<button class="btn btn-primary btn-lg" data-a="go" data-to="complete">Nhận chứng nhận ${ic('arrow',16)}</button>`}<button class="btn btn-accent" data-a="shareOpen" data-v="dash">${ic('share',15)} Chia sẻ Dashboard</button></div>
 </section>`;
 // 2. 4 thẻ số liệu
 const cards=[['chart','Tiến độ',`${p}%`,p/100,'var(--blue)'],['check','Bài hoàn thành',`${d.lessonsDone}/${d.N}`,d.lessonsDone/d.N,'var(--green)'],['spark','Năng lực mở khóa',`${d.caps}/${CAP_MAP.length}`,d.caps/CAP_MAP.length,'var(--teal)'],['clock','Thời gian học',hmShort(d.minDone),d.minAll?d.minDone/d.minAll:0,'var(--orange)']];
 const cardHTML=`<div class="dh-kpis">${cards.map(([i,l,v,f,c])=>`<div class="dh-kpi" style="--c:${c}"><span class="ico">${ic(i,18)}</span><b>${v}</b><span>${l}</span><i class="meter"><i style="width:${Math.round(f*100)}%"></i></i></div>`).join('')}</div>`;
 // 4. Capacity Map: 10 thẻ năng lực
 const capHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><div><span class="eyebrow">Bản đồ năng lực</span><h2 class="h3">${CAP_MAP.length} năng lực AI anh/chị đang chinh phục</h2></div><span class="dh-big">${d.caps}<small>/${CAP_MAP.length}</small></span></div>
  <div class="cap-wrap"><div class="cap-grid">${CAP_MAP.map((c,ci)=>{const x=L[c.id],pc=modPct(c.id),locked=capState(c.id)==="locked"&&!pc;
   const st=pc>=100?`${ic("check",13)} Đã chinh phục`:pc>0?`Đang học · ${pc}%`:locked?"Chưa mở":"Sẵn sàng học";
   return `<div class="cap ${pc>=100?"done":pc>0?"doing":locked?"locked":"ready"}" style="--c:${c.color}" title="${esc(capLevel(pc)+" · "+capLessons(c.id)+" bài liên quan")}"><div class="cap-top"><span class="cap-ico">${ic(locked?"lock":c.icon,16)}</span><b>${esc(x.cap)}</b><span class="cap-no">${capNo(ci)}</span></div>
    <span class="cap-st">${st}</span>${pc>0?`<i class="meter"><i style="width:${pc}%"></i></i>`:""}</div>`;}).join("")}</div></div></section>`;
 // 5. Journey roadmap theo chương
 const jHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><div><h2 class="h3">Bản đồ hành trình</h2><p class="hint">Đi từ dưới lên, mỗi điểm là một bài học.</p></div><div class="j-head-r"><div class="seg" role="group" aria-label="Kiểu bản đồ">${J_VERS.map(([k,l])=>`<button class="${(T.jmVer||1)===k?"on":""}" data-a="jmVer" data-v="${k}" aria-pressed="${(T.jmVer||1)===k}">Kiểu ${k} · ${l}</button>`).join("")}</div><button class="btn btn-accent" data-a="shareOpen" data-v="journey">${ic("share",15)} Chia sẻ Hành trình</button></div></div>${journeyHTML()}</section>`;
 // 6. danh sách bài học + bài tập
 const workHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><h2 class="h3">Bài học & bài tập</h2>
  <div class="seg dh-seg" role="group" aria-label="Lọc">${[['all','Tất cả'],['done','Đã hoàn thành'],['todo','Chưa hoàn thành']].map(([k,l])=>`<button class="${(T.dashFilter||'all')===k?'on':''}" data-a="dashFilter" data-v="${k}">${l}</button>`).join('')}</div></div>${workList()}</section>`;
 const ask=d.allDone&&!S.feedback?`<div class="callout info fb-ask"><span class="fb-ask-ico">${ic('star',20)}</span><div><b>Góp ý về khóa học</b><span>2 phút để Học viện làm tốt hơn.</span></div><button class="btn btn-primary btn-sm" data-a="goFeedback">Góp ý ${ic('arrow',15)}</button></div>`:'';
 const demo=`<div class="demo-box"><span class="t">Công cụ demo</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-line btn-sm" data-a="simulateHalf">Mô phỏng: học một nửa</button><button class="btn btn-line btn-sm" data-a="simulateAll" data-v="dash">Mô phỏng: học xong</button></div></div>`;
 return `<section class="wrap page dash">${head}${hero}${ask}${cardHTML}${capHTML}${jHTML}${chartsHTML(d)}${workHTML}${demo}</section>`;
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
const CH={lesson:'#22A06B',doing:'#A3DCC2',ex:'#22A06B',time:'#EF8426'};
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
// 3. Cột: thời gian học của từng bài; xanh = đã hoàn thành, xanh nhạt = đang học, xám = chưa học
function chartLessonTime(){
 const ls=lessons(),N=ls.length,ni=nextLesson(),W=1000,H=200,m={l:40,r:6,t:14,b:28},iw=W-m.l-m.r,ih=H-m.t-m.b;
 const mins=ls.map(ks=>lessonMin(ks)),max=Math.ceil(Math.max(...mins)/10)*10,band=iw/N,bw=Math.min(24,band-2);
 const Y=v=>m.t+ih-(v/max)*ih,every=N<=15?1:N<=30?3:5;
 const bars=ls.map((ks,i)=>{const done=lessonDone(i),cur=i===ni,at=lessonDoneAt(i),diff=at?Math.round((dayStart(at)-planDay(i))/DAY):null;
  const x=m.l+i*band+(band-bw)/2,y=Y(mins[i]),h=m.t+ih-y,c=done?CH.lesson:cur?CH.doing:'var(--line-2)';
  const t=tip(`Bài ${i+1} · ${lessonTitle(ks,i,ls)}`,`${mins[i]} phút`,done?`Hoàn thành ${at?fmtShort(at)+(diff===0?' · đúng hạn':diff<0?` · sớm ${-diff} ngày`:` · trễ ${diff} ngày`):''}`:cur?'Đang học':'Chưa học');
  return `<path d="M${x},${m.t+ih}V${y+4}a4,4 0 0 1 4,-4h${bw-8}a4,4 0 0 1 4,4V${m.t+ih}Z" fill="${c}"/><rect class="ch-hit" x="${m.l+i*band}" y="${m.t}" width="${band}" height="${ih}" fill="transparent" tabindex="0" data-tip="${t}"/>${i%every===0||i===N-1?`<text x="${x+bw/2}" y="${H-8}" text-anchor="middle" class="ch-ax">${i+1}</text>`:''}`;}).join('');
 return `<div class="ch-card wide"><h3 class="ch-t">Thời gian học từng bài</h3><p class="ch-s">Số phút mỗi bài.</p>
  <div class="ch-wrap"><svg viewBox="0 0 ${W} ${H}" class="ch-svg" role="img" aria-label="Thời gian học từng bài">
   ${[0,max/2,max].map(v=>`<line x1="${m.l}" x2="${m.l+iw}" y1="${Y(v)}" y2="${Y(v)}" class="ch-grid"/><text x="${m.l-8}" y="${Y(v)+4}" text-anchor="end" class="ch-ax">${v}′</text>`).join('')}${bars}
  </svg></div>${legend([[CH.lesson,'Đã hoàn thành'],[CH.doing,'Đang học'],['var(--line-2)','Chưa học']])}</div>`;
}
// 4. Thanh ngang: thời gian đã học trên tổng thời gian của từng chương
function chartChapterTime(){
 const ls=lessons(),rows=PHASES.map(ph=>{const ks=ls.flat().filter(k=>L[U(k).id].phase===ph.id);return {ph,all:lessonMin(ks),done:ks.filter(k=>S.done[k]).reduce((s,k)=>s+U(k).m,0)};}).filter(r=>r.all>0);
 const max=Math.max(...rows.map(r=>r.all));
 return `<div class="ch-card"><h3 class="ch-t">Thời gian học theo chương</h3><p class="ch-s">Đã học / tổng thời gian.</p>
  <div class="ch-bars">${rows.map((r,i)=>`<div class="ch-bar ch-hit" tabindex="0" data-tip="${tip(`Chương ${PHASES.indexOf(r.ph)+1} · ${r.ph.name}`,`Đã học ${hm(r.done)}`,`Tổng ${hm(r.all)}`)}"><span class="l">Chương ${PHASES.indexOf(r.ph)+1}<small>${esc(r.ph.name)}</small></span>
   <span class="t" style="width:${r.all/max*100}%"><i style="width:${r.all?r.done/r.all*100:0}%;background:${CH.time}"></i></span><b class="v">${r.done}<small>/${r.all}′</small></b></div>`).join('')}</div>
  ${legend([[CH.time,'Đã học'],['var(--bg-2)','Chưa học']])}</div>`;
}
function chartsHTML(d){
 return `<section class="card pad dh-sec"><div class="dh-sec-h"><div><h2 class="h3">Thống kê học tập</h2><p class="hint">Rê chuột để xem chi tiết.</p></div></div>
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
 try{await document.fonts.load('800 40px Roboto');await document.fonts.load('600 20px Roboto');}catch(e){}
 // ảnh Dashboard: khung chuẩn 1200×630; ảnh hành trình: cao theo số bài
 if(T.share==='cert'){cv.width=2000;cv.height=1414;await drawCert(cv);return;}
 if(T.share==='journey'){cv.width=JC.W;cv.height=JC.H;}else{cv.width=1200;cv.height=630;}
 const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);
 (T.share==='journey'?drawJourneyCard:drawDashCard)(g);
}
const F=(w,s)=>`${w} ${s}px Roboto, Arial, sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
// xuống dòng tối đa n dòng trong bề rộng max
function wrapText(g,t,max,n){const w=String(t).split(' '),out=[];let line='';for(const x of w){const tryL=line?line+' '+x:x;if(g.measureText(tryL).width<=max||!line)line=tryL;else{out.push(line);line=x;}}if(line)out.push(line);if(out.length>n){out.length=n;out[n-1]=fitText(g,out[n-1]+' …',max);}return out;}
function fitText(g,t,max){if(g.measureText(t).width<=max)return t;while(t.length>1&&g.measureText(t+'…').width>max)t=t.slice(0,-1);return t+'…';}
function brand(g,dark){g.font=F(800,22);g.fillStyle=dark?'#1747C9':'#fff';g.textBaseline='alphabetic';g.fillText('Siêu Tăng Trưởng',60,64);g.font=F(600,16);g.fillStyle=dark?'#5B6472':'rgba(255,255,255,.75)';g.fillText('AI for CEO · sieutangtruong.vn',60,90);}
// thẻ chia sẻ Dashboard: tên, % hoàn thành, thời gian học, 3 năng lực nổi bật, thành tích nổi bật, logo
function drawDashCard(g){
 const d=dashStats(),W=1200,H=630,name=S.profile.name||'Học viên';
 const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#F4F7FF');bg.addColorStop(1,'#F6F1FF');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(56,116,255,.08)';g.beginPath();g.arc(1110,40,190,0,7);g.fill();g.fillStyle='rgba(124,92,252,.07)';g.beginPath();g.arc(80,640,170,0,7);g.fill();
 brand(g,true);
 // tên + avatar
 g.fillStyle='#3874FF';g.beginPath();g.arc(92,170,32,0,7);g.fill();g.fillStyle='#fff';g.font=F(700,28);g.textAlign='center';g.fillText(name.trim().split(/\s+/).pop()[0]||'L',92,180);g.textAlign='left';
 g.fillStyle='#172033';g.font=F(700,34);g.fillText(fitText(g,name,560),140,166);g.fillStyle='#667085';g.font=F(500,18);g.fillText('Học viên AI for CEO',140,194);
 // vòng %
 const cx=190,cy=380,R=104;g.lineCap='round';g.lineWidth=22;g.strokeStyle='#E6EDFF';g.beginPath();g.arc(cx,cy,R,0,Math.PI*2);g.stroke();
 const rg=g.createLinearGradient(cx-R,cy-R,cx+R,cy+R);rg.addColorStop(0,'#3874FF');rg.addColorStop(1,'#7C5CFC');g.strokeStyle=rg;g.beginPath();g.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*d.pct/100);if(d.pct>0)g.stroke();
 g.textAlign='center';g.fillStyle='#172033';g.font=F(800,56);g.fillText(d.pct+'%',cx,cy+14);g.fillStyle='#667085';g.font=F(500,18);g.fillText('hoàn thành',cx,cy+44);g.textAlign='left';
 // 3 số liệu
 [[hmShort(d.minDone),'Thời gian học','#EF8426'],[`${d.lessonsDone}/${d.N}`,'Bài hoàn thành','#22A06B'],[`${d.caps}/${CAP_MAP.length}`,'Năng lực mở khóa','#18A999']].forEach(([v,l,c],i)=>{const y=300+i*72;g.fillStyle=c;rr(g,340,y-30,8,48,4);g.fill();g.fillStyle='#172033';g.font=F(800,32);g.fillText(v,362,y);g.fillStyle='#667085';g.font=F(500,16);g.fillText(l,362,y+22);});
 // khung phải: 3 năng lực nổi bật + thành tích
 g.fillStyle='#fff';rr(g,640,110,500,430,22);g.fill();g.strokeStyle='#E6EAF0';g.lineWidth=1.5;g.stroke();
 g.fillStyle='#172033';g.font=F(700,22);g.fillText('3 năng lực nổi bật',672,156);
 const top=CAP_MAP.map((c,i)=>({c,i,p:modPct(c.id)})).sort((a,b)=>b.p-a.p).slice(0,3);
 top.forEach(({c,i,p},k)=>{const y=190+k*74;g.fillStyle=c.color;rr(g,672,y,44,44,12);g.fill();g.fillStyle='#fff';g.font=F(700,16);g.textAlign='center';g.fillText(capNo(i),694,y+28);g.textAlign='left';
  g.fillStyle='#172033';g.font=F(700,18);g.fillText(fitText(g,L[c.id].cap,330),730,y+18);g.fillStyle='#EEF1F6';rr(g,730,y+30,340,8,4);g.fill();if(p){g.fillStyle=c.color;rr(g,730,y+30,340*p/100,8,4);g.fill();}g.fillStyle='#667085';g.font=F(500,14);g.textAlign='right';g.fillText(p+'%',1110,y+18);g.textAlign='left';});
 const ach=achievements().filter(a=>a.on).slice(-1)[0];
 g.fillStyle='#FFF6E0';rr(g,672,420,436,90,16);g.fill();g.fillStyle='#F5B942';g.beginPath();g.arc(712,465,24,0,7);g.fill();g.fillStyle='#fff';g.font=F(800,22);g.textAlign='center';g.fillText('★',712,473);g.textAlign='left';
 g.fillStyle='#8A5A00';g.font=F(700,14);g.fillText('THÀNH TÍCH NỔI BẬT',752,452);g.fillStyle='#172033';g.font=F(700,20);g.fillText(fitText(g,ach?`${ach.t} · ${ach.d}`:'Bắt đầu hành trình AI',340),752,482);
 g.fillStyle='#667085';g.font=F(500,16);g.fillText('sieutangtruong.vn · #AIforCEO',60,598);
}
// thẻ chia sẻ Hành trình: các chặng đã đi qua, chặng hiện tại, năng lực mở khóa, tổng bài học / bài tập
// thẻ chia sẻ Hành trình: khổ dọc 1080×1350 (4:5), vẽ đúng kiểu bản đồ đang chọn (T.jmVer), đi từ dưới lên
const JC={W:1080,H:1350,x:60,y:250,w:960,h:900};
function journeyLayout(){return {W:JC.W,H:JC.H};}
// điểm trên đường gấp khúc theo tỉ lệ độ dài t (0..1)
function jcAlong(P){
 const seg=P.slice(1).map((p,k)=>Math.hypot(p[0]-P[k][0],p[1]-P[k][1])),tot=seg.reduce((a,b)=>a+b,0);
 const at=t=>{let d=t*tot;for(let k=0;k<seg.length;k++){if(d<=seg[k]){const f=seg[k]?d/seg[k]:0;return [P[k][0]+(P[k+1][0]-P[k][0])*f,P[k][1]+(P[k+1][1]-P[k][1])*f];}d-=seg[k];}return P[P.length-1];};
 const upTo=t=>{const out=[P[0]];let d=t*tot;for(let k=0;k<seg.length;k++){if(d<=seg[k]){out.push(at(t));break;}out.push(P[k+1]);d-=seg[k];}return out;};
 return {at,upTo};
}
const jcLine=(g,P)=>{g.beginPath();P.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));};
// chấm bài học: đã học = màu chương + ✓, đang học = viền + số, chưa mở = trắng viền xám
function jcDot(g,x,y,r,j){
 if(j.st==='cur'){g.fillStyle=j.color+'33';g.beginPath();g.arc(x,y,r+10,0,7);g.fill();}
 g.fillStyle=j.st==='done'?j.color:'#fff';g.beginPath();g.arc(x,y,r,0,7);g.fill();
 g.lineWidth=j.st==='cur'?5:3;g.strokeStyle=j.st==='done'?'#fff':j.st==='cur'?j.color:'#C9D1DD';g.stroke();
 if(r>=13){g.textAlign='center';g.font=F(800,Math.round(r*.95));g.fillStyle=j.st==='done'?'#fff':j.st==='cur'?j.color:'#98A2B3';g.fillText(j.st==='done'?'✓':String(j.i+1),x,y+r*.34);g.textAlign='left';}
}
function jcPill(g,x,y,t,bg){g.font=F(700,18);const w=g.measureText(t).width+28;g.fillStyle=bg;rr(g,x-w/2,y-17,w,34,17);g.fill();g.fillStyle='#fff';g.textAlign='center';g.fillText(t,x,y+6);g.textAlign='left';}
// nhãn chương ở mép trái/phải vùng bản đồ, có đường gióng tới chấm
function jcChapter(g,j,c,x,y,left){
 const tx=left?JC.x+4:JC.x+JC.w-4,lx=left?JC.x+230:JC.x+JC.w-230;
 g.globalAlpha=c.state==='todo'?.55:1;
 g.setLineDash([4,6]);g.strokeStyle=j.color;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(lx,y);g.stroke();g.setLineDash([]);
 g.textAlign=left?'left':'right';g.fillStyle=j.color;g.font=F(800,18);g.fillText(`Chương ${j.pi+1} · ${c.dn}/${c.idx.length}`,tx,y-6);
 g.fillStyle='#172033';g.font=F(600,19);g.fillText(fitText(g,PHASES[j.pi].name,220),tx,y+18);g.textAlign='left';g.globalAlpha=1;
}
function jcGoal(g,x,y,done){
 const gr=g.createLinearGradient(x-30,y-30,x+30,y+30);gr.addColorStop(0,'#F5B942');gr.addColorStop(1,'#EF8426');
 g.fillStyle=gr;g.beginPath();g.arc(x,y,30,0,7);g.fill();g.fillStyle='#fff';g.font=F(800,28);g.textAlign='center';g.fillText('★',x,y+10);
 g.fillStyle='#172033';g.font=F(800,20);g.fillText('Về đích',x,y+56);g.fillStyle='#667085';g.font=F(500,16);g.fillText(done?'Đã hoàn thành khóa học':'Nhận chứng nhận',x,y+78);g.textAlign='left';
}
function drawJourneyCard(g){
 const d=dashStats(),{W,H}=JC,J=jData(),name=S.profile.name||'Học viên',v=T.jmVer||1;
 const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#F4F7FF');bg.addColorStop(1,'#FFF6EE');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(124,92,252,.06)';g.beginPath();g.arc(W-60,40,220,0,7);g.fill();
 brand(g,true);
 g.fillStyle='#172033';g.font=F(800,40);g.fillText('Hành trình AI for CEO',60,160);
 g.fillStyle='#667085';g.font=F(500,22);g.fillText(fitText(g,`${name} · ${d.lessonsDone}/${d.N} bài đã đi qua`,940),60,198);
 g.lineCap='round';g.lineJoin='round';
 (v===2?jcMountain:v===3?jcStairs:jcRoad)(g,J,d);
 // số liệu cuối thẻ
 const nt=Object.keys(TASKS).length;[[`${d.lessonsDone}/${d.N}`,'bài học'],[`${d.subs}/${nt}`,'bài tập'],[`${d.caps}/${CAP_MAP.length}`,'năng lực']].forEach(([val,l],i)=>{const x=60+i*318;g.fillStyle='#fff';rr(g,x,1196,300,76,16);g.fill();g.strokeStyle='#E6EAF0';g.lineWidth=1.5;g.stroke();g.fillStyle='#172033';g.font=F(800,30);g.fillText(val,x+22,1244);const vw=g.measureText(val).width;g.fillStyle='#667085';g.font=F(500,18);g.fillText(l,x+22+vw+10,1244);});
 g.fillStyle='#667085';g.font=F(500,16);g.textAlign='center';g.fillText('sieutangtruong.vn · Học viện Siêu Tăng Trưởng',W/2,1316);g.textAlign='left';
}
// Kiểu 1: con đường uốn lượn (hình sin 3 vòng), đoạn đã đi tô đậm
function jcRoad(g,J,d){
 const N=J.length,cx=JC.x+JC.w/2,top=JC.y+110,bot=JC.y+JC.h-40,A=170,P=[];
 for(let k=0;k<=240;k++){const u=k/240;P.push([cx+A*Math.sin(u*Math.PI*6),bot-u*(bot-top)]);}
 const Pa=jcAlong(P),ci=J.findIndex(j=>j.st==='cur'),pos=J.map(j=>Pa.at((j.i+1)/(N+1)));
 g.strokeStyle='#DCE2EC';g.lineWidth=46;jcLine(g,P);g.stroke();
 g.strokeStyle='#2B3445';jcLine(g,Pa.upTo(ci<0?1:(ci+1)/(N+1)));g.stroke();
 g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=2.5;g.setLineDash([12,12]);jcLine(g,P);g.stroke();g.setLineDash([]);
 g.strokeStyle='#DCE2EC';g.lineWidth=46;g.beginPath();g.moveTo(cx,top);g.lineTo(cx,top-40);g.stroke();
 const gap=(bot-top)/(N+1),r=Math.max(8,Math.min(20,gap*.42)),ch=chapters();
 PHASES.forEach((_,p)=>{const k=J.findIndex(j=>j.pi===p);if(k<0)return;const [x,y]=pos[k];jcChapter(g,J[k],ch.find(c=>c.pi===p),x,y,x>=cx);});
 J.forEach((j,k)=>jcDot(g,pos[k][0],pos[k][1],r,j));
 if(ci>=0){const [x,y]=pos[ci];jcPill(g,x,y-r-30,'Đang ở đây · Bài '+(ci+1),'#EF8426');}
 jcGoal(g,cx,JC.y+20,d.allDone);
 g.fillStyle='#fff';rr(g,cx-70,bot+14,140,36,10);g.fill();g.strokeStyle='#E6EAF0';g.lineWidth=1.5;g.stroke();g.fillStyle='#172033';g.font=F(700,17);g.textAlign='center';g.fillText('Xuất phát',cx,bot+38);g.textAlign='left';
}
// Kiểu 2: leo núi: đường mòn zigzag lên đỉnh (cùng hình với trang Dashboard)
function jcMountain(g,J,d){
 const N=J.length,sx=JC.w/800,sy=(JC.h-30)/520,T2=([x,y])=>[JC.x+x*sx,JC.y+20+y*sy];
 const P=[[250,492],[560,432],[270,362],[522,292],[322,222],[470,162],[382,104],[400,62]].map(T2);
 const poly=pts=>{g.beginPath();pts.map(T2).forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();};
 g.fillStyle='#EFEBFF';poly([[0,500],[170,250],[300,380],[560,150],[800,470],[800,500]]);g.fill();
 const mg=g.createLinearGradient(0,JC.y,0,JC.y+JC.h);mg.addColorStop(0,'#D6E2FF');mg.addColorStop(1,'#DDF3EF');g.fillStyle=mg;poly([[30,500],[400,40],[770,500]]);g.fill();
 g.fillStyle='rgba(255,255,255,.92)';poly([[400,40],[452,105],[428,96],[408,116],[384,98],[352,106]]);g.fill();
 const Pa=jcAlong(P),ci=J.findIndex(j=>j.st==='cur'),pos=J.map(j=>Pa.at((j.i+1)/(N+1)));
 g.strokeStyle='rgba(23,32,51,.28)';g.lineWidth=4;g.setLineDash([9,10]);jcLine(g,P);g.stroke();g.setLineDash([]);
 g.strokeStyle='#EF8426';g.lineWidth=7;jcLine(g,Pa.upTo(ci<0?1:(ci+1)/(N+1)));g.stroke();
 const [fx,fy]=T2([400,62]);g.strokeStyle='#172033';g.lineWidth=3.5;g.beginPath();g.moveTo(fx,fy);g.lineTo(fx,fy-62);g.stroke();g.fillStyle='#EF8426';g.beginPath();g.moveTo(fx,fy-62);g.lineTo(fx+40,fy-48);g.lineTo(fx,fy-34);g.fill();
 g.fillStyle='#EF8426';g.font=F(800,20);g.fillText('Về đích',fx+52,fy-48);g.fillStyle='#172033';g.font=F(600,17);g.fillText(d.allDone?'Đã hoàn thành khóa học':'Nhận chứng nhận',fx+52,fy-26);
 const ch=chapters(),r=N>30?9:13;
 PHASES.forEach((_,p)=>{const k=J.findIndex(j=>j.pi===p);if(k<0)return;const [x,y]=pos[k];jcChapter(g,J[k],ch.find(c=>c.pi===p),x,y,x<JC.x+JC.w/2);});
 J.forEach((j,k)=>jcDot(g,pos[k][0],pos[k][1],j.st==='cur'?Math.max(r,16):r,j));
 if(ci>=0){const [x,y]=pos[ci];jcPill(g,x,y+44,'Bạn đang ở đây','#EF8426');}
 const [sx0,sy0]=P[0];g.fillStyle='#172033';g.font=F(700,18);g.textAlign='center';g.fillText('Xuất phát',sx0,sy0+36);g.textAlign='left';
}
// Kiểu 3: bậc thang: mỗi chương một bậc, chương sau cao hơn và lệch phải; bài học là ô số
function jcStairs(g,J,d){
 const ch=chapters(),n=ch.length,step=50,bw=JC.w-(n-1)*step,S0=34,GAP=7,perRow=Math.floor((bw-36+GAP)/(S0+GAP));
 const hs=ch.map(c=>78+Math.ceil(c.idx.length/perRow)*(S0+GAP)+14),totH=hs.reduce((a,b)=>a+b,0)+(n-1)*14;
 jcGoal(g,JC.x+JC.w-60,JC.y+30,d.allDone);
 let y=JC.y+JC.h-30;
 g.fillStyle='#fff';rr(g,JC.x,y-4,170,38,10);g.fill();g.strokeStyle='#E6EAF0';g.lineWidth=1.5;g.stroke();g.fillStyle='#667085';g.font=F(700,17);g.fillText('Xuất phát · Ngày 1',JC.x+16,y+21);
 y-=14;const avail=JC.h-170,sc=Math.min(1,avail/totH);
 ch.forEach((c,k)=>{const h=hs[k]*sc,x=JC.x+k*step,col=PHASE_COLOR[c.ph.id],todo=c.state==='todo';y-=h;
  g.fillStyle=todo?'#fff':col+'14';rr(g,x,y,bw,h,16);g.fill();g.lineWidth=c.state==='cur'?3:1.5;g.strokeStyle=todo?'#E6EAF0':col+(c.state==='cur'?'':'55');g.stroke();
  g.fillStyle=todo?'#D5DBE5':col;rr(g,x,y+h-7,bw,7,3);g.fill();
  g.fillStyle=todo?'#EEF1F6':col;rr(g,x+18,y+16,40,40,11);g.fill();g.fillStyle=todo?'#98A2B3':'#fff';g.font=F(800,20);g.textAlign='center';g.fillText(c.state==='done'?'✓':String(c.pi+1),x+38,y+43);g.textAlign='left';
  g.fillStyle=todo?'#98A2B3':col;g.font=F(800,16);g.fillText(`Chương ${c.pi+1}${c.state==='cur'?' · Đang ở đây':''}`,x+72,y+32);
  g.fillStyle='#172033';g.font=F(700,20);g.fillText(fitText(g,c.ph.name,bw-200),x+72,y+56);
  g.fillStyle='#667085';g.font=F(600,16);g.textAlign='right';g.fillText(`${c.dn}/${c.idx.length} bài`,x+bw-18,y+34);g.textAlign='left';
  const s=S0*Math.min(1,sc+.15);c.idx.forEach((i,m)=>{const j=J[i],cx=x+18+(m%perRow)*(s+GAP),cy=y+70+Math.floor(m/perRow)*(s+GAP);
   g.fillStyle=j.st==='done'?col:'#fff';rr(g,cx,cy,s,s,8);g.fill();g.lineWidth=j.st==='cur'?3:1.5;g.strokeStyle=j.st==='locked'?'#D5DBE5':col;g.stroke();
   g.fillStyle=j.st==='done'?'#fff':j.st==='cur'?col:'#98A2B3';g.font=F(800,Math.round(s*.42));g.textAlign='center';g.fillText(j.st==='done'?'✓':String(i+1),cx+s/2,cy+s*.64);g.textAlign='left';});
  y-=14;});
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
 try{await document.fonts.load('800 60px Roboto');await document.fonts.load('600 30px Roboto');await document.fonts.load('500 30px Roboto');}catch(e){}
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
   jData(): mỗi bài học = {i, title, st: done|cur|locked, pi (chương), color}
   1 Con đường uốn lượn (jRoad) · 2 Leo núi (jMountain) · 3 Bậc thang theo chương (jStairs) */
const J_VERS=[[1,'Con đường'],[2,'Leo núi'],[3,'Bậc thang']];
const J_ST={done:'Hoàn thành',cur:'Đang học',locked:'Chưa mở'};
function jData(){
 const ls=lessons(),ni=nextLesson();
 return ls.map((ks,i)=>{const ph=L[U(ks[0]).id].phase,pi=PHASES.findIndex(p=>p.id===ph);
  return {i,title:lessonTitle(ks,i,ls),st:lessonDone(i)?'done':i===ni?'cur':'locked',pi,color:PHASE_COLOR[ph]};});
}
function journeyHTML(){
 const v=T.jmVer||1,J=jData();
 return v===2?jMountain(J):v===3?jStairs(J):jRoad(J);
}
const jTip=j=>`Bài ${j.i+1} · ${j.title} · ${J_ST[j.st]}`;
// đường cong mượt qua các điểm (tiếp tuyến đứng ở mỗi điểm)
const jCurve=pts=>pts.map((p,k)=>k?`C${pts[k-1][0]},${(pts[k-1][1]+p[1])/2} ${p[0]},${(pts[k-1][1]+p[1])/2} ${p[0]},${p[1]}`:`M${p[0]},${p[1]}`).join(' ');

/* Kiểu 1: con đường uốn lượn giữa trang, thẻ bài học xen kẽ trái/phải, nhãn chương ở phía đối diện */
function jRoad(J){
 const N=J.length,RH=84,TOP=96,BOT=76,H=TOP+N*RH+BOT,ci=J.findIndex(j=>j.st==='cur'),ch=chapters();
 const y=i=>TOP+(N-1-i)*RH+RH/2,x=i=>i%2?72:28;
 const pts=[[50,H-14],...J.map(j=>[x(j.i),y(j.i)]),[50,30]];
 const road=jCurve(pts),walked=jCurve(pts.slice(0,ci<0?pts.length:ci+2));
 const firstOf=new Set(PHASES.map((_,p)=>J.findIndex(j=>j.pi===p)).filter(k=>k>=0));
 const cards=J.map(j=>{const side=j.i%2?'r':'l',row=2+(N-1-j.i);
  const card=`<button class="jr-card ${side} ${j.st}" style="grid-row:${row};--c:${j.color}" data-a="openLesson" data-v="${j.i}" title="${esc(jTip(j))}"><small>Bài ${j.i+1} · Chương ${j.pi+1}</small><b>${esc(j.title)}</b><span class="jr-st">${j.st==='done'?ic('check',12):j.st==='locked'?ic('lock',11):''} ${J_ST[j.st]}</span></button>`;
  const c=ch.find(c=>c.pi===j.pi);
  const tag=firstOf.has(j.i)?`<div class="jr-ch ${side==='l'?'r':'l'} ${c.state}" style="grid-row:${row};--c:${j.color}"><span>${ic(c.state==='done'?'check':PHASE_ICON[PHASES[j.pi].id],15)}</span><div><small>Chương ${j.pi+1}</small><b>${esc(PHASES[j.pi].name)}</b><em>${c.dn}/${c.idx.length} bài</em></div></div>`:'';
  return card+tag;}).join('');
 const nodes=J.map(j=>`<span class="jr-node ${j.st}" style="left:${x(j.i)}%;top:${y(j.i)}px;--c:${j.color}" aria-hidden="true">${j.st==='done'?ic('check',14):j.i+1}${j.st==='cur'?'<em>Đang ở đây</em>':''}</span>`).join('');
 const done=ci<0;
 return `<div class="jr" style="grid-template-rows:${TOP}px repeat(${N},${RH}px) ${BOT}px">
  <div class="jr-goal ${done?'done':''}"><span>${ic('award',24)}</span><b>Về đích</b><small>${done?'Đã hoàn thành khóa học':'Nhận chứng nhận'}</small></div>
  <div class="jr-roadcol" style="grid-row:1/-1"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" style="height:${H}px" aria-hidden="true"><path class="jr-road" d="${road}"/><path class="jr-road walked" d="${walked}"/><path class="jr-lane" d="${road}"/></svg>${nodes}</div>
  ${cards}
  <div class="jr-start" style="grid-row:${N+2}"><b>Xuất phát</b><small>Ngày 1</small></div></div>`;
}

/* Kiểu 2: leo núi: đường mòn zigzag từ chân núi lên đỉnh, mỗi chấm là một bài, cờ chương ở mỗi chặng */
function jMountain(J){
 const N=J.length,P=[[250,492],[560,432],[270,362],[522,292],[322,222],[470,162],[382,104],[400,62]];
 const seg=P.slice(1).map((p,k)=>Math.hypot(p[0]-P[k][0],p[1]-P[k][1])),tot=seg.reduce((a,b)=>a+b,0);
 const at=t=>{let d=t*tot;for(let k=0;k<seg.length;k++){if(d<=seg[k]){const f=d/seg[k];return [P[k][0]+(P[k+1][0]-P[k][0])*f,P[k][1]+(P[k+1][1]-P[k][1])*f];}d-=seg[k];}return P[P.length-1];};
 const pos=J.map(j=>at((j.i+1)/(N+1))),ci=J.findIndex(j=>j.st==='cur'),tReach=ci<0?1:(ci+1)/(N+1);
 const walked=[P[0]];{let d=tReach*tot;for(let k=0;k<seg.length;k++){if(d<=seg[k]){walked.push(at(tReach));break;}walked.push(P[k+1]);d-=seg[k];}}
 const ln=a=>a.map((p,k)=>(k?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
 const ch=chapters(),firstOf=PHASES.map((_,p)=>J.findIndex(j=>j.pi===p)).filter(k=>k>=0);
 const flags=firstOf.map(k=>{const [px,py]=pos[k],j=J[k],left=px<400,c=ch.find(c=>c.pi===j.pi),tx=left?14:786,lx=left?178:622;
  return `<g class="jm-flag ${c.state}"><line x1="${px}" y1="${py}" x2="${lx}" y2="${py}" stroke="${j.color}" stroke-width="1.5" stroke-dasharray="3 4"/><text x="${tx}" y="${py-4}" text-anchor="${left?"start":"end"}" class="jm-t"><tspan class="jm-ch" fill="${j.color}">Chương ${j.pi+1}</tspan><tspan x="${tx}" dy="18">${esc(PHASES[j.pi].name)}</tspan></text></g>`;}).join("");
 const dots=J.map((j,k)=>{const [px,py]=pos[k],r=j.st==='cur'?13:N>30?6:8;
  return `<g class="jm-dot ${j.st}" data-a="openLesson" data-v="${j.i}" tabindex="0" role="button" aria-label="${esc(jTip(j))}"><title>${esc(jTip(j))}</title><circle cx="${px}" cy="${py}" r="${r}" fill="${j.st==='done'?j.color:'var(--surface)'}" stroke="${j.st==='locked'?'var(--line-2)':j.color}" stroke-width="${j.st==='cur'?4:2}"/>${j.st==='cur'?`<text x="${px}" y="${py+4}" text-anchor="middle" class="jm-n" fill="${j.color}">${j.i+1}</text>`:''}</g>`;}).join('');
 const cur=ci>=0?(()=>{const [px,py]=pos[ci];return `<g class="jm-here"><rect x="${px-70}" y="${py+20}" width="140" height="30" rx="15"/><text x="${px}" y="${py+40}" text-anchor="middle">Bạn đang ở đây</text></g>`;})():'';
 const done=ci<0;
 const side=`<ol class="jm-list">${[...ch].reverse().map(c=>`<li class="${c.state}" style="--c:${PHASE_COLOR[c.ph.id]}"><span class="jm-ico">${ic(c.state==='done'?'check':PHASE_ICON[c.ph.id],15)}</span><div><small>Chương ${c.pi+1}</small><b>${esc(c.ph.name)}</b><i class="meter"><i style="width:${Math.round(c.dn/c.idx.length*100)}%"></i></i></div><em>${c.dn}/${c.idx.length}</em></li>`).join('')}</ol>`;
 const now=ci>=0?`<div class="jm-now"><small>Đang học</small><b>Bài ${ci+1} · ${esc(J[ci].title)}</b><button class="btn btn-primary btn-sm" data-a="openLesson" data-v="${ci}">Học tiếp ${ic('arrow',14)}</button></div>`:`<div class="jm-now done"><small>Hoàn thành</small><b>Anh/chị đã lên đỉnh</b></div>`;
 return `<div class="jm"><figure class="jm-fig"><svg viewBox="0 0 800 520" role="img" aria-label="Bản đồ leo núi: ${J.filter(j=>j.st==='done').length}/${N} bài đã hoàn thành">
  <defs><linearGradient id="jmG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="jm-s1"/><stop offset="1" class="jm-s2"/></linearGradient></defs>
  <path class="jm-back" d="M0,500 L170,250 L300,380 L560,150 L800,470 L800,500Z"/>
  <path d="M30,500 L400,40 L770,500Z" fill="url(#jmG)"/><path class="jm-snow" d="M400,40 L452,105 L428,96 L408,116 L384,98 L352,106Z"/>
  <path class="jm-trail" d="${ln(P)}"/><path class="jm-trail walked" d="${ln(walked)}"/>
  <g class="jm-top ${done?'done':''}"><line x1="400" y1="58" x2="400" y2="14" stroke="var(--ink)" stroke-width="2.5"/><path d="M400,14 l26,9 l-26,9z" fill="var(--orange)"/><text x="436" y="30" class="jm-t"><tspan class="jm-ch" fill="var(--orange)">Về đích</tspan><tspan x="436" dy="18">Nhận chứng nhận</tspan></text></g>
  ${flags}${dots}${cur}
  <text x="250" y="514" text-anchor="middle" class="jm-t">Xuất phát</text></svg></figure>
  <div class="jm-side">${now}${side}</div></div>`;
}

/* Kiểu 3: bậc thang: mỗi chương là một bậc, chương sau cao hơn và lệch phải; bài học là các ô số trong bậc */
function jStairs(J){
 const ch=chapters(),n=ch.length,done=nextLesson()<0;
 const steps=[...ch].reverse().map(c=>{const k=ch.indexOf(c),col=PHASE_COLOR[c.ph.id],cur=J.find(j=>j.pi===c.pi&&j.st==='cur');
  return `<div class="js-step ${c.state}" style="--c:${col};--k:${k};--n:${n}">
   <div class="js-h"><span class="js-ico">${ic(c.state==='done'?'check':PHASE_ICON[c.ph.id],18)}</span><div><small>Chương ${c.pi+1}${c.state==='cur'?' · <em>Đang ở đây</em>':''}</small><b>${esc(c.ph.name)}</b></div><span class="js-n">${c.dn}/${c.idx.length} bài</span></div>
   <div class="js-ls">${c.idx.map(i=>{const j=J[i];return `<button class="js-l ${j.st}" data-a="openLesson" data-v="${i}" title="${esc(jTip(j))}" aria-label="${esc(jTip(j))}">${j.st==='done'?ic('check',13):i+1}</button>`;}).join('')}</div>
   ${cur?`<div class="js-cur"><span>Bài ${cur.i+1} · ${esc(cur.title)}</span><button class="btn btn-primary btn-sm" data-a="openLesson" data-v="${cur.i}">Học tiếp ${ic('arrow',14)}</button></div>`:''}</div>`;}).join('');
 return `<div class="js"><div class="js-goal ${done?'done':''}"><span>${ic('award',22)}</span><div><b>Về đích</b><small>${done?'Đã hoàn thành khóa học':'Nhận chứng nhận'}</small></div></div>${steps}<div class="js-start">${ic('flag',14)} Xuất phát · Ngày 1</div></div>`;
}
