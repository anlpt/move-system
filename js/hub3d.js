/* ==========================================================================
   MOVE SYSTEM — City Scene  (v13 — Architectural Concept, Perspective)
   White card model · Red accent · Plan-view trees · Diagonal hatching
   Human figures · Context massing · Organic boundary · Perspective camera
   ========================================================================== */
(function () {
  "use strict";
  if (typeof THREE === "undefined") { return; }
  var host = document.getElementById("hub3d");
  if (!host) return;

  /* ── Lab definitions ─────────────────────────────────────────────────── */
  var LABS = {
    see:    { name:"SEE Living Lab",     sub:"Road Safety · VR · Eye-Tracking",  url:"labs/see.html",    dot:"#C82828" },
    smart:  { name:"Smart Mobility Lab", sub:"TOD · MaaS · Traffic Operations",  url:"labs/smart.html",  dot:"#C82828" },
    rail:   { name:"CE-Rail@UEH",        sub:"CBTC · Rail Simulation · Training",url:"labs/rail.html",   dot:"#C82828" },
    ctrlab: { name:"CtrLab",             sub:"Net-Zero · Air Quality · Climate", url:"labs/ctrlab.html", dot:"#C82828" },
  };

  /* ── Tooltip ─────────────────────────────────────────────────────────── */
  var tip = document.createElement("div");
  tip.style.cssText = "position:absolute;z-index:12;pointer-events:none;" +
    "padding:9px 15px;background:rgba(253,252,250,0.98);" +
    "border:1px solid rgba(200,40,40,0.55);border-radius:2px;" +
    "font-family:'Inter',sans-serif;font-size:.8rem;color:#1A1010;" +
    "box-shadow:0 2px 14px rgba(200,40,40,0.10);transition:opacity .15s;" +
    "opacity:0;min-width:168px;line-height:1.5;transform:translateX(-50%);white-space:nowrap;";
  host.appendChild(tip);

  /* ── Labels ──────────────────────────────────────────────────────────── */
  var labelWrap = document.createElement("div");
  labelWrap.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:8;overflow:hidden;";
  host.appendChild(labelWrap);
  var labelEls = {};
  Object.keys(LABS).forEach(function(key) {
    var el = document.createElement("div");
    el.style.cssText = "position:absolute;transform:translate(-50%,-100%);" +
      "background:rgba(253,252,250,0.98);border:1px solid #C82828;" +
      "border-radius:1px;padding:5px 12px;text-align:center;" +
      "box-shadow:0 1px 8px rgba(200,40,40,0.10);transition:opacity .2s;";
    el.innerHTML = '<div style="font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#C82828;font-family:JetBrains Mono,monospace;">' +
      LABS[key].name + '</div><div style="font-size:.58rem;color:#9A8880;letter-spacing:.04em;margin-top:2px;">' + LABS[key].sub + '</div>';
    labelWrap.appendChild(el);
    labelEls[key] = el;
  });

  /* ── Renderer ─────────────────────────────────────────────────────────── */
  var W = host.clientWidth || window.innerWidth;
  var H = host.clientHeight || window.innerHeight;
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  var cvs = renderer.domElement;
  cvs.style.display = "block";
  cvs.style.position = "absolute";
  cvs.style.inset = "0";

  /* ── Scene + Camera ────────────────────────────────────────────────────── */
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF5F3F0);
  scene.fog = new THREE.Fog(0xF0EDE8, 180, 340);

  /* Perspective camera — matches v7 proven setup */
  var camera = new THREE.PerspectiveCamera(48, W / H, 0.5, 400);
  camera.position.set(0, 62, 148);
  camera.lookAt(0, 0, -22);

  /* ── Lighting ──────────────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xFFFFFF, 1.10));
  var sun = new THREE.DirectionalLight(0xFFFEFA, 0.65);
  sun.position.set(80, 150, 60);
  sun.castShadow = true;
  sun.shadow.mapSize.width = sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.left = sun.shadow.camera.bottom = -180;
  sun.shadow.camera.right = sun.shadow.camera.top = 180;
  sun.shadow.camera.near = 10; sun.shadow.camera.far = 500;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  var fillLight = new THREE.DirectionalLight(0xF2F0EC, 0.20);
  fillLight.position.set(-60, 80, -30);
  scene.add(fillLight);

  /* ── Materials ─────────────────────────────────────────────────────────── */
  function mat(c, em, ei) {
    return new THREE.MeshLambertMaterial({
      color: c || 0xFFFFFF,
      emissive: em ? new THREE.Color(em) : new THREE.Color(0),
      emissiveIntensity: ei || 0
    });
  }
  function matT(c, op) {
    return new THREE.MeshLambertMaterial({ color: c, transparent: true, opacity: op });
  }
  /* White card scale */
  var M0 = mat(0xFAF9F7), M1 = mat(0xF0EEE9), M2 = mat(0xE6E2DC),
      M3 = mat(0xD8D3CC), M4 = mat(0xC6C1B8), M5 = mat(0xB4AFA6);
  /* Red accent */
  var RED = mat(0xC82828), REDL = matT(0xC82828, 0.42);
  /* Clear glass */
  var GLASS = matT(0xECEAE6, 0.50), GLASSD = matT(0xE0DDD8, 0.65);
  /* Ground & roads */
  var GND = mat(0xEEEBE6), ROAD = mat(0xD5D1CA), ROADS = mat(0xCAC6BE);
  var SIDE = mat(0xDCDAD4), PARK = mat(0xE4E2DE);
  /* Metal */
  var METAL = mat(0xCECCC8), METALD = mat(0xBAB8B2), WHEEL = mat(0x484440);
  /* Edge colour */
  var EC = 0xB8B4AE, ECR = 0xC82828;

  /* ── Core helpers ──────────────────────────────────────────────────────── */
  function mesh(geo, m) { var o = new THREE.Mesh(geo, m); o.castShadow = true; o.receiveShadow = true; return o; }
  function box(w, h, d, m) { return mesh(new THREE.BoxGeometry(w, h, d), m); }
  function cyl(rt, rb, h, s, m) { return mesh(new THREE.CylinderGeometry(rt, rb, h, s), m); }
  function sph(r, sw, sh, m) { return mesh(new THREE.SphereGeometry(r, sw, sh), m); }
  function add(o, x, y, z) { o.position.set(x, y, z); scene.add(o); return o; }
  function placed(o, x, y, z) { o.position.set(x, y, z); return o; }
  function addG(g) { g.traverse(function(c){if(c.isMesh){c.castShadow=true;c.receiveShadow=true;}}); scene.add(g); return g; }
  function edge(m, c) {
    if (!m || !m.geometry) return;   /* guard: Groups have no geometry */
    m.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(m.geometry, 10),
      new THREE.LineBasicMaterial({ color: c || EC })));
  }

  /* ── Interaction ───────────────────────────────────────────────────────── */
  var hitMeshes = [], highlights = {}, labelAnchors = {};
  var hoveredLab = null;
  function tag(m, k) { m.userData.labKey = k; hitMeshes.push(m); return m; }
  function zone(cx, cz, w, d, k) {
    var m = mesh(new THREE.BoxGeometry(w, 0.4, d), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    add(m, cx, 0.4, cz); m.userData.labKey = k; hitMeshes.push(m);
  }
  function hl(cx, cz, r, k) {
    var mt = new THREE.MeshBasicMaterial({ color: 0xC82828, transparent: true, opacity: 0, side: THREE.DoubleSide });
    var ring = mesh(new THREE.CircleGeometry(r, 52), mt);
    ring.rotation.x = -Math.PI / 2; add(ring, cx, 0.22, cz);
    highlights[k] = { mat: mt };
  }

  /* ── Labels ─────────────────────────────────────────────────────────────── */
  function updateLabels() {
    var sw = host.clientWidth, sh = host.clientHeight;
    Object.keys(labelAnchors).forEach(function(key) {
      var el = labelEls[key]; if (!el) return;
      var v = labelAnchors[key].clone().project(camera);
      if (v.z > 1) { el.style.opacity = "0"; return; }
      var sx = Math.max(90, Math.min(sw-90, (v.x*0.5+0.5)*sw));
      var sy = Math.max(56, Math.min(sh-8, (-v.y*0.5+0.5)*sh));
      el.style.left = sx + "px"; el.style.top = sy + "px";
      el.style.opacity = hoveredLab === key ? "0" : "1";
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     ARCHITECTURAL OBJECT FACTORIES
  ═══════════════════════════════════════════════════════════════════════ */

  /* ── Plan-view tree (flat architectural circle) ─────────────────────── */
  function mkTree(x, z, s) {
    s = s || 1;
    var r = (1.0 + Math.random() * 0.5) * s;
    /* Flat disc */
    var disc = mesh(new THREE.CircleGeometry(r, 16), mat(0xE2E0DC));
    disc.rotation.x = -Math.PI / 2; add(disc, x, 0.06, z);
    /* Outline */
    var ring = []; for (var i = 0; i <= 16; i++) { var a = (i/16)*Math.PI*2; ring.push(new THREE.Vector3(x+Math.cos(a)*r, 0.07, z+Math.sin(a)*r)); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring),
      new THREE.LineBasicMaterial({ color: EC, transparent: true, opacity: 0.65 })));
    /* Spoke lines */
    var spk = []; for (var j = 0; j < 6; j++) { var b = (j/6)*Math.PI*2; spk.push(new THREE.Vector3(x,0.075,z)); spk.push(new THREE.Vector3(x+Math.cos(b)*r*0.65,0.075,z+Math.sin(b)*r*0.65)); }
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spk),
      new THREE.LineBasicMaterial({ color: EC, transparent: true, opacity: 0.22 })));
    /* Centre dot */
    var dot = mesh(new THREE.CircleGeometry(0.08*s, 8), mat(0xC4C0B8));
    dot.rotation.x = -Math.PI / 2; add(dot, x, 0.08, z);
  }

  /* ── Abstract red human figure ───────────────────────────────────────── */
  function mkFigure(x, z, s, ry) {
    s = s || 1; var g = new THREE.Group();
    g.add(placed(sph(0.22*s, 7, 7, RED), 0, 1.82*s, 0));
    g.add(placed(cyl(0.10*s, 0.13*s, 0.85*s, 6, RED), 0, 1.15*s, 0));
    var aL = box(0.60*s, 0.07*s, 0.07*s, RED); aL.position.set(0.28*s, 1.44*s, 0); aL.rotation.z = 0.44; g.add(aL);
    var aR = box(0.60*s, 0.07*s, 0.07*s, RED); aR.position.set(-0.28*s, 1.44*s, 0); aR.rotation.z = -0.44; g.add(aR);
    var lL = cyl(0.06*s, 0.08*s, 0.66*s, 5, RED); lL.position.set(0.13*s, 0.33*s, 0); lL.rotation.z = 0.17; g.add(lL);
    var lR = cyl(0.06*s, 0.08*s, 0.66*s, 5, RED); lR.position.set(-0.13*s, 0.33*s, 0); lR.rotation.z = -0.17; g.add(lR);
    g.rotation.y = ry || 0; g.position.set(x, 0, z); addG(g); return g;
  }

  /* ── Diagonal red hatching over a zone ───────────────────────────────── */
  function mkHatch(x0, z0, x1, z1, sp2, op) {
    var hm = new THREE.LineBasicMaterial({ color: ECR, transparent: true, opacity: op || 0.08 });
    var span = Math.max(Math.abs(x1-x0), Math.abs(z1-z0)) * 1.4;
    for (var off = -span; off < span; off += sp2) {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x0+off, 0.04, z0),
          new THREE.Vector3(x0+off+span, 0.04, z1)]),
        hm));
    }
  }

  /* ── Context block (surrounding urban fabric) ─────────────────────────── */
  function ctx(cx, cz, w, d, h) {
    var m = box(w, h, d, mat(0xE4E1DC)); m.position.set(cx, h/2, cz); edge(m); scene.add(m);
  }

  /* ── Clean tower ─────────────────────────────────────────────────────── */
  function tower(cx, cz, pw, pd, ph, tw, td, th, isRed, k) {
    var g = new THREE.Group(), ec = isRed ? ECR : EC;
    var pod = box(pw, ph, pd, isRed ? RED : M2); pod.position.y = ph/2; edge(pod, ec); g.add(pod);
    g.add(placed(box(pw+0.26, 0.20, pd+0.26, M3), 0, ph+0.10, 0));
    var sh = box(tw, th, td, isRed ? REDL : GLASS); sh.position.y = ph+th/2; edge(sh, ec); if (k) tag(sh, k); g.add(sh);
    g.add(placed(box(tw+0.12, 0.26, td+0.12, isRed ? RED : M3), 0, ph+th*0.5, 0));
    g.add(placed(box(tw+0.14, 0.38, td+0.14, M3), 0, ph+th+0.19, 0));
    g.position.set(cx, 0, cz); addG(g); return g;
  }

  /* ── Slab block ─────────────────────────────────────────────────────── */
  function slab(cx, cz, w, d, h, isRed, k) {
    var g = new THREE.Group(), ec = isRed ? ECR : EC;
    var base = box(w+0.8, 2.2, d+0.8, isRed ? RED : M2); base.position.y = 1.1; edge(base, ec); g.add(base);
    var body = box(w, h, d, isRed ? REDL : M1); body.position.y = 2.2+h/2; edge(body, ec); if (k) tag(body, k); g.add(body);
    g.add(placed(box(w+0.14, 0.28, d+0.14, M3), 0, 2.2+h+0.14, 0));
    g.position.set(cx, 0, cz); addG(g); return g;
  }

  /* ── Simple bloc ────────────────────────────────────────────────────── */
  function bloc(cx, cz, w, d, h, isRed, k) {
    var g = new THREE.Group(), ec = isRed ? ECR : EC;
    var m = box(w, h, d, isRed ? RED : M2); m.position.y = h/2; edge(m, ec); if (k) tag(m, k); g.add(m);
    g.add(placed(box(w+0.10, 0.20, d+0.10, M3), 0, h+0.10, 0));
    g.position.set(cx, 0, cz); addG(g); return g;
  }

  /* ── Landmark tower ─────────────────────────────────────────────────── */
  function mkLandmark(cx, cz, k) {
    var g = new THREE.Group();
    add(box(26, 0.58, 26, M1), cx, 0.29, cz); edge(g);
    var b1 = box(26, 0.58, 26, M1); b1.position.y = 0.29; g.add(b1);
    var b2 = box(22, 0.96, 22, M2); b2.position.y = 1.06; edge(b2); g.add(b2);
    var pod = box(18, 6.0, 18, M2); pod.position.y = 4.58; edge(pod); if (k) tag(pod, k); g.add(pod);
    var sh1 = box(13, 20, 13, GLASSD); sh1.position.y = 10+10; edge(sh1); if (k) tag(sh1, k); g.add(sh1);
    g.add(placed(box(13.2, 0.30, 13.2, M3), 0, 30.2, 0));
    var sh2 = box(9, 22, 9, GLASS); sh2.position.y = 31+11; edge(sh2); if (k) tag(sh2, k); g.add(sh2);
    g.add(placed(box(9.2, 0.30, 9.2, M3), 0, 53.2, 0));
    var crown = box(5.5, 6.5, 5.5, GLASS); crown.position.y = 54+3.25; edge(crown); if (k) tag(crown, k); g.add(crown);
    var spire = cyl(0.04, 0.22, 11, 6, METAL); spire.position.y = 68; g.add(spire);
    var wl = sph(0.17, 5, 5, new THREE.MeshBasicMaterial({ color: 0xC82828 })); wl.position.y = 73.5; g.add(wl);
    g.position.set(cx, 0, cz); addG(g); return { group: g, wl: wl };
  }

  /* ── Round civic building ───────────────────────────────────────────── */
  function roundBloc(cx, cz, r, h, k) {
    var g = new THREE.Group();
    var drum = cyl(r, r, h, 32, M2); drum.position.y = h/2; edge(drum); if (k) tag(drum, k); g.add(drum);
    var cap = cyl(r+0.18, r+0.18, 0.25, 32, M3); cap.position.y = h+0.12; g.add(cap);
    g.position.set(cx, 0, cz); addG(g); return g;
  }

  /* ── Canopy shelter ────────────────────────────────────────────────── */
  function canopy(cx, cz, w, d, h) {
    var g = new THREE.Group();
    var roof = box(w, 0.12, d, M1); roof.position.y = h; edge(roof); g.add(roof);
    [[w/2-0.8, d/2-0.8],[w/2-0.8,-d/2+0.8],[-w/2+0.8,d/2-0.8],[-w/2+0.8,-d/2+0.8]].forEach(function(c){
      var col = cyl(0.08, 0.10, h, 6, METAL); col.position.set(c[0], h/2, c[1]); g.add(col);
    });
    g.position.set(cx, 0, cz); addG(g);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     GROUND & GRID
  ═══════════════════════════════════════════════════════════════════════ */
  var gnd = mesh(new THREE.PlaneGeometry(400, 400), GND);
  gnd.rotation.x = -Math.PI / 2; scene.add(gnd);

  /* Faint architectural grid */
  var gMat = new THREE.LineBasicMaterial({ color: 0xCEC9C2, transparent: true, opacity: 0.18 });
  for (var gi = -120; gi <= 120; gi += 20) {
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-120,0.02,gi),new THREE.Vector3(120,0.02,gi)]), gMat));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(gi,0.02,-120),new THREE.Vector3(gi,0.02,120)]), gMat));
  }

  /* ── Site boundary — bold red polygon ─────────────────────────────── */
  var bPts = [
    new THREE.Vector3(-106, 0.12, 35), new THREE.Vector3(-62, 0.12, 39), new THREE.Vector3(0, 0.12, 38),
    new THREE.Vector3(56, 0.12, 36),   new THREE.Vector3(107, 0.12, 30), new THREE.Vector3(110, 0.12, -8),
    new THREE.Vector3(107, 0.12, -68), new THREE.Vector3(50, 0.12, -74), new THREE.Vector3(-5, 0.12, -75),
    new THREE.Vector3(-62, 0.12, -72), new THREE.Vector3(-107, 0.12, -68),new THREE.Vector3(-112, 0.12,-18),
    new THREE.Vector3(-106, 0.12, 35),
  ];
  var bndCurve = new THREE.CatmullRomCurve3(bPts);
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(bndCurve.getPoints(100)),
    new THREE.LineBasicMaterial({ color: ECR, transparent: true, opacity: 0.68 })));

  /* Very faint red wash over campus */
  var wash = mesh(new THREE.PlaneGeometry(220, 114), matT(0xC82828, 0.028));
  wash.rotation.x = -Math.PI / 2; add(wash, 0, 0.03, -18);

  /* Diagonal hatching */
  mkHatch(-106, -68, 106, 35, 7, 0.052);

  /* ═══════════════════════════════════════════════════════════════════════
     CONTEXT BUILDINGS — background urban fabric
  ═══════════════════════════════════════════════════════════════════════ */
  [[-82,52,11,9,4],[-62,56,8,8,6],[-40,54,13,10,3],[-18,58,10,10,5],[8,53,12,8,4],[28,56,8,8,7],[48,54,10,10,3],[70,52,12,8,5],[88,56,8,10,4]].forEach(function(b){ctx(b[0],b[1],b[2],b[3],b[4]);});
  [[-88,-82,10,8,3],[-68,-84,12,10,5],[-46,-86,8,8,4],[-22,-84,10,10,3],[6,-88,14,10,5],[28,-84,8,8,3],[52,-82,12,10,4],[74,-84,8,8,6]].forEach(function(b){ctx(b[0],b[1],b[2],b[3],b[4]);});
  [[-120,10,9,12,4],[-124,-12,11,10,6],[-122,-34,9,12,3],[-118,-56,11,10,5]].forEach(function(b){ctx(b[0],b[1],b[2],b[3],b[4]);});
  [[116,10,10,12,5],[120,-10,12,10,4],[118,-32,10,14,6],[114,-54,12,10,3]].forEach(function(b){ctx(b[0],b[1],b[2],b[3],b[4]);});

  /* ═══════════════════════════════════════════════════════════════════════
     ROADS
  ═══════════════════════════════════════════════════════════════════════ */
  add(box(240, 0.10, 24, ROAD), 0, 0.05, 22);
  add(box(240, 0.08, 1.8, SIDE), 0, 0.06, 10.8);
  add(box(240, 0.08, 1.8, SIDE), 0, 0.06, 33.2);
  add(box(240, 0.10, 2.4, SIDE), 0, 0.065, 22); /* median */
  for (var lx = -104; lx < 104; lx += 9) { add(box(4.0,0.12,0.14,M0),lx,0.07,17.5); add(box(4.0,0.12,0.14,M0),lx,0.07,26.5); }
  for (var cw = 0; cw < 7; cw++) add(box(2.5,0.14,5.0,M0), -23+cw*3.5, 0.075, 22);
  add(box(9,0.11,9,mat(0xD8D5CE)), -13, 0.065, 22);
  add(box(14, 0.10, 100, ROADS), 0, 0.05, -18);
  add(box(2.0, 0.15, 96, matT(0xC82828, 0.52)), 0, 0.09, -18); /* rail stripe */
  add(box(10, 0.08, 78, ROAD), -34, 0.04, -18);
  add(box(10, 0.08, 78, ROAD), 34, 0.04, -18);
  add(box(114, 0.08, 9, ROAD), -5, 0.04, -56);

  /* ═══════════════════════════════════════════════════════════════════════
     SMART MOBILITY — TOD DISTRICT
  ═══════════════════════════════════════════════════════════════════════ */
  var plaza = mesh(new THREE.PlaneGeometry(58, 64), mat(0xECE9E4)); plaza.rotation.x = -Math.PI/2; add(plaza, 0, 0.055, -27);
  var landmark = mkLandmark(0, -15, "smart");
  tower(-11,-28, 10,10,3, 7.5,7.5,25, false,"smart"); slab(12,-24, 7,18,15, false,"smart");
  tower(-17,-15, 7,7,3, 5,5,13, false,"smart");        slab(18,-15, 6,16,13, false,"smart");
  tower(-5,-42, 11,9,3, 8,7,17, false,"smart");         slab(12,-40, 7,13,11, false,"smart");
  bloc(-21,-36, 6,6,7, false,"smart"); bloc(21,-34, 6,6,8, false,"smart");
  bloc(-4,-54, 15,10,4, false,"smart"); bloc(13,-54, 7,7,4, false,"smart");
  roundBloc(22,-12, 5,9, "smart");

  /* TOD rings */
  [10,18,27].forEach(function(r,i){
    var ring = mesh(new THREE.RingGeometry(r-0.18,r+0.18,64), new THREE.MeshBasicMaterial({color:0xC82828,transparent:true,opacity:0.09-i*0.022,side:THREE.DoubleSide}));
    ring.rotation.x = -Math.PI/2; add(ring, 0, 0.09, -16);
  });

  /* BRT station */
  var brtP = box(20, 0.30, 7, M1); brtP.position.set(0, 0.30, -4.5); edge(brtP); scene.add(brtP);
  canopy(0, -4.5, 22, 8, 4.0);

  /* BRT bus */
  var busG = new THREE.Group();
  [0,7.0].forEach(function(off){
    var s2 = new THREE.Group();
    var bd = box(6.6, 2.5, 2.95, M2); edge(bd); s2.add(bd);
    s2.add(placed(box(6.6,0.18,2.75,M3),0,1.36,0));
    s2.add(placed(box(6.62,0.72,0.05,GLASS),0,0.32,1.48));
    s2.position.z = off; busG.add(s2);
  });
  [[-2.2,0],[2.2,0],[-2.2,7.0],[2.2,7.0]].forEach(function(a){
    [-1.54,1.54].forEach(function(wx){
      var wh = cyl(0.38,0.38,0.25,10,WHEEL); wh.rotation.z = Math.PI/2; wh.position.set(wx,-1.30,a[0]); busG.add(wh);
    });
  });
  busG.position.set(0, 1.30, -5.5); scene.add(busG);

  /* Traffic signals */
  var signals = [];
  [[-9,14],[9,14]].forEach(function(s){
    add(cyl(0.08,0.10,5.0,8,METALD), s[0], 2.5, s[1]);
    add(box(0.54,1.75,0.50,mat(0x2C2C2A)), s[0], 5.1, s[1]);
    var redM = mat(0xC82828, 0xC82828, 0);
    var whtM = mat(0xD0CEC8, 0xC8C6C0, 0.5);
    var red = add(sph(0.18,8,8,redM), s[0], 4.45, s[1]+0.26);
    var grn = add(sph(0.18,8,8,whtM), s[0], 5.10, s[1]+0.26);
    signals.push({ red: red, green: grn });
  });

  /* Figures in TOD plaza */
  mkFigure(-6, -10, 1.2, 0.3); mkFigure(6, -12, 1.0, -0.8);
  mkFigure(-2, -8, 0.9, 1.5);  mkFigure(8, -10, 1.1, 2.2);

  /* Boulevard trees */
  [-24,-8,8,24].forEach(function(tx){mkTree(tx,-1.5,1.0);mkTree(tx,-31,1.0);});
  [-26,-20,-14,-8,-2,4,10,16,22].forEach(function(tx){mkTree(tx,-57,0.85);});

  zone(0,-28,60,66,"smart"); hl(0,-28,30,"smart");
  labelAnchors.smart = new THREE.Vector3(0, 54, -20);

  /* ═══════════════════════════════════════════════════════════════════════
     CE-RAIL — ELEVATED VIADUCT
  ═══════════════════════════════════════════════════════════════════════ */
  var VX = 34;
  for (var vz = -72; vz <= 14; vz += 12) {
    var pier = box(1.60, 9.4, 0.56, METALD); add(pier, VX, 4.70, vz); edge(pier);
    add(box(2.8,0.40,0.78,METALD), VX, 0.20, vz);
    add(box(2.8,0.40,0.78,METALD), VX, 9.60, vz);
    if (vz < 14) {
      add(box(0.08,0.08,11.4,METAL), VX-0.88, 5.0, vz+6);
      add(box(0.08,0.08,11.4,METAL), VX+0.88, 5.0, vz+6);
    }
    var deck = box(7.2, 0.58, 11.8, M2); add(deck, VX, 9.88, vz+6); edge(deck);
  }
  [-0.76,0.76].forEach(function(rx){add(box(0.14,0.14,86,METALD), VX+rx, 10.44, -28);});
  for (var rf = -70; rf < 14; rf += 2.4) add(box(1.65,0.06,0.13,METALD), VX, 10.40, rf);
  for (var cm = -70; cm <= 12; cm += 12) { add(cyl(0.05,0.07,4.8,6,METAL), VX, 13.1, cm); add(box(1.95,0.06,0.06,METAL), VX, 15.4, cm); }
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(VX,15.5,-72),new THREE.Vector3(VX,15.5,14)]),
    new THREE.LineBasicMaterial({color:ECR,transparent:true,opacity:0.35})));

  /* Station */
  var statP = box(22, 0.40, 6.4, M1); add(statP, VX, 10.70, -30); edge(statP);
  canopy(VX, -30, 24, 7, 3.4);

  /* Train */
  var trainG = new THREE.Group();
  for (var ti = 0; ti < 6; ti++) {
    var car = new THREE.Group();
    var cb = box(4.9, 2.2, 2.62, M2); edge(cb); car.add(cb);
    car.add(placed(box(4.94,0.46,2.66,M3),0,0.37,0));
    car.add(placed(box(4.92,0.66,0.05,GLASS),0,0.33,1.32));
    [-1.04,1.04].forEach(function(bz){car.add(placed(box(1.68,0.32,2.30,mat(0x3C3836)),0,-1.34,bz));});
    car.position.z = -ti * 5.8; tag(cb, "rail"); trainG.add(car);
  }
  trainG.position.set(VX, 11.84, -14); scene.add(trainG);
  zone(VX,-28,26,94,"rail"); hl(VX,-28,18,"rail");
  labelAnchors.rail = new THREE.Vector3(VX, 22, -22);

  /* ═══════════════════════════════════════════════════════════════════════
     CTRLAB — CLEAN ENERGY PARK
  ═══════════════════════════════════════════════════════════════════════ */
  var pkGnd = mesh(new THREE.PlaneGeometry(46, 54), PARK); pkGnd.rotation.x = -Math.PI/2; add(pkGnd, -34, 0.05, -42);
  add(box(2.6,0.10,50,M2), -34, 0.065, -42);
  add(box(38,0.10,2.6,M2), -34, 0.065, -32); add(box(38,0.10,2.6,M2), -34, 0.065, -52);
  mkHatch(-58,-68,-10,-16, 6, 0.040);

  /* Solar panels */
  for (var sr = 0; sr < 4; sr++) for (var sc = 0; sc < 5; sc++) {
    var pan = box(1.95,0.05,1.25,mat(0xB0ACA6)); pan.rotation.x = -0.35;
    pan.position.set(-46+sc*2.4, 1.08, -27+sr*2.1); edge(pan, 0xA4A09A); scene.add(pan);
  }

  /* Monitor */
  var mon = box(2.0,2.0,2.0,M2); add(mon, -46, 1.0, -45); edge(mon);
  add(cyl(0.05,0.07,4.0,6,METAL), -46, 3.8, -45);
  add(sph(0.24,8,8,mat(0xC82828,0xC82828,0.45)), -46, 6.6, -45);

  /* Turbines */
  var turbines = [];
  [[-34,-28],[-26,-52],[-42,-52]].forEach(function(td, ti2) {
    var tx = td[0], tz = td[1];
    add(cyl(0.22,0.58,28,10,M2), tx, 14.0, tz).castShadow = true;
    var nac = box(2.2,1.2,3.3,M2); add(nac, tx, 28.7, tz); edge(nac);
    var rg = new THREE.Group(); rg.position.set(tx, 28.7, tz-1.8);
    rg.add(sph(0.44,8,8,M2));
    for (var bi = 0; bi < 3; bi++) {
      var blG = new THREE.Group();
      blG.add(placed(box(0.42,5.9,0.10,M1),0,3.0,0));
      blG.add(placed(box(0.23,7.2,0.07,M0),0,9.2,0));
      blG.rotation.z = (bi/3)*Math.PI*2; rg.add(blG);
    }
    scene.add(rg);
    var wl = sph(0.15,5,5,new THREE.MeshBasicMaterial({color:0xC82828})); add(wl, tx, 30.1, tz);
    turbines.push({ grp: rg, spd: 0.007+ti2*0.0028, wlight: wl, wph: Math.random()*Math.PI*2 });
    tag(rg.children[0], "ctrlab");
  });

  /* Energy particles — subtle red */
  var ePts = [];
  [[-34,-28],[-26,-52],[-42,-52]].forEach(function(eb){
    for (var k = 0; k < 7; k++) {
      var ep = mesh(new THREE.SphereGeometry(0.13,5,5), new THREE.MeshBasicMaterial({color:0xC82828,transparent:true,opacity:0.20}));
      ep.position.set(eb[0]+(Math.random()-0.5)*6, 2+Math.random()*22, eb[1]+(Math.random()-0.5)*4);
      ep.userData = { bx: eb[0], bz: eb[1], sy: ep.position.y, spd: 0.17+Math.random()*0.30, ph: Math.random()*Math.PI*2 };
      scene.add(ep); ePts.push(ep);
    }
  });

  /* Park trees */
  [[-44,-30],[-24,-30],[-44,-54],[-24,-54],[-44,-42],[-24,-42],[-38,-36],[-30,-36],[-38,-48],[-30,-48]].forEach(function(p){
    mkTree(p[0]+Math.random()*2-1, p[1]+Math.random()*2-1, 1.0+Math.random()*0.3);
    mkTree(p[0]+Math.random()*2-1, p[1]+Math.random()*2-1, 0.75+Math.random()*0.3);
  });

  zone(-34,-42,46,54,"ctrlab"); hl(-34,-42,24,"ctrlab");
  /* Ground fill — activates on hover via highlights['ctrlab_fill'] */
  var ctrlabFillMat = new THREE.MeshBasicMaterial({ color: 0xC82828, transparent: true, opacity: 0, side: THREE.DoubleSide });
  var ctrlabFill = mesh(new THREE.PlaneGeometry(46, 54), ctrlabFillMat);
  ctrlabFill.rotation.x = -Math.PI / 2; add(ctrlabFill, -34, 0.065, -42);
  highlights['ctrlab_fill'] = { mat: ctrlabFillMat };
  labelAnchors.ctrlab = new THREE.Vector3(-34, 40, -40);

  /* ═══════════════════════════════════════════════════════════════════════
     SEE LIVING LAB — ROAD SAFETY ZONE
  ═══════════════════════════════════════════════════════════════════════ */
  /* Zone fill + boundary */
  var seeFill = mesh(new THREE.PlaneGeometry(214, 26), matT(0xC82828, 0.058));
  seeFill.rotation.x = -Math.PI/2; add(seeFill, 0, 0.04, 22);
  var sbPts = [new THREE.Vector3(-107,0.09,9),new THREE.Vector3(107,0.09,9),new THREE.Vector3(107,0.09,35),new THREE.Vector3(-107,0.09,35),new THREE.Vector3(-107,0.09,9)];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(sbPts), new THREE.LineBasicMaterial({color:ECR,transparent:true,opacity:0.55})));
  mkHatch(-107, 9, 107, 35, 5, 0.068);

  /* Vehicles */
  var vehicles = [], gazeRings = [], gazePts = [];
  function mkCar(vx, vz, spd, isRed) {
    var g = new THREE.Group(), cm = isRed ? RED : M2, ec2 = isRed ? ECR : EC;
    var lb = box(3.9,0.56,1.78,cm); edge(lb,ec2); g.add(lb);
    g.add(placed(box(2.2,0.46,1.62,isRed?RED:M1),-0.18,0.51,0));
    [1.20,-1.20].forEach(function(wx){[0.70,-0.70].forEach(function(wz2){var wh=cyl(0.25,0.25,0.19,10,WHEEL);wh.rotation.z=Math.PI/2;wh.position.set(wx,-0.28,wz2);g.add(wh);});});
    g.position.set(vx,0.28,vz); g.userData={spd:spd,labKey:"see"};
    scene.add(g); vehicles.push(g); tag(lb,"see"); return g;
  }
  function mkMoto(vx, vz, spd) {
    var g = new THREE.Group();
    var body = box(1.58,0.44,0.58,RED); edge(body,ECR); g.add(body);
    g.add(placed(box(0.38,0.62,0.48,mat(0x2E2E2C)),-0.15,0.54,0));
    [0.58,-0.58].forEach(function(wx){var wh=cyl(0.23,0.23,0.10,8,WHEEL);wh.rotation.z=Math.PI/2;wh.position.set(wx,-0.22,0);g.add(wh);});
    g.position.set(vx,0.22,vz); g.userData={spd:spd,risk:true,labKey:"see"};
    scene.add(g); vehicles.push(g); tag(body,"see"); return g;
  }
  function mkBus(vx, vz, spd) {
    var g = new THREE.Group();
    var bd = box(7.8,1.86,2.30,M2); edge(bd); g.add(bd);
    g.add(placed(box(7.82,0.68,0.05,GLASS),0,0.30,1.16));
    [-2.55,0,2.55].forEach(function(wx){[-1.16,1.16].forEach(function(wz2){var wh=cyl(0.31,0.31,0.23,10,WHEEL);wh.rotation.z=Math.PI/2;wh.position.set(wx,-0.94,wz2);g.add(wh);});});
    g.position.set(vx,0.94,vz); g.userData={spd:spd,labKey:"see"};
    scene.add(g); vehicles.push(g); tag(bd,"see"); return g;
  }
  function mkTruck(vx, vz, spd) {
    var g = new THREE.Group();
    var cab = box(2.4,2.4,2.6,M2); cab.position.set(2.55,0,0); edge(cab); g.add(cab);
    var cargo = box(7.1,2.15,2.45,M1); cargo.position.set(-1.35,0.1,0); edge(cargo); g.add(cargo);
    for (var rib=-4.3;rib<=1.7;rib+=1.75){g.add(placed(box(0.08,2.16,2.47,M3),rib,0.1,0));}
    [[-3.9,1.14],[-3.9,-1.14],[1.65,1.18],[1.65,-1.18],[2.95,1.18],[2.95,-1.18]].forEach(function(w){var wh=cyl(0.35,0.35,0.25,10,WHEEL);wh.rotation.z=Math.PI/2;wh.position.set(w[0],-1.18,w[1]);g.add(wh);});
    g.position.set(vx,1.18,vz); g.userData={spd:spd,labKey:"see"};
    scene.add(g); vehicles.push(g); tag(cab,"see"); return g;
  }
  var riskMotos = [mkMoto(36,19,-0.09),mkMoto(-22,23,0.10),mkMoto(8,21,-0.07)];
  mkCar(62,20,-0.06,false); mkCar(-52,24,0.08,false); mkCar(-12,19,-0.05,true);
  mkCar(48,23,-0.04,false); mkCar(22,19,-0.05,false); mkCar(-36,21,0.06,false);
  mkBus(28,23,0.065); mkBus(-38,20,-0.07); mkBus(0,24,0.055);
  mkTruck(-70,21,0.04); mkTruck(72,20,-0.04);

  riskMotos.forEach(function(vG){
    var hm = new THREE.MeshBasicMaterial({color:0xC82828,transparent:true,opacity:0.15,side:THREE.DoubleSide});
    var halo = mesh(new THREE.RingGeometry(1.2,2.8,32),hm);
    halo.rotation.x = -Math.PI/2; halo.position.set(vG.position.x,0.07,vG.position.z);
    scene.add(halo); vG.userData.halo = halo;
    gazeRings.push({ring:halo,veh:vG,ph:Math.random()*Math.PI*2});
    var gps = []; for (var gi2=0;gi2<10;gi2++){
      var gp = mesh(new THREE.SphereGeometry(0.06,4,4),new THREE.MeshBasicMaterial({color:0xC82828,transparent:true,opacity:0.50}));
      gp.userData = {ox:(Math.random()-0.5)*1.6,oy:1.3+Math.random()*1.4,oz:(Math.random()-0.5)*0.8,ph:Math.random()*Math.PI*2};
      gp.position.set(vG.position.x+gp.userData.ox,gp.userData.oy,vG.position.z+gp.userData.oz);
      scene.add(gp); gps.push(gp);
    }
    gazePts.push({pts:gps,veh:vG});
  });

  /* Pedestrians on roadside */
  mkFigure(-45,8,1.0,0); mkFigure(-42,8,0.9,0.5); mkFigure(50,36,1.0,Math.PI); mkFigure(54,36,0.9,Math.PI+0.3); mkFigure(0,8,1.1,-0.2);

  /* Boulevard trees + street lights */
  [-60,-40,-20,0,20,40,60].forEach(function(tx){mkTree(tx,9.2,0.95);mkTree(tx,34.8,0.95);});
  [-72,-52,-32,-12,8,28,48,68].forEach(function(ix){
    [1,-1].forEach(function(side){
      var lz2 = 22+side*13.2;
      add(cyl(0.05,0.09,6.2,8,METALD),ix,3.1,lz2);
      add(box(1.80,0.07,0.07,METALD),ix+0.88,6.28,lz2);
      add(box(1.28,0.19,0.44,mat(0x2A2826)),ix+2.68,6.26,lz2);
      add(box(1.10,0.06,0.36,mat(0xF0ECE4,0xE8E2D8,0.40)),ix+2.68,6.16,lz2);
    });
  });

  zone(0,22,200,28,"see"); hl(0,22,40,"see");
  labelAnchors.see = new THREE.Vector3(0, 16, 24);

  /* ═══════════════════════════════════════════════════════════════════════
     RESEARCH ARCS
  ═══════════════════════════════════════════════════════════════════════ */
  function arc(ax,ay,az,bx2,by,bz2,op){
    var mid=new THREE.Vector3((ax+bx2)/2,(ay+by)/2+24,(az+bz2)/2);
    var curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(ax,ay,az),mid,new THREE.Vector3(bx2,by,bz2));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),new THREE.LineBasicMaterial({color:ECR,transparent:true,opacity:op||0.18})));
  }
  arc(0,5,-20,VX,11,-28,0.22); arc(0,5,-20,-34,5,-42,0.18); arc(0,5,-20,0,2,22,0.25); arc(VX,11,-28,-34,5,-42,0.12);

  /* ═══════════════════════════════════════════════════════════════════════
     RAYCASTER / INTERACTION
  ═══════════════════════════════════════════════════════════════════════ */
  var raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
  function showTip(k, sx, sy) {
    var lab = LABS[k]; if (!lab) return;
    tip.innerHTML = '<span style="display:inline-block;width:8px;height:8px;background:#C82828;margin-right:7px;vertical-align:middle;"></span>' +
      '<strong style="font-size:.84rem;color:#1A1010;">' + lab.name + '</strong><br>' +
      '<span style="color:#9A8880;font-size:.75rem;">' + lab.sub + '</span><br>' +
      '<span style="color:#C82828;font-size:.74rem;margin-top:3px;display:block;font-weight:600;">Click to explore →</span>';
    tip.style.left = sx + "px"; tip.style.top = (sy-88) + "px"; tip.style.opacity = "1";
  }
  function hideTip() { tip.style.opacity = "0"; }
  function setHL(k, on) {
    if (highlights[k]) highlights[k].mat.opacity = on ? 0.18 : 0;
    if (highlights[k+'_fill']) highlights[k+'_fill'].mat.opacity = on ? 0.10 : 0;
  }

  var isDrag = false, lastX = 0, lastY = 0;
  /* Gentle auto-rotate + mouse orbit */
  var camTheta = 0.0, camElevation = 0;
  var baseCam = { x: 0, y: 62, z: 148 };

  window.addEventListener("mousemove", function(e) {
    if (isDrag) { hideTip(); return; }
    var rect = cvs.getBoundingClientRect();
    mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse, camera);
    var hits = raycaster.intersectObjects(hitMeshes, false);
    var nl = hits.length ? (hits[0].object.userData.labKey || null) : null;
    if (nl !== hoveredLab) {
      if (hoveredLab) setHL(hoveredLab, false);
      hoveredLab = nl;
      if (hoveredLab) { setHL(hoveredLab, true); cvs.style.cursor = "pointer"; }
      else { hideTip(); cvs.style.cursor = "grab"; }
    }
    if (hoveredLab) showTip(hoveredLab, e.clientX-rect.left, e.clientY-rect.top);
  });
  cvs.addEventListener("mouseleave", function(){if(hoveredLab){setHL(hoveredLab,false);hoveredLab=null;}hideTip();cvs.style.cursor="grab";});
  cvs.addEventListener("click", function(){if(hoveredLab&&LABS[hoveredLab]&&!isDrag)window.location.href=LABS[hoveredLab].url;});
  cvs.addEventListener("mousedown", function(e){isDrag=true;lastX=e.clientX;lastY=e.clientY;cvs.style.cursor="grabbing";hideTip();});
  window.addEventListener("mousemove", function(e){
    if(!isDrag)return;
    camTheta += (e.clientX-lastX)*0.003;
    camElevation = Math.max(-0.3,Math.min(0.6,camElevation+(e.clientY-lastY)*0.003));
    lastX=e.clientX;lastY=e.clientY;
  });
  window.addEventListener("mouseup",function(){isDrag=false;cvs.style.cursor=hoveredLab?"pointer":"grab";});
  var zoom = 1.0;
  cvs.addEventListener("wheel",function(e){e.preventDefault();zoom=Math.max(0.5,Math.min(2.2,zoom-e.deltaY*0.0008));},{passive:false});
  cvs.addEventListener("touchstart",function(e){isDrag=true;lastX=e.touches[0].clientX;lastY=e.touches[0].clientY;},{passive:true});
  window.addEventListener("touchmove",function(e){if(!isDrag)return;camTheta+=(e.touches[0].clientX-lastX)*0.003;lastX=e.touches[0].clientX;lastY=e.touches[0].clientY;},{passive:true});
  window.addEventListener("touchend",function(){isDrag=false;});
  cvs.style.cursor = "grab";

  /* ═══════════════════════════════════════════════════════════════════════
     ANIMATION
  ═══════════════════════════════════════════════════════════════════════ */
  var t = 0;
  function animate() {
    requestAnimationFrame(animate); t += 0.016;

    /* Orbit camera — full 360° around scene centre (0, 0, -22)
       R=170 so that at camTheta=0 the camera sits at z=148, matching
       the original default view. */
    if (!isDrag) camTheta += 0.00010;
    var R = 170 / zoom;
    camera.position.x = R * Math.sin(camTheta);
    camera.position.y = baseCam.y + camElevation * 30;
    camera.position.z = -22 + R * Math.cos(camTheta);
    camera.lookAt(0, 0, -22);
    camera.updateProjectionMatrix();

    /* Vehicles */
    vehicles.forEach(function(v) {
      v.position.x += v.userData.spd;
      if (v.position.x > 102) v.position.x = -102;
      if (v.position.x < -102) v.position.x = 102;
      if (v.userData.halo) v.userData.halo.position.x = v.position.x;
    });
    gazeRings.forEach(function(gr) {
      gr.ring.position.x = gr.veh.position.x;
      var s = 0.78+0.36*Math.abs(Math.sin(t*1.8+gr.ph));
      gr.ring.scale.set(s,s,s);
      gr.ring.material.opacity = 0.05+0.12*Math.abs(Math.sin(t*1.4+gr.ph));
    });
    gazePts.forEach(function(gp) {
      gp.pts.forEach(function(p) {
        p.position.x = gp.veh.position.x+p.userData.ox+0.14*Math.sin(t*3.0+p.userData.ph);
        p.position.y = p.userData.oy+0.12*Math.sin(t*2.6+p.userData.ph);
        p.position.z = gp.veh.position.z+p.userData.oz;
        p.material.opacity = 0.12+0.36*Math.abs(Math.sin(t*2.2+p.userData.ph));
      });
    });

    /* Train & bus */
    trainG.position.z -= 0.058; if (trainG.position.z < -74) trainG.position.z = 16;
    busG.position.z -= 0.048;   if (busG.position.z < -72) busG.position.z = 10;

    /* Turbines */
    turbines.forEach(function(tr) {
      tr.grp.rotation.z -= tr.spd;
      if (tr.wlight) tr.wlight.material.color.setHex(Math.sin(t*3.5+tr.wph) > 0.5 ? 0xC82828 : 0x6A1010);
    });

    /* Landmark beacon */
    if (landmark && landmark.wl) landmark.wl.material.color.setHex(Math.sin(t*2.2) > 0.6 ? 0xC82828 : 0x7A1414);

    /* Energy particles */
    ePts.forEach(function(ep) {
      ep.position.y += ep.userData.spd * 0.013;
      ep.position.x = ep.userData.bx + 2.8*Math.sin(t*0.72+ep.userData.ph);
      if (ep.position.y > 32) ep.position.y = ep.userData.sy;
      ep.material.opacity = 0.07+0.16*Math.abs(Math.sin(t*1.1+ep.userData.ph));
    });

    /* Signals */
    signals.forEach(function(sig, si) {
      var grn = (t*0.28+si*18)%60 < 32;
      sig.green.material.emissiveIntensity = grn ? 0.50 : 0.0;
      sig.green.material.color.setHex(grn ? 0xD0CCC8 : 0xB0ACA8);
      sig.red.material.emissiveIntensity = grn ? 0.0 : 0.75;
      sig.red.material.color.setHex(grn ? 0x6A1414 : 0xC82828);
    });

    updateLabels();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", function() {
    var nW = host.clientWidth || window.innerWidth;
    var nH = host.clientHeight || window.innerHeight;
    renderer.setSize(nW, nH);
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
  });
})();
