import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store, StoreRootModule } from '@ngrx/store';
import { lastValueFrom, map } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { load } from './state/actions/auth.actions';

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
  router = inject(Router);

  user$ = this.store.select(store => store.auth).pipe(map(auth => {
    setTimeout(() => {
      this.redirectIfNotUser()
    }, 2000);
    return auth.user;
  }));
  loading$ = this.store.select(store => store.auth);

  ngOnInit() {
    this.store.dispatch(load());
  }

  async redirectIfNotUser() {
    const user = await lastValueFrom(this.user$);
    const next = location.pathname;
    if (user)
      return

    this.router.navigate(['/auth', 'login'], { queryParamsHandling: 'preserve', queryParams: { next } })
  }
}
