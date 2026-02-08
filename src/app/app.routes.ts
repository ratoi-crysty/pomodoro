import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'timer', pathMatch: 'full' },
  {
    path: 'timer',
    loadComponent: () => import('./pomodoro/pages/timer/timer-page.component').then(
        (m) => m.TimerPageComponent,
      ),
  },
];
