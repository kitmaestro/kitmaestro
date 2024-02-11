import { Component } from '@angular/core';
import { InProgressComponent } from '../in-progress/in-progress.component';

@Component({
  selector: 'app-diversity-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './diversity-dashboard.component.html',
  styleUrl: './diversity-dashboard.component.scss'
})
export class DiversityDashboardComponent {

}
