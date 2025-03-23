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
      title: 'Event deleted!',
      action: (
        <ToastAction altText={'Dismiss notification.'}>Dismiss</ToastAction>
      )
    });
  }

  return (
    <AlertDialog open={eventDeleteOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' onClick={() => setEventDeleteOpen(true)}>
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex flex-row items-center justify-between'>
            <h1>Delete {title}</h1>
          </AlertDialogTitle>
          Are you sure you want to delete this event?
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEventDeleteOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant='destructive' onClick={() => onSubmit()}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
