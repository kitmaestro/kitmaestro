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
import { GamesService } from '../../../core/services/games.service';
import { UserService } from '../../../core/services/user.service';
import { PdfService } from '../../../core/services/pdf.service';
import { shuffle } from 'lodash';
import { LevelEntry } from '../../../core/interfaces/level-entry';
import { TopicEntry } from '../../../core/interfaces/topic-entry';
import { WORD_LISTS } from '../../../core/data/word-lists';
import { TOPICS } from '../../../core/data/topics';

@Component({
	selector: 'app-word-scramble',
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
				<h2 mat-card-title>Generador de Palabras Revueltas</h2>
			</mat-card-header>
			<mat-card-content>
				<form [formGroup]="wsForm" (ngSubmit)="generateWordScramble()">
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
									@for (option of topics; track option.id) {
										<mat-option [value]="option.id">{{
											option.topic
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
					@if (wordScramble.length) {
						<div
							style="
								padding: 20px;
								background-color: #46a7f5;
								color: white;
								margin-bottom: 15px;
							"
						>
							Para reemplazar cualquiera de las palabras generadas, haz
							doble click sobre ella.
						</div>
					}
					@if (wordScramble.length) {
						<button
							type="button"
							(click)="print()"
							style="margin-right: 12px"
							mat-raised-button
							color="accent"
						>
							Exportar
						</button>
					}
					<button type="submit" mat-raised-button color="primary">
						{{ wordScramble.length ? "Regenerar" : "Generar" }}
					</button>
				</form>
			</mat-card-content>
		</mat-card>

		@if (wordScramble.length) {
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
						<div class="page" id="wordscramble" style="padding: 12px">
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
									Organiza Las Palabras
								</h5>
							</div>
							<br />
							<div style="margin-bottom: 42px; display: flex">
								@if (wsForm.get("name")?.value === true) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (wsForm.get("grade")?.value === true) {
									<div style="margin-left: 12px"><b>Grado</b>:</div>
									<div class="blank"></div>
								}
								@if (wsForm.get("date")?.value === true) {
									<div style="margin-left: 12px"><b>Fecha</b>:</div>
									<div style="max-width: 20%" class="blank"></div>
								}
							</div>
							<div
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (line of wordScramble; track $index) {
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
													>{{
														line.scrambled.toUpperCase()
													}}</span
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
						<div
							class="page"
							id="wordscramble-solution"
							style="padding: 12px"
						>
							<div style="text-align: center; margin-bottom: 24px">
								<h4 style="margin-bottom: 0">Organiza Las Palabras</h4>
								<h5 style="font-size: medium; margin-bottom: 24px">
									Hoja de Respuestas
								</h5>
							</div>
							<div
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (line of wordScramble; track $index) {
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
													>{{
														line.scrambled.toUpperCase()
													}}</span
												></b
											>:
										</div>
										<div
											style="
												max-width: 50%;
												margin-left: auto;
												text-align: center;
											"
											class="blank"
										>
											{{ line.answer.toUpperCase() }}
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
export class WordScrambleGeneratorComponent implements OnInit {
	gamesService = inject(GamesService);
	fb = inject(FormBuilder);
	UserService = inject(UserService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	wordScramble: { scrambled: string; answer: string }[] = [];
	topics: TopicEntry[] = TOPICS;
	levels: LevelEntry[] = [
		{
			id: 1,
			level: 'Primaria',
		},
		{
			id: 2,
			level: 'Secundaria',
		},
	];

	wsForm = this.fb.group({
		words: [0],
		level: [1],
		topic: [1],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	ngOnInit() {
		this.UserService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// TODO: fix school name
			// this.schoolName = settings.schoolName;
		});
	}

	generateWordScramble() {
		const { level, topic, size } = this.wsForm.value;

		if (!level || !topic || !size) return;

		const list = WORD_LISTS.find(
			(l) => l.level_id === level && l.topic_id === topic,
		);

		if (!list) return;

		const selection: string[] =
			size >= list.vocabulary.length
				? shuffle(list.vocabulary)
				: shuffle(list.vocabulary).slice(0, size);

		this.wordScramble = selection.map((w) => ({
			scrambled: shuffle(w.split('')).join(''),
			answer: w,
		}));
	}

	toggleName() {
		const val = this.wsForm.get('name')?.value;
		if (!val) {
			this.wsForm.get('name')?.setValue(true);
		} else {
			this.wsForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.wsForm.get('grade')?.value;
		if (!val) {
			this.wsForm.get('grade')?.setValue(true);
		} else {
			this.wsForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.wsForm.get('date')?.value;
		if (!val) {
			this.wsForm.get('date')?.setValue(true);
		} else {
			this.wsForm.get('date')?.setValue(false);
		}
	}

	changeWord(index: number) {
		const { level, topic, size } = this.wsForm.value;

		if (!level || !topic || !size) return;

		const target = this.wordScramble[index];
		const list = WORD_LISTS.find(
			(l) => l.level_id === level && l.topic_id === topic,
		);

		if (!list) return;

		const available = list.vocabulary.filter(
			(w) => !this.wordScramble.map((s) => s.answer).includes(w),
		);
		const randomWord = shuffle(available).pop();
		if (!randomWord) return;

		this.wordScramble[index] = {
			answer: randomWord,
			scrambled: shuffle(randomWord.split('')).join(''),
		};
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		const topic = this.topics.find(
			(t) => t.id === this.wsForm.get('topic')?.value,
		);
		this.pdfService.createAndDownloadFromHTML(
			'wordscramble',
			`Palabras Revueltas - ${topic?.topic}`,
		);
		this.pdfService.createAndDownloadFromHTML(
			'wordscramble-solution',
			`Palabras Revueltas - ${topic?.topic} - Solucion`,
		);
	}
}
