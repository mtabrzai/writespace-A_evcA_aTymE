import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { FiFileText, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import useAuthStore from '../../stores/authStore';
import { APP_NAME } from '../../constants';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    {
      path: '/documents',
      name: 'Documents',
      icon: <FiFileText className="mr-2" />,
      protected: true,
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: <FiSettings className="mr-2" />,
      protected: true,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path ||
           (path === '/documents' && location.pathname.startsWith('/documents/'));
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center">
          <Link
            to={isAuthenticated ? "/documents" : "/"}
            className="flex items-center text-xl font-bold text-gray-800"
          >
            {APP_NAME}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  item.protected && (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive(item.path)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Avatar
                  src={user?.avatarUrl}
                  alt={user?.name || 'User'}
                  size="small"
                  className="hidden md:block"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FiLogOut className="mr-2" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="small">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="small">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;