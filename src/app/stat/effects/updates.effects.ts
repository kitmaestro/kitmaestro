import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateService } from '../../services/update.service';
import * as UpdatesActions from '../actions/updates.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class UpdatesEffects {
	private actions$ = inject(Actions);
	private updatesService = inject(UpdateService);

	load$ = createEffect(() =>
		this.actions$.pipe(
			ofType(UpdatesActions.loadUpdates),
			mergeMap(() =>
				this.updatesService.findAll().pipe(
					map((updates) =>
						UpdatesActions.loadUpdatesSuccess({ updates }),
					),
					catchError((error) =>
						of(UpdatesActions.loadUpdatesFailure({ error })),
					),
				),
			),
		),
	);
}
