import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { DecisionNode } from '../data/tree';

type InterventionPanelProps = {
  node: DecisionNode | null;
  onRestart: () => void;
};

export function InterventionPanel({ node, onRestart }: InterventionPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {node ? (
        <motion.aside
          key={node.id}
          className="side-card side-card-alert"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
        >
          <span className="side-card-kicker">Intervention</span>
          <h3>{node.title} is the first baseline to fix</h3>
          <p>
            The tree stops here on purpose. Going deeper is less useful until this
            factor becomes stable enough to count as covered.
          </p>
          <div className="panel-callout">
            <span>Why the route stopped</span>
            <strong>{node.intervention.whyItMatters}</strong>
          </div>
          <div className="side-card-block">
            <span>Next small step</span>
            <p>{node.intervention.nextStep}</p>
          </div>
          <div className="side-card-block">
            <span>What improvement looks like</span>
            <p>{node.intervention.improvementSignal}</p>
          </div>
          <p className="panel-footnote">
            Once this area looks genuinely better, rerun the tree and continue down the route.
          </p>
          <button type="button" className="ghost-button" onClick={onRestart}>
            Run the tree again
          </button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
