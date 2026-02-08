import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  DEFAULT_SESSION_CONFIG,
  SessionConfig,
  SessionType,
  TimerState,
  TimerStatus,
} from './pomodoro.model';

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly config: SessionConfig = DEFAULT_SESSION_CONFIG;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly state = signal<TimerState>({
    sessionType: SessionType.Work,
    currentSession: 1,
    totalSessions: this.config.totalWorkSessions,
    remainingSeconds: this.config.workDurationSeconds,
    totalSeconds: this.config.workDurationSeconds,
    status: TimerStatus.Idle,
  });

  readonly formattedTime = computed<string>(() => {
    const remaining: number = this.state().remainingSeconds;
    const minutes: number = Math.floor(remaining / 60);
    const seconds: number = remaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  readonly progressPercent = computed<number>(() => {
    const { remainingSeconds, totalSeconds }: TimerState = this.state();
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  });

  readonly sessionLabel = computed<string>(() => {
    const { sessionType, currentSession, totalSessions }: TimerState = this.state();
    switch (sessionType) {
      case SessionType.Work:
        return `Focus ${currentSession}/${totalSessions}`;
      case SessionType.ShortBreak:
        return 'Short Break';
      case SessionType.LongBreak:
        return 'Long Break';
    }
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.clearInterval());
  }

  start(): void {
    if (this.state().status === TimerStatus.Running) return;
    this.state.update((s: TimerState) => ({ ...s, status: TimerStatus.Running }));
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pause(): void {
    if (this.state().status !== TimerStatus.Running) return;
    this.clearInterval();
    this.state.update((s: TimerState) => ({ ...s, status: TimerStatus.Paused }));
  }

  reset(): void {
    this.clearInterval();
    this.state.set({
      sessionType: SessionType.Work,
      currentSession: 1,
      totalSessions: this.config.totalWorkSessions,
      remainingSeconds: this.config.workDurationSeconds,
      totalSeconds: this.config.workDurationSeconds,
      status: TimerStatus.Idle,
    });
  }

  private tick(): void {
    const current: TimerState = this.state();
    if (current.remainingSeconds <= 1) {
      this.clearInterval();
      this.transitionToNextSession(current);
      return;
    }
    this.state.update((s: TimerState) => ({
      ...s,
      remainingSeconds: s.remainingSeconds - 1,
    }));
  }

  private transitionToNextSession(current: TimerState): void {
    let nextType: SessionType;
    let nextSession: number = current.currentSession;

    if (current.sessionType === SessionType.Work) {
      if (current.currentSession >= current.totalSessions) {
        nextType = SessionType.LongBreak;
      } else {
        nextType = SessionType.ShortBreak;
      }
    } else {
      if (current.sessionType === SessionType.LongBreak) {
        nextSession = 1;
      } else {
        nextSession = current.currentSession + 1;
      }
      nextType = SessionType.Work;
    }

    const totalSeconds: number = this.getDurationForSession(nextType);

    this.state.set({
      sessionType: nextType,
      currentSession: nextSession,
      totalSessions: current.totalSessions,
      remainingSeconds: totalSeconds,
      totalSeconds,
      status: TimerStatus.Idle,
    });
  }

  private getDurationForSession(type: SessionType): number {
    switch (type) {
      case SessionType.Work:
        return this.config.workDurationSeconds;
      case SessionType.ShortBreak:
        return this.config.shortBreakDurationSeconds;
      case SessionType.LongBreak:
        return this.config.longBreakDurationSeconds;
    }
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
