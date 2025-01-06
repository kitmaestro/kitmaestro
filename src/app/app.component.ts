import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { AuthService } from './services/auth.service';
import { UserSettings } from './interfaces/user-settings';
import { collectionData, collection, Firestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-root',
    imports: [
        RouterModule,
        CommonModule,
        NavigationComponent,
        LoadingComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private user$ = this.authService.profile();

  user: UserSettings | null = null;

  loading = true;

  redirectToLogin() {
    const next = location.pathname;
    this.loading = false;
    if (!next.includes('auth')) {
      this.router.navigate(['/auth', 'login'], { queryParams: { next } })
    }
  }

  loadUser() {
    this.user$.subscribe({
      next: (user) => {
        if (!user) {
          return this.redirectToLogin();
        }
        // this.userSubscription.subscribe('Premium', 'membership', (1000 * 60 * 60 * 24 * 365), 0, user._id).subscribe(console.log)
        this.user = user;
        this.loading = false;
      },
      error: err => {
        this.redirectToLogin();
        console.log(err.message)
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  reset() {
    this.loading = true;
    this.user = null;
    setTimeout(() => {
      this.loading = false;
    }, 1300);
  }

  ngOnInit() {
    this.loadUser();
    // this.aiService.generateImage('Can you design a binder separator background image in a letter size (8.5 by 11 inches) portrait position with a forest theme?').subscribe({
    //   next: res => {
    //     const img = document.createElement('img')
    //     img.src = res.result;
    //     document.body.appendChild(img)
    //     console.log('done!')
    //   },
    //   error: err => {
    //     console.log(err.message)
    //   }
    // });
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => this.loadUser());
  }
}
