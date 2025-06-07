import FullCalendar from '@fullcalendar/react';
import { RefObject } from 'react';

export type calendarRef = RefObject<FullCalendar | null>;

// setting earliest / latest available time in minutes since Midnight
// export const earliestTime = 540;
export const earliestTime = 0;
// export const latestTime = 1320;
export const latestTime = 1439; // 1440だとうまく表示できない

export const months = [
  {
    value: '1',
    label: '1月'
  },
  {
    value: '2',
    label: '2月'
  },
  {
    value: '3',
    label: '3月'
  },
  {
    value: '4',
    label: '4月'
  },
  {
    value: '5',
    label: '5月'
  },
  {
    value: '6',
    label: '6月'
  },
  {
    value: '7',
    label: '7月'
  },
  {
    value: '8',
    label: '8月'
  },
  {
    value: '9',
    label: '9月'
  },
  {
    value: '10',
    label: '10月'
  },
  {
    value: '11',
    label: '11月'
  },
  {
    value: '12',
    label: '12月'
  }
];
// export const months = [
//   {
//     value: '1',
//     label: 'January'
//   },
//   {
//     value: '2',
//     label: 'February'
//   },
//   {
//     value: '3',
//     label: 'March'
//   },
//   {
//     value: '4',
//     label: 'April'
//   },
//   {
//     value: '5',
//     label: 'May'
//   },
//   {
//     value: '6',
//     label: 'June'
//   },
//   {
//     value: '7',
//     label: 'July'
//   },
//   {
//     value: '8',
//     label: 'August'
//   },
//   {
//     value: '9',
//     label: 'September'
//   },
//   {
//     value: '10',
//     label: 'October'
//   },
//   {
//     value: '11',
//     label: 'November'
//   },
//   {
//     value: '12',
//     label: 'December'
//   }
// ];

const getRandomDays = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const currentDate = new Date();

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  description: string;
}

export const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'デイリースタンドアップミーティング',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      12,
      15
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      13,
      0
    ),
    backgroundColor: '#AEC6E4',
    description: '本日のタスクを確認するための定例ミーティングです。'
  },
  {
    id: '2',
    title: 'クライアントとのランチ',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      16,
      30
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      17,
      30
    ),
    backgroundColor: '#FFD1DC',
    description: 'Cracker Barrel にて、統合クライアントとのランチです。'
  },
  {
    id: '3',
    title: 'カウンセラーとの面談',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      18,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      18,
      45
    ),
    backgroundColor: '#B2E0B2',
    description: '進捗に関してカウンセラーと話し合います。'
  },
  {
    id: '4',
    title: 'チームリトリート',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 3,
      8,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 3,
      18,
      45
    ),
    backgroundColor: '#FFB3BA',
    description: 'チームの絆を深め、戦略を計画するためのイベントです。'
  },
  {
    id: '5',
    title: 'タイムマネジメント研修',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 5,
      10,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 5,
      15,
      30
    ),
    backgroundColor: '#FFDFBA',
    description: '効果的な時間管理のテクニックで生産性を向上させましょう。'
  },
  {
    id: '6',
    title: '健康とウェルネスフェア',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(20, 24),
      9,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(25, 29),
      15,
      0
    ),
    backgroundColor: '#B9FBC0',
    description:
      '健康に関するリソースやウェルネスアクティビティを体験できます。'
  },
  {
    id: '7',
    title: '読書会ディスカッション',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(30, 34),
      18,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(35, 39),
      20,
      0
    ),
    backgroundColor: '#C3B1E1',
    description: '今月の選書について読書会メンバーと語り合います。'
  },
  {
    id: '8',
    title: 'クリエイティブライティングワークショップ',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(40, 44),
      14,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(45, 49),
      16,
      0
    ),
    backgroundColor: '#B2E7E0',
    description: '週末に開催される創作ライティングの演習に参加しましょう。'
  },
  {
    id: '9',
    title: 'チャリティーファンドレイザー',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(50, 54),
      19,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + getRandomDays(55, 59),
      22,
      0
    ),
    backgroundColor: '#F6C9D8',
    description: '良い目的のために資金を集める楽しい夜のイベントです。'
  }
];
