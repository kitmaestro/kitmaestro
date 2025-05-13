import { CompetenceName } from '../types/competence-name.type';
import { GradeName } from '../types/grade-name';
import { LevelName } from '../types/level-name';
import { SubjectName } from '../types/subject-name';

export interface CompetenceEntry {
	_id: string;
	name: string;
	grade: GradeName;
	subject: SubjectName;
	level: LevelName;
	entries: string[];
	criteria: string[];
}

export interface competenciasEspecificasPorGrado {
	descripcion: string;
	criteriosEvaluacion: string[];
	grado: GradeName;
}

export interface competenciaFundamental {
	_id: string;
	nivel: LevelName;
	subject: SubjectName;
	nombre: CompetenceName;
	competenciaEspecificaCiclo: string;
	competenciasEspecificasPorGrado: competenciasEspecificasPorGrado[];
}
