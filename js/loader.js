(() => {
  const loader = document.getElementById("loader");
  const eyebrow = document.getElementById("introEyebrow");
  const title = document.getElementById("introTitle");
  const fill = document.getElementById("introFill");
  const percent = document.getElementById("introPercent");
  const canvas = document.getElementById("introStars");

  if (!loader || !eyebrow || !title || !fill || !percent || !canvas) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cursor = document.createElement("span");
  cursor.className = "intro-cursor";
  const context = canvas.getContext("2d");
  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() < 0.12 ? 1.3 : 0.45 + Math.random() * 0.6,
    alpha: 0.25 + Math.random() * 0.55,
    speed: 0.4 + Math.random() * 1.1,
    phase: Math.random() * Math.PI * 2,
  }));
  let animationFrame = 0;
  let width = 0;
  let height = 0;

  function resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function drawStars(time) {
    context.clearRect(0, 0, width, height);

    for (const star of stars) {
      const twinkle = reduceMotion
        ? 1
        : 0.55 + 0.45 * Math.sin((time / 1000) * star.speed + star.phase);
      context.globalAlpha = star.alpha * twinkle;
      context.fillStyle = "#fff";
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
  }

  function animateStars(time) {
    drawStars(time);
    animationFrame =
      reduceMotion || loader.classList.contains("gone")
        ? 0
        : window.requestAnimationFrame(animateStars);
  }

  window.addEventListener(
    "resize",
    () => {
      resizeCanvas();
      drawStars(performance.now());
    },
    { passive: true },
  );
  resizeCanvas();

  function wait(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  async function typeText(element, text, delay) {
    element.appendChild(cursor);
    cursor.classList.add("intro-typing");

    for (let index = 0; index < text.length; index += 1) {
      const character = document.createElement("span");
      character.className = "intro-char";
      character.textContent = text[index];
      character.style.setProperty(
        "--intro-x",
        `${(Math.random() - 0.5) * 110}px`,
      );
      character.style.setProperty(
        "--intro-y",
        `${(Math.random() - 0.5) * 80}px`,
      );
      character.style.setProperty(
        "--intro-rotation",
        `${(Math.random() - 0.5) * 60}deg`,
      );
      character.style.setProperty("--intro-index", index);
      element.insertBefore(character, cursor);
      await wait(delay === 0 ? 0 : delay + Math.random() * 35);
    }

    cursor.classList.remove("intro-typing");
  }

  function animateProgress(duration) {
    return new Promise((resolve) => {
      const start = performance.now();

      function ease(value) {
        return value < 0.5
          ? 4 * value * value * value
          : 1 - Math.pow(-2 * value + 2, 3) / 2;
      }

      function update(now) {
        const progress = Math.min(1, (now - start) / duration);
        const easedProgress = ease(progress);
        fill.style.transform = `scaleX(${easedProgress})`;
        percent.textContent = `${Math.round(easedProgress * 100)}%`;

        if (progress < 1) {
          window.requestAnimationFrame(update);
        } else {
          resolve();
        }
      }

      window.requestAnimationFrame(update);
    });
  }

  async function startIntro() {
    if (!animationFrame) {
      resizeCanvas();
      animationFrame = window.requestAnimationFrame(animateStars);
    }

    const progress = animateProgress(reduceMotion ? 800 : 3800);
    const typing = (async () => {
      await wait(350);
      await typeText(eyebrow, "Welcome to", reduceMotion ? 0 : 55);
      await wait(reduceMotion ? 0 : 260);
      await typeText(title, "my portfolio", reduceMotion ? 0 : 65);

      if (!reduceMotion) title.classList.add("intro-wave");
    })();

    await Promise.all([progress, typing]);
    document
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("visible"));
    document.body.classList.remove("site-loading");
    loader.classList.add("closing");
    await wait(reduceMotion ? 20 : 450);
    loader.classList.add("gone");
  }

  startIntro();
})();
