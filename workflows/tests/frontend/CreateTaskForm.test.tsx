import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateTaskForm from '../../src/app/components/CreateTaskForm';

// Mock fetch
global.fetch = jest.fn();

describe('CreateTaskForm', () => {
  const mockOnTaskCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario correctamente', () => {
    render(<CreateTaskForm storyId="story1" onTaskCreated={mockOnTaskCreated} />);
    
    expect(screen.getByPlaceholderText('New task title...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('envia el formulario correctamente', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'task1' }),
    });

    render(<CreateTaskForm storyId="story1" onTaskCreated={mockOnTaskCreated} />);
    
    const input = screen.getByPlaceholderText('New task title...');
    const numberInput = screen.getByDisplayValue('1');
    const button = screen.getByRole('button', { name: '+' });

    fireEvent.change(input, { target: { value: 'Nueva tarea' } });
    fireEvent.change(numberInput, { target: { value: '5' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stories/story1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nueva tarea', storyPoints: 5 }),
      });
      expect(mockOnTaskCreated).toHaveBeenCalled();
    });

    // Verificar que se resetea
    expect(input).toHaveValue('');
    expect(numberInput).toHaveValue(1);
  });

  it('maneja errores en el envio', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<CreateTaskForm storyId="story1" onTaskCreated={mockOnTaskCreated} />);
    
    const input = screen.getByPlaceholderText('New task title...');
    const button = screen.getByRole('button', { name: '+' });

    fireEvent.change(input, { target: { value: 'Nueva tarea' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      // En un caso real, podrias mostrar un error, pero aqui solo verificamos que no se llame onTaskCreated si falla
      expect(mockOnTaskCreated).not.toHaveBeenCalled();
    });
  });
});