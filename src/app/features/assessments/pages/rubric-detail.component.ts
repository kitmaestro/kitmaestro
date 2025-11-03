import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RubricComponent } from '../components/rubric.component';
import { Store } from '@ngrx/store';
import {
	deleteRubric,
	deleteRubricSuccess,
	downloadRubric,
	loadRubric,
	loadStudentsBySection,
} from '../../../store';
import { selectSectionStudents } from '../../../store/students/students.selectors';
import { selectCurrentRubric } from '../../../store/rubrics/rubrics.selectors';
import { Subject, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
	selector: 'app-rubric-detail',
	imports: [
		MatSnackBarModule,
		MatButtonModule,
		RouterLink,
		MatIconModule,
		RubricComponent,
	],
	template: `
		@if (rubric(); as rub) {
			<div>
				<div
					style="justify-content: space-between; align-items: center; display: flex;"
				>
					<h2>{{ rub.title }}</h2>
					<span style="flex: 1 1 auto"></span>
					<a
						routerLink="/assessments/rubrics"
						mat-button
						color="link"
						style="margin-right: 8px"
					>
						<mat-icon>home</mat-icon>
						Todas las rubricas
					</a>
					<button
						mat-button
						color="warn"
						(click)="deleteRubric()"
						style="margin-right: 8px; display: none;"
					>
						<mat-icon>delete</mat-icon>
						Eliminar esta rubrica
					</button>
					<!-- <a target="_blank" routerLink="/print-activities/{{id}}" mat-icon-button color="link" style="margin-right: 8px;">
						<mat-icon>print</mat-icon>
					</a> -->
					<button (click)="download()" mat-flat-button color="accent">
						<mat-icon>download</mat-icon>
						Descargar
					</button>
				</div>
			</div>
			<div
				style="
					margin-top: 24px;
					width: fit-content;
					margin-left: auto;
					margin-right: auto;
				"
			>
				<div style="width: fit-content">
					<app-rubric [rubric]="rub"></app-rubric>
				</div>
			</div>
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
	#store = inject(Store);
	#actions$ = inject(Actions);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';

	public rubric = this.#store.selectSignal(selectCurrentRubric);
	public students = this.#store.selectSignal(selectSectionStudents);
	section = computed(() => (this.rubric() ? this.rubric()?.section : null));

	#destroy$ = new Subject<void>();

	constructor() {
		effect(() => {
			const rubric = this.rubric();
			if (rubric) {
				this.#store.dispatch(
					loadStudentsBySection({ sectionId: rubric.section._id }),
				);
			}
		});
	}

	ngOnInit() {
		this.#store.dispatch(loadRubric({ id: this.id }));
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	deleteRubric() {
		this.#store.dispatch(deleteRubric({ id: this.id }));
		this.#actions$
			.pipe(ofType(deleteRubricSuccess), takeUntil(this.#destroy$))
			.subscribe(() => {
				this.router.navigate(['/assessments/rubrics']);
			});
	}

	async download() {
		const rubric = this.rubric();
		if (!rubric) return;
		this.sb.open(
			'Estamos preparando tu descarga. Espera un momento, por favor',
			'Ok',
			{ duration: 2500 },
		);
		await this.#store.dispatch(downloadRubric({ rubric }));
	}
}
