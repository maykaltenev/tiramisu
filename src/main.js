import * as THREE from 'three';
import './style.css';

(function(){
var T=THREE,cv=document.getElementById('c'),R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
var S=new T.Scene(),cam=new T.PerspectiveCamera(38,1,.1,100);
S.add(new T.HemisphereLight(0xfff1dc,0x3a2a20,.4));
var L=new T.DirectionalLight(0xfff0d8,1.25);L.position.set(5,10,6);L.castShadow=true;L.shadow.mapSize.set(2048,2048);
var sc=L.shadow.camera;sc.left=sc.bottom=-7;sc.right=sc.top=7;L.shadow.radius=4;S.add(L);
var rim=new T.PointLight(0xffb066,.8,30);rim.position.set(-6,4,-5);S.add(rim);
var es=new T.Scene();es.add(new T.Mesh(new T.SphereGeometry(30,24,16),new T.MeshBasicMaterial({color:0x5b4a3c,side:T.BackSide})));
[[0,14,0,12,.3,12,5],[-14,6,6,.4,8,14,4],[14,4,-6,.4,6,12,3]].forEach(function(p){var m=new T.Mesh(new T.BoxGeometry(p[3],p[4],p[5]),new T.MeshBasicMaterial({color:new T.Color(p[6],p[6],p[6]*.95)}));m.position.set(p[0],p[1],p[2]);es.add(m)});
var pmg=new T.PMREMGenerator(R);S.environment=pmg.fromScene(es,.03).texture;
var G=new T.Group();S.add(G);
function rnd(a,b){return a+Math.random()*(b-a)}
function tex(w,h,fn,rep){var c=document.createElement('canvas');c.width=w;c.height=h;var x=c.getContext('2d');fn(x,w,h);var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4;if(rep)t.repeat.set(rep[0],rep[1]);return t}
var bT=tex(512,512,function(x,w,h){var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#ecc686');g.addColorStop(1,'#d39a52');x.fillStyle=g;x.fillRect(0,0,w,h);
for(var i=0;i<3500;i++){x.fillStyle='rgba('+(Math.random()<.5?'255,250,235,.55':'150,95,40,.35')+')';x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(.6,2.2),0,7);x.fill()}
for(var j=0;j<40;j++){x.strokeStyle='rgba(140,90,40,.12)';x.lineWidth=rnd(2,6);x.beginPath();x.moveTo(rnd(0,w),0);x.lineTo(rnd(0,w),h);x.stroke()}},[.3,.3]);
var cT=tex(512,512,function(x,w,h){x.fillStyle='#f6ecd0';x.fillRect(0,0,w,h);
for(var i=0;i<220;i++){x.strokeStyle=Math.random()<.5?'rgba(255,255,255,.35)':'rgba(205,170,105,.2)';x.lineWidth=rnd(6,22);x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(20,90),rnd(0,6),rnd(0,6)+rnd(1,3));x.stroke()}},[.2,.2]);
var kT=tex(512,512,function(x,w,h){for(var i=0;i<9000;i++){x.fillStyle='rgba('+Math.floor(rnd(50,95))+','+Math.floor(rnd(25,50))+',15,'+rnd(.25,.85)+')';x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(.8,3),0,7);x.fill()}});
var sT=tex(64,64,function(x,w,h){var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(90,50,28,1)');g.addColorStop(1,'rgba(90,50,28,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
var fT=tex(128,128,function(x,w,h){var g=x.createRadialGradient(64,64,4,64,64,64);g.addColorStop(0,'#6b3a1c');g.addColorStop(.7,'#2c140a');g.addColorStop(1,'#1a0b05');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='rgba(200,140,80,.25)';x.beginPath();x.arc(50,48,22,0,7);x.fill()});
function rr(w,h,r){var s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function slab(w,d,h,r,bs,bt,seg){var g=new T.ExtrudeGeometry(rr(w-2*bs,d-2*bs,Math.max(.02,r-bs)),{depth:h-2*bt,bevelEnabled:true,bevelThickness:bt,bevelSize:bs,bevelSegments:seg||4,curveSegments:10});g.rotateX(-Math.PI/2);g.computeBoundingBox();g.translate(0,-g.boundingBox.min.y,0);return g}
function mesh(g,m){var o=new T.Mesh(g,m);o.castShadow=o.receiveShadow=true;return o}
// ground shadow
var tT=tex(512,512,function(x,w,h){x.fillStyle='#2b2521';x.fillRect(0,0,w,h);for(var i=0;i<40;i++){x.strokeStyle='rgba(255,255,255,'+rnd(.02,.07)+')';x.lineWidth=rnd(1,4);x.beginPath();x.moveTo(rnd(0,w),0);x.bezierCurveTo(rnd(0,w),h*.3,rnd(0,w),h*.7,rnd(0,w),h);x.stroke()}},[.3,.3]);
var gr=new T.Mesh(new T.CylinderGeometry(6.4,6.4,.2,72),new T.MeshStandardMaterial({map:tT,roughness:.4,metalness:.1}));gr.position.y=-.12;gr.receiveShadow=true;G.add(gr);
// glass dish
var gm=new T.MeshStandardMaterial({color:0xdcf0f5,transparent:true,opacity:.3,roughness:.03,metalness:.1,envMapIntensity:1.6,depthWrite:false,side:T.DoubleSide});
var os=rr(5.6,4,.55);os.holes.push(new T.Path(rr(5,3.4,.35).getPoints(12)));
var dg=new T.ExtrudeGeometry(os,{depth:1.8,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:2,curveSegments:12});dg.rotateX(-Math.PI/2);
var dish=new T.Group(),w1=new T.Mesh(dg,gm),w2=new T.Mesh(slab(5.6,4,.12,.55,.03,.03,2),gm);dish.add(w1,w2);dish.renderOrder=10;w1.renderOrder=w2.renderOrder=10;G.add(dish);
// layers
var layers=[];
function bisc(y,k){var g=new T.Group();
for(var i=0;i<5;i++){var mi=new T.MeshStandardMaterial({map:bT,bumpMap:bT,bumpScale:.8,roughness:.85}),b=mesh(slab(.9,3.05,.32,.4,.1,.1,5),mi);b.userData={fx:-1.96+i*.98,fz:rnd(-.04,.04),fr:rnd(-.02,.02),m:mi};b.visible=false;g.add(b)}
g.position.y=y;g.userData={y:y,k:k,t:'b'};G.add(g);layers.push(g)}
function cream(y,k){var m=new T.MeshStandardMaterial({map:cT,bumpMap:cT,bumpScale:2.2,roughness:.45,transparent:true}),g=mesh(slab(4.9,3.3,.38,.4,.12,.12,5),m);
g.position.y=y;g.userData={y:y,k:k,m:m,t:'c'};G.add(g);layers.push(g)}
bisc(.12,1.45);cream(.44,3.2);bisc(.82,3.3);cream(1.14,5.2);
var cmat=new T.MeshStandardMaterial({map:kT,transparent:true,opacity:0,depthWrite:false,roughness:1}),coc=new T.Mesh(new T.PlaneGeometry(4.8,3.2).rotateX(-Math.PI/2),cmat);coc.position.y=1.53;G.add(coc);
// coffee pour
var cof=new T.MeshStandardMaterial({color:0x3b1d0e,roughness:.06,metalness:.05,envMapIntensity:2.2});
var stream=new T.Mesh(new T.CylinderGeometry(.13,.1,1,20),cof);G.add(stream);
var puddle=new T.Mesh(slab(1.56,3.36,.3,.28,.02,.02,2),cof);G.add(puddle);
var bowl=new T.Group(),bos=rr(2,3.8,.45);bos.holes.push(new T.Path(rr(1.6,3.4,.3).getPoints(12)));
var bg=new T.ExtrudeGeometry(bos,{depth:.55,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:2,curveSegments:12});bg.rotateX(-Math.PI/2);
var bmat=new T.MeshStandardMaterial({color:0xf2efe8,roughness:.25});bowl.add(mesh(bg,bmat),mesh(slab(2,3.8,.1,.45,.03,.03,2),bmat));G.add(bowl);
var ringM=new T.MeshBasicMaterial({color:0x9a6a44,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}),ring=new T.Mesh(new T.RingGeometry(.9,1,40).rotateX(-Math.PI/2),ringM);ring.position.y=.2;G.add(ring);
var ND=70,dr=[],dummy=new T.Object3D(),im=new T.InstancedMesh(new T.SphereGeometry(1,10,8),cof,ND);
for(var i=0;i<ND;i++){var vv=rnd(2.2,4);dr.push({a:rnd(0,6.28),h:rnd(.4,1.1),v:vv,T:vv/3,o:Math.random(),s:rnd(.03,.07)})}
im.frustumCulled=false;G.add(im);
var wT=tex(64,64,function(x){var g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}),steam=[],beans=[];
[[-1,.2,.5],[.2,-.3,2],[1.1,.25,1.2]].forEach(function(p){var b=mesh(new T.SphereGeometry(.2,20,14),new T.MeshStandardMaterial({color:0x3a1e10,roughness:.3})),gv=new T.Mesh(new T.BoxGeometry(.38,.03,.05),new T.MeshBasicMaterial({color:0x120805}));gv.position.y=.19;b.add(gv);b.scale.set(1,.6,.72);b.rotation.y=p[2];b.position.set(p[0],1.6,p[1]);G.add(b);beans.push(b)});
// cocoa dust
var N=300,pg=new T.BufferGeometry(),pa=new Float32Array(N*3),off=[];
for(var i=0;i<N;i++){pa[i*3]=rnd(-2.3,2.3);pa[i*3+2]=rnd(-1.5,1.5);off.push(Math.random())}
pg.setAttribute('position',new T.BufferAttribute(pa,3));
var pm=new T.PointsMaterial({map:sT,size:.28,transparent:true,opacity:0,depthWrite:false}),pts=new T.Points(pg,pm);G.add(pts);
function cl(v){return Math.max(0,Math.min(1,v))}function ease(t){return 1-Math.pow(1-t,3)}
var wet=new T.Color(.62,.45,.34),mx=0,my=0,f=0,target=0,cards=[].slice.call(document.querySelectorAll('.card')),nSec=cards.length,narrow=false;
function size(){var w=innerWidth,h=innerHeight;narrow=w<700;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
function read(){target=cl(scrollY/Math.max(1,document.body.scrollHeight-innerHeight))*(nSec-1)}
addEventListener('resize',size);addEventListener('scroll',read,{passive:true});
addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
size();read();var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
var BX=4.3,BZ=0;
function place(b,u,i){var d=b.userData,w=cl((f-u.k-i*.09)/.5);if(w<=0){b.visible=false;return}b.visible=true;
var sy=3.2-u.y,dy=.3-u.y,rd=narrow?Math.PI/2:0,x=BX,z=BZ,y,r=rd;
if(w<.35)y=sy+(dy-sy)*ease(w/.35);else if(w<.55)y=dy-.04*Math.sin((w-.35)*15);
else{var tt=ease((w-.55)/.45);x=BX+(d.fx-BX)*tt;z=BZ+(d.fz-BZ)*tt;y=dy*(1-tt)+Math.sin(Math.PI*tt)*1.4;r=rd+(d.fr-rd)*tt}
b.position.set(x,y,z);b.rotation.y=r;b.scale.setScalar(ease(cl(w/.08)));d.m.color.setRGB(1,1,1).lerp(wet,.8*cl((w-.3)/.25))}
function frame(){
f+=(target-f)*(still?1:.08);
BX=narrow?0:4.3;BZ=narrow?4.6:0;bowl.position.set(BX,0,BZ);bowl.rotation.y=narrow?Math.PI/2:0;
layers.forEach(function(g){var u=g.userData;
if(u.t==='b'){g.position.y=u.y;g.children.forEach(function(b,i){place(b,u,i)});return}
var t=ease(cl((f-(u.k-.8))/.8));g.visible=t>0;g.position.y=u.y+(1-t)*5;g.rotation.y=(1-t)*.6;u.m.opacity=t;u.m.transparent=t<.999});
var tm=performance.now()/1000,front=6.5-6.1*ease(cl((f-.1)/.4)),tail=6.5-6.1*ease(cl((f-1)/.45)),L=Math.max(tail-front,0),th=1-.7*cl((f-1)/.45),act=cl((f-.35)/.15)*(1-cl((f-1)/.3));
stream.visible=L>.01;stream.position.set(BX,(tail+front)/2,BZ);stream.scale.set((1+Math.sin(tm*25)*.08)*th,L,(1+Math.cos(tm*23)*.08)*th);
var pu=ease(cl((f-.3)/1.1));puddle.visible=pu>.01;puddle.position.set(BX,.1,BZ);puddle.rotation.y=bowl.rotation.y;puddle.scale.set(1,.1+.9*pu,1);
var rp=(tm*.9)%1;ring.position.set(BX,.42,BZ);ring.scale.set(.2+rp*.8,1,.2+rp*.8);ringM.opacity=.5*(1-rp)*act;im.position.set(BX,.42,BZ);
for(var i=0;i<ND;i++){var d=dr[i],t=((tm*.9+d.o)%1)*d.T,hh=d.h*.5;dummy.position.set(Math.cos(d.a)*hh*t,d.v*t-3*t*t,Math.sin(d.a)*hh*t);dummy.scale.setScalar(act*d.s);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix)}
im.instanceMatrix.needsUpdate=true;
var tm=performance.now()/1000;
beans.forEach(function(b,i){var t=ease(cl((f-5.5-i*.06)/.4));b.visible=t>0;b.position.y=1.6+(1-t)*3.5;b.rotation.x=(1-t)*2});
var pt=cl((f-5.1)/.8);pm.opacity=(pt>0&&pt<1)?.95:0;cmat.opacity=ease(cl((f-5.3)/.6));
var a=pg.attributes.position.array;for(var i=0;i<N;i++)a[i*3+1]=1.6+(1-pt)*3.8*(.5+off[i]);pg.attributes.position.needsUpdate=true;
G.rotation.y=-.35+f*.28+mx*.25;
cam.position.set(narrow?0:-.4,(narrow?9:6.4)+my*.8,narrow?20:13.5);cam.lookAt(narrow?0:1.6,narrow?1.4:1,narrow?1.8:0);
cards.forEach(function(c,i){c.style.opacity=cl(1.15-Math.abs(f-i)*1.7);c.style.transform='translateY('+((i-f)*24)+'px)'});
R.render(S,cam);requestAnimationFrame(frame)}
frame();
})();
