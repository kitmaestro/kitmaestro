import { Component, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GradingActivity, GroupedGradingActivity } from '../../../core';
import { MatButtonModule } from '@angular/material/button';
import { ScoreSystemComponent } from '../components/score-system.component';
import { MatIconModule } from '@angular/material/icon';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import {
	selectCurrentSystem,
	selectIsDeleting,
	selectIsDownloading,
} from '../../../store/score-systems/score-systems.selectors';
import { selectSectionStudents } from '../../../store/students/students.selectors';
import {
	deleteSystem,
	deleteSystemSuccess,
	downloadSystem,
	loadCurrentSubscription,
	loadStudentsBySection,
	loadSystem,
	loadSystemFailed,
} from '../../../store';
import { Subject, take, takeUntil } from 'rxjs';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';

@Component({
	selector: 'app-score-system-detail',
	imports: [RouterLink, MatIconModule, MatButtonModule, ScoreSystemComponent],
	template: `
		<div>
			<div style="display: flex; justify-content: space-between">
				<h2>Detalles del Sistema de Calificaci&oacute;n</h2>
				<div style="margin-left: auto">
					<button
						type="button"
						routerLink="/assessments/grading-systems/list"
						mat-button
					>
						<mat-icon>home</mat-icon>
						Todos los sistemas
					</button>
					<button
						(click)="deleteScoreSystem()"
						type="button"
						mat-icon-button
						style="display: none"
						[disabled]="printing() || deleting()"
					>
						<mat-icon>delete</mat-icon>
					</button>
					<button
						(click)="download()"
						type="button"
						style="margin-left: 12px;"
						mat-flat-button
						[disabled]="printing() || deleting() || !isPremium()"
					>
						<mat-icon>download</mat-icon>
						Descargar
					</button>
				</div>
			</div>
		</div>
		<div style="padding-bottom: 42px;">
			@if (scoreSystem(); as system) {
				<app-score-system [scoreSystem]="system" />
			}
		</div>
	`,
})
export class ScoreSystemDetailComponent implements OnInit, OnDestroy {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private id = this.route.snapshot.paramMap.get('id') || '';

	scoreSystem = this.#store.selectSignal(selectCurrentSystem);
	grouped: GroupedGradingActivity[] = [];
	students = this.#store.selectSignal(selectSectionStudents);
	printing = this.#store.selectSignal(selectIsDownloading);
	deleting = this.#store.selectSignal(selectIsDeleting);
	isPremium = this.#store.selectSignal(selectIsPremium);

	#destroy$ = new Subject<void>();

	constructor() {
		effect(() => {
			const system = this.scoreSystem();
			if (system) {
				this.grouped = this.groupByCompetence(system.activities);
				this.#store.dispatch(
					loadStudentsBySection({
						sectionId: system.section._id,
					}),
				);
			}
		});
	}

	ngOnInit() {
		this.#store.dispatch(loadCurrentSubscription());
		this.#store.dispatch(loadSystem({ id: this.id }));
		this.#actions$
			.pipe(ofType(loadSystemFailed), take(1), takeUntil(this.#destroy$))
			.subscribe(() => {
				this.router.navigateByUrl('/assessments/grading-systems');
			});
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	groupByCompetence(
		gradingActivities: GradingActivity[],
	): GroupedGradingActivity[] {
		const grouped = gradingActivities.reduce((acc, activity) => {
			// Si ya existe un grupo con la misma competencia, añade la actividad al grupo
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				// Si no existe, crea un nuevo grupo para esta competencia
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		return grouped;
	}

	adjustGradingActivities(
		gradingActivities: GradingActivity[],
	): GradingActivity[] {
		// Paso 1: Agrupamos por 'competence' y calculamos el total
		const grouped = gradingActivities.reduce((acc, activity) => {
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		// Paso 2: Ajustar los grupos que tengan un total menor a 100
		grouped.forEach((group) => {
			if (group.total < 100) {
				// Calculamos la diferencia que falta para llegar a 100
				const difference = 100 - group.total;

				// Ordenamos las actividades por puntaje ascendente para encontrar las dos menores
				group.grading.sort((a, b) => a.points - b.points);

				if (group.grading.length >= 2) {
					// Repartimos la diferencia entre las dos actividades con menor puntaje
					group.grading[0].points += Math.floor(difference / 2);
					group.grading[1].points += Math.ceil(difference / 2);
				} else if (group.grading.length === 1) {
					// Si solo hay una actividad, le sumamos toda la diferencia
					group.grading[0].points += difference;
				}

				// Actualizamos el total del grupo a 100
				group.total = 100;
			}
		});

		// Paso 3: Retornar el array plano de GradingActivity con los puntos ajustados
		return grouped.flatMap((group) => group.grading);
	}

	deleteScoreSystem() {
		this.#store.dispatch(deleteSystem({ id: this.id }));
		this.#actions$
			.pipe(
				ofType(deleteSystemSuccess),
				take(1),
				takeUntil(this.#destroy$),
			)
			.subscribe(() => {
				this.router.navigateByUrl('/assessments/grading-systems');
			});
	}

	pretify(value: string): string {
		return new PretifyPipe().transform(value);
	}

	async download() {
		const system = this.scoreSystem();
		const students = this.students() || [];
		if (!system) return;
		this.#store.dispatch(downloadSystem({ system, students }));
	}
}
