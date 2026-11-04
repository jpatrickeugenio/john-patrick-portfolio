// ID card: shows your photo; when the cursor is on the card, the video fades in and plays for 4 seconds,
// then fades back to the photo. Move the cursor away and back to play it again.
(() => {
  const video = document.getElementById("zidVideo");
  const card = document.getElementById("zid-id");
  if (!video || !card) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // photo only

  const VIDEO_TIME = 4000; // how long the video plays (milliseconds)
  const FADE = 800;        // fade time, same as in idvideo.css

  let stopTimer, pauseTimer;
  let active = false;
  let failed = false;

  video.addEventListener("error", () => { failed = true; });
  video.addEventListener("ended", stop); // if the video is shorter than 4 seconds

  function start() {
    if (failed || active) return;
    active = true;
    clearTimeout(pauseTimer);
    clearTimeout(stopTimer);
    video.currentTime = 0;
    video.play().then(() => {
      if (!active) return;
      video.classList.add("show");
      stopTimer = setTimeout(stop, VIDEO_TIME);
    }).catch(() => { active = false; });
  }

  function stop() {
    active = false;
    clearTimeout(stopTimer);
    video.classList.remove("show");
    pauseTimer = setTimeout(() => video.pause(), FADE);
  }

  card.addEventListener("pointerenter", start);
  card.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") stop(); }); // touch: plays its 4 seconds
  card.addEventListener("focus", start); // keyboard users
  card.addEventListener("blur", stop);
})();