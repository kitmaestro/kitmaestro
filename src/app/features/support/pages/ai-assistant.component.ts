import { Component, inject, OnInit } from '@angular/core'
import { MatFormField } from '@angular/material/form-field'
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
import {
	selectAllClassSections,
	selectCurrentSection,
	loadSectionSuccess,
	selectAuthUser,
	loadSections,
	selectIsLoadingSections
} from '../../../store'
import { filter } from 'rxjs'
import { MatIcon } from '@angular/material/icon'
import { MatProgressSpinner } from '@angular/material/progress-spinner'

@Component({
	selector: 'app-ai-assistant',
	imports: [
		MatButtonModule,
		MatFormField,
		MatInputModule,
		MatSelectModule,
		MatSnackBarModule,
		ReactiveFormsModule,
		MarkdownComponent,
		MatProgressSpinner,
		MatIcon,
	],
	template: `
		@if (loading()) {
			<div class="display: flex; justify-content: center; align-items: center; margin-top: 24px; height: 50vh">
				<div class="display: flex; justify-content: center; align-items: center">
					<mat-spinner mode="indeterminate"></mat-spinner>
				</div>
			</div>
		} @else {
			<div>
				<div>
					<h2>Asistente Personalizado de IA</h2>
				</div>
				<div>
					<div style="margin-top: 24px">
						<form [formGroup]="assistantForm" (ngSubmit)="onSubmit()">
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Curso de Referencia</mat-label>
									<mat-select
										formControlName="section"
										(selectionChange)="onSectionSelect($event)"
									>
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
							<div style="text-align: end">
								<button
									type="submit"
									[disabled]="assistantForm.invalid || generating"
									mat-flat-button
								>
									<mat-icon>bolt</mat-icon>
									@if (generating) {
										Consultando...
									} @else {
										Consultar
									}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
	
			@if (response) {
				<div style="margin-top: 24px">
					<div>
						<markdown [data]="response"></markdown>
					</div>
				</div>
			}
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
	loading = this.#store.selectSignal(selectIsLoadingSections)
	generating = false

	assistantForm = this.#fb.group({
		section: ['', Validators.required],
		question: ['', Validators.required],
	})

	ngOnInit() {
		this.#store.dispatch(loadSections())
		this.#store.select(selectAllClassSections).pipe(filter(cs => !!cs)).subscribe({
			next: (sections) => {
				if (this.loading())
					return

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
		const section = this.sections()?.find((s) => s._id == sectionId)
		if (section) this.#store.dispatch(loadSectionSuccess({ section }))
	}

	onSubmit() {
		const data: any = this.assistantForm.value
		const section = this.section()
		const user = this.user()
		if (!user || !section) return

		this.generating = true
		const query = `Eres mi asistente personal y consejero experto en el area de la educacion, especialmente la dominicana. Esta es toda la informacion que necesitas sobre mi para poder ayudarme.
Mi nombre es ${user.firstname} ${user.lastname}, soy un${user.gender === 'Hombre' ? '' : 'a'} docente de la República Dominicana. El centro educativo en el que trabajo se llama ${user.schoolName}. Es un centro educativo del nivel ${this.#pretify(section.level)} y trabajo en ${this.#pretify(section.year)} grado de educacion ${this.#pretify(section.level)} impartiendo estas asignaturas: ${section.subjects.map((s) => this.#pretify(s)).join(', ')}.
Te agradeceria que me hables de manera familiar, nada formal, con confianza y relajadamente puedes hablar con un pequeño grado de humor. Demuestrame con tus palabras que te sientes cercano a mi, que tienes tiempo conmigo y que estas comprometido con ayudarme.
Aqui esta mi consulta de el dia de hoy:

${data.question}.
`
		this.#aiService.geminiAi(query).subscribe({
			next: (res) => {
				this.response = res.response
				this.generating = false
			},
			error: (err) => {
				console.log(err.message)
				this.generating = false
			},
		})
	}
}
