import { Component, inject, OnInit } from '@angular/core';
import { ChecklistComponent } from '../checklist/checklist.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChecklistService } from '../../services/checklist.service';
import { Checklist } from '../../interfaces/checklist';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-checklist-detail',
	imports: [
		ChecklistComponent,
		RouterModule,
		MatButtonModule,
		MatSnackBarModule,
		MatIconModule,
	],
	templateUrl: './checklist-detail.component.html',
	styleUrl: './checklist-detail.component.scss',
})
export class ChecklistDetailComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private checklistService = inject(ChecklistService);
	private id = this.route.snapshot.paramMap.get('id') || '';
	checklist: Checklist | null = null;

	ngOnInit() {
		this.checklistService.find(this.id).subscribe({
			next: (res) => {
				this.checklist = res;
				console.log(res);
			},
		});
	}

	deleteList() {
		this.checklistService.delete(this.id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.router.navigateByUrl('/checklists').then(() => {
						this.sb.open('Lista de cotejo eliminada.', 'Ok', {
							duration: 2500,
						});
					});
				}
			},
		});
	}

	download() {
		if (this.checklist) this.checklistService.download(this.checklist);
	}
}
