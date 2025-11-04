import { ClassPlanTemplateVersion } from '../enums';
import { BaseModel } from './base-model';

export interface UserSettings {
	classPlans: {
		baseTemplate: ClassPlanTemplateVersion;
	};
}

export interface User extends BaseModel {
	role: string;
	title: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	gender: string;
	phone: string;
	refCode: string;
	photoURL: string;
	schoolName: string;
	regional: string;
	district: string;
	likedResources: string[];
	dislikedResources: string[];
	bookmarks: string[];
	settings: Record<string, boolean | string | number>;
}
