'use client';

import React from 'react';
import { useToast } from '@/features/calendar/hooks/use-toast';
import { Button } from '@/features/calendar/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/features/calendar/components/ui/alert-dialog';
import { useEvents } from '@/features/calendar/context/events-context';
import { ToastAction } from './ui/toast';

interface EventDeleteFormProps {
  id?: string;
  title?: string;
}

export function EventDeleteForm({ id, title }: EventDeleteFormProps) {
  const { deleteEvent } = useEvents();
  const { eventDeleteOpen, setEventDeleteOpen, setEventViewOpen } = useEvents();

  const { toast } = useToast();

  async function onSubmit() {
    deleteEvent(id!);
    setEventDeleteOpen(false);
    setEventViewOpen(false);
    toast({
      // title: 'Event deleted!',
      title: '予定を削除しました！',
      action: (
        // <ToastAction altText={'Dismiss notification.'}>Dismiss</ToastAction>
        <ToastAction altText={'クリックして閉じる'}>閉じる</ToastAction>
      )
    });
  }

  return (
    <AlertDialog open={eventDeleteOpen} onOpenChange={setEventDeleteOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' onClick={() => setEventDeleteOpen(true)}>
          {/* Delete Event */}
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex flex-row items-center justify-between'>
            <h3>{title} を削除します</h3>
          </AlertDialogTitle>
          本当に予定を削除しますか？
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEventDeleteOpen(false)}>
            キャンセル
          </AlertDialogCancel>
          <Button variant='destructive' onClick={() => onSubmit()}>
            削除
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
