export type SchoolLevel = 'PRE_PRIMARIA' | 'PRIMARIA' | 'SECUNDARIA';

export type SchoolYear = 'PRIMERO' | 'SEGUNDO' | 'TERCERO' | 'CUARTO' | 'QUINTO' | 'SEXTO';

export type SchoolSubject = 'LENGUA_ESPANOLA' | 'MATEMATICA' | 'CIENCIAS_SOCIALES' | 'CIENCIAS_NATURALES' | 'INGLES' | 'FRANCES' | 'FORMACION_HUMANA' | 'EDUCACION_FISICA' | 'EDUCACION_ARTISTICA' | 'TALLERES_OPTATIVOS';

export interface ContentBlock {
	_id: string;
	title: string;
	level: SchoolLevel;
	year: SchoolYear;
	subject: SchoolSubject;
	order: number;
	concepts: string[];
	procedures: string[];
	attitudes: string[];
	achievement_indicators: string[];
}
