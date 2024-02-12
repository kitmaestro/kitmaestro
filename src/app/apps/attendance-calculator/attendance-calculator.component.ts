import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-attendance-calculator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './attendance-calculator.component.html',
  styleUrl: './attendance-calculator.component.scss'
})
export class AttendanceCalculatorComponent {

}
