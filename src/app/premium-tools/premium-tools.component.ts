import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-premium-tools',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    RouterLink,
  ],
  templateUrl: './premium-tools.component.html',
  styleUrl: './premium-tools.component.scss'
})
export class PremiumToolsComponent {

}
