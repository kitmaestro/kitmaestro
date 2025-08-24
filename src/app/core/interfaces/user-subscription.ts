export interface UserSubscription {
	_id: string;
	user: string;
	subscriptionType: string;
	name: string;
	status: string;
	startDate: Date;
	endDate: Date;
	method: string;
	amount: number;
}
