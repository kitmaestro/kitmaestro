import { User } from '../../core/models';

export interface UserDto {
	email: string;
	password: string;
	phone: string;
	firstname: string;
	lastname: string;
	gender: string;
}

export enum UserStateStatus {
	IDLING,
	LOADING_USERS,
	LOADING_USER,
	CREATING_USER,
	UPDATING_USER,
	DELETING_USER,
}

export interface UsersState {
	users: User[];
	selectedUser: User | null;
	error: string | null;
	status: UserStateStatus;
}

export const initialUsersState: UsersState = {
	users: [],
	selectedUser: null,
	error: null,
	status: UserStateStatus.IDLING,
};
