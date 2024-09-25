import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { load } from '../../state/actions/auth.actions';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [RouterModule, MatCardModule],
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss'
})
export class AuthContainerComponent {
  private store = inject(Store);
  private router = inject(Router);
  user = this.store.select(store => store.auth).pipe(map(auth => auth.user));

  constructor() {
    this.store.dispatch(load());
    this.user.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    })
  }
}
