import { Component, computed, input } from '@angular/core';
import { SessionType } from '../pomodoro.model';

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
  template: `
    <div
      class="timer-container"
      [style.--accent]="theme().color"
      [style.--glow]="theme().glowColor"
      [style.--track]="theme().trackColor"
    >
      <svg
        class="progress-ring"
        viewBox="0 0 280 280"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Outer decorative ring -->
        <circle
          class="ring-outer-decoration"
          cx="140"
          cy="140"
          r="134"
        />

        <!-- Track ring -->
        <circle
          class="ring-track"
          cx="140"
          cy="140"
          [attr.r]="radius"
          fill="none"
          [attr.stroke-width]="6"
        />

        <!-- Progress ring -->
        <circle
          class="ring-progress"
          cx="140"
          cy="140"
          [attr.r]="radius"
          fill="none"
          [attr.stroke-width]="6"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset()"
        />

        <!-- Tick marks at quarter positions -->
        @for (tick of tickMarks; track tick.angle) {
          <line
            class="tick-mark"
            [attr.x1]="tick.x1"
            [attr.y1]="tick.y1"
            [attr.x2]="tick.x2"
            [attr.y2]="tick.y2"
          />
        }

        <!-- Progress head dot -->
        <circle
          class="ring-head"
          [attr.cx]="headPosition().x"
          [attr.cy]="headPosition().y"
          r="4"
        />
      </svg>

      <div class="timer-content">
        <span class="timer-digits">{{ formattedTime() }}</span>
        <span class="timer-label">{{ sessionLabel() }}</span>
      </div>
    </div>
  `,
  styles: `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;500&family=Outfit:wght@300;400&display=swap');

    :host {
      display: block;
    }

    .timer-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 280px;
      height: 280px;
      margin: 0 auto;
    }

    .progress-ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
      filter: drop-shadow(0 0 18px var(--glow));
    }

    .ring-outer-decoration {
      fill: none;
      stroke: var(--track);
      stroke-width: 1;
      stroke-dasharray: 3 8;
    }

    .ring-track {
      stroke: var(--track);
    }

    .ring-progress {
      stroke: var(--accent);
      transition: stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  stroke 0.6s ease;
    }

    .ring-head {
      fill: var(--accent);
      transition: cx 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  cy 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  fill 0.6s ease;
      filter: drop-shadow(0 0 6px var(--accent));
    }

    .tick-mark {
      stroke: rgba(224, 230, 237, 0.12);
      stroke-width: 1;
    }

    .timer-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      z-index: 1;
    }

    .timer-digits {
      font-family: 'JetBrains Mono', monospace;
      font-size: 3.5rem;
      font-weight: 300;
      letter-spacing: 0.06em;
      color: #e0e6ed;
      line-height: 1;
      text-shadow: 0 0 30px var(--glow);
    }

    .timer-label {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      font-weight: 300;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      opacity: 0.85;
    }
  `,
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
