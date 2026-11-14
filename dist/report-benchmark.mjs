import {validWorkbookResponse,INNERLY_V1_VERSION} from './innerly-v1-model.mjs?v=mh-14';

// Deliberately synthetic histograms, not observations, norms, or clinical scores.
// Each row contains 100 fictional frequency responses: Never through Almost Always.
// Repeated shapes keep the visual prototype deterministic; they are not estimates.
const shapes=[[8,17,34,27,14],[12,24,31,23,10],[19,28,29,16,8],[7,16,32,30,15],[10,20,35,25,10],[15,25,30,20,10]];
export const mockBenchmark={
 id:'innerly-simulated-frequency-v1',questionnaire:INNERLY_V1_VERSION,
 synthetic:true,referenceSize:100,scope:'100 fictional responses per question; no real population',
 counts:Array.from({length:36},(_,i)=>Object.freeze([...shapes[(i*5+Math.floor(i/6))%shapes.length]]))
};
export function simulatedComparison(index,value){
 if(!validWorkbookResponse(value,index))return null;
 const counts=[...mockBenchmark.counts[index]],total=counts.reduce((sum,n)=>sum+n,0);
 const below=counts.slice(0,value).reduce((sum,n)=>sum+n,0),same=counts[value];
 return {synthetic:true,counts,total,below,same,above:total-below-same,
  atOrBelowPercent:Math.round((below+same)/total*100),value,index};
}
