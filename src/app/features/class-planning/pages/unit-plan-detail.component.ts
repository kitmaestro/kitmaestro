import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UnitPlanService } from '../../../core/services/unit-plan.service';
import { map, Observable, tap } from 'rxjs';
import { UnitPlan } from '../../../core/models';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../core/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf.service';
import { UnitPlanComponent } from '../components/unit-plan.component';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { DailyPlanBatchGeneratorComponent } from './daily-plan-batch-generator.component';
import { ClassPlan, Rubric } from '../../../core';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { UnitPlanInstruments } from '../../../core';
import { RubricService } from '../../../core/services/rubric.service';
import { RubricGeneratorComponent } from '../../assessments/pages/rubric-generator.component';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import {
	loadPlan,
	loadPlans,
	selectCurrentPlan,
} from '../../../store/unit-plans';
import { loadClassPlans } from '../../../store/class-plans/class-plans.actions';
import { selectClassPlans } from '../../../store/class-plans/class-plans.selectors';

@Component({
	selector: 'app-unit-plan-detail',
	imports: [
		RouterModule,
		AsyncPipe,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatSnackBarModule,
		UnitPlanComponent,
		DailyPlanBatchGeneratorComponent,
		RubricGeneratorComponent,
		DatePipe,
	],
	template: `
		@if (!isPrintView) {
			<div style="display: flex; gap: 12px; justify-content: center">
				<button mat-button color="link" (click)="goBack()">
					Volver
				</button>
				<button mat-button color="warn" (click)="deletePlan()">
					Eliminar
				</button>
				<button
					mat-button
					style="display: none"
					color="accent"
					[routerLink]="['/planning', 'unit-plans', planId, 'edit']"
				>
					Editar
				</button>
				<a
					mat-button
					color="primary"
					href="/print-unit-plan/{{ planId }}"
					target="_blank"
					>Imprimir</a
				>
				<button
					mat-button
					color="primary"
					[attr.title]="
						!isPremium()
							? 'Necesitas una suscripcion para descargar los planes'
							: undefined
					"
					[disabled]="printing || !isPremium()"
					(click)="download()"
				>
					Descargar
				</button>
				<!-- <button mat-raised-button color="primary" (click)="printPlan()">Exportar PDF</button> -->
			</div>
		}

		@if (plan$ | async; as plan) {
			<div [id]="isPrintView ? 'print-view-sheet' : 'plan-sheet'">
				@if (isPrintView) {
					<h1 style="text-align: center">{{ plan.title }}</h1>
				}
				<app-unit-plan [classPlans]="classPlans" [unitPlan]="plan" />
				@if (!isPrintView) {
					<div>
						<h2>Planes Diarios</h2>
						<ul style="list-style: none">
							@for (
								dailyPlan of classPlans;
								track dailyPlan._id
							) {
								<li>
									<a
										[routerLink]="[
											'/planning',
											'class-plans',
											dailyPlan._id,
										]"
									>
										Plan diario para el
										{{
											dailyPlan.date | date: 'dd/MM/yyyy'
										}}
									</a>
								</li>
							} @empty {
								<li>No hay planes diarios asociados</li>
							}
						</ul>
					</div>
					@if (activeSubscription$ | async) {
						@if (classPlans.length === 0) {
							<h2>Generar Planes Diarios</h2>
							<app-daily-plan-batch-generator [plan]="plan" />
						}
					}
					<div style="display: none">
						<div>
							@if (rubrics.length > 0) {
								<h2>Instrumentos de Evaluaci&oacute;n</h2>
								<ul style="list-style: none">
									@for (rubric of rubrics; track rubric._id) {
										<li>
											<a
												[routerLink]="[
													'/assessments/rubrics',
													rubric._id,
												]"
												>{{ rubric.title }}</a
											>
										</li>
									} @empty {
										<li>
											No hay instrumentos de
											evaluaci&oacute;n asociados
										</li>
									}
								</ul>
							}
						</div>
						@if (activeSubscription$ | async) {
							@if (rubrics.length == 0) {
								<h2>Generar Instrumentos</h2>
								<app-rubric-generator [unitPlan]="plan" />
							}
						}
					</div>
				}
			</div>
		}
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 10px;
			line-height: 1.5;
			font-size: 12pt;
		}

		td {
			vertical-align: top;
		}

		th {
			font-weight: bold;
			text-align: center;
		}

		.cols-2 {
			display: grid;
			row-gap: 6px;
			column-gap: 16px;
			margin-bottom: 8px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.flex-on-md {
			display: block;

			@media screen and (min-width: 960px) {
				display: flex;
				gap: 16px;
				margin-top: 16px;
			}
		}

		#plan-sheet {
			padding: 0.5in;
			margin-top: 42px;
			min-width: 8.5in;
			background-color: white;
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}

		#print-view-sheet {
			display: block;
			padding: 0;
			width: 11in;
			overflow-y: auto;
			margin: 0 auto;
		}
	`,
})
export class UnitPlanDetailComponent implements OnInit {
	#store = inject(Store);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private unitPlanService = inject(UnitPlanService);
	private classPlanService = inject(ClassPlansService);
	private userSubscriptionService = inject(UserSubscriptionService);
	private rubricService = inject(RubricService);
	private sb = inject(MatSnackBar);
	private pdfService = inject(PdfService);
	printing = false;
	planId = this.route.snapshot.paramMap.get('id') || '';
	plan: UnitPlan | null = null;
	instruments: UnitPlanInstruments | null = null;
	user = this.#store.selectSignal(selectAuthUser);

	rubrics: Rubric[] = [];
	isPremium = signal(false);

	activeSubscription$: Observable<boolean> = this.userSubscriptionService
		.checkSubscription()
		.pipe(
			map((sub) =>
				sub.subscriptionType.toLowerCase() == 'free'
					? false
					: sub.status.toLowerCase() == 'active' &&
						+new Date(sub.endDate) > Date.now(),
			),
			tap((status) => this.isPremium.set(status)),
		);

	plan$ = this.#store.select(selectCurrentPlan).pipe(
		tap((_) => {
			if (!_) {
				this.router.navigate(['/planning/unit-plans/list']).then(() => {
					this.sb.open('Este plan no ha sido encontrado', 'Ok', {
						duration: 2500,
					});
				});
			} else {
				this.plan = _;
			}
		}),
	);
	user$ = this.#store.select(selectAuthUser);
	classPlans: ClassPlan[] = [];

	isPrintView = window.location.href.includes('print');

	ngOnInit() {
		const unitPlan = this.planId;
		this.#store.dispatch(loadPlan({ id: unitPlan }));
		this.#store.dispatch(loadClassPlans({ filters: { unitPlan } }));
		this.#store.select(selectClassPlans).subscribe((res) => {
			this.classPlans = res;
			if (this.isPrintView) {
				setTimeout(() => {
					window.print();
				}, 2000);
			}
		});
	}

	pretify(value: string): string {
		return new PretifyPipe().transform(value);
	}

	pretifyCompetence(value: string, level: string) {
		if (level === 'PRIMARIA') {
			if (value === 'Comunicativa') {
				return 'Comunicativa';
			}
			if (value.includes('Pensamiento')) {
				return 'Pensamiento Lógico Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica';
			}
			if (value.includes('Ciudadana')) {
				return 'Ética Y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud';
			}
		} else {
			if (value === 'Comunicativa') {
				return 'Comunicativa';
			}
			if (value === 'Pensamiento Logico') {
				return 'Pensamiento Lógico, Creativo y Crítico';
			}
			if (value === 'Resolucion De Problemas') {
				return 'Resolución de Problemas';
			}
			if (value === 'Ciencia Y Tecnologia') {
				return 'Tecnológica y Científica';
			}
			if (value === 'Etica Y Ciudadana') {
				return 'Ética y Ciudadana';
			}
			if (value === 'Desarrollo Personal Y Espiritual') {
				return 'Desarrollo Personal y Espiritual';
			}
			if (value === 'Ambiental Y De La Salud') {
				return 'Ambiental y de la Salud';
			}
		}
		return value;
	}

	async download() {
		const user = this.user();
		if (!this.plan || !user) return;
		this.printing = true;
		this.sb.open(
			'Tu descarga empezara en breve, espera un momento...',
			'Ok',
			{ duration: 2500 },
		);
		// const response = await fetch(
		//   "https://api.algobook.info/v1/randomimage?category=education"
		// );
		// const img = await response.arrayBuffer();
		await this.unitPlanService.download(this.plan, this.classPlans, user);
		this.printing = false;
	}

	indicators(plan: UnitPlan) {
		return plan.contents.map((c) => ({
			achievement_indicators: c.achievement_indicators,
			subject: c.subject,
		}));
	}

	goBack() {
		window.history.back();
	}

	pretifySubject(subject: string) {
		if (subject === 'LENGUA_ESPANOLA') {
			return 'Lengua Española';
		}
		if (subject === 'MATEMATICA') {
			return 'Matemática';
		}
		if (subject === 'CIENCIAS_SOCIALES') {
			return 'Ciencias Sociales';
		}
		if (subject === 'CIENCIAS_NATURALES') {
			return 'Ciencias de la Naturaleza';
		}
		if (subject === 'INGLES') {
			return 'Inglés';
		}
		if (subject === 'FRANCES') {
			return 'Francés';
		}
		if (subject === 'FORMACION_HUMANA') {
			return 'Formación Integral Humana y Religiosa';
		}
		if (subject === 'EDUCACION_FISICA') {
			return 'Educación Física';
		}
		if (subject === 'EDUCACION_ARTISTICA') {
			return 'Educación Artística';
		}
		return 'Talleres Optativos';
	}

	printPlan() {
		this.sb.open('Estamos exportando tu plan. No te muevas!', 'Ok', {
			duration: 2500,
		});
		this.pdfService.exportToPdf(
			'table',
			'Unidad de Aprendizaje ' + this.route.snapshot.paramMap.get('id'),
			false,
		);
	}

	deletePlan() {
		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.unitPlanService.delete(id).subscribe((result) => {
				if (result.deletedCount === 1) {
					this.router.navigate(['/planning/unit-plans']).then(() => {
						this.sb.open('El plan ha sido eliminado.', 'Ok', {
							duration: 2500,
						});
					});
				}
			});
		} else {
			this.sb.open(
				'No se puede eliminar el plan. Se produjo un error.',
				'Ok',
				{ duration: 2500 },
			);
		}
	}
}
