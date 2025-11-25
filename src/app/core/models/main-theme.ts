import { BaseModel } from './base-model';

export interface MainTheme extends BaseModel {
	level: string;
	year: string;
	subject: string;
	category: string;
	topics: string[];
}
