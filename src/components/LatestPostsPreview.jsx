import React, { useEffect } from 'react';
import { FiFileText, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import usePostsStore from '../../stores/postsStore';
import { truncateText, formatDate } from '../../utils';
import clsx from 'clsx';

const LatestPostsPreview = ({ documentId, limit = 3 }) => {
  const { posts, isLoading, error, fetchPosts } = usePostsStore();

  useEffect(() => {
    if (documentId) {
      fetchPosts(documentId);
    }
  }, [documentId, fetchPosts]);

  const latestPosts = posts
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load posts: {error}
      </div>
    );
  }

  if (latestPosts.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No posts yet. Create your first post!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {latestPosts.map((post) => (
        <div
          key={post.id}
          className={clsx(
            'p-4 border rounded-lg hover:border-blue-500 transition-colors',
            post.isFavorite && 'border-yellow-400 bg-yellow-50'
          )}
        >
          <Link
            to={`/documents/${documentId}/posts/${post.id}`}
            className="block"
          >
            <div className="flex items-start">
              <FiFileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {truncateText(post.content, 100)}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <FiClock className="h-3 w-3 mr-1" />
                  <span>
                    Updated {formatDate(post.updatedAt)}
                  </span>
                  {post.tags.length > 0 && (
                    <div className="ml-2 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
      {posts.length > limit && (
        <div className="text-center mt-4">
          <Link
            to={`/documents/${documentId}/posts`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all posts ({posts.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestPostsPreview;