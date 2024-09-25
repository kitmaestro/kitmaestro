import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  private store = inject(Store);
  loading$ = this.store.select(store => store.auth).pipe(map(auth => auth.loading));
}
