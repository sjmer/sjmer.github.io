/* ============================================================
   星场背景
   · 缓慢向上漂移的星星 + 闪烁
   · 偶尔划过一颗流星
   · 跟随系统「减少动态效果」设置自动降级为静态星空
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("starfield");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stars = [];
  var meteors = [];
  var w = 0;
  var h = 0;
  var last = 0;
  var nextMeteor = 4000;

  function makeStars() {
    // 星星数量随屏幕面积变化，并限制在合理区间内
    var count = Math.round(Math.min(Math.max((w * h) / 8500, 80), 320));
    stars = [];
    for (var i = 0; i < count; i++) {
      var tint = Math.random();
      var color =
        tint < 0.14 ? "160,190,255" :
        tint < 0.24 ? "205,170,255" :
        tint < 0.31 ? "255,225,190" : "255,255,255";
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.15 + 0.28,
        base: Math.random() * 0.5 + 0.28,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.15,
        drift: Math.random() * 0.022 + 0.006,
        color: color
      });
    }
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
    draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!reduce) {
        s.y -= s.drift;
        if (s.y < -2) {
          s.y = h + 2;
          s.x = Math.random() * w;
        }
      }
      var twinkle = reduce ? s.base : s.base + Math.sin(t * 0.001 * s.speed + s.phase) * 0.3;
      var alpha = Math.max(0.06, Math.min(1, twinkle));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + s.color + "," + alpha.toFixed(3) + ")";
      ctx.fill();

      // 稍大的星星带一圈光晕
      if (s.r > 1.15) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + s.color + "," + (alpha * 0.07).toFixed(3) + ")";
        ctx.fill();
      }
    }

    for (var m = meteors.length - 1; m >= 0; m--) {
      var o = meteors[m];
      o.x += o.vx;
      o.y += o.vy;
      o.life -= 1;
      var a = Math.max(0, o.life / o.max) * 0.85;

      var grad = ctx.createLinearGradient(o.x, o.y, o.x - o.vx * 16, o.y - o.vy * 16);
      grad.addColorStop(0, "rgba(255,255,255," + a.toFixed(3) + ")");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = o.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(o.x - o.vx * 16, o.y - o.vy * 16);
      ctx.stroke();

      if (o.life <= 0 || o.x > w + 200 || o.y > h + 200) meteors.splice(m, 1);
    }
  }

  function spawnMeteor() {
    if (meteors.length > 1) return;
    var speed = Math.random() * 5 + 5;
    var angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
    var max = Math.round(Math.random() * 46 + 52);
    meteors.push({
      x: Math.random() * w * 0.55 + w * 0.1,
      y: -40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: max,
      max: max,
      width: Math.random() * 0.9 + 0.9
    });
  }

  function loop(t) {
    var dt = last ? Math.min(t - last, 64) : 16;
    last = t;
    draw(t);

    if (!reduce) {
      nextMeteor -= dt;
      if (nextMeteor <= 0) {
        spawnMeteor();
        nextMeteor = 7000 + Math.random() * 9000;
      }
    }
    requestAnimationFrame(loop);
  }

  // 光标光晕（仅指针设备）
  var spotlight = document.querySelector(".spotlight");
  if (spotlight && !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var pending = false;
    var mx = 0;
    var my = 0;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        spotlight.style.setProperty("--mx", mx + "px");
        spotlight.style.setProperty("--my", my + "px");
        spotlight.classList.add("is-on");
      });
    }, { passive: true });
    document.addEventListener("pointerleave", function () {
      spotlight.classList.remove("is-on");
    });
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 160);
  });

  // 标签页不可见时停掉动画，省电
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      last = 0;
    } else if (!reduce) {
      nextMeteor = 3000;
    }
  });

  resize();
  if (reduce) {
    draw(0);
  } else {
    requestAnimationFrame(loop);
  }
})();
