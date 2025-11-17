"use client";

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const CalendarTab = ({ projectId }: { projectId: string }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}/events`)
      .then(res => res.json())
      .then((data: any[]) => {
        // Convert date strings to Date objects
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      });
  }, [projectId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md" style={{ height: '70vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarTab;
