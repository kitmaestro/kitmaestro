import { ClassPlanTemplateVersion } from "../enums";

export interface UserSettings {
	classPlans: {
		baseTemplate: ClassPlanTemplateVersion,
	}
}

export interface User {
	_id: string;
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
	settings: UserSettings;
	createdAt?: Date;
	updatedAt?: Date;
}
