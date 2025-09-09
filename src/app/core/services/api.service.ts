import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	#http = inject(HttpClient);
	#baseUrl = environment.apiUrl.slice(0, -1); // TODO: remove the slice and the slash on apiUrl

	#createHeaders(customHeaders?: { [header: string]: string }): HttpHeaders {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		});
		if (customHeaders) {
			for (const header in customHeaders) {
				if (customHeaders.hasOwnProperty(header)) {
					headers = headers.set(header, customHeaders[header]);
				}
			}
		}
		return headers;
	}

	get<T>(
		endpoint: string,
		paramsObj?: { [param: string]: string | string[] },
		customHeaders?: { [header: string]: string },
		retryCount: number = 1,
	): Observable<T> {
		const url = `${this.#baseUrl}/${endpoint}`;
		const headers = this.#createHeaders(customHeaders);
		const params = new HttpParams({ fromObject: paramsObj || {} });
		return this.#http
			.get<T>(url, { headers, params, withCredentials: true })
			.pipe(retry(retryCount), catchError(this.handleError));
	}

	post<T>(
		endpoint: string,
		body: any,
		customHeaders?: { [header: string]: string },
		retryCount: number = 1,
	): Observable<T> {
		const url = `${this.#baseUrl}/${endpoint}`;
		const headers = this.#createHeaders(customHeaders);
		return this.#http
			.post<T>(url, body, { headers, withCredentials: true })
			.pipe(retry(retryCount), catchError(this.handleError));
	}

	put<T>(
		endpoint: string,
		body: any,
		customHeaders?: { [header: string]: string },
		retryCount: number = 1,
	): Observable<T> {
		const url = `${this.#baseUrl}/${endpoint}`;
		const headers = this.#createHeaders(customHeaders);
		return this.#http
			.patch<T>(url, body, { headers, withCredentials: true })
			.pipe(retry(retryCount), catchError(this.handleError));
	}

	patch<T>(
		endpoint: string,
		body: any,
		customHeaders?: { [header: string]: string },
		retryCount: number = 1,
	): Observable<T> {
		const url = `${this.#baseUrl}/${endpoint}`;
		const headers = this.#createHeaders(customHeaders);
		return this.#http
			.patch<T>(url, body, { headers, withCredentials: true })
			.pipe(retry(retryCount), catchError(this.handleError));
	}

	delete<T>(
		endpoint: string,
		customHeaders?: { [header: string]: string },
		retryCount: number = 1,
	): Observable<T> {
		const url = `${this.#baseUrl}/${endpoint}`;
		const headers = this.#createHeaders(customHeaders);
		return this.#http
			.delete<T>(url, { headers, withCredentials: true })
			.pipe(retry(retryCount), catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		let errorMsg = '';
		if (error.error instanceof ErrorEvent) {
			errorMsg = `Error: ${error.error.message}`;
		} else {
			errorMsg = `Código: ${error.status}, Mensaje: ${error.message}`;
		}
		console.error(errorMsg);
		return throwError(() => new Error(errorMsg));
	}
}
