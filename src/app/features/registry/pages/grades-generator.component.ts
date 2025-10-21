import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import {
	FormArray,
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { GradeDataSet, GradesData } from '../../../core';
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { StudentsService } from '../../../core/services/students.service';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import * as XLSX from 'xlsx';
import { ClassSection } from '../../../core';

@Component({
	selector: 'app-grades-generator',
	imports: [
		CommonModule,
		RouterModule,
		MatChipsModule,
		FormsModule,
		MatCardModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatRadioModule,
		MatSlideToggleModule,
		MatSelectModule,
		MatListModule,
		MatDividerModule,
		MatIconModule,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			@if (generated) {
				<div class="table-container">
					<table
						style="margin-bottom: 12px; margin-top: 12px"
						id="grades-table"
					>
						<thead>
							<tr>
								<th scope="col">Estudiante</th>
								@if (generated.level === 'primary') {
									<th
										colspan="8"
										scope="col"
										*ngFor="
											let col of [].constructor(
												generated.indicators
											);
											let i = index
										"
									>
										Competencia {{ i + 1 }}
									</th>
									<th colspan="6" scope="col">Promedios</th>
								} @else {
									<th colspan="8" scope="col">
										Competencia 1
									</th>
									<th colspan="8" scope="col">
										Competencias 2 y 3
									</th>
									<th colspan="8" scope="col">
										Competencias 4 y 5
									</th>
									<th colspan="8" scope="col">
										Competencias 6 y 7
									</th>
									<th colspan="5" scope="col">Promedios</th>
								}
							</tr>
							<tr>
								<th></th>
								@for (
									indicator of [].constructor(
										generated.indicators
									);
									track $index
								) {
									<th>P1</th>
									<th>RP1</th>
									<th>P2</th>
									<th>RP2</th>
									<th>P3</th>
									<th>RP3</th>
									<th>P4</th>
									<th>RP4</th>
								}
								@if (generated.level === 'primary') {
									<th>C1</th>
									<th>C2</th>
									<th>C3</th>
									<th>CF</th>
									<th>RF</th>
									<th>RE</th>
								} @else {
									<th>PC1</th>
									<th>PC2</th>
									<th>PC3</th>
									<th>PC4</th>
									<th>CF</th>
								}
							</tr>
						</thead>
						<tbody>
							<tr
								*ngFor="
									let row of generated.dataSet;
									let i = index
								"
							>
								@if (imported) {
									<td>{{ i + 1 }}. {{ studentsNames[i] }}</td>
								} @else {
									<td>{{ i + 1 }}</td>
								}
								<td *ngFor="let cell of row">{{ cell }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<button
					mat-raised-button
					color="accent"
					style="margin-right: 12px"
					(click)="generated = null"
				>
					Reiniciar
				</button>
				<button mat-flat-button color="accent" (click)="export()">
					Descargar Excel
				</button>
			} @else {
				<mat-card>
					<mat-card-header>
						<h2 mat-card-title>Generador de Calificaciones</h2>
					</mat-card-header>
					<mat-card-content>
						<form [formGroup]="configForm" (ngSubmit)="onSubmit()">
							<div style="display: flex; gap: 16px">
								<div style="flex: 1 1 auto">
									<label><b>Formato</b>:</label>
									<mat-radio-group formControlName="level">
										<mat-radio-button value="primary"
											>Primaria</mat-radio-button
										>
										<mat-radio-button value="secondary"
											>Secundaria</mat-radio-button
										>
									</mat-radio-group>
									<div style="margin-bottom: 16px">
										<mat-slide-toggle
											formControlName="includeRecover"
											>Incluir Recuperaci&oacute;n (si es
											necesaria)</mat-slide-toggle
										>
									</div>
									<div style="margin-bottom: 16px">
										<mat-slide-toggle
											(change)="onPreciseChange($event)"
											formControlName="precise"
											>C&aacute;lculos Precisos (modo
											robot)</mat-slide-toggle
										>
									</div>
								</div>
								<div style="flex: 1 1 auto">
									<div style="margin-bottom: 16px">
										<label
											><b>Factor de Aleatoriedad</b
											>:</label
										>
										<mat-chip-listbox
											formControlName="randomLevel"
										>
											<mat-chip-option
												color="accent"
												[value]="2"
												>Bajo</mat-chip-option
											>
											<mat-chip-option
												color="accent"
												[value]="4"
												>Normal</mat-chip-option
											>
											<mat-chip-option
												color="accent"
												[value]="8"
												>Alto</mat-chip-option
											>
										</mat-chip-listbox>
									</div>
									<div style="margin-bottom: 16px">
										<label><b>Per&iacute;odos</b>:</label>
										<mat-chip-listbox
											[multiple]="true"
											formControlName="grades"
										>
											<mat-chip-option
												color="accent"
												value="P1"
												>P1</mat-chip-option
											>
											<mat-chip-option
												color="accent"
												value="P2"
												>P2</mat-chip-option
											>
											<mat-chip-option
												color="accent"
												value="P3"
												>P3</mat-chip-option
											>
											<mat-chip-option
												color="accent"
												value="P4"
												>P4</mat-chip-option
											>
										</mat-chip-listbox>
									</div>
								</div>
							</div>
							<div
								style="margin-bottom: 16px"
								formArrayName="students"
							>
								<div style="display: flex; gap: 16px">
									<div style="flex: 1 1 auto">
										@for (
											student of students.controls;
											track $index
										) {
											<div
												style="
													display: flex;
													align-items: center;
												"
											>
												<div
													style="
														margin-top: 16px;
														flex: 1 1 auto;
													"
													[formGroupName]="$index"
												>
													<h3 style="display: flex">
														@if (imported) {
															<span>{{
																studentsNames[
																	$index
																]
															}}</span>
														} @else {
															<span
																>Estudiante #{{
																	$index + 1
																}}</span
															>
														}
														<span
															style="flex: 1 1 auto"
														></span>
														<mat-slide-toggle
															formControlName="improvements"
															>Mostrar
															Progreso</mat-slide-toggle
														>
													</h3>
													<mat-form-field
														style="width: 100%"
														appearance="outline"
													>
														<mat-label>{{
															configForm.get(
																'precise'
															)?.value
																? 'Calificaci&oacute;n'
																: 'Nivel'
														}}</mat-label>
														<input
															*ngIf="
																configForm.get(
																	'precise'
																)?.value
															"
															type="number"
															max="100"
															min="0"
															formControlName="robotModeLevel"
															matInput
														/>
														<mat-select
															*ngIf="
																!configForm.get(
																	'precise'
																)?.value
															"
															formControlName="level"
														>
															<mat-option
																value="F"
																>F (40 -
																59)</mat-option
															>
															<mat-option
																value="D-"
																>D- (60 -
																64)</mat-option
															>
															<mat-option
																value="D+"
																>D+ (65 -
																69)</mat-option
															>
															<mat-option
																value="C-"
																>C- (70 -
																74)</mat-option
															>
															<mat-option
																value="C+"
																>C+ (75 -
																79)</mat-option
															>
															<mat-option
																value="B-"
																>B- (80 -
																84)</mat-option
															>
															<mat-option
																value="B+"
																>B+ (85 -
																89)</mat-option
															>
															<mat-option
																value="A-"
																>A- (90 -
																94)</mat-option
															>
															<mat-option
																value="S"
																>S (95 -
																99)</mat-option
															>
														</mat-select>
													</mat-form-field>
												</div>
												<div
													style="
														width: fit-content;
														padding: 12px;
													"
												>
													<button
														mat-fab
														(click)="
															removeStudent(
																$index
															)
														"
														color="warn"
														type="button"
														*ngIf="
															students.value
																.length !== 1
														"
													>
														<mat-icon
															>delete</mat-icon
														>
													</button>
												</div>
											</div>
										}
									</div>
									<div style="width: fit-content">
										<div
											style="
												display: grid;
												grid-template-columns: 1fr;
												gap: 16px;
												padding: 12px;
												border: 1px solid #aaa;
												width: fit-content;
												margin-bottom: 12px;
											"
										>
											<mat-form-field>
												<mat-label
													>Importar
													Estudiantes</mat-label
												>
												<mat-select
													[formControl]="importFrom"
													(selectionChange)="
														onSectionSelect($event)
													"
												>
													@for (
														section of sections;
														track section._id
													) {
														<mat-option
															[value]="
																section._id
															"
															>{{
																section.name
															}}</mat-option
														>
													}
												</mat-select>
											</mat-form-field>
											<button
												type="button"
												(click)="importStudents()"
												[disabled]="importFrom.invalid"
												mat-raised-button
												color="accent"
											>
												Importar Estudiantes
											</button>
										</div>
										<div
											style="
												display: grid;
												grid-template-columns: 1fr;
												gap: 16px;
												padding: 12px;
												border: 1px solid #aaa;
												width: fit-content;
											"
										>
											<mat-form-field>
												<mat-label>Cantidad</mat-label>
												<input
													type="number"
													min="1"
													max="50"
													matInput
													[formControl]="qty"
												/>
											</mat-form-field>
											<button
												type="button"
												(click)="addStudent()"
												mat-raised-button
												color="accent"
											>
												Agregar
												{{ qty.value }} Estudiante{{
													qty.value === 1 ? '' : 's'
												}}
											</button>
										</div>
									</div>
								</div>
							</div>
							<div>
								<button
									style="display: block; margin-left: auto"
									[disabled]="
										generating || configForm.invalid
									"
									mat-raised-button
									color="primary"
									type="submit"
								>
									<span *ngIf="generating; else iddle"
										>Generando...</span
									>
									<ng-template #iddle>
										<span>Generar</span>
									</ng-template>
								</button>
							</div>
						</form>
					</mat-card-content>
				</mat-card>
			}
		</app-is-premium>
	`,
	styles: `
		.mat-mdc-radio-button ~ .mat-mdc-radio-button {
			margin-left: 12px;
		}

		.input-field {
			width: 100%;
			max-width: 100%;
			margin-top: 16px;
		}

		.table-container {
			overflow-x: auto;
		}

		tr:nth-child(even) {
			background-color: #f2f2f2;
		}

		table {
			border-collapse: collapse;
		}

		th,
		td {
			border: 1px solid #f2f2f2;
			padding: 8px;
		}

		td {
			min-width: fit-content;
		}
	`,
})
export class GradesGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder);
	private aiService = inject(AiService);
	private sectionService = inject(ClassSectionService);
	private studentService = inject(StudentsService);
	public sections: ClassSection[] = [];
	loading = false;
	generating = false;
	generated: GradesData | null = null;
	output: any = null;
	qty = this.fb.control(1);

	importFrom = this.fb.control('', Validators.required);
	section: ClassSection | null = null;
	imported = false;
	studentsNames: string[] = [];

	configForm = this.fb.group({
		level: ['primary'],
		indicators: [3],
		grades: [['P1']],
		randomLevel: [4],
		includeRecover: [true],
		precise: [false],
		students: this.fb.array([
			this.fb.group({
				level: ['B+'],
				robotModeLevel: [85],
				improvements: [true],
			}),
		]),
	});

	ngOnInit() {
		this.sectionService.findSections().subscribe({
			next: (sections) => {
				if (sections.length) {
					this.sections = sections;
					this.importFrom.setValue(
						sections[0] ? sections[0]._id || '' : '',
					);
					this.section = sections[0];
				}
			},
			error: (err) => {
				console.log(err.message);
			},
		});
	}

	onSectionSelect(event: any) {
		const section = this.sections.find((s) => s._id === event.value);
		if (section) {
			this.section = section;
		}
	}

	onSubmit() {
		this.generating = true;
		if (this.configForm.value.level === 'primary') {
			this.configForm.get('indicators')?.setValue(3);
		} else {
			this.configForm.get('indicators')?.setValue(4);
		}
		const config = this.configForm.value as GradesData;
		this.generated = config;
		this.generated.dataSet = config.students.map<GradeDataSet>(
			(student) => {
				const { level, robotModeLevel, improvements } = student;
				const dataset = this.generateStudentGrades(
					config.precise ? '' + robotModeLevel : level,
					improvements,
				);
				return dataset;
			},
		);
		this.generating = false;
	}

	importStudents() {
		const sectionId = this.importFrom.value;
		if (sectionId) {
			for (let i = this.students.controls.length - 1; i >= 0; i--) {
				this.removeStudent(i);
			}
			this.studentService
				.findBySection(sectionId)
				.subscribe((students) => {
					this.studentsNames = students
						.map((s) => `${s.firstname} ${s.lastname}`)
						.sort();
					students.forEach(() => {
						this.addStudent();
					});
					this.imported = true;
				});
		} else {
			return;
		}
	}

	onPreciseChange(event: any) {
		const { checked } = event;
		if (checked) {
			this.students.controls.forEach((control) => {
				const minMax = this.getMinAndMax(control.value.level);
				const newValue = Math.round((minMax.min + minMax.max) / 2);
				control.get('robotModeLevel')?.setValue(newValue);
			});
		} else {
			this.students.controls.forEach((control) => {
				control.get('level')?.setValue('B+');
			});
		}
	}

	addStudent() {
		const qty = this.qty.value || 1;

		for (let i = 0; i < qty; i++) {
			this.students.push(
				this.fb.group({
					level: ['B+'],
					robotModeLevel: [85],
					improvements: [true],
				}),
			);
		}
	}

	removeStudent(index: number) {
		this.students.removeAt(index);
	}

	getRandomNumber(min: number, max: number): number {
		const diff = max - min;
		const rand = min + Math.round(Math.random() * diff);
		return rand;
	}

	getMinAndMax(level: string) {
		if (this.configForm.value.precise && parseInt(level)) {
			const diff = this.configForm.value.randomLevel;
			if (!diff) return { min: parseInt(level), max: parseInt(level) };

			return {
				min: parseInt(level) - diff,
				max: parseInt(level) + diff > 99 ? 99 : parseInt(level) + diff,
			};
		}

		switch (level) {
			case 'F': {
				return { min: 40, max: 59 };
			}
			case 'D-': {
				return { min: 60, max: 64 };
			}
			case 'D+': {
				return { min: 65, max: 69 };
			}
			case 'C-': {
				return { min: 70, max: 74 };
			}
			case 'C+': {
				return { min: 75, max: 79 };
			}
			case 'B-': {
				return { min: 80, max: 84 };
			}
			case 'B+': {
				return { min: 85, max: 89 };
			}
			case 'A-': {
				return { min: 90, max: 94 };
			}
			default: {
				return { min: 95, max: 99 };
			}
		}
	}

	generateStudentGrades(level: string, improvements: boolean): GradeDataSet {
		if (!this.generated) return [];
		const qtyRequired: number =
			this.generated.indicators * this.generated.grades.length;
		const isPrimary = this.generated.level === 'primary';
		const minGrade = isPrimary ? 65 : 70;
		const grades: { p: number; rp: number }[][] = [];
		const minMax = this.getMinAndMax(level);
		const additional = this.generated.randomLevel;
		const min = minMax.min - additional;
		const max =
			minMax.max + additional > 100
				? minMax.max
				: minMax.max + additional;
		let gradeRow = 0;
		let gradeCount = 0;
		if (this.configForm.value.precise) {
			const indicators: { p: number; rp: number }[][] = [];
			if (this.generated.grades.length === 1) {
				const config = {
					average: parseInt(level),
					min,
					max,
					elements: this.generated.indicators,
					minGrade,
				};
				const indicator = this.aiService.generatePeriod(config);
				for (const ind of indicator) {
					indicators.push([ind]);
				}
			} else {
				for (let i = 0; i < this.generated.indicators; i++) {
					const indicator = this.aiService.generatePeriod({
						average: parseInt(level),
						min,
						max,
						elements: this.generated.grades.length,
						minGrade,
					});
					indicators.push(indicator);
				}
			}
			for (let i = 0; i < this.generated.grades.length; i++) {
				const row = improvements
					? indicators.map((arr) => arr[i]).sort((a, b) => a.p - b.p)
					: indicators.map((arr) => arr[i]);
				grades.push(row);
			}
		} else {
			for (let i = 0; i < qtyRequired; i++) {
				gradeCount++;
				if (grades.length === gradeRow) {
					grades[gradeRow] = [];
				}
				const grade = { p: 0, rp: 0 };
				grade.p = this.getRandomNumber(min, max);
				if (grade.p < minGrade && this.generated.includeRecover) {
					grade.rp = this.getRandomNumber(grade.p, max);
				}
				grades[gradeRow].push(grade);
				if (gradeCount === 4) {
					gradeCount = 0;
					gradeRow++;
				}
			}
		}
		if (improvements) {
			grades.forEach((row) => row.sort((a, b) => a.p - b.p));
		}
		const flatten = grades.flat();
		const row: GradeDataSet = [];
		let lastIndex = 0;
		const average = {
			periods: {
				p1: 0,
				p2: 0,
				p3: 0,
				p4: 0,
			},
			competences: {
				c1: 0,
				c2: 0,
				c3: 0,
			},
			grades: 0,
			total: 0,
			average: 0,
		};
		for (let i = 0; i < this.generated.indicators; i++) {
			for (let period = 1; period < 5; period++) {
				const currentPeriodStr = `P${period}`;
				if (this.generated.grades.includes(currentPeriodStr)) {
					const { p, rp } = flatten[lastIndex];
					lastIndex++;
					row.push(p, rp ? rp : null);
					average.grades++;
					if (rp) {
						average.total += rp;
						switch (currentPeriodStr) {
							case 'P1': {
								average.periods.p1 += rp;
								break;
							}
							case 'P2': {
								average.periods.p2 += rp;
								break;
							}
							case 'P3': {
								average.periods.p3 += rp;
								break;
							}
							case 'P4': {
								average.periods.p4 += rp;
								break;
							}
						}
					} else {
						average.total += p;
						switch (currentPeriodStr) {
							case 'P1': {
								average.periods.p1 += p;
								break;
							}
							case 'P2': {
								average.periods.p2 += p;
								break;
							}
							case 'P3': {
								average.periods.p3 += p;
								break;
							}
							case 'P4': {
								average.periods.p4 += p;
								break;
							}
						}
					}
					average.average = average.total / average.grades;
				} else {
					row.push(null, null);
				}
			}
		}
		if (this.generated.level === 'primary') {
			const calculateAverage = this.generated.grades.length === 4;
			const c1Total = flatten
				.slice(0, 4)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c2Total = flatten
				.slice(4, 8)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c3Total = flatten
				.slice(8, 12)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c1 = calculateAverage ? Math.round(c1Total / 4) : null;
			const c2 = calculateAverage ? Math.round(c2Total / 4) : null;
			const c3 = calculateAverage ? Math.round(c3Total / 4) : null;
			const cf = c1 && c2 && c3 ? Math.round((c1 + c2 + c3) / 3) : null;
			const rf =
				cf && cf < minGrade && this.generated.includeRecover
					? this.getRandomNumber(cf, max)
					: null;
			row.push(c1, c2, c3, cf, rf, null);
		} else {
			// const cp1 = Math.round(average.periods.p1 / this.generated.indicators);
			// const cp2 = Math.round(average.periods.p2 / this.generated.indicators);
			// const cp3 = Math.round(average.periods.p3 / this.generated.indicators);
			// const cp4 = Math.round(average.periods.p4 / this.generated.indicators);
			// const cf = cp1 && cp2 && cp3 && cp4 ? Math.round((cp1 + cp2 + cp3 + cp4) / 4) : null;
			// row.push(cp1 ? cp1 : null, cp2 ? cp2 : null, cp3 ? cp3 : null, cp4 ? cp4 : null, cf);
			const calculateAverage = this.generated.grades.length === 4;
			const c1Total = flatten
				.slice(0, 4)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c2Total = flatten
				.slice(4, 8)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c3Total = flatten
				.slice(8, 12)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c4Total = flatten
				.slice(13, 1)
				.map((row) => (row.rp ? row.rp : row.p))
				.reduce((l, n) => l + n, 0);
			const c1 = calculateAverage ? Math.round(c1Total / 4) : null;
			const c2 = calculateAverage ? Math.round(c2Total / 4) : null;
			const c3 = calculateAverage ? Math.round(c3Total / 4) : null;
			const c4 = calculateAverage ? Math.round(c4Total / 4) : null;
			const cf =
				c1 && c2 && c3 && c4
					? Math.round((c1 + c2 + c3 + c4) / 4)
					: null;
			const rf =
				cf && cf < minGrade && this.generated.includeRecover
					? this.getRandomNumber(cf, max)
					: null;
			row.push(
				c1 ? c1 : null,
				c2 ? c2 : null,
				c3 ? c3 : null,
				c4 ? c4 : null,
				cf,
				rf,
			);
		}
		return row;
	}

	get students(): FormArray {
		return this.configForm.get('students') as FormArray;
	}

	export() {
		const table_elt = document.getElementById('grades-table');
		const workbook = XLSX.utils.table_to_book(table_elt);
		if (this.imported && this.section) {
			XLSX.writeFile(
				workbook,
				'Calificaciones de ' + this.section.name + '.xlsb',
			);
		} else {
			XLSX.writeFile(workbook, 'Calificaciones.xlsb');
		}
	}
}
