import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUser = {
            id: 'user-' + Math.random().toString(36).substring(2, 15),
            name: 'Test User',
            email,
            createdAt: new Date(),
          };
          set({
            user: mockUser,
            token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
            isAuthenticated: true,
          });
        } catch (err) {
          set({ error: 'Invalid email or password' });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockUser = {
            id: 'user-' + Math.random().toString(36).substring(2, 15),
            name,
            email,
            createdAt: new Date(),
          };
          set({
            user: mockUser,
            token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
            isAuthenticated: true,
          });
        } catch (err) {
          set({ error: 'Registration failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate token validation
          await new Promise(resolve => setTimeout(resolve, 500));
          if (get().token) {
            set({ isAuthenticated: true });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } catch (err) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: 'Authentication check failed',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          if (!get().user) throw new Error('No user logged in');
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({
            user: { ...get().user, ...updates },
          });
        } catch (err) {
          set({ error: err.message || 'Failed to update profile' });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'writespace_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;