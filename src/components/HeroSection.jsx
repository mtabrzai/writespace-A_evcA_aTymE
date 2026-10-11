import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { APP_NAME } from '../../constants';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {APP_NAME}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Create, organize, and collaborate on documents with ease.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button variant="primary" size="large">
                  Get started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link to="/login">
                <Button variant="outline" size="large">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;