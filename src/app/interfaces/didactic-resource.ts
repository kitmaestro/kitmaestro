import { UserSettings } from './user-settings';

export interface DidacticResource {
	_id: string;
	title: string;
	description: string;
	grade: string[];
	level: string[];
	subject: string[];
	downloadLink: string;
	status: 'draft' | 'preview' | 'public';
	preview: string;
	author: UserSettings;
	price: number;
	likes: number;
	keywords: string[];
	dislikes: number;
	downloads: number;
	bookmarks: number;
}
