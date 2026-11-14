// The whole feedback window grows out of the mind icon along flowing thought waves.
export function createFeedbackMotion({dialog,launcher,surface,energy}){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
 let thought=null;
 let animations=[],phase='closed',generation=0;
 const motionAllowed=()=>!reduce.matches&&!document.body.classList.contains('mh-paused');
 const stop=()=>{generation++;for(const animation of animations)animation.cancel();animations=[];energy.setAttribute('hidden','');thought?.remove();thought=null;};
 function settle(){
  const closing=phase==='closing';stop();surface.style.pointerEvents='';
  if(closing){phase='closed';dialog.close();}else{phase='open';dialog.dataset.motion='open';}
 }
 function frames(){
  const icon=launcher.querySelector('.ifb-mind').getBoundingClientRect(),box=dialog.getBoundingClientRect();
  const origin={x:icon.left+icon.width/2,y:icon.top+icon.height/2};
  const dx=origin.x-box.left-box.width/2,dy=origin.y-box.top-box.height/2;
  const transform=(x,y,sx,sy,skew=0)=>`translate(${x}px,${y}px) scale(${sx},${sy}) skewY(${skew}deg)`;
  return {origin,box,steps:[
   {offset:0,transform:transform(dx,dy,.035,.025),opacity:0,filter:'blur(5px)',borderRadius:'60px',clipPath:'polygon(40% 5%,70% 0%,100% 30%,100% 75%,75% 100%,35% 100%,0% 75%,0% 35%)'},
   {offset:.18,transform:transform(dx*.95,dy*.9,.09,.12,-8),opacity:.1,filter:'blur(4px)',borderRadius:'45px',clipPath:'polygon(25% 3%,65% 0%,100% 15%,100% 75%,85% 100%,45% 100%,5% 80%,0% 35%)'},
   {offset:.5,transform:transform(dx*.45,dy*.43,.58,.63,-3),opacity:.82,filter:'blur(1px)',borderRadius:'30px',clipPath:'polygon(4% 0%,50% 0%,100% 0%,100% 55%,100% 100%,65% 100%,15% 94%,0% 40%)'},
   {offset:.82,transform:transform(dx*.025,dy*.02,1.015,1.01),opacity:1,filter:'blur(0px)',borderRadius:'18px',clipPath:'polygon(0% 0%,50% 0%,100% 0%,100% 50%,100% 100%,50% 100%,0% 100%,0% 50%)'},
   {offset:1,transform:transform(0,0,1,1),opacity:1,filter:'blur(0px)',borderRadius:'18px',clipPath:'polygon(0% 0%,50% 0%,100% 0%,100% 50%,100% 100%,50% 100%,0% 100%,0% 50%)'}
  ]};
 }
 function waves({origin:o,box:b},duration,closing=false){
  const target={x:b.left+Math.min(112,b.width/2),y:b.top+b.height*.5};
  const colors=['#729ac6','#82b3a0','#c9b362'];
  const control1={x:o.x-90,y:o.y-45},control2={x:target.x+180,y:target.y+100};
  energy.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);energy.removeAttribute('hidden');
  energy.innerHTML=`<g fill="none">${colors.map((color,i)=>{
   const d=`M${o.x} ${o.y-6} C${control1.x-i*12} ${control1.y-i*6},${control2.x} ${control2.y+i*22},${target.x} ${target.y}`;
   return `<path class="ifb-energy-trail" d="${d}" stroke="${color}" stroke-width="1"/><path class="ifb-energy-path" pathLength="1" d="${d}" stroke="${color}" stroke-width="1.7"/>`;
  }).join('')}</g><g transform="translate(${o.x} ${o.y})"><g class="ifb-rising-thoughts" fill="none">${colors.map((color,i)=>`<ellipse rx="34" ry="16" transform="rotate(${i*60-35})" stroke="${color}" stroke-width="1.1"/>`).join('')}</g></g><g class="ifb-energy-source" transform="translate(${o.x} ${o.y})"><circle r="23" fill="#f3f8ff"/><image href="assets/innerly-mark.svg?v=5" x="-19" y="-19" width="38" height="38"/></g>`;
  energy.querySelectorAll('.ifb-energy-trail').forEach(path=>animations.push(path.animate([
   {opacity:0},{opacity:.2,offset:.18},{opacity:.2,offset:.72},{opacity:0}
  ],{duration:duration*.64,easing:'linear',fill:'both'})));
  energy.querySelectorAll('.ifb-energy-path').forEach((path,i)=>{
   const from=closing?-1:.25,to=closing?.25:-1;
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
  const duration=first?1900:1800,geometry=frames();waves(geometry,duration);
  surface.style.pointerEvents='none';
  const note=surface.querySelector('.ifb-note'),paper=surface.querySelector('.ifb-paper');
  const mobile=getComputedStyle(note).display==='none',width=geometry.box.width,height=geometry.box.height,targetWidth=mobile?58:225;
  thought=document.createElement('div');thought.className='ifb-thought-cover';thought.setAttribute('aria-hidden','true');
  Object.assign(thought.style,{width:`${width}px`,height:`${height}px`,left:'0',top:'0'});
  thought.append(note.cloneNode(true));dialog.append(thought);
  const waveOrigin=Math.max(0,Math.min(100,(geometry.origin.x-geometry.box.left)/width*100));
  const closedEdge=`ellipse(0% 0% at ${waveOrigin}% 100%)`,openEdge=`ellipse(145% 145% at ${waveOrigin}% 100%)`;
  // Keep the card and its type at full size; a single curved sweep reveals it.
  animations.push(thought.animate([
   {offset:0,clipPath:closedEdge,width:`${width}px`,opacity:1,borderRadius:'18px'},
   {offset:.16,clipPath:closedEdge,width:`${width}px`,opacity:1,borderRadius:'18px',easing:'cubic-bezier(.2,.6,.3,1)'},
   {offset:.37,clipPath:openEdge,width:`${width}px`,opacity:1,borderRadius:'18px'},
   {offset:.5,clipPath:openEdge,width:`${width}px`,opacity:1,borderRadius:'18px',easing:'ease-in-out'},
   {offset:.88,clipPath:openEdge,width:`${targetWidth}px`,opacity:mobile?0:1,borderRadius:mobile?'18px':'18px 0 0 18px'},
   {offset:1,clipPath:openEdge,width:`${targetWidth}px`,opacity:0,borderRadius:'18px 0 0 18px'}
  ],{duration,easing:'linear',fill:'both'}));
  animations.push(paper.animate([
   {offset:0,transform:'translateX(20px)',opacity:0},
   {offset:.53,transform:'translateX(20px)',opacity:0},
   {offset:.8,transform:'translateX(0)',opacity:1},
   {offset:1,transform:'translateX(0)',opacity:1}
  ],{duration,easing:'linear',fill:'both'}));
  const current=++generation,animation=surface.animate([
   {offset:0,opacity:0},
   {offset:.46,opacity:0},
   {offset:.54,opacity:1},
   {offset:1,opacity:1}
  ],{duration,easing:'linear',fill:'both'});animations.push(animation);
  animation.finished.then(()=>{if(current===generation)settle();}).catch(()=>{});
 }
 function close(){
  if(phase==='closed'||phase==='closing')return;
  const style=getComputedStyle(surface),start={transform:style.transform,opacity:style.opacity,filter:style.filter,clipPath:style.clipPath,borderRadius:style.borderRadius};
  stop();phase='closing';dialog.dataset.motion='closing';
  if(!motionAllowed()){settle();return;}
  const geometry=frames(),duration=420;
  waves(geometry,duration,true);surface.style.pointerEvents='none';
  const current=++generation,animation=surface.animate([
   {...start,offset:0},
   {...geometry.steps[2],offset:.5},
   {...geometry.steps[0],offset:1}
  ],{duration,easing:'cubic-bezier(.35,0,.55,1)',fill:'both'});animations.push(animation);
  animation.finished.then(()=>{if(current===generation)settle();}).catch(()=>{});
 }
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();},{signal:abort.signal});
 dialog.addEventListener('close',()=>{stop();phase='closed';surface.style.pointerEvents='';dialog.dataset.motion='closed';launcher.setAttribute('aria-expanded','false');launcher.focus({preventScroll:true});},{signal:abort.signal});
 const preferenceChanged=()=>{if((phase==='opening'||phase==='closing')&&!motionAllowed())settle();};
 reduce.addEventListener('change',preferenceChanged,{signal:abort.signal});
 const observer=new MutationObserver(preferenceChanged);observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',()=>{if(phase==='opening'||phase==='closing')settle();},{signal:abort.signal});
 return {open,close,destroy(){stop();observer.disconnect();abort.abort();}};
}
