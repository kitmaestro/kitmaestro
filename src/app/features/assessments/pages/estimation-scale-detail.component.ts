import { Component, inject, OnInit } from '@angular/core'
import { AuthService } from '../../../core/services/auth.service'
import { EstimationScaleService } from '../../../core/services/estimation-scale.service'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PdfService } from '../../../core/services/pdf.service'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { User } from '../../../core'
import { EstimationScale } from '../../../core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { EstimationScaleComponent } from '../components/estimation-scale.component'
import { PretifyPipe } from '../../../shared'
import { Store } from '@ngrx/store'
import { Actions, ofType } from '@ngrx/effects'
import { Subject, take, takeUntil } from 'rxjs'
import { deleteScale, deleteScaleSuccess, loadScale, loadScaleFailed, selectAuthUser, selectCurrentScale } from '../../../store'

@Component({
	selector: 'app-estimation-scale-detail',
	imports: [
		RouterLink,
		MatSnackBarModule,
		MatIconModule,
		MatButtonModule,
		EstimationScaleComponent,
	],
	template: `
		@if (estimationScale(); as scale) {
			<div>
				<div style="display: flex; justify-content: space-between; align-items: center;">
					<h2>{{ scale.title }}</h2>
					<span style="flex: 1 1 auto"></span>
					<a
						routerLink="/assessments/estimation-scales"
						mat-button
						style="margin-right: 8px"
					>
						<mat-icon>home</mat-icon>
						Todas las escalas de estimacion
					</a>
					<button
						mat-button
						(click)="deleteInstrument()"
						style="margin-right: 8px; display: none;"
					>
						<mat-icon>delete</mat-icon>
						Eliminar esta escala de estimacion
					</button>
					<!-- <a target="_blank" routerLink="/print-activities/{{id}}" mat-icon-button color="link" style="margin-right: 8px;">
							<mat-icon>print</mat-icon>
						</a> -->
					<button
						(click)="print()"
						mat-flat-button
					>
						<mat-icon>download</mat-icon>
						Descargar
					</button>
				</div>
			</div>
			<div style="margin-top: 24px; padding-bottom: 42px;">
				<app-estimation-scale [estimationScale]="scale" />
			</div>
		}
	`,
	styles: `
		mat-form-field {
			min-width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.grid-2-1 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 2fr 1fr;
			}
		}

		table {
			border-collapse: collapse;
			border: 1px solid #ccc;
			width: 100%;
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
export class EstimationScaleDetailComponent implements OnInit {
	#store = inject(Store)
	#actions$ = inject(Actions)
	private pdfService = inject(PdfService)
	private router = inject(Router)
	private route = inject(ActivatedRoute)
	private sb = inject(MatSnackBar)
	private id = this.route.snapshot.paramMap.get('id') || ''

	public estimationScale = this.#store.selectSignal(selectCurrentScale)

	#destroy$ = new Subject<void>()

	ngOnInit(): void {
		this.#store.dispatch(loadScale({ id: this.id }))
		this.#actions$.pipe(ofType(loadScaleFailed), take(1), takeUntil(this.#destroy$)).subscribe(({ error }) => {
			this.router.navigate(['/assessments/estimation-scales'])
		})
	}

	ngOnDestroy() {
		this.#destroy$.next()
		this.#destroy$.complete()
	}

	deleteInstrument() {
		this.#store.dispatch(deleteScale({ id: this.id }))
		this.#actions$.pipe(ofType(deleteScaleSuccess), take(1), takeUntil(this.#destroy$)).subscribe(() => {
			this.router.navigate(['/assessments/estimation-scales'])
		})
	}

	print() {
		const scale = this.estimationScale()
		if (!scale) return
		this.sb.open(
			'Ya estamos exportando tu instrumento. Espera un momento.',
			'Ok',
			{ duration: 2500 },
		)
		this.pdfService.exportTableToPDF(
			'estimation-scale',
			scale.title || '',
		)
	}
}
