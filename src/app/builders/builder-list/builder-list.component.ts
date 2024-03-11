import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-builder-list',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './builder-list.component.html',
  styleUrl: './builder-list.component.scss'
})
export class BuilderListComponent {

}
