import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-graph-paper',
  standalone: true,
  imports: [
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './graph-paper.component.html',
  styleUrl: './graph-paper.component.scss'
})
export class GraphPaperComponent {

}
