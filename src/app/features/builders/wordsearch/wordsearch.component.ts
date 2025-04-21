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
import { UserSettingsService } from '../../../core/services/user-settings.service';
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
	templateUrl: './wordsearch.component.html',
	styleUrl: './wordsearch.component.scss',
})
export class WordsearchComponent implements OnInit {
	private gamesService = inject(GamesService);
	private fb = inject(FormBuilder);
	private userSettingsService = inject(UserSettingsService);
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
		this.userSettingsService.getSettings().subscribe((settings) => {
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
