import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../../core/interfaces/checklist';
import { ChecklistService } from '../../../core/services/checklist.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-checklists',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		PretifyPipe,
		RouterLink,
	],
	templateUrl: './checklists.component.html',
	styleUrl: './checklists.component.scss',
})
export class ChecklistsComponent implements OnInit {
	private checklistService = inject(ChecklistService);
	private sb = inject(MatSnackBar);

	checklists: Checklist[] = [];

	load() {
		this.checklistService.findAll().subscribe({
			next: (checklists) => {
				if (checklists.length) {
					this.checklists = checklists;
				}
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	download(checklist: Checklist) {
		this.checklistService.download(checklist);
	}

	delete(id: string) {
		this.checklistService.delete(id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.sb.open('Se ha eliminado la lista de cotejo.', 'Ok', {
						duration: 2500,
					});
				} else {
					this.sb.open('Ha ocurrido un error al eliminar', 'Ok', {
						duration: 2500,
					});
				}
				this.load();
			},
			error: (err) => {
				this.load();
				this.sb.open('Ha ocurrido un error al eliminar', 'Ok', {
					duration: 2500,
				});
				console.log(err.message);
			},
		});
	}
}
