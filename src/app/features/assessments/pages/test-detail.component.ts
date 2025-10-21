import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Test } from '../../../core';
import { TestService } from '../../../core/services/test.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TestComponent } from '../components/test.component';

@Component({
	selector: 'app-test-detail',
	imports: [
		MatCardModule,
		RouterModule,
		MatIconModule,
		MatButtonModule,
		TestComponent,
	],
	template: `
		<mat-card>
			<mat-card-header
				style="justify-content: space-between; align-items: center"
			>
				<mat-card-title>Detalles del Examen</mat-card-title>
				<div style="display: flex; gap: 12px">
					<button mat-fab extended routerLink="/tests">
						<mat-icon>list</mat-icon> Ver Todo
					</button>
					<button mat-fab extended (click)="remove()">
						<mat-icon>delete</mat-icon> Eliminar
					</button>
					<button mat-fab extended (click)="download()">
						<mat-icon>download</mat-icon> Descargar
					</button>
				</div>
			</mat-card-header>
			<mat-card-content></mat-card-content>
		</mat-card>

		@if (test) {
			<div style="margin-top: 24px">
				<div style="max-width: 8.5in; margin: 0 auto">
					<mat-card>
						<mat-card-content>
							<app-test [data]="test.body"></app-test>
						</mat-card-content>
					</mat-card>
				</div>
			</div>
		}
	`,
})
export class TestDetailComponent implements OnInit {
	private testService = inject(TestService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';

	test: Test | null = null;
	loading = false;

	ngOnInit() {
		if (!this.id) {
			this.sb.open('No se ha encontrado el examen', 'Ok', {
				duration: 2500,
			});
			return;
		}

		this.loading = true;

		const sus = this.testService.find(this.id).subscribe({
			next: (test) => {
				sus.unsubscribe();
				this.test = test;
				this.loading = false;
			},
			error: (err) => {
				console.log(err);
				this.router.navigateByUrl('/tests').then(() => {
					this.sb.open(
						'Ha ocurrido un error al cargar el examen solicitado',
						'Ok',
						{ duration: 2500 },
					);
				});
			},
		});
	}

	async download() {
		if (this.test) {
			this.loading = true;
			await this.testService.download(this.test);
			this.loading = false;
		}
	}

	remove() {
		this.testService.delete(this.id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0)
					this.router.navigateByUrl('/tests').then(() => {
						this.sb.open('Se ha eliminado el examen', 'Ok', {
							duration: 2500,
						});
					});
			},
			error: (err) => {
				console.log(err);
				this.sb.open(
					'Ha ocurrido un error al borrar el examen.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}
}
