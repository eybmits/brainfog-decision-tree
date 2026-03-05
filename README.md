# Brainfog Decision Tree

An animated decision-tree prototype for exploring practical first-line interventions for brainfog.

Live demo:

- `https://eybmits.github.io/brainfog-decision-tree/`

Repository:

- `https://github.com/eybmits/brainfog-decision-tree`

## What This Is

This project turns a static symptom checklist into a visual path.

Instead of showing every question as a form, the app keeps the tree visible and moves one active card through the structure:

- `Optimized` continues down the green branch
- `Not optimized` stops the tree and opens the first practical intervention

The current MVP covers six baseline checkpoints:

1. Sleep
2. Omega-3
3. Hydration
4. Movement
5. Stress regulation
6. B12 / Iron

## Core Design Choices

- One active node is expanded at a time to keep the tree legible on real screen sizes.
- Compact preview nodes keep the full structure visible without card overlap.
- The decision tree is data-driven from one local content source.
- Motion is meaningful rather than decorative: path drawing, node emphasis, and clear state shifts.
- Reduced-motion users still get a clean, usable flow.

## Stack

- React 19
- Vite 7
- TypeScript
- Framer Motion
- Fontsource (`Newsreader`, `Manrope`)

## Project Structure

```text
src/
  App.tsx                    App state machine and page composition
  data/tree.ts               Decision tree content and node ordering
  components/TreeCanvas.tsx  Visible tree, active card, and path animation
  components/*Panel.tsx      Intervention and completion side panels
  styles.css                 Editorial layout, tree geometry, and responsive styling
```

## Local Development

```bash
npm install
npm run dev
```

The app runs locally at `http://127.0.0.1:5173/`.

## Production Build

```bash
npm run build
```

The Vite build is configured for GitHub Pages under the repo path `/brainfog-decision-tree/`.

## Deployment

Deployment is handled through GitHub Pages via GitHub Actions.

- every push to `main` builds the site and publishes `dist/`
- the public URL is:
  `https://eybmits.github.io/brainfog-decision-tree/`
- in the GitHub repository settings, Pages should use `GitHub Actions` as the source

To verify the production build locally:

1. run `npm run build`
2. run `npm run preview`

See [docs/PROJECT_NOTES.md](/Users/superposition/Coding/brainfog/docs/PROJECT_NOTES.md) for implementation notes and extension ideas.
