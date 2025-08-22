import { GRADE, JOURNEY, LEVEL } from "../enums";
import { ClassBlock } from "./class-block";

export interface Schedule {
	grade: GRADE;
	level: LEVEL;
	journey: JOURNEY;
	dailySchedule: { day: number; blocks: ClassBlock[] }[];
}
