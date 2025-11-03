import { Component, inject, output, OnDestroy, signal, OnInit } from '@angular/core';
import {
	ReactiveFormsModule,
	FormBuilder,
	Validators,
	FormArray,
	FormGroup,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

import { createSequencePlan, DidacticPlanDto } from '../../../store';
import { selectIsCreatingSequencePlan } from '../../../store/didactic-sequence-plans/didactic-sequence-plans.selectors';
import { selectCurrentSequence } from '../../../store/didactic-sequences/didactic-sequences.selectors';

@Component({
	selector: 'app-didactic-sequence-plan-form',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatInputModule,
		MatExpansionModule,
	],
	template: `
		<div>
			<div>
				<h2>Crear Plan Didáctico</h2>
			</div>

			<div>
				<form [formGroup]="form" (ngSubmit)="onSubmit()">
					<div class="form-content">
						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Título del Plan</mat-label>
							<input matInput formControlName="title" required />
							<mat-error>Este campo es requerido</mat-error>
						</mat-form-field>

						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Descripción</mat-label>
							<textarea
								matInput
								formControlName="description"
								rows="3"
								required
							></textarea>
							<mat-error>Este campo es requerido</mat-error>
						</mat-form-field>

						<h3>Competencias Específicas</h3>
						<div formArrayName="specificCompetencies">
							@for (
								competence of specificCompetencies.controls;
								track competence;
								let i = $index
							) {
								<div
									[formGroup]="competence"
									class="competence-form"
								>
									<mat-form-field appearance="outline">
										<mat-label
											>Nombre de la Competencia</mat-label
										>
										<input
											matInput
											formControlName="name"
											required
										/>
										<mat-error
											>Este campo es requerido</mat-error
										>
									</mat-form-field>

									<mat-form-field
										appearance="outline"
										class="full-width"
									>
										<mat-label>Descripción</mat-label>
										<input
											matInput
											formControlName="description"
											required
										/>
										<mat-error
											>Este campo es requerido</mat-error
										>
									</mat-form-field>

									<button
										mat-icon-button
										color="warn"
										type="button"
										(click)="removeCompetence(i)"
									>
										<mat-icon>delete</mat-icon>
									</button>
								</div>
							}
						</div>

						<button
							mat-button
							type="button"
							(click)="addCompetence()"
						>
							<mat-icon>add</mat-icon>
							Agregar Competencia
						</button>
					</div>

					<div class="form-actions">
						<button
							mat-flat-button
							color="primary"
							type="submit"
							[disabled]="form.invalid || isCreating()"
						>
							@if (isCreating()) {
								<mat-spinner
									diameter="20"
									class="button-spinner"
								></mat-spinner>
							}
							Crear Plan
						</button>
					</div>
				</form>
			</div>
		</div>
	`,
	styles: `
		.form-content {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.full-width {
			width: 100%;
		}

		.competence-form {
			display: flex;
			gap: 16px;
			align-items: start;
			padding: 16px;
			border-bottom: 1px solid #e0e0e0;
			border-radius: 4px;
			margin-bottom: 8px;
		}

		.block-form,
		.activity-form {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.session-form,
		.activity-form {
			padding: 16px;
			border: 1px solid #e0e0e0;
			border-radius: 4px;
		}

		.session-details,
		.activity-details {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 16px;
		}

		.form-actions {
			display: flex;
			justify-content: flex-end;
			margin-top: 24px;
			padding-top: 16px;
			border-top: 1px solid #e0e0e0;
		}

		.button-spinner {
			display: inline-block;
			margin-right: 8px;
		}

		mat-expansion-panel {
			margin-bottom: 8px;
		}

		h3,
		h4 {
			margin: 16px 0 8px 0;
			color: rgba(0, 0, 0, 0.87);
		}
	`,
})
export class DidacticPlanFormComponent implements OnInit, OnDestroy {
	#fb = inject(FormBuilder);
	#store = inject(Store);
	#snackBar = inject(MatSnackBar);
	#destroy$ = new Subject<void>();

	sequence = this.#store.selectSignal(selectCurrentSequence);
	planCreated = output<void>();

	isCreating = this.#store.selectSignal(selectIsCreatingSequencePlan);

	form = this.#fb.group({
		didacticSequence: ['', Validators.required],
		title: ['', Validators.required],
		description: ['', Validators.required],
		specificCompetencies: this.#fb.array([]),
	});

	get specificCompetencies() {
		return this.form.get('specificCompetencies') as FormArray<FormGroup>;
	}

	ngOnInit(): void {
		this.#store.select(selectCurrentSequence).pipe(
			takeUntil(this.#destroy$),
			tap((sequence) => {
				if (sequence) {
					this.form.get('didacticSequence')?.setValue(sequence._id);
				}
			})
		).subscribe();
	}

	addCompetence() {
		const competenceGroup = this.#fb.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
		});
		this.specificCompetencies.push(competenceGroup);
	}

	removeCompetence(index: number) {
		this.specificCompetencies.removeAt(index);
	}

	onSubmit() {
		if (this.form.valid) {
			const formData = this.form.getRawValue() as any;
			const planData: DidacticPlanDto = {
				...formData,
				didacticSequence: this.sequence()?._id,
			};

			this.#store.dispatch(createSequencePlan({ plan: planData }));
			this.form.patchValue({
				title: '',
				description: '',
			});
			this.specificCompetencies.clear();
			this.planCreated.emit();
		} else {
			this.#snackBar.open(
				'Por favor, complete todos los campos requeridos',
				'Cerrar',
				{
					duration: 5000,
				},
			);
		}
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}
}
