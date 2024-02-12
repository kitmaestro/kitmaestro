import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { InProgressComponent } from '../../in-progress/in-progress.component';
import { Chart, registerables } from 'chart.js';
import { ChartComponent } from '../../ui/chart/chart.component';

@Component({
  selector: 'app-log-registry-generator',
  standalone: true,
  imports: [
    InProgressComponent,
    ChartComponent,
  ],
  templateUrl: './log-registry-generator.component.html',
  styleUrl: './log-registry-generator.component.scss'
})
export class LogRegistryGeneratorComponent {
  data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  };
}
