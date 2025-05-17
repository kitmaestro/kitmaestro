import { Component } from '@angular/core';
import { InProgressComponent } from '../../../../shared/ui/in-progress.component';

@Component({
	selector: 'app-unit-plan-edit',
	imports: [InProgressComponent],
	templateUrl: './unit-plan-edit.component.html',
	styleUrl: './unit-plan-edit.component.scss',
})
export class UnitPlanEditComponent {
	working = false;
}
