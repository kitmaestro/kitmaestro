import { createReducer, on } from '@ngrx/store'
import * as StudentsActions from './students.actions'
import { initialStudentsState, StudentStateStatus } from './students.models'

export const studentsReducer = createReducer(
    initialStudentsState,

    // Set status for ongoing operations
    on(StudentsActions.loadStudent, state => ({
        ...state,
        status: StudentStateStatus.LOADING_STUDENT,
    })),
    on(StudentsActions.loadStudents, state => ({
        ...state,
        status: StudentStateStatus.LOADING_STUDENTS,
    })),
    on(StudentsActions.loadStudentsBySection, state => ({
        ...state,
        status: StudentStateStatus.LOADING_SECTION_STUDENTS,
    })),
    on(StudentsActions.createStudent, state => ({
        ...state,
        status: StudentStateStatus.CREATING_STUDENT,
    })),
    on(StudentsActions.updateStudent, state => ({
        ...state,
        status: StudentStateStatus.UPDATING_STUDENT,
    })),
    on(StudentsActions.deleteStudent, state => ({
        ...state,
        status: StudentStateStatus.DELETING_STUDENT,
    })),

    // Handle failure cases
    on(
        StudentsActions.loadStudentFailed,
        StudentsActions.loadStudentsFailed,
        StudentsActions.loadStudentsBySectionFailed,
        StudentsActions.createStudentFailed,
        StudentsActions.updateStudentFailed,
        StudentsActions.deleteStudentFailed,
        (state, { error }) => ({ ...state, status: StudentStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(StudentsActions.loadStudentSuccess, (state, { student }) => ({
        ...state,
        status: StudentStateStatus.IDLING,
        selectedStudent: student,
    })),
    on(StudentsActions.loadStudentsSuccess, (state, { students }) => ({
        ...state,
        status: StudentStateStatus.IDLING,
        students,
    })),
    on(StudentsActions.loadStudentsBySectionSuccess, (state, { students }) => ({
        ...state,
        status: StudentStateStatus.IDLING,
        sectionStudents: students,
    })),
    on(StudentsActions.createStudentSuccess, (state, { student }) => ({
        ...state,
        status: StudentStateStatus.IDLING,
        students: [student, ...state.students],
        sectionStudents: [student, ...state.sectionStudents], // Assume new student appears in both lists
    })),
    on(StudentsActions.updateStudentSuccess, (state, { student: updatedStudent }) => ({
        ...state,
        status: StudentStateStatus.IDLING,
        selectedStudent:
            state.selectedStudent?._id === updatedStudent._id
                ? updatedStudent
                : state.selectedStudent,
        students: state.students.map(s => (s._id === updatedStudent._id ? updatedStudent : s)),
        sectionStudents: state.sectionStudents.map(s =>
            s._id === updatedStudent._id ? updatedStudent : s,
        ),
    })),
    on(StudentsActions.deleteStudentSuccess, (state, { id }) => ({
        ...state,
        status: StudentStateStatus.IDLING,
        selectedStudent: state.selectedStudent?._id === id ? null : state.selectedStudent,
        students: state.students.filter(s => s._id !== id),
        sectionStudents: state.sectionStudents.filter(s => s._id !== id),
    })),
)
