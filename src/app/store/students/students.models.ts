import { Student } from "../../core/models"

export interface StudentDto {
    firstname: string
    lastname: string
    section: string
    gender: string
    birth?: Date | string
}

export enum StudentStateStatus {
    IDLING,
    LOADING_STUDENTS,
    LOADING_SECTION_STUDENTS,
    LOADING_STUDENT,
    CREATING_STUDENT,
    UPDATING_STUDENT,
    DELETING_STUDENT,
}

export interface StudentsState {
    students: Student[]
    sectionStudents: Student[]
    selectedStudent: Student | null
    error: string | null
    status: StudentStateStatus
}

export const initialStudentsState: StudentsState = {
    students: [],
    sectionStudents: [],
    selectedStudent: null,
    error: null,
    status: StudentStateStatus.IDLING,
}
