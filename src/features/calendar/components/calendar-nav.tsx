'use client';

import { cn } from '@/features/calendar/lib/utils';
import { months } from '@/features/calendar/utils/data';
import { calendarRef } from '@/features/calendar/utils/data';
import { Button } from '@/features/calendar/components/ui/button';
import {
  generateDaysInMonth,
  goNext,
  goPrev,
  goToday,
  handleDayChange,
  handleMonthChange,
  handleYearChange,
  setView
} from '@/features/calendar/utils/calendar-utils';
import { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  GalleryVertical,
  Table,
  Tally3
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/features/calendar/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/features/calendar/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Input } from '@/features/calendar/components/ui/input';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/features/calendar/components/ui/tabs';
import { EventAddForm } from './event-add-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/features/calendar/components/ui/select';

interface CalendarNavProps {
  calendarRef: calendarRef;
  start: Date;
  end: Date;
  viewedDate: Date;
  searchMode?: boolean;
  searchComponent?: React.ReactNode;
  eventTypeFilter?: string;
  setEventTypeFilter?: (type: string) => void;
}

export default function CalendarNav({
  calendarRef,
  start,
  end,
  viewedDate,
  searchMode,
  searchComponent,
  eventTypeFilter,
  setEventTypeFilter
}: CalendarNavProps) {
  const [currentView, setCurrentView] = useState('timeGridWeek');

  const selectedMonth = viewedDate.getMonth() + 1;
  const selectedDay = viewedDate.getDate();
  const selectedYear = viewedDate.getFullYear();

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dayOptions = generateDaysInMonth(daysInMonth);

  const [daySelectOpen, setDaySelectOpen] = useState(false);
  const [monthSelectOpen, setMonthSelectOpen] = useState(false);

  return (
    <div className='flex min-w-full flex-wrap justify-between gap-3 px-10'>
      <div className='flex flex-row space-x-1'>
        {/* Navigate to previous date interval */}

        {!searchMode && (
          <>
            <div className='flex flex-wrap justify-center gap-3'>
              <Button
                variant='ghost'
                className='w-8'
                onClick={() => {
                  goPrev(calendarRef);
                }}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              {/* Navigate to next date interval */}

              <Button
                variant='ghost'
                className='w-8'
                onClick={() => {
                  goNext(calendarRef);
                }}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>

              {/* Year Lookup */}

              <Input
                className='w-[75px] text-xs font-semibold md:w-[85px] md:text-sm'
                type='number'
                value={selectedYear}
                onChange={(value) =>
                  handleYearChange(calendarRef, viewedDate, value)
                }
              />

              {/* Month Lookup */}

              <Popover open={monthSelectOpen} onOpenChange={setMonthSelectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    className='flex w-[105px] justify-between overflow-hidden p-2 text-xs font-semibold md:w-[120px] md:text-sm'
                  >
                    {selectedMonth
                      ? months.find(
                          (month) => month.value === String(selectedMonth)
                        )?.label
                      : 'Select month...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    {/* <CommandInput placeholder='Search month...' /> */}
                    <CommandInput placeholder='月を選択' />
                    <CommandList>
                      {/* <CommandEmpty>No month found.</CommandEmpty> */}
                      <CommandEmpty>月が見つかりません</CommandEmpty>
                      <CommandGroup>
                        {months.map((month) => (
                          <CommandItem
                            key={month.value}
                            value={month.value}
                            onSelect={(currentValue) => {
                              handleMonthChange(
                                calendarRef,
                                viewedDate,
                                currentValue
                              );
                              //   setValue(currentValue === selectedMonth ? "" : currentValue);
                              setMonthSelectOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                String(selectedMonth) === month.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {month.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Day Lookup */}

              {currentView == 'timeGridDay' && (
                <Popover open={daySelectOpen} onOpenChange={setDaySelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      className='w-20 justify-between text-xs font-semibold'
                    >
                      {selectedDay
                        ? dayOptions.find(
                            (day) => day.value === String(selectedDay)
                          )?.label
                        : // : 'Select day...'
                          '日を選択'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      {/* <CommandInput placeholder='Search day...' /> */}
                      <CommandInput placeholder='日を選択' />
                      <CommandList>
                        {/* <CommandEmpty>No day found.</CommandEmpty> */}
                        <CommandEmpty>日付が見つかりません</CommandEmpty>
                        <CommandGroup>
                          {dayOptions.map((day) => (
                            <CommandItem
                              key={day.value}
                              value={day.value}
                              onSelect={(currentValue) => {
                                handleDayChange(
                                  calendarRef,
                                  viewedDate,
                                  currentValue
                                );
                                //   setValue(currentValue === selectedMonth ? "" : currentValue);
                                setDaySelectOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  String(selectedDay) === day.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {day.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className='flex flex-wrap items-start justify-center gap-3'>
              {/* Button to go to current date */}

              <Button
                className='w-[90px] text-xs md:text-sm'
                variant='outline'
                onClick={() => {
                  goToday(calendarRef);
                }}
              >
                {
                  // for english
                  // currentView === 'timeGridDay'
                  // ? 'Today'
                  // : currentView === 'timeGridWeek'
                  //   ? 'This Week'
                  //   : currentView === 'dayGridMonth'
                  //     ? 'This Month'
                  //     : null
                  currentView === 'timeGridDay'
                    ? '今日'
                    : currentView === 'timeGridWeek'
                      ? '今週'
                      : currentView === 'dayGridMonth'
                        ? '今月'
                        : null
                }
              </Button>
            </div>
            {/* Add event button  */}
            {/* <EventAddForm start={start} end={end} /> */}
          </>
        )}
      </div>

      <div className='flex flex-row items-start space-x-1'>
        {!searchMode && (
          <div className='flex items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='flex w-24 items-center justify-between text-xs md:text-sm'
                >
                  <span>
                    {currentView === 'dayGridMonth'
                      ? '月'
                      : currentView === 'timeGridWeek'
                        ? '週'
                        : currentView === 'timeGridDay'
                          ? '日'
                          : ''}
                  </span>
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem
                  onClick={() => {
                    setView(calendarRef, 'dayGridMonth', setCurrentView);
                  }}
                >
                  月
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setView(calendarRef, 'timeGridWeek', setCurrentView);
                  }}
                >
                  週
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setView(calendarRef, 'timeGridDay', setCurrentView);
                  }}
                >
                  日
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {/* Event Type Filter */}
        {searchMode && (
          <Select
            value={eventTypeFilter ?? '-'}
            onValueChange={(val) => {
              console.log('Event Type Filter:', val);
              console.log('setEventTypeFilter:', setEventTypeFilter);
              setEventTypeFilter && setEventTypeFilter(val);
              console.log('Event Type Filter set to:', eventTypeFilter);
            }}
          >
            <SelectTrigger className='w-28 text-xs md:text-sm'>
              <SelectValue placeholder='種別で絞り込み' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='-'>すべて</SelectItem>
              <SelectItem value='event'>予定</SelectItem>
              <SelectItem value='training'>研修</SelectItem>
            </SelectContent>
          </Select>
        )}

        {searchComponent && (
          <div className='flex items-center'>{searchComponent}</div>
        )}
      </div>
    </div>
  );
}
