import { isDevMode } from '@angular/core'
import { ActionReducerMap, MetaReducer } from '@ngrx/store'
import { BaseRouterStoreState, routerReducer } from '@ngrx/router-store'
import {
	AuthState,
	authReducer,
	UsersState,
	usersReducer,
	ClassPlanState,
	classPlansReducer,
	classSectionsReducer,
	ClassSectionsState,
	ChecklistsState,
	checklistsReducer,
	ContentBlocksState,
	contentBlocksReducer,
	DiagnosticEvaluationsState,
	diagnosticEvaluationsReducer,
	estimationScalesReducer,
	EstimationScalesState,
	UnitPlansState,
	unitPlansReducer,
	CompetenceEntriesState,
	competenceEntriesReducer,
	DidacticResourcesState,
	didacticResourcesReducer,
	IdeasState,
	ideasReducer,
	LogRegistryEntriesState,
	logRegistryEntriesReducer,
	ObservationGuidesState,
	observationGuidesReducer,
	ReadingActivitiesState,
	readingActivitiesReducer,
	RubricsState,
	rubricsReducer,
	ScoreSystemsState,
	scoreSystemsReducer,
	StudentsState,
	studentsReducer,
	TestsState,
	testsReducer,
	SubjectConceptListsState,
	todoListsReducer,
	subjectConceptListsReducer,
	TodoListsState,
	TodosState,
	todosReducer,
	UpdatesState,
	updatesReducer,
	UserSubscriptionsState,
	userSubscriptionsReducer,
	AiState,
	aiReducer,
	MainThemesState,
	mainThemesReducer,
	DidacticSequencesState,
	didacticSequencesReducer,
} from '../store'

export interface State {
	router: BaseRouterStoreState
	auth: AuthState
	users: UsersState
	classPlans: ClassPlanState
	classSections: ClassSectionsState
	checklists: ChecklistsState
	contentBlocks: ContentBlocksState
	diagnosticEvaluations: DiagnosticEvaluationsState
	estimationScales: EstimationScalesState
	unitPlans: UnitPlansState
	competenceEntries: CompetenceEntriesState
	didacticResources: DidacticResourcesState
	ideas: IdeasState
	logRegistryEntries: LogRegistryEntriesState
	observationGuides: ObservationGuidesState
	readingActivities: ReadingActivitiesState
	rubrics: RubricsState
	scoreSystems: ScoreSystemsState
	students: StudentsState
	tests: TestsState
	subjectConceptLists: SubjectConceptListsState
	todoLists: TodoListsState
	todos: TodosState
	updates: UpdatesState
	userSubscriptions: UserSubscriptionsState
	mainThemes: MainThemesState
	ai: AiState
	didacticSequences: DidacticSequencesState
}

export const reducers: ActionReducerMap<State> = {
	router: routerReducer,
	auth: authReducer,
	users: usersReducer,
	classPlans: classPlansReducer,
	classSections: classSectionsReducer,
	checklists: checklistsReducer,
	contentBlocks: contentBlocksReducer,
	diagnosticEvaluations: diagnosticEvaluationsReducer,
	estimationScales: estimationScalesReducer,
	unitPlans: unitPlansReducer,
	competenceEntries: competenceEntriesReducer,
	didacticResources: didacticResourcesReducer,
	ideas: ideasReducer,
	logRegistryEntries: logRegistryEntriesReducer,
	observationGuides: observationGuidesReducer,
	readingActivities: readingActivitiesReducer,
	rubrics: rubricsReducer,
	scoreSystems: scoreSystemsReducer,
	students: studentsReducer,
	tests: testsReducer,
	subjectConceptLists: subjectConceptListsReducer,
	todoLists: todoListsReducer,
	todos: todosReducer,
	updates: updatesReducer,
	userSubscriptions: userSubscriptionsReducer,
	mainThemes: mainThemesReducer,
	ai: aiReducer,
	didacticSequences: didacticSequencesReducer,
}

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : []
