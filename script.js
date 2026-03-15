/* ── Nav ── */
var nb = document.getElementById('nb');
window.addEventListener('scroll', function() {
  nb.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile nav ── */
function toggleMob() {
  var n = document.getElementById('mobnav');
  n.style.display = n.style.display === 'flex' ? 'none' : 'flex';
}

/* ── Hero Slider ── */
var curSlide = 0;
var TOTAL_SLIDES = 4;
var sliderTimer = null;

function goSlide(n) {
  var wrap = document.getElementById('slides');
  var next = (n + TOTAL_SLIDES) % TOTAL_SLIDES;
  // Detect wrap-around (going past last → first or past first → last)
  var isWrap = (n >= TOTAL_SLIDES) || (n < 0);
  if (isWrap) {
    // Jump instantly (no transition) then restore
    wrap.style.transition = 'none';
    wrap.style.transform = 'translateX(-' + (next * 100) + '%)';
    wrap.offsetWidth; // force reflow so transition:none takes effect
    wrap.style.transition = '';
  } else {
    wrap.style.transform = 'translateX(-' + (next * 100) + '%)';
  }
  curSlide = next;
  document.querySelectorAll('.sdot').forEach(function(d, i) { d.classList.toggle('active', i === curSlide); });
}
function moveSlide(dir) { clearInterval(sliderTimer); goSlide(curSlide + dir); startAutoSlide(); }
function startAutoSlide() { sliderTimer = setInterval(function() { goSlide(curSlide + 1); }, 5000); }
startAutoSlide();

/* ── Testimonials slider ── */
var tIdx = 0;
var PER = window.innerWidth < 820 ? 1 : 3;
function moveTesti(dir) {
  var track = document.getElementById('ttrack');
  var total = track.children.length;
  tIdx = Math.max(0, Math.min(tIdx + dir, total - PER));
  var w = track.children[0].offsetWidth + 22;
  track.style.transform = 'translateX(-' + (tIdx * w) + 'px)';
}

/* ── 3D registry ── */
var _reg3 = {};
var MAX_ACTIVE_3D = 12;
function active3dCount() {
  return Object.keys(_reg3).filter(function(k) { return _reg3[k] && _reg3[k].inst; }).length;
}
function clearProject3d() {
  Object.keys(_reg3).forEach(function(k) {
    if (k.indexOf('pc-') !== 0) return;
    var oldCanvas = document.getElementById(k);
    if (oldCanvas) ctxObs.unobserve(oldCanvas);
    kill3d(k);
    delete _reg3[k];
  });
}
var ctxObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    var id = entry.target.id;
    if (!_reg3[id]) return;
    if (entry.isIntersecting) { boot3d(id); }
    else { kill3d(id); }
  });
}, { threshold: 0.05 });

/* ── Scroll reveal ── */
var rvObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(x) { if (x.isIntersecting) x.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(r) { rvObs.observe(r); });

/* ── Counters ── */
var counterObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(x) {
    if (!x.isIntersecting) return;
    var el = x.target;
    var t = +el.dataset.c;
    var step = Math.ceil(t / 60);
    var c = 0;
    var iv = setInterval(function() {
      c = Math.min(c + step, t);
      el.textContent = c;
      if (c >= t) clearInterval(iv);
    }, 22);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-c]').forEach(function(e) { counterObs.observe(e); });

/* ── FAQ ── */
function toggleFaq(el) { el.parentElement.classList.toggle('open'); }

/* ── Projects Filter ── */
var PROJECTS = [
  { cat: 'turf',       sport: '⚽ Football Turf',    name: 'DPS Lucknow — 5-a-side Turf',       loc: '📍 Lucknow, UP',    client: '🏫 DPS School',          type: 'FIFA Artificial Grass',  desc: 'FIFA-grade 5-a-side artificial turf with perimeter fencing and LED floodlights installed in 4 weeks.' },
  { cat: 'tennis',     sport: '🎾 Tennis Court',     name: 'Prestige Society — 2 Tennis Courts', loc: '📍 Bengaluru, KA',  client: '🏢 Residential Society', type: 'Acrylic Hard Surface',   desc: 'Two acrylic tennis courts with line markings, net posts, and LED lighting for a premium residential society.' },
  { cat: 'basketball', sport: '🏀 Basketball Court', name: 'St. Francis School Basketball',      loc: '📍 Jaipur, RJ',     client: '🏫 St. Francis School',  type: 'FIBA Modular Tiles',     desc: 'Full FIBA-spec basketball court with modular interlocking tiles and glass backboards on a school campus.' },
  { cat: 'track',      sport: '🏃 Running Track',    name: 'Regional University — 400m Track',   loc: '📍 Pune, MH',       client: '🎓 Sports University',   type: 'IAAF PU Surface',        desc: 'IAAF-certified 400m polyurethane running track with 8 lanes, inner grass field, and full drainage system.' },
  { cat: 'padel',      sport: '🎯 Padel Court',      name: 'Sunrise Club — 3 Padel Courts',      loc: '📍 New Delhi, DL',  client: '🏟️ Sports Club',        type: 'Glass-wall Padel',       desc: 'Three commercial padel courts with tempered glass walls, artificial grass, structural steel and LED lighting.' },
  { cat: 'badminton',  sport: '🏸 Badminton Hall',   name: 'Champions Academy — 4 Courts',       loc: '📍 Pune, MH',       client: '🏸 Badminton Academy',  type: 'BWF Vinyl Flooring',     desc: '4-court badminton hall with BWF-approved PU vinyl flooring, acoustic ceiling, and professional lighting.' },
  { cat: 'turf',       sport: '⚽ Football Turf',    name: 'Army Cantonment — Full Turf Field',  loc: '📍 Meerut, UP',     client: '🪖 Army Cantonment',    type: 'FIFA Grass — Full Size', desc: 'Full-size FIFA artificial grass football field built for an army cantonment — 11-a-side format with floodlights.' },
  { cat: 'padel',      sport: '🏓 Pickleball Court', name: 'Corporate Park — 2 Pickleball Cts',  loc: '📍 Hyderabad, TG',  client: '🏢 Corporate Campus',   type: 'Acrylic Pickleball',     desc: 'Two regulation pickleball courts with acrylic surface, colour line markings, permanent posts, and shading.' },
  { cat: 'tennis',     sport: '🎾 Tennis Court',     name: 'Hotel Grand — Court Renovation',     loc: '📍 Mumbai, MH',     client: '🏨 Hotel Chain',         type: 'Acrylic — Renovation',   desc: 'Full renovation of hotel tennis court — resurfacing, line marking, net replacement, and perimeter upgrade.' },
];

function renderProjects(filter) {
  var grid = document.getElementById('proj-grid');
  clearProject3d();
  var getProjectImage = function(p) {
    if (p.name.indexOf('Pickleball') !== -1) return './images/preview_pickleball.png';
    var map = {
      turf: './images/preview_turf.png',
      tennis: './images/preview_tennis.png',
      basketball: './images/preview_basketball.png',
      track: './images/preview_track.png',
      padel: './images/preview_padel.png',
      badminton: './images/preview_badminton.png'
    };
    return map[p.cat] || './images/preview_turf.png';
  };
  var getProjectBadge = function(p) {
    var map = {
      turf: '⚽ Real Site Photo',
      tennis: '🎾 Real Site Photo',
      basketball: '🏀 Real Site Photo',
      track: '🏃 Real Site Photo',
      padel: '🎯 Real Site Photo',
      badminton: '🏸 Real Site Photo'
    };
    return p.name.indexOf('Pickleball') !== -1 ? '🏓 Real Site Photo' : (map[p.cat] || '📸 Real Site Photo');
  };
  var filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(function(p) { return p.cat === filter; });
  grid.innerHTML = filtered.map(function(p, i) {
    var img = getProjectImage(p);
    var badge = getProjectBadge(p);
    return '<div class="proj-card reveal' + (i%3===1?' d1':i%3===2?' d2':'') + '"><div class="proj-img-wrap"><div class="proj-img-bg" style="background-image:url(\'' + img + '\')"></div><div class="proj-img-badge">' + badge + '</div><div class="proj-img-overlay"><span>' + p.sport + '</span></div></div><div class="proj-info"><div class="proj-sport">' + p.sport + '</div><div class="proj-name">' + p.name + '</div><div class="proj-desc">' + p.desc + '</div><div class="proj-meta"><span class="proj-meta-item">' + p.loc + '</span><span class="proj-meta-item">' + p.client + '</span><span class="proj-meta-item">🏗️ ' + p.type + '</span></div></div></div>';
  }).join('');
  grid.querySelectorAll('.reveal').forEach(function(r) { rvObs.observe(r); });
}

function filterProj(el, cat) {
  document.querySelectorAll('.ptab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  renderProjects(cat);
}

/* ── Lazy 3D Engine ── */
function lazy3d(id, setupFn, opts) {
  opts = opts || {};
  _reg3[id] = { setupFn: setupFn, opts: Object.assign({ h: 460, camY: 12, camZ: 16 }, opts), inst: null, retries: 0 };
  var cv = document.getElementById(id);
  if (cv) ctxObs.observe(cv);
}

function boot3d(id) {
  var e = _reg3[id];
  if (!e || e.inst) return;

  if (!window.THREE) {
    e.retries = (e.retries || 0) + 1;
    if (e.retries <= 20) {
      setTimeout(function() { boot3d(id); }, 250);
    }
    return;
  }
  e.retries = 0;

  if (active3dCount() >= MAX_ACTIVE_3D) {
    e.retries = (e.retries || 0) + 1;
    if (e.retries <= 20) {
      setTimeout(function() { boot3d(id); }, 250);
    }
    return;
  }

  var cv = document.getElementById(id);
  if (!cv) return;
  var W = cv.parentElement.clientWidth || 400;
  var H = e.opts.h;
  var wr = null;
  try {
    wr = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  } catch (err) {
    e.retries = (e.retries || 0) + 1;
    if (e.retries <= 20) {
      setTimeout(function() { boot3d(id); }, 300);
    }
    return;
  }
  wr.setPixelRatio(Math.min(devicePixelRatio, 2));
  wr.setSize(W, H);
  var sc = new THREE.Scene();
  var cam = new THREE.PerspectiveCamera(42, W / H, .1, 200);
  cam.position.set(0, e.opts.camY, e.opts.camZ); cam.lookAt(0, 0, 0);
  sc.add(new THREE.AmbientLight(0xffffff, .85));
  var sun = new THREE.DirectionalLight(0xffffff, 1.3); sun.position.set(8, 14, 10); sc.add(sun);
  var fill = new THREE.DirectionalLight(0xb0d4ff, .35); fill.position.set(-8, 4, -8); sc.add(fill);
  var gr = new THREE.GridHelper(36, 36, 0xc8d8c8, 0xdde8dd);
  gr.position.y = -.02; gr.material.opacity = .32; gr.material.transparent = true; sc.add(gr);
  e.setupFn(sc);
  var drag = false, px = 0, ry = 0, alive = true, rafId = null;
  var ds = function(ev) { drag = true; px = ev.clientX || (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0) || 0; };
  var dm = function(ev) { if (!drag) return; var cx = ev.clientX || (ev.touches && ev.touches[0] ? ev.touches[0].clientX : px) || px; ry += (cx - px) * .013; px = cx; };
  var de = function() { drag = false; };
  cv.addEventListener('mousedown', ds); window.addEventListener('mousemove', dm); window.addEventListener('mouseup', de);
  cv.addEventListener('touchstart', ds, { passive: true }); window.addEventListener('touchmove', dm, { passive: true }); window.addEventListener('touchend', de);
  var loop = function() { if (!alive) return; rafId = requestAnimationFrame(loop); if (!drag) ry += .006; sc.rotation.y = ry; wr.render(sc, cam); };
  loop();
  e.inst = {
    dispose: function() {
      alive = false; if (rafId) cancelAnimationFrame(rafId);
      cv.removeEventListener('mousedown', ds); window.removeEventListener('mousemove', dm); window.removeEventListener('mouseup', de);
      cv.removeEventListener('touchstart', ds); window.removeEventListener('touchmove', dm); window.removeEventListener('touchend', de);
      sc.traverse(function(obj) { if (obj.geometry) obj.geometry.dispose(); if (obj.material) { if (Array.isArray(obj.material)) obj.material.forEach(function(m) { m.dispose(); }); else obj.material.dispose(); } });
      wr.dispose(); e.inst = null;
    }
  };
}
function kill3d(id) { if (_reg3[id] && _reg3[id].inst) _reg3[id].inst.dispose(); }

/* ── Geometry helpers ── */
function BX(w, h, d, col, x, y, z, sc) {
  x = x || 0; y = y || 0; z = z || 0;
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: col, roughness: .75 }));
  m.position.set(x, y, z); sc.add(m); return m;
}
function LN(x, z, w, d, sc, col) {
  col = col || 0xffffff;
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, .02, d), new THREE.MeshBasicMaterial({ color: col }));
  m.position.set(x, .01, z); sc.add(m);
}

/* ── Court builder ── */
function buildCourt(sc, type) {
  if (type === 'football') {
    BX(16, .22, 10, 0x2d7a3a, 0, -.11, 0, sc);
    for (var i = -3; i <= 3; i += 2) { var s = new THREE.Mesh(new THREE.BoxGeometry(16, .03, .85), new THREE.MeshStandardMaterial({ color: 0x357a3a })); s.position.set(0, .12, i * 1.15); sc.add(s); }
    LN(0, 0, .08, 10, sc); LN(0, 5, 16, .08, sc); LN(0, -5, 16, .08, sc); LN(8, 0, .08, 10, sc); LN(-8, 0, .08, 10, sc);
    var cr = new THREE.Mesh(new THREE.TorusGeometry(1.8, .055, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffffff })); cr.rotation.x = Math.PI / 2; cr.position.y = .05; sc.add(cr);
    var gm = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .4 });
    [8, -8].forEach(function(x) { [-1.1, 1.1].forEach(function(z) { var p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2, 8), gm); p.position.set(x, 1, z); sc.add(p); }); var cb = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 2.3, 8), gm); cb.rotation.z = Math.PI / 2; cb.position.set(x, 2, 0); sc.add(cb); });
    [[8,5],[8,-5],[-8,5],[-8,-5]].forEach(function(arr) { var fx = arr[0], fz = arr[1]; var f = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.3, 6), new THREE.MeshStandardMaterial({ color: 0xff4422 })); f.position.set(fx, .65, fz); sc.add(f); });
  } else if (type === 'tennis') {
    BX(13, .2, 7, 0x2255bb, 0, -.1, 0, sc);
    LN(0, 0, .07, 7, sc); LN(0, 3.4, 13, .07, sc); LN(0, -3.4, 13, .07, sc); LN(6.4, 0, .07, 7, sc); LN(-6.4, 0, .07, 7, sc); LN(0, 1.4, 9, .07, sc); LN(0, -1.4, 9, .07, sc);
    var net = new THREE.Mesh(new THREE.BoxGeometry(13, 1, .06), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })); net.position.set(0, .5, 0); sc.add(net);
  } else if (type === 'basketball') {
    BX(14, .2, 8, 0xc45500, 0, -.1, 0, sc);
    var pm = new THREE.MeshStandardMaterial({ color: 0xa04800 }); [5.5, -5.5].forEach(function(x) { var p = new THREE.Mesh(new THREE.BoxGeometry(4.5, .03, 5.5), pm); p.position.set(x, .11, 0); sc.add(p); });
    LN(0, 0, 14, .07, sc); LN(0, 3.9, 14, .07, sc); LN(0, -3.9, 14, .07, sc); LN(6.9, 0, .07, 7.8, sc); LN(-6.9, 0, .07, 7.8, sc); LN(0, 0, .07, 7.8, sc);
    var cr2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, .04, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffffff })); cr2.rotation.x = Math.PI / 2; cr2.position.y = .05; sc.add(cr2);
    var hm = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: .5 });
    [7.2, -7.2].forEach(function(x) { var h = new THREE.Mesh(new THREE.TorusGeometry(.4, .04, 8, 28), hm); h.rotation.x = Math.PI / 2; h.position.set(x - Math.sign(x) * .5, 2.5, 0); sc.add(h); var pl = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.8, 8), new THREE.MeshStandardMaterial({ color: 0x999999, metalness: .7 })); pl.position.set(x, 1.4, 0); sc.add(pl); });
  } else if (type === 'track') {
    var out = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshStandardMaterial({ color: 0xcc4400 })); out.rotation.x = -Math.PI / 2; sc.add(out);
    var inn = new THREE.Mesh(new THREE.CircleGeometry(5.5, 64), new THREE.MeshStandardMaterial({ color: 0x2d8a3a })); inn.rotation.x = -Math.PI / 2; inn.position.y = .03; sc.add(inn);
    for (var r = 5.6; r <= 8.1; r += .45) { var lr = new THREE.Mesh(new THREE.TorusGeometry(r, .03, 6, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: .5, transparent: true })); lr.rotation.x = Math.PI / 2; lr.position.y = .04; sc.add(lr); }
  } else if (type === 'padel') {
    BX(10, .2, 5.5, 0x2d7a3a, 0, -.1, 0, sc); LN(0, 0, 10, .07, sc); LN(0, 2.6, 10, .07, sc); LN(0, -2.6, 10, .07, sc); LN(4.9, 0, .07, 5.5, sc); LN(-4.9, 0, .07, 5.5, sc);
    var gm2 = new THREE.MeshStandardMaterial({ color: 0x88ccff, opacity: .28, transparent: true, roughness: .1, metalness: .5 });
    [2.7, -2.7].forEach(function(z) { var w = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, .1), gm2); w.position.set(0, 1.25, z); sc.add(w); }); [5.05, -5.05].forEach(function(x) { var w = new THREE.Mesh(new THREE.BoxGeometry(.1, 2.5, 5.5), gm2); w.position.set(x, 1.25, 0); sc.add(w); });
    var net2 = new THREE.Mesh(new THREE.BoxGeometry(10, .9, .05), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })); net2.position.set(0, .45, 0); sc.add(net2);
  } else if (type === 'badminton') {
    BX(14, .18, 7, 0x4499cc, 0, -.09, 0, sc);
    LN(0, 0, 14, .06, sc); LN(0, 3.4, 14, .06, sc); LN(0, -3.4, 14, .06, sc); LN(6.9, 0, .06, 6.8, sc); LN(-6.9, 0, .06, 6.8, sc); LN(0, 1.98, 12, .06, sc); LN(0, -1.98, 12, .06, sc); LN(0, 0, .06, 6.8, sc);
    var net3 = new THREE.Mesh(new THREE.BoxGeometry(7.5, .8, .05), new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true })); net3.position.set(0, .4, 0); sc.add(net3);
  } else if (type === 'pickleball') {
    BX(10, .18, 5.5, 0x44aa88, 0, -.09, 0, sc);
    LN(0, 0, 10, .06, sc); LN(0, 2.6, 10, .06, sc); LN(0, -2.6, 10, .06, sc); LN(4.9, 0, .06, 5.5, sc); LN(-4.9, 0, .06, 5.5, sc); LN(0, 0, .06, 5.5, sc);
    var net4 = new THREE.Mesh(new THREE.BoxGeometry(5.5, .8, .05), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })); net4.position.set(0, .4, 0); sc.add(net4);
  } else if (type === 'indoor') {
    BX(14, .15, 8, 0xcc8833, 0, -.08, 0, sc);
    for (var ii = -3; ii <= 3; ii += 1.5) { LN(0, ii, 14, .05, sc, 0xddaa55); }
    LN(0, 0, 14, .06, sc); LN(0, 4, 14, .06, sc); LN(0, -4, 14, .06, sc);
  }
}

/* ── Register all 3D canvases ── */
lazy3d('hero-c1', function(sc) { buildCourt(sc, 'football'); }, { h: 380, camY: 10, camZ: 16 });
lazy3d('hero-c2', function(sc) { buildCourt(sc, 'tennis'); },   { h: 380, camY: 10, camZ: 14 });
lazy3d('hero-c3', function(sc) { buildCourt(sc, 'track'); },    { h: 380, camY: 14, camZ: 14 });
lazy3d('hero-c4', function(sc) { buildCourt(sc, 'padel'); },    { h: 380, camY: 10, camZ: 14 });

lazy3d('a-canvas', function(sc) { buildCourt(sc, 'basketball'); }, { h: 420, camY: 13, camZ: 17 });

[['s1','football'],['s2','tennis'],['s3','basketball'],['s4','badminton'],
 ['s5','track'],['s6','padel'],['s7','pickleball'],['s8','indoor']
].forEach(function(pair) {
  var id = pair[0], type = pair[1];
  lazy3d(id, function(sc) { buildCourt(sc, type); }, { h: 160, camY: 9, camZ: 13 });
});

lazy3d('w-canvas', function(sc) {
  var out = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshStandardMaterial({ color: 0xcc4400 })); out.rotation.x = -Math.PI / 2; sc.add(out);
  var inn = new THREE.Mesh(new THREE.CircleGeometry(6, 64), new THREE.MeshStandardMaterial({ color: 0x2d8a3a })); inn.rotation.x = -Math.PI / 2; inn.position.y = .03; sc.add(inn);
  for (var r = 6.1; r <= 9.2; r += .5) { var lr = new THREE.Mesh(new THREE.TorusGeometry(r, .04, 6, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: .5, transparent: true })); lr.rotation.x = Math.PI / 2; lr.position.y = .04; sc.add(lr); }
}, { h: 380, camY: 16, camZ: 16 });

renderProjects('all');
