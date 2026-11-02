
document.addEventListener("DOMContentLoaded", () => {
  // ---------- LOADING SCREEN ----------
// ---------- LOADING SCREEN ----------
const loader = document.getElementById("loader");

if (loader) {
  setTimeout(() => {
    loader.classList.add("loader-hidden");
    document.body.classList.remove("site-loading");
  }, 2000);
}
  
  // ---------- TYPING ANIMATION ----------
  // ---------- NAME TRANSITION ----------
  const typingName = document.getElementById("typingName");

  if (typingName) {
    const names = ["John Patrick", "Muhammad Ali"];
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;

    typingName.style.whiteSpace = "nowrap";

    // Measures a name's width without touching the page.
    function textWidth(text) {
      const probe = typingName.cloneNode();
      probe.removeAttribute("id");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;";
      probe.textContent = text;
      typingName.parentNode.appendChild(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    }

    async function changeName() {
      index = (index + 1) % names.length;
      const fromWidth = typingName.getBoundingClientRect().width;
      const toWidth = textWidth(names[index]);

      // 1. fade the old name out
      await typingName.animate(
        [
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
          { opacity: 0, transform: "translateY(-8px)", filter: "blur(6px)" }
        ],
        { duration: 300, easing: "ease-in", fill: "forwards" }
      ).finished;

      // 2. swap the text, fade in, and slide to the new width
      typingName.textContent = names[index];

      const fadeIn = typingName.animate(
        [
          { opacity: 0, transform: "translateY(8px)", filter: "blur(6px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" }
        ],
        { duration: 450, easing: "ease-out", fill: "forwards" }
      );

      const resize = typingName.animate(
        [{ width: fromWidth + "px" }, { width: toWidth + "px" }],
        { duration: 450, easing: "ease-out" }
      );

      await Promise.all([fadeIn.finished, resize.finished]);
      typingName.getAnimations().forEach((animation) => animation.cancel());
    }

    if (!reduceMotion) {
      (async function loop() {
        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          await changeName();
        }
      })();
    }
  }
  // ---------- THEME SWITCH ----------
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  function updateTheme(isLight) {
    document.body.classList.toggle("light", isLight);

    if (themeIcon) {
      themeIcon.textContent = isLight ? "☾" : "☀";
    }

    if (themeText) {
      themeText.textContent = isLight ? "Dark mode" : "Light mode";
    }

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {
    // The site still works if browser storage is unavailable.
  }

  updateTheme(savedTheme === "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = !document.body.classList.contains("light");

      const applyTheme = () => {
        updateTheme(isLight);

        try {
          localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        } catch (error) {
          // Theme switching still works for the current page.
        }
      };

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Older browsers: switch instantly.
      if (!document.startViewTransition || reduceMotion) {
        applyTheme();
        return;
      }

      // The circle grows from the center of the button to the farthest corner.
      const rect = themeToggle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.classList.add("theme-switching");

      const transition = document.startViewTransition(applyTheme);

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`
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
    });
  }

  // ---------- MOBILE SIDEBAR ----------
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sidebar && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
      });
    });

    // Close the mobile menu when clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 760 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- SCROLL REVEAL ----------
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // ---------- ACTIVE NAVIGATION ----------
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ---------- PROJECT DETAILS ----------
  const projects = {
    number: {
      title: "Number Analyzer",
      description:
        "A C++ practice program that accepts five numbers and calculates their sum, identifies the largest value, and counts even and odd numbers.",
      tags: ["C++", "Arrays", "Loops", "Conditions"]
    },

    grades: {
      title: "Student Grade Analyzer",
      description:
        "A grade-processing program that calculates the average, highest grade, lowest grade, and number of students who pass or fail. A grade of 75 or higher is passing.",
      tags: ["C++", "Arrays", "Average", "Pass / Fail"]
    },

    pro: {
      title: "Number Analyzer Pro",
      description:
        "An expanded number analysis exercise using ten values. It calculates the sum and average, finds the largest and smallest values, counts even and odd numbers, and counts values greater than 50.",
      tags: ["C++", "Arrays", "Loops", "Problem Solving"]
    },

    ranking: {
      title: "Student Grade Ranking",
      description:
        "A program that analyzes eight student grades, calculates their average, finds the highest and lowest grades, and counts passing students and excellent grades. Passing starts at 75; excellent starts at 90.",
      tags: ["C++", "Arrays", "Counters", "Conditions"]
    },

    bank: {
      title: "Bank Account Program",
      description:
        "A beginner programming exercise for managing a sample account balance. The user can check the balance, deposit money, and withdraw money while the program checks that a withdrawal does not exceed the available balance.",
      tags: ["C++", "Variables", "Conditions", "Functions"]
    }
  };

  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalTags = document.getElementById("modalTags");
  const modalClose = document.getElementById("modalClose");

  function openProject(projectKey) {
    const project = projects[projectKey];

    if (
      !project ||
      !modal ||
      !modalTitle ||
      !modalDescription ||
      !modalTags
    ) {
      return;
    }

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTags.replaceChildren();

    project.tags.forEach((tagName) => {
      const tag = document.createElement("span");
      tag.textContent = tagName;
      modalTags.appendChild(tag);
    });

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    if (modalClose) {
      modalClose.focus();
    }
  }

  function closeProject() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => {
      openProject(card.dataset.project);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeProject);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeProject();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProject();
    }
  });

  // ---------- INTERACTIVE TERMINAL ----------
  const terminalForm = document.getElementById("terminalForm");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");

  if (terminalForm && terminalInput && terminalOutput) {
    const commands = {
      help: [
        "Available commands:",
        "about     - Learn about me",
        "skills    - View my learning skills",
        "projects  - View my practice projects",
        "timeline  - View my developer journey",
        "contact   - Find my contact section",
        "clear     - Clear the terminal"
      ],

      about: [
        "I'm John Patrick Eugenio, a BSIS 1A student at ZPPSU.",
        "I'm learning programming and working toward becoming a software developer."
      ],

      skills: [
        "Current learning areas:",
        "- C++ fundamentals, conditions, loops, arrays, and functions",
        "- HTML for page structure",
        "- CSS for layout and responsive design",
        "- JavaScript for website interactivity"
      ],

      projects: [
        "My practice projects include:",
        "- Number Analyzer",
        "- Student Grade Analyzer",
        "- Number Analyzer Pro",
        "- Student Grade Ranking",
        "- Bank Account Program"
      ],

      timeline: [
        "My journey:",
        "1. Learn C++ fundamentals",
        "2. Practice logic, loops, and arrays",
        "3. Build programming and web projects",
        "4. Work toward becoming a software developer"
      ],

      contact: [
        "Want to connect? Visit the Contact section of this portfolio."
      ]
    };

    terminalForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const command = terminalInput.value.trim().toLowerCase();

      if (!command) return;

      if (command === "clear") {
        terminalOutput.replaceChildren();
        terminalInput.value = "";
        return;
      }

      const commandLine = document.createElement("p");
      commandLine.className = "terminal-command";
      commandLine.textContent = `visitor@portfolio:~$ ${command}`;
      terminalOutput.appendChild(commandLine);

      const result = commands[command];

      if (result) {
        result.forEach((line) => {
          const outputLine = document.createElement("p");
          outputLine.textContent = line;
          terminalOutput.appendChild(outputLine);
        });
      } else {
        const errorLine = document.createElement("p");
        errorLine.className = "terminal-error";
        errorLine.textContent =
          `Command not found: "${command}". Type "help" to see available commands.`;
        terminalOutput.appendChild(errorLine);
      }

      terminalInput.value = "";
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
  }
  // ---------- SKILLS MARQUEE ----------
  document.querySelectorAll(".mq-track").forEach((track) => {
    const set = track.querySelector(".mq-set");
    if (!set) return;

    const copy = set.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });
  // ---------- AUTOMATIC COPYRIGHT YEAR ----------
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ---------- CONTACT FORM ----------
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = document.getElementById("formStatus");
      const button = document.getElementById("sendButton");
      const nameInput = document.getElementById("contactName");
      const emailInput = document.getElementById("contactEmail");
      const messageInput = document.getElementById("contactMessage");

      if (
        !status ||
        !button ||
        !nameInput ||
        !emailInput ||
        !messageInput
      ) {
        console.error("Contact form HTML elements are missing.");
        return;
      }

      const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      };

      // Basic client-side validation.
      if (!data.name || !data.email || !data.message) {
        status.textContent = "Please complete all fields.";
        return;
      }

      if (
        data.name.length > 100 ||
        data.email.length > 254 ||
        data.message.length > 5000
      ) {
        status.textContent =
          "Please check the length of your name, email, or message.";
        return;
      }

      // A simple format check. The backend must validate independently.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(data.email)) {
        status.textContent = "Please enter a valid email address.";
        return;
      }

      button.disabled = true;
      status.textContent = "Sending your message...";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        let result = {};

        try {
          result = await response.json();
        } catch (error) {
          // Handle non-JSON server responses safely.
        }

        if (!response.ok) {
          status.textContent =
            response.status === 429
              ? "Too many messages. Please try again later."
              : result.message || "Could not send your message.";
          return;
        }

        status.textContent =
          result.message || "Your message was sent successfully!";

        contactForm.reset();
      } catch (error) {
        status.textContent =
          "Could not send your message. Please try again.";

        // Technical details stay in the developer console.
        console.error("Contact form request failed.");
      } finally {
        button.disabled = false;
      }
    });
  }
});
/* ---------- GitHub activity card ---------- */
(async () => {
  const grid = document.getElementById('ghx-grid');
  if (!grid) return;
  let days = [];

  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/jpatrickeugenio?y=last');
    days = (await res.json()).contributions;
  } catch {
    const d = new Date(); d.setDate(d.getDate() - 364);
    for (let i = 0; i < 365; i++) {
      days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
      d.setDate(d.getDate() + 1);
    }
  }

  const pad = new Date(days[0].date).getDay();
  for (let i = 0; i < pad; i++) grid.insertAdjacentHTML('beforeend', '<div></div>');

  const cols = Math.ceil((days.length + pad) / 7);
  grid.style.setProperty('--cols', cols);
  days.forEach((d, i) => {
    const c = document.createElement('div');
    c.className = 'cell';
    c.dataset.l = d.level;
    c.style.setProperty('--d', ((cols - 1 - Math.floor((i + pad) / 7)) * 9 + 250) + 'ms');
    c.title = `${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`;
    grid.appendChild(c);
  });

  // auto-scroll to the newest month
  const sc = document.querySelector('.ghx-scroll');
  const jump = () => { sc.scrollLeft = sc.scrollWidth; };
  jump();
  requestAnimationFrame(jump);
  window.addEventListener('load', jump);
  window.addEventListener('resize', jump);
})();
/* ---------- C++ projects explorer ---------- */
(() => {
  const list = document.getElementById('peList');
  const detail = document.getElementById('peDetail');
  if (!list || !detail) return;

  // Edit this list to change the projects, code and output.
  const projects = [
    { sym:'Σ', title:'Number Analyzer', file:'project-01.cpp',
      desc:'Calculate a sum, find the largest number, and count even and odd values.',
      tags:['C++','Arrays','Loops'], learn:['Loops','Arrays','Even / odd check'],
      code:[
        'int sum = 0, largest = nums[0];',
        'for (int n : nums) {',
        '  sum += n;',
        '  if (n > largest) largest = n;',
        '}'],
      out:['Sum: 135','Largest: 48','Even: 4   Odd: 3'] },

    { sym:'✓', title:'Student Grade Analyzer', file:'project-02.cpp',
      desc:'Calculate the average, highest and lowest grades, and pass/fail results.',
      tags:['C++','Conditions'], learn:['Averages','if / else','Pass or fail'],
      code:[
        'double avg = total / count;',
        'if (avg >= passing)',
        '  cout << "Passed";',
        'else cout << "Failed";'],
      out:['Average: 87.5','Highest: 95   Lowest: 78','Result: Passed'] },

    { sym:'Σ+', title:'Number Analyzer Pro', file:'project-03.cpp',
      desc:'Analyze ten numbers, calculate averages, and count numbers greater than 50.',
      tags:['C++','Logic'], learn:['Counters','Averages','Conditions'],
      code:[
        'int over50 = 0;',
        'for (int i = 0; i < 10; i++)',
        '  if (nums[i] > 50) over50++;'],
      out:['Average: 52.3','Numbers above 50: 6'] },

    { sym:'⇅', title:'Student Grade Ranking', file:'project-04.cpp',
      desc:'Process eight grades, find the highest and lowest, and count passing students.',
      tags:['C++','Arrays'], learn:['Arrays','Min and max','Counting'],
      code:[
        'for (int i = 0; i < 8; i++) {',
        '  if (g[i] > highest) highest = g[i];',
        '  if (g[i] < lowest)  lowest  = g[i];',
        '}'],
      out:['Highest: 96   Lowest: 74','Passing students: 7 of 8'] },

    { sym:'$', title:'Bank Account Program', file:'project-05.cpp',
      desc:'A learning exercise for checking a balance, depositing, and withdrawing money.',
      tags:['C++','Functions'], learn:['Functions','References','Input checks'],
      code:[
        'void withdraw(double &balance, double amt) {',
        '  if (amt <= balance) balance -= amt;',
        '}'],
      out:['Balance: 1500.00','Deposited 500.00','Withdrew 200.00','Balance: 1800.00'] },

    { sym:'÷', title:'Simple Calculator', file:'project-06.cpp',
      desc:'A simple calculator that adds, subtracts, multiplies, and divides two numbers using a switch statement.',
      tags:['C++','Switch','Operators'], learn:['switch / case','Operators','User input'],
      code:[
        'switch (op) {',
        "  case '+': result = a + b; break;",
        "  case '-': result = a - b; break;",
        "  case '*': result = a * b; break;",
        "  case '/': result = a / b; break;",
        '  default: cout << "Invalid operator";',
        '}'],
      out:['Enter two numbers: 12 4','Enter operator (+ - * /): *','Result: 12 * 4 = 48'] }
  ];

  // tiny syntax colouring
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const TOK = /("[^"]*"|'[^']*')|\b(int|for|if|else|void|switch|case|break|default|return)\b|\b(double|float|char|string)\b|\b(\d+(?:\.\d+)?)\b/g;
  const hl = line => esc(line).replace(TOK, (m, s, k, t, n) =>
    s ? `<span class="pe-s">${s}</span>` :
    k ? `<span class="pe-k">${k}</span>` :
    t ? `<span class="pe-t">${t}</span>` :
        `<span class="pe-n">${n}</span>`);

  list.innerHTML = projects.map((p, i) => `
    <button type="button" class="pe-item${i ? '' : ' on'}" data-i="${i}" role="tab" aria-selected="${i === 0}">
      <span class="pe-sym">${p.sym}</span><b>${p.title}</b>
    </button>`).join('');

  const show = i => {
    const p = projects[i];
    const code = p.code.map((l, k) => `<span class="pe-line" style="--i:${k}">${hl(l) || ' '}</span>`).join('');
    const out = p.out.map(o => `<span class="pe-ok">${esc(o)}</span>`).join('');
    detail.innerHTML = `
      <div class="pe-panel">
        <h3>${p.title}</h3>
        <p class="pe-desc">${p.desc}</p>
        <div class="pe-win pe-code">
          <div class="pe-bar"><i></i><i></i><i></i><span>${p.file}</span></div>
          <pre>${code}</pre>
        </div>
        <div class="pe-win pe-run" style="--d:${p.code.length * 120 + 250}ms">
          <div class="pe-bar"><span style="margin-left:0">▸ Output</span></div>
          <pre><span class="pe-cmd">$ ./${p.file.replace('.cpp', '')}</span>${out}</pre>
        </div>
        <div class="pe-learn">${p.learn.map(l => `<div><b>${l}</b>Practiced here</div>`).join('')}</div>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div>`;
  };

  list.addEventListener('click', e => {
    const b = e.target.closest('.pe-item');
    if (!b) return;
    list.querySelectorAll('.pe-item').forEach(x => {
      x.classList.remove('on');
      x.setAttribute('aria-selected', 'false');
    });
    b.classList.add('on');
    b.setAttribute('aria-selected', 'true');
    show(+b.dataset.i);
  });

  show(0);
})();