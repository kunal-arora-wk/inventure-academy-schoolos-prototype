/* data.js - seeded mock data. Everything here stands in for iSAMS / Canvas / aSc / Darwinbox. See docs/PLACEHOLDERS.md */
const TODAY={label:'Monday, 23 November 2026',short:'23 Nov 2026',dow:1};
const TERMS={t1:{label:'Term 1',dates:'May to Oct 2026'},t2:{label:'Term 2',dates:'Nov 2026 to Mar 2027'}};
const CYCLE={term:'t1',name:'Term 1 Progress Report',deadline:'Fri, 4 Dec 2026',tiers:{section:'Mon, 7 Dec 2026',hod:'Wed, 9 Dec 2026',principal:'Fri, 11 Dec 2026'}};
const CAMPUSES=[{id:'c1',name:'Sarjapur Road campus'},{id:'c2',name:'Campus 2'},{id:'c3',name:'Campus 3'}];
const campusName=id=>(CAMPUSES.find(c=>c.id===id)||{}).name;
const MONTHS=[{k:'may',l:'May',term:'t1',days:18},{k:'jun',l:'Jun',term:'t1',days:22},{k:'jul',l:'Jul',term:'t1',days:23},{k:'aug',l:'Aug',term:'t1',days:21},{k:'sep',l:'Sep',term:'t1',days:20},{k:'oct',l:'Oct',term:'t1',days:19},{k:'nov',l:'Nov',term:'t2',days:15}];

/* ---------- subject structure (from the two report templates) ---------- */
const SUBJ={
  english:{name:'English',groups:[
    {name:'Reading',cols:['Accuracy','Fluency','Comprehension'],rows:['Unit 1','Unit 2']},
    {name:'Writing',cols:['Structure','Elaboration','Language'],rows:['Unit 1','Unit 2']},
    {name:'Listening and Speaking',cols:['Preparedness','Following Instructions'],rows:['Unit 1','Unit 2']}]},
  hindi:{name:'Second Language (Hindi)',groups:[{name:'Skills',cols:['Performance'],rows:['Listening 1','Listening 2','Speaking 1','Speaking 2','Reading 1','Reading 2','Writing 1','Writing 2']}]},
  maths:{name:'Maths',groups:[{name:'Units',cols:['DoK1 Recall and Reproduce','DoK2 Concepts and Skills'],rows:['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5']}]},
  theme:{name:'Theme Based Learning',groups:[{name:'Units',cols:['Unistructural','Multistructural','Relational'],rows:['Unit 1','Unit 2','Unit 3','Unit 4','Unit 5']}]},
  computers:{name:'Computer Science',groups:[{name:'Skills',cols:['Performance'],rows:['Computational Thinking 1','Computational Thinking 2','Collaboration and Communication 1','Collaboration and Communication 2','Critical Thinking 1','Critical Thinking 2','Creativity 1','Creativity 2']}]},
  kannada:{name:'Kannada',groups:[{name:'Skills',cols:['Performance'],rows:['Listening','Speaking','Reading','Writing']}]},
  art:{name:'Art',groups:[{name:'Skills',cols:['Performance'],rows:['Creative Ability','Artistic Comprehension']}]},
};
const SUBJ_KEYS=Object.keys(SUBJ);
const BA_AREAS={Dance:['Body Awareness and Control','Quality of Movement'],Music:['Temporal Awareness','Expressiveness','Memory and Recall','Accuracy and Understanding','Rhythm and Sync','Command of Instrument','Creativity and Expression','Notation and Sight Reading'],Yoga:['Discipline','Assimilation of Information','Practice Technique']};
const SPORTS={Athletics:['Moving Concepts','Jumping','Standing Overhead Throw','Sportsmanship'],Basketball:['Dribbling','Shooting','Passing and Receiving','Sportsmanship'],Cricket:['Batting','Fielding and Throwing','Bowling','Sportsmanship'],Football:['Dribbling','Shooting','Passing and Receiving','Sportsmanship'],'Table Tennis':['Forehand Service','Forehand Counter','Backhand Counter','Sportsmanship'],Tennis:['Forehand Groundstroke','Backhand Groundstroke','Service','Sportsmanship']};
const SWIM={'Level 1':['Water confidence','Breathing','10 Meter glide','10 Meter freestyle glide and kick','10 Meter freestyle swim without breathing','10 Meter freestyle swim with breathing','Get object','Freestyle start (sitting dive)'],'Level 2':['25 M freestyle kick','25 M freestyle swim','25 M backstroke kick','25 M backstroke swim']};
const SCORE_GROUPS={'Academic Excellence':['Academic Achievement'],'Co-curricular Excellence':['Visual Art','Sports','Yoga','Dance','Music'],'Prepared for Life':['Creativity','Collaboration','Critical Thinking','Communication','Compassion','Curiosity','Making Choices']};
const PART=[['IM','Intrinsically motivated'],['EM','Extrinsically motivated'],['P','Passive'],['D','Non-contributive']];
const PROG=[['R','Rapid progress'],['S','Steady progress'],['O','Occasional assistance'],['N','Needs help']];
const BA_LEVELS=[['EVL','Evolving'],['DEV','Developing'],['ACH','Achieved'],['N/A','Absent or not applicable']];

/* ---------- people ---------- */
const FIRST=['Aarav','Diya','Kabir','Ananya','Vihaan','Meera','Saanvi','Reyansh','Ishaan','Aditi','Rohan','Tara','Krish','Myra','Advait','Kiara','Dhruv','Nisha','Aryan','Riya','Vivaan','Zara','Om','Anvi','Aanya','Yash','Ira','Neel','Sara','Parth','Avni','Kian','Pihu','Shaurya','Anika','Laksh','Mahika','Rudra','Inaya','Atharv','Navya','Ved','Prisha','Ayaan','Tanvi','Harsh','Aditya','Ishita','Karan','Leah','Manav','Nandini','Pranav','Rhea','Siddharth','Tanya','Uday','Vanya','Arnav','Bhavya','Chirag','Devika','Eshan','Fatima','Gauri','Hrithik','Jiya','Kavya','Lakshya','Mihir','Naina','Ojas','Pari','Qadir','Reva','Samar','Trisha','Utkarsh','Veda','Wriddhi','Yuvraj','Zoya'];
const LAST=['Mehta','Sharma','Iyer','Reddy','Kapoor','Nair','Gupta','Joshi','Menon','Kulkarni','Pillai','Bhat','Agarwal','Desai','Shetty','Malhotra','Hegde','Prabhu','Bose','Chatterjee','Sinha','Khan','Patil','Hebbar','Verma','Bansal','Ghosh','Kamath','Thomas','Jain','Srinivasan','Dsouza','Mishra','Nanda','Jacob','Rajan','Sood','Chawla','Qureshi','Kini','Ramesh','Saxena','Lobo','Fernandes','Murthy','Dutta','Shenoy','Roy','Bhatia','George','Arora','Iyengar','Krishnan','Varghese','Pai','Wadhwa','Kohli','Mathur','Gowda','Mehra','Tiwari','Sheikh','Rane','Shah'];
const STORY={'c1-1A':['Aarav Mehta','Diya Sharma','Kabir Iyer','Tara Bhat'],'c1-1D':['Ishaan Menon','Rhea Varghese','Om Patil'],'c1-3D':['Neel Kamath','Pihu Mishra','Karan Bhatia']};
const SIZES={'c1-1A':22,'c1-1D':24,'c1-3D':20};
const STORYDATA={
  'Diya Sharma':{ability:3.5,trend:-1.0,missing:3},
  'Kabir Iyer':{ability:3.0,trend:-.2,attDrop:true},
  'Aarav Mehta':{ability:2.9,trend:.5},
  'Tara Bhat':{ability:2.6,trend:.6},
  'Ishaan Menon':{ability:2.7,trend:-.3,missing:3},
  'Neel Kamath':{ability:3.0,trend:-.8},
  'Pihu Mishra':{ability:3.1,trend:-.1,attDrop:true},
  'Karan Bhatia':{ability:3.2,trend:0,missing:2},
  'Rhea Varghese':{ability:2.5,trend:.7},'Om Patil':{ability:3.4,trend:-.4},
};
const CLASSES={};const STUDENTS={};const STUDENT_LIST=[];
(function build(){
  const spec=[];
  for(let g=1;g<=8;g++){const secs=g<=5?['A','B','C','D']:['A','B','C'];secs.forEach(s=>spec.push(['c1',g,s]))}
  for(const c of ['c2','c3']) for(let g=1;g<=5;g++) ['A','B'].forEach(s=>spec.push([c,g,s]));
  spec.forEach(([c,g,s])=>{
    const id=`${c}-${g}${s}`,r=rng('cls'+id),n=SIZES[id]||(20+Math.floor(r()*5));
    const cl={id,campus:c,grade:g,sec:s,short:`${g}${s}`,section:g<=5?'Primary':'Middle',room:`R${100+g*10+'ABCD'.indexOf(s)}`,students:[]};
    const story=(STORY[id]||[]).slice();const used=new Set(story);
    for(let i=0;i<n;i++){
      let name=story.shift();
      if(!name){let k=0;do{name=FIRST[Math.floor(r()*FIRST.length)]+' '+LAST[Math.floor(r()*LAST.length)];k++}while(used.has(name)&&k<30);used.add(name)}
      const sid=`${id}-${String(i+1).padStart(2,'0')}`,sd=STORYDATA[name]||{};
      const st={id:sid,name,first:name.split(' ')[0],cls:id,campus:c,grade:g,sec:s,roll:i+1,enrol:`IA${26}${String(hashStr(sid)%90000+10000)}`,
        ability:sd.ability!=null?sd.ability:+(2.2+rnd(sid+'ab')*1.6).toFixed(2),trend:sd.trend!=null?sd.trend:+((rnd(sid+'tr')-.5)*.5).toFixed(2),
        missing:sd.missing!=null?sd.missing:(rnd(sid+'ms')>.86?2:rnd(sid+'ms')>.7?1:0),attDrop:!!sd.attDrop,story:!!STORYDATA[name]};
      STUDENTS[sid]=st;cl.students.push(sid);STUDENT_LIST.push(st);
    }
    CLASSES[id]=cl;
  });
})();
const cls=id=>CLASSES[id];
const studentsOf=cid=>CLASSES[cid].students.map(id=>STUDENTS[id]);
const clsLabel=c=>`Grade ${c.grade}${c.sec}`;

/* performance (rubric average, 1-4) - Canvas rubric scores converted by the rules engine */
const _pc={};
function perf(sid,term,subj,g,r,c){
  const k=sid+term+subj+g+r+c;if(_pc[k]!==undefined)return _pc[k];const s=STUDENTS[sid];
  let v=s.ability+(term==='t2'?s.trend:0)+(rnd(sid+subj)-.5)*.5+(rnd(k)-.5)*.9;
  if(term==='t2'&&rnd(k+'x')<.04) v=null; else v=clamp(Math.round(v*10)/10,1,4);
  return _pc[k]=v;
}
function subjCells(sid,term,subj){const out=[];SUBJ[subj].groups.forEach((gr,gi)=>gr.rows.forEach((_,ri)=>gr.cols.forEach((_c,ci)=>out.push(perf(sid,term,subj,gi,ri,ci)))));return out}
const subjAvg=(sid,term,subj)=>r2(avg(subjCells(sid,term,subj)));
const termAvg=(sid,term)=>r2(avg(SUBJ_KEYS.map(k=>subjAvg(sid,term,k))));
const groupAvg=(sid,term,subj,gi)=>{const gr=SUBJ[subj].groups[gi],o=[];gr.rows.forEach((_,ri)=>gr.cols.forEach((_c,ci)=>o.push(perf(sid,term,subj,gi,ri,ci))));return r2(avg(o))};
const skillAvg=(sid,term,subj,gi,ci)=>{const gr=SUBJ[subj].groups[gi];return r2(avg(gr.rows.map((_,ri)=>perf(sid,term,subj,gi,ri,ci))))};
const rowAvg=(sid,term,subj,gi,ri)=>{const gr=SUBJ[subj].groups[gi];return r2(avg(gr.cols.map((_,ci)=>perf(sid,term,subj,gi,ri,ci))))};
const priorYears=s=>{const out=[];const n=Math.min(s.grade-1,2);for(let i=n;i>=1;i--){const y=2026-i;out.push({y:`${y-1}-${String(y).slice(2)}`,t1:r2(clamp(s.ability+(rnd(s.id+'p'+i)-.5)*.5-.1*i,1,4)),t2:r2(clamp(s.ability+(rnd(s.id+'q'+i)-.5)*.5-.05*i,1,4))})}return out};

/* attendance */
function att(sid,mk){const s=STUDENTS[sid];let v=95.5+(rnd(sid+mk)-.5)*7+(rnd(sid+'a')-.5)*3;
  if(s.attDrop&&(mk==='oct'||mk==='nov'))v=mk==='oct'?84:75;
  if(s.name==='Diya Sharma'&&mk==='nov')v=89;
  return Math.round(clamp(v,70,100)*10)/10}
const monthsOf=t=>MONTHS.filter(m=>!t||m.term===t);
const attTerm=(sid,t)=>{const ms=monthsOf(t);return r1(sum(ms.map(m=>att(sid,m.k)*m.days))/sum(ms.map(m=>m.days)))};
const workingDays=t=>sum(monthsOf(t).map(m=>m.days));
const daysMissed=(sid,t)=>sum(monthsOf(t).map(m=>Math.round(m.days*(1-att(sid,m.k)/100))));
const lateDays=(sid,t)=>sum(monthsOf(t).map(m=>Math.round(rnd(sid+m.k+'late')*2.4)));
const missingWork=sid=>STUDENTS[sid].missing;
const repeatAbsence=sid=>att(sid,'nov')<92||(STUDENTS[sid].attDrop);

/* beyond academics, sports, swimming, scorecard (levels are entered in SchoolOS, no other system holds them) */
const BAL=['EVL','DEV','ACH'];
function baLevel(sid,term,area,item){const s=STUDENTS[sid];const v=rnd(sid+term+area+item)+(s.ability-3)*.25;return BAL[v>.62?2:v>.28?1:0]}
function scoreLevel(sid,term,item){return clamp(Math.round(s_ab(sid)+(rnd(sid+term+item)-.5)*1.2),1,4)}
function s_ab(sid){return STUDENTS[sid].ability}

/* ---------- staff (placeholder names except those named in the client templates) ---------- */
const STAFF=[];
(function(){
  const nm=['Anjali Rao','Lakshmi Nair','Meera Mudbidri','Rohit Verma','Debika Dasgupta','Dev Sharma','Suman Pillai','Farah Khan','Vikram Rao','Neha Kapoor','Arjun Bhatt','Sunita Das','Kiran Hegde','Pooja Menon','Ramesh Iyer','Geeta Joshi','Sandeep Nair','Anita Shetty','Mohan Kumar','Divya Reddy','Ajay Singh','Rekha Prasad','Tarun Mehta','Shalini Gupta'];
  const subs=['english','english','maths','maths','theme','theme','hindi','kannada','computers','art'];
  nm.forEach((n,i)=>{const subj=i===0||i===1?'english':subs[i%subs.length];STAFF.push({id:'st'+i,name:(i<4||i===4?'':'')+n,campus:i<20?'c1':(i<22?'c2':'c3'),dept:subj,designation:i===1?'Head of English':i===2?'Section Head (Primary)':i===3?'Grade Coordinator, Grade 1':'Teacher',joined:`${2012+i%12}-0${1+i%9}-15`,email:n.toLowerCase().replace(/ /g,'.')+'@inventureacademy.com',manager:i===0?'st1':i<4?'st2':'st'+(1+i%2)})});
  STAFF[0].name='Anjali Rao';
})();
const staffName=id=>{const s=STAFF.find(x=>x.id===id);return s?s.name:''};
const USERS={
  teacher:{key:'teacher',name:'Ms. Anjali Rao',role:'Teacher',tag:'English, Primary',campus:'c1',stid:'st0',classes:['c1-1A','c1-1D','c1-3D'],homeroom:['c1-1D'],subject:'english',owns:['Yoga'],reports:[]},
  grade:{key:'grade',name:'Mr. Rohit Verma',role:'Grade Coordinator',tag:'Grade 1',campus:'c1',stid:'st3',grade:1},
  hod:{key:'hod',name:'Mrs. Lakshmi Nair',role:'Subject Lead / HOD',tag:'English',campus:'c1',stid:'st1',subject:'english'},
  section:{key:'section',name:'Ms. Meera Mudbidri',role:'Section Head (Primary)',tag:'Primary, Grades 1 to 5',campus:'c1',stid:'st2',section:'Primary'},
  principal:{key:'principal',name:'Dr. Suresh Iyer',role:'Principal',tag:'Sarjapur Road campus',campus:'c1',stid:'stp'},
  ceo:{key:'ceo',name:'Mr. Karthik Sundaram',role:'CEO / Leadership',tag:'All campuses',all:true,stid:'stc'},
  admin:{key:'admin',name:'Ms. Deepa Kulkarni',role:'Academic Admin',tag:'Whole school',all:true,stid:'sta'},
  admissions:{key:'admissions',name:'Mr. Faisal Ahmed',role:'Admissions Team',tag:'All campuses',all:true,stid:'stf'},
  webknot:{key:'webknot',name:'Webknot Support',role:'Webknot Support',tag:'Operations',all:true,stid:'stw'},
};
STAFF.push({id:'stp',name:'Suresh Iyer',campus:'c1',dept:'leadership',designation:'Principal',joined:'2014-06-01',email:'suresh.iyer@inventureacademy.com',manager:'stc'},{id:'stc',name:'Karthik Sundaram',campus:'c1',dept:'leadership',designation:'CEO',joined:'2010-04-01',email:'karthik.sundaram@inventureacademy.com',manager:null});
const ROLE_ORDER=['teacher','grade','hod','section','principal','ceo','admin','admissions','webknot'];
const HEADS=['grade','hod','section','principal'];
/* access: which students may a user see (governed data access) */
function canSee(u,s){
  if(u.all)return u.key!=='admissions'&&u.key!=='webknot';
  if(u.key==='teacher')return u.classes.includes(s.cls);
  if(u.key==='grade')return s.campus===u.campus&&s.grade===u.grade;
  if(u.key==='hod')return s.campus===u.campus;               /* subject lead sees their subject across sections; student scope is the campus, data scope is the subject */
  if(u.key==='section')return s.campus===u.campus&&s.grade<=5;
  if(u.key==='principal')return s.campus===u.campus;
  return false;
}
const scopeStudents=u=>STUDENT_LIST.filter(s=>canSee(u,s));
const scopeClasses=u=>Object.values(CLASSES).filter(c=>c.students.some(id=>canSee(u,STUDENTS[id])));
function scopeLabel(u){
  return {teacher:'3 classes, 66 students',grade:'Grade 1, Sarjapur Road campus',hod:'English, all sections',section:'Primary, Grades 1 to 5',principal:'Sarjapur Road campus',ceo:'All 3 campuses',admin:'Whole school',admissions:'Admissions, all campuses',webknot:'Connectors and operations'}[u.key];
}
/* templates assigned to grades (admin can change in the template module) */
const TEMPLATE_DEFAULT={1:'tpl-new',2:'tpl-new',3:'tpl-old'};

/* ---------- timetable (aSc file) ---------- */
const PERIODS=[['P1','08:15','09:00'],['P2','09:05','09:50'],['P3','09:55','10:40'],['Break','10:40','11:00'],['P4','11:00','11:45'],['P5','11:50','12:35'],['Lunch','12:35','13:15'],['P6','13:15','14:00'],['P7','14:05','14:50']];
const TTPAT={1:['c1-1D','c1-1A',0,'c1-3D','c1-1A',0,'c1-1D'],2:['c1-1A','c1-3D','c1-1D',0,'c1-3D','c1-1D',0],3:['c1-3D',0,'c1-1A','c1-1D',0,'c1-3D','c1-1A'],4:['c1-1D','c1-1A','c1-3D',0,'c1-1A',0,'c1-1D'],5:['c1-1A',0,'c1-1D','c1-3D','c1-1D','c1-3D',0],6:['c1-3D','c1-1D','c1-1A',0,0,0,0]};
const PSLOTS=['P1','P2','P3','P4','P5','P6','P7'];
const ASC_ASOF='16 Nov 2026';
const HOLIDAYS={'2026-11-27':'School holiday'};
const dateOf=(off)=>{const d=new Date(Date.UTC(2026,10,23+off));return d};
const dkey=d=>d.toISOString().slice(0,10);
const dlabel=d=>d.toUTCString().slice(0,11).replace(',','');
