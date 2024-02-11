import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GradeDataSet, GradesData } from '../../interfaces/grades-data';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-grades-generator',
  standalone: true,
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
  ],
  templateUrl: './grades-generator.component.html',
  styleUrl: './grades-generator.component.scss'
})
export class GradesGeneratorComponent {
  fb = inject(FormBuilder);
  generating = false;
  generated: GradesData | null = null;

  configForm = this.fb.group({
    level: ['primary'],
    indicators: [3],
    grades: [['P1', 'P2']],
    randomLevel: [8],
    includeRecover: [true],
    precise: [false],
    students: this.fb.array([
      this.fb.group({
        level: ['B+'],
        improvements: [true],
      }),
    ]),
  });

  onSubmit() {
    console.log('submit')
    this.generating = true;
    const config = this.configForm.value as GradesData;
    this.generated = config;
    this.generated.dataSet = config.students.map<GradeDataSet>(student => {
      const { level, improvements } = student;
      const dataset = this.generateStudentGrades(level, improvements);
      console.log(dataset);
      return dataset;
    })
    this.generating = false;
  }

  addStudent() {
    this.students.push(
      this.fb.group({
        level: ['B+'],
        improvements: [true],
      })
    );
  }

  removeStudent(index: number) {
    this.students.removeAt(index);
  }

  getMinAndMax(level: string) {
    switch(level) {
      case 'F': {
        return { min: 40, max: 59 };
      }
      case 'D-': {
        return { min: 60, max: 63 };
      }
      case 'D': {
        return { min: 63, max: 66 };
      }
      case 'D+': {
        return { min: 66, max: 69 };
      }
      case 'C-': {
        return { min: 70, max: 73 };
      }
      case 'C': {
        return { min: 73, max: 76 };
      }
      case 'C+': {
        return { min: 76, max: 79 };
      }
      case 'B-': {
        return { min: 80, max: 83 };
      }
      case 'B': {
        return { min: 83, max: 86 };
      }
      case 'B+': {
        return { min: 86, max: 89 };
      }
      case 'A-': {
        return { min: 90, max: 93 };
      }
      case 'A': {
        return { min: 93, max: 96 };
      }
      default: {
        return { min: 96, max: 99 };
      }
    }
  }

  generateStudentGrades(level: string, improvements: boolean): GradeDataSet {
    if (!this.generated) return [];
    const qtyRequired: number = this.generated.indicators * this.generated.grades.length;
    const isPrimary = this.generated.level == 'primary';
    const minGrade = this.generated.level == 'primary' ? 65 : 70;
    const grades: { p: number, rp: number }[] = [];
    const { min, max } = this.getMinAndMax(level);
    for (let i = 0; i < qtyRequired; i++) {
      const grade = { p: 0, rp: 0 };
      grade.p = faker.number.int({ min, max });
      if (grade.p < minGrade) {
        grade.rp = faker.number.int({ max, min: grade.p });
      }
      grades.push(grade);
    }
    if (improvements) {
      grades.sort((a,b) => a.p - b.p);
    }
    const row: GradeDataSet = [];
    let lastIndex = 0;
    const average = {
      periods: {
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0
      },
      grades: 0,
      total: 0,
      average: 0,
    };
    for (let i = 0; i < this.generated.indicators; i++) {
      for (let period = 1; period < 5; period++) {
        const currentPeriodStr = `P${period}`;
        if (this.generated.grades.includes(currentPeriodStr)) {
          const { p, rp } = grades[lastIndex];
          lastIndex++;
          row.push(p, rp ? rp : null);
          average.grades++;
          if (rp) {
            average.total += rp;
            switch(currentPeriodStr) {
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
    const cp1 = Math.round(average.periods.p1 / this.generated.indicators);
    const cp2 = Math.round(average.periods.p2 / this.generated.indicators);
    const cp3 = Math.round(average.periods.p3 / this.generated.indicators);
    const cp4 = Math.round(average.periods.p4 / this.generated.indicators);
    const cf = cp1 && cp2 && cp3 && cp4 ? Math.round((cp1 + cp2 + cp3 + cp4) / 4) : null;
    row.push(cp1 ? cp1 : null, cp2 ? cp2 : null, cp3 ? cp3 : null, cp4 ? cp4 : null, cf);
    return row;
  }

  get students(): FormArray {
    return this.configForm.get('students') as FormArray;
  }
}
