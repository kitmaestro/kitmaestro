import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sudoku } from 'sudoku-gen/dist/types/sudoku.type';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf.service';
import { GamesService } from '../../../core/services/games.service';
import { UserSettingsService } from '../../../core/services/user-settings.service';

@Component({
	selector: 'app-sudoku',
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatChipsModule,
		MatSnackBarModule,
	],
	templateUrl: './sudoku.component.html',
	styleUrl: './sudoku.component.scss',
})
export class SudokuComponent implements OnInit {
	gamesService = inject(GamesService);
	fb = inject(FormBuilder);
	pdfService = inject(PdfService);
	userSettingsService = inject(UserSettingsService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	sudokuLevel = this.fb.control('easy');
	sudokuTitle = this.fb.control('Sudoku');
	sudokuIncludeSolution = this.fb.control(true);
	sudokuFields = this.fb.group({
		name: [false],
		grade: [false],
		date: [false],
	});

	sudoku: Sudoku | null = null;
	board: (number | null)[][] = [];
	solvedBoard: (number | null)[][] = [];

	levels = [
		{
			level: 'easy',
			label: 'Facil',
		},
		{
			level: 'medium',
			label: 'Medio',
		},
		{
			level: 'hard',
			label: 'Dificil',
		},
		{
			level: 'expert',
			label: 'Experto',
		},
	];

	ngOnInit(): void {
		this.userSettingsService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// TODO: Fix school name
			// this.schoolName = settings.schoolName;
		});
	}

	generate() {
		this.sudoku = this.gamesService.generateSudoku(
			this.sudokuLevel.value as 'easy' | 'medium' | 'hard' | 'expert',
		);
		this.board = this.gamesService.sudoku_string_to_board(
			this.sudoku.puzzle,
		);
		this.solvedBoard = this.gamesService.sudoku_string_to_board(
			this.sudoku.solution,
		);
	}

	toggleName() {
		const val = this.sudokuFields.get('name')?.value;
		if (!val) {
			this.sudokuFields.get('name')?.setValue(true);
		} else {
			this.sudokuFields.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.sudokuFields.get('grade')?.value;
		if (!val) {
			this.sudokuFields.get('grade')?.setValue(true);
		} else {
			this.sudokuFields.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.sudokuFields.get('date')?.value;
		if (!val) {
			this.sudokuFields.get('date')?.setValue(true);
		} else {
			this.sudokuFields.get('date')?.setValue(false);
		}
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		this.pdfService.createAndDownloadFromHTML(
			'sudoku',
			`${this.sudokuTitle.value}`,
		);
		this.pdfService.createAndDownloadFromHTML(
			'sudoku-solution',
			`${this.sudokuTitle.value}-Solucion`,
		);
	}
}
