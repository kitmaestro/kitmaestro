import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-estimation-scale',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './estimation-scale.component.html',
  styleUrl: './estimation-scale.component.scss'
})
export class EstimationScaleComponent {

}
