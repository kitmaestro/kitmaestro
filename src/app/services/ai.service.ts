import { inject, Injectable } from '@angular/core';
import { GradePeriod } from '../interfaces/grade-period';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'ai/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    })
  };

  askClaude(text: string, max_tokens: number = 1024) {
    return this.http.post(this.apiBaseUrl + 'claude', { text, max_tokens }, this.config);
  }

  async readFetch(url: string, config: any): Promise<any> {
    return (await fetch(url, config)).json();
  }

  geminiAi(question: string) {
    return this.http.post<{ response: string }>(this.apiBaseUrl + 'gemini', { prompt: question }, this.config);
  }

  askFlanT5(question: string) {
    return this.http.post<{ response: string }>(this.apiBaseUrl + 'flanT5', { prompt: question }, this.config);
  }

  askChatbox(question: string) {
    return this.http.post<{ response: string }>(this.apiBaseUrl + 'chatbox', { prompt: question }, this.config);
  }

  askPhi(input: string) {
    return this.http.post<{ response: string }>(this.apiBaseUrl + 'phi2', { prompt: input }, this.config);
  }

  generateImage(inputs: string): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiBaseUrl + 'image', { prompt: inputs }, this.config);
  }

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
