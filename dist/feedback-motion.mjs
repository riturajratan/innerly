// A thought becomes a cover, then opens into a two-page feedback note.
export function createFeedbackMotion({dialog,launcher,surface,energy}){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
 let thought=null;
 let animations=[],phase='closed',generation=0;
 const motionAllowed=()=>!reduce.matches&&!document.body.classList.contains('mh-paused');
 const stop=()=>{generation++;for(const animation of animations)animation.cancel();animations=[];energy.setAttribute('hidden','');thought?.remove();thought=null;};
 function settle(){
  const closing=phase==='closing';stop();surface.style.pointerEvents='';surface.inert=false;
  if(closing){phase='closed';dialog.close();}else{phase='open';dialog.dataset.motion='open';}
 }
 function frames(){
  const icon=launcher.querySelector('.ifb-mind').getBoundingClientRect(),box=dialog.getBoundingClientRect();
  const origin={x:icon.left+icon.width/2,y:icon.top+icon.height/2};
  return {origin,box};
 }
 function waves({origin:o,box:b},duration,closing=false){
  const sidebar=getComputedStyle(surface.querySelector('.ifb-note')).display==='none'?0:225;
  const target={x:b.left+sidebar+(b.width-sidebar)*.5,y:b.top+b.height*.5};
  const colors=['#729ac6','#82b3a0','#c9b362'];
  const control1={x:o.x-65,y:o.y-70},control2={x:target.x+75,y:target.y+110};
  energy.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);energy.removeAttribute('hidden');
  energy.innerHTML=`<g fill="none">${colors.map((color,i)=>{
   const d=`M${o.x} ${o.y-6} C${control1.x-i*12} ${control1.y-i*6},${control2.x} ${control2.y+i*22},${target.x} ${target.y}`;
   return `<path class="ifb-energy-trail" d="${d}" stroke="${color}" stroke-width="1"/><path class="ifb-energy-path" pathLength="1" d="${d}" stroke="${color}" stroke-width="1.7"/>`;
  }).join('')}</g><g transform="translate(${o.x} ${o.y})"><g class="ifb-rising-thoughts" fill="none">${colors.map((color,i)=>`<ellipse rx="34" ry="16" transform="rotate(${i*60-35})" stroke="${color}" stroke-width="1.1"/>`).join('')}</g></g><g class="ifb-energy-source" transform="translate(${o.x} ${o.y})"><circle r="23" fill="#f3f8ff"/><image href="assets/innerly-mark.svg?v=5" x="-19" y="-19" width="38" height="38"/></g>`;
  energy.querySelectorAll('.ifb-energy-trail').forEach(path=>animations.push(path.animate([
   {opacity:0},{opacity:.2,offset:.18},{opacity:.2,offset:.72},{opacity:0}
  ],{duration:duration*.64,easing:'linear',fill:'both'})));
  energy.querySelectorAll('.ifb-energy-path').forEach((path,i)=>{
   const from=closing ? -1 : .25,to=closing ? .25 : -1;
   animations.push(path.animate([
    {strokeDashoffset:from,opacity:0},
    {strokeDashoffset:from+(to-from)*.16,opacity:.72,offset:.16},
    {strokeDashoffset:from+(to-from)*.82,opacity:.72,offset:.82},
    {strokeDashoffset:to,opacity:0}
   ],{duration:duration*.57,delay:i*45,easing:'linear',fill:'both'}));
  });
  // Sample one continuous curve so the rings do not change direction at a midpoint.
  const ringFrames=Array.from({length:25},(_,i)=>{
   const progress=i/24,t=closing?1-progress:progress,u=1-t;
   const x=u*u*u*o.x+3*u*u*t*control1.x+3*u*t*t*control2.x+t*t*t*target.x;
   const y=u*u*u*o.y+3*u*u*t*control1.y+3*u*t*t*control2.y+t*t*t*target.y;
   return {offset:progress,transform:`translate(${x-o.x}px,${y-o.y}px) scale(${.55+1.65*t})`,opacity:.7*Math.sin(Math.PI*progress)};
  });
  animations.push(energy.querySelector('.ifb-rising-thoughts').animate(ringFrames,{duration:duration*.62,easing:'linear',fill:'both'}));
  animations.push(energy.querySelector('.ifb-energy-source').animate([{opacity:1},{opacity:1,offset:.6},{opacity:0}],{duration:duration*.62,fill:'both'}));
 }
 function open(first=false){
  if(phase!=='closed')return;
  surface.scrollTop=0;dialog.showModal();launcher.setAttribute('aria-expanded','true');phase='opening';dialog.dataset.motion='opening';
  if(!motionAllowed()){settle();return;}
  const duration=first?1600:1450,geometry=frames();
  const note=surface.querySelector('.ifb-note'),paper=surface.querySelector('.ifb-paper');
  const mobile=getComputedStyle(note).display==='none',spine=mobile?0:225;
  const width=geometry.box.width-spine,height=geometry.box.height;
  waves(geometry,duration);surface.style.pointerEvents='none';surface.inert=true;
  thought=document.createElement('div');thought.className='ifb-thought-cover';thought.setAttribute('aria-hidden','true');
  Object.assign(thought.style,{width:`${width}px`,height:`${height}px`,left:`${spine}px`,top:'0'});
  const front=document.createElement('div');front.className='ifb-cover-front';
  front.append(note.cloneNode(true));
  const emblem=document.createElement('img');emblem.className='ifb-cover-mind';emblem.src='assets/innerly-mark.svg?v=5';emblem.alt='';
  front.querySelector('.ifb-orbits').append(emblem);
  thought.append(front);
  if(!mobile){const back=document.createElement('div');back.className='ifb-cover-back';back.append(note.cloneNode(true));thought.append(back);}
  dialog.append(thought);
  const rotate=angle=>`perspective(1500px) translateY(0px) rotateY(${angle}deg)`;
  const finalAngle=mobile?-104:-180,finalWidth=mobile?width:spine;
  // A single hinge: the front turns away and its reverse becomes the left page.
  const current=++generation,animation=thought.animate([
   {offset:0,transform:'perspective(1500px) translateY(28px) rotateY(0deg)',width:`${width}px`},
   {offset:.1,transform:'perspective(1500px) translateY(28px) rotateY(0deg)',width:`${width}px`,easing:'cubic-bezier(.2,.75,.25,1)'},
   {offset:.3,transform:rotate(0),width:`${width}px`},
   {offset:.43,transform:rotate(0),width:`${width}px`,easing:'cubic-bezier(.4,0,.2,1)'},
   {offset:.92,transform:rotate(finalAngle),width:`${finalWidth}px`},
   {offset:1,transform:rotate(finalAngle),width:`${finalWidth}px`}
  ],{duration,easing:'linear',fill:'both'});animations.push(animation);
  // Opacity belongs to the faces: fading the 3D parent flattens it in Chromium.
  for(const face of thought.children)animations.push(face.animate([
   {offset:0,opacity:0},{offset:.1,opacity:0},{offset:.3,opacity:1},{offset:1,opacity:1}
  ],{duration,easing:'linear',fill:'both'}));
  // Keep only the moving reverse visible. Swap to the identical sidebar at rest.
  if(!mobile)animations.push(note.animate([{opacity:0},{opacity:0}],{duration,fill:'both'}));
  // Reveal the real pages behind the cover, replacing its reverse at rest.
  animations.push(surface.animate([
   {offset:0,opacity:0,clipPath:`inset(0 0 0 ${spine}px round 18px)`},
   {offset:.35,opacity:0,clipPath:`inset(0 0 0 ${spine}px round 18px)`},
   {offset:.44,opacity:1,clipPath:`inset(0 0 0 ${spine}px round 18px)`,easing:'cubic-bezier(.4,0,.2,1)'},
   {offset:.9,opacity:1,clipPath:'inset(0 0 0 0px round 18px)'},
   {offset:1,opacity:1,clipPath:'inset(0 0 0 0px round 18px)'}
  ],{duration,easing:'linear',fill:'both'}));
  animations.push(paper.animate([
   {offset:0,opacity:0},{offset:.48,opacity:0},{offset:.86,opacity:1},{offset:1,opacity:1}
  ],{duration,easing:'linear',fill:'both'}));
  animation.finished.then(()=>{if(current===generation)settle();}).catch(()=>{});
 }
 function close(){
  if(phase==='closed'||phase==='closing')return;
  // Escape during the introduction closes immediately, without a half-built card.
  if(phase==='opening'){phase='closing';settle();return;}
  stop();phase='closing';dialog.dataset.motion='closing';
  if(!motionAllowed()){settle();return;}
  surface.style.pointerEvents='none';surface.inert=true;
  const current=++generation,animation=surface.animate([
   {transform:'translateY(0)',opacity:1},{transform:'translateY(18px)',opacity:0}
  ],{duration:260,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});animations.push(animation);
  animation.finished.then(()=>{if(current===generation)settle();}).catch(()=>{});
 }
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();},{signal:abort.signal});
 dialog.addEventListener('close',()=>{stop();phase='closed';surface.style.pointerEvents='';surface.inert=false;dialog.dataset.motion='closed';launcher.setAttribute('aria-expanded','false');launcher.focus({preventScroll:true});},{signal:abort.signal});
 const preferenceChanged=()=>{if((phase==='opening'||phase==='closing')&&!motionAllowed())settle();};
 reduce.addEventListener('change',preferenceChanged,{signal:abort.signal});
 const observer=new MutationObserver(preferenceChanged);observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',()=>{if(phase==='opening'||phase==='closing')settle();},{signal:abort.signal});
 return {open,close,destroy(){stop();observer.disconnect();abort.abort();}};
}
