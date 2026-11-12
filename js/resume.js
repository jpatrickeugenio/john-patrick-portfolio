(() => {
  const resumeButton = document.getElementById("resumeButton");
  if (!resumeButton) return;

  const originalText = resumeButton.innerHTML;
  let resetTimer;

  resumeButton.addEventListener("click", () => {
    window.clearTimeout(resetTimer);
    resumeButton.innerHTML =
      '<span aria-hidden="true">🔒</span> Resume coming soon';
    resumeButton.setAttribute("aria-label", "Wala pa ako resume");

    resetTimer = window.setTimeout(() => {
      resumeButton.innerHTML = originalText;
      resumeButton.removeAttribute("aria-label");
    }, 2200);
  });
})();
