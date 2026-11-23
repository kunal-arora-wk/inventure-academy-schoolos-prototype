/* util.js - icons, helpers, layers, toast. ASCII only; typographic characters use HTML entities. */
const ICON={
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>',
  book:'<path d="M3 5.5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5V19c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5Z"/><path d="M12 6v13.5"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18.5 14.8c1.7.8 2.8 2.5 3 5.2"/>',
  chart:'<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M21 20H3"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 16l.7 2 2 .7-2 .7L19 21l-.7-2-2-.7 2-.7Z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6"/>',
  bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  chevR:'<path d="m9 5 7 7-7 7"/>',chevL:'<path d="m15 5-7 7 7 7"/>',chevD:'<path d="m5 9 7 7 7-7"/>',chevU:'<path d="m5 15 7-7 7 7"/>',
  arrowR:'<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  ext:'<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  doc:'<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7"/>',
  checkSq:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="m8 12 3 3 5-6"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>',
  down:'<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
  up:'<path d="M12 20V9"/><path d="m7 14 5-5 5 5"/><path d="M5 4h14"/>',
  eye:'<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="3"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  trendD:'<path d="m3 7 7 7 4-4 7 7"/><path d="M21 12v5h-5"/>',trendU:'<path d="m3 17 7-7 4 4 7-7"/><path d="M21 12V7h-5"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M16 5h3a3 3 0 0 1-3 4M8 5H5a3 3 0 0 0 3 4"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/>',
  send:'<path d="M21 3 10 14"/><path d="M21 3 14.5 21l-4-7-7-4Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  inbox:'<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6H3v-6Z"/>',
  grip:'<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  sync:'<path d="M20 11a8 8 0 0 0-14-4L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14 4l2-2"/><path d="M20 20v-5h-5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  flag:'<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',
  star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  swap:'<path d="M7 7h12l-3-3"/><path d="M17 17H5l3 3"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  db:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  refresh:'<path d="M20 11a8 8 0 0 0-14-4L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14 4"/>',
  play:'<path d="M7 4v16l13-8Z"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.5h.01"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  filter:'<path d="M4 5h16l-6 8v6l-4-2v-4Z"/>',
  history:'<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4.5h4.5"/><path d="M12 8v4l3 2"/>',
  palette:'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/>',
};
const ic=(n,cls='')=>`<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]||''}</svg>`;
const MARK=`<img src="assets/inventure-logo-mark.png" alt="Inventure Academy" style="height:40px;width:auto;display:block">`;
const LOGO_FULL=`<img src="assets/inventure-logo.png" alt="Inventure Academy - New World. New Learning." style="height:96px;width:auto;display:block">`;

/* deterministic random */
function hashStr(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=typeof seed==='string'?hashStr(seed):seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=(key)=>rng(hashStr(key))();            /* one stable number per key */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const avg=a=>{const v=a.filter(x=>x!=null&&!isNaN(x));return v.length?v.reduce((s,x)=>s+x,0)/v.length:null};
const sum=a=>a.reduce((s,x)=>s+x,0);
const r1=v=>v==null?null:Math.round(v*10)/10;
const r2=v=>v==null?null:Math.round(v*100)/100;
const r0=v=>v==null?null:Math.round(v);
const pct=v=>v==null?'-':(Number.isInteger(v)?v:v.toFixed(1))+'%';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uniq=a=>[...new Set(a)];
const by=(f)=>(a,b)=>{const x=f(a),y=f(b);return typeof x==='string'?x.localeCompare(y):x-y};
const initials=n=>String(n).replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.) /,'').split(' ').map(x=>x[0]).slice(0,2).join('');
const pick=(arr,key)=>arr[hashStr(key)%arr.length];
const plural=(n,w,p)=>`${n} ${n===1?w:(p||w+'s')}`;

/* UI atoms */
const av=(name,size='',tone)=>`<span class="avatar ${size} ${tone!=null?tone:['','a2','a3','a4'][hashStr(name)%4]}">${esc(initials(name))}</span>`;
const pill=(t,c='neutral',plain)=>`<span class="pill ${c} ${plain?'plain':''}">${esc(t)}</span>`;
const SRC={isams:['iSAMS','isams'],canvas:['Canvas','canvas'],asc:['aSc file','asc'],darwin:['Darwinbox','darwin'],sos:['Entered in SchoolOS','sos'],gcal:['Google Calendar','darwin'],sheet:['Google Sheet','neutral']};
const src=()=>'';   /* source labels are intentionally not shown on screens */
const delta=(d,unit='')=>d==null||isNaN(d)?'':`<span class="delta ${d>0?'up':d<0?'down':'flat'}">${d>0?'+':d<0?'-':''}${Math.abs(d)}${unit}</span>`;
const numChip=n=>`<i class="cnt">${n}</i>`;
const empty=(t)=>`<div class="empty">${t}</div>`;
const asof=(t)=>`<span class="muted sm">as of ${esc(t||STATE_TIME())}</span>`;
function STATE_TIME(){return typeof S!=='undefined'&&S.clockLabel?S.clockLabel():'09:20'}
const LV=['Emerging','Expanding','Consolidating','Skilled'];            /* index 0..3 => level 1..4 */
const LVSHORT=['EM','EX','CO','SK'];
const THR=[1.5,2.5,3.5];                                                 /* placeholder conversion rule, editable in the Rules engine */
const lvOf=v=>v==null?0:v>=THR[2]?4:v>=THR[1]?3:v>=THR[0]?2:1;
const lvName=v=>v?LV[v-1]:'No data';
const lvChip=(v,txt)=>`<span class="lvl l${lvOf(v)}" title="${lvName(lvOf(v))}">${txt!=null?txt:(v==null?'-':r2(v))}</span>`;
const ba=(c)=>c?`<span class="lvl ${c==='ACH'?'l4':c==='DEV'?'l2':c==='EVL'?'l1':'l0'}">${c}</span>`:`<span class="lvl l0">-</span>`;

/* toast + layers */
function toast(msg,icon='check'){const t=document.createElement('div');t.className='toast';t.innerHTML=ic(icon)+esc(msg);document.getElementById('toast').appendChild(t);setTimeout(()=>t.remove(),3200)}
function openLayer(html){const L=document.getElementById('layer-root');L.innerHTML=html;if(typeof iconify==='function')iconify(L);const f=L.querySelector('.x');f&&f.focus()}
function closeLayer(){document.getElementById('layer-root').innerHTML=''}
function drawer({title,sub,body,foot,icon}){openLayer(`<div class="layer" data-act="closelayer"><aside class="drawer" role="dialog" aria-label="${esc(title)}"><div class="drawer-h">${icon||''}<div><h2>${esc(title)}</h2>${sub?`<p>${sub}</p>`:''}</div><button class="x" data-act="closelayer" aria-label="Close">${ic('x')}</button></div><div class="drawer-b">${body}</div>${foot?`<div class="drawer-f">${foot}</div>`:''}</aside></div>`)}
function modal({title,body,foot,wide}){openLayer(`<div class="layer center" data-act="closelayer"><div class="modal" role="dialog" aria-label="${esc(title)}" ${wide?'style="width:min(980px,100%)"':''}><div class="drawer-h"><div><h2>${esc(title)}</h2></div><button class="x" data-act="closelayer" aria-label="Close">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot?`<div class="drawer-f">${foot}</div>`:''}</div></div>`)}
function table(heads,rows,{cls='',go=false}={}){return `<div class="table-wrap"><table class="tbl ${cls}"><thead><tr>${heads.map(h=>typeof h==='string'?`<th>${h}</th>`:`<th class="${h.c||''}">${h.t}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`}
function select(id,opts,val,extra=''){return `<select class="sel auto" id="${id}" ${extra}>${opts.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(v)===String(val)?'selected':''}>${esc(l)}</option>`}).join('')}</select>`}
const plainText=h=>String(h==null?'':h).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
function pageHead(title,purpose,actions=''){return `<div class="ph"><div><h1>${esc(title)}${purpose?`<span class="tip" tabindex="0" role="note" aria-label="${esc(plainText(purpose))}" data-tip="${esc(plainText(purpose))}">${ic('info')}</span>`:''}</h1></div>${actions?`<div class="actions">${actions}</div>`:''}</div>`}
function card(title,body,{aside='',foot='',flush=false,cls='',collapse=null,open=true}={}){
  const isOpen=collapse?((S.ui.col||{})[collapse]!==undefined?S.ui.col[collapse]:open):true;
  const tog=collapse?`<button class="btn btn-text sm ico" data-act="cardtog" data-k="${collapse}" aria-expanded="${isOpen}" title="${isOpen?'Hide':'Show'}" aria-label="${isOpen?'Hide':'Show'}">${ic(isOpen?'chevU':'chevD')}</button>`:'';
  return `<section class="card ${cls} ${isOpen?'':'collapsed'}">${title?`<div class="card-h"><h2>${title}</h2>${(aside||tog)?`<div class="aside">${isOpen?aside:''}${tog}</div>`:''}</div>`:''}${isOpen?`<div class="card-b ${flush?'flush':''}">${body}</div>${foot?`<div class="card-f">${foot}</div>`:''}`:''}</section>`}
function segBtns(act,opts,cur,extra=''){return `<div class="seg">${opts.map(([k,l,n,i])=>`<button class="${cur===k?'on':''}" data-act="${act}" data-v="${esc(k)}" ${extra}>${i?ic(i):''}${esc(l)}${n?numChip(n):''}</button>`).join('')}</div>`}
function download(name,text,type='text/csv'){try{const b=new Blob([text],{type});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500)}catch(e){}}
