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
  loading = true;

  loadRubrics() {
    this.rubricService.findAll().subscribe({
      next: rubrics => {
        if (rubrics.length) {
          this.rubrics = rubrics;
        }
        this.loading = false;
      },
      error: err => {
        this.sb.open('Error al cargar', 'Ok', { duration: 2500 });
        console.log(err.message)
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.loadRubrics()
  }

  deleteAssessment(id: string) {
    this.loading = true;
    this.rubricService.delete(id).subscribe({
      next: res => {
        if (res.deletedCount == 1) {
          this.sb.open('Se ha eliminado la rubrica', 'Ok', { duration: 2500 });
          this.loadRubrics()
        }
        this.loading = false;
      },
      error: err => {
        console.log(err.message)
        this.loading = false;
        this.sb.open('No se ha podido eliminar. Intentalo de nuevo', 'Ok', { duration: 2500 });
      }
    });
  }

  async download(rubric: any) {
    this.loading = true;
    await this.rubricService.download(rubric);
    this.loading = false;
  }
}
