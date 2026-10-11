import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../utils';
import { LOCAL_STORAGE_KEYS } from '../constants';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  tags: string[];
  documentId: string | null;
}

export interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: (documentId: string) => Promise<void>;
  createPost: (documentId: string, title: string) => Promise<void>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  clearPosts: () => void;
}

const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      isLoading: false,
      error: null,

      fetchPosts: async (documentId) => {
        set({ isLoading: true, error: null });
        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          if (!storedData) {
            set({ posts: [] });
            return;
          }

          const documents = JSON.parse(storedData);
          const document = documents.find((doc: any) => doc.id === documentId);
          if (!document) {
            set({ posts: [] });
            return;
          }

          const posts = document.posts || [];
          set({
            posts: posts.map((post: any) => ({
              ...post,
              createdAt: new Date(post.createdAt),
              updatedAt: new Date(post.updatedAt),
            })),
          });
        } catch (err) {
          set({ error: 'Failed to fetch posts' });
        } finally {
          set({ isLoading: false });
        }
      },

      createPost: async (documentId, title) => {
        set({ isLoading: true, error: null });
        try {
          const newPost: Post = {
            id: generateId(),
            title: title || 'Untitled Post',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isFavorite: false,
            tags: [],
            documentId,
          };

          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          let documents = storedData ? JSON.parse(storedData) : [];

          documents = documents.map((doc: any) => {
            if (doc.id === documentId) {
              return {
                ...doc,
                posts: [...(doc.posts || []), newPost],
                updatedAt: new Date(),
              };
            }
            return doc;
          });

          localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
          set({ posts: [...get().posts, newPost] });
        } catch (err) {
          set({ error: 'Failed to create post' });
        } finally {
          set({ isLoading: false });
        }
      },

      updatePost: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          if (!storedData) throw new Error('No documents found');

          const documents = JSON.parse(storedData);
          let documentUpdated = false;

          const updatedDocuments = documents.map((doc: any) => {
            if (doc.posts && doc.posts.some((post: any) => post.id === id)) {
              documentUpdated = true;
              return {
                ...doc,
                posts: doc.posts.map((post: any) =>
                  post.id === id
                    ? {
                        ...post,
                        ...updates,
                        updatedAt: new Date(),
                      }
                    : post
                ),
                updatedAt: new Date(),
              };
            }
            return doc;
          });

          if (!documentUpdated) throw new Error('Post not found');

          localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocuments));

          set({
            posts: get().posts.map((post) =>
              post.id === id
                ? {
                    ...post,
                    ...updates,
                    updatedAt: new Date(),
                  }
                : post
            ),
          });
        } catch (err) {
          set({ error: err.message || 'Failed to update post' });
        } finally {
          set({ isLoading: false });
        }
      },

      deletePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          if (!storedData) throw new Error('No documents found');

          const documents = JSON.parse(storedData);
          let documentUpdated = false;

          const updatedDocuments = documents.map((doc: any) => {
            if (doc.posts && doc.posts.some((post: any) => post.id === id)) {
              documentUpdated = true;
              return {
                ...doc,
                posts: doc.posts.filter((post: any) => post.id !== id),
                updatedAt: new Date(),
              };
            }
            return doc;
          });

          if (!documentUpdated) throw new Error('Post not found');

          localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocuments));

          set({
            posts: get().posts.filter((post) => post.id !== id),
          });
        } catch (err) {
          set({ error: err.message || 'Failed to delete post' });
        } finally {
          set({ isLoading: false });
        }
      },

      toggleFavorite: (id) => {
        set({
          posts: get().posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  isFavorite: !post.isFavorite,
                  updatedAt: new Date(),
                }
              : post
          ),
        });

        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          if (!storedData) return;

          const documents = JSON.parse(storedData);
          const updatedDocuments = documents.map((doc: any) => {
            if (doc.posts && doc.posts.some((post: any) => post.id === id)) {
              return {
                ...doc,
                posts: doc.posts.map((post: any) =>
                  post.id === id
                    ? {
                        ...post,
                        isFavorite: !post.isFavorite,
                        updatedAt: new Date(),
                      }
                    : post
                ),
                updatedAt: new Date(),
              };
            }
            return doc;
          });

          localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocuments));
        } catch (err) {
          console.error('Failed to update favorite status in storage', err);
        }
      },

      addTag: (id, tag) => {
        if (!tag.trim()) return;

        set({
          posts: get().posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  tags: [...new Set([...post.tags, tag.trim()])],
                  updatedAt: new Date(),
                }
              : post
          ),
        });

        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          if (!storedData) return;

          const documents = JSON.parse(storedData);
          const updatedDocuments = documents.map((doc: any) => {
            if (doc.posts && doc.posts.some((post: any) => post.id === id)) {
              return {
                ...doc,
                posts: doc.posts.map((post: any) =>
                  post.id === id
                    ? {
                        ...post,
                        tags: [...new Set([...post.tags, tag.trim()])],
                        updatedAt: new Date(),
                      }
                    : post
                ),
                updatedAt: new Date(),
              };
            }
            return doc;
          });

          localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocuments));
        } catch (err) {
          console.error('Failed to add tag in storage', err);
        }
      },

      removeTag: (id, tag) => {
        set({
          posts: get().posts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  tags: post.tags.filter((t) => t !== tag),
                  updatedAt: new Date(),
                }
              : post
          ),
        });

        try {
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DOCUMENTS);
          if (!storedData) return;

          const documents = JSON.parse(storedData);
          const updatedDocuments = documents.map((doc: any) => {
            if (doc.posts && doc.posts.some((post: any) => post.id === id)) {
              return {
                ...doc,
                posts: doc.posts.map((post: any) =>
                  post.id === id
                    ? {
                        ...post,
                        tags: post.tags.filter((t: string) => t !== tag),
                        updatedAt: new Date(),
                      }
                    : post
                ),
                updatedAt: new Date(),
              };
            }
            return doc;
          });

          localStorage.setItem(LOCAL_STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedDocuments));
        } catch (err) {
          console.error('Failed to remove tag in storage', err);
        }
      },

      clearPosts: () => {
        set({ posts: [] });
      },
    }),
    {
      name: 'writespace_posts',
      partialize: (state) => ({
        posts: state.posts,
      }),
    }
  )
);

export default usePostsStore;