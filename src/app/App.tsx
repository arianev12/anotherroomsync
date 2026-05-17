import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { StudentProvider } from './contexts/StudentContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

export default function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
      </StudentProvider>
    </ThemeProvider>
  );
}