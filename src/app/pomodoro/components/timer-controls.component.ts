import { Component, input, output } from '@angular/core';
import { TimerStatus } from '../pomodoro.model';

@Component({
  selector: 'app-timer-controls',
  standalone: true,
  template: `
    <div class="controls">
      @if (status() !== timerRunning) {
        <button class="btn btn-primary" (click)="start.emit()">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>{{ status() === timerPaused ? 'Resume' : 'Start' }}</span>
        </button>
      } @else {
        <button class="btn btn-primary" (click)="pause.emit()">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          <span>Pause</span>
        </button>
      }

      <button class="btn btn-ghost" (click)="reset.emit()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        <span>Reset</span>
      </button>
    </div>
  `,
  styles: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap');

    :host {
      display: block;
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 400;
      letter-spacing: 0.04em;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }

    .btn svg {
      flex-shrink: 0;
    }

    .btn-primary {
      padding: 12px 28px;
      background: rgba(59, 130, 246, 0.12);
      color: #7db4fc;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .btn-primary:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.35);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
    }

    .btn-primary:active {
      transform: scale(0.97);
    }

    .btn-ghost {
      padding: 10px 20px;
      background: rgba(224, 230, 237, 0.04);
      color: rgba(224, 230, 237, 0.5);
      border: 1px solid rgba(224, 230, 237, 0.08);
    }

    .btn-ghost:hover {
      background: rgba(224, 230, 237, 0.08);
      color: rgba(224, 230, 237, 0.7);
      border-color: rgba(224, 230, 237, 0.15);
    }

    .btn-ghost:active {
      transform: scale(0.97);
    }
  `,
})
export class TimerControlsComponent {
  readonly status = input.required<TimerStatus>();

  readonly start = output<void>();
  readonly pause = output<void>();
  readonly reset = output<void>();

  readonly timerRunning: TimerStatus = TimerStatus.Running;
  readonly timerPaused: TimerStatus = TimerStatus.Paused;
}
