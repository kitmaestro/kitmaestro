import { Component } from '@angular/core';
import { InProgressComponent } from '../alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-formation-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './formation-dashboard.component.html',
  styleUrl: './formation-dashboard.component.scss'
})
export class FormationDashboardComponent {

}
