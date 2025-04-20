import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PdfService } from '../../services/pdf.service';

@Component({
	selector: 'app-graph-paper',
	imports: [
		MatInputModule,
		MatSelectModule,
		MatCardModule,
		MatFormFieldModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatIconModule,
	],
	templateUrl: './graph-paper.component.html',
	styleUrl: './graph-paper.component.scss',
})
export class GraphPaperComponent {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private pdfService = inject(PdfService);

	borderOptions = [
		{ name: 'solid', label: 'Sólido' },
		{ name: 'dotted', label: 'Punteado' },
		{ name: 'dashed', label: 'Guiones' },
	];

	borderThickness = [
		{ id: 1, label: 'Delgado' },
		{ id: 2, label: 'Medio' },
		{ id: 3, label: 'Grueso' },
	];

	paperForm = this.fb.group({
		squaresPerInch: [4, Validators.required],
		border: ['solid', Validators.required],
		thickness: [1],
		color: ['#039be5'],
	});

	onSubmit() {}

	get lines() {
		const { squaresPerInch } = this.paperForm.value;
		if (squaresPerInch) {
			const lines = Math.floor(10.5 * squaresPerInch);
			return Array.from({ length: lines });
		}

		return Array.from({ length: 10 });
	}

	get squares() {
		const { squaresPerInch } = this.paperForm.value;
		if (squaresPerInch) {
			const lines = Math.floor(8 * squaresPerInch);
			return Array.from({ length: lines });
		}

		return Array.from({ length: 8 });
	}

	print() {
		this.sb.open(
			'Guardando como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		setTimeout(() => {
			this.pdfService.createAndDownloadFromHTML(
				'graph-paper',
				`Papel Cuadriculado - ${this.paperForm.get('squaresPerInch')?.value} cuadros por pulgada`,
			);
		}, 1000);
	}
}
