import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, ToastMessage } from '../../systems/toast';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-slate-100 bg-white min-w-[300px]"
          >
            {t.type === 'success' && <CheckCircle className="text-emerald-500 shrink-0" size={20} />}
            {t.type === 'error' && <AlertCircle className="text-red-500 shrink-0" size={20} />}
            {t.type === 'warning' && <AlertTriangle className="text-amber-500 shrink-0" size={20} />}
            {t.type === 'info' && <Info className="text-[#0047AB] shrink-0" size={20} />}
            <span className="text-sm font-medium text-slate-700 flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)}
  className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
  aria-label="Dismiss notification"
  >
              <X size={16} />
</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
