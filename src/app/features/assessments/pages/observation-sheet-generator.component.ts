import { Component, OnInit, computed, inject, signal, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ObservationGuideComponent } from '../../../shared/ui/observation-guide.component';
import { ObservationGuide } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { PdfService } from '../../../core/services/pdf.service';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import {
	createGuide,
	createGuideSuccess,
	loadEntries,
	loadSections,
	loadStudentsBySection,
	selectAiIsGenerating,
	selectAllClassSections,
	selectAllCompetenceEntries,
	selectAuthUser,
} from '../../../store';
import { selectSectionStudents } from '../../../store/students/students.selectors';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-observation-sheet',
	imports: [
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		ObservationGuideComponent,
		MatSnackBarModule,
		RouterLink,
	],
	template: `
		<div style="margin-bottom: 24px">
			<div
				style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between"
			>
				<h2>Generar Gu&iacute;a de Observaci&oacute;n</h2>
				<button mat-button routerLink="/assessments/observation-sheets">
					<mat-icon>arrow_back</mat-icon>
					Mis Gu&iacute;as
				</button>
			</div>
			<div>
				<div>
					<form [formGroup]="sheetForm" (ngSubmit)="onSubmit()">
						<div style="">
							<mat-form-field appearance="outline">
								<mat-label>T&iacute;tulo</mat-label>
								<input
									type="text"
									matInput
									formControlName="title"
								/>
							</mat-form-field>
						</div>
						<div
							style="display: flex; gap: 16px; margin-bottom: 16px"
						>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-checkbox
									class="example-margin"
									#blank
									(change)="
										blank.checked
											? sheetForm.get('date')?.disable()
											: sheetForm.get('date')?.enable()
									"
									formControlName="blankDate"
								>
									Dejar Fecha en Blanco
								</mat-checkbox>
							</div>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-form-field appearance="outline">
									<mat-label>Fecha</mat-label>
									<input
										type="date"
										matInput
										formControlName="date"
									/>
								</mat-form-field>
							</div>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-checkbox
									class="example-margin"
									formControlName="individual"
								>
									Reporte Individual
								</mat-checkbox>
							</div>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-form-field appearance="outline">
									<mat-label>Grupo</mat-label>
									<mat-select
										formControlName="group"
										(selectionChange)="
											onGradeSelect($event)
										"
									>
										@for (
											group of groups();
											track group._id
										) {
											<mat-option [value]="group._id">{{
												group.name
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
						</div>
						<div
							style="display: flex; gap: 16px; margin-bottom: 16px"
						>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-form-field appearance="outline">
									<mat-label>Asignatura(s)</mat-label>
									<mat-select
										formControlName="subject"
										(selectionChange)="onSubjectSelect()"
									>
										@for (
											subject of gradeSubjects;
											track $index
										) {
											@if (subjectLabel(subject)) {
												<mat-option [value]="subject">{{
													subjectLabel(subject)
												}}</mat-option>
											}
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-form-field appearance="outline">
									<mat-label>Duraci&oacute;n</mat-label>
									<mat-select formControlName="duration">
										@for (
											option of durationOptions;
											track $index
										) {
											<mat-option [value]="option">{{
												option
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-form-field appearance="outline">
									<mat-label>Competencias</mat-label>
									<mat-select
										formControlName="competence"
										multiple
									>
										@for (
											option of compentenceOptions();
											track $index
										) {
											<mat-option
												[value]="option.value"
												>{{ option.label }}</mat-option
											>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div
								style="flex: 1 1 auto; width: 100%; max-width: 25%"
							>
								<mat-form-field appearance="outline">
									<mat-label>Aspectos a Observar</mat-label>
									<mat-select
										formControlName="aspects"
										multiple
									>
										@for (aspect of aspects; track $index) {
											<mat-option [value]="aspect">{{
												aspect
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
						</div>
						<div
							style="display: flex; gap: 16px; margin-bottom: 16px"
						>
							<div style="flex: 1 1 auto; width: 50%">
								<mat-form-field appearance="outline">
									<mat-label>Descripci&oacute;n</mat-label>
									<textarea
										rows="4"
										matInput
										formControlName="description"
									></textarea>
								</mat-form-field>
							</div>
							<div style="flex: 1 1 auto; width: 50%">
								<mat-form-field appearance="outline">
									<mat-label
										>Otros Aspectos (separados por
										comas)</mat-label
									>
									<textarea
										rows="4"
										matInput
										formControlName="customAspects"
									></textarea>
								</mat-form-field>
							</div>
						</div>
						<div style="text-align: right;">
							<button
								[disabled]="sheetForm.invalid"
								mat-button
								[color]="
									observationSheet ? 'accent' : 'primary'
								"
								type="submit"
							>
								<mat-icon>bolt</mat-icon>
								@if (observationSheet) {
									Regenerar
								} @else {
									Generar
								}
							</button>
							@if (observationSheet) {
								<button
									type="button"
									(click)="onSave()"
									style="margin-right: 12px"
									mat-flat-button
									color="primary"
								>
									<mat-icon>save</mat-icon>
									Guardar
								</button>
							}
						</div>
					</form>
				</div>
			</div>
		</div>

		<div style="padding-bottom: 42px">
			@if (observationSheet) {
				<app-observation-guide
					[students]="students()"
					[guide]="observationSheet"
				></app-observation-guide>
			}
		</div>
	`,
	styles: `
		.example-margin {
			margin: 0 12px;
		}

		mat-form-field {
			width: 100%;
		}

		.hide {
			display: none;
		}
	`,
})
export class ObservationSheetGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private fb = inject(FormBuilder);
	private pdfService = inject(PdfService);
	private router = inject(Router);
	private sb = inject(MatSnackBar);

	#destroy$ = new Subject<void>();

	user = this.#store.selectSignal(selectAuthUser);
	teacherName = computed(() =>
		this.user()
			? `${this.user()?.title}. ${this.user()?.firstname} ${this.user()?.lastname}`
			: '',
	);
	schoolName = computed(() => (this.user() ? this.user()?.schoolName : ''));

	groups = this.#store.selectSignal(selectAllClassSections);
	competenceCol = this.#store.selectSignal(selectAllCompetenceEntries);
	students = this.#store.selectSignal(selectSectionStudents);
	compentenceOptions = signal<{ value: string; label: string }[]>([]);
	generating = this.#store.selectSignal(selectAiIsGenerating);

	aspects = [
		'Interacción entre los estudiantes',
		'Estrategias desarrolladas para dar respuestas a las situaciones planteadas',
		'Manejo de los contenidos mediadores',
		'Comunicación verbal y no verbal',
		'Organización de los estudiantes y sus materiales',
		'Tiempo en el que desarrollan las actividades',
		'Interés y participación',
		'Peticiones de apoyo',
		'Interacción con el espacio',
		'Uso de recursos y referentes del espacio de aprendizaje',
		'Solidaridad y colaboración entre pares',
	];

	durationOptions = [
		'45 minutos',
		'90 minutos',
		'1 día',
		'1 semana',
		'1 mes',
	];

	observationSheet: ObservationGuide | null = null;

	sheetForm = this.fb.group({
		blankDate: [false],
		title: ['', Validators.required],
		date: [new Date().toISOString().split('T')[0]],
		individual: [false],
		group: ['', Validators.required],
		description: ['', Validators.required],
		duration: ['90 minutos'],
		competence: [['Comunicativa'], Validators.required],
		subject: ['', Validators.required],
		aspects: [['Interacción entre los estudiantes'], Validators.required],
		customAspects: [''],
	});

	ngOnInit() {
		this.#store.dispatch(loadSections());
		this.loadCompetences();
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	onGradeSelect(event?: any) {
		const id: string | undefined = event.value;
		this.loadStudents(id);
		this.loadCompetences(id);
		this.compentenceOptions.set(this.getCompentenceOptions(id));
	}

	onSubjectSelect() {
		this.loadCompetences();
	}

	onSubmit() {
		this.observationSheet = null;
		const {
			customAspects,
			blankDate,
			title,
			date,
			individual,
			group,
			aspects,
			subject,
			competence,
			duration,
			description,
		} = this.sheetForm.value as any;
		const comps = this.competenceCol().filter(
			(c) => c.subject === subject && competence?.includes(c.name),
		);

		const competenceMap = competence.map((s: string) => {
			const items = comps.find((c) => c.name === s)?.entries || [];

			return {
				fundamental: s,
				items,
			};
		});
		const section = this.groups().find((g) => g._id === group);
		const guide: any = {
			user: this.user()?._id,
			date: blankDate ? '' : new Date(date),
			title,
			section,
			duration,
			individual,
			description,
			competence: competenceMap,
			aspects: customAspects.trim()
				? [
						...aspects,
						...customAspects
							.split(',')
							.map((s: string) => s.trim())
							.filter((s: string) => s.length),
					]
				: aspects,
		};

		this.observationSheet = guide;
	}

	onSave() {
		const guide: any = this.observationSheet;
		this.#store.dispatch(createGuide({ guide }));
		this.#actions$
			.pipe(ofType(createGuideSuccess), takeUntil(this.#destroy$))
			.subscribe(({ guide }) => {
				this.router.navigate([
					'/assessments',
					'observation-sheets',
					guide._id,
				]);
			});
	}

	getObservedGroupSentence(groupId: string) {
		const starting = [
			'Estudiantes de ',
			'Alumnos de ',
			'Alumnado de ',
			'Estudiantado de ',
			'',
		];

		const index = Math.round(Math.random() * (starting.length - 1));
		const group = this.groups().find((g) => g._id === groupId);
		if (!group) return '';

		return starting[index] + group.name;
	}

	subjectLabel(subject: string): string {
		const subjects = [
			{ value: 'LENGUA_ESPANOLA', label: 'Lengua Española' },
			{ value: 'MATEMATICA', label: 'Matemática' },
			{ value: 'CIENCIAS_SOCIALES', label: 'Ciencias Sociales' },
			{ value: 'CIENCIAS_NATURALES', label: 'Ciencias de la Naturaleza' },
			{ value: 'INGLES', label: 'Inglés' },
			{ value: 'FRANCES', label: 'Francés' },
			{ value: 'EDUCACION_ARTISTICA', label: 'Educación Artística' },
			{ value: 'EDUCACION_FISICA', label: 'Educación Física' },
			{
				value: 'FORMACION_HUMANA',
				label: 'Formación Integral Humana y Religiosa',
			},
		];
		return subjects.find((s) => s.value === subject)?.label || '';
	}

	print() {
		this.sb.open(
			'Guardando como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		if (this.sheetForm.get('individual')?.value) {
			this.students().forEach((student, i) => {
				setTimeout(() => {
					this.pdfService.createAndDownloadFromHTML(
						'guide-' + i,
						`Guia de Observación ${student.firstname} ${student.lastname}`,
					);
				}, 1000 * i);
			});
		} else {
			this.pdfService.createAndDownloadFromHTML(
				'guide',
				`Guia de Observación`,
			);
		}
	}

	loadCompetences(id = '') {
		const sectionId = id || this.sheetForm.value.group;
		if (!sectionId) return;

		const section = this.groups().find((g) => g._id === sectionId);
		if (!section) return;
		const grade = section.year;
		const level = section.level;

		const subject = this.sheetForm.get('subject')?.value;
		if (!subject) return;

		this.#store.dispatch(
			loadEntries({ filters: { grade, level, subject } }),
		);
	}

	loadStudents(id?: string) {
		const section = id || this.sheetForm.get('grade')?.value;
		if (!section) return;

		this.#store.dispatch(loadStudentsBySection({ sectionId: section }));
	}

	getCompentenceOptions(id?: string): { value: string; label: string }[] {
		const primary = [
			{ value: 'Comunicativa', label: 'Comunicativa' },
			{
				value: 'Pensamiento Logico',
				label: 'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica',
			},
			{
				value: 'Etica Y Ciudadana',
				label: 'Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud',
			},
		];
		const secondary = [
			{ value: 'Comunicativa', label: 'Comunicativa' },
			{
				value: 'Pensamiento Logico',
				label: 'Pensamiento Lógico, Creativo y Crítico',
			},
			{
				value: 'Resolucion De Problemas',
				label: 'Resolución de Problemas',
			},
			{
				value: 'Ciencia Y Tecnologia',
				label: 'Tecnológica y Científica',
			},
			{ value: 'Etica Y Ciudadana', label: 'Ética y Ciudadana' },
			{
				value: 'Desarrollo Personal Y Espiritual',
				label: 'Desarrollo Personal y Espiritual',
			},
			{
				value: 'Ambiental Y De La Salud',
				label: 'Ambiental y de la Salud',
			},
		];
		const sectionId = id || this.sheetForm.get('grade')?.value;
		if (!sectionId) {
			return secondary;
		}

		const section = this.groups().find((g) => g._id === sectionId);
		if (!section) {
			return secondary;
		}

		if (section.level === 'PRIMARIA') {
			return primary;
		}

		return secondary;
	}

	get gradeSubjects(): string[] {
		const grade = this.groups().find(
			(g) => g._id === this.sheetForm.get('group')?.value,
		);
		if (!grade) return [];

		return grade.subjects as any;
	}
}
