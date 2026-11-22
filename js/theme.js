(() => {
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeText");
  const themeColor = document.getElementById("themeColor");
  if (!toggle) return;

  function paintTheme(isLight) {
    document.body.classList.toggle("light", isLight);
    if (icon) icon.textContent = isLight ? "☾" : "☀";
    if (label) label.textContent = isLight ? "Dark mode" : "Light mode";
    toggle.setAttribute(
      "aria-label",
      isLight ? "Turn the light off" : "Turn the light on",
    );
    if (themeColor)
      themeColor.setAttribute("content", isLight ? "#f4f4f4" : "#090909");
    toggle.setAttribute("aria-pressed", String(isLight));
  }

  let themeTimer = 0;

  function applyTheme(isLight, x, y) {
    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch (error) {
      // The theme still works for this visit.
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      paintTheme(isLight);
      return Promise.resolve();
    }

    if (typeof document.startViewTransition !== "function") {
      document.body.classList.add("theme-transitioning");
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(
        () => document.body.classList.remove("theme-transitioning"),
        320,
      );
      paintTheme(isLight);
      return new Promise((resolve) => window.setTimeout(resolve, 420));
    }

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(() => paintTheme(isLight));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
    return transition.finished;
  }

  // Load the saved theme
  let saved = "dark";
  try {
    saved = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {}

  paintTheme(saved === "light");

  let flipTimer = 0;
  let isChanging = false;

  toggle.addEventListener(
    "click",
    (event) => {
      event.stopImmediatePropagation();
      if (isChanging) return;
      isChanging = true;

      let { clientX: x, clientY: y } = event;
      if (x === 0 && y === 0) {
        const bounds = toggle.getBoundingClientRect();
        x = bounds.left + bounds.width / 2;
        y = bounds.top + bounds.height / 2;
      }

      const isLight = !document.body.classList.contains("light");
      toggle.classList.remove("is-flipping");
      void toggle.offsetWidth;
      toggle.classList.add("is-flipping");
      window.clearTimeout(flipTimer);
      flipTimer = window.setTimeout(
        () => toggle.classList.remove("is-flipping"),
        420,
      );
      try {
        applyTheme(isLight, x, y).then(
          () => {
            isChanging = false;
          },
          () => {
            isChanging = false;
          },
        );
      } catch (error) {
        isChanging = false;
        throw error;
      }
    },
    true,
  );
})();
