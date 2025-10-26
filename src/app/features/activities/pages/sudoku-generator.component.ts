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
import { UserService } from '../../../core/services/user.service';

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
	template: `
		<div>
			<div>
				<h2>Generador de Sudoku</h2>
			</div>
			<div>
				<div
					style="
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						gap: 12px;
						margin-bottom: 12px;
					"
				>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Nivel</mat-label>
							<mat-select [formControl]="sudokuLevel">
								@for (opt of levels; track $index) {
									<mat-option [value]="opt.level">{{
										opt.label
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>T&iacute;tulo</mat-label>
							<input
								type="text"
								matInput
								[formControl]="sudokuTitle"
							/>
						</mat-form-field>
					</div>
					<div>
						<mat-label>Campos a Incluir:</mat-label>
						<mat-chip-set>
							<mat-chip-option
								[selected]="true"
								(selectionChange)="toggleName()"
								>Nombre</mat-chip-option
							>
							<mat-chip-option
								[selected]="true"
								(selectionChange)="toggleGrade()"
								>Grado</mat-chip-option
							>
							<mat-chip-option
								[selected]="true"
								(selectionChange)="toggleDate()"
								>Fecha</mat-chip-option
							>
						</mat-chip-set>
					</div>
				</div>
				@if (board.length) {
					<button
						type="button"
						(click)="print()"
						style="margin-right: 12px"
						mat-flat-button
						color="accent"
					>
						<mat-icon>download</mat-icon>
						Descargar
					</button>
				}
				<button
					mat-button
					color="primary"
					type="button"
					(click)="generate()"
				>
					<mat-icon>bolt</mat-icon>
					{{ board.length ? 'Regenerar' : 'Generar' }}
				</button>
			</div>
		</div>

		@if (board.length) {
			<div
				style="
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 24px;
					margin-top: 24px;
				"
			>
				<div>
					<div>
						<div class="page" id="sudoku" style="padding: 12px">
							<div style="text-align: center">
								<h3
									style="
										margin-bottom: 0;
										font-weight: bold;
										font-size: large;
									"
								>
									{{ schoolName }}
								</h3>
								<h4 style="margin-bottom: 0">
									{{ teacherName }}
								</h4>
								<h5
									style="font-size: medium; margin-bottom: 32px"
								>
									{{ sudokuTitle.value }}
								</h5>
							</div>
							<div style="margin-bottom: 32px; display: flex">
								@if (sudokuFields.get('name')?.value === true) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (
									sudokuFields.get('grade')?.value === true
								) {
									<div style="margin-left: 12px">
										<b>Grado</b>:
									</div>
									<div class="blank"></div>
								}
								@if (sudokuFields.get('date')?.value === true) {
									<div style="margin-left: 12px">
										<b>Fecha</b>:
									</div>
									<div
										style="max-width: 20%"
										class="blank"
									></div>
								}
							</div>
							<div
								style="
									width: 80%;
									margin-top: 32px;
									margin-left: auto;
									margin-right: auto;
									display: grid;
									gap: 0;
									border: 1px solid black;
									grid-template-columns: 1fr 1fr 1fr;
								"
							>
								@for (box of board; track $index) {
									<div
										style="
											display: grid;
											gap: 0;
											border: 1px solid black;
											grid-template-columns: 1fr 1fr 1fr;
										"
									>
										@for (tile of box; track $index) {
											<div
												style="
													font-size: 16pt;
													display: flex;
													padding: 12px;
													align-items: center;
													justify-content: center;
													border: 1px solid black;
													aspect-ratio: 1/1;
												"
											>
												{{ tile }}
											</div>
										}
									</div>
								}
							</div>
						</div>
					</div>
				</div>
				@if (sudokuIncludeSolution.value) {
					<div>
						<div>
							<div
								class="page"
								id="sudoku-solution"
								style="padding: 12px"
							>
								<div
									style="text-align: center; margin-bottom: 24px"
								>
									<h2>
										{{ sudokuTitle.value }} -
										Soluci&oacute;n
									</h2>
								</div>
								<div
									style="
										width: 80%;
										margin-left: auto;
										margin-right: auto;
										display: grid;
										gap: 0;
										border: 1px solid black;
										grid-template-columns: 1fr 1fr 1fr;
									"
								>
									@for (
										box of solvedBoard;
										track box;
										let i = $index
									) {
										<div
											style="
												display: grid;
												gap: 0;
												border: 1px solid black;
												grid-template-columns: 1fr 1fr 1fr;
											"
										>
											@for (tile of box; track $index) {
												@if (
													board[i][$index] === null
												) {
													<div
														style="
															font-size: 14pt;
															font-weight: bold;
															display: flex;
															color: #00acc1;
															padding: 12px;
															align-items: center;
															justify-content: center;
															border: 1px solid black;
															aspect-ratio: 1/1;
														"
													>
														{{ tile }}
													</div>
												} @else {
													<div
														style="
															font-size: 14pt;
															display: flex;
															padding: 12px;
															align-items: center;
															justify-content: center;
															border: 1px solid black;
															aspect-ratio: 1/1;
														"
													>
														{{ tile }}
													</div>
												}
											}
										</div>
									}
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		}
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.blank {
			border-bottom: 1px solid black;
			flex: 1 1 auto;
			width: 100%;
		}

		.page {
			width: 8in;
			margin: 0 auto;
		}
	`,
})
export class SudokuGeneratorComponent implements OnInit {
	gamesService = inject(GamesService);
	fb = inject(FormBuilder);
	pdfService = inject(PdfService);
	UserService = inject(UserService);
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
		this.UserService.getSettings().subscribe((settings) => {
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
