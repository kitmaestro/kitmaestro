import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Rubric } from '../interfaces/rubric';
import { AiService } from './ai.service';

@Injectable({
  providedIn: 'root'
})
export class RubricService {

  constructor(
    private aiService: AiService,
  ) { }

  generateRubric(data: any): Observable<Rubric> {
    const { title,
      minScore,
      maxScore,
      level,
      grade,
      section,
      subject,
      content,
      activity,
      scored,
      rubricType,
      achievementIndicators,
      competence,
      levels
    } = data;
    const text = `Necesito que me construyas en contenido de una rubrica ${rubricType} para evaluar el contenido de "${content}" de ${subject} de ${grade} grado de educación ${level}.
La rubrica sera aplicada tras esta actividad/evidencia: ${activity}.${scored ? ' La rubrica tendra un valor de ' + minScore + ' a ' + maxScore + ' puntos.' : ''}
Los criterios a evaluar deben estar basados en estos indicadores de logro:
- ${achievementIndicators.join('\n- ')}
Cada criterio tendra ${levels.length} niveles de desempeño: ${levels.map((el: string, i: number) => i + ') ' + el).join(', ')}.
Tu respuesta debe ser un json valido con esta interfaz:
{${title ? '' : '\n\ttitle: string;'}
  criteria: { // un objeto 'criteria' por cada indicador/criterio a evaluar
    indicator: string, // indicador a evaluar
    maxScore: number, // maxima calificacion para este indicador
    criterion: { // array de niveles de desempeño del estudiante acorde a los niveles proporcionados
      name: string, // criterio que debe cumplir (descripcion, osea que si el indicador es 'Lee y comprende el cuento', un criterio seria 'Lee el cuento deficientemente', otro seria 'Lee el cuento pero no comprende su contenido' y otro seria 'Lee el cuento de manera fluida e interpreta su contenido')
      score: number, // calificacion a asignar
    }[]
  }[];
}`;
    return this.aiService.askGemini(text, true).pipe(
      map(response => {
        const obj = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n')) as { title?: string; criteria: { indicator: string, maxScore: number, criterion: { name: string, score: number, }[] }[] };
        const rubric: Rubric = {
          criteria: obj.criteria,
          title: obj.title ? obj.title : title,
          rubricType,
          section,
          competence,
          achievementIndicators,
          activity,
          progressLevels: levels
        }
        return rubric;
      })
    );
  }
}
