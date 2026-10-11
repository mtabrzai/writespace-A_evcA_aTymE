import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import useAuthStore from '../../stores/authStore';

vi.mock('../../stores/authStore');

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app name link pointing to root when not authenticated', () => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const appNameLink = screen.getByRole('link', { name: /writespace/i });
    expect(appNameLink).toBeInTheDocument();
    expect(appNameLink).toHaveAttribute('href', '/');
  });

  it('renders app name link pointing to /documents when authenticated', () => {
    useAuthStore.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: new Date() },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const appNameLink = screen.getByRole('link', { name: /writespace/i });
    expect(appNameLink).toBeInTheDocument();
    expect(appNameLink).toHaveAttribute('href', '/documents');
  });

  it('renders login and sign up buttons when not authenticated', () => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders navigation links when authenticated', () => {
    useAuthStore.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: new Date() },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/documents']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });

  it('highlights active navigation link', () => {
    useAuthStore.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: new Date() },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/documents']}>
        <Navbar />
      </MemoryRouter>
    );

    const documentsLink = screen.getByRole('link', { name: /documents/i });
    expect(documentsLink).toHaveClass('bg-gray-100');
  });

  it('shows user avatar and name when authenticated', () => {
    useAuthStore.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: new Date() },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const mockLogout = vi.fn();
    useAuthStore.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: new Date() },
      isAuthenticated: true,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    screen.getByRole('button', { name: /logout/i }).click();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('does not render protected navigation links on mobile when not authenticated', () => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /documents/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /settings/i })).not.toBeInTheDocument();
  });
});