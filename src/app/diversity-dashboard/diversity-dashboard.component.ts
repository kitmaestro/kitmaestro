import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassSection } from '../interfaces/class-section';
import { ClassSectionService } from '../services/class-section.service';
import { AiService } from '../services/ai.service';
import { MarkdownComponent } from 'ngx-markdown';
import { PretifyPipe } from '../pipes/pretify.pipe';
import { AuthService } from '../services/auth.service';
import { UserSettings } from '../interfaces/user-settings';
import { TestService } from '../services/test.service';
import { Test } from '../interfaces/test';

@Component({
	selector: 'app-diversity-dashboard',
	imports: [
		PretifyPipe,
		MatCardModule,
		MatIconModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MarkdownComponent,
		MatSnackBarModule,
		MatFormFieldModule,
		ReactiveFormsModule,
	],
	templateUrl: './diversity-dashboard.component.html',
	styleUrl: './diversity-dashboard.component.scss',
})
export class DiversityDashboardComponent implements OnInit {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private aiService = inject(AiService);
	private sectionService = inject(ClassSectionService);
	private authService = inject(AuthService);
	private testService = inject(TestService);

	loading = true;
	conditions: string[] = [
		'Discapacidad visual',
		'Discapacidad auditiva',
		'Trastorno del espectro autista (TEA)',
		'Trastorno por déficit de atención e hiperactividad (TDAH)',
		'Dislexia',
		'Discalculia',
		'Disgrafía',
		'Trastorno específico del lenguaje (TEL)',
		'Trastorno de ansiedad',
		'Trastorno depresivo',
		'Trastorno bipolar',
		'Esquizofrenia',
		'Síndrome de Down',
		'Parálisis cerebral',
		'Trastorno de procesamiento sensorial',
		'Trastorno de la coordinación motora',
		'Trastorno de aprendizaje no verbal',
		'Altas capacidades intelectuales',
		'Enfermedad crónica (diabetes, asma, epilepsia, etc.)',
		'Trauma o abuso',
	];
	sections: ClassSection[] = [];
	subjects: string[] = [];
	user: UserSettings | null = null;

	generated = '';

	diversityForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		topic: ['', [Validators.required, Validators.minLength(4)]],
		condition: ['', Validators.required],
	});

	load() {
		this.sectionService.findSections().subscribe((sections) => {
			this.sections = sections;
			this.loading = false;
		});
	}

	onSectionSelect(event: any) {
		setTimeout(() => {
			const section = this.sections.find((s) => s._id === event.value);
			if (section) this.subjects = section.subjects;
		}, 0);
	}

	ngOnInit() {
		this.load();
		this.authService.profile().subscribe((user) => (this.user = user));
	}

	onSubmit() {
		const data: any = this.diversityForm.value;
		const section = this.sections.find((s) => s._id === data.section);
		const user = this.user;
		if (!section || !user) return;

		this.loading = true;
		const query = `Eres ${user.gender === 'Hombre' ? 'un profesor especializado' : 'una profesora especializada'} en la atencion a la diversidad en el aula y tu tarea es asesorarme para obtener los mejores resultados posibles gastando la menor cantidad de energia posible, es decir, ayudarme a ser tan eficiente como sea posible manteniendo o mejorando mi nivel de efectividad en la eseñanza.
A continuación te presento mi situación particular en estos momentos.
Mi nombre es ${user.firstname}, ${user.gender === 'Hombre' ? 'un maestro' : 'una maestra'} que trabaja en ${section.year.toLowerCase()} grado de ${section.level.toLowerCase()} en el centro educativo ${section.school.name}.
En esta ocación he planificado una clase de ${data.subject} en la que voy a trabajar o a abordar ${data.topic} en mi curso, pero tengo una situación con un estudiante y quiero adaptarla a su condición que es ${data.condition}.
Tu trabajo sera guiarme en el proceso de adaptación y sugerirme las estrategias mas adecuadas.

Importante: NO HAGAS PREGUNTAS DE SEGUIMIENTO NI SUGIERAS QUE PUEDO PREGUNTAR YA QUE ESTO NO ME ES POSIBLE Y RESPONDE EN FORMATO MARKDOWN SIN TABLAS NI EMOTICONES.`;
		this.aiService.geminiAi(query).subscribe({
			next: (res) => {
				this.generated = res.response;
				this.loading = false;
			},
			error: (err) => {
				console.log(err.message);
				this.loading = false;
				this.sb.open(
					'Ha ocurrido un error al generar la adaptacion. Intentalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}

	async download() {
		const data: any = this.diversityForm.value;
		const section = this.sections.find((s) => s._id === data.section);
		if (!section || !this.user) return;

		this.loading = true;
		const text: Test = {
			body: this.generated,
			section,
			subject: data.subject,
			user: this.user,
		} as any;
		await this.testService.download(text);
		this.loading = false;
	}
}
