import { createReducer, on } from '@ngrx/store'
import { initialAuthState } from './auth.models'
import * as AuthActions from './auth.actions'

export const authReducer = createReducer(
    initialAuthState,

    on(AuthActions.loadUser, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, checkingAuth: true }
    })),
    on(AuthActions.loadUserSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        error: null,
        initialized: true,
        status: { ...state.status, checkingAuth: false }
    })),
    on(AuthActions.loadUserFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        initialized: true,
        status: { ...state.status, checkingAuth: true }
    })),

    on(AuthActions.signIn, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, signingIn: true }
    })),
    on(AuthActions.signInSuccess, (state, { response }) => ({
        ...state,
        user: response.user,
        loading: false,
        error: null,
        status: { ...state.status, signingIn: false }
    })),
    on(AuthActions.signInFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, signingIn: false }
    })),

    on(AuthActions.signOut, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, signingOut: true }
    })),
    on(AuthActions.signOutSuccess, (state) => ({
        ...state,
        user: null,
        loading: false,
        error: null,
        status: { ...state.status, signingOut: false }
    })),
    on(AuthActions.signOutFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, signingOut: false }
    })),

    on(AuthActions.signUp, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, signingUp: true }
    })),
    on(AuthActions.signUpSuccess, (state, { response }) => ({
        ...state,
        user: response.user,
        loading: false,
        error: null,
        status: { ...state.status, signingUp: false }
    })),
    on(AuthActions.signUpFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, signingUp: false }
    })),

    on(AuthActions.updateProfile, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, updating: true }
    })),
    on(AuthActions.updateProfileSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        error: null,
        status: { ...state.status, updating: false }
    })),
    on(AuthActions.updateProfileFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, updating: false }
    })),

    on(AuthActions.passwordRecovery, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, requestingEmail: true }
    })),
    on(AuthActions.passwordRecoverySuccess, (state) => ({
        ...state,
        loading: false,
        error: null,
        status: { ...state.status, requestingEmail: false }
    })),
    on(AuthActions.passwordRecoveryFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, requestingEmail: false }
    })),

    on(AuthActions.passwordReset, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, confirmingEmail: true }
    })),
    on(AuthActions.passwordResetSuccess, (state) => ({
        ...state,
        loading: false,
        error: null,
        status: { ...state.status, confirmingEmail: false }
    })),
    on(AuthActions.passwordResetFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, confirmingEmail: false }
    })),

    on(AuthActions.sendSignUpRequestEmail, (state) => ({
        ...state,
        loading: true,
        status: { ...state.status, requestingEmail: true }
    })),
    on(AuthActions.sendSignUpRequestEmailSuccess, (state) => ({
        ...state,
        loading: false,
        error: null,
        status: { ...state.status, requestingEmail: false }
    })),
    on(AuthActions.sendSignUpRequestEmailFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        status: { ...state.status, requestingEmail: false }
    }))
)
