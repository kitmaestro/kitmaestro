import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-activity-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './activity-generator.component.html',
  styleUrl: './activity-generator.component.scss'
})
export class ActivityGeneratorComponent {

}
