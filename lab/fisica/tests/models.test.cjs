const assert = require('node:assert/strict');
const {labs,defaults,g}=require('../models.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
const [vectors,projectiles,newton,energy,waves,circuits]=labs;
near(vectors.calculate({x:3,y:4}).magnitude,5);
near(vectors.calculate({x:3,y:4}).distance,7);
assert.equal(vectors.metrics({x:0,y:0},vectors.calculate({x:0,y:0}))[2][1],null);
const p30=projectiles.calculate({v:12,angle:30}),p60=projectiles.calculate({v:12,angle:60});near(p30.range,p60.range);assert.ok(p60.height>p30.height);
assert.ok(projectiles.calculate({v:12,angle:45}).range>p30.range);
near(projectiles.curve({v:12,angle:60}).at(-1)[1],0);
near(newton.calculate({force:8,mass:4}).a,newton.calculate({force:8,mass:2}).a/2);
near(newton.calculate({force:0,mass:2}).x,0);
near(energy.calculate({height:2,mass:1}).v,energy.calculate({height:2,mass:4}).v);
near(energy.calculate({height:2,mass:2}).energy,.5*2*energy.calculate({height:2,mass:2}).v**2);
near(energy.calculate({height:4,mass:1}).v,2*energy.calculate({height:1,mass:1}).v);
near(waves.calculate({speed:2,frequency:2,amplitude:.4}).lambda,1);
near(circuits.calculate({voltage:6,resistance:20,connection:'series'}).current,.15);
near(circuits.calculate({voltage:6,resistance:20,connection:'parallel'}).resistance,10);
for(const lab of labs){
 const combinations=lab.parameters.reduce((all,p)=>all.flatMap(c=>(p.options?p.options.map(o=>o[0]):[p.min,p.value,p.max]).map(v=>({...c,[p.key]:v}))),[{}]);
 for(const p of combinations){
  for(const v of Object.values(lab.calculate(p)))assert.ok(Number.isFinite(v),lab.id+' nonfinite result');
  assert.ok(lab.duration(p)>0);
  for(const pair of lab.curve(p))assert.ok(pair.every(Number.isFinite));
 }
}
console.log('PASS: physical invariants, known values and parameter-boundary combinations for all six experiments.');
