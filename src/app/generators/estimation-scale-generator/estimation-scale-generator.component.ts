import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-estimation-scale-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './estimation-scale-generator.component.html',
  styleUrl: './estimation-scale-generator.component.scss'
})
export class EstimationScaleGeneratorComponent {
  working = false;
}
