import { Component, OnInit, inject } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { WordSearchResult } from '../../lib';
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
import { shuffle } from 'lodash';
import { LevelEntry } from '../../interfaces/level-entry';
import { TopicEntry } from '../../interfaces/topic-entry';
import { VocabularyEntry } from '../../interfaces/vocabulary-entry';
import { WORD_LISTS } from '../../data/word-lists';
import { TOPICS } from '../../data/topics';

@Component({
  selector: 'app-wordsearch',
  standalone: true,
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
  styleUrl: './wordsearch.component.scss'
})
export class WordsearchComponent implements OnInit {

  gamesService = inject(GamesService);
  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  wordsearch: WordSearchResult | null = null;
  includedWords: string[] = [];
  wordLists: VocabularyEntry[] = WORD_LISTS;
  topics: TopicEntry[] = TOPICS;
  levels: LevelEntry[] = [
    {
      id: 1,
      level: 'Primaria'
    },
    {
      id: 2,
      level: 'Secundaria'
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
    this.userSettingsService.getSettings().subscribe(settings => {
      this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
      this.schoolName = settings.schoolName;
    });
  }

  generateWordSearch() {
    const { words, level, topic, size } = this.wsForm.value;
    
    if (!level || !topic || !size)
      return;
    
    const list = this.wordLists.find(l => l.level_id == level && l.topic_id == topic);

    if (!list)
      return;

    const selection: string[] = shuffle(list.vocabulary).slice(0, size);

    const longerWord = selection.reduce((l, n) => n.length > l ? n.length : l, 0) + 3;
    this.wordsearch = this.gamesService.generateWordSearch(selection, { w: longerWord, h: longerWord });
    this.includedWords = selection.filter(w => !this.wordsearch?.unplaced.includes(w));
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
    const topic = this.topics.find(t => t.id == this.wsForm.get('topic')?.value);
    return topic ? topic.topic : '';
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    this.pdfService.createAndDownloadFromHTML("wordsearch", `Sopa de Letras - ${this.topicName()}`);
  }
}
