import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-assistants-dashboard',
  standalone: true,
  imports: [
    IsPremiumComponent
  ],
  templateUrl: './assistants-dashboard.component.html',
  styleUrl: './assistants-dashboard.component.scss'
})
export class AssistantsDashboardComponent {
}
