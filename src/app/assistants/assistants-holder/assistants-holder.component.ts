import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-assistants-holder',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    IsPremiumComponent,
    InProgressComponent,
  ],
  templateUrl: './assistants-holder.component.html',
  styleUrl: './assistants-holder.component.scss'
})
export class AssistantsHolderComponent {
  working = true;
}
