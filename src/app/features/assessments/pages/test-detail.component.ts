import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestComponent } from '../components/test.component';
import { Store } from '@ngrx/store';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';
import {
	selectCurrentTest,
	selectIsLoadingOne,
	selectTestsError,
} from '../../../store/tests/tests.selectors';
import {
	deleteTest,
	deleteTestSuccess,
	downloadTest,
	loadCurrentSubscription,
	loadTest,
} from '../../../store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-test-detail',
	imports: [
		MatCardModule,
		RouterModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
		TestComponent,
	],
	template: `
		<div>
			<div
				style="justify-content: space-between; align-items: center; display: flex;"
			>
				<h2>Detalles del Examen</h2>
				<div style="display: flex; gap: 12px">
					<button mat-button routerLink="/assessments/tests">
						<mat-icon>list</mat-icon> Ver Todo
					</button>
					<button
						mat-button
						(click)="remove()"
						style="display: none;"
					>
						<mat-icon>delete</mat-icon> Eliminar
					</button>
					<div
						[matTooltip]="
							isPremium()
								? undefined
								: 'Necesitas una suscripcion para descargar este examen'
						"
					>
						<button
							mat-button
							(click)="download()"
							[disabled]="!isPremium()"
						>
							<mat-icon>download</mat-icon> Descargar
						</button>
					</div>
				</div>
			</div>
		</div>

		@if (test(); as t) {
			<div style="margin-top: 24px">
				<div
					style="max-width: 8.5in; margin: 0 auto; border: 1px solid #eee; padding: 0.45in; width: 8.5in;"
				>
					<div>
						<app-test [data]="t.body"></app-test>
					</div>
				</div>
			</div>
		}
	`,
})
export class TestDetailComponent implements OnInit {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';
	isPremium = this.#store.selectSignal(selectIsPremium);

	test = this.#store.selectSignal(selectCurrentTest);
	loading = this.#store.selectSignal(selectIsLoadingOne);

	#destroy$ = new Subject<void>();

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	ngOnInit() {
		if (!this.id) {
			this.sb.open('No se ha encontrado el examen', 'Ok', {
				duration: 2500,
			});
			return;
		}

		this.#store.dispatch(loadTest({ id: this.id }));
		this.#store.dispatch(loadCurrentSubscription());

		this.#store
			.select(selectTestsError)
			.pipe(takeUntil(this.#destroy$))
			.subscribe((err) => {
				if (err) {
					console.log(err);
					this.router.navigateByUrl('/assessments/tests').then(() => {
						this.sb.open(
							'Ha ocurrido un error al cargar el examen solicitado',
							'Ok',
							{ duration: 2500 },
						);
					});
				}
			});
	}

	async download() {
		const test = this.test();
		if (test) {
			this.#store.dispatch(downloadTest({ test }));
		}
	}

	remove() {
		this.#store.dispatch(deleteTest({ id: this.id }));
		this.#actions$
			.pipe(ofType(deleteTestSuccess), takeUntil(this.#destroy$))
			.subscribe(() => {
				this.router.navigateByUrl('/assessments/tests').then(() => {
					this.sb.open('Se ha eliminado el examen', 'Ok', {
						duration: 2500,
					});
				});
			});
	}
}
