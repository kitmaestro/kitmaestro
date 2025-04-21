import { Component } from '@angular/core';
import { InProgressComponent } from '../../../shared/ui/in-progress.component';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

@Component({
	selector: 'app-grading-systems',
	standalone: true,
	imports: [InProgressComponent, IsPremiumComponent],
	templateUrl: './grading-systems.component.html',
	styleUrl: './grading-systems.component.scss',
})
export class GradingSystemsComponent {}
