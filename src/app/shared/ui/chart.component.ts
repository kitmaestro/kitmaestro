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
	template: `
		<div class="container">
			<canvas style="max-width: 100%; max-height: 100%" #canvas></canvas>
		</div>
	`,
	styles: '.container {max-width: 100%;}',
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
