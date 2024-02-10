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
  generated = null;

  configForm = this.fb.group({
    level: ['primary'],
    indicators: [3],
    grades: [['1', '2']],
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
    this.generating = true;
    setTimeout(() => this.generating = false, 3000);
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

  get students(): FormArray {
    return this.configForm.get('students') as FormArray;
  }
}
