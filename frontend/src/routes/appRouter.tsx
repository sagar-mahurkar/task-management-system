import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthPlaceholderPage } from '@/modules/auth/AuthPlaceholderPage';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { TasksPage } from '@/modules/tasks/TasksPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { HomePage } from '@/pages/HomePage';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { ROUTES } from '@/routes/routes';

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
      { path: 'login', element: <AuthPlaceholderPage mode="login" /> },
      { path: 'register', element: <AuthPlaceholderPage mode="register" /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
