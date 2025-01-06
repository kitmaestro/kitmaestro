import { Component, EventEmitter, inject, Output } from '@angular/core';
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
import { QuoteDialogComponent } from '../ui/quote-dialog/quote-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { UserSubscriptionService } from '../services/user-subscription.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
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
  private authService = inject(AuthService);
  private userSubscriptionService = inject(UserSubscriptionService);
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);
  private sb = inject(MatSnackBar);
  private router = inject(Router);

  public isPrintView = window.location.href.includes('print');

  @Output() signOut: EventEmitter<boolean> = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  userSettings$ = this.authService.profile();
  subscription$ = this.userSubscriptionService.checkSubscription().pipe(map(sub => sub.status == 'active' && sub.subscriptionType.toLowerCase().includes('premium') && +(new Date(sub.endDate)) > +(new Date())));

  showNames = true;

  sidebarLinks: { label: string, route: string, icon: string, activeIf: string }[] = [
    { activeIf: 'none', route: "/", icon: "dashboard", label: "Inicio", },
    { activeIf: 'unit-plans', route: "/unit-plans/list", icon: "menu_book", label: "Unidades de Aprendizaje", },
    { activeIf: 'class-plans', route: "/class-plans/list", icon: "library_books", label: "Planes Diarios", },
    { activeIf: 'assessments', route: "/assessments/list", icon: "history_edu", label: "Instrumentos", },
    { activeIf: 'activities', route: "/activities", icon: "school", label: "Actividades", },
    { activeIf: 'grading-systems', route: "/grading-systems/list", icon: "scoreboard", label: "Sistemas de Calificacion", },
    { activeIf: 'sections', route: "/sections", icon: "class", label: "Secciones", },
    { activeIf: 'schedules', route: "/schedules", icon: "calendar_month", label: "Horario", },
    { activeIf: 'log-registry', route: "/log-registry-generator", icon: "edit_note", label: "Registro Anecdótico", },
    { activeIf: 'todos', route: "/todos", icon: "list", label: "Pendientes", },
    // { route: "/settings", icon: "settings", label: "Ajustes", },
    { activeIf: 'my-resources', route: "/my-resources", icon: "analytics", label: "Mis Recursos", },
    { activeIf: 'profile', route: "/profile", icon: "person_circle", label: "Perfil", },
  ]

  toggleNames() {
    this.showNames = !this.showNames;
  }

  openQuoteDialog() {
    this.dialog.open(QuoteDialogComponent);
  }

  logout() {
    this.authService.logout().subscribe(result => {
      if (result.message == "Logout successful") {
        this.signOut.emit(true);
        this.router.navigate(['/auth', 'login']).then(() => {
          this.sb.open('Se ha cerrado la sesion, nos vemos pronto!', 'Ok', { duration: 2500 });
        });
      }
    });
  }

  get activatedRoute() {
    return location.pathname;
  }
}
