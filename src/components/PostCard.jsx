import React from 'react';
import { FiFileText, FiClock, FiStar, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { truncateText, formatDate } from '../../utils';
import PropTypes from 'prop-types';

const PostCard = ({
  post,
  documentId,
  className = '',
  showDocumentLink = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'p-4 border rounded-lg hover:border-blue-500 transition-colors',
        post.isFavorite && 'border-yellow-400 bg-yellow-50',
        className
      )}
      {...props}
    >
      <Link
        to={`/documents/${documentId}/posts/${post.id}`}
        className="block"
      >
        <div className="flex items-start">
          <FiFileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900 truncate">
                {post.title}
              </h3>
              {post.isFavorite && (
                <FiStar className="h-4 w-4 text-yellow-500 ml-2 flex-shrink-0" />
              )}
            </div>
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
                      <FiTag className="inline h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {showDocumentLink && post.documentId && (
              <div className="mt-2 text-xs">
                <Link
                  to={`/documents/${post.documentId}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View document
                </Link>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    updatedAt: PropTypes.instanceOf(Date).isRequired,
    isFavorite: PropTypes.bool.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    documentId: PropTypes.string,
  }).isRequired,
  documentId: PropTypes.string.isRequired,
  className: PropTypes.string,
  showDocumentLink: PropTypes.bool,
};

export default PostCard;