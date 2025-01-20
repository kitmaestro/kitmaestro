import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DidacticResourceService } from '../../services/didactic-resource.service';
import { CommonModule } from '@angular/common';
import { IsEmptyComponent } from '../../ui/alerts/is-empty/is-empty.component';
import { ResourceCardComponent } from '../resource-card/resource-card.component';
import { ResourceFormComponent } from '../../ui/forms/resource-form/resource-form.component';
import { MatIconModule } from '@angular/material/icon';
import { UserSettings } from '../../interfaces/user-settings';
import { DidacticResource } from '../../interfaces/didactic-resource';
import { AuthService } from '../../services/auth.service';
import { PretifyPipe } from '../../pipes/pretify.pipe';

@Component({
    selector: 'app-resource-gallery',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDialogModule,
        MatIconModule,
        ReactiveFormsModule,
        PretifyPipe,
        CommonModule,
        IsEmptyComponent,
        ResourceCardComponent,
    ],
    templateUrl: './resource-gallery.component.html',
    styleUrl: './resource-gallery.component.scss'
})
export class ResourceGalleryComponent {
  private fb = inject(FormBuilder);
  private resourcesService = inject(DidacticResourceService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  loading = true;
  
  resources: DidacticResource[] = [];
  fullList: DidacticResource[] = [];
  user: UserSettings | null = null;

  filterForm = this.fb.group({
    subjects: [[] as string[]],
    level: [[] as string[]],
    grades: [[] as string[]],
    orderBy: ['asc'],
  });

  grades = [
    'PRIMERO',
    'SEGUNDO',
    'TERCERO',
    'CUARTO',
    'QUINTO',
    'SEXTO',
  ];
  levels = [
    'PRE_PRIMARIA',
    'PRIMARIA',
    'SECUNDARIA'
  ];
  subjects = [
    'LENGUA_ESPANOLA',
    'MATEMATICA',
    'CIENCIAS_SOCIALES',
    'CIENCIAS_NATURALES',
    'INGLES',
    'FRANCES',
    'FORMACION_HUMANA',
    'EDUCACION_FISICA',
    'EDUCACION_ARTISTICA',
    'TALLERES_OPTATIVOS',
    'MANUALES',
    'FASCICULOS',
  ];

  constructor() {
    this.resourcesService.findAll({ status: 'public' }).subscribe({
      next: res => {
        this.fullList = res;
        this.filter();
      }
    });
    this.authService.profile().subscribe(user => {
      this.user = user;
    });
  }

  openCreateResourceDialog() {
    this.dialog.open(ResourceFormComponent, { width: '100%', maxWidth: '960px' });
  }
  
  filter() {
    const { subjects, level, grades, orderBy } = this.filterForm.value as any;
    this.resources = this.fullList.filter(resource => {
      let matchesSubjects = true;
      let matchesLevel = true;
      let matchesGrades = true;

      // Filtrar por materias
      if (subjects.length > 0) {
        matchesSubjects = subjects.some((subject: string) => resource.subject.includes(subject));
      }

      // Filtrar por nivel
      if (level.length > 0) {
        matchesLevel = level.some((lvl: string) => resource.level.includes(lvl));
      }

      // Filtrar por grado
      if (grades.length > 0) {
        matchesGrades = grades.some((grade: string) => resource.grade.includes(grade));
      }

      return matchesSubjects && matchesLevel && matchesGrades;
    }).sort((a, b) => {
      if (orderBy === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }
}
