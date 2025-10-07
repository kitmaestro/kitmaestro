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
import { shuffle } from 'lodash';
import { UserService } from '../../../core/services/user.service';
import { PdfService } from '../../../core/services/pdf.service';
import { GamesService } from '../../../core/services/games.service';
import { LevelEntry } from '../../../core/interfaces/level-entry';
import { WordEntry } from '../../../core/interfaces/word-entry';
import { WORD_ENTRIES } from '../../../core/data/word-entries';

@Component({
	selector: 'app-synonyms',
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
	template: `
				<mat-card style="margin-bottom: 24px">
			<mat-card-header>
				<h2 mat-card-title>Generador de Ejercicios con Sin&oacute;nimos</h2>
			</mat-card-header>
			<mat-card-content>
				<form [formGroup]="synonymsForm" (ngSubmit)="generateSynonyms()">
					<div style="display: flex; gap: 16px">
						<div style="min-width: 25%">
							<mat-form-field appearance="outline">
								<mat-label>Nivel</mat-label>
								<mat-select formControlName="level">
									@for (option of levels; track option.id) {
										<mat-option [value]="option.id">{{
											option.level
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div style="min-width: 25%">
							<mat-form-field appearance="outline">
								<mat-label>Tema</mat-label>
								<mat-select formControlName="topic">
									@for (option of topics; track $index) {
										<mat-option [value]="option">{{
											option
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div style="min-width: 25%">
							<mat-form-field appearance="outline">
								<mat-label>Cantidad de Palabras</mat-label>
								<input
									matInput
									formControlName="size"
									type="number"
									min="1"
									max="25"
								/>
							</mat-form-field>
						</div>
						<div style="min-width: 25%">
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
					@if (synonyms.length) {
						<div
							style="
								padding: 20px;
								background-color: #46a7f5;
								color: white;
								margin-bottom: 15px;
							"
						>
							Para reemplazar cualquiera de las palabras generadas, haz
							doble click sobre ella. Tambien puedes hacer un click a
							cualquier respuesta para ver otras respuestas
							v&aacute;lidas.
						</div>
					}
					@if (synonyms.length) {
						<button
							type="button"
							(click)="print()"
							style="margin-right: 12px"
							mat-raised-button
							color="accent"
						>
							Imprimir
						</button>
					}
					<button type="submit" mat-raised-button color="primary">
						{{ synonyms.length ? "Regenerar" : "Generar" }}
					</button>
				</form>
			</mat-card-content>
		</mat-card>

		@if (synonyms.length) {
			<div
				style="
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 24px;
					margin-top: 24px;
				"
			>
				<mat-card>
					<mat-card-content>
						<div class="page" id="synonyms" style="padding: 12px">
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
								<h4 style="margin-bottom: 0">{{ teacherName }}</h4>
								<h5 style="font-size: medium; margin-bottom: 24px">
									Escribe un Sin&oacute;nimo
								</h5>
							</div>
							<br />
							<div style="margin-bottom: 42px; display: flex">
								@if (synonymsForm.get("name")?.value === true) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (synonymsForm.get("grade")?.value === true) {
									<div style="margin-left: 12px"><b>Grado</b>:</div>
									<div class="blank"></div>
								}
								@if (synonymsForm.get("date")?.value === true) {
									<div style="margin-left: 12px"><b>Fecha</b>:</div>
									<div style="max-width: 20%" class="blank"></div>
								}
							</div>
							<div
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (line of synonyms; track $index) {
									<div
										style="
											display: flex;
											justify-content: space-between;
										"
									>
										<div
											(dblclick)="changeWord($index)"
											style="margin-left: 12px"
										>
											<b
												>{{
													($index + 1)
														.toString()
														.padStart(2, "0")
												}})
												<span
													style="
														letter-spacing: 3px;
														font-family: serif;
													"
													>{{ line.word.toUpperCase() }}</span
												></b
											>:
										</div>
										<div
											style="max-width: 50%; margin-left: auto"
											class="blank"
										></div>
									</div>
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
				<mat-card>
					<mat-card-content>
						<div class="page" id="synonyms-solution" style="padding: 12px">
							<div style="text-align: center; margin-bottom: 24px">
								<h4 style="margin-bottom: 0">
									Escribe un Sin&oacute;nimo
								</h4>
								<h5 style="font-size: medium; margin-bottom: 24px">
									Hoja de Respuestas
								</h5>
							</div>
							<div
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (line of synonyms; track $index) {
									<div
										style="
											display: flex;
											justify-content: space-between;
										"
									>
										<div style="margin-left: 12px">
											<b
												>{{
													($index + 1)
														.toString()
														.padStart(2, "0")
												}})
												<span
													style="
														letter-spacing: 3px;
														font-family: serif;
													"
													>{{ line.word.toUpperCase() }}</span
												></b
											>:
										</div>
										<div
											(click)="changeSolution($index)"
											style="
												max-width: 50%;
												margin-left: auto;
												text-align: center;
											"
											class="blank"
										>
											{{
												line.synonyms[
													solutionShown[$index]
												].toUpperCase()
											}}
										</div>
									</div>
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
			</div>
		}

	`,
	styles: `
				.board {
			display: flex;
			flex-direction: column;
			width: fit-content;
			margin: 0 auto;
		}

		.line {
			display: flex;
		}

		.tile {
			border: 1px solid #aaa;
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 40px;
			aspect-ratio: 1/1;
			height: auto;
			text-transform: uppercase;
		}

		table {
			border-collapse: collapse;
			width: min-content;

			td {
				border: 1px solid black;
				padding: 12px 16px;
				width: fit-content;
				text-transform: uppercase;
			}
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

		mat-form-field {
			width: 100%;
		}

	`,
})
export class SynonymsGeneratorComponent implements OnInit {
	gamesService = inject(GamesService);
	fb = inject(FormBuilder);
	UserService = inject(UserService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	synonyms: WordEntry[] = [];
	solutionShown: number[] = [];
	topics: string[] = WORD_ENTRIES.map((entry) => entry.categories)
		.flat()
		.filter((v, i, a) => a.indexOf(v) === i);
	levels: LevelEntry[] = [
		{
			id: 1,
			level: 'Muy Facil',
		},
		{
			id: 2,
			level: 'Facil',
		},
		{
			id: 3,
			level: 'Normal',
		},
		{
			id: 4,
			level: 'Dificil',
		},
		{
			id: 5,
			level: 'Muy Dificil',
		},
	];

	synonymsForm = this.fb.group({
		words: [0],
		level: [1],
		topic: [''],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	ngOnInit() {
		this.UserService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// TODO: Fix school name
			// this.schoolName = settings.schoolName;
		});
	}

	generateSynonyms() {
		const { level, topic, size } = this.synonymsForm.value;

		if (!level || !size) return;

		const list = WORD_ENTRIES.filter(
			(e) =>
				e.level === level &&
				(topic === '' ? true : e.categories.includes(topic as string)),
		);

		if (!list) return;

		this.synonyms =
			size >= list.length ? shuffle(list) : shuffle(list).slice(0, size);
		this.synonyms.forEach((s) => this.solutionShown.push(0));
	}

	toggleName() {
		const val = this.synonymsForm.get('name')?.value;
		if (!val) {
			this.synonymsForm.get('name')?.setValue(true);
		} else {
			this.synonymsForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.synonymsForm.get('grade')?.value;
		if (!val) {
			this.synonymsForm.get('grade')?.setValue(true);
		} else {
			this.synonymsForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.synonymsForm.get('date')?.value;
		if (!val) {
			this.synonymsForm.get('date')?.setValue(true);
		} else {
			this.synonymsForm.get('date')?.setValue(false);
		}
	}

	changeWord(index: number) {
		const { level, topic, size } = this.synonymsForm.value;

		if (!level || !size) return;

		const target = this.synonyms[index];
		const list = WORD_ENTRIES.filter((l) =>
			l.level === level && topic === ''
				? true
				: l.categories.includes(topic as string),
		);

		if (!list) return;

		const available = list.filter((w) => w.id !== target.id);
		const randomWord = shuffle(available).pop();
		if (!randomWord) return;

		this.synonyms[index] = randomWord;
		this.solutionShown[index] = 0;
	}

	changeSolution(index: number) {
		const solutions = this.synonyms[index].synonyms.length;
		const current = this.solutionShown[index];
		if (current === solutions - 1) {
			this.solutionShown[index] = 0;
		} else {
			this.solutionShown[index]++;
		}
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		this.pdfService.createAndDownloadFromHTML('synonyms', `Sinonimos`);
		this.pdfService.createAndDownloadFromHTML(
			'synonyms-solution',
			`Sinonimos - Solucion`,
		);
	}
}
