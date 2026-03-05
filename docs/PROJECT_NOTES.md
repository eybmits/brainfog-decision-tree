# Project Notes

## Product Intent

The prototype is intentionally narrow:

- show an animated decision tree instead of a long intake form
- make the active branch visually obvious
- stop at the first unresolved baseline factor
- return one compact, practical intervention instead of a wall of text

This is a UI prototype, not a diagnostic tool.

## Interaction Model

The app has five states:

- `intro`
- `question`
- `advancing`
- `intervention`
- `complete`

The active card is the only node that exposes full prompt text and decision buttons.
All other nodes remain visible as compact previews so the structure still reads like a tree.

## Content Model

The tree is stored in `src/data/tree.ts`.

Each `DecisionNode` includes:

- stable `id`
- display `eyebrow`
- `title`
- question `prompt`
- `successNextId`
- stage anchor position via `positionVariant`
- intervention copy (`whyItMatters`, `nextStep`, `improvementSignal`)

This keeps the flow extensible without hard-coding each question into the component tree.

## Layout Strategy

The first version used full-size cards for every node. That looked good in isolation but broke at realistic widths because the cards overlapped.

The current version fixes that by splitting tree nodes into:

- one expanded active card
- compact preview nodes for future or completed checkpoints
- point markers for the path spine

That preserves the original visual idea while making the interface usable.

## Extension Ideas

- support true left/right branching instead of stopping at the first unresolved factor
- externalize the tree content into JSON or CMS-managed content
- add richer intervention details and evidence links
- persist progress in URL state or local storage
- add analytics around the most common stop nodes

