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
import { ReadingActivityGeneratorComponent } from '../reading-activity-generator/reading-activity-generator.component';

@Component({
    selector: 'app-activity-generator',
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
        ReadingActivityGeneratorComponent,
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

  activityTypeSelector = this.fb.control('reading');

  activityForm = this.fb.group({
    difficulty: ['easy'],
    level: ['knowledge'],
    questions: [5],
  });

  ngOnInit() {
  }
}
