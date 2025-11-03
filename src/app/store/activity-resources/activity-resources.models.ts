import { ActivityResource } from '../../core/models';
import { ActivityResourceType } from '../../core/enums';

export interface ActivityResourceDto {
	type: ActivityResourceType;
	title: string;
	url?: string;
	content?: string;
	items?: string[];
	tableData?: {
		headers: string[];
		rows: string[][];
	};
}

export enum ActivityResourceStateStatus {
	IDLING,
	LOADING_RESOURCES,
	LOADING_RESOURCE,
	CREATING_RESOURCE,
	UPDATING_RESOURCE,
	DELETING_RESOURCE,
}

export interface ActivityResourcesState {
	resources: ActivityResource[];
	selectedResource: ActivityResource | null;
	error: string | null;
	status: ActivityResourceStateStatus;
}

export const initialActivityResourcesState: ActivityResourcesState = {
	resources: [],
	selectedResource: null,
	error: null,
	status: ActivityResourceStateStatus.IDLING,
};
