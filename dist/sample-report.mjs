import {makeWorkbookReport} from './innerly-v1-model.mjs?v=mh-14';
const examples={
 mixed:[[0,1,2,3,4,2],[3,2,1,4,1,3],[2,3,1,2,4,3],[4,1,2,3,2,4],[3,1,2,2,4,3],[2,3,4,1,3,4]],
 sometimes:Array.from({length:6},()=>[2,2,1,2,3,2]),
 varied:[[4,0,3,1,4,0],[0,4,1,3,0,4],[4,1,0,3,1,4],[1,4,0,4,3,0],[4,0,4,1,0,3],[0,4,1,4,0,3]]
};
export function sampleReportData(language='en',preset='mixed'){
 const key=Object.hasOwn(examples,preset)?preset:'mixed',answers=examples[key].flat();
 const make=(id,createdAt,values)=>makeWorkbookReport(values,{id,createdAt,language});
 return {
  preset:key,
  report:make('innerly-demo-current','2026-11-11T09:00:00Z',answers),
  history:[make('innerly-demo-earlier','2026-10-15T09:00:00Z',answers.map((_,i)=>i%5)),make('innerly-demo-middle','2026-10-29T09:00:00Z',answers.map((v,i)=>i%3===0?2:v))]
 };
}
