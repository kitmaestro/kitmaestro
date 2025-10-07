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
import { GamesService } from '../../../core/services/games.service';
import { WordSearchResult } from '../../../core/lib';
import { UserService } from '../../../core/services/user.service';
import { PdfService } from '../../../core/services/pdf.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { shuffle } from 'lodash';
import { TopicEntry } from '../../../core/interfaces/topic-entry';
import { VocabularyEntry } from '../../../core/interfaces/vocabulary-entry';
import { WORD_LISTS } from '../../../core/data/word-lists';
import { TOPICS } from '../../../core/data/topics';
import { ClassSection } from '../../../core/interfaces/class-section';

@Component({
	selector: 'app-wordsearch',
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
				<h2 mat-card-title>Generador de Sopas de Letras</h2>
			</mat-card-header>
			<mat-card-content>
				<form [formGroup]="wsForm" (ngSubmit)="generateWordSearch()">
					<div style="display: flex; gap: 16px">
						<div style="min-width: 25%">
							<mat-form-field appearance="outline">
								<mat-label>Curso</mat-label>
								<mat-select
									formControlName="section"
									(selectionChange)="onSectionSelect($event)"
								>
									@for (option of sections; track option._id) {
										<mat-option [value]="option._id">{{
											option.name
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
					@if (wordsearch) {
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
						{{ wordsearch ? "Regenerar" : "Generar" }}
					</button>
				</form>
			</mat-card-content>
		</mat-card>

		@if (wordsearch) {
			<mat-card>
				<mat-card-content>
					<div class="page" id="wordsearch" style="padding: 12px">
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
								Sopa de Letras - {{ topicName() }}
							</h5>
						</div>
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
							style="
								display: grid;
								grid-template-columns: 2fr 1fr;
								gap: 16px;
							"
						>
							<div class="board">
								@for (line of wordsearch.grid; track $index) {
									<div class="line">
										@for (tile of line; track $index) {
											<div
												class="tile"
												[style]="
													'width:' +
													(100 / line.length).toFixed(2) +
													'%'
												"
											>
												{{ tile }}
											</div>
										}
									</div>
								}
							</div>
							<div>
								<h4 style="font-weight: bold">Palabras a Buscar</h4>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (word of includedWords; track $index) {
										<li
											style="
												padding: 6px 12px 6px 0px;
												font-size: 14px;
											"
										>
											{{ word.toUpperCase() }}
										</li>
									}
								</ul>
								<!-- <h2>Palabras Excluidas</h2>
								<mat-list>
									@for(word of wordsearch.unplaced; track $index) {
										<mat-list-item>{{ word.toUpperCase() }}</mat-list-item>
									}
								</mat-list> -->
							</div>
						</div>
					</div>
				</mat-card-content>
			</mat-card>
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
export class WordsearchGeneratorComponent implements OnInit {
	private gamesService = inject(GamesService);
	private fb = inject(FormBuilder);
	private UserService = inject(UserService);
	private pdfService = inject(PdfService);
	private sb = inject(MatSnackBar);
	private sectionService = inject(ClassSectionService);

	teacherName = '';
	schoolName = '';
	wordsearch: WordSearchResult | null = null;
	includedWords: string[] = [];
	wordLists: VocabularyEntry[] = WORD_LISTS;
	topics: TopicEntry[] = TOPICS;
	sections: ClassSection[] = [];

	wsForm = this.fb.group({
		words: [0],
		level: [1],
		section: [''],
		topic: [1],
		size: [10, [Validators.min(4), Validators.max(20)]],
		name: [false],
		grade: [false],
		date: [false],
	});

	loadSections() {
		this.sectionService.findSections().subscribe({
			next: (sections) => {
				this.sections = sections;
				if (sections.length) {
					this.onSectionSelect({ value: sections[0]?._id });
				}
			},
		});
	}

	ngOnInit() {
		this.UserService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			this.loadSections();
		});
	}

	onSectionSelect(event: any) {
		this.schoolName =
			this.sections.find((s) => s._id === event.value)?.school.name || '';
	}

	generateWordSearch() {
		const { level, topic, size } = this.wsForm.value;

		if (!level || !topic || !size) return;

		const list = this.wordLists.find(
			(l) => l.level_id === level && l.topic_id === topic,
		);

		if (!list) return;

		const selection: string[] = shuffle(list.vocabulary).slice(0, size);

		const longerWord =
			selection.reduce((l, n) => (n.length > l ? n.length : l), 0) + 3;
		this.wordsearch = this.gamesService.generateWordSearch(selection, {
			w: longerWord,
			h: longerWord,
		});
		this.includedWords = selection.filter(
			(w) => !this.wordsearch?.unplaced.includes(w),
		);
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

	topicName(): string {
		const topic = this.topics.find(
			(t) => t.id === this.wsForm.get('topic')?.value,
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
			'wordsearch',
			`Sopa de Letras - ${this.topicName()}`,
		);
	}
}
