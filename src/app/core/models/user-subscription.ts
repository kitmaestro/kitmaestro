import { BaseModel } from './base-model';
import { User } from './user';

export interface UserSubscription extends BaseModel {
	user: User;
	subscriptionType: string;
	status: string;
	startDate: Date;
	endDate: Date;
	method: string;
	amount: number;
}
