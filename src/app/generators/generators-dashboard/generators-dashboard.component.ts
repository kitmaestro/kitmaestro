import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppEntry } from '../../interfaces/app-entry';

@Component({
  selector: 'app-generators-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatBadgeModule,
  ],
  templateUrl: './generators-dashboard.component.html',
  styleUrl: './generators-dashboard.component.scss'
})
export class GeneratorsDashboardComponent {
  private apps: AppEntry[] = [
    { name: 'Generador de Calificaciones', description: 'Genera facilmente las calificaciones de tus estudiantes.', link: ['/generators', 'grades-generator'], premium: false, icon: '/assets/grades.svg' },
  ];

  columns() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
      [],
      [],
    ];
    for (let app of this.apps) {
      final[next].push(app);
      if (next == 3) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }
}
