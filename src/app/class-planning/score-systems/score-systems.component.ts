import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreSystemService } from '../../services/score-system.service';
import { ScoreSystem } from '../../interfaces/score-system';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-score-systems',
  standalone: true,
	imports: [
		RouterLink,
		MatSnackBarModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		MatCardModule,
  ],
  templateUrl: './score-systems.component.html',
  styleUrl: './score-systems.component.scss'
})
export class ScoreSystemsComponent {
	private scoreSystemService = inject(ScoreSystemService);
	private sb = inject(MatSnackBar);
	scoreSystems: ScoreSystem[] = [];
	columns = ['section', 'content', 'activities', 'actions'];

	load() {
		this.scoreSystemService.findAll().subscribe({
			next: scoreSystems => {
				this.scoreSystems = scoreSystems;
			}
		})
	}

	ngOnInit() {
		this.load();
	}

	delete(id: string) {
		this.scoreSystemService.delete(id).subscribe({
			next: res => {
				if (res.deletedCount > 0) {
					this.sb.open('Se ha eliminado el sistema de calificacion', 'Ok', { duration: 2500 })
					this.load();
				}
			},
			error: err => {
				console.log(err.message);
				this.sb.open('Ha ocurrido un error al cargar tus sistemas de calificacion. Intentalo de nuevo, por favor.', 'Ok', { duration: 2500 });
			}
		});
	}
}
