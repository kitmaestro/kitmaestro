import { Component, OnInit, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
// import { AiService } from '../../services/ai.service';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-activity-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './activity-generator.component.html',
  styleUrl: './activity-generator.component.scss'
})
export class ActivityGeneratorComponent implements OnInit {
  working = true;
  // aiService = inject(AiService);
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);

  activityTypes = [
    { id: 'reading', label: 'Lectura Guiada' },
    { id: 'groupProject', label: 'Proyecto Grupal' },
    { id: 'game', label: 'Juego Educativo' },
    { id: 'discussion', label: 'Debate/Discusión' },
    { id: 'experiment', label: 'Experimento Científico' },
    { id: 'writing', label: 'Escritura Creativa' },
    { id: 'art', label: 'Arte y Manualidades' },
    { id: 'reinforcement', label: 'Refuerzo y Repaso' },
  ]

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
    { id: 'synthesis', label: 'Evaluar' },
    { id: 'evaluation', label: 'Crear' },
  ]

  activityTypeSelector = this.fb.control('reading');

  activityForm = this.fb.group({
    difficulty: ['easy'],
    level: ['knowledge'],
    questions: [5],
  });

  ngOnInit() {
  }

  generateReadingActivity() {
    const {
      difficulty,
      level,
      questions
    } = this.activityForm.value;
    if (difficulty && level && questions && questions < 16 && questions > 0) {
    } else {
      this.sb.open('Los datos introducidos son invalidados. Comprueba los datos ingresados.', undefined, { duration: 5000 });
    }
  }

  generateGroupProjectActivity() {}

  generateGameActivity() {}

  generateDiscussionActivity() {}

  generateExperimentActivity() {}

  generateWritingActivity() {}

  generateArtActivity() {}

  generateReinforcementActivity() {}

  onSubmit() {
    if (this.activityTypeSelector.value == 'reading') {
      this.generateReadingActivity();
    }
    if (this.activityTypeSelector.value == 'groupProject') {
      this.generateGroupProjectActivity();
    }
    if (this.activityTypeSelector.value == 'game') {
      this.generateGameActivity();
    }
    if (this.activityTypeSelector.value == 'discussion') {
      this.generateDiscussionActivity();
    }
    if (this.activityTypeSelector.value == 'experiment') {
      this.generateExperimentActivity();
    }
    if (this.activityTypeSelector.value == 'writing') {
      this.generateWritingActivity();
    }
    if (this.activityTypeSelector.value == 'art') {
      this.generateArtActivity();
    }
    if (this.activityTypeSelector.value == 'reinforcement') {
      this.generateReinforcementActivity();
    }
  }
}
