import { Component, inject } from '@angular/core';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { UnitPlanService } from '../../services/unit-plan.service';
import { ClassPlansService } from '../../services/class-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-users',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent {
	private userService = inject(UserSettingsService);
	private subscriptionService = inject(UserSubscriptionService);
	private unitPlanService = inject(UnitPlanService);
	private classPlanService = inject(ClassPlansService);

	columns = ['name', 'actions']

	users$ = this.userService.findAll();
	subscriptions$ = this.subscriptionService.findAll();
	unitPlans$ = this.unitPlanService.findAll();
	classPlans$ = this.classPlanService.findAll();
}
