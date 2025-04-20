import { inject, Injectable } from '@angular/core';
import * as SubscriptionActions from '../actions/subscriptions.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserSubscriptionService } from '../../services/user-subscription.service';

@Injectable()
export class SubscriptionsEffects {
	private actions$ = inject(Actions);
	private subsService = inject(UserSubscriptionService);

	checkSubscription = createEffect(() =>
		this.actions$.pipe(
			ofType(SubscriptionActions.checkSubscription),
			mergeMap(() =>
				this.subsService.checkSubscription().pipe(
					map((user_subscription) =>
						SubscriptionActions.checkSubscriptionSuccess({
							user_subscription,
						}),
					),
					catchError((error) =>
						of(
							SubscriptionActions.checkSubscriptionFailure({
								error,
							}),
						),
					),
				),
			),
		),
	);
}
