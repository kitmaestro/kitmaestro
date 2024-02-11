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