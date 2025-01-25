import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { ClassSection } from '../../interfaces/class-section';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassSectionService } from '../../services/class-section.service';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { AiService } from '../../services/ai.service';
import { MarkdownComponent } from 'ngx-markdown';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-test-generator',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatInputModule,
		MatSnackBarModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MarkdownComponent,
		RouterLink,
		AsyncPipe,
		PretifyPipe,
  ],
  templateUrl: './test-generator.component.html',
  styleUrl: './test-generator.component.scss'
})
export class TestGeneratorComponent {
	private sectionService = inject(ClassSectionService);
	private fb = inject(FormBuilder);
	private aiService = inject(AiService);

	loading = true;
	sections: ClassSection[] = [];
	subjects: string[] = [];
	section: ClassSection | null = null;
	result = '';

	itemTypes: string[] = [
		"Selección múltiple",
		"Verdadero o falso",
		"Respuesta corta",
		"Preguntas abiertas",
		"Emparejamiento",
		"Completar el espacio en blanco",
		"Pregunta de desarrollo",
		"Casos prácticos",
		"Interpretación de texto",
		"Ordena la oración",
		"Resolución de problemas"
	];

	testForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		topics: ['', Validators.required],
		items: [[] as string[], Validators.required],
		itemQuantity: [3, [Validators.required, Validators.min(3), Validators.max(5)]],
		maxScore: [30, [Validators.required, Validators.min(1), Validators.max(100)]],
	});

	load() {
		this.loading = true;
		this.sectionService.findSections().subscribe(sections => {
			this.sections = sections;
			this.loading = false;
		});
	}

	ngOnInit() {
		this.load();
	}

	onSectionSelect(event: any) {
		const sectionId: string = event.value;
		const section = this.sections.find(s => s._id == sectionId) || null;
		if (section) {
			this.section = section;
			this.subjects = section.subjects;
		}
	}

	pretify(str: string) {
		return (new PretifyPipe()).transform(str);
	}

	generate(formData: any) {
		if (!this.section)
			return;

		this.loading = true;
		const question = `Eres un docente de ${this.pretify(this.section.year)} grado de ${this.pretify(this.section.level)}. Tienes que diseñar un examen de ${this.pretify(formData.subject)} para tus alumnos. Los tipos de itemes que vas a incluir en el examen son exactamente estos:
- ${formData.items.join('\n- ')}

Puedes poner hasta ${formData.itemQuantity} itemes en el examen.

Los temas que vas a evaluar con el examen son estos:
${formData.topics}

Asigna un puntaje a cada item del examen. El puntaje maximo del examen es de ${formData.maxScore}.
Tu respuesta debe ser en formato markdown, sin recomendaciones solo el examen.`
		this.aiService.geminiAi(question).subscribe({
			next: res => {
				this.result = res.response;
				this.loading = false;
			},
			error: err => {
				console.log(err)
				this.loading = false;
			}
		});
	}

	onSubmit() {
		this.generate(this.testForm.value);
	}
}
