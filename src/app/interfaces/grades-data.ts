export type GradeDataSet = Array<number | null>;

export interface GradesData {
    level: string,
    indicators: number,
    grades: string[],
    randomLevel: number,
    includeRecover: boolean,
    precise: boolean,
    students: {
        level: string,
        improvements: boolean,
    }[],
    dataSet: GradeDataSet[];
}