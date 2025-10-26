import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { YouTubePlayer } from '@angular/youtube-player';

interface TutorialVideo {
	title: string;
	description: string;
	url: string;
	time: string;
	author: string;
	authorLink: string;
}

@Component({
	selector: 'app-tutorials',
	imports: [MatCardModule, MatButtonModule, YouTubePlayer],
	template: `
		<mat-card>
			<mat-card-header>
				<h2>Tutoriales</h2>
			</mat-card-header>
			<mat-card-content>
				<div>
					<h3>Introducción a KitMaestro</h3>
					<youtube-player videoId="P2X_44cp8cU"></youtube-player>
				</div>
				<div>
					<h3>Como crear un plan diario</h3>
					<youtube-player videoId="42Tlrh2WbcY"></youtube-player>
				</div>
				<div>
					<h3>Como crear una unidad de aprendizaje</h3>
					<youtube-player videoId="TPV8mJZEsO0"></youtube-player>
				</div>
				<p>
					Recuerda que elaboramos los tutoriales tomando como
					referencia sus pedidos. No te quedes sin
					<a
						mat-raised-button
						color="link"
						href="https://wa.me/+18094659650?text=Hola!+Quiero+solicitar+un+tutorial+de+KitMaestro."
						target="_blank"
						>Solicitar tu tutorial</a
					>
					sobre el tema que m&aacute;s te interesa.
				</p>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		.tutorial-grid {
			display: grid;
			gap: 16px;
			grid-template-columns: 1fr;
			margin-bottom: 24px;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1400px) {
				grid-template-columns: repeat(3, 1fr);
			}

			iframe {
				max-width: 100%;
			}
		}

		h3 {
			font-weight: bold;
		}

		mat-card {
			max-width: 1200px;
			margin: 24px auto;
		}

		youtube-player {
			max-width: 100%;
		}
	`,
})
export class TutorialsComponent {
	tutorials: TutorialVideo[] = [];
}
