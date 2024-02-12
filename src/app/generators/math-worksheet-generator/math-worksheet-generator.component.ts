import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-math-worksheet-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './math-worksheet-generator.component.html',
  styleUrl: './math-worksheet-generator.component.scss'
})
export class MathWorksheetGeneratorComponent {

}
