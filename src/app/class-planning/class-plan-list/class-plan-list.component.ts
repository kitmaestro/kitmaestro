import { Component, inject } from '@angular/core';
import { ClassPlansService } from '../../services/class-plans.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassPlan } from '../../interfaces/class-plan';
import { PretifyPipe } from '../../pipes/pretify.pipe';

@Component({
	selector: 'app-class-plan-list',
	imports: [
		MatButtonModule,
		MatCardModule,
		MatListModule,
		DatePipe,
		RouterModule,
		MatIconModule,
		MatTableModule,
		PretifyPipe,
	],
	templateUrl: './class-plan-list.component.html',
	styleUrl: './class-plan-list.component.scss',
})
export class ClassPlanListComponent {
	classPlansService = inject(ClassPlansService);
	classPlans$ = this.classPlansService.findAll();
	sb = inject(MatSnackBar);

	displayedColumns = ['section', 'subject', 'date', 'actions'];

	deletePlan(id: string) {
		this.classPlansService.deletePlan(id).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.classPlans$ = this.classPlansService.findAll();
				this.sb.open('El Plan fue eliminado!', 'Ok', {
					duration: 2500,
				});
			}
		});
	}

	async download(plan: ClassPlan) {
		this.sb.open('Estamos descargando tu plan.', 'Ok', { duration: 2500 });
		await this.classPlansService.download(plan);
	}
}
