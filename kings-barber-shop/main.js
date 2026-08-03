(function(){
  // Preloader
  const lt=document.getElementById('loader-text');
  const name="KING'S BARBER";
  lt.innerHTML=name.split('').map((c,i)=>`<span style="animation-delay:${.3+i*0.05}s">${c===' '?'&nbsp;':c}</span>`).join('');
  setTimeout(()=>{document.getElementById('loader').classList.add('done');document.body.classList.add('loaded')},2400);

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
