
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertContext } from './alertContext';
import type { AlertMessage, AlertType } from './alertContext';

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  const showAlert = useCallback(
    (type: AlertType, message: string) => setAlert({ type, message }),
    [],
  );

  const clearAlert = useCallback(() => setAlert(null), []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
