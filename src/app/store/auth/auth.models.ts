import { User } from '../../core/models';

export interface AuthState {
	user: User | null;
	error: string | null;
	loading: boolean;
	initialized: boolean;
	status: {
		signingIn: boolean;
		signingOut: boolean;
		signingUp: boolean;
		updating: boolean;
		confirmingEmail: boolean;
		requestingEmail: boolean;
		checkingAuth: boolean;
	};
}

export interface LoginDto {
	email: string;
	password: string;
	remember: boolean;
}

export interface SignupDto {
	email: string;
	password: string;
	ref?: string;
	plan?: string;
}

export interface PasswordResetDto {
	email: string;
	token: string;
	password: string;
}

export interface PasswordRecoverDto {
	email: string;
}

export interface LoginOrSignupResponse {
	user: User;
	access_token: string;
	error?: string;
}

export interface LogoutResponse {
	message: string;
}

export interface PasswordRecoverResponse {
	success: boolean;
	message: string;
}

export interface PasswordResetResponse {
	success: boolean;
	message: string;
}

export const initialAuthState: AuthState = {
	user: null,
	error: null,
	loading: false,
	initialized: false,
	status: {
		signingIn: false,
		signingOut: false,
		signingUp: false,
		updating: false,
		confirmingEmail: false,
		requestingEmail: false,
		checkingAuth: false,
	},
};
