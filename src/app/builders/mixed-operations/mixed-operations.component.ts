import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-mixed-operations',
  standalone: true,
  imports: [
    MatCardModule,
    InProgressComponent,
  ],
  templateUrl: './mixed-operations.component.html',
  styleUrl: './mixed-operations.component.scss'
})
export class MixedOperationsComponent {

}
