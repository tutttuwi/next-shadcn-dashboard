import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/features/calendar/components/ui/alert-dialog';
import { CalendarEvent } from '@/features/calendar/utils/data';
import { EventDeleteForm } from './event-delete-form';
import { EventEditForm } from './event-edit-form';
import { useEvents } from '@/features/calendar/context/events-context';
import { X } from 'lucide-react';

interface EventViewProps {
  event?: CalendarEvent;
}

export function EventView({ event }: EventViewProps) {
  const { eventViewOpen, setEventViewOpen } = useEvents();

  return (
    <>
      <AlertDialog open={eventViewOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex flex-row items-center justify-between'>
              <h2>{event?.title}</h2>
              <AlertDialogCancel onClick={() => setEventViewOpen(false)}>
                <X className='h-5 w-5' />
              </AlertDialogCancel>
            </AlertDialogTitle>
            <table>
              <tr>
                <th>Time:</th>
                <td>{`${event?.start.toLocaleTimeString()} - ${event?.end.toLocaleTimeString()}`}</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>{event?.description}</td>
              </tr>
              <tr>
                <th>Color:</th>
                <td>
                  <div
                    className='h-5 w-5 rounded-full'
                    style={{ backgroundColor: event?.backgroundColor }}
                  ></div>
                </td>
              </tr>
            </table>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <EventDeleteForm id={event?.id} title={event?.title} />
            <EventEditForm
              oldEvent={event}
              event={event}
              isDrag={false}
              displayButton={true}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
