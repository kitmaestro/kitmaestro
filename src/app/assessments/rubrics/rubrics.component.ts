import { Component, inject, OnInit } from '@angular/core';
import { RubricService } from '../../services/rubric.service';
import { Rubric } from '../../interfaces/rubric';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-rubrics',
  standalone: true,
  imports: [
    RouterLink,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './rubrics.component.html',
  styleUrl: './rubrics.component.scss'
})
export class RubricsComponent implements OnInit {
  private rubricService = inject(RubricService);
  private sb = inject(MatSnackBar);

  rubrics: Rubric[] = [];
  displayedColumns = ['title', 'section', 'activity', 'rubricType', 'actions'];

  loadRubrics() {
    this.rubricService.findAll().subscribe({
      next: rubrics => {
        if (rubrics.length) {
          this.rubrics = rubrics;
        }
      },
      error: err => {
        this.sb.open('Error al cargar', 'Ok', { duration: 2500 });
        console.log(err.message)
      }
    });
  }

  ngOnInit() {
    this.loadRubrics()
  }

  deleteAssessment(id: string) {
    this.rubricService.delete(id).subscribe(res => {
      if (res.deletedCount == 1) {
        this.sb.open('Se ha eliminado la rubrica', 'Ok', { duration: 2500 });
        this.loadRubrics()
      }
    });
  }
}
