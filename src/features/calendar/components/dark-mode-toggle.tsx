'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/features/calendar/components/ui/button';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  function ToggleTheme() {
    if (theme == 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  return (
    <Button variant='outline' size='icon' onClick={ToggleTheme}>
      <SunIcon className='h-[1rem] w-[1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <MoonIcon className='absolute h-[1rem] w-[1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
