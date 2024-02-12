import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppEntry } from '../../interfaces/app-entry';

@Component({
  selector: 'app-apps-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatBadgeModule,
  ],
  templateUrl: './apps-dashboard.component.html',
  styleUrl: './apps-dashboard.component.scss'
})
export class AppsDashboardComponent {
  private apps: AppEntry[] = [
    { name: 'Calculadora de Promedios', description: 'Calcula promedios en un santiamén.', link: ['/apps', 'average-calculator'], premium: false, icon: '/assets/calculator.svg' },
    { name: 'Calculadora de Asistencias', description: 'La forma más fácil de calcular la asistencia.', link: ['/apps', 'attendance-calculator'], premium: true, icon: '/assets/attendance.svg' },
  ];

  columns() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
      [],
      [],
      [],
    ];
    for (let app of this.apps) {
      final[next].push(app);
      if (next == 4) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }
}
