import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityResourceService } from '../../core/services';
import * as ActivityResourcesActions from './activity-resources.actions';

const timing = { duration: 2500 };

@Injectable()
export class ActivityResourcesEffects {
	#actions$ = inject(Actions);
	#activityResourceService = inject(ActivityResourceService);
	#sb = inject(MatSnackBar);

	loadResource$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ActivityResourcesActions.loadResource),
			switchMap(({ id }) =>
				this.#activityResourceService.findOne(id).pipe(
					map((resource) =>
						ActivityResourcesActions.loadResourceSuccess({
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
							ActivityResourcesActions.loadResourceFailed({
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
			ofType(ActivityResourcesActions.loadResources),
			switchMap(({ filters }) =>
				this.#activityResourceService.findAll(filters).pipe(
					map((resources) =>
						ActivityResourcesActions.loadResourcesSuccess({
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
							ActivityResourcesActions.loadResourcesFailed({
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
			ofType(ActivityResourcesActions.createResource),
			switchMap(({ resource }) =>
				this.#activityResourceService.create(resource).pipe(
					map((newResource) => {
						this.#sb.open(
							'El recurso ha sido creado',
							'Ok',
							timing,
						);
						return ActivityResourcesActions.createResourceSuccess({
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
							ActivityResourcesActions.createResourceFailed({
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
			ofType(ActivityResourcesActions.updateResource),
			switchMap(({ id, data }) =>
				this.#activityResourceService.update(id, data).pipe(
					map((updatedResource) => {
						this.#sb.open(
							'El recurso fue actualizado',
							'Ok',
							timing,
						);
						return ActivityResourcesActions.updateResourceSuccess({
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
							ActivityResourcesActions.updateResourceFailed({
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
			ofType(ActivityResourcesActions.deleteResource),
			switchMap(({ id }) =>
				this.#activityResourceService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El recurso ha sido eliminado',
							'Ok',
							timing,
						);
						return ActivityResourcesActions.deleteResourceSuccess({
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
							ActivityResourcesActions.deleteResourceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
