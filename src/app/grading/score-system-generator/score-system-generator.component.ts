import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ScoreSystemService } from '../../services/score-system.service';
import { ClassSectionService } from '../../services/class-section.service';
import { AiService } from '../../services/ai.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { SubjectConceptListService } from '../../services/subject-concept-list.service';
import { ContentBlockService } from '../../services/content-block.service';
import { ClassSection } from '../../interfaces/class-section';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { TEACHING_METHODS } from '../../data/teaching-methods';
import { ContentBlock } from '../../interfaces/content-block';
import { CompetenceService } from '../../services/competence.service';
import { zip } from 'rxjs';
import { CompetenceEntry } from '../../interfaces/competence-entry';
import { GradingActivity, GroupedGradingActivity, ScoreSystem } from '../../interfaces/score-system';
import { ScoreSystemComponent } from '../../grading/score-system/score-system.component';
import { UserSettings } from '../../interfaces/user-settings';

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
    ],
    templateUrl: './score-system-generator.component.html',
    styleUrl: './score-system-generator.component.scss'
})
export class ScoreSystemGeneratorComponent implements OnInit {
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private scoreService = inject(ScoreSystemService);
	private sectionService = inject(ClassSectionService);
	private contentBlockService = inject(ContentBlockService);
	private contentService = inject(SubjectConceptListService);
	private competenceService = inject(CompetenceService);
	private userSettingsService = inject(UserSettingsService);
	private aiService = inject(AiService);
	private router = inject(Router);
	user: UserSettings | null = null;
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
		'section': ['', Validators.required],
		'subject': ['', Validators.required],
		'content': [[] as string[], Validators.required],
		'style': ['Aprendizaje Basado en Competencias']
	});

	ngOnInit() {
		this.userSettingsService.getSettings().subscribe(user => {
			this.user = user;
		});
		this.sectionService.findSections().subscribe({
			next: sections => {
				if (sections.length) {
					this.sections = sections;
				} else {
					this.sb.open('No tienes sesiones todavia. Primero crea una para poder usar esta herramienta.', 'Ok', { duration: 2500 });
				}
			}
		})
	}

	pretify(value: string): string {
		return new PretifyPipe().transform(value)
	}

	groupByCompetence(gradingActivities: GradingActivity[]): GroupedGradingActivity[] {
		const grouped = gradingActivities.reduce((acc, activity) => {
			// Si ya existe un grupo con la misma competencia, añade la actividad al grupo
			const existingGroup = acc.find(group => group.competence === activity.competence);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				// Si no existe, crea un nuevo grupo para esta competencia
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		return grouped;
	}

	adjustGradingActivities(gradingActivities: GradingActivity[]): GradingActivity[] {
		// Paso 1: Agrupamos por 'competence' y calculamos el total
		const grouped = gradingActivities.reduce((acc, activity) => {
			const existingGroup = acc.find(group => group.competence === activity.competence);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		// Paso 2: Ajustar los grupos que tengan un total menor a 100
		grouped.forEach(group => {
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
		return grouped.flatMap(group => group.grading);
	}

	onSubmit() {
		const section = this.getSection(this.form.get('section')?.value || '');
		if (!section)
			return;
		const query = `Necesito que me ayudes a crear un sistema de calificaciones para evaluar el desarrollo de las competencias necesarias para los contenidos que estoy trabajando en ${section.year.toLowerCase()} grado de ${section.level.toLowerCase()} en el area de ${this.pretify(this.form.get('subject')?.value || '')}, en base a 100 puntos:
Los contenidos que estoy trabajando son estos:
- ${this.contentBlocks.flatMap(block => block.concepts).join('\n- ')}

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
Algunos puntos 'fijos' son los cuadernos (5 a 15 puntos) y la participacion activa en clase (de 5 a 10 puntos), autoevaluaciones/coevaluaciones (no mas de 5 puntos) el resto lo dejo en tus manos. Response solo con el json, no hagas comentarios, por favor.`
		this.generating = true;
		this.aiService.geminiAi(query).subscribe({
			next: res => {
				this.generating = false;
				const activities = JSON.parse(res.response.slice(res.response.indexOf('['), res.response.lastIndexOf(']') + 1)) as GradingActivity[];
				const adjusted = this.adjustGradingActivities(activities.map(a => { a.competence = 'Comunicativa'; return a }).sort((a, b) => a.competence.charCodeAt(0) - b.competence.charCodeAt(0)));
				this.scoreSystem = {
					activities: adjusted,
					content: this.contentBlock,
					section: section._id,
					user: this.user?._id,
				} as any;
				this.grouped = this.groupByCompetence(adjusted);
			},
			error: err => {
				console.log(err.message);
				this.generating = false;
			}
		});
	}

	saveSystem() {
		if (this.scoreSystem) {
			this.saving = true;
			const content = this.scoreSystem.content.map(c => c._id);
			this.scoreService.create({ ...this.scoreSystem, content }).subscribe({
				next: system => {
					if (system._id) {
						this.router.navigateByUrl("/grading-systems/" + system._id).then(() => {
							this.sb.open('Se ha guardado el sistema de calificaciones!', 'Ok', { duration: 2500 });
						});
					}
					this.saving = false;
				},
				error: err => {
					this.sb.open('No se ha podido guardar el sistema de calificacion, intentalo de nuevo, por favor', 'Ok', { duration: 2500 });
					console.log(err.message)
					this.saving = false;
				}
			});
		}
	}

	getSection(id: string) {
		return this.sections.find(s => s._id === id);
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
			const section = this.getSection(this.form.get('section')?.value || '');
			if (section) {
				const { year, level } = section;
				this.contentService.findAll({ subject, grade: year, level, }).subscribe({
					next: contents => {
						this.contents = contents.flatMap(c => c.concepts);
						this.onConceptChange({ value: '' })
					}
				})
			}
		}, 0);
	}

	onConceptChange(event: any) {
		setTimeout(() => {
			const title: string[] = event.value;
			const section = this.getSection(this.form.get('section')?.value || '');
			const subject = this.form.get('subject')?.value;
			const content: string[] = this.form.get('content')?.value as any;
			if (section) {
				const { year, level } = section;
				zip([this.contentBlockService.findAll({ year, level, subject }), this.competenceService.findAll({ grade: year, level, subject })]).subscribe({
					next: ([contentBlocks, competence]) => {
						this.contentBlocks = contentBlocks.filter(block => title.includes(block.title));
						this.contentBlock = this.contentBlocks.filter(block => content.includes(block.title)) || null;
						this.competence = competence;
					}
				})
			}
		}, 0);
	}
}
