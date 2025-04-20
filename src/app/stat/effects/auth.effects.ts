import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffects {
	private actions$ = inject(Actions);
	private authService = inject(AuthService);
	private sb = inject(MatSnackBar);

	constructor() {}

	load$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.load),
			mergeMap(() =>
				this.authService.profile().pipe(
					map((user) => AuthActions.loadSuccess({ user })),
					catchError((error) => of(AuthActions.loadFailure(error))),
				),
			),
		),
	);

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.login),
			mergeMap((action) =>
				this.authService.login(action.email, action.password).pipe(
					map((response) =>
						AuthActions.loginSuccess(response as any),
					),
					catchError((error) => of(AuthActions.loginFailure(error))),
				),
			),
		),
	);

	update$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.update),
			mergeMap((action) =>
				this.authService.update(action.user).pipe(
					map((result) => {
						console.log(result);
						this.sb.open(
							'Tus ajustes han sido actualizados.',
							'Ok',
							{ duration: 2500 },
						);
						AuthActions.load();
						return AuthActions.updateSuccess({ result });
					}),
					catchError((error) => of(AuthActions.updateFailure(error))),
				),
			),
		),
	);

	signup$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.signup),
			mergeMap((action) =>
				this.authService.signup(action.email, action.password).pipe(
					map((response) => AuthActions.signupSuccess(response)),
					catchError((error) => of(AuthActions.signupFailure(error))),
				),
			),
		),
	);

	logout$ = createEffect(() =>
		this.actions$.pipe(
			ofType(AuthActions.logout),
			mergeMap(() => of(AuthActions.logoutSuccess())),
		),
	);
}
