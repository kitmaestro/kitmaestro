import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
    selector: 'app-reviews-dashboard',
    imports: [
        InProgressComponent,
    ],
    templateUrl: './reviews-dashboard.component.html',
    styleUrl: './reviews-dashboard.component.scss'
})
export class ReviewsDashboardComponent {

}
