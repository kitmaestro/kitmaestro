import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';

@Component({
	selector: 'app-number-line',
	imports: [InProgressComponent, MatCardModule],
	templateUrl: './number-line.component.html',
	styleUrl: './number-line.component.scss',
})
export class NumberLineComponent {}
