import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchBar from '@/app/components/SearchBar';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders input field with default placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Buscar proyectos, tareas, usuarios...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('renders input field with custom placeholder', () => {
    render(<SearchBar placeholder="Custom placeholder" />);
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SearchBar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders search icon', () => {
    render(<SearchBar />);
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('updates query on input change', () => {
    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(input).toHaveValue('test query');
  });

  it('does not search for queries shorter than 2 characters', () => {
    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('searches for queries with 2 or more characters', async () => {
    const mockResults = [
      {
        type: 'project',
        id: '1',
        title: 'Test Project',
        url: '/projects/1',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResults),
    });

    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'te' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/search?q=te');
    });
  });

  it('shows loading spinner during search', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    const mockResults = [
      {
        type: 'project',
        id: '1',
        title: 'Test Project',
        subtitle: 'Project description',
        url: '/projects/1',
      },
      {
        type: 'task',
        id: '2',
        title: 'Test Task',
        url: '/tasks/2',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResults),
    });

    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Project description')).toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Proyecto')).toBeInTheDocument();
      expect(screen.getByText('Tarea')).toBeInTheDocument();
    });
  });

  it('shows no results message when no results found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'nonexistent' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('No se encontraron resultados para "nonexistent"')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking result', async () => {
    const mockResults = [
      {
        type: 'project',
        id: '1',
        title: 'Test Project',
        url: '/projects/1',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResults),
    });

    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    const resultLink = screen.getByText('Test Project');
    fireEvent.click(resultLink);

    expect(input).toHaveValue('');
    expect(screen.queryByText('Test Project')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const mockResults = [
      {
        type: 'project',
        id: '1',
        title: 'Test Project',
        url: '/projects/1',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResults),
    });

    render(<SearchBar />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Test Project')).not.toBeInTheDocument();
  });
});