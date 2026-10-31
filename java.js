
document.addEventListener("DOMContentLoaded", () => {
  // ---------- LOADING SCREEN ----------
 // ---------- LOADING SCREEN ----------
const loader = document.getElementById("loader");

if (loader) {
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 2000);
}
  // ---------- TYPING ANIMATION ----------
 
const typingName = document.getElementById("typingName");

if (typingName) {
    const names = ["John Patrick", "Muhammad Ali"];
    let index = 0;

    setInterval(() => {
        typingName.classList.add("text-changing");

        setTimeout(() => {
            index = (index + 1) % names.length;
            typingName.textContent = names[index];

            typingName.classList.remove("text-changing");
        }, 400);

    }, 4000);
}



  // ---------- THEME SWITCH ----------
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  function updateTheme(isLight) {
    document.body.classList.toggle("light", isLight);
    themeIcon.textContent = isLight ? "☾" : "☀";
    themeText.textContent = isLight ? "Dark mode" : "Light mode";
  }

  const savedTheme = localStorage.getItem("portfolio-theme");
  updateTheme(savedTheme === "light");

  themeToggle.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("light");

    updateTheme(isLight);
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  });

  // ---------- MOBILE SIDEBAR ----------
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");

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
    }
  });

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
    revealElements.forEach((element) => element.classList.add("visible"));
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

    if (!project) return;

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
    modalClose.focus();
  }

  function closeProject() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => {
      openProject(card.dataset.project);
    });
  });

  modalClose.addEventListener("click", closeProject);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProject();
    }
  });

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
  // ---------- AUTOMATIC COPYRIGHT YEAR ----------
  document.getElementById("year").textContent = new Date().getFullYear();
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const status = document.getElementById("formStatus");
    const button = document.getElementById("sendButton");

    const data = {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      message: document.getElementById("contactMessage").value.trim()
    };

    if (!data.name || !data.email || !data.message) {
      status.textContent = "Please complete all fields.";
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      status.textContent = result.message;
      contactForm.reset();

    } catch (error) {
      status.textContent =
        "Could not send your message. Please try again.";

      console.error("Contact form error:", error);

    } finally {
      button.disabled = false;
    }
  });
}
