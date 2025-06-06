export interface Update {
	_id?: string;
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
