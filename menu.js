(() => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");

  if (!menuToggle || !sidebar || !backdrop) return;

  function setMenuOpen(isOpen) {
    sidebar.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    backdrop.setAttribute("aria-hidden", String(!isOpen));
  }

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!sidebar.classList.contains("open"));
  });

  backdrop.addEventListener("click", () => {
    setMenuOpen(false);
  });

  sidebar.querySelectorAll(".nav-link, .brand").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("open")) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760 && sidebar.classList.contains("open")) {
      setMenuOpen(false);
    }
  });
})();
