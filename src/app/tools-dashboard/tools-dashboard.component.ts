import { Component } from '@angular/core';
import { InProgressComponent } from '../alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-tools-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './tools-dashboard.component.html',
  styleUrl: './tools-dashboard.component.scss'
})
export class ToolsDashboardComponent {

}
