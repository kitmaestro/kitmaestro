import { BaseModel } from './base-model';
import { User } from './user';

export interface ClassSection extends BaseModel {
	user: User;
	level: string;
	year: string;
	name: string;
	subjects: string[];
}
