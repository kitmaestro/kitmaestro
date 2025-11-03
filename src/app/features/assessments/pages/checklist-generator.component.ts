import {
	Component,
	computed,
	effect,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ClassSection } from '../../../core';
import { Checklist } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ChecklistComponent } from '../components/checklist.component';
import { Store } from '@ngrx/store';
import {
	askGemini,
	createChecklist,
	createChecklistSuccess,
	loadBlocks,
	loadEntries,
	loadSections,
	loadSectionsSuccess,
	loadSubjectConceptLists,
	selectAiIsGenerating,
	selectAiResult,
	selectAiSerializedResult,
	selectAllClassSections,
	selectAllCompetenceEntries,
	selectAllContentBlocks,
	selectAuthUser,
} from '../../../store';
import { selectAllLists } from '../../../store/subject-concept-lists/subject-concept-lists.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-checklist-generator',
	imports: [
		ReactiveFormsModule,
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
	template: `
		<div>
			<div>
				<div
					style="align-items: center; justify-content: space-between; display: flex"
				>
					<h2>Generador de Listas de Cotejo</h2>
					<a mat-button routerLink="/assessments/checklists"
						>Mis Listas de Cotejo</a
					>
				</div>
				<div>
					<div style="margin-top: 24px">
						<form
							[formGroup]="checklistForm"
							(ngSubmit)="onSubmit()"
						>
							<div class="form-grid">
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Curso</mat-label>
										<mat-select
											appearance="outline"
											(selectionChange)="
												onSectionSelect($event)
											"
											formControlName="section"
											required
										>
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
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Asignatura</mat-label>
										<mat-select
											appearance="outline"
											(selectionChange)="
												onSubjectSelect($event)
											"
											formControlName="subject"
											required
										>
											@for (
												subject of subjects();
												track subject
											) {
												<mat-option [value]="subject">{{
													subject | pretify
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Unidad</mat-label>
										<mat-select
											appearance="outline"
											(selectionChange)="
												onConceptSelect($event)
											"
											formControlName="concept"
											required
										>
											@for (
												list of subjectConceptLists();
												track $index
											) {
												@for (
													concept of list.concepts;
													track concept
												) {
													<mat-option
														[value]="concept"
														>{{
															concept
														}}</mat-option
													>
												}
											}
										</mat-select>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Título</mat-label>
										<input
											(change)="onTitleEdit($event)"
											placeholder="Carta a mi familia"
											matInput
											appearance="outline"
											formControlName="title"
											required
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label
											>Actividad o Evidencia</mat-label
										>
										<input
											(change)="onActivityEdit($event)"
											placeholder="Redacción de cartas de agradecimiento"
											matInput
											appearance="outline"
											formControlName="activity"
											required
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Tipo de Actividad</mat-label>
										<mat-select
											matInput
											appearance="outline"
											formControlName="activityType"
											required
										>
											<mat-option value="Autoevaluación"
												>Autoevaluación</mat-option
											>
											<mat-option value="Coevaluación"
												>Coevaluación</mat-option
											>
											<mat-option value="Heteroevaluación"
												>Heteroevaluación</mat-option
											>
										</mat-select>
									</mat-form-field>
								</div>
							</div>
							<div style="text-align: end">
								<button
									mat-flat-button
									style="margin-right: 12px"
									color="primary"
									type="button"
									(click)="save()"
									[disabled]="!checklist"
								>
									<mat-icon>save</mat-icon>
									Guardar
								</button>
								<button
									mat-button
									color="primary"
									type="submit"
									[disabled]="
										checklistForm.invalid || generating()
									"
								>
									<mat-icon>bolt</mat-icon>
									{{ checklist ? 'Regenerar' : 'Generar' }}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			@if (checklist) {
				<app-checklist [checklist]="checklist"></app-checklist>
			}
		</div>
	`,
	styles: `
		.form-grid {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: 1fr 1fr 1fr;
			}
		}

		mat-form-field {
			width: 100%;
		}

		.table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 24px;

			td,
			th {
				border: 1px solid #aaa;
				padding: 8px 12px;
			}
		}

		.checklist {
			max-width: 8.5in;
			margin: 24px auto;
			background-color: #fff;
			box-shadow: #ddd 4px 4px 8px;
			padding: 0.7in;
		}
	`,
})
export class ChecklistGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private router = inject(Router);
	private pretify = new PretifyPipe().transform;
	#store = inject(Store);
	#actions$ = inject(Actions);

	user = this.#store.selectSignal(selectAuthUser);
	sections = this.#store.selectSignal(selectAllClassSections);
	section = signal<ClassSection | null>(null);
	subjects = computed(() => {
		const section = this.section();
		if (!section) return [];
		return section.subjects;
	});
	subjectConceptLists = this.#store.selectSignal(selectAllLists);
	contentBlocks = this.#store.selectSignal(selectAllContentBlocks);
	competence = this.#store.selectSignal(selectAllCompetenceEntries);
	aiResponse = this.#store.selectSignal(selectAiResult);
	checklist: Checklist | null = null;
	compNames = '';
	generating = this.#store.selectSignal(selectAiIsGenerating);

	#destroy$ = new Subject<void>();

	checklistForm = this.fb.group({
		title: [''],
		section: [''],
		subject: [''],
		concept: [''],
		activity: [''],
		activityType: ['Autoevaluación'],
	});

	constructor() {
		effect(() => {
			const competence = this.competence();
			if (competence) {
				this.compNames = competence
					.map((c) => this.pretify(c.name))
					.join(', ');
				if (this.checklist) this.checklist.competence = competence;
			}
		});
		effect(() => {
			const contentBlocks = this.contentBlocks();
			if (contentBlocks && contentBlocks.length) {
				if (this.checklist)
					this.checklist.contentBlock = contentBlocks[0];
			}
		});
		effect(() => {
			const response = this.aiResponse();
			if (!response) return;
			const arr: string[] = JSON.parse(
				response.slice(
					response.indexOf('['),
					response.lastIndexOf(']') + 1,
				),
			);
			if (arr && arr.length)
				this.checklist = this.fillChecklist(
					arr.filter((s) => !s.includes('*')),
				);
		});
	}

	ngOnInit() {
		this.#store.dispatch(loadSections());
		this.#actions$
			.pipe(ofType(loadSectionsSuccess), takeUntil(this.#destroy$))
			.subscribe(({ sections }) => {
				if (sections.length) {
					this.checklistForm
						.get('section')
						?.setValue(sections[0]._id);
					this.onSectionSelect({ value: sections[0]._id });
				}
			});
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	onSubmit() {
		this.generate();
	}

	onSectionSelect(event: any) {
		const section = this.sections()?.find((s) => s._id === event.value);
		if (section) {
			this.section.set(section);
			this.checklistForm.patchValue({ subject: '', concept: '' });
		}
	}

	onTitleEdit(event: any) {
		if (this.checklist) this.checklist.title = event.target.value;
	}

	onActivityEdit(event: any) {
		if (this.checklist) this.checklist.activity = event.target.value;
	}

	onSubjectSelect(event: any) {
		const section = this.section();
		if (section) {
			const filters = {
				grade: section.year,
				level: section.level,
				subject: event.value,
			};
			this.#store.dispatch(loadSubjectConceptLists({ filters }));
			this.#store.dispatch(loadEntries({ filters }));
		}
	}

	onConceptSelect(event: any) {
		const section = this.section();
		if (section) {
			const { year, level } = section;
			const subject = this.checklistForm.get('subject')?.value;
			const title = event.value;
			const filters = { year, level, subject, title };
			this.#store.dispatch(loadBlocks({ filters }));
		}
	}

	fillChecklist(criteria: string[]): Checklist {
		const competence = this.competence();
		const contentBlock = this.contentBlocks()[0];
		const section = this.section();
		const user = this.user();
		const { title, activity, activityType } =
			this.checklistForm.getRawValue();

		const checklist: any = {
			activity,
			activityType,
			competence,
			contentBlock,
			criteria,
			section,
			title,
			user,
		};

		return checklist as Checklist;
	}

	save() {
		if (this.checklist) {
			const section = this.checklist.section._id;
			const contentBlock = this.checklist.contentBlock._id;
			const competence = this.checklist.competence.map((c) => c._id);
			const user = this.checklist.user._id;
			const checklist: any = {
				...this.checklist,
				section,
				user,
				contentBlock,
				competence,
			};

			this.#store.dispatch(createChecklist({ checklist }));
			this.#actions$
				.pipe(ofType(createChecklistSuccess), takeUntil(this.#destroy$))
				.subscribe(({ checklist }) => {
					this.router.navigateByUrl(
						'/assessments/checklists/' + checklist._id,
					);
				});
		}
	}

	generate() {
		const section = this.section();
		if (!section) {
			return;
		}
		const { year, level } = section;
		const subject = this.pretify(
			this.checklistForm.get('subject')?.value || '',
		);
		const activity = this.pretify(
			this.checklistForm.get('activity')?.value || '',
		);
		const activityType = this.pretify(
			this.checklistForm.get('activityType')?.value || '',
		);
		const competenceStr = this.competence()
			.flatMap((c) => c.entries)
			.join('\n- ');
		const contentBlockStr = this.contentBlocks()
			.flatMap((b) => b.achievement_indicators)
			.join('\n -');
		const question = `El dia de hoy voy a realizar una actividad de ${subject} con mis alumnos de ${this.pretify(year)} grado de ${this.pretify(level)}. La actividad que voy a hacer es "${activity}". Para evaluar la actividad quiero utilizar una lista de cotejo para realizar una ${activityType}. Trabajo un curriculo basado en el desarrollo de competencias. Las competencias que voy a trabajar son estas:
- ${competenceStr}

Y los indicadores de logro que he elegido son estos:
- ${contentBlockStr}

Sabiendo esto, necesito que me hagas un array de strings json (tu respuesta tiene que ser unicamente un array de strings en formato json totalmente valido, SIN NINGUNA CLASE DE FORMATO) donde cada cadena de texto es un criterio de evaluacion, acorde al nivel de mis estudiantes, que deberia tomar en cuenta. Cada criterio de evaluacion debe poder responderse con un 'si' o un 'no'.`;

		this.#store.dispatch(askGemini({ question }));
	}
}
