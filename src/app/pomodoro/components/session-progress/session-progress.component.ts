import { Component, computed, input } from '@angular/core';
import { SessionType } from '../../pomodoro.model';

interface DotState {
  index: number;
  cssClass: string;
}

@Component({
  selector: 'app-session-progress',
  standalone: true,
  templateUrl: './session-progress.component.html',
  styleUrl: './session-progress.component.scss',
})
export class SessionProgressComponent {
  readonly currentSession = input.required<number>();
  readonly totalSessions = input.required<number>();
  readonly sessionType = input.required<SessionType>();

  readonly accentColor = computed<string>(() => {
    const type: SessionType = this.sessionType();
    switch (type) {
      case SessionType.Work:
        return '#3b82f6';
      case SessionType.ShortBreak:
        return '#34d399';
      case SessionType.LongBreak:
        return '#f59e0b';
    }
  });

  readonly dots = computed<ReadonlyArray<DotState>>(() => {
    const current: number = this.currentSession();
    const total: number = this.totalSessions();
    const type: SessionType = this.sessionType();
    const isBreak: boolean = type !== SessionType.Work;

    return Array.from({ length: total }, (_: unknown, i: number): DotState => {
      const session: number = i + 1;
      let cssClass: string;

      if (session < current) {
        cssClass = 'completed';
      } else if (session === current && isBreak) {
        cssClass = 'completed';
      } else if (session === current) {
        cssClass = 'current';
      } else {
        cssClass = 'future';
      }

      return { index: i, cssClass };
    });
  });
}
