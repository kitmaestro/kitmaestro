import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assistants-dashboard',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './assistants-dashboard.component.html',
  styleUrl: './assistants-dashboard.component.scss'
})
export class AssistantsDashboardComponent {
  working = false;
}
