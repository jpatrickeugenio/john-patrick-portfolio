// Paste at the bottom of java.js
(() => {
  const strip = document.getElementById("galStrip");
  const prev = document.getElementById("galPrev");
  const next = document.getElementById("galNext");
  if (!strip || !prev || !next) return;

  strip
    .querySelectorAll(".gal-item")
    .forEach((item, i) => item.style.setProperty("--i", i));

  // photos slide in from the left when the gallery comes into view
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          strip.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(strip);
  } else {
    strip.classList.add("in");
  }

  // arrow buttons
  const step = () => Math.max(220, strip.clientWidth * 0.8);
  prev.addEventListener("click", () =>
    strip.scrollBy({ left: -step(), behavior: "smooth" }),
  );
  next.addEventListener("click", () =>
    strip.scrollBy({ left: step(), behavior: "smooth" }),
  );

  function updateButtons() {
    prev.disabled = strip.scrollLeft <= 2;
    next.disabled =
      strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2;
  }
  strip.addEventListener("scroll", updateButtons, { passive: true });
  addEventListener("resize", updateButtons);
  updateButtons();

  // drag to scroll with the mouse
  let down = false,
    startX = 0,
    startLeft = 0;
  strip.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true;
    startX = e.clientX;
    startLeft = strip.scrollLeft;
    strip.classList.add("drag");
  });
  addEventListener("pointermove", (e) => {
    if (down) strip.scrollLeft = startLeft - (e.clientX - startX);
  });
  addEventListener("pointerup", () => {
    down = false;
    strip.classList.remove("drag");
  });

  // double-click a photo to see it bigger, X (or Esc / outside click) to close
  const box = document.createElement("div");
  box.className = "gal-lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo preview");
  box.innerHTML =
    '<div class="gal-lb-card"><button class="gal-lb-close" type="button" aria-label="Close photo">✕</button><div class="gal-lb-photo"></div></div>';
  document.body.appendChild(box);
  const lbPhoto = box.querySelector(".gal-lb-photo");
  const lbClose = box.querySelector(".gal-lb-close");

  function openPhoto(item) {
    const img = item.querySelector("img");
    lbPhoto.textContent = "";
    lbPhoto.className = "gal-lb-photo";
    if (img) {
      const big = document.createElement("img");
      big.src = img.src;
      big.alt = img.alt;
      lbPhoto.appendChild(big);
    } else {
      lbPhoto.classList.add("empty");
      lbPhoto.style.setProperty(
        "--h",
        item.style.getPropertyValue("--h") || 210,
      );
      lbPhoto.dataset.n = item.dataset.n;
    }
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closePhoto() {
    box.classList.remove("open");
    document.body.style.overflow = "";
  }

  strip
    .querySelectorAll(".gal-item")
    .forEach((item) =>
      item.addEventListener("dblclick", () => openPhoto(item)),
    );
  lbClose.addEventListener("click", closePhoto);
  box.addEventListener("click", (e) => {
    if (e.target === box) closePhoto();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePhoto();
  });
})();
