import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AiService } from "../../core";
import * as AiActions from "./ai.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class AiEffects {
    #actions$ = inject(Actions)
    #aiService = inject(AiService)
    #sb = inject(MatSnackBar)

    askGemini$ = createEffect(() => this.#actions$.pipe(
        ofType(AiActions.askGemini),
        tap(() => {
            this.#sb.open('Generando contenido...', 'Cerrar', { duration: 2500 })
        }),
        switchMap((action) => this.#aiService.geminiAi(action.question).pipe(
            map((result) => {
                this.#sb.open('Se ha generado el contenido solicitado.', 'Ok', { duration: 2500 })
                return AiActions.askGeminiSuccess({ result: result.response })
            }),
            catchError((error) => {
                this.#sb.open('Ocurrió un error al generar el contenido.', 'Cerrar', { duration: 2500 })
                return of(AiActions.askGeminiFailure({ error: error.message }))
            }),
        ))
    ))
}
