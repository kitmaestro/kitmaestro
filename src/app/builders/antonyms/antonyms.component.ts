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
import { WordEntry } from '../../interfaces/word-enty';
import { WORD_ENTRIES } from '../../data/word-entries';

@Component({
  selector: 'app-antonyms',
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
  templateUrl: './antonyms.component.html',
  styleUrl: './antonyms.component.scss'
})
export class AntonymsComponent implements OnInit {

  gamesService = inject(GamesService);
  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';
  antonyms: WordEntry[] = [];
  solutionShown: number[] = [];
  topics: string[] = WORD_ENTRIES.map(entry => entry.categories).flat().filter((v, i, a) => a.indexOf(v) === i);
  levels: LevelEntry[] = [
    {
      id: 1,
      level: 'Muy Facil'
    },
    {
      id: 2,
      level: 'Facil'
    },
    {
      id: 3,
      level: 'Normal'
    },
    {
      id: 4,
      level: 'Dificil'
    },
    {
      id: 5,
      level: 'Muy Dificil'
    },
  ];

  antonymsForm = this.fb.group({
    words: [0],
    level: [1],
    topic: [""],
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

  generateSynonyms() {
    const { level, topic, size } = this.antonymsForm.value;

    if (!level || !size)
      return;

    const list = WORD_ENTRIES.filter(e => e.level == level && (topic == "" ? true : e.categories.includes(topic as string)));

    if (!list)
      return;

    this.antonyms = size >= list.length ? shuffle(list) : shuffle(list).slice(0, size);
    this.antonyms.forEach(s => this.solutionShown.push(0));
  }

  toggleName() {
    const val = this.antonymsForm.get('name')?.value;
    if (!val) {
      this.antonymsForm.get('name')?.setValue(true);
    } else {
      this.antonymsForm.get('name')?.setValue(false);
    }
  }

  toggleGrade() {
    const val = this.antonymsForm.get('grade')?.value;
    if (!val) {
      this.antonymsForm.get('grade')?.setValue(true);
    } else {
      this.antonymsForm.get('grade')?.setValue(false);
    }
  }

  toggleDate() {
    const val = this.antonymsForm.get('date')?.value;
    if (!val) {
      this.antonymsForm.get('date')?.setValue(true);
    } else {
      this.antonymsForm.get('date')?.setValue(false);
    }
  }

  changeWord(index: number) {
    const { level, topic, size } = this.antonymsForm.value;

    if (!level || !size)
      return;

    const target = this.antonyms[index];
    const list = WORD_ENTRIES.filter(l => l.level == level && topic == "" ? true : l.categories.includes(topic as string));

    if (!list)
      return;

    const available = list.filter(w => w.id !== target.id);
    const randomWord = shuffle(available).pop();
    if (!randomWord)
      return;

    this.antonyms[index] = randomWord;
    this.solutionShown[index] = 0;
  }

  changeSolution(index: number) {
    const solutions = this.antonyms[index].antonyms.length;
    const current = this.solutionShown[index];
    if (current == solutions - 1) {
      this.solutionShown[index] = 0;
    } else {
      this.solutionShown[index]++;
    }
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    const topic = this.antonymsForm.get('topic')?.value;
    this.pdfService.createAndDownloadFromHTML("antonyms", `Palabras Revueltas - ${topic}`);
    this.pdfService.createAndDownloadFromHTML("antonyms-solution", `Palabras Revueltas - ${topic}`);
  }
}
