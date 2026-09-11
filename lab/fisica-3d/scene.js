import * as THREE from './vendor/three.module.min.js';
import { calculate, experiments } from './physics.js';

const POSITIONS = { pendulum: [-5, -4.5], projectile: [5, -4.5], spring: [-5, 4], circuit: [5, 4] };
export function createLab(canvas, { onSelect, onMove, onNearby, onError }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = window.innerWidth > 650;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#91b9be');
  scene.fog = new THREE.Fog('#9bbfc0', 22, 48);
  const camera = new THREE.PerspectiveCamera(58, 1, .08, 65);
  camera.position.set(0, 5.2, 11.8);
  camera.rotation.order = 'YXZ';
  camera.lookAt(0, 1.2, -2.5);
  let yaw = camera.rotation.y, pitch = camera.rotation.x, target = null, walking = false, active = 'pendulum';
  const keys = new Set(), clickable = [], colliders = [], materials = new Map();
  const hemi = new THREE.HemisphereLight(0xe8f7ff, 0x4c6058, 2.2); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d9, 3.2); sun.position.set(-10, 16, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, far: 48 }); sun.shadow.normalBias = .045; scene.add(sun);
  const fill = new THREE.DirectionalLight(0xa9d9eb, 1); fill.position.set(10, 9, -9); scene.add(fill);
  function mat(color, options = {}) { const key = color + JSON.stringify(options); if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: .65, ...options })); return materials.get(key); }
  function box(w, h, d, color, x, y, z, parent = scene, options = {}) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, options)); mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; }
  function cylinder(r1, r2, h, color, x,y,z,parent=scene) { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,20),mat(color,{metalness:.35})); mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh; }
  function sphere(r,color,x,y,z,parent=scene,options={}) { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat(color,options));mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh; }
  function label(text, sub, w, h, parent, x,y,z, { background='#18343b', color='#d6f6ec', font=52 }={}) {
    const c = document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);
    const ctx=c.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle='#698b85';ctx.lineWidth=3;ctx.strokeRect(12,12,c.width-24,c.height-24);
    ctx.fillStyle=color;ctx.font=`500 ${font}px Trebuchet MS, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,c.width/2,c.height*(sub?.42:.5),960);
    if(sub){ctx.fillStyle='#a9c4bf';ctx.font='24px monospace';ctx.fillText(sub,c.width/2,c.height*.75,960);}
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function line(points, color, parent = scene) { const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Line(geo,new THREE.LineBasicMaterial({color}));parent.add(mesh);return mesh; }
  // Architecture: open entrance, daylight windows, beams, tiled floor, science wall.
  box(24,.22,25,'#b5b5a4',0,-.12,0);
  const grid = new THREE.GridHelper(24,24,0x909e97,0x9da89f);grid.position.y=.003;scene.add(grid);
  box(24,6,.25,'#bfcac0',0,3,-11);
  box(24,1.35,.28,'#3c6166',0,.675,-10.82);
  box(.25,6,23,'#acbdb7',12,3,.4);
  box(.28,1.35,23,'#3c6166',11.8,.675,.4);
  box(.25,1.4,23,'#477076',-12,.7,.4);
  box(.25,1,23,'#c1d0c9',-12,5.5,.4);
  for (const z of [-9,-4,1,6,11]) {box(.35,6,.28,'#e1e7db',-12,3,z);box(.22,.16,4.8,'#d7e4da',-11.9,3.2,z-2.4);}
  for(const z of [-6.5,-1.5,3.5,8.5]){const pane=box(.05,3.5,4.65,'#b8dde0',-12,3.2,z,scene,{transparent:true,opacity:.16,metalness:.1});pane.castShadow=false;box(1.2,.12,4.8,'#e2dfce',-11.5,1.42,z);}
  for(const z of [-8,0,8]){box(24,.22,.2,'#d3d8ca',0,5.9,z);box(3,.08,.35,'#fff6d8',-4,5.72,z,scene,{emissive:'#fff0c2',emissiveIntensity:1});box(3,.08,.35,'#fff6d8',4,5.72,z,scene,{emissive:'#fff0c2',emissiveIntensity:1});}
  // Landscape seen through the windows.
  box(10,.2,40,'#729985',-18,-.3,0);
  for(const z of [-12,-5,3,10]){cylinder(.18,.23,3,'#716653',-16,1.5,z);sphere(1.8,'#668975',-16,4,z);sphere(1.3,'#789a7a',-17,3.6,z+1);}
  label('LA FÍSICA EMPIEZA CON UNA PREGUNTA', 'OBSERVA  /  PREDICE  /  EXPERIMENTA  /  EXPLICA', 11,2.1,scene,0,3.75,-10.65,{font:40});
  label('¿Por qué cambia el movimiento?', 'F = ma      E = ½mv²      I = V/R',6,1.3,scene,0,1.9,-10.64,{font:40});
  // Side storage and books give the space a classroom scale.
  for(const z of [-7,0,7]){box(.9,2.7,3.2,'#4d6d6d',11.25,1.35,z);for(const y of [.1,1,1.9,2.7])box(1.05,.08,3.35,'#c1b79a',11.15,y,z);for(let j=0;j<6;j++)box(.55,.45,.13,['#c69b6f','#759e9b','#d3d1b6'][j%3],11.1,1.27,z-1+j*.24);}
  // Floor wayfinding, entry threshold and stools.
  for(const z of [-7,-5,-3,-1,1,3,5,7,9])box(.05,.015,.65,'#678e87',0,.012,z);
  label('FÍSICA VIVA', 'UN ESPACIO PARA DESCUBRIR',3.8,.85,scene,0,.018,8.7,{font:65}).rotation.x=-Math.PI/2;
  const apparatus = {};
  experiments.forEach(exp=>{
    const [x,z]=POSITIONS[exp.id], g=new THREE.Group();g.position.set(x,0,z);g.userData.experiment=exp.id;scene.add(g);
    box(4.6,.17,2.6,'#bba17b',0,1.3,0,g);box(4.65,.06,2.65,'#e2ceb0',0,1.41,0,g);
    for(const xx of [-1.95,1.95])for(const zz of [-1.03,1.03])box(.12,1.25,.12,'#344e55',xx,.65,zz,g);
    box(4.05,.36,.1,'#3c5458',0,1,1.02,g);
    label(`${exp.number}   ${exp.name.toUpperCase()}`, exp.topic.toUpperCase(),3.6,.48,g,0,1.02,1.085,{color:exp.color,font:54});
    // Apparatus identification sign set on the rear of each desk.
    cylinder(.025,.025,1,'#526768',-1.7,1.85,-.9,g);
    label(exp.name, 'TOCA PARA EXPERIMENTAR',1.8,.55,g,-1.3,2.5,-.95,{color:exp.color,font:71});
    const border=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5,.025,3)),new THREE.LineBasicMaterial({color:exp.color,transparent:true,opacity:.6}));border.position.y=.025;g.add(border);
    for(const xx of [-1.35,1.35]){cylinder(.33,.33,.13,'#526f6f',xx,.7,2.15,g);for(const a of [0,2.1,4.2])box(.065,.65,.065,'#334d54',xx+Math.cos(a)*.23,.34,2.15+Math.sin(a)*.23,g);colliders.push({x:x+xx,z:z+2.15,w:.43,d:.43});}
    colliders.push({x,z,w:2.5,d:1.5});apparatus[exp.id]={group:g,border};clickable.push(g);
  });
  const p=apparatus.pendulum.group;
  box(2.3,.09,1.3,'#34505a',.1,1.5,0,p);
  for(const x of [-.85,1.05])cylinder(.045,.045,2.8,'#b4cbcb',x,2.88,0,p);
  box(2,.09,.1,'#b4cbcb',.1,4.25,0,p);
  const pivot=new THREE.Group();pivot.position.set(.1,4.18,0);p.add(pivot);
  const cord=cylinder(.013,.013,1,'#d4e5e0',0,-.5,0,pivot);
  const bob=sphere(.17,'#76d8c5',0,-1.2,0,pivot,{metalness:.65,roughness:.24});
  const ruler=label('0        0.5        1.0        1.5        2.0 m','LONGITUD',.6,16/7,p,1.35,3.18,-.05,{font:24});
  ruler.material.map.dispose(); // Replace tiny vertical text with a purpose-made scale.
  const rc=document.createElement('canvas');rc.width=128;rc.height=512;const rx=rc.getContext('2d');rx.fillStyle='#e0dec9';rx.fillRect(0,0,128,512);rx.fillStyle='#2f4a4b';rx.font='20px monospace';for(let i=0;i<=20;i++){const y=32+i*22.4;rx.fillRect(10,y,i%5===0?42:20,2);if(i%5===0)rx.fillText((i/10).toFixed(1),60,y+6);}ruler.material.map=new THREE.CanvasTexture(rc);ruler.material.needsUpdate=true;
  const proj=apparatus.projectile.group;
  box(4.15,.08,1.8,'#31515a',0,1.51,0,proj);
  const launcher=new THREE.Group();launcher.position.set(-1.8,1.7,0);proj.add(launcher);
  const barrel=cylinder(.11,.11,.65,'#e6ab69',0,.3,0,launcher);barrel.rotation.z=-Math.PI/2;barrel.position.set(.27,0,0);
  sphere(.18,'#496e73',-1.8,1.61,0,proj);
  const ball=sphere(.095,'#ffb358',-1.8,1.7,0,proj,{metalness:.4});
  const trajectory=line(Array.from({length:81},()=>[0,0,0]),'#ffd493',proj);
  for(let i=0;i<=20;i++)box(.016,.015,i%5===0?.2:.09,'#b6d5cc',-1.8+i*.16,1.558,.75,proj);
  const sp=apparatus.spring.group;
  box(4,.09,1.25,'#3d5261',0,1.5,0,sp);box(.16,.75,1,'#8ba7b2',-1.65,1.92,0,sp);
  for(const z of [-.38,.38])box(3.6,.07,.045,'#d5e5de',0,1.6,z,sp);
  const mass=box(.65,.5,.72,'#bca6ef',.6,1.88,0,sp,{metalness:.25});
  const coil=line(Array.from({length:161},()=>[0,0,0]),'#d9caee',sp);
  const forceArrow=new THREE.ArrowHelper(new THREE.Vector3(-1,0,0),new THREE.Vector3(.6,2.5,0),.8,0xffc689,.18,.11);sp.add(forceArrow);
  label('F = −kx','FUERZA HACIA EL EQUILIBRIO',2,.6,sp,.3,2.8,-.8,{color:'#c8b6f0',font:90});
  const ci=apparatus.circuit.group;
  box(3.8,.12,1.85,'#e2d9bc',0,1.53,0,ci);
  const loop=[[-1.3,1.64,.65],[-1.3,1.64,-.55],[1.25,1.64,-.55],[1.25,1.64,.65],[-1.3,1.64,.65]];
  line(loop,'#ed9b67',ci);
  box(.58,.64,.62,'#315e69',-1.3,1.97,0,ci);label('+   −','FUENTE',.5,.45,ci,-1.3,2.02,.32,{font:145});
  const resistor=cylinder(.16,.16,.8,'#ce9f71',.1,1.74,-.55,ci);resistor.rotation.z=Math.PI/2;
  for(const x of [-.15,0,.22]){const band=cylinder(.164,.164,.065,'#855b47',x,1.74,-.55,ci);band.rotation.z=Math.PI/2;}
  cylinder(.28,.32,.12,'#52666d',1.25,1.69,.3,ci);cylinder(.13,.13,.28,'#a8b5b1',1.25,1.87,.3,ci);
  const lamp=sphere(.28,'#e7d99d',1.25,2.14,.3,ci,{emissive:'#ffca65',emissiveIntensity:.12,roughness:.25});
  const electrons=Array.from({length:12},()=>sphere(.045,'#fbef9b',0,0,0,ci,{emissive:'#fbe79b',emissiveIntensity:.7}));
  label('I = V / R','CORRIENTE CONTINUA',2,.6,ci,0,2.75,-.9,{font:90,color:'#ccecb4'});
  function updateModels(params, time, selected, running){
    active=selected;
    for(const exp of experiments) apparatus[exp.id].border.material.opacity=exp.id===selected?.9:.22;
    const a=calculate('pendulum',params.pendulum,time.pendulum);pivot.rotation.z=a.theta;
    cord.scale.y=params.pendulum.length;cord.position.y=-params.pendulum.length/2;bob.position.y=-params.pendulum.length;bob.scale.setScalar(Math.cbrt(params.pendulum.mass/.4));
    const pp=params.projectile,b=calculate('projectile',pp,time.projectile);launcher.rotation.z=pp.angle*Math.PI/180;ball.position.set(-1.8+b.x*.16,1.7+b.y*.16,0);
    const pa=trajectory.geometry.attributes.position;for(let i=0;i<81;i++){const v=calculate('projectile',pp,b.flight*i/80);pa.setXYZ(i,-1.8+v.x*.16,1.7+v.y*.16,0);}pa.needsUpdate=true;trajectory.geometry.computeBoundingSphere();
    const c=calculate('spring',params.spring,time.spring),mx=.65+c.x*1.8;mass.position.x=mx;
    const ca=coil.geometry.attributes.position;for(let i=0;i<161;i++){const f=i/160;ca.setXYZ(i,-1.57+(mx-.325+1.57)*f,1.88+Math.sin(f*Math.PI*24)*.17,Math.cos(f*Math.PI*24)*.17);}ca.needsUpdate=true;coil.geometry.computeBoundingSphere();
    forceArrow.position.x=mx;forceArrow.setDirection(new THREE.Vector3(c.force>=0?1:-1,0,0));forceArrow.setLength(Math.max(.02,Math.abs(c.force)/25),.13,.08);
    const d=calculate('circuit',params.circuit);lamp.material.emissiveIntensity=time.circuit>0?Math.min(2.5,d.power*.45):.05;
    const pathLength=7.5;
    electrons.forEach((el,i)=>{let distance=((i/electrons.length+time.circuit*d.current*.35)%1)*pathLength;for(let k=0;k<4;k++){const start=new THREE.Vector3(...loop[k]),end=new THREE.Vector3(...loop[k+1]),len=start.distanceTo(end);if(distance<=len){el.position.copy(start.lerp(end,distance/len));break;}distance-=len;}el.visible=time.circuit>0;});
  }
  function orient(x,y,z){const v=new THREE.Vector3(x,y,z).sub(camera.position);yaw=Math.atan2(-v.x,-v.z);pitch=Math.atan2(v.y,Math.hypot(v.x,v.z));}
  function focus(id){const [x,z]=POSITIONS[id],pendulum=id==='pendulum';walking=false;target={position:new THREE.Vector3(x+.2,pendulum?3.05:2.75,z+(pendulum?4.7:4.1)),look:new THREE.Vector3(x,pendulum?2.8:2.15,z)};document.exitPointerLock?.();}
  function overview(){walking=false;target={position:new THREE.Vector3(0,5.2,11.8),look:new THREE.Vector3(0,1.2,-2.5)};document.exitPointerLock?.();}
  function startWalk(lock=true){target=null;walking=true;if(camera.position.y>2.2){camera.position.set(0,1.75,9);orient(0,1.75,-3);}else camera.position.y=1.75;canvas.focus({preventScroll:true});if(lock && matchMedia('(pointer:fine)').matches){try { const request=canvas.requestPointerLock?.();request?.catch(()=>{}); }catch{ /* Drag and keyboard remain available. */ }}}
  function valid(x,z){return x>-11.2&&x<10.35&&z>-9.7&&z<11.3&&!colliders.some(c=>Math.abs(x-c.x)<c.w+.24&&Math.abs(z-c.z)<c.d+.24);}
  function stopInput(){keys.clear();}
  window.addEventListener('blur',stopInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopInput();});
  const keyboardCodes=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyE'];
  const inControl=event=>event.target.closest('input,textarea,select,dialog');
  window.addEventListener('keydown',e=>{if(inControl(e)||document.querySelector('dialog[open]')||!keyboardCodes.includes(e.code))return;e.preventDefault();if(e.code==='KeyE'){if(nearby)onSelect(nearby);return;}keys.add(e.code);target=null;walking=true;camera.position.y=1.75;});
  window.addEventListener('keyup',e=>keys.delete(e.code));
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{canvas.focus({preventScroll:true});drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(document.pointerLockElement===canvas){yaw-=e.movementX*.0022;pitch-=e.movementY*.0022;target=null;}else if(drag){yaw-=(e.clientX-drag.x)*.004;pitch-=(e.clientY-drag.y)*.004;drag.x=e.clientX;drag.y=e.clientY;target=null;}pitch=THREE.MathUtils.clamp(pitch,-1.2,1.15);});
  const ray=new THREE.Raycaster();
  canvas.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<6&&document.pointerLockElement!==canvas){const rect=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(clickable,true)[0];if(hit){let item=hit.object;while(item&&!item.userData.experiment)item=item.parent;if(item)onSelect(item.userData.experiment);}}drag=null;});
  canvas.addEventListener('pointercancel',()=>drag=null);
  document.querySelectorAll('[data-move]').forEach(button=>{const key={forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD'}[button.dataset.move];button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);startWalk(false);keys.add(key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(key));});
  let nearby=null, lastNear=null, lastMap=0;
  function render(dt,stamp){
    if(document.querySelector('dialog[open]'))keys.clear();
    if(target){const alpha=1-Math.exp(-dt*5);camera.position.lerp(target.position,alpha);orient(...target.look.toArray());if(camera.position.distanceTo(target.position)<.005)target=null;}
    if(walking){const turn=(Number(keys.has('ArrowLeft'))-Number(keys.has('ArrowRight')))*dt*1.5;yaw+=turn;const f=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown')),s=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));const n=Math.max(1,Math.hypot(f,s)),speed=3.6*dt/n;const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*speed,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*speed;if(valid(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(valid(camera.position.x,camera.position.z+dz))camera.position.z+=dz;}
    camera.rotation.set(pitch,yaw,0,'YXZ');
    nearby=null;let distance=4.9;for(const [id,[x,z]]of Object.entries(POSITIONS)){const dx=x-camera.position.x,dz=z-camera.position.z,d=Math.hypot(dx,dz),facing=(-Math.sin(yaw)*dx-Math.cos(yaw)*dz)/Math.max(d,.01);if(d<distance&&facing>.25){distance=d;nearby=id;}}
    if(nearby!==lastNear){onNearby(nearby);lastNear=nearby;}
    if(stamp-lastMap>90){onMove({x:camera.position.x,z:camera.position.z,yaw});lastMap=stamp;}
    renderer.render(scene,camera);
  }
  const observer=new ResizeObserver(()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();onError('Se perdió la conexión con el motor gráfico. Recarga el laboratorio para recuperar el salón; tu bitácora sigue guardada.');});
  return { render, updateModels, focus, overview, startWalk, stopInput, setQuality(high){renderer.shadowMap.enabled=high;renderer.setPixelRatio(high?Math.min(devicePixelRatio,1.75):1);renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);}, getPosition(){return camera.position.clone();} };
}
