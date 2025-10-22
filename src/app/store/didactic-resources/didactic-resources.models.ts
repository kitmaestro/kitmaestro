import { DidacticResource } from '../../core/models';

export interface DidacticResourceDto {
	title: string;
	description: string;
	grade: string[];
	level: string[];
	subject: string[];
	downloadLink: string;
	status: 'draft' | 'preview' | 'public';
	preview: string;
	author: string;
	price: number;
	likes: number;
	keywords: string[];
	dislikes: number;
	downloads: number;
	bookmarks: number;
}

export enum DidacticResourceStateStatus {
	IDLING,
	LOADING_RESOURCES,
	LOADING_USER_RESOURCES,
	LOADING_RESOURCE,
	CREATING_RESOURCE,
	UPDATING_RESOURCE,
	DELETING_RESOURCE,
}

export interface DidacticResourcesState {
	resources: DidacticResource[];
	userResources: DidacticResource[];
	selectedResource: DidacticResource | null;
	error: string | null;
	status: DidacticResourceStateStatus;
}

export const initialDidacticResourcesState: DidacticResourcesState = {
	resources: [],
	userResources: [],
	selectedResource: null,
	error: null,
	status: DidacticResourceStateStatus.IDLING,
};
