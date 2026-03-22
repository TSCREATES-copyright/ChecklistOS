import { validateLicenseKey } from './license';

export const monetizationManager = {
  isPro: (): boolean => {
    const key = localStorage.getItem('checklistos_pro_key');
    return key ? validateLicenseKey(key) : false;
  },
  unlockPro: (key: string): boolean => {
    if (validateLicenseKey(key)) {
      localStorage.setItem('checklistos_pro_key', key.trim().toUpperCase());
      return true;
    }
    return false;
  },
  canSaveTemplate: (currentCount: number): boolean => {
    if (monetizationManager.isPro()) return true;
    return currentCount < 2; // Free tier limit
  }
};

