import { useState } from 'react';
import { Input } from '@/features/calendar/components/ui/input';
import { X } from 'lucide-react';
import { Member, memberCandidates } from '@/features/calendar/utils/data';
import {
  colorOptions,
  initialEvents,
  myStaffNo
} from '@/features/calendar/utils/data'; // colorOptionsをimport
import { EventAddForm } from './event-add-form';
import { Calendar } from '@/features/calendar/components/ui/calendar';
import { ja } from 'date-fns/locale';
import { useEvents } from '@/features/calendar/context/events-context';

interface UserSearchSidebarProps {
  selectedUsers: Member[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<Member[]>>;
  start: Date;
  end: Date;
}

export function UserSearchSidebar({
  selectedUsers,
  setSelectedUsers,
  start,
  end,
  setUserEvents // 追加: カレンダー側でuseStateして渡す
}: UserSearchSidebarProps & {
  setUserEvents: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [input, setInput] = useState('');
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(start);
  const { events } = useEvents(); // カレンダーのイベントを取得

  // 色割り当て: indexで循環
  const getUserColor = (idx: number) => colorOptions[idx % colorOptions.length];

  // 検索候補
  const filteredCandidates = memberCandidates
    .filter(
      (member) =>
        (member.name.includes(input) || member.email.includes(input)) &&
        !selectedUsers.some((u) => u.email === member.email) &&
        member.staffNo !== myStaffNo // 自分は候補から除外
    )
    .map((member, idx) => ({
      ...member,
      color: getUserColor(idx)
    }));

  // ユーザー選択時
  const handleSelect = (member: Member) => {
    // 色を割り当て
    const idx = selectedUsers.length;
    const color = getUserColor(idx);

    setSelectedUsers((prev) => [...prev, { ...member, color }]);
    setInput('');

    // eventsから該当ユーザーのイベントを抽出し色を上書き
    const userEvents = events
      .filter(
        (event) =>
          event.extendedProps?.owner?.email === member.email ||
          (event.extendedProps?.members ?? []).some(
            (m: any) => m.email === member.email
          )
      )
      .map((event) => ({
        ...event,
        id: String(event.id + member.staffNo), // ユニークIDを確保
        color,
        backgroundColor: color
      }));

    setUserEvents((prev: any[]) => [...prev, ...userEvents]);
  };

  // ユーザー削除時
  const handleRemove = (email: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.email !== email));
    setUserEvents((prev: any[]) =>
      prev.filter(
        (event) =>
          event.extendedProps?.owner?.email !== email &&
          !(event.extendedProps?.members ?? []).some(
            (m: any) => m.email === email
          )
      )
    );
  };

  return (
    <div className='h-vh mr-2 flex w-auto flex-col border-r p-4'>
      {/* Add event button  */}
      <EventAddForm start={start} end={end} />
      <hr className='my-3' />
      {/* ここにShadcnuiのカレンダーを表示 */}
      <div className='mb-3'>
        <Calendar
          mode='single'
          selected={selectedDate}
          locale={ja} // ここを追加
          onSelect={(date) => {
            if (!date) return;
            setSelectedDate(date); // ここで選択日を更新
            // FullCalendarの表示切替
            // window.dispatchEventでカレンダーに通知
            window.dispatchEvent(
              new CustomEvent('sidebar-calendar-select', { detail: { date } })
            );
          }}
          className='rounded-md border shadow-md'
        />
      </div>
      <hr className='my-3' />
      <div className='mb-2 text-lg font-bold'>ユーザー検索</div>
      <Input
        placeholder='ユーザー名・メールで検索'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='mb-2'
      />
      {input && filteredCandidates.length > 0 && (
        <ul className='mb-2 max-h-40 overflow-auto rounded border shadow'>
          {filteredCandidates.map((member, idx) => (
            <li
              key={member.email}
              className='cursor-pointer px-2 py-2 hover:bg-blue-50'
              // style={{ backgroundColor: member.color }}
              onClick={() => handleSelect(member)}
            >
              <div className='flex flex-col'>
                <span className='font-xs'>{member.name}</span>
                <span className='text-xs text-gray-600'>{member.email}</span>
                {/* <span className='text-xs'>
                  {member.position} / {member.rank}
                </span> */}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='mt-2 space-y-2'>
        {selectedUsers.map((user) => (
          <div
            style={{ backgroundColor: user.color }}
            key={user.email}
            className='relative flex items-center justify-between rounded bg-blue-50 px-3 py-1'
            onMouseEnter={() => setHoveredEmail(user.email)}
            onMouseLeave={() => setHoveredEmail(null)}
          >
            <div>
              <span className='text-xs'>{user.name}</span>
            </div>
            <button
              className='ml-2 text-gray-400 hover:text-red-500'
              onClick={() => handleRemove(user.email)}
              aria-label='削除'
            >
              <X className='h-4 w-4' />
            </button>
            {/* ホバー時に詳細表示 */}
            {hoveredEmail === user.email && (
              <div className='absolute top-1 left-full z-10 ml-2 w-56 rounded border bg-white p-3 text-xs shadow-lg'>
                <div className='font-bold'>{user.name}</div>
                <div className='text-gray-600'>{user.email}</div>
                <div>
                  {user.position} / {user.rank}
                </div>
                <div>スタッフNo: {user.staffNo}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
