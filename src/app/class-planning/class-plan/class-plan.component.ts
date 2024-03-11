import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-class-plan',
  standalone: true,
  imports: [
    AsyncPipe,
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './class-plan.component.html',
  styleUrl: './class-plan.component.scss'
})
export class ClassPlanComponent {
  working = true;
}
