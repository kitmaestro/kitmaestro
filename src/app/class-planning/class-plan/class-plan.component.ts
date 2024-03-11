import { Component, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-class-plan',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    AsyncPipe,
  ],
  templateUrl: './class-plan.component.html',
  styleUrl: './class-plan.component.scss'
})
export class ClassPlanComponent {
  userSubscriptionService = inject(UserSubscriptionService);

  working = true;
  isPremium$ = this.userSubscriptionService.isPremium();
}
