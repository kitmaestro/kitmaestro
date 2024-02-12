import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-english-worksheet-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './english-worksheet-generator.component.html',
  styleUrl: './english-worksheet-generator.component.scss'
})
export class EnglishWorksheetGeneratorComponent {

}
