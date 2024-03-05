import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DidacticResourceService } from '../services/didactic-resource.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-gallery',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './resource-gallery.component.html',
  styleUrl: './resource-gallery.component.scss'
})
export class ResourceGalleryComponent {
  private fb = inject(FormBuilder);
  private resourcesService = inject(DidacticResourceService);

  private resources$ = this.resourcesService.didacticResources$;

  levels = [
    'Primaria',
    'Secundaria',
  ]

  grades = [
    '1ro',
    '2do',
    '3ro',
    '4to',
    '5to',
    '6to',
  ];

  subjects = [
    'Lengua Española',
    'Matemática',
    "Ciencias Sociales",
    "Ciencias de la Naturaleza",
    "Inglés",
    "Francés",
    "Educación Artística",
    "Educación Física",
    "Formación Integral Humana y Religiosa",
    "Talleres Optativos",
  ];

  resourceTypes = [
    'Planificación',
    'Ejercicios',
    'Plantillas',
    'Instrumentos de Evaluación',
    'Actividades',
  ];

  formats = [
    'PDF',
    'Word',
    'Excel',
    'Imágenes',
    'Videos',
    'Audio'
  ];

  baseTopics = [
    ''
  ];

  topics = [
  ];

  filterForm = this.fb.group({
    format: [''],
    topics: [''],
    resourceType: [''],
    subjects: [''],
    level: [''],
    grades: [''],
    orderBy: [''],
  });
}
