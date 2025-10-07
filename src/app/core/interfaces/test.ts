import { ClassSection } from './class-section';
import { User } from './user';

export interface Test {
	_id: string;
	section: ClassSection;
	subject: string;
	user: User;
	body: string;
	answers: string;
}
