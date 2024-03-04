import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  auth = inject(Auth);
  router = inject(Router);

  user$ = authState(this.auth).pipe(map(user => {
    this.loading = false;
    return !!user;
  }));
  loading = true;
  isAnAuthView = false;

  ngOnInit() {
    this.router.events.subscribe((u: any) => this.isAnAuthView = u.url ? u.url.startsWith('/auth/reset') : false)
    this.router.events.subscribe(console.log)
  }
}
