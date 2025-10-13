import { Component, inject, OnInit } from '@angular/core';
import { RubricService } from '../../../core/services/rubric.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Rubric } from '../../../core/interfaces/rubric';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PdfService } from '../../../core/services/pdf.service';
import { Student } from '../../../core/interfaces/student';
import { StudentsService } from '../../../core/services/students.service';
import { RubricComponent } from '../components/rubric.component';

@Component({
	selector: 'app-rubric-detail',
	imports: [
		MatCardModule,
		MatSnackBarModule,
		MatButtonModule,
		RouterLink,
		MatIconModule,
		RubricComponent,
	],
	template: `
		@if (rubric) {
			<mat-card>
				<mat-card-header
					style="justify-content: space-between; align-items: center"
				>
					<mat-card-title>{{ rubric.title }}</mat-card-title>
					<span style="flex: 1 1 auto"></span>
					<a
						routerLink="/rubrics"
						mat-icon-button
						color="link"
						style="margin-right: 8px"
						title="Todas las rubricas"
					>
						<mat-icon>home</mat-icon>
					</a>
					<button
						mat-icon-button
						color="warn"
						(click)="deleteRubric()"
						style="margin-right: 8px"
						title="Eliminar esta rubrica"
					>
						<mat-icon>delete</mat-icon>
					</button>
					<!-- <a target="_blank" routerLink="/print-activities/{{id}}" mat-icon-button color="link" style="margin-right: 8px;">
						<mat-icon>print</mat-icon>
					</a> -->
					<button
						(click)="download()"
						mat-icon-button
						color="accent"
						title="Descargar como PDF"
					>
						<mat-icon>download</mat-icon>
					</button>
				</mat-card-header>
				<mat-card-content></mat-card-content>
			</mat-card>
			<mat-card
				style="
					margin-top: 24px;
					width: fit-content;
					margin-left: auto;
					margin-right: auto;
				"
			>
				<mat-card-content style="width: fit-content">
					<app-rubric [rubric]="rubric"></app-rubric>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		.grid-3-cols {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
			}

			& > div {
				max-width: 100%;
			}
		}

		mat-form-field {
			width: 100%;
			max-width: 100%;
		}

		mat-select,
		select,
		input,
		textarea {
			max-width: 100%;
		}

		table {
			border-collapse: collapse;
			border: 1px solid #ccc;
		}

		td,
		tr,
		th {
			border: 1px solid #ccc;
		}

		td,
		th {
			padding: 12px;
		}
	`,
})
export class RubricDetailComponent implements OnInit {
	private rubricService = inject(RubricService);
	private studentService = inject(StudentsService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private sb = inject(MatSnackBar);
	private pdfService = inject(PdfService);
	private id = this.route.snapshot.paramMap.get('id') || '';

	public rubric: Rubric | null = null;
	public students: Student[] = [];

	ngOnInit() {
		this.rubricService.find(this.id).subscribe({
			next: (rubric) => {
				if (rubric._id) {
					this.rubric = rubric;
					this.studentService
						.findBySection(rubric.section._id)
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

	deleteRubric() {
		this.rubricService.delete(this.id).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.router.navigate(['/assessments/rubrics']).then(() =>
					this.sb.open('Se ha eliminado la rubrica', 'Ok', {
						duration: 2500,
					}),
				);
			}
		});
	}

	async download() {
		if (!this.rubric) return;
		this.sb.open(
			'Estamos preparando tu descarga. Espera un momento, por favor',
			'Ok',
			{ duration: 2500 },
		);
		await this.rubricService.download(this.rubric);
	}
}
