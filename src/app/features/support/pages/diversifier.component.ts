import { Component, computed, inject, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../../core/services/ai.service';
import { MarkdownComponent } from 'ngx-markdown';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Store } from '@ngrx/store';
import { TestService } from '../../../core/services/test.service';
import { Test } from '../../../core';
import {
	selectAllClassSections,
	selectCurrentSection,
	selectAuthUser,
	loadSections,
	loadSectionSuccess,
} from '../../../store';

@Component({
	selector: 'app-diversifier',
	imports: [
		PretifyPipe,
		MatIconModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MarkdownComponent,
		MatSnackBarModule,
		MatFormFieldModule,
		ReactiveFormsModule,
	],
	template: `
		<div>
			<div>
				<h2>Diversificador de Contenidos</h2>
			</div>
			<div>
				<div style="margin-top: 12px">
					<form [formGroup]="diversityForm" (ngSubmit)="onSubmit()">
						<div class="grid">
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Grado</mat-label>
									<mat-select
										formControlName="section"
										(selectionChange)="
											onSectionSelect($event)
										"
									>
										@for (
											section of sections();
											track section._id
										) {
											<mat-option [value]="section._id">{{
												section.name
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Asignatura</mat-label>
									<mat-select formControlName="subject">
										@for (
											subject of subjects();
											track subject
										) {
											<mat-option
												[value]="subject | pretify"
												>{{
													subject | pretify
												}}</mat-option
											>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Condici&oacute;n</mat-label>
									<mat-select formControlName="condition">
										@for (
											condition of conditions;
											track condition
										) {
											<mat-option [value]="condition">{{
												condition
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label
										>Descripci&oacute;n del tema o la
										Actividad a realizar</mat-label
									>
									<input
										type="text"
										matInput
										formControlName="topic"
									/>
								</mat-form-field>
							</div>
						</div>
						<div
							style="
								display: flex;
								gap: 12px;
								flex-direction: row-reverse;
							"
						>
							<button
								mat-button
								[disabled]="loading || diversityForm.invalid"
								type="submit"
							>
								<mat-icon>bolt</mat-icon>
								{{
									loading
										? 'Generando...'
										: generated
											? 'Regenerar'
											: 'Generar'
								}}
							</button>
							<button
								mat-flat-button
								[disabled]="!generated"
								type="button"
								(click)="download()"
							>
								<mat-icon>download</mat-icon> Descargar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		@if (generated) {
			<div style="margin-top: 24px; padding-bottom: 24px;">
				<div>
					<markdown [data]="generated"></markdown>
				</div>
			</div>
		}
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 12px;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}
		}
	`,
})
export class DiversifierComponent implements OnInit {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private aiService = inject(AiService);
	#store = inject(Store);
	private testService = inject(TestService);

	loading = false;
	conditions: string[] = [
		'Discapacidad visual',
		'Discapacidad auditiva',
		'Trastorno del espectro autista (TEA)',
		'Trastorno por déficit de atención e hiperactividad (TDAH)',
		'Dislexia',
		'Discalculia',
		'Disgrafía',
		'Trastorno específico del lenguaje (TEL)',
		'Trastorno de ansiedad',
		'Trastorno depresivo',
		'Trastorno bipolar',
		'Esquizofrenia',
		'Síndrome de Down',
		'Parálisis cerebral',
		'Trastorno de procesamiento sensorial',
		'Trastorno de la coordinación motora',
		'Trastorno de aprendizaje no verbal',
		'Altas capacidades intelectuales',
		'Enfermedad crónica (diabetes, asma, epilepsia, etc.)',
		'Trauma o abuso',
	];
	sections = this.#store.selectSignal(selectAllClassSections);
	section = this.#store.selectSignal(selectCurrentSection);
	subjects = computed<string[]>(() => {
		const section = this.section();
		return section ? section.subjects : [];
	});
	user = this.#store.selectSignal(selectAuthUser);

	generated = '';

	diversityForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		topic: ['', [Validators.required, Validators.minLength(4)]],
		condition: ['', Validators.required],
	});

	load() {
		this.#store.dispatch(loadSections());
	}

	onSectionSelect(event: any) {
		const section = this.sections()?.find((s) => s._id === event.value);
		if (section) this.#store.dispatch(loadSectionSuccess({ section }));
	}

	ngOnInit() {
		this.load();
	}

	onSubmit() {
		const data: any = this.diversityForm.value;
		const section = this.section();
		const user = this.user();
		if (!section || !user) return;

		this.loading = true;
		const query = `Eres ${user.gender === 'Hombre' ? 'un profesor especializado' : 'una profesora especializada'} en la atencion a la diversidad en el aula y tu tarea es asesorarme para obtener los mejores resultados posibles gastando la menor cantidad de energia posible, es decir, ayudarme a ser tan eficiente como sea posible manteniendo o mejorando mi nivel de efectividad en la eseñanza.
A continuación te presento mi situación particular en estos momentos.
Mi nombre es ${user.firstname}, ${user.gender === 'Hombre' ? 'un maestro' : 'una maestra'} que trabaja en ${section.year.toLowerCase()} grado de ${section.level.toLowerCase()} en el centro educativo ${user.schoolName}.
En esta ocación he planificado una clase de ${data.subject} en la que voy a trabajar o a abordar ${data.topic} en mi curso, pero tengo una situación con un estudiante y quiero adaptarla a su condición que es ${data.condition}.
Tu trabajo sera guiarme en el proceso de adaptación y sugerirme las estrategias mas adecuadas.

Importante: NO SUGIERAS QUE PUEDO PREGUNTAR YA QUE ESTO NO ME ES POSIBLE Y RESPONDE EN FORMATO MARKDOWN SIN TABLAS NI EMOTICONES.
No saludes ni te despidas, tu respuesta sera impresa directamente, asi que solo quiero tus recomendaciones en un tono profesional y cercano sin llegar a sonar muy confianzudo, hablando en tercera persona (como si estuvieras hablando de otra persona, por ejemplo, "se realizara la actividad de X de manera individual con los estudiantes...") y siempre en futuro.
`;
		this.aiService.geminiAi(query).subscribe({
			next: (res) => {
				this.generated = res.response;
				this.loading = false;
			},
			error: (err) => {
				console.log(err.message);
				this.loading = false;
				this.sb.open(
					'Ha ocurrido un error al generar la adaptacion. Intentalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}

	async download() {
		const data: any = this.diversityForm.value;
		const section = this.section();
		const user = this.user();
		if (!section || !user) return;

		this.loading = true;
		const text: Test = {
			body: this.generated,
			section,
			subject: data.subject,
			user,
		} as any;
		await this.testService.download(text);
		this.loading = false;
	}
}
