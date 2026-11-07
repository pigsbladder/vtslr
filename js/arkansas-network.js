/* <ar-network>: animated dot map of Arkansas with signals travelling between Benton and client towns.
   Attributes: accent, ink, density, labels="off", pad, align="left|center|right", motion="off". */
(function () {
  if (customElements.get('ar-network')) return;

  // Arkansas boundary from US Census 2010 cartographic boundary file (500k), simplified (Douglas-Peucker, 0.003 deg) to 462 points. [lon, lat].
  const STATE_OUTLINE = [
    [-94.559,36.499],[-90.152,36.498],[-90.159,36.494],[-90.156,36.49],[-90.159,36.48],[-90.142,36.472],
    [-90.153,36.471],[-90.156,36.464],[-90.142,36.463],[-90.137,36.455],[-90.134,36.437],[-90.144,36.426],
    [-90.134,36.423],[-90.139,36.414],[-90.131,36.415],[-90.109,36.404],[-90.08,36.401],[-90.065,36.382],
    [-90.066,36.359],[-90.078,36.349],[-90.074,36.343],[-90.082,36.322],[-90.069,36.313],[-90.064,36.303],
    [-90.078,36.288],[-90.076,36.281],[-90.084,36.272],[-90.115,36.266],[-90.118,36.253],[-90.131,36.242],
    [-90.125,36.236],[-90.126,36.229],[-90.142,36.228],[-90.156,36.214],[-90.161,36.216],[-90.188,36.205],
    [-90.211,36.183],[-90.22,36.185],[-90.235,36.159],[-90.231,36.147],[-90.236,36.139],[-90.266,36.121],
    [-90.293,36.114],[-90.3,36.098],[-90.319,36.09],[-90.321,36.071],[-90.333,36.068],[-90.337,36.048],
    [-90.348,36.042],[-90.352,36.025],[-90.378,35.996],[-89.733,36.001],[-89.719,35.986],[-89.72,35.971],
    [-89.715,35.963],[-89.652,35.921],[-89.645,35.904],[-89.647,35.895],[-89.655,35.887],[-89.67,35.883],
    [-89.688,35.897],[-89.715,35.906],[-89.741,35.907],[-89.766,35.891],[-89.773,35.876],[-89.772,35.865],
    [-89.764,35.858],[-89.704,35.836],[-89.701,35.828],[-89.706,35.818],[-89.734,35.806],[-89.765,35.811],
    [-89.782,35.805],[-89.799,35.789],[-89.799,35.775],[-89.821,35.757],[-89.846,35.756],[-89.877,35.741],
    [-89.91,35.759],[-89.956,35.733],[-89.956,35.691],[-89.931,35.66],[-89.899,35.651],[-89.887,35.654],
    [-89.877,35.666],[-89.865,35.67],[-89.859,35.669],[-89.851,35.657],[-89.857,35.634],[-89.894,35.616],
    [-89.912,35.617],[-89.945,35.602],[-89.957,35.591],[-89.957,35.581],[-89.941,35.557],[-89.911,35.548],
    [-89.911,35.539],[-89.904,35.534],[-89.909,35.521],[-89.919,35.514],[-89.948,35.52],[-89.958,35.527],
    [-89.958,35.542],[-89.989,35.56],[-90.033,35.553],[-90.04,35.548],[-90.05,35.515],[-90.044,35.492],
    [-90.019,35.465],[-90.032,35.428],[-90.057,35.404],[-90.042,35.397],[-90.055,35.39],[-90.069,35.408],
    [-90.062,35.415],[-90.074,35.434],[-90.068,35.466],[-90.085,35.479],[-90.099,35.479],[-90.118,35.469],
    [-90.129,35.442],[-90.169,35.422],[-90.179,35.385],[-90.166,35.375],[-90.136,35.377],[-90.146,35.399],
    [-90.142,35.409],[-90.13,35.414],[-90.113,35.41],[-90.097,35.395],[-90.075,35.384],[-90.088,35.363],
    [-90.11,35.343],[-90.104,35.332],[-90.109,35.305],[-90.14,35.299],[-90.15,35.303],[-90.159,35.301],
    [-90.169,35.279],[-90.152,35.256],[-90.14,35.252],[-90.105,35.254],[-90.079,35.228],[-90.074,35.217],
    [-90.077,35.209],[-90.089,35.212],[-90.096,35.195],[-90.116,35.198],[-90.117,35.188],[-90.093,35.157],
    [-90.067,35.152],[-90.065,35.138],[-90.083,35.122],[-90.101,35.117],[-90.143,35.135],[-90.165,35.125],
    [-90.177,35.112],[-90.195,35.062],[-90.196,35.037],[-90.209,35.027],[-90.256,35.034],[-90.265,35.04],
    [-90.296,35.04],[-90.31,35.01],[-90.309,34.996],[-90.296,34.976],[-90.25,34.951],[-90.244,34.938],
    [-90.245,34.921],[-90.25,34.907],[-90.313,34.872],[-90.303,34.856],[-90.307,34.846],[-90.323,34.846],
    [-90.34,34.86],[-90.415,34.832],[-90.429,34.841],[-90.429,34.867],[-90.438,34.885],[-90.46,34.892],
    [-90.48,34.883],[-90.485,34.875],[-90.484,34.861],[-90.457,34.823],[-90.475,34.793],[-90.453,34.753],
    [-90.452,34.74],[-90.47,34.727],[-90.489,34.724],[-90.502,34.724],[-90.518,34.733],[-90.521,34.753],
    [-90.501,34.771],[-90.515,34.802],[-90.523,34.802],[-90.537,34.799],[-90.544,34.791],[-90.548,34.782],
    [-90.543,34.764],[-90.544,34.749],[-90.564,34.739],[-90.568,34.725],[-90.539,34.699],[-90.471,34.699],
    [-90.463,34.688],[-90.466,34.674],[-90.508,34.637],[-90.532,34.627],[-90.548,34.632],[-90.554,34.641],
    [-90.553,34.66],[-90.538,34.673],[-90.54,34.685],[-90.55,34.695],[-90.556,34.698],[-90.567,34.693],
    [-90.588,34.671],[-90.583,34.643],[-90.587,34.616],[-90.57,34.587],[-90.549,34.568],[-90.541,34.551],
    [-90.546,34.538],[-90.578,34.516],[-90.589,34.491],[-90.585,34.461],[-90.567,34.44],[-90.568,34.425],
    [-90.581,34.411],[-90.614,34.391],[-90.659,34.376],[-90.655,34.372],[-90.667,34.356],[-90.657,34.327],
    [-90.661,34.315],[-90.678,34.313],[-90.693,34.323],[-90.692,34.339],[-90.682,34.353],[-90.683,34.369],
    [-90.712,34.364],[-90.75,34.368],[-90.762,34.365],[-90.767,34.36],[-90.768,34.347],[-90.745,34.325],
    [-90.741,34.307],[-90.753,34.289],[-90.765,34.281],[-90.803,34.282],[-90.831,34.271],[-90.84,34.223],
    [-90.848,34.207],[-90.895,34.224],[-90.907,34.244],[-90.923,34.247],[-90.936,34.237],[-90.933,34.215],
    [-90.916,34.197],[-90.888,34.182],[-90.856,34.187],[-90.828,34.185],[-90.817,34.183],[-90.809,34.176],
    [-90.811,34.156],[-90.836,34.138],[-90.865,34.141],[-90.894,34.161],[-90.91,34.166],[-90.954,34.138],
    [-90.959,34.13],[-90.949,34.111],[-90.921,34.094],[-90.888,34.098],[-90.872,34.087],[-90.872,34.076],
    [-90.888,34.055],[-90.889,34.03],[-90.899,34.024],[-90.943,34.018],[-90.988,34.019],[-90.98,34.0],
    [-90.962,33.98],[-90.964,33.968],[-90.971,33.962],[-90.988,33.961],[-91.0,33.966],[-91.019,34.003],
    [-91.043,33.987],[-91.075,33.984],[-91.089,33.973],[-91.084,33.956],[-91.036,33.944],[-91.01,33.929],
    [-91.026,33.908],[-91.071,33.867],[-91.073,33.857],[-91.068,33.84],[-91.047,33.815],[-91.0,33.8],
    [-90.988,33.785],[-91.0,33.769],[-91.023,33.763],[-91.054,33.779],[-91.107,33.771],[-91.132,33.783],
    [-91.145,33.767],[-91.141,33.76],[-91.147,33.732],[-91.132,33.714],[-91.118,33.705],[-91.101,33.705],
    [-91.068,33.716],[-91.06,33.715],[-91.03,33.688],[-91.035,33.673],[-91.079,33.658],[-91.094,33.658],
    [-91.13,33.675],[-91.161,33.707],[-91.205,33.701],[-91.221,33.693],[-91.228,33.683],[-91.228,33.671],
    [-91.219,33.662],[-91.171,33.648],[-91.139,33.626],[-91.13,33.606],[-91.134,33.594],[-91.152,33.583],
    [-91.178,33.583],[-91.198,33.572],[-91.224,33.567],[-91.231,33.561],[-91.23,33.547],[-91.219,33.532],
    [-91.187,33.511],[-91.183,33.502],[-91.209,33.469],[-91.232,33.457],[-91.235,33.439],[-91.207,33.434],
    [-91.177,33.444],[-91.169,33.453],[-91.177,33.486],[-91.167,33.498],[-91.125,33.473],[-91.118,33.449],
    [-91.132,33.43],[-91.176,33.417],[-91.199,33.418],[-91.209,33.409],[-91.208,33.402],[-91.191,33.39],
    [-91.154,33.379],[-91.124,33.388],[-91.107,33.399],[-91.095,33.417],[-91.097,33.438],[-91.086,33.452],
    [-91.068,33.455],[-91.058,33.445],[-91.058,33.429],[-91.075,33.406],[-91.142,33.349],[-91.142,33.3],
    [-91.126,33.28],[-91.128,33.269],[-91.118,33.262],[-91.106,33.242],[-91.099,33.238],[-91.079,33.283],
    [-91.052,33.285],[-91.044,33.275],[-91.05,33.251],[-91.071,33.227],[-91.092,33.221],[-91.084,33.181],
    [-91.09,33.14],[-91.104,33.132],[-91.132,33.129],[-91.15,33.131],[-91.162,33.142],[-91.184,33.142],
    [-91.202,33.125],[-91.2,33.107],[-91.181,33.098],[-91.172,33.088],[-91.15,33.082],[-91.121,33.059],
    [-91.129,33.034],[-91.162,33.02],[-91.166,33.004],[-93.073,33.018],[-94.043,33.019],[-94.043,33.552],
    [-94.062,33.55],[-94.072,33.554],[-94.072,33.56],[-94.056,33.561],[-94.056,33.567],[-94.083,33.575],
    [-94.12,33.567],[-94.123,33.553],[-94.129,33.551],[-94.135,33.571],[-94.145,33.565],[-94.151,33.568],
    [-94.142,33.581],[-94.157,33.576],[-94.162,33.589],[-94.184,33.595],[-94.197,33.582],[-94.217,33.581],
    [-94.211,33.574],[-94.194,33.574],[-94.19,33.562],[-94.196,33.555],[-94.206,33.567],[-94.226,33.553],
    [-94.25,33.557],[-94.251,33.565],[-94.237,33.581],[-94.237,33.587],[-94.243,33.59],[-94.258,33.583],
    [-94.276,33.558],[-94.291,33.559],[-94.29,33.568],[-94.281,33.575],[-94.284,33.582],[-94.289,33.582],
    [-94.301,33.573],[-94.31,33.552],[-94.319,33.549],[-94.331,33.553],[-94.335,33.564],[-94.344,33.568],
    [-94.352,33.562],[-94.347,33.551],[-94.356,33.543],[-94.382,33.544],[-94.399,33.557],[-94.397,33.562],
    [-94.379,33.571],[-94.383,33.583],[-94.403,33.568],[-94.412,33.569],[-94.43,33.591],[-94.452,33.591],
    [-94.472,33.603],[-94.453,33.617],[-94.453,33.623],[-94.46,33.624],[-94.463,33.631],[-94.448,33.634],
    [-94.449,33.643],[-94.459,33.645],[-94.466,33.636],[-94.486,33.638],[-94.431,35.394],[-94.618,36.499]
  ];

  // [name, latitude, longitude, show label]. The first entry is the hub.
  const CITIES = [
    ['Benton', 34.5645, -92.5868, 1], ['Little Rock', 34.7465, -92.2896, 1], ['Conway', 35.0887, -92.4421, 1], ['Hot Springs', 34.5037, -93.0552, 0],
    ['Fayetteville', 36.0626, -94.1574, 1], ['Bentonville', 36.3729, -94.2088, 0], ['Fort Smith', 35.3859, -94.3985, 1], ['Jonesboro', 35.8423, -90.7043, 1],
    ['Pine Bluff', 34.2284, -92.0032, 1], ['Texarkana', 33.4418, -94.0477, 1], ['El Dorado', 33.2076, -92.6663, 1], ['Russellville', 35.2784, -93.1338, 1],
    ['Searcy', 35.2468, -91.7337, 1], ['Harrison', 36.2298, -93.1077, 1], ['Mountain Home', 36.3354, -92.3852, 1], ['Arkadelphia', 34.1209, -93.0538, 1],
    ['Malvern', 34.3623, -92.8129, 0], ['West Memphis', 35.1465, -90.1845, 1], ['Magnolia', 33.267, -93.239, 0], ['Batesville', 35.7698, -91.6409, 1],
    ['Stuttgart', 34.5004, -91.5526, 0], ['Mena', 34.5862, -94.2397, 0], ['Paragould', 36.0584, -90.4973, 0], ['Monticello', 33.6290, -91.7910, 0]
  ];

  const LON0 = -94.75, LON1 = -89.55, LAT0 = 32.9, LAT1 = 36.6, K = Math.cos(34.7 * Math.PI / 180);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hex = h => { h = (h || '').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const inPolygon = (x, y, p) => {
    let inside = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i], [xj, yj] = p[j];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  };
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const ease = t => 1 - Math.pow(1 - t, 3);

  class ArNetwork extends HTMLElement {
    static get observedAttributes() { return ['accent', 'ink', 'density', 'labels', 'pad', 'align', 'motion']; }

    attributeChangedCallback() { if (this._c) this._resize(); }

    connectedCallback() {
      if (this._c) return;
      if (!this.style.display) this.style.display = 'block';
      if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(c);
      this._c = c;
      this._ctx = c.getContext('2d');
      this._t0 = performance.now();
      this._arcs = [];
      this._rip = [];
      this._mouse = null;
      this._next = 0.9;
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this);
      this._pm = e => {
        const r = this.getBoundingClientRect();
        if (!r.width) return;
        const s = this.offsetWidth / r.width;
        this._mouse = [(e.clientX - r.left) * s, (e.clientY - r.top) * s];
      };
      this._pl = () => { this._mouse = null; };
      window.addEventListener('pointermove', this._pm);
      this.addEventListener('pointerleave', this._pl);
      this._resize();
      const loop = t => { this._raf = requestAnimationFrame(loop); this._draw(t); };
      this._raf = requestAnimationFrame(loop);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      this._ro && this._ro.disconnect();
      window.removeEventListener('pointermove', this._pm);
      this._c && this._c.remove();
      this._c = null;
    }

    _resize() {
      const W = this.offsetWidth, H = this.offsetHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this._c.width = W * dpr;
      this._c.height = H * dpr;
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = W;
      this.H = H;
      this.accent = hex(this.getAttribute('accent') || '#E2412E');
      this.ink = hex(this.getAttribute('ink') || '#EDEDEB');
      const pad = parseFloat(this.getAttribute('pad') || '0.08');
      const uw = (LON1 - LON0) * K, uh = LAT1 - LAT0;
      const s = Math.min(W * (1 - 2 * pad) / uw, H * (1 - 2 * pad) / uh);
      const align = this.getAttribute('align') || 'center';
      const ox = align === 'right' ? W - W * pad - uw * s : align === 'left' ? W * pad : (W - uw * s) / 2;
      const oy = (H - uh * s) / 2;
      const project = (lon, lat) => [ox + (lon - LON0) * K * s, oy + (LAT1 - lat) * s];
      // Densify long straight borders so the smoothing below only softens corners by a pixel or two.
      const raw = STATE_OUTLINE.map(([lo, la]) => project(lo, la));
      const poly = [];
      raw.forEach((a, i) => {
        const b = raw[(i + 1) % raw.length];
        const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5));
        for (let k = 0; k < steps; k++) poly.push([a[0] + (b[0] - a[0]) * k / steps, a[1] + (b[1] - a[1]) * k / steps]);
      });
      this.poly = poly;
      // Smooth outline: quadratic curves through the segment midpoints, cached as a Path2D.
      const path = new Path2D();
      const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const start = mid(poly[poly.length - 1], poly[0]);
      path.moveTo(start[0], start[1]);
      poly.forEach((c, i) => {
        const m = mid(c, poly[(i + 1) % poly.length]);
        path.quadraticCurveTo(c[0], c[1], m[0], m[1]);
      });
      path.closePath();
      this.outlinePath = path;
      this.cities = CITIES.map(([n, la, lo, l]) => { const [x, y] = project(lo, la); return { n, x, y, l, ack: 0 }; });
      const hub = this.cities[0];
      this.hub = hub;
      const spacing = parseFloat(this.getAttribute('density') || '13');
      const dots = [];
      let maxd = 1;
      for (let y = oy; y < oy + uh * s; y += spacing) {
        for (let x = ox; x < ox + uw * s; x += spacing) {
          if (!inPolygon(x, y, this.poly)) continue;
          const d = Math.hypot(x - hub.x, y - hub.y);
          maxd = Math.max(maxd, d);
          dots.push({ x, y, d, lit: 0, ph: Math.random() * 6.28 });
        }
      }
      dots.forEach(p => { p.delay = 0.15 + (p.d / maxd) * 1.7 + Math.random() * 0.12; });
      this.dots = dots;
      this.scale = s;
    }

    _curve(a, b) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy);
      return { a, b, cx: mx + (dy / L) * L * 0.22 * (dx > 0 ? -1 : 1), cy: my - Math.abs(dx / L) * L * 0.22 - L * 0.08 };
    }

    _pt(c, t) {
      const u = 1 - t;
      return [u * u * c.a.x + 2 * u * t * c.cx + t * t * c.b.x, u * u * c.a.y + 2 * u * t * c.cy + t * t * c.b.y];
    }

    _draw(now) {
      if (!this.dots) return;
      const ctx = this._ctx, W = this.W, H = this.H, A = this.accent, I = this.ink;
      const still = reducedMotion || this.getAttribute('motion') === 'off';
      const el = still ? 20 : (now - this._t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const m = this._mouse;

      // Dots
      ctx.fillStyle = rgba(I, 0.2);
      ctx.beginPath();
      const hot = [];
      for (const p of this.dots) {
        const ap = clamp((el - p.delay) / 0.35);
        if (ap <= 0) continue;
        if (!still && Math.random() < 0.0007) p.lit = 1;
        p.lit *= 0.965;
        let mm = 0;
        if (m) { const d = Math.hypot(p.x - m[0], p.y - m[1]); mm = d < 130 ? 1 - d / 130 : 0; }
        const wave = el - p.delay < 0.5 ? 1 - (el - p.delay) / 0.5 : 0;
        const glow = Math.max(p.lit, mm * 0.9, wave);
        if (glow > 0.05) hot.push([p, glow * ap]);
        else ctx.rect(p.x - 0.8, p.y - 0.8, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
      ctx.fill();
      for (const [p, g] of hot) {
        ctx.fillStyle = rgba(A, 0.25 + g * 0.75);
        const r = 0.8 + g * 1.1;
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }

      // State outline
      const oa = clamp((el - 1.2) / 1.2);
      if (oa > 0) {
        ctx.strokeStyle = rgba(I, 0.22 * oa);
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.stroke(this.outlinePath);
      }

      // Faint spokes from the hub
      const sa = clamp((el - 1.6) / 1.0);
      const hub = this.hub;
      if (sa > 0) {
        ctx.strokeStyle = rgba(I, 0.06 * sa);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const c of this.cities) {
          if (c === hub) continue;
          const cv = this._curve(hub, c);
          ctx.moveTo(hub.x, hub.y);
          ctx.quadraticCurveTo(cv.cx, cv.cy, c.x, c.y);
        }
        ctx.stroke();
      }

      // Travelling signals
      if (!still && el > this._next) {
        const others = this.cities.slice(1);
        const c = others[Math.floor(Math.random() * others.length)];
        const out = Math.random() < 0.6;
        this._arcs.push({ c: out ? this._curve(hub, c) : this._curve(c, hub), t0: el, dur: 1.1 + Math.random() * 0.8, to: out ? c : hub });
        this._next = el + 0.28 + Math.random() * 0.45;
      }
      this._arcs = this._arcs.filter(a => {
        const p = (el - a.t0) / a.dur;
        if (p >= 1) { a.to.ack = 1; this._rip.push({ x: a.to.x, y: a.to.y, t0: el }); return false; }
        const e = ease(p), tail = Math.max(0, e - 0.28), N = 18;
        for (let i = 0; i < N; i++) {
          const t1 = tail + (e - tail) * i / N, t2 = tail + (e - tail) * (i + 1) / N;
          const [x1, y1] = this._pt(a.c, t1), [x2, y2] = this._pt(a.c, t2);
          ctx.strokeStyle = rgba(A, (i / N) * 0.9);
          ctx.lineWidth = 0.6 + (i / N) * 1.6;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
        const [hx, hy] = this._pt(a.c, e);
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 10);
        g.addColorStop(0, rgba(A, 0.9));
        g.addColorStop(1, rgba(A, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(hx, hy, 10, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(hx, hy, 1.6, 0, 6.28); ctx.fill();
        return true;
      });
      this._rip = this._rip.filter(r => {
        const p = (el - r.t0) / 1.1;
        if (p >= 1) return false;
        ctx.strokeStyle = rgba(A, 0.7 * (1 - p));
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(r.x, r.y, 4 + ease(p) * 22, 0, 6.28); ctx.stroke();
        return true;
      });

      // Cities
      const ca = clamp((el - 0.9) / 0.8);
      const labels = this.getAttribute('labels') !== 'off';
      const fs = Math.max(9, Math.min(12, this.scale / 26));
      ctx.font = `500 ${fs}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'middle';
      for (const c of this.cities) {
        if (c === hub) continue;
        c.ack *= 0.97;
        ctx.fillStyle = rgba(c.ack > 0.1 ? A : I, (0.55 + c.ack * 0.45) * ca);
        ctx.beginPath(); ctx.arc(c.x, c.y, 2.4 + c.ack * 1.5, 0, 6.28); ctx.fill();
        ctx.strokeStyle = rgba(I, 0.25 * ca);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(c.x, c.y, 5.5, 0, 6.28); ctx.stroke();
        if (labels && c.l) {
          ctx.fillStyle = rgba(I, (0.42 + c.ack * 0.5) * ca);
          ctx.textAlign = 'left';
          ctx.fillText(c.n.toUpperCase(), c.x + 10, c.y);
        }
      }

      // Hub
      const ha = clamp(el / 0.6);
      for (let k = 0; k < 3; k++) {
        const p = (el * 0.55 + k / 3) % 1;
        ctx.strokeStyle = rgba(A, 0.55 * (1 - p) * ha);
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(hub.x, hub.y, 6 + p * 46, 0, 6.28); ctx.stroke();
      }
      const g = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 22);
      g.addColorStop(0, rgba(A, 0.55 * ha));
      g.addColorStop(1, rgba(A, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 22, 0, 6.28); ctx.fill();
      ctx.fillStyle = rgba(A, ha);
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 5, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 2, 0, 6.28); ctx.fill();
      if (labels) {
        ctx.fillStyle = rgba(A, ha);
        ctx.textAlign = 'right';
        ctx.font = `600 ${fs + 1}px "Geist Mono", ui-monospace, monospace`;
        ctx.fillText('BENTON · HQ', hub.x - 14, hub.y + 16);
      }
    }
  }

  customElements.define('ar-network', ArNetwork);
})();
