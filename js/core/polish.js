/* polish.js - icons instead of text, count pills on tabs. Runs after every render. ASCII only. */
const TAB_ICON={timetable:'cal',cover:'swap',students:'users',plans:'book',ask:'spark',saved:'star',digest:'mail',workload:'clock',portfolio:'trophy',observations:'eye',team:'users',observe:'eye','evidence-accept':'trophy',approvals:'checkSq',tracker:'list',alerts:'mail',tpl:'doc',rules:'settings',hierarchy:'layers',readiness:'shield','ach-map':'trophy',generate:'play',deadlines:'cal','marks-map':'sync',roster:'users',asc:'cal',imports:'up','cover-board':'swap',three60:'users','alerts-status':'mail',identity:'users',quality:'chart',vault:'lock',sources:'db',roles:'lock',audit:'list',retention:'trash'};
const TABK={find:'search',attention:'alert',skills:'trendU',overview:'grid',obs:'eye',load:'clock',meetings:'cal',course:'book',groups:'layers',rubric:'target',status:'sync',preview:'eye',exceptions:'alert',conflicts:'swap',tab:'list'};
const tabIcon=id=>TAB_ICON[id]||'list';
/* Counts appear only where something is waiting for the signed-in person. */
function tabCount(id){
  try{
    const u=U();
    if(id==='approvals')return +navBadge('approvals')||0;
    if(id==='cover')return +navBadge('timetable')||0;
    if(id==='tracker')return Object.entries(RC()).filter(([cid,r])=>r.state==='draft'&&cls(cid).campus===(u.campus||'c1')&&cls(cid).grade<=5).length;
    if(id==='alerts')return ALERTS().filter(a=>a.state==='draft'&&a.age<EXPIRY_DAYS).length;
    if(id==='evidence-accept')return ST('evidence',evidenceSeed).filter(e=>e.state==='pending'&&e.acceptBy===u.key).length;
    if(id==='ach-map')return ST('achMap',[]).filter(x=>!x[1]).length;
  }catch(e){}
  return 0;
}
const BTN_ICON=[
  [/^(approve|accept|confirm|mark( as)? done|done|acknowledge|save|apply|looks good|keep)\b/i,'check'],
  [/^(send back|return|undo|reset|restore|revert)\b/i,'undo'],
  [/^(decline|dismiss|reject|cancel|close|discard|no cover|clear|not now)\b/i,'x'],
  [/^(download|export)\b/i,'down'],
  [/^(upload|import)\b/i,'up'],
  [/^(preview|view|details|detail|open|show|see|read|review|inspect|evidence|why|trace|compare)\b/i,'eye'],
  [/^(retry|re-?run|refresh|regenerate|sync|try again|reload)\b/i,'refresh'],
  [/^(run|start|generate)\b/i,'play'],
  [/^(add|new|create|assign|suggest)\b/i,'plus'],
  [/^(clone|duplicate|copy)\b/i,'copy'],
  [/^(delete|remove)\b/i,'trash'],
  [/^(edit|rename|change|override)\b/i,'pen'],
  [/^(submit|send|push|release|publish|schedule|ask)\b/i,'send'],
  [/^(hold|pause|lock)\b/i,'lock'],
  [/^(next|continue)\b/i,'arrowR'],
  [/^(back|previous)\b/i,'chevL']
];
const btnIcon=t=>{for(const [re,i] of BTN_ICON)if(re.test(t))return i;return null};
const KPI_ICON=[[/order|hierarchy|tier/i,'layers'],[/student|learner|applicant|enquir|people|teacher|staff|team/i,'users'],[/lesson|period|timetable|week|day/i,'cal'],[/deadline|due|late|time|hours|minutes/i,'clock'],[/attention|alert|flag|risk|missing|overdue|fail|error|exception|absent|absence/i,'alert'],[/waiting|pending|task|open|approval|review|to do|outstanding/i,'checkSq'],[/seat|capacity|admission|offer|stage/i,'inbox'],[/sync|run|connect|system|source|health/i,'sync'],[/report|card|template|comment|class|section/i,'doc'],[/substitut|cover|swap/i,'swap'],[/observ|goal|target|plan|scorecard/i,'target'],[/question|ask|assistant|ai\b/i,'spark'],[/approved|complete|done|ready|released|sent|accepted|verified|healthy/i,'check'],[/attendance|present/i,'user']];
const kpiIcon=t=>{for(const [re,i] of KPI_ICON)if(re.test(t))return i;return 'chart'};

function countify(root){
  /* "Label (12)" in a tab or segmented button becomes "Label" plus a count pill */
  root.querySelectorAll('.tabs button,.seg button').forEach(b=>{if(b.querySelector('.cnt'))return;const n=b.lastChild;if(!n||n.nodeType!==3)return;
    const m=n.textContent.match(/^(.*?)\s*\((\d+)\)\s*$/);if(!m)return;n.textContent=m[1];b.insertAdjacentHTML('beforeend',numChip(m[2]))});
}
function iconify(root){
  if(!root)return;
  try{
    countify(root);
    /* buttons: icon in front of the word, or icon only in tight places (table rows, card headers) */
    root.querySelectorAll('button.btn,a.btn').forEach(b=>{
      if(b.closest('.pc')||b.classList.contains('ico')||b.classList.contains('gbtn'))return;
      const kids=[...b.children];if(kids.some(k=>k.tagName!=='svg'&&k.tagName!=='SVG'))return;
      const t=b.textContent.trim();if(!t)return;
      const svg=b.querySelector('svg');const i0=btnIcon(t);if(!svg&&!i0)return;
      const primary=b.classList.contains('btn-dark')||b.classList.contains('btn-orange');
      const compact=!!b.closest('td,.li .end,.card-h .aside');
      if(!primary&&compact&&t.split(/\s+/).length<=3&&!/\d/.test(t)){
        b.classList.add('ico');b.title=t;b.setAttribute('aria-label',t);b.innerHTML=svg?svg.outerHTML:ic(i0);
      }else if(!svg){b.insertAdjacentHTML('afterbegin',ic(i0))}
    });
    /* page tabs: icon in front, count only where something waits */
    root.querySelectorAll('.tabs button').forEach(b=>{if(b.querySelector('svg'))return;const k=(b.dataset.go||'').split('/').pop();const t=b.textContent.trim();
      const i0=TABK[k]||TAB_ICON[k]||(/rubric|skill/i.test(t)?'target':/threshold|level/i.test(t)?'settings':/weight/i.test(t)?'chart':/band/i.test(t)?'layers':/simul|trace/i.test(t)?'play':'list');
      let n=0;try{if(k==='attention')n=caseList(U()).filter(c=>caseStatus(c)!=='acknowledged').length}catch(e){}
      b.innerHTML=ic(i0)+esc(t)+(n?numChip(n):'')});
    /* summary numbers get a small icon */
    root.querySelectorAll('.kpi .l').forEach(l=>{if(l.querySelector('.kic'))return;l.insertAdjacentHTML('afterbegin',`<span class="kic">${ic(kpiIcon(l.textContent))}</span>`)});
    /* notices get a leading icon */
    root.querySelectorAll('.callout').forEach(c=>{if(c.classList.contains('row')||c.classList.contains('cx')||c.querySelector('.spin'))return;
      const k=c.classList.contains('bad')||c.classList.contains('warn')?'alert':c.classList.contains('good')?'check':'info';
      const w=document.createElement('div');w.className='cb';while(c.firstChild)w.appendChild(c.firstChild);c.classList.add('cx');c.appendChild(w);c.insertAdjacentHTML('afterbegin',ic(k))});
    root.querySelectorAll('.empty:not(.ex)').forEach(e=>{e.classList.add('ex');e.insertAdjacentHTML('afterbegin',ic('inbox'))});
    /* page footnotes become an info icon with a tooltip */
    root.querySelectorAll('.page > p.hint').forEach(p=>{const t=plainText(p.innerHTML);const d=document.createElement('div');d.className='pnote';d.innerHTML=`<span class="tip" tabindex="0" role="note" aria-label="${esc(t)}" data-tip="${esc(t)}">${ic('info')}</span>`;p.replaceWith(d)});
  }catch(e){console.error('iconify',e)}
}
