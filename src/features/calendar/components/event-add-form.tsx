'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z, ZodBoolean } from 'zod';
import { useToast } from '@/features/calendar/hooks/use-toast';
import { Button } from '@/features/calendar/components/ui/button';
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
import { PlusIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
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
import { Checkbox } from '@/components/ui/checkbox';

const eventAddFormSchema = z.object({
  title: z
    .string({ required_error: 'タイトルを入力してください' })
    .min(1, { message: 'タイトルは必須です。' }),
  // title: z
  // .string({ required_error: 'Please enter a title.' })
  // .min(1, { message: 'Must provide a title for this event.' }),
  // 詳細は任意とする
  description: z.string({ required_error: '詳細説明を入力してください' }),
  // description: z
  // .string({ required_error: 'Please enter a description.' })
  // .min(1, { message: 'Must provide a description for this event.' }),
  // start: z.date({
  //   required_error: 'Please select a start time',
  //   invalid_type_error: "That's not a date!"
  // }),
  // end: z.date({
  //   required_error: 'Please select an end time',
  //   invalid_type_error: "That's not a date!"
  // }),
  // color: z
  //   .string({ required_error: 'Please select an event color.' })
  //   .min(1, { message: 'Must provide a title for this event.' })
  start: z.date({
    required_error: '開始日時を選択してください',
    invalid_type_error: '開始日時が不正です。'
  }),
  end: z.date({
    required_error: '終了日時を選択してください',
    invalid_type_error: '終了日時が不正です。'
  }),
  allDay: z.boolean().optional(),
  members: z.string().array().optional(),
  color: z
    .string({ required_error: 'イベントカラーを選択してください' })
    .min(1, { message: 'イベントカラーは必須です。' })
});

type EventAddFormValues = z.infer<typeof eventAddFormSchema>;

interface EventAddFormProps {
  start: Date;
  end: Date;
}

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

export function EventAddForm({ start, end }: EventAddFormProps) {
  const { events, addEvent } = useEvents();
  const { eventAddOpen, setEventAddOpen } = useEvents();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof eventAddFormSchema>>({
    resolver: zodResolver(eventAddFormSchema)
  });

  // メンバー選択状態をメールアドレス配列からオブジェクト配列に変更
  const [memberInput, setMemberInput] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<
    typeof memberCandidates
  >([]);

  // 候補のフィルタリングもオブジェクトで
  const filteredCandidates = memberCandidates.filter(
    (member) =>
      (member.email.includes(memberInput) ||
        member.name.includes(memberInput) ||
        member.position.includes(memberInput) ||
        member.rank.includes(memberInput)) &&
      !selectedMembers.some((m) => m.email === member.email)
  );

  /**
   * フォームのデフォルト値設定
   */
  useEffect(() => {
    form.reset({
      title: '',
      description: '',
      start: start,
      end: end,
      color: '#76c7ef'
    });
  }, [form, start, end]);

  async function onSubmit(data: EventAddFormValues) {
    console.log('EventAddForm onSubmit', data);
    const newEvent = {
      id: String(events.length + 1),
      title: data.title,
      description: data.description,
      allDay: data.allDay,
      start: data.start,
      end: data.end,
      color: data.color
    };
    addEvent(newEvent);
    setEventAddOpen(false);
    toast({
      // title: 'Event added!',
      title: '予定を登録しました！',
      action: (
        // <ToastAction altText={'Click here to dismiss notification'}>
        <ToastAction altText={'クリックして閉じる'}>
          {/* Dismiss */}
          閉じる
        </ToastAction>
      )
    });
  }

  const allDayValue = useWatch({
    control: form.control,
    name: 'allDay',
    defaultValue: false // ✅ 初期値を設定
  });

  // メンバー追加時はオブジェクトを追加
  const handleAddMember = (member: (typeof memberCandidates)[number]) => {
    setSelectedMembers((prev) => [...prev, member]);
    setMemberInput('');
  };

  // 色の配列を定義
  const colorOptions = ['#76c7ef', '#f87171', '#34d399', '#fbbf24', '#a78bfa'];

  return (
    <AlertDialog open={eventAddOpen}>
      <AlertDialogTrigger className='flex' asChild>
        <Button
          className='w-24 text-xs md:w-28 md:text-sm'
          variant='default'
          onClick={() => setEventAddOpen(true)}
        >
          <PlusIcon className='h-3 w-3 md:h-5 md:w-5' />
          {/* <p>Add Event</p> */}
          <p>予定を追加</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* スペース削減のためタイトル削除 */}
          {/* <AlertDialogTitle>Add Event</AlertDialogTitle> */}
          {/* <AlertDialogTitle>予定を追加</AlertDialogTitle> */}
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2.5'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  {/* スペース削減のためラベルは削除 */}
                  {/* <FormLabel>Title</FormLabel> */}
                  {/* <FormLabel>タイトル</FormLabel> */}
                  <FormControl>
                    {/* <Input placeholder='Standup Meeting' {...field} /> */}
                    <Input placeholder='タイトルを追加' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        granularity={allDayValue ? 'day' : 'minute'}
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
                        granularity={allDayValue ? 'day' : 'minute'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex items-center gap-2'>
              <FormField
                control={form.control}
                name='allDay'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormControl>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='allDay'
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            const isAllDay =
                              checked === 'indeterminate' ? false : checked;
                            field.onChange(isAllDay);

                            if (isAllDay) {
                              // 開始日の時間を00:00、終了日の時間を翌日の00:00に設定
                              const startDate = form.getValues('start');
                              if (startDate) {
                                const newStart = new Date(startDate);
                                newStart.setHours(0, 0, 0, 0);
                                form.setValue('start', newStart);

                                const newEnd = new Date(newStart);
                                newEnd.setDate(newEnd.getDate() + 1);
                                newEnd.setHours(0, 0, 0, 0);
                                form.setValue('end', newEnd);
                              }
                            } else {
                              // propsで渡された値にリセット
                              form.setValue('start', start);
                              form.setValue('end', end);
                            }
                          }}
                        />
                        <label
                          htmlFor='allDay'
                          className='cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          終日
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
            <FormField
              control={form.control}
              name='members'
              render={() => (
                <FormItem>
                  {/* <FormLabel>招待メンバー</FormLabel> */}
                  <FormControl>
                    <div>
                      <div className='relative'>
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
                      {/* 選択済みメンバーの表示 */}
                      <div className='mt-2 flex w-full flex-col gap-2'>
                        {selectedMembers.map((member) => (
                          <div
                            key={member.email}
                            className='flex w-full items-center justify-between rounded bg-blue-50 px-3 py-2'
                          >
                            <div className='flex w-full flex-col'>
                              <span className='text-base font-semibold'>
                                {member.name}
                              </span>
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
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  {/* スペース削減のためラベルは削除 */}
                  {/* <FormLabel>Description</FormLabel> */}
                  {/* <FormLabel>詳細説明</FormLabel> */}
                  <FormControl>
                    <Textarea
                      // placeholder='Daily session'
                      placeholder='説明を追加'
                      // className='max-h-36'
                      className='h-36 max-h-46'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className='pt-2'>
              <AlertDialogCancel onClick={() => setEventAddOpen(false)}>
                {/* Cancel */}
                キャンセル
              </AlertDialogCancel>
              {/* <AlertDialogAction type='submit'>Add Event</AlertDialogAction> */}
              <AlertDialogAction type='submit'>登録</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
