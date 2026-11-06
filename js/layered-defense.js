/* <layered-defense>: animated diagram of concentric security layers around "your business". */
(function () {
  if (customElements.get('layered-defense')) return;

  const LAYERS = ['USERS', 'DEVICES', 'NETWORKS', 'REMOTE ACCESS', 'BACKUPS'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hex = h => { h = (h || '').replace('#', ''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const ease = t => 1 - Math.pow(1 - t, 3);

  // Returns the rounded rectangle's perimeter length and a point-at-distance lookup.
  function perimeter(x, y, w, h, r) {
    const arc = Math.PI * r / 2;
    const sides = [w - 2 * r, arc, h - 2 * r, arc, w - 2 * r, arc, h - 2 * r, arc];
    const L = sides.reduce((a, b) => a + b, 0);
    return {
      L,
      at(d) {
        d = ((d % L) + L) % L;
        let i = 0;
        while (d > sides[i]) { d -= sides[i]; i++; }
        const q = Math.PI / 2;
        switch (i) {
          case 0: return [x + r + d, y];
          case 1: { const a = -q + d / r; return [x + w - r + Math.cos(a) * r, y + r + Math.sin(a) * r]; }
          case 2: return [x + w, y + r + d];
          case 3: { const a = d / r; return [x + w - r + Math.cos(a) * r, y + h - r + Math.sin(a) * r]; }
          case 4: return [x + w - r - d, y + h];
          case 5: { const a = q + d / r; return [x + r + Math.cos(a) * r, y + h - r + Math.sin(a) * r]; }
          case 6: return [x, y + h - r - d];
          default: { const a = Math.PI + d / r; return [x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]; }
        }
      }
    };
  }

  class LayeredDefense extends HTMLElement {
    connectedCallback() {
      if (this._c) return;
      if (!this.style.display) this.style.display = 'block';
      if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(c);
      this._c = c;
      this._ctx = c.getContext('2d');
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this);
      this._pm = e => { const r = this.getBoundingClientRect(); this._m = [e.clientX - r.left, e.clientY - r.top]; };
      this._pl = () => { this._m = null; };
      this.addEventListener('pointermove', this._pm);
      this.addEventListener('pointerleave', this._pl);
      this._resize();
      this._t0 = performance.now();
      this._hl = LAYERS.map(() => 0);
      const loop = t => { this._raf = requestAnimationFrame(loop); this._draw(t); };
      this._raf = requestAnimationFrame(loop);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      this._ro && this._ro.disconnect();
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
      this.A = hex(this.getAttribute('accent') || '#E2412E');
      this.I = hex(this.getAttribute('ink') || '#EDEDEB');
      const fs = Math.max(10, Math.min(12, W / 48));
      const step = Math.min(W, H) * 0.085;
      const pad = Math.max(14, fs + 4);
      this.rects = LAYERS.map((n, i) => {
        const x = pad + i * step, y = pad + i * step;
        const w = W - 2 * pad - 2 * i * step, h = H - 2 * pad - 2 * i * step;
        const r = Math.max(10, 22 - i * 2);
        return { n, x, y, w, h, r, p: perimeter(x, y, w, h, r), spd: (i % 2 ? -1 : 1) * (55 + i * 14), off: Math.random() * 1000 };
      });
      const i = LAYERS.length;
      this.core = { x: pad + i * step, y: pad + i * step, w: W - 2 * pad - 2 * i * step, h: H - 2 * pad - 2 * i * step };
    }

    _draw(now) {
      if (!this.W) return;
      const ctx = this._ctx, { W, H, A, I } = this;
      const el = reducedMotion ? 20 : (now - this._t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const fs = Math.max(10, Math.min(12, W / 48));
      ctx.font = `500 ${fs}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'middle';

      // The hovered layer is the innermost rect containing the pointer.
      let hov = -1;
      if (this._m) {
        const [mx, my] = this._m;
        this.rects.forEach((r, i) => { if (mx > r.x && mx < r.x + r.w && my > r.y && my < r.y + r.h) hov = i; });
      }

      this.rects.forEach((r, i) => {
        const a = ease(Math.min(1, Math.max(0, (el - i * 0.14) / 0.9)));
        if (a <= 0) return;
        this._hl[i] += ((hov === i ? 1 : 0) - this._hl[i]) * 0.12;
        const h = this._hl[i];
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(I, (0.14 + h * 0.4) * a);
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(r.x, r.y, r.w, r.h, r.r) : ctx.rect(r.x, r.y, r.w, r.h);
        ctx.stroke();
        if (h > 0.02) { ctx.fillStyle = rgba(A, 0.04 * h); ctx.fill(); }

        // Traveling light along the layer's edge.
        const head = r.off + el * r.spd, len = Math.min(140, r.p.L * 0.12), N = 24;
        for (let k = 0; k < N; k++) {
          const d1 = head - Math.sign(r.spd) * len * (1 - k / N);
          const d2 = head - Math.sign(r.spd) * len * (1 - (k + 1) / N);
          const [x1, y1] = r.p.at(d1), [x2, y2] = r.p.at(d2);
          ctx.strokeStyle = rgba(A, (k / N) * 0.95 * a);
          ctx.lineWidth = 1 + (k / N) * 1.2;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
        const [hx, hy] = r.p.at(head);
        ctx.fillStyle = rgba(A, a);
        ctx.beginPath(); ctx.arc(hx, hy, 2, 0, Math.PI * 2); ctx.fill();

        // Label, knocked out of the border line.
        const tx = r.x + r.r + 10, ty = r.y, tw = ctx.measureText(r.n).width;
        ctx.fillStyle = this.getAttribute('bg') || '#0A0A0B';
        ctx.fillRect(tx - 8, ty - fs, tw + 16, fs * 2);
        ctx.fillStyle = rgba(h > 0.1 ? A : I, (0.55 + h * 0.45) * a);
        ctx.textAlign = 'left';
        ctx.fillText(r.n, tx, ty);
      });

      // Core
      const c = this.core, ca = ease(Math.min(1, Math.max(0, (el - 0.9) / 0.8)));
      if (ca > 0 && c.w > 0) {
        ctx.fillStyle = rgba(A, 0.1 * ca);
        ctx.strokeStyle = rgba(A, 0.6 * ca);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(c.x, c.y, c.w, c.h, 10) : ctx.rect(c.x, c.y, c.w, c.h);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = rgba(I, ca);
        ctx.textAlign = 'center';
        ctx.font = `600 ${fs + 1}px "Geist Mono", ui-monospace, monospace`;
        ctx.fillText('YOUR BUSINESS', c.x + c.w / 2, c.y + c.h / 2);
      }
    }
  }

  customElements.define('layered-defense', LayeredDefense);
})();
