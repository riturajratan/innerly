import {QUESTION_COUNT} from './model.mjs';
import {assessmentStatus} from './navigation.mjs';
export const journeyStops=[
 {name:'Start',threshold:0,question:0,caption:'One small thought at a time.'},
 {name:'Settle in',threshold:9,question:9,caption:'Find your gentle rhythm.'},
 {name:'Explore',threshold:18,question:18,caption:'Let curiosity lead the way.'},
 {name:'Reflect',threshold:27,question:27,caption:'Notice your own patterns.'},
 {name:'Discover',threshold:QUESTION_COUNT,question:QUESTION_COUNT-1,caption:'Your reflections are ready.'}
];
export function journeyState(answers){
 const {answered}=assessmentStatus(answers),progress=answered/QUESTION_COUNT;
 const activeIndex=journeyStops.reduce((current,stop,i)=>answered>=stop.threshold?i:current,0);
 const segment=Math.min(3,Math.floor(progress*4)),t=progress*4-segment;
 return {answered,progress,activeIndex,x:10+progress*80,y:55+(segment%2===0?-1:1)*30*t*(1-t),stops:journeyStops.map((stop,i)=>({...stop,index:i,available:answered>=stop.threshold,current:i===activeIndex,passed:i<activeIndex}))};
}
export function journeyTrailMarkup(){const path='M60 55 C100 45 140 45 180 55 S260 65 300 55 S380 45 420 55 S500 65 540 55';return `<div class="journey-trail"><svg class="journey-road" viewBox="0 0 600 108" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="journey-path-clip"><rect class="journey-clip" x="60" y="0" width="0" height="108"/></clipPath></defs><path d="${path}" fill="none" stroke="#d2dec6" stroke-width="3" vector-effect="non-scaling-stroke"/><path class="journey-road-fill" d="${path}" clip-path="url(#journey-path-clip)" fill="none" stroke="#8da776" stroke-width="3" vector-effect="non-scaling-stroke"/></svg><div class="journey-checkpoints" role="group" aria-label="Your reflection journey">${journeyStops.map((stop,i)=>`<button type="button" class="journey-stop" data-journey-stop="${i}" ${i?'disabled':''}><span class="journey-pin" aria-hidden="true">${i+1}</span><span class="journey-stop-label">${stop.name}</span></button>`).join('')}</div><div class="journey-traveler" id="journey-traveler"></div></div>`}
