import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
    selector: 'app-communication-dashboard',
    imports: [
        InProgressComponent,
    ],
    templateUrl: './communication-dashboard.component.html',
    styleUrl: './communication-dashboard.component.scss'
})
export class CommunicationDashboardComponent {

}
