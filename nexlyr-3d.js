// nexlyr-3d.js — Liquid morphing 3D background engine
// Uses Three.js r128 from CDN

(function() {
  'use strict';

  let scene, camera, renderer, mesh, uniforms;
  let animId, canvas;
  const clock = { start: Date.now(), getElapsed: () => (Date.now() - clock.start) / 1000 };

  const VERT = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uScale;

    //	Simplex 3D Noise by Ian McEwan, Ashima Arts
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;
      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      vPosition = position;

      vec3 pos = position;
      float t = uTime * uSpeed;

      float noise = snoise(vec3(
        pos.x * uScale + t * 0.3,
        pos.y * uScale + t * 0.2,
        pos.z * uScale + t * 0.15
      ));

      float noise2 = snoise(vec3(
        pos.x * uScale * 0.5 + t * 0.15,
        pos.y * uScale * 0.5 + t * 0.25,
        pos.z * uScale * 0.5 - t * 0.1
      ));

      pos += normal * (noise * 0.35 + noise2 * 0.2);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const FRAG = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;

    void main() {
      vec3 col1 = vec3(0.08, 0.25, 0.8);   // deep blue
      vec3 col2 = vec3(0.0, 0.55, 0.72);   // teal
      vec3 col3 = vec3(0.35, 0.18, 0.85);  // violet

      float t = uTime * 0.15;
      float m1 = sin(vUv.x * 3.14 + t) * 0.5 + 0.5;
      float m2 = cos(vUv.y * 3.14 + t * 0.7) * 0.5 + 0.5;

      vec3 color = mix(mix(col1, col2, m1), col3, m2 * 0.5);

      // fresnel-like rim
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      float rim = 1.0 - max(0.0, dot(normalize(vNormal), viewDir));
      color += vec3(0.1, 0.3, 0.8) * pow(rim, 3.0) * 0.6;

      gl_FragColor = vec4(color, 0.82);
    }
  `;

  function init(canvasId, options = {}) {
    canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;

    const w = canvas.offsetWidth, h = canvas.offsetHeight;

    // Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = options.cameraZ || 3.2;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Geometry
    const geo = new THREE.SphereGeometry(1.2, 128, 128);

    uniforms = {
      uTime:  { value: 0 },
      uSpeed: { value: options.speed || 0.4 },
      uScale: { value: options.scale || 1.6 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      side: THREE.FrontSide,
    });

    mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Mouse parallax
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.4;
      my = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });

    // Resize
    window.addEventListener('resize', () => {
      const w2 = canvas.offsetWidth, h2 = canvas.offsetHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    });

    // Render loop
    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsed();
      uniforms.uTime.value = t;
      mesh.rotation.y += (mx - mesh.rotation.y) * 0.04;
      mesh.rotation.x += (-my - mesh.rotation.x) * 0.04;
      mesh.rotation.z = t * 0.04;
      renderer.render(scene, camera);
    }
    animate();
  }

  // Mini floating blobs for sections
  function initMiniBlob(canvasId, colorA, colorB) {
    const c = document.getElementById(canvasId);
    if (!c || typeof THREE === 'undefined') return;

    const scene2 = new THREE.Scene();
    const cam2 = new THREE.PerspectiveCamera(45, c.offsetWidth / c.offsetHeight, 0.1, 100);
    cam2.position.z = 3;
    const rend2 = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    rend2.setSize(c.offsetWidth, c.offsetHeight);
    rend2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rend2.setClearColor(0x000000, 0);

    const geo2 = new THREE.SphereGeometry(1, 64, 64);
    const u2 = {
      uTime:  { value: 0 },
      uSpeed: { value: 0.25 },
      uScale: { value: 2.2 },
    };
    const frag2 = FRAG.replace('vec3 col1 = vec3(0.08, 0.25, 0.8);', `vec3 col1 = vec3(${colorA});`);
    const mat2 = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag2, uniforms: u2, transparent: true });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    scene2.add(mesh2);

    (function loop() {
      requestAnimationFrame(loop);
      u2.uTime.value = clock.getElapsed();
      mesh2.rotation.y += 0.003;
      mesh2.rotation.x += 0.002;
      rend2.render(scene2, cam2);
    })();
  }

  // Card mouse-tracking highlight
  function initCardGlow() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  // Scroll-triggered fade-in for elements
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animationPlayState = 'running';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => {
      el.style.animationPlayState = 'paused';
      io.observe(el);
    });
  }

  // Counter animation
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(ease * target).toLocaleString() + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(update);
    })(start);
  }

  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(el => io.observe(el));
  }

  // Nav scroll
  function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-close');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
      if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
      mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
    }
  }

  // Public API
  window.Nexlyr = { init, initMiniBlob, initCardGlow, initScrollReveal, initCounters, initNav };

})();
