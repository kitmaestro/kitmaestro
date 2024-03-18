import { Component, OnInit, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HIGH_SCHOOL_SUBJECTS, PRIMARY_SUBJECTS, PRIMARY_SUBJECTS_HIGH } from '../../data/subjects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SPANISH_CONTENTS } from '../../data/spanish-contents';
import { MATH_CONTENTS } from '../../data/math-contents';
import { SOCIETY_CONTENTS } from '../../data/society-contents';
import { SCIENCE_CONTENTS } from '../../data/science-contents';
import { ENGLISH_CONTENTS } from '../../data/english-contents';
import { FRENCH_CONTENTS } from '../../data/french-contents';
import { ART_CONTENTS } from '../../data/art-contents';
import { SPORTS_CONTENTS } from '../../data/sports-contents';
import { RELIGION_CONTENTS } from '../../data/religion-contents';
import { WORKSHOP_TOPICS } from '../../data/workshop-topics';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-aspects-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatDividerModule,
    JsonPipe,
  ],
  templateUrl: './aspects-generator.component.html',
  styleUrl: './aspects-generator.component.scss'
})
export class AspectsGeneratorComponent implements OnInit {
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);

  columns = ['p1', 'p2', 'p3', 'p4'];
  working = false;
  loading = false;
  dataSource: { p1: string, p2: string, p3: string, p4: string }[] = [];
  prompts: string[] = []

  levels = [
    'Primaria',
    'Secundaria',
  ];

  grades = [
    'Primero',
    'Segundo',
    'Tercero',
    'Cuarto',
    'Quinto',
    'Sexto'
  ];

  generatorForm = this.fb.group({
    level: ['Primaria'],
    grade: [4],
    subject: ['', Validators.required],
    qty: [12],
    p1: [''],
    p2: [''],
    p3: [''],
    p4: [''],
  });

  ngOnInit() {
    this.prompts = MATH_CONTENTS.primary.map((entry, i) => entry.map(val => `Crea un array de strings en formato JSON, donde cada string es un aspecto especifico (caracteristica, elemento, actividad, contenido) que se puede trabajar en ${i == 0 ? '1er' : i == 1 ? '2do' : i == 2 ? '3er' : i == 3 ? '4to' : i == 4 ? '5to' : '6to'} grado de primaria en el area de matematica con este tema: ${val}`)).flat()
    this.sb.open('En estos momentos, esta herramienta solo esta disponible para el segundo ciclo de educación primaria (4to, 5to y 6to). Los demás grados y niveles se irán agregando paulatinamente.', 'Entiendo', { duration: 10000 });
  }

  reset() {
    this.generatorForm.setValue({
      level: 'Primaria',
      grade: 4,
      subject: '',
      qty: 12,
      p1: '',
      p2: '',
      p3: '',
      p4: ''
    });
    this.dataSource = [];
  }

  onSubmit() {
  }

  get subjects() {
    const { level, grade } = this.generatorForm.value;
    if (!level || grade == null) {
      return [];
    }
    if (level == 'Primaria') {
      return grade < 3 ? PRIMARY_SUBJECTS.slice(0, -1) : PRIMARY_SUBJECTS_HIGH.slice(0, -1)
    }
    return HIGH_SCHOOL_SUBJECTS.slice(0, -1);
  }

  get contents(): string[] {
    const { level, grade, subject } = this.generatorForm.value;

    if (!level || grade == null || !subject) {
      return [];
    }

    if (level == 'Primaria') {
      switch(subject) {
        case 'Lengua Española': {
          return SPANISH_CONTENTS.primary[grade];
        }
        case 'Matemática': {
          return MATH_CONTENTS.primary[grade];
        }
        case "Ciencias Sociales": {
          return SOCIETY_CONTENTS.primary[grade];
        }
        case "Ciencias de la Naturaleza": {
          return SCIENCE_CONTENTS.primary[grade];
        }
        case "Inglés": {
          return ENGLISH_CONTENTS.primary[grade];
        }
        case "Educación Artística": {
          return ART_CONTENTS.primary[grade];
        }
        case "Educación Física": {
          return SPORTS_CONTENTS.primary[grade];
        }
        case "Formación Integral Humana y Religiosa": {
          return RELIGION_CONTENTS.primary[grade];
        }
        case "Talleres Optativos": {
          return WORKSHOP_TOPICS;
        }
        default: {
          return [];
        }
      }
    }
    switch(subject) {
      case 'Lengua Española': {
        return SPANISH_CONTENTS.highSchool[grade];
      }
      case 'Matemática': {
        return MATH_CONTENTS.highSchool[grade];
      }
      case "Ciencias Sociales": {
        return SOCIETY_CONTENTS.highSchool[grade];
      }
      case "Ciencias de la Naturaleza": {
        return SCIENCE_CONTENTS.highSchool[grade];
      }
      case "Inglés": {
        return ENGLISH_CONTENTS.highSchool[grade];
      }
      case "Francés": {
        return FRENCH_CONTENTS.highSchool[grade];
      }
      case "Educación Artística": {
        return ART_CONTENTS.highSchool[grade];
      }
      case "Educación Física": {
        return SPORTS_CONTENTS.highSchool[grade];
      }
      case "Formación Integral Humana y Religiosa": {
        return RELIGION_CONTENTS.highSchool[grade];
      }
      case "Talleres Optativos": {
        return WORKSHOP_TOPICS;
      }
      default: {
        return [];
      }
    }
  }
}
