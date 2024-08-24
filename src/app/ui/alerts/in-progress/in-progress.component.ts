import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-in-progress',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './in-progress.component.html',
  styleUrl: './in-progress.component.scss'
})
export class InProgressComponent {
  @Input() feature = 'Esta herramienta';

}
