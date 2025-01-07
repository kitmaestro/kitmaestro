import { ClassSection } from "./class-section";
import { CompetenceEntry } from "./competence-entry";
import { ContentBlock } from "./content-block";
import { UserSettings } from "./user-settings";

export interface Checklist {
    _id: string;
    user: UserSettings;
    title: string;
    section: ClassSection;
    competence: CompetenceEntry;
    contentBlock: ContentBlock;
    evidence: string;
    criteria: string[];
    createdAt?: Date;
    updatedAt?: Date;
}