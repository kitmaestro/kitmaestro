import { User } from './user';

export interface Referral {
	_id: string;
	referrer: User;
	referred: User;
	date: Date;
	status: string;
}
