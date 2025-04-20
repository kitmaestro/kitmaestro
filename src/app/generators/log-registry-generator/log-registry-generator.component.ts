import { Component, OnInit, inject } from '@angular/core';
import { LogRegistryEntry } from '../../interfaces/log-registry-entry';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogRegistryEntryFormComponent } from '../../ui/forms/log-registry-entry-form/log-registry-entry-form.component';
import { LogRegistryEntryDetailsComponent } from './log-registry-entry-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Student } from '../../interfaces/student';
import { LogRegistryEntryService } from '../../services/log-registry-entry.service';
import { LogRegistryEntryEditFormComponent } from '../../ui/forms/log-registry-entry-edit-form/log-registry-entry-edit-form.component';

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
	],
	templateUrl: './log-registry-generator.component.html',
	styleUrl: './log-registry-generator.component.scss',
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
			if (entries.length) {
				this.entries = entries;
			}
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
				this.sb.open('Se ha eliminado el registro', 'Ok', {
					duration: 2500,
				});
			}
		});
	}
}
