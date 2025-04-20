import { Component, Input } from '@angular/core';
import { ObservationGuide } from '../../interfaces/observation-guide';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Student } from '../../interfaces/student';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-observation-guide',
	imports: [MatCardModule, MatButtonModule, MatIconModule, DatePipe],
	templateUrl: './observation-guide.component.html',
	styleUrl: './observation-guide.component.scss',
})
export class ObservationGuideComponent {
	@Input() guide: ObservationGuide | null = null;
	@Input() students: Student[] = [];
}
