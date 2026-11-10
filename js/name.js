(() => {
  const target = document.getElementById("typingName");
  if (!target) return;

  const names = ["John Patrick", "Muhammad Ali"];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Works with your <span id="nameText"> inside, or without it
  const holder = document.getElementById("nameText") || target;

  target.style.whiteSpace = "nowrap";
  target.setAttribute("aria-label", names[0]);
  if (holder !== target) holder.setAttribute("aria-hidden", "true");

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const finished = (list) =>
    Promise.all(list.map((animation) => animation.finished));

  // One span per letter
  function build(text, hidden) {
    holder.textContent = "";

    return [...text].map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      if (hidden) span.style.opacity = "0";
      holder.appendChild(span);
      return span;
    });
  }

  let index = 0;
  let letters = build(names[0], false);

  async function changeName() {
    index = (index + 1) % names.length;
    const newName = names[index];

    const fromWidth = target.getBoundingClientRect().width;

    // 1. The old name fades out from left to right (the box keeps its width)
    const eraseStep = 30;
    const eraseDuration = 260;

    const erase = letters.map((span, i) =>
      span.animate(
        [
          { opacity: 1, transform: "translateX(0)", filter: "blur(0px)" },
          { opacity: 0, transform: "translateX(10px)", filter: "blur(4px)" },
        ],
        {
          duration: eraseDuration,
          delay: i * eraseStep,
          easing: "ease-in",
          fill: "forwards",
        },
      ),
    );

    await finished(erase);

    // 2. Swap in the new name (invisible for now) and measure its width
    letters = build(newName, true);
    target.setAttribute("aria-label", newName);

    const toWidth = target.getBoundingClientRect().width;

    // 3. The cursor glides smoothly from the old width to the new one
    const glide = target.animate(
      [{ width: fromWidth + "px" }, { width: toWidth + "px" }],
      { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );

    // 4. The new name appears from left to right, sliding in from the left
    const typeStep = 60;
    const typeDuration = 520;

    const reveal = letters.map((span, i) =>
      span.animate(
        [
          { opacity: 0, transform: "translateX(-16px)", filter: "blur(4px)" },
          { opacity: 1, transform: "translateX(0)", filter: "blur(0px)" },
        ],
        {
          duration: typeDuration,
          delay: 120 + i * typeStep,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      ),
    );

    await finished([glide, ...reveal]);

    // 5. Clean up without any visual change
    reveal.forEach((animation) => animation.cancel());
    letters.forEach((span) => {
      span.style.opacity = "";
    });
  }

  (async function loop() {
    while (true) {
      await wait(3500);
      if (document.hidden) continue;

      try {
        await changeName();
      } catch (error) {
        // If an animation is interrupted, just try again next round.
      }
    }
  })();
})();
