import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ContentBlockService } from '../../core/services'
import * as ContentBlocksActions from './content-blocks.actions'

const timing = { duration: 2500 }

@Injectable()
export class ContentBlocksEffects {
    #actions$ = inject(Actions)
    #contentBlockService = inject(ContentBlockService)
    #sb = inject(MatSnackBar)

    loadBlock$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ContentBlocksActions.loadBlock),
            switchMap(({ id }) =>
                this.#contentBlockService.find(id).pipe(
                    map(block => ContentBlocksActions.loadBlockSuccess({ block })),
                    catchError(error => {
                        this.#sb.open('Error al cargar el bloque de contenido', 'Ok', timing)
                        return of(ContentBlocksActions.loadBlockFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    loadBlocks$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ContentBlocksActions.loadBlocks),
            switchMap(() =>
                this.#contentBlockService.findAll().pipe(
                    map(blocks => ContentBlocksActions.loadBlocksSuccess({ blocks })),
                    catchError(error => {
                        this.#sb.open('Error al cargar los bloques de contenido', 'Ok', timing)
                        return of(ContentBlocksActions.loadBlocksFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    createBlock$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ContentBlocksActions.createBlock),
            switchMap(({ block }) =>
                this.#contentBlockService.create(block).pipe(
                    map(newBlock => {
                        this.#sb.open('El bloque de contenido ha sido creado', 'Ok', timing)
                        return ContentBlocksActions.createBlockSuccess({ block: newBlock })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear el bloque de contenido', 'Ok', timing)
                        return of(ContentBlocksActions.createBlockFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    updateBlock$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ContentBlocksActions.updateBlock),
            switchMap(({ id, data }) =>
                this.#contentBlockService.update(id, data).pipe(
                    map(updatedBlock => {
                        this.#sb.open('El bloque de contenido fue actualizado', 'Ok', timing)
                        return ContentBlocksActions.updateBlockSuccess({ block: updatedBlock })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar el bloque de contenido', 'Ok', timing)
                        return of(ContentBlocksActions.updateBlockFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    deleteBlock$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ContentBlocksActions.deleteBlock),
            switchMap(({ id }) =>
                this.#contentBlockService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('El bloque de contenido ha sido eliminado', 'Ok', timing)
                        return ContentBlocksActions.deleteBlockSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar el bloque de contenido', 'Ok', timing)
                        return of(ContentBlocksActions.deleteBlockFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )
}
