import { Component } from '@angular/core';
import { InProgressComponent } from '../in-progress/in-progress.component';

@Component({
  selector: 'app-reviews-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './reviews-dashboard.component.html',
  styleUrl: './reviews-dashboard.component.scss'
})
export class ReviewsDashboardComponent {

}
