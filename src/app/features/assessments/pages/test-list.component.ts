import { Component, inject, OnInit } from '@angular/core';
import { Test } from '../../../core';
import { TestService } from '../../../core/services/test.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TestComponent } from '../components/test.component';
import { RouterLink } from '@angular/router';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-test-list',
	imports: [
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatTableModule,
		MatIconModule,
		RouterLink,
		PretifyPipe,
	],
	template: `
		<mat-card>
			<mat-card-header
				style="justify-content: space-between; align-items: center"
			>
				<mat-card-title>Mis Exámenes</mat-card-title>
				<button mat-flat-button routerLink="/test-generator">
					Generar Ex&aacute;men
				</button>
			</mat-card-header>
			<mat-card-content> </mat-card-content>
		</mat-card>

		@if (tests.length) {
			<div style="margin-top: 24px">
				<table mat-table [dataSource]="tests" class="mat-elevation-z8">
					<ng-container matColumnDef="grade">
						<th mat-header-cell *matHeaderCellDef>Sección</th>
						<td mat-cell *matCellDef="let element">
							{{ element.section.name }} ({{
								element.section.year | pretify
							}}
							de {{ element.section.level | pretify }})
						</td>
					</ng-container>
					<ng-container matColumnDef="subject">
						<th mat-header-cell *matHeaderCellDef>Asignatura</th>
						<td mat-cell *matCellDef="let element">
							{{ element.subject | pretify }}
						</td>
					</ng-container>
					<ng-container matColumnDef="actions">
						<th mat-header-cell *matHeaderCellDef>Acciones</th>
						<td mat-cell *matCellDef="let element">
							<div style="display: flex; gap: 12px">
								<button
									[disabled]="loading"
									title="Eliminar"
									mat-icon-button
									(click)="delete(element._id)"
								>
									<mat-icon>delete</mat-icon>
								</button>
								<button
									[disabled]="loading"
									title="Descargar Word"
									mat-icon-button
									(click)="download(element)"
								>
									<mat-icon>download</mat-icon>
								</button>
								<a
									title="Abrir"
									mat-icon-button
									routerLink="/tests/{{ element._id }}"
									><mat-icon>open_in_new</mat-icon></a
								>
							</div>
						</td>
					</ng-container>

					<tr mat-header-row *matHeaderRowDef="columns"></tr>
					<tr mat-row *matRowDef="let row; columns: columns"></tr>
				</table>
			</div>
		}
	`,
})
export class TestListComponent implements OnInit {
	testService = inject(TestService);
	dialog = inject(MatDialog);
	loading = false;

	tests: Test[] = [];

	columns = ['grade', 'subject', 'actions'];

	load() {
		this.loading = true;
		this.testService.findAll().subscribe({
			next: (tests) => {
				this.tests = tests;
				this.loading = false;
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	delete(id: string) {
		this.testService.delete(id).subscribe((res) => {
			if (res.deletedCount > 0) this.load();
		});
	}

	open(test: Test) {
		this.dialog.open(TestComponent, {
			data: test,
		});
	}

	async download(test: Test) {
		this.loading = true;
		await this.testService.download(test);
		this.loading = false;
	}
}
