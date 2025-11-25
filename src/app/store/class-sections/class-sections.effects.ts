import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassSectionService } from '../../core/services';
import * as ClassSectionsActions from './class-sections.actions';

const timing = { duration: 2500 };

@Injectable()
export class ClassSectionsEffects {
	#actions$ = inject(Actions);
	#classSectionService = inject(ClassSectionService);
	#sb = inject(MatSnackBar);

	loadSection$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ClassSectionsActions.loadSection),
			switchMap(({ id }) =>
				this.#classSectionService.findSection(id).pipe(
					map((section) =>
						ClassSectionsActions.loadSectionSuccess({ section }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la sección',
							'Ok',
							timing,
						);
						return of(
							ClassSectionsActions.loadSectionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadSections$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ClassSectionsActions.loadSections),
			switchMap(() =>
				this.#classSectionService.findSections().pipe(
					map((sections) =>
						ClassSectionsActions.loadSectionsSuccess({ sections }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las secciones',
							'Ok',
							timing,
						);
						return of(
							ClassSectionsActions.loadSectionsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createSection$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ClassSectionsActions.createSection),
			switchMap(({ section }) =>
				this.#classSectionService.addSection(section as any).pipe(
					map((newSection) => {
						this.#sb.open(
							'La sección ha sido creada',
							'Ok',
							timing,
						);
						return ClassSectionsActions.createSectionSuccess({
							section: newSection,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la sección',
							'Ok',
							timing,
						);
						return of(
							ClassSectionsActions.createSectionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateSection$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ClassSectionsActions.updateSection),
			switchMap(({ id, data }) =>
				this.#classSectionService.updateSection(id, data).pipe(
					map((section) => {
						this.#sb.open(
							'La sección fue actualizada',
							'Ok',
							timing,
						);
						return ClassSectionsActions.updateSectionSuccess({
							section: section,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la sección',
							'Ok',
							timing,
						);
						return of(
							ClassSectionsActions.updateSectionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteSection$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ClassSectionsActions.deleteSection),
			switchMap(({ id }) =>
				this.#classSectionService.deleteSection(id).pipe(
					map(() => {
						this.#sb.open(
							'La sección ha sido eliminada',
							'Ok',
							timing,
						);
						return ClassSectionsActions.deleteSectionSuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la sección',
							'Ok',
							timing,
						);
						return of(
							ClassSectionsActions.deleteSectionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
