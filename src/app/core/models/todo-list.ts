import { BaseModel } from "./base-model"

export interface TodoList extends BaseModel {
	user: string
	name: string
	description: string
	active: boolean
}
