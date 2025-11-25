import { createSelector } from '@ngrx/store';
import { selectAuthLoading } from '../store/auth';
import { selectIsLoadingCurrent } from '../store/user-subscriptions/user-subscriptions.selectors';
import { selectIsLoadingMany as selectIsLoadingManyActivities } from '../store/didactic-activities/didactic-activities.selectors';
import { selectIsLoadingOne as selectIsLoadingOneActivity } from '../store/didactic-activities/didactic-activities.selectors';
import { selectIsLoadingMany as selectIsLoadingManyActivityResources } from '../store/activity-resources/activity-resources.selectors';
import { selectIsLoadingOne as selectIsLoadingOneActivityResource } from '../store/activity-resources/activity-resources.selectors';
import { selectChecklistsLoading, selectChecklistLoading } from '../store/checklists/checklists.selectors';
import { selectClassPlansLoading } from '../store/class-plans/class-plans.selectors';
import { selectIsLoadingSections, selectIsLoadingSection } from '../store/class-sections/class-sections.selectors';
import { selectIsLoadingMany as selectIsLoadingManyCompetenceEntries } from '../store/competence-entries/competence-entries.selectors';
import { selectIsLoadingOne as selectIsLoadingOneCompetenceEntry } from '../store/competence-entries/competence-entries.selectors';
import { selectContentBlocksLoading as selectIsLoadingManyContentBlocks } from '../store/content-blocks/content-blocks.selectors';
import { selectContentBlockLoading as selectIsLoadingOneContentBlock } from '../store/content-blocks/content-blocks.selectors';
import { selectEvaluationsLoading as selectIsLoadingManyDiagnosticEvaluations } from '../store/diagnostic-evaluations/diagnostic-evaluations.selectors';
import { selectEvaluationLoading as selectIsLoadingOneDiagnosticEvaluation } from '../store/diagnostic-evaluations/diagnostic-evaluations.selectors';
import { selectIsLoadingMany as selectIsLoadingManyDidacticSequences } from '../store/didactic-sequences/didactic-sequences.selectors';
import { selectIsLoadingOne as selectIsLoadingOneDidacticSequence } from '../store/didactic-sequences/didactic-sequences.selectors';
import { selectIsLoadingManySequencePlans, selectIsLoadingOneSequencePlan } from '../store/didactic-sequence-plans/didactic-sequence-plans.selectors';
import { selectLoadingEstimationScales, selectLoadingEstimationScale } from '../store/estimation-scales/estimation-scales.selectors';
import { selectIsLoadingMany as selectIsLoadingManyIdeas } from '../store/ideas/ideas.selectors';
import { selectIsLoadingOne as selectIsLoadingOneIdea } from '../store/ideas/ideas.selectors';
import { selectImprovementPlansIsLoading, selectImprovementPlanIsLoading } from '../store/improvement-plans/improvement-plans.selectors';
import { selectIsLoadingMany as selectIsLoadingManyLogRegistryEntries } from '../store/log-registry-entries/log-registry-entries.selectors';
import { selectIsLoadingOne as selectIsLoadingOneLogRegistryEntry } from '../store/log-registry-entries/log-registry-entries.selectors';
import { selectIsLoadingMany as selectIsLoadingManyMainThemes } from '../store/main-themes/main-themes.selectors';
import { selectIsLoadingOne as selectIsLoadingOneMainTheme } from '../store/main-themes/main-themes.selectors';
import { selectIsLoadingMany as selectIsLoadingManyObservationGuides } from '../store/observation-guides/observation-guides.selectors';
import { selectIsLoadingOne as selectIsLoadingOneObservationGuide } from '../store/observation-guides/observation-guides.selectors';
import { selectIsLoadingMany as selectIsLoadingManyReadingActivities } from '../store/reading-activities/reading-activities.selectors';
import { selectIsLoadingOne as selectIsLoadingOneReadingActivity } from '../store/reading-activities/reading-activities.selectors';
import { selectIsLoadingManyRecoveryPlans, selectIsLoadingOneRecoveryPlan } from '../store/recovery-plans/recovery-plans.selectors';
import { selectIsLoadingMany as selectIsLoadingManyRubrics } from '../store/rubrics/rubrics.selectors';
import { selectIsLoadingOne as selectIsLoadingOneRubric } from '../store/rubrics/rubrics.selectors';
import { selectIsLoadingMany as selectIsLoadingManyScoreSystems } from '../store/score-systems/score-systems.selectors';
import { selectIsLoadingOne as selectIsLoadingOneScoreSystem } from '../store/score-systems/score-systems.selectors';
import { selectIsLoadingMany as selectIsLoadingManyStudents } from '../store/students/students.selectors';
import { selectIsLoadingOne as selectIsLoadingOneStudent } from '../store/students/students.selectors';
import { selectIsLoadingManyConcepts, selectIsLoadingOneConcept } from '../store/subject-concept-lists/subject-concept-lists.selectors';
import { selectIsLoadingMany as selectIsLoadingManyTests } from '../store/tests/tests.selectors';
import { selectIsLoadingOne as selectIsLoadingOneTest } from '../store/tests/tests.selectors';
import { selectIsLoadingMany as selectIsLoadingManyTodoLists } from '../store/todo-lists/todo-lists.selectors';
import { selectIsLoadingOne as selectIsLoadingOneTodoList } from '../store/todo-lists/todo-lists.selectors';
import { selectIsLoadingMany as selectIsLoadingManyTodos } from '../store/todos/todos.selectors';
import { selectIsLoadingOne as selectIsLoadingOneTodo } from '../store/todos/todos.selectors';
import { selectUnitPlansIsLoading, selectUnitPlanIsLoading } from '../store/unit-plans/unit-plans.selectors';
import { selectIsLoadingMany as selectIsLoadingManyUpdates } from '../store/updates/updates.selectors';
import { selectIsLoadingOne as selectIsLoadingOneUpdate } from '../store/updates/updates.selectors';
import { selectUserLoading as selectIsLoadingOneUser } from '../store/users/users.selectors';
import { selectUsersLoading as selectIsLoadingManyUsers } from '../store/users/users.selectors';

export const selectGlobalLoading = createSelector(
  selectAuthLoading,
  selectIsLoadingCurrent,
  selectIsLoadingManyActivities,
  selectIsLoadingOneActivity,
  selectIsLoadingManyActivityResources,
  selectIsLoadingOneActivityResource,
  selectChecklistsLoading,
  selectChecklistLoading,
  selectClassPlansLoading,
  selectIsLoadingSections,
  selectIsLoadingSection,
  selectIsLoadingManyCompetenceEntries,
  selectIsLoadingOneCompetenceEntry,
  selectIsLoadingManyContentBlocks,
  selectIsLoadingOneContentBlock,
  selectIsLoadingManyDiagnosticEvaluations,
  selectIsLoadingOneDiagnosticEvaluation,
  selectIsLoadingManyDidacticSequences,
  selectIsLoadingOneDidacticSequence,
  selectIsLoadingManySequencePlans,
  selectIsLoadingOneSequencePlan,
  selectLoadingEstimationScales,
  selectLoadingEstimationScale,
  selectIsLoadingManyIdeas,
  selectIsLoadingOneIdea,
  selectImprovementPlansIsLoading,
  selectImprovementPlanIsLoading,
  selectIsLoadingManyLogRegistryEntries,
  selectIsLoadingOneLogRegistryEntry,
  selectIsLoadingManyMainThemes,
  selectIsLoadingOneMainTheme,
  selectIsLoadingManyObservationGuides,
  selectIsLoadingOneObservationGuide,
  selectIsLoadingManyReadingActivities,
  selectIsLoadingOneReadingActivity,
  selectIsLoadingManyRecoveryPlans,
  selectIsLoadingOneRecoveryPlan,
  selectIsLoadingManyRubrics,
  selectIsLoadingOneRubric,
  selectIsLoadingManyScoreSystems,
  selectIsLoadingOneScoreSystem,
  selectIsLoadingManyStudents,
  selectIsLoadingOneStudent,
  selectIsLoadingManyConcepts,
  selectIsLoadingOneConcept,
  selectIsLoadingManyTests,
  selectIsLoadingOneTest,
  selectIsLoadingManyTodoLists,
  selectIsLoadingOneTodoList,
  selectIsLoadingManyTodos,
  selectIsLoadingOneTodo,
  selectUnitPlansIsLoading,
  selectUnitPlanIsLoading,
  selectIsLoadingManyUpdates,
  selectIsLoadingOneUpdate,
  selectIsLoadingManyUsers,
  selectIsLoadingOneUser,
  (...loadings: boolean[]) => {
    return loadings.some(loading => loading);
  }
);
