// GitHub Activity: draws the contribution squares inside <div id="ghx-grid">
// Squares show right away (empty), then fill with your real contributions when they load.
(() => {
  const grid = document.getElementById("ghx-grid");
  if (!grid) return;

  const USER = "jpatrickeugenio";
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const scroller = grid.closest(".ghx-scroll") || grid.parentElement;

  // styles for the squares (kept here so the grid always shows, whatever style.css says)
  const style = document.createElement("style");
  style.textContent = `
    #ghx-grid { display: flex; gap: 4px; width: max-content; min-height: 0; padding: 6px 2px; }
    #ghx-grid .ghx-week { display: grid; grid-template-rows: 16px repeat(7, 12px); gap: 4px; }
    #ghx-grid .ghx-month { font-size: 10px; line-height: 16px; color: #8c8c8c; white-space: nowrap; }
    #ghx-grid .ghx-cell { display: block; width: 12px; height: 12px; border-radius: 3px; background: var(--l0, #1f2733); }
    #ghx-grid .ghx-cell[data-l="1"] { background: var(--l1, #0e4429); }
    #ghx-grid .ghx-cell[data-l="2"] { background: var(--l2, #006d32); }
    #ghx-grid .ghx-cell[data-l="3"] { background: var(--l3, #26a641); }
    #ghx-grid .ghx-cell[data-l="4"] { background: var(--l4, #39d353); }
    #ghx-grid .ghx-cell.ghx-pad { background: transparent; }
  `;
  document.head.appendChild(style);

  const levelOf = (n) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4);

  function build(days) {
    grid.textContent = "";
    let week = null;
    let lastMonth = -1;

    days.forEach((d, i) => {
      const date = new Date(d.date + "T00:00:00Z");
      const dow = date.getUTCDay();

      if (!week || dow === 0) {
        week = document.createElement("div");
        week.className = "ghx-week";

        const label = document.createElement("span");
        label.className = "ghx-month";
        const m = date.getUTCMonth();
        if (m !== lastMonth) { label.textContent = MONTHS[m]; lastMonth = m; }
        week.appendChild(label);
        grid.appendChild(week);

        if (i === 0) {
          for (let p = 0; p < dow; p++) {
            const pad = document.createElement("span");
            pad.className = "ghx-cell ghx-pad";
            week.appendChild(pad);
          }
        }
      }

      const cell = document.createElement("span");
      cell.className = "ghx-cell";
      cell.dataset.l = d.level != null ? d.level : levelOf(d.count);
      cell.title = d.count + (d.count === 1 ? " contribution" : " contributions") + " on " + d.date;
      week.appendChild(cell);
    });

    // scroll to the latest month
    requestAnimationFrame(() => { scroller.scrollLeft = scroller.scrollWidth; });
  }

  // empty year (used until the real data arrives, or if it can't load)
  function emptyYear() {
    const days = [];
    const end = new Date();
    end.setUTCHours(0, 0, 0, 0);
    for (let i = 52 * 7 + end.getUTCDay(); i >= 0; i--) {
      const d = new Date(end.getTime() - i * 86400000);
      days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
    }
    return days;
  }

  build(emptyYear());

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 10000);

  fetch("https://github-contributions-api.jogruber.de/v4/" + USER + "?y=last", { signal: ctrl.signal })
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then((data) => {
      if (data && data.contributions && data.contributions.length) build(data.contributions);
    })
    .catch((err) => console.warn("GitHub activity could not load:", err))
    .finally(() => clearTimeout(timeout));
})();