import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { RouterOutlet } from '@angular/router';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-worksheet-builders',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IsPremiumComponent,
    RouterOutlet,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './worksheet-builders.component.html',
  styleUrl: './worksheet-builders.component.scss'
})
export class WorksheetBuildersComponent {
  working = false;
}
