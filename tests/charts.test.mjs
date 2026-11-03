import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VERSION} from '../dist/model.mjs';
import {leanGroups,historySeries,wedgePath} from '../dist/charts.mjs';
test('pie counts independent categories by band and totals exactly five and 100%',()=>{const groups=leanGroups([0,39,40,60,61]);assert.deepEqual(groups.map(g=>g.count),[2,2,1]);assert.deepEqual(groups.map(g=>g.percent),[40,40,20]);assert.equal(groups[2].end,360);assert.equal(leanGroups([50,50,50,50,50])[1].percent,100);assert.throws(()=>leanGroups([1,2]));});
test('pie supports an empty slice and a complete circle without invalid arcs',()=>{assert.equal(wedgePath(0,0),'');assert.equal((wedgePath(0,360).match(/ A /g)||[]).length,2);assert.ok(!wedgePath(0,360).includes('NaN'));assert.ok(!wedgePath(0,144).includes('NaN'));});
const r=(id,date,score,version=VERSION)=>({id,date,scores:[score,20,30,40,50],version});
test('line series uses real, compatible reports up to the selected report and deduplicates ids',()=>{const a=r('a','2026-01-01',10),b=r('b','2026-02-01',40),future=r('c','2026-03-01',90),old=r('d','2025-12-01',20,'old');const points=historySeries([future,b,a,a,old],b,0);assert.deepEqual(points.map(p=>p.score),[10,40]);assert.deepEqual(historySeries([a],a,0).map(p=>p.score),[10]);assert.equal(historySeries([a,b],b,0,1).length,1);});
