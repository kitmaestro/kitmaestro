import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LogRegistryEntry } from '../../../core';
import { CommonModule } from '@angular/common';
import { Student } from '../../../core';

@Component({
	styles: '',
	template: `
		<h2 mat-dialog-title>Detalles de la Situaci&oacute;n</h2>

		@if (!loading) {
			<mat-dialog-content>
				@if (entry) {
					<div style="text-align: center">
						<h2>Registro Anecd&oacute;tico</h2>
						<p>
							<b>Fecha</b>: {{ entry.date | date: 'dd/MM/yyyy' }}
						</p>
						<p><b>Hora</b>: {{ entry.date | date: 'HH:mm a' }}</p>
						<p>
							<b>Estudiante(s)</b>:
							{{ studentNames(entry.students) }}
						</p>
						<p>
							<b
								>Descripción del incidente, del hecho o
								situación</b
							>: <br />
							{{ entry.description }}
						</p>
						<p>
							<b>Interpretación y comentarios</b>: <br />
							{{ entry.comments }}
						</p>
					</div>
				} @else {
					<div
						style="
							padding: 42px;
							text-align: center;
							font-size: 16px;
							font-family: Roboto, sans-serif;
							line-height: 1.5;
						"
					>
						Registro inv&aacute;lido.
					</div>
				}
			</mat-dialog-content>
		}

		<mat-dialog-actions>
			<button style="margin-left: auto" (click)="close()" mat-flat-button>
				Salir
			</button>
			<button
				style="margin-left: 12px"
				(click)="closeAndEdit()"
				mat-flat-button
				color="accent"
			>
				Editar
			</button>
		</mat-dialog-actions>
	`,
	imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
})
export class LogRegistryEntryDetailsComponent implements OnInit {
	dialogRef = inject(MatDialogRef<LogRegistryEntryDetailsComponent>);
	entry: LogRegistryEntry | null = null;
	loading = true;

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private data: LogRegistryEntry,
	) {}

	ngOnInit() {
		if (this.data) {
			this.entry = this.data;
		}
		this.loading = false;
	}

	closeAndEdit() {
		this.dialogRef.close(true);
	}

	close() {
		this.dialogRef.close(false);
	}

	studentNames(students: Student[]) {
		return students.map((s) => `${s.firstname} ${s.lastname}`).join(', ');
	}
}
