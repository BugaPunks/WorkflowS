import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '@/app/components/Navigation';
import { signOut } from 'next-auth/react';
import { mockUseSession } from '../setup-frontend';

// Mock the child components
jest.mock('@/app/components/NotificationsBell', () => {
  return function MockNotificationsBell() {
    return <div data-testid="notifications-bell">NotificationsBell</div>;
  };
});

jest.mock('@/app/components/SearchBar', () => {
  return function MockSearchBar({ className }: { className?: string }) {
    return <div data-testid="search-bar" className={className}>SearchBar</div>;
  };
});

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the WorkflowS logo', () => {
    render(<Navigation />);
    const logo = screen.getByText('WorkflowS');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders the SearchBar component', () => {
    render(<Navigation />);
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveClass('flex-1');
  });

  it('renders the Proyectos link', () => {
    render(<Navigation />);
    const proyectosLink = screen.getByText('Proyectos');
    expect(proyectosLink).toBeInTheDocument();
    expect(proyectosLink.closest('a')).toHaveAttribute('href', '/projects');
  });

  it('renders the NotificationsBell component', () => {
    render(<Navigation />);
    const notificationsBell = screen.getByTestId('notifications-bell');
    expect(notificationsBell).toBeInTheDocument();
  });

  it('renders the Cerrar Sesión button', () => {
    render(<Navigation />);
    const signOutButton = screen.getByText('Cerrar Sesión');
    expect(signOutButton).toBeInTheDocument();
  });

  it('calls signOut when Cerrar Sesión button is clicked', () => {
    const mockSignOut = jest.fn();
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'ESTUDIANTE' },
        expires: '2024-12-31',
      },
      status: 'authenticated',
    });

    (signOut as jest.Mock).mockImplementation(mockSignOut);

    render(<Navigation />);
    const signOutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(signOutButton);
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('shows Gestión de Usuarios link for ADMIN role', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'ADMIN' },
        expires: '2024-12-31',
      },
      status: 'authenticated',
    });

    render(<Navigation />);
    const adminLink = screen.getByText('Gestión de Usuarios');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.closest('a')).toHaveAttribute('href', '/admin/users');
  });

  it('does not show Gestión de Usuarios link for non-ADMIN roles', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'ESTUDIANTE' },
        expires: '2024-12-31',
      },
      status: 'authenticated',
    });

    render(<Navigation />);
    const adminLink = screen.queryByText('Gestión de Usuarios');
    expect(adminLink).not.toBeInTheDocument();
  });
});