import { UserSettings } from './user-settings';

export interface Referral {
	_id: string;
	referrer: UserSettings;
	referred: UserSettings;
	date: Date;
	status: string;
}
