<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Next.js Admin Dashboard Starter Template With Shadcn-ui</strong></div>
<div align="center">Built with the Next.js 15 App Router</div>
<br />
<div align="center">
<a href="#">デモ画面（調整中）</a>
<span>
</div>

## Overview

以下の技術スタックを利用

- Framework - [Next.js 15](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Auth - [Auth.js](https://authjs.dev/)
- Tables - [Tanstack Tables](https://ui.shadcn.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

Reactの管理画面スターターテンプレートを探しているならこのリポジトリを参照してください！

## ページ一覧

| Pages                                                                                 | Specifications                                                                                                                                                 |
| :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Signup](https://next-shadcn-dashboard-starter.vercel.app/)                           | Authentication with **NextAuth** supports Social logins and email logins (Enter dummy email for demo).                                                         |
| [Dashboard (Overview)](https://next-shadcn-dashboard-starter.vercel.app/dashboard)    | Cards with recharts graphs for analytics.Parallel routes in the overview sections with independent loading, error handling, and isolated component rendering . |
| [Product](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product)         | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                              |
| [Product/new](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product/new) | A Product Form with shadcn form (react-hook-form + zod).                                                                                                       |
| [Profile](https://next-shadcn-dashboard-starter.vercel.app/dashboard/profile)         | Mutistep dynamic forms using react-hook-form and zod for form validation.                                                                                      |
| [Kanban Board](https://next-shadcn-dashboard-starter.vercel.app/dashboard/kanban)     | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                         |
| [Not Found](https://next-shadcn-dashboard-starter.vercel.app/dashboard/notfound)      | Not Found Page Added in the root level                                                                                                                         |
| -                                                                                     | -                                                                                                                                                              |

## 機能一覧

```plaintext
src/
├── app/ # Next.js App Router directory
│ ├── (auth)/ # Auth route group
│ │ ├── (signin)/
│ ├── (dashboard)/ # Dashboard route group
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ └── api/ # API routes
│
├── components/ # Shared components
│ ├── ui/ # UI components (buttons, inputs, etc.)
│ └── layout/ # Layout components (header, sidebar, etc.)
│
├── features/ # Feature-based modules
│ ├── feature/
│ │ ├── components/ # Feature-specific components
│ │ ├── actions/ # Server actions
│ │ ├── schemas/ # Form validation schemas
│ │ └── utils/ # Feature-specific utilities
│ │
├── lib/ # Core utilities and configurations
│ ├── auth/ # Auth configuration
│ ├── db/ # Database utilities
│ └── utils/ # Shared utilities
│
├── hooks/ # Custom hooks
│ └── use-debounce.ts
│
├── stores/ # Zustand stores
│ └── dashboard-store.ts
│
└── types/ # TypeScript types
└── index.ts
```

## Getting Started

> [!NOTE]  
> **Next 15** と **React 19** を以下のステップに沿って使います。

Clone the repo:

```
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git
```

- `pnpm install` ( .npmrcに `legacy-peer-deps=true` を追加しておいてください)
- 以下のコマンドで `.env.local` ファイルを作成
  `cp env.example.txt .env.local`
- `.env.local` ファイルに必須パラメータを指定
- `pnpx auth secret` を実行しSecretを自動生成
- `pnpm run dev`

ローカル環境へアクセス http://localhost:3000.

> [!WARNING]
> リポジトリをクローンまたはフォークした後、最新の変更をプルまたは同期するときは、衝突を壊す可能性があるので注意してください。

頑張りましょう! 🥂

## アイコン

- <https://lucide.dev/>

## 改修タスク

### カレンダー機能

- [ ] 00:00-24:00まで表示してスクロールできるようにする
- [ ] shadcnのカレンダーエレメントを配置して、表示カレンダーと動機させる
- [ ] グループ内のメンバ検索ボックスを追加する
  - ダミーメンバを検索して表示できるようにする- Escキーでカレンダーを閉じる
- [ ] カレンダー検索ボックスを追加する
- [ ] 何もない領域でドラッグドロップしたときに自動的にカレンダー作成画面を開く
- [x] タイトルが長文になった際のレイアウト不正を修正
- [x] カレンダー領域のデザイン修正
  - 位置を中央配置にする
  - ３０分枠のカレンダーを設定しても枠内に文字が収まるようにする（文字サイズ調整、タイトルと時間のみの表示にするなど）
- [x] カレンダー重なり修正
  - 同じ色で重なっても見やすいように枠線をつける

## チャット機能

- [x] MostMatterと連携させる
  - [x] KeyCloak認証で連携し同一ユーザで利用できるようにする
  - [ ] 画面に埋め込めないか調査

## データ検索機能

- [ ] 検索ボックスと検索結果表示用のテーブルを表示するページ追加
  - [ ] レコード選択時に編集モーダルの表示
  - [ ] テーブルはDataTableを利用して作成
