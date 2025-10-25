import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of, tap, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestService } from '../../core/services';
import * as TestsActions from './tests.actions';

const timing = { duration: 2500 };

@Injectable()
export class TestsEffects {
	#actions$ = inject(Actions);
	#testService = inject(TestService);
	#sb = inject(MatSnackBar);

	loadTest$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TestsActions.loadTest),
			switchMap(({ id }) =>
				this.#testService.find(id).pipe(
					map((test) => TestsActions.loadTestSuccess({ test })),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la prueba',
							'Ok',
							timing,
						);
						return of(
							TestsActions.loadTestFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadTests$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TestsActions.loadTests),
			switchMap(({ filters }) =>
				this.#testService.findAll(filters).pipe(
					map((tests) => TestsActions.loadTestsSuccess({ tests })),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las pruebas',
							'Ok',
							timing,
						);
						return of(
							TestsActions.loadTestsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createTest$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TestsActions.createTest),
			switchMap(({ test }) =>
				this.#testService.create(test).pipe(
					map((newTest) => {
						this.#sb.open('La prueba ha sido creada', 'Ok', timing);
						return TestsActions.createTestSuccess({
							test: newTest,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear la prueba', 'Ok', timing);
						return of(
							TestsActions.createTestFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateTest$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TestsActions.updateTest),
			switchMap(({ id, data }) =>
				this.#testService.update(id, data).pipe(
					map((updatedTest) => {
						this.#sb.open(
							'La prueba fue actualizada',
							'Ok',
							timing,
						);
						return TestsActions.updateTestSuccess({
							test: updatedTest,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la prueba',
							'Ok',
							timing,
						);
						return of(
							TestsActions.updateTestFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteTest$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TestsActions.deleteTest),
			switchMap(({ id }) =>
				this.#testService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La prueba ha sido eliminada',
							'Ok',
							timing,
						);
						return TestsActions.deleteTestSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la prueba',
							'Ok',
							timing,
						);
						return of(
							TestsActions.deleteTestFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	downloadTest$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TestsActions.downloadTest),
			take(1),
			tap(({ test }) => {
				this.#testService.download(test)
				this.#sb.open(
					'El examen ha sido descargada',
					'Ok',
					timing
				);
			}),
		),
	);
}
