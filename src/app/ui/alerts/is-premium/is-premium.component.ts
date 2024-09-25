import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { checkSubscription } from '../../../state/actions/subscriptions.actions';

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
  private store = inject(Store);

  public isPremium$: Observable<boolean> = this.store.select(store => store.userSubscription).pipe(
    map(sub => sub ? sub.user_subscription.subscriptionType.includes('premium') && sub.user_subscription.status == "active" : false),
    tap(premium => {
      this.onLoaded.emit(premium)
    })
  );
  public loading$ = this.store.select(store => store.userSubscription.loading);

  @Output() onLoaded: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    this.store.dispatch(checkSubscription());
  }
}
