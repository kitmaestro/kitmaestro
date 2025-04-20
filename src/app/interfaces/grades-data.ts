export type GradeDataSet = (number | null)[];

export interface GradesData {
    level: string,
    indicators: number,
    grades: string[],
    randomLevel: number,
    includeRecover: boolean,
    precise: boolean,
    students: {
        level: string,
        robotModeLevel: number,
        improvements: boolean,
    }[],
    dataSet: GradeDataSet[];
}