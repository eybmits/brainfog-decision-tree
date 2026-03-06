import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type CompletionPanelProps = {
  visible: boolean;
  onRestart: () => void;
};

export function CompletionPanel({ visible, onRestart }: CompletionPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {visible ? (
        <motion.aside
          key="completion"
          className="side-card side-card-success"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          <span className="side-card-kicker">Path complete</span>
          <h3>The visible baseline pass looks clear</h3>
          <p>
            In this route, the high-signal day-to-day basics are already marked as
            covered. That does not rule out every other cause, but the most obvious
            baseline levers are no longer the weak link.
          </p>
          <div className="panel-callout panel-callout-success">
            <span>What this result means</span>
            <strong>The tree did not find an early baseline break point.</strong>
          </div>
          <div className="side-card-block">
            <span>What this MVP proves</span>
            <p>
              A brainfog check can feel like a cinematic, visible decision system
              instead of a static questionnaire or a wall of text.
            </p>
          </div>
          <p className="panel-footnote">
            If symptoms still persist in a real workflow, the next layer would usually be deeper diagnostics, not more guesswork.
          </p>
          <button type="button" className="ghost-button" onClick={onRestart}>
            Re-run the route
          </button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
