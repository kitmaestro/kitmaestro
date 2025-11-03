import { ActivityResourceType } from '../enums';
import { BaseModel } from './base-model';

export interface ActivityResource extends BaseModel {
	type: ActivityResourceType;
	title: string; // Ej: "Video: Conversación en oficina" o "Texto: Carta de Manuel Díaz"
	url?: string; // Para VIDEO, IMAGE
	content?: string; // Para TEXT_CONTENT
	items?: string[]; // Para TOPIC_LIST
	// Para tablas simples
	tableData?: {
		headers: string[];
		rows: string[][];
	};
}
