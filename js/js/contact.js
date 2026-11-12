(() => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll("input, textarea")];
    const hasEmptyField = fields.some((field) => !field.value.trim());

    if (hasEmptyField || !form.checkValidity()) {
      status.textContent = "Please fill in all fields correctly.";
      status.setAttribute("data-state", "error");
      form.reportValidity();
      return;
    }

    status.textContent = "Message sent.";
    status.setAttribute("data-state", "success");
    form.reset();
  });
})();
