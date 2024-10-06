import { ClassSection } from "./class-section";

export interface Student {
    _id: string;
    firstname: string;
    lastname: string;
    section: ClassSection;
    gender: string;
    birth: Date;
}