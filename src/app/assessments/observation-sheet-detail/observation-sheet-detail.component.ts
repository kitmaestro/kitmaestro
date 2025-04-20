import { Component, inject, OnInit } from '@angular/core';
import { ObservationGuideService } from '../../services/observation-guide.service';
import { StudentsService } from '../../services/students.service';
import { ObservationGuide } from '../../interfaces/observation-guide';
import { Student } from '../../interfaces/student';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ObservationGuideComponent } from '../../ui/observation-guide/observation-guide.component';
import { PdfService } from '../../services/pdf.service';

@Component({
	selector: 'app-observation-sheet-detail',
	imports: [
		MatSnackBarModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		ObservationGuideComponent,
		RouterLink,
	],
	templateUrl: './observation-sheet-detail.component.html',
	styleUrl: './observation-sheet-detail.component.scss',
})
export class ObservationSheetDetailComponent implements OnInit {
	private guideService = inject(ObservationGuideService);
	private studentService = inject(StudentsService);
	private pdfService = inject(PdfService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);

	public observationGuide: ObservationGuide | null = null;
	public students: Student[] = [];
	public id = this.route.snapshot.paramMap.get('id') || '';

	ngOnInit() {
		this.guideService.find(this.id).subscribe({
			next: (guide) => {
				if (guide._id) {
					this.observationGuide = guide;
					this.studentService
						.findBySection(guide.section._id)
						.subscribe((students) => {
							if (students.length) {
								this.students = students;
							}
						});
				}
			},
			error: (err) => {
				this.sb.open('Error al cargar', 'Ok', { duration: 2500 });
				console.log(err.message);
			},
		});
	}

	deleteGuide() {
		this.guideService.delete(this.id).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.router
					.navigate(['/assessments/observation-sheets'])
					.then(() => {
						this.sb.open('El instrumento ha sido eliminado', 'Ok', {
							duration: 2500,
						});
					});
			}
		});
	}

	download() {
		if (!this.observationGuide) return;
		const title = this.observationGuide.title;
		this.sb.open(
			'Estamos preparando la descarga, espera un momento.',
			'Ok',
			{ duration: 2500 },
		);
		if (this.observationGuide.individual) {
			this.students.forEach((student, i) => {
				this.pdfService.createAndDownloadFromHTML(
					'guide-' + i,
					`Guia de observacion ${title} para ${student.firstname} ${student.lastname}`,
				);
			});
		} else {
			this.pdfService.createAndDownloadFromHTML(
				'guide',
				'Guia de observacion: ' + title,
			);
		}
	}
}
