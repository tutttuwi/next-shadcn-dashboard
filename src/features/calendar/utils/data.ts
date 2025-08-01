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
 * 初期イベントデータ
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
    backgroundColor: '#76c7ef',
    description: '本日のタスクを確認するための定例ミーティングです。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 2,
        name: '鈴木 花子',
        email: 'suzuki@example.com',
        position: 'デザイナー',
        rank: '一般'
      },
      members: [
        {
          staffNo: 1,
          name: '佐藤 太郎',
          email: 'sato@example.com',
          position: 'エンジニア',
          rank: '主任'
        },
        {
          staffNo: 3,
          name: '高橋 健',
          email: 'takahashi@example.com',
          position: 'マネージャー',
          rank: '課長'
        }
      ]
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
    backgroundColor: '#76c7ef',
    description: 'Cracker Barrel にて、統合クライアントとのランチです。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 3,
        name: '高橋 健',
        email: 'takahashi@example.com',
        position: 'マネージャー',
        rank: '課長'
      },
      members: [
        {
          staffNo: 2,
          name: '鈴木 花子',
          email: 'suzuki@example.com',
          position: 'デザイナー',
          rank: '一般'
        },
        {
          staffNo: 4,
          name: '田中 美咲',
          email: 'tanaka@example.com',
          position: 'エンジニア',
          rank: '一般'
        }
      ]
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
    backgroundColor: '#76c7ef',
    description: '進捗に関してカウンセラーと話し合います。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 4,
        name: '田中 美咲',
        email: 'tanaka@example.com',
        position: 'エンジニア',
        rank: '一般'
      },
      members: [
        {
          staffNo: 5,
          name: '渡辺 一郎',
          email: 'watanabe@example.com',
          position: 'マーケター',
          rank: '主任'
        }
      ]
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
    backgroundColor: '#76c7ef',
    description: 'チームの絆を深め、戦略を計画するためのイベントです。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 5,
        name: '渡辺 一郎',
        email: 'watanabe@example.com',
        position: 'マーケター',
        rank: '主任'
      },
      members: [
        {
          staffNo: 1,
          name: '佐藤 太郎',
          email: 'sato@example.com',
          position: 'エンジニア',
          rank: '主任'
        },
        {
          staffNo: 2,
          name: '鈴木 花子',
          email: 'suzuki@example.com',
          position: 'デザイナー',
          rank: '一般'
        }
      ]
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
    backgroundColor: '#76c7ef',
    description: '効果的な時間管理のテクニックで生産性を向上させましょう。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 1,
        name: '佐藤 太郎',
        email: 'sato@example.com',
        position: 'エンジニア',
        rank: '主任'
      },
      members: [
        {
          staffNo: 3,
          name: '高橋 健',
          email: 'takahashi@example.com',
          position: 'マネージャー',
          rank: '課長'
        },
        {
          staffNo: 5,
          name: '渡辺 一郎',
          email: 'watanabe@example.com',
          position: 'マーケター',
          rank: '主任'
        }
      ]
    }
  },
  {
    id: '6',
    title: '健康とウェルネスフェア',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 20,
      9,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 25,
      15,
      0
    ),
    backgroundColor: '#76c7ef',
    description:
      '健康に関するリソースやウェルネスアクティビティを体験できます。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 2,
        name: '鈴木 花子',
        email: 'suzuki@example.com',
        position: 'デザイナー',
        rank: '一般'
      },
      members: [
        {
          staffNo: 4,
          name: '田中 美咲',
          email: 'tanaka@example.com',
          position: 'エンジニア',
          rank: '一般'
        }
      ]
    }
  },
  {
    id: '7',
    title: '読書会ディスカッション',
    allDay: true,
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 30,
      18,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 35,
      20,
      0
    ),
    backgroundColor: '#76c7ef',
    description: '今月の選書について読書会メンバーと語り合います。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 3,
        name: '高橋 健',
        email: 'takahashi@example.com',
        position: 'マネージャー',
        rank: '課長'
      },
      members: [
        {
          staffNo: 1,
          name: '佐藤 太郎',
          email: 'sato@example.com',
          position: 'エンジニア',
          rank: '主任'
        },
        {
          staffNo: 5,
          name: '渡辺 一郎',
          email: 'watanabe@example.com',
          position: 'マーケター',
          rank: '主任'
        }
      ]
    }
  },
  {
    id: '8',
    title: 'クリエイティブライティングワークショップ',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 40,
      14,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 45,
      16,
      0
    ),
    backgroundColor: '#76c7ef',
    description: '週末に開催される創作ライティングの演習に参加しましょう。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 4,
        name: '田中 美咲',
        email: 'tanaka@example.com',
        position: 'エンジニア',
        rank: '一般'
      },
      members: [
        {
          staffNo: 2,
          name: '鈴木 花子',
          email: 'suzuki@example.com',
          position: 'デザイナー',
          rank: '一般'
        }
      ]
    }
  },
  {
    id: '9',
    title: 'チャリティーファンドレイザー',
    start: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 50,
      19,
      0
    ),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 55,
      22,
      0
    ),
    backgroundColor: '#76c7ef',
    description: '良い目的のために資金を集める楽しい夜のイベントです。',
    extendedProps: {
      eventType: 'event',
      owner: {
        staffNo: 5,
        name: '渡辺 一郎',
        email: 'watanabe@example.com',
        position: 'マーケター',
        rank: '主任'
      },
      members: [
        {
          staffNo: 3,
          name: '高橋 健',
          email: 'takahashi@example.com',
          position: 'マネージャー',
          rank: '課長'
        }
      ]
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

export const myStaffNo = 1; // TODO: セッション情報などから取得して設定する

export const colorOptions = [
  '#CFEAFE', // 淡い青（旧 #76c7ef の淡色） 淡い青（旧 #76c7ef の淡色）
  '#FDE2E1', // 淡い赤（旧 #f87171 の淡色） // 淡い赤（旧 #f87171 の淡色）
  '#D1FAE5', // 淡い緑（旧 #34d399 の淡色） // 淡い緑（旧 #34d399 の淡色）
  '#FEF9C3', // 淡い黄（旧 #fbbf24 の淡色） // 淡い黄（旧 #fbbf24 の淡色）
  '#E9D5FF', // 淡い紫（旧 #a78bfa の淡色）, // 淡い紫（旧 #a78bfa の淡色）
  '#FFE4F0', // 追加：淡いピンク'#FFE4F0', // 追加：淡いピンク
  '#D1D5FF', // 追加：淡いブルーグレー  '#D1D5FF', // 追加：淡いブルーグレー
  '#D9F5FF' // 追加：淡いシアン  '#FDF6E3', // 追加：淡いクリーム  '#FDF6E3', // 追加：淡いクリーム
];
