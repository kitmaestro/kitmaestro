import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-english-dialog-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './english-dialog-generator.component.html',
  styleUrl: './english-dialog-generator.component.scss'
})
export class EnglishDialogGeneratorComponent {

}
