import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MarkdownComponent } from 'ngx-markdown';
import { Test } from '../../interfaces/test';
import { TestService } from '../../services/test.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-detail',
	imports: [
		MarkdownComponent,
		MatCardModule,
		RouterModule,
		MatIconModule,
		MatButtonModule,
  ],
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.scss'
})
export class TestDetailComponent {
	private testService = inject(TestService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';

	test: Test | null = null;

	ngOnInit() {
		if (!this.id) {
			this.sb.open('No se ha encontrado el examen', 'Ok', { duration: 2500 });
			return;
		}

		const sus = this.testService.find(this.id).subscribe({
			next: test => {
				sus.unsubscribe();
				this.test = test;
				console.log(test)
			},
			error: err => {
				console.log(err);
				this.router.navigateByUrl('/tests').then(() => {
					this.sb.open('Ha ocurrido un error al cargar el examen solicitado', 'Ok', { duration: 2500 });
				});
			}
		});
	}

	download() {}

	remove() {
		this.testService.delete(this.id).subscribe({
			next: res => {
				if (res.deletedCount > 0)
					this.router.navigateByUrl('/tests').then(() => {
						this.sb.open('Se ha eliminado el examen', 'Ok', { duration: 2500 });
					});
			},
			error: err => {
				console.log(err);
				this.sb.open('Ha ocurrido un error al borrar el examen.', 'Ok', { duration: 2500 });
			}
		});
	}
}
