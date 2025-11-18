'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  color?: string;
  sprint?: {
    id: string;
    name: string;
  };
}

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarView() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [projectId, currentDate]);

  const fetchEvents = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `/api/projects/${projectId}/calendar/events?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'SPRINT_START':
      case 'SPRINT_END':
        return 'bg-blue-500';
      case 'EVALUATION_DEADLINE':
        return 'bg-red-500';
      case 'MILESTONE':
        return 'bg-green-500';
      case 'CUSTOM':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'SPRINT_START':
      case 'SPRINT_END':
        return '🏃';
      case 'EVALUATION_DEADLINE':
        return '📝';
      case 'MILESTONE':
        return '🎯';
      case 'CUSTOM':
        return '📅';
      default:
        return '📅';
    }
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const weeks = [];
    let currentWeek = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === day.toDateString();
      });

      currentWeek.push({
        date: new Date(day),
        events: dayEvents,
        isCurrentMonth: day.getMonth() === month,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      day.setDate(day.getDate() + 1);
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded"
              >
                Hoy
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((day, index) => (
              <div
                key={index}
                className={`min-h-24 p-2 border rounded ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.events.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white ${getEventColor(event.type)}`}
                      title={event.title}
                    >
                      {getEventIcon(event.type)} {event.title}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{day.events.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando calendario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h1 className="text-2xl font-bold">Calendario del Proyecto</h1>
        </div>

        <div className="flex gap-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="px-3 py-2 border rounded"
          >
            <option value="month">Mes</option>
            <option value="week">Semana</option>
            <option value="day">Día</option>
          </select>

          <button
            onClick={() => window.open(`/api/projects/${projectId}/calendar/export`, '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📥 Exportar ICS
          </button>
        </div>
      </div>

      {renderMonthView()}

      {/* Events Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Resumen de Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.type.includes('SPRINT')).length}
            </div>
            <div className="text-sm text-gray-600">Sprints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.type === 'EVALUATION_DEADLINE').length}
            </div>
            <div className="text-sm text-gray-600">Evaluaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type === 'MILESTONE').length}
            </div>
            <div className="text-sm text-gray-600">Hitos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(e => e.type === 'CUSTOM').length}
            </div>
            <div className="text-sm text-gray-600">Personalizados</div>
          </div>
        </div>
      </div>
    </div>
  );
}