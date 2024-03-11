import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-aspects-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './aspects-generator.component.html',
  styleUrl: './aspects-generator.component.scss'
})
export class AspectsGeneratorComponent {

}
