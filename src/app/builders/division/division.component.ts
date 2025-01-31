import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings.service';
import { PdfService } from '../../services/pdf.service';

interface Division {
  dividend: number;
  divisor: number;
  quotient: number;
}

@Component({
    selector: 'app-division',
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
    templateUrl: './division.component.html',
    styleUrl: './division.component.scss'
})
export class DivisionComponent implements OnInit {

  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  divisions: Division[] = [];

  ready = false;

  divisionsForm = this.fb.group({
    resultType: ['exact'],
    dividendDigits: [2],
    divisorDigits: [1],
    size: [10],
    name: [false],
    grade: [false],
    date: [false],
  });

  ngOnInit() {
    this.userSettingsService.getSettings().subscribe(settings => {
      this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
      // this.schoolName = settings.schoolName;
    });
  }

  generateDivision(maxDividendDigits: number, maxDivisorDigits: number, exact: boolean = false): Division {
    let dividend, divisor, quotient;

    if (exact) {
      // Generate a random divisor within the specified range
      divisor = Math.floor(Math.pow(10, maxDivisorDigits - 1) + Math.random() * (Math.pow(10, maxDivisorDigits) - Math.pow(10, maxDivisorDigits - 1)));

      // Ensure the divisor is not zero
      while (divisor === 0) {
        divisor = Math.floor(Math.pow(10, maxDivisorDigits - 1) + Math.random() * (Math.pow(10, maxDivisorDigits) - Math.pow(10, maxDivisorDigits - 1)));
      }

      // Generate a random dividend that is divisible by the divisor
      dividend = divisor * Math.floor(Math.pow(10, maxDividendDigits - maxDivisorDigits - 1) + Math.random() * (Math.pow(10, maxDividendDigits - maxDivisorDigits) - Math.pow(10, maxDividendDigits - maxDivisorDigits - 1)));
      quotient = dividend / divisor;
    } else {
      // Generate a random dividend within the specified range
      dividend = Math.floor(Math.pow(10, maxDividendDigits - 1) + Math.random() * (Math.pow(10, maxDividendDigits) - Math.pow(10, maxDividendDigits - 1)));

      // Generate a random divisor within the specified range
      divisor = Math.floor(Math.pow(10, maxDivisorDigits - 1) + Math.random() * (Math.pow(10, maxDivisorDigits) - Math.pow(10, maxDivisorDigits - 1)));

      // Ensure the divisor is not zero
      while (divisor === 0) {
        divisor = Math.floor(Math.pow(10, maxDivisorDigits - 1) + Math.random() * (Math.pow(10, maxDivisorDigits) - Math.pow(10, maxDivisorDigits - 1)));
      }

      quotient = dividend / divisor;
    }

    return { dividend, divisor, quotient };
  }

  generateDivisions() {
    const { dividendDigits, divisorDigits, resultType, size } = this.divisionsForm.value;

    if (!dividendDigits || !divisorDigits || !resultType || !size)
      return;

    this.divisions = [];

    for (let i = 0; i < size; i++) {
      const exercise: Division = this.generateDivision(dividendDigits, divisorDigits, resultType == 'exact');
      this.divisions.push(exercise);
    }
  }

  toggleName() {
    const val = this.divisionsForm.get('name')?.value;
    if (!val) {
      this.divisionsForm.get('name')?.setValue(true);
    } else {
      this.divisionsForm.get('name')?.setValue(false);
    }
  }

  toggleGrade() {
    const val = this.divisionsForm.get('grade')?.value;
    if (!val) {
      this.divisionsForm.get('grade')?.setValue(true);
    } else {
      this.divisionsForm.get('grade')?.setValue(false);
    }
  }

  toggleDate() {
    const val = this.divisionsForm.get('date')?.value;
    if (!val) {
      this.divisionsForm.get('date')?.setValue(true);
    } else {
      this.divisionsForm.get('date')?.setValue(false);
    }
  }

  changeAddend(index: number) {
    const { dividendDigits, divisorDigits, resultType, size } = this.divisionsForm.value;

    if (!dividendDigits || !divisorDigits || !resultType || !size)
      return;

    const exercise: Division = this.generateDivision(dividendDigits, divisorDigits, resultType == 'exact');

    this.divisions[index] = exercise;
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    this.pdfService.createAndDownloadFromHTML("divisions", `Division`);
    this.pdfService.createAndDownloadFromHTML("divisions-solution", `Division - Solucion`);
  }
}
