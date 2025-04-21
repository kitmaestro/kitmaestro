import { Component, OnInit, inject } from '@angular/core';
import { GamesService } from '../../../core/services/games.service';
import { CrossWordLayout } from '../../../core/lib';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserSettingsService } from '../../../core/services/user-settings.service';
import { PdfService } from '../../../core/services/pdf.service';
import { shuffle } from 'lodash';
import { LevelEntry } from '../../../core/interfaces/level-entry';
import { TopicEntry } from '../../../core/interfaces/topic-entry';
import { VocabularyEntry } from '../../../core/interfaces/vocabulary-entry';
import { WORD_LISTS } from '../../../core/data/word-lists';
import { TOPICS } from '../../../core/data/topics';
import { WORD_CLUES } from '../../../core/data/word-clues';

@Component({
	selector: 'app-crosswords',
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
	templateUrl: './crosswords.component.html',
	styleUrl: './crosswords.component.scss',
})
export class CrosswordsComponent implements OnInit {
	gamesService = inject(GamesService);
	fb = inject(FormBuilder);
	userSettingsService = inject(UserSettingsService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

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

	ngOnInit() {
		this.userSettingsService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// this.schoolName = settings.schoolName;
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
