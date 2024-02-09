import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { map, tap } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './state/auth.reducer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  auth = inject(Auth);
  user$ = authState(this.auth).pipe(map(user => {
    this.loading = false;
    return !!user;
  }));
  loading = true;

  ngOnInit() {
  }
}
