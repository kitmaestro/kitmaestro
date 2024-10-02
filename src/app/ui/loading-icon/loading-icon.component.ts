import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loading-icon',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './loading-icon.component.html',
  styleUrl: './loading-icon.component.scss'
})
export class LoadingIconComponent {

}
