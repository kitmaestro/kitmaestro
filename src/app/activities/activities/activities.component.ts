import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    IsPremiumComponent,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {

  categories = [
    {
      title: 'Lecturas Guiadas',
      route: '/activities/reading',
    }
  ]

}
