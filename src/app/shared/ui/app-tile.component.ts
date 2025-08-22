import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AppEntry } from '../../core/interfaces/app-entry';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-tile',
	imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
	template: `
		@if (app(); as entry) {
			<mat-card class="card" [routerLink]="entry.link">
				<mat-card-content>
					<div class="inner">
						<img [src]="entry.icon" [alt]="entry.name" />
						<div>
							<p style="font-weight: bold;">
								{{ entry.name }}
							</p>
							<p>{{ entry.description }}</p>
						</div>
					</div>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		.app-card {
			cursor: pointer;
			margin-bottom: 16px;
			display: block;
			color: #263238;
			height: 100%;
			text-decoration: none;
		}

		.active {
			color: #005cbb;
		}

		p {
			font-size: 14px;
			color: gray;
			font-family: Roboto, sans-serif;
			line-height: 1.5;
		}

		.inner {
			display: flex;
			align-items: center;
			gap: 12px;

			img {
				width: 96px;
				display: block;
				aspect-ratio: 1/1;
			}
		}

		.inner-grid {
			display: grid;
			margin-top: 12px;
			grid-template-rows: 1fr 1fr;
			gap: 12px;
			height: 100%;
			align-items: center;

			img {
				width: 50%;
				display: block;
				aspect-ratio: 4/3;
				margin: 0 auto 12px;
			}
		}

		.card {
			height: 100%;
			cursor: pointer;
			position: relative;
		}

		button {
			position: absolute;
			top: 12px;
			right: 12px;
		}

		.card:hover {
			background-color: #d7e3ff;

			& p {
				color: #005cbb;
			}
		}
	`,
})
export class AppTileComponent {
	app = input.required<AppEntry>();
	isFav = input<boolean>(false);
	markFavorite = output<AppEntry>();

	mark() {
		this.markFavorite.emit(this.app());
	}
}
