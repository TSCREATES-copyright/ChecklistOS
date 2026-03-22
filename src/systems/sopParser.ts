import { ChecklistStep, StepType } from '../types/checklist';
import { generateId } from '../utils/idGenerator';
import { estimateTaskTime } from './taskEstimator';

export function parseSOP(text: string): ChecklistStep[] {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const steps: ChecklistStep[] = [];
  let currentParentId: string | undefined = undefined;

  lines.forEach(line => {
    const isIndented = line.startsWith('  ') || line.startsWith('\t');
    const cleanText = line.replace(/^[-*#\s]+/, '').trim();
    
    if (!cleanText) return;

    let type: StepType = 'task';
    if (cleanText.toLowerCase().startsWith('caution') || cleanText.toLowerCase().startsWith('warning') || line.trim().startsWith('!')) {
      type = 'caution';
    } else if (isIndented) {
      type = 'subtask';
    }

    // FIX: If it's a subtask but there is no active parent, promote it to a main task to prevent orphaned steps
    if (type === 'subtask' && !currentParentId) {
      type = 'task';
    }

    const step: ChecklistStep = {
      id: generateId(),
      text: cleanText,
      type,
      estimatedMinutes: estimateTaskTime(cleanText, type),
      completed: false,
      blockers: [],
      parentId: type === 'subtask' ? currentParentId : undefined,
    };

    // FIX: Only update the parent ID if the current step is a main task (not a subtask or caution)
    if (type === 'task') {
      currentParentId = step.id;
    }

    steps.push(step);
  });

  return steps;
}
