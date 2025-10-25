import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { CompetenceService } from '../../../core/services/competence.service';
import { ObservationGuideComponent } from '../../../shared/ui/observation-guide.component';
import { ObservationGuide } from '../../../core';
import { StudentsService } from '../../../core/services/students.service';
import { Student } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PdfService } from '../../../core/services/pdf.service';
import { CompetenceEntry } from '../../../core';
import { ClassSection } from '../../../core';
import { ObservationGuideService } from '../../../core/services/observation-guide.service';
import { User } from '../../../core';

@Component({
	selector: 'app-observation-sheet',
	imports: [
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		ObservationGuideComponent,
		MatSnackBarModule,
	],
	template: `
		<mat-card style="margin-bottom: 24px">
			<mat-card-header>
				<h2 mat-card-title>Gu&iacute;as de Observaci&oacute;n</h2>
			</mat-card-header>
			<mat-card-content>
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
											group of groups;
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
									<mat-select formControlName="subject">
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
											option of compentenceOptions;
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
						@if (observationSheet) {
							<button
								type="button"
								(click)="print()"
								style="margin-left: auto; margin-right: 12px"
								mat-raised-button
								color="link"
							>
								Descargar
							</button>
							<button
								type="button"
								(click)="onSave()"
								style="margin-right: 12px"
								mat-raised-button
								color="primary"
							>
								Guardar
							</button>
						}
						<button
							[disabled]="sheetForm.invalid"
							mat-raised-button
							[color]="observationSheet ? 'accent' : 'primary'"
							type="submit"
						>
							@if (observationSheet) {
								Regenerar
							} @else {
								Generar
							}
						</button>
					</form>
				</div>
			</mat-card-content>
		</mat-card>

		@if (observationSheet) {
			<app-observation-guide
				[students]="students"
				[guide]="observationSheet"
			></app-observation-guide>
		}
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
export class ObservationSheetComponent implements OnInit {
	private fb = inject(FormBuilder);
	private observationGuideService = inject(ObservationGuideService);
	private authService = inject(AuthService);
	private classSectionService = inject(ClassSectionService);
	private competenceService = inject(CompetenceService);
	private studentsService = inject(StudentsService);
	private pdfService = inject(PdfService);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	user: User | null = null;
	teacherName = '';
	schoolName = '';

	groups: ClassSection[] = [];
	competenceCol: CompetenceEntry[] = [];
	students: Student[] = [];
	compentenceOptions: string[];

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

	constructor() {
		this.compentenceOptions = this.getCompentenceOptions();
	}

	ngOnInit() {
		this.loadProfile();
		this.loadCompetences();
		this.loadSections();
	}

	onGradeSelect(event?: any) {
		const id: string | undefined = event.value;
		this.loadCompetences(id);
		this.loadStudents(id);
		this.compentenceOptions = this.getCompentenceOptions(id);
		const group = this.groups.find((g) => g._id === id);
		if (group) {
			this.schoolName = this.user?.schoolName || '';
		}
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
		const comps = this.competenceCol.filter(
			(c) => c.subject === subject && competence?.includes(c.name),
		);

		const competenceMap = competence.map((s: string) => {
			const items = comps.find((c) => c.name === s)?.entries || [];

			return {
				fundamental: s,
				items,
			};
		});
		const guide: any = {
			user: this.user?._id,
			date: blankDate ? '' : date.split('-').reverse().join('/'),
			title,
			section: group,
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
		this.observationGuideService.create(guide).subscribe((result) => {
			if (result._id) {
				this.router
					.navigate([
						'/assessments',
						'observation-sheets',
						result._id,
					])
					.then(() => {
						this.sb.open('Guia guardada con exito.', 'Ok', {
							duration: 2500,
						});
					});
			}
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
		const group = this.groups.find((g) => g._id === groupId);
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
			this.students.forEach((student, i) => {
				setTimeout(() => {
					this.pdfService.createAndDownloadFromHTML(
						'guide-' + i,
						`Guia de Observación ${student.firstname} ${student.lastname}`,
					);
				}, 3000 * i);
			});
		} else {
			this.pdfService.createAndDownloadFromHTML(
				'guide',
				`Guia de Observación`,
			);
		}
	}

	loadProfile() {
		this.authService.profile().subscribe((settings) => {
			if (settings) {
				this.user = settings;
				this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
				// this.schoolName = settings.schoolName;
			}
		});
	}

	loadSections() {
		this.classSectionService.findSections().subscribe((sections) => {
			this.groups = sections;
		});
	}

	loadCompetences(id?: string) {
		const sectionId = id || this.sheetForm.get('grade')?.value;
		if (!sectionId) return;

		const section = this.groups.find((g) => g._id === sectionId);
		if (!section) return;

		this.competenceService.findAll({ grade: section.year })
			.subscribe((competence) => {
				this.competenceCol = competence;
			});
	}

	loadStudents(id?: string) {
		const section = id || this.sheetForm.get('grade')?.value;
		if (!section) return;

		this.studentsService.findBySection(section).subscribe((students) => {
			this.students = students;
		});
	}

	getCompentenceOptions(id?: string): string[] {
		const primary = [
			'Comunicativa',
			'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica',
			'Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud',
		];
		const secondary = [
			'Comunicativa',
			'Pensamiento Lógico, Creativo y Crítico',
			'Resolución de Problemas',
			'Tecnológica y Científica',
			'Ética y Ciudadana',
			'Desarrollo Personal y Espiritual',
			'Ambiental y de la Salud',
		];
		const sectionId = id || this.sheetForm.get('grade')?.value;
		if (!sectionId) {
			return secondary;
		}

		const section = this.groups.find((g) => g._id === sectionId);
		if (!section) {
			return secondary;
		}

		if (section.level === 'PRIMARIA') {
			return primary;
		}

		return secondary;
	}

	get gradeSubjects(): string[] {
		const grade = this.groups.find(
			(g) => g._id === this.sheetForm.get('group')?.value,
		);
		if (!grade) return [];

		return grade.subjects as any;
	}
}
