/* shell.js - sign in, navigation by role, topbar, connected apps, notifications, prototype controls */
const HOME_ROUTE={teacher:'home',grade:'dash',hod:'dash',section:'dash',principal:'dash',ceo:'dash',admin:'tpl',admissions:'adm-dash',webknot:'runs'};
const NAV={
  teacher:[['Work',[['home','Home','home'],['timetable','Timetable','cal'],['reports','Report cards','doc'],['sync','Marks to iSAMS','sync'],['students','Students','users'],['tasks','My tasks','checkSq']]],['Insights',[['ask','Ask SchoolOS','spark']]],['My work',[['teaching','My teaching','clock'],['lessons','Lesson planning','book'],['scorecard','My goals','target'],['profile','My profile','user']]]],
  grade:[['Work',[['dash','School summary','home'],['compare','Compare','chart'],['students','Students','users'],['dup-flags','Duplicate comments','doc'],['tasks','My tasks','checkSq']]],['Insights',[['ask','Ask SchoolOS','spark']]],['Staff',[['staff','My teachers','users'],['scorecard','My goals','target'],['profile','My profile','user']]]],
  hod:[['Work',[['dash','School summary','home'],['compare','Compare','chart'],['students','Students','users'],['approvals','Approvals','checkSq'],['curriculum','Curriculum','book'],['tasks','My tasks','list']]],['Insights',[['ask','Ask SchoolOS','spark']]],['Staff',[['staff','My teachers','users'],['scorecard','My goals','target'],['profile','My profile','user']]]],
  section:[['Work',[['dash','School summary','home'],['compare','Compare','chart'],['students','Students','users'],['approvals','Approvals','checkSq'],['tasks','My tasks','list']]],['Insights',[['ask','Ask SchoolOS','spark']]],['Staff',[['staff','My teachers','users'],['scorecard','My goals','target'],['profile','My profile','user']]]],
  principal:[['Work',[['dash','School summary','home'],['compare','Compare','chart'],['students','Students','users'],['approvals','Approvals','checkSq'],['scorecards','Scorecards','target'],['tasks','My tasks','list']]],['Insights',[['ask','Ask SchoolOS','spark']]],['Staff',[['staff','My teachers','users'],['profile','My profile','user']]]],
  ceo:[['Work',[['dash','School summary','home'],['compare','Compare','chart'],['students','Students','users'],['scorecards','Scorecards','target']]],['Insights',[['ask','Ask SchoolOS','spark']]],['Staff',[['staff','My teachers','users'],['profile','My profile','user']]]],
  admin:[['Report cards',[['tpl','Templates and rules','doc'],['prepare','Prepare reports','checkSq'],['release','Release','send']]],['Connect',[['sync-setup','Marks, rosters, timetable','sync'],['people','Substitutions and staff','swap']]],['Data and access',[['platform','Data platform','db'],['access','Access and privacy','lock']]],['AI',[['ai-gov','AI governance','spark']]]],
  admissions:[['Admissions',[['adm-dash','Dashboard','chart'],['adm-applicants','Applicants','users'],['adm-capacity','Seat capacity','list'],['adm-stage','Stage mapping','settings'],['adm-import','Data freshness','down']]]],
  webknot:[['Operations',[['runs','Connector runs','sync'],['health','Source health','shield'],['sso','Sign-on check','lock']]]],
};
const ASK=[['ask','Ask'],['saved','Saved questions'],['digest','Weekly summary']];
const STAFFG=[['team','Teachers'],['workload','Workload'],['observe','Observations'],['evidence-accept','Good work']];
const GROUPS={
  teacher:{timetable:[['timetable','Week'],['cover','Substitutions']],students:[['students','Students'],['plans','Student plans']],ask:ASK,teaching:[['workload','Workload'],['portfolio','Teaching record'],['observations','Observations']]},
  grade:{staff:STAFFG,ask:ASK},hod:{staff:STAFFG,ask:ASK},
  section:{staff:STAFFG,approvals:[['approvals','Approvals'],['tracker','Pending comments'],['alerts','Parent alerts']],ask:ASK},
  principal:{staff:STAFFG,ask:ASK},ceo:{staff:[['team','Teachers'],['evidence-accept','Good work']],ask:ASK},
  admin:{tpl:[['tpl','Templates'],['rules','Rules engine'],['hierarchy','Approval hierarchy']],prepare:[['readiness','Data readiness'],['ach-map','Achievements'],['generate','Generate'],['deadlines','Deadlines and tracker']],'sync-setup':[['marks-map','Marks sync'],['roster','Rosters'],['asc','Timetable upload'],['imports','Imports']],people:[['cover-board','Substitutions'],['three60','Faculty 360'],['alerts-status','Parent alert status']],platform:[['identity','Identity matching'],['quality','Data quality'],['vault','Connections'],['sources','Sources']],access:[['roles','Roles'],['audit','Audit log'],['retention','Retention and requests']]},
};
const HEAD_ROUTE={teaching:'workload',staff:'team',prepare:'readiness','sync-setup':'marks-map',people:'cover-board',platform:'identity',access:'roles'};
function groupList(role,route){const g=GROUPS[role]||{};for(const k of Object.keys(g)){const list=g[k];if(list.some(x=>x[0]===route))return {head:k,list:list.filter(x=>ROUTES[x[0]]&&ROUTES[x[0]].roles.includes(role))}}return null}
function navHead(role,route){const g=groupList(role,route);return g?g.head:route}
const navTarget=id=>HEAD_ROUTE[id]||id;
function navBadge(r){const u=U();if(r==='approvals'){const t={section:1,hod:2,principal:3}[u.key];const n=Object.values(RC()).filter(c=>c.state==='review'&&c.tier===t).length;return n||''}
  if(r==='timetable'){const n=Object.values(ST('cover',coverSeed)).filter(c=>c.status==='asked').length;return n||''}return ''}
function curRoute(){return (location.hash||'#signin').slice(1).split('/')[0]}

function shell(content,crumbs){
  const u=U(),cur=curRoute(),unread=unreadCount();
  const rail=NAV[S.role].map(([g,items])=>`<div class="label">${g}</div>`+items.map(([r,l,i])=>{const b=navBadge(r);return `<a class="nav ${navHead(S.role,cur)===r?'on':''}" href="#${navTarget(r)}">${ic(i)}<span>${l}</span>${b?`<i class="dot" title="Waiting for you">${b}</i>`:''}</a>`}).join('')).join('');
  return `<div class="shell"><aside class="rail"><a class="logo" href="#${HOME_ROUTE[S.role]}" aria-label="Inventure Academy SchoolOS home">${MARK}<div><small><b style="display:inline;font-size:13px;color:var(--ink)">SchoolOS</b></small></div></a>${rail}<div class="grow"></div>
    <div class="me">${av(u.name,'', 'me')}<div><b>${esc(u.name)}</b><small>${esc(u.tag)}</small></div><button data-act="signout" title="Sign out" aria-label="Sign out">${ic('logout')}</button></div></aside>
  <div class="main" id="main"><header class="topbar" id="topbar"><nav class="crumbs">${crumbs||''}</nav>
    <div class="tright"><span class="scope" title="What this role can see">${ic('shield','')}${esc(scopeLabel(u))}</span><span class="scope" title="Data as of">${ic('clock')}<b id="clock-lbl">${S.clockLabel()}</b></span>
      <button class="tb-btn tb-ico ${S.menu==='apps'?'open':''}" data-act="menu" data-v="apps" title="Connected apps" aria-label="Connected apps">${ic('grid')}</button>
      <button class="tb-btn tb-icon ${S.menu==='notifs'?'open':''}" data-act="menu" data-v="notifs" aria-label="Notifications">${ic('bell')}<span class="badge" data-badge style="${unread?'':'display:none'}">${unread}</span></button>
      ${S.menu==='apps'?appsPop(u):''}${S.menu==='notifs'?notifPop():''}</div></header>
    ${content}</div></div>${protoControls()}`;
}
function appsPop(u){
  const camps=u.all?CAMPUSES:CAMPUSES.filter(c=>c.id===u.campus);
  const rows=[];const can=u.key!=='admissions'&&u.key!=='webknot';
  if(can)camps.forEach(c=>{rows.push(`<div class="grp">${esc(c.name)}</div>`);[['iSAMS','iS','var(--brand-soft)','var(--brand-ink)','Student records, attendance and timetable'],['Canvas','Cv','var(--bad-soft)','var(--bad)','Assignments, coursework and submissions']].forEach(([n,m,bg,fg,d])=>rows.push(`<button class="app-row" data-act="openapp" data-app="${n}" data-camp="${esc(c.name)}"><span class="app-mark" style="background:${bg};color:${fg}">${m}</span><span><b>${n}</b><small>${d}</small></span><span class="right muted">${ic('ext')}</span></button>`))});
  if(STAFF.find(s=>s.id===u.stid)||u.key==='teacher'||HEADS.includes(u.key)||u.key==='ceo'||u.key==='admin')rows.push(`<div class="grp">School</div><button class="app-row" data-act="openapp" data-app="Darwinbox"><span class="app-mark" style="background:var(--good-soft);color:var(--good)">Db</span><span><b>Darwinbox</b><small>Leave and staff records</small></span><span class="right muted">${ic('ext')}</span></button>`);
  return `<div class="pop apps" role="menu"><h4>Your connected apps <span>Opens with your Google sign-in</span></h4>${rows.join('')}</div>`;
}
function notifPop(){const ns=S.notifs.filter(n=>!n.role||n.role===S.role);
  return `<div class="pop" role="menu"><h4>Notifications <button class="btn btn-text sm" data-act="readall">Mark all as read</button></h4>${ns.length?ns.map(n=>`<button class="notif ${n.unread?'unread':''}" data-act="notif" data-id="${n.id}"><span class="ic ${n.tone==='info'?'':n.tone}">${ic(n.icon)}</span><span><p>${esc(n.t)}</p><small>${esc(n.when)}${n.email?' &middot; also emailed':''}</small></span></button>`).join(''):empty('Nothing new. Alerts and reminders will appear here.')}</div>`}
function protoControls(){
  return `<div class="pc"><button class="pc-btn" data-act="pc">${ic('settings')}Prototype controls</button>${S.pc?`<div class="pc-panel"><div><label>View as</label><select id="pc-role" class="sel sm" style="width:100%;background-color:#2b2b2b;color:#fff;border-color:#444">${ROLE_ORDER.map(k=>`<option value="${k}" ${S.role===k?'selected':''}>${USERS[k].role}</option>`).join('')}</select></div>
    <div><label>Demo clock &middot; ${S.clockLabel()} ${TODAY.short}</label><div class="r2"><button class="pc-act" data-act="pcclock" data-v="pause">${S.paused?'Resume':'Pause'}</button><button class="pc-act" data-act="pcclock" data-v="30">+30 min</button></div></div>
    <label class="chk" style="color:#ddd"><input type="checkbox" id="pc-auto" ${S.autoReview?'checked':''}> Simulate reviewers after a class is submitted</label>
    <button class="pc-act" data-act="pcreset">Reset demo data</button><p style="color:#999;font-size:11px">Not part of SchoolOS. Demo helper only.</p></div>`:''}</div>`;
}
/* ---------- sign in (Google Workspace only, one general button) ---------- */
function signinView(){
  const g='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';
  const st=S.ui.signin||'start';
  const body=st==='load'?'<div class="callout info row"><span class="spin"></span>Signing you in with your school Google account...</div>'
   :'<button class="gbtn" data-act="gstart">'+g+'Continue with Google</button><p class="hint">Use your school Google account. There is no separate SchoolOS password.</p>';
  return `<div class="signin"><section class="si-art"><div class="si-plate">${LOGO_FULL}</div><div><h1>Enter it once. <em>Use it everywhere.</em></h1><p class="lede">Marks, attendance and timetables come from iSAMS, Canvas and aSc. You add only what no system holds yet, and SchoolOS carries it into report cards, insights and approvals.</p></div><div class="si-pillars"><span>Report cards</span><span>Student insights</span><span>Ask SchoolOS</span><span>Approvals</span></div></section>
    <section class="si-form"><div class="si-card"><div><h2>Sign in to SchoolOS</h2><p class="muted" style="margin-top:6px">Inventure Academy staff sign in with Google.</p></div>${body}</div></section></div>`;
}
