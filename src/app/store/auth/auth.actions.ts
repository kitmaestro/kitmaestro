import { createAction, props } from '@ngrx/store'
import { User } from '../../core/interfaces'
import { LoginDto, LoginOrSignupResponse, PasswordRecoverResponse, PasswordResetResponse, SignupDto } from './auth.models'

export const loadUser = createAction('[Auth] Load User')
export const loadUserSuccess = createAction('[Auth] Load User Success', props<{ user: User | null }>())
export const loadUserFailure = createAction('[Auth] Load User Failure', props<{ error: string }>())

export const signIn = createAction('[Auth] Sign In', props<{ credentials: LoginDto }>())
export const signInSuccess = createAction('[Auth] Sign In Success', props<{ response: LoginOrSignupResponse }>())
export const signInFailure = createAction('[Auth] Sign In Failure', props<{ error: string }>())

export const signOut = createAction('[Auth] Sign Out')
export const signOutSuccess = createAction('[Auth] Sign Out Success')
export const signOutFailure = createAction('[Auth] Sign Out Failure', props<{ error: string }>())

export const signUp = createAction('[Auth] Sign Up', props<{ data: SignupDto }>())
export const signUpSuccess = createAction('[Auth] Sign Up Success', props<{ response: LoginOrSignupResponse }>())
export const signUpFailure = createAction('[Auth] Sign Up Failure', props<{ error: string }>())

export const updateProfile = createAction('[Auth] Update Profile', props<{ data: Partial<User> }>())
export const updateProfileSuccess = createAction('[Auth] Update Profile Success', props<{ user: User }>())
export const updateProfileFailure = createAction('[Auth] Update Profile Failure', props<{ error: string }>())

export const passwordRecovery = createAction('[Auth] Password Recovery', props<{ email: string }>())
export const passwordRecoverySuccess = createAction('[Auth] Password Recovery Success', props<{ response: PasswordRecoverResponse }>())
export const passwordRecoveryFailure = createAction('[Auth] Password Recovery Failure', props<{ error: string }>())

export const passwordReset = createAction('[Auth] Password Reset', props<{ payload: any }>())
export const passwordResetSuccess = createAction('[Auth] Password Reset Success', props<{ response: PasswordResetResponse }>())
export const passwordResetFailure = createAction('[Auth] Password Reset Failure', props<{ error: string }>())

export const sendSignUpRequestEmail = createAction('[Auth] Send SignUp Request Email', props<{ data: any }>())
export const sendSignUpRequestEmailSuccess = createAction('[Auth] Send SignUp Request Email Success', props<{ response: PasswordResetResponse }>())
export const sendSignUpRequestEmailFailure = createAction('[Auth] Send SignUp Request Email Failure', props<{ error: string }>())
