import { Component, importProvidersFrom, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSettingsService } from '../../services/user-settings.service';
import { PdfService } from '../../services/pdf.service';

@Component({
    selector: 'app-equations',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatSliderModule,
        MatChipsModule,
    ],
    templateUrl: './equations.component.html',
    styleUrl: './equations.component.scss'
})
export class EquationsComponent implements OnInit {
  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName = '';
  schoolName = '';
  exercises: string[] = [];

  exerciseForm: FormGroup = this.fb.group({
    title: ['Resuelve estas ecuaciones'],
    equationType: ['linear'],
    difficulty: ['basic'],
    numExercises: [10],
    valueRangeMin: [-10],
    valueRangeMax: [10],
    name: [false],
    grade: [false],
    date: [false],
  });

  constructor() { }

  ngOnInit(): void {
    this.userSettingsService.getSettings().subscribe(settings => {
      this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
      // this.schoolName = settings.schoolName;
    });
  }

  generateExercises(): void {
    const formValues = this.exerciseForm.value;
    this.exercises = this.createExercises(formValues);
  }

  createExercises(formValues: any): string[] {
    const exercises: string[] = [];
    const numExercises = formValues.numExercises;
    const minValue = formValues.valueRangeMin;
    const maxValue = formValues.valueRangeMax;

    for (let i = 0; i < numExercises; i++) {
      let equation = '';
      switch (formValues.equationType) {
        case 'linear':
          const m = this.getRandomInt(minValue, maxValue);
          const b = this.getRandomInt(minValue, maxValue);
          equation = `y = ${m}x + ${b}`;
          break;
        case 'quadratic':
          const a = this.getRandomInt(minValue, maxValue);
          const bQuad = this.getRandomInt(minValue, maxValue);
          const c = this.getRandomInt(minValue, maxValue);
          equation = `${a}x<sup>2</sup> + ${bQuad}x + ${c} = 0`;
          break;
        // Agrega más casos para otros tipos de ecuaciones
      }
      exercises.push(equation);
    }

    return exercises;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  toggleName() {
    const val = this.exerciseForm.get('name')?.value;
    if (!val) {
      this.exerciseForm.get('name')?.setValue(true);
    } else {
      this.exerciseForm.get('name')?.setValue(false);
    }
  }

  toggleGrade() {
    const val = this.exerciseForm.get('grade')?.value;
    if (!val) {
      this.exerciseForm.get('grade')?.setValue(true);
    } else {
      this.exerciseForm.get('grade')?.setValue(false);
    }
  }

  toggleDate() {
    const val = this.exerciseForm.get('date')?.value;
    if (!val) {
      this.exerciseForm.get('date')?.setValue(true);
    } else {
      this.exerciseForm.get('date')?.setValue(false);
    }
  }

  changeEquation(index: number) {
    const { valueRangeMin, valueRangeMax, equationType } = this.exerciseForm.value;

    if (!valueRangeMin || !valueRangeMax || !equationType)
      return;

    const config = { numExercises: 1, valueRangeMin, valueRangeMax, equationType };
    const exercise = this.createExercises(config);
    this.exercises[index] = exercise[0];
  }

  calculate(exercise: string) {
    return ''
  }

  print() {
    const linear = this.exerciseForm.get('equationType')?.value;
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    const title = this.exerciseForm.get('title')?.value || `Ecuaciones ${linear ? "Lineales" : "Cuatraticas"}`;
    this.pdfService.createAndDownloadFromHTML("equations", `${title}`);
    // this.pdfService.createAndDownloadFromHTML("equations-solution", `${title} - Solución`);
  }
}
