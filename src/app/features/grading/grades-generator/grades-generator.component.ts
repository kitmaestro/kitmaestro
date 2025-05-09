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
import { GradeDataSet, GradesData } from '../../../core/interfaces/grades-data';
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { StudentsService } from '../../../core/services/students.service';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import * as XLSX from 'xlsx';
import { ClassSection } from '../../../core/interfaces/class-section';

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
	templateUrl: './grades-generator.component.html',
	styleUrl: './grades-generator.component.scss',
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
