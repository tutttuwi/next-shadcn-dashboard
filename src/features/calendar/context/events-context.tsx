'use client';
import { CalendarEvent, initialEvents } from '@/features/calendar/utils/data';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { myStaffNo } from '@/features/calendar/utils/data'; // 自分のスタッフ番号をインポート
interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}

interface EventsContextType {
  events: CalendarEvent[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  eventViewOpen: boolean;
  setEventViewOpen: (value: boolean) => void;
  eventAddOpen: boolean;
  setEventAddOpen: (value: boolean) => void;
  eventEditOpen: boolean;
  setEventEditOpen: (value: boolean) => void;
  eventDeleteOpen: boolean;
  setEventDeleteOpen: (value: boolean) => void;
  availabilityCheckerEventAddOpen: boolean;
  setAvailabilityCheckerEventAddOpen: (value: boolean) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // TODO: 暫定で自分のスタッフ番号を設定、本来であればセッション情報などから取得して設定する
  const [events, setEvents] = useState<CalendarEvent[]>(
    // TODO: ここで本来はAPI呼び出しを実施し、自分に紐づくイベントを取得する
    initialEvents
      .filter(
        (event) =>
          event.extendedProps.owner?.staffNo === myStaffNo ||
          (event.extendedProps.members ?? []).some(
            (m) => m.staffNo === myStaffNo
          )
      )
      .map((event) => ({
        ...event,
        id: String(event.id),
        color: event.backgroundColor
      }))
  );
  const [eventViewOpen, setEventViewOpen] = useState(false);
  const [eventAddOpen, setEventAddOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventDeleteOpen, setEventDeleteOpen] = useState(false);
  const [availabilityCheckerEventAddOpen, setAvailabilityCheckerEventAddOpen] =
    useState(false);

  const addEvent = (event: CalendarEvent) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    // console.log('Event added:', event);
    console.log('Current events:', events);
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => Number(event.id) !== Number(id))
    );
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        deleteEvent,
        eventViewOpen,
        setEventViewOpen,
        eventAddOpen,
        setEventAddOpen,
        eventEditOpen,
        setEventEditOpen,
        eventDeleteOpen,
        setEventDeleteOpen,
        availabilityCheckerEventAddOpen,
        setAvailabilityCheckerEventAddOpen
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
