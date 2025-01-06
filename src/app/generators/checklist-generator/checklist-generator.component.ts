import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
    selector: 'app-checklist-generator',
    imports: [
        IsPremiumComponent,
    ],
    templateUrl: './checklist-generator.component.html',
    styleUrl: './checklist-generator.component.scss'
})
export class ChecklistGeneratorComponent {

}
