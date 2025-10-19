import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReadingActivity } from '../../../core/interfaces';
import { MatIconModule } from '@angular/material/icon';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { ReadingActivityService } from '../../../core/services';

@Component({
	selector: 'app-reading-activity-detail',
	imports: [MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
	template: `@if (activity) {
		<h2 mat-dialog-title>{{ activity.title }}</h2>
		<mat-dialog-content>
			<div id="reading-activity" style="padding: 0.5in">
				<div style="text-align: center;">
					<h2 style="margin-bottom: 2px; line-height: 1;">
						{{ activity.user.schoolName }}
					</h2>
					<h4 style="margin-bottom: 2px; line-height: 1;">
						A&ntilde;o Escolar {{ schoolYear }}
					</h4>
					<h3 style="margin-bottom: 2px; line-height: 1;">
						{{ activity.user.title }}.
						{{ activity.user.firstname }}
						{{ activity.user.lastname }}
					</h3>
					<h3
						style="font-weight: bold; line-height: 1; margin-bottom: 12px;"
					>
						Actividad de Lectura Guiada
					</h3>
				</div>
				<div
					style="margin-bottom: 24px; display: flex; font-size: 12pt;"
				>
					<div><b>Nombre</b>:</div>
					<div class="blank"></div>
					<div style="margin-left: 12px;"><b>Grado</b>:</div>
					<div class="blank"></div>
					<div style="margin-left: 12px;"><b>Fecha</b>:</div>
					<div style="max-width: 25%;" class="blank"></div>
				</div>
				<p style="font-size: 14pt;">
					Lee detenidamente el siguiente texto y responde las
					preguntas.
				</p>
				<h3 style="font-size: 14pt; font-weight: bold;">
					{{ activity.title }}
				</h3>
				<p
					style="font-size: 12pt; margin-top: 12px; margin-bottom: 12px;"
				>
					{{ activity.text }}
				</p>
				<h3 style="font-weight: bold;">Responde</h3>
				@for (question of activity.questions; track $index) {
					<p
						style="margin-bottom: 42px; font-size: 12pt; font-weight: bold;"
					>
						{{ $index + 1 }}. {{ question }}
					</p>
				}
			</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-button mat-dialog-close>Cancelar</button>
			<!-- <button mat-button (click)="delete()">Eliminar</button> -->
			<button [disabled]="printing" mat-button (click)="download()">
				Descargar
			</button>
		</mat-dialog-actions>
	}`,
	styles: `
		.blank {
			border-bottom: 1px solid black;
			flex: 1 1 auto;
			width: 100%;
		}
	`,
})
export class ReadingActivityDetailComponent implements OnInit {
	readonly dialogRef = inject(MatDialogRef<ReadingActivityDetailComponent>);
	readonly data = inject<ReadingActivity>(MAT_DIALOG_DATA);
	private raService = inject(ReadingActivityService);

	public activity: ReadingActivity | null = null;
	public printing = false;

	ngOnInit() {
		this.activity = this.data;
	}

	onNoClick() {
		this.dialogRef.close();
	}

	async download() {
		this.printing = true;
		await this.raService.download(this.data);
		this.printing = false;
	}

	get schoolYear(): string {
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();
		if (currentMonth > 7) {
			return `${currentYear} - ${currentYear + 1}`;
		}
		return `${currentYear - 1} - ${currentYear}`;
	}
}
