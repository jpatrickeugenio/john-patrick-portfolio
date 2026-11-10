(() => {
  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeText");
  const themeColor = document.getElementById("themeColor");
  if (!toggle) return;

  function applyTheme(isLight) {
    document.body.classList.toggle("light", isLight);
    document.body.classList.add("theme-transitioning");
    window.setTimeout(
      () => document.body.classList.remove("theme-transitioning"),
      320,
    );

    if (icon) icon.textContent = isLight ? "☾" : "☀";
    if (label) label.textContent = isLight ? "Dark mode" : "Light mode";
    toggle.setAttribute(
      "aria-label",
      isLight ? "Turn the light off" : "Turn the light on",
    );
    if (themeColor)
      themeColor.setAttribute("content", isLight ? "#f4f4f4" : "#090909");

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
  toggle.setAttribute(
    "aria-label",
    saved === "light" ? "Turn the light off" : "Turn the light on",
  );
  if (themeColor)
    themeColor.setAttribute(
      "content",
      saved === "light" ? "#f4f4f4" : "#090909",
    );

  let flipTimer = 0;

  toggle.addEventListener(
    "click",
    (event) => {
      event.stopImmediatePropagation();

      const isLight = !document.body.classList.contains("light");
      toggle.classList.remove("is-flipping");
      void toggle.offsetWidth;
      toggle.classList.add("is-flipping");
      window.clearTimeout(flipTimer);
      flipTimer = window.setTimeout(
        () => toggle.classList.remove("is-flipping"),
        420,
      );
      applyTheme(isLight);
    },
    true,
  );
})();
