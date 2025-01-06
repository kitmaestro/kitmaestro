import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
    selector: 'app-class-plan-edit',
    imports: [
        InProgressComponent,
        IsPremiumComponent,
    ],
    templateUrl: './class-plan-edit.component.html',
    styleUrl: './class-plan-edit.component.scss'
})
export class ClassPlanEditComponent {
  working = false;
}
