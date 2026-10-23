import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const isMobile = window.matchMedia('(max-width: 700px)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
// Limit fill-rate on phones; high-DPI full-resolution WebGL is expensive.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile || isCoarsePointer ? 1.0 : 1.7));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = !(isMobile || isCoarsePointer);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.setClearColor(0x21140f, 0);

const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.Fog(0x21140f, 9, 22);

const camera = new THREE.PerspectiveCamera(window.innerWidth < 700 ? 61 : 29, window.innerWidth / window.innerHeight, 0.1, 100);
// Keep the dessert prominent and almost front-on, like a premium food product shot.
camera.position.set(0, 3.35, window.innerWidth < 700 ? 14.6 : 6.8);
camera.lookAt(0, 0.72, 0);

scene.add(new THREE.HemisphereLight(0xffe9d4, 0x392014, 2.5));
const key = new THREE.DirectionalLight(0xffd9ad, 4.8);
key.position.set(-4, 8, 6); key.castShadow = !(isMobile || isCoarsePointer); key.shadow.mapSize.set(512, 512); key.shadow.bias = -0.00015; key.shadow.radius = 3; scene.add(key);
const fill = new THREE.PointLight(0xe4a46c, 85, 20); fill.position.set(4, 4, -3); scene.add(fill);
const rimLight = new THREE.DirectionalLight(0xfff4e5, 3.0); rimLight.position.set(1, 5, -6); scene.add(rimLight);

const mat = (color, roughness = .55, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const dishGlass = new THREE.MeshPhysicalMaterial({ color: 0xe7d9c9, roughness: .13, metalness: 0, transmission: .25, transparent: true, opacity: .5, thickness: .2 });
const dish = new THREE.Group(); scene.add(dish);
const dishBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, .18, 2.85), mat(0x8c7866, .28, .15));
dishBase.position.y = .05; dishBase.castShadow = true; dishBase.receiveShadow = true; dish.add(dishBase);
const floor = new THREE.Mesh(new THREE.BoxGeometry(4.05, .06, 2.7), mat(0xd6b88f, .3));
floor.position.y = .17; floor.receiveShadow = true; dish.add(floor);
// glass walls and top rim
const wallMat = new THREE.MeshStandardMaterial({ color: 0xe6d9ca, roughness: .15, metalness: .05, transparent: true, opacity: .42 });
function addBox(parent, w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
  mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
addBox(dish, 4.18, .72, .07, wallMat, 0, .48, -1.4);
addBox(dish, 4.18, .72, .07, wallMat, 0, .48, 1.4);
addBox(dish, .07, .72, 2.8, wallMat, -2.08, .48, 0);
addBox(dish, .07, .72, 2.8, wallMat, 2.08, .48, 0);
const rimMat = mat(0xe0c9a8, .23, .1);
addBox(dish, 4.3, .07, .09, rimMat, 0, .84, -1.42);
addBox(dish, 4.3, .07, .09, rimMat, 0, .84, 1.42);
addBox(dish, .09, .07, 2.85, rimMat, -2.12, .84, 0);
addBox(dish, .09, .07, 2.85, rimMat, 2.12, .84, 0);

const ingredients = new THREE.Group(); scene.add(ingredients);
const coffeeGroup = new THREE.Group(); ingredients.add(coffeeGroup);
const coffee = new THREE.Mesh(new THREE.BoxGeometry(3.92,.13,2.52), mat(0x4a2413,.22));
coffee.position.y=.22; coffee.castShadow=true; coffee.receiveShadow=true; coffeeGroup.add(coffee);
coffeeGroup.scale.y = 0;

const biscuitGroup = new THREE.Group(); ingredients.add(biscuitGroup);
const biscuitMat = mat(0xc78a4e,.75);
const biscuitTop = mat(0xe0b57d,.68);
function makeBiscuit(x,z,rot=0) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(.86,.19,.31,5,.095), biscuitMat);
  body.position.y=.075; body.castShadow=true; body.receiveShadow=true; g.add(body);
  const top = new THREE.Mesh(new RoundedBoxGeometry(.76,.025,.245,4,.08), biscuitTop);
  top.position.y=.176; top.castShadow=true; g.add(top);
  // toasted flecks
  for(let i=0;i<12;i++){
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.018,5,4),mat(i%2?0x8b4c26:0xe2b77c,.9));
    dot.position.set((Math.random()-.5)*.62,.193,(Math.random()-.5)*.095);g.add(dot);
  }
  g.position.set(x,.32,z);g.rotation.y=rot;return g;
}
const biscuitMeshes=[];
const biscuitMeshes2=[];
for(let row=0;row<3;row++) for(let col=0;col<4;col++){
  const b=makeBiscuit(-1.45+col*.96,-.82+row*.82,(row%2)*.025);
  biscuitGroup.add(b); biscuitMeshes.push(b);
  const b2=makeBiscuit(-1.45+col*.96,-.82+row*.82,((row+1)%2)*.035);
  biscuitMeshes2.push(b2);
}
biscuitGroup.children.forEach(b=>{b.position.y=3.6; b.rotation.x=-.35;});
const biscuitGroup2 = new THREE.Group(); ingredients.add(biscuitGroup2);
biscuitMeshes2.forEach(b=>{ biscuitGroup2.add(b); b.position.y=4.2; b.rotation.x=-.35; });
const creamGroup = new THREE.Group(); ingredients.add(creamGroup);
const creamMat = new THREE.MeshPhysicalMaterial({
  color: 0xffe8c9, roughness: .34, metalness: 0,
  clearcoat: .16, clearcoatRoughness: .3, sheen: .22, sheenRoughness: .42,
  sheenColor: new THREE.Color(0xffdcb5)
});
const creamHighlightMat = new THREE.MeshPhysicalMaterial({
  color: 0xfff0dc, roughness: .3, clearcoat: .18, clearcoatRoughness: .28,
  sheen: .18, sheenRoughness: .45
});
// Continuous mascarpone with shallow spatula waves, avoiding separate egg-like blobs.
function creamLayer(y, seed=0){
  const group = new THREE.Group();
  const base = new THREE.Mesh(new RoundedBoxGeometry(3.88,.22,2.48,5,.08), creamMat);
  base.position.y=-.01;base.castShadow=true;base.receiveShadow=true;group.add(base);
  const nx=84,nz=54,width=3.82,depth=2.42,positions=[],uvs=[],indices=[];
  for(let iz=0;iz<=nz;iz++){
    const z=-depth/2+depth*iz/nz;
    for(let ix=0;ix<=nx;ix++){
      const x=-width/2+width*ix/nx;
      const edge=Math.min(1,(width/2-Math.abs(x))/.22,(depth/2-Math.abs(z))/.22);
      const fade=Math.max(0,edge);
      const waves=.018*Math.sin(x*4.1+seed)*Math.cos(z*3.2-seed*.4)+.012*Math.sin(z*7.2+x*1.7+seed)+.006*Math.cos(x*9.5-z*4.3);
      const edgeRipple=.014*Math.sin(x*8+z*3+seed)*Math.max(0,1-edge*2);
      positions.push(x,.105+fade*(waves+edgeRipple),z);uvs.push(ix/nx,iz/nz);
      if(ix<nx&&iz<nz){const a=iz*(nx+1)+ix,b=a+1,c=a+nx+1,d=c+1;indices.push(a,c,b,b,c,d);}
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.setIndex(indices);geo.computeVertexNormals();
  const surface=new THREE.Mesh(geo,creamHighlightMat);surface.material.side=THREE.DoubleSide;surface.castShadow=true;surface.receiveShadow=true;group.add(surface);
  // Broad, subtle spatula trails make the cream feel freshly spread and moist.
  const ribbonMat=new THREE.MeshPhysicalMaterial({color:0xf6dfc0,roughness:.38,clearcoat:.1,transparent:true,opacity:.32});
  for(let k=0;k<7;k++){
    const pts=[],z0=-.92+k*.30;
    for(let j=0;j<=48;j++){
      const x=-1.78+j*(3.56/48),z=z0+.045*Math.sin(x*2.1+k*.7)+.018*Math.sin(x*5.1+k);
      const y=.116+.018*Math.sin(x*4.1+seed)*Math.cos(z*3.2-seed*.4)+.012*Math.sin(z*7.2+x*1.7+seed);
      pts.push(new THREE.Vector3(x,y,z));
    }
    const curve=new THREE.CatmullRomCurve3(pts);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve,64,.007,5,false),ribbonMat));
  }
  return group;
}
const cream1=creamLayer(0,0), cream2=creamLayer(0,1.7);
creamGroup.add(cream1,cream2);
cream1.position.y=2.8; cream2.position.y=3.8;
const cocoaGroup=new THREE.Group();ingredients.add(cocoaGroup);
const cocoaMat=mat(0x4b2818,.95);
// Cocoa is a fine airborne dusting, never a solid chocolate slab.
const cocoaParticles = new THREE.Group(); cocoaGroup.add(cocoaParticles);
const cocoaColors=[0x3a1c11,0x56301d,0x704629,0x8a5b39];
// Render cocoa as one lightweight point cloud rather than thousands of individual meshes.
const cocoaPositions=[], cocoaColorValues=[];
const cocoaThreeColors=cocoaColors.map(c=>new THREE.Color(c));
const cocoaCount=isMobile || isCoarsePointer ? 2100 : 5600;
for(let i=0;i<cocoaCount;i++){
 const size=.004+Math.random()*.009;
 cocoaPositions.push((Math.random()-.5)*3.78,.028+Math.random()*.028,(Math.random()-.5)*2.38);
 const c=cocoaThreeColors[i%cocoaThreeColors.length]; cocoaColorValues.push(c.r,c.g,c.b);
}
const cocoaGeometry=new THREE.BufferGeometry();
cocoaGeometry.setAttribute('position',new THREE.Float32BufferAttribute(cocoaPositions,3));
cocoaGeometry.setAttribute('color',new THREE.Float32BufferAttribute(cocoaColorValues,3));
const cocoaSpecks=new THREE.Points(cocoaGeometry,new THREE.PointsMaterial({size:isMobile || isCoarsePointer ? .038 : .03,sizeAttenuation:true,vertexColors:true,roughness:1,transparent:true,opacity:.98,depthWrite:false}));
cocoaParticles.add(cocoaSpecks);
const dustMaterial = new THREE.PointsMaterial({color:0x5b321e,size:isMobile || isCoarsePointer ? .022 : .02,sizeAttenuation:true,transparent:true,opacity:.52,depthWrite:false});
const dustVertices=[];
for(let i=0;i<(isMobile || isCoarsePointer ? 500 : 2400);i++) dustVertices.push((Math.random()-.5)*3.85,.06+Math.random()*.22,(Math.random()-.5)*2.44);
const dustGeometry=new THREE.BufferGeometry();
dustGeometry.setAttribute('position',new THREE.Float32BufferAttribute(dustVertices,3));
const airborneDust=new THREE.Points(dustGeometry,dustMaterial);
cocoaGroup.add(airborneDust);
cocoaGroup.position.y=3.5;

const counter = new THREE.Mesh(new THREE.PlaneGeometry(200,200),mat(0x291a13,.85));
counter.rotation.x=-Math.PI/2;counter.position.y=-.12;counter.receiveShadow=true;scene.add(counter);

const beanMat=mat(0x392015,.42);
for(let i=0;i<16;i++){
 const bean=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),beanMat);
 bean.scale.set(1.4,.65,.8);bean.position.set((Math.random()-.5)*8,.02, -2.8-Math.random()*4);bean.rotation.y=Math.random()*Math.PI;scene.add(bean);
}
const allLayers=[coffeeGroup,biscuitGroup,cream1,biscuitGroup2,cream2,cocoaGroup];
const titles=[
 ['01','Coffee base','Espresso and rum'],
 ['02','First ladyfinger layer','Softly dipped in coffee'],
 ['03','Silky mascarpone cream','The first cloud'],
 ['04','Second ladyfinger layer','A proper layered stack'],
 ['05','A second cream layer','Tall, fluffy and smooth'],
 ['06','Cocoa finish','Dusting stays on top']
];
const titleEl=document.querySelector('#scene-title'), subtitleEl=document.querySelector('#scene-subtitle'), numberEl=document.querySelector('.scene-number');
const progressEl=document.querySelector('#progress');

const state={step:0, targetRotation:0, targetTilt:0, dragging:false, dragMode:null, lastX:0, lastY:0, velocity:0, velocityY:0, cream1Y:2.8, cream2Y:3.8};
function animateStep(step){
 state.step=step;
 numberEl.textContent=titles[step][0];titleEl.textContent=titles[step][1];subtitleEl.textContent=titles[step][2];
 progressEl.style.width=((step+1)/6*100)+'%';
 gsap.to(coffeeGroup.scale,{y:1,duration:.7,ease:'power2.out'});
 const showFirst=step>=1, showCream1=step>=2, showSecond=step>=3, showCream2=step>=4, showCocoa=step>=5;
 biscuitMeshes.forEach((b,i)=>{
   gsap.to(b.position,{y:showFirst?.32:3.6,duration:.7,delay:showFirst?i*.018:0,ease:'power2.out'});
   gsap.to(b.rotation,{x:showFirst?0:-.35,duration:.5,delay:showFirst?i*.018:0});
 });
 biscuitMeshes2.forEach((b,i)=>{
   gsap.to(b.position,{y:showSecond?.91:4.2,duration:.7,delay:showSecond?i*.018:0,ease:'power2.out'});
   gsap.to(b.rotation,{x:showSecond?0:-.35,duration:.5,delay:showSecond?i*.018:0});
 });
 state.cream1Y=showCream1?.48:2.8; state.cream2Y=showCream2?1.12:3.8;
 gsap.to(cream1.position,{y:state.cream1Y,duration:1.0,ease:'power3.out'});
 gsap.to(cream2.position,{y:state.cream2Y,duration:1.0,ease:'power3.out'});
 // Cocoa is a separate cap above the upper cream; it stays on top in the final state.
 gsap.to(cocoaGroup.position,{y:showCocoa?1.24:3.5,duration:.8,ease:'power2.out'});
 // Each scroll step moves the camera closer and turns the dessert slightly for a progressive reveal.
 const mobileView = window.innerWidth < 700;
 const zoom=(mobileView ? [14.6,14.45,14.3,14.15,14.0,13.85] : [6.8,6.45,6.1,5.8,5.45,5.1])[step];
 const motionDuration=mobileView ? .58 : 1.0;
 const tilt=(mobileView ? [3.45,3.44,3.43,3.42,3.41,3.4] : [3.55,3.5,3.45,3.4,3.35,3.3])[step];
 gsap.to(camera.position,{x:.15,y:tilt,z:zoom,duration:motionDuration,ease:'power2.inOut',onUpdate:()=>camera.lookAt(0,.72,0)});
 state.targetRotation = step*.24;
}
gsap.set(coffeeGroup.scale,{y:0});
biscuitMeshes.forEach(b=>gsap.set(b.position,{y:3.6}));
biscuitMeshes2.forEach(b=>gsap.set(b.position,{y:4.2}));
gsap.set(cream1.position,{y:2.8});gsap.set(cream2.position,{y:3.8});gsap.set(cocoaGroup.position,{y:3.5});

ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',onEnterBack:()=>gsap.to(camera.position,{z:window.innerWidth<700?14.6:6.8,duration:window.innerWidth<700?.65:1.1,ease:'power2.inOut'})});
document.querySelectorAll('.step').forEach((section,index)=>{
 ScrollTrigger.create({
   trigger:section,start:'top center',end:'bottom center',
   onEnter:()=>animateStep(Number(section.dataset.step ?? index)),
   onEnterBack:()=>animateStep(Number(section.dataset.step ?? index))
 });
});
ScrollTrigger.create({trigger:'.ingredients',start:'top center',onEnter:()=>{
 numberEl.textContent='✦';titleEl.textContent='The ingredient list';subtitleEl.textContent='Ready for your kitchen';
 gsap.to(camera.position,{z:window.innerWidth<700?14.6:6.8,duration:window.innerWidth<700?.65:1.1,ease:'power2.inOut'});
},onEnterBack:()=>gsap.to(camera.position,{z:window.innerWidth<700?13.85:5.1,duration:window.innerWidth<700?.65:1.1,ease:'power2.inOut'})});
function resize(){camera.aspect=innerWidth/innerHeight;
 camera.position.x=0;
 camera.position.z=THREE.MathUtils.clamp(camera.position.z,innerWidth<700?13.2:4.3,innerWidth<700?16.5:9.0);
 camera.fov=innerWidth<700?61:29;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, innerWidth<700 || isCoarsePointer ? 1.25 : 1.7));
 camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);ScrollTrigger.refresh();}
addEventListener('resize',resize);
// Direct manipulation: drag anywhere over the stage to orbit 360 degrees.
canvas.style.pointerEvents='none'; // UI text remains selectable; the stage listens globally.
document.addEventListener('pointerdown',e=>{
 if(e.target.closest('a,button,input,textarea')) return;
 state.dragging=true;state.dragMode=null;state.lastX=e.clientX;state.lastY=e.clientY;
 state.velocity=0;state.velocityY=0;
});
document.addEventListener('pointermove',e=>{
 if(!state.dragging)return;
 const dx=e.clientX-state.lastX,dy=e.clientY-state.lastY;
 state.lastX=e.clientX;state.lastY=e.clientY;
 if(state.dragMode===null){
   if(Math.abs(dx)+Math.abs(dy)<5)return;
   // On touch screens, vertical gestures remain normal page scrolling.
   state.dragMode=(e.pointerType==='touch' && Math.abs(dy)>Math.abs(dx)*1.15)?'scroll':'orbit';
 }
 if(state.dragMode==='scroll')return;
 state.targetRotation += dx*.014;
 state.targetTilt = THREE.MathUtils.clamp(state.targetTilt+dy*.006,-.38,.38);
 state.velocity=dx*.0022;state.velocityY=dy*.001;
});
function stopDrag(){state.dragging=false;}
document.addEventListener('pointerup',stopDrag);
document.addEventListener('pointercancel',stopDrag);
addEventListener('wheel',e=>{
 if(e.ctrlKey)return;
 camera.position.z=THREE.MathUtils.clamp(camera.position.z+Math.sign(e.deltaY)*.12,window.innerWidth<700?13.2:4.3,window.innerWidth<700?16.5:9.0);
},{passive:true});
let lastRenderTime=0;
function render(now=0){
 requestAnimationFrame(render);
 // Keep mobile GPU work near 30 fps while leaving scroll and GSAP animation smooth.
 const mobileNow = isMobile || isCoarsePointer;
 if(mobileNow && now-lastRenderTime<24) return;
 lastRenderTime=now;
 // Slow, restrained product-shot rotation: both the glass dish and food turn together.
 if(!state.dragging){
 state.targetRotation += state.velocity; state.velocity *= .94;
 state.targetTilt += state.velocityY; state.velocityY *= .92;
}
const rot=state.targetRotation;
dish.rotation.y += (rot-dish.rotation.y)*.16;
ingredients.rotation.y += (rot-ingredients.rotation.y)*.16;
const tilt=state.targetTilt;
dish.rotation.x += (tilt-dish.rotation.x)*.12;
ingredients.rotation.x += (tilt-ingredients.rotation.x)*.12;
// Keep the dessert still unless the visitor scrolls or interacts.
renderer.render(scene,camera);
}
render();
animateStep(0);
