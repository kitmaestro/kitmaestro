import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { AiService } from '../../../core/services/ai.service'
import { ReadingActivityService } from '../../../core/services/reading-activity.service'
import { User } from '../../../core'
import { ClassSection } from '../../../core'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { Router, RouterModule } from '@angular/router'
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component'
import { Store } from '@ngrx/store'
import { selectAuthUser } from '../../../store/auth/auth.selectors'
import { loadSections, selectAllClassSections } from '../../../store/class-sections'
import { MarkdownComponent } from 'ngx-markdown'

@Component({
	selector: 'app-reading-activity-generator',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatInputModule,
		MatFormFieldModule,
		MatSnackBarModule,
		RouterModule,
		IsPremiumComponent,
		MarkdownComponent,
	],
	template: `
		<app-is-premium>
			<div>
				<div style="display: flex; gap: 12px; justify-content: space-betweeen; align-items: center;">
					<h2>Actividad de Lectura Guiada</h2>
					<span style="flex: 1 1 auto"></span>
					<button mat-flat-button routerLink="/activities/reading-activities" color="primary">
						Mis Actividades
					</button>
				</div>
				<form
					(ngSubmit)="onSubmit()"
					[formGroup]="activityForm"
					style="margin-top: 24px"
				>
					<div class="cols-3">
						<div class="form-block">
							<mat-form-field appearance="outline">
								<mat-label>Grado</mat-label>
								<mat-select
									formControlName="section"
									(selectionChange)="onSectionSelect($event)"
								>
									@for (section of sections(); track $index) {
										<mat-option [value]="section._id">{{
											section.name
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div class="form-block">
							<mat-form-field appearance="outline">
								<mat-label>Proceso Cognitivo</mat-label>
								<mat-select formControlName="level">
									@for (level of bloomLevels; track $index) {
										<mat-option [value]="level">{{
											level
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div class="form-block">
							<mat-form-field appearance="outline">
								<mat-label
									>Cantidad de Preguntas de
									Comprensi&oacute;n</mat-label
								>
								<input
									type="number"
									formControlName="questions"
									matInput
									max="15"
								/>
							</mat-form-field>
						</div>
					</div>
					<div class="text-end">
						<button
							[disabled]="generating"
							type="submit"
							mat-button
							[color]="text ? 'link' : 'primary'"
						>
							<mat-icon>bolt</mat-icon>
							{{
								generating
									? "Generando..."
									: text
										? "Regenerar"
										: "Generar"
							}}
						</button>
						@if (text) {
							<button
								type="button"
								mat-flat-button
								color="primary"
								[disabled]="saved"
								(click)="save()"
								style="margin-left: 12px"
							>
								Guardar
							</button>
						}
					</div>
				</form>
			</div>

			@if (text) {
				<mat-card
					style="
						margin-top: 24px;
						min-width: 8.5in;
						max-width: 8.5in;
						margin-left: auto;
						margin-right: auto;
					"
				>
					<mat-card-content>
						<div id="reading-activity" style="padding: 0.5in">
							@if (user) {
								<div style="text-align: center">
									<h2 style="margin-bottom: 2px; line-height: 1">
										{{ user.schoolName }}
									</h2>
									<h4 style="margin-bottom: 2px; line-height: 1">
										A&ntilde;o Escolar {{ schoolYear }}
									</h4>
									<h3 style="margin-bottom: 2px; line-height: 1">
										{{ user.title }}. {{ user.firstname }}
										{{ user.lastname }}
									</h3>
									<h3
										style="
											font-weight: bold;
											line-height: 1;
											margin-bottom: 12px;
										"
									>
										Actividad de Lectura Guiada
									</h3>
								</div>
							}
							<div
								style="margin-bottom: 24px; display: flex; font-size: 12pt"
							>
								<div><b>Nombre</b>:</div>
								<div class="blank"></div>
								<div style="margin-left: 12px"><b>Grado</b>:</div>
								<div class="blank"></div>
								<div style="margin-left: 12px"><b>Fecha</b>:</div>
								<div style="max-width: 25%" class="blank"></div>
							</div>
							<p style="font-size: 14pt">
								Lee detenidamente el siguiente texto y responde las
								preguntas.
							</p>
							<h3 style="font-size: 14pt; font-style: italic">
								{{ text.textTitle }}
							</h3>
							<div
								style="
									font-size: 12pt;
									margin-top: 12px;
									margin-bottom: 12px;
								"
							>
								<markdown [data]="text.textContent" />
							</div>
							<h3 style="font-weight: bold">Responde</h3>
							@for (question of text.questions; track $index) {
								<p
									style="
										margin-bottom: 42px;
										font-size: 12pt;
										font-weight: bold;
									"
								>
									{{ $index + 1 }}. {{ question }}
								</p>
							}
						</div>
					</mat-card-content>
				</mat-card>
			}
		</app-is-premium>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		mat-card {
			margin-bottom: 24px;
		}

		.text-end {
			text-align: end;
		}

		.form-block {
			display: block;
			margin-bottom: 12px;
		}

		.cols-3 {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 16px;

			@media screen and (max-width: 720px) {
				grid-template-columns: 1fr;
			}
		}

		.blank {
			border-bottom: 1px solid black;
			flex: 1 1 auto;
			width: 100%;
		}
	`,
})
export class ReadingActivityGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder)
	private sb = inject(MatSnackBar)
	private aiService = inject(AiService)
	#store = inject(Store)
	private router = inject(Router)
	private acitivtyService = inject(ReadingActivityService)

	public user$ = this.#store.select(selectAuthUser)
	public user: User | null = null
	public sections = this.#store.selectSignal(selectAllClassSections)
	public section: ClassSection | null = null

	generating = false

	saved = false

	text: {
		textTitle: string
		textContent: string
		questions: string[]
		answers: string[]
	} | null = null

	bloomLevels = [
		'Recordar',
		'Comprender',
		'Aplicar',
		'Analizar',
		'Evaluar',
		'Crear',
	]

	activityForm = this.fb.group({
		section: ['', Validators.required],
		level: ['Recordar'],
		questions: [5, [Validators.min(1), Validators.max(15)]],
	})

	ngOnInit() {
		this.#store.dispatch(loadSections())
		this.user$.subscribe(user => this.user = user)
	}

	onSectionSelect(event: any) {
		const id: string = event.value
		const section = this.sections().find((s) => s._id === id)
		if (section) {
			this.section = section
		}
	}

	onSubmit() {
		this.generateActivity(this.activityForm.value)
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str)
	}

	generateActivity(form: any) {
		const section = this.sections().find(
			(section) => section._id === form.section,
		)
		if (!section) return
		const text = `Escribe un texto de un nivel adecuado para alumnos de ${this.pretify(section.year)} grado de ${this.pretify(section.level)} y ${form.questions} preguntas de comprensión lectora adecuadas para trabajar/evaluar el proceso cognitivo de ${form.level.toLowerCase()}. Responde con formato JSON valido con esta interfaz:
{
    "textTitle": string;
    "textContent": string;
    "questions": string[];
    "answers": string[];
}`
		this.generating = true
		this.aiService.geminiAi(text).subscribe({
			next: (response) => {
				try {
					const text = JSON.parse(
						response.response.slice(
							response.response.indexOf('{'),
							response.response.lastIndexOf('}') + 1,
						),
					)
					if (text) {
						this.text = text
						this.saved = false
					}
				} catch (error) {
					this.sb.open(
						'Ocurrió un problema mientras se generaba la actividad. Inténtalo de nuevo.',
						'Ok',
						{ duration: 2500 },
					)
				}
				this.generating = false
			},
			error: (error) => {
				this.sb.open(
					'Ocurrió un problema mientras se generaba la actividad. Inténtalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				)
				this.generating = false
			},
		})
	}

	save() {
		const { section, level } = this.activityForm.value
		const activity: any = {
			user: this.user?._id,
			section,
			level,
			title: this.text?.textTitle,
			text: this.text?.textContent,
			questions: this.text?.questions,
			answers: this.text?.answers,
		}

		this.acitivtyService.create(activity).subscribe((result) => {
			if (result._id) {
				this.router.navigateByUrl('/activities/reading-activities').then(() => {
					this.sb.open('La actividad ha sido guardada.', 'Ok', {
						duration: 2500,
					})
				})
			}
		})
	}

	get schoolYear(): string {
		const currentMonth = new Date().getMonth() + 1
		const currentYear = new Date().getFullYear()
		if (currentMonth > 7) {
			return `${currentYear} - ${currentYear + 1}`
		}
		return `${currentYear - 1} - ${currentYear}`
	}
}
