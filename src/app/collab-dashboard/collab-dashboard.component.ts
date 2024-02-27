import { Component } from '@angular/core';
import { InProgressComponent } from '../alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-collab-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './collab-dashboard.component.html',
  styleUrl: './collab-dashboard.component.scss'
})
export class CollabDashboardComponent {

}
