import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LogRegistryEntry } from '../../../core/interfaces/log-registry-entry';
import { CommonModule } from '@angular/common';
import { Student } from '../../../core/interfaces/student';

@Component({
	styles: '',
	templateUrl: './log-registry-entry-details.component.html',
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
