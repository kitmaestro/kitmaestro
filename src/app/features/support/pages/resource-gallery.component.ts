import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DidacticResourceService } from '../../../core/services/didactic-resource.service';
import { CommonModule } from '@angular/common';
import { IsEmptyComponent } from '../../../shared/ui/is-empty.component';
import { ResourceCardComponent } from '../components/resource-card.component';
import { ResourceFormComponent } from '../components/resource-form.component';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core';
import { DidacticResource } from '../../../core';
import { AuthService } from '../../../core/services/auth.service';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-resource-gallery',
	imports: [
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatSnackBarModule,
		MatDialogModule,
		MatIconModule,
		ReactiveFormsModule,
		PretifyPipe,
		CommonModule,
		IsEmptyComponent,
		ResourceCardComponent,
	],
	template: `
		<mat-card>
			<mat-card-header
				style="align-items: center; justify-content: space-between"
			>
				<h2>
					Galer&iacute;a de Recursos Did&aacute;cticos
				</h2>
				<button
					mat-fab
					extended
					color="accent"
					(click)="openCreateResourceDialog()"
				>
					<mat-icon>upload</mat-icon>Subir un Recurso
				</button>
			</mat-card-header>
			<mat-card-content>
				<h3>Filtro de Recursos</h3>
				<form [formGroup]="filterForm" class="filter-form">
					<mat-form-field appearance="outline">
						<mat-label>Nivel</mat-label>
						<mat-select
							formControlName="level"
							multiple
							(selectionChange)="filter()"
						>
							<mat-option
								[value]="level"
								*ngFor="let level of levels"
								>{{ level | pretify }}</mat-option
							>
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Grado(s)</mat-label>
						<mat-select
							multiple
							formControlName="grades"
							(selectionChange)="filter()"
						>
							<mat-option
								[value]="grade"
								*ngFor="let grade of grades"
								>{{ grade | pretify }}</mat-option
							>
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Asignatura(s)</mat-label>
						<mat-select
							multiple
							formControlName="subjects"
							(selectionChange)="filter()"
						>
							<mat-option
								[value]="subject"
								*ngFor="let subject of subjects"
								>{{ subject | pretify }}</mat-option
							>
						</mat-select>
					</mat-form-field>
				</form>
			</mat-card-content>
		</mat-card>

		@for (resource of resources; track resource._id) {
			<div style="margin-top: 24px; margin-bottom: 24px">
				<app-resource-card
					[owned]="resource.author._id === user?._id"
					[resource]="resource"
				></app-resource-card>
			</div>
		} @empty {
			<app-is-empty
				(onCreateRequest)="openCreateResourceDialog()"
			></app-is-empty>
		}

		<ng-template #error></ng-template>
	`,
	styles: `
		.filter-form {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 12px;
		}

		.resource-card-container {
			display: grid;
			gap: 12px;
			grid-template-columns: repeat(4, 1fr);
			padding: 12px 0;
			margin: 12px auto;
			max-width: 1200px;
		}
	`,
})
export class ResourceGalleryComponent implements OnInit {
	private fb = inject(FormBuilder);
	private resourcesService = inject(DidacticResourceService);
	private dialog = inject(MatDialog);
	private authService = inject(AuthService);
	loading = true;

	resources: DidacticResource[] = [];
	fullList: DidacticResource[] = [];
	user: User | null = null;

	filterForm = this.fb.group({
		subjects: [[] as string[]],
		level: [[] as string[]],
		grades: [[] as string[]],
		orderBy: ['asc'],
	});

	grades = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO'];
	levels = ['PRE_PRIMARIA', 'PRIMARIA', 'SECUNDARIA'];
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
	];

	load() {
		this.loading = true;
		this.resourcesService.findAll({ status: 'public' }).subscribe({
			next: (res) => {
				this.fullList = res;
				this.loading = false;
				this.filter();
			},
			error: (err) => {
				this.loading = false;
			},
		});
	}

	ngOnInit() {
		this.authService.profile().subscribe((user) => {
			this.user = user;
		});
		this.load();
	}

	openCreateResourceDialog() {
		const dialogRef = this.dialog.open(ResourceFormComponent, {
			width: '100%',
			maxWidth: '960px',
		});
		dialogRef.afterClosed().subscribe((res) => this.load());
	}

	filter() {
		const { subjects, level, grades, orderBy } = this.filterForm
			.value as any;
		this.resources = this.fullList
			.filter((resource) => {
				let matchesSubjects = true;
				let matchesLevel = true;
				let matchesGrades = true;

				// Filtrar por materias
				if (subjects.length > 0) {
					matchesSubjects = subjects.some((subject: string) =>
						resource.subject.includes(subject),
					);
				}

				// Filtrar por nivel
				if (level.length > 0) {
					matchesLevel = level.some((lvl: string) =>
						resource.level.includes(lvl),
					);
				}

				// Filtrar por grado
				if (grades.length > 0) {
					matchesGrades = grades.some((grade: string) =>
						resource.grade.includes(grade),
					);
				}

				return matchesSubjects && matchesLevel && matchesGrades;
			})
			.sort((a, b) => {
				if (orderBy === 'asc') {
					return a.title.localeCompare(b.title);
				} else {
					return b.title.localeCompare(a.title);
				}
			});
	}
}
