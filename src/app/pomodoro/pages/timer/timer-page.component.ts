import { Component, inject } from '@angular/core';
import { PomodoroService } from '../../pomodoro.service';
import { TimerDisplayComponent } from '../../components/timer-display/timer-display.component';
import { SessionProgressComponent } from '../../components/session-progress/session-progress.component';
import { TimerControlsComponent } from '../../components/timer-controls/timer-controls.component';

@Component({
  selector: 'app-pomodoro-page',
  standalone: true,
  imports: [TimerDisplayComponent, SessionProgressComponent, TimerControlsComponent],
  templateUrl: './timer-page.component.html',
  styleUrl: './timer-page.component.scss',
})
export class TimerPageComponent {
  readonly pomodoro: PomodoroService = inject(PomodoroService);
}
