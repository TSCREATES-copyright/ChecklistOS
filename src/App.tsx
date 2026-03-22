import React, { useState, useEffect, useCallback } from 'react';
import { SopInput } from './components/tools/SopInput';
import { ChecklistCanvas } from './components/dashboard/ChecklistCanvas';
import { CompletionScore } from './components/dashboard/CompletionScore';
import { TemplateDrawer } from './components/dashboard/TemplateDrawer';
import { ToastContainer } from './components/ui/ToastContainer';
import { parseSOP } from './systems/sopParser';
import { Checklist, ChecklistStep } from './types/checklist';
import { generateId } from './utils/idGenerator';
import { monetizationManager } from './systems/monetizationManager';
import { calculateCompletion } from './systems/completionScorer';
import { toast } from './systems/toast';
import { Download, Save, Crown, Key, RotateCcw, RefreshCw, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportChecklist } from './systems/outputProcessor';
import { useChecklistStorage } from './hooks/useChecklistStorage';

export default function App() {
  const { isInitializing, templates, activeSession, saveTemplate, deleteTemplate, saveSession } = useChecklistStorage();
  
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(null);
  const [rawSop, setRawSop] = useState('');
  const [isPro, setIsPro] = useState(monetizationManager.isPro());
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  const [hasLoadedSession, setHasLoadedSession] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
      if (activeSession && !hasLoadedSession && !activeChecklist && !rawSop) {
        setActiveChecklist(activeSession.checklist);
        setRawSop(activeSession.rawSop);
      }
      setHasLoadedSession(true);
    }
  }, [isInitializing, activeSession, activeChecklist, rawSop, hasLoadedSession]);

  useEffect(() => {
    if (hasLoadedSession) {
      saveSession(activeChecklist, rawSop);
    }
  }, [activeChecklist, rawSop, saveSession, hasLoadedSession]);

  const handleGenerate = (text: string) => {
    const steps = parseSOP(text);
    setActiveChecklist({
      id: generateId(),
      title: 'New Checklist',
      steps,
      completionScore: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setRawSop(text);
    toast.success('Checklist generated successfully');
  };

  const handleToggleStep = useCallback((stepId: string) => {
    setActiveChecklist(prev => {
      if (!prev) return prev;
      const newSteps = prev.steps.map(s => 
        s.id === stepId ? { ...s, completed: !s.completed } : s
      );
      return {
        ...prev,
        steps: newSteps,
        completionScore: calculateCompletion(newSteps),
        updatedAt: Date.now(),
      };
    });
  }, []);

  const handleReorderSteps = useCallback((newSteps: ChecklistStep[]) => {
    setActiveChecklist(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        steps: newSteps,
        completionScore: calculateCompletion(newSteps),
        updatedAt: Date.now(),
      };
    });
  }, []);

  const handleResetProgress = () => {
    if (!activeChecklist) return;
    const newSteps = activeChecklist.steps.map(s => ({ ...s, completed: false }));
    setActiveChecklist({
      ...activeChecklist,
      steps: newSteps,
      completionScore: 0,
      updatedAt: Date.now(),
    });
    toast.info('Checklist progress reset');
  };

  const handleRestorePristine = () => {
    if (!activeChecklist) return;
    if (rawSop) {
      const steps = parseSOP(rawSop);
      setActiveChecklist({
        ...activeChecklist,
        steps,
        completionScore: 0,
        updatedAt: Date.now(),
      });
      toast.info('Restored to pristine state');
    } else {
      handleResetProgress();
    }
  };

  const handleSave = async () => {
    if (!activeChecklist) return;
    if (!monetizationManager.canSaveTemplate(templates.length)) {
      setShowUpgrade(true);
      toast.warning('Free tier limit reached. Upgrade to Pro to save more templates.');
      return;
    }
    await saveTemplate(activeChecklist);
    toast.success('Template saved successfully');
  };

  const handleLoad = (checklist: Checklist) => {
    setActiveChecklist({ ...checklist, id: generateId(), completionScore: 0, steps: checklist.steps.map(s => ({...s, completed: false})) });
    setRawSop('');
    toast.info(`Loaded template: ${checklist.title}`);
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
    toast.success('Template deleted');
  };

  const handleDuplicate = async (checklist: Checklist) => {
    if (!monetizationManager.canSaveTemplate(templates.length)) {
      setShowUpgrade(true);
      toast.warning('Free tier limit reached. Upgrade to Pro to duplicate templates.');
      return;
    }
    const duplicate: Checklist = {
      ...checklist,
      id: generateId(),
      title: `${checklist.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveTemplate(duplicate);
    toast.success('Template duplicated');
  };

  const handleExportMarkdown = () => {
    if (!isPro) {
      setShowUpgrade(true);
      toast.warning('Export is a Pro feature. Upgrade to unlock.');
      return;
    }
    if (!activeChecklist) return;
    exportChecklist(activeChecklist, 'markdown');
    toast.success('Checklist exported to Markdown');
  };

  const handleExportJson = () => {
    if (!isPro) {
      setShowUpgrade(true);
      toast.warning('JSON Export is a Pro feature. Upgrade to unlock.');
      return;
    }
    if (!activeChecklist) return;
    exportChecklist(activeChecklist, 'json');
    toast.success('Checklist exported to JSON');
  };

  const handleUnlockPro = () => {
    if (monetizationManager.unlockPro(licenseKey)) {
      setIsPro(true);
      setShowUpgrade(false);
      setLicenseKey('');
      toast.success('Pro unlocked successfully! Welcome to ChecklistOS Pro.');
    } else {
      toast.error('Invalid license key. Please check and try again.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-slate-50 text-slate-900 font-sans overflow-y-auto custom-scrollbar lg:overflow-hidden">
      <ToastContainer />
      {/* Left Panel: Input */}
      <div className="w-full lg:w-[320px] xl:w-[400px] border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col shadow-sm z-20 shrink-0 min-h-[400px] lg:h-full lg:min-h-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0047AB] rounded flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="16" width="36" height="42" rx="4" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="4"/>
                <rect x="24" y="10" width="16" height="12" rx="2" fill="#FFFFFF"/>
                <path d="M22 32l5 5 12-12" stroke="#3EB489" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 46l5 5 12-12" stroke="#3EB489" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800">ChecklistOS</h1>
          </div>
          {!isPro && (
            <button onClick={() => setShowUpgrade(true)} className="text-xs font-semibold text-[#0047AB] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1">
              <Crown size={14} /> PRO
            </button>
          )}
        </div>
        <SopInput onGenerate={handleGenerate} initialText={rawSop} onChange={setRawSop} />
      </div>

      {/* Center Panel: Checklist Canvas */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative min-h-[500px] lg:min-h-0 lg:h-full">
        <div className="min-h-14 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-0 shrink-0 gap-3 sm:gap-4">
          <input 
            type="text" 
            value={activeChecklist?.title || 'Untitled Checklist'} 
            onChange={(e) => activeChecklist && setActiveChecklist({...activeChecklist, title: e.target.value})}
            className="font-semibold text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 min-w-0 flex-1 truncate"
            placeholder="Checklist Title..."
            disabled={!activeChecklist}
          />
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar shrink-0">
            <button onClick={handleRestorePristine} disabled={!activeChecklist || !rawSop} className="p-2 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 rounded transition-colors disabled:opacity-50" title="Restore Pristine State">
              <RefreshCw size={18} />
            </button>
            <button onClick={handleResetProgress} disabled={!activeChecklist || activeChecklist.completionScore === 0} className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors disabled:opacity-50" title="Reset Progress">
              <RotateCcw size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={handleSave} disabled={!activeChecklist} className="p-2 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 rounded transition-colors disabled:opacity-50" title="Save Template">
              <Save size={18} />
            </button>
            <button onClick={handleExportMarkdown} disabled={!activeChecklist} className="p-2 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 rounded transition-colors disabled:opacity-50" title="Export Markdown">
              <Download size={18} />
            </button>
            <button onClick={handleExportJson} disabled={!activeChecklist} className="p-2 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 rounded transition-colors disabled:opacity-50" title="Export JSON">
              <FileJson size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {activeChecklist ? (
              <motion.div
                key={activeChecklist.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChecklistCanvas checklist={activeChecklist} onToggleStep={handleToggleStep} onReorderSteps={handleReorderSteps} />
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center"
              >
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 mb-6 text-slate-200 relative"
                >
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                    <rect x="14" y="16" width="36" height="42" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="4"/>
                    <rect x="24" y="10" width="16" height="12" rx="2" fill="currentColor"/>
                    <path d="M22 32l5 5 12-12" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 46l5 5 12-12" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#0047AB] rounded-full flex items-center justify-center shadow-lg border-2 border-slate-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </div>
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready for your SOP</h3>
                <p className="text-sm max-w-xs leading-relaxed">Paste your standard operating procedure on the left and click Generate to create an interactive checklist.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel: Score & History */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col shadow-sm z-10 shrink-0 min-h-[400px] lg:h-full lg:min-h-0">
        <div className="p-6 border-b border-slate-100">
          <CompletionScore checklist={activeChecklist} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TemplateDrawer templates={templates} onLoad={handleLoad} onDelete={handleDelete} onDuplicate={handleDuplicate} />
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-[#0047AB] rounded-full mb-4 mx-auto">
              <Crown size={24} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Unlock ChecklistOS Pro</h2>
            <p className="text-slate-500 text-center mb-6">Get unlimited templates, advanced exports, and version history.</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-700"><div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3EB489] flex items-center justify-center">✓</div> Unlimited saved templates</li>
              <li className="flex items-center gap-2 text-slate-700"><div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3EB489] flex items-center justify-center">✓</div> Template Duplication</li>
              <li className="flex items-center gap-2 text-slate-700"><div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3EB489] flex items-center justify-center">✓</div> Markdown & JSON Export</li>
              <li className="flex items-center gap-2 text-slate-700"><div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3EB489] flex items-center justify-center">✓</div> Local-first privacy</li>
            </ul>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">License Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="LIST-XXXX-XXXX"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] outline-none uppercase font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowUpgrade(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">Cancel</button>
              <button onClick={handleUnlockPro} disabled={!licenseKey.trim()} className="flex-1 px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Activate License</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
