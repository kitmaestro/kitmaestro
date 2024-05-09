import { Component, OnInit, inject } from '@angular/core';
import { GamesService } from '../../services/games.service';
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
import { WORD_LISTS } from '../../data/word-lists';
import { TOPICS } from '../../data/topics';

@Component({
  selector: 'app-word-scramble',
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
  templateUrl: './word-scramble.component.html',
  styleUrl: './word-scramble.component.scss'
})
export class WordScrambleComponent implements OnInit {

  gamesService = inject(GamesService);
  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  wordScramble: { scrambled: string, answer: string }[] = [];
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

  generateWordScramble() {
    const { level, topic, size } = this.wsForm.value;

    if (!level || !topic || !size)
      return;

    const list = WORD_LISTS.find(l => l.level_id == level && l.topic_id == topic);

    if (!list)
      return;

    const selection: string[] = size >= list.vocabulary.length ? shuffle(list.vocabulary) : shuffle(list.vocabulary).slice(0, size);

    this.wordScramble = selection.map(w => ({ scrambled: shuffle(w.split('')).join(''), answer: w }));
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

    if (!level || !topic || !size)
      return;

    const target = this.wordScramble[index];
    const list = WORD_LISTS.find(l => l.level_id == level && l.topic_id == topic);

    if (!list)
      return;

    const available = list.vocabulary.filter(w => !this.wordScramble.map(s => s.answer).includes(w));
    const randomWord = shuffle(available).pop();
    if (!randomWord)
      return;

    this.wordScramble[index] = { answer: randomWord, scrambled: shuffle(randomWord.split('')).join('') };
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    const topic = this.topics.find(t => t.id == this.wsForm.get('topic')?.value);
    this.pdfService.createAndDownloadFromHTML("wordscramble", `Palabras Revueltas - ${topic?.topic}`);
    this.pdfService.createAndDownloadFromHTML("wordscramble-solution", `Palabras Revueltas - ${topic?.topic} - Solucion`);
  }

}
