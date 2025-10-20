import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IsEmptyComponent } from '../../../shared/ui/is-empty.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceFormComponent } from '../../../shared/ui/resource-form.component';
import { DidacticResource } from '../../../core/models';
import { DidacticResourceService } from '../../../core/services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-resources-dashboard',
	template: `
		<div class="grid-container">
			<h2>Mis Recursos</h2>
			<mat-grid-list cols="2" rowHeight="350px">
				@for (resource of resources; track resource) {
					<mat-grid-tile [colspan]="1" [rowspan]="1">
						<mat-card class="dashboard-card">
							<mat-card-header>
								<mat-card-title>
									{{ resource.title }}
									<button
										mat-icon-button
										class="more-button"
										[matMenuTriggerFor]="menu"
										aria-label="Toggle menu"
									>
										<mat-icon>more_vert</mat-icon>
									</button>
									<mat-menu
										#menu="matMenu"
										xPosition="before"
									>
										<button mat-menu-item>Expand</button>
										<button mat-menu-item>Remove</button>
									</mat-menu>
								</mat-card-title>
							</mat-card-header>
							<mat-card-content class="dashboard-card-content">
								<div>Card Content Here</div>
							</mat-card-content>
						</mat-card>
					</mat-grid-tile>
				} @empty {
					<mat-grid-tile [colspan]="2">
						<app-is-empty
							class="dashboard-card"
							(onCreateRequest)="createResource()"
						></app-is-empty>
					</mat-grid-tile>
				}
			</mat-grid-list>
		</div>
	`,
	styles: `
		.dashboard-card {
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
		}

		.more-button {
			position: absolute;
			top: 5px;
			right: 10px;
		}

		.dashboard-card-content {
			text-align: center;
		}
	`,
	imports: [
		MatGridListModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatSnackBarModule,
		IsEmptyComponent,
	],
})
export class ResourcesDashboardComponent implements OnInit {
	private dialog = inject(MatDialog);
	private resourceService = inject(DidacticResourceService);
	private sb = inject(MatSnackBar);
	public resources: DidacticResource[] = [];

	ngOnInit() {
		this.resourceService.findMyResources().subscribe({
			next: (resources) => {
				if (resources.length) this.resources = resources;
			},
			error: (err) => {
				this.sb.open('Error al cargar tus recursos', 'Ok', {
					duration: 2500,
				});
			},
		});
	}

	createResource() {
		this.dialog.open(ResourceFormComponent);
	}
}
