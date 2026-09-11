/* Salón 3D, navegación con colisiones y representaciones de los modelos SI. */
(function(){
'use strict';
const T=window.THREE;
class PhysicsRoom {
 constructor(host,onSelect){
  this.host=host;this.onSelect=onSelect;this.mode='overview';this.selected=0;this.keys=new Set();this.time=0;this.last=0;this.yaw=0;this.pitch=0;this.models=[];this.targets=[];this.positions=[[-5,-3],[0,-3],[5,-3],[-5,3],[0,3],[5,3]];
  if(!T)throw new Error('No se cargó Three.js');
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false});
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));this.renderer.outputEncoding=T.sRGBEncoding;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  host.appendChild(this.renderer.domElement);
  this.scene=new T.Scene();this.scene.background=new T.Color('#243f37');this.scene.fog=new T.Fog('#243f37',27,58);
  this.camera=new T.PerspectiveCamera(45,1,.1,90);this.camera.position.set(16,15,21);this.camera.lookAt(0,0,0);
  this.scene.add(new T.HemisphereLight('#fff6dd','#526b54',.9));
  const sun=new T.DirectionalLight('#fff2ce',1.05);sun.position.set(4,15,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.04;this.scene.add(sun);
  const fill=new T.DirectionalLight('#b7dddb',.65);fill.position.set(-8,7,-4);this.scene.add(fill);
  this.buildRoom();this.buildTables();this.select(0,PhysicsLab.defaults(PhysicsLab.labs[0]));this.view('overview',true);this.bind();
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
 }
 mat(color,extra={}){return new T.MeshStandardMaterial({color:new T.Color(color).convertSRGBToLinear(),roughness:.7,metalness:.05,...extra});}
 box(parent,w,h,d,x,y,z,color){const m=new T.Mesh(new T.BoxGeometry(w,h,d),this.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 sphere(parent,r,x,y,z,color){const m=new T.Mesh(new T.SphereGeometry(r,20,14),this.mat(color,{roughness:.3,metalness:.2}));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 line(parent,points,color,width=1){const g=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));const line=new T.Line(g,new T.LineBasicMaterial({color,linewidth:width}));parent.add(line);return line;}
 cylinder(parent,r,h,x,y,z,color){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,18),this.mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
 label(parent,text,x,y,z,color='#eef4d9',scale=2.8){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const c=canvas.getContext('2d');c.fillStyle='#193c32';c.fillRect(0,0,768,128);c.fillStyle=color;c.font='600 38px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(text,384,64);const tx=new T.CanvasTexture(canvas);tx.encoding=T.sRGBEncoding;const s=new T.Sprite(new T.SpriteMaterial({map:tx,depthTest:true}));s.position.set(x,y,z);s.scale.set(scale,scale/6,1);parent.add(s);return s;}
 arrow(parent,a,b,color){const from=new T.Vector3(...a),to=new T.Vector3(...b),d=to.clone().sub(from);const len=d.length();if(len<.001)return null;const arrow=new T.ArrowHelper(d.normalize(),from,len,color,Math.min(.22,len*.25),Math.min(.12,len*.15));parent.add(arrow);return arrow;}
 buildRoom(){
  const s=this.scene;
  this.box(s,19,.3,15,0,-.2,0,'#aab99a');
  const grid=new T.GridHelper(18,18,'#819476','#94a587');grid.position.y=-.038;s.add(grid);
  this.box(s,19,4.8,.22,0,2.2,-7.4,'#c0c9ad');this.box(s,.22,4.8,15,-9.4,2.2,0,'#a6b598');
  this.box(s,19,.16,.12,0,.13,-7.22,'#778967');this.box(s,.12,.16,15,-9.22,.13,0,'#778967');
  this.box(s,6.3,2.7,.15,.2,2.65,-7.19,'#294d40');
  const boardCanvas=document.createElement('canvas');boardCanvas.width=1200;boardCanvas.height=500;
  const bc=boardCanvas.getContext('2d');bc.fillStyle='#294d40';bc.fillRect(0,0,1200,500);bc.textAlign='center';bc.fillStyle='#e6efbe';bc.font='600 62px sans-serif';bc.fillText('LABORATORIO DE FÍSICA',600,155);bc.font='34px sans-serif';bc.fillText('PREGUNTAR  →  PROBAR  →  EXPLICAR',600,270);bc.font='italic 47px serif';bc.fillText('F = ma       E = mc²       v = λf',600,390);
  const boardTexture=new T.CanvasTexture(boardCanvas);boardTexture.encoding=T.sRGBEncoding;
  const boardText=new T.Mesh(new T.PlaneGeometry(6.1,2.55),new T.MeshBasicMaterial({map:boardTexture}));boardText.position.set(.2,2.65,-7.1);s.add(boardText);
  // Ventanas, marcos y alféizares.
  for(const z of [-4.6,.1,4.6]){
   this.box(s,.06,2.5,3.1,-9.23,2.65,z,'#d7e8cc');
   for(const dz of [-1.6,0,1.6])this.box(s,.14,2.65,.07,-9.14,2.65,z+dz,'#eceddb');
   this.box(s,.14,.08,3.3,-9.14,2.65,z,'#eceddb');this.box(s,.38,.13,3.5,-9.1,1.3,z,'#e4e6d1');
  }
  // Almacenamiento y libros al fondo.
  for(const x of [-6.4,6.5]){
   this.box(s,2.6,1.15,.85,x,.57,-6.7,'#687c5f');this.box(s,2.8,.14,1,x,1.18,-6.7,'#dccb9d');
   for(const dx of [-.6,.6]){this.box(s,1.1,.8,.03,x+dx,.6,-6.25,'#859372');this.box(s,.25,.05,.07,x+dx,.8,-6.2,'#d8d7b8');}
   for(let j=0;j<5;j++)this.box(s,.18,.4+j%2*.13,.35,x-.8+j*.22,1.45,-6.7,['#d6ab67','#416253','#a6ba91'][j%3]);
   this.cylinder(s,.18,.4,x+.9,1.44,-6.7,'#d8c8a1');
   for(let j=0;j<5;j++){const leaf=this.sphere(s,.2,x+.9+Math.sin(j)*.15,1.77+(j%2)*.22,-6.7+Math.cos(j)*.12,'#567c42');leaf.scale.y=1.8;}
  }
  // Cartel y reloj.
  this.box(s,1.1,1.25,.06,4.35,2.9,-7.23,'#f0e6bc');this.label(s,'INDAGA',4.35,3.1,-7.08,'#e1e9c8',1);
  const clock=this.cylinder(s,.42,.08,7.8,3.55,-7.17,'#eee9cf');clock.rotation.x=Math.PI/2;
  this.line(s,[[7.8,3.55,-7.1],[7.8,3.86,-7.1]],'#315043');this.line(s,[[7.8,3.55,-7.1],[8.03,3.44,-7.1]],'#315043');
  // Marcas de pasillo.
  for(let z=-5;z<7;z+=1.2)this.box(s,.045,.01,.45,2.5,-.025,z,'#e3e6c6');
 }
 buildTables(){
  this.positions.forEach(([x,z],i)=>{
   const root=new T.Group();root.position.set(x,0,z);this.scene.add(root);
   this.box(root,3.6,.19,2.35,0,1.05,0,'#d5c5a0');this.box(root,3.35,.12,2.12,0,.9,0,'#455d4a');
   for(const a of [-1.48,1.48])for(const b of [-.86,.86])this.box(root,.13,.9,.13,a,.42,b,'#526752');
   const mat=this.box(root,3.1,.025,1.9,0,1.16,0,'#294d42');
   const hit=this.box(root,3.65,.06,2.4,0,1.18,0,PhysicsLab.labs[i].color);hit.material.transparent=true;hit.material.opacity=.06;hit.userData.station=i;this.targets.push(hit);
   const m=new T.Group();m.position.y=1.2;root.add(m);this.models.push(m);
   this.label(root,`${String(i+1).padStart(2,'0')}   ${PhysicsLab.labs[i].short.toUpperCase()}`,0,2.75,-.1,PhysicsLab.labs[i].color,3.25);
   const stool=this.cylinder(root,.33,.12,.85,.58,1.6,'#e0d1a9');for(const dx of [-.19,.19])this.box(root,.065,.5,.065,.85+dx,.27,1.6,'#4e6754');
   this.drawModel(i,PhysicsLab.defaults(PhysicsLab.labs[i]),0);
  });
  this.selection=new T.Mesh(new T.RingGeometry(2.05,2.12,64),new T.MeshBasicMaterial({color:'#e2ed9a',side:T.DoubleSide,transparent:true,opacity:.85}));this.selection.rotation.x=-Math.PI/2;this.selection.position.y=.005;this.scene.add(this.selection);
 }
 clear(group){while(group.children.length){const child=group.children[0];group.remove(child);child.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.map)m.map.dispose();m.dispose();}}});}}
 drawModel(i,p,t){
  const m=this.models[i];this.clear(m);const col=PhysicsLab.labs[i].color;
  if(i===0){
   const sx=p.x/8*2.4,sy=p.y/8*1.45;
   this.line(m,[[-1.2,.06,.73],[1.2,.06,.73]],'#9ea98c');this.line(m,[[-1.2,.06,.73],[-1.2,.06,-.73]],'#9ea98c');
   this.arrow(m,[-1.2,.08,.73],[-1.2+sx,.08,.73],'#e8c789');this.arrow(m,[-1.2+sx,.08,.73],[-1.2+sx,.08,.73-sy],'#9eced5');this.arrow(m,[-1.2,.11,.73],[-1.2+sx,.11,.73-sy],col);
   const u=Math.min(t/4,1);this.sphere(m,.11,-1.2+sx*Math.min(u*2,1),.19,.73-sy*Math.max(0,u*2-1),'#f3f4d3');
  }else if(i===1){
   const r=PhysicsLab.labs[i].calculate(p),a=p.angle*Math.PI/180,scale=2.5/Math.max(r.range,r.height*1.5),tt=Math.min(t,r.flight);
   this.box(m,2.8,.07,.6,0,.04,0,'#697d62');const pts=PhysicsLab.labs[i].curve(p).map(([x,y])=>[-1.25+x*scale,.2+y*scale,0]);this.line(m,pts,col);this.sphere(m,.13,-1.25+p.v*Math.cos(a)*tt*scale,.2+Math.max(0,p.v*Math.sin(a)*tt-.5*PhysicsLab.g*tt*tt)*scale,0,'#f0c678');
   this.cylinder(m,.17,.12,-1.25,.12,0,'#d8dec1');
  }else if(i===2){
   this.box(m,2.9,.06,.65,0,.04,0,'#a5b293');for(let x=-1.3;x<=1.3;x+=.2)this.box(m,.02,.02,.75,x,.08,0,'#617b62');
   const x=-1.1+(p.force?2.1*(Math.min(t,2)/2)**2:0);const cart=this.box(m,.5,.28,.4,x,.28,0,col);cart.scale.y=.75+p.mass/12;
   for(const a of [-.17,.17])for(const b of [-.24,.24]){const w=this.cylinder(m,.095,.06,x+a,.15,b,'#20382e');w.rotation.x=Math.PI/2;}
   this.arrow(m,[x,.7,0],[x+p.force/20*.85,.7,0],'#ecd58b');
   this.arrow(m,[x,.9,0],[x,.9+p.mass/10*.6,0],'#93c7ed');this.arrow(m,[x,.85,0],[x,.85-p.mass/10*.6,0],'#eea16f');
  }else if(i===3){
   const h=.35+p.height*.25,run=h/Math.tan(Math.PI/6),scale=Math.min(1,2.65/run),height=h*scale,len=run*scale;
   const ramp=this.box(m,Math.hypot(len,height),.07,.75,0,.1+height/2,0,'#beae80');ramp.rotation.z=-Math.PI/6;
   this.box(m,.08,height,.65,-len/2,height/2,0,'#758962');const end=PhysicsLab.labs[i].duration(p),u=Math.min(t/end,1)**2;
   const b=this.box(m,.25,.22,.3,-len/2+len*u,.27+height*(1-u),0,col);b.rotation.z=-Math.PI/6;
   this.box(m,.13,Math.max(.02,(1-u)*.9),.13,1.4,Math.max(.02,(1-u)*.9)/2,.55,'#cde78e');this.box(m,.13,Math.max(.02,u*.9),.13,1.1,Math.max(.02,u*.9)/2,.55,'#ed9d72');
  }else if(i===4){
   this.box(m,2.9,.06,.85,0,.04,0,'#789273');const pts=[];
   for(let j=0;j<=100;j++){const x=j/100*8;pts.push([-1.35+x/8*2.7,.7+p.amplitude*.65*Math.sin(2*Math.PI*(x*p.frequency/p.speed-p.frequency*t)),0]);}
   this.line(m,pts,col);const point=pts[50];this.sphere(m,.085,...point,'#f1b27d');
   this.box(m,.07,1.35,.07,-1.4,.65,0,'#d1d9ba');this.box(m,.07,1.35,.07,1.4,.65,0,'#d1d9ba');
  }else{
   this.box(m,2.85,.05,1.5,0,.04,0,'#859474');
   this.box(m,.38,.24,.5,-1.08,.18,0,'#dab268');this.label(m,`${p.voltage} V`,-1.08,.5,0,'#f3e0a1',.55);
   const path=[[-1.08,.14,-.5],[1.15,.14,-.5],[1.15,.14,.5],[-1.08,.14,.5],[-1.08,.14,-.5]];this.line(m,path,'#e6d49b');
   if(p.connection==='parallel'){
    this.line(m,[[-.4,.14,-.5],[-.4,.14,.5]],'#e6d49b');for(const x of [-.4,1.15]){this.box(m,.19,.18,.43,x,.19,0,'#c89b64');this.box(m,.22,.03,.04,x,.29,0,'#563b27');}
   }else{for(const x of [-.1,.65]){this.box(m,.42,.18,.19,x,.19,-.5,'#c89b64');this.box(m,.04,.03,.23,x,.29,-.5,'#563b27');}}
   const current=PhysicsLab.labs[i].calculate(p).current;
   for(let j=0;j<8;j++){const u=(j/8+t*current*.3)%1,segment=u*4,idx=Math.floor(segment),f=segment-idx;const a=path[idx],b=path[idx+1];this.sphere(m,.035,a[0]+(b[0]-a[0])*f,.22,a[2]+(b[2]-a[2])*f,'#f4efb4');}
   if(p.connection==='parallel')for(let j=0;j<3;j++)this.sphere(m,.035,-.4,.22,-.5+((j/3+t*current*.3)%1),'#f4efb4');
  }
 }
 select(i,p){this.selected=i;this.params={...p};this.time=0;const [x,z]=this.positions[i];this.selection.position.set(x,.005,z);this.drawModel(i,p,0);if(this.mode==='focus')this.view('focus');}
 update(p,t){this.params=p;this.time=t;this.dirty=true;}
 resize(){const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();if(this.mode==='overview')this.view('overview',true);}
 view(mode,instant=false){
  this.mode=mode;this.keys.clear();this.host.dataset.mode=mode;
  let pos,target;
  if(mode==='overview'){const narrow=this.host.clientWidth/this.host.clientHeight<1.15;pos=new T.Vector3(narrow?19:15,narrow?21:16,narrow?27:20);target=new T.Vector3(0,.7,-.6);}
  else if(mode==='focus'){const [x,z]=this.positions[this.selected];pos=new T.Vector3(x+3.2,4.5,z+4.3);target=new T.Vector3(x,1.55,z);}
  else{pos=new T.Vector3(2.5,1.7,6.2);this.yaw=0;this.pitch=0;this.camera.rotation.order='YXZ';}
  this.destination=pos;this.lookTarget=target;
  if(instant||mode==='walk'){this.camera.position.copy(pos);if(target)this.camera.lookAt(target);else this.camera.rotation.set(0,0,0,'YXZ');}
 }
 allowed(x,z){return Math.abs(x)<8.8&&Math.abs(z)<6.8&&!this.positions.some(([a,b])=>Math.abs(x-a)<2.08&&Math.abs(z-b)<1.5)&&!(z < -5.5&&(Math.abs(x-6.5)<1.7||Math.abs(x+6.4)<1.7));}
 bind(){
  let drag=null;
  this.host.addEventListener('pointerdown',e=>{if(e.target.tagName!=='CANVAS')return;this.host.focus();drag={x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY};this.host.setPointerCapture(e.pointerId);});
  this.host.addEventListener('pointermove',e=>{if(!drag)return;if(this.mode==='walk'){this.yaw-=(e.clientX-drag.px)*.004;this.pitch=Math.max(-.8,Math.min(.8,this.pitch-(e.clientY-drag.py)*.004));}drag.px=e.clientX;drag.py=e.clientY;});
  this.host.addEventListener('pointerup',e=>{if(!drag)return;const distance=Math.hypot(e.clientX-drag.x,e.clientY-drag.y);drag=null;if(distance>6)return;const r=this.host.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);const hits=ray.intersectObjects(this.targets);if(hits.length)this.onSelect(hits[0].object.userData.station);});
  this.host.addEventListener('pointercancel',()=>drag=null);
  window.addEventListener('keydown',e=>{if(this.mode!=='walk'||document.activeElement!==this.host||document.querySelector('dialog[open]'))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.keys.add(e.code);}});
  window.addEventListener('keyup',e=>this.keys.delete(e.code));window.addEventListener('blur',()=>this.keys.clear());this.host.addEventListener('blur',()=>this.keys.clear());document.addEventListener('visibilitychange',()=>this.keys.clear());
  document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.keys.add(b.dataset.move);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>this.keys.delete(b.dataset.move));});
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;document.getElementById('scene-fallback').hidden=false;});this.renderer.domElement.addEventListener('webglcontextrestored',()=>{this.lost=false;document.getElementById('scene-fallback').hidden=true;});
 }
 frame(ms){requestAnimationFrame(this.frame);const dt=Math.min((ms-this.last)/1000,.05);this.last=ms;if(document.hidden||this.lost)return;
  if(this.mode==='walk'){
   const has=(...k)=>k.some(x=>this.keys.has(x));this.yaw+=(Number(has('ArrowLeft'))-Number(has('ArrowRight')))*dt*1.5;
   const f=Number(has('KeyW','ArrowUp'))-Number(has('KeyS','ArrowDown')),s=Number(has('KeyD'))-Number(has('KeyA')),norm=Math.max(1,Math.hypot(f,s));
   const dx=(-Math.sin(this.yaw)*f+Math.cos(this.yaw)*s)*dt*3/norm,dz=(-Math.cos(this.yaw)*f-Math.sin(this.yaw)*s)*dt*3/norm;
   const p=this.camera.position;if(this.allowed(p.x+dx,p.z))p.x+=dx;if(this.allowed(p.x,p.z+dz))p.z+=dz;this.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');
  }else if(this.destination){this.camera.position.lerp(this.destination,1-Math.exp(-dt*6));this.camera.lookAt(this.lookTarget);}
  // Geometry changes are throttled; the static room stays cached on the GPU.
  if(this.dirty&&ms-(this.drawTime||0)>50){this.drawModel(this.selected,this.params,this.time);this.dirty=false;this.drawTime=ms;}
  this.renderer.render(this.scene,this.camera);
 }
}
window.PhysicsRoom=PhysicsRoom;
})();
