import { useState, useEffect, useCallback } from 'react';
import { Checklist } from '../types/checklist';
import { storageManager } from '../systems/storageManager';

export function useChecklistStorage() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [templates, setTemplates] = useState<Checklist[]>([]);
  const [activeSession, setActiveSession] = useState<{ checklist: Checklist | null, rawSop: string } | null>(null);

  useEffect(() => {
    const initApp = async () => {
      await storageManager.init();
      const loadedTemplates = await storageManager.getChecklists();
      setTemplates(loadedTemplates);
      
      const session = await storageManager.getActiveSession();
      setActiveSession(session);
      setIsInitializing(false);
    };
    initApp();
  }, []);

  const saveTemplate = useCallback(async (checklist: Checklist) => {
    await storageManager.saveChecklist(checklist);
    const updated = await storageManager.getChecklists();
    setTemplates(updated);
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    await storageManager.deleteChecklist(id);
    const updated = await storageManager.getChecklists();
    setTemplates(updated);
  }, []);

  const saveSession = useCallback(async (checklist: Checklist | null, rawSop: string) => {
    if (!isInitializing) {
      await storageManager.saveActiveSession(checklist, rawSop);
    }
  }, [isInitializing]);

  return {
    isInitializing,
    templates,
    activeSession,
    saveTemplate,
    deleteTemplate,
    saveSession
  };
}
