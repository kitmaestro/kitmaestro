import { Injectable } from '@angular/core';
import { GradePeriod } from '../interfaces/grade-period';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor() { }

  generatePeriod(config: { average?: number, min: number, max: number, elements: number, minGrade: number }): GradePeriod[] {
    const { average, min, max, elements, minGrade } = config;

    const range = max - min;

    const grades: { p: number, rp: number }[] = [];

    for (let i = 0; i < elements; i++) {
      const p = Math.round((Math.random() * range) + min);
      const rp = p < minGrade ? Math.round((Math.random() * range) + p) : 0;
      grades.push({ p, rp });
    }

    if (average) {
      let currentAverage: number = Math.round(grades.reduce((acc, curr) => acc + (curr.rp > 0 ? curr.rp : curr.p), 0) / elements);
      let adjustment: number = average - currentAverage;
      let adjustedNumbers: GradePeriod[] = grades.map(num => num.rp > 0 ? ({ rp: num.rp + adjustment, p: num.p }) : ({ p: num.p + adjustment, rp: 0 }));
  
      while (true) {
        currentAverage = Math.round(adjustedNumbers.reduce((acc, curr) => acc + (curr.rp > 0 ? curr.rp : curr.p), 0) / elements);
        if (currentAverage == average) {
          break;
        }
        adjustment = average - currentAverage;
        adjustedNumbers = grades.map(num => num.rp > 0 ? ({ rp: num.rp + adjustment, p: num.p }) : ({ p: num.p + adjustment, rp: 0 }));;
      }
      return adjustedNumbers;
    }

    return grades;
  }
}
