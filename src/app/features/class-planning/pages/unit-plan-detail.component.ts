import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UnitPlan } from '../../../core/models';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf.service';
import { UnitPlanComponent } from '../components/unit-plan.component';
import { DailyPlanBatchGeneratorComponent } from './daily-plan-batch-generator.component';
import { Rubric } from '../../../core';
import { UnitPlanInstruments } from '../../../core';
import { RubricGeneratorComponent } from '../../assessments/pages/rubric-generator.component';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import {
	deletePlan,
	downloadPlan,
	loadPlan,
	selectCurrentPlan,
	selectUnitPlanIsLoading,
} from '../../../store/unit-plans';
import { loadClassPlans } from '../../../store/class-plans/class-plans.actions';
import { selectClassPlans, selectClassPlansLoading } from '../../../store/class-plans/class-plans.selectors';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';
import { loadCurrentSubscription, selectAiIsGenerating } from '../../../store';

@Component({
	selector: 'app-unit-plan-detail',
	imports: [
		RouterModule,
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
				<button mat-button color="link" routerLink="/planning/unit-plans">
					Volver
				</button>
				<button mat-button color="warn" style="display: none" (click)="deletePlan()">
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

		@if (plan(); as plan) {
			<div [id]="isPrintView ? 'print-view-sheet' : 'plan-sheet'">
				@if (isPrintView) {
					<h1 style="text-align: center">{{ plan.title }}</h1>
				}
				<app-unit-plan [classPlans]="classPlans()" [unitPlan]="plan" />
				@if (!isPrintView) {
					<div>
						<h2>Planes Diarios</h2>
						<ul style="list-style: none">
							@for (
								dailyPlan of classPlans();
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
					@if (isPremium()) {
						@if (classPlans().length === 0 || isGenerating()) {
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
						@if (isPremium()) {
							@if (rubrics.length === 0) {
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
	private sb = inject(MatSnackBar);
	private pdfService = inject(PdfService);
	printing = false;
	planId = this.route.snapshot.paramMap.get('id') || '';
	plan = this.#store.selectSignal(selectCurrentPlan)
	instruments: UnitPlanInstruments | null = null;
	user = this.#store.selectSignal(selectAuthUser);

	rubrics: Rubric[] = [];
	isPremium = this.#store.selectSignal(selectIsPremium)
	classPlans = this.#store.selectSignal(selectClassPlans)

	isLoading = this.#store.selectSignal(selectUnitPlanIsLoading)
	isLoadingClassPlans = this.#store.selectSignal(selectClassPlansLoading)
	isGenerating = this.#store.selectSignal(selectAiIsGenerating)

	isPrintView = window.location.href.includes('print');

	ngOnInit() {
		const unitPlan = this.planId;
		this.#store.dispatch(loadClassPlans({ filters: { unitPlan } }));
		this.#store.dispatch(loadPlan({ id: unitPlan }));
		this.#store.dispatch(loadCurrentSubscription())
		this.#store.select(selectClassPlans).subscribe(() => {
			if (this.isPrintView) {
				setTimeout(() => {
					window.print();
				}, 2000);
			}
		});
	}

	async download() {
		const user = this.user();
		const plan = this.plan()
		const classPlans = this.classPlans() || []
		if (!plan || !user) return;
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
		this.#store.dispatch(downloadPlan({ plan, classPlans, user }))
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
			this.#store.dispatch(deletePlan({ id }))
			this.router.navigate(['/planning/unit-plans']).then(() => {
				this.sb.open('El plan ha sido eliminado.', 'Ok', {
					duration: 2500,
				});
			});
		}
	}
}
