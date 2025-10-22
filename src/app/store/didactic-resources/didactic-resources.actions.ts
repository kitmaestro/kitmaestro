import { createAction, props } from '@ngrx/store'
import { DidacticResource } from '../../core/models'
import { DidacticResourceDto } from './didactic-resources.models'

// Load a single resource
export const loadResource = createAction(
    '[Didactic Resources] Load Resource',
    props<{ id: string }>(),
)
export const loadResourceSuccess = createAction(
    '[Didactic Resources] Load Resource Success',
    props<{ resource: DidacticResource }>(),
)
export const loadResourceFailed = createAction(
    '[Didactic Resources] Load Resource Failed',
    props<{ error: string }>(),
)

// Load all resources (findAll)
export const loadResources = createAction('[Didactic Resources] Load Resources')
export const loadResourcesSuccess = createAction(
    '[Didactic Resources] Load Resources Success',
    props<{ resources: DidacticResource[] }>(),
)
export const loadResourcesFailed = createAction(
    '[Didactic Resources] Load Resources Failed',
    props<{ error: string }>(),
)

// Load my resources (findMyResources)
export const loadMyResources = createAction('[Didactic Resources] Load My Resources')
export const loadMyResourcesSuccess = createAction(
    '[Didactic Resources] Load My Resources Success',
    props<{ resources: DidacticResource[] }>(),
)
export const loadMyResourcesFailed = createAction(
    '[Didactic Resources] Load My Resources Failed',
    props<{ error: string }>(),
)

// Load resources by user (findByUser)
export const loadUserResources = createAction(
    '[Didactic Resources] Load User Resources',
    props<{ userId: string }>(),
)
export const loadUserResourcesSuccess = createAction(
    '[Didactic Resources] Load User Resources Success',
    props<{ resources: DidacticResource[] }>(),
)
export const loadUserResourcesFailed = createAction(
    '[Didactic Resources] Load User Resources Failed',
    props<{ error: string }>(),
)

// Create a resource
export const createResource = createAction(
    '[Didactic Resources] Create Resource',
    props<{ resource: Partial<DidacticResourceDto> }>(),
)
export const createResourceSuccess = createAction(
    '[Didactic Resources] Create Resource Success',
    props<{ resource: DidacticResource }>(),
)
export const createResourceFailed = createAction(
    '[Didactic Resources] Create Resource Failed',
    props<{ error: string }>(),
)

// Update a resource
export const updateResource = createAction(
    '[Didactic Resources] Update Resource',
    props<{ id: string; data: Partial<DidacticResourceDto> }>(),
)
export const updateResourceSuccess = createAction(
    '[Didactic Resources] Update Resource Success',
    props<{ resource: DidacticResource }>(),
)
export const updateResourceFailed = createAction(
    '[Didactic Resources] Update Resource Failed',
    props<{ error: string }>(),
)

// Delete a resource
export const deleteResource = createAction(
    '[Didactic Resources] Delete Resource',
    props<{ id: string }>(),
)
export const deleteResourceSuccess = createAction(
    '[Didactic Resources] Delete Resource Success',
    props<{ id: string }>(),
)
export const deleteResourceFailed = createAction(
    '[Didactic Resources] Delete Resource Failed',
    props<{ error: string }>(),
)

// Special Actions (Bookmark, Like, Dislike, Buy, Download)
export const bookmarkResource = createAction(
    '[Didactic Resources] Bookmark Resource',
    props<{ id: string }>(),
)
export const likeResource = createAction(
    '[Didactic Resources] Like Resource',
    props<{ id: string }>(),
)
export const dislikeResource = createAction(
    '[Didactic Resources] Dislike Resource',
    props<{ id: string }>(),
)
export const buyResource = createAction(
    '[Didactic Resources] Buy Resource',
    props<{ id: string }>(),
)
export const downloadResource = createAction(
    '[Didactic Resources] Download Resource',
    props<{ id: string }>(),
)
