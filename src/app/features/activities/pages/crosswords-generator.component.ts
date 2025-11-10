import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { GamesService } from '../../../core/services/games.service';
import { CrossWordLayout } from '../../../core/lib';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../../core/services/pdf.service';
import { shuffle } from 'lodash';
import { LevelEntry } from '../../../core';
import { TopicEntry } from '../../../core';
import { VocabularyEntry } from '../../../core';
import { WORD_LISTS } from '../../../core/data/word-lists';
import { TOPICS } from '../../../core/data/topics';
import { WORD_CLUES } from '../../../core/data/word-clues';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-crosswords',
	imports: [
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
		<div style="margin-bottom: 24px">
			<div>
				<h2>Generador de Crucigramas</h2>
			</div>
			<div>
				<form
					[formGroup]="crossWordForm"
					(ngSubmit)="generateCrossWord()"
				>
					<div style="display: flex; gap: 16px;">
						<div style="min-width: 25%; flex: 1 1 auto;">
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
						<div style="min-width: 25%; flex: 1 1 auto;">
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
						<div style="min-width: 25%; flex: 1 1 auto;">
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
					</div>
					<div style="margin-bottom: 12px;">
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
					@if (crossword) {
						<button
							type="button"
							(click)="print()"
							style="margin-right: 12px"
							mat-flat-button
							color="accent"
						>
							Descargar PDF
						</button>
					}
					<button type="submit" mat-button color="primary">
						{{ crossword ? 'Regenerar' : 'Generar' }}
					</button>
				</form>
			</div>
		</div>

		@if (crossword) {
			<div
				style="
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 24px;
					margin-top: 24px;
				"
			>
				<div class="page" id="crossword" style="padding: 12px">
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
							Crucigrama de {{ topicName() }}
						</h5>
					</div>
					<div style="margin-bottom: 42px; display: flex">
						@if (crossWordForm.get('name')?.value === true) {
							<div><b>Nombre</b>:</div>
							<div class="blank"></div>
						}
						@if (crossWordForm.get('grade')?.value === true) {
							<div style="margin-left: 12px"><b>Grado</b>:</div>
							<div class="blank"></div>
						}
						@if (crossWordForm.get('date')?.value === true) {
							<div style="margin-left: 12px"><b>Fecha</b>:</div>
							<div style="max-width: 20%" class="blank"></div>
						}
					</div>
					<div
						style="
							display: grid;
							grid-template-columns: 1fr;
							gap: 16px;
						"
					>
						<div class="board">
							@for (
								line of crossword.table;
								track line;
								let y = $index
							) {
								<div class="line">
									@for (
										tile of line;
										track tile;
										let x = $index
									) {
										<div
											class="tile"
											[class.empty]="tile === '-'"
											[style]="
												'width:' +
												(100 / crossword.cols).toFixed(
													2
												) +
												'%'
											"
										>
											<span class="text">{{
												tile === '-'
													? ''
													: markIfAble(x, y)
											}}</span>
										</div>
									}
								</div>
							}
						</div>
						<div>
							<h4 style="font-weight: bold">Pistas</h4>
							<div
								style="
									display: grid;
									grid-template-columns: 1fr 1fr;
								"
							>
								<div>
									<h5>Horizontal</h5>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											word of crossword.result;
											track $index
										) {
											@if (
												word.orientation === 'across'
											) {
												<li
													style="
														padding: 6px 12px 6px
															0px;
														font-size: 14px;
													"
												>
													{{ word.position }}-
													{{ word.clue }}
												</li>
											}
										}
									</ul>
								</div>
								<div>
									<h5>Vertical</h5>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											word of crossword.result;
											track $index
										) {
											@if (word.orientation === 'down') {
												<li
													style="
														padding: 6px 12px 6px
															0px;
														font-size: 14px;
													"
												>
													{{ word.position }}-
													{{ word.clue }}
												</li>
											}
										}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="page" id="crossword-solution" style="padding: 12px">
					<div style="text-align: center; margin-bottom: 24px">
						<h2>
							Crucigrama de {{ topicName() }} - Soluci&oacute;n
						</h2>
					</div>
					<div
						style="
							display: grid;
							grid-template-columns: 1fr;
							gap: 16px;
						"
					>
						<div class="board">
							@for (line of crossword.table; track $index) {
								<div class="line">
									@for (tile of line; track $index) {
										<div
											class="tile"
											[class.empty]="tile === '-'"
											[style]="
												'width:' +
												(100 / crossword.cols).toFixed(
													2
												) +
												'%'
											"
										>
											{{ tile !== '-' ? tile : '' }}
										</div>
									}
								</div>
							}
						</div>
						<div>
							<h4 style="font-weight: bold">Palabras a Buscar</h4>
							<div
								style="
									display: grid;
									grid-template-columns: 1fr 1fr;
								"
							>
								<div>
									<h5>Horizontal</h5>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											word of crossword.result;
											track $index
										) {
											@if (
												word.orientation === 'across'
											) {
												<li
													style="
														padding: 6px 12px 6px
															0px;
														font-size: 14px;
													"
												>
													{{ word.position }}-
													{{
														word.answer.toUpperCase()
													}}
												</li>
											}
										}
									</ul>
								</div>
								<div>
									<h5>Vertical</h5>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											word of crossword.result;
											track $index
										) {
											@if (word.orientation === 'down') {
												<li
													style="
														padding: 6px 12px 6px
															0px;
														font-size: 14px;
													"
												>
													{{ word.position }}-
													{{
														word.answer.toUpperCase()
													}}
												</li>
											}
										}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
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
			position: relative;

			.text {
				color: #777;
				font-size: 8pt;
				position: absolute;
				top: 2px;
				left: 4px;
			}
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
			background: #fff;
			border: 1px solid #ddd;
		}

		mat-form-field {
			width: 100%;
		}

		.empty {
			background-color: black;
		}
	`,
})
export class CrosswordsGeneratorComponent implements OnInit, OnDestroy {
	gamesService = inject(GamesService);
	fb = inject(FormBuilder);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);
	#store = inject(Store);

	teacherName = '';
	schoolName = '';
	crossword: CrossWordLayout | null = null;
	wordLists: VocabularyEntry[] = WORD_LISTS;
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

	crossWordForm = this.fb.group({
		level: [1],
		topic: [1],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	destroy$ = new Subject<void>();

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit() {
		this.#store
			.select(selectAuthUser)
			.pipe(
				filter((user) => !!user),
				takeUntil(this.destroy$),
			)
			.subscribe((settings) => {
				this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
				this.schoolName = settings.schoolName;
			});
	}

	generateCrossWord() {
		const { level, topic, size } = this.crossWordForm.value;

		if (!level || !topic || !size) return;

		const list = this.wordLists.find(
			(l) => l.level_id === level && l.topic_id === topic,
		);

		if (!list) return;

		const selection: string[] =
			size >= list.vocabulary.length
				? shuffle(list.vocabulary)
				: shuffle(list.vocabulary).slice(0, size);
		this.crossword = this.gamesService.generateCrossWord(
			selection.map((s) => ({
				clue: WORD_CLUES.find((c) => c.answer === s)?.clue || '',
				answer: s,
			})),
		);
		console.log(this.crossword);
	}

	toggleName() {
		const val = this.crossWordForm.get('name')?.value;
		if (!val) {
			this.crossWordForm.get('name')?.setValue(true);
		} else {
			this.crossWordForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.crossWordForm.get('grade')?.value;
		if (!val) {
			this.crossWordForm.get('grade')?.setValue(true);
		} else {
			this.crossWordForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.crossWordForm.get('date')?.value;
		if (!val) {
			this.crossWordForm.get('date')?.setValue(true);
		} else {
			this.crossWordForm.get('date')?.setValue(false);
		}
	}

	markIfAble(x: number, y: number): string {
		if (this.crossword) {
			const answer = this.crossword.result.find(
				(r) => r.startx === x + 1 && r.starty === y + 1,
			);
			if (answer) {
				return answer.position.toString();
			}
			return '';
		}
		return '';
	}

	topicName(): string {
		const topic = this.topics.find(
			(t) => t.id === this.crossWordForm.get('topic')?.value,
		);
		return topic ? topic.topic : '';
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		this.pdfService.createAndDownloadFromHTML(
			'crossword',
			`Crucigrama de ${this.topicName()}`,
		);
		this.pdfService.createAndDownloadFromHTML(
			'crossword-solution',
			`Crucigrama de ${this.topicName()} - Solucion`,
		);
	}
}
