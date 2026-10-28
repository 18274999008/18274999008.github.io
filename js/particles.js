/* 粒子层：暖白光点缓慢上浮 + 呼吸闪烁 + 轻微鼠标视差 */
(function () {
  var canvas = document.getElementById('fx');
  if (!canvas) return;
  var noAnim = new URLSearchParams(location.search).has('noanim');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawFrame(t) {
    ctx.clearRect(0, 0, W, H);
    var ox = (mx - 0.5) * 26, oy = (my - 0.5) * 18;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.y < -8) { d.y = H + 8; d.x = Math.random() * W; }
      if (d.x < -8) d.x = W + 8;
      if (d.x > W + 8) d.x = -8;
      var alpha = d.a * (0.55 + 0.45 * Math.sin(t * d.tw + d.ph));
      var px = d.x + ox * d.depth, py = d.y + oy * d.depth;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(232,232,230,' + alpha.toFixed(3) + ')';
      ctx.arc(px, py, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (noAnim || reduced) {
    resize(); seed(); drawFrame(0);   // 静态画一帧（截图/减弱动效模式）
    window.addEventListener('resize', function () { resize(); seed(); drawFrame(0); });
    return;
  }

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var N = 110;
  var dots = [];
  var mx = 0.5, my = 0.5; // 鼠标归一化位置

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function seed() {
    dots = [];
    for (var i = 0; i < N; i++) {
      var big = Math.random() < 0.18; // 少数稍大的亮粒
      dots.push({
        x: W * (0.06 + Math.random() * 0.88),
        y: H * (0.08 + Math.random() * 0.84),
        r: big ? 1.8 + Math.random() * 1.6 : 0.6 + Math.random() * 1.1,
        vy: -(0.08 + Math.random() * 0.26),          // 缓慢上浮
        vx: (Math.random() - 0.5) * 0.1,             // 轻微横漂
        a: 0.2 + Math.random() * 0.45,               // 基础透明度
        tw: 0.4 + Math.random() * 1.2,               // 闪烁频率
        ph: Math.random() * Math.PI * 2,             // 闪烁相位
        depth: big ? 1.4 : 0.6 + Math.random() * 0.6 // 视差深度
      });
    }
  }
  window.addEventListener('resize', function () { resize(); seed(); });
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  }, { passive: true });

  resize(); seed();

  var t = 0;
  (function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    var ox = (mx - 0.5) * 26, oy = (my - 0.5) * 18; // 视差偏移
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.y < -8) { d.y = H + 8; d.x = Math.random() * W; }
      if (d.x < -8) d.x = W + 8;
      if (d.x > W + 8) d.x = -8;
      var alpha = d.a * (0.55 + 0.45 * Math.sin(t * d.tw + d.ph));
      var px = d.x + ox * d.depth, py = d.y + oy * d.depth;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(232,232,230,' + alpha.toFixed(3) + ')';
      ctx.arc(px, py, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  })();
})();
