import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DidacticResourceService } from '../../core/services/didactic-resource.service';
import { DidacticResource } from '../../core/models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {
	Storage,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from '@angular/fire/storage';
import { AuthService } from '../../core/services/auth.service';
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
	selector: 'app-resource-form',
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		CommonModule,
		PretifyPipe,
	],
	template: `
		<h2
			style="
				width: fit-content;
				display: block;
				margin-left: auto;
				margin-right: auto;
			"
			mat-dialog-title
		>
			{{ resource ? 'Editar ' : 'Crear ' }} Recurso Did&aacute;ctico
		</h2>
		<mat-dialog-content>
			<form [formGroup]="resourceForm" (ngSubmit)="onSubmit()">
				<div
					style="
						display: grid;
						grid-template-columns: 1fr 2fr;
						margin-top: 24px;
					"
				>
					<div class="preview-container">
						<figure>
							<img
								[src]="preview ? preview : previewTemplate"
								class="preview"
							/>
							<caption>
								<input
									type="file"
									#fileInput
									[multiple]="false"
									(change)="processPreview(fileInput.files)"
									accept="image/*"
									style="display: none"
								/>
								<button
									mat-raised-button
									color="accent"
									type="button"
									(click)="fileInput.click()"
								>
									Elegir Miniatura
								</button>
							</caption>
						</figure>
					</div>
					<div>
						<div
							style="
								display: grid;
								gap: 12px;
								grid-template-columns: 2fr 1fr;
							"
						>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>T&iacute;tulo</mat-label>
									<input
										matInput
										type="text"
										formControlName="title"
										required
									/>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Precio (RD$)</mat-label>
									<input
										type="number"
										min="0"
										matInput
										formControlName="price"
									/>
								</mat-form-field>
							</div>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Descripci&oacute;n</mat-label>
								<textarea
									matInput
									formControlName="description"
									required
								></textarea>
							</mat-form-field>
						</div>
						<div
							style="
								display: grid;
								gap: 12px;
								grid-template-columns: 1fr 1fr;
							"
						>
							<mat-form-field appearance="outline">
								<mat-label>Nivel</mat-label>
								<mat-select formControlName="level" multiple>
									@for (level of levels; track $index) {
										<mat-option [value]="level">
											{{ level | pretify }}
										</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Grado(s)</mat-label>
								<mat-select multiple formControlName="grade">
									<mat-option
										*ngFor="let grade of grades"
										[value]="grade"
										>{{ grade | pretify }}</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Área(s)</mat-label>
								<mat-select multiple formControlName="subject">
									@for (subject of subjects; track $index) {
										<mat-option [value]="subject">
											{{ subject | pretify }}
										</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Estado</mat-label>
								<mat-select formControlName="status">
									<mat-option value="draft"
										>Borrador (No sera publicado
										todavia)</mat-option
									>
									<mat-option value="public"
										>Publico (Sera visible para todos los
										usuarios)</mat-option
									>
									<mat-option value="private"
										>Privado (Solo sera visible para
										ti)</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Link de descarga</mat-label>
								<input
									type="text"
									matInput
									formControlName="downloadLink"
								/>
							</mat-form-field>
						</div>
						<input
							type="file"
							style="display: none"
							#fileField
							(change)="processFile(fileField.files)"
							[multiple]="false"
						/>
						<button
							type="button"
							mat-raised-button
							style="width: 100%; display: block; margin-bottom: 24px"
							(click)="fileField.click()"
							[disabled]="uploading"
							color="accent"
						>
							{{
								uploading
									? 'Subiendo archivo (No salgas de esta pantalla)'
									: resourceForm.get('downloadLink')?.value
										? 'Elegir Otro Archivo'
										: 'Elegir Archivo'
							}}
						</button>
						<div style="margin-top: 12px">
							<mat-checkbox [formControl]="concent"
								>Confirmo que este recurso me pertenece y/o
								tengo permiso de subirlo.</mat-checkbox
							>
						</div>
					</div>
				</div>
				<div style="display: flex; gap: 12px; margin-top: 12px">
					<button
						mat-button
						style="margin-left: auto"
						mat-dialog-close
						color="warn"
						type="button"
					>
						Descartar
					</button>
					<button
						mat-flat-button
						color="primary"
						[disabled]="
							resourceForm.invalid || uploading || !concent.value
						"
						type="submit"
					>
						Publicar
					</button>
				</div>
			</form>
		</mat-dialog-content>
	`,
	styles: `
		.preview-container {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			caption {
				display: block;
				width: 100%;
				text-align: center;
				color: #444;
			}

			.preview {
				max-width: 256px;
				width: 100%;
				height: auto;
			}
		}

		mat-form-field {
			width: 100%;
		}
	`,
})
export class ResourceFormComponent implements OnInit {
	fb = inject(FormBuilder)
	private readonly storage: Storage = inject(Storage)
	private dialogRef = inject(DialogRef<ResourceFormComponent>)
	private didacticResourceService = inject(DidacticResourceService)
	private sb = inject(MatSnackBar)
	private data: DidacticResource = inject(MAT_DIALOG_DATA)
	private authService = inject(AuthService)

	loading = true
	uploading = false

	resource: DidacticResource | null = null
	preview = ''
	previewTemplate = '/assets/Plantilla Ejemplo KM.svg'
	grades = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO']
	levels = ['PRE_PRIMARIA', 'PRIMARIA', 'SECUNDARIA']
	subjects = [
		'LENGUA_ESPANOLA',
		'MATEMATICA',
		'CIENCIAS_SOCIALES',
		'CIENCIAS_NATURALES',
		'INGLES',
		'FRANCES',
		'FORMACION_HUMANA',
		'EDUCACION_FISICA',
		'EDUCACION_ARTISTICA',
		'TALLERES_OPTATIVOS',
		'MANUALES',
		'FASCICULOS',
	]

	resourceForm = this.fb.group({
		author: ['', Validators.required],
		title: ['', Validators.required],
		description: ['', Validators.required],
		grade: [[] as string[]],
		level: [[] as string[]],
		subject: [[] as string[]],
		downloadLink: ['', Validators.required],
		status: ['draft'],
		preview: ['', Validators.required],
		price: [0],
	})

	concent = this.fb.control(false)

	ngOnInit(): void {
		if (this.data) {
			this.resource = this.data
		}
		this.authService.profile().subscribe((user) => {
			this.resourceForm.get('author')?.setValue(user._id)
			this.loading = false
		})
	}

	onSubmit() {
		const resource: DidacticResource = this.resourceForm.value as any

		resource.keywords = [
			...resource.grade,
			...resource.subject,
			...resource.level,
		]

		this.didacticResourceService.create(resource).subscribe({
			next: (res) => {
				if (res && res.title) {
					this.sb.open('El recurso ha sido publicado.', 'Ok', {
						duration: 2500,
					})
					this.dialogRef.close()
				}
			},
			error: (error) => {
				this.sb.open(
					'Ha ocurrido un error al guardar. Intentalo nuevamente, por favor.',
					'Ok',
					{ duration: 2500 },
				)
				console.log(error)
			},
		})
	}

	close() {
		this.dialogRef.close()
	}

	processPreview(files: FileList | null) {
		if (!files) return

		const file = files.item(0)
		if (!file) return

		const docRef = ref(this.storage, Date.now().toString() + file.name)
		this.uploading = true
		uploadBytesResumable(docRef, file)
			.then(() => {
				getDownloadURL(docRef)
					.then((preview) => {
						this.preview = preview
						this.resourceForm.get('preview')?.setValue(preview)
						this.sb.open(
							'El archivo ha sido cargado de manera exitosa.',
							'Ok',
							{ duration: 2500 },
						)
						this.uploading = false
					})
					.catch((err) => {
						this.uploading = false
						console.log(err)
						this.sb.open(
							'Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.',
							'Ok',
							{ duration: 2500 },
						)
					})
			})
			.catch((err) => {
				this.uploading = false
				console.log(err)
				this.sb.open(
					'Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.',
					'Ok',
					{ duration: 2500 },
				)
			})
	}

	processFile(files: FileList | null) {
		if (!files) return

		const file = files.item(0)
		if (!file) return

		const docRef = ref(this.storage, Date.now().toString() + file.name)
		this.uploading = true
		uploadBytesResumable(docRef, file)
			.then(() => {
				getDownloadURL(docRef)
					.then((downloadLink) => {
						this.resourceForm
							.get('downloadLink')
							?.setValue(downloadLink)
						this.sb.open(
							'El archivo ha sido cargado de manera exitosa.',
							'Ok',
							{ duration: 2500 },
						)
						this.uploading = false
					})
					.catch((err) => {
						this.uploading = false
						console.log(err)
						this.sb.open(
							'Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.',
							'Ok',
							{ duration: 2500 },
						)
					})
			})
			.catch((err) => {
				this.uploading = false
				console.log(err)
				this.sb.open(
					'Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.',
					'Ok',
					{ duration: 2500 },
				)
			})
	}
}
