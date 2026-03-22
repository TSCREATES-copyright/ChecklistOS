import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertCircle } from 'lucide-react';

export function ConfirmDeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setConfirming(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center h-7">
      <AnimatePresence mode="wait">
        {!confirming ? (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(true);
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded shadow-sm transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </motion.button>
        ) : (
          <motion.button
            key="confirm"
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setConfirming(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-500 text-white rounded shadow-sm hover:bg-red-600 transition-colors text-xs font-medium"
          >
            <AlertCircle size={12} />
            Confirm
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
