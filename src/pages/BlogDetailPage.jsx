import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiStar, FiClock, FiTag, FiBookmark } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import usePostsStore from '../stores/postsStore';
import { formatDate } from '../utils';
import RouteGuard from '../components/RouteGuard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogDetailPage = () => {
  const { documentId, postId } = useParams();
  const navigate = useNavigate();
  const { posts, isLoading, error, fetchPosts, deletePost, toggleFavorite } = usePostsStore();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (documentId) {
      fetchPosts(documentId);
    }
  }, [documentId, fetchPosts]);

  useEffect(() => {
    if (posts.length > 0 && postId) {
      const foundPost = posts.find(p => p.id === postId);
      setPost(foundPost || null);
    }
  }, [posts, postId]);

  const handleDelete = async () => {
    if (!postId) return;
    try {
      await deletePost(postId);
      navigate(`/documents/${documentId}/posts`);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleToggleFavorite = () => {
    if (!postId) return;
    toggleFavorite(postId);
  };

  if (isLoading) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </div>
        </div>
      </RouteGuard>
    );
  }

  if (!post) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="mt-2 text-sm font-medium text-gray-900">Post not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The post you're looking for doesn't exist or has been deleted.
              </p>
              <div className="mt-6">
                <Link to={`/documents/${documentId}/posts`}>
                  <Button variant="primary">
                    <FiArrowLeft className="mr-2" />
                    Back to Posts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/documents/${documentId}/posts`)}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleToggleFavorite}
                className="text-gray-600 hover:text-yellow-500"
              >
                <FiStar className={post.isFavorite ? 'text-yellow-500 fill-current' : ''} />
              </Button>
              <Link to={`/documents/${documentId}/posts/${postId}/edit`}>
                <Button variant="outline">
                  <FiEdit2 className="mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                <FiTrash2 className="mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <FiClock className="mr-2" />
              <span>Updated {formatDate(post.updatedAt)}</span>
              {post.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <FiTag className="mr-2" />
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || 'No content yet.'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default BlogDetailPage;