import { Component, inject, OnInit } from '@angular/core';
import { ReadingActivityService } from '../../services/reading-activity.service';
import { ReadingActivity } from '../../interfaces/reading-activity';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-reading-activities',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    IsPremiumComponent,
  ],
  templateUrl: './reading-activities.component.html',
  styleUrl: './reading-activities.component.scss'
})
export class ReadingActivitiesComponent implements OnInit {
  private activityService = inject(ReadingActivityService);
  private sb = inject(MatSnackBar);

  public activities: ReadingActivity[] = [];
  public displayedColumns = ['difficulty', 'level', 'title', 'questions', 'actions'];

  difficultyLevels = [
    { id: 'easy', label: 'Facil' },
    { id: 'normal', label: 'Normal' },
    { id: 'advanced', label: 'Avanzado' },
    { id: 'hard', label: 'Dificil' },
  ];

  bloomLevels = [
    { id: 'knowledge', label: 'Recordar' },
    { id: 'undertanding', label: 'Comprender' },
    { id: 'application', label: 'Aplicar' },
    { id: 'analysis', label: 'Analizar' },
    { id: 'evaluation', label: 'Evaluar' },
    { id: 'creation', label: 'Crear' },
  ]

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    const sus = this.activityService.findAll().subscribe({
      next: activities => {
        sus.unsubscribe();
        if (activities.length) {
          this.activities = activities;
        }
      },
    })
  }

  levelLabel(id: string) {
    return this.bloomLevels.find(level => level.id == id)?.label || '';
  }

  difficultyLabel(id: string) {
    return this.difficultyLevels.find(level => level.id == id)?.label || '';
  }

  deleteActivity(id: string) {
    this.activityService.delete(id).subscribe(res => {
      if (res.deletedCount == 1) {
        this.sb.open('Se ha eliminado la actividad', 'Ok', { duration: 2500 });
        this.loadActivities();
      }
    })
  }
}
