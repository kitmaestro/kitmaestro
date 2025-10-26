import { Component, effect, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ObservationGuideComponent } from '../../../shared/ui/observation-guide.component'
import { PdfService } from '../../../core/services/pdf.service'
import { Store } from '@ngrx/store'
import { selectCurrentGuide } from '../../../store/observation-guides/observation-guides.selectors'
import { selectSectionStudents } from '../../../store/students/students.selectors'
import { deleteGuide, deleteGuideSuccess, loadGuide, loadStudentsBySection } from '../../../store'
import { Actions, ofType } from '@ngrx/effects'
import { Subject, takeUntil } from 'rxjs'

@Component({
	selector: 'app-observation-sheet-detail',
	imports: [
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		ObservationGuideComponent,
		RouterLink,
	],
	template: `
		@if (observationGuide(); as guide) {
			<div>
				<div style="display: flex; align-items: center; justify-content: space-between;">
					<h2>{{ guide.title }}</h2>
					<span style="flex: 1 1 auto"></span>
					<button
						routerLink="/assessments/observation-sheets"
						mat-button
						color="link"
						style="margin-right: 8px"
					>
						<mat-icon>home</mat-icon>
						Todas las guias
					</button>
					<button
						mat-button
						color="warn"
						(click)="deleteGuide()"
						style="margin-right: 8px; display: none;"
					>
						<mat-icon>delete</mat-icon>
						Eliminar esta guia
					</button>
					<button
						(click)="download()"
						mat-flat-button
						color="accent"
					>
						<mat-icon>download</mat-icon>
						Descargar
					</button>
				</div>
			</div>
			<div style="margin-top: 24px">
				<app-observation-guide
					[students]="students()"
					[guide]="guide"
				></app-observation-guide>
			</div>
		}
	`,
})
export class ObservationSheetDetailComponent implements OnInit {
	#store = inject(Store)
	#actions$ = inject(Actions)
	private pdfService = inject(PdfService)
	private route = inject(ActivatedRoute)
	private router = inject(Router)
	private sb = inject(MatSnackBar)

	public observationGuide = this.#store.selectSignal(selectCurrentGuide)
	public students = this.#store.selectSignal(selectSectionStudents)
	public id = this.route.snapshot.paramMap.get('id') || ''

	#destroy$ = new Subject<void>()

	constructor() {
		effect(() => {
			const guide = this.observationGuide()
			if (guide) {
				const section = guide.section
				this.#store.dispatch(loadStudentsBySection({ sectionId: section._id }))
			}
		})
	}

	ngOnInit() {
		this.#store.dispatch(loadGuide({ id: this.id }))
	}

	ngOnDestroy() {
		this.#destroy$.next()
		this.#destroy$.complete()
	}

	deleteGuide() {
		this.#store.dispatch(deleteGuide({ id: this.id }))
		this.#actions$.pipe(ofType(deleteGuideSuccess), takeUntil(this.#destroy$)).subscribe(() => {
			this.router
				.navigate(['/assessments/observation-sheets'])
				.then(() => {
					this.sb.open('El instrumento ha sido eliminado', 'Ok', {
						duration: 2500,
					})
				})
		})
	}

	download() {
		const guide = this.observationGuide()
		if (!guide) return
		const title = guide.title
		this.sb.open(
			'Estamos preparando la descarga, espera un momento.',
			'Ok',
			{ duration: 2500 },
		)
		if (guide.individual) {
			this.students().forEach((student, i) => {
				this.pdfService.createAndDownloadFromHTML(
					'guide-' + i,
					`Guia de observacion ${title} para ${student.firstname} ${student.lastname}`,
				)
			})
		} else {
			this.pdfService.createAndDownloadFromHTML(
				'guide',
				'Guia de observacion: ' + title,
			)
		}
	}
}
