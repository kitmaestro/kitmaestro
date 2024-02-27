import { Component } from '@angular/core';
import { InProgressComponent } from '../alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-security-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './security-dashboard.component.html',
  styleUrl: './security-dashboard.component.scss'
})
export class SecurityDashboardComponent {

}
