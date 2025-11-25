import { User } from './user';
import { BaseModel } from './base-model';

export interface Referral extends BaseModel {
	referrer: User;
	referred: User;
	date: Date;
	status: string;
}
