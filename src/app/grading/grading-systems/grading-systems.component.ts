import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-grading-systems',
  standalone: true,
  imports: [
    InProgressComponent,
    IsPremiumComponent,
  ],
  templateUrl: './grading-systems.component.html',
  styleUrl: './grading-systems.component.scss'
})
export class GradingSystemsComponent {

}
