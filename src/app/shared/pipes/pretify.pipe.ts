import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'pretify',
	standalone: true,
})
export class PretifyPipe implements PipeTransform {
	transform(value: string, level?: string): string {
		switch (value) {
			case 'LENGUA_ESPANOLA':
				return 'Lengua Española';
			case 'MATEMATICA':
				return 'Matemática';
			case 'CIENCIAS_SOCIALES':
				return 'Ciencias Sociales';
			case 'CIENCIAS_NATURALES':
				return 'Ciencias de la Naturaleza';
			case 'INGLES':
				return 'Inglés';
			case 'FRANCES':
				return 'Francés';
			case 'FORMACION_HUMANA':
				return 'Formación Integral Humana y Religiosa';
			case 'EDUCACION_FISICA':
				return 'Educación Física';
			case 'EDUCACION_ARTISTICA':
				return 'Educación Artística';
			case 'TALLERES_OPTATIVOS':
				return 'Talleres Optativos';
			case 'MANUALES':
				return 'Manuales e Instructivos';
			case 'FASCICULOS':
				return 'Fascículos';
			case 'PRE_PRIMARIA':
				return 'Pre Primaria';
			case 'PRIMARIA':
				return 'Primaria';
			case 'SECUNDARIA':
				return 'Secundaria';
			case 'PRIMERO':
				return 'Primero';
			case 'SEGUNDO':
				return 'Segundo';
			case 'TERCERO':
				return 'Tercero';
			case 'CUARTO':
				return 'Cuarto';
			case 'QUINTO':
				return 'Quinto';
			case 'SEXTO':
				return 'Sexto';
			case 'knowledge':
				return 'Recordar';
			case 'undertanding':
				return 'Comprender';
			case 'application':
				return 'Aplicar';
			case 'analysis':
				return 'Analizar';
			case 'evaluation':
				return 'Evaluar';
			case 'creation':
				return 'Crear';
			case 'Comunicativa':
				return level === 'SECUNDARIA' ? 'Comunicativa' : 'Comunicativa';
			case 'Pensamiento Logico':
				return level === 'SECUNDARIA'
					? 'Pensamiento Lógico, Creativo y Crítico'
					: 'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Científica y Tecnológica';
			case 'Resolucion De Problemas':
				return 'Resolución de Problemas';
			case 'Ciencia Y Tecnologia':
				return 'Científica y Tecnológica';
			case 'Etica Y Ciudadana':
				return level === 'SECUNDARIA'
					? 'Ética y Ciudadana'
					: 'Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud';
			case 'Desarrollo Personal Y Espiritual':
				return 'Desarrollo Personal y Espiritual';
			case 'Ambiental Y De La Salud':
				return 'Ambiental y de la Salud';
			default:
				return value;
		}
	}
}
