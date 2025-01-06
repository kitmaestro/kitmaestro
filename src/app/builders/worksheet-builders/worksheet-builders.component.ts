import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';
import { BuilderListComponent } from '../builder-list/builder-list.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-worksheet-builders',
    imports: [
        ReactiveFormsModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        IsPremiumComponent,
        RouterOutlet,
        RouterLink,
        InProgressComponent,
        MatCardModule,
        BuilderListComponent,
    ],
    templateUrl: './worksheet-builders.component.html',
    styleUrl: './worksheet-builders.component.scss'
})
export class WorksheetBuildersComponent {
  working = true;
}
