import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of, tap, take } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ScoreSystemService } from '../../core/services'
import * as ScoreSystemsActions from './score-systems.actions'

const timing = { duration: 2500 }

@Injectable()
export class ScoreSystemsEffects {
	#actions$ = inject(Actions)
	#scoreSystemService = inject(ScoreSystemService)
	#sb = inject(MatSnackBar)

	loadSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.loadSystem),
			switchMap(({ id }) =>
				this.#scoreSystemService.find(id).pipe(
					map((system) =>
						ScoreSystemsActions.loadSystemSuccess({ system }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar el esquema de calificaciones',
							'Ok',
							timing,
						)
						return of(
							ScoreSystemsActions.loadSystemFailed({
								error: error.message,
							}),
						)
					}),
				),
			),
		),
	)

	loadSystems$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.loadSystems),
			switchMap(() =>
				this.#scoreSystemService.findAll().pipe(
					map((systems) =>
						ScoreSystemsActions.loadSystemsSuccess({ systems }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los esquemas de calificaciones',
							'Ok',
							timing,
						)
						return of(
							ScoreSystemsActions.loadSystemsFailed({
								error: error.message,
							}),
						)
					}),
				),
			),
		),
	)

	createSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.createSystem),
			switchMap(({ system }) =>
				this.#scoreSystemService.create(system).pipe(
					map((newSystem) => {
						this.#sb.open(
							'El esquema de calificaciones ha sido creado',
							'Ok',
							timing,
						)
						return ScoreSystemsActions.createSystemSuccess({
							system: newSystem,
						})
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear el esquema de calificaciones',
							'Ok',
							timing,
						)
						return of(
							ScoreSystemsActions.createSystemFailed({
								error: error.message,
							}),
						)
					}),
				),
			),
		),
	)

	updateSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.updateSystem),
			switchMap(({ id, data }) =>
				this.#scoreSystemService.update(id, data).pipe(
					map((updatedSystem) => {
						this.#sb.open(
							'El esquema de calificaciones ha sido actualizado',
							'Ok',
							timing,
						)
						return ScoreSystemsActions.updateSystemSuccess({
							system: updatedSystem,
						})
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el esquema de calificaciones',
							'Ok',
							timing,
						)
						return of(
							ScoreSystemsActions.updateSystemFailed({
								error: error.message,
							}),
						)
					}),
				),
			),
		),
	)

	deleteSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.deleteSystem),
			switchMap(({ id }) =>
				this.#scoreSystemService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El esquema de calificaciones ha sido eliminado',
							'Ok',
							timing,
						)
						return ScoreSystemsActions.deleteSystemSuccess({ id })
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el esquema de calificaciones',
							'Ok',
							timing,
						)
						return of(
							ScoreSystemsActions.deleteSystemFailed({
								error: error.message,
							}),
						)
					}),
				),
			),
		),
	)

	downloadSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.downloadSystem),
			take(1),
			tap(({ system, students }) => {
				this.#scoreSystemService.download(system, students)
				this.#sb.open(
				'El esquema de calificaciones ha sido descargado',
					'Ok',
					timing,
				)
				return ScoreSystemsActions.downloadSystemSuccess()
			}),
			catchError((error) => {
				this.#sb.open(
					'Error al descargar el esquema de calificaciones',
					'Ok',
					timing,
				)
				return of(
					ScoreSystemsActions.downloadSystemFailed({
						error: error.message,
					}),
				)
			}),
		),
	)
}
