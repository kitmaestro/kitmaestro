import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { ClassSection } from '../../../core/interfaces/class-section';
import { SubjectConceptListService } from '../../../core/services/subject-concept-list.service';
import { SubjectConceptList } from '../../../core/interfaces/subject-concept-list';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { CompetenceService } from '../../../core/services/competence.service';
import { CompetenceEntry } from '../../../core/interfaces/competence-entry';
import { ContentBlock } from '../../../core/interfaces/content-block';
import { Checklist } from '../../../core/interfaces/checklist';
import { AuthService } from '../../../core/services/auth.service';
import { UserSettings } from '../../../core/interfaces/user-settings';
import { AiService } from '../../../core/services/ai.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChecklistService } from '../../../core/services/checklist.service';
import { Router, RouterModule } from '@angular/router';
import { ChecklistComponent } from '../../assessments/checklist/checklist.component';

@Component({
	selector: 'app-checklist-generator',
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatIconModule,
		RouterModule,
		PretifyPipe,
		ChecklistComponent,
	],
	templateUrl: './checklist-generator.component.html',
	styleUrl: './checklist-generator.component.scss',
})
export class ChecklistGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder);
	private classSectionService = inject(ClassSectionService);
	private sclService = inject(SubjectConceptListService);
	private contentBlockService = inject(ContentBlockService);
	private competenceService = inject(CompetenceService);
	private authService = inject(AuthService);
	private aiService = inject(AiService);
	private checklistService = inject(ChecklistService);
	private sb = inject(MatSnackBar);
	private router = inject(Router);

	user: UserSettings | null = null;
	sections: ClassSection[] = [];
	section: ClassSection | null = null;
	subjects: string[] = [];
	subjectConceptLists: SubjectConceptList[] = [];
	contentBlocks: ContentBlock[] = [];
	competence: CompetenceEntry[] = [];
	checklist: Checklist | null = null;
	compNames = '';
	generating = false;

	checklistForm = this.fb.group({
		title: [''],
		section: [''],
		subject: [''],
		concept: [''],
		activity: [''],
		activityType: ['Autoevaluación'],
	});

	ngOnInit() {
		this.classSectionService.findSections().subscribe({
			next: (sections) => {
				if (sections.length) {
					this.sections = sections;
					this.checklistForm
						.get('section')
						?.setValue(sections[0]._id);
					this.onSectionSelect({ value: sections[0]._id });
				}
			},
			error: (err) => {
				console.log(err.message);
			},
		});
		this.authService.profile().subscribe((user) => {
			this.user = user;
		});
	}

	onSubmit() {
		this.generate();
	}

	onSectionSelect(event: any) {
		const section = this.sections.find((s) => s._id === event.value);
		if (section) {
			this.section = section;
			this.subjects = section.subjects;
			this.checklistForm.get('subject')?.setValue('');
			this.checklistForm.get('concept')?.setValue('');
		}
	}

	onTitleEdit(event: any) {
		if (this.checklist) this.checklist.title = event.target.value;
	}

	onActivityEdit(event: any) {
		if (this.checklist) this.checklist.activity = event.target.value;
	}

	onSubjectSelect(event: any) {
		if (this.section) {
			const filters = {
				grade: this.section.year,
				level: this.section.level,
				subject: event.value,
			};
			this.sclService.findAll(filters).subscribe({
				next: (res) => {
					this.subjectConceptLists = res;
				},
			});
			this.competenceService.findAll(filters).subscribe({
				next: (competence) => {
					if (competence.length) {
						this.competence = competence;
						this.compNames = competence
							.map((c) => this.pretify(c.name))
							.join(', ');
						if (this.checklist)
							this.checklist.competence = competence;
					}
				},
				error: (err) => {
					console.log(err.message);
				},
			});
		}
	}

	onConceptSelect(event: any) {
		if (this.section) {
			const { year, level } = this.section;
			const subject = this.checklistForm.get('subject')?.value;
			const title = event.value;
			const filters = { year, level, subject, title };
			this.contentBlockService.findAll(filters).subscribe({
				next: (blocks) => {
					if (blocks.length) {
						this.contentBlocks = blocks;
						if (this.checklist)
							this.checklist.contentBlock = blocks[0];
					}
				},
				error: (err) => {
					console.log(err.message);
				},
			});
		}
	}

	fillChecklist(criteria: string[]): Checklist {
		const checklist: any = {
			activity: this.checklistForm.get('activity')?.value,
			activityType: this.checklistForm.get('activityType')?.value,
			competence: this.competence,
			contentBlock: this.contentBlocks[0],
			criteria,
			section: this.section,
			title: this.checklistForm.get('title')?.value,
			user: this.user,
		};

		return checklist as Checklist;
	}

	save() {
		if (this.checklist) {
			const section = this.checklist.section._id;
			const contentBlock = this.checklist.contentBlock._id;
			const competence = this.checklist.competence.map((c) => c._id);
			const user = this.checklist.user._id;
			const list: any = {
				...this.checklist,
				section,
				user,
				contentBlock,
				competence,
			};

			this.checklistService.create(list).subscribe({
				next: (checklist) => {
					if (checklist._id) {
						this.router
							.navigateByUrl('/checklists/' + checklist._id)
							.then(() => {
								this.sb.open(
									'Se ha guardado la lista de cotejo.',
									'Ok',
									{ duration: 2500 },
								);
							});
					} else {
						this.sb.open('Ha ocurrido un error al guardar', 'Ok', {
							duration: 2500,
						});
					}
				},
				error: (err) => {
					this.sb.open('Ha ocurrido un error al guardar', 'Ok', {
						duration: 2500,
					});
					console.log(err.message);
				},
			});
		}
	}

	generate() {
		if (!this.section) {
			return;
		}
		this.generating = true;
		const { year, level } = this.section;
		const subject = this.pretify(
			this.checklistForm.get('subject')?.value || '',
		);
		const activity = this.pretify(
			this.checklistForm.get('activity')?.value || '',
		);
		const activityType = this.pretify(
			this.checklistForm.get('activityType')?.value || '',
		);
		const query = `El dia de hoy voy a realizar una actividad de ${subject} con mis alumnos de ${this.pretify(year)} grado de ${this.pretify(level)}. La actividad que voy a hacer es "${activity}". Para evaluar la actividad quiero utilizar una lista de cotejo para realizar una ${activityType}. Trabajo un curriculo basado en el desarrollo de competencias. Las competencias que voy a trabajar son estas:
- ${this.competence.flatMap((c) => c.entries).join('\n- ')}

Y los indicadores de logro que he elegido son estos:
- ${this.contentBlocks.flatMap((b) => b.achievement_indicators).join('\n -')}

Sabiendo esto, necesito que me hagas un array de strings json (tu respuesta tiene que ser unicamente un array de strings en formato json totalmente valido, SIN NINGUNA CLASE DE FORMATO) donde cada cadena de texto es un criterio de evaluacion, acorde al nivel de mis estudiantes, que deberia tomar en cuenta. Cada criterio de evaluacion debe poder responderse con un 'si' o un 'no'.`;
		console.log(query);
		this.aiService.geminiAi(query).subscribe({
			next: (res) => {
				const { response } = res;
				const extract = response.slice(
					response.indexOf('['),
					response.lastIndexOf(']') + 1,
				);
				const arr: string[] = JSON.parse(extract);
				this.generating = false;
				if (arr)
					this.checklist = this.fillChecklist(
						arr.filter((s) => !s.includes('*')),
					);
				else
					this.sb.open(
						'Ha ocurrido un error al generar tu lista de cotejo.',
						'Ok',
						{ duration: 2500 },
					);
			},
			error: (err) => {
				this.generating = false;
				this.sb.open(
					'Ha ocurrido un error al generar tu lista de cotejo.',
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
}
