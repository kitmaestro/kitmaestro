import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-rubric-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './rubric-generator.component.html',
  styleUrl: './rubric-generator.component.scss'
})
export class RubricGeneratorComponent {

}
