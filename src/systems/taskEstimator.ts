import { StepType } from '../types/checklist';
import { monetizationManager } from './monetizationManager';

const VERB_WEIGHTS: Record<string, number> = {
  'review': 5,
  'audit': 5,
  'analyze': 5,
  'deploy': 10,
  'install': 10,
  'configure': 8,
  'test': 5,
  'verify': 3,
  'check': 1,
  'click': 1,
  'read': 2,
  'write': 5,
  'create': 5,
  'update': 3,
  'delete': 2,
  'remove': 2,
  'wait': 5,
};

const MODIFIER_MULTIPLIERS: Record<string, number> = {
  'carefully': 1.5,
  'thoroughly': 1.5,
  'quickly': 0.5,
  'briefly': 0.5,
  'deeply': 2.0,
};

export function estimateTaskTime(text: string, type: StepType): number {
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  
  let baseTime = 1;
  if (type === 'task') baseTime = 3;
  if (type === 'subtask') baseTime = 1;
  if (type === 'caution') baseTime = 2;

  let estimatedTime = baseTime + Math.floor(wordCount / 10);

  if (monetizationManager.isPro()) {
    let verbTime = 0;
    let multiplier = 1.0;

    for (const word of words) {
      // Remove punctuation
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      if (VERB_WEIGHTS[cleanWord]) {
        verbTime += VERB_WEIGHTS[cleanWord];
      }
      if (MODIFIER_MULTIPLIERS[cleanWord]) {
        multiplier *= MODIFIER_MULTIPLIERS[cleanWord];
      }
    }

    if (verbTime > 0) {
      estimatedTime = Math.max(estimatedTime, Math.ceil(verbTime * multiplier));
    }
  }

  return estimatedTime;
}
