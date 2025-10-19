import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { ClassSection } from '../../../core/interfaces/class-section';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { AiService } from '../../../core/services/ai.service';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces';
import { Test } from '../../../core/interfaces/test';
import { TestService } from '../../../core/services/test.service';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

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
		PretifyPipe,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<mat-card>
				<mat-card-header
					style="justify-content: space-between; align-items: center"
				>
					<mat-card-title>Generador de Exámenes</mat-card-title>
					<button mat-flat-button routerLink="/tests">Mis Ex&aacute;menes</button>
				</mat-card-header>
				<mat-card-content>
					<div style="margin-top: 24px">
						<form [formGroup]="testForm" (ngSubmit)="onSubmit()">
							<div class="grid-2">
								<div>
									<mat-form-field>
										<mat-label>Grado</mat-label>
										<mat-select
											formControlName="section"
											(selectionChange)="onSectionSelect($event)"
										>
											@for (section of sections; track section._id) {
												<mat-option [value]="section._id">{{
													section.name
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field>
										<mat-label>Asignatura</mat-label>
										<mat-select formControlName="subject">
											@for (subject of subjects; track subject) {
												<mat-option [value]="subject">{{
													subject | pretify
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>
							</div>
							<div>
								<mat-form-field>
									<mat-label>Tipos de Ejercicios</mat-label>
									<mat-select formControlName="items" multiple>
										@for (itemType of itemTypes; track itemType) {
											<mat-option [value]="itemType">{{
												itemType | pretify
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div class="grid-2">
								<div>
									<mat-form-field>
										<mat-label>Cantidad de &Iacute;temes</mat-label>
										<input
											type="number"
											matInput
											formControlName="itemQuantity"
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field>
										<mat-label>Puntaje M&aacute;ximo</mat-label>
										<input
											type="number"
											matInput
											formControlName="maxScore"
										/>
									</mat-form-field>
								</div>
							</div>
							<div>
								<mat-form-field>
									<mat-label>Temas (Un tema por l&iacute;nea)</mat-label>
									<textarea matInput formControlName="topics"></textarea>
								</mat-form-field>
							</div>
							<div
								style="
									display: flex;
									gap: 12px;
									flex-direction: row-reverse;
								"
							>
								<button
									mat-fab
									extended
									[disabled]="!test || loading"
									(click)="save()"
									type="button"
								>
									<mat-icon>save</mat-icon> Guardar
								</button>
								<button
									mat-fab
									extended
									[disabled]="testForm.invalid || loading"
									type="submit"
								>
									<mat-icon>bolt</mat-icon>
									{{ test ? "Regenerar" : "Generar" }}
								</button>
							</div>
						</form>
					</div>
				</mat-card-content>
			</mat-card>
			@if (result) {
				<div style="margin-top: 24px">
					<div style="max-width: 8.5in; margin: 0 auto">
						<mat-card>
							<mat-card-content>
								<markdown [data]="result"></markdown>
							</mat-card-content>
						</mat-card>
					</div>
				</div>
			}
		</app-is-premium>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr 1fr;
		}
	`,
})
export class TestGeneratorComponent implements OnInit {
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private aiService = inject(AiService);
	private testService = inject(TestService);
	private mdService = inject(MarkdownService);
	private userService = inject(UserService);
	private sectionService = inject(ClassSectionService);

	loading = true;
	sections: ClassSection[] = [];
	subjects: string[] = [];
	section: ClassSection | null = null;
	user: User | null = null;
	result = '';
	test: Test | null = null;

	itemTypes: string[] = [
		'Selección múltiple',
		'Verdadero o falso',
		'Respuesta corta',
		'Preguntas abiertas',
		'Emparejamiento',
		'Completar el espacio en blanco',
		'Pregunta de desarrollo',
		'Casos prácticos',
		'Interpretación de texto',
		'Ordena la oración',
		'Resolución de problemas',
	];

	testForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		topics: ['', Validators.required],
		items: [[] as string[], Validators.required],
		itemQuantity: [
			4,
			[Validators.required, Validators.min(3), Validators.max(10)],
		],
		maxScore: [
			30,
			[Validators.required, Validators.min(1), Validators.max(100)],
		],
	});

	load() {
		this.loading = true;
		this.sectionService.findSections().subscribe((sections) => {
			this.sections = sections;
			this.loading = false;
		});
	}

	ngOnInit() {
		this.load();
		this.userService.getSettings().subscribe((user) => {
			this.user = user;
		});
	}

	onSectionSelect(event: any) {
		const sectionId: string = event.value;
		const section = this.sections.find((s) => s._id === sectionId) || null;
		if (section) {
			this.section = section;
			this.subjects = section.subjects;
		}
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	generate(formData: any) {
		if (!this.section || !this.user) return;

		this.loading = true;
		const section = this.section;
		const d = new Date();
		const currentYear = d.getFullYear();
		const schoolYear =
			d.getMonth() > 7
				? `${currentYear} - ${currentYear + 1}`
				: `${currentYear - 1} - ${currentYear}`;
		const question = `Eres un docente de ${this.pretify(section.year)} grado de ${this.pretify(section.level)}. Tienes que diseñar un examen de ${this.pretify(formData.subject)} para tus alumnos. Los tipos de itemes que vas a incluir en el examen son exactamente estos:
- ${formData.items.join('\n- ')}

Puedes poner hasta ${formData.itemQuantity} itemes en el examen.

Los temas que vas a evaluar con el examen son estos:
${formData.topics}

Asigna un puntaje a cada item del examen. El puntaje maximo del examen es de ${formData.maxScore}.
Tu respuesta debe ser en formato markdown, sin recomendaciones solo el examen y sin campos que yo deba agregar, necesito que este listo para imprimir, asi que si tienes que inventar un nombre, o una situacion imaginaria, por mi esta excelente.
Me gustaria qu el encabezado sea, el nombre de el centro en el que trabajo: ${this.user.schoolName}
Luego mi nombre: ${this.user.title}. ${this.user.firstname} ${this.user.lastname}.
En la tercera linea, el grado en cuestion y el año escolar: ${this.pretify(section.name)} ${schoolYear}
Y finalmente un espacio para que el alumno coloque su nombre y uno para la fecha.

Al final del examen, incluye un mensaje sencillo pero alentador o un 'Buena suerte'`;
		this.aiService.geminiAi(question).subscribe({
			next: async (res) => {
				this.result = res.response;
				this.loading = false;
				if (this.user) {
					const test: any = {
						answers: '',
						body: res.response,
						section: section._id,
						subject: formData.subject,
						user: this.user._id,
					};
					this.test = test as Test;
				}
				localStorage.setItem('exam', res.response);
				localStorage.setItem(
					'test',
					await this.mdService.parse(res.response),
				);
			},
			error: (err) => {
				console.log(err);
				this.loading = false;
			},
		});
	}

	onSubmit() {
		this.generate(this.testForm.value);
	}

	save() {
		if (!this.test) return;

		this.loading = true;
		this.testService.create(this.test).subscribe({
			next: (res) => {
				this.loading = false;
				if (res._id) {
					// redirect
					this.router.navigate(['/tests', res._id]).then(() => {
						this.sb.open('El examen ha sido guardado.', 'Ok', {
							duration: 2500,
						});
					});
				} else {
					this.sb.open('Ha ocurrido un error al guardar.', 'Ok', {
						duration: 2500,
					});
				}
			},
			error: (err) => {
				this.loading = false;
				console.log(err);
				this.sb.open('Ha ocurrido un error al guardar.', 'Ok', {
					duration: 2500,
				});
			},
		});
	}
}
