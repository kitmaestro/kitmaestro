import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RubricService } from '../../services/rubric.service';
import { ClassSectionService } from '../../services/class-section.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { Rubric } from '../../interfaces/rubric';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { SPANISH_CONTENTS } from '../../data/spanish-contents';
import { MATH_CONTENTS } from '../../data/math-contents';
import { SOCIETY_CONTENTS } from '../../data/society-contents';
import { SCIENCE_CONTENTS } from '../../data/science-contents';
import { ENGLISH_CONTENTS } from '../../data/english-contents';
import { FRENCH_CONTENTS } from '../../data/french-contents';
import { SPORTS_CONTENTS } from '../../data/sports-contents';
import { ART_CONTENTS } from '../../data/art-contents';
import { RELIGION_CONTENTS } from '../../data/religion-contents';
import { ART_COMPETENCE } from '../../data/art-competence';
import { ENGLISH_COMPETENCE } from '../../data/english-competence';
import { SPANISH_COMPETENCE } from '../../data/spanish-competence';
import { MATH_COMPETENCE } from '../../data/math-competence';
import { SOCIETY_COMPETENCE } from '../../data/society-competence';
import { SCIENCE_COMPETENCE } from '../../data/science-competence';
import { FRENCH_COMPETENCE } from '../../data/french-competence';
import { RELIGION_COMPETENCE } from '../../data/religion-competence';
import { SPORTS_COMPETENCE } from '../../data/sports-competence';
import spanishContentBlocks from '../../data/spanish-content-blocks.json';
import mathContentBlocks from '../../data/math-content-blocks.json';
import societyContentBlocks from '../../data/society-content-blocks.json';
import scienceContentBlocks from '../../data/science-content-blocks.json';
import englishContentBlocks from '../../data/english-content-blocks.json';
import sportsContentBlocks from '../../data/sports-content-blocks.json';
import religionContentBlocks from '../../data/religion-content-blocks.json';
import artContentBlocks from '../../data/art-content-blocks.json';
import { PdfService } from '../../services/pdf.service';
import { Student } from '../../interfaces/student';
import { StudentsService } from '../../services/students.service';
import { ClassSection } from '../../interfaces/class-section';

@Component({
  selector: 'app-rubric',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './rubric.component.html',
  styleUrl: './rubric.component.scss'
})
export class RubricComponent {
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  rubricService = inject(RubricService);
  sectionsService = inject(ClassSectionService);
  userSettingsService = inject(UserSettingsService);
  studentsService = inject(StudentsService);
  pdfService = inject(PdfService);

  sections: ClassSection[] = [];

  userSettings$ = this.userSettingsService.getSettings();
  sections$ = this.sectionsService.findSections().pipe(tap(sections => this.sections = sections));

  rubricTypes = [
    { id: 'synthetic', label: 'Sintética (Holística)' },
    { id: 'analytical', label: 'Analítica (Global)' },
  ]

  rubric: Rubric | null = null;

  generating = false;

  students: Student[] = [];

  rubricForm = this.fb.group({
    title: [''],
    minScore: [40, [Validators.required, Validators.min(0), Validators.max(100)]],
    maxScore: [100, [Validators.required, Validators.min(5), Validators.max(100)]],
    section: ['', Validators.required],
    subject: ['', Validators.required],
    content: ['', Validators.required],
    activity: ['', Validators.required],
    scored: [true],
    rubricType: ['Sintética (Holística)', Validators.required],
    achievementIndicators: [],
    levels: this.fb.array([
      this.fb.control('Deficiente'),
      this.fb.control('Bueno'),
      this.fb.control('Excelente'),
    ]),
  });

  onSubmit() {
    this.generating = true;
    this.loadStudents();
    this.createRubric(this.rubricForm.value);
  }

  loadStudents() {
    const { section } = this.rubricForm.value;
    if (section) {
      this.studentsService.bySection(section).subscribe(students => {
        this.students = students
      })
    }
  }

  findCurriculumData(level: string, grade: string, subject: string, content: string): { achievementIndicators: string[], competence: string[] } {
    let block: any = null;
    const achievementIndicators: string[] = [];
    const all = this.competence;
    const competence: string[] = [...all.Comunicativa, ...all.PensamientoLogico, ...all.EticaYCiudadana];

    if (level == 'PRIMARIA') {
      switch (subject) {
        case 'LENGUA_ESPANOLA':
          block = spanishContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'MATEMATICA':
          block = mathContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'CIENCIAS_SOCIALES':
          block = societyContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'CIENCIAS_NATURALES':
          block = scienceContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'INGLES':
          block = englishContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'FRANCES':
          // block = ContentBlocks.find(cb => cb.year == grade && cb.title == content)
          // if (block) {
          //   achievementIndicators.push(...block.achievement_indicators);
          // }
          break;
        case 'FORMACION_HUMANA':
          block = religionContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'EDUCACION_FISICA':
          block = sportsContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        case 'EDUCACION_ARTISTICA':
          block = artContentBlocks.find(cb => cb.year == grade && cb.title == content)
          if (block) {
            achievementIndicators.push(...block.achievement_indicators);
          }
          break;
        default:
          // block = ContentBlocks.find(cb => cb.year == grade && cb.title == content)
          break;
      }
    }

    return { achievementIndicators, competence }
  }

  createRubric(formValue: any) {
    const {
      title,
      minScore,
      maxScore,
      section,
      subject,
      content,
      activity,
      scored,
      rubricType,
      levels,
      achievementIndicators
    } = formValue;
    const selectedSection = this.sections.find(s => s._id == this.rubricForm.get('section')?.value);
    if (!selectedSection)
      return;
    const curriculumData: {
      achievementIndicators: string[],
      competence: string[],
    } = this.findCurriculumData(selectedSection.level, selectedSection.year, subject, content);
    const data = {
      title,
      minScore,
      maxScore,
      level: selectedSection.level,
      grade: selectedSection.year,
      section,
      subject: this.pretify(subject),
      content,
      activity,
      scored,
      rubricType,
      achievementIndicators: achievementIndicators,
      competence: curriculumData.competence,
      levels
    };
    this.rubricService.generateRubric(data).subscribe({
      next: (response) => {
        this.rubric = response;
        this.generating = false;
      },
      error: (error) => {
        this.sb.open('Error al generar la rubrica. Intentelo de nuevo.', undefined, { duration: 2500 })
        this.generating = false;
      }
    })
  }

  addRubricLevel() {
    this.rubricLevels.push(this.fb.control(''));
  }

  deleteLevel(pos: number) {
    this.rubricLevels.removeAt(pos);
  }

  pretify(str: string) {
    switch (str) {
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

  yearIndex(grade: string): number {
    if (grade == 'PRIMERO') {
      return 0;
    }
    if (grade == 'SEGUNDO') {
      return 1;
    }
    if (grade == 'TERCERO') {
      return 2;
    }
    if (grade == 'CUARTO') {
      return 3;
    }
    if (grade == 'QUINTO') {
      return 4;
    }
    return 5;
  }

  randomCompetence(categorized: any): string {
    let random = 0;
    switch (this.yearIndex(this.sections.find(s => s._id == this.rubricForm.get('section')?.value)?.year || '')) {
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

  print() {
    if (!this.rubric)
      return;
    this.sb.open('Ya estamos exportando tu rubrica. Espera un momento.', undefined, { duration: 2500 });
    this.pdfService.exportTableToPDF('rubric', this.rubric.title);
  }

  get selectedSection() {
    return this.sections.find(section => section._id == this.rubricForm.get('section')?.value);
  }

  get classSectionLevel() {
    return this.sections.find(s => s._id == this.rubricForm.get('section')?.value)?.level || '';
  }

  get subjectContents(): string[] {
    const subject = this.rubricForm.get('subject')?.value;
    const section = this.sections.find(s => s._id == this.rubricForm.get('section')?.value);
    const contents: string[] = [];
    if (subject && section) {
      const year = this.yearIndex(section.year);
      const primary = section.level == 'PRIMARIA';
      switch (subject) {
        case 'LENGUA_ESPANOLA':
          contents.push(...(primary ? SPANISH_CONTENTS.primary : SPANISH_CONTENTS.highSchool)[year]);
          break;
        case 'MATEMATICA':
          contents.push(...(primary ? MATH_CONTENTS.primary : MATH_CONTENTS.highSchool)[year]);
          break;
        case 'CIENCIAS_SOCIALES':
          contents.push(...(primary ? SOCIETY_CONTENTS.primary : SOCIETY_CONTENTS.highSchool)[year]);
          break;
        case 'CIENCIAS_NATURALES':
          contents.push(...(primary ? SCIENCE_CONTENTS.primary : SCIENCE_CONTENTS.highSchool)[year]);
          break;
        case 'INGLES':
          contents.push(...(primary ? ENGLISH_CONTENTS.primary : ENGLISH_CONTENTS.highSchool)[year]);
          break;
        case 'FRANCES':
          contents.push(...(primary ? FRENCH_CONTENTS.primary : FRENCH_CONTENTS.highSchool)[year]);
          break;
        case 'EDUCACION_FISICA':
          contents.push(...(primary ? SPORTS_CONTENTS.primary : SPORTS_CONTENTS.highSchool)[year]);
          break;
        case 'FORMACION_HUMANA':
          contents.push(...(primary ? ART_CONTENTS.primary : ART_CONTENTS.highSchool)[year]);
          break;
        case 'EDUCACION_ARTISTICA':
          contents.push(...(primary ? RELIGION_CONTENTS.primary : RELIGION_CONTENTS.highSchool)[year]);
          break;
        default:
          break;
      }
    }
    return contents;
  }

  get sectionSubjects(): string[] {
    const section = this.sections.find(s => s._id == this.rubricForm.get('section')?.value);
    if (section) {
      return (typeof(section.subjects) == 'string' ? section.subjects.split(',').map(s => s.trim()) : section.subjects as any as string[]);
    }
    return [] as string[];
  }

  get rubricLevels() {
    return this.rubricForm.get('levels') as FormArray;
  }

  get competence(): { Comunicativa: string[], PensamientoLogico: string[], EticaYCiudadana: string[],  } {
    const comps: {
      Comunicativa: string[],
      PensamientoLogico: string[],
      EticaYCiudadana: string[],
    } = {
      Comunicativa: [],
      PensamientoLogico: [],
      EticaYCiudadana: []
    };

    const { subject } = this.rubricForm.value;

    if (subject == 'LENGUA_ESPANOLA') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPANISH_COMPETENCE.Primaria.Comunicativa : SPANISH_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPANISH_COMPETENCE.Primaria.PensamientoLogico : SPANISH_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPANISH_COMPETENCE.Primaria.EticaYCiudadana : SPANISH_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'MATEMATICA') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? MATH_COMPETENCE.Primaria.Comunicativa : MATH_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? MATH_COMPETENCE.Primaria.PensamientoLogico : MATH_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? MATH_COMPETENCE.Primaria.EticaYCiudadana : MATH_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'CIENCIAS_SOCIALES') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SOCIETY_COMPETENCE.Primaria.Comunicativa : SOCIETY_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SOCIETY_COMPETENCE.Primaria.PensamientoLogico : SOCIETY_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SOCIETY_COMPETENCE.Primaria.EticaYCiudadana : SOCIETY_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'CIENCIAS_NATURALES') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SCIENCE_COMPETENCE.Primaria.Comunicativa : SCIENCE_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SCIENCE_COMPETENCE.Primaria.PensamientoLogico : SCIENCE_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SCIENCE_COMPETENCE.Primaria.EticaYCiudadana : SCIENCE_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'INGLES') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ENGLISH_COMPETENCE.Primaria.Comunicativa : ENGLISH_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ENGLISH_COMPETENCE.Primaria.PensamientoLogico : ENGLISH_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ENGLISH_COMPETENCE.Primaria.EticaYCiudadana : ENGLISH_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'FRANCES') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? FRENCH_COMPETENCE.Primaria.Comunicativa : FRENCH_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? FRENCH_COMPETENCE.Primaria.PensamientoLogico : FRENCH_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? FRENCH_COMPETENCE.Primaria.EticaYCiudadana : FRENCH_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'FORMACION_HUMANA') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? RELIGION_COMPETENCE.Primaria.Comunicativa : RELIGION_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? RELIGION_COMPETENCE.Primaria.PensamientoLogico : RELIGION_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? RELIGION_COMPETENCE.Primaria.EticaYCiudadana : RELIGION_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'EDUCACION_FISICA') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPORTS_COMPETENCE.Primaria.Comunicativa : SPORTS_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPORTS_COMPETENCE.Primaria.PensamientoLogico : SPORTS_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? SPORTS_COMPETENCE.Primaria.EticaYCiudadana : SPORTS_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    if (subject == 'EDUCACION_ARTISTICA') {
      comps.Comunicativa.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ART_COMPETENCE.Primaria.Comunicativa : ART_COMPETENCE.Secundaria.Comunicativa));
      comps.PensamientoLogico.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ART_COMPETENCE.Primaria.PensamientoLogico : ART_COMPETENCE.Secundaria.PensamientoLogico));
      comps.EticaYCiudadana.push(this.randomCompetence(this.classSectionLevel == 'PRIMARIA' ? ART_COMPETENCE.Primaria.EticaYCiudadana : ART_COMPETENCE.Secundaria.EticaYCiudadana));
    }

    return comps;
  }

  get contentAchievementIndicators(): string[] {
    const indicators: string[] = [];
    const {
      subject,
      content
    } = this.rubricForm.value;
    const selectedSection = this.sections.find(s => s._id == this.rubricForm.get('section')?.value);
    if (!selectedSection || !subject || !content)
      return indicators;

    const curriculumData: {
      achievementIndicators: string[],
      competence: string[],
    } = this.findCurriculumData(selectedSection.level, selectedSection.year, subject, content);
    indicators.push(...curriculumData.achievementIndicators);

    return indicators;
  }
}
