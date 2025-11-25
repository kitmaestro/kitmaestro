import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DidacticResourceService } from '../../core/services';
import * as DidacticResourcesActions from './didactic-resources.actions';

const timing = { duration: 2500 };

@Injectable()
export class DidacticResourcesEffects {
	#actions$ = inject(Actions);
	#didacticResourceService = inject(DidacticResourceService);
	#sb = inject(MatSnackBar);

	loadResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.loadResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.findOne(id).pipe(
					map((resource) =>
						DidacticResourcesActions.loadResourceSuccess({
							resource,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.loadResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadResources$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.loadResources),
			switchMap(() =>
				this.#didacticResourceService.findAll().pipe(
					map((resources) =>
						DidacticResourcesActions.loadResourcesSuccess({
							resources,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los recursos',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.loadResourcesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadMyResources$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.loadMyResources),
			switchMap(() =>
				this.#didacticResourceService.findMyResources().pipe(
					map((resources) =>
						DidacticResourcesActions.loadMyResourcesSuccess({
							resources,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar mis recursos',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.loadMyResourcesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadUserResources$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.loadUserResources),
			switchMap(({ userId }) =>
				this.#didacticResourceService.findByUser(userId).pipe(
					map((resources) =>
						DidacticResourcesActions.loadUserResourcesSuccess({
							resources,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los recursos del usuario',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.loadUserResourcesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.createResource),
			switchMap(({ resource }) =>
				this.#didacticResourceService.create(resource).pipe(
					map((newResource) => {
						this.#sb.open(
							'El recurso ha sido creado',
							'Ok',
							timing,
						);
						return DidacticResourcesActions.createResourceSuccess({
							resource: newResource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.createResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.updateResource),
			switchMap(({ id, data }) =>
				this.#didacticResourceService.update(id, data).pipe(
					map((updatedResource) => {
						this.#sb.open(
							'El recurso fue actualizado',
							'Ok',
							timing,
						);
						return DidacticResourcesActions.updateResourceSuccess({
							resource: updatedResource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.updateResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.deleteResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El recurso ha sido eliminado',
							'Ok',
							timing,
						);
						return DidacticResourcesActions.deleteResourceSuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.deleteResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	// --- Special Effects ---

	bookmarkResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.bookmarkResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.bookmark(id).pipe(
					map((resource) => {
						this.#sb.open('Recurso guardado', 'Ok', timing);
						return DidacticResourcesActions.updateResourceSuccess({
							resource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al guardar el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.updateResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	likeResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.likeResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.like(id).pipe(
					map((resource) => {
						this.#sb.open(
							'Recurso marcado como "Me gusta"',
							'Ok',
							timing,
						);
						return DidacticResourcesActions.updateResourceSuccess({
							resource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al procesar "Me gusta"',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.updateResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	dislikeResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.dislikeResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.dislike(id).pipe(
					map((resource) => {
						this.#sb.open(
							'Recurso marcado como "No me gusta"',
							'Ok',
							timing,
						);
						return DidacticResourcesActions.updateResourceSuccess({
							resource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al procesar "No me gusta"',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.updateResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	buyResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.buyResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.buy(id).pipe(
					map((resource) => {
						this.#sb.open('Recurso adquirido', 'Ok', timing);
						return DidacticResourcesActions.updateResourceSuccess({
							resource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al comprar el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.updateResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	downloadResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticResourcesActions.downloadResource),
			switchMap(({ id }) =>
				this.#didacticResourceService.download(id).pipe(
					map((resource) => {
						this.#sb.open('Descarga registrada', 'Ok', timing);
						return DidacticResourcesActions.updateResourceSuccess({
							resource,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al descargar el recurso',
							'Ok',
							timing,
						);
						return of(
							DidacticResourcesActions.updateResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
