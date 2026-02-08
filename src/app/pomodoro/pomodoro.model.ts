export enum SessionType {
  Work = 'Work',
  ShortBreak = 'ShortBreak',
  LongBreak = 'LongBreak',
}

export enum TimerStatus {
  Idle = 'Idle',
  Running = 'Running',
  Paused = 'Paused',
}

export interface TimerState {
  sessionType: SessionType;
  currentSession: number;
  totalSessions: number;
  remainingSeconds: number;
  totalSeconds: number;
  status: TimerStatus;
}

export interface SessionConfig {
  workDurationSeconds: number;
  shortBreakDurationSeconds: number;
  longBreakDurationSeconds: number;
  totalWorkSessions: number;
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  workDurationSeconds: 25 * 60,
  shortBreakDurationSeconds: 5 * 60,
  longBreakDurationSeconds: 15 * 60,
  totalWorkSessions: 4,
};
