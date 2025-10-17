import { Component } from '@angular/core';
import { InProgressComponent } from '../../../shared/ui/in-progress.component';

@Component({
	selector: 'app-unit-plan-edit',
	imports: [InProgressComponent],
	template: `
        <app-in-progress></app-in-progress>
	`,
})
export class UnitPlanEditComponent {
	working = false;
}
