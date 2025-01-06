import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
    selector: 'app-formation-dashboard',
    imports: [
        InProgressComponent,
    ],
    templateUrl: './formation-dashboard.component.html',
    styleUrl: './formation-dashboard.component.scss'
})
export class FormationDashboardComponent {

}
