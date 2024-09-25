import { createAction, props } from '@ngrx/store';
import { DidacticResource } from '../../interfaces/didactic-resource';
import { ApiDeleteResponse } from '../../interfaces/api-delete-response';
import { ApiUpdateResponse } from '../../interfaces/api-update-response';

export const load = createAction('[Didactic Resources] load');

export const loadMyResources = createAction('[Didactic Resources] load my resources');

export const loadByUser = createAction('[Didactic Resources] load by user', props<{ id: string }>());

export const loadSuccess = createAction('[Didactic Resources] load success', props<{ didacticResources: DidacticResource[] }>());

export const loadFailure = createAction('[Didactic Resources] load failure', props<{ error: any }>());

export const find = createAction('[Didactic Resources] find', props<{ id: string }>());

export const findSuccess = createAction('[Didactic Resources] find success', props<{ didacticResources: DidacticResource[] }>());

export const findFailure = createAction('[Didactic Resources] find failure', props<{ error: any }>());

export const create = createAction('[Didactic Resources] create', props<{ didacticResource: DidacticResource }>());

export const createSuccess = createAction('[Didactic Resources] create success', props<{ result: DidacticResource }>());

export const createFailure = createAction('[Didactic Resources] create failure', props<{ error: any }>());

export const update = createAction('[Didactic Resources] update', props<{ id: string, didacticResource: DidacticResource }>());

export const updateSuccess = createAction('[Didactic Resources] update success', props<{ result: ApiUpdateResponse }>());

export const updateFailure = createAction('[Didactic Resources] update failure', props<{ error: any }>());

export const remove = createAction('[Didactic Resources] remove', props<{ id: string }>());

export const removeSuccess = createAction('[Didactic Resources] remove success', props<{ result: ApiDeleteResponse }>());

export const removeFailure = createAction('[Didactic Resources] remove failure', props<{ error: any }>());

export const like = createAction('[Didactic Resources] like', props<{ id: string }>());

export const likeSuccess = createAction('[Didactic Resources] like success', props<{ result: any }>());

export const likeFailure = createAction('[Didactic Resources] like failure', props<{ error: any }>());

export const dislike = createAction('[Didactic Resources] dislike', props<{ id: string }>());

export const dislikeSuccess = createAction('[Didactic Resources] dislike success', props<{ result: any }>());

export const dislikeFailure = createAction('[Didactic Resources] dislike failure', props<{ error: any }>());

export const buy = createAction('[Didactic Resources] buy', props<{ id: string }>());

export const buySuccess = createAction('[Didactic Resources] buy success', props<{ result: any }>());

export const buyFailure = createAction('[Didactic Resources] buy failure', props<{ error: any }>());

export const bookmark = createAction('[Didactic Resources] bookmark', props<{ id: string }>());

export const bookmarkSuccess = createAction('[Didactic Resources] bookmark success', props<{ result: any }>());

export const bookmarkFailure = createAction('[Didactic Resources] bookmark failure', props<{ error: any }>());

export const download = createAction('[Didactic Resources] download', props<{ id: string }>());

export const downloadSuccess = createAction('[Didactic Resources] download success', props<{ result: any }>());

export const downloadFailure = createAction('[Didactic Resources] download failure', props<{ error: any }>());
