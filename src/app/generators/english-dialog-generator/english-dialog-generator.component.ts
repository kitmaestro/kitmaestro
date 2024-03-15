import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-english-dialog-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './english-dialog-generator.component.html',
  styleUrl: './english-dialog-generator.component.scss'
})
export class EnglishDialogGeneratorComponent {
  working = false;
}
