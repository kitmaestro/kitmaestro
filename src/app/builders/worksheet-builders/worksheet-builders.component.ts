import { Component, inject } from '@angular/core';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-worksheet-builders',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IsPremiumComponent,
    RouterOutlet,
  ],
  templateUrl: './worksheet-builders.component.html',
  styleUrl: './worksheet-builders.component.scss'
})
export class WorksheetBuildersComponent {
  userSubscriptionService = inject(UserSubscriptionService);
  fb = inject(FormBuilder);

  loading = true;

  userSubscription$: Observable<boolean> = this.userSubscriptionService.isPremium().pipe(
    tap(_ => this.loading = false)
  );

}
