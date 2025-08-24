export interface AppEntry {
	name: string;
	description: string;
	link: string[];
	icon: string;
	categories: string[];
	premium?: boolean;
	isNew?: boolean;
	isWorking?: boolean;
	tier?: number;
}
