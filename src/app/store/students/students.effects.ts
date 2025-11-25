import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentsService } from '../../core/services';
import * as StudentsActions from './students.actions';

const timing = { duration: 2500 };

@Injectable()
export class StudentsEffects {
	#actions$ = inject(Actions);
	#studentsService = inject(StudentsService);
	#sb = inject(MatSnackBar);

	loadStudent$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(StudentsActions.loadStudent),
			switchMap(({ id }) =>
				this.#studentsService.find(id).pipe(
					map((student) =>
						StudentsActions.loadStudentSuccess({ student }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar el estudiante',
							'Ok',
							timing,
						);
						return of(
							StudentsActions.loadStudentFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadStudents$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(StudentsActions.loadStudents),
			switchMap(() =>
				this.#studentsService.findAll().pipe(
					map((students) =>
						StudentsActions.loadStudentsSuccess({ students }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los estudiantes',
							'Ok',
							timing,
						);
						return of(
							StudentsActions.loadStudentsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadStudentsBySection$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(StudentsActions.loadStudentsBySection),
			switchMap(({ sectionId }) =>
				this.#studentsService.findBySection(sectionId).pipe(
					map((students) =>
						StudentsActions.loadStudentsBySectionSuccess({
							students,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los estudiantes de la sección',
							'Ok',
							timing,
						);
						return of(
							StudentsActions.loadStudentsBySectionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createStudent$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(StudentsActions.createStudent),
			switchMap(({ student }) =>
				this.#studentsService.create(student).pipe(
					map((newStudent) => {
						this.#sb.open(
							'El estudiante ha sido creado',
							'Ok',
							timing,
						);
						return StudentsActions.createStudentSuccess({
							student: newStudent,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear el estudiante',
							'Ok',
							timing,
						);
						return of(
							StudentsActions.createStudentFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateStudent$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(StudentsActions.updateStudent),
			switchMap(({ id, data }) =>
				this.#studentsService.update(id, data).pipe(
					map((updatedStudent) => {
						this.#sb.open(
							'El estudiante fue actualizado',
							'Ok',
							timing,
						);
						return StudentsActions.updateStudentSuccess({
							student: updatedStudent,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el estudiante',
							'Ok',
							timing,
						);
						return of(
							StudentsActions.updateStudentFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteStudent$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(StudentsActions.deleteStudent),
			switchMap(({ id }) =>
				this.#studentsService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El estudiante ha sido eliminado',
							'Ok',
							timing,
						);
						return StudentsActions.deleteStudentSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el estudiante',
							'Ok',
							timing,
						);
						return of(
							StudentsActions.deleteStudentFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
