import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ClassSectionFormComponent } from '../../ui/forms/class-section-form/class-section-form.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { ClassSectionService } from '../../services/class-section.service';
import { Observable } from 'rxjs';
import { ClassSection } from '../../interfaces/class-section';

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
	templateUrl: './class-sections.component.html',
	styleUrl: './class-sections.component.scss',
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
