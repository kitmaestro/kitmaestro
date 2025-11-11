import { Component, effect, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectAuthUserSettings, updateProfile } from "../../../store";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";

@Component({
	selector: 'app-settings',
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
		MatRadioModule,
		MatFormFieldModule,
	],
	template: `
		<h2>Ajustes de KitMaestro</h2>
		<form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
			<div style="margin-bottom: 12px;">
				<mat-checkbox
					formControlName="complementaryActivitiesInClassPlans"
				></mat-checkbox>
				<mat-label
					>Incluir Actividades Complementarias en Planes
					Diarios</mat-label
				>
			</div>
			<div style="margin-bottom: 12px;">
				<mat-checkbox
					formControlName="achievementIndicatorInClassPlans"
				></mat-checkbox>
				<mat-label
					>Incluir Indicadores de Logros en Planes Diarios</mat-label
				>
			</div>
			<div style="margin-bottom: 12px;">
				<mat-label class="title"
					>Color de Plantilla Preferido</mat-label
				>
				<mat-radio-group
					formControlName="preferredTemplateColor"
					class="radio-group"
				>
					<div
						style="
							display: grid;
							gap: 12px;
							align-items: center;
							margin-top: 12px;
							grid-template-columns: repeat(8, 1fr);
						"
					>
						@for (
							templateColor of templateColors;
							track templateColor.value
						) {
							<mat-radio-button
								[value]="templateColor.value"
								class="radio-button"
							>
								<div
									style="
										display: flex;
										align-items: center;
										gap: 12px;
									"
								>
									<div
										style="
											border: 2px solid #ccc;
											width: 48px;
											height: 48px;
											border-radius: 50%;
											background-color: {{
												templateColor.value
											}};
											display: inline-block;
											vertical-align: middle;
										"
										[title]="templateColor.label"
									></div>
								</div>
							</mat-radio-button>
						}
					</div>
				</mat-radio-group>
			</div>
			<div style="margin-bottom: 12px;">
				<mat-label class="title"
					>Esquema de Plan de Unidad Preferido</mat-label
				>
				<mat-radio-group
					formControlName="preferredUnitPlanScheme"
					class="radio-group"
				>
					<div
						style="
							display: grid;
							gap: 12px;
							align-items: center;
							margin-top: 12px;
						"
					>
						@for (
							unitPlanScheme of unitPlanSchemes;
							track unitPlanScheme.value
						) {
							<mat-radio-button
								[value]="unitPlanScheme.value"
								class="radio-button"
							>
								<img
									[alt]="unitPlanScheme.label"
									[src]="unitPlanScheme.previewUrl"
									style="
										max-height: 256px;
										object-fit: cover;
									"
								/>
								<div>{{ unitPlanScheme.label }}</div>
							</mat-radio-button>
						}
					</div>
				</mat-radio-group>
			</div>
			<div style="margin-bottom: 12px;">
				<mat-label class="title"
					>Esquema de Plan Diario Preferido</mat-label
				>
				<mat-radio-group
					formControlName="preferredClassPlanScheme"
					class="radio-group"
				>
					<div
						style="
							display: grid;
							gap: 12px;
							align-items: center;
							margin-top: 12px;
							grid-template-columns: repeat(
								auto-fill,
								minmax(150px, 1fr)
							);
						"
					>
						@for (
							classPlanScheme of classPlanSchemes;
							track classPlanScheme.value
						) {
							<mat-radio-button
								[value]="classPlanScheme.value"
								class="radio-button"
							>
								<img
									[alt]="classPlanScheme.label"
									[src]="classPlanScheme.previewUrl"
									style="
										max-height: 256px;
										object-fit: cover;
									"
								/>
								<div>{{ classPlanScheme.label }}</div>
							</mat-radio-button>
						}
					</div>
				</mat-radio-group>
			</div>
			<div style="text-align: end; padding-bottom: 42px;">
				<button
					mat-flat-button
					type="submit"
					[disabled]="settingsForm.invalid"
					color="primary"
				>
					<mat-icon>save</mat-icon>
					Guardar
				</button>
			</div>
		</form>
	`,
	styles: `
		mat-label.title {
			font-weight: bold;
		}

		.radio-group {
			display: contents;
			align-items: center;
			justify-content: center;
		}

		.radio-button {
			padding-block: 12px;
		}
	`,
})
export class SettingsComponent {
	#store = inject(Store);
	#fb = inject(FormBuilder);

	settings = this.#store.selectSignal(selectAuthUserSettings);
	unitPlanSchemes = [
		{
			value: 'unitplan1',
			label: 'Plan de Unidad v1',
			previewUrl: '/assets/unitplan1.png',
		},
		{
			value: 'unitplan2',
			label: 'Plan de Unidad v2',
			previewUrl:
				'https://firebasestorage.googleapis.com/v0/b/kit-maestro.appspot.com/o/assets%2FScreenshot%202025-11-04%20at%2009-22-31%20ESQUEMA%20DE%20PLANIFICACI%C3%93N%20POR%20UNIDAD%201.pdf.png?alt=media&token=e003b5c9-1241-48f3-b2a7-fc7eb4c1369f',
		},
		{
			value: 'unitplan3',
			label: 'Plan de Unidad Sin Tablas',
			previewUrl: '/assets/Plantilla-sin-tablas.png',
		},
	];
	classPlanSchemes = [
		{
			value: 'classplan1',
			label: 'Plan Diario v1',
			previewUrl: '/assets/classplan1.png',
		},
		// {
		// 	value: 'classplan2',
		// 	label: 'Plan Diario v2',
		// 	previewUrl:
		// 		'https://firebasestorage.googleapis.com/v0/b/kit-maestro.appspot.com/o/assets%2FScreenshot%202025-11-04%20at%2009-26-45%20ESQUEMA%20DE%20PLANIFICACI%C3%93N%20POR%20UNIDAD%201.pdf.png?alt=media&token=4ec7c38f-68a6-4451-990e-ee5667f963f6',
		// },
		// { value: 'classplan3', label: 'Plan Diario Sin Tablas', previewUrl: '//picsum.photos/seed/classplan3/512', },
	];

	templateColors = [
		{ value: '#00b0ff', label: 'Azul Claro' },
		{ value: '#ff4081', label: 'Rosado' },
		{ value: '#673ab7', label: 'Morado Intenso' },
		{ value: '#4caf50', label: 'Verde' },
		{ value: '#ff9800', label: 'Naranja' },
		{ value: '#9e9e9e', label: 'Gris' },
		{ value: '#000000', label: 'Negro' },
		{ value: '#ffffff', label: 'Blaco' },
	]

	settingsForm = this.#fb.group({
		complementaryActivitiesInClassPlans: [true],
		achievementIndicatorInClassPlans: [true],
		preferredUnitPlanScheme: ['unitplan1'],
		preferredClassPlanScheme: ['classplan1'],
		preferredTemplateColor: ['#00b0ff'],
	});

	constructor() {
		effect(() => {
			const settings = this.settings();
			if (settings) {
				const {
					complementaryActivitiesInClassPlans,
					achievementIndicatorInClassPlans,
					preferredUnitPlanScheme,
					preferredClassPlanScheme,
					preferredTemplateColor,
				} = settings;
				this.settingsForm.patchValue({
					complementaryActivitiesInClassPlans: complementaryActivitiesInClassPlans as boolean,
					achievementIndicatorInClassPlans: achievementIndicatorInClassPlans as boolean,
					preferredUnitPlanScheme: preferredUnitPlanScheme as string,
					preferredClassPlanScheme: preferredClassPlanScheme as string,
					preferredTemplateColor:
						(preferredTemplateColor as string) ?? '#00b0ff',
				});
			}
		});
	}

	onSubmit() {
		const settings = this.settingsForm.getRawValue() as {
			complementaryActivitiesInClassPlans: boolean;
			achievementIndicatorInClassPlans: boolean;
			preferredUnitPlanScheme: string;
			preferredClassPlanScheme: string;
			preferredTemplateColor: string;
		};
		this.#store.dispatch(updateProfile({ data: { settings } }));
	}
}
