import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private http = inject(HttpClient);
  private apiUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/';

  convert(origin: string, target: string): Observable<number> {
    return this.http.get<Record<string, Record<string, number>>>(this.apiUrl + origin + '.json').pipe(map(res => res[origin][target]));
  }
}
