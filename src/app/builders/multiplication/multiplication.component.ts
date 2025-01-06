import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings.service';
import { PdfService } from '../../services/pdf.service';
import { shuffle } from 'lodash';
import { formatNumber } from '@angular/common';

@Component({
    selector: 'app-multiplication',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatListModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
    ],
    templateUrl: './multiplication.component.html',
    styleUrl: './multiplication.component.scss'
})
export class MultiplicationComponent implements OnInit {

  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  multiplications: Array<number[]> = [];

  multiplicationsForm = this.fb.group({
    title: ["Multiplicación"],
    numericalSet: ["natural"],
    orientation: ["horizontal"],
    addends: [2, Validators.min(2)],
    minDigits: [2],
    maxDigits: [2],
    size: [10],
    name: [false],
    grade: [false],
    date: [false],
  });

  ngOnInit() {
    this.userSettingsService.getSettings().subscribe(settings => {
      this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
      this.schoolName = settings.schoolName;
    });
  }

  generateFactor(min: number, max: number): number {
    const digits = min == max ? min : Math.round(Math.random() * (max - min)) + min;
    let str = this.multiplicationsForm.get("numericalSet")?.value == "integer" ? (Math.round(Math.random()) ? "" : "-") : "";

    for (let i = 0; i < digits; i++) {
      if (i == 0) {
        str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])[0];
      } else {
        str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])[0];
      }
    }

    return parseInt(str);
  }

  generateMultiplications() {
    const { addends, minDigits, maxDigits, size } = this.multiplicationsForm.value;

    if (!addends || !minDigits || !maxDigits || !size)
      return;

    this.multiplications = [];

    for (let i = 0; i < size; i++) {
      const multiplication: number[] = [];
      const addendQty = Math.round(Math.random() * addends) + 2;
      for (let j = 0; j < addends; j++) {
        multiplication.push(this.generateFactor(minDigits, maxDigits));
      }
      this.multiplications.push(multiplication);
    }
  }

  toggleName() {
    const val = this.multiplicationsForm.get('name')?.value;
    if (!val) {
      this.multiplicationsForm.get('name')?.setValue(true);
    } else {
      this.multiplicationsForm.get('name')?.setValue(false);
    }
  }

  toggleGrade() {
    const val = this.multiplicationsForm.get('grade')?.value;
    if (!val) {
      this.multiplicationsForm.get('grade')?.setValue(true);
    } else {
      this.multiplicationsForm.get('grade')?.setValue(false);
    }
  }

  toggleDate() {
    const val = this.multiplicationsForm.get('date')?.value;
    if (!val) {
      this.multiplicationsForm.get('date')?.setValue(true);
    } else {
      this.multiplicationsForm.get('date')?.setValue(false);
    }
  }

  changeFactor(index: number) {
    const { addends, minDigits, maxDigits, size } = this.multiplicationsForm.value;

    if (!addends || !minDigits || !maxDigits || !size)
      return;

    const multiplication: number[] = [];
    for (let j = 0; j < addends; j++) {
      multiplication.push(this.generateFactor(minDigits, maxDigits));
    }

    this.multiplications[index] = multiplication;
  }

  calculate(arr: number[]) {
    return formatNumber(arr.reduce((p, c) => c * p, 1), 'en');
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    const title = this.multiplicationsForm.get('title')?.value || "Multiplicación";
    this.pdfService.createAndDownloadFromHTML("multiplications", `${title}`);
    this.pdfService.createAndDownloadFromHTML("multiplications-solution", `${title} - Solución`);
  }
}
