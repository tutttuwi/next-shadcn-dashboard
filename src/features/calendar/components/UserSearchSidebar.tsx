import { useState } from 'react';
import { Input } from '@/features/calendar/components/ui/input';
import { X } from 'lucide-react';
import { Member, memberCandidates } from '@/features/calendar/utils/data';
import { EventAddForm } from './event-add-form';

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
  end
}: UserSearchSidebarProps) {
  const [input, setInput] = useState('');
  // const [selectedUsers, setSelectedUsers] = useState<typeof memberCandidates>(
  //   []
  // );
  const filteredCandidates = memberCandidates.filter(
    (member) =>
      (member.name.includes(input) || member.email.includes(input)) &&
      !selectedUsers.some((u) => u.email === member.email)
  );

  const handleSelect = (member: (typeof memberCandidates)[number]) => {
    setSelectedUsers((prev) => [...prev, member]);
    setInput('');
  };

  const handleRemove = (email: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.email !== email));
  };

  return (
    <div className='flex h-full w-64 flex-col border-r bg-white p-4'>
      {/* Add event button  */}
      <EventAddForm start={start} end={end} />
      <hr className='my-3' />
      <div className='mb-2 text-lg font-bold'>ユーザー検索</div>
      <Input
        placeholder='ユーザー名・メールで検索'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='mb-2'
      />
      {input && filteredCandidates.length > 0 && (
        <ul className='mb-2 max-h-40 overflow-auto rounded border bg-white shadow'>
          {filteredCandidates.map((member) => (
            <li
              key={member.email}
              className='cursor-pointer px-2 py-2 hover:bg-blue-50'
              onClick={() => handleSelect(member)}
            >
              <div className='flex flex-col'>
                <span className='font-semibold'>{member.name}</span>
                <span className='text-xs text-gray-600'>{member.email}</span>
                <span className='text-xs'>
                  {member.position} / {member.rank}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='mt-2 space-y-2'>
        {selectedUsers.map((user) => (
          <div
            key={user.email}
            className='flex items-center justify-between rounded bg-blue-50 px-3 py-2'
          >
            <div>
              <span className='font-semibold'>{user.name}</span>
              <span className='ml-2 text-xs text-gray-600'>{user.email}</span>
              <span className='ml-2 text-xs'>
                {user.position} / {user.rank}
              </span>
            </div>
            <button
              className='ml-2 text-gray-400 hover:text-red-500'
              onClick={() => handleRemove(user.email)}
              aria-label='削除'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
