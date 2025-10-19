import { inject, Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { catchError, switchMap, map, of, take } from "rxjs"
import { MatSnackBar } from "@angular/material/snack-bar"
import { UserService } from "../../core/services"
import * as UsersActions from './users.actions'

const timing = { duration: 2500 }

@Injectable()
export class UsersEffects {
    #actions$ = inject(Actions)
    #userService = inject(UserService)
    #sb = inject(MatSnackBar)

    loadUser$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UsersActions.loadUser),
            switchMap(({ userId }) => 
                this.#userService.find(userId).pipe(
                    map(user => UsersActions.loadUserSuccess({ user })),
                    catchError(error => {
                        this.#sb.open('Error al cargar el usuario', 'Ok', timing)
                        return of(UsersActions.loadUserFailed({ error: error.message }))
                    })
                )
            )
        )
    )

    loadUsers$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UsersActions.loadUsers),
            switchMap(() => 
                this.#userService.findAll().pipe(
                    map(users => UsersActions.loadUsersSuccess({ users })),
                    catchError(error => {
                        this.#sb.open('Error al cargar los usuarios', 'Ok', timing)
                        return of(UsersActions.loadUsersFailed({ error: error.message }))
                    })
                )
            )
        )
    )

    createUser$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UsersActions.createUser),
            switchMap(({ user }) => 
                this.#userService.create(user).pipe(
                    map(user => {
                        this.#sb.open('El usuario ha sido creado', 'Ok', timing)
                        return UsersActions.createUserSuccess({ user })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear el usuario', 'Ok', timing)
                        return of(UsersActions.createUserFailed({ error: error.message }))
                    })
                )
            )
        )
    )

    updateUser$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UsersActions.updateUser),
            switchMap(({ userId, data }) => 
                this.#userService.update(userId, data).pipe(
                    map(({ success, data: user }) => {
                        if (success) {
                            this.#sb.open('El usuario fue actualizado', 'Ok', timing)
                            return UsersActions.updateUserSuccess({ user })
                        }
                        throw new Error('El usuario no fue actualizado')
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar el usuario', 'Ok', timing)
                        return of(UsersActions.updateUserFailed({ error: error.message }))
                    })
                )
            )
        )
    )

    deleteUser$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UsersActions.deleteUser),
            take(1),
            switchMap(({ userId }) => 
                this.#userService.delete(userId).pipe(
                    map(() => {
                        this.#sb.open('El usuario ha sido eliminado', 'Ok', timing)
                        return UsersActions.deleteUserSuccess({ userId })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar el usuario', 'Ok', timing)
                        return of(UsersActions.deleteUserFailed({ error: error.message }))
                    })
                )
            )
        )
    )
}