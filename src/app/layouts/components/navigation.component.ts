import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { QuoteDialogComponent } from '../../shared/ui/quote-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';
import { UserSubscription } from '../../core/interfaces/user-subscription';

@Component({
	selector: 'app-navigation',
	template: `
		<mat-toolbar
			color="accent"
			style="z-index: 5000; position: sticky; top: 0"
		>
			<span routerLink="/" style="cursor: pointer"
				><img
					src="/assets/logo KitMaestro.png"
					style="width: 32px; max-width: 100%; display: block"
					alt=""
			/></span>
			<span class="spacer"></span>
			@if (userIsAdmin()) {
				<button
					mat-icon-button
					color="primary"
					[routerLink]="['/admin']"
					style="margin-right: 6px; color: #005cbb"
				>
					<mat-icon>settings</mat-icon>
				</button>
			}
			@if ((subscription$ | async) === false) {
				<button
					mat-icon-button
					color="primary"
					[routerLink]="['/buy']"
					style="margin-right: 6px; color: #005cbb"
				>
					<mat-icon
						matBadge="1"
						matBadgeOverlap="true"
						matBadgeColor="accent"
						>rocket</mat-icon
					>
				</button>
			}
			<button
				[matMenuTriggerFor]="menu"
				mat-icon-button
				color="primary"
				style="color: #005cbb"
			>
				<mat-icon>more_vert</mat-icon>
			</button>
			<mat-menu #menu>
				<button mat-menu-item (click)="openQuoteDialog()">
					<mat-icon>flash_on</mat-icon>
					<span>Mot&iacute;vame</span>
				</button>
				<button routerLink="/sections" mat-menu-item>
					<mat-icon>class</mat-icon>
					<span>Mis Secciones</span>
				</button>
				<button routerLink="/unit-plans/list" mat-menu-item>
					<mat-icon>schema</mat-icon>
					<span>Mis Unidades</span>
				</button>
				<button routerLink="/class-plans/list" mat-menu-item>
					<mat-icon>assignment</mat-icon>
					<span>Mis Planes Diarios</span>
				</button>
				<button routerLink="/rubrics" mat-menu-item>
					<mat-icon>analytics</mat-icon>
					<span>Mis Rubricas</span>
				</button>
				<button routerLink="/tutorials" mat-menu-item>
					<mat-icon>video_library</mat-icon>
					<span>Tutoriales</span>
				</button>
				@if (subscription()?.subscriptionType == 'Plan Premium') {
					<button routerLink="/referrals" mat-menu-item>
						<mat-icon>people_circle</mat-icon>
						<span>Mis Referidos</span>
					</button>
				}
				<button routerLink="/users/me" mat-menu-item>
					<mat-icon>person_circle</mat-icon>
					<span>Mi Perfil</span>
				</button>
				<button (click)="logout()" mat-menu-item>
					<mat-icon>logout</mat-icon>
					<span>Salir</span>
				</button>
			</mat-menu>
		</mat-toolbar>
	`,
	styles: `
		.sidenav-container {
			height: 100%;
		}
		.sidenav .mat-toolbar {
			background: inherit;
		}
		.mat-toolbar.mat-primary {
			position: sticky;
			top: 0;
			z-index: 1;
		}
		.spacer {
			flex: 1 1 auto;
		}
		.flex-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			flex-direction: column;
		}
		.tab-group {
			flex: 1 1 auto;
		}
		.example-container {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: #eee;
		}
		.sidenav {
			min-width: fit-content;
			width: 300px;
		}
	`,
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
	],
})
export class NavigationComponent {
	private authService = inject(AuthService);
	private userSubscriptionService = inject(UserSubscriptionService);
	private breakpointObserver = inject(BreakpointObserver);
	private dialog = inject(MatDialog);
	private sb = inject(MatSnackBar);
	private router = inject(Router);

	public isPrintView = window.location.href.includes('print');

	@Output() signOut = new EventEmitter<boolean>();

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(
			map((result) => result.matches),
			shareReplay(),
		);
	User$ = this.authService.profile();
	subscription = signal<UserSubscription | null>(null);
	subscription$ = this.userSubscriptionService.checkSubscription().pipe(
		map((sub) => {
			if (sub.subscriptionType.toLowerCase() == 'free') {
				return false;
			}
			return (
				sub.status == 'active' && +new Date(sub.endDate) > +new Date()
			);
		}),
	);

	showNames = true;

	userIsAdmin = signal<boolean>(false);

	ngOnInit() {
		this.User$
			.pipe(map((user) => ['orgalay.dev@gmail.com'].includes(user.email)))
			.subscribe((res) => this.userIsAdmin.set(res));
		this.userSubscriptionService.checkSubscription().subscribe((sub) => {
			this.subscription.set(sub);
		});
	}

	toggleNames() {
		this.showNames = !this.showNames;
	}

	openQuoteDialog() {
		this.dialog.open(QuoteDialogComponent);
	}

	logout() {
		this.authService.logout().subscribe((result) => {
			if (result.message === 'Logout successful') {
				this.signOut.emit(true);
				this.router.navigate(['/auth', 'login']).then(() => {
					this.sb.open(
						'Se ha cerrado la sesion, nos vemos pronto!',
						'Ok',
						{ duration: 2500 },
					);
				});
			}
		});
	}

	get activatedRoute() {
		return location.pathname;
	}
}
