import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings.service';
import { PdfService } from '../../services/pdf.service';
import { shuffle } from 'lodash';
import { formatNumber } from '@angular/common';

@Component({
	selector: 'app-subtraction',
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
		MatRadioModule,
	],
	templateUrl: './subtraction.component.html',
	styleUrl: './subtraction.component.scss',
})
export class SubtractionComponent implements OnInit {
	fb = inject(FormBuilder);
	userSettingsService = inject(UserSettingsService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	subtractions: number[][] = [];

	subtractionsForm = this.fb.group({
		title: ['Resta'],
		subtractionType: ['unsigned'],
		subtrahendQty: [2, Validators.min(2)],
		orientation: ['vertical'],
		results: ['positive'],
		minDigits: [2],
		maxDigits: [2],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	ngOnInit() {
		this.userSettingsService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// this.schoolName = settings.schoolName;
		});
	}

	generateNumber(min: number, max: number): number {
		const digits =
			min === max ? min : Math.round(Math.random() * (max - min)) + min;
		let str =
			this.subtractionsForm.get('subtractionType')?.value === 'signed'
				? Math.round(Math.random())
					? ''
					: '-'
				: '';

		for (let i = 0; i < digits; i++) {
			if (i === 0) {
				str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])[0];
			} else {
				str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])[0];
			}
		}

		return parseInt(str);
	}

	generateSubtractions() {
		const { subtrahendQty, minDigits, maxDigits, size } =
			this.subtractionsForm.value;

		if (!subtrahendQty || !minDigits || !maxDigits || !size) return;

		this.subtractions = [];

		for (let i = 0; i < size; i++) {
			const subtraction: number[] = [];
			for (let j = 0; j < subtrahendQty; j++) {
				subtraction.push(this.generateNumber(minDigits, maxDigits));
			}
			if (this.subtractionsForm.get('results')?.value === 'positive') {
				subtraction.sort((a, b) => b - a);
			}
			this.subtractions.push(subtraction);
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

	changeSustrahend(index: number) {
		const { subtrahendQty, minDigits, maxDigits, size } =
			this.subtractionsForm.value;

		if (!subtrahendQty || !minDigits || !maxDigits || !size) return;

		const subtraction: number[] = [];
		for (let j = 0; j < subtrahendQty; j++) {
			subtraction.push(this.generateNumber(minDigits, maxDigits));
		}

		if (this.subtractionsForm.get('results')?.value === 'positive') {
			subtraction.sort((a, b) => b - a);
		}
		this.subtractions[index] = subtraction;
	}

	calculate(arr: number[]) {
		let result = arr[0] - arr[1];

		for (let i = 2; i < arr.length; i++) {
			result -= arr[i];
		}

		return formatNumber(result, 'en');
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		const title = this.subtractionsForm.get('title')?.value || '';
		this.pdfService.createAndDownloadFromHTML('subtractions', `${title}`);
		this.pdfService.createAndDownloadFromHTML(
			'subtractions-solution',
			`${title} - Solucion`,
		);
	}

	get orientation(): string {
		return this.subtractionsForm.get('orientation')?.value || 'horizontal';
	}
}
