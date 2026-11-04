(() => {
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeText");
  const themeColor = document.getElementById("themeColor");
  if (!toggle) return;

  function applyTheme(isLight) {
    document.body.classList.toggle("light", isLight);

    if (icon) icon.textContent = isLight ? "☾" : "☀";
    if (label) label.textContent = isLight ? "Dark mode" : "Light mode";
    if (themeColor) themeColor.setAttribute("content", isLight ? "#f4f4f4" : "#090909");

    toggle.setAttribute("aria-pressed", String(isLight));

    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch (error) {
      // The theme still works for this visit.
    }
  }

  // Load the saved theme
  let saved = "dark";
  try {
    saved = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {}

  document.body.classList.toggle("light", saved === "light");
  if (icon) icon.textContent = saved === "light" ? "☾" : "☀";
  if (label) label.textContent = saved === "light" ? "Dark mode" : "Light mode";
  if (themeColor) themeColor.setAttribute("content", saved === "light" ? "#f4f4f4" : "#090909");

  // Capture phase + stopImmediatePropagation: if java.js still has its own
  // theme handler, it will not run and toggle the theme a second time.
  toggle.addEventListener("click", (event) => {
    event.stopImmediatePropagation();

    const isLight = !document.body.classList.contains("light");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Older mobile browsers get a short fade instead of a hard color snap.
    if (!document.startViewTransition || reduceMotion) {
      if (!document.startViewTransition && !reduceMotion) {
        document.body.classList.add("theme-fallback-switching");
      }

      applyTheme(isLight);

      if (!document.startViewTransition && !reduceMotion) {
        window.setTimeout(() => {
          document.body.classList.remove("theme-fallback-switching");
        }, 350);
      }

      return;
    }

    // The new theme spreads out from the button in a circle
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    document.documentElement.classList.add("theme-switching");

    const transition = document.startViewTransition(() => applyTheme(isLight));

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            "circle(0px at " + x + "px " + y + "px)",
            "circle(" + radius + "px at " + x + "px " + y + "px)"
          ]
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("theme-switching");
    });
  }, true);
})();