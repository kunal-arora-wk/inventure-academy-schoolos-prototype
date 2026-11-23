/* m-home.js - Teacher home, timetable, cover, tasks, my profile */
function coverSeed(){return {
  cv1:{id:'cv1',day:4,slot:'P5',cls:'Grade 1A',subj:'English',room:'R110',absent:'Anjali Rao',cover:'Dev Sharma',mine:true,status:'assigned'},
  cv2:{id:'cv2',day:3,slot:'P3',cls:'Grade 2C',subj:'Maths',room:'R122',absent:'Suman Pillai',cover:'Anjali Rao',forMe:true,status:'asked'},
}}
const mm=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
const DOWN=['','Mon','Tue','Wed','Thu','Fri','Sat'];
function dayInfo(off){const d=dateOf(off);const dow=d.getUTCDay();const k=dkey(d);
  if(dow===0)return {kind:'weekend',label:dlabel(d)};if(HOLIDAYS[k])return {kind:'hol',label:HOLIDAYS[k],date:d,dow};
  if(off<-14||off>14)return {kind:'none',date:d,dow};return {kind:'day',date:d,dow}}
function lessonsFor(off){const di=dayInfo(off);if(di.kind!=='day')return di;const week0=off>=0&&off<=4||off===0;const cv=Object.values(ST('cover',coverSeed));
  const rows=PERIODS.map(([p,s,e],i)=>{if(di.dow===6&&(p==='Lunch'||['P5','P6','P7'].includes(p)))return {kind:'off',p,s,e};if(p==='Break'||p==='Lunch')return {kind:'brk',p,s,e};const idx=PSLOTS.indexOf(p);const cid=TTPAT[di.dow][idx];
    const inWeek=off>=0&&off<6; const c=inWeek?cv.find(x=>x.day===di.dow&&x.slot===p&&x.status!=='declined'&&x.status!=='cancelled'):null;
    if(c&&c.forMe)return {kind:'coverme',p,s,e,c};
    if(!cid)return {kind:'free',p,s,e};
    const k=cls(cid);return {kind:'class',p,s,e,cid,room:k.room,cov:(c&&c.mine)?c:null}});
  return {kind:'day',date:di.date,dow:di.dow,rows}}
function nowState(row,off){if(off!==0)return off<0?'done':'later';const a=mm(row.s),b=mm(row.e);return S.clock>=b?'done':S.clock>=a?'now':'later'}
function dayTt(off){const d=lessonsFor(off);if(d.kind==='weekend')return empty('Weekend. No lessons.');if(d.kind==='hol')return empty(`${esc(d.label)}. No lessons.`);if(d.kind==='none')return empty(`No timetable uploaded for this date yet. The latest aSc upload is dated ${ASC_ASOF}.`);
  let firstLater=true;return `<div class="tt">${d.rows.map(r=>{const st=nowState(r,off);const t=`<div class="t">${r.s}<small>${r.e}</small></div><span class="node"></span>`;
    if(r.kind==='off')return '';if(r.kind==='brk')return `<div class="tt-row brk">${t}<div class="tt-slot">${r.p}</div><span></span></div>`;
    if(r.kind==='free'){const nx=st==='later'&&firstLater&&(firstLater=false)===false;return `<div class="tt-row ${st}">${t}<div class="tt-slot"><span><b>Free period</b><small>${r.p}</small></span></div><span></span></div>`}
    if(r.kind==='coverme')return `<div class="tt-row ${st}">${t}<div class="tt-slot"><span><b>Taking ${esc(r.c.cls)} ${esc(r.c.subj)} (substitution)</b><small>${r.p} &middot; ${esc(r.c.room)} &middot; for ${esc(r.c.absent)} &middot; class list is not shown for substitutions</small></span></div>${pill(r.c.status==='confirmed'?'Confirmed':'Substitution','warn')}</div>`;
    const c=cls(r.cid);return `<div class="tt-row ${st}">${t}<div class="tt-slot"><span><b>${clsLabel(c)} &middot; English</b><small>${r.p} &middot; ${r.room}${r.cov?` &middot; Taken by ${esc(r.cov.cover)}`:''}</small></span></div>${r.cov?pill('Substituted','info'):st==='now'?pill('Now','orange'):'<span></span>'}</div>`}).join('')}</div>`}

function weekGrid(wk){
  const cells=[];const days=[1,2,3,4,5,6].map(d=>7*wk+d-1);
  let h=`<div class="weekgrid"><div></div>${days.map(o=>{const d=dateOf(o);return `<div class="wk-h">${DOWN[d.getUTCDay()]} ${d.getUTCDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]}</div>`}).join('')}`;
  PERIODS.forEach(([p,s,e])=>{h+=`<div class="wk-p">${p==='Break'||p==='Lunch'?p:p}<br>${s}</div>`;days.forEach(o=>{const L=lessonsFor(o);
    if(L.kind==='weekend'||L.kind==='none'||L.kind==='hol'){h+=`<div class="wk-c hol">${p==='P1'?esc(L.kind==='hol'?L.label:L.kind==='none'?'No timetable':''):''}</div>`;return}
    const r=L.rows.find(x=>x.p===p);const now=wk===0&&o===0&&nowState(r,0)==='now';
    if(r.kind==='off')h+=`<div class="wk-c hol" style="min-height:28px"></div>`;else if(r.kind==='brk')h+=`<div class="wk-c free" style="min-height:28px;padding:2px 8px">${p}</div>`;
    else if(r.kind==='free')h+=`<div class="wk-c free">Free</div>`;
    else if(r.kind==='coverme')h+=`<div class="wk-c cover ${now?'now':''}"><b>Substitution: ${esc(r.c.cls)}</b>${esc(r.c.subj)} &middot; ${esc(r.c.room)}<br><span class="muted">for ${esc(r.c.absent)}</span></div>`;
    else{const c=cls(r.cid);h+=`<div class="wk-c ${r.cov?'covered':''} ${now?'now':''}"><b>${clsLabel(c)}</b>English &middot; ${r.room}${r.cov?`<br><span class="muted">Taken by ${esc(r.cov.cover)}</span>`:''}</div>`}})});
  return h+'</div>';
}
route('timetable',{roles:['teacher'],title:'Timetable',rows:['Teacher Workspace / Weekly Timetable','Teacher Workspace / Today\'s Timetable','Substitute Cover / Show Lessons I Am Covering on My Timetable','Substitute Cover / Show Who Is Covering My Lessons'],sample:[[],['1']],
  render(a){const wk=+(a[0]||0);const d1=dateOf(7*wk),d5=dateOf(7*wk+5);const none=wk>2||wk<-2;
    return `<div class="page">${pageHead('Timetable','Your lessons Monday to Saturday, from the latest school timetable. Substitutions appear here once they are arranged.',`<div class="row tight"><a class="btn btn-ghost btn-sm" href="#timetable/${wk-1}">${ic('chevL')}Previous week</a><a class="btn btn-ghost btn-sm" href="#timetable/0">This week</a><a class="btn btn-ghost btn-sm" href="#timetable/${wk+1}">Next week${ic('chevR')}</a></div>`)}
    ${card(`${dlabel(d1)} to ${dlabel(d5)}`,none?empty(`No timetable uploaded for this week. The latest upload is dated ${ASC_ASOF}.`):weekGrid(wk),{aside:`<span class="muted sm" title="Timetable as of ${ASC_ASOF}. Substitutions show only once cover is assigned.">${ic('clock')} ${ASC_ASOF}</span>`})}</div>`}});

/* ---------- Teacher home ---------- */
route('home',{roles:['teacher'],title:'Home',rows:['Teacher Workspace / Teacher Home Page','Teacher Workspace / Launch Canvas and iSAMS','Teacher Workspace / Today\'s Timetable','Teacher Task List / My Tasks List','Saved Questions and Pinned Charts / Pin a Chart to Home','Students Needing Attention List'],
  render(){const u=U();const L=lessonsFor(0);const nowRow=L.rows.find(r=>r.kind==='class'&&nowState(r,0)==='now')||L.rows.find(r=>r.kind==='class'&&nowState(r,0)==='later');
    const cnt=L.rows.filter(r=>r.kind==='class').length+L.rows.filter(r=>r.kind==='coverme').length;const tasks=tasksFor(u);
    const open=u.classes.filter(c=>classProgress(u,c).done<classProgress(u,c).total).length;
    const cases=caseList(u).filter(c=>caseStatus(c)!=='acknowledged');
    let nowCard='';if(nowRow){const c=cls(nowRow.cid),st=nowState(nowRow,0),a=mm(nowRow.s),b=mm(nowRow.e);const pr=st==='now'?clamp((S.clock-a)/(b-a)*100,0,100):0;
      nowCard=`<div class="nowcard"><span class="tag"><i></i>${st==='now'?'In session now':'Next lesson'} &middot; ${nowRow.p}</span><div><h3>${clsLabel(c)} &middot; English</h3><div class="muted sm" style="margin-top:6px">${nowRow.s} to ${nowRow.e} &middot; ${nowRow.room}</div></div>
      ${st==='now'?`<div><div class="prog"><i style="width:${pr}%"></i></div><div class="row" style="justify-content:space-between;margin-top:6px"><span class="muted sm">${S.clock-a} min in</span><span class="muted sm">${b-S.clock} min left</span></div></div>`:''}
      <div class="row tight" style="margin-top:auto"><a class="btn btn-dark" href="#reports/${c.id}">Report card comments ${ic('arrowR')}</a></div></div>`}
    else nowCard=`<div class="nowcard"><span class="tag"><i></i>Done for today</span><h3>No more lessons today</h3><p class="muted">Your report comments and tasks are the next thing to look at.</p></div>`;
    return `<div class="page"><section class="card hero"><div class="hi"><div><div class="muted sm">${TODAY.label} &middot; Term 2, Week 4</div><h1>Good morning, Ms. Rao</h1><div class="chips"><span class="chip">${ic('checkSq')}${tasks.length} open tasks</span><span class="chip hot" title="Term 1 report comments due">${ic('doc')}${CYCLE.deadline}</span></div></div>
      <div class="stats"><div><b class="num">${cnt}</b><small>Lessons today</small></div><div><b class="num">${scopeStudents(u).length}</b><small>Students you teach</small></div><div><b class="num">${open}</b><small>Classes with comments to finish</small></div></div></div>${nowCard}</section>
    <div class="grid g-8-4"><div class="stack">${card('Today\'s timetable',dayTt(0),{aside:`${src('asc')} <span class="muted sm">as of ${ASC_ASOF}</span><a class="btn btn-text sm" href="#timetable">Week view</a>`})}
      ${card('Pinned charts',pinnedBlock(),{collapse:'home-pins',open:((ST('pinned',{})[S.role]||[]).length>0),aside:'<a class="btn btn-text sm" href="#saved">Saved questions</a>'})}</div>
    <div class="stack">${card('Tasks',tasksList(tasks.slice(0,5),true),{aside:`<span class="muted sm">${tasks.length} open</span><a class="btn btn-text sm" href="#tasks">All tasks</a>`})}
      ${card('Students needing attention',cases.length?`<div class="stack-s">${cases.slice(0,4).map(c=>{const s=STUDENTS[c.sid];return `<a class="item" href="#student/${s.id}">${av(s.name,'sm')}<span class="grow"><b>${esc(s.name)}</b><small>${esc(c.title)} &middot; since ${esc(c.sinceLabel)}</small></span>${ic('chevR')}</a>`}).join('')}</div>`:empty('No students flagged in your classes.'),{aside:`<a class="btn btn-text sm" href="#students/attention">See all ${cases.length}</a>`})}
      ${card('Your systems',`<div class="stack-s"><button class="item" data-act="openapp" data-app="iSAMS" data-camp="${esc(campusName(u.campus))}"><span class="app-mark" style="background:var(--brand-soft);color:var(--brand-ink)">iS</span><span class="grow"><b>iSAMS</b><small>${esc(campusName(u.campus))}</small></span>${ic('ext')}</button><button class="item" data-act="openapp" data-app="Canvas" data-camp="${esc(campusName(u.campus))}"><span class="app-mark" style="background:var(--bad-soft);color:var(--bad)">Cv</span><span class="grow"><b>Canvas</b><small>${esc(campusName(u.campus))}</small></span>${ic('ext')}</button><button class="item" data-act="openapp" data-app="Darwinbox"><span class="app-mark" style="background:var(--good-soft);color:var(--good)">Db</span><span class="grow"><b>Darwinbox</b><small>Leave and staff records</small></span>${ic('ext')}</button></div><p class="hint" style="margin-top:12px">You are already signed in. These open with your Google account.</p>`,{collapse:'home-sys',open:false})}</div></div></div>`}});
function tasksList(ts,compact){if(!ts.length)return empty('All caught up. New tasks appear here as they are assigned to you.');
  return `<div class="list">${ts.map(t=>`<a class="li" href="#${t.href}"><span class="ti">${ic(t.src==='Substitution'?'swap':t.src==='Approval'?'checkSq':t.src==='Attention alert'?'alert':'doc')}</span><span class="grow"><b>${esc(t.title)}</b><small>${esc(t.src)} &middot; ${dueLabel(t.due)}</small></span><span class="end">${ic('chevR')}</span></a>`).join('')}</div>`}
const TASK_ICON={All:'list','Report comments':'doc',Substitution:'swap','Attention alert':'alert','Observation next step':'eye','Recommended action':'bulb',Approval:'checkSq'};
route('tasks',{roles:['teacher','grade','hod','section','principal','ceo'],title:'Tasks',rows:['Teacher Task List / My Tasks List','Teacher Task List / Open Task at Source','Teacher Task List / Task Record and Feed','Teacher Task List / Report Comment Tasks','Teacher Task List / Approval Tasks','Teacher Task List / Cover Tasks','Teacher Task List / Attention Alert Tasks','Teacher Task List / Due and Overdue Reminders'],
  render(){const u=U();const f=S.ui.taskSrc||'All';const all=tasksFor(u);const srcs=['All'].concat(uniq(all.map(t=>t.src)));const ts=all.filter(t=>f==='All'||t.src===f);
    const buckets=['Overdue','Today','This week','Later'];
    return `<div class="page">${pageHead('Tasks','Everything waiting for you, from every part of SchoolOS, in one list. A task closes by itself when the work is done.','')}
    <div class="toolbar"><span class="muted" title="Task type">${ic('filter')}</span>${segBtns('tasksrc',srcs.map(s=>[s,s,s==='All'?all.length:all.filter(t=>t.src===s).length,TASK_ICON[s]||'list']),f)}</div>
    ${buckets.map(b=>{const g=ts.filter(t=>dueBucket(t.due)===b);return g.length?card(b,tasksList(g),{aside:numChip(g.length)}):''}).join('')||empty('No tasks for this filter.')}
    <p class="hint">Reminders go out the day before a task is due and when it is overdue. Report comment deadlines have their own reminders.</p></div>`}});
act('tasksrc',el=>{S.ui.taskSrc=el.dataset.v;render()});

/* ---------- Cover (teacher) ---------- */
route('cover',{roles:['teacher'],title:'Substitutions',rows:['Substitute Cover / Notify of New Cover','Substitute Cover / Notify of Cancelled Cover','Substitute Cover / Confirm Cover','Substitute Cover / Decline Cover with a Reason','Substitute Cover / Show Who Is Covering My Lessons','Substitute Cover / Show Lessons I Am Covering on My Timetable'],
  render(){const cv=Object.values(ST('cover',coverSeed));const forMe=cv.filter(c=>c.forMe||c.id==='cv-new'),mine=cv.filter(c=>c.mine);
    const row=(c)=>`<div class="li"><span class="ti">${ic('swap')}</span><span class="grow"><b>${esc(c.cls)} ${esc(c.subj)}</b><small>${DOWN[c.day]||''} ${c.slot} &middot; ${esc(c.room)} &middot; for ${esc(c.absent)} &middot; class list is not shown to cover teachers</small></span><span class="end">${c.status==='asked'?`<button class="btn btn-dark btn-sm" data-act="cvconfirm" data-id="${c.id}">Confirm</button><button class="btn btn-ghost btn-sm" data-act="cvdecline" data-id="${c.id}">Decline</button>`:pill(c.status==='confirmed'?'Confirmed':'Declined',c.status==='confirmed'?'good':'neutral')}</span></div>`;
    return `<div class="page">${pageHead('Substitutions','Lessons you are asked to take for a colleague, and who is taking your own lessons. You are told in the app and by email.')}
    <div class="grid g-2">${card('Lessons I am asked to take',forMe.length?`<div class="list">${forMe.map(row).join('')}</div>`:empty('No substitution requests right now.'),{aside:src('sos')})}
    ${card('Who is taking my lessons',mine.length?`<div class="list">${mine.map(c=>`<div class="li"><span class="ti">${ic('user')}</span><span class="grow"><b>${esc(c.cls)} ${esc(c.subj)}</b><small>${DOWN[c.day]} ${c.slot} &middot; ${esc(c.room)} &middot; taken by ${esc(c.cover)}</small></span><span class="end">${pill('Assigned','info')}</span></div>`).join('')}</div>`:empty('None of your lessons need a substitute.'),{aside:`${src('darwin')} <span class="muted sm">Leave read from Darwinbox</span>`})}</div></div>`}});
act('cvconfirm',el=>{const c=ST('cover',coverSeed)[el.dataset.id];c.status='confirmed';persist();toast('Confirmed. The academic admin can see your reply.');render()});
act('cvdecline',el=>{const id=el.dataset.id;modal({title:'Decline substitution',body:`<p>Tell the academic admin why you cannot cover. The lesson goes back to the uncovered list.</p><div class="field"><label for="cv-why">Reason</label><textarea class="ta sm" id="cv-why" placeholder="For example: I have a parent meeting in that period."></textarea></div>`,foot:`<button class="btn btn-ghost" data-act="closelayer">Cancel</button><button class="btn btn-dark" data-act="cvdeclinego" data-id="${id}">Decline</button>`})});
act('cvdeclinego',el=>{const w=(document.getElementById('cv-why')||{}).value||'';if(!w.trim()){toast('Please give a reason.','alert');return}const c=ST('cover',coverSeed)[el.dataset.id];c.status='declined';c.why=w;persist();closeLayer();toast('Declined. The academic admin has been told.');render()});

/* ---------- My profile (read-only) ---------- */
route('profile',{roles:['teacher','grade','hod','section','principal','ceo'],title:'My profile',rows:['Teacher Workspace / My Profile Page'],
  render(){const u=U();const st=STAFF.find(x=>x.id===u.stid)||{};const mg=STAFF.find(x=>x.id===st.manager);
    const kv=(k,v)=>`<tr><td class="muted" style="width:220px">${k}</td><td><b>${v}</b></td></tr>`;
    return `<div class="page">${pageHead('My profile','This is a read-only view built from your staff records. If something is wrong, it is corrected in the source system.')}
    ${card(esc(u.name),table(['Field','Value'],[kv('School email',esc(st.email||'-'),src('isams')),kv('Campus',esc(campusName(u.campus||'c1')||'All campuses'),src('darwin')),kv('Department',esc(st.dept||'-'),src('darwin')),kv('Designation',esc(st.designation||u.role),src('darwin')),kv('Reporting manager',mg?esc(mg.name):'-',src('darwin')),kv('Join date',esc(st.joined||'-'),src('darwin')),
      kv('Classes and subjects I teach',u.classes?u.classes.map(c=>`English, ${clsLabel(cls(c))}`).join('<br>'):'Not a class teacher',`${src('isams')} ${src('asc')}`)].map(r=>`<tr>${r.replace(/^<tr>|<\/tr>$/g,'')}</tr>`)),{aside:`<span class="muted sm">as of ${S.clockLabel()}</span>`})}</div>`}});
