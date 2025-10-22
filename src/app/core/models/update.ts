import { BaseModel } from './base-model';

export interface Update extends BaseModel {
	title: string;
	date: Date;
	type: 'notice' | 'feature' | 'bug';
	description: string;
	content: string;
	author: string;
	links?: {
		label: string;
		link: string;
		external: boolean;
	}[];
	actions: {
		label: string;
		link: string[];
	}[];
}
