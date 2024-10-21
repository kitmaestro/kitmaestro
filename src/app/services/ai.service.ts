import { inject, Injectable, isDevMode } from '@angular/core';
import { GradePeriod } from '../interfaces/grade-period';
import { HfInference } from '@huggingface/inference';
import { pipeline } from '@xenova/transformers';
import { Observable, from } from 'rxjs';
import { GeminiResponse } from '../interfaces/gemini-response';
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

  private models = {
    textToImage: 'stabilityai/stable-diffusion-xl-base-1.0',
    text2TextGeneration: 'google/flan-t5-xxl',
    textGeneration: [
      // "bigcode/starcoder",
      // "meta-llama/Llama-2-7b-chat-hf",
      // "mistralai/Mistral-7B-v0.1",
      // "mistralai/Mixtral-8x7B-Instruct-v0.1",
      // "microsoft/phi-2"
      "gemma-7b"
    ],
  }
  private token = atob('aGZfZVZGUGl6aW5jb3VEbmZzRXFEQ05yaUVmZW9VZ2NITmNEdw==');
  private inference = new HfInference(this.token);

  constructor() {
  }

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

  askGemini(text: string, jsonResponse: boolean = false): Observable<GeminiResponse> {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + atob("QUl6YVN5QkpQQnlReGFjUHlfUThsTzk2NENjVUVUUUVNdzJ1Mzhj");
    const body = {
      contents: [
        {
          parts: [ { text } ]
        }
      ],
      generationConfig: jsonResponse ? {
        response_mime_type: 'application/json',
      } : undefined,
    };

    return from(
      this.readFetch(url, {
        method: "POST",
        body: JSON.stringify(body)
      })
    ) as Observable<GeminiResponse>;
  }

  async generateText(input: string, inference = false) {
    if (inference) {
      const args = {
        model: this.models.text2TextGeneration,
        inputs: input,
        parameters: {
          max_new_tokens: 350
        }
      };

      const options = { use_cache: false };
      return await this.inference.textGeneration(args, options)
    }
    const randomPick = Math.round(Math.random() * (this.models.textGeneration.length - 1));
    const pipe = await pipeline('text-generation', this.models.textGeneration[randomPick]);
    const response = await pipe(input);
    return response;
  }

  async askPhi(input: string) {
    const args = {
      model: 'microsoft/phi-2',
      inputs: input,
      parameters: {
        max_new_tokens: 350
      }
    };

    const options = { use_cache: false };
    return await this.inference.textGeneration(args, options)
  }

  async completeText(inputs: string) {
    const args = {
      model: "google/gemma-7b",
      inputs,
      parameters: {
        max_new_tokens: 350
      }
    };

    const options = { use_cache: false };
    return await this.inference.textGeneration(args, options)
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
