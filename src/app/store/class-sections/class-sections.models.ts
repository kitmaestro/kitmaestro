import { ClassSection } from '../../core/interfaces'

export interface ClassSectionDto {
    user?: string;
    level: string;
    year: string;
    name: string;
    subjects: string[];
}

export enum ClassSectionStateStatus {
    IDLING,
    LOADING_SECTIONS,
    LOADING_SECTION,
    CREATING_SECTION,
    UPDATING_SECTION,
    DELETING_SECTION,
}

export interface ClassSectionsState {
    classSections: ClassSection[]
    selectedSection: ClassSection | null
    error: string | null
    status: ClassSectionStateStatus
}

export const initialClassSectionsState: ClassSectionsState = {
    classSections: [],
    selectedSection: null,
    error: null,
    status: ClassSectionStateStatus.IDLING,
}
