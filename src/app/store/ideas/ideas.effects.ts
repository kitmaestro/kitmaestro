import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdeaService } from '../../core/services';
import * as IdeasActions from './ideas.actions';

const timing = { duration: 2500 };

@Injectable()
export class IdeasEffects {
	#actions$ = inject(Actions);
	#ideaService = inject(IdeaService);
	#sb = inject(MatSnackBar);

	loadIdea$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(IdeasActions.loadIdea),
			switchMap(({ id }) =>
				this.#ideaService.find(id).pipe(
					map((idea) => IdeasActions.loadIdeaSuccess({ idea })),
					catchError((error) => {
						this.#sb.open('Error al cargar la idea', 'Ok', timing);
						return of(
							IdeasActions.loadIdeaFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadIdeas$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(IdeasActions.loadIdeas),
			switchMap(() =>
				this.#ideaService.findAll().pipe(
					map((ideas) => IdeasActions.loadIdeasSuccess({ ideas })),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las ideas',
							'Ok',
							timing,
						);
						return of(
							IdeasActions.loadIdeasFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createIdea$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(IdeasActions.createIdea),
			switchMap(({ idea }) =>
				this.#ideaService.create(idea).pipe(
					map((newIdea) => {
						this.#sb.open('La idea ha sido creada', 'Ok', timing);
						return IdeasActions.createIdeaSuccess({
							idea: newIdea,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear la idea', 'Ok', timing);
						return of(
							IdeasActions.createIdeaFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateIdea$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(IdeasActions.updateIdea),
			switchMap(({ id, data }) =>
				this.#ideaService.update(id, data).pipe(
					map((updatedIdea) => {
						this.#sb.open('La idea fue actualizada', 'Ok', timing);
						return IdeasActions.updateIdeaSuccess({
							idea: updatedIdea,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la idea',
							'Ok',
							timing,
						);
						return of(
							IdeasActions.updateIdeaFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteIdea$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(IdeasActions.deleteIdea),
			switchMap(({ id }) =>
				this.#ideaService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La idea ha sido eliminada',
							'Ok',
							timing,
						);
						return IdeasActions.deleteIdeaSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la idea',
							'Ok',
							timing,
						);
						return of(
							IdeasActions.deleteIdeaFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
