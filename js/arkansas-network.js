/* <ar-network>: animated dot map of Arkansas with signals travelling between Benton and client towns.
   Attributes: accent, ink, density, labels="off", pad, align="left|center|right", motion="off". */
(function () {
  if (customElements.get('ar-network')) return;

  const STATE_OUTLINE = [[-94.618, 36.499], [-90.152, 36.498], [-90.064, 36.383], [-90.137, 36.213], [-90.374, 36.002], [-89.733, 36.0], [-89.70, 35.83], [-89.95, 35.70], [-89.93, 35.51], [-90.10, 35.40], [-90.06, 35.15], [-90.18, 35.10], [-90.30, 34.85], [-90.47, 34.70], [-90.58, 34.50], [-90.87, 34.10], [-91.08, 33.95], [-91.20, 33.70], [-91.06, 33.42], [-91.17, 33.15], [-91.09, 33.0], [-94.043, 33.019], [-94.043, 33.55], [-94.48, 33.64], [-94.43, 35.40]];

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
      this.poly = STATE_OUTLINE.map(([lo, la]) => project(lo, la));
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
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.poly.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.closePath();
        ctx.stroke();
      }

      // Faint spokes from the hub
      const sa = clamp((el - 1.6) / 1.0);
      const hub = this.hub;
      if (sa > 0) {
        ctx.strokeStyle = rgba(I, 0.06 * sa);
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
