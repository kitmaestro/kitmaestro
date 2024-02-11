import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppEntry } from '../../interfaces/app-entry';

@Component({
  selector: 'app-apps-holder',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatBadgeModule,
  ],
  templateUrl: './apps-holder.component.html',
  styleUrl: './apps-holder.component.scss'
})
export class AppsHolderComponent {
  apps: AppEntry[] = [
    { name: 'Generador de Calificaciones', description: 'Genera facilmente las calificaciones de tus estudiantes.', link: ['/apps', 'grades-generator'], premium: false, icon: '/assets/grades.svg' },
  ];
}
