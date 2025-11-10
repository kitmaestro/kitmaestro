import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSubscriptionService } from '../../core/services';
import * as UserSubscriptionsActions from './user-subscriptions.actions';

const timing = { duration: 2500 };

@Injectable()
export class UserSubscriptionsEffects {
	#actions$ = inject(Actions);
	#userSubscriptionService = inject(UserSubscriptionService);
	#sb = inject(MatSnackBar);

	loadSubscription$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(UserSubscriptionsActions.loadSubscription),
			switchMap(({ id }) =>
				this.#userSubscriptionService.find(id).pipe(
					map((subscription) =>
						UserSubscriptionsActions.loadSubscriptionSuccess({
							subscription,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la suscripción',
							'Ok',
							timing,
						);
						return of(
							UserSubscriptionsActions.loadSubscriptionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadSubscriptions$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(UserSubscriptionsActions.loadSubscriptions),
			switchMap(() =>
				this.#userSubscriptionService.findAll().pipe(
					map((subscriptions) =>
						UserSubscriptionsActions.loadSubscriptionsSuccess({
							subscriptions,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las suscripciones',
							'Ok',
							timing,
						);
						return of(
							UserSubscriptionsActions.loadSubscriptionsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadCurrentSubscription$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(UserSubscriptionsActions.loadCurrentSubscription),
			switchMap(() =>
				this.#userSubscriptionService.checkSubscription().pipe(
					map((subscription) =>
						UserSubscriptionsActions.loadCurrentSubscriptionSuccess(
							{ subscription },
						),
					),
					catchError((error) => {
						// No mostrar snackbar en check automático, puede ser 404
						return of(
							UserSubscriptionsActions.loadCurrentSubscriptionFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);

	loadUserSubscription$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(UserSubscriptionsActions.loadUserSubscription),
			switchMap(({ userId }) =>
				this.#userSubscriptionService.findByUser(userId).pipe(
					map((subscription) =>
						UserSubscriptionsActions.loadCurrentSubscriptionSuccess(
							{ subscription },
						),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la suscripción del usuario',
							'Ok',
							timing,
						);
						return of(
							UserSubscriptionsActions.loadCurrentSubscriptionFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);

	createSubscription$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(UserSubscriptionsActions.createSubscription),
			switchMap(({ data }) =>
				this.#userSubscriptionService.create(data).pipe(
					map((subscription) => {
						this.#sb.open(
							'La suscripción ha sido creada',
							'Ok',
							timing,
						);
						return UserSubscriptionsActions.createSubscriptionSuccess(
							{ subscription },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la suscripción',
							'Ok',
							timing,
						);
						return of(
							UserSubscriptionsActions.createSubscriptionFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	subscribe$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(UserSubscriptionsActions.subscribe),
			switchMap(({ subscriptionType, method, duration, amount, user }) =>
				this.#userSubscriptionService
					.subscribe(subscriptionType, method, duration, amount, user)
					.pipe(
						map((subscription) => {
							this.#sb.open('Suscripción exitosa', 'Ok', timing);
							return UserSubscriptionsActions.createSubscriptionSuccess(
								{
									subscription,
								},
							);
						}),
						catchError((error) => {
							this.#sb.open('Error al suscribirse', 'Ok', timing);
							return of(
								UserSubscriptionsActions.createSubscriptionFailed(
									{
										error: error.message,
									},
								),
							);
						}),
					),
			),
		),
	);
}
