import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-activity-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './activity-generator.component.html',
  styleUrl: './activity-generator.component.scss'
})
export class ActivityGeneratorComponent {
  working = false;
}
