/* traceability.js - links every Phase 1 and Phase 2 breakdown row to a screen, the app shell, or a note saying it is backend only */
const SHELL_ROWS=['Platform Foundation / Single Sign-On for the Platform','Platform Foundation / Role and Permission Model','Platform Foundation / Grade, Subject and Organisation-Wide Scoping','Platform Foundation / In-App Notification Centre','Platform Foundation / Notification Service','Platform Foundation / Email Notification Delivery','Platform Foundation / Minimum Group Size Rule','Unification Layer / Governed Data Access Service'];
const BACKEND_ROWS=[
 ['Field Catalogue & Data Binding / Field Catalogue Registry','Shown as the Fields tab in the template designer'],
 ['Field Catalogue & Data Binding / Catalogue Mappings: Student, Attendance, Staff Roles','Fields from iSAMS appear in the designer and reports'],
 ['Field Catalogue & Data Binding / Catalogue Mappings: Canvas Scores, Rubric Levels, Feedback','Fields from Canvas appear in the designer and reports'],
 ['Field Catalogue & Data Binding / Achievements in Report Data and Snapshot','Achievements section in the report preview'],
 ['Block Designer / Template and Page Model','Stored templates; visible as the list of sections in the designer'],
 ['Rules Engine / Rules Evaluation Engine','Visible as results in reports and the rules simulator'],
 ['Report Generation & PDF Engine / Render Student, Header and Attendance Blocks','Visible in report previews'],
 ['Report Generation & PDF Engine / Render Text, Comment, Signature, Photo and Link Blocks','Visible in report previews'],
 ['Report Generation & PDF Engine / Render Matrix and Band Blocks','Visible in report previews'],
 ['Report Generation & PDF Engine / Generated Document Storage, Naming and Retrieval','Visible as the download pack names and links'],
 ['Roster & Class Sync / Class Roster Model','Feeds class lists across the app'],
 ['Roster & Class Sync / Canvas Enrolment Sync','Visible on the Rosters screens (changes and history)'],
 ['Unification Layer / Canonical People and Organisation Model','No screen. Effects: consistent names, classes and campuses everywhere'],
 ['Unification Layer / Canonical Academic Record Model','No screen. Effects: one results record shown in reports, profiles and insights'],
 ['Unification Layer / Ingestion Staging and Normalisation Pipeline','No screen. Effects: "Data as of" times and the data quality counts'],
 ['Unification Layer / Longitudinal Student Record with Effective Dating','Visible as Results over the years on the student profile'],
 ['Connector Framework / Connector Mock Servers and Contract Tests','Engineering only, no screen'],
 ['Platform Foundation / Application Security Hardening','Engineering only, no screen'],
 ['AI Platform & Governance / Governed Context Builder','No screen. Effects: assistant answers limited to the role'],
 ['AI Platform & Governance / Evaluation Harness and Test Sets','No screen. Flagged answers feed it from the AI governance review queue'],
 ['Insights: Ask and Narrate (LLM) / Role-Scoped Query Views and Row-Level Security','No screen. Effects: assistant answers limited to the role'],
 ['Insights: Ask and Narrate (LLM) / Natural-Language-to-Query Pipeline','The Ask SchoolOS conversation'],
 ['Data Source Integrations / iSAMS Attendance and Registration Data','Attendance on student profiles, dashboards and the assistant'],
 ['Data Source Integrations / Canvas Engagement and Class Attendance Data','Missing and late work on attention cases and the assistant'],
 ['Curriculum and Lesson Planning / Index Curriculum and Handbook Content for Retrieval','No screen. Effects: lesson plan suggestions cite approved resources'],
 ['Curriculum and Lesson Planning / Lesson Planning Test Set','Engineering only, no screen'],
 ['Teacher Insights / Faculty Test Questions and Evaluation','Engineering only, no screen'],
];
const ROWS_ADD={
 tpl:['Field Catalogue & Data Binding / Matrix Data Shape and Level Scales','Field Catalogue & Data Binding / Browse Catalogue in Designer','Block Designer / Add and Remove Blocks on a Page','Block Designer / Reorder Blocks','Block Designer / Autosave and Undo in the Designer','Block Designer / Settings Panel per Block Type','Block Designer / Bind a Block to Catalogue Fields','Block Designer / Page Setup and Page Break Rules','Block Designer / Live Preview','Block & Template Library / Student, Header and Attendance Blocks','Block & Template Library / Static Text and Legend Text Blocks','Block & Template Library / Comment Slot Block','Block & Template Library / Signature Block for Role Holders','Block & Template Library / Photo Block','Block & Template Library / Link to Units Block','Block & Template Library / Add a Matrix Block to a Page','Block & Template Library / Bind the Matrix to Levels and Scales','Block & Template Library / Participation, Progress and Feedback Line in the Matrix','Block & Template Library / Report Card Band Block','Block & Template Library / Achievements Block in Templates'],
 approvals:['Review & Approval / Review Queue per Approver Role','Review & Approval / Class Report Preview in the Queue'],
 'ach-map':['Comments Workspace / Map iSAMS Achievement Categories to Report Categories','Comments Workspace / Pull Achievements from iSAMS','Field Catalogue & Data Binding / Achievements in Report Data and Snapshot'],
 'dup-flags':['Comments Workspace / Coordinator Override of Duplicate Flags'],
 ask:['Insights: Rules-Based Detection and Charts / Trend and Comparison Chart Templates','Insights: Rules-Based Detection and Charts / Skill Heatmap and Distribution Templates','Insights: Rules-Based Detection and Charts / Student Timeline Template'],
 home:['Teacher Workspace / Launch Darwinbox from the Staff Home'],
 observe:['Class Observations / Open Next Steps and Actions for My Scope','Class Observations / Observation Access Rules'],
 observations:['Class Observations / Observation Access Rules'],
 portfolio:['Teacher Evidence Portfolio / Teacher-Class Assignment History','Teacher Evidence Portfolio / Class Results for Analytics','Teacher Evidence Portfolio / Calculate Relative Progress Against the Grade','Teacher Evidence Portfolio / Calculate Skill Movement','Teacher Evidence Portfolio / Summarise Observations for a Teacher and Year'],
 workload:['Teacher Workload / Timetable Snapshots by Term','Teacher Workload / Meeting Hours per Week per Teacher','Teacher Workload / Read Committee Memberships'],
 profile:['Darwinbox Staff Data / Read Staff Records from Darwinbox','Darwinbox Staff Data / Joiners, Leavers and Transfers','Darwinbox Staff Data / Past Leave and Balances','Darwinbox Staff Data / Designation and Role History','Platform Foundation / Reporting Line and Staff Data Scope'],
 plan:['AI Platform & Governance / Suggestion Review Component'],
 students:['Data Source Integrations / Extend Attention Case Detection with Attendance Signals'],
};
function applyRows(){Object.entries(ROWS_ADD).forEach(([id,rows])=>{const r=ROUTES[id];if(r)r.rows=uniq((r.rows||[]).concat(rows))});
  /* name fixes: use the exact breakdown names */
  const fix=(id,from,to)=>{const r=ROUTES[id];if(r)r.rows=(r.rows||[]).filter(x=>x!==from).concat(to||[])};
  fix('approvals','Review & Approval / Review Queue with Class Report Preview');fix('deadlines','Review & Approval / Overdue Approvals');fix('identity','Roster & Class Sync / Student identity review queue');fix('runs','Platform Foundation / Run controls')}
applyRows();
