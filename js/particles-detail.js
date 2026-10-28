/* ============================================================
   详情页背景粒子：细小的光尘缓慢下沉 + 呼吸闪烁
   （和首页那种向上飘的粒子区分开）
   ============================================================ */
(function () {
  var noAnim = new URLSearchParams(location.search).has('noanim');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  canvas.className = 'detail-fx';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var dots = [];
  var N = 56;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    dots = [];
    for (var i = 0; i < N; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.3,
        vy: 0.05 + Math.random() * 0.22,        // 缓慢下沉
        vx: (Math.random() - 0.5) * 0.10,
        a: 0.10 + Math.random() * 0.30,
        ph: Math.random() * Math.PI * 2,         // 呼吸相位
        sp: 0.006 + Math.random() * 0.012
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.ph += d.sp;
      var alpha = d.a * (0.45 + 0.55 * Math.sin(d.ph));
      if (alpha <= 0.01) continue;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,177,255,' + alpha.toFixed(3) + ')';
      ctx.fill();
    }
  }

  function tick() {
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.y += d.vy;
      d.x += d.vx;
      if (d.y > H + 6) { d.y = -6; d.x = Math.random() * W; }
      if (d.x < -6) d.x = W + 6;
      if (d.x > W + 6) d.x = -6;
    }
    draw();
    requestAnimationFrame(tick);
  }

  resize();
  seed();

  if (noAnim || reduced) {
    draw();                                   // 静态一帧，截图/省电模式也能看到
  } else {
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () {
    resize();
    seed();
  });
})();
