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
import { PlusIcon, X, ChevronDown, ChevronUp } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch'; // shadcn/uiのSwitchを想定
import { CalendarEvent } from '../utils/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { myStaffNo, memberCandidates } from '../utils/data'; // myStaffNoを用意している場合

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
  const [showGuestList, setShowGuestList] = useState(true);
  const [eventType, setEventType] = useState<'event' | 'training'>('event');
  const [assignmentFiles, setAssignmentFiles] = useState<File[]>([]);
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);

  // 自分の情報を取得
  const myInfo = memberCandidates.find((m) => m.staffNo === myStaffNo);

  // 候補のフィルタリングもオブジェクトで
  const filteredCandidates = memberCandidates.filter(
    (member) =>
      (member.email.includes(memberInput) ||
        member.name.includes(memberInput) ||
        member.position.includes(memberInput) ||
        member.rank.includes(memberInput)) &&
      !selectedMembers.some((m) => m.email === member.email) &&
      member.email !== myInfo?.email // owner（自分）は候補から除外
  );

  /**
   * フォームのデフォルト値設定
   */
  useEffect(() => {
    const shhmm = start ? start.toTimeString().slice(0, 5) : '';
    const ehhmm = start ? end.toTimeString().slice(0, 5) : '';
    console.log('shhmm:', shhmm, 'ehhmm:', ehhmm);

    form.reset({
      title: '',
      description: '',
      start: start,
      end: end,
      members: [],
      allDay: shhmm == '00:00' && ehhmm == '00:00', // 終日エリアがクリックされた場合はtrue
      color: '#76c7ef'
    });
    setSelectedMembers([]); // ← 追加：初期表示時にselectedMembersを空で初期化
  }, [form, start, end]);

  async function onSubmit(data: EventAddFormValues) {
    const newEvent = {
      id: String(events.length + 1),
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      allDay: data.allDay,
      extendedProps: {
        owner: myInfo, // ← ここでownerとして自分を保存
        members: selectedMembers,
        backgroundColor: data.color,
        color: data.color,
        eventType
      },
      color: data.color,
      backgroundColor: data.color
    };
    console.log('Adding new event:', newEvent);
    addEvent(newEvent);
    setEventAddOpen(false);
    toast({
      title: '予定を登録しました！',
      action: <ToastAction altText={'クリックして閉じる'}>閉じる</ToastAction>
    });
  }

  const allDayValue = useWatch({
    control: form.control,
    name: 'allDay',
    defaultValue: false // ✅ 初期値を設定
  });

  // メンバー追加時はオブジェクトを追加
  const handleAddMember = (member: (typeof memberCandidates)[number]) => {
    // owner（自分）はmembersに追加できないようにガード
    if (member.email === myInfo?.email) return;
    setSelectedMembers((prev) => [...prev, member]);
    setMemberInput('');
  };

  // 色の配列を定義
  const colorOptions = ['#76c7ef', '#f87171', '#34d399', '#fbbf24', '#a78bfa'];

  // ファイル追加時、既存ファイルと重複しないものだけ追加
  const handleAssignmentFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    setAssignmentFiles((prev) => {
      // すでに同名ファイルがある場合は追加しない
      const existingNames = prev.map((f) => f.name);
      const newFiles = files.filter((f) => !existingNames.includes(f.name));
      return [...prev, ...newFiles];
    });
  };

  // ファイル削除
  const handleRemoveAssignmentFile = (name: string) => {
    setAssignmentFiles((prev) => prev.filter((f) => f.name !== name));
  };

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
      <AlertDialogContent className='flex h-[90vh] max-h-[90vh] w-[90vw] max-w-[90vw] flex-col justify-start overflow-y-auto'>
        <AlertDialogHeader>
          {/* スペース削減のためタイトル削除 */}
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2.5'>
            {/* 右上のキャンセル（×）ボタン */}
            <button
              type='button'
              className='absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500'
              onClick={() => setEventAddOpen(false)}
              aria-label='キャンセル'
            >
              <X className='h-6 w-6' />
            </button>

            {/* イベント種類ラジオ：1行で表示 */}
            <div className='mb-2 flex flex-row items-center justify-between gap-6'>
              <RadioGroup
                value={eventType}
                onValueChange={(val) =>
                  setEventType(val as 'event' | 'training')
                }
                className='flex flex-row gap-6'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='event' id='event-type-event' />
                  <label
                    htmlFor='event-type-event'
                    className='cursor-pointer text-sm'
                  >
                    予定
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='training' id='event-type-training' />
                  <label
                    htmlFor='event-type-training'
                    className='cursor-pointer text-sm'
                  >
                    研修
                  </label>
                </div>
              </RadioGroup>
            </div>
            {/* 2カラム：タイトル以下の列とゲスト追加の列 */}
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex-1 space-y-2.5'>
                {/* タイトル */}
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
                {/* 日時 */}
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
                {/* 終日・カラー */}
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
                {/* 研修の場合のみファイルアップロード */}
                {eventType === 'training' && (
                  <FormItem>
                    <div className='mb-1 flex items-center gap-2'>
                      <FormLabel className='mb-0 block text-sm font-medium'>
                        事前課題ファイル
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='file'
                          multiple
                          onChange={handleAssignmentFilesChange}
                          className='block w-auto py-2 text-sm'
                          title='事前課題ファイルを選択'
                          style={{}}
                        />
                      </FormControl>
                    </div>
                    {assignmentFiles.length > 0 && (
                      <div className='mt-1 flex flex-wrap gap-2 text-xs text-gray-600'>
                        {assignmentFiles.map((file, idx) => (
                          <div
                            key={file.name + idx}
                            className='flex items-center gap-2 rounded bg-gray-100 px-2 py-1'
                          >
                            <a
                              href={URL.createObjectURL(file)}
                              download={file.name}
                              className='cursor-pointer underline hover:text-blue-700'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {file.name}
                            </a>
                            <button
                              type='button'
                              className='text-gray-400 hover:text-red-500'
                              onClick={() =>
                                handleRemoveAssignmentFile(file.name)
                              }
                              aria-label='ファイルを削除'
                            >
                              <X className='h-4 w-4' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
                {/* 詳細 */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='説明を追加'
                          className='h-100 max-h-120'
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
                {/* 登録ボタンをゲスト追加の上・左詰めで表示 */}
                <div className='mb-2'>
                  <AlertDialogAction
                    type='submit'
                    className='bg-primary w-auto rounded px-6 py-2 text-sm'
                  >
                    登録
                  </AlertDialogAction>
                </div>
                {/* ゲスト追加フォーム */}
                <FormField
                  control={form.control}
                  name='members'
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div>
                          {/* オーナー（自分）を最初に表示 */}
                          {myInfo && (
                            <div className='mb-2 flex w-full flex-row items-center gap-2 rounded bg-yellow-50 px-3 py-2'>
                              <span className='font-semibold'>
                                {myInfo.name}
                              </span>
                              <span className='ml-1 rounded bg-yellow-200 px-2 py-0.5 text-xs text-yellow-800'>
                                主催者
                              </span>
                              <span className='text-xs'>
                                {myInfo.position} / {myInfo.rank}
                              </span>
                            </div>
                          )}
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
                                        <span className='font-xs'>
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
                                  className='relative flex w-full items-center justify-between rounded bg-blue-50 px-3 py-2'
                                  onMouseEnter={() =>
                                    setHoveredEmail(member.email)
                                  }
                                  onMouseLeave={() => setHoveredEmail(null)}
                                >
                                  <div className='flex w-full flex-row items-center gap-2'>
                                    <span className='text-xs'>
                                      {member.name}
                                    </span>
                                    <span className='text-xs text-gray-600'>
                                      {member.email}
                                    </span>
                                    {/* <span className='text-xs'>
                                      {member.position} / {member.rank}
                                    </span> */}
                                  </div>
                                  <button
                                    type='button'
                                    className='ml-2 text-lg text-blue-500 hover:text-blue-700'
                                    onClick={() =>
                                      setSelectedMembers((prev) =>
                                        prev.filter(
                                          (m) => m.email !== member.email
                                        )
                                      )
                                    }
                                  >
                                    <X className='h-5 w-5' />
                                  </button>
                                  {/* ホバー時に詳細情報を表示 */}
                                  {/* Zindexが勝てないため表示できない、要調査 */}
                                  {/* {hoveredEmail === member.email && (
                                    <div className='absolute top-0 left-full z-10000 ml-2 w-56 rounded border bg-white p-3 text-xs shadow-lg'>
                                      <div className='font-bold'>
                                        {member.name}
                                      </div>
                                      <div className='text-gray-600'>
                                        {member.email}
                                      </div>
                                      <div>
                                        {member.position} / {member.rank}
                                      </div>
                                      <div>スタッフNo: {member.staffNo}</div>
                                    </div>
                                  )} */}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
