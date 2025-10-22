import { Component, OnInit, inject } from '@angular/core';
import { Student } from '../../../core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { StudentDetailComponent } from '../components/student-detail.component';
import { ClassSectionFormComponent } from '../../../shared/ui/class-section-form.component';
import { StudentFormComponent } from '../../../shared/ui/student-form.component';
import { StudentsService } from '../../../core/services/students.service';
import * as XLSX from 'xlsx';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import {
	deleteSection,
	loadSection,
	selectCurrentSection,
} from '../../../store/class-sections';
import { StudentDto } from '../../../store/students/students.models';

@Component({
	selector: 'app-section-details',
	imports: [
		RouterModule,
		ReactiveFormsModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatSnackBarModule,
		MatDialogModule,
		MatChipsModule,
		PretifyPipe,
		DatePipe,
	],
	template: `
		@if (section(); as cs) {
			<div>
				<h2>Detalles de la Secci&oacute;n</h2>
				<div>
					<p><b>Centro Educativo</b>: {{ user()?.schoolName }}</p>
					<div
						style="display: grid; grid-template-columns: 1fr 1fr 1fr"
					>
						<p><b>Nombre</b>: {{ cs.name }}</p>
						<p><b>Grado</b>: {{ cs.year | pretify }}</p>
						<p><b>Nivel</b>: {{ cs.level | pretify }}</p>
					</div>
					<h3>Asignaturas</h3>
					<mat-chip-set>
						@for (subject of cs.subjects; track subject) {
							<mat-chip>{{ subject | pretify }}</mat-chip>
						}
					</mat-chip-set>
				</div>
				<div style="display: flex; gap: 12px;">
					<button
						mat-button
						style="display: block; margin-left: auto"
						routerLink="/registry/attendance"
						[queryParams]="{ section: cs._id }"
					>
						Pasar Asistencia
					</button>
					<button
						mat-button
						color="primary"
						style="display: block; margin-left: 20px"
						(click)="updateSectionDetails()"
					>
						Editar
					</button>
					<button
						mat-button
						color="warn"
						style="display: block; margin-left: 20px"
						(click)="removeSection()"
					>
						Eliminar
					</button>
				</div>
			</div>
		}

		<hr />

		<div>
			<div>
				<div
					style="
						display: flex;
						width: 100%;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 24px;
					"
				>
					<h2
						style="margin-top: auto; margin-bottom: auto"
						mat-card-title
					>
						Estudiantes de esta secci&oacute;n
					</h2>
					<div style="display: flex; gap: 12px;">
						<button
							(click)="filepicker.click()"
							mat-button
							style="margin-right: 12px"
						>
							<mat-icon>upload</mat-icon> Importar
						</button>
						<button (click)="addStudent()" mat-flat-button>
							<mat-icon>add</mat-icon> Agregar
						</button>
					</div>
				</div>
			</div>
			<input
				type="file"
				accept=".xlsx"
				#filepicker
				(change)="onFileChange($event)"
				style="display: none"
			/>
		</div>

		<div>
			<table mat-table [dataSource]="students$" class="mat-elevation-z8">
				<ng-container matColumnDef="firstname">
					<th mat-header-cell *matHeaderCellDef>Nombre(s)</th>
					<td mat-cell *matCellDef="let student">
						{{ student.firstname }}
					</td>
				</ng-container>
				<ng-container matColumnDef="lastname">
					<th mat-header-cell *matHeaderCellDef>Apellido(s)</th>
					<td mat-cell *matCellDef="let student">
						{{ student.lastname }}
					</td>
				</ng-container>
				<ng-container matColumnDef="gender">
					<th mat-header-cell *matHeaderCellDef>Sexo</th>
					<td mat-cell *matCellDef="let student">
						{{ student.gender }}
					</td>
				</ng-container>
				<ng-container matColumnDef="birth">
					<th mat-header-cell *matHeaderCellDef>
						Fecha de Nacimiento
					</th>
					<td mat-cell *matCellDef="let student">
						{{ student.birth | date: 'dd/MM/yyyy' }}
					</td>
				</ng-container>
				<ng-container matColumnDef="actions">
					<th mat-header-cell *matHeaderCellDef>Acciones</th>
					<td mat-cell *matCellDef="let student">
						<button
							(click)="removeStudent(student._id)"
							mat-icon-button
							color="warn"
						>
							<mat-icon>delete</mat-icon>
						</button>
						<button
							(click)="updateStudent(student)"
							mat-icon-button
							style="margin-left: 12px"
						>
							<mat-icon>edit</mat-icon>
						</button>
					</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedCols"></tr>
			</table>
		</div>
	`,
	styles: `
		p {
			font-size: 16px;
			font-family: Roboto, sans-serif;
		}

		mat-card {
			margin-bottom: 32px;
		}

		h3 {
			font-weight: bold;
		}

		.mat-column-actions {
			text-align: center;
		}
	`,
})
export class SectionDetailsComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private dialog = inject(MatDialog);
	private studentService = inject(StudentsService);
	#store = inject(Store);
	user$ = this.#store.select(selectAuthUser);
	user = this.#store.selectSignal(selectAuthUser);

	id = this.route.snapshot.paramMap.get('id') || '';
	uid = '';
	section = this.#store.selectSignal(selectCurrentSection);
	students$: Observable<Student[]> = this.studentService.findBySection(
		this.id,
	);
	students: StudentDto[] = [];

	displayedCols = ['firstname', 'lastname', 'gender', 'birth', 'actions'];

	studentForm = this.fb.group({
		firstname: ['', Validators.required],
		lastname: ['', Validators.required],
		gender: ['Masculino', Validators.required],
		birth: [''],
		user: ['', Validators.required],
		section: [this.id, Validators.required],
	});

	loadStudents() {
		this.students$ = this.studentService.findBySection(this.id);
	}

	ngOnInit(): void {
		this.#store.dispatch(loadSection({ id: this.id }));
		this.user$.subscribe((user) => {
			if (user) this.uid = user._id;
		});
	}

	updateSectionDetails() {
		this.dialog.open(ClassSectionFormComponent, {
			data: this.section(),
		});
	}

	addStudent() {
		const ref = this.dialog.open(StudentFormComponent, {
			data: {
				user: this.uid,
				section: this.id,
			},
		});
		ref.afterClosed().subscribe(() => this.loadStudents());
	}

	updateStudent(student: Student) {
		const ref = this.dialog.open(StudentFormComponent, {
			data: student,
		});
		ref.afterClosed().subscribe(() => this.loadStudents());
	}

	removeStudent(id: string) {
		this.studentService.delete(id).subscribe((result) => {
			if (result.deletedCount === 1) {
				this.sb.open('Estudiante eliminado', 'Ok', { duration: 2500 });
				this.loadStudents();
			}
		});
	}

	removeSection() {
		this.#store.dispatch(deleteSection({ id: this.id }));
		this.router.navigateByUrl('/sections');
	}

	showStudent(student: Student) {
		this.dialog.open(StudentDetailComponent, {
			data: student,
		});
	}

	onFileChange(event: any) {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e: any) => {
			const workbook = XLSX.read(e.target.result, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
			this.processData(data);
		};
		reader.readAsBinaryString(file);
	}

	processData(data: any[]) {
		const cols: string[] = data[0];
		const firstnameIndex = cols.findIndex((c) =>
			['name', 'nombre', 'nombres', 'names', 'firstname'].includes(
				c.trim().toLowerCase(),
			),
		);
		if (firstnameIndex === -1) {
			this.sb.open('No se encontro una columna de nombres.', 'Ok', {
				duration: 2500,
			});
			return;
		}
		const lastnameIndex = cols.findIndex((c) =>
			['lastname', 'apellido', '', 'apellidos', 'surname'].includes(
				c.trim().toLowerCase(),
			),
		);
		const genderIndex = cols.findIndex((c) =>
			['genero', 'sexo', 'gender', 'sex'].includes(
				c.trim().toLowerCase(),
			),
		);
		const birthIndex = cols.findIndex((c) =>
			['fecha de nacimiento', 'fecha'].includes(c.trim().toLowerCase()),
		);
		this.students = data.slice(1).map((row) => {
			const firstname: string =
				firstnameIndex > -1 ? row[firstnameIndex] : '';
			const lastname: string =
				lastnameIndex > -1 ? row[lastnameIndex] : '';
			const gender = genderIndex > -1 ? row[genderIndex] : null;
			const birth = birthIndex > -1 ? new Date(row[birthIndex]) : null;
			return {
				firstname,
				lastname,
				gender,
				birth,
				user: this.uid,
				section: this.id,
			} as StudentDto;
		});

		this.students.forEach((student) => {
			if (!student.firstname) return;
			this.studentService.create(student).subscribe({
				next: (res) => {
					if (res._id) {
						this.loadStudents();
					}
				},
				error: (err) => {
					this.sb.open('Error al importar un estudiante.', 'Ok', {
						duration: 2500,
					});
					console.log(err.message);
				},
			});
		});
	}
}
