(() => {
  const list = document.getElementById("peList");
  const detail = document.getElementById("peDetail");
  if (!list || !detail) return;

  // If another script already filled the section, do nothing
  if (list.children.length) return;

  const projects = [
    {
      sym: "01",
      name: "Number Analyzer",
      file: "number_analyzer.cpp",
      desc: "Accepts five numbers, then calculates their sum, finds the largest value, and counts the even and odd numbers.",
      code: [
        "#include <iostream>",
        "using namespace std;",
        "",
        "int main() {",
        "    int nums[5], sum = 0;",
        "    for (int i = 0; i < 5; i++) {",
        "        cin >> nums[i];",
        "        sum += nums[i];",
        "    }",
        '    cout << "Sum: " << sum;',
        "}",
      ],
      run: ["$ ./number_analyzer", "Sum: 28", "Largest: 9", "Even: 3 | Odd: 2"],
      learn: [
        ["Arrays", "Store five values in one variable."],
        ["Loops", "Repeat the same step for every number."],
        ["Conditions", "Decide if a number is even or odd."],
      ],
    },
    {
      sym: "02",
      name: "Student Grade Analyzer",
      file: "grade_analyzer.cpp",
      desc: "Calculates the average, the highest and lowest grades, and how many students pass or fail. A grade of 75 or higher is passing.",
      code: [
        "double grades[5], total = 0;",
        "for (int i = 0; i < 5; i++) {",
        "    cin >> grades[i];",
        "    total += grades[i];",
        "}",
        "double avg = total / 5;",
        "if (avg >= 75) {",
        '    cout << "Passed";',
        "} else {",
        '    cout << "Failed";',
        "}",
      ],
      run: [
        "$ ./grade_analyzer",
        "Average: 84.2",
        "Highest: 92 | Lowest: 75",
        "Passed: 5 | Failed: 0",
      ],
      learn: [
        ["Average", "Add everything, then divide by the count."],
        ["Conditions", "Pass or fail with if and else."],
        ["Arrays", "Keep all the grades together."],
      ],
    },
    {
      sym: "03",
      name: "Number Analyzer Pro",
      file: "number_analyzer_pro.cpp",
      desc: "An expanded exercise using ten values. It calculates the sum and average, finds the largest and smallest values, and counts the numbers greater than 50.",
      code: [
        "int nums[10], count = 0;",
        "for (int i = 0; i < 10; i++) {",
        "    cin >> nums[i];",
        "    if (nums[i] > 50) {",
        "        count++;",
        "    }",
        "}",
        'cout << "Over 50: " << count;',
      ],
      run: [
        "$ ./number_analyzer_pro",
        "Sum: 463 | Average: 46.3",
        "Largest: 98 | Smallest: 7",
        "Over 50: 4",
      ],
      learn: [
        ["Counters", "Count only the values that match."],
        ["Min and max", "Compare each value with the best so far."],
        ["Problem solving", "Break one big task into small steps."],
      ],
    },
    {
      sym: "04",
      name: "Student Grade Ranking",
      file: "grade_ranking.cpp",
      desc: "Analyzes eight student grades, calculates the average, finds the highest and lowest grades, and counts passing students and excellent grades. Passing starts at 75, and excellent starts at 90.",
      code: [
        "int grades[8], pass = 0, excellent = 0;",
        "for (int i = 0; i < 8; i++) {",
        "    cin >> grades[i];",
        "    if (grades[i] >= 75) pass++;",
        "    if (grades[i] >= 90) excellent++;",
        "}",
        'cout << "Passing: " << pass;',
      ],
      run: [
        "$ ./grade_ranking",
        "Highest: 96 | Lowest: 68",
        "Average: 82.5",
        "Passing: 6 | Excellent: 2",
      ],
      learn: [
        ["Two counters", "Track passing and excellent grades together."],
        ["Arrays", "Process eight values in one loop."],
        ["Conditions", "Check each grade against a limit."],
      ],
    },
    {
      sym: "05",
      name: "Bank Account Program",
      file: "bank_account.cpp",
      desc: "A beginner exercise for managing a sample account balance. The user can check the balance, deposit money, and withdraw money, and the program makes sure a withdrawal never exceeds the available balance.",
      code: [
        "double balance = 1000;",
        "",
        "void withdraw(double amount) {",
        "    if (amount > balance) {",
        '        cout << "Insufficient balance";',
        "    } else {",
        "        balance -= amount;",
        "    }",
        "}",
      ],
      run: [
        "$ ./bank_account",
        "Balance: 1000",
        "Deposit 500 -> Balance: 1500",
        "Withdraw 2000 -> Insufficient balance",
      ],
      learn: [
        ["Functions", "Put one job in one reusable block."],
        ["Variables", "Keep the balance and update it."],
        ["Validation", "Check the input before changing data."],
      ],
    },
  ];

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Tiny syntax highlighter for the code samples
  const token =
    /("[^"]*")|(#include\s*<[^>]*>)|\b(int|double|float|void|bool|string|char|const|auto)\b|\b(for|if|else|while|return|using|namespace)\b|\b(\d+(?:\.\d+)?)\b/g;

  function highlight(line) {
    let out = "";
    let last = 0;
    let m;

    token.lastIndex = 0;

    while ((m = token.exec(line))) {
      out += esc(line.slice(last, m.index));
      const cls = m[1]
        ? "pe-s"
        : m[2]
          ? "pe-k"
          : m[3]
            ? "pe-t"
            : m[4]
              ? "pe-k"
              : "pe-n";
      out += '<span class="' + cls + '">' + esc(m[0]) + "</span>";
      last = token.lastIndex;
    }

    return out + esc(line.slice(last));
  }

  function show(index) {
    const p = projects[index];
    const runDelay = p.code.length * 0.12 + 0.3;

    const code = p.code
      .map(
        (line, i) =>
          '<span class="pe-line" style="--i:' +
          i +
          '">' +
          highlight(line) +
          "</span>",
      )
      .join("");

    const run = p.run
      .map((line, i) => {
        const cls = i === 0 ? "pe-cmd" : "pe-ok";
        return (
          '<span class="' +
          cls +
          ' pe-run" style="--d:' +
          (runDelay + i * 0.35).toFixed(2) +
          's">' +
          esc(line) +
          "</span>"
        );
      })
      .join("");

    const learn = p.learn
      .map(
        (item) => "<div><b>" + esc(item[0]) + "</b>" + esc(item[1]) + "</div>",
      )
      .join("");

    detail.innerHTML =
      '<div class="pe-panel">' +
      "<h3>" +
      esc(p.name) +
      "</h3>" +
      '<p class="pe-desc">' +
      esc(p.desc) +
      "</p>" +
      '<div class="pe-win pe-code"><div class="pe-bar"><i></i><i></i><i></i><span>' +
      esc(p.file) +
      "</span></div><pre>" +
      code +
      "</pre></div>" +
      '<div class="pe-win"><div class="pe-bar"><i></i><i></i><i></i><span>sample output</span></div><pre>' +
      run +
      "</pre></div>" +
      '<div class="pe-learn">' +
      learn +
      "</div>" +
      "</div>";

    list.querySelectorAll(".pe-item").forEach((button, i) => {
      const active = i === index;
      button.classList.toggle("on", active);
      button.setAttribute("aria-selected", String(active));
    });
  }

  projects.forEach((p, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pe-item";
    button.style.setProperty("--project-index", i);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", p.name);
    button.innerHTML =
      '<span class="pe-sym">' + p.sym + "</span><b>" + esc(p.name) + "</b>";
    button.addEventListener("click", () => show(i));
    list.appendChild(button);
  });

  show(0);

  const section = document.getElementById("projects");
  if (!section) return;

  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    section.classList.add("projects-visible");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      section.classList.toggle("projects-visible", entry.isIntersecting);
    },
    { threshold: 0.15 },
  );
  observer.observe(section);
})();
