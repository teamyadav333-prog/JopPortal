const defaultJobs = [
{id:1,title:"Junior Web Developer",company:"PixelCraft Labs",location:"Pune, Maharashtra",salary:450000,category:"Technology",type:"Full-time",mode:"Hybrid",posted:1,description:"Build responsive web pages and work with HTML, CSS, JavaScript and APIs."},
{id:2,title:"UI/UX Design Intern",company:"Bright Studio",location:"Remote",salary:180000,category:"Design",type:"Internship",mode:"Remote",posted:2,description:"Help design user-friendly digital products, wireframes and prototypes."},
{id:3,title:"Digital Marketing Executive",company:"Northstar Media",location:"Mumbai, Maharashtra",salary:380000,category:"Marketing",type:"Full-time",mode:"On-site",posted:3,description:"Support social media campaigns, content planning and marketing analytics."},
{id:4,title:"Frontend Developer Intern",company:"CloudNine Tech",location:"Remote",salary:150000,category:"Technology",type:"Internship",mode:"Remote",posted:4,description:"Learn modern frontend development while contributing to product features."},
{id:5,title:"Business Operations Associate",company:"FinEdge Solutions",location:"Nashik, Maharashtra",salary:320000,category:"Business",type:"Full-time",mode:"On-site",posted:5,description:"Coordinate daily operations, reports and communication across teams."},
{id:6,title:"Graphic Designer",company:"Orange Kite Creative",location:"Pune, Maharashtra",salary:300000,category:"Design",type:"Part-time",mode:"Hybrid",posted:6,description:"Create visual assets for web, social media and marketing materials."},
{id:7,title:"Java Developer Trainee",company:"CodeSpring Systems",location:"Mumbai, Maharashtra",salary:420000,category:"Technology",type:"Full-time",mode:"On-site",posted:7,description:"Work with Java fundamentals, databases and software development teams."},
{id:8,title:"Marketing Intern",company:"GoodReach",location:"Remote",salary:120000,category:"Marketing",type:"Internship",mode:"Remote",posted:8,description:"Research audiences, help create content and track campaign performance."}
];
const $ = id => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
let extraJobs = load("jobconnect-extra-jobs", []);
let jobs = [...extraJobs, ...defaultJobs];
let savedJobs = load("jobconnect-saved-jobs", []);
let toastTimer;
function notify(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800);}
function money(n){return n===0?"Salary not specified":"₹"+(n/100000).toFixed(n%100000===0?0:1)+" LPA";}
function initials(name){return name.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();}
function getFilters(){
 return {keyword:$("keyword").value.trim().toLowerCase(),location:$("location").value.trim().toLowerCase(),category:$("categoryFilter").value,types:[...document.querySelectorAll(".typeFilter:checked")].map(x=>x.value),modes:[...document.querySelectorAll(".modeFilter:checked")].map(x=>x.value)};
}
function renderJobs(){
 const f=getFilters();let list=jobs.filter(j=>{
  const text=(j.title+" "+j.company+" "+j.description+" "+j.category).toLowerCase();
  return (!f.keyword||text.includes(f.keyword))&&(!f.location||j.location.toLowerCase().includes(f.location)||j.mode.toLowerCase().includes(f.location))&&(!f.category||j.category===f.category)&&(!f.types.length||f.types.includes(j.type))&&(!f.modes.length||f.modes.includes(j.mode));
 });
 if($("sortJobs").value==="salary")list.sort((a,b)=>b.salary-a.salary);else list.sort((a,b)=>a.posted-b.posted);
 $("resultsText").textContent=`Showing ${list.length} opportunit${list.length===1?"y":"ies"}`;
 $("jobCount").textContent=jobs.length+"+";
 $("emptyState").hidden=list.length!==0;
 $("jobList").innerHTML=list.map(j=>`<article class="job-card"><div class="job-card-top"><div class="company-logo ${j.id%4===0?"c2":j.id%4===1?"":"c"+(j.id%4+1)}">${escapeHTML(initials(j.company))}</div><div><h3>${escapeHTML(j.title)}</h3><div class="company-name">${escapeHTML(j.company)}</div></div><button class="bookmark ${savedJobs.includes(j.id)?"saved":""}" data-save="${j.id}" title="Save job" aria-label="Save ${escapeHTML(j.title)}">${savedJobs.includes(j.id)?"♥":"♡"}</button></div><div class="job-meta"><span class="pill">⌖ ${escapeHTML(j.location)}</span><span class="pill">${escapeHTML(j.type)}</span><span class="pill">${escapeHTML(j.mode)}</span></div><div class="salary">${money(j.salary)} <small>/ year</small></div><p class="job-desc">${escapeHTML(j.description)}</p><div class="job-card-bottom"><span class="posted">${j.posted===0?"Just added":`Posted ${j.posted} day${j.posted===1?"":"s"} ago`}</span><button class="apply-btn" data-apply="${j.id}">Apply now →</button></div></article>`).join("");
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("searchForm").addEventListener("submit",e=>{e.preventDefault();renderJobs();$("jobs").scrollIntoView({behavior:"smooth"});});
document.querySelectorAll("[data-keyword]").forEach(b=>b.addEventListener("click",()=>{$("keyword").value=b.dataset.keyword;renderJobs();$("jobs").scrollIntoView({behavior:"smooth"});}));
$("categoryFilter").addEventListener("change",renderJobs);$("sortJobs").addEventListener("change",renderJobs);
document.querySelectorAll(".typeFilter,.modeFilter").forEach(c=>c.addEventListener("change",renderJobs));
$("clearFilters").addEventListener("click",()=>{document.querySelectorAll(".typeFilter,.modeFilter").forEach(c=>c.checked=false);$("categoryFilter").value="";$("keyword").value="";$("location").value="";renderJobs();});
$("resetSearch").addEventListener("click",()=>$("clearFilters").click());
$("jobList").addEventListener("click",e=>{
 const save=e.target.closest("[data-save]");if(save){const id=Number(save.dataset.save);savedJobs=savedJobs.includes(id)?savedJobs.filter(x=>x!==id):[...savedJobs,id];localStorage.setItem("jobconnect-saved-jobs",JSON.stringify(savedJobs));renderJobs();notify(savedJobs.includes(id)?"Job saved in this browser.":"Job removed from saved jobs.");return;}
 const apply=e.target.closest("[data-apply]");if(apply){const j=jobs.find(x=>x.id===Number(apply.dataset.apply));$("applyJobId").value=j.id;$("applyTitle").textContent="Apply: "+j.title;$("applyDialog").showModal();}
});
$("applyForm").addEventListener("submit",e=>{e.preventDefault();const apps=load("jobconnect-applications",[]);apps.push({jobId:Number($("applyJobId").value),jobTitle:$("applyTitle").textContent,name:$("applicantName").value.trim(),email:$("applicantEmail").value.trim(),note:$("applicantNote").value.trim(),submittedAt:new Date().toISOString()});localStorage.setItem("jobconnect-applications",JSON.stringify(apps));$("applyDialog").close();$("applyForm").reset();notify("Demo application saved in this browser.");});
$("postJobBtn").addEventListener("click",()=>$("postDialog").showModal());
$("postForm").addEventListener("submit",e=>{e.preventDefault();const job={id:Date.now(),title:$("newTitle").value.trim(),company:$("newCompany").value.trim(),location:$("newLocation").value.trim(),salary:Number($("newSalary").value),category:$("newCategory").value,type:$("newType").value,mode:$("newMode").value,posted:0,description:$("newDescription").value.trim()};extraJobs.unshift(job);localStorage.setItem("jobconnect-extra-jobs",JSON.stringify(extraJobs));jobs=[...extraJobs,...defaultJobs];$("postDialog").close();$("postForm").reset();renderJobs();notify("Sample job published in this browser.");$("jobs").scrollIntoView({behavior:"smooth"});});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).close()));
renderJobs();
