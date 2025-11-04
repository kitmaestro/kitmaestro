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
					>Esquema de Plan de Unidad Preferido</mat-label
				>
				<mat-radio-group formControlName="preferredUnitPlanScheme">
					<div
						style="display: grid; gap: 12px; align-items: center; margin-top: 12px; grid-template-columns: 1fr;"
					>
						@for (
							unitPlanScheme of unitPlanSchemes;
							track unitPlanScheme.value
						) {
							<div>
								<mat-radio-button
									[value]="unitPlanScheme.value"
								>
									<img
										[alt]="unitPlanScheme.label"
										[src]="unitPlanScheme.previewUrl"
										style="max-height: 512px; object-fit: cover;"
									/>
									<div>{{ unitPlanScheme.label }}</div>
								</mat-radio-button>
							</div>
						}
					</div>
				</mat-radio-group>
			</div>
			<div style="margin-bottom: 12px;">
				<mat-label class="title"
					>Esquema de Plan Diario Preferido</mat-label
				>
				<mat-radio-group formControlName="preferredClassPlanScheme">
					<div
						style="display: grid; gap: 12px; align-items: center; margin-top: 12px; grid-template-columns: 1fr;"
					>
						@for (
							classPlanScheme of classPlanSchemes;
							track classPlanScheme.value
						) {
							<div>
								<mat-radio-button
									[value]="classPlanScheme.value"
								>
									<img
										[alt]="classPlanScheme.label"
										[src]="classPlanScheme.previewUrl"
										style="max-height: 512px; object-fit: cover;"
									/>
									<div>{{ classPlanScheme.label }}</div>
								</mat-radio-button>
							</div>
						}
					</div>
				</mat-radio-group>
			</div>
			<div style="text-align: end">
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
			previewUrl: '//picsum.photos/seed/unitplan1/512',
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
			previewUrl: '//picsum.photos/seed/unitplan3/512',
		},
	];
	classPlanSchemes = [
		{
			value: 'classplan1',
			label: 'Plan Diario v1',
			previewUrl: '//picsum.photos/seed/classplan1/512',
		},
		{
			value: 'classplan2',
			label: 'Plan Diario v2',
			previewUrl:
				'https://firebasestorage.googleapis.com/v0/b/kit-maestro.appspot.com/o/assets%2FScreenshot%202025-11-04%20at%2009-26-45%20ESQUEMA%20DE%20PLANIFICACI%C3%93N%20POR%20UNIDAD%201.pdf.png?alt=media&token=4ec7c38f-68a6-4451-990e-ee5667f963f6',
		},
		{
			value: 'classplan3',
			label: 'Plan Diario Sin Tablas',
			previewUrl: '//picsum.photos/seed/classplan3/512',
		},
	];

	settingsForm = this.#fb.group({
		complementaryActivitiesInClassPlans: [true],
		achievementIndicatorInClassPlans: [true],
		preferredUnitPlanScheme: ['unitplan1'],
		preferredClassPlanScheme: ['classplan1'],
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
				} = settings;
				this.settingsForm.patchValue({
					complementaryActivitiesInClassPlans:
						complementaryActivitiesInClassPlans as boolean,
					achievementIndicatorInClassPlans:
						achievementIndicatorInClassPlans as boolean,
					preferredUnitPlanScheme: preferredUnitPlanScheme as string,
					preferredClassPlanScheme:
						preferredClassPlanScheme as string,
				});
			}
		});
	}

	onSubmit() {
		const settings: {
			complementaryActivitiesInClassPlans: boolean;
			achievementIndicatorInClassPlans: boolean;
			preferredUnitPlanScheme: string;
			preferredClassPlanScheme: string;
		} = this.settingsForm.getRawValue() as {
			complementaryActivitiesInClassPlans: boolean;
			achievementIndicatorInClassPlans: boolean;
			preferredUnitPlanScheme: string;
			preferredClassPlanScheme: string;
		};
		this.#store.dispatch(updateProfile({ data: { settings } }));
	}
}
