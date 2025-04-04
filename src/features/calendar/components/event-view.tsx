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
import { DateTime } from 'luxon';

interface EventViewProps {
  event?: CalendarEvent;
}

export function EventView({ event }: EventViewProps) {
  const { eventViewOpen, setEventViewOpen } = useEvents();

  /**
   * 表示する開始終了日時を加工して返却する
   * @param eventStart
   * @param eventEnd
   * @returns
   */
  function showDateTime(
    eventStart: Date = new Date(),
    eventEnd: Date = new Date()
  ): String {
    const [syyyy, smm, sdd] = eventStart.toLocaleDateString().split('/');
    const [sHH, sMM, sSS] = eventStart.toLocaleTimeString().split(':');
    const [eyyyy, emm, edd] = eventEnd.toLocaleDateString().split('/');
    const [eHH, eMM, eSS] = eventEnd.toLocaleTimeString().split(':');
    const isSameDate: boolean =
      eventStart.toDateString() === eventEnd.toDateString();
    if (isSameDate) {
      return `${syyyy}/${smm}/${sdd} ${sHH}:${sMM} - ${eHH}:${eMM}`;
    } else {
      return `${syyyy}/${smm}/${sdd} ${sHH}:${sMM} - ${eyyyy}/${emm}/${edd} ${eHH}:${eMM}`;
    }
  }
  return (
    <>
      <AlertDialog open={eventViewOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex flex-row items-center justify-between'>
              <span>{event?.title}</span>
              <AlertDialogCancel onClick={() => setEventViewOpen(false)}>
                <X className='h-5 w-5' />
              </AlertDialogCancel>
            </AlertDialogTitle>
            <table>
              <tr>
                <th>日時</th>
                {/* <td>{`${event?.start.toLocaleTimeString()} - ${event?.end.toLocaleTimeString()}`}</td> */}
                <td>{showDateTime(event?.start, event?.end)}</td>
              </tr>
              <tr>
                <th>詳細説明</th>
                <td>{event?.description}</td>
              </tr>
              <tr>
                <th>カラー</th>
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
