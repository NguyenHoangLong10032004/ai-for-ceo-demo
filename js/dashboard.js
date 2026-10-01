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

/* ---------- màn hình Dashboard ---------- */
function dashboard(){
 const P=S.plan,d=dashStats(),ni=nextLesson(),C=2*Math.PI*52,p=d.pct;
 const head=`<div class="lsn-top"><button class="btn btn-line btn-sm" data-a="outputsBack">${ic('back',15)} Danh sách bài học</button>
  <div class="crumbs"><button data-a="go" data-to="mycourses">Khóa học của tôi</button><span>/</span><button data-a="outputsBack">AI for CEO</button><span>/</span><span>Dashboard</span></div></div>`;
 // 1. tổng quan
 const pace=d.allDone?`<span class="dh-tag">${ic('award',14)} Hoàn thành sau ${d.took||d.N} ngày</span>`:d.ahead>0?`<span class="dh-tag">${ic('zap',14)} Nhanh hơn kế hoạch ${d.ahead} bài</span>`:d.ahead===0?`<span class="dh-tag">${ic('check',14)} Đúng tiến độ</span>`:`<span class="dh-tag warn">${ic('clock',14)} Chậm ${-d.ahead} bài so với kế hoạch</span>`;
 const hero=`<section class="dh-hero">
  <div class="dh-ring"><svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="52" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="12"/><circle cx="66" cy="66" r="52" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p/100)}" transform="rotate(-90 66 66)"/></svg><div><b class="tnum">${p}%</b><span>hành trình</span></div></div>
  <div class="dh-intro"><span class="dh-eyebrow">Dashboard · AI for CEO</span><h1>Hành trình AI của ${esc(S.profile.name||'anh/chị')}</h1><p>${cheer(p)}</p>
   <div class="dh-tags">${pace}<span class="dh-tag">${ic('cal',14)} Bắt đầu ${fmtDate(d.start)}</span><span class="dh-tag">${ic('flag',14)} ${d.allDone?'Đã về đích':'Dự kiến về đích '+fmtDate(d.end)}</span></div>
   <div class="dh-cta">${ni>=0?`<button class="btn dh-btn-white" data-a="openLesson" data-v="${ni}">${ic('play',14)} Học tiếp Bài ${ni+1}</button>`:`<button class="btn dh-btn-white" data-a="go" data-to="complete">${ic('award',16)} Nhận chứng nhận</button>`}<button class="btn dh-btn-fb" data-a="shareOpen" data-v="dash">${ic('fb',16)} Chia sẻ Dashboard</button></div></div>
 </section>`;
 const kpis=[['book','Bài học đã hoàn thành',`${d.lessonsDone}/${d.N}`,d.lessonsDone/d.N,'#1747C9'],['file','Bài tập đã nộp',`${d.subs}/${Object.keys(TASKS).length}`,d.subs/Object.keys(TASKS).length,'#DB2777'],['spark','Năng lực AI đã chinh phục',`${d.caps}/${CAP_MAP.length}`,d.caps/CAP_MAP.length,'#7C3AED'],['clock','Thời gian đã học',hm(d.minDone),d.minAll?d.minDone/d.minAll:0,'#EA580C']];
 const kpiHTML=`<div class="dh-kpis">${kpis.map(([i,l,v,f,c])=>`<div class="dh-kpi" style="--c:${c}"><span class="ico">${ic(i,18)}</span><b class="tnum">${v}</b><span>${l}</span><i class="meter"><i style="width:${Math.round(f*100)}%"></i></i>${i==='clock'?`<small>trên tổng ${hm(d.minAll)}</small>`:''}</div>`).join('')}</div>`;
 // 2. bản đồ 10 năng lực
 const capHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><div><span class="eyebrow">Bản đồ năng lực</span><h2 class="h3">10 năng lực AI anh/chị đang chinh phục</h2><p class="hint">Mỗi năng lực là một module. Học xong 4 video và nộp bài tập là chinh phục được năng lực đó.</p></div><span class="dh-big tnum">${d.caps}<small>/${CAP_MAP.length}</small></span></div>
  <div class="cap-grid">${CAP_MAP.map(c=>{const x=L[c.id],s=capState(c.id),pc=modPct(c.id),at=moduleDoneAt(c.id);
   return `<div class="cap ${s}" style="--c:${c.color}"><div class="cap-top"><span class="cap-ico">${ic(s==='locked'?'lock':c.icon,20)}</span><span class="cap-no">${modNo(x)}</span></div><b>${esc(x.cap)}</b>
    <span class="cap-st">${s==='done'?`${ic('check',13)} Đã chinh phục${at?' · '+fmtShort(at):''}`:s==='doing'?`Đang học · ${pc}%`:s==='open'?'Sẵn sàng học':'Chưa mở'}</span><i class="meter"><i style="width:${pc}%"></i></i></div>`;}).join('')}</div></section>`;
 // 3. bài học & bài tập
 const f=T.dashFilter||'all';
 const rows=lessons().map((ks,i)=>{const done=lessonDone(i),at=lessonDoneAt(i),cur=i===ni,diff=at?Math.round((dayStart(at)-planDay(i))/DAY):null;
  if(f==='done'&&!done||f==='todo'&&done)return '';
  const ph=L[U(ks[0]).id].phase;
  return `<tr class="${done?'ok':cur?'cur':''}"><td><span class="dh-num" style="--c:${PHASE_COLOR[ph]}">${i+1}</span></td><td><b>${esc(lessonTitle(ks,i,lessons()))}</b><span class="hint">Kế hoạch: ${fmtShort(planDay(i))} · ${lessonMin(ks)} phút</span></td>
   <td>${done?`<span class="pill ok">${ic('check',12)} Hoàn thành</span><span class="hint">${at?`${fmtShort(at)} · ${diff===0?'đúng hạn':diff<0?`sớm ${-diff} ngày`:`trễ ${diff} ngày`}`:''}</span>`:cur?`<span class="pill blue">Đang học</span><span class="hint">${ks.filter(k=>S.done[k]).length}/${ks.length} phần</span>`:`<span class="pill lock">${ic('lock',11)} Chưa học</span>`}</td></tr>`;}).join('');
 const subRows=Object.keys(TASKS).map(id=>{const s=S.subs[id],t=TASKS[id];if(f==='done'&&!s||f==='todo'&&s)return '';
  return `<tr class="${s?'ok':''}"><td><span class="dh-num" style="--c:${PHASE_COLOR[L[id].phase]}">${modNo(L[id])}</span></td><td><b>${esc(t.title)}</b><span class="hint">Module ${modNo(L[id])} · ${esc(L[id].cap)}</span></td>
   <td>${s?`<span class="pill ok">${ic('check',12)} Đã nộp</span><span class="hint">${esc(String(s.at).split(' ').slice(-1)[0]||s.at)}${s.v>1?` · lần ${s.v}`:''}</span>`:`<span class="pill wait">Chưa nộp</span>`}</td></tr>`;}).join('');
 const filters=[['all','Tất cả'],['done','Đã hoàn thành'],['todo','Chưa hoàn thành']];
 const empty=`<tr><td colspan="3" class="hint" style="text-align:center;padding:18px">Không có mục nào.</td></tr>`;
 const workHTML=`<section class="card pad dh-sec"><div class="dh-sec-h"><div><span class="eyebrow">Tiến độ chi tiết</span><h2 class="h3">Bài học & bài tập</h2><p class="hint">Thời gian hoàn thành từng bài so với kế hoạch học mỗi ngày một bài.</p></div>
   <div class="seg dh-seg" role="group" aria-label="Lọc">${filters.map(([k,l])=>`<button class="${f===k?'on':''}" data-a="dashFilter" data-v="${k}">${l}</button>`).join('')}</div></div>
  <div class="dh-two"><div><h3 class="dh-h4">${ic('book',16)} Bài học <span class="tnum">${d.lessonsDone}/${d.N}</span></h3><div class="dh-tbl"><table>${rows||empty}</table></div></div>
   <div><h3 class="dh-h4">${ic('file',16)} Bài tập <span class="tnum">${d.subs}/${Object.keys(TASKS).length}</span></h3><div class="dh-tbl"><table>${subRows||empty}</table></div></div></div></section>`;
 // 4. bản đồ hành trình
 const journeyHTML=`<section class="card pad dh-sec dh-journey"><div class="dh-sec-h"><div><span class="eyebrow">Bản đồ hành trình</span><h2 class="h3">Chặng đường anh/chị đã đi qua</h2><p class="hint">Mỗi điểm là một bài học. Đi qua 5 chương, từ hiểu AI đến chọn 3 use case cho doanh nghiệp.</p></div>
   <button class="btn dh-btn-fb" data-a="shareOpen" data-v="journey">${ic('fb',16)} Chia sẻ hành trình</button></div>
  ${journeyMap()}
  <div class="jm-legend">${PHASES.map((ph,i)=>`<span><i style="background:${PHASE_COLOR[ph.id]}"></i>Chương ${i+1} · ${esc(ph.name)}</span>`).join('')}</div></section>`;
 const demo=`<div class="demo-box"><span class="t">Công cụ demo</span><span class="hint">Xem Dashboard ở các mức tiến độ khác nhau.</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-line btn-sm" data-a="simulateHalf">Mô phỏng: đã học một nửa</button><button class="btn btn-line btn-sm" data-a="simulateAll" data-v="dash">Mô phỏng: học xong toàn bộ</button></div></div>`;
 return `<section class="wrap page dash">${head}${hero}${kpiHTML}${capHTML}${journeyHTML}${workHTML}${demo}</section>`;
}

/* ---------- bản đồ hành trình (đường uốn lượn qua từng bài) ---------- */
function journeyMap(){
 const ls=lessons(),N=ls.length,ni=nextLesson(),w=Math.min(window.innerWidth||1200,1180);
 const cols=w<560?2:w<820?3:w<1040?4:5,rowH=172,rows=Math.ceil((N+1)/cols),H=rows*rowH;
 // vị trí từng điểm (N bài + 1 điểm đích), đi theo hình rắn: hàng chẵn trái→phải, hàng lẻ phải→trái
 const pos=[...Array(N+1)].map((_,i)=>{const r=Math.floor(i/cols),c=i%cols,cc=r%2?cols-1-c:c;return {x:(cc+.5)/cols*1000,y:r*rowH+46,r};});
 const seg=(a,b)=>a.r===b.r?`L${b.x},${b.y}`:(()=>{const k=(a.x>500?1:-1)*(1000/cols)*.55;return `C${a.x+k},${a.y} ${b.x+k},${b.y} ${b.x},${b.y}`;})();
 const path=i=>pos.slice(0,i+1).map((p,j)=>j?seg(pos[j-1],p):`M${p.x},${p.y}`).join(' ');
 const reach=ni<0?N:ni; // đã đi tới điểm nào
 const phaseOf=i=>i<N?L[U(ls[i][0]).id].phase:'P5';
 const firstOfPhase=i=>i<N&&(i===0||phaseOf(i-1)!==phaseOf(i));
 const nodes=pos.map((p,i)=>{
  const style=`left:${p.x/10}%;top:${p.y}px;--c:${PHASE_COLOR[phaseOf(i)]};width:${100/cols}%`;
  if(i===N)return `<div class="jm-node goal ${ni<0?'done':''}" style="${style}"><span class="dot">${ic('award',22)}</span><b>Về đích</b><small>Chọn 3 use case cho doanh nghiệp</small></div>`;
  const ks=ls[i],done=lessonDone(i),cur=i===ni,mods=[...new Set(ks.map(k=>U(k).id))].map(id=>L[id]).filter(x=>x.type==='module');
  const chap=firstOfPhase(i)?`<span class="jm-chap">Chương ${PHASES.findIndex(x=>x.id===phaseOf(i))+1}</span>`:'';
  return `<div class="jm-node ${done?'done':cur?'cur':'todo'}" style="${style}">${chap}${cur?'<span class="jm-here">Bạn đang ở đây</span>':''}<span class="dot">${done?ic('check',18):i+1}</span><b>Bài ${i+1}</b><small>${esc(mods.length?mods.map(x=>x.cap).join(' + '):lessonTitle(ks))}</small></div>`;
 }).join('');
 return `<div class="jm" style="height:${H}px"><svg viewBox="0 0 1000 ${H}" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="jm-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1747C9"/><stop offset=".5" stop-color="#7C3AED"/><stop offset="1" stop-color="#DB2777"/></linearGradient></defs>
  <path d="${path(N)}" fill="none" stroke="var(--line-2)" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
  ${reach>0?`<path d="${path(reach)}" fill="none" stroke="url(#jm-g)" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`:''}
 </svg>${nodes}</div>`;
}

/* ---------- chia sẻ lên Facebook ---------- */
// Facebook không cho website tự đính ảnh vào bài đăng → vẽ sẵn ảnh để tải/chia sẻ, kèm mở hộp chia sẻ link
function shareCaption(kind){
 const d=dashStats();
 return kind==='journey'
  ?`Hành trình AI for CEO của tôi: đã đi qua ${d.lessonsDone}/${d.N} bài, chinh phục ${d.caps}/${CAP_MAP.length} năng lực AI cùng Học viện Siêu Tăng Trưởng. #AIforCEO #SieuTangTruong`
  :`Tôi đã hoàn thành ${d.pct}% khóa AI for CEO: ${d.lessonsDone}/${d.N} bài học, ${d.subs} bài tập áp dụng cho doanh nghiệp, ${d.caps}/${CAP_MAP.length} năng lực AI. #AIforCEO #SieuTangTruong`;
}
function shareView(){
 if(!T.share)return '';
 const k=T.share,canShareFile=!!(navigator.canShare&&window.File);
 return `<div class="mail-ov" role="presentation"><div class="mail share" role="dialog" aria-modal="true" aria-label="Chia sẻ lên Facebook">
  <div class="mail-bar"><span class="mail-app">${ic('fb',16)} Chia sẻ lên Facebook</span><button class="x" data-a="shareClose" aria-label="Đóng">${ic('x')}</button></div>
  <div class="share-body">
   <div class="seg" role="group" aria-label="Chọn ảnh chia sẻ"><button class="${k==='dash'?'on':''}" data-a="shareOpen" data-v="dash">Dashboard</button><button class="${k==='journey'?'on':''}" data-a="shareOpen" data-v="journey">Bản đồ hành trình</button></div>
   <canvas id="share-cv" width="1200" height="630" aria-label="Ảnh xem trước"></canvas>
   <label class="hint" for="share-cap">Nội dung bài đăng gợi ý (sửa tùy ý)</label>
   <textarea class="inp" id="share-cap" rows="3">${esc(T.shareCap||shareCaption(k))}</textarea>
   <div class="share-act">${canShareFile?`<button class="btn btn-primary" data-a="shareNative">${ic('share',16)} Chia sẻ ảnh</button>`:''}<button class="btn dh-btn-fb solid" data-a="shareFb">${ic('fb',16)} Đăng lên Facebook</button><button class="btn btn-line" data-a="shareDownload">${ic('download',16)} Tải ảnh</button></div>
   <p class="hint">Bấm "Đăng lên Facebook": ảnh được tải về máy và nội dung được sao chép sẵn. Trong cửa sổ Facebook, anh/chị dán nội dung và đính kèm ảnh vừa tải. ${canShareFile?'Trên điện thoại, "Chia sẻ ảnh" gửi thẳng ảnh sang ứng dụng Facebook.':''}</p>
  </div></div></div>`;
}
// vẽ ảnh 1200×630 (khung chuẩn ảnh chia sẻ Facebook)
async function drawShare(){
 const cv=document.getElementById('share-cv');if(!cv)return;
 try{await document.fonts.load('800 40px "Be Vietnam Pro"');await document.fonts.load('600 20px "Be Vietnam Pro"');}catch(e){}
 // ảnh Dashboard: khung chuẩn 1200×630; ảnh hành trình: cao theo số bài
 cv.height=T.share==='journey'?journeyLayout().H:630;
 const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);
 (T.share==='journey'?drawJourneyCard:drawDashCard)(g);
}
const F=(w,s)=>`${w} ${s}px "Be Vietnam Pro", Arial, sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
// xuống dòng tối đa n dòng trong bề rộng max
function wrapText(g,t,max,n){const w=String(t).split(' '),out=[];let line='';for(const x of w){const tryL=line?line+' '+x:x;if(g.measureText(tryL).width<=max||!line)line=tryL;else{out.push(line);line=x;}}if(line)out.push(line);if(out.length>n){out.length=n;out[n-1]=fitText(g,out[n-1]+' …',max);}return out;}
function fitText(g,t,max){if(g.measureText(t).width<=max)return t;while(t.length>1&&g.measureText(t+'…').width>max)t=t.slice(0,-1);return t+'…';}
function brand(g,dark){g.font=F(800,22);g.fillStyle=dark?'#1747C9':'#fff';g.textBaseline='alphabetic';g.fillText('Siêu Tăng Trưởng',60,64);g.font=F(600,16);g.fillStyle=dark?'#5B6472':'rgba(255,255,255,.75)';g.fillText('AI for CEO · sieutangtruong.vn',60,90);}
function drawDashCard(g){
 const d=dashStats();
 const bg=g.createLinearGradient(0,0,1200,630);bg.addColorStop(0,'#1747C9');bg.addColorStop(.55,'#6D3BE0');bg.addColorStop(1,'#DB2777');g.fillStyle=bg;g.fillRect(0,0,1200,630);
 g.fillStyle='rgba(255,255,255,.07)';[[1080,80,180],[120,600,160],[640,-40,120]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();});
 brand(g);
 g.fillStyle='#fff';g.font=F(600,24);g.fillText('Hành trình AI của',60,160);g.font=F(800,46);g.fillText(fitText(g,S.profile.name||'Học viên',560),60,214);
 // vòng tiến độ
 const cx=170,cy=390,R=100;g.lineWidth=22;g.lineCap='round';g.strokeStyle='rgba(255,255,255,.22)';g.beginPath();g.arc(cx,cy,R,0,Math.PI*2);g.stroke();
 g.strokeStyle='#fff';g.beginPath();g.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*d.pct/100);if(d.pct>0)g.stroke();
 g.textAlign='center';g.font=F(800,52);g.fillText(d.pct+'%',cx,cy+12);g.font=F(600,17);g.fillStyle='rgba(255,255,255,.85)';g.fillText('hoàn thành',cx,cy+42);g.textAlign='left';
 [['Bài học',`${d.lessonsDone}/${d.N}`],['Bài tập đã nộp',`${d.subs}/${Object.keys(TASKS).length}`],['Năng lực AI',`${d.caps}/${CAP_MAP.length}`],['Thời gian học',hm(d.minDone)]].forEach(([l,v],i)=>{const y=300+i*62;g.fillStyle='#fff';g.font=F(800,30);g.fillText(v,320,y);g.font=F(600,16);g.fillStyle='rgba(255,255,255,.8)';g.fillText(l,320,y+24);});
 // bản đồ năng lực
 g.fillStyle='#fff';rr(g,640,120,500,450,22);g.fill();
 g.fillStyle='#141A26';g.font=F(800,22);g.fillText('Bản đồ 10 năng lực AI',670,165);g.font=F(600,15);g.fillStyle='#5B6472';g.fillText(`Đã chinh phục ${d.caps}/${CAP_MAP.length}`,670,190);
 CAP_MAP.forEach((c,i)=>{const x=670+(i%2)*225,y=210+Math.floor(i/2)*70,s=capState(c.id),w=212,h=58;
  if(s==='done'){g.fillStyle=c.color;rr(g,x,y,w,h,12);g.fill();g.fillStyle='#fff';}
  else{g.fillStyle=s==='locked'?'#F1F3F6':c.color+'1F';rr(g,x,y,w,h,12);g.fill();if(s!=='locked'){g.fillStyle=c.color;g.fillRect(x,y+h-5,w*modPct(c.id)/100,5);}g.fillStyle=s==='locked'?'#8A93A3':c.color;}
  g.font=F(800,14);g.fillText((s==='done'?'✓ ':'')+modNo(L[c.id]),x+14,y+24);g.font=F(700,16);g.fillText(fitText(g,L[c.id].cap,w-24),x+14,y+45);});
 g.fillStyle='rgba(255,255,255,.9)';g.font=F(600,16);g.fillText(fitText(g,cheer(d.pct),560),60,590);
}
// Bố cục ảnh bản đồ hành trình: rộng 1200, cao tùy số bài để mọi bài đều ghi được tên (giống trên trang)
function journeyLayout(){
 const N=lessons().length,n=N+1,cols=n<=6?n:n<=36?6:8,rows=Math.ceil(n/cols),rowH=165,top=300,left=110,right=1090;
 const legLines=2,H=top+(rows-1)*rowH+105+legLines*26+34;
 return {N,cols,rows,rowH,top,left,right,H};
}
function drawJourneyCard(g){
 const d=dashStats(),ls=lessons(),ni=nextLesson(),{N,cols,rowH,top,left,right,H}=journeyLayout(),reach=ni<0?N:ni;
 const bg=g.createLinearGradient(0,0,1200,H);bg.addColorStop(0,'#F4F6FF');bg.addColorStop(1,'#FFF1F7');g.fillStyle=bg;g.fillRect(0,0,1200,H);
 g.fillStyle='rgba(23,71,201,.06)';g.beginPath();g.arc(1120,40,160,0,7);g.fill();g.fillStyle='rgba(219,39,119,.06)';g.beginPath();g.arc(60,H+10,170,0,7);g.fill();
 brand(g,true);
 g.fillStyle='#141A26';g.font=F(800,36);g.fillText('Bản đồ hành trình AI for CEO',60,150);
 g.font=F(600,18);g.fillStyle='#5B6472';g.fillText(fitText(g,`${S.profile.name||'Học viên'} · đã đi qua ${d.lessonsDone}/${N} bài · chinh phục ${d.caps}/${CAP_MAP.length} năng lực AI`,1080),60,184);
 // vị trí từng điểm: hình rắn, hàng chẵn trái→phải, hàng lẻ phải→trái
 const pos=[...Array(N+1)].map((_,i)=>{const r=Math.floor(i/cols),c=i%cols,cc=r%2?cols-1-c:c;return {x:left+(cols>1?cc/(cols-1):.5)*(right-left),y:top+r*rowH,r};});
 const phaseOf=i=>i<N?L[U(ls[i][0]).id].phase:'P5';
 const line=(i,col,wd,dash)=>{g.strokeStyle=col;g.lineWidth=wd;g.setLineDash(dash||[]);g.beginPath();g.moveTo(pos[0].x,pos[0].y);for(let j=1;j<=i;j++){const a=pos[j-1],b=pos[j];if(a.r===b.r)g.lineTo(b.x,b.y);else{const k=(a.x>600?1:-1)*80;g.bezierCurveTo(a.x+k,a.y,b.x+k,b.y,b.x,b.y);}}g.stroke();g.setLineDash([]);};
 g.lineCap='round';line(N,'#C9CFDA',4,[2,10]);
 if(reach>0){const lg=g.createLinearGradient(0,top,0,top+(Math.floor(reach/cols)+1)*rowH);lg.addColorStop(0,'#1747C9');lg.addColorStop(.5,'#7C3AED');lg.addColorStop(1,'#DB2777');line(reach,lg,7);}
 const R=24,space=(right-left)/Math.max(1,cols-1)-14;
 const pill=(t,x,y,bgc,fg)=>{g.font=F(800,13);const tw=g.measureText(t).width,lx=Math.min(1185-tw/2-10,Math.max(15+tw/2+10,x));g.fillStyle=bgc;rr(g,lx-tw/2-11,y-17,tw+22,25,12);g.fill();g.fillStyle=fg;g.textAlign='center';g.fillText(t,lx,y);};
 pos.forEach((p,i)=>{const c=PHASE_COLOR[phaseOf(i)],goal=i===N,done=goal?ni<0:lessonDone(i),cur=i===ni;
  // nhãn phía trên: "Bạn đang ở đây" hoặc tên chương ở bài đầu mỗi chương
  if(cur)pill('Bạn đang ở đây',p.x,p.y-R-16,c,'#fff');
  else if(!goal&&(i===0||phaseOf(i-1)!==phaseOf(i)))pill(`CHƯƠNG ${PHASES.findIndex(x=>x.id===phaseOf(i))+1}`,p.x,p.y-R-16,c+'1F',c);
  // điểm
  const rad=goal?R+6:R;g.beginPath();g.arc(p.x,p.y,rad,0,7);
  if(done){g.fillStyle=goal?'#F59E0B':c;g.fill();g.lineWidth=3;g.strokeStyle='#fff';g.stroke();g.beginPath();g.arc(p.x,p.y,rad+3,0,7);g.lineWidth=2.5;g.strokeStyle=goal?'#F59E0B':c;g.stroke();}
  else{g.fillStyle=goal?'#FFF5E0':'#fff';g.fill();g.lineWidth=cur?5:3;g.strokeStyle=cur?c:goal?'#F59E0B':'#C9CFDA';g.stroke();}
  g.textAlign='center';g.fillStyle=done?'#fff':cur?c:goal?'#B45309':'#8A93A3';g.font=F(800,goal?22:done?20:17);
  g.fillText(goal?'★':done?'✓':String(i+1),p.x,p.y+(goal?8:done?7:6));
  // tên bài phía dưới
  const ks=goal?null:ls[i],mods=ks?[...new Set(ks.map(k=>U(k).id))].map(id=>L[id]):[];
  const label=goal?'Chọn 3 use case cho doanh nghiệp':mods.filter(x=>x.type==='module').map(x=>x.cap).join(' + ')||lessonTitle(ks);
  g.font=F(800,15);g.fillStyle=done||cur||goal?'#141A26':'#8A93A3';g.fillText(goal?'Về đích':'Bài '+(i+1),p.x,p.y+rad+24);
  g.font=F(500,13);g.fillStyle=done||cur||goal?'#5B6472':'#9AA2B1';wrapText(g,label,space,2).forEach((l,j)=>g.fillText(l,p.x,p.y+rad+43+j*17));
  g.textAlign='left';});
 // chú thích chương ở đáy
 let x=60,y=H-34-26;g.font=F(600,14);PHASES.forEach((ph,i)=>{const t=`Chương ${i+1} · ${ph.name}`,w=g.measureText(t).width+20;if(x+w>1150){x=60;y+=26;}g.fillStyle=PHASE_COLOR[ph.id];g.beginPath();g.arc(x+6,y-5,6,0,7);g.fill();g.fillStyle='#2B3240';g.fillText(t,x+18,y);x+=w+28;});
}
function shareBlob(){return new Promise(ok=>{const cv=document.getElementById('share-cv');if(!cv)return ok(null);try{cv.toBlob(b=>ok(b),'image/png');}catch(e){ok(null);}});}
function shareFileName(){return T.share==='journey'?'hanh-trinh-ai-for-ceo.png':'dashboard-ai-for-ceo.png';}
async function shareDownload(){
 const b=await shareBlob();if(!b){toast('Chưa tạo được ảnh. Anh/chị thử mở demo bằng link GitHub thay vì mở file trên máy','bad');return false;}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=shareFileName();document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);return true;
}
