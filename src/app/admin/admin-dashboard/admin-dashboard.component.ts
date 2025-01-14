import { Component, inject } from '@angular/core';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { UnitPlanService } from '../../services/unit-plan.service';
import { ClassPlansService } from '../../services/class-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        AsyncPipe,
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  private userService = inject(UserSettingsService);
  private subscriptionService = inject(UserSubscriptionService);
  private unitPlanService = inject(UnitPlanService);
  private classPlanService = inject(ClassPlansService);

  users$ = this.userService.findAll().pipe(map(e => e.length));
  subscriptions$ = this.subscriptionService.findAll().pipe(map(e => e.length));
  unitPlans$ = this.unitPlanService.findAll().pipe(map(e => e.length));
  classPlans$ = this.classPlanService.findAll().pipe(map(e => e.length));
}
