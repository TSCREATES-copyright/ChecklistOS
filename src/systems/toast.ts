export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

type Listener = (toast: ToastMessage) => void;

class ToastSystem {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(message: string, type: ToastType) {
    const toast: ToastMessage = { id: Math.random().toString(36).substring(2, 9), message, type };
    this.listeners.forEach(l => l(toast));
  }

  success(message: string) { this.emit(message, 'success'); }
  error(message: string) { this.emit(message, 'error'); }
  warning(message: string) { this.emit(message, 'warning'); }
  info(message: string) { this.emit(message, 'info'); }
}

export const toast = new ToastSystem();
