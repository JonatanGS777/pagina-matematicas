import assert from 'node:assert/strict';
import { calculate, experiments } from '../physics.js';
import { csvData, reportHTML } from '../exports.js';
const near=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const base={length:.5,mass:.4,angle:10};
const p=calculate('pendulum',base);
near(calculate('pendulum',{...base,length:2}).period,p.period*2);
near(calculate('pendulum',{...base,mass:1}).period,p.period);
near(calculate('pendulum',base,p.period).theta,10*Math.PI/180);
const projectile={speed:10,angle:45},j=calculate('projectile',projectile);
near(j.range,100/9.81);near(calculate('projectile',projectile,j.flight).y,0);near(calculate('projectile',projectile,j.flight/2).y,j.height);near(calculate('projectile',projectile,999).x,j.range);
near(calculate('projectile',{speed:10,angle:30}).range,calculate('projectile',{speed:10,angle:60}).range);
assert.ok(j.range>calculate('projectile',{speed:10,angle:30}).range);
for(const t of [0,.1,.8,1.7,10]){const v=calculate('spring',{stiffness:15,mass:1,amplitude:.3},t);near(v.energy,v.kinetic+v.potential);near(v.force,-15*v.x);}
near(calculate('circuit',{voltage:6,resistance:30}).current,.2);
near(calculate('circuit',{voltage:6,resistance:60}).current,.1);
near(calculate('circuit',{voltage:6,resistance:30}).power,1.2);
for(const e of experiments){for(const extreme of ['min','max']){const inputs=Object.fromEntries(e.params.map(p=>[p.key,p[extreme]]));for(const t of [0,1,10])for(const value of Object.values(calculate(e.id,inputs,t)))assert.ok(Number.isFinite(value));}}
const state={name:'=HYPERLINK("bad")',group:'<script>alert(1)</script>',trials:[{id:'pendulum',params:base,readings:p,time:1,date:'2026-09-11'}],work:Object.fromEntries(experiments.map(e=>[e.id,{prediction:'<script>alert(1)</script>',conclusion:'Texto & evidencia',complete:false,correct:false}]))};
assert.ok(csvData(state).includes("\"'=HYPERLINK"));assert.ok(!reportHTML(state).includes('<script>'));assert.ok(reportHTML(state).includes('&lt;script&gt;'));
console.log('PASS: período, masa independiente, vuelo y ángulos complementarios, conservación de energía, ley de Ohm, extremos, escape HTML y CSV.');
