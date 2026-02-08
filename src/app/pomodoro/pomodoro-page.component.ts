import { Component, inject } from '@angular/core';
import { PomodoroService } from './pomodoro.service';
import { TimerDisplayComponent } from './components/timer-display.component';
import { SessionProgressComponent } from './components/session-progress.component';
import { TimerControlsComponent } from './components/timer-controls.component';

@Component({
  selector: 'app-pomodoro-page',
  standalone: true,
  imports: [TimerDisplayComponent, SessionProgressComponent, TimerControlsComponent],
  template: `
    <div class="page">
      <app-timer-display
        [formattedTime]="pomodoro.formattedTime()"
        [sessionLabel]="pomodoro.sessionLabel()"
        [sessionType]="pomodoro.state().sessionType"
        [progressPercent]="pomodoro.progressPercent()"
      />

      <app-session-progress
        [currentSession]="pomodoro.state().currentSession"
        [totalSessions]="pomodoro.state().totalSessions"
        [sessionType]="pomodoro.state().sessionType"
      />

      <app-timer-controls
        [status]="pomodoro.state().status"
        (start)="pomodoro.start()"
        (pause)="pomodoro.pause()"
        (reset)="pomodoro.reset()"
      />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
    }

    .page {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 36px;
      padding: 40px 24px;
    }
  `,
})
export class PomodoroPageComponent {
  readonly pomodoro: PomodoroService = inject(PomodoroService);
}
