type PrimaryCompetenceName =
	| 'Comunicativa'
	| 'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Científica y Tecnológica'
	| 'Ética y ciudadana; Ambiental y de la Salud; Desarrollo Personal y Espiritual';
type HighSchoolCompetenceName =
	| 'Comunicativa'
	| 'Pensamiento Lógico, Creativo y Crítico'
	| 'Resolución de Problemas'
	| 'Científica y Tecnológica'
	| 'Ética y ciudadana'
	| 'Ambiental y de la Salud'
	| 'Desarrollo Personal y Espiritual';
export type CompetenceName = PrimaryCompetenceName | HighSchoolCompetenceName;
