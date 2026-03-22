import React from 'react';
import { Checklist } from '../../types/checklist';
import { FileText, Play, Copy } from 'lucide-react';
import { ConfirmDeleteButton } from '../ui/ConfirmDeleteButton';

export function TemplateDrawer({ templates, onLoad, onDelete, onDuplicate }: { templates: Checklist[], onLoad: (c: Checklist) => void, onDelete: (id: string) => void, onDuplicate: (c: Checklist) => void }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved Templates</h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{templates.length}</span>
      </div>
      
      {templates.length === 0 ? (
        <div className="text-sm text-slate-400 text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          No templates saved yet.<br/>Generate a checklist and click Save.
        </div>
      ) : (
        <div className="space-y-2.5">
          {templates.map(template => (
            <div key={template.id} className="group relative flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0047AB]/30 transition-all duration-200 overflow-hidden">
              {/* Subtle accent line on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0047AB] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 min-w-0 flex-1 pl-1">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-[#0047AB] group-hover:bg-blue-50 transition-colors">
                  <FileText size={16} />
                </div>
                <div className="min-w-0 pr-2">
                  <div className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#0047AB] transition-colors">{template.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{template.steps.length} steps</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{template.steps.reduce((acc, s) => acc + s.estimatedMinutes, 0)}m est.</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 bg-white pl-2">
                <button onClick={() => onLoad(template)} className="p-1.5 text-slate-400 hover:text-[#3EB489] hover:bg-emerald-50 rounded-md transition-colors" title="Load Template">
                  <Play size={16} />
                </button>
                <button onClick={() => onDuplicate(template)} className="p-1.5 text-slate-400 hover:text-[#0047AB] hover:bg-blue-50 rounded-md transition-colors" title="Duplicate Template">
                  <Copy size={16} />
                </button>
                <ConfirmDeleteButton onDelete={() => onDelete(template.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

