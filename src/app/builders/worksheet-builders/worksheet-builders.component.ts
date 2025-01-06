import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
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
        RouterOutlet,
        RouterLink,
        MatCardModule,
    ],
    templateUrl: './worksheet-builders.component.html',
    styleUrl: './worksheet-builders.component.scss'
})
export class WorksheetBuildersComponent {
  working = true;
}
