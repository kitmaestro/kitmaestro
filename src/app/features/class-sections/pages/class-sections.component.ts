import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ClassSectionFormComponent } from '../../../shared/ui/class-section-form.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadSections, selectAllClassSections } from '../../../store';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-class-sections',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatSnackBarModule,
		MatIconModule,
		MatDialogModule,
		MatTableModule,
		MatListModule,
		MatExpansionModule,
		RouterModule,
		AsyncPipe,
	],
	template: `
		<div>
			<div
				style="
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: space-between;
					margin: 24px 0 12px;
				"
			>
				<h2
					style="margin-top: auto; margin-bottom: auto"
					mat-card-title
				>
					Secciones
				</h2>
				<button (click)="openSectionFormDialog()" mat-flat-button>
					<mat-icon>add</mat-icon> Agregar Sección
				</button>
			</div>
		</div>

		@if ((sections$ | async)?.length) {
			<div class="grid">
				@for (section of sections$ | async; track section._id) {
					<mat-card style="margin-top: 20px">
						<mat-card-header>
							<h2 mat-card-title>{{ section.name }}</h2>
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
				}
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
				No hay datos todavia. Presiona el boton
				<mat-icon>add</mat-icon> para empezar.
			</div>
		}
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
	#store = inject(Store);
	sections$ = this.#store.select(selectAllClassSections);

	ngOnInit() {
		this.#store.dispatch(loadSections());
	}

	openSectionFormDialog() {
		this.dialog.open(ClassSectionFormComponent, {
			width: '75%',
			maxWidth: '640px',
		});
	}

	formatValue(value: string) {
		return value
			.split('_')
			.map((s) => s[0] + s.slice(1).toLowerCase().split('').join(''))
			.join(' ');
	}
}
