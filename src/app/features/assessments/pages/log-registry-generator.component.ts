import { Component, OnInit, inject } from '@angular/core';
import { LogRegistryEntry } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogRegistryEntryFormComponent } from '../../../shared/ui/log-registry-entry-form.component';
import { LogRegistryEntryDetailsComponent } from '../components/log-registry-entry-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Student } from '../../../core';
import { LogRegistryEntryService } from '../../../core/services/log-registry-entry.service';
import { LogRegistryEntryEditFormComponent } from '../../../shared/ui/log-registry-entry-edit-form.component';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

@Component({
	selector: 'app-log-registry-generator',
	imports: [
		MatDialogModule,
		MatSnackBarModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTableModule,
		CommonModule,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<mat-card>
				<mat-card-header>
					<h2 mat-card-title>Registro Anecdótico</h2>
					<button
						style="margin-left: auto"
						(click)="createLogRegistryEntry()"
						mat-mini-fab
					>
						<mat-icon>add</mat-icon>
					</button>
				</mat-card-header>
				<mat-card-content></mat-card-content>
			</mat-card>
			<table
				mat-table
				[dataSource]="entries"
				style="margin-top: 24px"
				class="mat-elevation-z4"
			>
				<ng-container matColumnDef="date">
					<th mat-header-cell *matHeaderCellDef>Fecha</th>
					<td mat-cell *matCellDef="let element">
						{{ element.date | date: "dd/MM/yyyy" }}
					</td>
				</ng-container>

				<ng-container matColumnDef="time">
					<th mat-header-cell *matHeaderCellDef>Hora</th>
					<td mat-cell *matCellDef="let element">
						{{ element.date | date: "hh:mm a" }}
					</td>
				</ng-container>

				<ng-container matColumnDef="grade">
					<th mat-header-cell *matHeaderCellDef>Grado</th>
					<td mat-cell *matCellDef="let element">{{ element.section.name }}</td>
				</ng-container>

				<ng-container matColumnDef="students">
					<th mat-header-cell *matHeaderCellDef>Estudiante(s)</th>
					<td mat-cell *matCellDef="let element">
						{{ studentNames(element.students) }}
					</td>
				</ng-container>

				<ng-container matColumnDef="place">
					<th mat-header-cell *matHeaderCellDef>Lugar</th>
					<td mat-cell *matCellDef="let element">{{ element.place }}</td>
				</ng-container>

				<ng-container matColumnDef="event">
					<th mat-header-cell *matHeaderCellDef>Evento</th>
					<td mat-cell *matCellDef="let element">{{ element.type }}</td>
				</ng-container>

				<ng-container matColumnDef="actions">
					<th mat-header-cell *matHeaderCellDef>Acciones</th>
					<td mat-cell *matCellDef="let element">
						<button
							style="margin-right: 12px"
							color="warn"
							(click)="deleteLogRegistryEntry(element._id)"
							mat-mini-fab
						>
							<mat-icon>delete</mat-icon>
						</button>
						<button
							style="margin-right: 12px"
							color="accent"
							(click)="editLogRegistryEntry(element)"
							mat-mini-fab
						>
							<mat-icon>edit</mat-icon>
						</button>
						<button
							color="primary"
							(click)="showLogRegistryEntry(element)"
							mat-mini-fab
						>
							<mat-icon>open_in_new</mat-icon>
						</button>
					</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="labels"></tr>
				<tr mat-row *matRowDef="let row; columns: labels"></tr>
			</table>
		</app-is-premium>
	`,
})
export class LogRegistryGeneratorComponent implements OnInit {
	private logService = inject(LogRegistryEntryService);
	private sb = inject(MatSnackBar);
	private dialog = inject(MatDialog);
	entries: LogRegistryEntry[] = [];

	labels = ['date', 'time', 'grade', 'students', 'event', 'actions'];

	eventTypes = [
		'Mejora de comportamiento',
		'Mejora de escritura',
		'Mejora de lectura',
		'Mejora de comprensión',
		'Mejora en matemática',
		'Interrupción de la clase',
		'Salida sin permiso',
		'Comportamiento inadecuado en clase',
		'Pelea',
		'Incumplimiento de acuerdo',
		'Asignación no entregada',
		'Asignación no satisfactoria',
	];

	loadEntries() {
		this.logService.findAll().subscribe((entries) => {
			this.entries = entries;
		});
	}

	ngOnInit(): void {
		this.loadEntries();
	}

	createLogRegistryEntry() {
		const ref = this.dialog.open(LogRegistryEntryFormComponent, {
			minWidth: '400px',
			width: '75%',
		});
		ref.afterClosed().subscribe(() => this.loadEntries());
	}

	editLogRegistryEntry(entry: LogRegistryEntry) {
		const ref = this.dialog.open(LogRegistryEntryEditFormComponent, {
			data: entry,
			minWidth: '400px',
			width: '75%',
		});
		ref.afterClosed().subscribe(() => this.loadEntries());
	}

	showLogRegistryEntry(entry: LogRegistryEntry) {
		const ref = this.dialog.open(LogRegistryEntryDetailsComponent, {
			data: entry,
			minWidth: '400px',
			width: '75%',
		});
		ref.afterClosed().subscribe((res) => {
			if (res) {
				this.editLogRegistryEntry(entry);
			}
		});
	}

	studentNames(students: Student[]) {
		return students.map((s) => s.firstname + ' ' + s.lastname).join(', ');
	}

	deleteLogRegistryEntry(id: string) {
		this.logService.delete(id).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.loadEntries();
				this.sb.open('Se ha eliminado el registro', 'Ok', {
					duration: 2500,
				});
			}
		});
	}
}
