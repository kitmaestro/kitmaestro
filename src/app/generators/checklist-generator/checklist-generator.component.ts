import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-checklist-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './checklist-generator.component.html',
  styleUrl: './checklist-generator.component.scss'
})
export class ChecklistGeneratorComponent {

}
