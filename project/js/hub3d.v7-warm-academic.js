/* ==========================================================================
   MOVE SYSTEM — City Scene  (v7)
   Improvements over v6:
     1. High-contrast palette — dark ground/roads, vivid buildings vs cream sky
     2. 3D-projected floating labels above each district (replace CSS HUD)
     3. Richer geometry — trees, rooftop details, crosswalk, guardrails,
        tapered turbine blades, detailed vehicles with windshields
   ========================================================================== */
(function () {
  "use strict";
  if (typeof THREE === "undefined") { return; }

  var host = document.getElementById("hub3d");
  if (!host) return;

  /* ── Lab definitions ─────────────────────────────────────────────────── */
  var LABS = {
    see: { name: "SEE Living Lab", sub: "Road Safety · VR · Eye-Tracking", url: "labs/see.html", dot: "#C82828", hex: "#A01818" },
    smart: { name: "Smart Mobility Lab", sub: "TOD · MaaS · Traffic Operations", url: "labs/smart.html", dot: "#C49030", hex: "#7A5018" },
    rail: { name: "CE-Rail@UEH", sub: "CBTC · Rail Simulation · Training", url: "labs/rail.html", dot: "#4880C8", hex: "#1A508C" },
    ctrlab: { name: "CtrLab", sub: "Net-Zero · Air Quality · Climate", url: "labs/ctrlab.html", dot: "#3C9848", hex: "#1E6830" },
  };

  /* ── Tooltip (hover) ─────────────────────────────────────────────────── */
  var tip = document.createElement("div");
  tip.style.cssText = "position:absolute;z-index:12;pointer-events:none;" +
    "padding:9px 15px;background:rgba(248,245,241,0.97);" +
    "border:1.5px solid rgba(122,31,46,0.38);border-radius:7px;" +
    "font-family:'Inter',sans-serif;font-size:.8rem;color:#2C1810;" +
    "box-shadow:0 4px 18px rgba(0,0,0,0.13);transition:opacity .15s;" +
    "opacity:0;min-width:168px;line-height:1.5;transform:translateX(-50%);white-space:nowrap;";
  host.appendChild(tip);

  /* ── Floating district labels ────────────────────────────────────────── */
  var labelWrap = document.createElement("div");
  labelWrap.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:8;overflow:hidden;";
  host.appendChild(labelWrap);

  var labelEls = {};
  Object.keys(LABS).forEach(function (key) {
    var lab = LABS[key];
    var el = document.createElement("div");
    el.style.cssText = "position:absolute;transform:translate(-50%,-100%);" +
      "background:rgba(252,249,246,0.95);border:1.5px solid " + lab.dot + ";" +
      "border-radius:6px;padding:5px 12px;text-align:center;" +
      "box-shadow:0 2px 14px rgba(0,0,0,0.14);transition:opacity .2s;";
    el.innerHTML =
      '<div style="font-size:.65rem;font-weight:700;letter-spacing:.14em;' +
      'text-transform:uppercase;color:' + lab.dot + ';font-family:JetBrains Mono,monospace;">' +
      lab.name + '</div>' +
      '<div style="font-size:.58rem;color:#7A6858;letter-spacing:.04em;margin-top:2px;">' +
      lab.sub + '</div>';
    labelWrap.appendChild(el);
    labelEls[key] = el;
  });

  /* ── Shared state ────────────────────────────────────────────────────── */
  var orb = { angle: 0, elev: 52, r: 145, drag: false, lx: 0, ly: 0 };
  var hoveredLab = null;

  /* ── Renderer ────────────────────────────────────────────────────────── */
  var W = host.clientWidth || window.innerWidth;
  var H = host.clientHeight || window.innerHeight;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  host.appendChild(renderer.domElement);
  var cvs = renderer.domElement;
  cvs.style.display = "block";
  cvs.style.position = "absolute";
  cvs.style.inset = "0";

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF5F2EE);
  scene.fog = new THREE.Fog(0xEDE8E0, 130, 240);

  var camera = new THREE.PerspectiveCamera(54, W / H, 0.5, 350);
  camera.position.set(0, 52, 136);
  camera.lookAt(0, 0, -18);

  /* ── Lighting ────────────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xFFF4E8, 0.68));
  var sun = new THREE.DirectionalLight(0xFFDC88, 1.30);
  sun.position.set(60, 100, 50);
  scene.add(sun);
  var fill = new THREE.DirectionalLight(0xD8E8FF, 0.26);
  fill.position.set(-40, 25, 15);
  scene.add(fill);
  var bounce = new THREE.DirectionalLight(0xFFE8C0, 0.18);
  bounce.position.set(0, -30, 40);
  scene.add(bounce);

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  function lmat(c, em, ei) {
    return new THREE.MeshLambertMaterial({ color: c || 0xffffff, emissive: em || 0, emissiveIntensity: ei || 0 });
  }
  function mkBox(w, h, d, c, em, ei) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lmat(c, em, ei));
  }
  function add(m, x, y, z) { m.position.set(x, y, z); scene.add(m); return m; }

  function mkTree(x, z) {
    var h = 1.4 + Math.random() * 0.8;
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, h, 6), lmat(0x6A4020));
    trunk.position.set(x, h / 2, z); scene.add(trunk);
    var cr = 0.7 + Math.random() * 0.5;
    var canopy = new THREE.Mesh(new THREE.SphereGeometry(cr, 7, 6),
      lmat(0x2A7020 + Math.floor(Math.random() * 0x101010), 0x207820, 0.06));
    canopy.position.set(x, h + cr * 0.6, z); scene.add(canopy);
  }

  /* ── Hit meshes + zone/highlight helpers ─────────────────────────────── */
  var hitMeshes = [], highlights = {};

  function tagMesh(m, k) { m.userData.labKey = k; hitMeshes.push(m); return m; }

  function mkZone(cx, cz, w, d, k) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.4, d),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    m.position.set(cx, 0.4, cz); m.userData.labKey = k;
    scene.add(m); hitMeshes.push(m);
  }
  function mkHighlight(cx, cz, r, k, hex) {
    var mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex), transparent: true, opacity: 0, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(new THREE.CircleGeometry(r, 52), mat);
    ring.rotation.x = -Math.PI / 2; ring.position.set(cx, 0.22, cz);
    scene.add(ring); highlights[k] = { mat: mat };
  }

  /* ── Label projection helper ─────────────────────────────────────────── */
  var labelAnchors = {};   /* filled after VX is declared */

  function updateLabels() {
    var sw = host.clientWidth, sh = host.clientHeight;
    Object.keys(labelAnchors).forEach(function (key) {
      var el = labelEls[key];
      if (!el) return;
      var v = labelAnchors[key].clone().project(camera);
      if (v.z > 1) { el.style.opacity = "0"; return; }
      var sx = (v.x * 0.5 + 0.5) * sw;
      var sy = (-v.y * 0.5 + 0.5) * sh;
      /* clamp so labels don't fly off-screen */
      var ew = 180, eh = 52;
      sx = Math.max(ew / 2, Math.min(sw - ew / 2, sx));
      sy = Math.max(eh + 4, Math.min(sh - 8, sy));
      el.style.left = sx + "px";
      el.style.top = sy + "px";
      el.style.opacity = hoveredLab === key ? "0" : "1"; /* hide when tooltip is showing */
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     GROUND + GRID
  ═══════════════════════════════════════════════════════════════════════ */
  /* Warm Vietnamese sandstone ground */
  add(new THREE.Mesh(new THREE.PlaneGeometry(280, 280), lmat(0xAE9E8C)).rotateX(-Math.PI / 2), 0, 0, 0);

  var gridMat = new THREE.LineBasicMaterial({ color: 0x9E8E7C, transparent: true, opacity: 0.28 });
  for (var gi = -120; gi <= 120; gi += 20) {
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-120, 0.02, gi), new THREE.Vector3(120, 0.02, gi)]), gridMat));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(gi, 0.02, -120), new THREE.Vector3(gi, 0.02, 120)]), gridMat));
  }

  /* ═══════════════════════════════════════════════════════════════════════
     ROADS
  ═══════════════════════════════════════════════════════════════════════ */
  /* Dark warm-asphalt roads — high contrast vs sandstone ground */
  add(mkBox(220, 0.18, 22, 0x302A20), 0, 0.09, 22);           /* main E-W road */
  add(mkBox(13, 0.18, 90, 0x2E2818), 0, 0.09, -18);          /* BRT N-S corridor */
  add(mkBox(2.2, 0.20, 88, 0xB89264, 0xC8A050, 0.18), 0, 0.11, -18); /* BRT gold stripe */
  add(mkBox(9, 0.12, 72, 0x302A20), -34, 0.06, -18);        /* side road left */
  add(mkBox(9, 0.12, 72, 0x302A20), 34, 0.06, -18);        /* side road right */
  add(mkBox(100, 0.12, 8, 0x302A20), -5, 0.06, -54);         /* back cross-road */

  /* Lane dashes — bright cream on dark road */
  for (var lx = -96; lx < 96; lx += 8) {
    add(mkBox(4.5, 0.18, 0.22, 0xEDE5D5), lx, 0.12, 16.5);
    add(mkBox(4.5, 0.18, 0.22, 0xEDE5D5), lx, 0.12, 27.5);
  }
  /* Sidewalks (slightly raised, warm stone) */
  add(mkBox(220, 0.22, 1.6, 0xB8AA98), 0, 0.11, 10.8);
  add(mkBox(220, 0.22, 1.6, 0xB8AA98), 0, 0.11, 33.2);

  /* Pedestrian crossing at x≈-20 */
  for (var cw = 0; cw < 7; cw++) {
    add(mkBox(2.6, 0.20, 5.5, 0xECE4D4), -24 + cw * 3.2, 0.12, 22);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SMART MOBILITY — TOD BUILDINGS
  ═══════════════════════════════════════════════════════════════════════ */
  /* ── Smart Mobility buildings: deep steel-blue / slate palette ─────────
     Completely distinct from the site's burgundy title text and cream sky.
     Looks like a modern urban skyline with glass-and-steel towers.         */
  /* Midnight-slate palette: deep, warm-tinted — pairs with burgundy site identity */
  var bldgDefs = [
    [0, -12, 9, 9, 46, 0x1C2838], [-9, -24, 7, 7, 30, 0x202E42],
    [10, -20, 6, 6, 24, 0x1A2C3E], [-15, -12, 5, 5, 18, 0x28384E],
    [15, -12, 5, 5, 20, 0x142230], [-4, -38, 9, 8, 22, 0x0C1828],
    [9, -36, 7, 6, 16, 0x182838], [-20, -32, 5, 5, 13, 0x202C3A],
    [20, -30, 5, 5, 15, 0x162030], [-2, -50, 11, 9, 9, 0x283C52],
    [10, -50, 6, 6, 8, 0x1E384E], [-18, -50, 5, 5, 11, 0x183048],
  ];
  bldgDefs.forEach(function (b) {
    var bldg = new THREE.Mesh(new THREE.BoxGeometry(b[2], b[4], b[3]),
      new THREE.MeshLambertMaterial({ color: b[5], emissive: 0x5888C8, emissiveIntensity: 0.06 + Math.random() * 0.05 }));
    bldg.position.set(b[0], b[4] / 2, b[1]);
    scene.add(bldg); tagMesh(bldg, "smart");

    /* Windows — soft blue-white office glow */
    var wR = Math.max(3, Math.floor(b[4] / 3.2)), wC = Math.max(1, Math.floor(b[2] / 2.4));
    var winMat = new THREE.MeshBasicMaterial({ color: 0xC8E2F8, transparent: true, opacity: 0.62 });
    for (var wr = 0; wr < wR; wr++) for (var wc = 0; wc < wC; wc++) if (Math.random() < 0.62) {
      var win = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.06), winMat);
      win.position.set(-b[2] / 2 + 1.2 + wc * 2.4, -b[4] / 2 + 2 + wr * 3.2, b[3] / 2 + 0.01);
      bldg.add(win);
    }
    /* Horizontal floor-plate ledges */
    for (var wfl = 0; wfl < Math.floor(b[4] / 7); wfl++) {
      var ledge = mkBox(b[2] + 0.12, 0.14, 0.10, 0x0A1620);
      ledge.position.set(0, -b[4] / 2 + 5 + wfl * 7, b[3] / 2 + 0.02); bldg.add(ledge);
    }
    /* Rooftop details */
    if (b[4] > 18) {
      var rbox = mkBox(Math.min(b[2] * 0.45, 2.2), 1.6, Math.min(b[3] * 0.45, 2.2), 0x0A1418);
      rbox.position.y = b[4] / 2 + 0.8; bldg.add(rbox);
    }
    if (b[4] > 35) { /* antenna */
      var ant = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 7, 5), lmat(0x485868));
      ant.position.y = b[4] / 2 + 4.5; bldg.add(ant);
      var alight = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 5),
        new THREE.MeshBasicMaterial({ color: 0xFF3030 }));
      alight.position.y = b[4] / 2 + 8.2; bldg.add(alight);
    }
  });

  /* TOD density rings — gold, matched to site accent */
  [8, 15, 23].forEach(function (r, i) {
    var ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.3, r + 0.3, 52),
      new THREE.MeshBasicMaterial({ color: 0xB89040, transparent: true, opacity: 0.12 - i * 0.028, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.14, -16); scene.add(ring);
  });

  /* BRT bus — deep burgundy-navy with cream stripe */
  var busGroup = new THREE.Group();
  var busBody = mkBox(11, 2.8, 3.0, 0x183850, 0x4890B8, 0.12); busGroup.add(busBody);
  var busStripe = mkBox(11, 0.6, 3.05, 0xEDE5D5); busStripe.position.y = 0.55; busGroup.add(busStripe);
  var busRoof = mkBox(10.6, 0.4, 2.8, 0x0C1C28); busRoof.position.y = 1.6; busGroup.add(busRoof);
  [-3, 0, 3].forEach(function (wx) {
    var bw = mkBox(0.1, 1.1, 1.9, 0xC0D8F8, 0x78A8F8, 0.22); bw.position.set(2.75, 0.2, wx); busGroup.add(bw);
  });
  busGroup.position.set(0, 1.5, -6); scene.add(busGroup);

  /* Traffic signals */
  var signals = [];
  [[-8, 14], [8, 14]].forEach(function (s) {
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.5, 8), lmat(0x2A2820)), s[0], 2.75, s[1]);
    add(mkBox(0.72, 2.0, 0.55, 0x181A18), s[0], 6.0, s[1]);
    var red = add(new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 8), lmat(0xE05050, 0xE05050, 0.8)), s[0], 5.3, s[1] + 0.3);
    var green = add(new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 8), lmat(0x50DC78, 0x50DC78, 0.8)), s[0], 6.0, s[1] + 0.3);
    signals.push({ red: red, green: green });
  });

  /* Trees around Smart district */
  [[-26, -8], [-26, -22], [-26, -38], [22, -8], [22, -22], [22, -38],
  [-12, -54], [4, -54], [16, -54]].forEach(function (p) { mkTree(p[0], p[1]); });

  mkZone(0, -28, 56, 58, "smart");
  mkHighlight(0, -28, 32, "smart", "#C49030");

  /* ═══════════════════════════════════════════════════════════════════════
     CE-RAIL — ELEVATED VIADUCT
  ═══════════════════════════════════════════════════════════════════════ */
  var VX = 34;

  /* Pillars — dark steel blue */
  for (var vz = -68; vz <= 14; vz += 12) {
    /* I-beam pillar: 3-box composite */
    add(mkBox(2.0, 10, 0.8, 0x384252), VX, 5, vz);            /* web */
    add(mkBox(3.2, 0.6, 1.0, 0x384252), VX, 0.3, vz);          /* base flange */
    add(mkBox(3.2, 0.6, 1.0, 0x384252), VX, 10.1, vz);         /* top flange */
    /* Deck slab */
    add(mkBox(7.5, 1.0, 12.8, 0x485262), VX, 10.5, vz + 6);
  }
  /* Rails */
  [-0.9, 0.9].forEach(function (rx) {
    add(mkBox(0.24, 0.22, 90, 0x607898), VX + rx, 11.1, -27);
  });
  /* Catenary wire */
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(VX, 15, -68), new THREE.Vector3(VX, 15, 14)]),
    new THREE.LineBasicMaterial({ color: 0x8090A8, transparent: true, opacity: 0.55 })));
  /* CBTC block markers */
  [-52, -30, -8, 13].forEach(function (bz) {
    add(mkBox(5.5, 0.08, 0.45, 0x3A90FF, 0x4A90FF, 0.9), VX, 11.15, bz);
  });
  /* Guardrail posts + rail on viaduct deck */
  for (var gz = -65; gz < 14; gz += 5) {
    [-2.8, 2.8].forEach(function (gx) {
      add(mkBox(0.12, 0.9, 0.12, 0x586272), VX + gx, 11.45, gz);  /* post */
    });
  }
  add(mkBox(0.1, 0.12, 86, 0x607098), VX - 2.8, 11.9, -27);   /* handrail L */
  add(mkBox(0.1, 0.12, 86, 0x607098), VX + 2.8, 11.9, -27);   /* handrail R */

  /* Train — 6 cars, steel-blue livery with cream window bands */
  var trainGroup = new THREE.Group();
  [0x1A3050, 0x0E2038, 0x0E2038, 0x0E2038, 0x0E2038, 0x1A3050].forEach(function (cc, i) {
    var car = new THREE.Group();
    /* Body */
    var body = mkBox(5.2, 2.4, 2.8, cc, 0xB88A38, 0.09); car.add(body);
    /* Cream window band */
    var band = mkBox(5.25, 0.7, 2.85, 0xEDE5D5); band.position.y = 0.5; car.add(band);
    /* Windows on band */
    [-1.4, 0, 1.4].forEach(function (wz) {
      var w = mkBox(0.08, 0.55, 1.2, 0x78B8F8, 0x4898F0, 0.35); w.position.set(2.64, 0.5, wz); car.add(w);
      var w2 = mkBox(0.08, 0.55, 1.2, 0x78B8F8, 0x4898F0, 0.35); w2.position.set(-2.64, 0.5, wz); car.add(w2);
    });
    /* Bogies (wheel sets) */
    [-1.4, 1.4].forEach(function (bz) {
      var bogie = mkBox(1.8, 0.5, 2.4, 0x202028); bogie.position.set(0, -1.45, bz); car.add(bogie);
      [-0.8, 0.8].forEach(function (wx) {
        var axle = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.6, 8), lmat(0x484850));
        axle.rotation.z = Math.PI / 2; axle.position.set(wx, -1.65, bz); car.add(axle);
      });
    });
    car.position.z = -i * 6.2;
    tagMesh(body, "rail");
    trainGroup.add(car);
  });
  trainGroup.position.set(VX, 12.3, -15);
  scene.add(trainGroup);

  /* Label anchor set after VX */
  labelAnchors.rail = new THREE.Vector3(VX, 18, -20);

  mkZone(VX, -27, 24, 90, "rail");
  mkHighlight(VX, -27, 18, "rail", "#4880C8");

  /* ═══════════════════════════════════════════════════════════════════════
     CTRLAB — WIND TURBINES (left)
  ═══════════════════════════════════════════════════════════════════════ */
  /* Muted park ground — warm forest */
  add(mkBox(42, 0.14, 48, 0x285018), -34, 0.07, -42);
  /* Park path */
  add(mkBox(2.5, 0.16, 44, 0xA89070), -34, 0.08, -42);
  /* Trees in park */
  [[-44, -30], [-24, -30], [-44, -52], [-24, -52], [-44, -42], [-24, -42]].forEach(function (p) { mkTree(p[0], p[1]); });

  var turbineRotors = [];
  [[-34, -28], [-26, -50], [-42, -50]].forEach(function (td, ti) {
    var tx = td[0], tz = td[1];
    /* Tower — tapered cylinder */
    var tower = add(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.72, 28, 10), lmat(0xD4CCC4, 0xF0E8DC, 0.04)), tx, 14, tz);
    tagMesh(tower, "ctrlab");
    /* Nacelle */
    add(mkBox(2.2, 1.4, 3.6, 0xCCC4BC), tx, 28.6, tz);
    add(mkBox(0.6, 0.6, 0.6, 0xA8A098), tx, 28.6, tz - 2.0); /* spinner */

    /* Hub + 3 tapered blades */
    var rg = new THREE.Group(); rg.position.set(tx, 28.6, tz - 1.9);
    var hub = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), lmat(0xCCC4BC)); rg.add(hub);
    for (var bi = 0; bi < 3; bi++) {
      var bladeG = new THREE.Group();
      /* Tapered blade: wide at root, narrow at tip (2 boxes stacked) */
      var bRoot = mkBox(0.55, 6, 0.14, 0xE8E0D4); bRoot.position.y = 3.5; bladeG.add(bRoot);
      var bTip = mkBox(0.28, 8, 0.08, 0xEEE8E0); bTip.position.y = 11; bladeG.add(bTip);
      bladeG.rotation.z = (bi / 3) * Math.PI * 2;
      rg.add(bladeG);
    }
    scene.add(rg); turbineRotors.push({ grp: rg, spd: 0.008 + ti * 0.003 });

    /* Warning light on top */
    var wlight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xFF3030 }));
    wlight.position.set(tx, 29.6, tz); scene.add(wlight);
    turbineRotors[turbineRotors.length - 1].wlight = wlight;
    turbineRotors[turbineRotors.length - 1].wph = Math.random() * Math.PI * 2;
  });

  /* Energy particles */
  var energyPts = [];
  [[-34, -28], [-26, -50], [-42, -50]].forEach(function (eb) {
    for (var k = 0; k < 12; k++) {
      var ep = new THREE.Mesh(new THREE.SphereGeometry(0.20, 5, 5),
        new THREE.MeshBasicMaterial({ color: 0x3AE860, transparent: true, opacity: 0.65 }));
      ep.position.set(eb[0] + (Math.random() - 0.5) * 10, 2 + Math.random() * 26, eb[1] + (Math.random() - 0.5) * 7);
      ep.userData = { bx: eb[0], bz: eb[1], sy: ep.position.y, spd: 0.22 + Math.random() * 0.45, ph: Math.random() * Math.PI * 2 };
      scene.add(ep); energyPts.push(ep);
    }
  });

  labelAnchors.ctrlab = new THREE.Vector3(-34, 36, -38);

  mkZone(-34, -42, 42, 48, "ctrlab");
  mkHighlight(-34, -42, 24, "ctrlab", "#3C9848");

  /* ═══════════════════════════════════════════════════════════════════════
     SEE — FRONT ROAD  (vivid vehicles + hazard halos)
  ═══════════════════════════════════════════════════════════════════════ */
  var vehicles = [], gazeRings = [], gazeParticles = [];

  /* [x, z, spd, isRisk, bodyColor, w, h, d, windshieldColor] */
  var vehDefs = [
    /* Risk motorbikes — bright red */
    [38, 19, -0.09, true, 0xFF1820, 1.1, 0.85, 1.8, null],
    [-22, 23, 0.10, true, 0xFF2010, 1.1, 0.85, 1.8, null],
    [8, 21, -0.07, true, 0xE82018, 1.1, 0.85, 1.8, null],
    /* Cars — yellow taxi, blue, white, silver */
    [62, 20, -0.06, false, 0xF0C030, 1.4, 1.0, 2.3, 0x88CCFF],
    [-52, 24, 0.08, false, 0x1858C0, 1.4, 1.0, 2.3, 0xAADDFF],
    [-12, 19, -0.05, false, 0xF0EEE8, 1.4, 1.0, 2.3, 0x88BBEE],
    [48, 23, -0.04, false, 0xC02830, 1.4, 1.0, 2.3, 0x99CCEE],
    /* Buses — green, blue, purple */
    [28, 23, 0.065, false, 0x1A8040, 3.6, 1.5, 2.0, 0xAAEECC],
    [-38, 20, -0.07, false, 0x1A4898, 3.8, 1.5, 2.0, 0xAABBFF],
    [0, 24, 0.055, false, 0x782890, 3.6, 1.5, 2.0, 0xCCABEE],
    /* Trucks — dark grey */
    [-68, 21, 0.04, false, 0x383028, 7.0, 2.5, 2.8, 0x88AACC],
    [70, 20, -0.04, false, 0x304048, 7.0, 2.5, 2.8, 0x88AACC],
  ];

  vehDefs.forEach(function (vd) {
    var vx = vd[0], vz = vd[1], spd = vd[2], risk = vd[3], vc = vd[4], vw = vd[5], vh = vd[6], vdp = vd[7], wsc = vd[8];
    var vGrp = new THREE.Group();

    /* Main body */
    var vm = new THREE.MeshLambertMaterial({ color: vc, emissive: risk ? 0xFF2010 : vc, emissiveIntensity: risk ? 0.22 : 0.04 });
    var body = new THREE.Mesh(new THREE.BoxGeometry(vw, vh, vdp), vm);
    vGrp.add(body);

    /* Windshield on front and rear */
    if (wsc && vw < 5) {
      var wsm = new THREE.MeshBasicMaterial({ color: wsc, transparent: true, opacity: 0.7 });
      var wsf = new THREE.Mesh(new THREE.BoxGeometry(vw * 0.72, vh * 0.55, 0.08), wsm);
      wsf.position.set(0, vh * 0.12, vdp / 2 + 0.05); vGrp.add(wsf);
    }
    /* Roof on buses */
    if (vw > 3 && vh < 2) {
      var roof = mkBox(vw - 0.2, 0.25, vdp - 0.2, 0x1A1A18); roof.position.y = vh / 2 + 0.12; vGrp.add(roof);
    }
    /* Wheels (small dark cylinders) */
    if (!risk) {
      var wheelMat = new THREE.MeshLambertMaterial({ color: 0x181818 });
      [vdp * 0.32, -vdp * 0.32].forEach(function (wz) {
        [vw / 2 + 0.05, -vw / 2 - 0.05].forEach(function (wx) {
          var wh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 8), wheelMat);
          wh.rotation.z = Math.PI / 2; wh.position.set(wx, -vh / 2 + 0.15, wz); vGrp.add(wh);
        });
      });
    }

    vGrp.position.set(vx, vh / 2, vz);
    vGrp.userData = { spd: spd, risk: risk, labKey: "see" };
    scene.add(vGrp); vehicles.push(vGrp);
    tagMesh(body, "see");

    if (risk) {
      var hm = new THREE.MeshBasicMaterial({ color: 0xCC2418, transparent: true, opacity: 0.32, side: THREE.DoubleSide });
      var halo = new THREE.Mesh(new THREE.RingGeometry(1.4, 3.2, 28), hm);
      halo.rotation.x = -Math.PI / 2; halo.position.set(vx, 0.09, vz); scene.add(halo);
      vGrp.userData.halo = halo; gazeRings.push({ ring: halo, veh: vGrp, ph: Math.random() * Math.PI * 2 });
      var gpts = [];
      for (var gi = 0; gi < 18; gi++) {
        var gm = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.8 });
        var gp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 4, 4), gm);
        gp.userData = { ox: (Math.random() - 0.5) * 1.8, oy: vh + 0.9 + Math.random() * 1.6, oz: (Math.random() - 0.5) * 1.0, ph: Math.random() * Math.PI * 2 };
        gp.position.set(vx + gp.userData.ox, gp.userData.oy, vz + gp.userData.oz); scene.add(gp); gpts.push(gp);
      }
      gazeParticles.push({ pts: gpts, veh: vGrp });
    }
  });

  /* Hazard floor triangles */
  [38, -22, 8].forEach(function (hx) {
    var trig = new THREE.Mesh(new THREE.ConeGeometry(3.2, 0.06, 3),
      new THREE.MeshBasicMaterial({ color: 0xCC2418, transparent: true, opacity: 0.16, side: THREE.DoubleSide }));
    trig.rotation.x = -Math.PI / 2; trig.position.set(hx, 0.14, 22); scene.add(trig);
  });

  labelAnchors.see = new THREE.Vector3(0, 14, 24);
  labelAnchors.smart = new THREE.Vector3(0, 52, -20);

  mkZone(0, 22, 200, 26, "see");
  mkHighlight(0, 22, 38, "see", "#C82828");

  /* ── Street lamps ─────────────────────────────────────────────────────── */
  var polMat = lmat(0x5A5048), lampMat = lmat(0xFFE890, 0xFFE890, 0.55);
  [-72, -52, -32, -12, 8, 28, 48, 68].forEach(function (ix) {
    [1, -1].forEach(function (side) {
      var pole = add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 6.5, 8), polMat), ix, 3.25, 22 + side * 13);
      /* lamp arm */
      var arm = mkBox(2.5, 0.12, 0.12, 0x4A4038); arm.position.set(1.25, 3.0, 0); pole.add(arm);
      add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), lampMat), ix + 2.5, 6.3, 22 + side * 13);
    });
  });
  /* Trees along road edges */
  [-60, -40, -20, 0, 20, 40, 60].forEach(function (tx) {
    mkTree(tx, 9.5);
    mkTree(tx, 34.5);
  });

  /* ═══════════════════════════════════════════════════════════════════════
     RAYCASTER — hover + click
  ═══════════════════════════════════════════════════════════════════════ */
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  function showTip(labKey, sx, sy) {
    var lab = LABS[labKey];
    if (!lab) return;
    tip.innerHTML =
      '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;' +
      'background:' + lab.dot + ';margin-right:7px;vertical-align:middle;"></span>' +
      '<strong style="font-size:.84rem;color:#1A1A1A;">' + lab.name + '</strong><br>' +
      '<span style="color:#6E6760;font-size:.75rem;">' + lab.sub + '</span><br>' +
      '<span style="color:' + lab.hex + ';font-size:.74rem;margin-top:3px;display:block;font-weight:600;">Click to explore →</span>';
    tip.style.left = sx + "px";
    tip.style.top = (sy - 88) + "px";
    tip.style.opacity = "1";
  }
  function hideTip() { tip.style.opacity = "0"; }
  function setHL(k, on) { if (highlights[k]) highlights[k].mat.opacity = on ? 0.24 : 0; }

  window.addEventListener("mousemove", function (e) {
    if (orb.drag) { hideTip(); return; }
    var rect = cvs.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var hits = raycaster.intersectObjects(hitMeshes, false);
    var newLab = hits.length ? (hits[0].object.userData.labKey || null) : null;
    if (newLab !== hoveredLab) {
      if (hoveredLab) setHL(hoveredLab, false);
      hoveredLab = newLab;
      if (hoveredLab) { setHL(hoveredLab, true); cvs.style.cursor = "pointer"; }
      else { hideTip(); cvs.style.cursor = "grab"; }
    }
    if (hoveredLab) showTip(hoveredLab, e.clientX - rect.left, e.clientY - rect.top);
  });

  cvs.addEventListener("mouseleave", function () {
    if (hoveredLab) { setHL(hoveredLab, false); hoveredLab = null; }
    hideTip(); cvs.style.cursor = "grab";
  });
  cvs.addEventListener("click", function () {
    if (hoveredLab && LABS[hoveredLab] && !orb.drag) window.location.href = LABS[hoveredLab].url;
  });

  /* ═══════════════════════════════════════════════════════════════════════
     ORBIT CONTROLS
  ═══════════════════════════════════════════════════════════════════════ */
  function updateCam() {
    var flat = orb.r * Math.cos(Math.atan2(orb.elev, orb.r));
    camera.position.set(Math.sin(orb.angle) * flat, orb.elev, Math.cos(orb.angle) * flat);
    camera.lookAt(0, 0, -18);
  }

  cvs.style.cursor = "grab";
  cvs.addEventListener("mousedown", function (e) {
    orb.drag = true; orb.lx = e.clientX; orb.ly = e.clientY; cvs.style.cursor = "grabbing"; hideTip();
  });
  window.addEventListener("mousemove", function (e) {
    if (!orb.drag) return;
    orb.angle += (e.clientX - orb.lx) * 0.004;
    orb.elev = Math.max(28, Math.min(80, orb.elev - (e.clientY - orb.ly) * 0.22));
    orb.lx = e.clientX; orb.ly = e.clientY; updateCam();
  });
  window.addEventListener("mouseup", function () {
    orb.drag = false; cvs.style.cursor = hoveredLab ? "pointer" : "grab";
  });
  cvs.addEventListener("touchstart", function (e) { orb.drag = true; orb.lx = e.touches[0].clientX; orb.ly = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchmove", function (e) {
    if (!orb.drag) return;
    orb.angle += (e.touches[0].clientX - orb.lx) * 0.004;
    orb.elev = Math.max(28, Math.min(80, orb.elev - (e.touches[0].clientY - orb.ly) * 0.22));
    orb.lx = e.touches[0].clientX; orb.ly = e.touches[0].clientY; updateCam();
  }, { passive: true });
  window.addEventListener("touchend", function () { orb.drag = false; });

  /* ═══════════════════════════════════════════════════════════════════════
     ANIMATION LOOP
  ═══════════════════════════════════════════════════════════════════════ */
  var t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;
    if (!orb.drag) { orb.angle += 0.00007; updateCam(); }

    /* Vehicles */
    vehicles.forEach(function (v) {
      v.position.x += v.userData.spd;
      if (v.position.x > 100) v.position.x = -100;
      if (v.position.x < -100) v.position.x = 100;
      if (v.userData.halo) v.userData.halo.position.x = v.position.x;
    });

    gazeRings.forEach(function (gr) {
      gr.ring.position.x = gr.veh.position.x;
      var s = 0.80 + 0.42 * Math.abs(Math.sin(t * 1.8 + gr.ph));
      gr.ring.scale.set(s, s, s);
      gr.ring.material.opacity = 0.10 + 0.30 * Math.abs(Math.sin(t * 1.4 + gr.ph));
    });

    gazeParticles.forEach(function (gp) {
      gp.pts.forEach(function (p) {
        p.position.x = gp.veh.position.x + p.userData.ox + 0.2 * Math.sin(t * 3.0 + p.userData.ph);
        p.position.y = p.userData.oy + 0.15 * Math.sin(t * 2.6 + p.userData.ph);
        p.position.z = gp.veh.position.z + p.userData.oz;
        p.material.opacity = 0.30 + 0.56 * Math.abs(Math.sin(t * 2.2 + p.userData.ph));
      });
    });

    /* Train */
    trainGroup.position.z -= 0.065;
    if (trainGroup.position.z < -72) trainGroup.position.z = 16;

    /* Bus */
    busGroup.position.z -= 0.055;
    if (busGroup.position.z < -70) busGroup.position.z = 10;

    /* Turbines */
    turbineRotors.forEach(function (tr) {
      tr.grp.rotation.z -= tr.spd;
      if (tr.wlight) {
        tr.wlight.material.color.setHex(Math.sin(t * 3.5 + tr.wph) > 0.5 ? 0xFF2020 : 0x881010);
      }
    });

    /* Energy particles */
    energyPts.forEach(function (ep) {
      ep.position.y += ep.userData.spd * 0.014;
      ep.position.x = ep.userData.bx + 4 * Math.sin(t * 0.72 + ep.userData.ph);
      if (ep.position.y > 36) ep.position.y = ep.userData.sy;
      ep.material.opacity = 0.28 + 0.52 * Math.abs(Math.sin(t * 1.1 + ep.userData.ph));
    });

    /* Traffic signals */
    signals.forEach(function (sig, si) {
      var cycle = (t * 0.28 + si * 18) % 60, grn = cycle < 32;
      sig.green.material.color.setHex(grn ? 0x20E060 : 0x0A3018);
      sig.green.material.emissiveIntensity = grn ? 0.95 : 0.05;
      sig.red.material.color.setHex(grn ? 0x3A1010 : 0xE03030);
      sig.red.material.emissiveIntensity = grn ? 0.05 : 0.95;
    });

    /* 3-D projected district labels */
    updateLabels();

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", function () {
    var nW = host.clientWidth || window.innerWidth, nH = host.clientHeight || window.innerHeight;
    renderer.setSize(nW, nH); camera.aspect = nW / nH; camera.updateProjectionMatrix();
  });
})();
