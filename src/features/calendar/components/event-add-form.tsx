'use client';

import React, { useEffect } from 'react';
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
  allDay: z.boolean(),
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
    const newEvent = {
      id: String(events.length + 1),
      title: data.title,
      description: data.description,
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
          {/* <AlertDialogTitle>Add Event</AlertDialogTitle> */}
          <AlertDialogTitle>予定を追加</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2.5'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Title</FormLabel> */}
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    {/* <Input placeholder='Standup Meeting' {...field} /> */}
                    <Input placeholder='タイトルを追加' {...field} />
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
                  {/* <FormLabel>Description</FormLabel> */}
                  <FormLabel>詳細説明</FormLabel>
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
            {/* ✅ allDay の値が true の場合、FormField の外側に表示 */}
            {allDayValue && (
              <p className='mt-2 text-sm text-gray-700'>こんにちは</p>
            )}
            <FormField
              control={form.control}
              name='start'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  {/* <FormLabel htmlFor='datetime'>Start</FormLabel> */}
                  <FormLabel htmlFor='datetime'>開始時間</FormLabel>
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
            <FormField
              control={form.control}
              name='end'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  {/* <FormLabel htmlFor='datetime'>End</FormLabel> */}
                  <FormLabel htmlFor='datetime'>終了時間</FormLabel>
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
            <FormField
              control={form.control}
              name='allDay'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormControl>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked === 'indeterminate' ? false : checked
                          )
                        }
                      />
                      <label
                        htmlFor='terms'
                        className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
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
                  <FormLabel>カラー</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild className='cursor-pointer'>
                        <div className='flex w-full flex-row items-center space-x-2 pl-2'>
                          <div
                            className={`h-5 w-5 cursor-pointer rounded-full`}
                            style={{ backgroundColor: field.value }}
                          ></div>
                          <Input {...field} />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className='mx-auto flex items-center justify-center'>
                        <HexColorPicker
                          className='flex'
                          color={field.value}
                          onChange={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
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
