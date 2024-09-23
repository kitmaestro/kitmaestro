import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { UserSubscriptionService } from '../services/user-subscription.service';
import { QuoteDialogComponent } from '../ui/quote-dialog/quote-dialog.component';
import { Auth, signOut } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSettingsService } from '../services/user-settings.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule,
    AsyncPipe,
    RouterModule,
  ]
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private userSettingService = inject(UserSettingsService);
  private subscriptionService = inject(UserSubscriptionService);
  private dialog = inject(MatDialog);
  private auth = inject(Auth);
  private sb = inject(MatSnackBar);
  private router = inject(Router);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  userSettings$ = this.userSettingService.getSettings();
  subscription$ = this.subscriptionService.subscription$;

  sidebarLinks: { label: string, route: string, icon: string }[] = [
    { route: "/", icon: "dashboard", label: "Inicio", },
    { route: "/unit-plans/list", icon: "menu_book", label: "Unidades de Ap", },
    { route: "/class-plans/list", icon: "library_books", label: "Planes Diarios", },
    { route: "/assessments/list", icon: "history_edu", label: "Instrumentos", },
    { route: "/activities/list", icon: "school", label: "Actividades", },
    { route: "/sections", icon: "class", label: "Secciones", },
    { route: "/log-registry-generator", icon: "edit_note", label: "Registro Anecdótico", },
    { route: "/todos", icon: "list", label: "Pendientes", },
    { route: "/settings", icon: "settings", label: "Ajustes", },
    { route: "/profile", icon: "person_circle", label: "Perfil", },
    { route: "/my-resources", icon: "analytics", label: "Mis Recursos", },
  ]

  openQuoteDialog() {
    this.dialog.open(QuoteDialogComponent);
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/auth', 'login']).then(() => {
        this.sb.open('Has cerrado sesión. Hasta luego!', 'Ok', { duration: 4000 });
      });
    });
  }

  get activatedRoute() {
    return location.pathname;
  }
}
