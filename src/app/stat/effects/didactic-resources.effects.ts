import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DidacticResourceService } from "../../services/didactic-resource.service";
import * as DidacticResourcesActions from '../actions/didactic-resources.actions';
import { catchError, map, mergeMap, of } from "rxjs";

@Injectable()
export class DidacticResourcesEffects {
  private actions$ = inject(Actions);
  private didacticResourcesService = inject(DidacticResourceService);

  load$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.load),
    mergeMap(
      () => this.didacticResourcesService.findAll().pipe(
        map(didacticResources => DidacticResourcesActions.loadSuccess({ didacticResources })),
        catchError((error) => of(DidacticResourcesActions.loadFailure({ error })))
      )
    )
  ));

  loadByUser$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.loadByUser),
    mergeMap(
      (action) => this.didacticResourcesService.findByUser(action.id).pipe(
        map(didacticResources => DidacticResourcesActions.loadSuccess({ didacticResources })),
        catchError((error) => of(DidacticResourcesActions.loadFailure({ error })))
      )
    )
  ));

  loadMyResources$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.loadMyResources),
    mergeMap(
      () => this.didacticResourcesService.findMyResources().pipe(
        map(didacticResources => DidacticResourcesActions.loadSuccess({ didacticResources })),
        catchError((error) => of(DidacticResourcesActions.loadFailure({ error })))
      )
    )
  ));

  create$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.create),
    mergeMap(
      (action) => this.didacticResourcesService.create(action.didacticResource).pipe(
        map(result => DidacticResourcesActions.createSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.createFailure({ error })))
      )
    )
  ));

  update$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.update),
    mergeMap(
      (action) => this.didacticResourcesService.update(action.id, action.didacticResource).pipe(
        map(result => DidacticResourcesActions.updateSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.updateFailure({ error })))
      )
    )
  ));

  remove$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.remove),
    mergeMap(
      (action) => this.didacticResourcesService.delete(action.id).pipe(
        map(result => DidacticResourcesActions.removeSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.removeFailure({ error })))
      )
    )
  ));

  like$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.like),
    mergeMap(
      (action) => this.didacticResourcesService.delete(action.id).pipe(
        map(result => DidacticResourcesActions.likeSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.likeFailure({ error })))
      )
    )
  ));

  dislike$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.dislike),
    mergeMap(
      (action) => this.didacticResourcesService.delete(action.id).pipe(
        map(result => DidacticResourcesActions.dislikeSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.dislikeFailure({ error })))
      )
    )
  ));

  bookmark$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.bookmark),
    mergeMap(
      (action) => this.didacticResourcesService.delete(action.id).pipe(
        map(result => DidacticResourcesActions.bookmarkSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.bookmarkFailure({ error })))
      )
    )
  ));

  download$ = createEffect(() => this.actions$.pipe(
    ofType(DidacticResourcesActions.download),
    mergeMap(
      (action) => this.didacticResourcesService.delete(action.id).pipe(
        map(result => DidacticResourcesActions.downloadSuccess({ result })),
        catchError((error) => of(DidacticResourcesActions.downloadFailure({ error })))
      )
    )
  ));
}
