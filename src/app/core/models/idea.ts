import { BaseModel } from './base-model';
import { User } from './user';

export interface Idea extends BaseModel {
	user: User;
	title: string;
	description: string;
	votes: {
		user: string;
		like: boolean;
	}[];
}
