import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-resources-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './resources-dashboard.component.html',
  styleUrl: './resources-dashboard.component.scss'
})
export class ResourcesDashboardComponent {

}
