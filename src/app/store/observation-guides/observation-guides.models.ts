import { ObservationGuide, User, ClassSection } from '../../core/models';

export interface ObservationGuideDto {
	user: string | User;
	title: string;
	date: string | Date;
	section: string | ClassSection;
	individual: boolean;
	duration: string;
	description: string;
	competence: {
		fundamental: string;
		items: string[];
	}[];
	aspects: string[];
}

export enum ObservationGuideStateStatus {
	IDLING,
	LOADING_GUIDES,
	LOADING_GUIDE,
	CREATING_GUIDE,
	UPDATING_GUIDE,
	DELETING_GUIDE,
}

export interface ObservationGuidesState {
	guides: ObservationGuide[];
	selectedGuide: ObservationGuide | null;
	error: string | null;
	status: ObservationGuideStateStatus;
}

export const initialObservationGuidesState: ObservationGuidesState = {
	guides: [],
	selectedGuide: null,
	error: null,
	status: ObservationGuideStateStatus.IDLING,
};
