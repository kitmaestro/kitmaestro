import { Component } from '@angular/core';
import { InProgressComponent } from '../../in-progress/in-progress.component';

@Component({
  selector: 'app-log-registry-generator',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './log-registry-generator.component.html',
  styleUrl: './log-registry-generator.component.scss'
})
export class LogRegistryGeneratorComponent {

}
