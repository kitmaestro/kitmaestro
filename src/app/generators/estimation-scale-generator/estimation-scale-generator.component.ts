import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-estimation-scale-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './estimation-scale-generator.component.html',
  styleUrl: './estimation-scale-generator.component.scss'
})
export class EstimationScaleGeneratorComponent {

}
