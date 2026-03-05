export type InterventionContent = {
  whyItMatters: string;
  nextStep: string;
  improvementSignal: string;
};

export type PositionVariant = {
  x: number;
  y: number;
};

export type DecisionNode = {
  id: string;
  eyebrow: string;
  title: string;
  prompt: string;
  successNextId: string | null;
  positionVariant: PositionVariant;
  intervention: InterventionContent;
};

export const decisionTree: DecisionNode[] = [
  {
    id: 'sleep',
    eyebrow: 'Step 01',
    title: 'Sleep',
    prompt: 'Is sleep timing, duration, and quality genuinely optimized for at least two weeks?',
    successNextId: 'omega3',
    positionVariant: { x: 70, y: 16 },
    intervention: {
      whyItMatters: 'Short, inconsistent, or fragmented sleep is one of the most common drivers of brainfog.',
      nextStep: 'Test one week of fixed sleep and wake times, a darker room, no late caffeine, and early morning light exposure.',
      improvementSignal: 'The head feels less heavy in the morning, activation is faster, and attention is clearer before noon.',
    },
  },
  {
    id: 'omega3',
    eyebrow: 'Step 02',
    title: 'Omega-3',
    prompt: 'Is Omega-3 consistently covered through diet or supplementation?',
    successNextId: 'hydration',
    positionVariant: { x: 58, y: 31 },
    intervention: {
      whyItMatters: 'Low Omega-3 status can affect cognitive endurance, inflammatory balance, and mental sharpness.',
      nextStep: 'For this MVP, verify a reliable intake through fatty fish or a consistent supplement routine.',
      improvementSignal: 'Mental effort feels smoother, attention lasts longer, and energy is steadier across the day.',
    },
  },
  {
    id: 'hydration',
    eyebrow: 'Step 03',
    title: 'Hydration',
    prompt: 'Are fluids and electrolytes handled deliberately and consistently during the day?',
    successNextId: 'movement',
    positionVariant: { x: 47, y: 46 },
    intervention: {
      whyItMatters: 'Even mild dehydration can feel like brainfog, mental drag, or pressure in the head.',
      nextStep: 'Start with a simple routine: water early, visible access during the day, and electrolytes on longer or hotter days.',
      improvementSignal: 'Less head pressure, steadier alertness, and fewer afternoon drop-offs.',
    },
  },
  {
    id: 'movement',
    eyebrow: 'Step 04',
    title: 'Movement',
    prompt: 'Is regular movement, including short activation breaks, already part of the baseline?',
    successNextId: 'stress',
    positionVariant: { x: 37, y: 61 },
    intervention: {
      whyItMatters: 'Too little movement often weakens circadian signaling, circulation, and mental freshness.',
      nextStep: 'Test a minimum dose: one daily walk plus short movement windows between focused work blocks.',
      improvementSignal: 'The mind clears faster after moving and task switching feels less sticky.',
    },
  },
  {
    id: 'stress',
    eyebrow: 'Step 05',
    title: 'Stress regulation',
    prompt: 'Have chronic stress, overstimulation, and lack of recovery already been addressed on purpose?',
    successNextId: 'micronutrients',
    positionVariant: { x: 28, y: 76 },
    intervention: {
      whyItMatters: 'Chronic stress consumes attention, degrades sleep quality, and keeps the nervous system on alert.',
      nextStep: 'Start with one practical intervention: more recovery buffers, fewer context switches, and a short evening downshift ritual.',
      improvementSignal: 'More inner calm, less overload, and a clearer head under the same workload.',
    },
  },
  {
    id: 'micronutrients',
    eyebrow: 'Step 06',
    title: 'B12 / Iron',
    prompt: 'Have B12, iron status, and related baseline markers already been checked or optimized?',
    successNextId: null,
    positionVariant: { x: 20, y: 89 },
    intervention: {
      whyItMatters: 'Low stores or functional deficiencies can show up directly as brainfog, fatigue, and poor resilience.',
      nextStep: 'If this area is still open, the next sensible move is clarification rather than guessing.',
      improvementSignal: 'Baseline energy rises, resilience improves, and the mental haze feels less diffuse.',
    },
  },
];
