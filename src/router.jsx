import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RouteGuard from './components/RouteGuard';
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SettingsPage from './pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/documents',
    element: <RouteGuard><DocumentsPage /></RouteGuard>,
  },
  {
    path: '/documents/:documentId',
    element: <RouteGuard><DocumentDetailPage /></RouteGuard>,
  },
  {
    path: '/documents/:documentId/posts',
    element: <RouteGuard><BlogsPage /></RouteGuard>,
  },
  {
    path: '/documents/:documentId/posts/:postId',
    element: <RouteGuard><BlogDetailPage /></RouteGuard>,
  },
  {
    path: '/documents/:documentId/posts/new',
    element: <RouteGuard><CreateBlogPage /></RouteGuard>,
  },
  {
    path: '/documents/:documentId/posts/:postId/edit',
    element: <RouteGuard><EditBlogPage /></RouteGuard>,
  },
  {
    path: '/admin',
    element: <RouteGuard><AdminDashboardPage /></RouteGuard>,
  },
  {
    path: '/settings',
    element: <RouteGuard><SettingsPage /></RouteGuard>,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;