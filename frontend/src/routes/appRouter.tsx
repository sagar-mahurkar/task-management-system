import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/modules/auth/LoginPage';
import { RegisterPage } from '@/modules/auth/RegisterPage';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { TasksPage } from '@/modules/tasks/TasksPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/routes/routes';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.DASHBOARD.slice(1), element: <DashboardPage /> },
          { path: ROUTES.TASKS.slice(1), element: <TasksPage /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
