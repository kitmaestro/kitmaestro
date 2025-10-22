import { Component, input } from '@angular/core';
import { AppEntry } from '../../core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-tool-gallery',
	imports: [MatIconModule, RouterLink, MatCardModule, MatButtonModule],
	template: `
		<div class="planning-container">
			<div class="header">
				<h1>Herramientas de {{ category() }}</h1>
				<p>{{ message() }}</p>
			</div>

			<div class="tools-grid">
				@for (tool of tools(); track tool.link) {
					<mat-card class="tool-card">
						<div class="card-header">
							<img
								[src]="tool.icon"
								[alt]="tool.name"
								class="tool-icon"
							/>
						</div>

						<mat-card-content>
							<h3>{{ tool.name }}</h3>
							<p>{{ tool.description }}</p>
						</mat-card-content>

						<mat-card-actions>
							<button
								mat-flat-button
								color="primary"
								[routerLink]="tool.link"
								class="action-button"
							>
								<mat-icon>rocket_launch</mat-icon>
								Lanzar
							</button>
						</mat-card-actions>
					</mat-card>
				}
			</div>
		</div>
	`,
	styles: `
		.planning-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 24px 16px;
		}

		.header {
			text-align: center;
			margin-bottom: 32px;
		}

		.header h1 {
			color: #1976d2;
			margin-bottom: 8px;
			font-size: 2.5rem;
			font-weight: 300;
		}

		.header p {
			color: #666;
			font-size: 1.1rem;
			max-width: 600px;
			margin: 0 auto;
		}

		.filters {
			display: flex;
			justify-content: center;
			margin-bottom: 32px;
		}

		.tools-grid {
			display: grid;
			gap: 24px;
			grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		}

		.tool-card {
			height: 100%;
			display: flex;
			flex-direction: column;
			transition:
				transform 0.2s ease,
				box-shadow 0.2s ease;
			border: 1px solid #e0e0e0;

			&:hover {
				transform: translateY(-4px);
				box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
			}

			&.premium {
				border: 2px solid #ffd700;
				background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
			}
		}

		.card-header {
			position: relative;
			padding: 16px;
			text-align: center;
			border-bottom: 1px solid #f0f0f0;
		}

		.tool-icon {
			width: 80px;
			height: 80px;
			object-fit: contain;
			margin-bottom: 8px;
		}

		.premium-chip,
		.advanced-chip {
			position: absolute;
			top: 8px;
			right: 8px;
		}

		mat-card-content {
			flex: 1;
			padding: 16px;
		}

		mat-card-content h3 {
			margin: 0 0 8px 0;
			color: #333;
			font-size: 1.25rem;
			font-weight: 500;
		}

		mat-card-content p {
			color: #666;
			line-height: 1.5;
			margin: 0;
		}

		mat-card-actions {
			padding: 16px;
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.action-button {
			width: 100%;
		}

		.upgrade-button {
			width: 100%;
			border: 1px solid #ffd700;
		}

		.empty-state {
			text-align: center;
			padding: 60px 20px;
			color: #666;
		}

		.empty-icon {
			font-size: 64px;
			width: 64px;
			height: 64px;
			margin-bottom: 16px;
			color: #ccc;
		}

		.empty-state h3 {
			margin-bottom: 8px;
			color: #333;
		}

		@media (max-width: 768px) {
			.planning-container {
				padding: 16px 8px;
			}

			.tools-grid {
				grid-template-columns: 1fr;
				gap: 16px;
			}

			.header h1 {
				font-size: 2rem;
			}
		}

		@media (max-width: 480px) {
			.tools-grid {
				grid-template-columns: 1fr;
			}

			.tool-card {
				margin: 0 8px;
			}
		}
	`,
})
export class ToolGalleryComponent {
	tools = input<AppEntry[]>([]);
	category = input<string>('');
	message = input<string>('Selecciona una herramienta para comenzar a potenciar tus clases');
}
