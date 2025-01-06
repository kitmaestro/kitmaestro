import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-assessments',
    imports: [
        RouterOutlet,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        IsPremiumComponent,
        InProgressComponent,
        MatMenuModule,
    ],
    templateUrl: './assessments.component.html',
    styleUrl: './assessments.component.scss'
})
export class AssessmentsComponent {
  working = true;
}
