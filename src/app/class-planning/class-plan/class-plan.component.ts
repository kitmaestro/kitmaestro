import { Component, inject, OnInit } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClassSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../datacenter/datacenter.component';
import { AiService } from '../../services/ai.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettings } from '../../interfaces/user-settings';
import { PdfService } from '../../services/pdf.service';
import { ART_COMPETENCE } from '../../data/art-competence';
import { ENGLISH_COMPETENCE } from '../../data/english-competence';
import { SPANISH_COMPETENCE } from '../../data/spanish-competence';
import { MATH_COMPETENCE } from '../../data/math-competence';
import { SOCIETY_COMPETENCE } from '../../data/society-competence';
import { SCIENCE_COMPETENCE } from '../../data/science-competence';
import { FRENCH_COMPETENCE } from '../../data/french-competence';
import { RELIGION_COMPETENCE } from '../../data/religion-competence';
import { SPORTS_COMPETENCE } from '../../data/sports-competence';
import { MatChipsModule } from '@angular/material/chips';
import { ClassPlan } from '../../interfaces/class-plan';
import { ClassPlansService } from '../../services/class-plans.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-class-plan',
  standalone: true,
  imports: [
    AsyncPipe,
    IsPremiumComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    RouterModule,
    DatePipe,
  ],
  templateUrl: './class-plan.component.html',
  styleUrl: './class-plan.component.scss'
})
export class ClassPlanComponent implements OnInit {
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  classSectionService = inject(ClassSectionService);
  aiService = inject(AiService);
  userSettingsService = inject(UserSettingsService);
  pdfService = inject(PdfService);
  classPlanService = inject(ClassPlansService);
  router = inject(Router);
  datePipe = new DatePipe('en');

  todayDate = new Date().toISOString().split('T')[0];
  classSections: ClassSection[] = [];
  userSettings: UserSettings | null = null;
  subjects: string[] = [];
  generating = false;
  plan = this.fb.group({
    intencion_pedagogica: ['', Validators.required],
    estrategias: [['']],
    inicio: this.fb.group({
      duracion: [0],
      actividades: [['']],
      recursos_necesarios: [['']],
      layout: [''],
    }),
    desarrollo: this.fb.group({
      duracion: [0],
      actividades: [['']],
      recursos_necesarios: [['']],
      layout: [''],
    }),
    cierre: this.fb.group({
      duracion: [0],
      actividades: [['']],
      recursos_necesarios: [['']],
      layout: [''],
    }),
    complementarias: this.fb.group({
      actividades: [['']],
      recursos_necesarios: [['']],
      layout: [''],
    }),
    vocabulario: [['']],
    lectura_recomendada: [''],
    competencia: [''],
  });

  bloomLevels = [
    { id: 'knowledge', label: 'Recordar' },
    { id: 'undertanding', label: 'Comprender' },
    { id: 'application', label: 'Aplicar' },
    { id: 'analysis', label: 'Analizar' },
    { id: 'evaluation', label: 'Evaluar' },
    { id: 'creation', label: 'Crear' },
  ]

  resources = [
    "Pizarra",
    "Proyector",
    "Laptop / Computadora",
    "Tablets",
    "Libros de texto",
    "Cuadernos",
    "Lápices y bolígrafos",
    "Internet",
    "Presentaciones en PowerPoint",
    "Juegos educativos",
    "Materiales de arte (papel, colores, pinceles)",
    "Laboratorios de ciencias",
    "Mapas y globos terráqueos",
    "Calculadoras",
    "Software Educativo",
    "Módulos de aprendizaje en línea",
    "Videos educativos",
    "Recursos digitales interactivos",
    "Cuadernos de ejercicios",
    "Fichas didácticas",
    "Bocina",
    "Instrumentos musicales",
    "Modelos anatómicos",
    "Maquetas",
    "Material de lectura"
  ];

  planForm = this.fb.group({
    classSection: ['', Validators.required],
    date: [this.todayDate, Validators.required],
    subject: ['', Validators.required],
    duration: [90, Validators.required],
    topics: ['', Validators.required],
    bloomLevel: ['knowledge', Validators.required],
    resources: [["Pizarra", "Libros de texto", "Cuadernos", "Lápices y bolígrafos", "Materiales de arte (papel, colores, pinceles)", "Cuadernos de ejercicios"]]
  });

  planPrompt = `Escribe un plan de clases de class_subject de class_duration minutos para impartir class_topics en class_year grado de class_level. Esta es la interfaz de la planificacion:

interface Plan {
  intencion_pedagogica: string, // proposito
  estrategias: string[],
  inicio: {
    duracion: number,
    actividades: string[],
    recursos_necesarios: string[],
    layout: string, // class layout
  },
  desarrollo: {
    duracion: number,
    actividades: string[],
    recursos_necesarios: string[],
    layout: string, // class layout
  },
  cierre: {
    duracion: number,
    actividades: string[],
    recursos_necesarios: string[],
    layout: string, // class layout
  },
  complementarias: { // actividades extra/opcionales (son opciones para que el docente implemente en caso de que le sobre tiempo o para intercambiar con alguna otra del plan)
    actividades: string[],
    recursos_necesarios: string[],
    layout: string, // class layout
  },
  vocabulario: string[],
  lectura_recomendada: string, // usualmente un material o libro relacionado con el tema
  competencia: string, // Competencia a trabajar (elige la mas apropiadas de las que menciono al final)
}

Los recursos disponibles son: plan_resources
Las competencias a desarrollorar debe ser una de estas:
- plan_compentece
`;

  ngOnInit(): void {
    this.classSectionService.classSections$.subscribe(sections => {
      this.classSections = sections;
      if (sections.length) {
        this.planForm.get('classSection')?.setValue(sections[0].id);
      }
    });
    this.userSettingsService.getSettings().subscribe(settings => this.userSettings = settings);
  }

  onSubmit() {
    if (this.planForm.valid) {
      const {
        classSection,
        date,
        subject,
        duration,
        bloomLevel,
        resources,
        topics
      } = this.planForm.value;

      const sectionLevel = this.classSections.find(cs => cs.id == classSection)?.level;
      const sectionYear = this.classSections.find(cs => cs.id == classSection)?.grade;

      if (sectionLevel && sectionYear && subject && duration && topics && resources) {
        this.generating = true;
        const competence_string = [this.competence.Comunicativa, this.competence.EticaYCiudadana, this.competence.PensamientoLogico].join('\n- ');
        console.log(competence_string)
        const text = this.planPrompt
          .replace('class_subject', this.pretify(subject))
          .replace('class_duration', duration.toString())
          .replace('class_topics', `${topics} (proceso cognitivo de la taxonomia de bloom: ${this.pretifyBloomLevel(bloomLevel || '')})`)
          .replace('class_year', sectionYear)
          .replace('class_level', sectionLevel)
          .replace('plan_resources', resources.join(', '))
          .replace('plan_compentece', competence_string);
        this.aiService.askGemini(text, true).subscribe({
          next: (response) => {
            this.generating = false;
            const plan: ClassPlan = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n'));
            this.plan.setValue(plan);
            if (sectionLevel == 'PRIMARIA') {
              if (sectionYear == 'PRIMERO') {
              } else if (sectionYear == 'SEGUNDO') {
              } else if (sectionYear == 'TERCERO') {
              } else if (sectionYear == 'CUARTO') {
              } else if (sectionYear == 'QUINTO') {
              } else {
              }
            } else {}
          }, error: (error) => {
            this.sb.open('Ha ocurrido un error generando tu plan: ' + error.message, undefined, { duration: 5000 });
          }
        })
      } else {
        this.sb.open('Completa el formulario antes de proceder.', undefined, { duration: 3000 });
      }
    }
  }

  savePlan() {
    const uid = this.userSettings?.uid;
    if (uid) {
      const plan = this.plan.value as ClassPlan;
      plan.uid = uid;
      plan.date = this.planForm.value.date || this.todayDate;
      plan.sectionName = this.classSectionName;
      plan.sectionId = this.planForm.value.classSection || '';
      plan.level = this.classSectionLevel;
      plan.year = this.classSectionYear;
      plan.subject = this.planForm.value.subject || '';
      this.classPlanService.addPlan(plan).then((saved) => {
        this.router.navigate(['/app', 'class-plans', saved.id]).then(() => {
          this.sb.open('Tu plan ha sido guardado!', undefined, { duration: 2500 });
        });
      });
    }
  }

  printPlan() {
    const date = this.datePipe.transform(this.planForm.value.date, 'dd-MM-YYYY');
    this.sb.open('La descarga empezara en un instante. No quites esta pantalla hasta que finalicen las descargas.', undefined, { duration: 3000 });
    this.pdfService.createAndDownloadFromHTML('class-plan', `Plan de Clases de ${this.pretify(this.planForm.value.subject || '')} para ${this.classSectionName} - ${date}`, false);
  }

  pretify(str: string) {
    switch(str) {
      case 'LENGUA_ESPANOLA':
        return 'Lengua Española';
      case 'MATEMATICA':
        return 'Matemática';
      case 'CIENCIAS_SOCIALES':
        return 'Ciencias Sociales';
      case 'CIENCIAS_NATURALES':
        return 'Ciencias de la Naturaleza';
      case 'INGLES':
        return 'Inglés';
      case 'FRANCES':
        return 'Francés';
      case 'FORMACION_HUMANA':
        return 'Formación Integral Humana y Religiosa';
      case 'EDUCACION_FISICA':
        return 'Educación Física';
      case 'EDUCACION_ARTISTICA':
        return 'Educación Artística';
      default:
        return 'Talleres Optativos';
    }
  }

  get competence(): { Comunicativa: string, PensamientoLogico: string, EticaYCiudadana: string } {
    const comps: {
      Comunicativa: string,
      PensamientoLogico: string,
      EticaYCiudadana: string,
    } = {
      Comunicativa: '',
      PensamientoLogico: '',
      EticaYCiudadana: ''
    };

    const { subject } = this.planForm.value;

    if (subject == 'LENGUA_ESPANOLA') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPANISH_COMPETENCE.Primaria.Comunicativa : SPANISH_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPANISH_COMPETENCE.Primaria.PensamientoLogico : SPANISH_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPANISH_COMPETENCE.Primaria.EticaYCiudadana : SPANISH_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'MATEMATICA') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? MATH_COMPETENCE.Primaria.Comunicativa : MATH_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? MATH_COMPETENCE.Primaria.PensamientoLogico : MATH_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? MATH_COMPETENCE.Primaria.EticaYCiudadana : MATH_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'CIENCIAS_SOCIALES') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SOCIETY_COMPETENCE.Primaria.Comunicativa : SOCIETY_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SOCIETY_COMPETENCE.Primaria.PensamientoLogico : SOCIETY_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SOCIETY_COMPETENCE.Primaria.EticaYCiudadana : SOCIETY_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'CIENCIAS_NATURALES') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SCIENCE_COMPETENCE.Primaria.Comunicativa : SCIENCE_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SCIENCE_COMPETENCE.Primaria.PensamientoLogico : SCIENCE_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SCIENCE_COMPETENCE.Primaria.EticaYCiudadana : SCIENCE_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'INGLES') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ENGLISH_COMPETENCE.Primaria.Comunicativa : ENGLISH_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ENGLISH_COMPETENCE.Primaria.PensamientoLogico : ENGLISH_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ENGLISH_COMPETENCE.Primaria.EticaYCiudadana : ENGLISH_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'FRANCES') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? FRENCH_COMPETENCE.Primaria.Comunicativa : FRENCH_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? FRENCH_COMPETENCE.Primaria.PensamientoLogico : FRENCH_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? FRENCH_COMPETENCE.Primaria.EticaYCiudadana : FRENCH_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'FORMACION_HUMANA') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? RELIGION_COMPETENCE.Primaria.Comunicativa : RELIGION_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? RELIGION_COMPETENCE.Primaria.PensamientoLogico : RELIGION_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? RELIGION_COMPETENCE.Primaria.EticaYCiudadana : RELIGION_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'EDUCACION_FISICA') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPORTS_COMPETENCE.Primaria.Comunicativa : SPORTS_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPORTS_COMPETENCE.Primaria.PensamientoLogico : SPORTS_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPORTS_COMPETENCE.Primaria.EticaYCiudadana : SPORTS_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    if (subject == 'EDUCACION_ARTISTICA') {
      comps.Comunicativa = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ART_COMPETENCE.Primaria.Comunicativa : ART_COMPETENCE.Secundaria.Comunicativa);
      comps.PensamientoLogico = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ART_COMPETENCE.Primaria.PensamientoLogico : ART_COMPETENCE.Secundaria.PensamientoLogico);
      comps.EticaYCiudadana = this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ART_COMPETENCE.Primaria.EticaYCiudadana : ART_COMPETENCE.Secundaria.EticaYCiudadana);
    }

    return comps;
  }

  yearIndex(year: string): number {
    return year == 'PRIMERO' ? 0 :
      year == 'SEGUNDO' ? 1 :
        year == 'TERCERO' ? 2 :
          year == 'CUARTO' ? 3 :
            year == 'QUINTO' ? 4 :
              5;
  }

  randomCompetence(categorized: any): string {
    let random = 0;
    switch (this.yearIndex(this.classSectionYear)) {
      case 0:
        random = Math.round(Math.random() * (categorized.Primero.competenciasEspecificas.length - 1))
        return categorized.Primero.competenciasEspecificas[random];
      case 1:
        random = Math.round(Math.random() * (categorized.Segundo.competenciasEspecificas.length - 1))
        return categorized.Segundo.competenciasEspecificas[random];
      case 2:
        random = Math.round(Math.random() * (categorized.Tercero.competenciasEspecificas.length - 1))
        return categorized.Tercero.competenciasEspecificas[random];
      case 3:
        random = Math.round(Math.random() * (categorized.Cuarto.competenciasEspecificas.length - 1))
        return categorized.Cuarto.competenciasEspecificas[random];
      case 4:
        random = Math.round(Math.random() * (categorized.Quinto.competenciasEspecificas.length - 1))
        return categorized.Quinto.competenciasEspecificas[random];
      case 5:
        random = Math.round(Math.random() * (categorized.Sexto.competenciasEspecificas.length - 1))
        return categorized.Sexto.competenciasEspecificas[random];
      default:
        return '';
    }
  }

  pretifyBloomLevel(level: string) {
    if (level == 'knowledge') 
      return 'Recordar';
    if (level == 'undertanding')
        return 'Comprender';
    if (level == 'application')
      return 'Aplicar';
    if (level == 'analysis')
      return 'Analizar';
    if (level == 'evaluation')
      return 'Evaluar';
    
    return 'Crear';
  }

  get sectionSubjects() {
    const subjects = this.classSections.find(s => s.id == this.planForm.get('classSection')?.value)?.subjects as any as string[];
    if (subjects && subjects.length) {
      return subjects;
    }
    return [];
  }

  get classSectionName() {
    const name = this.classSections.find(s => s.id == this.planForm.get('classSection')?.value)?.name;
    if (name) {
      return name;
    }
    return '';
  }

  get classSectionLevel() {
    const level = this.classSections.find(s => s.id == this.planForm.get('classSection')?.value)?.level;
    if (level) {
      return level;
    }
    return '';
  }

  get classSectionYear() {
    const year = this.classSections.find(s => s.id == this.planForm.get('classSection')?.value)?.grade;
    if (year) {
      return year;
    }
    return '';
  }
}
