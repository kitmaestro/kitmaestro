import { Component, inject, OnInit } from '@angular/core';
import { RubricService } from '../../services/rubric.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Rubric } from '../../interfaces/rubric';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PdfService } from '../../services/pdf.service';
import { Student } from '../../interfaces/student';
import { StudentsService } from '../../services/students.service';
import { RubricComponent } from '../rubric/rubric.component';

@Component({
    selector: 'app-rubric-detail',
    imports: [
        MatCardModule,
        MatSnackBarModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        RubricComponent,
    ],
    templateUrl: './rubric-detail.component.html',
    styleUrl: './rubric-detail.component.scss'
})
export class RubricDetailComponent implements OnInit {
  private rubricService = inject(RubricService);
  private studentService = inject(StudentsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sb = inject(MatSnackBar);
  private pdfService = inject(PdfService);
  private id = this.route.snapshot.paramMap.get('id') || '';

  public rubric: Rubric | null = null;
  public students: Student[] = [];

  ngOnInit() {
    this.rubricService.find(this.id).subscribe({
      next: rubric => {
        if (rubric._id) {
          this.rubric = rubric;
          this.studentService.findBySection(rubric.section._id).subscribe(students => {
            if (students.length) {
              this.students = students;
            }
          });
        }
      },
      error: err => {
        this.sb.open('Error al cargar', 'Ok', { duration: 2500 });
        console.log(err.message);
      }
    })
  }

  deleteRubric() {
    this.rubricService.delete(this.id).subscribe(res => {
      if (res.deletedCount === 1) {
        this.router.navigate(['/assessments/rubrics']).then(() => this.sb.open('Se ha eliminado la rubrica', 'Ok', { duration: 2500 }));
      }
    });
  }

  async download() {
    if (!this.rubric)
      return;
    this.sb.open('Estamos preparando tu descarga. Espera un momento, por favor', 'Ok', { duration: 2500 });
    await this.rubricService.download(this.rubric);
  }
}
