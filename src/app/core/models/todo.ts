import { BaseModel } from "./base-model"
import { TodoList } from "./todo-list"
import { User } from "./user"

export interface Todo extends BaseModel {
	user: User
	list: TodoList
	title: string
	description: string
	completed: boolean
}
