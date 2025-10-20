import { BaseModel } from "./base-model"

export interface UserSubscription extends BaseModel {
	user: string
	subscriptionType: string
	name: string
	status: string
	startDate: Date
	endDate: Date
	method: string
	amount: number
}
