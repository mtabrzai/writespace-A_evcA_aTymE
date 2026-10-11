import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiFileText } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PostCard from '../components/PostCard';
import usePostsStore from '../stores/postsStore';
import { formatDate } from '../utils';
import RouteGuard from '../components/RouteGuard';

const BlogsPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { posts, isLoading, error, fetchPosts } = usePostsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchPosts(documentId);
    }
  }, [documentId, fetchPosts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'createdAt') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return sortDirection === 'asc'
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  const handleCreateNewPost = () => {
    navigate(`/documents/${documentId}/posts/new`);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
    setShowSortDropdown(false);
  };

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-gray-500 mt-1">
                Manage your blog posts in this document
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreateNewPost}
              className="ml-4"
            >
              <FiPlus className="mr-2" />
              New Post
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  fullWidth
                  size="medium"
                  variant="outline"
                  className="pl-10"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-full sm:w-auto"
                >
                  <FiFilter className="mr-2" />
                  Sort: {sortBy === 'title' ? 'Title' : sortBy === 'createdAt' ? 'Created' : 'Updated'}
                  {sortDirection === 'asc' ? (
                    <FiChevronUp className="ml-2" />
                  ) : (
                    <FiChevronDown className="ml-2" />
                  )}
                </Button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleSortChange('title')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Title
                      </button>
                      <button
                        onClick={() => handleSortChange('createdAt')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Created Date
                      </button>
                      <button
                        onClick={() => handleSortChange('updatedAt')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Updated Date
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white p-4 rounded-lg shadow-sm border">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating a new post.'}
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={handleCreateNewPost}
                >
                  <FiPlus className="mr-2" />
                  New Post
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  documentId={documentId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
};

export default BlogsPage;