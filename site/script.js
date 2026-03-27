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

  const ownershipGraph = document.querySelector("[data-ownership-graph]");
  const ownershipCaption = document.querySelector("[data-ownership-caption]");
  if (ownershipGraph && ownershipCaption) {
    const locationDescriptions = {
      all: "Showing the whole distributed structure. Cross-location edges are the places where local reasoning is no longer enough.",
      "loc-a": "Location A owns A1 and A2 locally, but edges from A2 to B1 and from A1 to C2 represent remote dependencies.",
      "loc-b": "Location B owns B1 and B2 locally, but it sits in the middle of the graph and coordinates with both A and C.",
      "loc-c": "Location C owns C1 and C2 locally, but still depends on information flowing in from earlier locations."
    };

    document.querySelectorAll("[data-location]").forEach((button) => {
      button.addEventListener("click", () => {
        const location = button.dataset.location;
        document.querySelectorAll("[data-location]").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");

        if (location === "all") {
          ownershipGraph.classList.remove("dim-others");
          ownershipGraph.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
        } else {
          ownershipGraph.classList.add("dim-others");
          ownershipGraph.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
          ownershipGraph.querySelectorAll(`[data-region="${location}"], [data-node="${location}"]`).forEach((el) => {
            el.classList.add("is-active");
          });
          ownershipGraph.querySelectorAll(".edge").forEach((edge) => {
            const owners = (edge.dataset.edge || "").split(" ");
            if (owners.includes(location)) {
              edge.classList.add("is-active");
            }
          });
        }

        ownershipCaption.textContent = locationDescriptions[location];
      });
    });
  }

  const pathGraph = document.querySelector("[data-path-graph]");
  const pathCaption = document.querySelector("[data-path-caption]");
  if (pathGraph && pathCaption) {
    const pathDescriptions = {
      a1: "Starting at A1: the first step is local, then the path crosses into Location B and later into Location C, which is where runtime coordination starts to matter.",
      b1: "Starting at B1: the first useful work stays inside Location B, then the frontier expands outward toward Location C.",
      c1: "Starting at C1: most nearby work is local first, but any global traversal that flows backward or outward still needs remote coordination."
    };

    const pathMap = {
      a1: ["a1", "a2", "b1", "b2", "c1"],
      b1: ["b1", "b2", "c1"],
      c1: ["c1", "c2"]
    };

    document.querySelectorAll("[data-path-source]").forEach((button) => {
      button.addEventListener("click", () => {
        const source = button.dataset.pathSource;
        document.querySelectorAll("[data-path-source]").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");

        pathGraph.classList.add("dim-others");
        pathGraph.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));

        const activeNodes = new Set(pathMap[source]);
        pathGraph.querySelectorAll(".path-node").forEach((node) => {
          if (activeNodes.has(node.dataset.id)) {
            node.classList.add("is-active");
          }
        });

        pathGraph.querySelectorAll(".path-edge").forEach((edge) => {
          const owners = (edge.dataset.path || "").split(" ");
          if (owners.every((nodeId) => activeNodes.has(nodeId))) {
            edge.classList.add("is-active");
          }
        });

        pathCaption.textContent = pathDescriptions[source];
      });
    });
  }

  const paperTimeline = document.querySelector("[data-paper-timeline]");
  const paperCaption = document.querySelector("[data-paper-caption]");
  if (paperTimeline && paperCaption) {
    const themeDescriptions = {
      all: "Showing all themes. The early papers define the vocabulary; later work pushes performance, irregularity, and graph-specific execution strategies.",
      core: "Core abstractions focus on the programming model itself: runtime support, views, and container methodology.",
      graph: "The graph theme shows how STAPL's abstractions become concrete graph systems with specialized synchronization and communication ideas.",
      runtime: "The runtime and composition theme emphasizes how semantic information and dataflow structure guide execution choices."
    };

    document.querySelectorAll("[data-paper-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.paperFilter;
        document.querySelectorAll("[data-paper-filter]").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");

        if (filter === "all") {
          paperTimeline.classList.remove("dim-others");
          paperTimeline.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
        } else {
          paperTimeline.classList.add("dim-others");
          paperTimeline.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
          paperTimeline.querySelectorAll(".timeline-node").forEach((node) => {
            const themes = (node.dataset.theme || "").split(" ");
            if (themes.includes(filter)) {
              node.classList.add("is-active");
            }
          });
        }

        paperCaption.textContent = themeDescriptions[filter];
      });
    });
  }

  const skeletonViz = document.querySelector("[data-skeleton-viz]");
  const skeletonCaption = document.querySelector("[data-skeleton-caption]");
  if (skeletonViz && skeletonCaption) {
    const stageDescriptions = {
      spec: "Specification view: think in terms of reusable skeletons like `map`, `zip`, and `reduce`, not raw message passing.",
      graph: "Dataflow view: the paper models computation as parametric dependencies, so composition becomes an explicit graph of input-output relationships.",
      exec: "Execution view: STAPL's PARAGRAPH engine can execute this graph while overlapping graph creation, communication, and computation instead of forcing a global barrier after every stage."
    };

    document.querySelectorAll("[data-skeleton-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const step = button.dataset.skeletonStep;
        document.querySelectorAll("[data-skeleton-step]").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        skeletonViz.querySelectorAll(".skeleton-stage").forEach((stage) => {
          stage.classList.toggle("hidden", stage.dataset.stage !== step);
        });
        skeletonCaption.textContent = stageDescriptions[step];
      });
    });
  }
});
