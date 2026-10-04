const photos=[
["Startup Conclave 2025","Event / Editorial - official coverage","01"],["SkatersClub","Community / Event - people, action, lifestyle","02"],
["Indian Army Projects","Documentary / Visual content - defence projects","03"],["i-Hub Gujarat","Event / Corporate - organizational photography","04"],
["AAWAZ Short Film","Film / Behind-the-scenes","05"],["Event Photography","Official coverage and storytelling","06"],
["Portrait Photography","People, character, expression","07"],["Street Photography","Public spaces and candid moments","08"],
["Lifestyle Photography","Natural movement, everyday stories","09"],["Brand Photography","Visual identity and campaigns","10"],
["Documentary Photography","Meaningful environments, real stories","11"],["Travel Photography","Places, journeys, atmosphere","12"],
["Editorial Photography","Directed frames, publication rhythm","13"],["Creative Visual Storytelling","Photography shaped by narrative","14"]];
const films=[["AAWAZ Short Film","Film / Behind-the-Scenes","19","01"],["Indian Army Projects","Documentary / Visual Content","20","02"],["Startup Conclave 2025","Event / Editorial Coverage","05","03"],["i-Hub Gujarat","Corporate / Organizational Media","12","04"]];
const boardIds=["03","07","10","11","13","15","16","18"];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const img=n=>`assets/images/photo-${n}.jpg`,fine=matchMedia("(pointer:fine)").matches;

$("#index").innerHTML=photos.map(([t,m,n],i)=>`<li class="rv"><a href="${img(n)}" data-img="${img(n)}"><em>${String(i+1).padStart(2,"0")}</em><h3>${t}</h3><p>${m}</p></a></li>`).join("");
$("#filmStrip").innerHTML=films.map(([t,m,p,v])=>`<button class="film-card rv" type="button" data-src="assets/videos/film-${v}.mp4" data-title="${t}" data-meta="${m}"><img src="${img(p)}" alt="Poster for ${t}" loading="lazy"><span class="film-info"><span class="play" aria-hidden="true">&#9654;</span><strong>${t}</strong><span>${m}</span></span></button>`).join("");

/* draggable board */
const area=$("#board-area");
area.innerHTML=boardIds.map(n=>`<div class="card" tabindex="0"><img src="${img(n)}" alt="" loading="lazy" draggable="false"></div>`).join("");
let z=1;
function scatter(){const W=area.clientWidth,H=area.clientHeight;$$(".card",area).forEach((c,i)=>{const cw=c.offsetWidth,ch=c.offsetHeight;c.style.left=Math.max(0,(W-cw)*((i*.37+.08)%1))+"px";c.style.top=Math.max(0,(H-ch)*((i*.53+.1)%1))+"px";c.style.transform=`rotate(${(i%2?1:-1)*(3+i*2.3%9)}deg)`})}
$$(".card",area).forEach(c=>{
 let sx,sy,ox,oy;
 c.addEventListener("pointerdown",e=>{c.setPointerCapture(e.pointerId);c.classList.add("drag");c.style.zIndex=++z;sx=e.clientX;sy=e.clientY;ox=c.offsetLeft;oy=c.offsetTop});
 c.addEventListener("pointermove",e=>{if(!c.classList.contains("drag"))return;
  const x=Math.min(area.clientWidth-c.offsetWidth,Math.max(0,ox+e.clientX-sx)),y=Math.min(area.clientHeight-c.offsetHeight,Math.max(0,oy+e.clientY-sy));c.style.left=x+"px";c.style.top=y+"px"});
 const up=()=>c.classList.remove("drag");c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);
});
scatter();let rw=innerWidth;addEventListener("resize",()=>{if(innerWidth!==rw){rw=innerWidth;scatter()}});

/* hover preview + cursor */
if(fine){
 const peek=$(".peek"),pi=$("img",peek),cur=$(".cursor");let mx=0,my=0,px=0,py=0;
 addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;cur.classList.add("on");cur.style.transform=`translate(${mx-7}px,${my-7}px)`});
 (function loop(){px+=(mx-px)*.14;py+=(my-py)*.14;peek.style.left=px+"px";peek.style.top=py+"px";requestAnimationFrame(loop)})();
 $$(".index a").forEach(a=>{a.addEventListener("mouseenter",()=>{pi.src=a.dataset.img;peek.classList.add("on");peek.style.scale=1});a.addEventListener("mouseleave",()=>{peek.classList.remove("on");peek.style.scale=.6})});
 $$("a,button,.card").forEach(el=>{el.addEventListener("mouseenter",()=>cur.classList.add("hov"));el.addEventListener("mouseleave",()=>cur.classList.remove("hov"))});
}

/* lightbox */
const lb=$("#lightbox"),lbImg=$("img",lb),lbT=$("strong",lb),lbM=$("figcaption span",lb),lbC=$("figcaption em",lb);
let li=0,lastFocus=null;
function showPhoto(i){li=(i+photos.length)%photos.length;const[t,m,n]=photos[li];lbImg.style.animation="none";lbImg.offsetWidth;lbImg.src=img(n);lbImg.alt=t;lbT.textContent=t;lbM.textContent=m;lbC.textContent=String(li+1).padStart(2,"0")+" / "+String(photos.length).padStart(2,"0");
 [1,-1].forEach(d=>{new Image().src=img(photos[(li+d+photos.length)%photos.length][2])})}
function openPhoto(i){lastFocus=document.activeElement;showPhoto(i);lb.classList.add("open");lb.setAttribute("aria-hidden","false");document.body.classList.add("viewing");$(".lb-close",lb).focus()}
function closePhoto(){if(!lb.classList.contains("open"))return;lb.classList.remove("open");lb.setAttribute("aria-hidden","true");document.body.classList.remove("viewing");lastFocus&&lastFocus.focus()}
$$(".index a").forEach((a,i)=>a.addEventListener("click",e=>{e.preventDefault();$(".peek").classList.remove("on");openPhoto(i)}));
$(".lb-close",lb).addEventListener("click",closePhoto);
$(".lb-nav.prev",lb).addEventListener("click",()=>showPhoto(li-1));
$(".lb-nav.next",lb).addEventListener("click",()=>showPhoto(li+1));
lb.addEventListener("click",e=>{if(e.target===lb||e.target.tagName==="FIGURE")closePhoto()});
let sx=null;lb.addEventListener("pointerdown",e=>{if(e.target===lbImg)sx=e.clientX});
lb.addEventListener("pointerup",e=>{if(sx===null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)showPhoto(li+(d<0?1:-1))});

/* custom video player */
const viewer=$("#videoViewer"),vid=$("#viewerVideo"),pl=$("#pl"),track=$("#plTrack"),fill=$(".pl-fill",pl),buf=$(".pl-buf",pl),knob=$(".pl-knob",pl);
const fmt=t=>{if(!isFinite(t))return"0:00";const m=Math.floor(t/60),s=Math.floor(t%60);return m+":"+String(s).padStart(2,"0")};
const speeds=[1,1.25,1.5,2,.5,.75];let si=0,idleT,seeking=false;
const toggle=()=>vid.paused?vid.play().catch(()=>{}):vid.pause();
function wake(){pl.classList.remove("idle");clearTimeout(idleT);if(!vid.paused)idleT=setTimeout(()=>pl.classList.add("idle"),2600)}
function paint(){const p=vid.duration?vid.currentTime/vid.duration*100:0;fill.style.width=p+"%";knob.style.left=p+"%";track.setAttribute("aria-valuenow",Math.round(p));$("#plCur").textContent=fmt(vid.currentTime);
 if(vid.buffered.length)buf.style.width=(vid.buffered.end(vid.buffered.length-1)/vid.duration*100||0)+"%"}
function openVideo(card){lastFocus=document.activeElement;$("#plTitle").textContent=card.dataset.title;$("#plMeta").textContent=card.dataset.meta||"";vid.src=card.dataset.src;vid.playbackRate=speeds[si];viewer.classList.add("open");viewer.setAttribute("aria-hidden","false");document.body.classList.add("viewing");vid.play().catch(()=>{});$(".viewer-close").focus()}
function closeVideo(){if(!viewer.classList.contains("open"))return;if(document.fullscreenElement)document.exitFullscreen();vid.pause();vid.removeAttribute("src");vid.load();pl.classList.remove("playing");viewer.classList.remove("open");viewer.setAttribute("aria-hidden","true");document.body.classList.remove("viewing");paint();lastFocus&&lastFocus.focus()}
$$(".film-card").forEach(c=>c.addEventListener("click",()=>openVideo(c)));
$(".viewer-close").addEventListener("click",closeVideo);
viewer.addEventListener("click",e=>{if(e.target===viewer)closeVideo()});
vid.addEventListener("click",toggle);$(".pl-big").addEventListener("click",toggle);$("#plPlay").addEventListener("click",toggle);
vid.addEventListener("play",()=>{pl.classList.add("playing");$("#plPlay").setAttribute("aria-label","Pause");wake()});
vid.addEventListener("pause",()=>{pl.classList.remove("playing");$("#plPlay").setAttribute("aria-label","Play");wake()});
vid.addEventListener("ended",()=>{pl.classList.remove("idle")});
vid.addEventListener("timeupdate",()=>{if(!seeking)paint()});vid.addEventListener("progress",paint);
vid.addEventListener("loadedmetadata",()=>{$("#plDur").textContent=fmt(vid.duration);paint()});
function seekTo(e){const r=track.getBoundingClientRect();const p=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));if(vid.duration){vid.currentTime=p*vid.duration;paint()}}
track.addEventListener("pointerdown",e=>{seeking=true;track.classList.add("seek");track.setPointerCapture(e.pointerId);seekTo(e)});
track.addEventListener("pointermove",e=>{if(seeking)seekTo(e)});
const endSeek=()=>{seeking=false;track.classList.remove("seek")};track.addEventListener("pointerup",endSeek);track.addEventListener("pointercancel",endSeek);
track.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){vid.currentTime+=5;e.stopPropagation()}if(e.key==="ArrowLeft"){vid.currentTime-=5;e.stopPropagation()}});
$("#plSpeed").addEventListener("click",()=>{si=(si+1)%speeds.length;vid.playbackRate=speeds[si];$("#plSpeed").textContent=speeds[si]+"x"});
const vol=$("#plVol");
$("#plMute").addEventListener("click",()=>{vid.muted=!vid.muted});
vol.addEventListener("input",()=>{vid.volume=vol.value;vid.muted=vol.value==0});
vid.addEventListener("volumechange",()=>{pl.classList.toggle("muted",vid.muted||vid.volume===0);vol.value=vid.muted?0:vid.volume});
function fs(){if(document.fullscreenElement){document.exitFullscreen();return}
 if(pl.requestFullscreen)pl.requestFullscreen();else if(vid.webkitEnterFullscreen)vid.webkitEnterFullscreen()}
$("#plFs").addEventListener("click",fs);vid.addEventListener("dblclick",fs);
["pointermove","pointerdown","keydown"].forEach(ev=>pl.addEventListener(ev,wake));
addEventListener("keydown",e=>{
 if(e.key==="Escape"){closeVideo();closePhoto();navTo(false);return}
 if(lb.classList.contains("open")){if(e.key==="ArrowRight")showPhoto(li+1);if(e.key==="ArrowLeft")showPhoto(li-1)}
 if(viewer.classList.contains("open")&&!e.target.matches("input")){
  if(e.key===" "||e.key==="k"){e.preventDefault();toggle()}
  if(e.key==="ArrowRight")vid.currentTime+=5;if(e.key==="ArrowLeft")vid.currentTime-=5;
  if(e.key==="f")fs();if(e.key==="m")vid.muted=!vid.muted}
});

/* nav */
const btn=$(".menu-button");
function navTo(o){document.body.classList.toggle("nav-open",o);btn.setAttribute("aria-expanded",o)}
btn.addEventListener("click",()=>navTo(!document.body.classList.contains("nav-open")));
$$(".site-nav a").forEach(a=>a.addEventListener("click",()=>navTo(false)));

/* reveal + hero parallax */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
$$(".rv").forEach(el=>io.observe(el));
const hm=$(".hero-media img");let tick=false;
addEventListener("scroll",()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{const y=scrollY;if(y<innerHeight*1.2)hm.style.transform=`translateY(${y*.12}px) scale(${1+y/4000})`;tick=false})},{passive:true});
$$("img").forEach(i=>i.addEventListener("error",()=>console.error("Media failed:",i.currentSrc)));

/* hero portrait: colour reveal grows from the pointer, only while it is over the person (silhouette hit-test) */
(function(){
 const p=$("#portrait");if(!p)return;const co=$(".p-co",p),cur=$(".cursor");
 const MW=128,MH=192,bytes=Uint8Array.from(atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAT4AAAAAAAAAAAAAAAAAAAH5AAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAABv/5AAAAAAAAAAAAAAAAAA///wAAAAAAAAAAAAAAAAAH///AAAAAAAAAAAAAAAAAX///4AAAAAAAAAAAAAAAAf///+AAAAAAAAAAAAAAAAb////gAAAAAAAAAAAAAAAB/////wAAAAAAAAAAAAAAD/////+AAAAAAAAAAAAAAA//////gAAAAAAAAAAAAAAP/////8AAAAAAAAAAAAAAD/////+AAAAAAAAAAAAAAD/////+wAAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAP//////AAAAAAAAAAAAAAD//////4AAAAAAAAAAAAAAf/////+AAAAAAAAAAAAAAH//////QAAAAAAAAAAAAAB//////0AAAAAAAAAAAAAB//////+AAAAAAAAAAAAAAf//////AAAAAAAAAAAAAAf//////wAAAAAAAAAAAAAP//////8AAAAAAAAAAAAAD///////gAAAAAAAAAAAAA///////wAAAAAAAAAAAAAN//////8AAAAAAAAAAAAAD///////AAAAAAAAAAAAAAf//////wAAAAAAAAAAAAAH//////8AAAAAAAAAAAAAA///////AAAAAAAAAAAAAABv/////wAAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAD/////+AAAAAAAAAAAAAAAB/////gAAAAAAAAAAAAAAAP////4AAAAAAAAAAAAAAB//////AAAAAAAAAAAAAAAP//////AAAAAAAAAAAAAAB3/////4AAAAAAAAAAAAAAJ//////wAAAAAAAAAAAAAAP//////AAAAAAAAAAAAAAD///////AAAAAAAAAAAAAA////////8AAAAAAAAAAAAH////////wAAAAAAAAAAAA/////////AAAAAAAAAAAAH////////4AAAAAAAAAAAA/////////gAAAAAAAAAAAH////////4AAAAAAAAAAAAf////////AAAAAAAAAAAAP////////4AAAAAAAAAAAH/////////AAAAAAAAAAAH/////////wAAAAAAAAAAH/////////+AAAAAAAAAAH//////////wAAAAAAAAAD//////////8AAAAAAAAAD///////////gAAAAAAAAB///////////4AAAAAAAAA////////////AAAAAAAAAf///////////wAAAAAAAAP///////////8AAAAAAAAD////////////gAAAAAAAB////////////4AAAAAAAAf////////////AAAAAAAAH////////////wAAAAAAAD////////////8AAAAAAAA/////////////AAAAAAAAP////////////4AAAAAAAD////////////+AAAAAAAB/////////////gAAAAAAAf////////////8AAAAAAAH/////////////AAAAAAAB/////////////wAAAAAAAf////////////8AAAAAAAH/////////////gAAAAAAB/////////////4AAAAAAAf////////////+AAAAAAAH/////////////gAAAAAAB/////////////8AAAAAAA//////////////AAAAAAAP/////////////wAAAAAAD/////////////8AAAAAAA//////////////gAAAAAAf/////////////4AAAAAAH/////////////+AAAAAAB//////////////gAAAAAAf/////////////4AAAAAAH//////////////AAAAAAD//////////////wAAAAAA//////////////8AAAAAAP//////////////AAAAAAD//////////////4AAAAAA//////////////+AAAAAAf//////////////gAAAAAH//////////////4AAAAAB///////////////AAAAAAf//////////////wAAAAAH//////////////8AAAAAD///////////////AAAAAA///////////////wAAAAAP//////////////4AAAAAD//////////////8AAAAAA//////////////+AAAAAAf//////////////gAAAAAH//////////////4AAAAAB//////////////+AAAAAAf//////////////gAAAAAB//////////////4AAAAAAD/////////////+AAAAAAA//////////////gAAAAAAf/////////////4AAAAAAH/////////////8AAAAAAB//////////////AAAAAAA//////////////gAAAAAAP/////////////4AAAAAAH/////////////+AAAAAAB//////////////AAAAAAAf/////////////wAAAAAAH/////////////4AAAAAAD/////////////+AAAAAAA//////////////AAAAAAAP/////////////wAAAAAAD/////////////4AAAAAAA/////////////+AAAAAAAP/////////////gAAAAAAH/////////////wAAAAAAB/////////////8AAAAAAAf////////////+AAAAAAAH/////////////AAAAAAAB/////////////wAAAAAAAf////////////4AAAAAAAH////////////+AAAAAAAD/////////////AAAAAAAA/////////////gAAAAAAAP////////////4AAAAAAAD////////////+AAAAAAAA/////////////gAAAAAAAf////////////4AAAAAAAH////////////+AAAAAAAB/////////////gAAAAAAAf////////////4AAAAAAAP////////////+AAAAAAAD/////////////gAAAAAAA/////////////4AAAAAAAP////////////8AAAAAAAH/////////////AAAAAAAB/////////////gAAAAAAAf////////////4AAAAAAAH////////////+AAAAAAAB/////////////AAAAAAAAf////////////wAAAAAAAH////////////+AAAAAAAB/////////////gAAAAAAAf////////////4AAAAAAAH////////////+AAAAAAAD/////////////AAAAAAAA/////////////wAAAAAAAP////////////8AAAAAAAB/////////////AAAAAAAAf////////////wAAAAAAAP////////////8AAAAAAAD////////////+AAAAAAAA/////////////AAAAAAAAP////////////wAAAAAAAD////////////8AAAAAAAA/////////////AAAAAAAAP////////////wAAAAAAAD////////////+AAAAAAAA/////////////gAAAAAAAP////////////4AAAAAAAD////////////+AAAAAAAB/////////////gAAAAAAAf////////////wAAAAAAAH////////////+AAAAAAAB/////////////gAAAAAAA/////////////8AAAAAAAP/////////////AAAAAAAD/////////////wAAAAAAA/////////////+AAAAAAAP/////////////gAAAAAAB/////////////4AAAA"),c=>c.charCodeAt(0));
 const solid=(px,py)=>{const x=Math.floor(px*MW),y=Math.floor(py*MH);if(x<0||y<0||x>=MW||y>=MH)return false;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=MW||Y>=MH)continue;const k=Y*MW+X;if((bytes[k>>3]>>(7-(k&7)))&1)return true}return false};
 const pos=e=>{const r=p.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
 const origin=(x,y)=>{co.style.setProperty("--x",x*100+"%");co.style.setProperty("--y",y*100+"%")};
 function set(on,e,x,y){if(on===p.classList.contains("on"))return;origin(x,y);p.classList.toggle("on",on);if(on)p.classList.add("seen");if(cur)cur.classList.toggle("hov",on&&e.pointerType!=="touch")}
 p.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const[x,y]=pos(e);set(solid(x,y),e,x,y)});
 p.addEventListener("pointerleave",e=>{if(e.pointerType==="touch")return;const[x,y]=pos(e);set(false,e,x,y)});
 p.addEventListener("click",e=>{if(e.pointerType==="mouse")return;const[x,y]=pos(e);if(!solid(x,y))return;origin(x,y);p.classList.toggle("on");p.classList.add("seen")});
})();
