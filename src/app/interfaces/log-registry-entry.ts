export interface LogRegistryEntry {
  id: string;
  user: string;
  date: Date;
  section: string;
  place: string;
  students: string[];
  description: string;
  comments: string;
  type: string;
}
