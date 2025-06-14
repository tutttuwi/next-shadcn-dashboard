import { s } from '@fullcalendar/core/internal-common';
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
export interface Member {
  staffNo: number;
  name: string;
  email: string;
  position: string;
  rank: string;
}

// ダミーメンバー（日本人の名前・役職・階級で15人）
export const memberCandidates: Member[] = [
  {
    email: 'sato@example.com',
    name: '佐藤 太郎',
    position: 'エンジニア',
    rank: '主任',
    staffNo: 1
  },
  {
    email: 'suzuki@example.com',
    name: '鈴木 花子',
    position: 'デザイナー',
    rank: '一般',
    staffNo: 2
  },
  {
    email: 'takahashi@example.com',
    name: '高橋 健',
    position: 'マネージャー',
    rank: '課長',
    staffNo: 3
  },
  {
    email: 'tanaka@example.com',
    name: '田中 美咲',
    position: 'エンジニア',
    rank: '一般',
    staffNo: 4
  },
  {
    email: 'watanabe@example.com',
    name: '渡辺 一郎',
    position: 'マーケター',
    rank: '主任',
    staffNo: 5
  }
];

// メンバー候補からランダムにn人選ぶ関数
function getRandomMembers(n: number, excludeStaffNos: number[] = []) {
  // 除外リストを除いた候補
  const candidates = memberCandidates.filter(
    (m) => !excludeStaffNos.includes(m.staffNo)
  );
  // シャッフル
  const shuffled = [...candidates].sort(() => 0.5 - Math.random());
  // n人取得
  return shuffled
    .slice(0, n)
    .map(({ staffNo, name, email, position, rank }) => ({
      staffNo,
      name,
      email,
      position,
      rank
    }));
}

const defaultColor = '#76c7ef'; // デフォルトの背景色

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  backgroundColor?: string;
  description: string;
  color?: string;
  extendedProps?: Record<string, any>;
}

/**
 * 初期イベントデータ（自分の予定のみ定義）
 * @description カレンダーの初期イベントデータを定義します。
 * @returns CalendarEvent[] 初期イベントの配列
 */
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
    description: '本日のタスクを確認するための定例ミーティングです。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(3, [2])
    }
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
    description: 'Cracker Barrel にて、統合クライアントとのランチです。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(3, [2])
    }
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
    description: '進捗に関してカウンセラーと話し合います。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(2, [3])
    }
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
    description: 'チームの絆を深め、戦略を計画するためのイベントです。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(4, [4])
    }
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
    description: '効果的な時間管理のテクニックで生産性を向上させましょう。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(3, [5])
    }
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
      '健康に関するリソースやウェルネスアクティビティを体験できます。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(2, [6])
    }
  },
  {
    id: '7',
    title: '読書会ディスカッション',
    allDay: true,
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
    description: '今月の選書について読書会メンバーと語り合います。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(5, [7])
    }
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
    description: '週末に開催される創作ライティングの演習に参加しましょう。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(3, [8])
    }
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
    description: '良い目的のために資金を集める楽しい夜のイベントです。',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 1, name: '佐藤 太郎' },
      members: getRandomMembers(4, [9])
    }
  }
];

// 各メンバーごとのイベントを分けて定義
export const suzukiEvents: CalendarEvent[] = [
  {
    id: 'suzuki-1',
    title: 'デザインレビュー',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      14,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      15,
      0
    ),
    backgroundColor: '#FFD1DC',
    description: '新規プロジェクトのデザインレビュー',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 2, name: '鈴木 花子' },
      members: getRandomMembers(3, [2])
    }
  }
];

export const takahashiEvents: CalendarEvent[] = [
  {
    id: 'takahashi-1',
    title: 'マネージャー会議',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 2,
      9,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 2,
      10,
      30
    ),
    backgroundColor: '#B2E0B2',
    description: '部門マネージャーによる定例会議',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 3, name: '高橋 健' },
      members: getRandomMembers(2, [3])
    }
  }
];

export const tanakaEvents: CalendarEvent[] = [
  {
    id: 'tanaka-1',
    title: 'コードレビュー',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 3,
      16,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 3,
      17,
      0
    ),
    backgroundColor: '#FFB3BA',
    description: 'チームメンバーのコードレビュー',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 4, name: '田中 美咲' },
      members: getRandomMembers(2, [4])
    }
  }
];

export const watanabeEvents: CalendarEvent[] = [
  {
    id: 'watanabe-1',
    title: 'マーケティング戦略会議',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 4,
      11,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 4,
      12,
      0
    ),
    backgroundColor: '#FFDFBA',
    description: '新商品のマーケティング戦略を検討',
    extendedProps: {
      eventType: 'event',
      owner: { staffNo: 5, name: '渡辺 一郎' },
      members: getRandomMembers(3, [5])
    }
  }
];

// 既存の各メンバーイベント配列をまとめて1つの配列にマージ
export const allMemberEvents: CalendarEvent[] = [
  ...initialEvents,
  ...suzukiEvents,
  ...takahashiEvents,
  ...tanakaEvents,
  ...watanabeEvents
];
