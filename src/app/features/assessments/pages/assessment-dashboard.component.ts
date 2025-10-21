import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-assessment-dashboard',
	imports: [MatCardModule, MatButtonModule, RouterLink],
	template: `
		<div class="grid-container">
			@for (tool of tools; track $index) {
				<mat-card class="item-card">
					<!-- <img style="aspect-ratio: 1/1;" [src]="tool.cover" mat-card-image alt=""> -->
					<mat-card-header>
						<h2 mat-card-title>{{ tool.name }}</h2>
					</mat-card-header>
					<mat-card-content>
						<!-- <div style="margin-bottom: 12px;">{{ tool.description }}</div> -->
						<div
							style="display: flex; flex-direction: column; gap: 12px"
						>
							<a
								mat-raised-button
								[routerLink]="['/assessments', tool.link]"
								color="primary"
								>Entrar</a
							>
						</div>
					</mat-card-content>
				</mat-card>
			}
		</div>
	`,
	styles: `
		.grid-container {
			display: grid;
			width: 100%;
			gap: 16px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 720px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(3, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(5, 1fr);
			}
		}
	`,
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
