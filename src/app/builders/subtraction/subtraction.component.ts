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

@Component({
  selector: 'app-subtraction',
  standalone: true,
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
  templateUrl: './subtraction.component.html',
  styleUrl: './subtraction.component.scss'
})
export class SubtractionComponent implements OnInit {

  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  subtractions: Array<number[]> = [];

  subtractionsForm = this.fb.group({
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

  generateNumber(min: number, max: number): number {
    const digits = min == max ? min : Math.round(Math.random() * (max - min)) + min;
    let str = "";

    for (let i = 0; i < digits; i++) {
      if (i == 0) {
        str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])[0];
      } else {
        str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])[0];
      }
    }

    return parseInt(str);
  }

  generateSubtractions() {
    const { addends, minDigits, maxDigits, size } = this.subtractionsForm.value;

    if (!addends || !minDigits || !maxDigits || !size)
      return;

    this.subtractions = [];

    for (let i = 0; i < size; i++) {
      const addition: number[] = [];
      const addendQty = Math.round(Math.random() * addends) + 2;
      for (let j = 0; j < addends; j++) {
        addition.push(this.generateNumber(minDigits, maxDigits));
      }
      this.subtractions.push(addition);
    }
  }

  toggleName() {
    const val = this.subtractionsForm.get('name')?.value;
    if (!val) {
      this.subtractionsForm.get('name')?.setValue(true);
    } else {
      this.subtractionsForm.get('name')?.setValue(false);
    }
  }

  toggleGrade() {
    const val = this.subtractionsForm.get('grade')?.value;
    if (!val) {
      this.subtractionsForm.get('grade')?.setValue(true);
    } else {
      this.subtractionsForm.get('grade')?.setValue(false);
    }
  }

  toggleDate() {
    const val = this.subtractionsForm.get('date')?.value;
    if (!val) {
      this.subtractionsForm.get('date')?.setValue(true);
    } else {
      this.subtractionsForm.get('date')?.setValue(false);
    }
  }

  changeAddend(index: number) {
    const { addends, minDigits, maxDigits, size } = this.subtractionsForm.value;

    if (!addends || !minDigits || !maxDigits || !size)
      return;

    const addition: number[] = [];
    for (let j = 0; j < addends; j++) {
      addition.push(this.generateNumber(minDigits, maxDigits));
    }

    this.subtractions[index] = addition;
  }

  calculate(arr: number[]) {
    return arr.reduce((p, c) => c + p, 0);
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    this.pdfService.createAndDownloadFromHTML("subtractions", `Suma`);
    this.pdfService.createAndDownloadFromHTML("subtractions-solution", `Suma - Solucion`);
  }

}
