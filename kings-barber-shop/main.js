
// ── Visibility-gated rAF for canvas perf ──
(function(){
  var canvasIds = ['hero-canvas','hero-particles','heritage-canvas',
                   'cta-particles','k-aurora','ftr-wave-cv'];
  document.querySelectorAll('.aurora-cv, .wave-cv').forEach(function(c){
    if(c.id) canvasIds.push(c.id);
  });
  var visMap = new Map();
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      visMap.set(e.target, e.isIntersecting);
    });
  }, {rootMargin: '100px'});
  canvasIds.forEach(function(id){
    var el = document.getElementById(id);
    if(el){ obs.observe(el); visMap.set(el, false); }
  });
  document.querySelectorAll('.aurora-cv, .wave-cv').forEach(function(el){
    obs.observe(el); visMap.set(el, false);
  });
  window.__cvVis = function(el){ return visMap.get(el) !== false; };
})();


(function(){
  // Preloader
  const lt=document.getElementById('loader-text');
  const name="KING'S BARBER";
  lt.innerHTML=name.split('').map((c,i)=>`<span style="animation-delay:${.3+i*0.05}s">${c===' '?'&nbsp;':c}</span>`).join('');
  setTimeout(()=>{document.getElementById('loader').classList.add('done');document.body.classList.add('loaded')},2400);

  // Custom cursor
  const cursor=document.getElementById('cursor'),dot=document.getElementById('cursor-dot');
  let mx=0,my=0,cx=0,cy=0;
  if(cursor&&window.innerWidth>640){
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.classList.add('active');dot.classList.add('active')});
    function animC(){cx+=(mx-cx)*.12;cy+=(my-cy)*.12;cursor.style.left=cx+'px';cursor.style.top=cy+'px';dot.style.left=mx+'px';dot.style.top=my+'px';requestAnimationFrame(animC)}
    animC();
    document.querySelectorAll('a,button,.svc-card,.rev-card').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
    });
  }

  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{const rect=btn.getBoundingClientRect();const x=e.clientX-rect.left-rect.width/2;const y=e.clientY-rect.top-rect.height/2;btn.style.transform=`translate(${x*.25}px,${y*.35}px)`});
    btn.addEventListener('mouseleave',()=>{btn.style.transform=''});
  });

  // Text split
  document.querySelectorAll('[data-split]').forEach(el=>{
    const raw=el.innerHTML;const parts=raw.split(/(&[^;]+;|<[^>]+>)/g);let ci=0;
    el.innerHTML=parts.map(part=>{
      if(part.startsWith('&')){ci++;return `<span class="char" style="animation-delay:${2.2+ci*0.04}s">${part}</span>`}
      if(part.startsWith('<'))return part;
      return part.split('').map(c=>{
        if(c===' '){ci++;return '<span style="display:inline-block;width:.2em"></span>'}
        const s=`<span class="char" style="animation-delay:${2.2+ci*0.04}s">${c}</span>`;ci++;return s
      }).join('');
    }).join('');
  });

  // Scroll reveal (includes clip-rv)
  const io=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});},{threshold:.06,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.rv,.rv-l,.rv-r,.clip-rv').forEach(el=>io.observe(el));

  // ── CTA PARTICLES — subtle floating motes ──
  const ctaCv=document.getElementById('cta-particles');
  if(ctaCv){
    const ctx2=ctaCv.getContext('2d');let cw2,ch2;const motes=[];
    function cResize(){cw2=ctaCv.width=ctaCv.parentElement.offsetWidth;ch2=ctaCv.height=ctaCv.parentElement.offsetHeight}
    cResize();window.addEventListener('resize',cResize);
    for(let i=0;i<30;i++)motes.push({x:Math.random()*2000,y:Math.random()*1200,vy:-(Math.random()*.25+.08),r:Math.random()*2.5+.8,a:Math.random()*.12+.02,drift:Math.random()*6.28});
    function drawMotes(){
      ctx2.clearRect(0,0,cw2,ch2);const t=performance.now()*.001;
      motes.forEach(m=>{
        m.y+=m.vy;m.x+=Math.sin(t*.4+m.drift)*.25;
        if(m.y<-10){m.y=ch2+10;m.x=Math.random()*cw2}
        const a=m.a*(.5+.5*Math.sin(t*1.8+m.drift));
        ctx2.beginPath();ctx2.arc(m.x,m.y,m.r,0,6.28);ctx2.fillStyle=`rgba(139,45,32,${a})`;ctx2.fill();
        ctx2.beginPath();ctx2.arc(m.x,m.y,m.r*3.5,0,6.28);ctx2.fillStyle=`rgba(139,45,32,${a*.06})`;ctx2.fill();
      });
      requestAnimationFrame(drawMotes);
    }
    drawMotes();
  }

  // ── MOMENTUM GALLERY ──
  function initMG(id){
    const tr=document.getElementById(id);if(!tr)return;
    const FR=.95,MV=60,HN=5,DT=6;
    let isDr=false,sX=0,sS=0,vel=0,aId=null,dDr=false,aPid=null,hist=[];
    function maxS(){return tr.scrollWidth-tr.clientWidth}
    function stopM(){if(aId!==null){cancelAnimationFrame(aId);aId=null}}
    function coast(){vel*=FR;if(Math.abs(vel)<.5){vel=0;aId=null;return}tr.scrollLeft+=vel;if(tr.scrollLeft<=0||tr.scrollLeft>=maxS()){vel=0;aId=null;return}aId=requestAnimationFrame(coast)}
    function cVel(){if(hist.length<2)return 0;const f=hist[0],l=hist[hist.length-1],dt=l.t-f.t;return dt===0?0:((f.x-l.x)/dt)*16}
    tr.addEventListener('pointerdown',e=>{if(aPid!==null)return;stopM();aPid=e.pointerId;isDr=true;dDr=false;sX=e.clientX;sS=tr.scrollLeft;vel=0;hist=[{x:e.clientX,t:Date.now()}];tr.setPointerCapture(e.pointerId);tr.style.cursor='grabbing'});
    tr.addEventListener('pointermove',e=>{if(!isDr||e.pointerId!==aPid)return;const dx=e.clientX-sX;if(Math.abs(dx)>DT)dDr=true;tr.scrollLeft=sS-dx;hist.push({x:e.clientX,t:Date.now()});if(hist.length>HN)hist.shift()},{passive:true});
    tr.addEventListener('pointerup',e=>{if(!isDr||e.pointerId!==aPid)return;isDr=false;aPid=null;tr.style.cursor='grab';vel=cVel();vel=Math.max(-MV,Math.min(MV,vel));if(Math.abs(vel)>.5)aId=requestAnimationFrame(coast)});
    tr.addEventListener('pointercancel',e=>{if(e.pointerId!==aPid)return;isDr=false;aPid=null;tr.style.cursor='grab'});
    tr.addEventListener('click',e=>{if(dDr){e.preventDefault();e.stopPropagation();dDr=false}},true);
    tr.addEventListener('dragstart',e=>e.preventDefault());
    tr.style.cursor='grab';tr.style.overflowX='auto';tr.style.scrollbarWidth='none';
  }
  initMG('svc-track');
  initMG('k-gallery-track');

  // ── TEXT SCRAMBLE ──
  (function(){
    const SC='!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
    const els=document.querySelectorAll('.scramble');if(!els.length)return;
    const done=new WeakSet();
    function rC(){return SC[Math.floor(Math.random()*SC.length)]}
    function scramble(el){
      if(done.has(el))return;done.add(el);
      const orig=el.textContent;const chars=orig.split('');
      const st=chars.map(c=>({target:c,current:c===' '?' ':rC(),resolved:c===' ',cycles:4}));
      el.textContent=st.map(s=>s.current).join('');
      let ci=0;
      for(let i=0;i<chars.length;i++){if(st[i].resolved)continue;
        ((idx,delay)=>{setTimeout(()=>{st[idx].resolved=true;st[idx].current=st[idx].target;el.textContent=st.map(s=>s.current).join('')},delay+200)})(i,ci*30);ci++}
      const tick=setInterval(()=>{let any=false;for(let j=0;j<st.length;j++){if(!st[j].resolved){st[j].current=rC();any=true}}if(!any){clearInterval(tick);return}el.textContent=st.map(s=>s.current).join('')},50);
    }
    const sObs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){scramble(e.target);sObs.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -50px 0px'});
    els.forEach(el=>sObs.observe(el));
  })();

  // ── CURSOR TRAIL PARTICLES ──
  (function(){
    if(window.innerWidth<=640)return;
    const cv=document.createElement('canvas');cv.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(cv);const ctx=cv.getContext('2d');
    const dpr=window.devicePixelRatio||1;
    function sz(){cv.width=window.innerWidth*dpr;cv.height=window.innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    sz();window.addEventListener('resize',sz,{passive:true});
    let mx=-100,my=-100,last=0;const P=[];
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
    function tick(now){
      requestAnimationFrame(tick);ctx.clearRect(0,0,cv.width,cv.height);
      if(now-last>=40&&mx>0){const a=Math.random()*6.28,sp=Math.random()*.6;P.push({x:mx,y:my,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:2+Math.random()*2,born:now});if(P.length>50)P.shift();last=now}
      let alive=[];for(let i=0;i<P.length;i++){const p=P[i],age=now-p.born;if(age>=600)continue;const t=age/600;p.x+=p.vx;p.y+=p.vy;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(p.r*(1-t*.7),.5),0,6.28);ctx.fillStyle=`rgba(139,45,32,${(1-t).toFixed(3)})`;ctx.fill();alive.push(p)}P.length=0;P.push(...alive);
    }
    requestAnimationFrame(tick);
  })();

  // ── IMAGE WIPE REVEAL ──
  (function(){
    const sty=document.createElement('style');sty.textContent='.img-wipe{clip-path:inset(0 100% 0 0);transition:clip-path 1.2s cubic-bezier(.16,1,.3,1);will-change:clip-path}.img-wipe[data-wipe="right"]{clip-path:inset(0 0 0 100%)}.img-wipe[data-wipe="up"]{clip-path:inset(100% 0 0 0)}.img-wipe.is-revealed{clip-path:inset(0 0 0 0)!important}';
    document.head.appendChild(sty);
    const els=document.querySelectorAll('.img-wipe');
    const items=[];els.forEach(el=>{const dir=(el.getAttribute('data-wipe')||'left');items.push({el,dir,done:false})});
    let ticking=false;
    function check(){
      items.forEach(it=>{if(it.done)return;const r=it.el.getBoundingClientRect();const vh=window.innerHeight;const p=Math.max(0,Math.min(1,(vh-r.top)/(vh-vh*.35)));
        if(p>=1){it.el.classList.add('is-revealed');it.done=true;return}
        const h=(1-p)*100;let cp;
        if(it.dir==='right')cp=`inset(0 0 0 ${h.toFixed(1)}%)`;else if(it.dir==='up')cp=`inset(${h.toFixed(1)}% 0 0 0)`;else cp=`inset(0 ${h.toFixed(1)}% 0 0)`;
        it.el.style.transition='none';it.el.style.clipPath=cp;
      });ticking=false;
    }
    window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(check)}},{passive:true});
    requestAnimationFrame(check);
  })();

  // ── AURORA CANVAS — crimson waves ──
  (function(){
    const cv=document.getElementById('k-aurora');if(!cv)return;
    const ctx=cv.getContext('2d');let w,h;
    function sz(){w=cv.width=cv.parentElement.offsetWidth;h=cv.height=cv.parentElement.offsetHeight}
    sz();window.addEventListener('resize',sz);
    const layers=[{speed:.0004,freq:1.2,amp:.35,phase:0,hue:0,op:.025},{speed:.0006,freq:.8,amp:.3,phase:1.5,hue:8,op:.03},{speed:.0003,freq:1.5,amp:.25,phase:3,hue:14,op:.035},{speed:.0005,freq:1,amp:.4,phase:4.5,hue:20,op:.02}];
    function draw(time){
      ctx.clearRect(0,0,w,h);
      layers.forEach(L=>{const t=time*L.speed+L.phase;ctx.beginPath();ctx.moveTo(0,h);
        for(let x=0;x<=w;x+=4){const nx=x/w;const y=h*.5+Math.sin(nx*Math.PI*2*L.freq+t)*h*L.amp*.5+Math.sin(nx*Math.PI*3.7+t*1.3)*h*L.amp*.25+Math.sin(nx*Math.PI*.5+t*.7)*h*L.amp*.15;ctx.lineTo(x,y)}
        ctx.lineTo(w,h);ctx.closePath();const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,`hsla(${L.hue},85%,35%,${L.op})`);g.addColorStop(.5,`hsla(${L.hue+5},90%,25%,${L.op*1.2})`);g.addColorStop(1,`hsla(${L.hue+10},80%,30%,${L.op*.8})`);ctx.fillStyle=g;ctx.fill();
      });requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  // ── WAVE CANVAS (footer) ──
  (function(){
    const cv=document.getElementById('ftr-wave-cv');if(!cv)return;
    const ctx=cv.getContext('2d');const color=cv.dataset.color||'139,45,32';
    const yS=parseFloat(cv.dataset.y)||0;let cw,ch;
    function sz(){cw=cv.width=cv.parentElement.offsetWidth;ch=cv.height=cv.parentElement.offsetHeight}
    sz();window.addEventListener('resize',sz);
    function drawW(){
      ctx.clearRect(0,0,cw,ch);const t=performance.now()*.0006;
      for(let l=0;l<4;l++){
        ctx.beginPath();const amp=ch*(.05+l*.025);const freq=.004-l*.0005;const spd=t*(1+l*.2);
        const yB=ch*yS+l*ch*.07;ctx.moveTo(0,ch);
        for(let x=0;x<=cw;x+=3){const y=yB+Math.sin(x*freq+spd)*amp+Math.sin(x*freq*2.1+spd*1.5)*amp*.3;ctx.lineTo(x,y)}
        ctx.lineTo(cw,ch);ctx.closePath();ctx.fillStyle=`rgba(${color},${.035+l*.02})`;ctx.fill();
      }
      requestAnimationFrame(drawW);
    }
    drawW();
  })();

  // Parallax
  if(window.innerWidth>640){
    const pxEls=document.querySelectorAll('.cin-bg img,.bigtype-bg img,.cta-bg img,.k-about-img img');
    window.addEventListener('scroll',()=>{
      pxEls.forEach(img=>{
        const sec=img.closest('.cin,.bigtype,.cta,.k-about');if(!sec)return;
        const rect=sec.getBoundingClientRect();
        if(rect.bottom<0||rect.top>window.innerHeight)return;
        const p=(window.innerHeight-rect.top)/(window.innerHeight+rect.height);
        img.style.transform=`translateY(${(p-.5)*30}px)scale(1.08)`;
      });
    },{passive:true});
    const heroImg=document.querySelector('.hero-iw img');
    if(heroImg){
      window.addEventListener('scroll',()=>{const y=window.scrollY;if(y<window.innerHeight*1.5)heroImg.style.transform=`scale(${1.12-y*.00008}) translateY(${y*.08}px)`},{passive:true});
    }
  }

  // Nav
  const nav=document.querySelector('.nav');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>100),{passive:true});

  // Scroll spy
  const sections=document.querySelectorAll('[id]');const navLinks=document.querySelectorAll('[data-spy]');
  const spyObs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){navLinks.forEach(l=>l.classList.remove('active'));const link=document.querySelector(`[data-spy][href="#${e.target.id}"]`);if(link)link.classList.add('active');}});},{threshold:.15,rootMargin:'-80px 0px -50% 0px'});
  sections.forEach(s=>spyObs.observe(s));

  // Counter
  document.querySelectorAll('.counter[data-target]').forEach(el=>{
    const target=parseInt(el.dataset.target);
    const cObs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){cObs.unobserve(e.target);const start=performance.now();function tick(now){const p=Math.min((now-start)/1200,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}});},{threshold:.5});
    cObs.observe(el);
  });

  // ── SCROLL PROGRESS BAR ──
  const prog=document.getElementById('scroll-prog');
  if(prog){
    window.addEventListener('scroll',()=>{
      const h=document.documentElement.scrollHeight-window.innerHeight;
      prog.style.width=(window.scrollY/h*100)+'%';
    },{passive:true});
  }

  // ── PRELOADER PERCENTAGE — two-phase speed ──
  const pctEl=document.getElementById('loader-pct');
  if(pctEl){
    let pct=0;const pctInt=setInterval(()=>{
      const speed=pct<85?Math.random()*5+2:Math.random()*1.5+.3;
      pct+=speed;if(pct>=100){pct=100;clearInterval(pctInt)}
      pctEl.textContent=Math.floor(pct);
    },30);
  }

  // ── HERO PARTICLES — subtle red motes in hero image ──
  const heroCanvas=document.getElementById('hero-particles');
  if(heroCanvas){
    const hctx=heroCanvas.getContext('2d');let hw,hh;const dots=[];
    function hResize(){hw=heroCanvas.width=heroCanvas.parentElement.offsetWidth;hh=heroCanvas.height=heroCanvas.parentElement.offsetHeight}
    hResize();window.addEventListener('resize',hResize);
    const nd=window.innerWidth<640?15:35;
    for(let i=0;i<nd;i++)dots.push({x:Math.random()*2000,y:Math.random()*1200,vy:-(Math.random()*.2+.05),r:Math.random()*2.5+.5,a:Math.random()*.1+.02,drift:Math.random()*6.28});
    function drawH(){
      hctx.clearRect(0,0,hw,hh);const t=performance.now()*.001;
      dots.forEach(d=>{
        d.y+=d.vy;d.x+=Math.sin(t*.3+d.drift)*.3;
        if(d.y<-10){d.y=hh+10;d.x=Math.random()*hw}
        const a=d.a*(.5+.5*Math.sin(t*1.5+d.drift));
        hctx.beginPath();hctx.arc(d.x,d.y,d.r,0,6.28);hctx.fillStyle=`rgba(139,45,32,${a})`;hctx.fill();
        hctx.beginPath();hctx.arc(d.x,d.y,d.r*4,0,6.28);hctx.fillStyle=`rgba(139,45,32,${a*.06})`;hctx.fill();
      });
      requestAnimationFrame(drawH);
    }
    drawH();
  }

  // ── 3D TILT CARDS ──
  document.querySelectorAll('.tilt,.svc-card,.rev-card,.visit-b,.k-gallery-item').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-.5;
      const y=(e.clientY-rect.top)/rect.height-.5;
      card.style.transform=`perspective(800px)rotateY(${x*8}deg)rotateX(${-y*8}deg)scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform=''});
  });

  // ── HERO SCROLL DEPTH ──
  if(window.innerWidth>640){
    const heroTxt=document.querySelector('.hero-txt');
    if(heroTxt){
      window.addEventListener('scroll',()=>{
        const y=window.scrollY;
        if(y>window.innerHeight*1.2)return;
        heroTxt.style.transform=`translateY(${y*.2}px)`;
        heroTxt.style.opacity=1-y/(window.innerHeight*.8);
      },{passive:true});
    }
  }

  // Sticky
  const stickyEl=document.querySelector('.sticky');
  if(stickyEl){const heroH=document.querySelector('.hero')?.offsetHeight||600;
    window.addEventListener('scroll',()=>stickyEl.classList.toggle('show',window.scrollY>heroH*.5),{passive:true});
  }
})();
