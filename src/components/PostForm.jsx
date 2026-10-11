import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Input from './ui/Input';
import Button from './ui/Button';
import usePostsStore from '../../stores/postsStore';
import { FiTag, FiX } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostForm = ({ documentId, postId, onSuccess }) => {
  const { posts, createPost, updatePost, isLoading, error } = usePostsStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setTags(post.tags);
      }
    }
  }, [postId, posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (postId) {
        await updatePost(postId, { title, content, tags });
      } else {
        await createPost(documentId, title);
        const newPost = posts.find(p => p.title === title && p.documentId === documentId);
        if (newPost) {
          await updatePost(newPost.id, { content, tags });
        }
      }
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/documents/${documentId}/posts`);
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...new Set([...tags, tagInput.trim()])]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          fullWidth
          size="large"
          error={!title.trim() && error}
          errorMessage="Title is required"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content in Markdown..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[400px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex items-center">
              <div className="relative flex-grow">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag and press Enter"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview
            </label>
            <div className="p-4 border border-gray-200 rounded-md min-h-[400px] bg-white prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || 'Nothing to preview yet...'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/documents/${documentId}/posts`)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

PostForm.propTypes = {
  documentId: PropTypes.string.isRequired,
  postId: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default PostForm;