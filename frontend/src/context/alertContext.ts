
import { createContext } from 'react';

export type AlertType = 'success' | 'danger' | 'warning' | 'info';

export type AlertMessage = {
  type: AlertType;
  message: string;
};

export type AlertContextValue = {
  alert: AlertMessage | null;
  showAlert: (type: AlertType, message: string) => void;
  clearAlert: () => void;
};

export const AlertContext = createContext<AlertContextValue | undefined>(
  undefined,
);
