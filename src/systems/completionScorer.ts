import { ChecklistStep } from '../types/checklist';

export function calculateCompletion(steps: ChecklistStep[]): number {
  if (steps.length === 0) return 0;
  
  // FIX: Use time-weighted scoring for deterministic progress accuracy
  const totalTime = steps.reduce((acc, step) => acc + step.estimatedMinutes, 0);
  if (totalTime === 0) return 0;

  const completedTime = steps.filter(s => s.completed).reduce((acc, step) => acc + step.estimatedMinutes, 0);
  
  return Math.round((completedTime / totalTime) * 100);
}
