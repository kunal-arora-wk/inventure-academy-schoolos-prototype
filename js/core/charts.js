/* charts.js - SVG chart templates: bars, hbars, line, donut/pie, histogram, radar, heat grid, funnel */
const PAL=['#2152E0','#FF7A1A','#15855A','#A855C7','#E0971A','#C9382F','#0E9AA7'];
function barsSVG({labels,series,H=220,yMin=0,yMax=100,ticks=[0,25,50,75,100],fmt=v=>v,showVals=true,cls}){
  const W=640,pl=40,pr=10,pt=18,pb=30,iw=W-pl-pr,ih=H-pt-pb,n=labels.length,g=iw/Math.max(n,1),sN=series.length;
  const bw=Math.min(30,(g*.6-(sN-1)*5)/sN);const y=v=>pt+ih-(clamp(v,yMin,yMax)-yMin)/(yMax-yMin||1)*ih;
  let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">`;
  ticks.forEach(t=>{s+=`<line class="gl" x1="${pl}" x2="${W-pr}" y1="${y(t)}" y2="${y(t)}"/><text class="axis" x="${pl-8}" y="${y(t)+4}" text-anchor="end">${fmt(t)}</text>`});
  labels.forEach((l,i)=>{const cx=pl+g*i+g/2,tot=bw*sN+(sN-1)*5;
    series.forEach((se,j)=>{const v=se.values[i];if(v==null)return;const x=cx-tot/2+j*(bw+5),yy=y(v);
      s+=`<path class="${se.cls||'f-brand'}" d="M${x},${pt+ih}V${yy+5}q0,-5 5,-5h${Math.max(bw-10,1)}q5,0 5,5V${pt+ih}Z"><title>${esc(se.name)} - ${esc(l)}: ${fmt(v)}</title></path>`;
      if(showVals) s+=`<text class="val" x="${x+bw/2}" y="${yy-6}" text-anchor="middle">${r1(v)}</text>`;});
    s+=`<text class="axis" x="${cx}" y="${H-9}" text-anchor="middle">${esc(String(l).slice(0,14))}</text>`});
  return s+'</svg>';
}
function hbarsSVG({labels,values,max=4,fmt=v=>r2(v),colorFn}){
  const rowH=26,W=560,pl=150,H=labels.length*rowH+8;let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">`;
  labels.forEach((l,i)=>{const v=values[i],y=i*rowH+4,w=v==null?0:(clamp(v,0,max)/max)*(W-pl-50);
    s+=`<text class="axis" x="${pl-8}" y="${y+14}" text-anchor="end">${esc(String(l).slice(0,24))}</text><rect x="${pl}" y="${y+3}" width="${W-pl-50}" height="14" rx="7" fill="#F0F2F7"/>`;
    if(v!=null) s+=`<rect x="${pl}" y="${y+3}" width="${w}" height="14" rx="7" fill="${colorFn?colorFn(v):PAL[0]}"/><text class="val" x="${pl+w+6}" y="${y+14}">${fmt(v)}</text>`;});
  return s+'</svg>';
}
function lineSVG({labels,main,compare,H=230,yMin=0,yMax=4,ticks=[1,2,3,4],divider=null,dividerLabels=[],fmt=v=>r1(v)}){
  const W=640,pl=40,pr=16,pt=26,pb=32,iw=W-pl-pr,ih=H-pt-pb,n=labels.length,step=iw/(n-1||1);
  const x=i=>pl+i*step,y=v=>pt+ih-(clamp(v,yMin,yMax)-yMin)/(yMax-yMin||1)*ih;
  let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">`;
  if(divider!=null){const dx=(x(divider-1)+x(divider))/2;s+=`<rect x="${dx}" y="${pt-18}" width="${W-pr-dx+8}" height="${ih+18}" rx="8" fill="#F0F2F7" opacity=".55"/><text class="axis" x="${pl}" y="${pt-6}">${dividerLabels[0]||''}</text><text class="axis" x="${dx+10}" y="${pt-6}">${dividerLabels[1]||''}</text>`}
  ticks.forEach(t=>{s+=`<line class="gl" x1="${pl}" x2="${W-pr}" y1="${y(t)}" y2="${y(t)}"/><text class="axis" x="${pl-8}" y="${y(t)+4}" text-anchor="end">${t}</text>`});
  const path=vals=>{let d='',pen=false;vals.forEach((v,i)=>{if(v==null){pen=false;return}d+=(pen?'L':'M')+x(i)+','+y(v);pen=true});return d};
  if(compare) s+=`<path class="s-dash" d="${path(compare)}"/>`;
  const pts=main.map((v,i)=>v==null?null:[x(i),y(v)]).filter(Boolean);
  if(pts.length>1) s+=`<path class="area" d="M${pts[0][0]},${pt+ih}${pts.map(p=>'L'+p[0]+','+p[1]).join('')}L${pts[pts.length-1][0]},${pt+ih}Z"/>`;
  s+=`<path class="s-orange" d="${path(main)}"/>`;
  main.forEach((v,i)=>{if(v==null){s+=`<text class="axis" x="${x(i)}" y="${pt+ih-8}" text-anchor="middle" style="fill:var(--bad)">missing</text>`;return}
    const last=i===main.length-1||main.slice(i+1).every(z=>z==null);
    s+=`<circle class="${last?'dot-end':'dot-o'}" cx="${x(i)}" cy="${y(v)}" r="${last?5.5:4}"><title>${esc(labels[i])}: ${fmt(v)}</title></circle><text class="val" x="${x(i)}" y="${y(v)-11}" text-anchor="middle">${fmt(v)}</text>`});
  labels.forEach((l,i)=>{s+=`<text class="axis" x="${x(i)}" y="${H-10}" text-anchor="middle">${esc(String(l).slice(0,12))}</text>`});
  return s+'</svg>';
}
function donutSVG({labels,values,colors,donut=true,size=180,center}){
  const tot=sum(values)||1,R=size/2-4,r=donut?R*.58:0,cx=size/2,cy=size/2;let a0=-Math.PI/2,s=`<svg class="chart" viewBox="0 0 ${size+170} ${size}" role="img" style="max-width:${size+170}px">`;
  values.forEach((v,i)=>{if(!v)return;const a1=a0+v/tot*Math.PI*2,large=a1-a0>Math.PI?1:0;const p=(a,rr)=>[cx+rr*Math.cos(a),cy+rr*Math.sin(a)];
    const [x0,y0]=p(a0,R),[x1,y1]=p(a1,R),[x2,y2]=p(a1,r),[x3,y3]=p(a0,r);const full=v===tot;
    const d=full?`M${cx},${cy-R}A${R},${R} 0 1 1 ${cx-.01},${cy-R}Z`:(donut?`M${x0},${y0}A${R},${R} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${r},${r} 0 ${large} 0 ${x3},${y3}Z`:`M${cx},${cy}L${x0},${y0}A${R},${R} 0 ${large} 1 ${x1},${y1}Z`);
    s+=`<path d="${d}" fill="${(colors||PAL)[i%(colors||PAL).length]}" stroke="#fff" stroke-width="2"><title>${esc(labels[i])}: ${v}</title></path>`;a0=a1});
  if(donut&&center!=null) s+=`<text x="${cx}" y="${cy+5}" text-anchor="middle" class="val" style="font-size:16px">${esc(center)}</text>`;
  labels.forEach((l,i)=>{s+=`<rect x="${size+14}" y="${14+i*22}" width="10" height="10" rx="3" fill="${(colors||PAL)[i%(colors||PAL).length]}"/><text class="axis" x="${size+30}" y="${23+i*22}">${esc(l)} (${values[i]})</text>`});
  return s+'</svg>';
}
function histSVG({values,bins,labels,H=190}){      /* values: array of numbers; bins: [[lo,hi],...] */
  const counts=bins.map(([lo,hi])=>values.filter(v=>v!=null&&v>=lo&&v<hi).length);const mx=Math.max(...counts,1);
  const W=640,pl=34,pt=16,pb=30,ih=H-pt-pb,g=(W-pl-10)/bins.length;let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">`;
  counts.forEach((c,i)=>{const h=c/mx*ih,x=pl+i*g+2;s+=`<rect x="${x}" y="${pt+ih-h}" width="${g-4}" height="${h}" rx="3" fill="${PAL[0]}"><title>${labels[i]}: ${c}</title></rect><text class="val" x="${x+(g-4)/2}" y="${pt+ih-h-5}" text-anchor="middle">${c}</text><text class="axis" x="${x+(g-4)/2}" y="${H-10}" text-anchor="middle">${esc(labels[i])}</text>`});
  return s+`<line class="gl" x1="${pl}" x2="${W-10}" y1="${pt+ih}" y2="${pt+ih}"/></svg>`;
}
function radarSVG({labels,values,max=4,size=260}){
  const n=labels.length,cx=size/2,cy=size/2,R=size/2-34;const pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+R*(v/max)*Math.cos(a),cy+R*(v/max)*Math.sin(a)]};
  let s=`<svg class="chart" viewBox="0 0 ${size} ${size}" role="img" style="max-width:${size}px">`;
  [.25,.5,.75,1].forEach(f=>{s+=`<polygon points="${labels.map((_,i)=>pt(i,max*f).join(',')).join(' ')}" fill="none" stroke="#EAECF2"/>`});
  labels.forEach((l,i)=>{const [x,y]=pt(i,max*1.18);s+=`<text class="axis" x="${x}" y="${y+4}" text-anchor="middle">${esc(String(l).slice(0,12))}</text>`});
  s+=`<polygon points="${values.map((v,i)=>pt(i,v||0).join(',')).join(' ')}" fill="rgba(33,82,224,.18)" stroke="#2152E0" stroke-width="2"/>`;
  return s+'</svg>';
}
function heatHTML({rows,cols,get,fmt=v=>r1(v),max=4}){      /* get(r,c) => number|null */
  const col=v=>v==null?'#F0F2F7':['#FBE3E0','#FDEBD0','#DCE6FB','#CDEBDD'][lvOf(v)-1];
  return `<div class="heat" style="grid-template-columns:140px repeat(${cols.length},minmax(60px,1fr))"><div class="hd"></div>${cols.map(c=>`<div class="hd">${esc(c)}</div>`).join('')}${rows.map(r=>`<div class="hd" style="text-align:right">${esc(r)}</div>${cols.map(c=>{const v=get(r,c);return `<div style="background:${col(v)}">${v==null?'-':fmt(v)}</div>`}).join('')}`).join('')}</div>`;
}
function funnelHTML(stages){const mx=Math.max(...stages.map(s=>s.n),1);return `<div class="stack-s">${stages.map((s,i)=>{const prev=i?stages[i-1].n:null;return `<div><div class="row tight"><b class="sm">${esc(s.l)}</b><span class="muted sm">${s.n}${prev?` &middot; ${Math.round(s.n/prev*100)}% of previous &middot; drop-off ${prev-s.n}`:''}</span></div><div class="prog blue" style="height:12px"><i style="width:${s.n/mx*100}%"></i></div></div>`}).join('')}</div>`}
const VIZ={  /* visualisation options and which data kinds they suit */
  table:{l:'Table',kinds:['level','numeric','code','text','distribution']},
  chips:{l:'Level chips',kinds:['level','code']},
  bar:{l:'Bar graph',kinds:['level','numeric']},
  column:{l:'Column graph',kinds:['level','numeric']},
  histogram:{l:'Histogram',kinds:['level','numeric']},
  pie:{l:'Pie chart',kinds:['level','distribution']},
  donut:{l:'Donut chart',kinds:['level','distribution']},
  radar:{l:'Radar',kinds:['numeric','level']},
  heat:{l:'Heat grid',kinds:['level','numeric']},
};
const VIZICON={table:'<rect x="3" y="4" width="26" height="16" rx="2" fill="none" stroke="currentColor"/><path d="M3 10h26M3 15h26M13 4v16" stroke="currentColor"/>',chips:'<rect x="3" y="8" width="7" height="8" rx="2" fill="currentColor"/><rect x="12" y="8" width="7" height="8" rx="2" fill="currentColor" opacity=".6"/><rect x="21" y="8" width="7" height="8" rx="2" fill="currentColor" opacity=".3"/>',bar:'<path d="M3 5h22M3 12h16M3 19h10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',column:'<path d="M6 21V11M14 21V5M22 21V14" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',histogram:'<path d="M4 21V13h5v8M9 21V6h5v15M14 21V10h5v11M19 21V15h5v6" fill="currentColor" opacity=".8"/>',pie:'<circle cx="16" cy="12" r="9" fill="currentColor" opacity=".25"/><path d="M16 12V3a9 9 0 0 1 8 13Z" fill="currentColor"/>',donut:'<circle cx="16" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="5" opacity=".3"/><path d="M16 4a8 8 0 0 1 8 8" fill="none" stroke="currentColor" stroke-width="5"/>',radar:'<polygon points="16,3 27,10 23,21 9,21 5,10" fill="currentColor" opacity=".2" stroke="currentColor"/>',heat:'<rect x="3" y="3" width="8" height="8" fill="currentColor" opacity=".3"/><rect x="12" y="3" width="8" height="8" fill="currentColor" opacity=".7"/><rect x="21" y="3" width="8" height="8" fill="currentColor"/><rect x="3" y="12" width="8" height="8" fill="currentColor"/><rect x="12" y="12" width="8" height="8" fill="currentColor" opacity=".4"/><rect x="21" y="12" width="8" height="8" fill="currentColor" opacity=".6"/>'};
/* render a list of {label,value(1-4 or null),code?} in a chosen visualisation (used by report preview and designer) */
function vizRender(kind,items,{small=false}={}){
  const labels=items.map(i=>i.label),vals=items.map(i=>i.value);const lv=vals.map(lvOf);
  const dist=[1,2,3,4].map(l=>lv.filter(x=>x===l).length);
  if(kind==='chips') return `<div class="row tight">${items.map(i=>`<span class="row tight" style="gap:4px">${esc(i.label)} ${i.chip!=null?i.chip:lvChip(i.value)}</span>`).join('')}</div>`;
  if(kind==='bar') return hbarsSVG({labels,values:vals,colorFn:v=>['','#C9382F','#E0971A','#2152E0','#15855A'][lvOf(v)]});
  if(kind==='column') return barsSVG({labels,series:[{name:'Performance',values:vals,cls:'f-brand'}],H:small?150:190,yMin:0,yMax:4,ticks:[1,2,3,4]});
  if(kind==='histogram') return histSVG({values:vals,bins:[[0,1.5],[1.5,2.5],[2.5,3.5],[3.5,5]],labels:['Emerging','Expanding','Consolidating','Skilled'],H:small?150:190});
  if(kind==='pie'||kind==='donut') return donutSVG({labels:LV.slice(),values:dist,colors:['#C9382F','#E0971A','#2152E0','#15855A'],donut:kind==='donut',size:small?130:170,center:vals.filter(v=>v!=null).length+' skills'});
  if(kind==='radar') return radarSVG({labels,values:vals,size:small?210:250});
  if(kind==='heat') return heatHTML({rows:['Performance'],cols:labels,get:(r,c)=>vals[labels.indexOf(c)]});
  return table(['Skill','Performance'],items.map(i=>`<tr><td>${esc(i.label)}</td><td>${i.chip!=null?i.chip:lvChip(i.value)}</td></tr>`),{cls:'dense'});
}
