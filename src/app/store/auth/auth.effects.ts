import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, switchMap } from 'rxjs'
import { AuthService } from '../../core/services/auth.service'
import * as AuthActions from './auth.actions'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class AuthEffects {
    #actions$ = inject(Actions)
    #authService = inject(AuthService)
    #sb = inject(MatSnackBar)

    loadUser$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.loadAuthUser),
            switchMap(() =>
                this.#authService.profile().pipe(
                    map((user) => AuthActions.loadAuthUserSuccess({ user })),
                    catchError((error) => of(AuthActions.loadAuthUserFailure({ error: error.message })))
                )
            )
        )
    )

    // Sign In effects
    signIn$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.signIn),
            switchMap(({ credentials }) =>
                this.#authService.login(credentials).pipe(
                    map((response) => AuthActions.signInSuccess({ response })),
                    catchError((error) => {
                        this.#sb.open('Error al iniciar sesion. Inténtalo de nuevo por favor.', 'Ok', { duration: 2500 })
                        return of(AuthActions.signInFailure({ error: error.message }))
                    })
                )
            )
        )
    )

    // Sign Out effects
    signOut$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.signOut),
            switchMap(() =>
                this.#authService.logout().pipe(
                    map(() => {
                        this.#sb.open('Se ha cerrado la sesion', 'Ok', { duration: 2500 })
                        return AuthActions.signOutSuccess()
                    }),
                    catchError((error) => of(AuthActions.signOutFailure({ error: error.message })))
                )
            )
        )
    )

    // Sign Up effects
    signUp$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.signUp),
            switchMap(({ data }) =>
                this.#authService.signup(data).pipe(
                    map((response) => AuthActions.signUpSuccess({ response })),
                    catchError((error) => {
                        this.#sb.open('Error al registrarte. Inténtalo de nuevo por favor.', 'Ok', { duration: 2500 })
                        return of(AuthActions.signUpFailure({ error: error.message }))
                    })
                )
            )
        )
    )

    // Update Profile effects
    updateProfile$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.updateProfile),
            switchMap(({ data }) =>
                this.#authService.update(data).pipe(
                    map((response) => AuthActions.updateProfileSuccess({ user: response })),
                    catchError((error) => of(AuthActions.updateProfileFailure({ error: error.message })))
                )
            )
        )
    )

    // Password Recovery effects
    passwordRecovery$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.passwordRecovery),
            switchMap(({ email }) =>
                this.#authService.recover(email).pipe(
                    map((response) => AuthActions.passwordRecoverySuccess({ response })),
                    catchError((error) => of(AuthActions.passwordRecoveryFailure({ error: error.message })))
                )
            )
        )
    )

    // Password Reset effects
    passwordReset$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(AuthActions.passwordReset),
            switchMap(({ payload }) =>
                this.#authService.resetPassword(payload).pipe(
                    map((response) => AuthActions.passwordResetSuccess({ response })),
                    catchError((error) => of(AuthActions.passwordResetFailure({ error: error.message })))
                )
            )
        )
    )
}