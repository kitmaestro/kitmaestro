import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IsEmptyComponent } from '../../../shared/ui/is-empty.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceFormComponent } from '../../../shared/ui/resource-form.component';
import { DidacticResource } from '../../../core/interfaces/didactic-resource';
import { DidacticResourceService } from '../../../core/services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-resources-dashboard',
	templateUrl: './resources-dashboard.component.html',
	styleUrl: './resources-dashboard.component.scss',
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
