import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ScoreSystemService } from '../../../core/services/score-system.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { AiService } from '../../../core/services/ai.service';
import { UserService } from '../../../core/services/user.service';
import { SubjectConceptListService } from '../../../core/services/subject-concept-list.service';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { ClassSection } from '../../../core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { TEACHING_METHODS } from '../../../core/data/teaching-methods';
import { ContentBlock } from '../../../core';
import { CompetenceService } from '../../../core/services/competence.service';
import { zip } from 'rxjs';
import { CompetenceEntry } from '../../../core';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../../../core';
import { ScoreSystemComponent } from '../components/score-system.component';
import { User } from '../../../core';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

@Component({
	selector: 'app-score-system-generator',
	imports: [
		MatSnackBarModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		RouterLink,
		PretifyPipe,
		ScoreSystemComponent,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<mat-card>
				<mat-card-header>
					<h2 mat-card-title>Generador de Sistemas de Calificaci&oacute;n</h2>
					<a
						mat-raised-button
						color="accent"
						style="margin-left: auto"
						[routerLink]="['/grading-systems', 'list']"
						>Mis Sistemas</a
					>
				</mat-card-header>
				<mat-card-content>
					<div style="margin-top: 24px">
						<form [formGroup]="form" (ngSubmit)="onSubmit()">
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Secci&oacute;n</mat-label>
									<mat-select
										formControlName="section"
										(selectionChange)="onSectionChange($event)"
									>
										@for (section of sections; track section._id) {
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
									<mat-select
										formControlName="subject"
										(selectionChange)="onSubjectChange($event)"
									>
										@if (form.get("section")?.value) {
											@for (subject of subjects; track subject) {
												<mat-option [value]="subject">{{
													subject | pretify
												}}</mat-option>
											}
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Contenido</mat-label>
									<mat-select
										formControlName="content"
										multiple
										(selectionChange)="onConceptChange($event)"
									>
										@if (
											form.get("section")?.value &&
											form.get("subject")?.value
										) {
											@for (content of contents; track content) {
												<mat-option [value]="content">{{
													content
												}}</mat-option>
											}
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Estilo de Ense&ntilde;anza</mat-label>
									<mat-select formControlName="style">
										@for (style of styles; track style.name) {
											<mat-option [value]="style.name">{{
												style.name
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div style="text-align: end">
								<button
									[disabled]="form.invalid || generating || saving"
									mat-raised-button
									color="{{ scoreSystem ? 'accent' : 'primary' }}"
									type="submit"
								>
									{{
										generating
											? "Generando..."
											: scoreSystem
												? "Regenerar"
												: "Generar"
									}}
								</button>
								@if (scoreSystem) {
									<button
										[disabled]="saving || generating"
										type="button"
										mat-raised-button
										color="primary"
										(click)="saveSystem()"
										style="margin-left: 12px"
									>
										Guardar
									</button>
								}
							</div>
						</form>
					</div>
				</mat-card-content>
			</mat-card>

			@if (scoreSystem) {
				<app-score-system
					[scoreSystem]="scoreSystem"
					[section]="section"
					[contentBlock]="contentBlock"
					[user]="user"
				/>
			}
		</app-is-premium>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}

		table {
			border-collapse: collapse;
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}
	`,
})
export class ScoreSystemGeneratorComponent implements OnInit {
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private scoreService = inject(ScoreSystemService);
	private sectionService = inject(ClassSectionService);
	private contentBlockService = inject(ContentBlockService);
	private contentService = inject(SubjectConceptListService);
	private competenceService = inject(CompetenceService);
	private UserService = inject(UserService);
	private aiService = inject(AiService);
	private router = inject(Router);
	user: User | null = null;
	sections: ClassSection[] = [];
	section: ClassSection | null = null;
	subjects: string[] = [];
	contents: string[] = [];
	contentBlocks: ContentBlock[] = [];
	contentBlock: ContentBlock[] = [];
	competence: CompetenceEntry[] = [];
	styles = TEACHING_METHODS;
	generating = false;
	saving = false;
	scoreSystem: ScoreSystem | null = null;
	grouped: GroupedGradingActivity[] = [];

	form = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		content: [[] as string[], Validators.required],
		style: ['Aprendizaje Basado en Competencias'],
	});

	ngOnInit() {
		this.UserService.getSettings().subscribe((user) => {
			this.user = user;
		});
		this.sectionService.findSections().subscribe({
			next: (sections) => {
				if (sections.length) {
					this.sections = sections;
				} else {
					this.sb.open(
						'No tienes sesiones todavia. Primero crea una para poder usar esta herramienta.',
						'Ok',
						{ duration: 2500 },
					);
				}
			},
		});
	}

	pretify(value: string): string {
		return new PretifyPipe().transform(value);
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
			if (group.total > 100) {
				group.grading.sort((a, b) => b.points - a.points);

				while (group.grading.reduce((l, c) => l + c.points, 0) > 100) {
					group.grading = group.grading.slice(0, -1);
				}
				group.total = 100;
			}
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

	onSubmit() {
		const section = this.getSection(this.form.get('section')?.value || '');
		if (!section) return;
		const query = `Necesito que me ayudes a crear un sistema de calificaciones para evaluar el desarrollo de las competencias necesarias para los contenidos que estoy trabajando en ${section.year.toLowerCase()} grado de ${section.level.toLowerCase()} en el area de ${this.pretify(this.form.get('subject')?.value || '')}, en base a 100 puntos:
Los contenidos que estoy trabajando son estos:
- ${this.contentBlocks.flatMap((block) => block.concepts).join('\n- ')}

Mi metodo de enseñanza, va mayormente enfocado hacia el ${this.form.get('style')?.value?.toLowerCase()}.

El sistema de calificaciones tiene que ser un array JSON con esta interfaz:
{
	activity: string; // actividad o trabajo a realizar
	activityType: 'Grupal' | 'Individual' | 'Autoevaluacion' | 'Coevaluacion';
	criteria: string[]; // criterios de evaluacion
	points: number;
}

Aqui cada objeto es una entrada del sistema de calificaciones, donde se especifican: la competencia que se estara trabajando, la actividad que se realizara, el tipo de actividad, los criterios que se van a evaluar y los puntos asignados a dicha actividad.
De esta manera las condiciones para la validez del sistema de calificaciones es que al sumar todos los puntos (todas las propiedades points) de la misma competencia deberia ser igual a 100.
Este sistema de calificacion sera utilizado durante 4 semanas, a lo largo de varias lecciones. Asi que el numero ideal de actividades se encuentra entre 1 a 2 actividades a la semana, osea de 4 a 8 actividades con no mas de 100 puntos asignados en total.
Las actividades que mas realizo con mis estudiantes son las investigaciones, las exposiciones y los informes de lectura o de investigacion.
Algunos puntos 'fijos' son los cuadernos (5 a 15 puntos) y la participacion activa en clase (de 5 a 10 puntos), autoevaluaciones/coevaluaciones (no mas de 5 puntos) el resto lo dejo en tus manos. Response solo con el json, no hagas comentarios, por favor.`;
		this.generating = true;
		this.aiService.geminiAi(query).subscribe({
			next: (res) => {
				this.generating = false;
				const activities = JSON.parse(
					res.response.slice(
						res.response.indexOf('['),
						res.response.lastIndexOf(']') + 1,
					),
				) as GradingActivity[];
				const adjusted = this.adjustGradingActivities(
					activities
						.map((a) => {
							a.competence = 'Comunicativa';
							return a;
						})
						.sort(
							(a, b) =>
								a.competence.charCodeAt(0) -
								b.competence.charCodeAt(0),
						),
				);
				this.scoreSystem = {
					activities: adjusted,
					content: this.contentBlock,
					section: section._id,
					user: this.user?._id,
				} as any;
				this.grouped = this.groupByCompetence(adjusted);
			},
			error: (err) => {
				console.log(err.message);
				this.generating = false;
			},
		});
	}

	saveSystem() {
		if (this.scoreSystem) {
			this.saving = true;
			const content = this.scoreSystem.content.map((c) => c._id);
			this.scoreService
				.create({ ...this.scoreSystem, content })
				.subscribe({
					next: (system) => {
						if (system._id) {
							this.router
								.navigateByUrl('/grading-systems/' + system._id)
								.then(() => {
									this.sb.open(
										'Se ha guardado el sistema de calificaciones!',
										'Ok',
										{ duration: 2500 },
									);
								});
						}
						this.saving = false;
					},
					error: (err) => {
						this.sb.open(
							'No se ha podido guardar el sistema de calificacion, intentalo de nuevo, por favor',
							'Ok',
							{ duration: 2500 },
						);
						console.log(err.message);
						this.saving = false;
					},
				});
		}
	}

	getSection(id: string) {
		return this.sections.find((s) => s._id === id);
	}

	onSectionChange(event: any) {
		setTimeout(() => {
			const section = this.getSection(event.value);
			if (section) {
				this.section = section;
				this.subjects = section.subjects;
				this.onSubjectChange({ value: '' });
			}
		}, 0);
	}

	onSubjectChange(event: any) {
		setTimeout(() => {
			const subject: string = event.value;
			const section = this.getSection(
				this.form.get('section')?.value || '',
			);
			if (section) {
				const { year, level } = section;
				this.contentService
					.findAll({ subject, grade: year, level })
					.subscribe({
						next: (contents) => {
							this.contents = contents.flatMap((c) => c.concepts);
							this.onConceptChange({ value: '' });
						},
					});
			}
		}, 0);
	}

	onConceptChange(event: any) {
		setTimeout(() => {
			const title: string[] = event.value;
			const section = this.getSection(
				this.form.get('section')?.value || '',
			);
			const subject = this.form.get('subject')?.value;
			const content: string[] = this.form.get('content')?.value as any;
			if (section) {
				const { year, level } = section;
				zip([
					this.contentBlockService.findAll({ year, level, subject }),
					this.competenceService.findAll({
						grade: year,
						level,
						subject,
					}),
				]).subscribe({
					next: ([contentBlocks, competence]) => {
						this.contentBlocks = contentBlocks.filter((block) =>
							title.includes(block.title),
						);
						this.contentBlock =
							this.contentBlocks.filter((block) =>
								content.includes(block.title),
							) || null;
						this.competence = competence;
					},
				});
			}
		}, 0);
	}
}
