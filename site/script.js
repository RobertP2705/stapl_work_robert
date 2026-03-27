document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.style.color = "var(--ink)";
      link.style.fontWeight = "700";
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) {
        return;
      }
      target.classList.toggle("hidden");
      button.textContent = target.classList.contains("hidden") ? "Show again" : "Hide";
    });
  });

  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    const feedback = quiz.querySelector(".quiz-feedback");
    quiz.querySelectorAll(".quiz-options button").forEach((button) => {
      button.addEventListener("click", () => {
        const correct = button.dataset.correct === "true";
        feedback.textContent = correct
          ? "Correct. That is the distributed-execution intuition to keep."
          : "Not quite. Try the option that reflects distributed ownership and replicated execution.";
        feedback.style.color = correct ? "var(--accent-strong)" : "#8f3a17";
      });
    });
  });

  document.querySelectorAll(".flashcard").forEach((card) => {
    card.dataset.side = "front";
    card.textContent = card.dataset.front;
    card.addEventListener("click", () => {
      const showingFront = card.dataset.side === "front";
      card.dataset.side = showingFront ? "back" : "front";
      card.textContent = showingFront ? card.dataset.back : card.dataset.front;
    });
  });
});
