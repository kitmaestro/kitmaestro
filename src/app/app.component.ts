import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { AuthService } from './services/auth.service';
import { UserSettings } from './interfaces/user-settings';
// import { UserSubscriptionService } from './services/user-subscription.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavigationComponent,
    AsyncPipe,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private authService = inject(AuthService);
  // private userSubscription = inject(UserSubscriptionService);
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
    // const sus = (collectionData(collection(this.firestore, 'competence')) as Observable<CompetenceEntry[]>).subscribe(competence => {
    //   this.comp = competence;
    //   sus.unsubscribe();
    //   this.upload();
    //   const blob = new Blob([JSON.stringify(competence, null, 4)], { type: 'application/json' });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'competence.json';
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // })
  }
}
