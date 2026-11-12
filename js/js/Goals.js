(() => {
  const list = document.getElementById("grList");
  if (!list) return;
  const items = [...list.querySelectorAll(".gr-item")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // glowing light that travels down the line
  const spark = document.createElement("div");
  spark.className = "gr-spark";
  spark.setAttribute("aria-hidden", "true");
  list.prepend(spark);

  const st = items.map(() => ({ f: 0, py: 0 }));
  let sy = null, raf = 0;

  function frame() {
    raf = 0;
    const line = innerHeight * 0.62;            // a step turns on when it reaches this height
    const lr = list.getBoundingClientRect();
    let moving = false, last = -1;

    items.forEach((el, i) => {
      const r = el.getBoundingClientRect(), s = st[i];
      const on = reduce || r.top < line;
      el.classList.toggle("is-on", on);
      if (on) last = i;

      // targets, then ease toward them every frame (this is what makes it feel smooth)
      const tf = reduce ? 1 : clamp((line - r.top) / r.height, 0, 1);
      const tp = reduce ? 0 : clamp((r.top - line) * 0.04, -14, 14);
      s.f += (tf - s.f) * 0.14;
      s.py += (tp - s.py) * 0.14;
      if (Math.abs(tf - s.f) > 0.002 || Math.abs(tp - s.py) > 0.05) moving = true;
      else { s.f = tf; s.py = tp; }
      el.style.setProperty("--f", s.f.toFixed(3));
      el.style.setProperty("--py", s.py.toFixed(1) + "px");
    });
    items.forEach((el, i) => el.classList.toggle("is-current", !reduce && i === last));

    if (!reduce) {
      const y0 = items[0].offsetTop + 13;
      const y1 = items[items.length - 1].offsetTop + 13;
      const ty = clamp(line - lr.top, y0, y1);
      if (sy === null) sy = ty;
      sy += (ty - sy) * 0.14;
      if (Math.abs(ty - sy) > 0.3) moving = true; else sy = ty;
      spark.style.transform = "translateY(" + (sy - 5).toFixed(1) + "px)";
      spark.style.opacity = last >= 0 && lr.bottom > 0 && lr.top < innerHeight ? 1 : 0;
    }
    if (moving) raf = requestAnimationFrame(frame);
  }

  const request = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  request();
})();