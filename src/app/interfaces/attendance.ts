export interface Attendance {
    id: string;
    section: string;
    student: string;
    month: number;
    year: number;
    data: {
        date: number;
        attendance: 'PRESENTE' | 'TARDE' | 'AUSENTE' | 'EXCUSA' | 'FERIADO';
    }[];
}

// export interface Attendance {
//     _id: string;
//     student: Student;
//     date: Date;
//     status: 'A' | 'E' | 'T' | 'P'; // Attendance Status (Ausente, Excusa, Tarde, Presente)
// }