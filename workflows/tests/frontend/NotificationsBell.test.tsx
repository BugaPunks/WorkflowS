import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationsBell from '../../src/app/components/NotificationsBell';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children);
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('NotificationsBell', () => {
  const mockUseSession = require('next-auth/react').useSession;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no renderiza si no hay sesion', () => {
    mockUseSession.mockReturnValue({ data: null });
    const { container } = render(<NotificationsBell />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza el icono de campana con sesion', () => {
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<NotificationsBell />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('muestra indicador de notificaciones no leidas', async () => {
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1', message: 'Test', createdAt: '2023-01-01' }],
    });

    render(<NotificationsBell />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    // El indicador rojo deberia estar presente
    const indicator = document.querySelector('.bg-red-500');
    expect(indicator).toBeInTheDocument();
  });

  it('abre y cierra el dropdown al hacer click', async () => {
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<NotificationsBell />);
    const button = screen.getByRole('button');

    // Click para abrir
    fireEvent.click(button);
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // Click para cerrar
    fireEvent.click(button);
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
  });

  it('muestra notificaciones en el dropdown', async () => {
    const notifications = [
      { id: '1', message: 'Nueva evaluacion', link: '/projects/1', createdAt: '2023-10-01T10:00:00Z' },
    ];

    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => notifications,
    });

    render(<NotificationsBell />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Nueva evaluacion')).toBeInTheDocument();
    });
  });

  it('marca notificaciones como leidas', async () => {
    const notifications = [{ id: '1', message: 'Test', createdAt: '2023-01-01' }];

    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => notifications,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<NotificationsBell />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Mark all as read')).toBeInTheDocument();
    });

    const markReadButton = screen.getByText('Mark all as read');
    fireEvent.click(markReadButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/notifications', { method: 'PUT' });
    });
  });
});