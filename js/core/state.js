/* state.js - app state, persistence, demo clock, notifications, report-card entries, approval chain, cases, tasks */
const S={
  signedIn:false,role:'teacher',menu:null,pc:false,
  clock:560,paused:false,autoReview:true,                 /* minutes since midnight; 560 = 09:20 */
  notifs:[],store:{},ui:{},fired:{},
  clockLabel(){const m=S.clock;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')},
};
const KEY='schoolos-proto-v2';
const ST=(k,def)=>{if(S.store[k]===undefined)S.store[k]=typeof def==='function'?def():def;return S.store[k]};
function persist(){try{localStorage.setItem(KEY,JSON.stringify({store:S.store,role:S.role,signedIn:S.signedIn,clock:S.clock,autoReview:S.autoReview,notifs:S.notifs,fired:S.fired}))}catch(e){}}
function restore(){try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j){S.store=j.store||{};S.role=j.role||'teacher';S.signedIn=!!j.signedIn;S.clock=j.clock||560;S.autoReview=j.autoReview!==false;S.notifs=j.notifs||[];S.fired=j.fired||{};return true}}catch(e){}return false}
function resetDemo(){try{localStorage.removeItem(KEY)}catch(e){}location.hash='#signin';location.reload()}
const U=()=>USERS[S.role];

/* ---------- notifications ---------- */
function notify(n){const o=Object.assign({id:'n'+Date.now()+Math.random().toString(36).slice(2,5),when:'Today, '+S.clockLabel(),unread:true,tone:'info',icon:'bell',email:false},n);S.notifs.unshift(o);persist();refreshBadge();return o}
const unreadCount=()=>S.notifs.filter(n=>n.unread&&(!n.role||n.role===S.role)).length;
function refreshBadge(){const b=document.querySelector('[data-badge]');if(b){const c=unreadCount();b.textContent=c;b.style.display=c?'':'none'}}
function seedNotifs(){
  S.notifs=[
    {id:'n1',role:'teacher',icon:'trendD',tone:'bad',t:'Diya Sharma: marks are down against her own Term 1 baseline.',when:'Today, 08:02',go:'student/c1-1A-02',unread:true,email:true},
    {id:'n2',role:'teacher',icon:'doc',tone:'info',t:'Term 1 progress report comments are due on Fri, 4 Dec 2026.',when:'Today, 07:30',go:'reports',unread:true,email:true},
    {id:'n3',role:'teacher',icon:'cal',tone:'warn',t:'Kabir Iyer: repeated absences recorded in iSAMS this month.',when:'Yesterday',go:'student/c1-1A-03',unread:true,email:false},
    {id:'n4',role:'teacher',icon:'sync',tone:'good',t:'Canvas marks for Grade 1D "Readers Theatre" reached iSAMS.',when:'Yesterday',go:'sync',unread:false,email:false},
  ];
}

/* ---------- demo clock and scheduled events ---------- */
const EVENTS=[
  {at:566,id:'e-sync',run(){notify({icon:'sync',tone:'good',t:'Canvas marks for Grade 3D "Persuasive Paragraph" reached iSAMS.',go:'sync'})}},
  {at:575,id:'e-cover',run(){ST('cover',coverSeed)['cv-new']={id:'cv-new',day:1,slot:'P4',cls:'Grade 2B',subj:'Maths',room:'R122',absent:'Mr. Dev Sharma',status:'asked'};notify({icon:'swap',tone:'warn',t:'Substitution request: please take Grade 2B Maths, Tue period 4. Confirm or decline.',go:'cover',email:true})}},
  {at:600,id:'e-remind',run(){notify({icon:'clock',tone:'warn',t:'Reminder: Term 1 comments are due in 11 days. 3 of your students still need a General Profile or English comment.',go:'reports',email:true})}},
  {at:630,id:'e-exc',run(){const x=ST('sync',syncSeed);if(!x.exceptions.find(e=>e.id==='ex-new'))x.exceptions.push({id:'ex-new',sid:'c1-1D-05',assess:'Reading Check 2',reason:'Student not matched in iSAMS (new joiner, enrolment number not in Canvas SIS ID).',fix:'Match student in the identity review queue, then retry.',status:'open'});notify({icon:'alert',tone:'bad',t:'1 mark could not reach iSAMS. See exceptions.',go:'sync'})}},
];
function runEvents(){let fired=false;EVENTS.forEach(e=>{if(!S.fired[e.id]&&S.clock>=e.at){S.fired[e.id]=1;e.run();fired=true}});(S.store.timers||[]).slice().forEach(t=>{if(!t.done&&S.clock>=t.at){t.done=true;try{TIMERFN[t.fn]&&TIMERFN[t.fn](t.arg)}catch(e){console.error(e)};fired=true}});return fired}
const TIMERFN={};
function after(mins,fn,arg){ST('timers',[]).push({at:S.clock+mins,fn,arg,done:false});persist()}
function tickClock(adv=1){S.clock+=adv;const f=runEvents();persist();const tl=document.getElementById('clock-lbl');if(tl)tl.textContent=S.clockLabel();
  const h=(location.hash||'').slice(1);const busy=document.getElementById('layer-root').innerHTML||/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'');
  if(!busy&&(f||['home','timetable',''].includes(h.split('/')[0]))) renderSoft()}
let _clk=null;
function startClock(){if(_clk)return;_clk=setInterval(()=>{if(!S.paused&&S.signedIn)tickClock(1)},5000)}

/* ---------- report-card text seeds and entries ---------- */
const ENGLISH_FB=['is a capable reader who benefits from support while exploring texts during shared and guided reading.','enjoys story-reading sessions and is encouraged to read more grade-level books independently.','crafted a story with a clear beginning and ending, expressing ideas through simple sentences.','has a wonderful opportunity to add more detail and descriptive words to writing.','listens carefully during Reading Workshop and is beginning to apply the strategies introduced.','participated actively in Readers Theatre, showing growing fluency and engagement.','shares ideas well in class discussions and follows instructions with confidence.'];
const PROFILE=['has made wonderful progress since the start of the year. The enthusiasm and cheerful nature continue to shine.','is a cooperative, friendly member of the class who gets along well with peers and settles quickly into routines.','shows curiosity when a new concept is introduced and is proud to share what has been learnt.','enjoys group activities and has been an active participant in Beyond Academics and Physical Education.'];
function seedText(sid,slot){const s=STUDENTS[sid],r=rng(sid+slot);const f=s.first;
  if(slot==='profile')return `${f} ${PROFILE[Math.floor(r()*PROFILE.length)]} ${f} ${PROFILE[Math.floor(r()*PROFILE.length)]}`;
  return `${f} ${ENGLISH_FB[Math.floor(r()*ENGLISH_FB.length)]} ${f} ${ENGLISH_FB[Math.floor(r()*ENGLISH_FB.length)]}`}
const slotKey=(term,sid,slot)=>`${term}:${sid}:${slot}`;
const SEEDP={'c1-1A':.55,'c1-1D':.4,'c1-3D':.8};
function entryGet(slot,sid,term){term=term||CYCLE.term;const k=slotKey(term,sid,slot);const E=ST('entries',{});if(E[k]!==undefined)return E[k];
  /* seeded: some students already have entries (colleagues, earlier typing, or imported from Reports Wizard) */
  const s=STUDENTS[sid];const p=(SEEDP[s.cls]!==undefined?SEEDP[s.cls]:.75);
  if(/^(comment|profile)/.test(slot)) return rnd(k)<p?seedText(sid,slot.replace(/^comment:?/,''))||seedText(sid,slot):'';
  if(slot.startsWith('part')) return rnd(k)<p+.1?['IM','IM','EM','EM','P'][Math.floor(rnd(k+'v')*5)]:'';
  if(slot.startsWith('prog')) return rnd(k)<p+.1?['R','S','S','S','O'][Math.floor(rnd(k+'v')*5)]:'';
  if(slot.startsWith('ba:')) return rnd(k)<p?baLevel(sid,term,slot.slice(3),'lvl'):'';
  return '';
}
function entrySet(slot,sid,val,term){term=term||CYCLE.term;ST('entries',{})[slotKey(term,sid,slot)]=val;persist()}
function similar(a,b){const w=t=>t.toLowerCase().replace(/[^a-z ]/g,'').split(/\s+/).filter(x=>x.length>2);const A=new Set(w(a)),B=new Set(w(b));if(A.size<5||B.size<5)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++});return i/(A.size+B.size-i)}
/* colleague comments for the same student (other teachers; read-only) */
const COLLEAGUE={maths:'Maths',theme:'Theme Based Learning',art:'Art'};
function colleagueComments(sid){return Object.keys(COLLEAGUE).filter(k=>rnd(sid+k+'cc')<.8).map(k=>{const st=STAFF.find(x=>x.dept===k&&x.campus==='c1')||STAFF[5];const s=STUDENTS[sid];
  const dup=(sid==='c1-1A-04'&&k==='theme');
  return {subj:COLLEAGUE[k],by:st.name,text:dup?`${s.first} ${ENGLISH_FB[1]} ${s.first} ${ENGLISH_FB[4]}`:`${s.first} ${['shows strong understanding when working with a partner.','applies learning with minor support and is becoming more consistent.','enjoys hands-on tasks and explains thinking clearly.'][Math.floor(rnd(sid+k)*3)]}`}})}
function dupWith(sid,text){return colleagueComments(sid).find(c=>similar(c.text,text)>=.55)}
function mySlots(u,cid){const c=cls(cid);const sl=['part','prog','comment'];if(u.homeroom&&u.homeroom.includes(cid))sl.push('profile');return sl}
function slotDone(sid,slot){const v=entryGet(slot,sid);return !!v}
function studentComplete(u,sid){const s=STUDENTS[sid];const sl=['part:english','prog:english','comment:english'];if(u.homeroom&&u.homeroom.includes(s.cls))sl.push('profile');(u.owns||[]).forEach(a=>sl.push('ba:'+a));return sl.every(x=>slotDone(sid,x))}
const classProgress=(u,cid)=>{const ss=cls(cid).students;const d=ss.filter(id=>studentComplete(u,id)).length;return {done:d,total:ss.length}};
function readiness(sid){const miss=[];['comment:english','part:english','prog:english','profile'].forEach(sl=>{if(!slotDone(sid,sl))miss.push(sl)});return miss}

/* ---------- approval chain (per class) ---------- */
const TIERS=['Teacher','Section Head','Subject Lead / HOD','Principal'];
function rcSeed(){const o={};Object.values(CLASSES).filter(c=>c.campus==='c1'&&c.grade<=5).forEach(c=>{const r=rnd('rc'+c.id);
  o[c.id]=USERS.teacher.classes.includes(c.id)?{state:'draft',tier:0,hist:[]}:{state:r<.3?'draft':r>.88?'approved':'review',tier:r<.3?0:r>.88?4:r<.55?1:r<.75?2:3,hist:[]}});return o}
const RC=()=>ST('rc',rcSeed);
const rcOf=cid=>RC()[cid]||{state:'draft',tier:0,hist:[]};
function rcLog(c,who,action,note){c.hist.push({t:'23 Nov '+S.clockLabel(),who,action,note:note||''})}
function rcSubmit(cid){const c=RC()[cid];c.state='review';c.tier=1;c.returned=false;rcLog(c,USERS.teacher.name,'Submitted for review');persist();
  notify({icon:'send',tone:'info',t:`Grade ${cls(cid).short} reports sent to Section Head for review.`,go:'reports',role:'teacher'});
  if(S.autoReview){after(3,'rcAuto',cid)}}
function rcApprove(cid,byName){const c=RC()[cid];rcLog(c,byName,'Approved');if(c.tier>=3){c.state='approved';c.tier=4;rcLog(c,'System','Locked after final approval. Ready for release by Academic Admin.');notify({icon:'check',tone:'good',t:`Grade ${cls(cid).short} reports are fully approved and locked.`,go:'reports',role:'teacher',email:true})}
  else{c.tier++;notify({icon:'check',tone:'good',t:`${byName} approved Grade ${cls(cid).short}. Now with ${TIERS[c.tier]}.`,go:'reports',role:'teacher'});if(S.autoReview)after(3,'rcAuto',cid)}persist()}
function rcReturn(cid,byName,note){const c=RC()[cid];c.state='returned';c.returned=true;c.retTier=c.tier;c.tier=0;rcLog(c,byName,'Sent back',note);notify({icon:'alert',tone:'bad',t:`${byName} sent Grade ${cls(cid).short} back: "${note}"`,go:'reports',role:'teacher',email:true});persist()}
TIMERFN.rcAuto=cid=>{const c=RC()[cid];if(!c||c.state!=='review')return;const by=[null,USERS.section.name,USERS.hod.name,USERS.principal.name][c.tier];
  if(cid==='c1-1A'&&c.tier===2&&!c.hist.some(h=>h.action==='Sent back')) rcReturn(cid,by,'Please add a next step to the General Profile comments for the students flagged in the readiness list.'); else rcApprove(cid,by)};

/* ---------- attention cases (fixed rules, scoped by access) ---------- */
const NOW_DAY=0;
function caseList(u){
  const ck='cases:'+u.key;if(S.ui[ck])return S.ui[ck];const out=[];
  scopeStudents(u).forEach(s=>{
    const t1=termAvg(s.id,'t1'),t2=termAvg(s.id,'t2');const d=r2(t2-t1);const add=(kind,title,detail)=>{const id=s.id+':'+kind;const since=1+Math.floor(rnd(id)*12);out.push({id,sid:s.id,kind,title,detail,since,sinceLabel:dlabel(dateOf(-since))})};
    if(d<=-.5) add('dip','Performance dip',`Term 2 average ${t2} against own Term 1 baseline ${t1} (${d}).`);
    if(s.missing>=2) add('missing','Repeated missing work',`${s.missing} assessments not submitted in the last 6 weeks.`);
    const sub=SUBJ_KEYS.find(k=>SUBJ[k].groups.some((g,gi)=>g.cols.some((_,ci)=>{const a=skillAvg(s.id,'t1',k,gi,ci),b=skillAvg(s.id,'t2',k,gi,ci);return a!=null&&b!=null&&lvOf(b)<lvOf(a)-0&&b<a-.75})));
    if(sub) add('skill','Declining skill level',`A skill in ${SUBJ[sub].name} fell by more than one level step since Term 1.`);
    if(attTerm(s.id,'t2')<90) add('attendance','Attendance',`Term 2 attendance ${attTerm(s.id,'t2')}% and ${daysMissed(s.id,'t2')} days missed since 2 Nov.`);
  });
  return S.ui[ck]=out;
}
const caseStatus=c=>{const k=ST('cases',{});const st=k[c.id];if(st)return st;return c.since>=3?'escalated':'open'};
const caseAck=(id,by)=>{ST('cases',{})[id]='acknowledged';persist()};

/* ---------- actions (suggested next steps accepted, observation next steps) and tasks ---------- */
function actionsSeed(){return [{id:'act1',src:'Observation next step',title:'Try a 5-minute partner-talk routine at the start of Reading Workshop',owner:'teacher',due:-3,status:'open',href:'observations'},{id:'act2',src:'Recommended action',title:'Check in with Kabir Iyer about missed English lessons',owner:'teacher',due:1,status:'open',href:'student/c1-1A-03'}]}
const ACTIONS=()=>ST('actions',actionsSeed);
function addAction(a){const o=Object.assign({id:'act'+Date.now(),status:'open',owner:'teacher'},a);ACTIONS().push(o);persist();return o}
function tasksFor(u){
  const t=[];const done=ST('taskDone',{});
  if(u.key==='teacher'){
    u.classes.forEach(cid=>{const p=classProgress(u,cid);if(p.done<p.total)t.push({id:'rc:'+cid,src:'Report comments',title:`Finish comments and levels for Grade ${cls(cid).short} (${p.done} of ${p.total} complete)`,due:11,href:'reports/'+cid})});
    const cv=ST('cover',coverSeed);Object.values(cv).filter(c=>c.status==='asked').forEach(c=>t.push({id:'cv:'+c.id,src:'Substitution',title:`Confirm or decline substitution: ${c.cls} ${c.subj}, ${c.slot}`,due:1,href:'cover'}));
    caseList(u).filter(c=>caseStatus(c)!=='acknowledged').slice(0,4).forEach(c=>t.push({id:'case:'+c.id,src:'Attention alert',title:`${STUDENTS[c.sid].name}: ${c.title.toLowerCase()}`,due:2,href:'student/'+c.sid}));
  }
  if(['section','hod','principal'].includes(u.key)){
    const tier={section:1,hod:2,principal:3}[u.key];Object.entries(RC()).filter(([cid,c])=>c.state==='review'&&c.tier===tier&&(u.key!=='section'||cls(cid).grade<=5)).forEach(([cid])=>t.push({id:'ap:'+cid,src:'Approval',title:`Review and approve Grade ${cls(cid).short} reports`,due:5,href:'approvals'}));
    ST('evidence',evidenceSeed).filter(e=>e.state==='pending'&&e.acceptBy===u.key).forEach(e=>t.push({id:'ev:'+e.id,src:'Approval',title:`Accept or return good-work entry for ${e.teacher}`,due:3,href:'evidence-accept'}));
  }
  ACTIONS().filter(a=>a.owner===u.key).forEach(a=>t.push({id:a.id,src:a.src,title:a.title,due:a.due,href:a.href||'tasks',action:true,status:a.status}));
  return t.filter(x=>x.status!=='done'&&!done[x.id]);
}
const dueBucket=d=>d<0?'Overdue':d===0?'Today':d<=6?'This week':'Later';
const dueLabel=d=>d<0?`${-d} day${d===-1?'':'s'} overdue`:d===0?'Today':dlabel(dateOf(d));
