'use client';

import { useEvents } from '@/features/calendar/context/events-context';
import '@/features/calendar/styles/calendar.css';
import {
  DateSelectArg,
  DayCellContentArg,
  DayHeaderContentArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg
} from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import { useRef, useState, useEffect } from 'react';
import CalendarNav from './calendar-nav';
import {
  allMemberEvents,
  CalendarEvent,
  earliestTime,
  latestTime,
  Member
} from '@/features/calendar/utils/data';
import { getDateFromMinutes } from '@/features/calendar/lib/utils';
import { Card } from './ui/card';
import { EventEditForm } from './event-edit-form';
import { EventView } from './event-view';
import { EventAddForm } from './event-add-form';
import { Input } from '@/features/calendar/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Search, Menu, Triangle } from 'lucide-react'; // 追加
import { Button } from '@/components/ui/button';
import { UserSearchSidebar } from './user-search-sidebar';

type EventItemProps = {
  info: EventContentArg;
};

type DayHeaderProps = {
  info: DayHeaderContentArg;
};

type DayRenderProps = {
  info: DayCellContentArg;
};

export default function Calendar() {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar | null>(null);
  const { events, setEventAddOpen, setEventViewOpen, setEventEditOpen } =
    useEvents();
  const [selectedStart, setSelectedStart] = useState<Date>(new Date());
  const [selectedEnd, setSelectedEnd] = useState<Date>(new Date());
  const [viewedDate, setViewedDate] = useState(new Date());
  const [selectedOldEvent, setSelectedOldEvent] = useState<
    CalendarEvent | undefined
  >();
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();
  const [isDrag, setIsDrag] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState('-');
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // サイドバー開閉用
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const idFromUrl = searchParams?.get('id');

  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchInput]);

  // カレンダーイベントクリック時の処理
  // イベントの詳細を表示するために、選択されたイベントを設定
  // また、イベントの編集や削除のために、選択されたイベントを設定
  // イベントの詳細を表示するために、選択されたイベントを設定
  const handleEventClick = (info: EventClickArg) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps?.description,
      backgroundColor: info.event.backgroundColor,
      allDay: info.event.allDay,
      extendedProps: info.event.extendedProps,
      start: info.event.start!,
      end: info.event.end!
    };
    console.log('handleEventClick info', info);
    console.log('handleEventClick', event);

    setIsDrag(false);
    setSelectedOldEvent(event);
    setSelectedEvent(event);
    setEventViewOpen(true);
  };

  const handleSearchEventClick = (event: CalendarEvent) => {
    // router.push(`/dashboard/calendar?id=${event.id}`);
    const found = events.find((e) => e.id === event.id);
    if (found) {
      setIsDrag(false);
      setSelectedOldEvent(found);
      setSelectedEvent(found);
      setEventViewOpen(true);
    }
  };

  const handleEventChange = (info: EventChangeArg) => {
    const event: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      backgroundColor: info.event.backgroundColor,
      start: info.event.start!,
      end: info.event.end!
    };

    const oldEvent: CalendarEvent = {
      id: info.oldEvent.id,
      title: info.oldEvent.title,
      description: info.oldEvent.extendedProps.description,
      backgroundColor: info.oldEvent.backgroundColor,
      start: info.oldEvent.start!,
      end: info.oldEvent.end!
    };

    setIsDrag(true);
    setSelectedOldEvent(oldEvent);
    setSelectedEvent(event);
    setEventEditOpen(true);
  };

  /**
   * カレンダーイベント表示コンポーネントアイテム
   * デフォルト表示で十分見やすいので未利用
   * @param param0
   * @returns
   */
  const EventItem = ({ info }: EventItemProps) => {
    const { event } = info;
    const [left, right] = info.timeText.split(' - ');

    return (
      <div className='w-full overflow-hidden'>
        {info.view.type == 'dayGridMonth' ? (
          <div
            style={{ backgroundColor: info.backgroundColor }}
            className={`line-clamp-1 flex w-full flex-col rounded-md px-2 py-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs`}
          >
            <p className='line-clamp-1 w-11/12 font-semibold text-gray-950'>
              {left} {event.title}
            </p>
            {/* <p className='text-gray-800'>{left}</p>
            <p className='text-gray-800'>{right}</p> */}
          </div>
        ) : (
          <div className='flex flex-col space-y-0 text-[0.5rem] sm:text-[0.6rem] md:text-xs'>
            <p className='line-clamp-1 w-full font-semibold text-gray-950'>
              {event.title}
            </p>
            <p className='line-clamp-1 text-gray-800'>{`${left} - ${right}`}</p>
          </div>
        )}
      </div>
    );
  };

  const DayHeader = ({ info }: DayHeaderProps) => {
    const [weekday] = info.text.split(' ');

    return (
      <div className='flex h-full items-center overflow-hidden'>
        {info.view.type == 'timeGridDay' ? (
          <div className='flex flex-col rounded-sm'>
            <p>
              {/* {info.date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })} */}
              {info.date.toLocaleDateString('ja', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                weekday: 'short'
              })}
            </p>
          </div>
        ) : info.view.type == 'timeGridWeek' ? (
          <div className='md:text-md flex w-full flex-col items-center space-y-0.5 rounded-sm text-xs sm:text-sm'>
            {/* <p className='flex font-semibold'>{weekday}</p> */}
            <p className='flex font-semibold'>
              {weekday.split('(')[1].replace(')', '')}
            </p>
            {info.isToday ? (
              <div className='md:text-md flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs sm:text-sm dark:bg-white'>
                <p className='font-light text-white dark:text-black'>
                  {info.date.getDate()}
                </p>
              </div>
            ) : (
              <div className='h-6 w-6 items-center justify-center rounded-full'>
                <p className='font-light'>{info.date.getDate()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col rounded-sm'>
            <p>{weekday}</p>
          </div>
        )}
      </div>
    );
  };

  const DayRender = ({ info }: DayRenderProps) => {
    return (
      <div className='flex'>
        {info.view.type == 'dayGridMonth' && info.isToday ? (
          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-white dark:bg-white dark:text-black'>
            {/* {info.dayNumberText} */}
            {info.dayNumberText.replace('日', '')}
          </div>
        ) : (
          <div className='flex h-7 w-7 items-center justify-center rounded-full text-sm'>
            {info.dayNumberText.replace('日', '')}
          </div>
        )}
      </div>
    );
  };

  // ドラッグ選択時の処理
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedStart(selectInfo.start);
    setSelectedEnd(selectInfo.end);
    setEventAddOpen(true);
  };

  const earliestHour = getDateFromMinutes(earliestTime)
    .getHours()
    .toString()
    .padStart(2, '0');
  const earliestMin = getDateFromMinutes(earliestTime)
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const latestHour = getDateFromMinutes(latestTime)
    .getHours()
    .toString()
    .padStart(2, '0');
  const latestMin = getDateFromMinutes(latestTime)
    .getMinutes()
    .toString()
    .padStart(2, '0');

  const calendarEarliestTime = `${earliestHour}:${earliestMin}`;
  const calendarLatestTime = `${latestHour}:${latestMin}`;

  // 検索処理
  // const handleSearch = () => {
  //   if (searchText.trim() === '') {
  //     setSearchMode(false);
  //     setFilteredEvents([]);
  //     return;
  //   }
  //   const filtered = events.filter(
  //     (event) =>
  //       // タイトルまたは説明に検索文字列が含まれる
  //       (event.title?.includes(searchText) ||
  //         event.description?.includes(searchText)) &&
  //       // イベントタイプフィルタもAND条件で追加
  //       (eventTypeFilter === '-' ||
  //         event.extendedProps?.eventType === eventTypeFilter)
  //   );
  //   setFilteredEvents(filtered);
  //   setSearchMode(true);
  // };

  // 入力ボックスのキーハンドラ
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // if (e.key === 'Enter') {
    //   handleSearch();
    // }
    if (searchText.trim() === '') {
      setSearchMode(false);
      setFilteredEvents([]);
      return;
    } else {
      setSearchMode(true);
    }
    if (e.key === 'Escape') {
      setSearchText('');
      setSearchMode(false);
      setFilteredEvents([]);
    }
  };

  // 入力クリア時
  useEffect(() => {
    if (searchText === '') {
      setSearchMode(false);
      setFilteredEvents([]);
    }
  }, [searchText]);

  useEffect(() => {
    if (idFromUrl && events.length > 0) {
      const found = events.find((e) => e.id === idFromUrl);
      if (found) {
        setSelectedEvent(found);
        setEventViewOpen(true);
      }
    }
  }, [idFromUrl, events]);

  // イベントが更新されたときに検索結果を更新
  // 検索モードのときにイベントが更新された場合、検索結果を再計算
  // useEffect(() => {
  //   if (searchMode && searchText.trim() !== '') {
  //     const filtered = events.filter(
  //       (event) =>
  //         event.title?.includes(searchText) ||
  //         event.description?.includes(searchText)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  // }, [events]);

  // イベントタイプフィルタの変更時
  // useEffect(() => {
  //   console.log('eventTypeFilter changed:', eventTypeFilter);
  //   // setEventTypeFilter(eventTypeFilter);
  //   const filtered =
  //     eventTypeFilter === '-'
  //       ? events
  //       : events.filter(
  //           (event) => event.extendedProps?.eventType === eventTypeFilter
  //         );
  //   console.log('Filtered events:', filtered);
  //   setFilteredEvents(filtered);
  // }, [eventTypeFilter, events]);

  // 検索モード・イベントタイプフィルタ両方をAND条件で絞り込み
  useEffect(() => {
    if (searchMode && searchText.trim() !== '') {
      const filtered = events.filter(
        (event) =>
          // タイトルまたは説明に検索文字列が含まれる
          (event.title?.includes(searchText) ||
            event.description?.includes(searchText)) &&
          // イベントタイプフィルタ
          (eventTypeFilter === '-' ||
            event.extendedProps?.eventType === eventTypeFilter)
      );
      setFilteredEvents(filtered);
    } else if (eventTypeFilter !== '-') {
      // 検索モードでない場合はタイプフィルタのみ
      const filtered = events.filter(
        (event) => event.extendedProps?.eventType === eventTypeFilter
      );
      setFilteredEvents(filtered);
    } else {
      // どちらも指定なし
      setFilteredEvents(events);
    }
  }, [events, searchMode, searchText, eventTypeFilter]);

  // 例: 選択されたメンバー配列
  const [selectedUsers, setSelectedUsers] = useState<Member[]>([]); // MemberTypeはmemberCandidatesの型

  // 選択されたstaffNo一覧
  const selectedStaffNos = selectedUsers.map((u) => u.staffNo);

  // イベントフィルタ
  const filteredUserEvents = allMemberEvents.filter((event) => {
    // 自分のカレンダーは常に表示
    const targetStaffNos = [...selectedStaffNos, 1];
    // ownerが含まれる
    const isOwner = targetStaffNos.includes(
      event.extendedProps?.owner?.staffNo
    );
    // membersに含まれる
    const isMember = (event.extendedProps?.members || []).some((m: any) =>
      targetStaffNos.includes(m.staffNo)
    );
    return isOwner || isMember;
  });

  useEffect(() => {
    const handler = (e: any) => {
      const date: Date = e.detail.date;
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;
      const view = calendarApi.view.type;
      if (view === 'dayGridMonth') {
        // 月表示: 選択月へ
        calendarApi.gotoDate(date);
      } else if (view === 'timeGridWeek' || view === 'dayGridWeek') {
        // 週表示: 選択週へ
        calendarApi.gotoDate(date);
      } else if (view === 'timeGridDay' || view === 'dayGridDay') {
        // 日表示: 選択日へ
        calendarApi.gotoDate(date);
      }
    };
    window.addEventListener('sidebar-calendar-select', handler);
    return () => window.removeEventListener('sidebar-calendar-select', handler);
  }, []);

  return (
    <div className='flex h-full'>
      {/* サイドバー */}
      {sidebarOpen && (
        <UserSearchSidebar
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          start={selectedStart}
          end={selectedEnd}
        />
      )}

      {/* サイドバー開閉トグルボタン */}
      {/* <Button
        className={`z-20 h-10 w-10 rounded bg-white p-2 shadow hover:bg-gray-100 ${
          sidebarOpen ? '' : ''
        }`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label={sidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
        style={{
          left: sidebarOpen ? '260px' : '16px', // サイドバー幅に合わせて調整
          transition: 'left 0.2s'
        }}
      >
        {sidebarOpen ? (
          // <Menu className='h-5 w-5' />
          <Triangle className='h-5 w-5 rotate-270' />
        ) : (
          <Triangle className='h-5 w-5 rotate-90' />
        )}
      </Button> */}

      {/* メインカレンダー領域 */}
      <div className='flex-1 pl-0'>
        <div className='space-y-5'>
          <CalendarNav
            calendarRef={calendarRef}
            start={selectedStart}
            end={selectedEnd}
            viewedDate={viewedDate}
            searchMode={searchMode}
            searchComponent={
              <div className='mb-2 flex justify-end'>
                {showSearchInput ? (
                  <Input
                    ref={searchInputRef}
                    className='w-40'
                    placeholder='予定を検索'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => {
                      if (!searchText) setShowSearchInput(false);
                    }}
                  />
                ) : (
                  <Button
                    type='button'
                    className='bg-white p-2 text-gray-500 hover:text-blue-600'
                    onClick={() => setShowSearchInput(true)}
                    aria-label='検索'
                  >
                    <Search className='h-5 w-5' />
                  </Button>
                )}
              </div>
            }
            eventTypeFilter={eventTypeFilter}
            setEventTypeFilter={setEventTypeFilter}
          />

          {/* 検索結果テーブル */}
          {searchMode ? (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>種別</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>開始</TableHead>
                    <TableHead>終了</TableHead>
                    <TableHead className='w-1/3 truncate'>説明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className='py-2 text-center'>
                        該当する予定がありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => (
                      <TableRow
                        key={event.id}
                        className='cursor-pointer hover:bg-blue-50'
                        onClick={() => handleSearchEventClick(event)}
                      >
                        {/* 種別列 */}
                        <TableCell>
                          {event.extendedProps?.eventType === 'training' ? (
                            <span
                              className='rounded-full px-3 py-1 text-xs font-medium'
                              style={{
                                backgroundColor:
                                  event.backgroundColor ?? '#bfdbfe',
                                color: '#1e40af'
                              }}
                            >
                              研修
                            </span>
                          ) : (
                            <span
                              className='rounded-full px-3 py-1 text-xs font-medium'
                              style={{
                                backgroundColor:
                                  event.backgroundColor ?? '#f3f4f6',
                                color: '#374151'
                              }}
                            >
                              予定
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{event.start?.toLocaleString()}</TableCell>
                        <TableCell>{event.end?.toLocaleString()}</TableCell>
                        <TableCell className='w-48 max-w-64 min-w-32 truncate'>
                          <span className='block overflow-hidden text-ellipsis whitespace-nowrap'>
                            {event.description}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <>
              <Card className='p-3'>
                <FullCalendar
                  locale={'ja'} // 日本語化
                  navLinks // カレンダー内の日付クリックで日表示に移動するかどうか
                  ref={calendarRef}
                  timeZone='local'
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    multiMonthPlugin,
                    interactionPlugin,
                    listPlugin
                  ]}
                  initialView='timeGridWeek'
                  headerToolbar={false}
                  slotMinTime={calendarEarliestTime}
                  slotMaxTime={calendarLatestTime}
                  allDaySlot={true}
                  allDayText='終日'
                  firstDay={0} // 0: 日曜日, 1: 月曜日
                  height={'80vh'} // 管理画面埋め込み調整
                  scrollTime='08:00:00'
                  displayEventEnd={true}
                  windowResizeDelay={0}
                  events={events}
                  slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit'
                    // hour12: true
                  }}
                  eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit'
                    // hour12: true
                  }}
                  eventBorderColor={'black'}
                  // contentHeight={'auto'} // autoだとカレンダーの時間ビューをスクロールできない

                  expandRows={true}
                  dayCellContent={(dayInfo) => <DayRender info={dayInfo} />}
                  // eventContent={(eventInfo) => <EventItem info={eventInfo} />}
                  dayHeaderContent={(headerInfo) => (
                    <DayHeader info={headerInfo} />
                  )}
                  eventClick={(eventInfo) => handleEventClick(eventInfo)}
                  eventChange={(eventInfo) => handleEventChange(eventInfo)}
                  select={handleDateSelect}
                  datesSet={(dates) => setViewedDate(dates.view.currentStart)}
                  dateClick={() => setEventAddOpen(true)}
                  nowIndicator // 現在時刻に赤のインジケータを表示
                  editable
                  selectable
                  dayMaxEvents // 月表示ではみ出たイベントを「+N more」の表示にする
                />
              </Card>
            </>
          )}

          <EventEditForm
            oldEvent={selectedOldEvent}
            event={selectedEvent}
            isDrag={isDrag}
            displayButton={false}
          />
          <EventView event={selectedEvent} />
        </div>
      </div>
    </div>
  );
}
