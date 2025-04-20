import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
	selector: 'app-chart',
	standalone: true,
	imports: [],
	templateUrl: './chart.component.html',
	styleUrl: './chart.component.scss',
})
export class ChartComponent implements AfterViewInit {
	@ViewChild('canvas') canvas!: ElementRef;
	@Input() data: any;
	@Input() type:
		| 'bar'
		| 'line'
		| 'pie'
		| 'bubble'
		| 'doughnut'
		| 'polarArea'
		| 'radar'
		| 'scatter' = 'bar';

	ngAfterViewInit(): void {
		Chart.register(...registerables);
		new Chart(this.canvas.nativeElement, {
			type: this.type,
			data: this.data,
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	}
}
