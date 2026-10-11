import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostForm from '../components/PostForm';
import RouteGuard from '../components/RouteGuard';

const CreateBlogPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/documents/${documentId}/posts`);
  };

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-500 mt-1">
                Write and publish your blog post
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <PostForm
              documentId={documentId}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default CreateBlogPage;