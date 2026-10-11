import { renderHook, act } from '@testing-library/react';
import useAuthStore from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should login successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user.email).toBe('test@example.com');
    expect(result.current.token).not.toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error when login fails', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('', '');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.error).toBe('Invalid email or password');
    expect(result.current.isLoading).toBe(false);
  });

  it('should register successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.register('Test User', 'test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user.name).toBe('Test User');
    expect(result.current.user.email).toBe('test@example.com');
    expect(result.current.token).not.toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error when registration fails', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.register('', '', '');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.error).toBe('Registration failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('should logout and clear state', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should check auth status and set isAuthenticated based on token', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    await act(async () => {
      await result.current.checkAuth();
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear error when clearError is called', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('', '');
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should update profile successfully', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    await act(async () => {
      await result.current.updateProfile({ name: 'Updated User' });
    });

    expect(result.current.user.name).toBe('Updated User');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set error when updating profile fails', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.updateProfile({ name: 'Updated User' });
    });

    expect(result.current.error).toBe('No user logged in');
    expect(result.current.isLoading).toBe(false);
  });

  it('should persist state to localStorage', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    const storedAuth = localStorage.getItem('writespace_auth');
    expect(storedAuth).not.toBeNull();

    const authData = JSON.parse(storedAuth);
    expect(authData.state.user.email).toBe('test@example.com');
    expect(authData.state.isAuthenticated).toBe(true);
  });

  it('should restore state from localStorage on initialization', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('writespace_auth', JSON.stringify({
      state: {
        user: mockUser,
        token: 'mock-token-123',
        isAuthenticated: true
      },
      version: 0
    }));

    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user.email).toBe('test@example.com');
    expect(result.current.token).toBe('mock-token-123');
    expect(result.current.isAuthenticated).toBe(true);
  });
});