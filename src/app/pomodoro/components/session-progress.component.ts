import { Component, computed, input } from '@angular/core';
import { SessionType } from '../pomodoro.model';

interface DotState {
  index: number;
  cssClass: string;
}

@Component({
  selector: 'app-session-progress',
  standalone: true,
  template: `
    <div class="session-dots" [style.--accent]="accentColor()">
      @for (dot of dots(); track dot.index) {
        <div class="dot" [class]="dot.cssClass">
          <span class="dot-inner"></span>
        </div>
      }
    </div>
  `,
  styles: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300&display=swap');

    :host {
      display: block;
    }

    .session-dots {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }

    .dot {
      position: relative;
      width: 10px;
      height: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dot-inner {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid rgba(224, 230, 237, 0.2);
      background: transparent;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dot.completed .dot-inner {
      border-color: var(--accent);
      background: var(--accent);
      box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 40%, transparent);
    }

    .dot.current .dot-inner {
      border-color: var(--accent);
      animation: pulse 2s ease-in-out infinite;
    }

    .dot.future .dot-inner {
      border-color: rgba(224, 230, 237, 0.12);
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 30%, transparent);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 0%, transparent);
        transform: scale(1.15);
      }
    }
  `,
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
