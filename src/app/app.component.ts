import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { StoreRootModule } from '@ngrx/store';
import { map } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavigationComponent,
    AsyncPipe,
    StoreRootModule,
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
  }
}
