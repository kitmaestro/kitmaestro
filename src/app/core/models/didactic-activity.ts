import { ActivityResource } from './activity-resource';
import { BaseModel } from './base-model';
import { DidacticPlan } from './didactic-sequence-plan';

export interface DidacticActivity extends BaseModel {
	plan: DidacticPlan; // A qué unidad pertenece (Ej: "La conversación")
	blockTitle: string; // A qué bloque pertenece (Ej: "Comprensión oral")
	orderInBlock: number; // El orden de esta actividad dentro de ese bloque
	title: string; // Título de la actividad (Ej: "Debate sobre el video")
	description: string; // Las instrucciones para el docente/estudiante
	teacherNote: string; // Notas adicionales (Ej: "Haga paradas en el video...")
	resources: ActivityResource[]; // <-- Requisito 2: Los recursos
	startingPage: number; // <-- Requisito 1: La página
	endingPage: number;
	durationInMinutes: number; // Más flexible que horas (Ej: 15, 10)
}
