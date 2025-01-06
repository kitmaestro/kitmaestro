import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
    selector: 'app-activities',
    imports: [
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
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
