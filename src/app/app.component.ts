import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store, StoreRootModule } from '@ngrx/store';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { load } from './state/actions/auth.actions';
import { loadingUserSelector, userSelector } from './state/selectors/auth.selector';
import { collection, collectionData, deleteDoc, doc, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavigationComponent,
    AsyncPipe,
    StoreRootModule,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private store = inject(Store);
  private router = inject(Router);

  user$ = this.store.select(userSelector).pipe(tap(() => {
    setTimeout(() => {
      this.redirectIfNotUser()
    }, 2000);
  }));
  loading$ = this.store.select(loadingUserSelector);

  ngOnInit() {
    this.store.dispatch(load());
    // this.compService.findAll().subscribe(competence => {
      // const blob = new Blob([JSON.stringify(competence, null, 4)], { type: 'application/json' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'competence.json';
      // a.click();
      // window.URL.revokeObjectURL(url);
    // })
  }

  async redirectIfNotUser() {
    const user = await lastValueFrom(this.user$);
    const next = location.pathname;
    if (user)
      return

    this.router.navigate(['/auth', 'login'], { queryParamsHandling: 'preserve', queryParams: { next } })
  }
}
