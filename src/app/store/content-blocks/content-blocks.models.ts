import { ContentBlock } from '../../core/models';
import { SchoolLevel, SchoolSubject, SchoolYear } from '../../core/types';

export interface ContentBlockDto {
	title: string;
	level: SchoolLevel;
	year: SchoolYear;
	subject: SchoolSubject;
	order: number;
	concepts: string[];
	procedures: string[];
	attitudes: string[];
	achievement_indicators: string[];
}

export enum ContentBlockStateStatus {
	IDLING,
	LOADING_BLOCKS,
	LOADING_BLOCK,
	CREATING_BLOCK,
	UPDATING_BLOCK,
	DELETING_BLOCK,
}

export interface ContentBlocksState {
	contentBlocks: ContentBlock[];
	selectedBlock: ContentBlock | null;
	error: string | null;
	status: ContentBlockStateStatus;
}

export const initialContentBlocksState: ContentBlocksState = {
	contentBlocks: [],
	selectedBlock: null,
	error: null,
	status: ContentBlockStateStatus.IDLING,
};
