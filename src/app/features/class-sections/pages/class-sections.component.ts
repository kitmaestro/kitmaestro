import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ClassSectionFormComponent } from '../../../shared/ui/class-section-form.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { Observable } from 'rxjs';
import { ClassSection } from '../../../core/interfaces/class-section';

@Component({
	selector: 'app-class-sections',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatSnackBarModule,
		MatIconModule,
		CommonModule,
		MatDialogModule,
		MatTableModule,
		MatListModule,
		MatExpansionModule,
		RouterModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<div
					style="
						display: flex;
						width: 100%;
						align-items: center;
						justify-content: space-between;
					"
				>
					<h2 style="margin-top: auto; margin-bottom: auto" mat-card-title>
						Secciones
					</h2>
					<button (click)="openSectionFormDialog()" mat-fab>
						<mat-icon>add</mat-icon>
					</button>
				</div>
			</mat-card-header>
			<mat-card-content>
				<p style="color: gray">
					Aqui puedes administrar las secciones con las que trabajas.
				</p>
			</mat-card-content>
		</mat-card>

		@if ((sections$ | async)?.length) {
			<div class="grid">
				<mat-card
					*ngFor="let section of sections$ | async"
					style="margin-top: 20px"
				>
					<mat-card-header>
						<h2 mat-card-title>{{ section.name }}</h2>
						<h3 mat-card-subtitle>{{ section.school.name }}</h3>
						<h3 mat-card-subtitle>
							{{ formatValue(section.year) }} de
							{{ formatValue(section.level) }}
						</h3>
					</mat-card-header>
					<mat-card-actions
						style="
							display: grid;
							grid-template-columns: 1fr 1fr 1fr;
							gap: 8px;
						"
					>
						<!-- <button title="Esta herramienta aun no esta lista" disabled [routerLink]="['/attendance', section._id]" mat-raised-button color="accent" style="width: 100%; display: block;">Asistencia</button> -->
						<!-- <button title="Esta herramienta aun no esta lista" disabled [routerLink]="['/tracking', 'section', section._id]" mat-raised-button color="primary" style="width: 100%; display: block;">Notas</button> -->
						<button
							[routerLink]="['/sections', section._id]"
							mat-button
							color="primary"
							style="width: 100%; display: block"
						>
							Detalles
						</button>
					</mat-card-actions>
				</mat-card>
			</div>
		} @else {
			<img
				mat-card-image
				src="/assets/empty.svg"
				style="width: 100%; max-width: 250px; display: block; margin: 42px auto"
			/>
			<div
				style="
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
				"
			>
				No hay datos todavia. Presiona el boton <mat-icon>add</mat-icon> para
				empezar.
			</div>
		}

		<!-- <table mat-table [dataSource]="sections" class="mat-elevation-z8" style="width: 100%; margin-top: 20px;">

			<ng-container matColumnDef="name">
				<th mat-header-cell *matHeaderCellDef>Secci&oacute;n</th>
				<td mat-cell *matCellDef="let element">{{ element.name }}</td>
			</ng-container>

			<ng-container matColumnDef="level">
				<th mat-header-cell *matHeaderCellDef>Nivel</th>
				<td mat-cell *matCellDef="let element">{{ element.level }}</td>
			</ng-container>

			<ng-container matColumnDef="grade">
				<th mat-header-cell *matHeaderCellDef>Grado</th>
				<td mat-cell *matCellDef="let element">{{ element.grade }}</td>
			</ng-container>

			<ng-container matColumnDef="subjects">
				<th mat-header-cell *matHeaderCellDef>Asignaturas</th>
				<td mat-cell *matCellDef="let element">{{ element.subjects.join(', ') }}</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="sectionsColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: sectionsColumns;"></tr>

		</table> -->
	`,
	styles: `
		p {
			font-size: 16px;
			font-family: Roboto, sans-serif;
		}

		.grid {
			display: grid;
			gap: 16px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 720px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
			}

			@media screen and (min-width: 1400px) {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	`,
})
export class ClassSectionsComponent implements OnInit {
	private dialog = inject(MatDialog);
	private classSectionService = inject(ClassSectionService);
	sections$: Observable<ClassSection[]> =
		this.classSectionService.findSections();

	ngOnInit() {}

	openSectionFormDialog() {
		this.dialog.open(ClassSectionFormComponent, {
			width: '75%',
			maxWidth: '640px',
		});
		this.dialog.afterAllClosed.subscribe(() => {
			this.sections$ = this.classSectionService.findSections();
		});
	}

	formatValue(value: string) {
		return value
			.split('_')
			.map((s) => s[0] + s.slice(1).toLowerCase().split('').join(''))
			.join(' ');
	}
}
