import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UserSubscriptionService } from '../../core/services'
import * as UserSubscriptionsActions from './user-subscriptions.actions'

const timing = { duration: 2500 }

@Injectable()
export class UserSubscriptionsEffects {
    #actions$ = inject(Actions)
    #userSubscriptionService = inject(UserSubscriptionService)
    #sb = inject(MatSnackBar)

    loadSubscription$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.loadSubscription),
            switchMap(({ id }) =>
                this.#userSubscriptionService.find(id).pipe(
                    map(subscription =>
                        UserSubscriptionsActions.loadSubscriptionSuccess({ subscription }),
                    ),
                    catchError(error => {
                        this.#sb.open('Error al cargar la suscripción', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.loadSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadSubscriptions$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.loadSubscriptions),
            switchMap(() =>
                this.#userSubscriptionService.findAll().pipe(
                    map(subscriptions =>
                        UserSubscriptionsActions.loadSubscriptionsSuccess({ subscriptions }),
                    ),
                    catchError(error => {
                        this.#sb.open('Error al cargar las suscripciones', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.loadSubscriptionsFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadCurrentSubscription$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.loadCurrentSubscription),
            switchMap(() =>
                this.#userSubscriptionService.checkSubscription().pipe(
                    map(subscription =>
                        UserSubscriptionsActions.loadCurrentSubscriptionSuccess({ subscription }),
                    ),
                    catchError(error => {
                        // No mostrar snackbar en check automático, puede ser 404
                        return of(
                            UserSubscriptionsActions.loadCurrentSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadUserSubscription$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.loadUserSubscription),
            switchMap(({ userId }) =>
                this.#userSubscriptionService.findByUser(userId).pipe(
                    map(subscription =>
                        UserSubscriptionsActions.loadCurrentSubscriptionSuccess({ subscription }),
                    ),
                    catchError(error => {
                        this.#sb.open('Error al cargar la suscripción del usuario', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.loadCurrentSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    createSubscription$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.createSubscription),
            switchMap(({ data }) =>
                this.#userSubscriptionService.create(data).pipe(
                    map(subscription => {
                        this.#sb.open('La suscripción ha sido creada', 'Ok', timing)
                        return UserSubscriptionsActions.createSubscriptionSuccess({ subscription })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear la suscripción', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.createSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    subscribe$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.subscribe),
            switchMap(({ subscriptionType, method, duration, amount, user }) =>
                this.#userSubscriptionService
                    .subscribe(subscriptionType, method, duration, amount, user)
                    .pipe(
                        map(subscription => {
                            this.#sb.open('Suscripción exitosa', 'Ok', timing)
                            return UserSubscriptionsActions.createSubscriptionSuccess({
                                subscription,
                            })
                        }),
                        catchError(error => {
                            this.#sb.open('Error al suscribirse', 'Ok', timing)
                            return of(
                                UserSubscriptionsActions.createSubscriptionFailed({
                                    error: error.message,
                                }),
                            )
                        }),
                    ),
            ),
        ),
    )

    addReferral$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.addReferral),
            switchMap(({ referral }) =>
                this.#userSubscriptionService.addReferral(referral as any).pipe(
                    map(subscription => {
                        this.#sb.open('Referido agregado', 'Ok', timing)
                        return UserSubscriptionsActions.createSubscriptionSuccess({ subscription })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al agregar referido', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.createSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    updateReferral$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.updateReferral),
            switchMap(({ id, data }) =>
                this.#userSubscriptionService.updateReferral(id, data).pipe(
                    map(subscription => {
                        this.#sb.open('Referido actualizado', 'Ok', timing)
                        return UserSubscriptionsActions.updateSubscriptionSuccess({ subscription })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar referido', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.updateSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    deleteReferral$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UserSubscriptionsActions.deleteReferral),
            switchMap(({ id }) =>
                this.#userSubscriptionService.deleteReferral(id).pipe(
                    map(() => {
                        this.#sb.open('Referido eliminado', 'Ok', timing)
                        return UserSubscriptionsActions.deleteSubscriptionSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar referido', 'Ok', timing)
                        return of(
                            UserSubscriptionsActions.deleteSubscriptionFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )
}
