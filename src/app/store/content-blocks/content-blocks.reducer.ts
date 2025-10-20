import { createReducer, on } from '@ngrx/store'
import * as ContentBlocksActions from './content-blocks.actions'
import { initialContentBlocksState, ContentBlockStateStatus } from './content-blocks.models'

export const contentBlocksReducer = createReducer(
    initialContentBlocksState,

    // Set status for ongoing operations
    on(ContentBlocksActions.loadBlock, state => ({
        ...state,
        status: ContentBlockStateStatus.LOADING_BLOCK,
    })),
    on(ContentBlocksActions.loadBlocks, state => ({
        ...state,
        status: ContentBlockStateStatus.LOADING_BLOCKS,
    })),
    on(ContentBlocksActions.createBlock, state => ({
        ...state,
        status: ContentBlockStateStatus.CREATING_BLOCK,
    })),
    on(ContentBlocksActions.updateBlock, state => ({
        ...state,
        status: ContentBlockStateStatus.UPDATING_BLOCK,
    })),
    on(ContentBlocksActions.deleteBlock, state => ({
        ...state,
        status: ContentBlockStateStatus.DELETING_BLOCK,
    })),

    // Handle failure cases
    on(
        ContentBlocksActions.loadBlockFailed,
        ContentBlocksActions.loadBlocksFailed,
        ContentBlocksActions.createBlockFailed,
        ContentBlocksActions.updateBlockFailed,
        ContentBlocksActions.deleteBlockFailed,
        (state, { error }) => ({ ...state, status: ContentBlockStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(ContentBlocksActions.loadBlockSuccess, (state, { block }) => ({
        ...state,
        status: ContentBlockStateStatus.IDLING,
        selectedBlock: block,
    })),
    on(ContentBlocksActions.loadBlocksSuccess, (state, { blocks }) => ({
        ...state,
        status: ContentBlockStateStatus.IDLING,
        contentBlocks: blocks,
    })),
    on(ContentBlocksActions.createBlockSuccess, (state, { block }) => ({
        ...state,
        status: ContentBlockStateStatus.IDLING,
        contentBlocks: [block, ...state.contentBlocks],
    })),
    on(ContentBlocksActions.updateBlockSuccess, (state, { block: updatedBlock }) => ({
        ...state,
        status: ContentBlockStateStatus.IDLING,
        selectedBlock:
            state.selectedBlock?._id === updatedBlock._id ? updatedBlock : state.selectedBlock,
        contentBlocks: state.contentBlocks.map(b =>
            b._id === updatedBlock._id ? updatedBlock : b,
        ),
    })),
    on(ContentBlocksActions.deleteBlockSuccess, (state, { id }) => ({
        ...state,
        status: ContentBlockStateStatus.IDLING,
        selectedBlock: state.selectedBlock?._id === id ? null : state.selectedBlock,
        contentBlocks: state.contentBlocks.filter(b => b._id !== id),
    })),
)
