import { User } from './user';

export interface Idea {
	_id: string;
	user: User;
	title: string;
	description: string;
	votes: {
		user: string;
		like: boolean;
	}[];
}
