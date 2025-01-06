import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AiService } from '../../services/ai.service';
import {} from '@angular/common/http';
import { PdfService } from '../../services/pdf.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { ReadingActivityService } from '../../services/reading-activity.service';
import { UserSettings } from '../../interfaces/user-settings';

@Component({
    selector: 'app-reading-activity-generator',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule,
        // TODO: `HttpClientModule` should not be imported into a component directly.
        // Please refactor the code to add `provideHttpClient()` call to the provider list in the
        // application bootstrap logic and remove the `HttpClientModule` import from this component.
        HttpClientModule,
        NgIf,
        AsyncPipe,
    ],
    templateUrl: './reading-activity-generator.component.html',
    styleUrl: './reading-activity-generator.component.scss'
})
export class ReadingActivityGeneratorComponent {
  private fb = inject(FormBuilder);
  private sb = inject(MatSnackBar);
  private aiService = inject(AiService);
  private pdfService = inject(PdfService);
  private userSettingsService = inject(UserSettingsService);
  private acitivtyService = inject(ReadingActivityService);

  public userSettings$ = this.userSettingsService.getSettings();
  public user: UserSettings | null = null;

  generating = false;

  saved = false;

  text: {
    textTitle: string;
    textContent: string;
    questions: string[];
    answers: string[];
  } | null = null;

  difficultyLevels = [
    { id: 'easy', label: 'Facil (3ro primaria - 4to primaria)' },
    { id: 'normal', label: 'Normal (5to primaria - 6to primaria)' },
    { id: 'advanced', label: 'Avanzado (1ro secundaria - 3ro secundaria)' },
    { id: 'hard', label: 'Dificil (4to secundaria - 6to secundaria)' },
  ];

  bloomLevels = [
    { id: 'knowledge', label: 'Recordar' },
    { id: 'undertanding', label: 'Comprender' },
    { id: 'application', label: 'Aplicar' },
    { id: 'analysis', label: 'Analizar' },
    { id: 'evaluation', label: 'Evaluar' },
    { id: 'creation', label: 'Crear' },
  ]

  activityForm = this.fb.group({
    difficulty: ['easy'],
    level: ['knowledge'],
    questions: [5, [Validators.min(1), Validators.max(15)]],
  });

  ngOnInit() {
    this.userSettingsService.getSettings().subscribe(user => this.user = user);
  }

  onSubmit() {
    this.generateActivity(this.activityForm.value);
  }

  generateActivity(form: any) {
    const text = `Escribe un texto de nivel ${this.difficultyLevels.find(dl => dl.id == form.difficulty)?.label.toLowerCase()} y ${form.questions} preguntas de comprensión lectora adecuadas para trabajar/evaluar el proceso cognitivo de ${this.bloomLevels.find(bl => bl.id == form.level)?.label.toLowerCase()}. Responde con formato JSON valido con esta interfaz:
{
    textTitle: string;
    textContent: string;
    questions: string[];
    answers: string[];
}`;
    this.generating = true;
    this.aiService.geminiAi(text)
      .subscribe({
        next: (response) => {
          try {
            const text = JSON.parse(response.response.slice(response.response.indexOf('{'), response.response.lastIndexOf('}') + 1));
            if (text) {
              this.text = text;
              this.saved = false;
            }
          } catch (error) {
            this.sb.open('Ocurrió mientras se generaba la actividad. Inténtalo de nuevo.', 'Ok', { duration: 2500 });
          }
          this.generating = false;
        }, error: (error) => {
          this.sb.open('Ocurrió mientras se generaba la actividad. Inténtalo de nuevo.', 'Ok', { duration: 2500 });
          this.generating = false;
        }
      })
  }

  print() {
    if (this.text) {
      this.sb.open('Guardando tu actividad...', undefined, { duration: 2500 });
      this.pdfService.exportTableToPDF('reading-activity', this.text.textTitle)
    }
  }

  save() {
    const { difficulty, level } = this.activityForm.value;
    const activity: any = {
      user: this.user?._id,
      difficulty,
      level,
      title: this.text?.textTitle,
      text: this.text?.textContent,
      questions: this.text?.questions,
      answers: this.text?.answers
    };

    this.acitivtyService.create(activity).subscribe(result => {
      if (result._id) {
        this.saved = true;
        this.sb.open('La actividad ha sido guardada.', 'Ok', { duration: 2500 });
      }
    });
  }

  get schoolYear(): string {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    if (currentMonth > 7) {
      return `${currentYear} - ${currentYear + 1}`;
    }
    return `${currentYear - 1} - ${currentYear}`;
  }
}
