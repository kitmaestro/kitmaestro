import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { UnitPlanService } from '../../services/unit-plan.service';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { UnitPlan } from '../../interfaces/unit-plan';

@Component({
	selector: 'app-unit-plan-list',
	imports: [
		MatButtonModule,
		MatCardModule,
		MatListModule,
		MatTableModule,
		DatePipe,
		RouterModule,
		MatIconModule,
		PretifyPipe,
	],
	templateUrl: './unit-plan-list.component.html',
	styleUrl: './unit-plan-list.component.scss',
})
export class UnitPlanListComponent {
	unitPlansService = inject(UnitPlanService);
	unitPlans$ = this.unitPlansService
		.findAll()
		.pipe(tap(() => (this.loading = false)));
	sb = inject(MatSnackBar);

	displayedColumns = ['title', 'section', 'subject', 'date', 'actions'];

	loading = true;

	deletePlan(id: string) {
		this.unitPlansService.delete(id).subscribe((result) => {
			if (result.deletedCount === 1) {
				this.sb.open('El Plan fue eliminado!', 'Ok', {
					duration: 2500,
				});
				this.unitPlans$ = this.unitPlansService.findAll();
			}
		});
	}

	async download(plan: UnitPlan) {
		await this.unitPlansService.download(plan);
		this.sb.open('Se ha descargado tu plan', 'Ok', { duration: 2500 });
	}
}
