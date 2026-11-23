/* router.js - hash router, route registry, delegated actions, selfTest */
const ROUTES={};const ACT={};const INPUT={};const CHANGE={};
function route(id,def){ROUTES[id]=Object.assign({id,roles:ROLE_ORDER.slice(),rows:[],sample:[]},def)}
function act(name,fn){ACT[name]=fn}
const go=h=>{location.hash='#'+h};
function parseHash(){const h=(location.hash||'#signin').slice(1);const parts=h.split('/');return {id:parts[0]||'signin',args:parts.slice(1).map(decodeURIComponent)}}
function buildPage(id,args){const r=ROUTES[id];if(!r)return {html:`<div class="page">${pageHead('Page not found','This page does not exist.')}<a class="btn btn-dark" href="#${HOME_ROUTE[S.role]}">Go to home</a></div>`,crumbs:'<span class="cur">Not found</span>'};
  let out=r.render(args||[]);const gl=groupList(S.role,id);if(gl&&gl.list.length>1)out=out.replace('<div class="page">','<div class="page"><div class="seg grp">'+gl.list.map(x=>`<button class="${x[0]===id?'on':''}" data-go="${x[0]}">${ic(tabIcon(x[0]))}${x[1]}${tabCount(x[0])?numChip(tabCount(x[0])):''}</button>`).join('')+'</div>');const crumbs=r.crumbs?r.crumbs(args||[]):`<span class="cur">${esc(r.title||id)}</span>`;return {html:out,crumbs}}
let lastRoute=null;
function render(opts={}){
  const {id,args}=parseHash();const app=document.getElementById('app');
  if(id==='signin'||!S.signedIn){if(id!=='signin'&&!S.signedIn){location.hash='#signin';return}S.ui.signin=S.ui.signin||'start';app.innerHTML=signinView();lastRoute=id;return}
  const r=ROUTES[id];if(r&&!r.roles.includes(S.role)){go(HOME_ROUTE[S.role]);return}
  const key=location.hash;const keep=document.getElementById('main');const st=keep&&key===lastRoute?keep.scrollTop:0;
  if(key!==lastRoute){S.menu=null;closeLayer();S.ui.drag=null}
  const p=buildPage(id,args);app.innerHTML=shell(p.html,p.crumbs);iconify(app);
  const m=document.getElementById('main');m.scrollTop=st;const tb=document.getElementById('topbar');m.addEventListener('scroll',()=>tb.classList.toggle('scrolled',m.scrollTop>4));
  lastRoute=key;if(r&&r.after)r.after(args);
}
function renderSoft(){if(document.getElementById('layer-root').innerHTML)return;render()}
window.addEventListener('hashchange',()=>render());

/* ---------- delegated events ---------- */
document.addEventListener('click',e=>{
  let a=e.target.closest('[data-act]');const goEl=e.target.closest('[data-go]');
  if(a&&a.classList.contains('layer')&&e.target!==a)a=null;
  if(!a&&goEl){closeLayer();go(goEl.dataset.go);return}
  if(!a){if(S.menu&&!e.target.closest('.pop')&&!e.target.closest('[data-act="menu"]')){S.menu=null;render()}return}
  const fn=ACT[a.dataset.act];if(fn){try{fn(a,e)}catch(err){console.error(err);toast('Something went wrong: '+err.message,'alert')}}
});
document.addEventListener('input',e=>{const t=e.target.closest('[data-in]');if(t&&INPUT[t.dataset.in])INPUT[t.dataset.in](t,e)});
document.addEventListener('change',e=>{const t=e.target.closest('[data-ch]');if(t&&CHANGE[t.dataset.ch])CHANGE[t.dataset.ch](t,e);
  if(e.target.id==='pc-role'){S.role=e.target.value;S.menu=null;persist();go(HOME_ROUTE[S.role]);render()}
  if(e.target.id==='pc-auto'){S.autoReview=e.target.checked;persist()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(document.getElementById('layer-root').innerHTML)closeLayer();else if(S.menu){S.menu=null;render()}}});

act('cardtog',el=>{const c=S.ui.col||(S.ui.col={});const k=el.dataset.k;const cur=c[k]!==undefined?c[k]:(el.getAttribute('aria-expanded')==='true');c[k]=!cur;render()});
act('closelayer',()=>closeLayer());
act('menu',el=>{S.menu=S.menu===el.dataset.v?null:el.dataset.v;render()});
act('readall',()=>{S.notifs.forEach(n=>n.unread=false);persist();render()});
act('notif',el=>{const n=S.notifs.find(x=>x.id===el.dataset.id);n.unread=false;S.menu=null;persist();if(n.go)go(n.go);render()});
act('openapp',el=>{S.menu=null;render();toast(`Opening ${el.dataset.app}${el.dataset.camp?' ('+el.dataset.camp+')':''} in a new tab. You are already signed in with Google.`,'ext')});
act('signout',()=>{S.signedIn=false;S.ui.signin='start';persist();go('signin');render()});
act('pc',()=>{S.pc=!S.pc;render()});
act('pcclock',el=>{if(el.dataset.v==='pause'){S.paused=!S.paused}else{tickClock(30)}render()});
act('pcreset',()=>{if(confirm('Reset all demo data and sign out?'))resetDemo()});
act('gstart',()=>{S.ui.signin='load';render();setTimeout(()=>{S.signedIn=true;S.role='teacher';S.ui.signin='start';persist();go(HOME_ROUTE.teacher);render()},900)});

/* ---------- self test: renders every route for every allowed role ---------- */
function selfTest(){
  const bad=[];const saveRole=S.role,saveIn=S.signedIn;S.signedIn=true;let n=0;
  const noise=/undefined|NaN|\[object|â€|Ã|Â|�|Infinity/;
  ROLE_ORDER.forEach(role=>{S.role=role;
    NAV[role].forEach(g=>g[1].forEach(it=>{if(!ROUTES[navTarget(it[0])])bad.push(`${role}: nav item "${it[0]}" has no route`)}));
    Object.values(ROUTES).filter(r=>r.roles.includes(role)).forEach(r=>{const argsets=r.sample&&r.sample.length?r.sample:[[]];
      argsets.forEach(args=>{n++;try{const p=buildPage(r.id,args);const html=shell(p.html,p.crumbs);const text=html.replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ');
        const m=text.match(noise);if(m)bad.push(`${role}/${r.id}: found "${m[0]}"`);
        if(/[^\x00-\x7F]/.test(html))bad.push(`${role}/${r.id}: non-ASCII character in output`);
        if(/&(m|n)dash;|&#8211;|&#8212;|&#x201[34];/i.test(html))bad.push(`${role}/${r.id}: long dash in output`);
        if(!r.rows||!r.rows.length)bad.push(`${role}/${r.id}: no breakdown rows declared`)}catch(e){bad.push(`${role}/${r.id}: ${e.message}`)}})})});
  S.role=saveRole;S.signedIn=saveIn;return {screens:n,problems:bad};
}
window.SchoolOS={S,ROUTES,selfTest,render};
