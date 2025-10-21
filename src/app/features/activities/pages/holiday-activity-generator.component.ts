import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AiService } from '../../../core/services/ai.service';
import { MarkdownComponent } from 'ngx-markdown';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import {
	loadSections,
	selectAllClassSections,
} from '../../../store/class-sections';

@Component({
	selector: 'app-holiday-activity-generator',
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatSelectModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatSnackBarModule,
		MarkdownComponent,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium minSubscriptionType="Plan Basico">
			<div style="margin-top: 24px">
				<h2>Generador de Actividades para Efemérides</h2>
				<div>
					<div style="margin-top: 24px">
						<form [formGroup]="holidayForm" (ngSubmit)="onSubmit()">
							<div style="display: flex; gap: 24px;">
								<div style="width: 100%; flex: 1 1 auto;">
									<mat-form-field appearance="outline">
										<mat-label>Grado a trabajar</mat-label>
										<mat-select formControlName="section">
											@for (
												section of sections();
												track section._id
											) {
												<mat-option
													[value]="section._id"
													>{{
														section.name
													}}</mat-option
												>
											}
										</mat-select>
									</mat-form-field>
								</div>
								<div style="width: 100%; flex: 1 1 auto;">
									<mat-form-field appearance="outline">
										<mat-label
											>Lugar de la
											celebraci&oacute;n</mat-label
										>
										<mat-select formControlName="place">
											<mat-option value="en el patio"
												>El patio</mat-option
											>
											<mat-option
												value="en el acto de subir la bandera, en la mañana (10 minutos maximo)"
												>El acto cívico</mat-option
											>
											<mat-option
												value="en el salon de clases"
												>El salón de clases</mat-option
											>
										</mat-select>
									</mat-form-field>
								</div>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Efeméride a Celebrar</mat-label>
									<input
										type="text"
										formControlName="holiday"
										matInput
									/>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Detalles adicionales</mat-label>
									<textarea
										matInput
										formControlName="question"
									>
									</textarea>
								</mat-form-field>
							</div>
							<div style="display: flex; justify-content: end;">
								<button
									[disabled]="holidayForm.invalid || loading"
									mat-flat-button
									type="submit"
								>
									<mat-icon>bolt</mat-icon>
									{{ response ? 'Regenerar' : 'Generar' }}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			@if (response) {
				<div style="margin-top: 24px">
					<mat-card>
						<mat-card-content>
							<markdown [data]="response"></markdown>
						</mat-card-content>
					</mat-card>
				</div>
			}
		</app-is-premium>
	`,
	styles: 'mat-form-field {width: 100%;}',
})
export class HolidayActivityGeneratorComponent implements OnInit {
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private aiService = inject(AiService);
	#store = inject(Store);

	user = this.#store.selectSignal(selectAuthUser);
	sections = this.#store.selectSignal(selectAllClassSections);
	response = '';
	loading = true;

	holidayForm = this.fb.group({
		section: ['', Validators.required],
		place: ['', Validators.required],
		holiday: ['', Validators.required],
		question: [''],
	});

	ngOnInit() {
		this.#store.dispatch(loadSections());
		this.loading = true;
		this.#store.select(selectAllClassSections).subscribe({
			next: (sections) => {
				this.loading = false;
				if (!sections.length) {
					this.sb.open(
						'No tienes secciones todavia, crea una primero.',
						'Ok',
						{ duration: 2500 },
					);
				}
			},
			error: (err) => {
				this.loading = false;
				this.sb.open(
					'Ha ocurrido un error al cargar tus secciones.',
					'Ok',
					{ duration: 2500 },
				);
				console.log(err.message);
			},
		});
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	onSubmit() {
		const data: any = this.holidayForm.value;
		const section = this.sections().find((s) => s._id === data.section);
		const user = this.user();
		if (!section || !user) return;

		const query = `Eres un profesor innovador, dinamico y creativo. Tu tarea es planificar una actividad para commemorar una fecha especial con tus alumnos en tu escuela.
El resultado ideal es una guia practica con las instrucciones a seguir para asegurar el exito de la actividad en forma de checklist y un guion para la actividad que sera compartido con los estudiantes que participaran.
Aqui los datos que necesitas para llevar a cabo tu tarea:
Mi nombre es ${user.firstname} ${user.lastname}, soy un${user.gender === 'Hombre' ? '' : 'a'} docente de Republica Dominicana, trabajo en el centro educativo "${user.schoolName}" y tengo a mi cargo la seccion ${section.name} que es un ${this.pretify(section.year)} de ${this.pretify(section.level)} en el que imparto estas asignaturas:
- ${section.subjects.map((s) => this.pretify(s)).join('\n- ')}
La efemeride que vamos a celebrar es ${data.holiday} y la vamos a celebrar ${data.place}.
El publico objetivo de la actividad es ${data.place.includes('salon') ? 'mi curso' : 'toda la escuela'}.
Te menciono algunas ideas recurrentes (que todos los profesores dominicanos hacemos con mucha frecuencia en el centro): Exposiciones, dramatizaciones, poesias, canciones, acrosticos y pancartas/murales. Son ideas que te pueden ayudar a sugerir algo mas original pero con la misma escencia de nuestas actividades. ${data.question ? '\nNota: ' + data.question : ''}

IMPORTANTE: no me des palabras de introduccion ni de conclusion, solo necesito el contenido que te estoy solicitando. El resultado sera impreso directamente, por lo que, debe ser impersonal y no mostrar los ya conocidos signos de un chatbox`;
		this.loading = true;
		this.aiService.geminiAi(query).subscribe({
			next: (res) => {
				this.response = res.response;
				this.loading = false;
			},
			error: (err) => {
				console.log(err);
				this.sb.open(
					'Ha ocurrido un error al generar tu actividad',
					'Ok',
					{ duration: 2500 },
				);
				this.loading = false;
			},
		});
	}
}
