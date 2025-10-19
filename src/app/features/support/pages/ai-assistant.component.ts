import { Component, inject, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AiService } from '../../../core/services'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { MarkdownComponent } from 'ngx-markdown'
import { Store } from '@ngrx/store'
import { selectAllClassSections, selectCurrentSection } from '../../../store/class-sections/class-sections.selectors'
import { selectAuthUser } from '../../../store/auth/auth.selectors'
import { loadSectionSuccess } from '../../../store/class-sections/class-sections.actions'

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
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>Asistente Personalizado de IA</mat-card-title>
			</mat-card-header>
			<mat-card-content>
				<div style="margin-top: 24px">
					<form [formGroup]="assistantForm" (ngSubmit)="onSubmit()">
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Curso de Referencia</mat-label>
								<mat-select formControlName="section" (selectionChange)="onSectionSelect($event)">
									@for (
										section of sections();
										track section._id
									) {
										<mat-option [value]="section._id">{{
											section.name
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Consulta o Pregunta</mat-label>
								<textarea
									matInput
									formControlName="question"
								></textarea>
							</mat-form-field>
						</div>
						<div>
							<button
								type="submit"
								[disabled]="assistantForm.invalid || loading"
								mat-flat-button
							>
								Consultar
							</button>
						</div>
					</form>
				</div>
			</mat-card-content>
		</mat-card>

		@if (response) {
			<div style="margin-top: 24px">
				<mat-card>
					<mat-card-content>
						<markdown [data]="response"></markdown>
					</mat-card-content>
				</mat-card>
			</div>
		}
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}
	`,
})
export class AiAssistantComponent implements OnInit {
	#fb = inject(FormBuilder)
	#sb = inject(MatSnackBar)
	#store = inject(Store)
	#router = inject(Router)
	#aiService = inject(AiService)

	#pretify = new PretifyPipe().transform

	sections = this.#store.selectSignal(selectAllClassSections)
	section = this.#store.selectSignal(selectCurrentSection)
	user = this.#store.selectSignal(selectAuthUser)
	response = ''
	loading = false

	assistantForm = this.#fb.group({
		section: ['', Validators.required],
		question: ['', Validators.required],
	})

	ngOnInit() {
		this.#store.select(selectAllClassSections).subscribe({
			next: (sections) => {
				this.loading = false
				if (sections.length === 0) {
					this.#router.navigateByUrl('/sections').then(() => {
						this.#sb.open(
							'Vas a necesitar una seccion para usar esta herramienta.',
							'Ok',
							{ duration: 2500 },
						)
					})
				}
			},
		})
	}

	onSectionSelect(event: any) {
		const sectionId: string = event.value
		const section = this.sections()?.find(s => s._id == sectionId)
		if (section)
			this.#store.dispatch(loadSectionSuccess({ section }))
	}

	onSubmit() {
		const data: any = this.assistantForm.value
		const section = this.section()
		const user = this.user()
		if (!user || !section) return

		this.loading = true
		const query = `Eres mi asistente personal y consejero experto en el area de la educacion, especialmente la dominicana. Esta es toda la informacion que necesitas sobre mi para poder ayudarme.
Mi nombre es ${user.firstname} ${user.lastname}, soy un${user.gender === 'Hombre' ? '' : 'a'} docente de la República Dominicana. El centro educativo en el que trabajo se llama ${user.schoolName}. Es un centro educativo del nivel ${this.#pretify(section.level)} y trabajo en ${this.#pretify(section.year)} grado de educacion ${this.#pretify(section.level)} impartiendo estas asignaturas: ${section.subjects.map((s) => this.#pretify(s)).join(', ')}.
Te agradeceria que me hables de manera familiar, nada formal, con confianza y relajadamente puedes hablar con un pequeño grado de humor. Demuestrame con tus palabras que te sientes cercano a mi, que tienes tiempo conmigo y que estas comprometido con ayudarme.
Aqui esta mi consulta de el dia de hoy:

${data.question}.
`
		console.log(query)
		this.#aiService.geminiAi(query).subscribe({
			next: (res) => {
				this.response = res.response
				this.loading = false
			},
			error: (err) => {
				console.log(err.message)
				this.loading = false
			},
		})
	}
}
