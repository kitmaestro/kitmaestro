import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equations',
  standalone: true,
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
  ],
  templateUrl: './equations.component.html',
  styleUrl: './equations.component.scss'
})
export class EquationsComponent implements OnInit {
  fb = inject(FormBuilder);

  exercises: string[] = [];
  exerciseForm: FormGroup = this.fb.group({
    equationType: ['linear'],
    difficulty: ['basic'],
    numExercises: [10],
    valueRange: ['-10 a 10'],
    responseFormat: ['multipleChoice'],
    additionalInstructions: ['']
  });

  constructor() { }

  ngOnInit(): void {
  }

  generateExercises(): void {
    const formValues = this.exerciseForm.value;
    this.exercises = this.createExercises(formValues);
  }

  createExercises(formValues: any): string[] {
    const exercises: string[] = [];
    const numExercises = formValues.numExercises;
    const valueRange = formValues.valueRange.split(' a ').map(Number);
    const minValue = valueRange[0];
    const maxValue = valueRange[1];

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
          equation = `${a}x^2 + ${bQuad}x + ${c} = 0`;
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
}
