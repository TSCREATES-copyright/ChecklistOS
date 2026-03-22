import { Checklist } from '../types/checklist';

export function exportChecklist(checklist: Checklist, format: 'markdown' | 'json' = 'markdown') {
  let content = '';
  let mimeType = '';
  let extension = '';

  if (format === 'json') {
    content = JSON.stringify(checklist, null, 2);
    mimeType = 'application/json';
    extension = 'json';
  } else {
    content = `# ${checklist.title}\n\n`;
    content += `*Estimated Time: ${checklist.steps.reduce((acc, s) => acc + s.estimatedMinutes, 0)} minutes*\n\n`;
    
    checklist.steps.forEach(step => {
      const indent = step.type === 'subtask' ? '  ' : '';
      const checkbox = `[${step.completed ? 'x' : ' '}]`;
      const prefix = step.type === 'caution' ? '⚠️ **CAUTION:** ' : '';
      content += `${indent}- ${checkbox} ${prefix}${step.text}\n`;
    });
    
    mimeType = 'text/markdown';
    extension = 'md';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${checklist.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
