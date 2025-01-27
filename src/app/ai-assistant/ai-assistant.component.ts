import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassSection } from '../interfaces/class-section';
import { ClassSectionService } from '../services/class-section.service';
import { AiService } from '../services/ai.service';
import { AuthService } from '../services/auth.service';
import { UserSettings } from '../interfaces/user-settings';
import { PretifyPipe } from '../pipes/pretify.pipe';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-ai-assistant',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MarkdownComponent,
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sb = inject(MatSnackBar);
  private authService = inject(AuthService);
  private aiService = inject(AiService);
  private classSectionService = inject(ClassSectionService);

  sections: ClassSection[] = [];
  loading = false;
  user: UserSettings | null = null;
  response = '';
  
  assistantForm = this.fb.group({
    section: ['', Validators.required],
    question: ['', Validators.required],
  });

  ngOnInit() {
    this.loading = true;
    this.authService.profile().subscribe(user => {
      this.user = user;
    });
    this.classSectionService.findSections().subscribe({
      next: sections => {
        this.sections = sections;
        this.loading = false;
        if (sections.length == 0) {
          this.sb.open('Vas a necesitar una seccion para usar esta herramienta.', 'Ok', { duration: 2500 });
        }
      },
      error: err => {
        this.loading = false;
        this.sb.open('Ha ocurrido un error al cargar tus secciones', 'Ok', { duration: 2500 });
        console.log(err)
      }
    });
  }

  pretify(str: string) {
    return (new PretifyPipe()).transform(str);
  }

  onSubmit() {
    const data: any = this.assistantForm.value;
    const section = this.sections.find(s => s._id == data.section);
    if (!this.user || !section)
      return;

    this.loading = true;
    const query = `Eres mi asistente personal y consejero experto en el area de la educacion, especialmente la dominicana. Esta es toda la informacion que necesitas sobre mi para poder ayudarme.
Mi nombre es ${this.user.firstname} ${this.user.lastname}, soy un${this.user.gender == 'Hombre' ? '' : 'a'} docente de la República Dominicana. El centro educativo en el que trabajo se llama ${section.school.name}. Es un centro educativo del nivel ${this.pretify(section.school.level)} y trabajo en ${this.pretify(section.year)} grado de educacion ${this.pretify(section.level)} impartiendo estas asignaturas: ${section.subjects.map(s => this.pretify(s)).join(', ')}.
Te agradeceria que me hables de manera familiar, nada formal, con confianza y relajadamente puedes hablar con un pequeño grado de humor. Demuestrame con tus palabras que te sientes cercano a mi, que tienes tiempo conmigo y que estas comprometido con ayudarme.
Aqui esta mi consulta de el dia de hoy:

${data.question}.
`;
    console.log(query)
    this.aiService.geminiAi(query).subscribe({
      next: res => {
        this.response = res.response;
        this.loading = false;
      },
      error: err => {
        console.log(err.message);
        this.loading = false;
      }
    });
  }
}
