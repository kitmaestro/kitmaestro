import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pretify',
  standalone: true
})
export class PretifyPipe implements PipeTransform {

  	transform(value: string): string {
		switch (value) {
			case 'LENGUA_ESPANOLA': return 'Lengua Española';
			case 'MATEMATICA': return 'Matemática';
			case 'CIENCIAS_SOCIALES': return 'Ciencias Sociales';
			case 'CIENCIAS_NATURALES': return 'Ciencias de la Naturaleza';
			case 'INGLES': return 'Inglés';
			case 'FRANCES': return 'Francés';
			case 'FORMACION_HUMANA': return 'Formación Integral Humana y Religiosa';
			case 'EDUCACION_FISICA': return 'Educación Física';
			case 'EDUCACION_ARTISTICA': return 'Educación Artística';
			case 'TALLERES_OPTATIVOS': return 'Talleres Optativos';
			default: return value;
		}
  	}

}
