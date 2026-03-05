import { motion, useReducedMotion } from 'framer-motion';
import type { DecisionNode } from '../data/tree';

type TreeCanvasProps = {
  nodes: DecisionNode[];
  currentNodeId: string | null;
  resolvedNodeIds: string[];
  stoppedNodeId: string | null;
  isComplete: boolean;
  isTransitioning: boolean;
  onAnswer: (answer: 'optimized' | 'not_optimized') => void;
};

type PreviewState = 'preview' | 'resolved' | 'blocked';

type PreviewNodeProps = {
  node: DecisionNode;
  index: number;
  state: PreviewState;
};

type ActiveNodeCardProps = {
  node: DecisionNode;
  isTransitioning: boolean;
  onAnswer: (answer: 'optimized' | 'not_optimized') => void;
};

const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 100;

function buildPath(from: DecisionNode, to: DecisionNode) {
  const startX = from.positionVariant.x;
  const startY = from.positionVariant.y;
  const endX = to.positionVariant.x;
  const endY = to.positionVariant.y;
  const controlX = (startX + endX) / 2 + 5;
  const controlY = (startY + endY) / 2;

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

function buildInterventionPath(node: DecisionNode) {
  const startX = node.positionVariant.x + 0.8;
  const startY = node.positionVariant.y;
  const endX = startX + 14;
  const endY = startY - 5;
  const controlX = startX + 7;
  const controlY = startY - 10;

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

function PreviewNode({ node, index, state }: PreviewNodeProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`tree-preview is-${state}`}
      style={{
        left: `${node.positionVariant.x}%`,
        top: `${node.positionVariant.y}%`,
      }}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
      animate={
        reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              scale: state === 'resolved' ? 1.01 : 1,
            }
      }
      transition={{
        duration: reduceMotion ? 0.16 : 0.42,
        delay: reduceMotion ? 0 : index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="tree-preview-step">{node.eyebrow}</span>
      <strong className="tree-preview-title">{node.title}</strong>
    </motion.div>
  );
}

function ActiveNodeCard({ node, isTransitioning, onAnswer }: ActiveNodeCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="active-node"
      style={
        {
          '--anchor-x': `${node.positionVariant.x}%`,
          '--anchor-y': `${node.positionVariant.y}%`,
        } as React.CSSProperties
      }
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, scale: 0.98 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.16 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="node-eyebrow">{node.eyebrow}</span>
      <h3>{node.title}</h3>
      <p>{node.prompt}</p>
      <div className="active-node-actions">
        <button
          type="button"
          className="node-button node-button-primary"
          onClick={() => onAnswer('optimized')}
          disabled={isTransitioning}
        >
          Optimized
        </button>
        <button
          type="button"
          className="node-button node-button-secondary"
          onClick={() => onAnswer('not_optimized')}
          disabled={isTransitioning}
        >
          Not optimized
        </button>
      </div>
    </motion.article>
  );
}

export function TreeCanvas({
  nodes,
  currentNodeId,
  resolvedNodeIds,
  stoppedNodeId,
  isComplete,
  isTransitioning,
  onAnswer,
}: TreeCanvasProps) {
  const reduceMotion = useReducedMotion();
  const activeNode = currentNodeId ? nodes.find((node) => node.id === currentNodeId) ?? null : null;
  const shouldShowActiveNode = Boolean(activeNode && !stoppedNodeId && !isComplete);

  return (
    <div className="tree-shell">
      <svg
        className="tree-lines"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {nodes.map((node) =>
          node.successNextId ? (
            <path
              key={`${node.id}-base`}
              d={buildPath(node, nodes.find((entry) => entry.id === node.successNextId)!)}
              className="tree-path tree-path-base"
            />
          ) : null,
        )}

        {nodes.map((node) => (
          <path
            key={`${node.id}-branch`}
            d={buildInterventionPath(node)}
            className={`tree-path tree-path-branch ${stoppedNodeId === node.id ? 'is-branch-active' : ''}`}
          />
        ))}

        {nodes.map((node) =>
          resolvedNodeIds.includes(node.id) && node.successNextId ? (
            <motion.path
              key={`${node.id}-active`}
              d={buildPath(node, nodes.find((entry) => entry.id === node.successNextId)!)}
              className="tree-path tree-path-active"
              initial={reduceMotion ? { opacity: 1 } : { pathLength: 0, opacity: 0.9 }}
              animate={reduceMotion ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.16 : 0.68, ease: [0.33, 1, 0.68, 1] }}
            />
          ) : null,
        )}

        {nodes.map((node) =>
          stoppedNodeId === node.id ? (
            <motion.path
              key={`${node.id}-blocked`}
              d={buildInterventionPath(node)}
              className="tree-path tree-path-alert"
              initial={reduceMotion ? { opacity: 1 } : { pathLength: 0, opacity: 0.9 }}
              animate={reduceMotion ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.16 : 0.5, ease: [0.33, 1, 0.68, 1] }}
            />
          ) : null,
        )}
      </svg>

      {nodes.map((node) => {
        const state = stoppedNodeId === node.id
          ? 'blocked'
          : resolvedNodeIds.includes(node.id) || isComplete
            ? 'resolved'
            : 'preview';
        const isActive = shouldShowActiveNode && activeNode?.id === node.id;

        return (
          <span
            key={`${node.id}-point`}
            className={`tree-point is-${isActive ? 'active' : state}`}
            style={{
              left: `${node.positionVariant.x}%`,
              top: `${node.positionVariant.y}%`,
            }}
            aria-hidden="true"
          />
        );
      })}

      {nodes.map((node, index) => {
        const isActive = shouldShowActiveNode && activeNode?.id === node.id;

        if (isActive) {
          return null;
        }

        const state: PreviewState = stoppedNodeId === node.id
          ? 'blocked'
          : resolvedNodeIds.includes(node.id) || isComplete
            ? 'resolved'
            : 'preview';

        return <PreviewNode key={node.id} node={node} index={index} state={state} />;
      })}

      {shouldShowActiveNode && activeNode ? (
        <ActiveNodeCard
          node={activeNode}
          isTransitioning={isTransitioning}
          onAnswer={onAnswer}
        />
      ) : null}
    </div>
  );
}
