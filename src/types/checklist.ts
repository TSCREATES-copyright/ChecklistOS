export type StepType = 'task' | 'subtask' | 'caution';

export interface ChecklistStep {
  id: string;
  text: string;
  type: StepType;
  estimatedMinutes: number;
  completed: boolean;
  blockers?: string[];
  parentId?: string;
}

export interface Checklist {
  id: string;
  title: string;
  steps: ChecklistStep[];
  completionScore: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  compactMode: boolean;
  autoSave: boolean;
}
