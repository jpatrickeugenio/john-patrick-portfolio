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

  // No hover on touch screens
  if (!matchMedia("(hover: hover)").matches) return;

  let x = 0;
  let y = 0;
  let inside = false;
  let current = null;
  let frame = 0;

  function setHover(card) {
    if (card === current) return;
    if (current) current.classList.remove("is-hover");
    if (card) card.classList.add("is-hover");
    current = card;
  }

  // Runs every frame while the cursor is over the line, so the card
  // under a STILL cursor grows as the cards slide past it
  function check() {
    const box = marquee.getBoundingClientRect();
    const hit =
      inside &&
      x >= box.left &&
      x <= box.right &&
      y >= box.top &&
      y <= box.bottom;

    let card = null;

    if (hit) {
      card =
        document
          .elementsFromPoint(x, y)
          .find((el) => el.classList && el.classList.contains("mq-card")) ||
        null;
    }

    setHover(card);
    frame = hit ? requestAnimationFrame(check) : 0;
  }

  document.addEventListener(
    "mousemove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      inside = true;
      if (!frame) frame = requestAnimationFrame(check);
    },
    { passive: true },
  );

  document.addEventListener("mouseleave", () => {
    inside = false;
  });
})();
