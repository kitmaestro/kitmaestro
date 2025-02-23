import { Component, OnInit, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { AiService } from '../../services/ai.service';
import { ClassSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../interfaces/class-section';
import { ContentBlock } from '../../interfaces/content-block';
import { ContentBlockService } from '../../services/content-block.service';
import { CompetenceService } from '../../services/competence.service';
import { CompetenceEntry } from '../../interfaces/competence-entry';

@Component({
    selector: 'app-aspects-generator',
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
    ],
    templateUrl: './aspects-generator.component.html',
    styleUrl: './aspects-generator.component.scss'
})
export class AspectsGeneratorComponent implements OnInit {
  private aiService = inject(AiService);
  private sectionService = inject(ClassSectionService);
	private contentService = inject(ContentBlockService);
	private competenceService = inject(CompetenceService);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);

	columns = ['p1', 'p2', 'p3', 'p4'];
	competence: CompetenceEntry[] = [];
  sections: ClassSection[] = [];
  generating = false;
  generated = false;
  loading = false;
  dataSource: { p1: string, p2: string, p3: string, p4: string }[] = [];
  aspects: { p1: string[], p2: string[], p3: string[], p4: string[] } = {
    p1: [],
    p2: [],
    p3: [],
    p4: [],
  };
  contents: ContentBlock[] = [];
  subjects: { id: string, label: string }[] = [];

  generatorForm = this.fb.group({
    section: [''],
    subject: [''],
    qty: [12],
    p1: [[] as string[]],
    p2: [[] as string[]],
    p3: [[] as string[]],
    p4: [[] as string[]],
  });

  prompt = `Para asentar las calificaciones de los estudiantes en el registro de grado, las calificaciones se dividen en cuatro periodos: P1, P2, P3 Y P4.
Antes de poder asentarlas, tengo que escribir cuales son los aspectos que he trabajado de los contenidos que he impartido en el aula y en base a los cuales he podido recolectar las calificaciones parciales.
Para hacer esto ultimo, necesito que me crees objecto JSON con esta interfaz:
{
  p1: string[],
  p2: string[],
  p3: string[],
  p4: string[]
}

Un ejemplo de como deberia verse el resultado es este:
-- Delimitacion --
Tema: la carta de agradecimiento
Limite de aspectos: 12
Periodos trabajados: p1
-- respuesta --
{
  p1: [
    'Escucha atenta de la lectura de cartas de agradecimiento',
    'Identificación del tipo de texto que escucha',
    'Producción de cartas de agradecimiento de manera oral',
    'Lectura de cartas de agradecimiento en voz alta',
    'Redacción de cartas de agradecimiento'
  ],
  p2: [],
  p3: [],
  p4: [],
}
Donde cada periodo es un array de no mas de aspect_qty strings, y cada string es un aspecto especifico (caracteristica, elemento, actividad, contenido) que se puede trabajar en section_year grado de section_level en el area de class_subject con los contenidos que he trabajado que son estos:\nclass_topics
Y estos son los criterios de evaluacion y las competencias que he trabajado:
Competencias:
- competence_list

Criterios de evaluacion:
- evaluation_criteria`;

  ngOnInit() {
    this.sectionService.findSections().subscribe(sections => {
      if (sections.length) {
        this.sections = sections;
        this.subjects = sections[0].subjects.map(subject => ({ id: subject, label: this.pretify(subject) }));
        this.generatorForm.get('section')?.setValue(sections[0]._id);
      }
    });
  }

  onSectionSelect(event: any) {
    const value: string = event.value;
    const section = this.sections.find(s => s._id == value);
    if (section) {
      this.subjects = section.subjects.map(subject => ({ id: subject, label: this.pretify(subject) }));
      this.generatorForm.get('subject')?.setValue(section.subjects[0]);
      this.onSubjectSelect({ value: this.generatorForm.get('subject')?.value });
    }
  }

  onSubjectSelect(event: any) {
    setTimeout(() => {
      const section = this.sections.find(s => s._id == this.generatorForm.get('section')?.value);
      if (section) {

        this.contentService.findAll({ year: section.year, level: section.level, subject: event.value }).subscribe({
          next: contents => {
				this.contents = contents;
				this.onContentSelect();
          },
          error: err => {
            console.log(err);
            this.sb.open('Ha ocurrido un error al cargar los contenidos');
          }
        });
      }
    }, 0);
  }

	onContentSelect() {
		setTimeout(() => {
			const subject = this.generatorForm.get('subject')?.value;
			const section = this.sections.find(s => s._id == this.generatorForm.get('section')?.value);
			if (subject && section) {
				const { year, level } = section;
				this.competenceService.findAll({ grade: year, level, subject }).subscribe(c => {
					this.competence = c;
				});
			}
		}, 0);
	}

  reset() {
    this.generatorForm.setValue({
      section: this.sections[0] ? this.sections[0]._id : '',
      subject: this.subjects[0] ? this.subjects[0].id : '',
      qty: 12,
      p1: [],
      p2: [],
      p3: [],
      p4: []
    });
    this.dataSource = [];
    this.generated = false;
  }

  onSubmit() {
    const data: any = this.generatorForm.value;
    data.p1 = (data.p1 as string[]).map(s => this.contents.find(c => c.title == s) as ContentBlock).flatMap(block => [block.concepts, block.procedures, block.attitudes, block.achievement_indicators].flat().join('\n- '));
    data.p2 = (data.p2 as string[]).map(s => this.contents.find(c => c.title == s) as ContentBlock).flatMap(block => [block.concepts, block.procedures, block.attitudes, block.achievement_indicators].flat().join('\n- '));
    data.p3 = (data.p3 as string[]).map(s => this.contents.find(c => c.title == s) as ContentBlock).flatMap(block => [block.concepts, block.procedures, block.attitudes, block.achievement_indicators].flat().join('\n- '));
    data.p4 = (data.p4 as string[]).map(s => this.contents.find(c => c.title == s) as ContentBlock).flatMap(block => [block.concepts, block.procedures, block.attitudes, block.achievement_indicators].flat().join('\n- '));
    const section = this.sections.find(s => s._id == data.section);
    if (section) {
      this.generating = true;
      const query = this.prompt.replace('aspect_qty', data.qty)
        .replace('section_year', section.year.toLowerCase())
        .replace('section_level', section.level.toLowerCase())
        .replace('class_subject', this.pretify(data.subject))
        .replace('competence_list', this.competence.flatMap(c => c.entries).join('\n- '))
        .replace('evaluation_criteria', this.competence.flatMap(c => c.criteria).join('\n- '))
        .replace('class_topics', [
          data.p1.length ? 'P1:\n- ' + data.p1.join('\n- ') : 'P1: \nNINGUNO (el p1 debe ser un array vacio { p1: [] })',
          data.p2.length ? 'P2:\n- ' + data.p2.join('\n- ') : 'P2: \nNINGUNO (el p2 debe ser un array vacio { p2: [] })',
          data.p3.length ? 'P3:\n- ' + data.p3.join('\n- ') : 'P3: \nNINGUNO (el p3 debe ser un array vacio { p3: [] })',
          data.p4.length ? 'P4:\n- ' + data.p4.join('\n- ') : 'P4: \nNINGUNO (el p4 debe ser un array vacio { p4: [] })',
        ].join('\n'));
      this.aiService.geminiAi(query).subscribe({
        next: result => {
          const { response } = result;
          const start = response.indexOf('{');
          const end = response.lastIndexOf('}') + 1;
          const aspects = JSON.parse(response.slice(start, end)) as { p1: string[], p2: string[], p3: string[], p4: string[] };
          this.aspects = aspects;
          this.dataSource = this.parseAspects(aspects);
          this.generated = true;
          this.generating = false;
        },
        error: err => {
          this.sb.open('Error al generar los aspectos', 'Ok', { duration: 2500 });
          console.log(err.message);
          this.generated = false;
          this.generating = false;
        }
      });
    }
  }

  parseAspects(aspects: { p1: string[], p2: string[], p3: string[], p4: string[] }): { p1: string, p2: string, p3: string, p4: string }[] {
    const length = Math.max(aspects.p1.length, aspects.p2.length, aspects.p3.length, aspects.p4.length);
    const result = Array.from({ length }, (_, i) => ({
      p1: aspects.p1[i],
      p2: aspects.p2[i],
      p3: aspects.p3[i],
      p4: aspects.p4[i],
    }));

    return result;
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
}
