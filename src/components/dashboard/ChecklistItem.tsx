import React from 'react';
import { ChecklistStep } from '../../types/checklist';
import { Check, Clock, AlertTriangle, GripVertical } from 'lucide-react';
import { motion } from 'motion/react';

export const ChecklistItem = React.memo(({ step, onToggle, isSubstep = false, dragHandleProps }: { step: ChecklistStep, onToggle: (id: string) => void, isSubstep?: boolean, dragHandleProps?: any }) => {
  const isCaution = step.type === 'caution';

  const handleToggle = React.useCallback(() => {
    onToggle(step.id);
  }, [onToggle, step.id]);

  return (
    <div 
      className={`group flex items-start gap-2 sm:gap-3 p-3 transition-all duration-200 ${isSubstep ? 'rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200' : 'hover:bg-slate-50'} ${step.completed ? 'opacity-50 grayscale-[0.5]' : ''} ${isCaution && !step.completed ? 'bg-amber-50/50' : ''}`}
    >
      <div 
        {...dragHandleProps}
        className="mt-0.5 shrink-0 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center w-5 h-5"
      >
        <GripVertical size={16} />
      </div>

      <div className="relative mt-0.5 shrink-0 w-5 h-5 cursor-pointer" onClick={handleToggle}>
        <div className={`absolute inset-0 rounded border flex items-center justify-center transition-all duration-300 ${
          step.completed 
            ? 'bg-[#3EB489] border-[#3EB489] text-white scale-95' 
            : isCaution 
              ? 'border-amber-400 bg-amber-100 text-amber-600' 
              : 'border-slate-300 bg-white group-hover:border-[#0047AB]/50'
        }`}>
          {step.completed && <Check size={14} strokeWidth={3} />}
          {isCaution && !step.completed && <AlertTriangle size={12} strokeWidth={3} />}
        </div>
        {step.completed && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded bg-[#3EB489]"
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0 relative cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center gap-2">
          <span className={`transition-colors duration-300 ${isSubstep ? 'text-sm text-slate-600' : 'text-base text-slate-800 font-semibold'} ${step.completed ? 'text-slate-400' : ''} break-words relative inline-block`}>
            {step.text}
            {step.completed && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-slate-400 origin-left"
              />
            )}
          </span>
        </div>
      </div>

      {!step.completed && (
        <div className={`shrink-0 flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-md transition-colors ${isCaution ? 'bg-amber-100/50 text-amber-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
          <Clock size={12} />
          {step.estimatedMinutes}m
        </div>
      )}
    </div>
  );
});
