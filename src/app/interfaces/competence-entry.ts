import { GradeName } from "../types/grade-name";
import { LevelName } from "../types/level-name";
import { SubjectName } from "../types/subject-name";

export interface CompetenceEntry {
    _id: string,
    name: string,
    grade: GradeName,
    subject: SubjectName,
    level: LevelName,
    entries: string[],
    criteria: string[],
}