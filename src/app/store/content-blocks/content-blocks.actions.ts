import { createAction, props } from '@ngrx/store';
import { ContentBlock } from '../../core/models';
import { ContentBlockDto } from './content-blocks.models';

// Load a single block
export const loadBlock = createAction(
	'[Content Blocks] Load Block',
	props<{ id: string }>(),
);
export const loadBlockSuccess = createAction(
	'[Content Blocks] Load Block Success',
	props<{ block: ContentBlock }>(),
);
export const loadBlockFailed = createAction(
	'[Content Blocks] Load Block Failed',
	props<{ error: string }>(),
);

// Load all blocks
export const loadBlocks = createAction('[Content Blocks] Load Blocks', props<{ filters: any }>());
export const loadBlocksSuccess = createAction(
	'[Content Blocks] Load Blocks Success',
	props<{ blocks: ContentBlock[] }>(),
);
export const loadBlocksFailed = createAction(
	'[Content Blocks] Load Blocks Failed',
	props<{ error: string }>(),
);

// Create a block
export const createBlock = createAction(
	'[Content Blocks] Create Block',
	props<{ block: Partial<ContentBlockDto> }>(),
);
export const createBlockSuccess = createAction(
	'[Content Blocks] Create Block Success',
	props<{ block: ContentBlock }>(),
);
export const createBlockFailed = createAction(
	'[Content Blocks] Create Block Failed',
	props<{ error: string }>(),
);

// Update a block
export const updateBlock = createAction(
	'[Content Blocks] Update Block',
	props<{ id: string; data: Partial<ContentBlockDto> }>(),
);
export const updateBlockSuccess = createAction(
	'[Content Blocks] Update Block Success',
	props<{ block: ContentBlock }>(),
);
export const updateBlockFailed = createAction(
	'[Content Blocks] Update Block Failed',
	props<{ error: string }>(),
);

// Delete a block
export const deleteBlock = createAction(
	'[Content Blocks] Delete Block',
	props<{ id: string }>(),
);
export const deleteBlockSuccess = createAction(
	'[Content Blocks] Delete Block Success',
	props<{ id: string }>(),
);
export const deleteBlockFailed = createAction(
	'[Content Blocks] Delete Block Failed',
	props<{ error: string }>(),
);
