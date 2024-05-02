import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  http = inject(HttpClient);

  constructor() { }
}
