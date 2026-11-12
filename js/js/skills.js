(() => {
  const marquee = document.querySelector(".mq-marquee");
  if (!marquee) return;

  // Copy the cards once so the line loops without a gap
  marquee.querySelectorAll(".mq-track").forEach((track) => {
    const sets = track.querySelectorAll(".mq-set");
    if (sets.length !== 1) return;

    const copy = sets[0].cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });

  if (!matchMedia("(hover: hover)").matches) return;

  // Big hover, even if an invisible element is on top of the card
  let current = null;

  function setHover(card) {
    if (card === current) return;
    if (current) current.classList.remove("is-hover");
    if (card) card.classList.add("is-hover");
    current = card;
  }

  document.addEventListener("mousemove", (e) => {
    const r = marquee.getBoundingClientRect();
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;

    if (!inside) return setHover(null);

    const card = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((el) => el.classList && el.classList.contains("mq-card"));

    setHover(card || null);
  });

  document.addEventListener("mouseleave", () => setHover(null));
  window.addEventListener("scroll", () => setHover(null), { passive: true });
})();
