import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CompletionPanel } from './components/CompletionPanel';
import { InterventionPanel } from './components/InterventionPanel';
import { TreeCanvas } from './components/TreeCanvas';
import { decisionTree } from './data/tree';

type AppPhase = 'intro' | 'question' | 'advancing' | 'intervention' | 'complete';

const FIRST_NODE_ID = decisionTree[0]?.id ?? null;

export function App() {
  const reduceMotion = useReducedMotion();
  const treeSectionRef = useRef<HTMLElement | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<AppPhase>('intro');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(FIRST_NODE_ID);
  const [resolvedNodeIds, setResolvedNodeIds] = useState<string[]>([]);
  const [stoppedNodeId, setStoppedNodeId] = useState<string | null>(null);

  const currentNode = decisionTree.find((node) => node.id === currentNodeId) ?? null;
  const stoppedNode = decisionTree.find((node) => node.id === stoppedNodeId) ?? null;
  const currentStep = currentNode ? decisionTree.findIndex((node) => node.id === currentNode.id) + 1 : decisionTree.length;
  const nextNode = currentNode?.successNextId
    ? decisionTree.find((node) => node.id === currentNode.successNextId) ?? null
    : null;
  const isStarted = phase !== 'intro';
  const isTransitioning = phase === 'advancing';
  const isComplete = phase === 'complete';

  useEffect(() => {
    if (!isStarted || !treeSectionRef.current) {
      return;
    }

    treeSectionRef.current.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [isStarted, reduceMotion]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  function clearAdvanceTimer() {
    if (!advanceTimerRef.current) {
      return;
    }

    window.clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
  }

  function resetFlow(nextPhase: AppPhase) {
    clearAdvanceTimer();
    setPhase(nextPhase);
    setCurrentNodeId(FIRST_NODE_ID);
    setResolvedNodeIds([]);
    setStoppedNodeId(null);
  }

  function handleStart() {
    resetFlow('question');
  }

  function handleRestart() {
    resetFlow('question');
  }

  function handleAnswer(answer: 'optimized' | 'not_optimized') {
    if (!currentNode || phase === 'advancing' || phase === 'intervention' || phase === 'complete') {
      return;
    }

    if (answer === 'not_optimized') {
      setStoppedNodeId(currentNode.id);
      setPhase('intervention');
      return;
    }

    setResolvedNodeIds((existing) => [...existing, currentNode.id]);
    setStoppedNodeId(null);
    setPhase('advancing');

    clearAdvanceTimer();
    advanceTimerRef.current = window.setTimeout(() => {
      if (!currentNode.successNextId) {
        setCurrentNodeId(null);
        setPhase('complete');
        advanceTimerRef.current = null;
        return;
      }

      setCurrentNodeId(currentNode.successNextId);
      setPhase('question');
      advanceTimerRef.current = null;
    }, reduceMotion ? 100 : 760);
  }

  const liveMessage = phase === 'intervention'
    ? `${stoppedNode?.title ?? 'Intervention'} is not optimized yet. The intervention card is now visible.`
    : isComplete
      ? 'All baseline questions are marked as optimized.'
      : currentNode
        ? `Current question: ${currentNode.title}.`
        : 'The tree has started.';

  const guideTitle = isTransitioning
    ? 'Following the next green branch'
    : `Step ${currentStep} of ${decisionTree.length}`;

  const guideFocus = isTransitioning && currentNode && nextNode
    ? `The path is moving from ${currentNode.title} to ${nextNode.title}.`
    : `${currentNode?.title ?? 'The tree'} is the current baseline checkpoint.`;

  return (
    <main className="page-shell">
      <p className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      <section className="hero-section">
        <motion.div
          className="hero-card"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.16 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero-kicker">Brainfog Decision Tree</span>
          <h1>A visual path through the first brainfog interventions.</h1>
          <p className="hero-copy">
            This MVP turns a checklist into a living decision tree. Each optimized
            factor pushes the path deeper down the branch. The first weak point stops
            the tree and opens the next intervention immediately.
          </p>
          <div className="hero-actions">
            <button type="button" className="hero-button" onClick={handleStart}>
              Start tree
            </button>
            <p className="hero-note">
              Prototype for orientation, not medical advice.
            </p>
          </div>
        </motion.div>
      </section>

      {isStarted ? (
        <section className="experience-section" ref={treeSectionRef}>
          <div className="experience-header">
            <div>
              <span className="section-kicker">Visible path</span>
              <h2>Does this person have brainfog, and are the obvious basics already covered?</h2>
            </div>
            <p>
              One active card, compact preview nodes, and a clearly marked route
              through the tree.
            </p>
          </div>

          <div className="experience-grid">
            <TreeCanvas
              nodes={decisionTree}
              currentNodeId={currentNodeId}
              resolvedNodeIds={resolvedNodeIds}
              stoppedNodeId={stoppedNodeId}
              isComplete={isComplete}
              isTransitioning={isTransitioning}
              onAnswer={handleAnswer}
            />

            <div className="side-panel">
              {(phase === 'question' || phase === 'advancing') && currentNode ? (
                <motion.aside
                  className="side-card side-card-neutral"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.16 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                  key={isTransitioning ? `${currentNode.id}-moving` : currentNode.id}
                >
                  <span className="side-card-kicker">Tree guide</span>
                  <h3>{guideTitle}</h3>
                  <p>
                    Only the active node expands. Smaller nodes keep the full route
                    visible, so the interface still feels like a tree instead of a form.
                  </p>
                  <div className="progress-meter" aria-hidden="true">
                    <span
                      className="progress-meter-fill"
                      style={{
                        width: `${Math.max(10, (resolvedNodeIds.length / decisionTree.length) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="side-card-block">
                    <span>Current focus</span>
                    <p>{guideFocus}</p>
                  </div>
                  <div className="side-card-block">
                    <span>Path logic</span>
                    <p>
                      <strong>Optimized</strong> continues down the green branch.
                      <strong> Not optimized</strong> stops the tree and opens the first
                      practical intervention.
                    </p>
                  </div>
                </motion.aside>
              ) : null}

              <InterventionPanel
                node={phase === 'intervention' ? stoppedNode : null}
                onRestart={handleRestart}
              />
              <CompletionPanel visible={isComplete} onRestart={handleRestart} />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
