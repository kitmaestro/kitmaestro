import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../../core/interfaces/checklist';
import { ChecklistService } from '../../../core/services/checklist.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-checklists',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		PretifyPipe,
		RouterLink,
	],
	template: `
		<div>
			<mat-card>
				<mat-card-header
					style="align-items: center; justify-content: space-between"
				>
					<mat-card-title>Mis Listas de Cotejo</mat-card-title>
					<a mat-flat-button routerLink="/checklist-generator">Crear Nueva</a>
				</mat-card-header>
				<mat-card-content>
					<p>
						Las listas de cotejo o listas de control constituyen un
						instrumento para el registro de la evaluación, en la cual se
						enumeran indicadores, tareas, acciones, actitudes, valores que
						se espera las/los estudiantes evidencien en un proceso de
						aprendizaje.
					</p>
				</mat-card-content>
			</mat-card>

			@if (checklists.length) {
				<table style="margin-top: 24px" class="table">
					<thead>
						<tr>
							<th>Curso</th>
							<th>Asignatura</th>
							<th>Unidad</th>
							<th>Titulo</th>
							<th>Actividad</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						@for (checklist of checklists; track checklist._id) {
							<tr>
								<td>{{ checklist.section.name }}</td>
								<td>{{ checklist.contentBlock.subject | pretify }}</td>
								<td>{{ checklist.contentBlock.title }}</td>
								<td>{{ checklist.title }}</td>
								<td>{{ checklist.activity }}</td>
								<td>
									<div style="display: flex; gap: 12px">
										<button
											(click)="delete(checklist._id)"
											mat-mini-fab
										>
											<mat-icon>delete</mat-icon>
										</button>
										<button
											(click)="download(checklist)"
											mat-mini-fab
										>
											<mat-icon>download</mat-icon>
										</button>
										<a
											routerLink="/checklists/{{ checklist._id }}"
											mat-mini-fab
											><mat-icon>open_in_new</mat-icon></a
										>
									</div>
								</td>
							</tr>
						}
					</tbody>
				</table>
			} @else {
				<mat-card style="margin-top: 24px">
					<mat-card-content>
						<p style="padding: 24px; text-align: center">
							No tienes ninguna lista de cotejo todavia. Empieza por
							<a mat-button routerLink="/checklist-generator"
								>crear una lista</a
							>
							ahora.
						</p>
					</mat-card-content>
				</mat-card>
			}
		</div>
	`,
	styles: `
		.form-grid {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: 1fr 1fr 1fr;
			}
		}

		mat-form-field {
			width: 100%;
		}

		.table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 24px;

			td,
			th {
				border: 1px solid #aaa;
				padding: 8px 12px;
			}
		}

		.checklist {
			max-width: 8.5in;
			margin: 24px auto;
			background-color: #fff;
			box-shadow: #ddd 4px 4px 8px;
			padding: 0.7in;
		}
	`,
})
export class ChecklistsComponent implements OnInit {
	private checklistService = inject(ChecklistService);
	private sb = inject(MatSnackBar);

	checklists: Checklist[] = [];

	load() {
		this.checklistService.findAll().subscribe({
			next: (checklists) => {
				if (checklists.length) {
					this.checklists = checklists;
				}
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	download(checklist: Checklist) {
		this.checklistService.download(checklist);
	}

	delete(id: string) {
		this.checklistService.delete(id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.sb.open('Se ha eliminado la lista de cotejo.', 'Ok', {
						duration: 2500,
					});
				} else {
					this.sb.open('Ha ocurrido un error al eliminar', 'Ok', {
						duration: 2500,
					});
				}
				this.load();
			},
			error: (err) => {
				this.load();
				this.sb.open('Ha ocurrido un error al eliminar', 'Ok', {
					duration: 2500,
				});
				console.log(err.message);
			},
		});
	}
}
