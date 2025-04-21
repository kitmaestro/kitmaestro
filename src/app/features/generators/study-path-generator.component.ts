import {
  Component, signal, inject, ChangeDetectionStrategy, OnInit, OnDestroy, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, Observable, firstValueFrom, takeUntil, tap, catchError, EMPTY, finalize } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// --- Core Services & Interfaces (Using new structure paths) ---
import { AiService } from '../../core/services/ai.service';
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';
// ClassSectionService not needed for this component

// --- DOCX Generation ---
import { Document, Packer, Paragraph, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-study-path-generator', // Component selector
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MarkdownComponent,
  ],
  // --- Inline Template ---
  template: `
<mat-card class="study-path-card"> <mat-card-header>
    <mat-card-title>Generador de Ruta de Estudio</mat-card-title>
    <mat-card-subtitle>Planifica tu aprendizaje paso a paso</mat-card-subtitle>
  </mat-card-header>

  <mat-card-content>
    @if (!showResult()) {
      <form [formGroup]="studyPathForm" (ngSubmit)="onSubmit()" class="study-path-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Tema / Asignatura / Habilidad</mat-label>
            <input matInput formControlName="topicSkill" required placeholder="Ej: Álgebra Lineal, Programación en Python, Hablar en Público">
             @if (topicSkillCtrl?.invalid && topicSkillCtrl?.touched) {
              <mat-error>Este campo es requerido.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Nivel de Maestría Objetivo</mat-label>
            <mat-select formControlName="masteryLevel" required>
               @for (level of masteryLevels; track level) {
                <mat-option [value]="level">{{ level }}</mat-option>
              }
            </mat-select>
             @if (masteryLevelCtrl?.invalid && masteryLevelCtrl?.touched) {
              <mat-error>Selecciona el nivel deseado.</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="form-actions">
           <button mat-raised-button color="primary" type="submit" [disabled]="studyPathForm.invalid || isGenerating()">
            @if (isGenerating()) {
              <div [style]="{ display: 'flex', alignItems: 'center' }">
                 <mat-spinner diameter="20" color="accent" class="inline-spinner"></mat-spinner>
                 Generando...
              </div>
            } @else {
              <ng-container>
                 <mat-icon>route</mat-icon> Generar Ruta de Estudio
              </ng-container>
            }
          </button>
        </div>
      </form>
    }

    @if (showResult()) {
      <div class="study-path-result">
        <h3>Ruta de Estudio Sugerida:</h3>
        <div class="study-path-result-content"><markdown [data]="generatedStudyPath().replaceAll('\n\n', '\n')"/></div>

        <div class="result-actions">
          <button mat-stroked-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon> Volver
          </button>
          <button mat-raised-button color="primary" (click)="downloadDocx()" [disabled]="!generatedStudyPath() || generatedStudyPath().startsWith('Ocurrió un error')">
             <mat-icon>download</mat-icon> Descargar (.docx)
          </button>
        </div>
      </div>
    }
  </mat-card-content>
</mat-card>
  `,
  // --- Inline Styles ---
  styles: [`
    :host { display: block; }
    .study-path-card { margin: 0 auto; padding: 15px 25px 25px 25px; }
    .study-path-form { margin-top: 16px; display: flex; flex-direction: column; gap: 15px; }
    .form-row { display: flex; gap: 15px; flex-wrap: wrap; }
    .form-field { flex: 1; min-width: 250px; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 20px; }
    .form-actions button mat-icon,
    .result-actions button mat-icon { margin-right: 5px; vertical-align: middle; }
    .inline-spinner { display: inline-block; margin-right: 8px; vertical-align: middle; }
    .study-path-result { margin-top: 20px; }
    .study-path-result h3 { margin-bottom: 15px; }
    .study-path-result-content {
      background-color: #f5f5f5; /* Neutral background */
      border: 1px solid #e0e0e0;
      border-left: 5px solid #424242; /* Dark grey accent */
      padding: 25px 35px;
      min-height: 300px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      line-height: 1.7;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Clean sans-serif */
      font-size: 11pt;
      margin-bottom: 20px;
      max-width: 100%;
      white-space: pre-wrap; /* Preserve formatting */
    }
    /* Style potential headings/lists if AI uses them */
     .study-path-result-content strong { /* Example: Bold text for headings */
        display: block;
        margin-top: 1em;
        margin-bottom: 0.5em;
        font-weight: bold;
        font-size: 1.1em;
     }
     .study-path-result-content ul, .study-path-result-content ol {
        padding-left: 30px;
        margin-top: 0.5em;
        margin-bottom: 1em;
     }
     .study-path-result-content li {
        margin-bottom: 0.5em;
     }
    .result-actions { display: flex; justify-content: space-between; margin-top: 20px; flex-wrap: wrap; gap: 10px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StudyPathGeneratorComponent implements OnInit, OnDestroy {
  // --- Dependencies ---
  #fb = inject(FormBuilder);
  #aiService = inject(AiService);
  // ClassSectionService not needed
  #snackBar = inject(MatSnackBar);

  #pretify = (new PretifyPipe()).transform;

  // --- State Signals ---
  isGenerating = signal(false);
  showResult = signal(false);
  generatedStudyPath = signal<string>(''); // Stores the AI response string

  // --- Form Definition ---
  studyPathForm = this.#fb.group({
    topicSkill: ['', Validators.required],
    masteryLevel: ['Intermedio', Validators.required], // Default value
  });

  // --- Fixed Select Options ---
  readonly masteryLevels = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];

  // --- Lifecycle Management ---
  #destroy$ = new Subject<void>();

  // --- OnInit ---
  ngOnInit(): void {
    // No initial data loading needed
  }

  // --- OnDestroy ---
  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  // --- Private Methods ---

   #handleError(error: any, defaultMessage: string): Observable<never> {
      console.error(defaultMessage, error);
      this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 });
      return EMPTY;
   }

   /** Maps user selection to prompt instructions for mastery level */
   #getMasteryInstruction(masterySelection: string): string {
       switch(masterySelection) {
           case 'Principiante': return 'un nivel básico/introductorio, cubriendo los fundamentos esenciales';
           case 'Intermedio': return 'un nivel intermedio, construyendo sobre los fundamentos con mayor profundidad y aplicación práctica';
           case 'Avanzado': return 'un nivel avanzado, abordando temas complejos, especializaciones y análisis crítico';
           case 'Experto': return 'un nivel experto, enfocado en la maestría profunda, contribución original o enseñanza del tema';
           default: return 'un nivel intermedio';
       }
   }

  // --- Public Methods ---

  /** Handles form submission */
  async onSubmit(): Promise<void> {
    if (this.studyPathForm.invalid) {
      this.studyPathForm.markAllAsTouched();
      this.#snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isGenerating.set(true);
    this.generatedStudyPath.set('');
    this.showResult.set(false);

    const formValue = this.studyPathForm.getRawValue();

    // Construct the prompt for generating the study path
    const prompt = `Eres un diseñador instruccional y planificador de aprendizaje experto.
      Necesito que crees una "Ruta de Estudio" estructurada y realista para aprender sobre un tema o habilidad específica.

      Instrucciones para la Ruta de Estudio:
      - Tema/Habilidad a Aprender: ${formValue.topicSkill}
      - Nivel de Maestría Objetivo: El estudiante desea alcanzar ${this.#getMasteryInstruction(formValue.masteryLevel!)}. La ruta debe estar diseñada para llevar a alguien desde un conocimiento básico (o nulo) hasta este nivel objetivo.
      - Pasos de Aprendizaje: Detalla los pasos o módulos de aprendizaje específicos en un orden lógico y progresivo. Empieza por los fundamentos y avanza gradualmente. Sé concreto en los subtemas a cubrir en cada paso.
      - Estimación de Tiempo: Proporciona una estimación general del tiempo necesario (ej: "varias semanas", "2-3 meses dedicando X horas/semana", "6 meses"). Sé realista.
      - Tipos de Recursos Sugeridos: Incluye una breve lista de *tipos* de recursos recomendados para empezar (ej: "libros introductorios", "cursos en línea (plataformas como Coursera/Udemy)", "documentación oficial", "tutoriales en video", "proyectos prácticos pequeños", "comunidades en línea", "mentores"). No proporciones URLs específicas a menos que sea una fuente oficial muy estándar (como python.org).
      - Formato: Estructura la respuesta claramente usando títulos o secciones para "Pasos de Aprendizaje", "Tiempo Estimado", y "Recursos Sugeridos". Usa listas numeradas o con viñetas para los pasos y recursos.

      IMPORTANTE: La ruta debe ser práctica y motivadora. No incluyas saludos ni despedidas.`;

    try {
      const result = await firstValueFrom(this.#aiService.geminiAi(prompt));
      this.generatedStudyPath.set(result?.response || 'No se pudo generar la ruta de estudio.');
      this.showResult.set(true);
    } catch (error) {
       this.generatedStudyPath.set('Ocurrió un error al generar la ruta de estudio. Por favor, inténtalo de nuevo.');
       this.showResult.set(true); // Show error in result area
       this.#handleError(error, 'Error al contactar el servicio de IA');
    } finally {
      this.isGenerating.set(false);
    }
  }

  /** Resets the form and view */
  goBack(): void {
    this.showResult.set(false);
    this.generatedStudyPath.set('');
    // Reset form to defaults
    this.studyPathForm.reset({
        topicSkill: '',
        masteryLevel: 'Intermedio'
    });
  }

  /** Downloads the generated study path as DOCX */
  downloadDocx(): void {
    const studyPathText = this.generatedStudyPath();
    if (!studyPathText || studyPathText.startsWith('Ocurrió un error')) return;

    const formValue = this.studyPathForm.getRawValue();

    // Sanitize filename parts
    const topicName = (formValue.topicSkill || 'RutaEstudio').substring(0,25).replace(/[^a-z0-9]/gi, '_');
    const masteryLevelName = (formValue.masteryLevel || 'Nivel').replace(/[^a-z0-9]/gi, '_');

    const filename = `RutaEstudio_${topicName}_${masteryLevelName}.docx`;

    // Create paragraphs, trying to identify headings and list items
    const paragraphs: Paragraph[] = [];
    const lines = studyPathText.split('\n').filter(line => line.trim().length > 0);

    lines.forEach(line => {
        const trimmedLine = line.trim();
        // Basic check for potential headings (all caps, ends with ':', short)
        if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.endsWith(':') && trimmedLine.length < 50) {
             paragraphs.push(new Paragraph({ text: trimmedLine.slice(0, -1), heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }));
        }
        // Basic check for list items
        else if (trimmedLine.match(/^(\*|-|\d+\.)\s+/)) {
             paragraphs.push(new Paragraph({
                 text: trimmedLine.replace(/^(\*|-|\d+\.)\s+/, ''),
                 bullet: { level: 0 },
                 spacing: { after: 60 },
             }));
        }
        // Regular paragraph
        else {
             paragraphs.push(new Paragraph({
                 text: trimmedLine,
                 spacing: { after: 120 },
             }));
        }
    });


    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
              new Paragraph({ text: `Ruta de Estudio Sugerida`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
              new Paragraph({ text: `Para: ${formValue.topicSkill}`, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
              new Paragraph({ text: `Nivel Objetivo: ${formValue.masteryLevel}`, alignment: AlignmentType.CENTER, style: "SubtleEmphasis"}),
              new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
              ...paragraphs // Add the generated content paragraphs
          ],
        },
      ],
       styles: { // Reusing styles
            paragraphStyles: [
                {
                    id: "Normal", name: "Normal",
                    run: { font: "Segoe UI", size: 22 }, // 11pt
                },
                 {
                    id: "SubtleEmphasis", name: "Subtle Emphasis", basedOn: "Normal",
                    run: { italics: true, color: "5A5A5A", size: 20 }, // 10pt
                },
            ]
        }
    });

    // Generate blob and trigger download
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, filename);
    }).catch(error => {
        console.error("Error creating DOCX file:", error);
        this.#snackBar.open('Error al generar el archivo DOCX.', 'Cerrar', { duration: 3000 });
    });
  }

  // --- Getters for easier access to form controls ---
  get topicSkillCtrl(): AbstractControl | null { return this.studyPathForm.get('topicSkill'); }
  get masteryLevelCtrl(): AbstractControl | null { return this.studyPathForm.get('masteryLevel'); }
}
