import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
    selector: 'app-collab-dashboard',
    imports: [
        InProgressComponent,
    ],
    templateUrl: './collab-dashboard.component.html',
    styleUrl: './collab-dashboard.component.scss'
})
export class CollabDashboardComponent {

}
