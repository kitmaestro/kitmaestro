import { Component } from '@angular/core';
import { InProgressComponent } from '../../../shared/ui/in-progress.component';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

@Component({
	selector: 'app-class-plan-edit',
	imports: [InProgressComponent, IsPremiumComponent],
	template: `
		<app-is-premium>
			<app-in-progress feature="Esta sección"></app-in-progress>
		</app-is-premium>
	`,
})
export class ClassPlanEditComponent {
	working = false;
}
