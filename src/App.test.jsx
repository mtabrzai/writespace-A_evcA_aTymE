import { render, screen } from '@testing-library/react';
import AppRouter from './router';
import { MemoryRouter } from 'react-router-dom';

describe('AppRouter', () => {
  it('renders LandingPage at root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /writespace/i })).toBeInTheDocument();
  });

  it('renders LoginPage at /login path', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
  });

  it('renders RegisterPage at /register path', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /create a new account/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated users from protected routes to login', () => {
    render(
      <MemoryRouter initialEntries={['/documents']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
  });
});