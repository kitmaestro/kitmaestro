import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  constructor() {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    mergeMap(action => this.authService.login(action.email, action.password).pipe(
      map((response) => AuthActions.loginSuccess(response)),
      catchError(error => of(AuthActions.loginFailure(error)))
    ))
  ));

  signup$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signup),
    mergeMap(action => this.authService.signup(action.email, action.password).pipe(
      map((response) => AuthActions.signupSuccess(response)),
      catchError(error => of(AuthActions.signupFailure(error)))
    ))
  ));

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        of(AuthActions.logoutSuccess())
      )
    )
  );
}
