import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { AuthService } from './services/auth.service';
import { UserSettings } from './interfaces/user-settings';

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
        this.user = user;
        this.loading = false;
      },
      error: err => {
        this.redirectToLogin();
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
