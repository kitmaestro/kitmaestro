export interface SubjectYearContents {
	nivel: string
	grado: string
	area: string
	competencias: {
		fundamental: string
		especificas: string[]
	}[]
	contenidos: {
		conceptos: string[]
		procedimientos: string[]
		actitudesYValores: string[]
	}
	indicadoresDeLogro: string[]
}
