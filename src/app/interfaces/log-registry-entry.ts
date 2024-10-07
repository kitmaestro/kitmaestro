import { ClassSection } from "./class-section";
import { Student } from "./student";

export interface LogRegistryEntry {
  _id: string;
  user: string;
  date: Date;
  section: ClassSection;
  place: string;
  students: Student[];
  description: string;
  comments: string;
  type: string;
}
