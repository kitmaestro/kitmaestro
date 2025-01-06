import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-list',
    imports: [
        MatButtonModule,
        MatCardModule,
        RouterLink,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss'
})
export class ListComponent {
  instruments = [
    {
      title: 'Guías de Observación',
      route: '/assessments/observation-sheets',
    },
    {
      title: 'Rúbricas',
      route: '/assessments/rubrics',
    },
    {
      title: 'Escalas de Estimación',
      route: '/assessments/estimation-scales',
    },
  ]
}
