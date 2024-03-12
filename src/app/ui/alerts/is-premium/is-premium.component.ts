import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
  ],
  templateUrl: './is-premium.component.html',
  styleUrl: './is-premium.component.scss'
})
export class IsPremiumComponent {

  userSubscriptionService = inject(UserSubscriptionService);
  
  isPremium$: Observable<boolean> = this.userSubscriptionService.isPremium().pipe(
    tap(premium => { this.loading = false; this.onLoaded.emit(premium) })
  );
  loading = true;

  @Output() onLoaded: EventEmitter<boolean> = new EventEmitter();
}
