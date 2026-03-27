# STAPL Memory Studio

Interactive teaching material for learning STAPL, with a special focus on memory-model intuition and links back to familiar C++ and coursework topics.

## Site contents

- `site/memory-model.html`: deep explanation of distributed-memory reasoning in STAPL
- `site/cpp-connections.html`: bridges to STL, data structures, operating systems, architecture, and parallel programming
- `site/references.html`: public source list

## Deployment

Pushes to `main` trigger `.github/workflows/deploy-pages.yml`, which deploys the static HTML site in `site/` to GitHub Pages.
