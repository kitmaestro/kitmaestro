import { Component, inject, OnInit } from '@angular/core';
import { ObservationGuide } from '../../interfaces/observation-guide';
import { ObservationGuideService } from '../../services/observation-guide.service';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-observation-sheets',
	imports: [
		MatTableModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		DatePipe,
		MatCardModule,
	],
	templateUrl: './observation-sheets.component.html',
	styleUrl: './observation-sheets.component.scss',
})
export class ObservationSheetsComponent implements OnInit {
	private guideService = inject(ObservationGuideService);
	private sb = inject(MatSnackBar);

	displayedColumns = ['title', 'date', 'section', 'individual', 'actions'];

	assessments: ObservationGuide[] = [];

	ngOnInit(): void {
		this.loadGuides();
	}

	loadGuides() {
		this.guideService.findAll().subscribe((guides) => {
			if (guides.length) {
				this.assessments = guides;
			}
		});
	}

	deleteAssessment(id: string) {
		this.guideService.delete(id).subscribe(() => {
			this.sb.open('Se ha eliminado el intrumento', 'Ok', {
				duration: 2500,
			});
			this.loadGuides();
		});
	}
}
