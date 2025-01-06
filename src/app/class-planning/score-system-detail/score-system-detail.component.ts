import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScoreSystemService } from '../../services/score-system.service';
import { PdfService } from '../../services/pdf.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GradingActivity, GroupedGradingActivity, ScoreSystem } from '../../interfaces/score-system';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ScoreSystemComponent } from '../score-system/score-system.component';
import { MatIconModule } from '@angular/material/icon';
import {
	AlignmentType,
	Document,
	HeadingLevel,
	Packer,
	PageOrientation,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType
} from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { Student } from '../../interfaces/student';
import { StudentsService } from '../../services/students.service';

@Component({
    selector: 'app-score-system-detail',
    imports: [
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        ScoreSystemComponent,
    ],
    templateUrl: './score-system-detail.component.html',
    styleUrl: './score-system-detail.component.scss'
})
export class ScoreSystemDetailComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private scoreSystemService = inject(ScoreSystemService);
	private studentsService = inject(StudentsService);
	private pdfService = inject(PdfService);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';
	scoreSystem: ScoreSystem | null = null;
	grouped: GroupedGradingActivity[] = [];
	students: Student[] = [];
	printing = false;
	deleting = false;

	load() {
		this.scoreSystemService.find(this.id).subscribe({
			next: scoreSystem => {
				this.scoreSystem = scoreSystem;
				this.grouped = this.groupByCompetence(this.scoreSystem.activities);
				this.studentsService.findBySection(scoreSystem.section._id).subscribe(students => {
					this.students = students;
				})
			},
			error: err => {
				this.router.navigateByUrl('/grading-systems').then(() => {
					this.sb.open('Ha ocurrido un error al cargar este sistema de calificacion.', 'Ok', { duration: 2500 });
				})
				console.log(err.message)
			}
		})
	}

	ngOnInit() {
		this.load();
	}

	groupByCompetence(gradingActivities: GradingActivity[]): GroupedGradingActivity[] {
		const grouped = gradingActivities.reduce((acc, activity) => {
			// Si ya existe un grupo con la misma competencia, añade la actividad al grupo
			const existingGroup = acc.find(group => group.competence === activity.competence);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				// Si no existe, crea un nuevo grupo para esta competencia
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		return grouped;
	}

	adjustGradingActivities(gradingActivities: GradingActivity[]): GradingActivity[] {
		// Paso 1: Agrupamos por 'competence' y calculamos el total
		const grouped = gradingActivities.reduce((acc, activity) => {
			const existingGroup = acc.find(group => group.competence === activity.competence);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		// Paso 2: Ajustar los grupos que tengan un total menor a 100
		grouped.forEach(group => {
			if (group.total < 100) {
				// Calculamos la diferencia que falta para llegar a 100
				const difference = 100 - group.total;

				// Ordenamos las actividades por puntaje ascendente para encontrar las dos menores
				group.grading.sort((a, b) => a.points - b.points);

				if (group.grading.length >= 2) {
					// Repartimos la diferencia entre las dos actividades con menor puntaje
					group.grading[0].points += Math.floor(difference / 2);
					group.grading[1].points += Math.ceil(difference / 2);
				} else if (group.grading.length === 1) {
					// Si solo hay una actividad, le sumamos toda la diferencia
					group.grading[0].points += difference;
				}

				// Actualizamos el total del grupo a 100
				group.total = 100;
			}
		});

		// Paso 3: Retornar el array plano de GradingActivity con los puntos ajustados
		return grouped.flatMap(group => group.grading);
	}

	deleteScoreSystem() {
		this.deleting = true;
		this.scoreSystemService.delete(this.id).subscribe({
			next: res => {
				if (res.deletedCount > 0) {
					this.router.navigateByUrl('/grading-systems').then(() => {
						this.sb.open('Se ha eliminado el sistema de calificacion', 'Ok', { duration: 2500 });
					});
					this.deleting = false;
				}
			},
			error: err => {
				this.sb.open('Ha ocurrido un error al eliminar el sistema de calificacion', 'Ok', { duration: 2500 });
				console.log(err.message);
				this.deleting = false;
			}
		});
	}

	pretify(value: string): string {
		return new PretifyPipe().transform(value);
	}

	async print() {
		if (!this.scoreSystem)
			return;
		this.printing = true;
		this.sb.open('Tu descarga empezara en breve, espera un momento...', 'Ok', { duration: 2500 });
		const gradingTable = new Table({
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
			rows: [
				new TableRow({
					tableHeader: true,
					children: [
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: "Competencia", bold: true }) ] })]
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: "Item o Actividad", bold: true }) ] })]
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: "Criterios de Evaluación", bold: true }) ] })]
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: "Puntuación", bold: true }) ] })]
						}),
					]
				}),
				...this.grouped.flatMap(group => {
					const rows = group.grading.map((activities, i) => {
						if (i == 0) {
							return new TableRow({
								children: [
									new TableCell({ rowSpan: group.grading.length + 1, children: [new Paragraph("Competencia " + group.competence)] }),
									new TableCell({ children: [new Paragraph(`${activities.activity} (${activities.activityType})`)] }),
									new TableCell({
										children: activities.criteria.map(criterion => new Paragraph({ text: "- " + criterion })),
									}),
									new TableCell({ children: [new Paragraph(`${activities.points} Puntos`)] }),
								]
							})
						} else {
							return new TableRow({
								children: [
									new TableCell({ children: [new Paragraph(`${activities.activity} (${activities.activityType})`)] }),
									new TableCell({
										children: activities.criteria.map(criterion => new Paragraph({ text: "- " + criterion })),
									}),
									new TableCell({ children: [new Paragraph(`${activities.points} Puntos`)] }),
								]
							})
						}
					});
					rows.push(new TableRow({ children: [new TableCell({ columnSpan: 2, children: [new Paragraph({ children: [new TextRun({ bold: true, text: "Total"})]})] }), new TableCell({ children: [new Paragraph(`${group.total} Puntos`)] })] }));
					return rows;
				}),
			]
		});
		const doc = new Document({
			sections: [
				{
					properties: {
						page: {
							size: {
								orientation: PageOrientation.LANDSCAPE,
								height: '279mm',
								width: '216mm',
							}
						}
					},
					children: [
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: this.scoreSystem.section.school.name,
								})
							],
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: "Sistema de Calificación de " + this.pretify(this.scoreSystem.content.subject),
								})
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: `${this.scoreSystem.user.title}. ${this.scoreSystem.user.firstname} ${this.scoreSystem.user.lastname}`,
								})
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: this.scoreSystem.section.name,
								})
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: this.scoreSystem.content.title,
								})
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: `1. Esquema de Puntuación`,
								})
							],
							heading: HeadingLevel.HEADING_4,
						}),
						gradingTable,
						...this.grouped.flatMap((group, i) => {
							return [
								new Paragraph(""),
								new Paragraph({ text: `${i + 2}. Matríz de Ponderación ${i + 1}: Competencia ${group.competence}`, heading: HeadingLevel.HEADING_4 }),
								new Table({
									width: {
										size: 100,
										type: WidthType.PERCENTAGE,
									},
									rows: [
										new TableRow({
											children: [
												new TableCell({ rowSpan: 2, children: [new Paragraph({ children: [new TextRun({ bold: true, text: "No." })] })] }),
												new TableCell({ rowSpan: 2, children: [new Paragraph({ children: [new TextRun({ bold: true, text: "Estudiante" })] })] }),
												new TableCell({ columnSpan: group.grading.length, children: [new Paragraph({ children: [new TextRun({ bold: true, text: `Competencia ${group.competence}` })] })] }),
												new TableCell({ children: [new Paragraph({ children: [new TextRun({ bold: true, text: "Total" })] })] }),
											]
										}),
										new TableRow({
											children: [
												...group.grading.map(grading => new TableCell({ children: [new Paragraph(`${grading.activity} (${grading.activityType})`), new Paragraph({ children: [new TextRun({ bold: true, text: `${grading.points} Puntos` })] })] })),
												new TableCell({ children: [new Paragraph(`${group.total}`)]})
											]
										}),
										...this.students.flatMap((student, i) => new TableRow({
											children: [
												new TableCell({ children: [new Paragraph(`${i + 1}`)] }),
												new TableCell({ children: [new Paragraph(`${student.firstname} ${student.lastname}`)] }),
												...group.grading.map(() => (new TableCell({ children: [new Paragraph("")] }))),
												new TableCell({ children: [new Paragraph("")]}),
											]
										}))
									]
								})
							]
						})
					],
				}
			]
		});
		const blob = await Packer.toBlob(doc);
		saveAs(blob, `${this.scoreSystem.content.title} - Sistema de Calificacion.docx`);
		this.printing = false;
	}
}
