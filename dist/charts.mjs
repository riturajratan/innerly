import {VERSION,band} from './model.mjs';
export function leanGroups(scores){
 if(!Array.isArray(scores)||scores.length!==5||Array.from(scores).some(s=>!Number.isFinite(s)||s<0||s>100))throw new Error('Invalid scores.');
 const groups=[{label:'Leans left',color:'#a38bb8',indices:[]},{label:'A mix of both',color:'#7f99b5',indices:[]},{label:'Leans right',color:'#83a16a',indices:[]}];
 scores.forEach((score,i)=>groups[band(score)].indices.push(i));
 let angle=0;return groups.map(group=>{const start=angle;angle+=group.indices.length/5*360;return{...group,count:group.indices.length,percent:group.indices.length*20,start,end:angle}});
}
export function historySeries(reports,current,category,limit=8){
 if(!Number.isInteger(category)||category<0||category>4||!Number.isInteger(limit)||limit<1)throw new Error('Invalid history selection.');
 const currentTime=Date.parse(current.date),byId=new Map();
 for(const report of [...reports,current])if(report.version===VERSION&&typeof report.id==='string'&&Number.isFinite(Date.parse(report.date))&&Date.parse(report.date)<=currentTime&&Array.isArray(report.scores)&&report.scores.length===5&&Array.from(report.scores).every(s=>Number.isFinite(s)&&s>=0&&s<=100))byId.set(report.id,report);
 return [...byId.values()].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).slice(-limit).map(r=>({id:r.id,date:r.date,score:r.scores[category]}));
}
export function wedgePath(start,end,cx=140,cy=140,radius=110){
 if(end<=start)return '';
 const p=angle=>[cx+radius*Math.cos((angle-90)*Math.PI/180),cy+radius*Math.sin((angle-90)*Math.PI/180)];
 if(end-start>=359.999)return `M ${cx} ${cy-radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy+radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy-radius} Z`;
 const a=p(start),b=p(end);return `M ${cx} ${cy} L ${a[0]} ${a[1]} A ${radius} ${radius} 0 ${end-start>180?1:0} 1 ${b[0]} ${b[1]} Z`;
}
