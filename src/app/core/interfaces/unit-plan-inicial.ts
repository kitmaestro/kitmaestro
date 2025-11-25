export interface UnitPlanInicial {
	user: string;
	grado: string;
	duracion: number;
	temaUnidad: string;
	situacionAprendizaje: string;
	cuadroAnticipacion: any;
	dominios: string[];
	planDetalladoPorDominio: any[];
	secuenciaActividades: any[];
	recursos: string[];
	metodologia: string;
}
