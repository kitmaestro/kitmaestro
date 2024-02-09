import { Auth, User, user } from "@angular/fire/auth";
import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./auth.actions";

export interface AuthState {
    user: User | null;
}

export const initialState: AuthState = {
    user: null,
}

export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, (_state, { user }) => ({ user })),
);
