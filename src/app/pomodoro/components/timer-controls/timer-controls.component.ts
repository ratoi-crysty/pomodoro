import { Component, input, output } from '@angular/core';
import { TimerStatus } from '../../pomodoro.model';

@Component({
  selector: 'app-timer-controls',
  standalone: true,
  templateUrl: './timer-controls.component.html',
  styleUrl: './timer-controls.component.scss',
})
export class TimerControlsComponent {
  readonly status = input.required<TimerStatus>();

  readonly start = output<void>();
  readonly pause = output<void>();
  readonly reset = output<void>();

  readonly timerRunning: TimerStatus = TimerStatus.Running;
  readonly timerPaused: TimerStatus = TimerStatus.Paused;
}
