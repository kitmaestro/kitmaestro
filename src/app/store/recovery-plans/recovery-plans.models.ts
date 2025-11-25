import { RecoveryPlan } from '../../core/models';

export enum RecoveryPlanStateStatus {
	IDLING = 'IDLING',
	LOADING_RECOVERY_PLAN = 'LOADING_RECOVERY_PLAN',
	LOADING_RECOVERY_PLANS = 'LOADING_RECOVERY_PLANS',
	CREATING_RECOVERY_PLAN = 'CREATING_RECOVERY_PLAN',
	UPDATING_RECOVERY_PLAN = 'UPDATING_RECOVERY_PLAN',
	DELETING_RECOVERY_PLAN = 'DELETING_RECOVERY_PLAN',
	DOWNLOADING_RECOVERY_PLAN = 'DOWNLOADING_RECOVERY_PLAN',
}

export interface RecoveryPlanState {
	recoveryPlans: RecoveryPlan[];
	selectedRecoveryPlan: RecoveryPlan | null;
	status: RecoveryPlanStateStatus;
	error: string | null;
}

export const initialRecoveryPlanState: RecoveryPlanState = {
	recoveryPlans: [],
	selectedRecoveryPlan: null,
	status: RecoveryPlanStateStatus.IDLING,
	error: null,
};
