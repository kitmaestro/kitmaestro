import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent {
  @Input() slides: string[] = [];
  slideIndex = 0;
}
