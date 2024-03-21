import { Component, OnInit, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
import { MATH_ASPECTS } from '../../data/math-aspects';
import { ART_ASPECTS } from '../../data/art-aspects';
import { ENGLISH_ASPECTS } from '../../data/english-aspects';
import { RELIGION_ASPECTS } from '../../data/religion-aspects';
import { SPANISH_ASPECTS } from '../../data/spanish-aspects';
import { SOCIETY_ASPECTS } from '../../data/society-aspects';
import { SCIENCE_ASPECTS } from '../../data/science-aspects';
import { SPORTS_ASPECTS } from '../../data/sports-aspects';

@Component({
  selector: 'app-aspects-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
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
  generating = false;
  generated = false;
  loading = false;
  dataSource: { p1: string, p2: string, p3: string, p4: string }[] = [];

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
  
  prompts: string[] = []

  ngOnInit() {
    this.prompts = MATH_CONTENTS.primary.map((entry, i) => entry.map(val => `Crea un array de strings en formato JSON, donde cada string es un aspecto especifico (caracteristica, elemento, actividad, contenido) que se puede trabajar en ${i == 0 ? '1er' : i == 1 ? '2do' : i == 2 ? '3er' : i == 3 ? '4to' : i == 4 ? '5to' : '6to'} grado de primaria en el area de ciencias de la naturaleza con este tema: ${val}`)).flat()
    // this.sb.open('En estos momentos, esta herramienta solo esta disponible para el segundo ciclo de educación primaria (4to, 5to y 6to). Los demás grados y niveles se irán agregando paulatinamente.', 'Entiendo', { duration: 10000 });
  }

  private shuffleArray(array: string[]): string[] {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
    // find all of the aspects for the level, grade, subject and topics
    const data = this.generatorForm.value;
    const bank: { p1: Array<string[]>, p2: Array<string[]>, p3: Array<string[]>, p4: Array<string[]> } = {
      p1: [],
      p2: [],
      p3: [],
      p4: [],
    };
    const aspects: { p1: string[], p2: string[], p3: string[], p4: string[] } = {
      p1: [],
      p2: [],
      p3: [],
      p4: [],
    };
    
    if (!data.grade || !data.qty) {
      return;
    }

    this.generating = true;

    const p1 = data.p1 as any as string[];
    const p2 = data.p2 as any as string[];
    const p3 = data.p3 as any as string[];
    const p4 = data.p4 as any as string[];
    
    switch (data.subject) {
      case 'Lengua Española': {
        bank.p1 = (data.level == 'Primaria' ? SPANISH_ASPECTS.primary[data.grade] : SPANISH_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? SPANISH_ASPECTS.primary[data.grade] : SPANISH_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? SPANISH_ASPECTS.primary[data.grade] : SPANISH_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? SPANISH_ASPECTS.primary[data.grade] : SPANISH_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case 'Matemática': {
        bank.p1 = (data.level == 'Primaria' ? MATH_ASPECTS.primary[data.grade] : MATH_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? MATH_ASPECTS.primary[data.grade] : MATH_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? MATH_ASPECTS.primary[data.grade] : MATH_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? MATH_ASPECTS.primary[data.grade] : MATH_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case "Ciencias Sociales": {
        bank.p1 = (data.level == 'Primaria' ? SOCIETY_ASPECTS.primary[data.grade] : SOCIETY_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? SOCIETY_ASPECTS.primary[data.grade] : SOCIETY_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? SOCIETY_ASPECTS.primary[data.grade] : SOCIETY_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? SOCIETY_ASPECTS.primary[data.grade] : SOCIETY_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case "Ciencias de la Naturaleza": {
        bank.p1 = (data.level == 'Primaria' ? SCIENCE_ASPECTS.primary[data.grade] : SCIENCE_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? SCIENCE_ASPECTS.primary[data.grade] : SCIENCE_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? SCIENCE_ASPECTS.primary[data.grade] : SCIENCE_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? SCIENCE_ASPECTS.primary[data.grade] : SCIENCE_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case "Inglés": {
        bank.p1 = (data.level == 'Primaria' ? ENGLISH_ASPECTS.primary[data.grade] : ENGLISH_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? ENGLISH_ASPECTS.primary[data.grade] : ENGLISH_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? ENGLISH_ASPECTS.primary[data.grade] : ENGLISH_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? ENGLISH_ASPECTS.primary[data.grade] : ENGLISH_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case "Educación Artística": {
        bank.p1 = (data.level == 'Primaria' ? ART_ASPECTS.primary[data.grade] : ART_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? ART_ASPECTS.primary[data.grade] : ART_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? ART_ASPECTS.primary[data.grade] : ART_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? ART_ASPECTS.primary[data.grade] : ART_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case "Educación Física": {
        bank.p1 = (data.level == 'Primaria' ? SPORTS_ASPECTS.primary[data.grade] : SPORTS_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? SPORTS_ASPECTS.primary[data.grade] : SPORTS_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? SPORTS_ASPECTS.primary[data.grade] : SPORTS_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? SPORTS_ASPECTS.primary[data.grade] : SPORTS_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      case "Formación Integral Humana y Religiosa": {
        bank.p1 = (data.level == 'Primaria' ? RELIGION_ASPECTS.primary[data.grade] : RELIGION_ASPECTS.highSchool[data.grade]).filter(a => p1.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p2 = (data.level == 'Primaria' ? RELIGION_ASPECTS.primary[data.grade] : RELIGION_ASPECTS.highSchool[data.grade]).filter(a => p2.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p3 = (data.level == 'Primaria' ? RELIGION_ASPECTS.primary[data.grade] : RELIGION_ASPECTS.highSchool[data.grade]).filter(a => p3.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        bank.p4 = (data.level == 'Primaria' ? RELIGION_ASPECTS.primary[data.grade] : RELIGION_ASPECTS.highSchool[data.grade]).filter(a => p4.includes(a.topic)).map(a => this.shuffleArray(a.aspects));
        break;
      }
      default: {
        break;
      }
    }

    const largerP1 = Math.max(...bank.p1.map(r => r.length));
    const largerP2 = Math.max(...bank.p2.map(r => r.length));
    const largerP3 = Math.max(...bank.p3.map(r => r.length));
    const largerP4 = Math.max(...bank.p4.map(r => r.length));

    const flatP1: string[] = [];
    const flatP2: string[] = [];
    const flatP3: string[] = [];
    const flatP4: string[] = [];
    
    for (let i = 0; i < largerP1; i++) {
      for (let row of bank.p1) {
        if (row[i]) {
          flatP1.push(row[i])
        }
      }
    }
    
    for (let i = 0; i < largerP2; i++) {
      for (let row of bank.p2) {
        if (row[i]) {
          flatP2.push(row[i])
        }
      }
    }
    
    for (let i = 0; i < largerP3; i++) {
      for (let row of bank.p3) {
        if (row[i]) {
          flatP3.push(row[i])
        }
      }
    }
    
    for (let i = 0; i < largerP4; i++) {
      for (let row of bank.p4) {
        if (row[i]) {
          flatP4.push(row[i])
        }
      }
    }

    this.dataSource = [];
    
    for(let i = 0; i < data.qty; i++) {
      this.dataSource.push({
        p1: flatP1[i] ? flatP1[i] : '',
        p2: flatP2[i] ? flatP2[i] : '',
        p3: flatP3[i] ? flatP3[i] : '',
        p4: flatP4[i] ? flatP4[i] : ''
      });
    }

    this.generated = true;
    this.generating = false;
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
