(function(){
  // ── PRELOADER ──
  const loaderText=document.getElementById('loader-text');
  const name='BAY HAVEN INN';
  loaderText.innerHTML=name.split('').map((c,i)=>`<span style="animation-delay:${i*0.06}s">${c==' '?'&nbsp;':c}</span>`).join('');
  setTimeout(()=>{document.getElementById('loader').classList.add('done');document.body.classList.add('loaded')},800);

  // ── MAGNETIC BUTTONS ──
  document.querySelectorAll('[data-magnetic]').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const rect=btn.getBoundingClientRect();
      const x=e.clientX-rect.left-rect.width/2;
      const y=e.clientY-rect.top-rect.height/2;
      btn.style.transform=`translate(${x*.25}px,${y*.35}px)`;
    });
    btn.addEventListener('mouseleave',()=>{btn.style.transform=''});
  });

  // ── PARALLAX ──
  if(window.innerWidth>640){
    const pxEls=document.querySelectorAll('.about-img img,.ent-bg img,.heritage-bg img,.reviews-bg img,.garden-img img,.cta-bg img');
    window.addEventListener('scroll',()=>{
      pxEls.forEach(img=>{
        const rect=img.closest('section,.hero,.about,.garden,.ent,.reviews,.cta,.heritage')?.getBoundingClientRect();
        if(!rect||rect.bottom<0||rect.top>window.innerHeight)return;
        const p=(window.innerHeight-rect.top)/(window.innerHeight+rect.height);
        const shift=(p-.5)*35;
        img.style.transform=`translateY(${shift}px)scale(1.08)`;
      });
    },{passive:true});
  }

  // ── TEXT SPLIT ──
  document.querySelectorAll('[data-split]').forEach(el=>{
    const words=el.textContent.trim().split(/\s+/);let ci=0;
    el.innerHTML=words.map(word=>{
      const chars=word.split('').map(c=>{const s=`<span class="char" style="animation-delay:${1.8+ci*0.04}s">${c}</span>`;ci++;return s}).join('');
      return `<span style="display:inline-block;white-space:nowrap">${chars}</span>`;
    }).join('<span style="display:inline-block;width:.3em"></span>');
  });

  // ── SCROLL REVEAL (includes clip-rv) ──
  const io=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});},{threshold:.06,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.rv,.rv-l,.rv-r,.clip-rv').forEach(el=>io.observe(el));

  // ── HERITAGE COUNTER — animate 1908 → 2026 ──
  const yrEl=document.getElementById('yr-counter');
  if(yrEl){
    const cObs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){cObs.unobserve(e.target);
      const start=performance.now();const from=1908;const to=2026;const dur=2200;
      function tick(now){const p=Math.min((now-start)/dur,1);const ep=1-Math.pow(1-p,3);yrEl.textContent=Math.round(from+ep*(to-from));if(p<1)requestAnimationFrame(tick)}
      requestAnimationFrame(tick);
    }});},{threshold:.3});
    cObs.observe(yrEl);
  }

  // ── TIMELINE STAGGER ──
  const tlItems=document.querySelectorAll('.heritage-tl-item');
  const tlObs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');tlObs.unobserve(e.target);}});},{threshold:.2});
  tlItems.forEach((el,i)=>{el.style.transitionDelay=`${.3+i*.15}s`;tlObs.observe(el)});

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
  initMG('gallery-track');

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

  // ── NAV ──
  const nav=document.querySelector('.nav');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>100),{passive:true});
  const navToggle=nav.querySelector('.nav-toggle');
  if(navToggle){
    navToggle.addEventListener('click',()=>{nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',nav.classList.contains('open'))});
    nav.querySelectorAll('.nav-l a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');navToggle.setAttribute('aria-expanded','false')}));
  }

  // ── SCROLL SPY ──
  const sections=document.querySelectorAll('[id]');const navLinks=document.querySelectorAll('[data-spy]');
  const spyObs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){navLinks.forEach(l=>l.classList.remove('active'));const link=document.querySelector(`[data-spy][href="#${e.target.id}"]`);if(link)link.classList.add('active');}});},{threshold:.15,rootMargin:'-80px 0px -50% 0px'});
  sections.forEach(s=>spyObs.observe(s));

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
  document.querySelectorAll('.tilt,.ent-card,.rev-card,.visit-b').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-.5;
      const y=(e.clientY-rect.top)/rect.height-.5;
      card.style.transform=`perspective(800px)rotateY(${x*8}deg)rotateX(${-y*8}deg)scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform=''});
  });

  // ── HERO SCROLL DEPTH — parallax layers at different speeds ──
  if(window.innerWidth>640){
    const heroEl=document.querySelector('.hero');
    const heroTxt=document.querySelector('.hero-c');
    const heroBg=document.querySelector('.hero-bg video,.hero-bg img');
    if(heroEl&&heroTxt&&heroBg){
      window.addEventListener('scroll',()=>{
        const y=window.scrollY;
        if(y>window.innerHeight*1.2)return;
        heroTxt.style.transform=`translateY(${y*.35}px)`;
        heroTxt.style.opacity=1-y/(window.innerHeight*.7);
      },{passive:true});
    }
  }

  // ── STICKY CTA ──
  const stickyEl=document.querySelector('.sticky');
  if(stickyEl){const heroH=document.querySelector('.hero')?.offsetHeight||600;
    window.addEventListener('scroll',()=>stickyEl.classList.toggle('show',window.scrollY>heroH*.6),{passive:true});
  }

  // ── BOOKING MODAL ──
  const overlay=document.getElementById('book-overlay');
  const bookForm=document.getElementById('book-form');
  const bookSuccess=document.getElementById('book-success');
  if(overlay){
    function openBook(){overlay.classList.add('active');document.body.style.overflow='hidden'}
    function closeBook(){overlay.classList.remove('active');document.body.style.overflow=''}
    overlay.querySelector('.book-close').addEventListener('click',closeBook);
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeBook()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('active'))closeBook()});
    document.querySelectorAll('[data-book]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openBook()}));
    if(bookForm){
      bookForm.addEventListener('submit',e=>{
        e.preventDefault();
        bookForm.style.display='none';
        bookSuccess.style.display='block';
        setTimeout(()=>{closeBook();bookForm.style.display='';bookSuccess.style.display='none';bookForm.reset()},4000);
      });
    }
  }
})();
