import { Component } from '@angular/core';
import { InProgressComponent } from '../../alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-planner-generator',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './planner-generator.component.html',
  styleUrl: './planner-generator.component.scss'
})
export class PlannerGeneratorComponent {
  underDevelopment = true;
}
