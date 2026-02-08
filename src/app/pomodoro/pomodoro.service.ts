import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import {
  DEFAULT_SESSION_CONFIG,
  SessionConfig,
  SessionType,
  TimerState,
  TimerStatus,
} from './pomodoro.model';

const TICK_INTERVAL_MS: number = 100;

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly config: SessionConfig = DEFAULT_SESSION_CONFIG;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly state = signal<TimerState>({
    sessionType: SessionType.Work,
    currentSession: 1,
    totalSessions: this.config.totalWorkSessions,
    endTime: null,
    remainingMs: this.config.workDurationSeconds * 1000,
    totalMs: this.config.workDurationSeconds * 1000,
    status: TimerStatus.Idle,
  });

  readonly formattedTime = computed<string>((): string => {
    const remaining: number = this.state().remainingMs;
    const totalSeconds: number = Math.ceil(remaining / 1000);
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  readonly progressPercent = computed<number>(() => {
    const { remainingMs, totalMs }: TimerState = this.state();
    if (totalMs === 0) return 0;
    return ((totalMs - remainingMs) / totalMs) * 100;
  });

  readonly sessionLabel = computed<string>(() => {
    const { sessionType, currentSession, totalSessions }: TimerState =
      this.state();
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
    const now: number = Date.now();
    const remaining: number = this.state().remainingMs;
    this.state.update((s: TimerState) => ({
      ...s,
      endTime: now + remaining,
      status: TimerStatus.Running,
    }));
    this.intervalId = setInterval(() => this.tick(), TICK_INTERVAL_MS);
  }

  pause(): void {
    if (this.state().status !== TimerStatus.Running) return;
    this.clearInterval();
    const remaining: number = Math.max(
      0,
      this.state().endTime! - Date.now(),
    );
    this.state.update((s: TimerState) => ({
      ...s,
      endTime: null,
      remainingMs: remaining,
      status: TimerStatus.Paused,
    }));
  }

  reset(): void {
    this.clearInterval();
    const totalMs: number = this.config.workDurationSeconds * 1000;
    this.state.set({
      sessionType: SessionType.Work,
      currentSession: 1,
      totalSessions: this.config.totalWorkSessions,
      endTime: null,
      remainingMs: totalMs,
      totalMs,
      status: TimerStatus.Idle,
    });
  }

  private tick(): void {
    const current: TimerState = this.state();
    const remaining: number = Math.max(0, current.endTime! - Date.now());

    if (remaining <= 0) {
      this.clearInterval();
      this.transitionToNextSession(current);
      return;
    }

    this.state.update((s: TimerState) => ({
      ...s,
      remainingMs: remaining,
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

    const totalMs: number = this.getDurationForSession(nextType) * 1000;

    this.state.set({
      sessionType: nextType,
      currentSession: nextSession,
      totalSessions: current.totalSessions,
      endTime: null,
      remainingMs: totalMs,
      totalMs,
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
