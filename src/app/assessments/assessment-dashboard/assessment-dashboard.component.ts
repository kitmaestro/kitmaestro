import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-assessment-dashboard',
	imports: [MatCardModule, MatButtonModule, RouterLink],
	templateUrl: './assessment-dashboard.component.html',
	styleUrl: './assessment-dashboard.component.scss',
})
export class AssessmentDashboardComponent {
	tools = [
		{
			name: 'Guía de Observación',
			link: 'observation-sheet',
		},
		{
			name: 'Rúbrica',
			link: 'rubric',
		},
		{
			name: 'Escala de Estimación',
			link: 'estimation-scale',
		},
	];
}
