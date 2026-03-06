import { startTransition, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CompletionPanel } from './components/CompletionPanel';
import { InterventionPanel } from './components/InterventionPanel';
import { TreeCanvas } from './components/TreeCanvas';
import { decisionTree } from './data/tree';

type AppPhase = 'intro' | 'question' | 'advancing' | 'bubbling' | 'intervention' | 'complete';

const FIRST_NODE_ID = decisionTree[0]?.id ?? null;

export function App() {
  const reduceMotion = useReducedMotion();
  const treeSectionRef = useRef<HTMLElement | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<AppPhase>('intro');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(FIRST_NODE_ID);
  const [resolvedNodeIds, setResolvedNodeIds] = useState<string[]>([]);
  const [stoppedNodeId, setStoppedNodeId] = useState<string | null>(null);
  const [bubbleNodeId, setBubbleNodeId] = useState<string | null>(null);

  const currentNode = decisionTree.find((node) => node.id === currentNodeId) ?? null;
  const stoppedNode = decisionTree.find((node) => node.id === stoppedNodeId) ?? null;
  const resolvedNodes = decisionTree.filter((node) => resolvedNodeIds.includes(node.id));
  const currentStep = currentNode ? decisionTree.findIndex((node) => node.id === currentNode.id) + 1 : decisionTree.length;
  const nextNode = currentNode?.successNextId
    ? decisionTree.find((node) => node.id === currentNode.successNextId) ?? null
    : null;
  const coveragePercent = Math.round((resolvedNodeIds.length / decisionTree.length) * 100);
  const isStarted = phase !== 'intro';
  const isTransitioning = phase === 'advancing';
  const isBubblePhase = phase === 'bubbling';
  const isComplete = phase === 'complete';
  const isQuestionVisible = phase === 'question' || phase === 'advancing' || phase === 'bubbling';

  const heroHighlights = [
    {
      label: 'Baseline checkpoints',
      value: '06',
      description: 'Sleep to blood-marker basics, in one visible route.',
    },
    {
      label: 'Decision model',
      value: 'First no wins',
      description: 'The first open factor becomes the next intervention immediately.',
    },
    {
      label: 'Interaction style',
      value: 'Tree, not form',
      description: 'One active card, animated branches, and compact preview nodes.',
    },
  ];

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
    setBubbleNodeId(null);
  }

  function handleStart() {
    resetFlow('question');
  }

  function handleRestart() {
    resetFlow('question');
  }

  function handleAnswer(answer: 'optimized' | 'not_optimized') {
    if (!currentNode || phase === 'advancing' || phase === 'bubbling' || phase === 'intervention' || phase === 'complete') {
      return;
    }

    if (answer === 'not_optimized') {
      setBubbleNodeId(currentNode.id);
      setStoppedNodeId(null);
      setPhase('bubbling');
      clearAdvanceTimer();
      advanceTimerRef.current = window.setTimeout(() => {
        startTransition(() => {
          setStoppedNodeId(currentNode.id);
          setBubbleNodeId(null);
          setPhase('intervention');
        });
        advanceTimerRef.current = null;
      }, reduceMotion ? 120 : 920);
      return;
    }

    setResolvedNodeIds((existing) => [...existing, currentNode.id]);
    setStoppedNodeId(null);
    setBubbleNodeId(null);
    setPhase('advancing');

    clearAdvanceTimer();
    advanceTimerRef.current = window.setTimeout(() => {
      if (!currentNode.successNextId) {
        startTransition(() => {
          setCurrentNodeId(null);
          setPhase('complete');
        });
        advanceTimerRef.current = null;
        return;
      }

      startTransition(() => {
        setCurrentNodeId(currentNode.successNextId);
        setPhase('question');
      });
      advanceTimerRef.current = null;
    }, reduceMotion ? 100 : 840);
  }

  const liveMessage = phase === 'intervention'
    ? `${stoppedNode?.title ?? 'Intervention'} is not optimized yet. The intervention card is now visible.`
    : isBubblePhase
      ? `${currentNode?.title ?? 'This factor'} is the first open baseline factor. The next intervention is being highlighted.`
    : isComplete
      ? 'All baseline questions are marked as optimized.'
      : currentNode
        ? `Current question: ${currentNode.title}.`
        : 'The tree has started.';

  const guideTitle = isBubblePhase
    ? 'First open leverage point detected'
    : isTransitioning
    ? 'Following the next green branch'
    : `Step ${currentStep} of ${decisionTree.length}`;

  const guideFocus = isBubblePhase && currentNode
    ? `Pause at ${currentNode.title}. This is the first weak baseline factor, so the tree is opening the intervention instead of going deeper.`
    : isTransitioning && currentNode && nextNode
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
          <div className="hero-layout">
            <div className="hero-copy-column">
              <span className="hero-kicker">Brainfog Decision Tree</span>
              <h1>A more cinematic way to find the first brainfog lever.</h1>
              <p className="hero-copy">
                This prototype turns a symptom checklist into a guided visual route.
                Every strong yes extends the branch. The first no becomes the next
                concrete intervention, with a visible stop instead of a vague list of possibilities.
              </p>
              <div className="hero-actions">
                <button type="button" className="hero-button" onClick={handleStart}>
                  Enter decision tree
                </button>
                <p className="hero-note">
                  Visual triage prototype for orientation, not medical advice.
                </p>
              </div>
            </div>

            <div className="hero-rail">
              {heroHighlights.map((highlight, index) => (
                <motion.article
                  key={highlight.label}
                  className="hero-stat-card"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0.16 : 0.55,
                    delay: reduceMotion ? 0 : 0.12 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span>{highlight.label}</span>
                  <strong>{highlight.value}</strong>
                  <p>{highlight.description}</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="hero-ribbon" aria-label="Interface highlights">
            <span>Animated branches</span>
            <span>Focused intervention reveal</span>
            <span>Visible checkpoint memory</span>
            <span>Calmer yes / louder no feedback</span>
          </div>
        </motion.div>
      </section>

      {isStarted ? (
        <section className="experience-section" ref={treeSectionRef}>
          <div className="experience-header">
            <div>
              <span className="section-kicker">Visible path</span>
              <h2>Check the obvious basics first, then stop exactly where the route breaks.</h2>
            </div>
            <div className="experience-header-copy">
              <p>
                The tree stays visible at all times: one active checkpoint, compact
                future nodes, and a clear signal for the first open baseline factor.
              </p>
              <div className="experience-pill-row">
                <span className="experience-pill">{resolvedNodeIds.length}/{decisionTree.length} cleared</span>
                <span className="experience-pill">{coveragePercent}% baseline coverage</span>
                <span className="experience-pill">
                  {isBubblePhase ? 'Intervention reveal' : isTransitioning ? 'Route extending' : 'Decision live'}
                </span>
              </div>
            </div>
          </div>

          <div className="experience-grid">
            <TreeCanvas
              nodes={decisionTree}
              currentNodeId={currentNodeId}
              resolvedNodeIds={resolvedNodeIds}
              stoppedNodeId={stoppedNodeId}
              bubbleNodeId={bubbleNodeId}
              isComplete={isComplete}
              isTransitioning={isTransitioning}
              onAnswer={handleAnswer}
            />

            <div className="side-panel">
              {isQuestionVisible && currentNode ? (
                <motion.aside
                  className="side-card side-card-neutral"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.16 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                  key={isBubblePhase ? `${currentNode.id}-bubble` : isTransitioning ? `${currentNode.id}-moving` : currentNode.id}
                >
                  <span className="side-card-kicker">{isBubblePhase ? 'Signal locked' : 'Route status'}</span>
                  <h3>{guideTitle}</h3>
                  <p>
                    Only the active node expands. Smaller nodes preserve context, so the
                    experience still reads like a visual system instead of a flat intake form.
                  </p>
                  <div className="progress-meter" aria-hidden="true">
                    <span
                      className="progress-meter-fill"
                      style={{
                        width: `${Math.max(8, coveragePercent)}%`,
                      }}
                    />
                  </div>
                  <div className="guide-stat-row">
                    <div className="guide-stat">
                      <span>Coverage</span>
                      <strong>{resolvedNodeIds.length}/{decisionTree.length}</strong>
                    </div>
                    <div className="guide-stat">
                      <span>Current mode</span>
                      <strong>{isBubblePhase ? 'Reveal' : isTransitioning ? 'Advance' : 'Question'}</strong>
                    </div>
                  </div>
                  <div className="side-card-block">
                    <span>Current checkpoint</span>
                    <p>{guideFocus}</p>
                  </div>
                  <div className="side-card-block">
                    <span>Why it matters</span>
                    <p>{currentNode.intervention.whyItMatters}</p>
                  </div>
                  <div className="side-card-block">
                    <span>Cleared already</span>
                    {resolvedNodes.length > 0 ? (
                      <div className="tag-cloud" aria-label="Resolved checkpoints">
                        {resolvedNodes.map((node) => (
                          <span key={node.id} className="tag-cloud-item">
                            {node.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p>No checkpoint is cleared yet. The first strong yes will light up the route.</p>
                    )}
                  </div>
                  <div className="side-card-block">
                    <span>Decision logic</span>
                    <p>
                      <strong>Yes, covered</strong> extends the green branch.
                      <strong> No, still open</strong> triggers a bubble, stops the route,
                      and converts the checkpoint into the next focused intervention.
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
