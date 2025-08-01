// types/mina-scheduler.d.ts
declare module 'mina-scheduler' {
  export interface Task {
    id: string;
    name: string;
    execute: () => Promise<void>;
  }

  export function schedule(task: Task, interval: number): void;
  export function cancel(taskId: string): void;

  const minaScheduler: {
    schedule: typeof schedule;
    cancel: typeof cancel;
  };

  export default minaScheduler;
}
