import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-spanish-worksheet-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './spanish-worksheet-generator.component.html',
  styleUrl: './spanish-worksheet-generator.component.scss'
})
export class SpanishWorksheetGeneratorComponent {

}
