import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { EstimationScaleService } from '../../../core/services/estimation-scale.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfService } from '../../../core/services/pdf.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../core/interfaces';
import { EstimationScale } from '../../../core/interfaces/estimation-scale';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-estimation-scale-detail',
	imports: [
		RouterLink,
		MatCardModule,
		MatSnackBarModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './estimation-scale-detail.component.html',
	styleUrl: './estimation-scale-detail.component.scss',
})
export class EstimationScaleDetailComponent implements OnInit {
	private estimationScaleService = inject(EstimationScaleService);
	private authService = inject(AuthService);
	private pdfService = inject(PdfService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';

	public user: User | null = null;
	public estimationScale: EstimationScale | null = null;

	public schoolYear =
		new Date().getMonth() > 6
			? `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`
			: `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`;

	ngOnInit(): void {
		this.authService.profile().subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
		this.estimationScaleService.find(this.id).subscribe({
			next: (scale) => {
				if (scale._id) {
					this.estimationScale = scale;
				}
			},
			error: (err) => {
				this.router
					.navigate(['/assessments/estimation-scales'])
					.then(() => {
						this.sb.open(
							'Hubo un error al cargar el documento solicitado.',
							'Ok',
							{ duration: 2500 },
						);
						console.log(err.message);
					});
			},
		});
	}

	deleteInstrument() {
		this.estimationScaleService.delete(this.id).subscribe({
			next: (res) => {
				if (res.deletedCount === 1) {
					this.router
						.navigate(['/assessments/estimation-scales'])
						.then(() => {
							this.sb.open(
								'Se ha eliminado el instrumento',
								'Ok',
								{ duration: 2500 },
							);
						});
				}
			},
			error: (err) => {
				this.sb.open('Error al guardar', 'Ok', { duration: 2500 });
			},
		});
	}

	pretifySubject(name: string) {
		switch (name) {
			case 'LENGUA_ESPANOLA':
				return 'Lengua Española';
			case 'MATEMATICA':
				return 'Matemática';
			case 'CIENCIAS_SOCIALES':
				return 'Ciencias Sociales';
			case 'CIENCIAS_NATURALES':
				return 'Ciencias de la Naturaleza';
			case 'INGLES':
				return 'Inglés';
			case 'FRANCES':
				return 'Francés';
			case 'FORMACION_HUMANA':
				return 'Formación Integral Humana y Religiosa';
			case 'EDUCACION_FISICA':
				return 'Educación Física';
			case 'EDUCACION_ARTISTICA':
				return 'Educación Artística';
			default:
				return 'Talleres Optativos';
		}
	}

	print() {
		if (!this.estimationScale) return;
		this.sb.open(
			'Ya estamos exportando tu instrumento. Espera un momento.',
			'Ok',
			{ duration: 2500 },
		);
		this.pdfService.exportTableToPDF(
			'estimation-scale',
			this.estimationScale.title,
		);
	}
}
