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
import { HttpClientModule } from '@angular/common/http';
import { PdfService } from '../../services/pdf.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-reading-activity-generator',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
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
  public userSettings$ = this.userSettingsService.getSettings();

  generating = false;

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
    this.aiService.askGemini(text, true)
      .subscribe({
        next: (response) => {
          this.text = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n'));
          this.generating = false;
        }, error: (error) => {
          this.sb.open('Ocurrió mientras se generaba la actividad. Inténtalo de nuevo.', undefined, { duration: 2500 })
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
}
