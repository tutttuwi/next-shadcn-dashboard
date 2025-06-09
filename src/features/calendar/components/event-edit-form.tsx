'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/features/calendar/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/features/calendar/components/ui/form';
import { Input } from '@/features/calendar/components/ui/input';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { HexColorPicker } from 'react-colorful';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/features/calendar/components/ui/alert-dialog';
import { DateTimePicker } from './date-picker';
import { useEvents } from '@/features/calendar/context/events-context';
import { ToastAction } from './ui/toast';
import { CalendarEvent } from '@/features/calendar/utils/data';
import { Button } from './ui/button';
import { FilePenLine, ChevronDown, ChevronUp, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/features/calendar/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const eventEditFormSchema = z.object({
  id: z.string(),
  title: z
    .string({ required_error: 'Please enter a title.' })
    .min(1, { message: 'Must provide a title for this event.' }),
  description: z
    .string({ required_error: 'Please enter a description.' })
    .min(1, { message: 'Must provide a description for this event.' }),
  start: z.date({
    required_error: 'Please select a start time',
    invalid_type_error: "That's not a date!"
  }),
  end: z.date({
    required_error: 'Please select an end time',
    invalid_type_error: "That's not a date!"
  }),
  color: z
    .string({ required_error: 'Please select an event color.' })
    .min(1, { message: 'Must provide a title for this event.' })
});

type EventEditFormValues = z.infer<typeof eventEditFormSchema>;

interface EventEditFormProps {
  oldEvent?: CalendarEvent;
  event?: CalendarEvent;
  isDrag: boolean;
  displayButton: boolean;
}

// カラー選択肢
const colorOptions = ['#76c7ef', '#f87171', '#34d399', '#fbbf24', '#a78bfa'];

// ダミーメンバー（日本人の名前・役職・階級で15人）
const memberCandidates = [
  {
    email: 'sato@example.com',
    name: '佐藤 太郎',
    position: 'エンジニア',
    rank: '主任'
  },
  {
    email: 'suzuki@example.com',
    name: '鈴木 花子',
    position: 'デザイナー',
    rank: '一般'
  },
  {
    email: 'takahashi@example.com',
    name: '高橋 健',
    position: 'マネージャー',
    rank: '課長'
  },
  {
    email: 'tanaka@example.com',
    name: '田中 美咲',
    position: 'エンジニア',
    rank: '一般'
  },
  {
    email: 'watanabe@example.com',
    name: '渡辺 一郎',
    position: 'マーケター',
    rank: '主任'
  },
  {
    email: 'ito@example.com',
    name: '伊藤 由紀',
    position: 'エンジニア',
    rank: '部長'
  },
  {
    email: 'yamamoto@example.com',
    name: '山本 大輔',
    position: 'デザイナー',
    rank: '主任'
  },
  {
    email: 'nakamura@example.com',
    name: '中村 さくら',
    position: 'エンジニア',
    rank: '一般'
  },
  {
    email: 'kobayashi@example.com',
    name: '小林 直樹',
    position: 'マネージャー',
    rank: '課長'
  },
  {
    email: 'kato@example.com',
    name: '加藤 未来',
    position: 'マーケター',
    rank: '一般'
  },
  {
    email: 'yoshida@example.com',
    name: '吉田 拓海',
    position: 'エンジニア',
    rank: '主任'
  },
  {
    email: 'yamada@example.com',
    name: '山田 彩',
    position: 'デザイナー',
    rank: '一般'
  },
  {
    email: 'sasaki@example.com',
    name: '佐々木 亮',
    position: 'マネージャー',
    rank: '部長'
  },
  {
    email: 'yamaguchi@example.com',
    name: '山口 直子',
    position: 'エンジニア',
    rank: '課長'
  },
  {
    email: 'matsumoto@example.com',
    name: '松本 剛',
    position: 'マーケター',
    rank: '主任'
  }
];

export function EventEditForm({
  oldEvent,
  event,
  isDrag,
  displayButton
}: EventEditFormProps) {
  const { addEvent, deleteEvent } = useEvents();
  const { eventEditOpen, setEventEditOpen } = useEvents();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof eventEditFormSchema>>({
    resolver: zodResolver(eventEditFormSchema)
  });

  const [memberInput, setMemberInput] = React.useState('');
  const [selectedMembers, setSelectedMembers] = React.useState<
    typeof memberCandidates
  >([]);
  const [showGuestList, setShowGuestList] = React.useState(true);

  const handleEditCancellation = () => {
    if (isDrag && oldEvent) {
      const resetEvent = {
        id: oldEvent.id,
        title: oldEvent.title,
        description: oldEvent.description,
        start: oldEvent.start,
        end: oldEvent.end,
        color: oldEvent.backgroundColor!
      };

      deleteEvent(oldEvent.id);
      addEvent(resetEvent);
    }
    setEventEditOpen(false);
  };

  useEffect(() => {
    form.reset({
      id: event?.id,
      title: event?.title,
      description: event?.description,
      start: event?.start as Date,
      end: event?.end as Date,
      color: event?.backgroundColor
    });
  }, [form, event]);

  async function onSubmit(data: EventEditFormValues) {
    const newEvent = {
      id: data.id,
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      color: data.color
    };
    deleteEvent(data.id);
    addEvent(newEvent);
    setEventEditOpen(false);

    toast({
      // title: 'Event edited!',
      title: '予定を更新しました！',
      action: (
        // <ToastAction altText={'Click here to dismiss notification'}>
        <ToastAction altText={'クリックして閉じる'}>
          {/* Dismiss */}
          閉じる
        </ToastAction>
      )
    });
  }

  // フィルタリング
  const filteredCandidates = memberCandidates.filter(
    (member) =>
      (member.email.includes(memberInput) ||
        member.name.includes(memberInput) ||
        member.position.includes(memberInput) ||
        member.rank.includes(memberInput)) &&
      !selectedMembers.some((m) => m.email === member.email)
  );

  const handleAddMember = (member: (typeof memberCandidates)[number]) => {
    setSelectedMembers((prev) => [...prev, member]);
    setMemberInput('');
  };

  return (
    <AlertDialog open={eventEditOpen}>
      {displayButton && (
        <AlertDialogTrigger asChild>
          <Button
            className='mb-1 w-full text-xs sm:w-24 md:text-sm'
            variant='default'
            onClick={() => setEventEditOpen(true)}
          >
            {/* Edit Event */}
            予定を編集
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          {/* <AlertDialogTitle>Edit {event?.title}</AlertDialogTitle> */}
          <AlertDialogTitle>
            <FilePenLine className='inline-block' /> {event?.title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2.5'>
            {/* 2カラム：タイトル以下の列とゲスト追加の列 */}
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1 space-y-2.5'>
                {/* タイトル（ラベルなし） */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='タイトルを追加' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 日時（ラベルなし） */}
                <div className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name='start'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormControl>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            hourCycle={24}
                            granularity='minute'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex h-full items-center'>〜</div>
                  <FormField
                    control={form.control}
                    name='end'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormControl>
                          <DateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            hourCycle={24}
                            granularity='minute'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* カラー（ラベルなし） */}
                <FormField
                  control={form.control}
                  name='color'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue>
                              <div className='flex items-center'>
                                <span
                                  className='mb-0 inline-block h-4 w-4 rounded-full'
                                  style={{ backgroundColor: field.value }}
                                />
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color} value={color}>
                                <div className='flex items-center'>
                                  <span
                                    className='inline-block h-4 w-4 rounded-full'
                                    style={{ backgroundColor: color }}
                                  />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 詳細（ラベルなし） */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='説明を追加'
                          className='h-36 max-h-46'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* 右側：ゲスト追加 */}
              <div className='w-full flex-shrink-0 md:w-80'>
                <FormItem>
                  {/* ラベルなし */}
                  <FormControl>
                    <div>
                      <div className='mb-1 flex items-center gap-2'>
                        <div className='relative flex-1'>
                          <Input
                            type='text'
                            placeholder='ゲストを追加 (名前・メール・役職・階級で検索可)'
                            value={memberInput}
                            onChange={(e) => setMemberInput(e.target.value)}
                            autoComplete='off'
                          />
                          {memberInput && filteredCandidates.length > 0 && (
                            <ul className='absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded border bg-white shadow'>
                              {filteredCandidates.map((member) => (
                                <li
                                  key={member.email}
                                  className='cursor-pointer px-2 py-2 hover:bg-gray-100'
                                  onClick={() => handleAddMember(member)}
                                >
                                  <div className='flex flex-col'>
                                    <span className='font-semibold'>
                                      {member.name}
                                    </span>
                                    <span className='text-xs text-gray-600'>
                                      {member.email}
                                    </span>
                                    <span className='text-xs'>
                                      {member.position} / {member.rank}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <button
                          type='button'
                          aria-label={
                            showGuestList ? 'ゲスト非表示' : 'ゲスト表示'
                          }
                          className='flex items-center justify-center p-1'
                          onClick={() => setShowGuestList((prev) => !prev)}
                        >
                          {showGuestList ? (
                            <ChevronUp className='h-5 w-5' />
                          ) : (
                            <ChevronDown className='h-5 w-5' />
                          )}
                        </button>
                      </div>
                      {/* 選択済みメンバーの表示 */}
                      {showGuestList && (
                        <div className='mt-2 flex max-h-48 w-full flex-col gap-2 overflow-y-auto'>
                          {selectedMembers.map((member) => (
                            <div
                              key={member.email}
                              className='flex w-full items-center justify-between rounded bg-blue-50 px-3 py-2'
                            >
                              <div className='flex w-full flex-row items-center gap-2'>
                                <span className='text-xs'>{member.name}</span>
                                <span className='text-xs text-gray-600'>
                                  {member.email}
                                </span>
                                <span className='text-xs'>
                                  {member.position} / {member.rank}
                                </span>
                              </div>
                              <button
                                type='button'
                                className='ml-2 text-lg text-blue-500 hover:text-blue-700'
                                onClick={() =>
                                  setSelectedMembers((prev) =>
                                    prev.filter((m) => m.email !== member.email)
                                  )
                                }
                              >
                                <X className='h-5 w-5' />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              </div>
            </div>
            <AlertDialogFooter className='pt-2'>
              <AlertDialogCancel onClick={() => handleEditCancellation()}>
                キャンセル
              </AlertDialogCancel>
              <AlertDialogAction type='submit'>更新</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
