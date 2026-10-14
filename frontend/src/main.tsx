import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App';
import { AuthProvider } from '@/modules/auth/AuthContext';
import { AlertProvider } from '@/context/AlertContext';
import { Alert } from '@/shared/components/Alert';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AlertProvider>
        <Alert />
        <App />
      </AlertProvider>
    </AuthProvider>
  </StrictMode>,
);
