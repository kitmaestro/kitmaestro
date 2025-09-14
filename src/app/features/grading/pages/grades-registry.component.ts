import {
	Component,
	OnInit,
	OnDestroy,
	inject,
	signal,
	ChangeDetectionStrategy,
	computed,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, forkJoin, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
	MatDialog,
	MatDialogModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ClassSection, Student, UnitPlan, UserSettings } from '../../../core/interfaces';
import { ClassSectionService, StudentsService, UnitPlanService, UserSettingsService } from '../../../core/services';
import { AssignmentService } from '../../../core/services/assignent.service';
import { GradeService } from '../../../core/services/grade.service';
import { Assignment } from '../../../core/interfaces/assignment';
import { Grade } from '../../../core/interfaces/grade';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-add-student-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSelectModule,
	],
	template: `
		<h2 mat-dialog-title>Agregar Estudiante</h2>
		<mat-dialog-content [formGroup]="studentForm">
			<mat-form-field appearance="outline" class="w-full" style="margin-top: 24px;">
				<mat-label>Nombre</mat-label>
				<input matInput formControlName="firstname" required />
				<mat-error
					*ngIf="studentForm.get('firstname')?.hasError('required')"
				>
					El nombre es requerido.
				</mat-error>
			</mat-form-field>
			<mat-form-field appearance="outline" class="w-full">
				<mat-label>Apellido</mat-label>
				<input matInput formControlName="lastname" required />
				<mat-error
					*ngIf="studentForm.get('lastname')?.hasError('required')"
				>
					El apellido es requerido.
				</mat-error>
			</mat-form-field>
			<mat-form-field appearance="outline" class="w-full">
				<mat-label>Sexo</mat-label>
				<mat-select formControlName="gender">
					<mat-option value="Masculino">Masculino</mat-option>
					<mat-option value="Femenino">Femenino</mat-option>
					<mat-option value="Otro">Otro</mat-option>
				</mat-select>
			</mat-form-field>
			<mat-form-field appearance="outline" class="w-full">
				<mat-label>Fecha de Nacimiento</mat-label>
				<input
					matInput
					[matDatepicker]="picker"
					formControlName="birthdate"
				/>
				<mat-datepicker-toggle
					matSuffix
					[for]="picker"
				></mat-datepicker-toggle>
				<mat-datepicker #picker></mat-datepicker>
			</mat-form-field>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button (click)="onNoClick()">Cancelar</button>
			<button
				mat-raised-button
				color="primary"
				[disabled]="studentForm.invalid"
				(click)="onSave()"
			>
				Guardar
			</button>
		</mat-dialog-actions>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}
	`
})
export class AddStudentDialogComponent {
	private dialogRef = inject(MatDialogRef<AddStudentDialogComponent>);
	public studentForm: FormGroup;

	constructor() {
		this.studentForm = new FormGroup({
			firstname: new FormControl('', [Validators.required]),
			lastname: new FormControl('', [Validators.required]),
			gender: new FormControl('Femenino'),
			birthdate: new FormControl(null),
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		if (this.studentForm.valid) {
			this.dialogRef.close(this.studentForm.value);
		}
	}
}

// --- DIALOG: ADD ASSIGNMENT ---
@Component({
	selector: 'app-add-assignment-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
	],
	template: `
		<h2 mat-dialog-title>Agregar Asignación</h2>
		<mat-dialog-content [formGroup]="assignmentForm">
			<mat-form-field appearance="outline" class="w-full">
				<mat-label>Nombre de la Asignación</mat-label>
				<input matInput formControlName="name" required />
				<mat-error
					*ngIf="assignmentForm.get('name')?.hasError('required')"
				>
					El nombre es requerido.
				</mat-error>
			</mat-form-field>
			<mat-form-field appearance="outline" class="w-full">
				<mat-label>Valor (1-100)</mat-label>
				<input
					matInput
					type="number"
					formControlName="value"
					required
				/>
				<mat-error
					*ngIf="assignmentForm.get('value')?.hasError('required')"
				>
					El valor es requerido.
				</mat-error>
				<mat-error
					*ngIf="
						assignmentForm.get('value')?.hasError('min') ||
						assignmentForm.get('value')?.hasError('max')
					"
				>
					El valor debe estar entre 1 y 100.
				</mat-error>
			</mat-form-field>
			<mat-form-field appearance="outline" class="w-full">
				<mat-label>Unidad a la que pertenece</mat-label>
				<mat-select formControlName="unitPlanId" required>
					@for (unit of data.unitPlans; track unit._id) {
						<mat-option [value]="unit._id">{{
							unit.title
						}}</mat-option>
					}
				</mat-select>
				<mat-error
					*ngIf="
						assignmentForm.get('unitPlanId')?.hasError('required')
					"
				>
					Debe seleccionar una unidad.
				</mat-error>
			</mat-form-field>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button (click)="onNoClick()">Cancelar</button>
			<button
				mat-raised-button
				color="primary"
				[disabled]="assignmentForm.invalid"
				(click)="onSave()"
			>
				Crear
			</button>
		</mat-dialog-actions>
	`,
})
export class AddAssignmentDialogComponent {
	public assignmentForm: FormGroup;
	public data = inject<{ unitPlans: UnitPlan[] }>(MAT_DIALOG_DATA);
	private dialogRef = inject(MatDialogRef<AddAssignmentDialogComponent>);

	constructor() {
		this.assignmentForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			value: new FormControl('20', [
				Validators.required,
				Validators.min(1),
				Validators.max(100),
			]),
			unitPlanId: new FormControl('', [Validators.required]),
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		if (this.assignmentForm.valid) {
			this.dialogRef.close(this.assignmentForm.value);
		}
	}
}

// --- MAIN COMPONENT: GRADES REGISTRY ---
@Component({
	selector: 'app-grades-registry',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatTableModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatDialogModule,
		MatCardModule,
		MatToolbarModule,
		AddStudentDialogComponent,
		AddAssignmentDialogComponent,
		PretifyPipe,
	],
	template: `
		<div class="container mx-auto p-4">
					<h2>Registro de Calificaciones</h2>
				<div>
					@if (isLoading()) {
						<div class="flex justify-center items-center p-8">
							<mat-spinner></mat-spinner>
						</div>
					} @else if (error()) {
						<div class="text-red-500 p-4 bg-red-100 rounded-md">
							{{ error() }}
						</div>
					} @else {
						<!-- Selections -->
						<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px">
							<mat-form-field appearance="outline">
								<mat-label>Seleccionar Sección</mat-label>
								<mat-select [formControl]="sectionControl">
									@for (
										section of sections();
										track section._id
									) {
										<mat-option [value]="section._id">{{ section.name }} ({{ section.level | pretify }})</mat-option>
									}
								</mat-select>
							</mat-form-field>

							<mat-form-field appearance="outline">
								<mat-label>Seleccionar Asignatura</mat-label>
								<mat-select [formControl]="subjectControl">
									@for (
										subject of selectedSection()?.subjects;
										track subject
									) {
										<mat-option [value]="subject">{{ subject | pretify }}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Seleccionar Unidad</mat-label>
								<mat-select [formControl]="unitPlanControl">
									@for (
										unitPlan of unitPlans();
										track unitPlan._id
									) {
										<mat-option [value]="unitPlan._id">{{ unitPlan.title }}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>

						<!-- Actions -->
						@if (selectedSection()) {
							<mat-toolbar class="rounded-t-lg">
								<span class="flex-auto"></span>
								<button
									mat-stroked-button
									color="primary"
									(click)="manageSection()"
								>
									<mat-icon>settings</mat-icon> Administrar
									Sección
								</button>
								<button
									mat-stroked-button
									color="accent"
									class="ml-2"
									(click)="openAddStudentDialog()"
								>
									<mat-icon>person_add</mat-icon> Agregar
									Estudiante
								</button>
							</mat-toolbar>
						}

						<!-- Grades Table -->
						@if (isTableVisible()) {
							<div class="overflow-x-auto">
								<form
									[formGroup]="gradesForm"
									(ngSubmit)="saveGrades()"
								>
									<table
										mat-table
										[dataSource]="students()"
										class="mat-elevation-z8 w-full"
									>
										<!-- Student Name Column -->
										<ng-container
											matColumnDef="studentName"
										>
											<th
												mat-header-cell
												*matHeaderCellDef
											>
												Estudiante
											</th>
											<td
												mat-cell
												*matCellDef="let student"
											>
												{{ student.lastname }},
												{{ student.firstname }}
											</td>
										</ng-container>

										<!-- Dynamic Assignment Columns -->
										@for (
											assignment of assignments();
											track assignment._id
										) {
											<ng-container
												[matColumnDef]="assignment._id"
											>
												<th
													mat-header-cell
													*matHeaderCellDef
													class="text-center"
												>
													{{ assignment.name }} <br />
													({{ assignment.value }} pts)
												</th>
												<td
													mat-cell
													*matCellDef="let student"
												>
													<mat-form-field
														class="w-20"
													>
														<input
															matInput
															type="number"
															[formControlName]="
																getFormControlName(
																	student._id,
																	assignment._id
																)
															"
														/>
													</mat-form-field>
												</td>
											</ng-container>
										}

										<tr
											mat-header-row
											*matHeaderRowDef="
												displayedColumns()
											"
										></tr>
										<tr
											mat-row
											*matRowDef="
												let row;
												columns: displayedColumns()
											"
										></tr>
									</table>
									@if (assignments().length === 0) {
										<div class="text-center p-8 bg-gray-50">
											<p>
												No hay asignaciones creadas para
												esta asignatura. ¡Crea la
												primera!
											</p>
										</div>
									}
								</form>
							</div>
							<div class="flex justify-end mt-4 space-x-2">
								<button
									mat-raised-button
									(click)="openAddAssignmentDialog()"
								>
									<mat-icon>add</mat-icon> Agregar Asignación
								</button>
								<button
									mat-raised-button
									color="primary"
									(click)="saveGrades()"
									[disabled]="
										!gradesForm.dirty || gradesForm.invalid
									"
								>
									<mat-icon>save</mat-icon> Guardar
									Calificaciones
								</button>
							</div>
						} @else if (selectedSection() && selectedSubject()) {
							<div
								class="text-center p-8 bg-gray-50 rounded-b-lg"
							>
								<p>Cargando datos del registro...</p>
								<mat-spinner
									diameter="30"
									class="mx-auto mt-2"
								></mat-spinner>
							</div>
						}
					}
				</div>
		</div>
	`,
	styles: [
		`
			.w-full {
				width: 100%;
			}
			.container {
				max-width: 1400px;
			}
			mat-toolbar {
				background-color: #f5f5f5;
				margin-bottom: -1px; /* Overlap with table border */
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesRegistryComponent implements OnInit, OnDestroy {
	// --- Dependency Injection ---
	private userService = inject(UserSettingsService);
	private sectionService = inject(ClassSectionService);
	private studentService = inject(StudentsService);
	private unitPlanService = inject(UnitPlanService);
	private assignmentService = inject(AssignmentService);
	private gradeService = inject(GradeService);
	private snackBar = inject(MatSnackBar);
	private dialog = inject(MatDialog);
	private subscriptions = new Subscription();

	// --- State Signals ---
	isLoading = signal<boolean>(true);
	error = signal<string | null>(null);
	userProfile = signal<UserSettings | null>(null);
	sections = signal<ClassSection[]>([]);
	students = signal<Student[]>([]);
	unitPlans = signal<UnitPlan[]>([]);
	assignments = signal<Assignment[]>([]);
	selectedSection = signal<ClassSection | null>(null);
	selectedSubject = signal<string | null>(null);
	selectedUnitPlan = signal<string | null>(null);

	// --- Form Controls ---
	sectionControl = new FormControl<string | null>(null);
	subjectControl = new FormControl<string | null>({
		value: null,
		disabled: true,
	});
	unitPlanControl = new FormControl<string | null>({ value: null, disabled: true });
	gradesForm = new FormGroup({});

	// --- Computed Signals for UI Logic ---
	isTableVisible = computed(
		() =>
			!!this.selectedSection() &&
			!!this.selectedSubject() &&
			!!this.selectedUnitPlan() &&
			this.students().length > 0,
	);
	displayedColumns = computed(() => [
		'studentName',
		...this.assignments().map((a) => a._id),
	]);

	ngOnInit(): void {
		this.loadInitialData();
		this.listenToControlChanges();
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	private loadInitialData(): void {
		this.isLoading.set(true);
		forkJoin({
			user: this.userService.getSettings(),
			sections: this.sectionService.findSections(),
		})
			.pipe(
				catchError(() => {
					this.error.set(
						'Error al cargar los datos iniciales. Por favor, intente de nuevo.',
					);
					return of(null);
				}),
				finalize(() => this.isLoading.set(false)),
			)
			.subscribe((response) => {
				if (response) {
					this.userProfile.set(response.user);
					this.sections.set(response.sections);
					if (response.sections.length === 0) {
						this.error.set(
							'No se han encontrado secciones. Por favor, cree una sección antes de continuar.',
						);
					}
				}
			});
	}

	private listenToControlChanges(): void {
		// Section Change
		this.subscriptions.add(
			this.sectionControl.valueChanges.subscribe((sectionId) => {
				if (sectionId) {
					this.handleSectionChange(sectionId);
				}
			}),
		);

		// Subject Change
		this.subscriptions.add(
			this.subjectControl.valueChanges.subscribe((subject) => {
				if (subject) {
					this.handleSubjectChange(subject);
				}
			}),
		);
	}

	private handleSectionChange(sectionId: string): void {
		// Reset dependant state
		this.subjectControl.reset();
		this.subjectControl.disable();
		this.students.set([]);
		this.assignments.set([]);
		this.unitPlans.set([]);
		this.selectedSubject.set(null);
		this.gradesForm = new FormGroup({});

		const section =
			this.sections().find((s) => s._id === sectionId) || null;
		this.selectedSection.set(section);

		if (section) {
			this.subjectControl.enable();
			this.studentService
				.findBySection(section._id)
				.subscribe((students) => {
					this.students.set(students);
				});
		}
	}

	private handleSubjectChange(subject: string): void {
		this.selectedSubject.set(subject);
		const sectionId = this.selectedSection()?._id;

		if (sectionId && subject) {
			forkJoin({
				unitPlans: this.unitPlanService.findAll(), // improve this method to get filtered plans
				assignments: this.assignmentService.getAssignments(
					sectionId,
					subject,
				),
			}).subscribe(({ unitPlans, assignments }) => {
				this.unitPlans.set(unitPlans);
				this.assignments.set(assignments);
				this.loadGradesForTable();
			});
		}
	}

	private loadGradesForTable(): void {
		// const studentIds = this.students().map((s) => s._id);
		// const assignmentIds = this.assignments().map((a) => a._id);

		// if (studentIds.length > 0 && assignmentIds.length > 0) {
		// 	this.gradeService
		// 		.getGrades(assignmentId)
		// 		.subscribe((grades) => {
		// 			this.buildGradesForm(grades);
		// 		});
		// } else {
		// 	this.buildGradesForm([]);
		// }
	}

	private buildGradesForm(grades: Grade[]): void {
		const formGroup = new FormGroup({});
		this.students().forEach((student) => {
			this.assignments().forEach((assignment) => {
				const grade = grades.find(
					(g) =>
						g.studentId === student._id &&
						g.assignmentId === assignment._id,
				);
				const controlName = this.getFormControlName(
					student._id,
					assignment._id,
				);
				formGroup.addControl(
					controlName,
					new FormControl(grade?.score || '', [
						Validators.max(assignment.value),
						Validators.min(0),
					]),
				);
			});
		});
		this.gradesForm = formGroup;
	}

	getFormControlName(studentId: string, assignmentId: string): string {
		return `${studentId}_${assignmentId}`;
	}

	manageSection(): void {
		const sectionId = this.selectedSection()?._id;
		if (sectionId) {
			window.open(`/sections/${sectionId}`, '_blank');
		}
	}

	openAddStudentDialog(): void {
		const dialogRef = this.dialog.open(AddStudentDialogComponent, {
			width: '400px',
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const newStudentData = {
					...result,
					sectionId: this.selectedSection()?._id,
				};
				this.studentService
					.create(newStudentData)
					.subscribe((newStudent) => {
						this.students.update((current) => [
							...current,
							newStudent,
						]);
						this.snackBar.open(
							'Estudiante agregado con éxito',
							'Cerrar',
							{ duration: 3000 },
						);
						// Rebuild form to include the new student
						this.loadGradesForTable();
					});
			}
		});
	}

	openAddAssignmentDialog(): void {
		const dialogRef = this.dialog.open(AddAssignmentDialogComponent, {
			width: '400px',
			data: { unitPlans: this.unitPlans() },
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const newAssignmentData = {
					...result,
					sectionId: this.selectedSection()?._id,
					subject: this.selectedSubject(),
				};
				this.assignmentService
					.addAssignment(newAssignmentData)
					.subscribe((newAssignment) => {
						this.assignments.update((current) => [
							...current,
							newAssignment,
						]);
						this.snackBar.open(
							'Asignación creada con éxito',
							'Cerrar',
							{ duration: 3000 },
						);
						// Rebuild form to include the new assignment
						this.loadGradesForTable();
					});
			}
		});
	}

	saveGrades(): void {
		if (this.gradesForm.invalid) {
			this.snackBar.open(
				'Hay errores en las calificaciones. Por favor, revise los valores.',
				'Cerrar',
				{ duration: 4000 },
			);
			return;
		}

		const gradesToSave: Grade[] = [];
		const formValue: any = this.gradesForm.getRawValue();

		Object.keys(formValue).forEach((key) => {
			const [studentId, assignmentId] = key.split('_');
			const score = formValue[key];
			if (score !== null && score !== '') {
				gradesToSave.push({
					studentId,
					assignmentId,
					score: Number(score),
				});
			}
		});

		this.gradeService.saveGrades(gradesToSave).subscribe((response) => {
			this.snackBar.open(response.message, 'Cerrar', { duration: 3000 });
			this.gradesForm.markAsPristine();
		});
	}
}
