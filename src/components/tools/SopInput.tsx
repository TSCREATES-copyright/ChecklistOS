import React, { useState, useEffect } from 'react';
import { Play, Trash2, Activity } from 'lucide-react';
import { parseSOP } from '../../systems/sopParser';

export function SopInput({ onGenerate, initialText = '', onChange }: { onGenerate: (text: string) => void, initialText?: string, onChange?: (text: string) => void }) {
  const [text, setText] = useState(initialText);
  const [stats, setStats] = useState({ tasks: 0, subtasks: 0, cautions: 0 });

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.trim()) {
        const parsed = parseSOP(text);
        setStats({
          tasks: parsed.filter(s => s.type === 'task').length,
          subtasks: parsed.filter(s => s.type === 'subtask').length,
          cautions: parsed.filter(s => s.type === 'caution').length,
        });
      } else {
        setStats({ tasks: 0, subtasks: 0, cautions: 0 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange?.(newText);
  };

  const handleGenerate = () => {
    if (text.trim()) {
      onGenerate(text);
    }
  };

  const handleClear = () => {
    setText('');
    onChange?.('');
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden shadow-inner focus-within:border-[#0047AB] focus-within:ring-4 focus-within:ring-[#0047AB]/10 transition-all duration-200">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Paste your SOP here...&#10;&#10;Example:&#10;# Morning Routine&#10;- Check emails&#10;  - Reply to urgent ones&#10;- Review daily metrics&#10;Caution: Don't spend more than 30 mins"
          className="w-full h-full resize-none p-5 outline-none text-[13px] text-slate-700 font-mono leading-relaxed bg-transparent"
        />
        <div className="h-10 bg-white border-t border-slate-200 flex items-center px-4 shrink-0">
          {text.trim() ? (
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <Activity size={14} className="text-[#0047AB]" />
              <span>{stats.tasks} Tasks</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{stats.subtasks} Sub</span>
              {stats.cautions > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-amber-600">{stats.cautions} Cautions</span>
                </>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400">Ready for input...</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleClear}
          disabled={!text.trim()}
          className="px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Clear Input"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={handleGenerate}
          disabled={!text.trim()}
          className="flex-1 py-3 bg-[#0047AB] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <Play size={18} />
          Generate Checklist
        </button>
      </div>
    </div>
  );
}
