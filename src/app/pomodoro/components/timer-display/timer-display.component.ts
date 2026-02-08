import { Component, computed, input } from '@angular/core';
import { SessionType } from '../../pomodoro.model';

interface SessionTheme {
  color: string;
  glowColor: string;
  trackColor: string;
}

const SESSION_THEMES: Record<SessionType, SessionTheme> = {
  [SessionType.Work]: {
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    trackColor: 'rgba(59, 130, 246, 0.08)',
  },
  [SessionType.ShortBreak]: {
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.15)',
    trackColor: 'rgba(52, 211, 153, 0.08)',
  },
  [SessionType.LongBreak]: {
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    trackColor: 'rgba(245, 158, 11, 0.08)',
  },
};

const RING_RADIUS: number = 120;
const RING_CIRCUMFERENCE: number = 2 * Math.PI * RING_RADIUS;

@Component({
  selector: 'app-timer-display',
  standalone: true,
  templateUrl: './timer-display.component.html',
  styleUrl: './timer-display.component.scss',
})
export class TimerDisplayComponent {
  readonly formattedTime = input.required<string>();
  readonly sessionLabel = input.required<string>();
  readonly sessionType = input.required<SessionType>();
  readonly progressPercent = input.required<number>();

  readonly radius: number = RING_RADIUS;
  readonly circumference: number = RING_CIRCUMFERENCE;

  readonly tickMarks: ReadonlyArray<{ angle: number; x1: number; y1: number; x2: number; y2: number }> =
    [0, 90, 180, 270].map((angle: number) => {
      const rad: number = (angle * Math.PI) / 180;
      const innerR: number = 128;
      const outerR: number = 133;
      return {
        angle,
        x1: 140 + innerR * Math.cos(rad),
        y1: 140 + innerR * Math.sin(rad),
        x2: 140 + outerR * Math.cos(rad),
        y2: 140 + outerR * Math.sin(rad),
      };
    });

  readonly theme = computed<SessionTheme>(() => {
    return SESSION_THEMES[this.sessionType()];
  });

  readonly dashOffset = computed<number>(() => {
    const percent: number = this.progressPercent();
    return RING_CIRCUMFERENCE * (1 - percent / 100);
  });

  readonly headPosition = computed<{ x: number; y: number }>(() => {
    const percent: number = this.progressPercent();
    const angle: number = (percent / 100) * 2 * Math.PI;
    return {
      x: 140 + RING_RADIUS * Math.cos(angle),
      y: 140 + RING_RADIUS * Math.sin(angle),
    };
  });
}
