import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { AiService } from '../../../../core/services/ai.service';
import { UnitPlanService } from '../../../../core/services/unit-plan.service';
import { UserSettingsService } from '../../../../core/services/user-settings.service';
import { School, UserSettings } from '../../../../core/interfaces';
import { KINDER_CONTENT_BLOCKS } from '../../../../core/data/kinder-content-blocks';

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import { SchoolService } from '../../../../core/services/school.service';
import { IsPremiumComponent } from '../../../../shared/ui/is-premium.component';

interface UnitPlanInicial {
	user: string;
	grado: string;
	duracion: number;
	temaUnidad: string;
	situacionAprendizaje: string;
	cuadroAnticipacion: any;
	dominios: string[];
	planDetalladoPorDominio: any[];
	secuenciaActividades: any[];
	recursos: string[];
	metodologia: string;
	// ...otros campos que necesites
}

@Component({
	selector: 'app-unit-plan-generator-inicial',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatCardModule,
		MatStepperModule,
		CdkStepperModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		RouterModule,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium minSubscriptionType="Plan Basico">
			<mat-card>
				<mat-card-header class="header">
					<div class="header-text">
						<mat-icon class="header-icon">child_care</mat-icon>
						<h2 class="title" mat-card-title>
							Generador de Unidades para Nivel Inicial
						</h2>
					</div>
					<button
						class="title-button"
						mat-flat-button
						[routerLink]="['/unit-plans', 'list']"
						color="accent"
					>
						Ver mis Planes
					</button>
				</mat-card-header>
				<mat-card-content>
					<mat-stepper linear #stepper>
						<!-- PASO 1: DEFINICIÓN DE LA UNIDAD -->
						<mat-step [stepControl]="infoForm">
							<form [formGroup]="infoForm" class="form-container">
								<ng-template matStepLabel
									>Definición de la Unidad</ng-template
								>

								<div class="cols-2">
									<mat-form-field appearance="outline">
										<mat-label>Grado</mat-label>
										<mat-select
											formControlName="grado"
											required
										>
											@for (
												grade of gradosInicial;
												track grade
											) {
												<mat-option [value]="grade.id">{{
													grade.label
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>

									<mat-form-field appearance="outline">
										<mat-label>Unidad a Trabajar</mat-label>
										<mat-select
											formControlName="dominios"
											required
										>
											@for (
												domain of dominios;
												track domain.id
											) {
												<mat-option [value]="domain.id">{{
													domain.label
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>
								<div class="stepper-actions">
									<button
										mat-raised-button
										color="primary"
										matStepperNext
									>
										Siguiente
									</button>
								</div>
							</form>
						</mat-step>

						<!-- PASO 2: DELIMITACIÓN Y GENERACIÓN -->
						<mat-step [stepControl]="delimitacionForm">
							<form
								[formGroup]="delimitacionForm"
								class="form-container"
							>
								<ng-template matStepLabel
									>Delimitación y Generación</ng-template
								>

								<div class="cols-2">
									<mat-form-field appearance="outline">
										<mat-label>Duración</mat-label>
										<mat-select
											formControlName="duracion"
											required
										>
											@for (n of [1, 2, 3, 4]; track n) {
												<mat-option [value]="n"
													>{{ n }} Semana{{
														n > 1 ? 's' : ''
													}}</mat-option
												>
											}
										</mat-select>
									</mat-form-field>

									<mat-form-field appearance="outline">
										<mat-label>Metodología Principal</mat-label>
										<mat-select
											formControlName="metodologia"
											required
										>
											@for (
												method of metodologiasInicial;
												track method
											) {
												<mat-option [value]="method">{{
													method
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>

								<div class="resources-section">
									<mat-label>Recursos Disponibles</mat-label>
									<mat-chip-listbox
										formControlName="recursos"
										multiple
									>
										@for (
											resource of recursosDisponibles;
											track resource
										) {
											<mat-chip-option [value]="resource">{{
												resource
											}}</mat-chip-option>
										}
									</mat-chip-listbox>
								</div>

								<div class="stepper-actions generation-actions">
									<button mat-button matStepperPrevious>
										Anterior
									</button>
									<button
										[disabled]="generating"
										mat-raised-button
					matStepperNext
										color="accent"
										(click)="generateFullPlan()"
									>
										<mat-icon>auto_awesome</mat-icon>
										{{
											generating
												? 'Generando Plan'
												: planGenerado
													? 'Regenerar Plan'
													: 'Generar Plan Completo'
										}}
									</button>
								</div>
							</form>
						</mat-step>

						<!-- PASO 3: VISUALIZACIÓN DEL PLAN -->
						<mat-step>
							<ng-template matStepLabel
								>Plan de Unidad Generado</ng-template
							>

							<div
								*ngIf="!planGenerado && !generating"
								class="placeholder"
							>
								<mat-icon>history_edu</mat-icon>
								<p>
									Tu plan de unidad aparecerá aquí una vez
									generado.
								</p>
								<p>
									Vuelve al paso anterior y haz clic en "Generar
									Plan Completo".
								</p>
							</div>

							<div *ngIf="generating" class="placeholder">
								<span class="spinner large"></span>
								<p>
									Estamos creando tu plan de unidad... Esto puede
									tardar un momento.
								</p>
							</div>

							<div *ngIf="planGenerado" class="plan-display">
								<!-- Situación de Aprendizaje -->
								<section class="plan-section">
									<h3>Situación de Aprendizaje</h3>
									<h4>{{ planGenerado.tituloSituacion }}</h4>
									<p>{{ planGenerado.situacionAprendizaje }}</p>
								</section>

								<!-- Cuadro de Anticipación -->
								<section class="plan-section">
									<h3>Cuadro de Anticipación</h3>
									<div class="anticipacion-grid">
										<div class="anticipacion-col">
											<h4>¿Qué sabemos?</h4>
											<ul>
												<li
													*ngFor="
														let item of planGenerado
															.cuadroAnticipacion
															.queSabemos
													"
												>
													{{ item }}
												</li>
											</ul>
										</div>
										<div class="anticipacion-col">
											<h4>¿Qué queremos saber?</h4>
											<ul>
												<li
													*ngFor="
														let item of planGenerado
															.cuadroAnticipacion
															.queQueremosSaber
													"
												>
													{{ item }}
												</li>
											</ul>
										</div>
										<div class="anticipacion-col">
											<h4>¿Cómo lo vamos a saber?</h4>
											<ul>
												<li
													*ngFor="
														let item of planGenerado
															.cuadroAnticipacion
															.comoLoSaberemos
													"
												>
													{{ item }}
												</li>
											</ul>
										</div>
									</div>
								</section>

								<!-- Detalles por Dominio -->
								<section
									class="plan-section"
									*ngFor="
										let dominio of planGenerado.planDetalladoPorDominio
									"
								>
									<h3>
										Dominio:
										{{ getDominioLabel(dominio.dominio) }}
									</h3>
									<div class="dominio-details">
										<p>
											<strong
												>Competencia Fundamental:</strong
											>
											{{ dominio.competenciaFundamental }}
										</p>
										<p>
											<strong>Competencia Específica:</strong>
											{{ dominio.competenciaEspecifica }}
										</p>
										<h4>Contenidos:</h4>
										<ul>
											<li>
												<strong>Conceptuales:</strong>
												{{
													dominio.contenidos.conceptos.join(
														', '
													)
												}}
											</li>
											<li>
												<strong>Procedimentales:</strong>
												{{
													dominio.contenidos.procedimientos.join(
														', '
													)
												}}
											</li>
											<li>
												<strong
													>Actitudes y Valores:</strong
												>
												{{
													dominio.contenidos.actitudesValores.join(
														', '
													)
												}}
											</li>
										</ul>
										<p>
											<strong>Indicadores de Logro:</strong>
											{{
												dominio.indicadoresDeLogro.join(
													' | '
												)
											}}
										</p>
									</div>
								</section>

								<!-- Secuencia de Actividades -->
								<section class="plan-section">
									<h3>Secuencia Didáctica Sugerida</h3>
									<div
										class="actividad-card"
										*ngFor="
											let act of planGenerado.secuenciaActividades
										"
									>
										<h4>
											Semana {{ act.semana }}:
											{{ act.titulo }}
										</h4>
										<p>
											<strong>Inicio:</strong>
											{{ act.inicio }}
										</p>
										<p>
											<strong>Desarrollo:</strong>
											{{ act.desarrollo }}
										</p>
										<p>
											<strong>Cierre:</strong>
											{{ act.cierre }}
										</p>
										<p>
											<strong>Recursos:</strong>
											<mat-chip-listbox
												><mat-chip
													*ngFor="let res of act.recursos"
													>{{ res }}</mat-chip
												></mat-chip-listbox
											>
										</p>
									</div>
								</section>

								<div class="stepper-actions final-actions">
									<button mat-button matStepperPrevious>
										Atrás
									</button>
									<button
										mat-raised-button
										color="primary"
										(click)="saveDocx()"
										[disabled]="saving"
									>
										<mat-icon>save</mat-icon>
										{{
											saving ? 'Guardando...' : 'Guardar Plan'
										}}
									</button>
								</div>
							</div>
						</mat-step>
					</mat-stepper>
				</mat-card-content>
			</mat-card>
		</app-is-premium>
	`,
	styles: [
		`
			:host {
				display: block;
				padding: 1rem;
			}
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				padding-bottom: 16px;
			}
			.header-text {
				display: flex;
				align-items: center;
				gap: 12px;
			}
			.header-icon {
				font-size: 2.5rem;
				height: 2.5rem;
				width: 2.5rem;
				color: var(--mat-primary-500-color);
			}
			.title {
				margin: 0;
			}
			.title-button {
				margin-left: auto;
			}
			.form-container {
				padding-top: 16px;
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
			.cols-2 {
				display: grid;
				grid-template-columns: 1fr;
				gap: 16px;
			}
			@media (min-width: 768px) {
				.cols-2 {
					grid-template-columns: 1fr 1fr;
				}
			}
			.subsection-title {
				margin-top: 16px;
				margin-bottom: 0;
				font-weight: 500;
				color: #616161;
			}
			.stepper-actions {
				display: flex;
				justify-content: flex-end;
				gap: 8px;
				margin-top: 24px;
			}
			.generation-actions {
				justify-content: space-between;
			}
			.resources-section {
				margin-top: 16px;
			}
			.resources-section > mat-label {
				display: block;
				margin-bottom: 8px;
				font-weight: 500;
			}
			.placeholder {
				text-align: center;
				padding: 48px 24px;
				color: #757575;
				border: 2px dashed #e0e0e0;
				border-radius: 8px;
				margin-top: 24px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.placeholder mat-icon {
				font-size: 48px;
				height: 48px;
				width: 48px;
				margin-bottom: 16px;
			}
			.plan-display {
				padding-top: 16px;
			}
			.plan-section {
				background-color: #f9f9f9;
				border: 1px solid #eee;
				border-radius: 8px;
				padding: 16px;
				margin-bottom: 20px;
			}
			.plan-section h3 {
				margin-top: 0;
				border-bottom: 2px solid var(--mat-primary-200-color);
				padding-bottom: 8px;
				color: var(--mat-primary-700-color);
			}
			.plan-section h4 {
				margin-top: 0;
				font-weight: 500;
			}
			.anticipacion-grid {
				display: grid;
				grid-template-columns: 1fr;
				gap: 16px;
			}
			@media (min-width: 768px) {
				.anticipacion-grid {
					grid-template-columns: repeat(3, 1fr);
				}
			}
			.anticipacion-col h4 {
				margin-top: 0;
				margin-bottom: 8px;
				color: #424242;
			}
			.anticipacion-col ul {
				margin: 0;
				padding-left: 20px;
			}
			.dominio-details ul {
				list-style-type: none;
				padding-left: 0;
			}
			.dominio-details li {
				margin-bottom: 4px;
			}
			.actividad-card {
				background: white;
				padding: 12px;
				border-radius: 4px;
				margin-bottom: 12px;
				border-left: 4px solid var(--mat-accent-500-color);
			}
			.final-actions {
				justify-content: space-between;
			}
			/* Spinner animation */
			.spinner {
				display: inline-block;
				width: 18px;
				height: 18px;
				border: 3px solid rgba(255, 255, 255, 0.3);
				border-radius: 50%;
				border-top-color: #fff;
				animation: spin 1s ease-in-out infinite;
				margin-right: 8px;
				vertical-align: middle;
			}
			.spinner.large {
				width: 40px;
				height: 40px;
				border: 4px solid rgba(0, 0, 0, 0.1);
				border-top-color: var(--mat-primary-500-color);
			}
			@keyframes spin {
				to {
					transform: rotate(360deg);
				}
			}
		`,
	],
})
export class KindergartenUnitPlanGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private router = inject(Router);
	private aiService = inject(AiService);
	private unitPlanService = inject(UnitPlanService);
  private schoolService = inject(SchoolService);
	private userSettingsService = inject(UserSettingsService);

	userSettings: UserSettings | null = null;
  userSchool: School | null = null;
	generating = false;
	saving = false;
	planGenerado: any = null;

	gradosInicial = [
		{ id: 'PRE_KINDER', label: 'Pre-Kínder (3 años)' },
		{ id: 'KINDER', label: 'Kínder (4 años)' },
		{ id: 'PRE_PRIMARIA', label: 'Pre-Primario (5 años)' },
	];

	blocks = KINDER_CONTENT_BLOCKS;

  get dominios(): { id: string, label: string }[] {
    return KINDER_CONTENT_BLOCKS.filter(block => block.year == this.infoForm.value.grado).map((block, i) => ({ id: block.concepts[0], label: `${i + 1}. ` + block.concepts.map(c => c.endsWith(':') ? c : c.endsWith('.') ? c.replace(/.$/, ',') : c + ',').join(' ').replace(/.$/, '.') }) )
  }

	metodologiasInicial = [
		'Aprendizaje Basado en Proyectos',
		'Juego-Trabajo (Zonas o Rincones)',
		'Centros de Interés',
		'Aprendizaje Basado en el Juego',
	];

	recursosDisponibles = [
		'Crayones y marcadores',
		'Papel de construcción',
		'Tijeras y pegamento',
		'Plastilina o masilla',
		'Bloques de construcción',
		'Libros y cuentos',
		'Instrumentos musicales',
		'Patio de juegos',
		'Recursos naturales (hojas, piedras)',
		'Dispositivos digitales (tablet/TV)',
		'Material reciclado',
	];

	infoForm = this.fb.group({
    grado: ['PRE_KINDER', Validators.required],
		dominios: ['', Validators.required],
		realidad: [''],
	});

	delimitacionForm = this.fb.group({
		duracion: [2, Validators.required],
		metodologia: ['Aprendizaje Basado en el Juego', Validators.required],
		recursos: new FormControl<string[]>([
			'Crayones y marcadores',
			'Papel de construcción',
			'Libros y cuentos',
			'Patio de juegos',
		]),
	});

	ngOnInit(): void {
		this.userSettingsService.getSettings().subscribe((settings) => {
			this.userSettings = settings;
      this.schoolService.findAll({ user: settings._id }).subscribe(schools => {
        this.userSchool = schools[0]
      });
		});
	}

	getDominioLabel(id: string): string {
		return (
			this.dominios.find((d) =>
				d.id.includes(id.toLowerCase().substring(10)),
			)?.label || id
		);
	}

	generateFullPlan() {
		if (this.infoForm.invalid || this.delimitacionForm.invalid) {
			this.sb.open(
				'Por favor, completa todos los campos requeridos en los primeros dos pasos.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}

		this.generating = true;
		this.planGenerado = null;

		const info = this.infoForm.value;
		const delimitacion = this.delimitacionForm.value;

		const gradoLabel =
			this.gradosInicial.find((g) => g.id === info.grado)?.label ||
			info.grado;
    const domainName: string = {
      socioemocional: 'Dominio Socioemocional',
      artistico_creativo: 'Dominio Artístico y Creativo',
      fisico_salud: 'Dominio Psicomotor y de Salud',
      conocimiento_mundo: 'Dominio Descubrimiento del mundo',
      cognitivo: 'Dominio Cognitivo',
      comunicativo: 'Dominio Comunicativo',
    }[info.dominios as string] as string;
		const dominiosLabels: string = this.blocks
      .filter((block) => block.year === info.grado && block.concepts[0] === info.dominios)
      .map(b => `\nDominio a Trabajar: ${domainName}\nCompetencias Especificas:\n- ${b.competence.comunicativa}\n- ${b.competence.etica_y_ciudadana}\n- ${b.competence.pensamiento_logico}.\nContenidos Conceptuales:\n- ${b.concepts.join('\n- ')}\nContenidos Procedimientales: \n- ${b.procedures.join('\n- ')}\nContenidos Actitudinales:\n- ${b.attitudes.join('\n- ')}\nIndicadores de Logro:\n- ${b.achievementIndicators.join('\n- ')}`).join('; ');
		if (!gradoLabel) return;

		const prompt = this.createGenerationPrompt(
			info,
			delimitacion,
			gradoLabel,
			dominiosLabels,
		);

		this.aiService.geminiAi(prompt).subscribe({
			next: (response) => {
				try {
					const answer = response.response;
					const jsonStart = answer.indexOf('{');
					const jsonEnd = answer.lastIndexOf('}') + 1;
					const jsonString = answer.slice(jsonStart, jsonEnd);
					this.planGenerado = JSON.parse(jsonString);
					this.sb.open('¡Tu plan de unidad ha sido generado!', 'Ok', {
						duration: 3000,
					});
				} catch (error) {
					console.error('Error al parsear la respuesta JSON:', error);
					this.sb.open(
						'Hubo un error al procesar la respuesta. Inténtalo de nuevo.',
						'Error',
						{ duration: 5000 },
					);
				} finally {
					this.generating = false;
				}
			},
			error: (err) => {
				console.error('Error en la llamada a la IA:', err);
				this.sb.open(
					'Hubo un error generando el plan. Por favor, intenta de nuevo.',
					'Error',
					{ duration: 5000 },
				);
				this.generating = false;
			},
		});
	}

	createGenerationPrompt(
		info: any,
		delimitacion: any,
		gradoLabel: string,
		dominiosLabels: string | undefined,
	): string {
		return `Eres un experto pedagogo dominicano, especialista en el currículo del Nivel Inicial (adecuación 2023).
Tu tarea es generar un plan de unidad completo para el Nivel Inicial.

**Información de entrada:**
- Grado: ${gradoLabel}
- Tema de la Unidad: A tu criterio, basado en la realidad dominicana y los intereses típicos de niños de este grado y edad.
- Realidad o interés del grupo: A tu criterio, basado en la realidad dominicana y los intereses típicos de niños de este grado y edad, en coherencia con el tema de la unidad.
- Contenidos y Dominios a integrar: ${dominiosLabels}
- Duración: ${delimitacion.duracion} semanas
- Metodología Principal: ${delimitacion.metodologia}
- Recursos Disponibles: ${delimitacion.recursos?.join(', ')}

**Instrucciones:**
1.  Crea una situación de aprendizaje narrativa y motivadora basada en el tema y la realidad del grupo.
2.  Completa un "Cuadro de Anticipación" con posibles respuestas de los niños.
3.  Diseña una secuencia didáctica diaria, con actividades de inicio, desarrollo y cierre, y los recursos necesarios para cada dia, dos planificaciones por dia, es decir que deben haber exactamente ${delimitacion.duracion * 5 * 2} planes en la secuencia.
4.  La respuesta DEBE ser un único objeto JSON válido, sin texto adicional antes o después.

**Formato de salida JSON requerido (ejemplo de estructura):**
{
  "tituloSituacion": "string",
  "temaUnidad": "string",
  "situacionAprendizaje": "string",
  "cuadroAnticipacion": {
    "queSabemos": ["string"],
    "queQueremosSaber": ["string"],
    "comoLoSaberemos": ["string"]
  },
  "planDetalladoPorDominio": [
      {
          "dominio": "string (nombre del dominio)",
          "competenciaFundamental": "string",
          "competenciaEspecifica": "string",
          "contenidos": {
          "conceptos": ["string"],
          "procedimientos": ["string"],
          "actitudesValores": ["string"]
        },
        "indicadoresDeLogro": ["string"]
      }
    ],
    "secuenciaActividades": [
      {
        "semana": "number",
        "titulo": "string",
        "inicio": "string",
        "desarrollo": "string",
        "cierre": "string",
        "recursos": ["string"]
      }
    ]
  }

  Genera el plan ahora.
`;
	}

	savePlanInicial() {
		if (!this.planGenerado || !this.userSettings) {
			this.sb.open(
				'No hay un plan generado para guardar o falta información del usuario.',
				'Error',
				{ duration: 3000 },
			);
			return;
		}

		this.saving = true;

		const plan: UnitPlanInicial = {
			user: this.userSettings._id,
			grado: this.infoForm.value.grado || '',
			temaUnidad: this.planGenerado.temaUnidad || '',
			duracion: this.delimitacionForm.value.duracion || 2,
			metodologia: this.delimitacionForm.value.metodologia || '',
			recursos: this.delimitacionForm.value.recursos || [],
			situacionAprendizaje: this.planGenerado.situacionAprendizaje,
			cuadroAnticipacion: this.planGenerado.cuadroAnticipacion,
			dominios: [],
			planDetalladoPorDominio: this.planGenerado.planDetalladoPorDominio,
			secuenciaActividades: this.planGenerado.secuenciaActividades,
		};

		this.unitPlanService.create(plan).subscribe({
			next: (savedPlan) => {
				this.sb.open('¡Plan de unidad guardado con éxito!', 'Ok', {
					duration: 3000,
				});
				this.router.navigate(['/unit-plans', savedPlan._id]); // Navegar al plan guardado
			},
			error: (err) => {
				console.error('Error al guardar el plan:', err);
				this.sb.open(
					'No se pudo guardar el plan. Intenta de nuevo.',
					'Error',
					{ duration: 5000 },
				);
				this.saving = false;
			},
			complete: () => {
				this.saving = false;
			},
		});
	}

  public async saveDocx(): Promise<void> {
    if (!this.planGenerado || !this.userSettings || !this.userSchool) {
      console.error('Faltan datos para generar el documento.');
      return;
    }

    const doc = new Document({
      sections: [
        {
          children: [
            ...this.createHeader(),
            new Paragraph({ text: '' }), // Espacio
            ...this.createSituacionAprendizaje(),
            new Paragraph({ text: '' }),
            ...this.createCuadroAnticipacion(),
            new Paragraph({ text: '' }),
            ...this.createPlanDetallado(),
            new Paragraph({ text: '' }),
            ...this.createSecuenciaActividades(),
          ],
        },
      ],
    });

    // Usa Packer para generar el blob y file-saver para descargarlo
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Planificación - ${this.planGenerado.temaUnidad}.docx`);
      console.log('Documento creado y descargado exitosamente.');
    });
  }

  /**
   * Calcula el año escolar actual.
   */
  private getAnoEscolar(): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() es 0-indexado

    if (currentMonth > 7) { // Después de Julio
      return `${currentYear} - ${currentYear + 1}`;
    } else { // Antes o en Julio
      return `${currentYear - 1} - ${currentYear}`;
    }
  }

  /**
   * Crea el encabezado del documento con información del centro y docente.
   */
  private createHeader(): (Paragraph | Table)[] {
    const gradoLabel = this.gradosInicial.find((g) => g.id === this.infoForm.value.grado)?.label || 'No especificado';
    const anoEscolar = this.getAnoEscolar();

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Centro Educativo:", bold: true }), new TextRun(` ${this.userSchool?.name}`)] })], width: { size: 50, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Docente:", bold: true }), new TextRun(` ${this.userSettings?.firstname} ${this.userSettings?.lastname}`)] })], width: { size: 50, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Grado:", bold: true }), new TextRun(` ${gradoLabel}`)] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tanda:", bold: true }), new TextRun(` ${this.userSchool?.journey}`)] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tema de la Unidad:", bold: true }), new TextRun(` ${this.planGenerado.temaUnidad}`)] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Año Escolar:", bold: true }), new TextRun(` ${anoEscolar}`)] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
          ],
        }),
      ],
    });

    return [
      new Paragraph({ text: 'ESQUEMA DE PLANIFICACIÓN DE UNIDAD DE APRENDIZAJE', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: `Distrito Educativo ${this.userSchool?.district}`, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: '' }),
      table
    ];
  }

  /**
   * Crea la sección "Situación de Aprendizaje".
   */
  private createSituacionAprendizaje(): Paragraph[] {
    return [
      new Paragraph({ text: 'I. Situación de Aprendizaje', heading: HeadingLevel.HEADING_2 }),
      new Paragraph({
        children: [new TextRun({ text: this.planGenerado.tituloSituacion, bold: true })],
      }),
      new Paragraph({
        text: this.planGenerado.situacionAprendizaje,
        alignment: AlignmentType.JUSTIFIED,
      }),
    ];
  }

  /**
   * Crea la tabla del "Cuadro de Anticipación".
   */
  private createCuadroAnticipacion(): (Paragraph | Table)[] {
    const { queSabemos, queQueremosSaber, comoLoSaberemos } = this.planGenerado.cuadroAnticipacion;

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Fila de Encabezados
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '¿Qué sabemos?', alignment: AlignmentType.CENTER, children: [new TextRun({ bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ text: '¿Qué queremos saber?', alignment: AlignmentType.CENTER, children: [new TextRun({ bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ text: '¿Cómo lo saberemos?', alignment: AlignmentType.CENTER, children: [new TextRun({ bold: true })] })] }),
          ],
          tableHeader: true,
        }),
        // Fila de Contenido
        new TableRow({
          children: [
            new TableCell({ children: queSabemos.map((item: string) => new Paragraph({ text: item, bullet: { level: 0 } })) }),
            new TableCell({ children: queQueremosSaber.map((item: string) => new Paragraph({ text: item, bullet: { level: 0 } })) }),
            new TableCell({ children: comoLoSaberemos.map((item: string) => new Paragraph({ text: item, bullet: { level: 0 } })) }),
          ],
        }),
      ],
    });

    return [
      new Paragraph({ text: 'II. Cuadro de Anticipación', heading: HeadingLevel.HEADING_2 }),
      table
    ];
  }

  /**
   * Crea la sección del plan detallado por dominio.
   */
  private createPlanDetallado(): Paragraph[] {
    const children: Paragraph[] = [
      new Paragraph({ text: 'III. Plan Detallado por Dominio', heading: HeadingLevel.HEADING_2 }),
    ];

    this.planGenerado.planDetalladoPorDominio.forEach((plan: any) => {
      children.push(new Paragraph({ text: `Dominio: ${plan.dominio}`, heading: HeadingLevel.HEADING_3 }));
      children.push(this.createLabeledParagraph('Competencia Fundamental:', plan.competenciaFundamental));
      children.push(this.createLabeledParagraph('Competencia Específica:', plan.competenciaEspecifica));

      children.push(new Paragraph({ children: [new TextRun({ text: 'Indicadores de Logro:', bold: true })] }));
      plan.indicadoresDeLogro.forEach((item: any) => children.push(new Paragraph({ text: item, bullet: { level: 0 } })));

      children.push(new Paragraph({ children: [new TextRun({ text: 'Contenidos', bold: true })] }));

      children.push(new Paragraph({ children: [new TextRun({ text: 'Conceptos:', italics: true })], }));
      plan.contenidos.conceptos.forEach((item: any) => children.push(new Paragraph({ text: item, bullet: { level: 1 } })));

      children.push(new Paragraph({ children: [new TextRun({ text: 'Procedimientos:', italics: true })], }));
      plan.contenidos.procedimientos.forEach((item: any) => children.push(new Paragraph({ text: item, bullet: { level: 1 } })));

      children.push(new Paragraph({ children: [new TextRun({ text: 'Actitudes y Valores:', italics: true })], }));
      plan.contenidos.actitudesValores.forEach((item: any) => children.push(new Paragraph({ text: item, bullet: { level: 1 } })));

      children.push(new Paragraph({ text: '' })); // Espacio entre dominios
    });

    return children;
  }

  /**
   * Crea la sección de la secuencia de actividades.
   */
  private createSecuenciaActividades(): Paragraph[] {
    const children: Paragraph[] = [
      new Paragraph({ text: 'IV. Secuencia de Actividades', heading: HeadingLevel.HEADING_2 }),
    ];

    this.planGenerado.secuenciaActividades.forEach((act: any) => {
      children.push(new Paragraph({ text: `Semana ${act.semana}: ${act.titulo}`, heading: HeadingLevel.HEADING_3 }));
      children.push(this.createLabeledParagraph('Inicio:', act.inicio));
      children.push(this.createLabeledParagraph('Desarrollo:', act.desarrollo));
      children.push(this.createLabeledParagraph('Cierre:', act.cierre));

      children.push(new Paragraph({ children: [new TextRun({ text: 'Recursos:', bold: true })] }));
      act.recursos.forEach((item: any) => children.push(new Paragraph({ text: item, bullet: { level: 0 } })));

      children.push(new Paragraph({ text: '' })); // Espacio entre semanas
    });

    return children;
  }

  /**
   * Helper para crear un párrafo con una etiqueta en negrita.
   */
  private createLabeledParagraph(label: string, text: string): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({ text: label, bold: true }),
        new TextRun({ text: ` ${text}` }),
      ],
    });
  }
}
