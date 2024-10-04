import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { UserSubscriptionService } from '../../../services/user-subscription.service';

@Component({
  selector: 'app-is-premium',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './is-premium.component.html',
  styleUrl: './is-premium.component.scss'
})
export class IsPremiumComponent {
  private userSubscriptionService = inject(UserSubscriptionService);

  public isPremium$: Observable<boolean> = this.userSubscriptionService.checkSubscription().pipe(
    map(sub => sub.status == 'active' && sub.subscriptionType.toLowerCase().includes('premium') && +(new Date(sub.endDate)) > +(new Date())),
    tap(premium => {
      this.loading = false;
      this.onLoaded.emit(premium)
    })
  );
  public loading = true;

  @Output() onLoaded: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
  }
}
