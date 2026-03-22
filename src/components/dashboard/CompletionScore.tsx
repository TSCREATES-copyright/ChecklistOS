import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValueEvent, useMotionValue } from 'motion/react';
import { Checklist } from '../../types/checklist';


export function CompletionScore({ checklist }: { checklist: Checklist | null }) {
  const score = checklist?.completionScore || 0;

  const motionScore = useMotionValue(0);
  const springScore = useSpring(motionScore, { stiffness: 100, damping: 20 });

  const displayScore = useTransform(springScore, (latest) => Math.round(latest));
  const [scoreText, setScoreText] = useState(Math.round(score));
  
 // Update motion value when score changes
  useEffect(() => {
    motionScore.set(score);
  }, [score, motionScore]);

  // Sync motion value to state so React can render
  useMotionValueEvent(displayScore, "change", (latest) => {
    setScoreText(latest);
  });
if (!checklist) {
    return (
      <div className="text-center py-4">
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f8fafc" strokeWidth="6" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-light text-slate-300">0%</span>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Progress</div>
      </div>
    );
  }
  
  const totalTime = checklist.steps.reduce((acc, s) => acc + s.estimatedMinutes, 0);
  const completedTime = checklist.steps.filter(s => s.completed).reduce((acc, s) => acc + s.estimatedMinutes, 0);
  const remainingTime = totalTime - completedTime;
  const isComplete = scoreText >= 100;

   return (
    <div className="flex flex-col items-center py-2">
      <motion.div 
        className="relative w-36 h-36 flex items-center justify-center mb-6"
        animate={isComplete ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {isComplete && (
          <div className="absolute inset-0 bg-[#3EB489] blur-2xl opacity-20 rounded-full" />
        )}
        
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke={isComplete ? "#3EB489" : "#0047AB"} 
            strokeWidth="6" 
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
            className="transition-all duration-700 ease-out"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span 
            className={`text-4xl font-light tracking-tight ${isComplete ? 'text-[#3EB489]' : 'text-slate-800'}`}
          >
            {scoreText}%
          </motion.span>
        </div>
      </motion.div>

      <div className="w-full space-y-4 px-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Tasks Completed</span>
          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {checklist.steps.filter(s => s.completed).length} / {checklist.steps.length}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Est. Remaining</span>
          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {remainingTime}m
          </span>
        </div>
      </div>
    </div>
  );
}