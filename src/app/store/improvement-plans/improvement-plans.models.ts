import { ImprovementPlan } from '../../core/interfaces';

export enum ImprovementPlanStateStatus {
  IDLING,
  LOADING_PLANS,
  LOADING_PLAN,
  CREATING_PLAN,
  UPDATING_PLAN,
  DELETING_PLAN,
}

export interface ImprovementPlansState {
  improvementPlans: ImprovementPlan[];
  selectedPlan: ImprovementPlan | null;
  error: string | null;
  totalPlans: number;
  status: ImprovementPlanStateStatus;
}

export const initialImprovementPlansState: ImprovementPlansState = {
  improvementPlans: [],
  selectedPlan: null,
  error: null,
  totalPlans: 0,
  status: ImprovementPlanStateStatus.IDLING,
};
