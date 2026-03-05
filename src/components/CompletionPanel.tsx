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
          <h3>The baseline factors already look covered</h3>
          <p>
            In this demo, the major day-to-day interventions are already marked as
            optimized. That does not rule out every other cause, but the obvious
            basics have been cleared.
          </p>
          <div className="side-card-block">
            <span>What this MVP proves</span>
            <p>
              The structure shows how a brainfog check can feel like a visual,
              animated decision tree instead of a static questionnaire.
            </p>
          </div>
          <button type="button" className="ghost-button" onClick={onRestart}>
            Start over
          </button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
