import { Component, inject, OnInit } from '@angular/core'
import { ChecklistComponent } from '../components/checklist.component'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { Store } from '@ngrx/store'
import { deleteChecklist, deleteChecklistSuccess, downloadChecklist, loadChecklist, selectCurrentChecklist } from '../../../store'
import { Subject, takeUntil } from 'rxjs'
import { Actions, ofType } from '@ngrx/effects'
import { selectCurrentSubscription } from '../../../store/user-subscriptions/user-subscriptions.selectors'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
	selector: 'app-checklist-detail',
	imports: [
		ChecklistComponent,
		RouterModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
	],
	template: `
		<div>
			<h2 style="text-align: center">Detalles de la Lista de Cotejo</h2>
			<div style="display: flex; gap: 12px; justify-content: center">
				<button style="display: none" mat-raised-button (click)="deleteList()" type="button">
					Eliminar
				</button>
				<a mat-button routerLink="/assessments/checklists" type="button">
					<mat-icon>arrow_back</mat-icon>
					Volver
				</a>
				<div [matTooltip]="isPremium() ? 'Descargar' : 'Necesitas una suscripcion para descargar'">
					<button mat-flat-button [disabled]="!isPremium()" (click)="download()" type="button">
						<mat-icon>download</mat-icon>
						Descargar
					</button>
				</div>
			</div>
			@if (checklist(); as list) {
				<app-checklist [checklist]="list"></app-checklist>
			}
		</div>
	`,
})
export class ChecklistDetailComponent implements OnInit {
	#store = inject(Store)
	#actions$ = inject(Actions)
	private route = inject(ActivatedRoute)
	private router = inject(Router)
	private id = this.route.snapshot.paramMap.get('id') || ''
	checklist = this.#store.selectSignal(selectCurrentChecklist)
	isPremium = this.#store.selectSignal(selectCurrentSubscription)

	#destroy$ = new Subject<void>()

	ngOnInit() {
		this.#store.dispatch(loadChecklist({ id: this.id }))
	}

	ngOnDestroy() {
		this.#destroy$.next()
		this.#destroy$.complete()
	}

	deleteList() {
		this.#store.dispatch(deleteChecklist({ id: this.id }))
		this.#actions$.pipe(
			ofType(deleteChecklistSuccess),
			takeUntil(this.#destroy$)
		).subscribe(() => {
			this.router.navigateByUrl('/assessments/checklists')
		})
	}

	download() {
		const checklist = this.checklist()
		if (checklist)
			this.#store.dispatch(downloadChecklist({ checklist }))
	}
}
