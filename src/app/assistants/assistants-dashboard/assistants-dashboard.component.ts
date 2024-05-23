import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-assistants-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './assistants-dashboard.component.html',
  styleUrl: './assistants-dashboard.component.scss'
})
export class AssistantsDashboardComponent {
  assistants: {
    title: string;
    description: string;
    url: string;
    icon: string;
  }[] = [
    {
      title: 'Calculador de Asistencia',
      description: 'Asistente para el cálculo automático de asistencias',
      icon: '/assets/robot-5702074.svg',
      url: 'attendance-calc',
    }
  ];
}
