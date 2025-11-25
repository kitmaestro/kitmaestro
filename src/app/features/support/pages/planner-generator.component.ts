import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf.service';
import { MatIconModule } from '@angular/material/icon';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { uniq } from 'lodash';
import {
	convertInchesToTwip,
	Document,
	Packer,
	PageOrientation,
	Paragraph,
	ShadingType,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { Store } from '@ngrx/store';
import {
	loadSections,
	selectAllClassSections,
	selectAuthUser,
} from '../../../store';
import { filter } from 'rxjs';

interface PlannerTemplate {
	date: string;
	fullname: string;
	classroom: string;
	subject: string;
}

@Component({
	selector: 'app-planner-generator',
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatFormFieldModule,
		MatSnackBarModule,
		MatIconModule,
		CommonModule,
		PretifyPipe,
	],
	template: `
		<div>
			<div>
				<h2>
					Generador De Plantillas de Planificaciones Personalizadas
				</h2>
				<h3 style="margin: 4px 0 24px; font-weight: normal">
					Habr&aacute;n m&aacute;s tipos de plantillas diponibles
					pronto.
				</h3>
			</div>
			<div>
				<form (ngSubmit)="onSubmit()" [formGroup]="plannerForm">
					<div style="display: flex; gap: 12px">
						<mat-form-field appearance="outline">
							<mat-label>Tipo de Plantilla</mat-label>
							<mat-select formControlName="templateType">
								<mat-option
									[value]="i"
									*ngFor="
										let type of templateTypes;
										let i = index
									"
									>{{ type }}</mat-option
								>
							</mat-select>
						</mat-form-field>
						<mat-form-field appearance="outline">
							<mat-label>Mes</mat-label>
							<mat-select formControlName="date">
								<mat-option
									[value]="month.id"
									*ngFor="let month of months"
									>{{ month.name }}
									{{
										month.id < 6 ? '2024' : '2023'
									}}</mat-option
								>
							</mat-select>
						</mat-form-field>
					</div>
					<div style="display: flex; gap: 12px">
						<mat-form-field appearance="outline">
							<mat-label>Docente</mat-label>
							<input
								type="text"
								matInput
								formControlName="fullName"
							/>
						</mat-form-field>
						<mat-form-field appearance="outline">
							<mat-label>Grado(s)</mat-label>
							<mat-select
								type="text"
								formControlName="classroom"
								multiple
								required
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
					<div style="display: flex; gap: 12px">
						<mat-form-field appearance="outline">
							<mat-label>Asignaturas</mat-label>
							<mat-select multiple formControlName="subjects">
								<mat-option
									[value]="subject"
									*ngFor="let subject of subjects"
									>{{ subject | pretify }}</mat-option
								>
							</mat-select>
						</mat-form-field>
						<!-- <mat-form-field appearance="outline">
							<mat-label>Decoraci&oacute;n</mat-label>
							<mat-select formControlName="decoration">
								<mat-option [value]="decoration.option" *ngFor="let decoration of decorations">{{decoration.spanish}}</mat-option>
							</mat-select>
						</mat-form-field> -->
						<mat-form-field appearance="outline">
							<mat-label>Color</mat-label>
							<mat-select formControlName="color">
								<mat-option
									[value]="color.hex"
									*ngFor="let color of colors"
								>
									<div
										style="
											display: flex;
											gap: 12px;
											align-items: center;
										"
									>
										<span
											[style]="
												'display: inline-block; padding: 12px; background-color: ' +
												color.hex +
												';'
											"
										></span>
										<span>{{ color.spanish }}</span>
									</div>
								</mat-option>
							</mat-select>
						</mat-form-field>
					</div>
					<div
						style="display: flex; flex-direction: row-reverse; gap: 12px"
					>
						<button
							[disabled]="generating || plannerForm.invalid"
							type="submit"
							color="primary"
							mat-button
						>
							<mat-icon>bolt</mat-icon
							>{{ generating ? 'Generando...' : 'Generar' }}
						</button>
						@if (!generating && templates.length > 0) {
							<button
								mat-button
								color="accent"
								(click)="printTemplates()"
							>
								<mat-icon>download</mat-icon
								><span> Exportar PDF</span>
							</button>
							<button
								mat-button
								color="accent"
								(click)="downloadTemplates()"
							>
								<mat-icon>download</mat-icon
								><span> Exportar Word</span>
							</button>
						}
					</div>
				</form>
			</div>
		</div>

		@if (!generating && templates.length > 0) {
			<h2 style="font-size: 22pt; margin-top: 24px">Vista Previa</h2>
			@for (template of templates; track $index) {
				<div
					class="template-container"
					id="template-{{ $index }}"
					style="background-color: #fff; padding: 12mm"
				>
					<table style="max-width: 100%; width: 100%">
						<thead>
							<tr>
								<th
									[style]="
										'width: 160px; background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Fecha
								</th>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
								>
									______/{{ template.date }}
								</td>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Grado y Sección
								</th>
								<td
									colspan="2"
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
								>
									{{ template.classroom }}
								</td>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0'
									"
								>
									Docente
								</th>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66'
									"
								>
									{{ template.fullname }}
								</td>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0'
									"
								>
									Área Curricular
								</th>
								<td
									colspan="2"
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66'
									"
								>
									{{ template.subject | pretify }}
								</td>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
									colspan="2"
								>
									<b
										>Estrategias y técnicas de
										enseñanza-aprendizaje</b
									>:
								</th>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
									colspan="3"
								></th>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
									colspan="2"
								>
									<b>Intencion Pedag&oacute;gica</b>:
								</th>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
									colspan="3"
								></th>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Momento
								</th>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Competencias Especificas
								</th>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Actividades / Duración
								</th>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0; width: 300px;'
									"
								>
									Organización de los Estudiantes
								</th>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0; width: 180px;'
									"
								>
									Recursos
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Inicio
								</th>
								<td>
									<br /><br /><br /><br /><br /><br /><br /><br /><br />
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Desarrollo
								</th>
								<td>
									<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Cierre
								</th>
								<td>
									<br /><br /><br /><br /><br /><br /><br />
								</td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<th
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
								>
									Actividades Complementarias
								</th>
								<td><br /><br /><br /><br /><br /><br /></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
									colspan="2"
								>
									<b>Vocabulario del día/de la semana</b>:
								</td>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
									colspan="3"
								></td>
							</tr>
							<tr>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
									colspan="2"
								>
									<b
										>Lecturas recomendadas/ o libro de la
										semana</b
									>:
								</td>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
									colspan="3"
								></td>
							</tr>
							<tr>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'a0;'
									"
									colspan="2"
								>
									<b>Observaciones</b>:
								</td>
								<td
									[style]="
										'background-color: ' +
										plannerForm.get('color')?.value +
										'66;'
									"
									colspan="3"
								></td>
							</tr>
						</tbody>
					</table>
				</div>
			}
		}
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.template-container {
			position: relative;
			aspect-ratio: 1.294/1;
			margin-top: 24px;

			table {
				border-collapse: collapse;
				z-index: 250;
			}

			tr,
			th,
			td {
				border: 1px solid #ddd;
				text-align: start;
				padding: 4px 8px;
				font-size: 12pt;
			}
		}

		.cover {
			position: absolute;
			// bottom: 0;
			// right: 0;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			opacity: 0.2;
			z-index: 150;
			filter: blur(2px) opacity(55%);
			-webkit-filter: blur(2px) opacity(55%);
			-moz-filter: blur(2px) opacity(55%);
			// border-radius: 50%;
		}
	`,
})
export class PlannerGeneratorComponent implements OnInit {
	#store = inject(Store);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private pdfService = inject(PdfService);

	generating = false;
	imgSrc = '';
	m = new Date().getMonth();
	months = [
		{ id: 7, name: 'Agosto' },
		{ id: 8, name: 'Septiembre' },
		{ id: 9, name: 'Octubre' },
		{ id: 10, name: 'Noviembre' },
		{ id: 11, name: 'Diciembre' },
		{ id: 0, name: 'Enero' },
		{ id: 1, name: 'Febrero' },
		{ id: 2, name: 'Marzo' },
		{ id: 3, name: 'Abril' },
		{ id: 4, name: 'Mayo' },
		{ id: 5, name: 'Junio' },
		{ id: 6, name: 'Julio' },
	];

	sections = this.#store.selectSignal(selectAllClassSections);
	selectedSections: string[] = [];

	templateTypes = [
		'Plan Diario (Primaria)',
		// 'Unidad de Aprendizaje (Primaria)',
	];

	colors: { color: string; spanish: string; hex: string }[] = [
		{ color: 'red', spanish: 'Rojo', hex: '#F44336' },
		{ color: 'pink', spanish: 'Rosa', hex: '#E91E63' },
		{ color: 'purple', spanish: 'Morado', hex: '#9C27B0' },
		{ color: 'deep purple', spanish: 'Morado oscuro', hex: '#673AB7' },
		{ color: 'indigo', spanish: 'Añil', hex: '#3F51B5' },
		{ color: 'blue', spanish: 'Azul', hex: '#2196F3' },
		{ color: 'light blue', spanish: 'Azul claro', hex: '#03A9F4' },
		{ color: 'cyan', spanish: 'Cian', hex: '#00BCD4' },
		{ color: 'teal', spanish: 'Verde azulado', hex: '#009688' },
		{ color: 'green', spanish: 'Verde', hex: '#4CAF50' },
		{ color: 'light green', spanish: 'Verde claro', hex: '#8BC34A' },
		{ color: 'lime', spanish: 'Lima', hex: '#CDDC39' },
		{ color: 'yellow', spanish: 'Amarillo', hex: '#FFEB3B' },
		{ color: 'amber', spanish: 'Ámbar', hex: '#FFC107' },
		{ color: 'orange', spanish: 'Naranja', hex: '#FF9800' },
		{ color: 'deep orange', spanish: 'Naranja oscuro', hex: '#FF5722' },
		{ color: 'brown', spanish: 'Marrón', hex: '#795548' },
		{ color: 'grey', spanish: 'Gris', hex: '#9E9E9E' },
		{ color: 'blue grey', spanish: 'Gris azulado', hex: '#607D8B' },
		{ color: 'Magenta', spanish: 'Magenta', hex: '#E91E63' },
		{ color: 'Olive', spanish: 'Oliva', hex: '#4CAF50' },
		{ color: 'Maroon', spanish: 'Granate', hex: '#673AB7' },
		{ color: 'Navy', spanish: 'Azul marino', hex: '#001F3F' },
		{ color: 'Aquamarine', spanish: 'Aguamarina', hex: '#7FFFD4' },
		{ color: 'Turquoise', spanish: 'Turquesa', hex: '#40E0D0' },
		{ color: 'Silver', spanish: 'Plata', hex: '#C0C0C0' },
		{ color: 'Gold', spanish: 'Oro', hex: '#FFD700' },
		{ color: 'Violet', spanish: 'Violeta', hex: '#8A2BE2' },
	];

	flowers: { name: string; spanish: string }[] = [
		{ name: 'Rose', spanish: 'Rosa' },
		{ name: 'Daisy', spanish: 'Margarita' },
		{ name: 'Sunflower', spanish: 'Girasol' },
		{ name: 'Tulip', spanish: 'Tulipán' },
		{ name: 'Lily', spanish: 'Lirio' },
		{ name: 'Daffodil', spanish: 'Narciso' },
		{ name: 'Orchid', spanish: 'Orquídea' },
		{ name: 'Carnation', spanish: 'Clavel' },
		{ name: 'Peony', spanish: 'Peonía' },
		{ name: 'Dahlia', spanish: 'Dalia' },
		{ name: 'Hydrangea', spanish: 'Hortensia' },
		{ name: 'Chrysanthemum', spanish: 'Crisantemo' },
		{ name: 'Poppy', spanish: 'Amapola' },
		{ name: 'Lavender', spanish: 'Lavanda' },
		{ name: 'Jasmine', spanish: 'Jazmín' },
		{ name: 'Violet', spanish: 'Violeta' },
		{ name: 'Peacock Flower', spanish: 'Flor de pavo real' },
		{ name: 'Bougainvillea', spanish: 'Buganvilla' },
		{ name: 'Azalea', spanish: 'Azalea' },
		{ name: 'Camellia', spanish: 'Camelia' },
	];

	decorations: { option: string; spanish: string }[] = [
		{ option: 'Floral patterns', spanish: 'Patrones florales' },
		{ option: 'Geometric designs', spanish: 'Diseños geométricos' },
		{ option: 'Cute illustrations', spanish: 'Ilustraciones bonitas' },
		{ option: 'Autumn', spanish: 'Otoño' },
		{ option: 'Winter', spanish: 'Invierno' },
		{ option: 'Spring', spanish: 'Primavera' },
		{ option: 'Summer', spanish: 'Verano' },
		{ option: 'Icons and symbols', spanish: 'Iconos y símbolos' },
		{ option: 'Watercolor paintings', spanish: 'Pinturas acuarelas' },
		{ option: 'Scenic landscapes', spanish: 'Paisajes escénicos' },
		{ option: 'Cartoon characters', spanish: 'Personajes de caricaturas' },
		{ option: 'Abstract art', spanish: 'Arte abstracto' },
		{ option: 'Whimsical drawings', spanish: 'Dibujos caprichosos' },
		{ option: 'Vintage imagery', spanish: 'Imágenes vintage' },
		{ option: 'Typographic elements', spanish: 'Elementos tipográficos' },
		{
			option: 'Animal illustrations',
			spanish: 'Ilustraciones de animales',
		},
		{
			option: 'Food and drink illustrations',
			spanish: 'Ilustraciones de comida y bebida',
		},
		{ option: 'Celestial themes', spanish: 'Temas celestiales' },
		{
			option: 'Travel and adventure motifs',
			spanish: 'Motivos de viaje y aventura',
		},
		{
			option: 'Botanical illustrations',
			spanish: 'Ilustraciones botánicas',
		},
		{
			option: 'Nautical and oceanic themes',
			spanish: 'Temas náuticos y oceánicos',
		},
		{
			option: 'Fairytale and fantasy elements',
			spanish: 'Elementos de cuento de hadas y fantasía',
		},
	];

	subjects: string[] = [];
	school = '';
	fullname = '';
	visible = false;
	queue = 0;

	templates: PlannerTemplate[] = [];

	plannerForm = this.fb.group({
		templateType: [0],
		color: ['#F44336'],
		decoration: ['Floral patterns'],
		fullName: ['', Validators.required],
		classroom: [[] as string[], Validators.required],
		subjects: ['', Validators.required],
		date: [this.m],
	});

	ngOnInit() {
		this.#store.dispatch(loadSections());
		this.#store
			.select(selectAuthUser)
			.pipe(filter((user) => !!user))
			.subscribe((user) => {
				const fullname = `${user.title}. ${user.firstname} ${user.lastname}`;
				this.fullname = fullname;
				this.plannerForm.get('fullName')?.setValue(fullname);
				this.plannerForm.get('fullName')?.disable();
				this.school = user.schoolName;
			});
	}

	onSectionSelect(event: any) {
		this.selectedSections = event.value;
		setTimeout(() => {
			this.subjects = uniq(
				this.sections()
					.filter((s) => this.selectedSections.includes(s._id))
					.flatMap((s) => s.subjects),
			);
		}, 0);
	}

	onSubmit() {
		this.generating = true;
		const { color, decoration, classroom, subjects, date } =
			this.plannerForm.value;
		if (!subjects || !classroom) {
			this.generating = false;
			return;
		}

		const templates: PlannerTemplate[] = [];
		const d =
			typeof date !== 'number'
				? `${new Date().getMonth() + 1}/2025`
				: date < 6
					? `${date + 1}/2025`
					: `${date + 1}/2024`;

		const classrooms = this.sections()
			.filter((s) => classroom.includes(s._id))
			.map((s) => s.name);

		for (const cr of classrooms) {
			for (const subject of subjects as any as string[]) {
				const template: PlannerTemplate = {
					date: d,
					subject,
					classroom: cr,
					fullname: this.fullname,
				};
				templates.push(template);
			}
		}

		this.templates = templates;

		// this.aiService.generateImage(`a ${color} ${decoration}`).subscribe((res) => {
		//   this.sb.open('Generacion completa!', 'Ok', { duration: 2500 })
		//   this.imgSrc = res.result
		//   this.generating = false
		// })
		this.generating = false;
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	async downloadTemplates() {
		const fill = (this.plannerForm.get('color')?.value || '').slice(1);
		const shading85 = {
			fill,
			color: 'ffffff',
			type: ShadingType.PERCENT_70,
		};
		const shadingClear = { fill, color: 'auto', type: ShadingType.CLEAR };
		const doc = new Document({
			sections: this.templates.map((template) => {
				return {
					properties: {
						page: {
							size: {
								orientation: PageOrientation.LANDSCAPE,
								height: '279mm',
								width: '216mm',
							},
						},
					},
					children: [
						new Table({
							columnWidths: [convertInchesToTwip(2)],
							width: { size: 100, type: WidthType.PERCENTAGE },
							rows: [
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Fecha',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph(
													'___/' + template.date,
												),
											],
											shading: shading85,
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Grado y Sección',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph(
													template.classroom,
												),
											],
											columnSpan: 2,
											shading: shading85,
										}),
									],
									tableHeader: true,
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Docente',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph(
													template.fullname,
												),
											],
											shading: shading85,
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Área Curricular',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph(
													this.pretify(
														template.subject,
													),
												),
											],
											columnSpan: 2,
											shading: shading85,
										}),
									],
									tableHeader: true,
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Estrategias y técnicas de enseñanza-aprendizaje',
															bold: true,
														}),
													],
												}),
											],
											columnSpan: 2,
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
											columnSpan: 3,
											shading: shading85,
										}),
									],
									tableHeader: true,
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Intencion Pedagógica',
															bold: true,
														}),
													],
												}),
											],
											columnSpan: 2,
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
											columnSpan: 3,
											shading: shading85,
										}),
									],
									tableHeader: true,
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Momento',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Competencias Especificas',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Actividades / Duración',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Organización de los Estudiantes',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Recursos',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
									],
									tableHeader: true,
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Inicio',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
									],
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Desarrollo',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
									],
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Cierre',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
									],
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Actividades Complementarias',
															bold: true,
														}),
													],
												}),
											],
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
										new TableCell({
											children: [new Paragraph('')],
										}),
									],
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Vocabulario del día/de la semana:',
															bold: true,
														}),
													],
												}),
											],
											columnSpan: 2,
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
											shading: shading85,
										}),
									],
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Lecturas recomendadas/ o libro de la semana:',
															bold: true,
														}),
													],
												}),
											],
											columnSpan: 2,
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
											shading: shading85,
										}),
									],
								}),
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Observaciones:',
															bold: true,
														}),
													],
												}),
											],
											columnSpan: 2,
											shading: shadingClear,
										}),
										new TableCell({
											children: [new Paragraph('')],
											shading: shading85,
										}),
									],
								}),
							],
						}),
						new Paragraph(''),
					],
				};
			}),
		});
		const blob = await Packer.toBlob(doc);
		saveAs(blob, 'Plantillas de planificacion.docx');
	}

	printTemplates() {
		if (this.queue > 0) {
			this.sb.open(
				'Las descargas ya estan en progreso, espera a que terminen.',
			);
			return;
		}

		this.queue = this.templates.length;
		this.sb.open(
			'La descarga empezara en unos instantes. No quites esta pantalla hasta que finalicen las descargas.',
		);
		this.templates.forEach((t, i) => {
			setTimeout(() => {
				this.pdfService
					.createAndDownloadFromHTML(
						'template-' + i,
						'Plan Diario de Primaria - ' + t.subject,
						false,
					)
					.then(() => {
						this.queue--;
						if (this.queue === 0) {
							this.sb.open(
								'Todas las descargas han finalizado. Ya puedes salir de esta pantalla.',
							);
						}
					})
					.catch(() => {
						this.queue--;
						if (this.queue === 0) {
							this.sb.open(
								'Todas las descargas han finalizado. Ya puedes salir de esta pantalla.',
							);
						}
					});
			}, 1500);
		});
	}
}
