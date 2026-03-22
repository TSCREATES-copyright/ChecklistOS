import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Checklist } from '../types/checklist';
import { toast } from './toast';

interface ChecklistOSDB extends DBSchema {
  templates: {
    key: string;
    value: Checklist;
  };
  activeSession: {
    key: string;
    value: { checklist: Checklist | null; rawSop: string };
  };
}

let dbPromise: Promise<IDBPDatabase<ChecklistOSDB>>;

const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<ChecklistOSDB>('checklistos-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('activeSession')) {
          db.createObjectStore('activeSession');
        }
      },
    });
  }
  return dbPromise;
};

const migrateFromLocalStorage = async () => {
  const db = await initDB();
  const migratedFlag = localStorage.getItem('checklistos_idb_migrated');
  if (migratedFlag) return;

  try {
    const templatesJson = localStorage.getItem('checklistos_templates');
    if (templatesJson) {
      const templates: Checklist[] = JSON.parse(templatesJson);
      if (Array.isArray(templates)) {
        const tx = db.transaction('templates', 'readwrite');
        for (const t of templates) {
          if (t && t.id) {
            await tx.store.put(t);
          }
        }
        await tx.done;
      }
    }

    const sessionJson = localStorage.getItem('checklistos_active_session');
    if (sessionJson) {
      const session = JSON.parse(sessionJson);
      if (session && session.rawSop !== undefined) {
        await db.put('activeSession', session, 'current');
      }
    }

    localStorage.setItem('checklistos_idb_migrated', 'true');
  } catch (e) {
    console.error('Migration to IndexedDB failed', e);
  }
};

export const storageManager = {
  init: async () => {
    await migrateFromLocalStorage();
  },
  saveChecklist: async (checklist: Checklist) => {
    try {
      const db = await initDB();
      await db.put('templates', checklist);
    } catch (e) {
      toast.error('Failed to save template.');
      throw e;
    }
  },
  getChecklists: async (): Promise<Checklist[]> => {
    try {
      const db = await initDB();
      const all = await db.getAll('templates');
      return all.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      return [];
    }
  },
  deleteChecklist: async (id: string) => {
    try {
      const db = await initDB();
      await db.delete('templates', id);
    } catch {
      toast.error('Failed to delete template.');
    }
  },
  saveActiveSession: async (checklist: Checklist | null, rawSop: string) => {
    try {
      const db = await initDB();
      await db.put('activeSession', { checklist, rawSop }, 'current');
    } catch {
      // Silently fail for active session to avoid spamming toasts
    }
  },
  getActiveSession: async (): Promise<{ checklist: Checklist | null, rawSop: string } | null> => {
    try {
      const db = await initDB();
      const session = await db.get('activeSession', 'current');
      return session || null;
    } catch {
      return null;
    }
  }
};
