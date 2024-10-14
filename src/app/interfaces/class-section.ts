import { School } from "./school";

export interface ClassSection {
  _id: string;
  user: string;
  school: School;
  level: string;
  year: string;
  name: string;
  subjects: string[];
}
