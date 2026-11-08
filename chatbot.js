(() => {
  const chatbot = document.getElementById("chatbot");
  const toggle = document.getElementById("chatbotToggle");
  const panel = document.getElementById("chatbotPanel");
  const close = document.getElementById("chatbotClose");
  const form = document.getElementById("chatbotForm");
  const input = document.getElementById("chatbotInput");
  const messages = document.getElementById("chatbotMessages");
  const actions = document.querySelectorAll("[data-chat-prompt]");

  if (!chatbot || !toggle || !panel || !close || !form || !input || !messages)
    return;

  function setOpen(isOpen) {
    chatbot.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat");
    panel.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) input.focus();
  }

  function addMessage(text, type) {
    const message = document.createElement("p");
    message.className = `chatbot-message ${type}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  const answers = [
    {
      keywords: ["hello", "hi", "hey", "greetings"],
      response:
        "Hi! I’m the portfolio bot. Ask me about John, his skills, projects, goals, or how to get in touch.",
    },
    {
      keywords: ["who are you", "your name", "what are you"],
      response:
        "I’m the portfolio bot. I can guide you around John Patrick Eugenio’s portfolio.",
    },
    {
      keywords: [
        "about",
        "who is john",
        "who is patrick",
        "student",
        "yourself",
        "profile",
      ],
      response:
        "John Patrick Eugenio is a first-year Bachelor of Science in Information Systems student at ZPPSU. He is learning programming and web development with the goal of becoming a software developer.",
      section: "about",
    },
    {
      keywords: ["skill", "learn", "technology", "language"],
      response:
        "John is currently learning C++, HTML, CSS, JavaScript, and Git/GitHub. C++ is his current focus, while JavaScript and Git/GitHub are areas he is exploring.",
      section: "skills",
    },
    {
      keywords: ["project", "work", "build", "portfolio project"],
      response:
        "The Projects section contains small C++ practice projects focused on programming logic and building confidence.",
      section: "projects",
    },
    {
      keywords: ["goal", "roadmap", "future", "career", "dream"],
      response:
        "John’s roadmap is to master the fundamentals, build real projects, learn full-stack development, then graduate and begin his software development career.",
      section: "goals",
    },
    {
      keywords: ["contact", "email", "message", "hire", "reach"],
      response:
        "You can send a message through the contact form near the bottom of the page.",
      section: "contact",
    },
    {
      keywords: ["github", "code", "repository", "repo"],
      response:
        "John’s GitHub profile is github.com/jpatrickeugenio. You can open it from the GitHub Activity card.",
      section: "github",
    },
    {
      keywords: ["gallery", "photo", "picture"],
      response:
        "The Gallery section shows moments from John’s coding and school journey.",
      section: "gallery",
    },
    {
      keywords: ["terminal", "command"],
      response:
        "You can also explore the portfolio using the Developer Terminal. Try the help, about, skills, or projects commands.",
      section: "terminal",
    },
    {
      keywords: ["thank", "thanks"],
      response: "You’re welcome! I’m here whenever you need help exploring.",
    },
  ];

  function sendMessage(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    addMessage(trimmedText, "user");
    input.value = "";
    const answer = getResponse(trimmedText);
    window.setTimeout(() => {
      addMessage(answer.response, "bot");
      goToSection(answer.section);
    }, 450);
  }

  function getResponse(message) {
    const normalized = message.toLowerCase().replace(/[?!.,]/g, " ").trim();
    if (!normalized) return null;

    if (
      normalized === "help" ||
      normalized === "what can you do" ||
      normalized === "options"
    ) {
      return {
        response:
          "Ask me things like “What skills do you have?”, “Tell me about the projects”, “What are your goals?”, or “How can I contact you?”",
      };
    }

    const answer = answers.find(({ keywords }) =>
      keywords.some((keyword) => normalized.includes(keyword)),
    );

    return (
      answer || {
        response:
          "I’m not sure about that yet. Try asking about the about section, skills, projects, goals, GitHub, gallery, or contact.",
      }
    );
  }

  function goToSection(section) {
    if (!section) return;
    const target = document.getElementById(section);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  toggle.addEventListener("click", () => {
    setOpen(!chatbot.classList.contains("is-open"));
  });
  close.addEventListener("click", () => setOpen(false));
  actions.forEach((action) => {
    action.addEventListener("click", () => sendMessage(action.dataset.chatPrompt));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbot.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });
})();
