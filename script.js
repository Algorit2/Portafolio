(() => {
  "use strict";

  const intro = document.getElementById("intro");
  const introContent = document.getElementById("intro-content");
  const site = document.getElementById("site");
  const skipButton = document.getElementById("skip-intro");
  const progress = document.getElementById("intro-progress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finished = false;
  let renderer, scene, camera, blackHole, accretion, particles, animationId;

  function finishIntro() {
    if (finished) return;
    finished = true;
    if (animationId) cancelAnimationFrame(animationId);
    intro.classList.add("is-leaving");
    site.classList.add("is-visible");
    document.body.classList.remove("intro-active");
    window.setTimeout(() => { intro.hidden = true; }, 1100);
  }

  function startIntro() {
    document.body.classList.add("intro-active");
    progress.classList.add("run");
    if (reducedMotion) {
      window.setTimeout(finishIntro, 700);
      return;
    }
    window.setTimeout(() => {
      if (finished) return;
      introContent.classList.add("is-absorbed");
      window.setTimeout(finishIntro, 850);
    }, 4400);
  }
  skipButton.addEventListener("click", finishIntro);

  function createFallback() {
    const canvas = document.getElementById("space-canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stars = Array.from({length: 180}, () => ({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.2,a:Math.random()*.7+.15}));
    function draw() {
      if (finished) return;
      const w = canvas.width = Math.floor(innerWidth * Math.min(devicePixelRatio || 1, 1.6));
      const h = canvas.height = Math.floor(innerHeight * Math.min(devicePixelRatio || 1, 1.6));
      ctx.clearRect(0,0,w,h);
      const t = performance.now()*.0003, cx=w/2, cy=h/2;
      stars.forEach(s => {ctx.fillStyle=`rgba(220,220,255,${s.a})`;ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill();});
      for(let ring=0;ring<9;ring++){
        ctx.beginPath();ctx.ellipse(cx,cy,80+ring*15,22+ring*6,t+ring*.06,0,Math.PI*2);
        ctx.strokeStyle=`hsla(${190+ring*18},90%,${60-ring*2}%,${.48-ring*.035})`;ctx.lineWidth=2;ctx.stroke();
      }
      const g=ctx.createRadialGradient(cx,cy,3,cx,cy,100);
      g.addColorStop(0,"#020208");g.addColorStop(.4,"#060610");g.addColorStop(.58,"#8a51d9");g.addColorStop(.7,"#54e9f1");g.addColorStop(1,"transparent");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,100,0,Math.PI*2);ctx.fill();
      animationId=requestAnimationFrame(draw);
    }
    draw();
  }

  function createThreeScene() {
    if (!window.THREE) { createFallback(); return; }
    try {
      const THREE = window.THREE;
      const canvas = document.getElementById("space-canvas");
      renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:innerWidth>700,powerPreference:"low-power"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(innerWidth,innerHeight);
      renderer.setClearColor(0x030309,0);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100);
      camera.position.set(0,0,12);

      const blackMaterial = new THREE.MeshBasicMaterial({color:0x020208});
      blackHole = new THREE.Mesh(new THREE.SphereGeometry(1.02,48,48),blackMaterial);
      scene.add(blackHole);

      const ringColors = [0x61e8f4,0x9670ff,0xe66bd4,0x7955dc,0x4bd8ed];
      accretion = new THREE.Group();
      for(let i=0;i<7;i++){
        const geo = new THREE.TorusGeometry(1.35+i*.17,.018+(i%3)*.006,8,150);
        const mat = new THREE.MeshBasicMaterial({color:ringColors[i%ringColors.length],transparent:true,opacity:.7-i*.055,blending:THREE.AdditiveBlending,depthWrite:false});
        const ring = new THREE.Mesh(geo,mat);
        ring.rotation.x = 1.12 + i*.035;
        ring.rotation.y = i*.23;
        ring.rotation.z = i*.5;
        ring.scale.set(1.28, .56+i*.025, 1);
        accretion.add(ring);
      }
      scene.add(accretion);

      const starCount = 1200;
      const positions = new Float32Array(starCount*3);
      const sizes = new Float32Array(starCount);
      for(let i=0;i<starCount;i++){
        positions[i*3]=(Math.random()-.5)*27;
        positions[i*3+1]=(Math.random()-.5)*16;
        positions[i*3+2]=(Math.random()-.5)*12-2;
        sizes[i]=Math.random();
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
      starGeo.setAttribute("size",new THREE.BufferAttribute(sizes,1));
      const starMat = new THREE.PointsMaterial({color:0xcac9ff,size:.025,transparent:true,opacity:.8,sizeAttenuation:true});
      particles = new THREE.Points(starGeo,starMat);
      scene.add(particles);

      const glow = new THREE.PointLight(0x8d5cff,2.4,12);
      glow.position.set(0,0,2);
      scene.add(glow);
      const cyanLight = new THREE.PointLight(0x50e7f1,1.4,10);
      cyanLight.position.set(3,1,1);
      scene.add(cyanLight);

      const clock = new THREE.Clock();
      function render(){
        if(finished) return;
        const t=clock.getElapsedTime();
        accretion.rotation.z=t*.08;
        accretion.rotation.y=Math.sin(t*.18)*.1;
        particles.rotation.z=t*.008;
        blackHole.rotation.y=t*.04;
        const pulse=1+Math.sin(t*1.4)*.012;
        blackHole.scale.setScalar(pulse);
        renderer.render(scene,camera);
        animationId=requestAnimationFrame(render);
      }
      render();
      window.addEventListener("resize",onResize,{passive:true});
    } catch (error) {
      console.warn("No se pudo iniciar WebGL; se usará la animación alternativa.",error);
      createFallback();
    }
  }
  function onResize(){
    if(!renderer||!camera)return;
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  }

  const menuToggle=document.getElementById("menu-toggle");
  const nav=document.getElementById("nav");
  menuToggle.addEventListener("click",()=>{
    const open=nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded",String(open));
    menuToggle.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");
  });
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded","false");
  }));
  document.getElementById("year").textContent=new Date().getFullYear();

  createThreeScene();
  startIntro();
})();
