import { ClassSection } from './class-section';
import { BaseModel } from './base-model';
import { User } from './user';

export interface Test extends BaseModel {
	section: ClassSection;
	subject: string;
	user: User;
	body: string;
	answers: string;
}
