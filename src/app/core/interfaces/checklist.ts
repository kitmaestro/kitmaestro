import { ClassSection } from './class-section';
import { CompetenceEntry } from './competence-entry';
import { ContentBlock } from './content-block';
import { User } from './user';

export interface Checklist {
	_id: string;
	user: User;
	title: string;
	section: ClassSection;
	competence: CompetenceEntry[];
	contentBlock: ContentBlock;
	activity: string;
	activityType: string;
	criteria: string[];
	createdAt?: Date;
	updatedAt?: Date;
}
