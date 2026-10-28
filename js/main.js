/* 滚动淡入 */
const noAnim = new URLSearchParams(location.search).has('noanim');
if (noAnim) document.documentElement.classList.add('shot');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

if (noAnim) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  document.querySelectorAll('.stat__num').forEach((el) => { el.textContent = el.dataset.count; });
} else {
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* 数字滚动 */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  if (noAnim) { el.textContent = target; return; }
  const dur = 900;
  const t0 = performance.now();
  function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      countUp(e.target);
      statIO.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat__num').forEach((el) => statIO.observe(el));


/* 液态玻璃卡：高光跟随鼠标（--mx / --my 控制卡片上的光源位置） */
document.querySelectorAll('.pcard, .dcard').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '0%');
  });
});


/* ============================================================
   作品卡层级：鼠标停在哪张，那张最大最前，
   向左/向右按「离它第几层」依次退后（位置不动，只改层级/大小/明暗）
   ============================================================ */
(function () {
  var deck = document.querySelector('.deck');
  if (!deck) return;
  var cards = [].slice.call(deck.querySelectorAll('.dcard'));
  if (!cards.length) return;

  function activate(idx) {
    cards.forEach(function (c, j) {
      c.style.setProperty('--rank', Math.abs(j - idx));
    });
    deck.classList.add('is-layering');
  }

  cards.forEach(function (card, i) {
    card.addEventListener('mouseenter', function () { activate(i); });
    card.addEventListener('pointerenter', function () { activate(i); });
  });

  deck.addEventListener('mouseleave', function () {
    deck.classList.remove('is-layering');
  });
})();
