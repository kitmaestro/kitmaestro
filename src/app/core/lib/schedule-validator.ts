import { LEVEL } from '../enums/level.enum';
import { GRADE } from '../enums/grade.enum';
import { SCHOOL_SUBJECT } from '../enums/school-subject.enum';
import { JOURNEY } from '../enums/journey.enum';

import { Schedule } from '../interfaces/schedule';

interface ValidationResult {
	valid: boolean;
	reason?: string;
}

// Carga horaria semanal extraída de los documentos PDF.
// Las horas están multiplicadas por 45 para tener el total en minutos.
const weeklyHoursConfig = {
	[LEVEL.PRIMARY]: {
		[JOURNEY.JEE]: {
			[GRADE.PRIMERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 9 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 9 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 5 * 45,
				[SCHOOL_SUBJECT.INGLES]: 0,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.SEGUNDO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 9 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 9 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 5 * 45,
				[SCHOOL_SUBJECT.INGLES]: 0,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.TERCERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 9 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 9 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 5 * 45,
				[SCHOOL_SUBJECT.INGLES]: 0,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.CUARTO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 7 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 7 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 5 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.QUINTO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 7 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 7 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 5 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.SEXTO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 7 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 7 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 5 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
		},
		[JOURNEY.REGULAR]: {
			[GRADE.PRIMERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 6 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 3 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 3 * 45,
				[SCHOOL_SUBJECT.INGLES]: 0,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.SEGUNDO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 6 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 3 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 3 * 45,
				[SCHOOL_SUBJECT.INGLES]: 0,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.TERCERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 6 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 3 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 3 * 45,
				[SCHOOL_SUBJECT.INGLES]: 0,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 3 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 3 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.CUARTO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 5 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 3 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 3 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.QUINTO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 5 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 3 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 3 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.SEXTO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 5 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 3 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 3 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 0,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
		},
	},
	[LEVEL.SECONDARY]: {
		[JOURNEY.JEE]: {
			[GRADE.PRIMERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 7 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 6 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.SEGUNDO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 7 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 6 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
			[GRADE.TERCERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 7 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 5 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 6 * 45,
				[SCHOOL_SUBJECT.INGLES]: 4 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 2 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 4 * 45,
			},
		},
		[JOURNEY.REGULAR]: {
			[GRADE.PRIMERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 6 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 4 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 4 * 45,
				[SCHOOL_SUBJECT.INGLES]: 3 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.SEGUNDO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 6 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 4 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 4 * 45,
				[SCHOOL_SUBJECT.INGLES]: 3 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
			[GRADE.TERCERO]: {
				[SCHOOL_SUBJECT.LENGUA_ESPANOLA]: 6 * 45,
				[SCHOOL_SUBJECT.MATEMATICA]: 6 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_SOCIALES]: 4 * 45,
				[SCHOOL_SUBJECT.CIENCIAS_NATURALES]: 4 * 45,
				[SCHOOL_SUBJECT.INGLES]: 3 * 45,
				[SCHOOL_SUBJECT.FRANCES]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_ARTISTICA]: 2 * 45,
				[SCHOOL_SUBJECT.EDUCACION_FISICA]: 2 * 45,
				[SCHOOL_SUBJECT.FORMACION_HUMANA]: 1 * 45,
				[SCHOOL_SUBJECT.TALLERES_OPTATIVOS]: 0,
			},
		},
	},
};

/**
 * Valida un horario escolar basado en la carga horaria diaria, semanal por asignatura y solapamiento de bloques.
 * @param schedule El horario a validar.
 * @returns Un objeto indicando si el horario es válido y una razón en caso de no serlo.
 */
export function validateSchedule(schedule: Schedule): ValidationResult {
	const { grade, level, journey, dailySchedule } = schedule;

	// 1. Validar la carga horaria diaria
	const maxDailyMinutes = journey === JOURNEY.JEE ? 8 * 45 : 5 * 45;
	for (const day of dailySchedule) {
		const dailyTotal = day.blocks.reduce(
			(sum, block) => sum + block.duration,
			0,
		);
		if (dailyTotal > maxDailyMinutes) {
			return {
				valid: false,
				reason: `La carga horaria del día ${day.day} (${dailyTotal} min) excede el máximo permitido de ${maxDailyMinutes} min.`,
			};
		}
	}

	// 2. Validar la carga horaria semanal por asignatura
	const weeklySubjectTotals: Partial<Record<SCHOOL_SUBJECT, number>> = {};

	for (const day of dailySchedule) {
		for (const block of day.blocks) {
			weeklySubjectTotals[block.subject] =
				(weeklySubjectTotals[block.subject] || 0) + block.duration;
		}
	}

	const maxWeeklyHoursForGrade = weeklyHoursConfig[level]?.[journey]?.[grade];
	if (!maxWeeklyHoursForGrade) {
		return {
			valid: false,
			reason: `No se encontró configuración de carga horaria para el nivel, jornada y grado especificados.`,
		};
	}

	for (const subjectStr in weeklySubjectTotals) {
		const subject = parseInt(subjectStr) as SCHOOL_SUBJECT;
		const totalMinutes = weeklySubjectTotals[subject];
		const maxMinutes = maxWeeklyHoursForGrade[subject];

		if (totalMinutes === undefined || maxMinutes === undefined) continue;

		if (totalMinutes > maxMinutes) {
			return {
				valid: false,
				reason: `La carga horaria semanal para ${SCHOOL_SUBJECT[subject]} (${totalMinutes} min) excede el máximo de ${maxMinutes} min.`,
			};
		}
	}

	// 3. Validar solapamiento de bloques en el mismo día y posición
	for (const day of dailySchedule) {
		const positions = new Set<number>();
		for (const block of day.blocks) {
			if (positions.has(block.position)) {
				return {
					valid: false,
					reason: `Conflicto de horario: Múltiples bloques en la posición ${block.position} el día ${day.day}.`,
				};
			}
			positions.add(block.position);
			// Si un bloque dura 90 minutos, ocupa dos posiciones
			if (block.duration === 90) {
				if (positions.has(block.position + 1)) {
					return {
						valid: false,
						reason: `Conflicto de horario: Un bloque de 90 min en la posición ${block.position} se solapa con el bloque en la posición ${block.position + 1} el día ${day.day}.`,
					};
				}
				positions.add(block.position + 1);
			}
		}
	}

	return { valid: true };
}
