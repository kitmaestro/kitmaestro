import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreSystemService } from '../../services/score-system.service';
import { GradingActivity, ScoreSystem } from '../../interfaces/score-system';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { lastValueFrom } from 'rxjs';
import { StudentsService } from '../../services/students.service';

@Component({
	selector: 'app-score-systems',
	imports: [
		RouterLink,
		MatSnackBarModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatCardModule,
		PretifyPipe,
	],
	templateUrl: './score-systems.component.html',
	styleUrl: './score-systems.component.scss',
})
export class ScoreSystemsComponent implements OnInit {
	private scoreSystemService = inject(ScoreSystemService);
	private studentService = inject(StudentsService);
	private sb = inject(MatSnackBar);
	scoreSystems: ScoreSystem[] = [];
	columns = [
		'section',
		'subject',
		'content',
		'competence',
		'activities',
		'actions',
	];

	load() {
		this.scoreSystemService.findAll().subscribe({
			next: (scoreSystems) => {
				this.scoreSystems = scoreSystems;
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	countCompetence(activities: GradingActivity[]) {
		return activities.reduce((prev: string[], curr: GradingActivity) => {
			if (!prev.includes(curr.competence)) {
				prev.push(curr.competence);
			}
			return prev;
		}, [] as string[]).length;
	}

	delete(id: string) {
		this.scoreSystemService.delete(id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.sb.open(
						'Se ha eliminado el sistema de calificacion',
						'Ok',
						{ duration: 2500 },
					);
					this.load();
				}
			},
			error: (err) => {
				console.log(err.message);
				this.sb.open(
					'Ha ocurrido un error al cargar tus sistemas de calificacion. Intentalo de nuevo, por favor.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}

	async download(system: ScoreSystem) {
		if (!system.section) {
			this.sb.open(
				'Este sistema de calificaciones contiene errores. No se puede descargar',
				'Ok',
				{ duration: 2500 },
			);
			return;
		}
		const students = await lastValueFrom(
			this.studentService.findBySection(system.section._id),
		);
		await this.scoreSystemService.download(system, students);
		this.sb.open('Se ha descargado tu sistema de calificacion', 'Ok', {
			duration: 2500,
		});
	}
}
