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

  function showDateTime(
    eventStart: Date = new Date(),
    eventEnd: Date = new Date()
  ): string {
    const [syyyy, smm, sdd] = eventStart.toLocaleDateString().split('/');
    const [sHH, sMM] = eventStart.toLocaleTimeString().split(':');
    const [eyyyy, emm, edd] = eventEnd.toLocaleDateString().split('/');
    const [eHH, eMM] = eventEnd.toLocaleTimeString().split(':');
    const isSameDate: boolean =
      eventStart.toDateString() === eventEnd.toDateString();
    if (isSameDate) {
      return `${syyyy}/${smm}/${sdd} ${sHH}:${sMM} - ${eHH}:${eMM}`;
    } else {
      return `${syyyy}/${smm}/${sdd} ${sHH}:${sMM} - ${eyyyy}/${emm}/${edd} ${eHH}:${eMM}`;
    }
  }
  console.log('EventView', event);

  return (
    <>
      <AlertDialog open={eventViewOpen} onOpenChange={setEventViewOpen}>
        <AlertDialogContent className='flex h-[90vh] max-h-[90vh] w-[90vw] max-w-[90vw] flex-col justify-start overflow-y-auto'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex flex-row items-center justify-between'>
              <div className='flex items-center gap-2'>
                {/* eventTypeラベル */}
                {event?.extendedProps?.eventType === 'training' ? (
                  <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700'>
                    研修
                  </span>
                ) : (
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
                    予定
                  </span>
                )}
                <span className='text-lg font-bold'>{event?.title}</span>
              </div>
              <div className='flex gap-2'>
                {/* 予定を編集をクリックされたとき自ダイアログは閉じる */}
                <div
                  onClick={() => setEventViewOpen(false)}
                  className='flex items-center'
                >
                  <EventEditForm
                    oldEvent={event}
                    event={event}
                    isDrag={false}
                    displayButton={true}
                  />
                </div>
                <EventDeleteForm id={event?.id} title={event?.title} />
                <AlertDialogCancel onClick={() => setEventViewOpen(false)}>
                  <X className='h-5 w-5' />
                </AlertDialogCancel>
              </div>
            </AlertDialogTitle>
            <div className='mt-2 flex flex-col gap-4 md:flex-row'>
              {/* 左カラム */}
              <div className='flex-1 space-y-4'>
                {/* 日時 */}
                <div>
                  <div className='mb-1 text-xs text-gray-500'>日時</div>
                  <div className='font-medium'>
                    {event?.start &&
                      event?.end &&
                      showDateTime(event.start, event.end)}
                  </div>
                </div>
                {/* 終日 */}
                <div>
                  <div className='mb-1 text-xs text-gray-500'>終日</div>
                  <div>{event?.allDay ? 'はい' : 'いいえ'}</div>
                </div>
                {/* カラー */}
                <div>
                  <div className='mb-1 text-xs text-gray-500'>カラー</div>
                  <div className='flex items-center gap-2'>
                    <span
                      className='inline-block h-5 w-5 rounded-full border'
                      style={{ backgroundColor: event?.backgroundColor }}
                    />
                    <span className='text-xs text-gray-500'>
                      {event?.backgroundColor || '未設定'}
                    </span>
                  </div>
                </div>
                {/* 詳細説明 */}
                <div>
                  <div className='mb-1 text-xs text-gray-500'>詳細説明</div>
                  <div className='whitespace-pre-line'>
                    {event?.description}
                  </div>
                </div>
              </div>
              {/* 右カラム：ゲスト */}
              <div className='w-full flex-shrink-0 md:w-1/3'>
                <div className='mb-1 text-xs text-gray-500'>ゲスト</div>
                <div className='flex max-h-48 flex-col gap-2 overflow-y-auto'>
                  {/* owner（主催者）を最初に表示 */}
                  {event?.extendedProps?.owner && (
                    <div className='flex w-full flex-row items-center gap-3 rounded bg-yellow-50 px-3 py-2'>
                      <span className='font-semibold'>
                        {event.extendedProps.owner.name}
                      </span>
                      <span className='ml-1 rounded bg-yellow-200 px-2 py-0.5 text-xs text-yellow-800'>
                        主催者
                      </span>
                      <span className='text-xs'>
                        {event.extendedProps.owner.position} /{' '}
                        {event.extendedProps.owner.rank}
                      </span>
                    </div>
                  )}
                  {/* members（ゲスト）を表示 */}
                  {event?.extendedProps?.members &&
                  event.extendedProps.members.length > 0 ? (
                    event.extendedProps.members.map((member: any) => (
                      <div
                        key={member.email}
                        className='flex w-full flex-row items-center gap-3 rounded bg-blue-50 px-3 py-2'
                      >
                        <span className='font-semibold'>{member.name}</span>
                        <span className='text-xs'>
                          {member.position} / {member.rank}
                        </span>
                      </div>
                    ))
                  ) : (
                    // <span className='text-xs text-gray-400'>ゲストなし</span>
                    <></>
                  )}
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
