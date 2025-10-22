import { createAction, props } from '@ngrx/store'
import { Update } from '../../core/models'
import { UpdateDto } from './updates.models'

// Load a single update
export const loadUpdate = createAction('[Updates] Load Update', props<{ id: string }>())
export const loadUpdateSuccess = createAction(
    '[Updates] Load Update Success',
    props<{ update: Update }>(),
)
export const loadUpdateFailed = createAction(
    '[Updates] Load Update Failed',
    props<{ error: string }>(),
)

// Load all updates
export const loadUpdates = createAction('[Updates] Load Updates')
export const loadUpdatesSuccess = createAction(
    '[Updates] Load Updates Success',
    props<{ updates: Update[] }>(),
)
export const loadUpdatesFailed = createAction(
    '[Updates] Load Updates Failed',
    props<{ error: string }>(),
)

// Create an update
export const createUpdate = createAction(
    '[Updates] Create Update',
    props<{ update: Partial<UpdateDto> }>(),
)
export const createUpdateSuccess = createAction(
    '[Updates] Create Update Success',
    props<{ update: Update }>(),
)
export const createUpdateFailed = createAction(
    '[Updates] Create Update Failed',
    props<{ error: string }>(),
)

// Update an update
export const updateUpdate = createAction(
    '[Updates] Update Update',
    props<{ id: string; data: Partial<UpdateDto> }>(),
)
export const updateUpdateSuccess = createAction(
    '[Updates] Update Update Success',
    props<{ update: Update }>(),
)
export const updateUpdateFailed = createAction(
    '[Updates] Update Update Failed',
    props<{ error: string }>(),
)

// Delete an update
export const deleteUpdate = createAction(
    '[Updates] Delete Update',
    props<{ id: string }>(),
)
export const deleteUpdateSuccess = createAction(
    '[Updates] Delete Update Success',
    props<{ id: string }>(),
)
export const deleteUpdateFailed = createAction(
    '[Updates] Delete Update Failed',
    props<{ error: string }>(),
)
