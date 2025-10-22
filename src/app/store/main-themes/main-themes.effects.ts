import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainThemeService } from '../../core/services';
import * as MainThemesActions from './main-themes.actions';

const timing = { duration: 2500 };

@Injectable()
export class MainThemesEffects {
	#actions$ = inject(Actions);
	#mainThemeService = inject(MainThemeService);
	#sb = inject(MatSnackBar);

	loadTheme$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(MainThemesActions.loadTheme),
			switchMap(({ id }) =>
				this.#mainThemeService.find(id).pipe(
					map((theme) =>
						MainThemesActions.loadThemeSuccess({ theme }),
					),
					catchError((error) => {
						this.#sb.open('Error al cargar el tema', 'Ok', timing);
						return of(
							MainThemesActions.loadThemeFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadThemes$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(MainThemesActions.loadThemes),
			switchMap(({ filters }) =>
				this.#mainThemeService.findAll(filters).pipe(
					map((themes) =>
						MainThemesActions.loadThemesSuccess({ themes }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los temas',
							'Ok',
							timing,
						);
						return of(
							MainThemesActions.loadThemesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createTheme$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(MainThemesActions.createTheme),
			switchMap(({ theme }) =>
				this.#mainThemeService.create(theme).pipe(
					map((newTheme) => {
						this.#sb.open('El tema ha sido creado', 'Ok', timing);
						return MainThemesActions.createThemeSuccess({
							theme: newTheme,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear el tema', 'Ok', timing);
						return of(
							MainThemesActions.createThemeFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateTheme$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(MainThemesActions.updateTheme),
			switchMap(({ id, data }) =>
				this.#mainThemeService.update(id, data).pipe(
					map((updatedTheme) => {
						this.#sb.open('El tema fue actualizado', 'Ok', timing);
						return MainThemesActions.updateThemeSuccess({
							theme: updatedTheme,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el tema',
							'Ok',
							timing,
						);
						return of(
							MainThemesActions.updateThemeFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteTheme$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(MainThemesActions.deleteTheme),
			switchMap(({ id }) =>
				this.#mainThemeService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El tema ha sido eliminado',
							'Ok',
							timing,
						);
						return MainThemesActions.deleteThemeSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el tema',
							'Ok',
							timing,
						);
						return of(
							MainThemesActions.deleteThemeFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
